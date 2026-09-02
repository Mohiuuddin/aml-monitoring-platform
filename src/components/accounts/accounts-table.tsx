"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Account {
  id: string;
  accountNo: string;
  currency: string;
  balance: string;
  status: string;
  openedAt: Date;
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
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Opened</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
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
                        account.status === "ACTIVE"
                          ? "default"
                          : account.status === "BLOCKED"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {account.status}
                    </Badge>
                  </TableCell>

                  <TableCell>{account.openedAt.toLocaleDateString()}</TableCell>

                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Link href={`/accounts/${account.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {totalAccounts} account{totalAccounts !== 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage <= 1}>
              {currentPage > 1 ? (
                <Link href={`/accounts?page=${currentPage - 1}`}>Previous</Link>
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
                <Link href={`/accounts?page=${currentPage + 1}`}>Next</Link>
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
