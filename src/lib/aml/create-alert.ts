import prisma from "@/lib/prisma";
import { evaluateTransactionRisk } from "@/lib/aml/rule-engine";

interface CreateAlertInput {
  transactionId: string;
}

export async function createAlertForTransaction({
  transactionId,
}: CreateAlertInput) {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
    select: {
      id: true,
      customerId: true,
      accountId: true,
      amount: true,
      currency: true,
      type: true,
      direction: true,
      counterparty: true,
      counterpartyCountry: true,
      transactionAt: true,
    },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  const result = await evaluateTransactionRisk({
    id: transaction.id,
    customerId: transaction.customerId,
    accountId: transaction.accountId,
    amount: transaction.amount.toString(),
    currency: transaction.currency,
    type: transaction.type,
    direction: transaction.direction,
    counterparty: transaction.counterparty,
    counterpartyCountry: transaction.counterpartyCountry,
    transactionAt: transaction.transactionAt,
  });

  if (result.triggeredRules.length === 0) {
    return null;
  }

  const triggeredRuleNames = result.triggeredRules
    .map((rule) => rule.code.replaceAll("_", " "))
    .join(", ");

  const alert = await prisma.alert.create({
    data: {
      customerId: transaction.customerId,
      transactionId: transaction.id,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      title: `AML alert: ${result.riskLevel} risk transaction`,
      description: `Triggered AML rules: ${triggeredRuleNames}.`,
      triggeredRules: {
        create: result.triggeredRules.map((rule) => ({
          ruleId: rule.ruleId,
        })),
      },
    },
    include: {
      triggeredRules: {
        include: {
          rule: true,
        },
      },
    },
  });

  return alert;
}
