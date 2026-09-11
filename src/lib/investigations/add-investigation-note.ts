"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

interface AddInvestigationNoteInput {
  investigationId: string;
  content: string;
}

export async function addInvestigationNote({
  investigationId,
  content,
}: AddInvestigationNoteInput) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  if (user.role !== "ADMIN" && user.role !== "ANALYST") {
    throw new Error("Unauthorized.");
  }

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    throw new Error("Note cannot be empty.");
  }

  const investigation = await prisma.investigation.findUnique({
    where: {
      id: investigationId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!investigation) {
    throw new Error("Investigation not found.");
  }

  if (investigation.status === "RESOLVED") {
    throw new Error("Cannot add a note to a resolved investigation.");
  }

  const note = await prisma.investigationNote.create({
    data: {
      investigationId,
      authorId: user.id,
      content: trimmedContent,
    },
  });

  revalidatePath(`/investigations/${investigationId}`);

  return {
    success: true,
    noteId: note.id,
  };
}
