import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getOrdersForUser } from "@/lib/catalog";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await requireUser("/dashboard/orders");
  const orders = await getOrdersForUser(session.user.id);

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-3xl font-black text-white">Order history</h1>
        <p className="mt-3 text-slate-400">View every checkout event and the products tied to each order.</p>
      </Card>
      {orders.length === 0 ? (
        <Card><p className="text-slate-400">No orders yet.</p></Card>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Order #{order.id.slice(-8)}</h2>
                <p className="text-sm text-slate-400">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-cyan-200">{formatPrice(order.totalCents)}</p>
                <p className="text-sm text-slate-400">{order.status}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                  <span>{item.quantity} × {item.product.name}</span>
                  <span>{formatPrice(item.priceCents * item.quantity)}</span>
                </div>
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
