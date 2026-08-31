import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { getCustomers } from "@/lib/customers/get-customers";

interface CustomersTableProps {
  page: number;
}

export async function CustomersTable({ page }: CustomersTableProps) {
  const { customers, totalCustomers, totalPages, currentPage } =
    await getCustomers(page);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>

                      <p className="text-xs text-muted-foreground">
                        {customer.customerNumber}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>{customer.email ?? "-"}</TableCell>

                  <TableCell>{customer.phone ?? "-"}</TableCell>

                  <TableCell>{customer.country}</TableCell>

                  <TableCell>
                    <Badge variant="outline">{customer.riskLevel}</Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        customer.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {customer.createdAt.toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      View
                    </Link>
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
            {totalCustomers} customer{totalCustomers !== 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-2">
            {currentPage > 1 ? (
              <Link
                href={`/customers?page=${currentPage - 1}`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium opacity-50">
                Previous
              </span>
            )}

            <span className="px-2 text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={`/customers?page=${currentPage + 1}`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Next
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium opacity-50">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
