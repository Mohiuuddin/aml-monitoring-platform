"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  FileSearch,
  History,
  LayoutDashboard,
  Settings2,
  ShieldCheck,
  Users,
  UserRoundSearch,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

type UserRole = "ADMIN" | "ANALYST";

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
    title: "Customers",
    href: "/customers",
    icon: UserRoundSearch,
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

export function Sidebar() {
  // Temporary role.
  // We will get this from the Better Auth session later.
  const role: UserRole = "ANALYST";

  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-background md:block">
      <div className="flex h-full flex-col">
        {/* Platform */}
        <div className="flex h-16 items-center gap-2 px-6">
          <ShieldCheck className="h-5 w-5" />

          <span className="text-sm font-semibold">Monitoring</span>
        </div>

        <Separator />

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

          {/* Admin navigation */}
          {role === "ADMIN" && (
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

        {/* Bottom */}
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground">
            Rule-Based AML Monitoring
          </p>
        </div>
      </div>
    </aside>
  );
}
