import Link from "next/link";
import { ToggleUserStatusButton } from "@/components/users/toggle-user-status-button";
import { ResetUserPasswordButton } from "@/components/users/reset-user-password-button";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ANALYST";
  status: "ACTIVE" | "DISABLED";
  createdAt: Date;
}

interface UsersTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  role?: "ADMIN" | "ANALYST";
  status?: "ACTIVE" | "DISABLED";
}

export function UsersTable({
  users,
  currentPage,
  totalPages,
  totalUsers,
  role,
  status,
}: UsersTableProps) {
  const pageSize = 10;

  const start = totalUsers === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalUsers);

  function createPageUrl(page: number) {
    const params = new URLSearchParams();

    params.set("page", String(page));

    if (role) {
      params.set("role", role);
    }

    if (status) {
      params.set("status", status);
    }

    return `/users?${params.toString()}`;
  }

  function createFilterUrl(
    newRole?: "ADMIN" | "ANALYST",
    newStatus?: "ACTIVE" | "DISABLED",
  ) {
    const params = new URLSearchParams();

    params.set("page", "1");

    if (newRole) {
      params.set("role", newRole);
    }

    if (newStatus) {
      params.set("status", newStatus);
    }

    const query = params.toString();

    return query ? `/users?${query}` : "/users";
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="h-5 w-5" />
              Users
            </CardTitle>

            <CardDescription className="mt-1">
              Manage user access and account status.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{totalUsers}</span>
            {totalUsers === 1 ? "user" : "users"}
          </div>
        </div>
        {/* Filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            Filters:
          </div>

          <Link
            href={createFilterUrl()}
            className={`rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted ${
              !role && !status ? "bg-muted font-medium" : ""
            }`}
          >
            All
          </Link>

          <Link
            href={createFilterUrl("ADMIN", status)}
            className={`rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted ${
              role === "ADMIN" ? "bg-muted font-medium" : ""
            }`}
          >
            Admin
          </Link>

          <Link
            href={createFilterUrl("ANALYST", status)}
            className={`rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted ${
              role === "ANALYST" ? "bg-muted font-medium" : ""
            }`}
          >
            Analyst
          </Link>

          <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

          <Link
            href={createFilterUrl(role, "ACTIVE")}
            className={`rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted ${
              status === "ACTIVE" ? "bg-muted font-medium" : ""
            }`}
          >
            Active
          </Link>

          <Link
            href={createFilterUrl(role, "DISABLED")}
            className={`rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted ${
              status === "DISABLED" ? "bg-muted font-medium" : ""
            }`}
          >
            Disabled
          </Link>

          {(role || status) && (
            <Link
              href="/users"
              className="ml-1 flex items-center gap-1 px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <XCircle className="h-4 w-4" />
              Clear
            </Link>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-6">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserRound className="h-8 w-8 text-muted-foreground/50" />

                      <p className="font-medium">No users found</p>

                      <p className="text-sm text-muted-foreground">
                        Try changing your filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    {/* User */}
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          <UserRound className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div>
                          <p className="font-medium">{user.name}</p>

                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "default" : "secondary"
                        }
                        className="gap-1"
                      >
                        {user.role === "ADMIN" ? (
                          <Shield className="h-3 w-3" />
                        ) : (
                          <UserRound className="h-3 w-3" />
                        )}

                        {user.role}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {user.status === "ACTIVE" ? (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Disabled
                        </Badge>
                      )}
                    </TableCell>

                    {/* Created */}
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-6">
                      <div className="flex justify-end gap-2">
                        {/* <Button variant="outline" size="sm">
                          <Power className="mr-2 h-4 w-4" />

                          {user.status === "ACTIVE" ? "Disable" : "Activate"}
                        </Button> */}

                        <ToggleUserStatusButton
                          userId={user.id}
                          status={user.status}
                        />

                        {/* <Button variant="outline" size="sm">
                          <KeyRound className="mr-2 h-4 w-4" />
                          Reset Password
                        </Button> */}
                        <ResetUserPasswordButton userId={user.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{start}</span>{" "}
            to <span className="font-medium text-foreground">{end}</span> of{" "}
            <span className="font-medium text-foreground">{totalUsers}</span>{" "}
            users
          </p>

          <div className="flex items-center gap-2">
            {currentPage > 1 ? (
              <Button variant="outline" size="sm">
                <Link href={createPageUrl(currentPage - 1)}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
            )}

            <div className="min-w-24 text-center text-sm">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </div>

            {currentPage < totalPages ? (
              <Button variant="outline" size="sm">
                <Link href={createPageUrl(currentPage + 1)}>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
