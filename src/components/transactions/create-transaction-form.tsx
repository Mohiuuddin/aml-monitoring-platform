"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createTransaction } from "@/lib/transactions/create-transaction";

type TransactionType =
  | "CASH_DEPOSIT"
  | "CASH_WITHDRAWAL"
  | "TRANSFER"
  | "CARD_PAYMENT"
  | "INTERNATIONAL_TRANSFER";

type TransactionDirection = "CREDIT" | "DEBIT";

interface Account {
  id: string;
  accountNo: string;
  balance: string;
  currency: string;
  customer: {
    name: string;
  };
}

interface CreateTransactionFormProps {
  accounts: Account[];
}

function getCurrentDateTimeLocal() {
  const now = new Date();

  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

export function CreateTransactionForm({
  accounts,
}: CreateTransactionFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [accountId, setAccountId] = useState("");
  const [type, setType] = useState<TransactionType>("TRANSFER");

  const [direction, setDirection] = useState<TransactionDirection>("DEBIT");

  const [amount, setAmount] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [counterpartyCountry, setCounterpartyCountry] = useState("");
  const [description, setDescription] = useState("");
  const [transactionAt, setTransactionAt] = useState(getCurrentDateTimeLocal());

  const selectedAccount = accounts.find((account) => account.id === accountId);

  const isCashTransaction =
    type === "CASH_DEPOSIT" || type === "CASH_WITHDRAWAL";

  const isDirectionFixed =
    type === "CASH_DEPOSIT" ||
    type === "CASH_WITHDRAWAL" ||
    type === "CARD_PAYMENT";

  const transactionDirection: TransactionDirection =
    type === "CASH_DEPOSIT"
      ? "CREDIT"
      : type === "CASH_WITHDRAWAL" || type === "CARD_PAYMENT"
        ? "DEBIT"
        : direction;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    startTransition(async () => {
      try {
        await createTransaction({
          accountId,
          amount,
          type,
          direction: transactionDirection,
          counterparty: isCashTransaction ? undefined : counterparty,
          counterpartyCountry: isCashTransaction
            ? undefined
            : counterpartyCountry,
          description,
          transactionAt,
        });

        router.push("/transactions");
        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to create transaction.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Account */}
      <div className="space-y-2">
        <label htmlFor="account" className="text-sm font-medium">
          Account
        </label>

        <select
          id="account"
          value={accountId}
          onChange={(event) => setAccountId(event.target.value)}
          disabled={isPending}
          required
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value="">Select account</option>

          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.accountNo} — {account.customer.name}
            </option>
          ))}
        </select>
      </div>

      {/* Currency */}
      <div className="space-y-2">
        <label htmlFor="currency" className="text-sm font-medium">
          Currency
        </label>

        <input
          id="currency"
          value={selectedAccount?.currency ?? ""}
          placeholder="Select an account"
          readOnly
          className="h-10 w-full rounded-md border bg-muted px-3 text-sm"
        />
      </div>

      {/* Available Balance */}
      <div className="space-y-2">
        <label htmlFor="balance" className="text-sm font-medium">
          Available Balance
        </label>

        <input
          id="balance"
          value={
            selectedAccount
              ? `${Number(selectedAccount.balance).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} ${selectedAccount.currency}`
              : ""
          }
          placeholder="Select an account"
          readOnly
          className="h-10 w-full rounded-md border bg-muted px-3 text-sm"
        />
      </div>

      {/* Transaction Type */}
      <div className="space-y-2">
        <label htmlFor="transaction-type" className="text-sm font-medium">
          Transaction Type
        </label>

        <select
          id="transaction-type"
          value={type}
          onChange={(event) => setType(event.target.value as TransactionType)}
          disabled={isPending}
          required
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value="CASH_DEPOSIT">Cash Deposit</option>

          <option value="CASH_WITHDRAWAL">Cash Withdrawal</option>

          <option value="TRANSFER">Transfer</option>

          <option value="CARD_PAYMENT">Card Payment</option>

          <option value="INTERNATIONAL_TRANSFER">International Transfer</option>
        </select>
      </div>

      {/* Direction */}
      <div className="space-y-2">
        <label htmlFor="direction" className="text-sm font-medium">
          Direction
        </label>

        <select
          id="direction"
          value={transactionDirection}
          onChange={(event) =>
            setDirection(event.target.value as TransactionDirection)
          }
          disabled={isPending || isDirectionFixed}
          required
          className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          <option value="DEBIT">Debit</option>
          <option value="CREDIT">Credit</option>
        </select>

        {isDirectionFixed && (
          <p className="text-xs text-muted-foreground">
            Direction is automatically determined by the transaction type.
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Amount
        </label>

        <input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          disabled={isPending}
          required
          placeholder="0.00"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        />
      </div>

      {/* Counterparty */}
      {!isCashTransaction && (
        <>
          <div className="space-y-2">
            <label htmlFor="counterparty" className="text-sm font-medium">
              Counterparty
            </label>

            <input
              id="counterparty"
              value={counterparty}
              onChange={(event) => setCounterparty(event.target.value)}
              disabled={isPending}
              placeholder="Person or business name"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="counterparty-country"
              className="text-sm font-medium"
            >
              Counterparty Country
            </label>

            <input
              id="counterparty-country"
              value={counterpartyCountry}
              onChange={(event) => setCounterpartyCountry(event.target.value)}
              disabled={isPending}
              placeholder="e.g. Bangladesh"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
        </>
      )}

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isPending}
          placeholder="Transaction description"
          rows={3}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Transaction Date */}
      <div className="space-y-2">
        <label htmlFor="transaction-at" className="text-sm font-medium">
          Transaction Date
        </label>

        <input
          id="transaction-at"
          type="datetime-local"
          value={transactionAt}
          onChange={(event) => setTransactionAt(event.target.value)}
          disabled={isPending}
          required
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending || !accountId}
        className="bg-green-600 text-white hover:bg-green-700"
      >
        {isPending ? "Creating..." : "Create Transaction"}
      </Button>
    </form>
  );
}
