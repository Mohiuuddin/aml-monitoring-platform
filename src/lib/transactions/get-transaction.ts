import prisma from "@/lib/prisma";

export async function getTransaction(id: string) {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      amount: true,
      currency: true,
      type: true,
      direction: true,
      counterparty: true,
      counterpartyCountry: true,
      description: true,
      transactionAt: true,
      createdAt: true,

      customer: {
        select: {
          id: true,
          name: true,
          customerNumber: true,
          email: true,
          phone: true,
          country: true,
          riskLevel: true,
          status: true,
        },
      },

      account: {
        select: {
          id: true,
          accountNo: true,
          currency: true,
          balance: true,
          status: true,
        },
      },
    },
  });

  if (!transaction) {
    return null;
  }

  return {
    ...transaction,
    amount: transaction.amount.toString(),
    account: {
      ...transaction.account,
      balance: transaction.account.balance.toString(),
    },
    transactionAt: transaction.transactionAt.toISOString(),
    createdAt: transaction.createdAt.toISOString(),
  };
}
