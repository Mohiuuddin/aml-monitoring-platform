import prisma from "@/lib/prisma";

export async function getActiveAccounts() {
  return prisma.bankAccount.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      accountNo: true,
      currency: true,
      customer: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      accountNo: "asc",
    },
  });
}
