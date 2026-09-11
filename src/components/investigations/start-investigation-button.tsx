"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface StartInvestigationButtonProps {
  alertId: string;
}

export function StartInvestigationButton({
  alertId,
}: StartInvestigationButtonProps) {
  const router = useRouter();

  const [isStarting, setIsStarting] = useState(false);

  async function handleStartInvestigation() {
    setIsStarting(true);

    try {
      const response = await fetch("/api/investigations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alertId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to start investigation");
      }

      const investigation = await response.json();

      router.push(`/investigations/${investigation.id}`);
    } catch (error) {
      console.error(error);
      setIsStarting(false);
    }
  }

  return (
    <Button
      onClick={handleStartInvestigation}
      disabled={isStarting}
      className="cursor-pointer disabled:cursor-not-allowed"
    >
      {isStarting ? "Starting..." : "Start Investigation"}
    </Button>
  );
}
