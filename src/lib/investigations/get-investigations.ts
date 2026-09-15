import prisma from "@/lib/prisma";

interface GetInvestigationsParams {
  page?: number;
  pageSize?: number;
  customer?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export async function getInvestigations({
  page = 1,
  pageSize = 10,
  customer = "",
  status = "",
  fromDate = "",
  toDate = "",
}: GetInvestigationsParams) {
  const skip = (page - 1) * pageSize;

  const where = {
    ...(customer && {
      alert: {
        customer: {
          name: {
            contains: customer,
            mode: "insensitive" as const,
          },
        },
      },
    }),

    ...(status && {
      status: status as "OPEN" | "IN_PROGRESS" | "ESCALATED" | "RESOLVED",
    }),

    ...((fromDate || toDate) && {
      startedAt: {
        ...(fromDate && {
          gte: new Date(`${fromDate}T00:00:00`),
        }),

        ...(toDate && {
          lte: new Date(`${toDate}T23:59:59.999`),
        }),
      },
    }),
  };

  const [investigations, total] = await Promise.all([
    prisma.investigation.findMany({
      where,
      select: {
        id: true,
        status: true,
        summary: true,
        startedAt: true,
        updatedAt: true,
        closedAt: true,

        analyst: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        alert: {
          select: {
            id: true,
            title: true,
            riskScore: true,
            riskLevel: true,

            customer: {
              select: {
                id: true,
                name: true,
                customerNumber: true,
              },
            },

            transaction: {
              select: {
                id: true,
                amount: true,
                currency: true,
                type: true,
                direction: true,
              },
            },
          },
        },
      },

      orderBy: {
        startedAt: "desc",
      },

      skip,
      take: pageSize,
    }),

    prisma.investigation.count({
      where,
    }),
  ]);

  return {
    investigations: investigations.map((investigation) => ({
      ...investigation,
      alert: {
        ...investigation.alert,
        transaction: investigation.alert.transaction
          ? {
              ...investigation.alert.transaction,
              amount: investigation.alert.transaction.amount.toString(),
            }
          : null,
      },
      startedAt: investigation.startedAt.toISOString(),
      updatedAt: investigation.updatedAt.toISOString(),
      closedAt: investigation.closedAt?.toISOString() ?? null,
    })),

    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
