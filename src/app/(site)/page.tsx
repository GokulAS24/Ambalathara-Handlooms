import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Collections from "@/components/Collections";
import Stats from "@/components/Stats";
import ProductGrid from "@/components/ProductGrid";
import Craft from "@/components/Craft";
import { getSiteData, getCategoryTree } from "@/lib/data/site";
import { getFeaturedProducts } from "@/lib/data/products";

export default async function Home() {
  const [{ banners }, categories, featured] = await Promise.all([
    getSiteData(),
    getCategoryTree(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <Hero banners={banners} />
      <Marquee />
      <Collections categories={categories} />
      <Stats />
      <ProductGrid products={featured} />
      <Craft />
    </>
  );
}
