import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { getTransactions } from "@/lib/transactions/get-transactions";

interface TransactionsPageProps {
  searchParams: Promise<{
    page?: string;
    customer?: string;
    account?: string;
    type?: string;
    direction?: "CREDIT" | "DEBIT";
    fromDate?: string;
    toDate?: string;
  }>;
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);

  const { transactions, total, totalPages } = await getTransactions({
    page,
    pageSize: 10,
    customer: params.customer ?? "",
    account: params.account ?? "",
    type: params.type ?? "",
    direction: params.direction ?? "",
    fromDate: params.fromDate ?? "",
    toDate: params.toDate ?? "",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>

          <p className="text-sm text-muted-foreground">
            Monitor and review customer transactions.
          </p>
        </div>

        <Button className="bg-green-600 text-white hover:bg-green-700">
          <Link href="/transactions/new">Create Transaction</Link>
        </Button>
      </div>

      {/* Transactions */}
      <TransactionsTable
        transactions={transactions}
        total={total}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
