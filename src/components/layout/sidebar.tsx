import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  CreditCard,
  FileSearch,
  History,
  LayoutDashboard,
  Settings2,
  User,
  UserPlus,
  UserRoundSearch,
  Users,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/lib/auth/get-current-user";

const mainNavigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: BarChart3,
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Investigations",
    href: "/investigations",
    icon: FileSearch,
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: CreditCard,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];

const adminNavigation = [
  {
    title: "AML Rules",
    href: "/rules",
    icon: Settings2,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Audit Logs",
    href: "/audit-logs",
    icon: History,
  },
];

export async function Sidebar() {
  const user = await getCurrentUser();

  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-background md:block">
      <div className="flex h-full flex-col">
        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Monitoring
          </p>

          {mainNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}

          {/* Customers */}
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <UserRoundSearch className="h-4 w-4" />

              <span className="flex-1">Customers</span>

              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>

            <div className="ml-4 mt-1 space-y-1 border-l pl-3">
              <Link
                href="/customers"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <UserRoundSearch className="h-4 w-4" />
                All Customers
              </Link>

              <Link
                href="/customers/new"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <UserPlus className="h-4 w-4" />
                Add Customer
              </Link>
            </div>
          </details>

          {/* Admin navigation */}
          {user?.role === "ADMIN" && (
            <>
              <div className="my-4">
                <Separator />
              </div>

              <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Administration
              </p>

              {adminNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}
