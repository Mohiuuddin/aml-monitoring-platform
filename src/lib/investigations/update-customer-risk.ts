"use server";

import { revalidatePath } from "next/cache";

import { createAuditLog } from "@/lib/audit/create-audit-log";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import prisma from "@/lib/prisma";

type CustomerRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface UpdateCustomerRiskInput {
  customerId: string;
  riskLevel: CustomerRiskLevel;
}

export async function updateCustomerRisk({
  customerId,
  riskLevel,
}: UpdateCustomerRiskInput) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  if (user.role !== "ADMIN" && user.role !== "ANALYST") {
    throw new Error("Unauthorized.");
  }

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    select: {
      id: true,
      riskLevel: true,
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  if (customer.riskLevel === riskLevel) {
    return {
      success: true,
      message: "Customer risk level is already set to this value.",
    };
  }

  await prisma.customer.update({
    where: {
      id: customerId,
    },
    data: {
      riskLevel,
    },
  });

  await createAuditLog({
    userId: user.id,
    action: "UPDATE",
    entity: "Customer",
    entityId: customer.id,
    metadata: {
      previousRiskLevel: customer.riskLevel,
      newRiskLevel: riskLevel,
    },
  });

  revalidatePath("/customers");
  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/investigations");

  return {
    success: true,
    message: "Customer risk level updated successfully.",
  };
}
