import { notFound } from "next/navigation";

import { AccountDetails } from "@/components/accounts/account-details";
import { getAccount } from "@/lib/accounts/get-account";

interface AccountPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { id } = await params;

  const account = await getAccount(id);

  if (!account) {
    notFound();
  }

  const serializedAccount = {
    ...account,
    balance: account.balance.toString(),
    openedAt: account.openedAt.toISOString(),

    transactions: account.transactions.map((transaction) => ({
      ...transaction,
      amount: transaction.amount.toString(),
      transactionAt: transaction.transactionAt.toISOString(),
    })),
  };

  return <AccountDetails account={serializedAccount} />;
}
