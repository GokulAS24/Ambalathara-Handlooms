"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
    include: { sections: { orderBy: { order: "asc" } } },
  });
}

export async function getAllPages() {
  return prisma.page.findMany({ include: { sections: true } });
}

export async function updatePageMeta(pageId: string, formData: FormData) {
  await requireAdmin();
  await prisma.page.update({
    where: { id: pageId },
    data: { title: String(formData.get("title")) },
  });
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/support");
  revalidatePath("/returns");
}

export async function createSection(pageId: string, formData: FormData) {
  await requireAdmin();
  await prisma.pageSection.create({
    data: {
      pageId,
      type: String(formData.get("type")),
      heading: (formData.get("heading") as string) || undefined,
      body: (formData.get("body") as string) || undefined,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
      order: Number(formData.get("order")) || 0,
    },
  });
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/support");
  revalidatePath("/returns");
}

export async function updateSection(sectionId: string, formData: FormData) {
  await requireAdmin();
  await prisma.pageSection.update({
    where: { id: sectionId },
    data: {
      type: String(formData.get("type")),
      heading: (formData.get("heading") as string) || undefined,
      body: (formData.get("body") as string) || undefined,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
      order: Number(formData.get("order")) || 0,
    },
  });
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/support");
  revalidatePath("/returns");
}

export async function deleteSection(sectionId: string) {
  await requireAdmin();
  await prisma.pageSection.delete({ where: { id: sectionId } });
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/support");
  revalidatePath("/returns");
}
