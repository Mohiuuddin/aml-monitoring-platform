import prisma from "@/lib/prisma";

export async function getRecentAlerts() {
  const alerts = await prisma.alert.findMany({
    select: {
      id: true,
      title: true,
      riskScore: true,
      riskLevel: true,
      status: true,
      createdAt: true,
      customer: {
        select: {
          id: true,
          name: true,
          customerNumber: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return alerts.map((alert) => ({
    ...alert,
    createdAt: alert.createdAt.toISOString(),
  }));
}
