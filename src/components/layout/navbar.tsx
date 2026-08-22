"use client";

import Link from "next/link";
import { Bell, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Navbar() {
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
          {/* Notifications */}
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User */}
          <Button variant="ghost" className="flex items-center gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium">Analyst</p>
              <p className="text-xs text-muted-foreground">AML Analyst</p>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
