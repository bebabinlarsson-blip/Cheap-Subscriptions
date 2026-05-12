"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { ProductLogo } from "@/components/product-logo";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CatalogProduct } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function CartPageClient({ products, loggedIn }: { products: CatalogProduct[]; loggedIn: boolean; }) {
  const { items, removeItem, updateQuantity } = useCart();
  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const rows = items.map((item) => ({ item, product: productMap.get(item.productId) })).filter((row) => row.product);
  const total = rows.reduce((sum, row) => sum + (row.product?.priceCents ?? 0) * row.item.quantity, 0);

  if (rows.length === 0) {
    return (
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-white">Your bag is empty</h1>
        <p className="mt-3 text-slate-400">Add authorized digital products to start your secure PayPal checkout.</p>
        <div className="mt-6">
          <Link href="/products"><Button>Browse Products</Button></Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-4">
        {rows.map(({ item, product }) => (
          <Card key={item.productId} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <ProductLogo name={product!.name} logoKey={product!.logoKey} />
              <div>
                <h2 className="text-lg font-semibold text-white">{product!.name}</h2>
                <p className="text-sm text-slate-400">{product!.duration ?? "Digital license"}</p>
                <p className="text-sm text-cyan-200">{formatPrice(product!.priceCents, product!.currency)} each</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-1">
                <button type="button" className="rounded-xl p-2 text-slate-300 hover:bg-white/10" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center font-semibold text-white">{item.quantity}</span>
                <button type="button" className="rounded-xl p-2 text-slate-300 hover:bg-white/10" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button type="button" className="inline-flex items-center gap-2 text-sm text-red-300" onClick={() => removeItem(item.productId)}>
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="h-fit space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Order summary</p>
          <h2 className="mt-2 text-2xl font-bold text-white">{formatPrice(total)}</h2>
        </div>
        <p className="text-sm text-slate-400">Server-side validation and stock checks run again before every PayPal order is created.</p>
        {loggedIn ? (
          <Link href="/checkout" className="block"><Button className="w-full">Proceed to PayPal</Button></Link>
        ) : (
          <p className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-4 text-sm text-orange-100">
            Please sign in with Google before checkout.
          </p>
        )}
      </Card>
    </div>
  );
}
