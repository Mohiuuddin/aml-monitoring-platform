"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

type InvestigationStatus = "OPEN" | "IN_PROGRESS" | "ESCALATED" | "RESOLVED";

interface Investigation {
  id: string;
  status: InvestigationStatus;
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
    riskScore: number;
    riskLevel: string;

    customer: {
      id: string;
      name: string;
      customerNumber: string;
    };

    transaction: {
      id: string;
      amount: string;
      currency: string;
      type: string;
      direction: string;
    } | null;
  };
}

interface InvestigationsTableProps {
  investigations: Investigation[];
  total: number;
  page: number;
  totalPages: number;
}

function formatStatus(status: InvestigationStatus) {
  switch (status) {
    case "OPEN":
      return "Open";

    case "IN_PROGRESS":
      return "In Progress";

    case "ESCALATED":
      return "Escalated";

    case "RESOLVED":
      return "Resolved";
  }
}

function getStatusClass(status: InvestigationStatus) {
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function InvestigationsTable({
  investigations,
  total,
  page,
  totalPages,
}: InvestigationsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [customerSearch, setCustomerSearch] = useState(
    searchParams.get("customer") ?? "",
  );

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
    router.push(pathname);
  }

  function changePage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(newPage));

    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters =
    searchParams.get("customer") ||
    searchParams.get("status") ||
    searchParams.get("fromDate") ||
    searchParams.get("toDate");

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg border bg-card p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Customer */}
          <div className="space-y-2">
            <label htmlFor="customer" className="text-sm font-medium">
              Customer
            </label>

            <input
              id="customer"
              value={customerSearch}
              onChange={(event) => setCustomerSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  updateFilter("customer", customerSearch);
                }
              }}
              placeholder="Search customer..."
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>

            <select
              id="status"
              value={searchParams.get("status") ?? ""}
              onChange={(event) => updateFilter("status", event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RESOLVED">Resolved</option>
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
        {total} investigation{total !== 1 ? "s" : ""}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Started</th>

                <th className="px-4 py-3 text-left font-medium">Customer</th>

                <th className="px-4 py-3 text-left font-medium">Alert</th>

                <th className="px-4 py-3 text-left font-medium">Risk</th>

                <th className="px-4 py-3 text-left font-medium">Status</th>

                <th className="px-4 py-3 text-left font-medium">Analyst</th>

                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {investigations.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No investigations found.
                  </td>
                </tr>
              ) : (
                investigations.map((investigation) => (
                  <tr key={investigation.id} className="hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(investigation.startedAt)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {investigation.alert.customer.name}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {investigation.alert.customer.customerNumber}
                      </div>
                    </td>

                    <td className=" px-4 py-3">
                      <div className="truncate font-medium">
                        {investigation.alert.title}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {investigation.alert.id}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getRiskClass(
                          investigation.alert.riskLevel,
                        )}`}
                      >
                        {investigation.alert.riskLevel}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          investigation.status,
                        )}`}
                      >
                        {formatStatus(investigation.status)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {investigation.analyst.name}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {investigation.analyst.email}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm">
                        <Link href={`/investigations/${investigation.id}`}>
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
