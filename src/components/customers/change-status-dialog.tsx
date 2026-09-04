"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { changeCustomerStatus } from "@/lib/customers/change-customer-status";

type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

interface ChangeStatusDialogProps {
  customerId: string;
  currentStatus: CustomerStatus;
}

export function ChangeStatusDialog({
  customerId,
  currentStatus,
}: ChangeStatusDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<CustomerStatus>(currentStatus);
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
        await changeCustomerStatus({
          customerId,
          status,
        });

        setOpen(false);
        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to change customer status.",
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
            <DialogTitle>Change Customer Status</DialogTitle>

            <DialogDescription>
              Select the new status for this customer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label htmlFor="customer-status" className="text-sm font-medium">
              Status
            </label>

            <select
              id="customer-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as CustomerStatus)
              }
              disabled={isPending}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          {status === "BLOCKED" && currentStatus !== "BLOCKED" && (
            <p className="text-sm text-muted-foreground">
              Blocking this customer will block all currently active accounts.
            </p>
          )}

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
