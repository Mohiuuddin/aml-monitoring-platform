import { notFound } from "next/navigation";

import { InvestigationDetails } from "@/components/investigations/investigation-details";
import { getInvestigation } from "@/lib/investigations/get-investigation";

interface InvestigationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvestigationPage({
  params,
}: InvestigationPageProps) {
  const { id } = await params;

  const investigation = await getInvestigation(id);

  if (!investigation) {
    notFound();
  }

  return <InvestigationDetails investigation={investigation} />;
}
