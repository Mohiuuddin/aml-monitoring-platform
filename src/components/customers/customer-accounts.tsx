import Link from "next/link";
import { Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { getCustomerAccounts } from "@/lib/accounts/get-customer-accounts";

interface CustomerAccountsProps {
  customerId: string;
}

export async function CustomerAccounts({ customerId }: CustomerAccountsProps) {
  const accounts = await getCustomerAccounts(customerId);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bank Accounts</CardTitle>

        <Button variant="outline" size="sm">
          <Link
            href={`/customers/${customerId}/accounts/new`}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Open Account
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        {accounts.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No bank accounts found.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Open a bank account for this customer to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{account.accountNo}</p>

                  <p className="text-sm text-muted-foreground">
                    {account.currency}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium">
                    {account.balance.toString()} {account.currency}
                  </p>

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
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
