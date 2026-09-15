import prisma from "@/lib/prisma";

interface GetAuditLogsParams {
  page?: number;
  pageSize?: number;
  action?: string;
  fromDate?: string;
  toDate?: string;
}

export async function getAuditLogs({
  page = 1,
  pageSize = 10,
  action = "",
  fromDate = "",
  toDate = "",
}: GetAuditLogsParams) {
  const skip = (page - 1) * pageSize;

  const where = {
    ...(action && {
      action: action as
        | "CREATE"
        | "UPDATE"
        | "DELETE"
        | "STATUS_CHANGE"
        | "INVESTIGATION_STARTED"
        | "INVESTIGATION_UPDATED"
        | "ALERT_ESCALATED"
        | "ALERT_CLOSED",
    }),

    ...((fromDate || toDate) && {
      createdAt: {
        ...(fromDate && {
          gte: new Date(`${fromDate}T00:00:00`),
        }),
        ...(toDate && {
          lte: new Date(`${toDate}T23:59:59.999`),
        }),
      },
    }),
  };

  const [auditLogs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        metadata: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    }),

    prisma.auditLog.count({
      where,
    }),
  ]);

  return {
    auditLogs: auditLogs.map((log) => ({
      ...log,
      createdAt: log.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
