import { AdminUsersClient } from "@/components/admin/admin-users-client";
import { requireOwner } from "@/lib/auth/session";
import { getAdminTables } from "@/lib/catalog";

export default async function AdminUsersPage() {
  await requireOwner("/admin/users");
  const { users } = await getAdminTables();
  return <AdminUsersClient users={users} />;
}
