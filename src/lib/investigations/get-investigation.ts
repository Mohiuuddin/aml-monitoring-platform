import prisma from "@/lib/prisma";

export async function getInvestigation(id: string) {
  const investigation = await prisma.investigation.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      alertId: true,
      status: true,
      summary: true,
      startedAt: true,
      updatedAt: true,
      closedAt: true,

      analyst: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      alert: {
        select: {
          id: true,
          title: true,
          description: true,
          riskScore: true,
          riskLevel: true,
          status: true,
          createdAt: true,

          customer: {
            select: {
              id: true,
              customerNumber: true,
              name: true,
              riskLevel: true,
            },
          },

          transaction: {
            select: {
              id: true,
              amount: true,
              currency: true,
              type: true,
              direction: true,
              counterparty: true,
              counterpartyCountry: true,
              description: true,
              transactionAt: true,
            },
          },

          triggeredRules: {
            select: {
              rule: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  riskWeight: true,
                },
              },
            },
          },
        },
      },

      notes: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          content: true,
          createdAt: true,

          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!investigation) {
    return null;
  }

  return {
    ...investigation,
    alert: {
      ...investigation.alert,
      transaction: investigation.alert.transaction
        ? {
            ...investigation.alert.transaction,
            amount: investigation.alert.transaction.amount.toString(),
            transactionAt:
              investigation.alert.transaction.transactionAt.toISOString(),
          }
        : null,
      createdAt: investigation.alert.createdAt.toISOString(),
    },
    startedAt: investigation.startedAt.toISOString(),
    updatedAt: investigation.updatedAt.toISOString(),
    closedAt: investigation.closedAt?.toISOString() ?? null,
    notes: investigation.notes.map((note) => ({
      ...note,
      createdAt: note.createdAt.toISOString(),
    })),
  };
}
