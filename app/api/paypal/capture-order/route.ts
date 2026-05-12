import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";

import { getAuthSession } from "@/lib/auth/session";
import { isDatabaseConfigured, isPayPalConfigured } from "@/lib/env";
import { fulfillOrder, releaseReservedInventory } from "@/lib/orders";
import { capturePayPalOrder } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured() || !isPayPalConfigured()) {
    return NextResponse.json({ error: "Database or PayPal is not configured." }, { status: 500 });
  }

  const payload = await request.json();
  const paypalOrderId = payload.paypalOrderId as string | undefined;

  if (!paypalOrderId) {
    return NextResponse.json({ error: "Missing PayPal order ID." }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { paypalOrderId, userId: session.user.id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.status === OrderStatus.PAID) {
    return NextResponse.json({ order });
  }

  try {
    const capture = await capturePayPalOrder(paypalOrderId);
    if (capture.status !== "COMPLETED") {
      await prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.FAILED } });
      await releaseReservedInventory(order.id);
      return NextResponse.json({ error: "PayPal capture was not completed." }, { status: 400 });
    }

    await fulfillOrder(order.id, session.user.id);
    const updated = await prisma.order.findUnique({ where: { id: order.id } });

    return NextResponse.json({ order: updated });
  } catch (error) {
    await prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.FAILED } }).catch(() => undefined);
    await releaseReservedInventory(order.id).catch(() => undefined);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Capture failed." }, { status: 400 });
  }
}
