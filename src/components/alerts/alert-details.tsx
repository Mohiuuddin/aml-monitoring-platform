import Link from "next/link";

import { Button } from "@/components/ui/button";

import { StartInvestigationButton } from "@/components/investigations/start-investigation-button";

type AlertDetails = {
  id: string;
  riskScore: number;
  riskLevel: string;
  status: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;

  customer: {
    id: string;
    customerNumber: string;
    name: string;
    email: string | null;
    phone: string | null;
    country: string;
    riskLevel: string;
    status: string;
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
    account: {
      id: string;
      accountNo: string;
      currency: string;
    };
  } | null;

  triggeredRules: {
    id: string;
    createdAt: string;
    rule: {
      id: string;
      name: string;
      description: string;
      code: string;
      riskWeight: number;
      isActive: boolean;
    };
  }[];
};

interface AlertDetailsProps {
  alert: AlertDetails;
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
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
    case "INVESTIGATING":
      return "bg-yellow-100 text-yellow-700";
    case "ESCALATED":
      return "bg-orange-100 text-orange-700";
    case "FALSE_POSITIVE":
      return "bg-gray-100 text-gray-700";
    case "CLOSED":
      return "bg-green-100 text-green-700";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function AlertDetails({ alert }: AlertDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="outline">
          <Link href="/alerts">← Back to Alerts</Link>
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{alert.title}</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Alert ID: {alert.id}
            </p>
          </div>

          <div className="flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getRiskClass(
                alert.riskLevel,
              )}`}
            >
              {alert.riskLevel}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                alert.status,
              )}`}
            >
              {formatStatus(alert.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Risk Assessment</h2>

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

            <p className="mt-1 text-lg font-semibold">{alert.riskLevel}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Alert Created</p>

            <p className="mt-1 text-sm font-medium">
              {formatDate(alert.createdAt)}
            </p>
          </div>
        </div>

        {/* Description */}
        {alert.description && (
          <div className="mt-6 rounded-md border bg-muted/30 p-4">
            <p className="text-sm font-semibold">Description</p>

            <p className="mt-2 text-base font-medium leading-6">
              {alert.description}
            </p>
          </div>
        )}
      </div>

      {/* Customer */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Customer</h2>

        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="mt-1 font-medium">{alert.customer.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Customer Number</p>
            <p className="mt-1 font-medium">{alert.customer.customerNumber}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Country</p>
            <p className="mt-1 font-medium">{alert.customer.country}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="mt-1 font-medium">{alert.customer.email ?? "—"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="mt-1 font-medium">{alert.customer.phone ?? "—"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Customer Risk Level</p>
            <p className="mt-1 font-medium">{alert.customer.riskLevel}</p>
          </div>
        </div>
      </div>

      {/* Transaction */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Transaction</h2>

        {alert.transaction ? (
          <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <p className="text-sm text-muted-foreground">Account</p>
              <p className="mt-1 font-medium">
                {alert.transaction.account.accountNo}
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

                <p className="mt-4 text-sm font-medium leading-6">
                  {rule.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Investigation */}
      <div className="rounded-lg border bg-card p-6">
        <div className="rounded-md border bg-muted/30 p-5">
          <h2 className="text-xl font-semibold">Investigation</h2>

          <p className="mt-2 text-base font-medium leading-6">
            Start an investigation to review this alert and document your
            findings.
          </p>

          <div className="mt-5">
            <StartInvestigationButton alertId={alert.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
