"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { slugify } from "@/lib/slugify";

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0),
  weaveType: z.string().optional(),
  fabric: z.string().optional(),
  pattern: z.string().optional(),
  washCare: z.string().optional(),
  categoryId: z.string().min(1),
  isActive: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
});

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getProducts() {
  return prisma.product.findMany({
    include: { category: true, images: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      specs: { orderBy: { order: "asc" } },
      category: true,
    },
  });
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const parsed = productSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    stock: formData.get("stock"),
    weaveType: formData.get("weaveType") || undefined,
    fabric: formData.get("fabric") || undefined,
    pattern: formData.get("pattern") || undefined,
    washCare: formData.get("washCare") || undefined,
    categoryId: formData.get("categoryId"),
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  });

  const imageUrls = formData.getAll("imageUrls").filter(Boolean) as string[];

  const product = await prisma.product.create({
    data: {
      ...parsed,
      slug: slugify(parsed.name),
      images: { create: imageUrls.map((url, i) => ({ url, order: i })) },
    },
  });

  revalidatePath("/shop");
  revalidatePath("/");
  redirect(`/admin/products/${product.id}/edit`);
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = productSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    stock: formData.get("stock"),
    weaveType: formData.get("weaveType") || undefined,
    fabric: formData.get("fabric") || undefined,
    pattern: formData.get("pattern") || undefined,
    washCare: formData.get("washCare") || undefined,
    categoryId: formData.get("categoryId"),
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  });

  await prisma.product.update({ where: { id }, data: { ...parsed, slug: slugify(parsed.name) } });

  revalidatePath("/shop");
  revalidatePath(`/product/${id}`);
  revalidatePath("/");
  redirect(`/admin/products/${id}/edit`);
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function addProductImage(productId: string, formData: FormData) {
  await requireAdmin();
  const url = String(formData.get("url"));
  const count = await prisma.productImage.count({ where: { productId } });
  await prisma.productImage.create({ data: { productId, url, order: count } });
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath(`/product/${productId}`);
}

export async function deleteProductImage(productId: string, imageId: string) {
  await requireAdmin();
  await prisma.productImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath(`/product/${productId}`);
}

export async function addProductSpec(productId: string, formData: FormData) {
  await requireAdmin();
  await prisma.productSpec.create({
    data: {
      productId,
      label: String(formData.get("label")),
      value: String(formData.get("value")),
    },
  });
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath(`/product/${productId}`);
}

export async function deleteProductSpec(productId: string, specId: string) {
  await requireAdmin();
  await prisma.productSpec.delete({ where: { id: specId } });
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath(`/product/${productId}`);
}
