"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ChangeStatusDialog } from "@/components/accounts/change-status-dialog";

interface Account {
  id: string;
  accountNo: string;
  currency: string;
  balance: string;
  status: string;
  openedAt: string;
  customer: {
    id: string;
    customerNumber: string;
    name: string;
  };
}

interface AccountsTableProps {
  accounts: Account[];
  totalAccounts: number;
  totalPages: number;
  currentPage: number;
}

export function AccountsTable({
  accounts,
  totalAccounts,
  totalPages,
  currentPage,
}: AccountsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customerName, setCustomerName] = useState(
    searchParams.get("customerName") ?? "",
  );

  const currency = searchParams.get("currency") ?? "";
  const status = searchParams.get("status") ?? "";

  function updateFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    params.set("page", "1");

    router.push(`/accounts?${params.toString()}`);
  }

  function clearFilters() {
    setCustomerName("");

    router.push("/accounts");
  }

  function getPageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());

    return `/accounts?${params.toString()}`;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer</Label>

          <Input
            id="customerName"
            placeholder="Search customer..."
            value={customerName}
            onChange={(event) => {
              setCustomerName(event.target.value);
              updateFilter("customerName", event.target.value);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>

          <select
            id="currency"
            value={currency}
            onChange={(event) => updateFilter("currency", event.target.value)}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">All Currencies</option>
            <option value="BDT">BDT</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>

          <select
            id="status"
            value={status}
            onChange={(event) => updateFilter("status", event.target.value)}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLOCKED">Blocked</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <Button type="button" variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No accounts found.
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    {account.accountNo}
                  </TableCell>

                  <TableCell>
                    <div>
                      <p>{account.customer.name}</p>

                      <p className="text-xs text-muted-foreground">
                        {account.customer.customerNumber}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>{account.currency}</TableCell>

                  <TableCell>{account.balance}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        account.status === "BLOCKED" ||
                        account.status === "CLOSED"
                          ? "destructive"
                          : account.status === "INACTIVE"
                            ? "default"
                            : "outline"
                      }
                      className={
                        account.status === "ACTIVE"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : ""
                      }
                    >
                      {account.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <ChangeStatusDialog
                        accountId={account.id}
                        currentStatus={
                          account.status as
                            | "ACTIVE"
                            | "INACTIVE"
                            | "BLOCKED"
                            | "CLOSED"
                        }
                      />

                      <Button variant="outline" size="sm">
                        <Link href={`/accounts/${account.id}`}>View</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {totalAccounts} account
            {totalAccounts !== 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage <= 1}>
              {currentPage > 1 ? (
                <Link href={getPageUrl(currentPage - 1)}>Previous</Link>
              ) : (
                "Previous"
              )}
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
            >
              {currentPage < totalPages ? (
                <Link href={getPageUrl(currentPage + 1)}>Next</Link>
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
