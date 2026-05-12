import { CartPageClient } from "@/components/store/cart-page";
import { getAuthSession } from "@/lib/auth/session";
import { getCatalogProducts } from "@/lib/catalog";

export default async function CartPage() {
  const [products, session] = await Promise.all([getCatalogProducts(), getAuthSession()]);

  return <CartPageClient products={products} loggedIn={Boolean(session?.user)} />;
}
