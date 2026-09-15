import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";

import { getDashboardStats } from "@/lib/dashboard/get-dashboard-stats";
import { getRecentAlerts } from "@/lib/dashboard/get-recent-alerts";

import { TransactionAlertChart } from "@/components/dashboard/transaction-alert-chart";
import { getDashboardTrends } from "@/lib/dashboard/get-dashboard-trends";

import { RiskDistributionChart } from "@/components/dashboard/risk-distribution-chart";
import { getRiskDistribution } from "@/lib/dashboard/get-risk-distribution";

import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";

export default async function DashboardPage() {
  const [stats, recentAlerts, trends, riskDistribution] = await Promise.all([
    getDashboardStats(),
    getRecentAlerts(),
    getDashboardTrends(),
    getRiskDistribution(),
  ]);

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard title="Customers" value={stats.totalCustomers} />

        <DashboardStatCard title="Accounts" value={stats.totalAccounts} />

        <DashboardStatCard
          title="Transactions"
          value={stats.totalTransactions}
        />

        <DashboardStatCard title="Total Alerts" value={stats.totalAlerts} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <DashboardStatCard title="Open Alerts" value={stats.openAlerts} />

        <DashboardStatCard
          title="Investigating"
          value={stats.investigatingAlerts}
        />

        <DashboardStatCard title="Escalated" value={stats.escalatedAlerts} />

        <DashboardStatCard title="High Risk" value={stats.highRiskAlerts} />

        <DashboardStatCard title="Critical" value={stats.criticalAlerts} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TransactionAlertChart data={trends} />

        <RiskDistributionChart data={riskDistribution} />
      </div>

      <DashboardQuickActions />

      <RecentAlerts alerts={recentAlerts} />
    </div>
  );
}
