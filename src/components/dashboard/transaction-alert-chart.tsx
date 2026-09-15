"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardTrend {
  date: string;
  transactions: number;
  alerts: number;
}

interface TransactionAlertChartProps {
  data: DashboardTrend[];
}

export function TransactionAlertChart({ data }: TransactionAlertChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  const totalTransactions = data.reduce(
    (total, item) => total + item.transactions,
    0,
  );

  const totalAlerts = data.reduce((total, item) => total + item.alerts, 0);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">
            Transaction & Alert Activity
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Activity over the last 7 days
          </p>
        </div>

        <div className="flex gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Transactions</p>
            <p className="mt-1 text-lg font-semibold">{totalTransactions}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Alerts</p>
            <p className="mt-1 text-lg font-semibold">{totalAlerts}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />

              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />

              <Tooltip />

              <Legend verticalAlign="top" align="right" height={36} />

              <Line
                type="monotone"
                dataKey="transactions"
                name="Transactions"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="alerts"
                name="Alerts"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
