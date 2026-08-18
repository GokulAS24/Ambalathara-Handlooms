"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

async function recomputeRating(productId: string) {
  const agg = await prisma.productReview.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.product.update({
    where: { id: productId },
    data: { avgRating: agg._avg.rating ?? 0, reviewCount: agg._count.rating },
  });
}

export async function getReviews() {
  return prisma.productReview.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createReview(productId: string, formData: FormData) {
  await prisma.productReview.create({
    data: {
      productId,
      author: String(formData.get("author")),
      rating: Number(formData.get("rating")),
      comment: String(formData.get("comment")),
    },
  });
  await recomputeRating(productId);
  revalidatePath(`/product/${productId}`);
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function deleteReview(id: string, productId: string) {
  await requireAdmin();
  await prisma.productReview.delete({ where: { id } });
  await recomputeRating(productId);
  revalidatePath(`/product/${productId}`);
  revalidatePath("/admin/reviews");
  revalidatePath("/shop");
}
