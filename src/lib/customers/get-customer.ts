import prisma from "@/lib/prisma";

export async function getCustomer(id: string) {
  return prisma.customer.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      customerNumber: true,
      name: true,
      email: true,
      phone: true,
      country: true,
      riskLevel: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
