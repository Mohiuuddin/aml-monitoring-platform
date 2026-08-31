import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CustomersTable } from "@/components/customers/customers-table";

export default function CustomersPage() {
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

      <CustomersTable />
    </div>
  );
}
