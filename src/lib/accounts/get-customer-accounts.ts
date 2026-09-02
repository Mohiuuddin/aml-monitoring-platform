import prisma from "@/lib/prisma";

export async function getCustomerAccounts(customerId: string) {
  return prisma.bankAccount.findMany({
    where: {
      customerId,
    },
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
    },
  });
}
