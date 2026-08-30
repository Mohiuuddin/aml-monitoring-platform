"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { supabaseServer } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function updateProfileImage(file: File) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WebP images are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image size must be 2 MB or less.");
  }

  const extension = file.type.split("/")[1];

  const filePath = `${user.id}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabaseServer.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabaseServer.storage.from("avatars").getPublicUrl(filePath);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      image: publicUrl,
    },
  });

  revalidatePath("/profile");

  return {
    success: true,
    imageUrl: publicUrl,
  };
}
