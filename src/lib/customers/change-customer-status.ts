"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

interface ChangeCustomerStatusInput {
  customerId: string;
  status: CustomerStatus;
}

export async function changeCustomerStatus({
  customerId,
  status,
}: ChangeCustomerStatusInput) {
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
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  if (status === "BLOCKED") {
    await prisma.$transaction([
      prisma.customer.update({
        where: {
          id: customerId,
        },
        data: {
          status: "BLOCKED",
        },
      }),

      prisma.bankAccount.updateMany({
        where: {
          customerId,
          status: "ACTIVE",
        },
        data: {
          status: "BLOCKED",
        },
      }),
    ]);
  } else {
    await prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        status,
      },
    });
  }

  revalidatePath("/customers");
  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/accounts");

  return {
    success: true,
  };
}
