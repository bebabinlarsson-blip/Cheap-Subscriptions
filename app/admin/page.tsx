import Link from "next/link";

import { Card } from "@/components/ui/card";
import { requireOwner } from "@/lib/auth/session";
import { getAdminSummary } from "@/lib/catalog";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AdminPage() {
  await requireOwner("/admin");
  const summary = await getAdminSummary();

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Owner dashboard</p>
        <h1 className="mt-2 text-4xl font-black text-white">Operations overview</h1>
        <p className="mt-3 text-slate-300">Monitor revenue, stock health, and buyer activity from one control room.</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-400">Revenue</p><h2 className="mt-2 text-3xl font-black text-white">{formatPrice(summary.revenueCents)}</h2></Card>
        <Card><p className="text-sm text-slate-400">Paid orders</p><h2 className="mt-2 text-3xl font-black text-white">{summary.paidOrders}</h2></Card>
        <Card><p className="text-sm text-slate-400">Products</p><h2 className="mt-2 text-3xl font-black text-white">{summary.productCount}</h2></Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Low stock warnings</h2>
            <Link href="/admin/keys" className="text-sm text-cyan-200">Manage keys</Link>
          </div>
          {summary.lowStockProducts.length === 0 ? (
            <p className="text-slate-400">No low stock warnings.</p>
          ) : (
            summary.lowStockProducts.map((product) => (
              <div key={product.id} className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-4 text-sm text-orange-100">
                {product.name} — {product.stockCount} remaining keys
              </div>
            ))
          )}
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-cyan-200">See all</Link>
          </div>
          {summary.recentOrders.length === 0 ? (
            <p className="text-slate-400">Orders will appear here after live checkout.</p>
          ) : (
            summary.recentOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">#{order.id.slice(-8)}</p>
                    <p className="text-xs text-slate-500">{order.user?.email ?? "Unknown buyer"}</p>
                  </div>
                  <div className="text-right text-sm text-slate-300">
                    <p>{order.status}</p>
                    <p>{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
