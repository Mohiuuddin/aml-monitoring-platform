import prisma from "@/lib/prisma";

const page_size = 10;

export async function getAllAccounts(page: number = 1) {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * page_size;

  const [accounts, totalAccounts] = await Promise.all([
    prisma.bankAccount.findMany({
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

    prisma.bankAccount.count(),
  ]);

  const totalPages = Math.ceil(totalAccounts / page_size);

  return {
    accounts,
    totalAccounts,
    totalPages,
    currentPage,
  };
}
