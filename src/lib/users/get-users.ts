import prisma from "@/lib/prisma";

const page_size = 10;

export async function getUsers(
  page: number = 1,
  role?: "ADMIN" | "ANALYST",
  status?: "ACTIVE" | "DISABLED",
) {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * page_size;

  const where = {
    ...(role && { role }),
    ...(status && { status }),
  };

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: page_size,
    }),
    prisma.user.count({ where }),
  ]);
  const totalPages = Math.ceil(totalUsers / page_size);
  return {
    users,
    totalUsers,
    totalPages,
    currentPage,
  };
}
