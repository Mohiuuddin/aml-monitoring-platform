"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { changeAccountStatus } from "@/lib/accounts/change-account-status";

type AccountStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | "CLOSED";

interface ChangeStatusDialogProps {
  accountId: string;
  currentStatus: AccountStatus;
}

export function ChangeStatusDialog({
  accountId,
  currentStatus,
}: ChangeStatusDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<AccountStatus>(currentStatus);
  const [error, setError] = useState("");

  const [isPending, startTransition] = useTransition();

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (value) {
      setStatus(currentStatus);
      setError("");
    }
  }

  function handleSubmit() {
    setError("");

    startTransition(async () => {
      try {
        await changeAccountStatus({
          accountId,
          status,
        });

        setOpen(false);
        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to change account status.",
        );
      }
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleOpenChange(true)}
      >
        Change Status
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Account Status</DialogTitle>

            <DialogDescription>
              Select the new status for this account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label htmlFor="account-status" className="text-sm font-medium">
              Status
            </label>

            <select
              id="account-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as AccountStatus)
              }
              disabled={isPending}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || status === currentStatus}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
