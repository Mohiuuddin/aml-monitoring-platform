import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AccountStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | "CLOSED";

type TransactionType =
  | "CASH_DEPOSIT"
  | "CASH_WITHDRAWAL"
  | "TRANSFER"
  | "CARD_PAYMENT"
  | "INTERNATIONAL_TRANSFER";

type TransactionDirection = "CREDIT" | "DEBIT";

interface AccountDetailsProps {
  account: {
    id: string;
    accountNo: string;
    currency: string;
    balance: string;
    status: AccountStatus;
    openedAt: string;

    customer: {
      id: string;
      customerNumber: string;
      name: string;
    };

    transactions: {
      id: string;
      amount: string;
      currency: string;
      type: TransactionType;
      direction: TransactionDirection;
      counterparty: string | null;
      transactionAt: string;
    }[];
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

function formatBalance(balance: string, currency: string) {
  return `${Number(balance).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

function getStatusVariant(status: AccountStatus) {
  if (status === "BLOCKED" || status === "CLOSED") {
    return "destructive" as const;
  }

  if (status === "INACTIVE") {
    return "default" as const;
  }

  return "outline" as const;
}

export function AccountDetails({ account }: AccountDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Account Details</h1>

          <p className="text-sm text-muted-foreground">
            Review account information and recent transactions.
          </p>
        </div>

        <Button variant="outline">
          <Link href="/accounts">Back to Accounts</Link>
        </Button>
      </div>

      {/* Account Information */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Account Information</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Account Number</p>

            <p className="mt-1 font-medium">{account.accountNo}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Customer</p>

            <p className="mt-1 font-medium">{account.customer.name}</p>

            <p className="text-xs text-muted-foreground">
              {account.customer.customerNumber}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Currency</p>

            <p className="mt-1 font-medium">{account.currency}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Balance</p>

            <p className="mt-1 text-lg font-semibold">
              {formatBalance(account.balance, account.currency)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Status</p>

            <div className="mt-1">
              <Badge
                variant={getStatusVariant(account.status)}
                className={
                  account.status === "ACTIVE"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : ""
                }
              >
                {account.status}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Opened At</p>

            <p className="mt-1 font-medium">{formatDate(account.openedAt)}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-lg font-semibold">Recent Transactions</h2>

            <p className="text-sm text-muted-foreground">
              Last 5 transactions for this account.
            </p>
          </div>

          <Button variant="outline" size="sm">
            <Link
              href={`/transactions?account=${encodeURIComponent(
                account.accountNo,
              )}`}
            >
              View All
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Counterparty</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {account.transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                account.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(transaction.transactionAt)}
                    </TableCell>

                    <TableCell>
                      {formatTransactionType(transaction.type)}
                    </TableCell>

                    <TableCell>
                      <span
                        className={
                          transaction.direction === "CREDIT"
                            ? "font-medium text-green-600"
                            : "font-medium text-destructive"
                        }
                      >
                        {transaction.direction === "CREDIT"
                          ? "Credit"
                          : "Debit"}
                      </span>
                    </TableCell>

                    <TableCell>{transaction.counterparty ?? "—"}</TableCell>

                    <TableCell
                      className={`text-right font-medium ${
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
