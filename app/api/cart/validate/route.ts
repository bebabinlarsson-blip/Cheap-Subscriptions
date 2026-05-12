import { NextResponse } from "next/server";

import { getCatalogProducts } from "@/lib/catalog";
import { cartPayloadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const payload = cartPayloadSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ error: "Invalid cart payload." }, { status: 400 });
    }

    const products = await getCatalogProducts();
    const productMap = new Map(products.map((product) => [product.id, product]));

    const items = payload.data.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product || product.comingSoon || product.stockCount < item.quantity || product.priceCents === null) {
        throw new Error(`Invalid cart item for ${item.productId}.`);
      }

      return {
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitPriceCents: product.priceCents,
        lineTotalCents: product.priceCents * item.quantity,
      };
    });

    const totalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
    return NextResponse.json({ items, totalCents, currency: "EUR" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cart validation failed." }, { status: 400 });
  }
}
