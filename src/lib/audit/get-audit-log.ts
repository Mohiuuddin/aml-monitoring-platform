import prisma from "@/lib/prisma";

export async function getAuditLog(id: string) {
  const auditLog = await prisma.auditLog.findUnique({
    where: {
      id,
    },
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
  });

  if (!auditLog) {
    return null;
  }

  return {
    ...auditLog,
    createdAt: auditLog.createdAt.toISOString(),
  };
}
