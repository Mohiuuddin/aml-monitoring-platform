"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

type TransactionType =
  | "CASH_DEPOSIT"
  | "CASH_WITHDRAWAL"
  | "TRANSFER"
  | "CARD_PAYMENT"
  | "INTERNATIONAL_TRANSFER";

type TransactionDirection = "CREDIT" | "DEBIT";

interface Transaction {
  id: string;
  amount: string;
  currency: string;
  type: TransactionType;
  direction: TransactionDirection;
  counterparty: string | null;
  transactionAt: string;
  customer: {
    id: string;
    name: string;
    customerNumber: string;
  };
  account: {
    id: string;
    accountNo: string;
  };
}

interface TransactionsTableProps {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
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

export function TransactionsTable({
  transactions,
  total,
  page,
  totalPages,
}: TransactionsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [customerSearch, setCustomerSearch] = useState(
    searchParams.get("customer") ?? "",
  );

  const [accountSearch, setAccountSearch] = useState(
    searchParams.get("account") ?? "",
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (customerSearch) {
        params.set("customer", customerSearch);
      } else {
        params.delete("customer");
      }

      params.delete("page");

      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [customerSearch, pathname, router, searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (accountSearch) {
        params.set("account", accountSearch);
      } else {
        params.delete("account");
      }

      params.delete("page");

      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [accountSearch, pathname, router, searchParams]);

  function updateFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    setCustomerSearch("");
    setAccountSearch("");
    router.push(pathname);
  }

  function changePage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(newPage));

    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters =
    searchParams.get("customer") ||
    searchParams.get("account") ||
    searchParams.get("type") ||
    searchParams.get("direction") ||
    searchParams.get("fromDate") ||
    searchParams.get("toDate");

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg border bg-card p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Customer */}
          <div className="space-y-2">
            <label htmlFor="customer" className="text-sm font-medium">
              Customer
            </label>

            <input
              id="customer"
              value={customerSearch}
              onChange={(event) => setCustomerSearch(event.target.value)}
              placeholder="Search customer..."
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          {/* Account */}
          <div className="space-y-2">
            <label htmlFor="account" className="text-sm font-medium">
              Account
            </label>

            <input
              id="account"
              value={accountSearch}
              onChange={(event) => setAccountSearch(event.target.value)}
              placeholder="Search account..."
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          {/* Transaction Type */}
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Transaction Type
            </label>

            <select
              id="type"
              value={searchParams.get("type") ?? ""}
              onChange={(event) => updateFilter("type", event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">All Types</option>

              <option value="CASH_DEPOSIT">Cash Deposit</option>

              <option value="CASH_WITHDRAWAL">Cash Withdrawal</option>

              <option value="TRANSFER">Transfer</option>

              <option value="CARD_PAYMENT">Card Payment</option>

              <option value="INTERNATIONAL_TRANSFER">
                International Transfer
              </option>
            </select>
          </div>

          {/* Direction */}
          <div className="space-y-2">
            <label htmlFor="direction" className="text-sm font-medium">
              Direction
            </label>

            <select
              id="direction"
              value={searchParams.get("direction") ?? ""}
              onChange={(event) =>
                updateFilter("direction", event.target.value)
              }
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">All Directions</option>

              <option value="CREDIT">Credit</option>

              <option value="DEBIT">Debit</option>
            </select>
          </div>

          {/* From Date */}
          <div className="space-y-2">
            <label htmlFor="fromDate" className="text-sm font-medium">
              From Date
            </label>

            <input
              id="fromDate"
              type="date"
              value={searchParams.get("fromDate") ?? ""}
              onChange={(event) => updateFilter("fromDate", event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          {/* To Date */}
          <div className="space-y-2">
            <label htmlFor="toDate" className="text-sm font-medium">
              To Date
            </label>

            <input
              id="toDate"
              type="date"
              value={searchParams.get("toDate") ?? ""}
              onChange={(event) => updateFilter("toDate", event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
        </div>

        {hasFilters && (
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Result Count */}
      <div className="text-sm text-muted-foreground">
        {total} transaction{total !== 1 ? "s" : ""}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Date</th>

                <th className="px-4 py-3 text-left font-medium">Customer</th>

                <th className="px-4 py-3 text-left font-medium">Account</th>

                <th className="px-4 py-3 text-left font-medium">Type</th>

                <th className="px-4 py-3 text-left font-medium">Direction</th>

                <th className="px-4 py-3 text-right font-medium">Amount</th>

                <th className="px-4 py-3 text-left font-medium">
                  Counterparty
                </th>

                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(transaction.transactionAt)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {transaction.customer.name}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {transaction.customer.customerNumber}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {transaction.account.accountNo}
                    </td>

                    <td className="px-4 py-3">
                      {formatTransactionType(transaction.type)}
                    </td>

                    <td className="px-4 py-3">
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
                    </td>

                    <td
                      className={`whitespace-nowrap px-4 py-3 text-right font-medium ${
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
                    </td>

                    <td className="px-4 py-3">
                      {transaction.counterparty ?? "—"}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm">
                        <Link href={`/transactions/${transaction.id}`}>
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => changePage(page - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => changePage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
