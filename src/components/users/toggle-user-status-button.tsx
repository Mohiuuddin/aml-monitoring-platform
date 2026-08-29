"use client";
import { useTransition } from "react";
import { Power } from "lucide-react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { updateUserStatus } from "@/lib/users/update-user-status";

interface ToggleUserStatusButtonProps {
  userId: string;
  status: "ACTIVE" | "DISABLED";
}

export function ToggleUserStatusButton({
  userId,
  status,
}: ToggleUserStatusButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const newStatus = status === "ACTIVE" ? "DISABLED" : "ACTIVE";

  function handleToggle() {
    startTransition(async () => {
      await updateUserStatus(userId, newStatus);
      router.refresh();
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
    >
      <Power className="mr-2 h-4 w-4" />

      {isPending ? "Updating..." : status === "ACTIVE" ? "Disable" : "Activate"}
    </Button>
  );
}
