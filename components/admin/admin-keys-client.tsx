"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, Td, Th } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export function AdminKeysClient({ products }: { products: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id ?? "");
  const current = useMemo(() => products.find((product) => product.id === selectedProduct) ?? products[0], [products, selectedProduct]);

  return (
    <div className="space-y-6">
      <Card className="space-y-2">
        <h1 className="text-3xl font-black text-white">Redemption key management</h1>
        <p className="text-slate-400">Upload keys in bulk, review stock health, and resend paid keys when needed.</p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Paste or upload keys</h2>
          <form action="/api/admin/keys" method="post" className="space-y-4">
            <Select name="productId" value={selectedProduct} onChange={(event) => setSelectedProduct(event.target.value)}>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </Select>
            <Textarea name="keys" placeholder="One key per line" required />
            <Button>Add keys</Button>
          </form>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Manual resend</h2>
          <form action="/api/admin/keys" method="post" className="space-y-4">
            <input type="hidden" name="_method" value="patch" />
            <Input name="orderId" placeholder="Order ID to resend" required />
            <Button variant="secondary">Resend keys to buyer inbox</Button>
          </form>
        </Card>
      </div>

      {current && (
        <Card className="overflow-x-auto p-0">
          <Table>
            <thead className="border-b border-white/10 bg-white/[0.02]">
              <tr>
                <Th>Selected product</Th>
                <Th>Available</Th>
                <Th>Reserved</Th>
                <Th>Sold</Th>
                <Th>Delete unused</Th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <Td>{current.name}</Td>
                <Td>{current.keys.filter((key: any) => key.status === "AVAILABLE").length}</Td>
                <Td>{current.keys.filter((key: any) => key.status === "RESERVED").length}</Td>
                <Td>{current.keys.filter((key: any) => key.status === "SOLD").length}</Td>
                <Td>
                  <form action="/api/admin/keys" method="post">
                    <input type="hidden" name="_method" value="delete" />
                    <input type="hidden" name="productId" value={current.id} />
                    <Button variant="danger">Delete unused keys</Button>
                  </form>
                </Td>
              </tr>
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
}
