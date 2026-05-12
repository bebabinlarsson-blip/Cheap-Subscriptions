import { AdminKeysClient } from "@/components/admin/admin-keys-client";
import { requireOwner } from "@/lib/auth/session";
import { getAdminTables } from "@/lib/catalog";

export default async function AdminKeysPage() {
  await requireOwner("/admin/keys");
  const { keys } = await getAdminTables();
  return <AdminKeysClient products={keys} />;
}
