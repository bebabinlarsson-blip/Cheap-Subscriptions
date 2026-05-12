import { AdminProductsClient } from "@/components/admin/admin-products-client";
import { requireOwner } from "@/lib/auth/session";
import { getAdminTables } from "@/lib/catalog";

export default async function AdminProductsPage() {
  await requireOwner("/admin/products");
  const { products } = await getAdminTables();
  return <AdminProductsClient products={products} />;
}
