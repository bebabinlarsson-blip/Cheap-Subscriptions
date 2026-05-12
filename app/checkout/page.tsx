import { CheckoutPageClient } from "@/components/store/checkout-page";
import { Card } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth/session";
import { getCatalogProducts } from "@/lib/catalog";
import { isDatabaseConfigured, isPayPalConfigured } from "@/lib/env";

export default async function CheckoutPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    return (
      <Card>
        <h1 className="text-3xl font-black text-white">Sign in before checkout</h1>
        <p className="mt-3 text-slate-400">Google login is required before a PayPal order can be created.</p>
      </Card>
    );
  }

  const products = await getCatalogProducts();

  return <CheckoutPageClient products={products} canCheckout={isDatabaseConfigured() && isPayPalConfigured()} />;
}
