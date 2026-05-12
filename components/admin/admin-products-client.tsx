"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, Td, Th } from "@/components/ui/table";
import { categoryOrder } from "@/lib/data/products";
import type { CatalogProduct } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type AdminProduct = CatalogProduct;

export function AdminProductsClient({ products }: { products: AdminProduct[] }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () => products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Product management</h1>
            <p className="text-slate-400">Create, edit, disable, or update pricing for storefront products.</p>
          </div>
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="max-w-sm" />
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Create product</h2>
        <form className="grid gap-4 md:grid-cols-2" action="/api/admin/products" method="post">
          <Input name="name" placeholder="Product name" required />
          <Input name="slug" placeholder="product-slug" required />
          <Select name="category" required defaultValue={categoryOrder[0]}>
            {categoryOrder.map((category) => <option key={category} value={category}>{category}</option>)}
          </Select>
          <Input name="duration" placeholder="Duration (optional)" />
          <Input name="priceCents" type="number" min="0" placeholder="Price in cents (optional)" />
          <Input name="logoKey" placeholder="logo key" required />
          <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" name="comingSoon" value="true" /> Coming soon</label>
          <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" name="active" value="true" defaultChecked /> Active</label>
          <Textarea name="description" placeholder="Description" className="md:col-span-2" required />
          <Button className="md:col-span-2">Save product</Button>
        </form>
      </Card>

      <Card className="overflow-x-auto p-0">
        <Table>
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th>Edit</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-white/5">
                <Td>
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.duration ?? "Digital license"}</p>
                  </div>
                </Td>
                <Td>{product.category}</Td>
                <Td>{formatPrice(product.priceCents, product.currency)}</Td>
                <Td>{product.active ? (product.comingSoon ? "Coming soon" : "Live") : "Disabled"}</Td>
                <Td>
                  <form action="/api/admin/products" method="post" className="grid gap-2 md:grid-cols-3">
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="_method" value="patch" />
                    <Input name="priceCents" type="number" min="0" defaultValue={product.priceCents ?? undefined} placeholder="Price cents" />
                    <Input name="logoKey" defaultValue={product.logoKey} placeholder="Logo key" />
                    <Input name="description" defaultValue={product.description} placeholder="Description" />
                    <label className="text-xs text-slate-400"><input type="checkbox" name="active" value="true" defaultChecked={product.active} /> active</label>
                    <label className="text-xs text-slate-400"><input type="checkbox" name="comingSoon" value="true" defaultChecked={product.comingSoon} /> coming soon</label>
                    <Button variant="secondary">Update</Button>
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
