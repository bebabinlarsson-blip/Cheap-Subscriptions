"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CatalogProduct } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function CheckoutPageClient({
  products,
  canCheckout,
}: {
  products: CatalogProduct[];
  canCheckout: boolean;
}) {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => {
    const map = new Map(products.map((product) => [product.id, product]));
    return items.map((item) => ({ item, product: map.get(item.productId) })).filter((row) => row.product);
  }, [items, products]);

  const total = rows.reduce((sum, row) => sum + (row.product?.priceCents ?? 0) * row.item.quantity, 0);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Checkout failed.");
      }
      window.location.href = data.approvalUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setLoading(false);
    }
  }

  if (rows.length === 0) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-white">Nothing to checkout yet</h1>
        <p className="mt-3 text-slate-400">Add a few products to your bag first.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="space-y-4">
        <h1 className="text-3xl font-black text-white">Secure PayPal checkout</h1>
        <p className="text-slate-400">
          Your prices are recalculated on the server, stock is checked again, and keys are only delivered after verified PayPal capture.
        </p>
        <div className="space-y-3">
          {rows.map(({ item, product }) => (
            <div key={item.productId} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
              <div>
                <p className="font-medium text-white">{product!.name}</p>
                <p className="text-sm text-slate-400">{item.quantity} × {formatPrice(product!.priceCents, product!.currency)}</p>
              </div>
              <p className="font-semibold text-cyan-200">{formatPrice((product!.priceCents ?? 0) * item.quantity)}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="space-y-5">
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
          <ShieldCheck className="mb-2 h-5 w-5" />
          Authorized keys are delivered to your inbox only after the server verifies the PayPal capture.
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total due</p>
          <h2 className="mt-2 text-3xl font-black text-white">{formatPrice(total)}</h2>
        </div>
        {!canCheckout && (
          <p className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            Configure PayPal credentials and a database before live checkout.
          </p>
        )}
        {error && <p className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">{error}</p>}
        <Button className="w-full" onClick={handleCheckout} disabled={!canCheckout || loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue to PayPal
        </Button>
      </Card>
    </div>
  );
}
