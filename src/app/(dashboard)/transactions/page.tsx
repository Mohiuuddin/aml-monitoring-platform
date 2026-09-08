import Link from "next/link";

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

        <Link
          href="/transactions/new/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          Create Transaction
        </Link>
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
