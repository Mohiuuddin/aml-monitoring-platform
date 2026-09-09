"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type AlertStatus =
  | "OPEN"
  | "INVESTIGATING"
  | "ESCALATED"
  | "FALSE_POSITIVE"
  | "CLOSED";

type TransactionType =
  | "CASH_DEPOSIT"
  | "CASH_WITHDRAWAL"
  | "TRANSFER"
  | "CARD_PAYMENT"
  | "INTERNATIONAL_TRANSFER";

type TransactionDirection = "CREDIT" | "DEBIT";

interface Alert {
  id: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: AlertStatus;
  title: string;
  createdAt: string;

  customer: {
    id: string;
    customerNumber: string;
    name: string;
  };

  transaction: {
    id: string;
    amount: string;
    currency: string;
    type: TransactionType;
    direction: TransactionDirection;
    transactionAt: string;
  } | null;

  triggeredRules: {
    rule: {
      id: string;
      name: string;
      code: string;
      riskWeight: number;
    };
  }[];
}

interface AlertsTableProps {
  alerts: Alert[];
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

function formatAmount(amount: string, currency: string) {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount))} ${currency}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getRiskClass(riskLevel: RiskLevel) {
  switch (riskLevel) {
    case "LOW":
      return "bg-green-100 text-green-700";

    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";

    case "HIGH":
      return "bg-orange-100 text-orange-700";

    case "CRITICAL":
      return "bg-red-100 text-red-700";
  }
}

function getStatusClass(status: AlertStatus) {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-700";

    case "INVESTIGATING":
      return "bg-yellow-100 text-yellow-700";

    case "ESCALATED":
      return "bg-orange-100 text-orange-700";

    case "FALSE_POSITIVE":
      return "bg-gray-100 text-gray-700";

    case "CLOSED":
      return "bg-green-100 text-green-700";
  }
}

function formatStatus(status: AlertStatus) {
  switch (status) {
    case "OPEN":
      return "Open";

    case "INVESTIGATING":
      return "Investigating";

    case "ESCALATED":
      return "Escalated";

    case "FALSE_POSITIVE":
      return "False Positive";

    case "CLOSED":
      return "Closed";
  }
}

export function AlertsTable({
  alerts,
  total,
  page,
  totalPages,
}: AlertsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function changePage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(newPage));

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* Result Count */}
      <div className="text-sm text-muted-foreground">
        {total} alert{total !== 1 ? "s" : ""}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Created</th>

                <th className="px-4 py-3 text-left font-medium">Customer</th>

                <th className="px-4 py-3 text-left font-medium">Transaction</th>

                <th className="px-4 py-3 text-left font-medium">Risk</th>

                <th className="px-4 py-3 text-left font-medium">Status</th>

                <th className="px-4 py-3 text-left font-medium">
                  Triggered Rules
                </th>

                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {alerts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No alerts found.
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-muted/30">
                    {/* Created */}
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(alert.createdAt)}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3">
                      <div className="font-medium">{alert.customer.name}</div>

                      <div className="text-xs text-muted-foreground">
                        {alert.customer.customerNumber}
                      </div>
                    </td>

                    {/* Transaction */}
                    <td className="px-4 py-3">
                      {alert.transaction ? (
                        <>
                          <div className="font-medium">
                            {formatTransactionType(alert.transaction.type)}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {formatAmount(
                              alert.transaction.amount,
                              alert.transaction.currency,
                            )}
                          </div>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Risk */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getRiskClass(
                            alert.riskLevel,
                          )}`}
                        >
                          {alert.riskLevel}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {alert.riskScore}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(
                          alert.status,
                        )}`}
                      >
                        {formatStatus(alert.status)}
                      </span>
                    </td>

                    {/* Triggered Rules */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {alert.triggeredRules.length === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          alert.triggeredRules.map(({ rule }) => (
                            <div key={rule.id} className="text-xs">
                              {rule.name}
                            </div>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm">
                        <Link href={`/alerts/${alert.id}`}>View</Link>
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
