import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CreateTransactionForm } from "@/components/transactions/create-transaction-form";
import { getActiveAccounts } from "@/lib/accounts/get-active-accounts";

export default async function NewTransactionPage() {
  const accounts = await getActiveAccounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Create Transaction</h1>

          <p className="text-sm text-muted-foreground">
            Create a new transaction for an active account.
          </p>
        </div>

        <Button variant="outline">
          <Link href="/transactions">Back to Transactions</Link>
        </Button>
      </div>

      <div className="max-w-2xl rounded-lg border bg-card p-6">
        {accounts.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No active accounts are available.
            </p>

            <Button className="mt-4 bg-green-600 text-white hover:bg-green-700">
              <Link href="/accounts">View Accounts</Link>
            </Button>
          </div>
        ) : (
          <CreateTransactionForm accounts={accounts} />
        )}
      </div>
    </div>
  );
}
