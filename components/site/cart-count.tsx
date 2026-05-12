"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";

export function CartCount() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:border-cyan-400/60 hover:bg-white/10"
      aria-label="Shopping cart"
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-cyan-400 px-1 text-[10px] font-bold text-slate-950">
        {itemCount}
      </span>
    </Link>
  );
}
