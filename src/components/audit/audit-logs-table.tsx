"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "STATUS_CHANGE"
  | "INVESTIGATION_STARTED"
  | "INVESTIGATION_UPDATED"
  | "ALERT_ESCALATED"
  | "ALERT_CLOSED";

interface AuditLog {
  id: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  metadata: unknown;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface AuditLogsTableProps {
  auditLogs: AuditLog[];
  page: number;
  totalPages: number;
}

export function AuditLogsTable({
  auditLogs,
  page,
  totalPages,
}: AuditLogsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [action, setAction] = useState(searchParams.get("action") ?? "");

  const [fromDate, setFromDate] = useState(searchParams.get("fromDate") ?? "");

  const [toDate, setToDate] = useState(searchParams.get("toDate") ?? "");

  function applyFilters() {
    const params = new URLSearchParams();

    if (action) {
      params.set("action", action);
    }

    if (fromDate) {
      params.set("fromDate", fromDate);
    }

    if (toDate) {
      params.set("toDate", toDate);
    }

    params.set("page", "1");

    router.push(`/audit?${params.toString()}`);
  }

  function clearFilters() {
    setAction("");
    setFromDate("");
    setToDate("");

    router.push("/audit");
  }

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(nextPage));

    router.push(`/audit?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg border p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <label htmlFor="audit-action" className="text-sm font-medium">
              Action
            </label>

            <select
              id="audit-action"
              value={action}
              onChange={(event) => setAction(event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="STATUS_CHANGE">Status Change</option>
              <option value="INVESTIGATION_STARTED">
                Investigation Started
              </option>
              <option value="INVESTIGATION_UPDATED">
                Investigation Updated
              </option>
              <option value="ALERT_ESCALATED">Alert Escalated</option>
              <option value="ALERT_CLOSED">Alert Closed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="audit-from-date" className="text-sm font-medium">
              From Date
            </label>

            <input
              id="audit-from-date"
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="audit-to-date" className="text-sm font-medium">
              To Date
            </label>

            <input
              id="audit-to-date"
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Apply
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="h-10 rounded-md border px-4 text-sm font-medium hover:bg-muted"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        {auditLogs.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            No audit logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">User</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                  <th className="px-4 py-3 text-left font-medium">Entity</th>
                  <th className="px-4 py-3 text-left font-medium">Entity ID</th>
                </tr>
              </thead>

              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{log.user.name}</p>

                        <p className="text-xs text-muted-foreground">
                          {log.user.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3">{log.action}</td>

                    <td className="px-4 py-3">{log.entity}</td>

                    <td className="px-4 py-3">
                      <Link
                        href={`/audit/${log.id}`}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {log.entityId}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
