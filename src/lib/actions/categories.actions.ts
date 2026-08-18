"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { slugify } from "@/lib/slugify";

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().optional(),
  order: z.coerce.number().default(0),
  isActive: z.coerce.boolean().default(true),
});

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getCategories() {
  return prisma.category.findMany({
    include: { children: true, parent: true, _count: { select: { products: true } } },
    orderBy: { order: "asc" },
  });
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    parentId: formData.get("parentId") || undefined,
    order: formData.get("order") || 0,
    isActive: formData.get("isActive") === "on",
  });
  await prisma.category.create({ data: { ...parsed, slug: slugify(parsed.name) } });
  revalidatePath("/shop");
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    parentId: formData.get("parentId") || undefined,
    order: formData.get("order") || 0,
    isActive: formData.get("isActive") === "on",
  });
  await prisma.category.update({ where: { id }, data: { ...parsed, slug: slugify(parsed.name) } });
  revalidatePath("/shop");
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const [productCount, childCount] = await Promise.all([
    prisma.product.count({ where: { categoryId: id } }),
    prisma.category.count({ where: { parentId: id } }),
  ]);

  if (productCount > 0 || childCount > 0) {
    throw new Error(
      `Cannot delete: ${productCount} product(s) and ${childCount} subcategor${childCount === 1 ? "y" : "ies"} still reference this category. Reassign or delete them first.`
    );
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/shop");
  revalidatePath("/", "layout");
  revalidatePath("/admin/categories");
}
