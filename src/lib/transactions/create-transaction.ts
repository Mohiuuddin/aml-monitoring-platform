"use server";

import { revalidatePath } from "next/cache";

import { createAlertForTransaction } from "@/lib/aml/create-alert";
import { createAuditLog } from "@/lib/audit/create-audit-log";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

type TransactionType =
  | "CASH_DEPOSIT"
  | "CASH_WITHDRAWAL"
  | "TRANSFER"
  | "CARD_PAYMENT"
  | "INTERNATIONAL_TRANSFER";

type TransactionDirection = "CREDIT" | "DEBIT";

interface CreateTransactionInput {
  accountId: string;
  amount: string;
  type: TransactionType;
  direction: TransactionDirection;
  counterparty?: string;
  counterpartyCountry?: string;
  description?: string;
  transactionAt: string;
}

export async function createTransaction({
  accountId,
  amount,
  type,
  direction,
  counterparty,
  counterpartyCountry,
  description,
  transactionAt,
}: CreateTransactionInput) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  if (user.role !== "ADMIN" && user.role !== "ANALYST") {
    throw new Error("Unauthorized.");
  }

  const account = await prisma.bankAccount.findUnique({
    where: {
      id: accountId,
    },
    select: {
      id: true,
      customerId: true,
      currency: true,
      status: true,
    },
  });

  if (!account) {
    throw new Error("Account not found.");
  }

  if (account.status !== "ACTIVE") {
    throw new Error("Transactions can only be created for active accounts.");
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  if (!transactionAt) {
    throw new Error("Transaction date is required.");
  }

  const transactionDate = new Date(transactionAt);

  if (Number.isNaN(transactionDate.getTime())) {
    throw new Error("Invalid transaction date.");
  }

  const transaction = await prisma.$transaction(async (tx) => {
    const createdTransaction = await tx.transaction.create({
      data: {
        accountId: account.id,
        customerId: account.customerId,
        amount: numericAmount,
        currency: account.currency,
        type,
        direction,
        counterparty: counterparty?.trim() || null,
        counterpartyCountry: counterpartyCountry?.trim() || null,
        description: description?.trim() || null,
        transactionAt: transactionDate,
      },
    });

    const balanceChange =
      direction === "CREDIT" ? numericAmount : -numericAmount;

    await tx.bankAccount.update({
      where: {
        id: account.id,
      },
      data: {
        balance: {
          increment: balanceChange,
        },
      },
    });

    return createdTransaction;
  });

  // Record the transaction creation in the audit log.
  await createAuditLog({
    userId: user.id,
    action: "CREATE",
    entity: "Transaction",
    entityId: transaction.id,
    metadata: {
      accountId: account.id,
      customerId: account.customerId,
      amount: numericAmount,
      currency: account.currency,
      type,
      direction,
    },
  });

  // Run AML monitoring after the transaction has been committed.
  try {
    await createAlertForTransaction({
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("AML evaluation failed:", error);
  }

  revalidatePath("/transactions");
  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/accounts");

  return {
    success: true,
    transactionId: transaction.id,
  };
}
