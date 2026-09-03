import prisma from "@/lib/prisma";

const page_size = 10;

interface GetCustomersOptions {
  page?: number;
  name?: string;
  phone?: string;
  country?: string;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

export async function getCustomers({
  page = 1,
  name,
  phone,
  country,
  riskLevel,
  status,
}: GetCustomersOptions = {}) {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * page_size;

  const where = {
    ...(name && {
      name: {
        contains: name,
        mode: "insensitive" as const,
      },
    }),

    ...(phone && {
      phone: {
        contains: phone,
      },
    }),

    ...(country && {
      country: {
        contains: country,
        mode: "insensitive" as const,
      },
    }),

    ...(riskLevel && {
      riskLevel,
    }),

    ...(status && {
      status,
    }),
  };

  const [customers, totalCustomers] = await Promise.all([
    prisma.customer.findMany({
      where,
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

    prisma.customer.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalCustomers / page_size);

  return {
    customers,
    totalCustomers,
    totalPages,
    currentPage,
  };
}
