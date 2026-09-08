import prisma from "@/lib/prisma";

export async function getActiveAccounts() {
  const accounts = await prisma.bankAccount.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      accountNo: true,
      currency: true,
      balance: true,
      customer: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { accountNo: "asc" },
  });

  return accounts.map((account) => ({
    ...account,
    balance: account.balance.toString(),
  }));
}
