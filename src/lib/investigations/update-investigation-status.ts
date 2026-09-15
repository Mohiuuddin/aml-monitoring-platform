"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createAuditLog } from "@/lib/audit/create-audit-log";

type InvestigationStatus = "OPEN" | "IN_PROGRESS" | "ESCALATED" | "RESOLVED";

interface UpdateInvestigationStatusInput {
  investigationId: string;
  status: InvestigationStatus;
}

export async function updateInvestigationStatus({
  investigationId,
  status,
}: UpdateInvestigationStatusInput) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  if (user.role !== "ADMIN" && user.role !== "ANALYST") {
    throw new Error("Unauthorized.");
  }

  // if (status === "RESOLVED" && user.role !== "ADMIN") {
  //   throw new Error("Only an admin can resolve an investigation.");
  // }

  const investigation = await prisma.investigation.findUnique({
    where: {
      id: investigationId,
    },
    select: {
      id: true,
      alertId: true,
      status: true,
    },
  });

  if (!investigation) {
    throw new Error("Investigation not found.");
  }

  if (investigation.status === "RESOLVED") {
    throw new Error("Resolved investigations cannot be updated.");
  }

  const updatedInvestigation = await prisma.$transaction(async (tx) => {
    const updated = await tx.investigation.update({
      where: {
        id: investigationId,
      },
      data: {
        status,
        closedAt: status === "RESOLVED" ? new Date() : null,
      },
    });

    if (status === "IN_PROGRESS") {
      await tx.alert.update({
        where: {
          id: investigation.alertId,
        },
        data: {
          status: "INVESTIGATING",
        },
      });
    }

    if (status === "ESCALATED") {
      await tx.alert.update({
        where: {
          id: investigation.alertId,
        },
        data: {
          status: "ESCALATED",
        },
      });
    }

    if (status === "RESOLVED") {
      await tx.alert.update({
        where: {
          id: investigation.alertId,
        },
        data: {
          status: "CLOSED",
        },
      });
    }

    return updated;
  });

  await createAuditLog({
    userId: user.id,
    action:
      status === "ESCALATED"
        ? "ALERT_ESCALATED"
        : status === "RESOLVED"
          ? "ALERT_CLOSED"
          : "STATUS_CHANGE",
    entity: "Investigation",
    entityId: investigation.id,
    metadata: {
      previousStatus: investigation.status,
      newStatus: status,
      alertId: investigation.alertId,
    },
  });

  revalidatePath(`/investigations/${investigationId}`);
  revalidatePath(`/alerts/${investigation.alertId}`);
  revalidatePath("/investigations");
  revalidatePath("/alerts");

  return {
    success: true,
    investigation: updatedInvestigation,
  };
}
