import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth/session";
import { isOwnerEmail } from "@/lib/auth/owner";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";

function isOwner(session: Awaited<ReturnType<typeof getAuthSession>>) {
  return Boolean(session?.user && (session.user.role === "OWNER" || isOwnerEmail(session.user.email)));
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ orders: [] });
  }

  const orders = await prisma.order.findMany({ include: { user: true, items: { include: { product: true } } } });
  return NextResponse.json({ orders });
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
  const orderId = formData.get("orderId")?.toString();
  const status = formData.get("status")?.toString();
  if (orderId && status) {
    await prisma.order.update({ where: { id: orderId }, data: { status: status as OrderStatus } });
  }

  return NextResponse.redirect(new URL("/admin/orders", request.url), { status: 303 });
}
