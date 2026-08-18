import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean);

  if (ids.length === 0) return NextResponse.json([]);

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { images: { orderBy: { order: "asc" } }, category: true },
  });

  return NextResponse.json(products);
}
