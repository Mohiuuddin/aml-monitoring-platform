import prisma from "@/lib/prisma";
import { calculateRiskScore } from "@/lib/aml/risk-scoring";

const CTR_THRESHOLD_BDT = 1_000_000;
const LOOKBACK_DAYS = 30;
const RAPID_MOVEMENT_HOURS = 24;

export interface RuleEvaluationTransaction {
  id: string;
  customerId: string;
  accountId: string;
  amount: string;
  currency: string;
  type:
    | "CASH_DEPOSIT"
    | "CASH_WITHDRAWAL"
    | "TRANSFER"
    | "CARD_PAYMENT"
    | "INTERNATIONAL_TRANSFER";
  direction: "CREDIT" | "DEBIT";
  counterparty: string | null;
  counterpartyCountry: string | null;
  transactionAt: Date;
}

interface TriggeredRule {
  ruleId: string;
  code: string;
  riskWeight: number;
}

export async function evaluateTransaction(
  transaction: RuleEvaluationTransaction,
): Promise<TriggeredRule[]> {
  const activeRules = await prisma.aMLRule.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      code: true,
      riskWeight: true,
    },
  });

  const triggeredRules: TriggeredRule[] = [];

  for (const rule of activeRules) {
    let triggered = false;

    switch (rule.code) {
      case "LARGE_CASH_TRANSACTION":
        triggered = await checkLargeCashTransaction(transaction);
        break;

      case "STRUCTURED_CASH_ACTIVITY":
        triggered = await checkStructuredCashActivity(transaction);
        break;

      case "UNUSUAL_TRANSACTION":
        triggered = await checkUnusualTransaction(transaction);
        break;

      case "RAPID_FUND_MOVEMENT":
        triggered = await checkRapidFundMovement(transaction);
        break;

      case "HIGH_RISK_JURISDICTION":
        triggered = await checkHighRiskJurisdiction(transaction);
        break;
    }

    if (triggered) {
      triggeredRules.push({
        ruleId: rule.id,
        code: rule.code,
        riskWeight: rule.riskWeight,
      });
    }
  }

  return triggeredRules;
}

async function checkLargeCashTransaction(
  transaction: RuleEvaluationTransaction,
): Promise<boolean> {
  if (
    transaction.type !== "CASH_DEPOSIT" &&
    transaction.type !== "CASH_WITHDRAWAL"
  ) {
    return false;
  }

  if (transaction.currency !== "BDT") {
    return false;
  }

  return Number(transaction.amount) >= CTR_THRESHOLD_BDT;
}

async function checkStructuredCashActivity(
  transaction: RuleEvaluationTransaction,
): Promise<boolean> {
  if (
    transaction.type !== "CASH_DEPOSIT" &&
    transaction.type !== "CASH_WITHDRAWAL"
  ) {
    return false;
  }

  if (transaction.currency !== "BDT") {
    return false;
  }

  const startOfDay = new Date(transaction.transactionAt);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(transaction.transactionAt);
  endOfDay.setHours(23, 59, 59, 999);

  const cashTransactions = await prisma.transaction.findMany({
    where: {
      customerId: transaction.customerId,
      transactionAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
      type: {
        in: ["CASH_DEPOSIT", "CASH_WITHDRAWAL"],
      },
      currency: "BDT",
    },
    select: {
      id: true,
      amount: true,
    },
  });

  if (cashTransactions.length < 2) {
    return false;
  }

  const totalCashAmount = cashTransactions.reduce(
    (total, item) => total + Number(item.amount),
    0,
  );

  const hasSubThresholdTransactions = cashTransactions.some(
    (item) => Number(item.amount) < CTR_THRESHOLD_BDT,
  );

  return totalCashAmount >= CTR_THRESHOLD_BDT && hasSubThresholdTransactions;
}

async function checkUnusualTransaction(
  transaction: RuleEvaluationTransaction,
): Promise<boolean> {
  const lookbackStart = new Date(transaction.transactionAt);
  lookbackStart.setDate(lookbackStart.getDate() - LOOKBACK_DAYS);

  const previousTransactions = await prisma.transaction.findMany({
    where: {
      customerId: transaction.customerId,
      transactionAt: {
        gte: lookbackStart,
        lt: transaction.transactionAt,
      },
    },
    select: {
      amount: true,
    },
  });

  if (previousTransactions.length < 5) {
    return false;
  }

  const averageAmount =
    previousTransactions.reduce(
      (total, item) => total + Number(item.amount),
      0,
    ) / previousTransactions.length;

  if (averageAmount === 0) {
    return false;
  }

  return Number(transaction.amount) >= averageAmount * 5;
}

async function checkRapidFundMovement(
  transaction: RuleEvaluationTransaction,
): Promise<boolean> {
  if (transaction.direction !== "DEBIT") {
    return false;
  }

  const windowStart = new Date(transaction.transactionAt);
  windowStart.setHours(windowStart.getHours() - RAPID_MOVEMENT_HOURS);

  const incomingTransactions = await prisma.transaction.findMany({
    where: {
      customerId: transaction.customerId,
      direction: "CREDIT",
      transactionAt: {
        gte: windowStart,
        lte: transaction.transactionAt,
      },
    },
    select: {
      amount: true,
    },
  });

  if (incomingTransactions.length === 0) {
    return false;
  }

  const incomingAmount = incomingTransactions.reduce(
    (total, item) => total + Number(item.amount),
    0,
  );

  const outgoingAmount = Number(transaction.amount);

  if (incomingAmount === 0) {
    return false;
  }

  return outgoingAmount >= incomingAmount * 0.8;
}

async function checkHighRiskJurisdiction(
  transaction: RuleEvaluationTransaction,
): Promise<boolean> {
  if (transaction.type !== "INTERNATIONAL_TRANSFER") {
    return false;
  }

  if (!transaction.counterpartyCountry) {
    return false;
  }

  // Jurisdiction data should eventually come from a configurable
  // reference table rather than being hard-coded in the rule engine.
  return false;
}

export async function evaluateTransactionRisk(
  transaction: RuleEvaluationTransaction,
) {
  const triggeredRules = await evaluateTransaction(transaction);

  const risk = calculateRiskScore(triggeredRules);

  return {
    triggeredRules,
    riskScore: risk.score,
    riskLevel: risk.level,
  };
}
