import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAuditLog } from "@/lib/audit/get-audit-log";

interface AuditLogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AuditLogPage({ params }: AuditLogPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { id } = await params;

  const auditLog = await getAuditLog(id);

  if (!auditLog) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/audit"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Audit Logs
        </Link>

        <h1 className="mt-3 text-2xl font-semibold">Audit Log Details</h1>

        <p className="text-sm text-muted-foreground">
          Review the details of this system activity.
        </p>
      </div>

      <div className="rounded-lg border">
        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Action</p>

            <p className="mt-1 font-medium">{auditLog.action}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Date</p>

            <p className="mt-1 font-medium">
              {new Date(auditLog.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">User</p>

            <p className="mt-1 font-medium">{auditLog.user.name}</p>

            <p className="text-sm text-muted-foreground">
              {auditLog.user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">User Role</p>

            <p className="mt-1 font-medium">{auditLog.user.role}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Entity</p>

            <p className="mt-1 font-medium">{auditLog.entity}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Entity ID</p>

            <p className="mt-1 break-all font-mono text-sm">
              {auditLog.entityId}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Metadata</h2>
        </div>

        <pre className="overflow-x-auto p-6 text-sm">
          {auditLog.metadata
            ? JSON.stringify(auditLog.metadata, null, 2)
            : "No metadata available."}
        </pre>
      </div>
    </div>
  );
}
