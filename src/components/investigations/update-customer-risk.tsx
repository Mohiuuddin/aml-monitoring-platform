"use client";

import { useState, useTransition } from "react";

import { updateCustomerRisk } from "@/lib/investigations/update-customer-risk";
import { Button } from "@/components/ui/button";

type CustomerRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface UpdateCustomerRiskProps {
  customerId: string;
  currentRiskLevel: CustomerRiskLevel;
}

export function UpdateCustomerRisk({
  customerId,
  currentRiskLevel,
}: UpdateCustomerRiskProps) {
  const [riskLevel, setRiskLevel] =
    useState<CustomerRiskLevel>(currentRiskLevel);

  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const hasChanged = riskLevel !== currentRiskLevel;

  function handleUpdate() {
    if (!hasChanged) {
      return;
    }

    setMessage("");

    startTransition(async () => {
      try {
        const result = await updateCustomerRisk({
          customerId,
          riskLevel,
        });

        setMessage(result.message);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to update customer risk level.",
        );
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="customer-risk-level" className="text-sm font-medium">
          Customer Risk Level
        </label>

        <p className="mt-1 text-sm text-muted-foreground">
          Update the customer&apos;s overall risk profile based on the
          investigation.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          id="customer-risk-level"
          value={riskLevel}
          onChange={(event) =>
            setRiskLevel(event.target.value as CustomerRiskLevel)
          }
          disabled={isPending}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <Button
          type="button"
          onClick={handleUpdate}
          disabled={!hasChanged || isPending}
        >
          {isPending ? "Updating..." : "Update Risk Level"}
        </Button>
      </div>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
