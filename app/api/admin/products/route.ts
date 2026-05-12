import { NextResponse } from "next/server";

import { getCatalogProducts } from "@/lib/catalog";
import { getAuthSession } from "@/lib/auth/session";
import { isOwnerEmail } from "@/lib/auth/owner";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";

function assertOwner(session: Awaited<ReturnType<typeof getAuthSession>>) {
  if (!session?.user || (session.user.role !== "OWNER" && !isOwnerEmail(session.user.email))) {
    throw new Error("Forbidden");
  }
}

function parseForm(formData: FormData) {
  return {
    id: formData.get("id")?.toString() || undefined,
    name: formData.get("name")?.toString() || "",
    slug: formData.get("slug")?.toString() || "",
    category: formData.get("category")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    duration: formData.get("duration")?.toString() || null,
    priceCents: formData.get("priceCents") ? Number(formData.get("priceCents")) : null,
    currency: "EUR",
    logoKey: formData.get("logoKey")?.toString() || "",
    active: formData.get("active") === "true",
    comingSoon: formData.get("comingSoon") === "true",
  };
}

export async function GET() {
  return NextResponse.json({ products: await getCatalogProducts() });
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  try {
    assertOwner(session);
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    const formData = await request.formData();
    const method = formData.get("_method")?.toString().toLowerCase();
    const values = parseForm(formData);

    if (method === "patch" && values.id) {
      const existing = await prisma.product.findUnique({ where: { id: values.id } });
      if (!existing) {
        return NextResponse.redirect(new URL("/admin/products", request.url), { status: 303 });
      }

      const parsed = productSchema.safeParse({
        id: values.id,
        name: values.name || existing.name,
        slug: values.slug || existing.slug,
        category: values.category || existing.category,
        description: values.description || existing.description,
        duration: values.duration || existing.duration,
        priceCents: values.priceCents ?? existing.priceCents,
        currency: values.currency || existing.currency,
        logoKey: values.logoKey || existing.logoKey,
        active: formData.get("active") ? values.active : existing.active,
        comingSoon: formData.get("comingSoon") ? values.comingSoon : existing.comingSoon,
      });

      if (!parsed.success) {
        return NextResponse.redirect(new URL("/admin/products", request.url), { status: 303 });
      }

      await prisma.product.update({
        where: { id: values.id },
        data: { ...parsed.data },
      });
    } else {
      const parsed = productSchema.safeParse(values);
      if (!parsed.success) {
        return NextResponse.redirect(new URL("/admin/products", request.url), { status: 303 });
      }

      await prisma.product.create({ data: parsed.data });
    }

    return NextResponse.redirect(new URL("/admin/products", request.url), { status: 303 });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
