import { InvestigationsTable } from "@/components/investigations/investigations-table";
import { getInvestigations } from "@/lib/investigations/get-investigations";

interface InvestigationsPageProps {
  searchParams: Promise<{
    page?: string;
    customer?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }>;
}

export default async function InvestigationsPage({
  searchParams,
}: InvestigationsPageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;

  const result = await getInvestigations({
    page,
    pageSize: 10,
    customer: params.customer ?? "",
    status: params.status ?? "",
    fromDate: params.fromDate ?? "",
    toDate: params.toDate ?? "",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Investigations</h1>

        <p className="text-sm text-muted-foreground">
          Review and manage AML investigations.
        </p>
      </div>

      <InvestigationsTable
        investigations={result.investigations}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
      />
    </div>
  );
}
