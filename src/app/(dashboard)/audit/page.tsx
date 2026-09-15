import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAuditLogs } from "@/lib/audit/get-audit-logs";
import { AuditLogsTable } from "@/components/audit/audit-logs-table";

interface AuditPageProps {
  searchParams: Promise<{
    page?: string;
    action?: string;
    fromDate?: string;
    toDate?: string;
  }>;
}

export default async function AuditPage({ searchParams }: AuditPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const params = await searchParams;

  const page = Math.max(Number(params.page) || 1, 1);

  const result = await getAuditLogs({
    page,
    pageSize: 10,
    action: params.action,
    fromDate: params.fromDate,
    toDate: params.toDate,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit Logs</h1>

        <p className="text-sm text-muted-foreground">
          Review system activity and investigation events.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <p className="text-sm text-muted-foreground">
          Total audit logs:{" "}
          <span className="font-medium text-foreground">{result.total}</span>
        </p>
      </div>

      <AuditLogsTable
        auditLogs={result.auditLogs}
        page={result.page}
        totalPages={result.totalPages}
      />
    </div>
  );
}
