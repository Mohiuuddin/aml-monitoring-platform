"use server";
import { hashPassword } from "better-auth/crypto";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

const TEMPORARY_PASSWORD = "Aml@123456";

export async function resetUserPassword(userId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const hashedPassword = await hashPassword(TEMPORARY_PASSWORD);

  const result = await prisma.account.updateMany({
    where: {
      userId,
      providerId: "credential",
    },
    data: {
      password: hashedPassword,
    },
  });

  if (result.count === 0) {
    throw new Error("Credential account not found");
  }

  return {
    success: true,
    temporaryPassword: TEMPORARY_PASSWORD,
  };
}
