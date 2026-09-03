import prisma from "@/lib/prisma";

const page_size = 10;

interface GetAllAccountsOptions {
  page?: number;
  customerName?: string;
  currency?: string;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED" | "CLOSED";
}

export async function getAllAccounts({
  page = 1,
  customerName,
  currency,
  status,
}: GetAllAccountsOptions) {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * page_size;

  const where = {
    ...(customerName && {
      customer: {
        name: {
          contains: customerName,
          mode: "insensitive" as const,
        },
      },
    }),
    ...(currency && { currency }),
    ...(status && { status }),
  };

  const [accounts, totalAccounts] = await Promise.all([
    prisma.bankAccount.findMany({
      where,
      orderBy: {
        openedAt: "desc",
      },
      select: {
        id: true,
        accountNo: true,
        currency: true,
        balance: true,
        status: true,
        openedAt: true,

        customer: {
          select: {
            id: true,
            customerNumber: true,
            name: true,
          },
        },
      },
      skip,
      take: page_size,
    }),

    prisma.bankAccount.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalAccounts / page_size);

  return {
    accounts,
    totalAccounts,
    totalPages,
    currentPage,
  };
}
