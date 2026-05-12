"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { ProductLogo } from "@/components/product-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCart } from "@/components/providers/cart-provider";
import type { CatalogProduct } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const soldOut = !product.comingSoon && product.stockCount <= 0;
  const disabled = product.comingSoon || soldOut;

  return (
    <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] transition hover:-translate-y-1 hover:border-cyan-400/40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.18),transparent_30%)] opacity-0 transition group-hover:opacity-100" />
      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <ProductLogo name={product.name} logoKey={product.logoKey} />
            <div>
              <p className="text-sm text-slate-400">{product.category}</p>
              <h3 className="text-lg font-semibold text-white">{product.name}</h3>
              <p className="text-sm text-slate-400">{product.duration ?? "Digital license"}</p>
            </div>
          </div>
          <Badge className={product.comingSoon ? "border-amber-400/30 bg-amber-400/10 text-amber-200" : product.stockCount > 3 ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-100" : "border-orange-400/30 bg-orange-400/10 text-orange-100"}>
            {product.comingSoon ? "Coming Soon" : product.stockCount > 3 ? `${product.stockCount} in stock` : product.stockCount > 0 ? `Only ${product.stockCount} left` : "Sold Out"}
          </Badge>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-slate-300">{product.description}</p>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Price</p>
            <p className="text-2xl font-black text-white">{formatPrice(product.priceCents, product.currency)}</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/80 p-1">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10"
              aria-label={`Decrease ${product.name} quantity`}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-8 text-center text-sm font-semibold text-white">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(product.stockCount || 99, value + 1))}
              className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10"
              aria-label={`Increase ${product.name} quantity`}
              disabled={product.stockCount > 0 && quantity >= product.stockCount}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <Button
          className="w-full"
          disabled={disabled}
          onClick={() => addItem(product.id, quantity)}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {product.comingSoon ? "Notify Me Soon" : soldOut ? "Out of Stock" : "Add to Bag"}
        </Button>
      </div>
    </Card>
  );
}
