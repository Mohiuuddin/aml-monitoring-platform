"use server";

import prisma from "@/lib/prisma";

export async function updateUserStatus(
  userId: string,
  status: "ACTIVE" | "DISABLED",
) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
  });
}
