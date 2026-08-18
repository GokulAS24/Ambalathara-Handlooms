import { cache } from "react";
import { prisma } from "@/lib/prisma";

const listInclude = { images: { orderBy: { order: "asc" as const } }, category: true };

export const getShopProducts = cache(async () => {
  return prisma.product.findMany({
    where: { isActive: true },
    include: listInclude,
    orderBy: { createdAt: "desc" },
  });
});

export const getFeaturedProducts = cache(async () => {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: listInclude,
    orderBy: { createdAt: "desc" },
    take: 6,
  });
});

export const getProductDetail = cache(async (id: string) => {
  return prisma.product.findUnique({
    where: { id, isActive: true },
    include: {
      images: { orderBy: { order: "asc" } },
      specs: { orderBy: { order: "asc" } },
      reviews: { orderBy: { createdAt: "desc" } },
      category: true,
    },
  });
});

export const getRelatedProducts = cache(async (productId: string, categoryId: string) => {
  return prisma.product.findMany({
    where: { id: { not: productId }, categoryId, isActive: true },
    include: listInclude,
    take: 3,
  });
});
