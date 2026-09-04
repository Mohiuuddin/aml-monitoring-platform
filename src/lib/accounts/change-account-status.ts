"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

type AccountStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | "CLOSED";

interface ChangeAccountStatusInput {
  accountId: string;
  status: AccountStatus;
}

export async function changeAccountStatus({
  accountId,
  status,
}: ChangeAccountStatusInput) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized.");
  }
  if (user.role !== "ADMIN" && user.role !== "ANALYST") {
    throw new Error("Unauthorized.");
  }
  const account = await prisma.bankAccount.findUnique({
    where: {
      id: accountId,
    },
    select: {
      id: true,
    },
  });
  if (!account) {
    throw new Error("Account not found.");
  }

  await prisma.bankAccount.update({
    where: {
      id: accountId,
    },
    data: {
      status,
    },
  });

  revalidatePath("/accounts");
  revalidatePath(`/accounts/${accountId}`);

  return {
    success: true,
  };
}
