import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const cartPayloadSchema = z.object({
  items: z.array(cartItemSchema).min(1),
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(12),
  duration: z.string().nullable().optional(),
  priceCents: z.number().int().nonnegative().nullable(),
  currency: z.string().default("EUR"),
  logoKey: z.string().min(1),
  active: z.boolean().default(true),
  comingSoon: z.boolean().default(false),
});

export const keyUploadSchema = z.object({
  productId: z.string().min(1),
  keys: z.string().min(3),
});

export const resendKeysSchema = z.object({
  orderId: z.string().min(1),
});

export const adminOrderUpdateSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"]),
});

export const adminUserUpdateSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["USER", "OWNER"]),
});
