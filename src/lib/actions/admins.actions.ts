"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const adminSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function getAdmins() {
  return prisma.admin.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function createAdmin(formData: FormData) {
  await requireAdmin();
  const parsed = adminSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const passwordHash = await bcrypt.hash(parsed.password, 10);
  await prisma.admin.create({ data: { name: parsed.name, email: parsed.email, passwordHash } });
  revalidatePath("/admin/team");
}

export async function deleteAdmin(id: string) {
  const session = await requireAdmin();

  if (session.user.id === id) {
    throw new Error("You cannot delete your own account while signed in.");
  }

  const total = await prisma.admin.count();
  if (total <= 1) {
    throw new Error("Cannot delete the last remaining admin account.");
  }

  await prisma.admin.delete({ where: { id } });
  revalidatePath("/admin/team");
}
