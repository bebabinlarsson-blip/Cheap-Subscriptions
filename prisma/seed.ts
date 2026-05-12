import { PrismaClient, Role } from "@prisma/client";

import { seedCatalog } from "@/lib/data/products";
import { isOwnerEmail } from "@/lib/auth/owner";

const prisma = new PrismaClient();

async function main() {
  for (const product of seedCatalog) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        category: product.category,
        description: product.description,
        duration: product.duration,
        priceCents: product.priceCents,
        currency: product.currency,
        logoKey: product.logoKey,
        comingSoon: product.comingSoon,
        active: true,
      },
      create: {
        name: product.name,
        slug: product.slug,
        category: product.category,
        description: product.description,
        duration: product.duration,
        priceCents: product.priceCents,
        currency: product.currency,
        logoKey: product.logoKey,
        comingSoon: product.comingSoon,
        active: true,
      },
    });

    if (!product.comingSoon) {
      const existingCount = await prisma.productKey.count({
        where: { productId: created.id },
      });

      if (existingCount === 0) {
        await prisma.productKey.createMany({
          data: Array.from({ length: 5 }).map((_, index) => ({
            productId: created.id,
            keyValue: `AUTH-${product.slug.toUpperCase().replace(/[^A-Z0-9]/g, "")}-${index + 1}`,
          })),
        });
      }
    }
  }

  const owners = (process.env.OWNER_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (owners.length > 0) {
    await prisma.user.updateMany({
      where: { email: { in: owners } },
      data: { role: Role.OWNER },
    });
  }

  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  for (const user of users) {
    if (isOwnerEmail(user.email)) {
      await prisma.user.update({ where: { id: user.id }, data: { role: Role.OWNER } });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
