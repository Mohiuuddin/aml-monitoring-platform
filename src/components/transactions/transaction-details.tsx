import Link from "next/link";

import { Button } from "@/components/ui/button";

type TransactionType =
  | "CASH_DEPOSIT"
  | "CASH_WITHDRAWAL"
  | "TRANSFER"
  | "CARD_PAYMENT"
  | "INTERNATIONAL_TRANSFER";

type TransactionDirection = "CREDIT" | "DEBIT";

interface TransactionDetailsProps {
  transaction: {
    id: string;
    amount: string;
    currency: string;
    type: TransactionType;
    direction: TransactionDirection;
    counterparty: string | null;
    counterpartyCountry: string | null;
    description: string | null;
    transactionAt: string;

    customer: {
      name: string;
      customerNumber: string;
    };

    account: {
      accountNo: string;
      currency: string;
      balance: string;
    };
  };
}

function formatTransactionType(type: TransactionType) {
  switch (type) {
    case "CASH_DEPOSIT":
      return "Cash Deposit";
    case "CASH_WITHDRAWAL":
      return "Cash Withdrawal";
    case "TRANSFER":
      return "Transfer";
    case "CARD_PAYMENT":
      return "Card Payment";
    case "INTERNATIONAL_TRANSFER":
      return "International Transfer";
  }
}

function formatAmount(
  amount: string,
  currency: string,
  direction: TransactionDirection,
) {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));

  return `${direction === "CREDIT" ? "+" : "-"}${formatted} ${currency}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transaction Details</h1>

          <p className="text-sm text-muted-foreground">
            Review transaction information.
          </p>
        </div>

        <Button variant="outline">
          <Link href="/transactions">Back to Transactions</Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Transaction ID</p>
            <p className="mt-1 break-all font-medium">{transaction.id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Transaction Date</p>
            <p className="mt-1 font-medium">
              {formatDate(transaction.transactionAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Customer</p>
            <p className="mt-1 font-medium">{transaction.customer.name}</p>
            <p className="text-xs text-muted-foreground">
              {transaction.customer.customerNumber}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Account</p>
            <p className="mt-1 font-medium">{transaction.account.accountNo}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Transaction Type</p>
            <p className="mt-1 font-medium">
              {formatTransactionType(transaction.type)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Direction</p>
            <p
              className={`mt-1 font-medium ${
                transaction.direction === "CREDIT"
                  ? "text-green-600"
                  : "text-destructive"
              }`}
            >
              {transaction.direction === "CREDIT" ? "Credit" : "Debit"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p
              className={`mt-1 text-lg font-semibold ${
                transaction.direction === "CREDIT"
                  ? "text-green-600"
                  : "text-destructive"
              }`}
            >
              {formatAmount(
                transaction.amount,
                transaction.currency,
                transaction.direction,
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Current Account Balance
            </p>
            <p className="mt-1 font-semibold">
              {Number(transaction.account.balance).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {transaction.account.currency}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Counterparty</p>
            <p className="mt-1 font-medium">
              {transaction.counterparty ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Counterparty Country
            </p>
            <p className="mt-1 font-medium">
              {transaction.counterpartyCountry ?? "—"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="mt-1 font-medium">{transaction.description ?? "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
