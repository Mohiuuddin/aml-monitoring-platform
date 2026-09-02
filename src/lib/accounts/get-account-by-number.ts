import prisma from "@/lib/prisma";

export async function getAccountByNumber(accountNo: string) {
  return prisma.bankAccount.findUnique({
    where: {
      accountNo,
    },
    select: {
      id: true,
    },
  });
}
