import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { getCatalogProducts } from "@/lib/catalog";
import { getAuthSession } from "@/lib/auth/session";
import { createPayPalOrder } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured, isPayPalConfigured } from "@/lib/env";
import { releaseExpiredPendingOrders, reserveInventory } from "@/lib/orders";
import { cartPayloadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Please log in before checkout." }, { status: 401 });
  }

  if (!isDatabaseConfigured() || !isPayPalConfigured()) {
    return NextResponse.json({ error: "Database or PayPal is not configured." }, { status: 500 });
  }

  const parsed = cartPayloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
  }

  let orderId: string | undefined;

  try {
    await releaseExpiredPendingOrders();
    const catalog = await getCatalogProducts();
    const productMap = new Map(catalog.map((product) => [product.id, product]));
    const items = parsed.data.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product || product.priceCents === null || product.comingSoon || product.stockCount < item.quantity) {
        throw new Error(`Insufficient stock for ${product?.name ?? "selected product"}.`);
      }
      return {
        productId: product.id,
        quantity: item.quantity,
        priceCents: product.priceCents,
      };
    });

    const totalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        totalCents,
        currency: "EUR",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceCents: item.priceCents,
          })),
        },
      },
    });
    orderId = order.id;

    await reserveInventory(order.id, items);

    const origin = new URL(request.url).origin;
    const paypalOrder = await createPayPalOrder({
      totalCents,
      returnUrl: `${origin}/checkout/success`,
      cancelUrl: `${origin}/checkout/cancel`,
      referenceId: order.id,
    });

    const approvalUrl =
      paypalOrder.links.find((link) => link.rel === "payer-action")?.href ??
      paypalOrder.links.find((link) => link.rel === "approve")?.href;

    if (!approvalUrl) {
      throw new Error("PayPal approval link was not returned.");
    }

    await prisma.order.update({ where: { id: order.id }, data: { paypalOrderId: paypalOrder.id } });

    return NextResponse.json({
      orderId: order.id,
      paypalOrderId: paypalOrder.id,
      approvalUrl,
    });
  } catch (error) {
    if (orderId) {
      await prisma.order.update({ where: { id: orderId }, data: { status: "FAILED" } }).catch(() => undefined);
      await prisma.productKey
        .updateMany({
          where: { orderId, status: "RESERVED" },
          data: { orderId: null, status: "AVAILABLE", assignedUserId: null },
        })
        .catch(() => undefined);
    }
    const message = error instanceof Prisma.PrismaClientKnownRequestError ? "Checkout could not be completed." : error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
