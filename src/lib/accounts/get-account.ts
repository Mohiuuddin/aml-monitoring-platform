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

      customer: {
        select: {
          id: true,
          customerNumber: true,
          name: true,
        },
      },

      transactions: {
        select: {
          id: true,
          amount: true,
          currency: true,
          type: true,
          direction: true,
          counterparty: true,
          transactionAt: true,
        },
        orderBy: {
          transactionAt: "desc",
        },
        take: 5,
      },
    },
  });
}

// import prisma from "@/lib/prisma";

// export async function getAccount(id: string) {
//   return prisma.bankAccount.findUnique({
//     where: {
//       id,
//     },
//     select: {
//       id: true,
//       accountNo: true,
//       currency: true,
//       balance: true,
//       status: true,
//       openedAt: true,
//     },
//   });
// }
