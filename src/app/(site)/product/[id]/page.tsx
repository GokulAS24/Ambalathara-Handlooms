import { notFound } from "next/navigation";
import { getProductDetail, getRelatedProducts } from "@/lib/data/products";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductDetail(id);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId);

  return <ProductDetailClient product={product} related={related} />;
}
