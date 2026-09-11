"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

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

  revalidatePath(`/investigations/${investigationId}`);
  revalidatePath(`/alerts/${investigation.alertId}`);
  revalidatePath("/investigations");
  revalidatePath("/alerts");

  return {
    success: true,
    investigation: updatedInvestigation,
  };
}
