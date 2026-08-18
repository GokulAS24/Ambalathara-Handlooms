import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getSiteData = cache(async () => {
  const [settings, banners, promos] = await Promise.all([
    prisma.siteSettings.findUniqueOrThrow({
      where: { id: "singleton" },
      include: { phoneNumbers: true, emails: true, socialLinks: true },
    }),
    prisma.heroBanner.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { order: "asc" },
    }),
    prisma.promoBlock.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
  ]);
  return { settings, banners, promos };
});

export const getCategoryTree = cache(async () => {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: { children: { where: { isActive: true } } },
    orderBy: { order: "asc" },
  });
});

export const getAllCategoriesFlat = cache(async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { order: "asc" },
  });
});
