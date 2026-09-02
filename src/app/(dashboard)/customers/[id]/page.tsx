import { notFound } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { getCustomer } from "@/lib/customers/get-customer";
import { CustomerDetails } from "@/components/customers/customer-details";
import { CustomerAccounts } from "@/components/customers/customer-accounts";

interface CustomerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;

  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{customer.name}</h1>

          <p className="text-sm text-muted-foreground">
            Customer details and account information.
          </p>
        </div>

        <Button variant="outline">
          <Link href="/customers">Back to Customers</Link>
        </Button>
      </div>

      <CustomerDetails customer={customer} />
      <CustomerAccounts customerId={customer.id} />
    </div>
  );
}
