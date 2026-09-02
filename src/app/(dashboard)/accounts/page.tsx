import { AccountsTable } from "@/components/accounts/accounts-table";
import { getAllAccounts } from "@/lib/accounts/get-all-accounts";

interface AccountsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function AccountsPage({
  searchParams,
}: AccountsPageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;

  const { accounts, totalAccounts, totalPages, currentPage } =
    await getAllAccounts(page);

  const serializedAccounts = accounts.map((account) => ({
    ...account,
    balance: account.balance.toString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Accounts</h1>

        <p className="text-sm text-muted-foreground">
          View and manage all bank accounts.
        </p>
      </div>

      <AccountsTable
        accounts={serializedAccounts}
        totalAccounts={totalAccounts}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
