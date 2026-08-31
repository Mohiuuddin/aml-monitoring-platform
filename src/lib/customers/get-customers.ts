import prisma from "@/lib/prisma";

const page_size = 10;

export async function getCustomers(page: number = 1) {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * page_size;

  const [customers, totalCustomers] = await Promise.all([
    prisma.customer.findMany({
      orderBy: {
        createdAt: "desc",
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
      },
      skip,
      take: page_size,
    }),
    prisma.customer.count(),
  ]);

  const totalPages = Math.ceil(totalCustomers / page_size);

  return {
    customers,
    totalCustomers,
    totalPages,
    currentPage,
  };
}
