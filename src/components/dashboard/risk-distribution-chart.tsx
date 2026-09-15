"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface RiskDistribution {
  riskLevel: string;
  count: number;
}

interface RiskDistributionChartProps {
  data: RiskDistribution[];
}

const riskColors = {
  LOW: "#22c55e",
  MEDIUM: "#3b82f6",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

export function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  const totalAlerts = data.reduce((total, item) => total + item.count, 0);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      {/* Header */}
      <div className="border-b p-6">
        <h2 className="text-base font-semibold">Alert Risk Distribution</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Current alerts grouped by risk level
        </p>
      </div>

      {/* Content */}
      <div className="grid gap-6 p-6 sm:grid-cols-[1fr_180px] sm:items-center">
        {/* Chart */}
        <div className="relative h-70">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="riskLevel"
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={3}
                data-testid="risk-distribution-chart"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.riskLevel}
                    fill={
                      riskColors[entry.riskLevel as keyof typeof riskColors]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold">{totalAlerts}</span>

            <span className="text-xs text-muted-foreground">Total Alerts</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.riskLevel}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      riskColors[item.riskLevel as keyof typeof riskColors],
                  }}
                />

                <span className="text-sm">{item.riskLevel}</span>
              </div>

              <span className="text-sm font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
