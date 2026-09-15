import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    totalCustomers,
    totalAccounts,
    totalTransactions,
    totalAlerts,
    openAlerts,
    investigatingAlerts,
    escalatedAlerts,
    highRiskAlerts,
    criticalAlerts,
  ] = await Promise.all([
    prisma.customer.count(),

    prisma.bankAccount.count(),

    prisma.transaction.count(),

    prisma.alert.count(),

    prisma.alert.count({
      where: {
        status: "OPEN",
      },
    }),

    prisma.alert.count({
      where: {
        status: "INVESTIGATING",
      },
    }),

    prisma.alert.count({
      where: {
        status: "ESCALATED",
      },
    }),

    prisma.alert.count({
      where: {
        riskLevel: "HIGH",
      },
    }),

    prisma.alert.count({
      where: {
        riskLevel: "CRITICAL",
      },
    }),
  ]);

  return {
    totalCustomers,
    totalAccounts,
    totalTransactions,
    totalAlerts,
    openAlerts,
    investigatingAlerts,
    escalatedAlerts,
    highRiskAlerts,
    criticalAlerts,
  };
}
