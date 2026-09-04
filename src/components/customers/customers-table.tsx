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

import { ChangeStatusDialog } from "@/components/customers/change-status-dialog";

interface Customer {
  id: string;
  customerNumber: string;
  name: string;
  email: string | null;
  phone: string | null;
  country: string;
  riskLevel: string;
  status: string;
  createdAt: string;
}

interface CustomersTableProps {
  customers: Customer[];
  totalCustomers: number;
  totalPages: number;
  currentPage: number;
}

export function CustomersTable({
  customers,
  totalCustomers,
  totalPages,
  currentPage,
}: CustomersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState(searchParams.get("name") ?? "");
  const [phone, setPhone] = useState(searchParams.get("phone") ?? "");
  const [country, setCountry] = useState(searchParams.get("country") ?? "");

  const riskLevel = searchParams.get("riskLevel") ?? "";
  const status = searchParams.get("status") ?? "";

  function updateFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    params.set("page", "1");

    router.push(`/customers?${params.toString()}`);
  }

  function clearFilters() {
    setName("");
    setPhone("");
    setCountry("");

    router.push("/customers");
  }

  function getPageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());

    return `/customers?${params.toString()}`;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-4 rounded-md border p-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            placeholder="Search name..."
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              updateFilter("name", event.target.value);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>

          <Input
            id="phone"
            placeholder="Search phone..."
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              updateFilter("phone", event.target.value);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>

          <Input
            id="country"
            placeholder="Search country..."
            value={country}
            onChange={(event) => {
              setCountry(event.target.value);
              updateFilter("country", event.target.value);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="riskLevel">Risk Level</Label>

          <select
            id="riskLevel"
            value={riskLevel}
            onChange={(event) => updateFilter("riskLevel", event.target.value)}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">All Risk Levels</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>

          <select
            id="status"
            value={status}
            onChange={(event) => updateFilter("status", event.target.value)}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <div className="md:col-span-2 lg:col-span-5">
          <Button type="button" variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Table */}
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
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
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
                        customer.status === "BLOCKED"
                          ? "destructive"
                          : "default"
                      }
                      className={
                        customer.status === "ACTIVE"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : ""
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <ChangeStatusDialog
                        customerId={customer.id}
                        currentStatus={
                          customer.status as "ACTIVE" | "INACTIVE" | "BLOCKED"
                        }
                      />

                      <Button variant="outline" size="sm">
                        <Link href={`/customers/${customer.id}`}>View</Link>
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
            {totalCustomers} customer
            {totalCustomers !== 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-2">
            {currentPage > 1 ? (
              <Link
                href={getPageUrl(currentPage - 1)}
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
                href={getPageUrl(currentPage + 1)}
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
