import { Suspense } from "react";
import ShopContent from "./ShopContent";
import { getShopProducts } from "@/lib/data/products";
import { getAllCategoriesFlat } from "@/lib/data/site";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getShopProducts(), getAllCategoriesFlat()]);

  return (
    <Suspense fallback={null}>
      <ShopContent products={products} categories={categories} />
    </Suspense>
  );
}
