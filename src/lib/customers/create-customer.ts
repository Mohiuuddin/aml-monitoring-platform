"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

interface CreateCustomerInput {
  name: string;
  email?: string;
  phone?: string;
  country: string;
}

export async function createCustomer(input: CreateCustomerInput) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized.");
  }

  if (user.role !== "ADMIN" && user.role !== "ANALYST") {
    throw new Error("Unauthorized.");
  }

  const name = input.name.trim();
  const email = input.email?.trim() || null;
  const phone = input.phone?.trim() || null;
  const country = input.country.trim();

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!country) {
    throw new Error("Country is required.");
  }

  if (email) {
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        email,
      },
    });

    if (existingCustomer) {
      throw new Error("A customer with this email already exists.");
    }
  }

  const customerNumber = `CUST-${crypto
    .randomUUID()
    .replace(/-/g, "")
    .slice(0, 8)
    .toUpperCase()}`;

  const customer = await prisma.customer.create({
    data: {
      customerNumber,
      name,
      email,
      phone,
      country,
    },
  });

  revalidatePath("/customers");
  return {
    success: true,
    customer,
  };
}
