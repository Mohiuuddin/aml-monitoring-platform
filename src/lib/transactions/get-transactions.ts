import prisma from "@/lib/prisma";

interface GetTransactionsParams {
  page?: number;
  pageSize?: number;
  customer?: string;
  account?: string;
  type?: string;
  direction?: "CREDIT" | "DEBIT" | "";
  fromDate?: string;
  toDate?: string;
}

export async function getTransactions({
  page = 1,
  pageSize = 10,
  customer = "",
  account = "",
  type = "",
  direction = "",
  fromDate = "",
  toDate = "",
}: GetTransactionsParams) {
  const skip = (page - 1) * pageSize;

  const where = {
    ...(customer && {
      customer: {
        name: {
          contains: customer,
          mode: "insensitive" as const,
        },
      },
    }),

    ...(account && {
      account: {
        accountNo: {
          contains: account,
          mode: "insensitive" as const,
        },
      },
    }),

    ...(type && {
      type: type as
        | "CASH_DEPOSIT"
        | "CASH_WITHDRAWAL"
        | "TRANSFER"
        | "CARD_PAYMENT"
        | "INTERNATIONAL_TRANSFER",
    }),

    ...(direction && {
      direction,
    }),

    ...((fromDate || toDate) && {
      transactionAt: {
        ...(fromDate && {
          gte: new Date(`${fromDate}T00:00:00`),
        }),

        ...(toDate && {
          lte: new Date(`${toDate}T23:59:59.999`),
        }),
      },
    }),
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      select: {
        id: true,
        amount: true,
        currency: true,
        type: true,
        direction: true,
        counterparty: true,
        transactionAt: true,

        customer: {
          select: {
            id: true,
            name: true,
            customerNumber: true,
          },
        },

        account: {
          select: {
            id: true,
            accountNo: true,
          },
        },
      },
      orderBy: {
        transactionAt: "desc",
      },
      skip,
      take: pageSize,
    }),

    prisma.transaction.count({
      where,
    }),
  ]);

  return {
    transactions: transactions.map((transaction) => ({
      ...transaction,
      amount: transaction.amount.toString(),
      transactionAt: transaction.transactionAt.toISOString(),
    })),

    total,

    page,

    pageSize,

    totalPages: Math.ceil(total / pageSize),
  };
}
