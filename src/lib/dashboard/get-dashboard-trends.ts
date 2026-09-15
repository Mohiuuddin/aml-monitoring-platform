import prisma from "@/lib/prisma";

export async function getDashboardTrends() {
  const now = new Date();

  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const transactions = await prisma.transaction.findMany({
    where: {
      transactionAt: {
        gte: startDate,
      },
    },
    select: {
      transactionAt: true,
    },
    orderBy: {
      transactionAt: "asc",
    },
  });

  const alerts = await prisma.alert.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      date,
      transactions: 0,
      alerts: 0,
    };
  });

  for (const transaction of transactions) {
    const transactionDate = new Date(transaction.transactionAt);

    const day = days.find(
      (item) =>
        item.date.getFullYear() === transactionDate.getFullYear() &&
        item.date.getMonth() === transactionDate.getMonth() &&
        item.date.getDate() === transactionDate.getDate(),
    );

    if (day) {
      day.transactions += 1;
    }
  }

  for (const alert of alerts) {
    const alertDate = new Date(alert.createdAt);

    const day = days.find(
      (item) =>
        item.date.getFullYear() === alertDate.getFullYear() &&
        item.date.getMonth() === alertDate.getMonth() &&
        item.date.getDate() === alertDate.getDate(),
    );

    if (day) {
      day.alerts += 1;
    }
  }

  return days.map((day) => ({
    date: day.date.toISOString(),
    transactions: day.transactions,
    alerts: day.alerts,
  }));
}
