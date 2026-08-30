"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unable to change password.");
  }
}
