"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const bannerSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  desktopImageUrl: z.string().min(1),
  mobileImageUrl: z.string().optional(),
  ctaLabel: z.string().optional(),
  categoryId: z.string().optional(),
  discountText: z.string().optional(),
  order: z.coerce.number().default(0),
  isActive: z.coerce.boolean().default(true),
});

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getHeroBanners() {
  return prisma.heroBanner.findMany({ include: { category: true }, orderBy: { order: "asc" } });
}

export async function getActiveHeroBanners() {
  const now = new Date();
  return prisma.heroBanner.findMany({
    where: {
      isActive: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    include: { category: true },
    orderBy: { order: "asc" },
  });
}

export async function createBanner(formData: FormData) {
  await requireAdmin();
  const parsed = bannerSchema.parse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    desktopImageUrl: formData.get("desktopImageUrl"),
    mobileImageUrl: formData.get("mobileImageUrl") || undefined,
    ctaLabel: formData.get("ctaLabel") || undefined,
    categoryId: formData.get("categoryId") || undefined,
    discountText: formData.get("discountText") || undefined,
    order: formData.get("order") || 0,
    isActive: formData.get("isActive") === "on",
  });
  await prisma.heroBanner.create({ data: parsed });
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function updateBanner(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = bannerSchema.parse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    desktopImageUrl: formData.get("desktopImageUrl"),
    mobileImageUrl: formData.get("mobileImageUrl") || undefined,
    ctaLabel: formData.get("ctaLabel") || undefined,
    categoryId: formData.get("categoryId") || undefined,
    discountText: formData.get("discountText") || undefined,
    order: formData.get("order") || 0,
    isActive: formData.get("isActive") === "on",
  });
  await prisma.heroBanner.update({
    where: { id },
    data: { ...parsed, categoryId: parsed.categoryId ?? null },
  });
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBanner(id: string) {
  await requireAdmin();
  await prisma.heroBanner.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/banners");
}
