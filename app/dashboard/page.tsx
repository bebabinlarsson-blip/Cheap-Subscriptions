import Link from "next/link";
import { Inbox, ReceiptText, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getUserDashboard } from "@/lib/catalog";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await requireUser("/dashboard");
  const data = await getUserDashboard(session.user.id);

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Buyer dashboard</p>
        <h1 className="mt-2 text-4xl font-black text-white">Welcome back, {session.user.name ?? session.user.email}</h1>
        <p className="mt-3 text-slate-300">Track your paid orders, delivered keys, and account activity in one place.</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><Wallet className="h-5 w-5 text-cyan-300" /><p className="mt-3 text-sm text-slate-400">Total spent</p><h2 className="mt-1 text-3xl font-black text-white">{formatPrice(data.spentCents)}</h2></Card>
        <Card><ReceiptText className="h-5 w-5 text-cyan-300" /><p className="mt-3 text-sm text-slate-400">Paid orders</p><h2 className="mt-1 text-3xl font-black text-white">{data.totalPurchases}</h2></Card>
        <Card><Inbox className="h-5 w-5 text-cyan-300" /><p className="mt-3 text-sm text-slate-400">Unread inbox</p><h2 className="mt-1 text-3xl font-black text-white">{data.inboxCount}</h2></Card>
      </div>
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent orders</h2>
          <div className="flex gap-3">
            <Link href="/dashboard/orders" className="text-sm text-cyan-200">All orders</Link>
            <Link href="/dashboard/inbox" className="text-sm text-cyan-200">Inbox</Link>
          </div>
        </div>
        {data.orders.length === 0 ? (
          <p className="text-slate-400">No orders yet.</p>
        ) : (
          data.orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-white">Order #{order.id.slice(-8)}</h3>
                  <p className="text-sm text-slate-400">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-sm text-slate-300">{order.status} • {formatPrice(order.totalCents)}</div>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
