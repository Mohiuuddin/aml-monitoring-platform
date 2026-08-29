"use client";

import { useTransition } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { resetUserPassword } from "@/lib/users/reset-user-password";

interface ResetUserPasswordButtonProps {
  userId: string;
}

export function ResetUserPasswordButton({
  userId,
}: ResetUserPasswordButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleReset() {
    const confirmed = window.confirm(
      "Are you sure you want to reset this user's password?",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      try {
        await resetUserPassword(userId);

        toast.success("Password reset successfully", {
          className:
            "!border-green-500/30 !bg-green-500/10 !text-green-700 dark:!text-green-400",
        });
      } catch (error) {
        console.error(error);

        toast.error("Failed to reset password");
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReset}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <KeyRound className="mr-2 h-4 w-4" />
      )}

      {isPending ? "Resetting..." : "Reset Password"}
    </Button>
  );
}
