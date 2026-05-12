import { AdminOrdersClient } from "@/components/admin/admin-orders-client";
import { requireOwner } from "@/lib/auth/session";
import { getAdminTables } from "@/lib/catalog";

export default async function AdminOrdersPage() {
  await requireOwner("/admin/orders");
  const { orders } = await getAdminTables();
  return <AdminOrdersClient orders={orders} />;
}
