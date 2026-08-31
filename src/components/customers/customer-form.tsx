"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createCustomer } from "@/lib/customers/create-customer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const country = String(formData.get("country") ?? "");

    startTransition(async () => {
      try {
        await createCustomer({
          name,
          email,
          phone,
          country,
        });

        router.push("/customers");
        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unable to create customer.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>

        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>

        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+8801XXXXXXXXX"
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>

        <Input
          id="country"
          name="country"
          placeholder="Bangladesh"
          required
          disabled={isPending}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Customer"}
      </Button>
    </form>
  );
}
