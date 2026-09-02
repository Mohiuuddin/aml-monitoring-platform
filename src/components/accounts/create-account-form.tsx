"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createAccount } from "@/lib/accounts/create-account";

interface CreateAccountFormProps {
  customerId: string;
}

export function CreateAccountForm({ customerId }: CreateAccountFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [currency, setCurrency] = useState("BDT");
  const [balance, setBalance] = useState("0");

  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    startTransition(async () => {
      try {
        await createAccount({
          customerId,
          currency,
          balance: Number(balance),
        });

        router.push(`/customers/${customerId}`);
        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unable to create account.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>

        <Input
          id="currency"
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
          placeholder="BDT"
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="balance">Opening Balance</Label>

        <Input
          id="balance"
          type="number"
          min="0"
          step="0.01"
          value={balance}
          onChange={(event) => setBalance(event.target.value)}
          disabled={isPending}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Opening Account..." : "Open Account"}
      </Button>
    </form>
  );
}
