"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getCustomer } from "@/lib/customers/get-customer";

interface CreateAccountInput {
  customerId: string;
  currency: string;
  balance: number;
}

export async function createAccount({
  customerId,
  currency,
  balance,
}: CreateAccountInput) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  if (user.role !== "ADMIN" && user.role !== "ANALYST") {
    throw new Error("Unauthorized.");
  }

  const customer = await getCustomer(customerId);

  if (!customer) {
    throw new Error("Customer not found.");
  }

  if (!currency.trim()) {
    throw new Error("Currency is required.");
  }

  if (balance < 0) {
    throw new Error("Opening balance cannot be negative.");
  }

  const accountCount = await prisma.bankAccount.count({
    where: {
      customerId: customer.id,
    },
  });

  const accountNo = `${customer.customerNumber}-${String(
    1001 + accountCount,
  ).padStart(4, "0")}`;

  await prisma.bankAccount.create({
    data: {
      accountNo,
      customerId: customer.id,
      currency: currency.trim().toUpperCase(),
      balance,
    },
  });

  revalidatePath(`/customers/${customerId}`);

  return {
    success: true,
  };
}
