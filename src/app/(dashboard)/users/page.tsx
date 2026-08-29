import { getUsers } from "@/lib/users/get-users";
import { UsersTable } from "@/components/users/users-table";

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    role?: "ADMIN" | "ANALYST";
    status?: "ACTIVE" | "DISABLED";
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const role = params.role;
  const status = params.status;

  const data = await getUsers(page, role, status);

  return (
    <div className="space-y-6">
      <UsersTable
        users={data.users}
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        totalUsers={data.totalUsers}
      />
    </div>
  );
}
