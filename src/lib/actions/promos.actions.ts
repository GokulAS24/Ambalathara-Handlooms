"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const promoSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1),
  linkHref: z.string(),
  order: z.coerce.number().default(0),
  isActive: z.coerce.boolean().default(true),
});

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getPromoBlocks() {
  return prisma.promoBlock.findMany({ orderBy: { order: "asc" } });
}

export async function getActivePromoBlocks() {
  return prisma.promoBlock.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
}

export async function createPromoBlock(formData: FormData) {
  await requireAdmin();
  const parsed = promoSchema.parse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    imageUrl: formData.get("imageUrl"),
    linkHref: formData.get("linkHref"),
    order: formData.get("order") || 0,
    isActive: formData.get("isActive") === "on",
  });
  await prisma.promoBlock.create({ data: parsed });
  revalidatePath("/");
  redirect("/admin/promos");
}

export async function updatePromoBlock(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = promoSchema.parse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || undefined,
    imageUrl: formData.get("imageUrl"),
    linkHref: formData.get("linkHref"),
    order: formData.get("order") || 0,
    isActive: formData.get("isActive") === "on",
  });
  await prisma.promoBlock.update({ where: { id }, data: parsed });
  revalidatePath("/");
  redirect("/admin/promos");
}

export async function deletePromoBlock(id: string) {
  await requireAdmin();
  await prisma.promoBlock.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/promos");
}
