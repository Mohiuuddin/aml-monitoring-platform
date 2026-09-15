import { ArrowRight, Bell, FileSearch, Receipt, Users } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "Review Alerts",
    description: "Investigate flagged transactions",
    href: "/alerts",
    icon: Bell,
    iconClass: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
  },
  {
    title: "Transactions",
    description: "Review transaction activity",
    href: "/transactions",
    icon: Receipt,
    iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    title: "Customers",
    description: "Review customer risk profiles",
    href: "/customers",
    icon: Users,
    iconClass:
      "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
  },
  {
    title: "Investigations",
    description: "Manage active investigations",
    href: "/investigations",
    icon: FileSearch,
    iconClass:
      "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  },
];

export function DashboardQuickActions() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold">Quick Actions</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Access the main monitoring workflows.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
              </div>

              <div className="mt-5">
                <p className="font-medium">{action.title}</p>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
