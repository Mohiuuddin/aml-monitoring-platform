import prisma from "@/lib/prisma";

export async function getAccount(id: string) {
  return prisma.bankAccount.findUnique({
    where: {
      id,
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
