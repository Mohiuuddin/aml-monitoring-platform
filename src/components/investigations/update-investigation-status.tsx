"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { updateInvestigationStatus } from "@/lib/investigations/update-investigation-status";

type InvestigationStatus = "OPEN" | "IN_PROGRESS" | "ESCALATED" | "RESOLVED";

interface UpdateInvestigationStatusProps {
  investigationId: string;
  currentStatus: InvestigationStatus;
}

export function UpdateInvestigationStatus({
  investigationId,
  currentStatus,
}: UpdateInvestigationStatusProps) {
  const [status, setStatus] = useState<InvestigationStatus>(currentStatus);

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleUpdate() {
    setError("");

    if (status === currentStatus) {
      return;
    }

    startTransition(async () => {
      try {
        await updateInvestigationStatus({
          investigationId,
          status,
        });
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to update investigation status.",
        );
      }
    });
  }

  const isResolved = currentStatus === "RESOLVED";

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as InvestigationStatus)
          }
          disabled={isPending || isResolved}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ESCALATED">Escalated</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <Button
          type="button"
          onClick={handleUpdate}
          disabled={isPending || isResolved || status === currentStatus}
        >
          {isPending ? "Updating..." : "Update Status"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
