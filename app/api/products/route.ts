import { NextResponse } from "next/server";

import { getCatalogProducts } from "@/lib/catalog";

export async function GET() {
  const products = await getCatalogProducts();
  return NextResponse.json({ products });
}
