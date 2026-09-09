import prisma from "@/lib/prisma";

export async function getAlert(id: string) {
  return prisma.alert.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      riskScore: true,
      riskLevel: true,
      status: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,

      customer: {
        select: {
          id: true,
          customerNumber: true,
          name: true,
          email: true,
          phone: true,
          country: true,
          riskLevel: true,
          status: true,
        },
      },

      transaction: {
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

          account: {
            select: {
              id: true,
              accountNo: true,
              currency: true,
            },
          },
        },
      },

      triggeredRules: {
        select: {
          id: true,
          createdAt: true,

          rule: {
            select: {
              id: true,
              name: true,
              description: true,
              code: true,
              riskWeight: true,
              isActive: true,
            },
          },
        },
      },
    },
  });
}
