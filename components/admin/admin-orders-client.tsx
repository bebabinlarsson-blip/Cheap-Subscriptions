"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate, formatPrice } from "@/lib/utils";

export function AdminOrdersClient({ orders }: { orders: any[] }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () => orders.filter((order) => `${order.id} ${order.user?.email ?? ""}`.toLowerCase().includes(search.toLowerCase())),
    [orders, search],
  );

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Order management</h1>
          <p className="text-slate-400">Review checkout outcomes and update failed or refunded states.</p>
        </div>
        <Input className="max-w-sm" placeholder="Search by order or email" value={search} onChange={(event) => setSearch(event.target.value)} />
      </Card>
      <Card className="overflow-x-auto p-0">
        <Table>
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <Th>Order</Th>
              <Th>User</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Items</Th>
              <Th>Update</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-white/5">
                <Td>
                  <p className="font-medium text-white">#{order.id.slice(-8)}</p>
                  <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                </Td>
                <Td>{order.user?.email ?? "Unknown"}</Td>
                <Td>{formatPrice(order.totalCents, order.currency)}</Td>
                <Td>{order.status}</Td>
                <Td>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {order.items.map((item: any) => <li key={item.id}>{item.quantity} × {item.product.name}</li>)}
                  </ul>
                </Td>
                <Td>
                  <form action="/api/admin/orders" method="post" className="flex items-center gap-2">
                    <input type="hidden" name="_method" value="patch" />
                    <input type="hidden" name="orderId" value={order.id} />
                    <Select name="status" defaultValue={order.status}>
                      {['PENDING','PAID','FAILED','CANCELLED','REFUNDED'].map((value) => <option key={value} value={value}>{value}</option>)}
                    </Select>
                    <Button variant="secondary">Save</Button>
                  </form>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
