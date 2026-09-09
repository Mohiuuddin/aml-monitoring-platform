import prisma from "@/lib/prisma";

interface GetAlertsParams {
  page?: number;
  pageSize?: number;
}

export async function getAlerts({
  page = 1,
  pageSize = 10,
}: GetAlertsParams = {}) {
  const skip = (page - 1) * pageSize;

  const [alerts, total] = await Promise.all([
    prisma.alert.findMany({
      select: {
        id: true,
        riskScore: true,
        riskLevel: true,
        status: true,
        title: true,
        createdAt: true,

        customer: {
          select: {
            id: true,
            customerNumber: true,
            name: true,
          },
        },

        transaction: {
          select: {
            id: true,
            amount: true,
            currency: true,
            type: true,
            direction: true,
            transactionAt: true,
          },
        },

        triggeredRules: {
          select: {
            rule: {
              select: {
                id: true,
                name: true,
                code: true,
                riskWeight: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take: pageSize,
    }),

    prisma.alert.count(),
  ]);

  return {
    alerts: alerts.map((alert) => ({
      ...alert,

      riskScore: Number(alert.riskScore),

      createdAt: alert.createdAt.toISOString(),

      transaction: alert.transaction
        ? {
            ...alert.transaction,
            amount: alert.transaction.amount.toString(),
            transactionAt: alert.transaction.transactionAt.toISOString(),
          }
        : null,
    })),

    total,

    page,

    pageSize,

    totalPages: Math.ceil(total / pageSize),
  };
}
