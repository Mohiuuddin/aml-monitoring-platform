"use client";

import { useRef, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { updateProfileImage } from "@/lib/profile/update-profile-image";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ProfileImage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Only JPG, PNG, and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("Image size must be 2 MB or less.");
      event.target.value = "";
      return;
    }

    startTransition(async () => {
      try {
        await updateProfileImage(file);
        window.location.reload();
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Unable to upload profile picture.",
        );
      }
    });

    event.target.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleChange}
      />

      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? "Uploading..." : "Change Profile Photo"}
      </Button>

      <p className="mt-2 text-xs text-muted-foreground">
        JPG, PNG, or WebP. Maximum 2 MB.
      </p>
    </>
  );
}
