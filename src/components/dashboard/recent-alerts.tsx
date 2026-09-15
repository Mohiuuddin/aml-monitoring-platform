import Link from "next/link";

interface RecentAlert {
  id: string;
  title: string;
  riskScore: number;
  riskLevel: string;
  status: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    customerNumber: string;
  };
}

interface RecentAlertsProps {
  alerts: RecentAlert[];
}

const riskStyles = {
  LOW: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  MEDIUM: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  CRITICAL: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const riskIndicatorStyles = {
  LOW: "bg-green-500",
  MEDIUM: "bg-blue-500",
  HIGH: "bg-orange-500",
  CRITICAL: "bg-red-500",
};

const statusStyles = {
  OPEN: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  INVESTIGATING:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  ESCALATED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  FALSE_POSITIVE: "bg-muted text-muted-foreground",
  CLOSED: "bg-muted text-muted-foreground",
};

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h2 className="font-semibold">Recent Alerts</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Latest AML alerts requiring attention.
          </p>
        </div>

        <Link
          href="/alerts"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Empty State */}
      {alerts.length === 0 ? (
        <div className="p-6 text-sm text-muted-foreground">
          No alerts found.
        </div>
      ) : (
        <div className="divide-y">
          {alerts.map((alert) => {
            const riskStyle =
              riskStyles[alert.riskLevel as keyof typeof riskStyles] ??
              "bg-muted text-muted-foreground";

            const riskIndicator =
              riskIndicatorStyles[
                alert.riskLevel as keyof typeof riskIndicatorStyles
              ] ?? "bg-muted-foreground";

            const statusStyle =
              statusStyles[alert.status as keyof typeof statusStyles] ??
              "bg-muted text-muted-foreground";

            return (
              <Link
                key={alert.id}
                href={`/alerts/${alert.id}`}
                className="group block px-6 py-5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-between gap-6">
                  {/* Alert Information */}
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${riskIndicator}`}
                    />

                    <div className="min-w-0">
                      <p className="truncate font-medium group-hover:text-primary">
                        {alert.title}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {alert.customer.name} <span className="mx-1">·</span>{" "}
                        {alert.customer.customerNumber}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Alert Details */}
                  <div className="flex items-center gap-3">
                    {/* Risk Score */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Score
                      </span>

                      <span className="text-sm font-semibold">
                        {alert.riskScore}
                      </span>
                    </div>

                    {/* Risk Level */}
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${riskStyle}`}
                    >
                      {alert.riskLevel}
                    </span>

                    {/* Status */}
                    <span
                      className={`hidden rounded-full px-2.5 py-1 text-xs font-medium md:inline-flex ${statusStyle}`}
                    >
                      {alert.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
