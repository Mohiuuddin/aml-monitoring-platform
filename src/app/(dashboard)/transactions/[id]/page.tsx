import { notFound } from "next/navigation";

import { TransactionDetails } from "@/components/transactions/transaction-details";
import { getTransaction } from "@/lib/transactions/get-transaction";

interface TransactionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TransactionPage({
  params,
}: TransactionPageProps) {
  const { id } = await params;

  const transaction = await getTransaction(id);

  if (!transaction) {
    notFound();
  }

  return <TransactionDetails transaction={transaction} />;
}
