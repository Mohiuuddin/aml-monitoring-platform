interface DashboardStatCardProps {
  title: string;
  value: number;
}

export function DashboardStatCard({ title, value }: DashboardStatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <p className="text-sm text-muted-foreground">{title}</p>

      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
