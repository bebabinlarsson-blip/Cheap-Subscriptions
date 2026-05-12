import { InboxMessage, OrderStatus, ProductKeyStatus } from "@prisma/client";

import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const RESERVATION_MINUTES = 30;

export async function releaseExpiredPendingOrders() {
  if (!isDatabaseConfigured()) return;

  const cutoff = new Date(Date.now() - RESERVATION_MINUTES * 60 * 1000);
  const staleOrders = await prisma.order.findMany({
    where: {
      status: OrderStatus.PENDING,
      createdAt: { lt: cutoff },
    },
    select: { id: true },
  });

  if (staleOrders.length === 0) return;
  const orderIds = staleOrders.map((order) => order.id);

  await prisma.$transaction([
    prisma.productKey.updateMany({
      where: { orderId: { in: orderIds }, status: ProductKeyStatus.RESERVED },
      data: { status: ProductKeyStatus.AVAILABLE, orderId: null, assignedUserId: null },
    }),
    prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status: OrderStatus.CANCELLED },
    }),
  ]);
}

export async function reserveInventory(orderId: string, items: Array<{ productId: string; quantity: number; }>) {
  if (!isDatabaseConfigured()) {
    return { success: true };
  }

  return prisma.$transaction(async (tx) => {
    for (const item of items) {
      const keys = await tx.productKey.findMany({
        where: { productId: item.productId, status: ProductKeyStatus.AVAILABLE },
        take: item.quantity,
        select: { id: true },
      });

      if (keys.length < item.quantity) {
        throw new Error("Insufficient stock for one or more products.");
      }

      await tx.productKey.updateMany({
        where: { id: { in: keys.map((key) => key.id) } },
        data: { status: ProductKeyStatus.RESERVED, orderId },
      });
    }

    return { success: true };
  });
}

export async function releaseReservedInventory(orderId: string) {
  if (!isDatabaseConfigured()) return;

  await prisma.productKey.updateMany({
    where: { orderId, status: ProductKeyStatus.RESERVED },
    data: { status: ProductKeyStatus.AVAILABLE, orderId: null, assignedUserId: null },
  });
}

export async function fulfillOrder(orderId: string, userId: string) {
  if (!isDatabaseConfigured()) {
    return { message: null, soldKeys: [] };
  }

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        user: true,
        keys: { include: { product: true } },
      },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    const reservedKeyIds = order.keys.filter((key) => key.status === ProductKeyStatus.RESERVED).map((key) => key.id);

    if (reservedKeyIds.length === 0) {
      for (const item of order.items) {
        const keys = await tx.productKey.findMany({
          where: { productId: item.productId, status: ProductKeyStatus.AVAILABLE },
          take: item.quantity,
        });

        if (keys.length < item.quantity) {
          throw new Error(`Not enough keys available for ${item.product.name}.`);
        }

        reservedKeyIds.push(...keys.map((key) => key.id));
        await tx.productKey.updateMany({
          where: { id: { in: keys.map((key) => key.id) } },
          data: { status: ProductKeyStatus.RESERVED, orderId },
        });
      }
    }

    await tx.productKey.updateMany({
      where: { id: { in: reservedKeyIds } },
      data: {
        status: ProductKeyStatus.SOLD,
        assignedUserId: userId,
        soldAt: new Date(),
      },
    });

    const soldKeys = await tx.productKey.findMany({
      where: { id: { in: reservedKeyIds } },
      include: { product: true },
      orderBy: { createdAt: "asc" },
    });

    const grouped = soldKeys.reduce<Record<string, string[]>>((acc, key) => {
      const entry = `${key.product.name}${key.product.duration ? ` (${key.product.duration})` : ""}`;
      acc[entry] = [...(acc[entry] ?? []), key.keyValue];
      return acc;
    }, {});

    const messageBody = [
      "Your payment has been verified by PayPal and your authorized digital access codes are now ready.",
      "",
      ...Object.entries(grouped).flatMap(([name, values]) => [name, ...values.map((value) => `- ${value}`), ""]),
      "Keep these keys private. If you need a resend, contact the store owner from the admin dashboard.",
    ].join("\n");

    const message = await tx.inboxMessage.create({
      data: {
        userId,
        orderId,
        title: `Your Premium Tools Mega List keys for order ${orderId.slice(-8)}`,
        body: messageBody,
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID, paidAt: new Date() },
    });

    return { message, soldKeys };
  });
}

export async function resendOrderKeys(orderId: string): Promise<InboxMessage | null> {
  if (!isDatabaseConfigured()) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      keys: { include: { product: true } },
    },
  });

  if (!order || order.keys.length === 0) {
    throw new Error("No keys found for that order.");
  }

  const body = [
    "This is a manual resend of your previously delivered authorized keys.",
    "",
    ...order.keys.map((key) => `${key.product.name}: ${key.keyValue}`),
  ].join("\n");

  return prisma.inboxMessage.create({
    data: {
      userId: order.userId,
      orderId: order.id,
      title: `Manual resend for order ${order.id.slice(-8)}`,
      body,
    },
  });
}
