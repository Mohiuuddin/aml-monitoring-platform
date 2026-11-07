"use client";

import Link from "next/link";

import { AddInvestigationNote } from "@/components/investigations/add-investigation-note";
import { UpdateInvestigationStatus } from "@/components/investigations/update-investigation-status";
import { UpdateCustomerRisk } from "@/components/investigations/update-customer-risk";
import { Button } from "@/components/ui/button";

interface InvestigationDetailsProps {
  investigation: {
    id: string;
    alertId: string;
    status: string;
    summary: string | null;
    startedAt: string;
    updatedAt: string;
    closedAt: string | null;

    analyst: {
      id: string;
      name: string;
      email: string;
    };

    alert: {
      id: string;
      title: string;
      description: string | null;
      riskScore: number;
      riskLevel: string;
      status: string;
      createdAt: string;

      customer: {
        id: string;
        customerNumber: string;
        name: string;
        riskLevel: string;
      };

      transaction: {
        id: string;
        amount: string;
        currency: string;
        type: string;
        direction: string;
        counterparty: string | null;
        counterpartyCountry: string | null;
        description: string | null;
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
    };

    notes: {
      id: string;
      content: string;
      createdAt: string;
      author: {
        id: string;
        name: string;
        email: string;
      };
    }[];
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatTransactionType(type: string) {
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

    default:
      return type;
  }
}

function formatAmount(amount: string, currency: string) {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount))} ${currency}`;
}

function getRiskClass(riskLevel: string) {
  switch (riskLevel) {
    case "LOW":
      return "bg-green-100 text-green-700";

    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";

    case "HIGH":
      return "bg-orange-100 text-orange-700";

    case "CRITICAL":
      return "bg-red-100 text-red-700";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-700";

    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-700";

    case "ESCALATED":
      return "bg-orange-100 text-orange-700";

    case "RESOLVED":
      return "bg-green-100 text-green-700";

    default:
      return "bg-muted text-muted-foreground";
  }
}

export function InvestigationDetails({
  investigation,
}: InvestigationDetailsProps) {
  const { alert } = investigation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="outline">
          <Link href={`/alerts/${alert.id}`}>← Back to Alert</Link>
        </Button>
        <Button variant="outline" className="ml-3">
          <Link href="/investigations">← Back to Investigations</Link>
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Investigation</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Investigation ID: {investigation.id}
            </p>
          </div>

          <div className="flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                investigation.status,
              )}`}
            >
              {formatStatus(investigation.status)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getRiskClass(
                alert.riskLevel,
              )}`}
            >
              {alert.riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Investigation Summary */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Investigation Summary</h2>

        <div className="mt-5 grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Investigator</p>

            <p className="mt-1 font-medium">{investigation.analyst.name}</p>

            <p className="text-xs text-muted-foreground">
              {investigation.analyst.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Started</p>

            <p className="mt-1 font-medium">
              {formatDate(investigation.startedAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>

            <p className="mt-1 font-medium">
              {formatDate(investigation.updatedAt)}
            </p>
          </div>
        </div>

        {investigation.summary && (
          <div className="mt-6 rounded-md border bg-muted/30 p-4">
            <p className="text-sm font-semibold">Summary</p>

            <p className="mt-2 text-sm leading-6">{investigation.summary}</p>
          </div>
        )}

        {investigation.closedAt && (
          <div className="mt-6 rounded-md border bg-muted/30 p-4">
            <p className="text-sm font-semibold">Closed At</p>

            <p className="mt-2 text-sm">{formatDate(investigation.closedAt)}</p>
          </div>
        )}
      </div>

      {/* Alert */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Alert</h2>

            <p className="mt-1 text-sm text-muted-foreground">{alert.title}</p>
          </div>

          <Button variant="outline" size="sm">
            <Link href={`/alerts/${alert.id}`}>View Alert</Link>
          </Button>
        </div>

        {alert.description && (
          <div className="mt-5 rounded-md border bg-muted/30 p-4">
            <p className="text-sm font-semibold">Description</p>

            <p className="mt-2 text-sm leading-6">{alert.description}</p>
          </div>
        )}

        <div className="mt-5 grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Risk Score</p>

            <p className="mt-1 text-2xl font-bold">
              {alert.riskScore}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / 100
              </span>
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Risk Level</p>

            <p className="mt-1 font-semibold">{alert.riskLevel}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Alert Status</p>

            <p className="mt-1 font-medium">{formatStatus(alert.status)}</p>
          </div>
        </div>
      </div>

      {/* Customer */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Customer</h2>

        <div className="mt-5 grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>

            <p className="mt-1 font-medium">{alert.customer.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Customer Number</p>

            <p className="mt-1 font-medium">{alert.customer.customerNumber}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Customer ID</p>

            <p className="mt-1 font-medium">{alert.customer.id}</p>
          </div>
        </div>
      </div>

      {/* Transaction */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Transaction</h2>

        {alert.transaction ? (
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>

              <p className="mt-1 text-lg font-semibold">
                {formatAmount(
                  alert.transaction.amount,
                  alert.transaction.currency,
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Type</p>

              <p className="mt-1 font-medium">
                {formatTransactionType(alert.transaction.type)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Direction</p>

              <p className="mt-1 font-medium">
                {alert.transaction.direction === "CREDIT" ? "Credit" : "Debit"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Counterparty</p>

              <p className="mt-1 font-medium">
                {alert.transaction.counterparty ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Counterparty Country
              </p>

              <p className="mt-1 font-medium">
                {alert.transaction.counterpartyCountry ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Transaction Date</p>

              <p className="mt-1 font-medium">
                {formatDate(alert.transaction.transactionAt)}
              </p>
            </div>

            {alert.transaction.description && (
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-sm text-muted-foreground">Description</p>

                <p className="mt-1 font-medium">
                  {alert.transaction.description}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No transaction is associated with this alert.
          </p>
        )}
      </div>

      {/* Triggered AML Rules */}
      <div className="rounded-lg border bg-card p-6">
        <div>
          <h2 className="text-xl font-semibold">Triggered AML Rules</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Rules that caused this transaction to generate an AML alert.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {alert.triggeredRules.length === 0 ? (
            <div className="rounded-md border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                No AML rules were recorded for this alert.
              </p>
            </div>
          ) : (
            alert.triggeredRules.map(({ rule }) => (
              <div key={rule.id} className="rounded-lg border bg-muted/20 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold">{rule.name}</h3>

                    <p className="mt-1 font-mono text-sm font-medium text-muted-foreground">
                      {rule.code}
                    </p>
                  </div>

                  <span className="rounded-md border bg-background px-3 py-1 text-sm font-semibold">
                    Weight: {rule.riskWeight}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Investigation Notes */}
      <div className="rounded-lg border bg-card p-6">
        <div>
          <h2 className="text-xl font-semibold">Investigation Notes</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Document your findings and investigation activities.
          </p>
        </div>

        <div className="mt-5">
          <AddInvestigationNote investigationId={investigation.id} />
        </div>

        <div className="mt-6 space-y-4">
          {investigation.notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No investigation notes yet.
            </p>
          ) : (
            investigation.notes.map((note) => (
              <div key={note.id} className="rounded-md border p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{note.author.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {formatDate(note.createdAt)}
                  </p>
                </div>

                <p className="mt-2 text-sm leading-6">{note.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Investigation Actions */}
      {/* <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Investigation Actions</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Update the investigation status as the review progresses.
        </p>

        <div className="mt-5">
          <UpdateInvestigationStatus
            investigationId={investigation.id}
            currentStatus={
              investigation.status as
                | "OPEN"
                | "IN_PROGRESS"
                | "ESCALATED"
                | "RESOLVED"
            }
          />
        </div>
      </div> */}

      {/* Investigation Actions */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Investigation Actions</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Update the investigation status and customer risk level as the review
          progresses.
        </p>

        <div className="mt-5">
          <UpdateInvestigationStatus
            investigationId={investigation.id}
            currentStatus={
              investigation.status as
                | "OPEN"
                | "IN_PROGRESS"
                | "ESCALATED"
                | "RESOLVED"
            }
          />
        </div>

        <div className="mt-6 border-t pt-6">
          <UpdateCustomerRisk
            customerId={investigation.alert.customer.id}
            currentRiskLevel={
              investigation.alert.customer.riskLevel as
                | "LOW"
                | "MEDIUM"
                | "HIGH"
                | "CRITICAL"
            }
          />
        </div>
      </div>
    </div>
  );
}
