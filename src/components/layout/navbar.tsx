import Link from "next/link";
import { Bell, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/userMenu";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <ShieldCheck className="h-6 w-6" />
          <span>AML Monitor</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          {user && (
            <UserMenu
              name={user.name}
              email={user.email}
              role={user.role}
              image={user.image ?? ""}
            />
          )}
        </div>
      </div>
    </header>
  );
}
