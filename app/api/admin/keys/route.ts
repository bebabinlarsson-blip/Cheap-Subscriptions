import { ProductKeyStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth/session";
import { isOwnerEmail } from "@/lib/auth/owner";
import { isDatabaseConfigured } from "@/lib/env";
import { resendOrderKeys } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

function isOwner(session: Awaited<ReturnType<typeof getAuthSession>>) {
  return Boolean(session?.user && (session.user.role === "OWNER" || isOwnerEmail(session.user.email)));
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({ include: { keys: true } });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!isOwner(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const method = formData.get("_method")?.toString().toLowerCase();

  if (method === "patch") {
    const orderId = formData.get("orderId")?.toString();
    if (orderId) {
      await resendOrderKeys(orderId);
    }
    return NextResponse.redirect(new URL("/admin/keys", request.url), { status: 303 });
  }

  if (method === "delete") {
    const productId = formData.get("productId")?.toString();
    if (productId) {
      await prisma.productKey.deleteMany({ where: { productId, status: ProductKeyStatus.AVAILABLE } });
    }
    return NextResponse.redirect(new URL("/admin/keys", request.url), { status: 303 });
  }

  const productId = formData.get("productId")?.toString();
  const keys = formData.get("keys")?.toString() ?? "";

  if (!productId || !keys) {
    return NextResponse.redirect(new URL("/admin/keys", request.url), { status: 303 });
  }

  const data = keys.split(/\r?\n/).map((value) => value.trim()).filter(Boolean).map((keyValue) => ({ productId, keyValue }));
  for (const entry of data) {
    await prisma.productKey.upsert({
      where: { keyValue: entry.keyValue },
      update: {},
      create: entry,
    });
  }

  return NextResponse.redirect(new URL("/admin/keys", request.url), { status: 303 });
}
