import { notFound } from "next/navigation";

import { AlertDetails } from "@/components/alerts/alert-details";
import { getAlert } from "@/lib/alerts/get-alert";

interface AlertDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AlertDetailsPage({
  params,
}: AlertDetailsPageProps) {
  const { id } = await params;

  const alert = await getAlert(id);

  if (!alert) {
    notFound();
  }

  const serializedAlert = {
    ...alert,
    riskScore: Number(alert.riskScore),
    createdAt: alert.createdAt.toISOString(),
    updatedAt: alert.updatedAt.toISOString(),

    transaction: alert.transaction
      ? {
          ...alert.transaction,
          amount: alert.transaction.amount.toString(),
          transactionAt: alert.transaction.transactionAt.toISOString(),
        }
      : null,

    triggeredRules: alert.triggeredRules.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    })),
  };

  return <AlertDetails alert={serializedAlert} />;
}
