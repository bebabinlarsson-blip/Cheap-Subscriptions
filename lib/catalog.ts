import { ProductKeyStatus, type OrderStatus } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

import { fallbackProducts, categoryOrder } from "@/lib/data/products";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import type { CatalogProduct } from "@/lib/types";

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  noStore();

  if (!isDatabaseConfigured()) {
    return fallbackProducts.map((product) => ({ ...product, active: true }));
  }

  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      keys: {
        where: { status: ProductKeyStatus.AVAILABLE },
        select: { id: true },
      },
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    description: product.description,
    duration: product.duration,
    priceCents: product.priceCents,
    currency: product.currency,
    logoKey: product.logoKey,
    active: product.active,
    comingSoon: product.comingSoon,
    stockCount: product.keys.length,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));
}

export async function getCatalogGroupedByCategory() {
  const products = await getCatalogProducts();
  const grouped = new Map<string, CatalogProduct[]>();

  for (const category of categoryOrder) {
    grouped.set(category, []);
  }

  for (const product of products) {
    grouped.set(product.category, [...(grouped.get(product.category) ?? []), product]);
  }

  return categoryOrder
    .map((category) => ({
      category,
      products: grouped.get(category) ?? [],
    }))
    .filter((section) => section.products.length > 0);
}

export async function getFeaturedProducts() {
  const products = await getCatalogProducts();
  return products.filter((product) => {
    const fallback = fallbackProducts.find((item) => item.slug === product.slug);
    return fallback?.featured;
  }).slice(0, 8);
}

export async function getStoreSummary() {
  const products = await getCatalogProducts();
  const availableCount = products.filter((product) => product.priceCents !== null).length;
  const lowStock = products.filter((product) => !product.comingSoon && product.stockCount <= 3).length;

  return {
    availableCount,
    lowStock,
    categories: categoryOrder.length,
  };
}

export async function getAdminSummary() {
  noStore();

  if (!isDatabaseConfigured()) {
    return {
      revenueCents: 0,
      paidOrders: 0,
      productCount: fallbackProducts.length,
      lowStockProducts: fallbackProducts.filter((product) => !product.comingSoon && product.stockCount <= 3),
      recentOrders: [],
    };
  }

  const [orders, products, paidOrderAggregate] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    getCatalogProducts(),
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { totalCents: true },
      _count: { id: true },
    }),
  ]);

  return {
    revenueCents: paidOrderAggregate._sum.totalCents ?? 0,
    paidOrders: paidOrderAggregate._count.id,
    productCount: products.length,
    lowStockProducts: products.filter((product) => !product.comingSoon && product.stockCount <= 3).slice(0, 8),
    recentOrders: orders,
  };
}

export async function getUnreadInboxCount(userId?: string) {
  if (!userId || !isDatabaseConfigured()) return 0;

  return prisma.inboxMessage.count({ where: { userId, read: false } });
}

export async function getUserDashboard(userId: string) {
  noStore();

  if (!isDatabaseConfigured()) {
    return {
      orders: [],
      inboxCount: 0,
      totalPurchases: 0,
      spentCents: 0,
    };
  }

  const [orders, inboxCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: { include: { product: true } } },
    }),
    prisma.inboxMessage.count({ where: { userId, read: false } }),
  ]);

  return {
    orders,
    inboxCount,
    totalPurchases: orders.filter((order) => order.status === "PAID").length,
    spentCents: orders.filter((order) => order.status === "PAID").reduce((sum, order) => sum + order.totalCents, 0),
  };
}

export async function getInboxForUser(userId: string) {
  noStore();

  if (!isDatabaseConfigured()) {
    return { messages: [], keys: [] };
  }

  const [messages, keys] = await Promise.all([
    prisma.inboxMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { order: true },
    }),
    prisma.productKey.findMany({
      where: { assignedUserId: userId, status: ProductKeyStatus.SOLD },
      orderBy: { soldAt: "desc" },
      include: {
        product: true,
        order: true,
      },
    }),
  ]);

  return { messages, keys };
}

export async function getOrdersForUser(userId: string) {
  noStore();

  if (!isDatabaseConfigured()) return [];

  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
    },
  });
}

export async function getAdminTables() {
  noStore();

  if (!isDatabaseConfigured()) {
    return {
      products: fallbackProducts.map((item) => ({ ...item })),
      keys: [],
      orders: [],
      users: [],
    };
  }

  const [products, keys, orders, users] = await Promise.all([
    prisma.product.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
      include: {
        keys: {
          where: { status: ProductKeyStatus.AVAILABLE },
          select: { id: true },
        },
      },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      include: {
        keys: {
          select: { id: true, status: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { orders: true, inboxMessages: true } },
      },
    }),
  ]);

  return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.description,
      duration: product.duration,
      priceCents: product.priceCents,
      currency: product.currency,
      logoKey: product.logoKey,
      active: product.active,
      comingSoon: product.comingSoon,
      stockCount: product.keys.length,
    })),
    keys,
    orders,
    users,
  };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return prisma.order.update({ where: { id: orderId }, data: { status } });
}
