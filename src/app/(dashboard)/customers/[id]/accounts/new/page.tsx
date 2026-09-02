import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateAccountForm } from "@/components/accounts/create-account-form";

import { getCustomer } from "@/lib/customers/get-customer";

interface NewAccountPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewAccountPage({ params }: NewAccountPageProps) {
  const { id } = await params;

  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Open Bank Account</h1>

        <p className="text-sm text-muted-foreground">
          Open a new bank account for {customer.name} ({customer.customerNumber}
          ).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>

        <CardContent>
          <CreateAccountForm customerId={customer.id} />
        </CardContent>
      </Card>
    </div>
  );
}
