import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("q");

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(search ? { name: { contains: search } } : {}),
    },
    include: { images: { orderBy: { order: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
