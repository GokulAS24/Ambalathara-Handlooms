import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.findUniqueOrThrow({
    where: { id: "singleton" },
    include: { phoneNumbers: true, emails: true, socialLinks: true },
  });
  return NextResponse.json(settings);
}
