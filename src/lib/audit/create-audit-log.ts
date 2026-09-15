import type { AuditAction, Prisma } from "@/generated/prisma/client";

import prisma from "@/lib/prisma";

interface CreateAuditLogInput {
  userId: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
}

export async function createAuditLog({
  userId,
  action,
  entity,
  entityId,
  metadata,
}: CreateAuditLogInput) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      metadata,
    },
  });
}
