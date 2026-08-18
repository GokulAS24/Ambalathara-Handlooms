"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const settingsSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().optional(),
  logoUrl: z.string().min(1),
  logoMarkUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  footerText: z.string().min(1),
  address: z.string().min(1),
  whatsappNumber: z.string().min(1),
});

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getSiteSettings() {
  return prisma.siteSettings.findUniqueOrThrow({
    where: { id: "singleton" },
    include: { phoneNumbers: true, emails: true, socialLinks: true },
  });
}

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();

  const parsed = settingsSchema.parse({
    siteName: formData.get("siteName"),
    tagline: formData.get("tagline") || undefined,
    logoUrl: formData.get("logoUrl"),
    logoMarkUrl: formData.get("logoMarkUrl") || undefined,
    faviconUrl: formData.get("faviconUrl") || undefined,
    footerText: formData.get("footerText"),
    address: formData.get("address"),
    whatsappNumber: formData.get("whatsappNumber"),
  });

  await prisma.siteSettings.update({ where: { id: "singleton" }, data: parsed });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function addPhoneNumber(formData: FormData) {
  await requireAdmin();
  await prisma.phoneNumber.create({
    data: {
      label: String(formData.get("label")),
      number: String(formData.get("number")),
      siteSettingsId: "singleton",
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function deletePhoneNumber(id: string) {
  await requireAdmin();
  await prisma.phoneNumber.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function addEmail(formData: FormData) {
  await requireAdmin();
  await prisma.emailAddress.create({
    data: {
      label: String(formData.get("label")),
      email: String(formData.get("email")),
      siteSettingsId: "singleton",
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function deleteEmail(id: string) {
  await requireAdmin();
  await prisma.emailAddress.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function addSocialLink(formData: FormData) {
  await requireAdmin();
  await prisma.socialLink.create({
    data: {
      platform: String(formData.get("platform")),
      url: String(formData.get("url")),
      siteSettingsId: "singleton",
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function deleteSocialLink(id: string) {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
