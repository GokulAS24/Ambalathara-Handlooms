import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { children: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(categories);
}
