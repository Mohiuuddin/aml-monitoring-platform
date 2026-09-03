import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CustomersTable } from "@/components/customers/customers-table";
import { getCustomers } from "@/lib/customers/get-customers";

interface CustomersPageProps {
  searchParams: Promise<{
    page?: string;
    name?: string;
    phone?: string;
    country?: string;
    riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
  }>;
}

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;

  const { customers, totalCustomers, totalPages, currentPage } =
    await getCustomers({
      page,
      name: params.name,
      phone: params.phone,
      country: params.country,
      riskLevel: params.riskLevel,
      status: params.status,
    });

  const serializedCustomers = customers.map((customer) => ({
    ...customer,
    createdAt: customer.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Customers</h1>

          <p className="text-sm text-muted-foreground">
            Manage customers and monitor their AML risk.
          </p>
        </div>

        <Button>
          <Link href="/customers/new">Add Customer</Link>
        </Button>
      </div>

      <CustomersTable
        customers={serializedCustomers}
        totalCustomers={totalCustomers}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
