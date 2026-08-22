import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileSearch,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Transactions",
    value: "12,458",
    description: "Transactions monitored",
    icon: ArrowUpFromLine,
  },
  {
    title: "Open Alerts",
    value: "48",
    description: "Require attention",
    icon: AlertTriangle,
  },
  {
    title: "High-Risk Alerts",
    value: "12",
    description: "High or critical risk",
    icon: ArrowDownToLine,
  },
  {
    title: "Active Investigations",
    value: "7",
    description: "Currently under review",
    icon: FileSearch,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AML Dashboard</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Overview of transaction monitoring and suspicious activity.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>

                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent alerts to display.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Investigations</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent investigations to display.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
