import { getCurrentUser } from "@/lib/auth/get-current-user";
import prisma from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit/create-audit-log";

interface StartInvestigationInput {
  alertId: string;
}

export async function startInvestigation({ alertId }: StartInvestigationInput) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const alert = await prisma.alert.findUnique({
    where: {
      id: alertId,
    },
    select: {
      id: true,
      status: true,
      investigation: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!alert) {
    throw new Error("Alert not found");
  }

  if (alert.investigation) {
    throw new Error("Investigation already exists for this alert");
  }

  const investigation = await prisma.$transaction(async (tx) => {
    const newInvestigation = await tx.investigation.create({
      data: {
        alertId: alert.id,
        analystId: currentUser.id,
      },
    });

    await tx.alert.update({
      where: {
        id: alert.id,
      },
      data: {
        status: "INVESTIGATING",
      },
    });

    return newInvestigation;
  });

  await createAuditLog({
    userId: currentUser.id,
    action: "INVESTIGATION_STARTED",
    entity: "Investigation",
    entityId: investigation.id,
    metadata: {
      alertId: alert.id,
    },
  });

  return investigation;
}
