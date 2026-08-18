"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";
import WeavePattern from "@/components/WeavePattern";

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ProductGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;

  return (
    <section id="collection" className="relative overflow-hidden bg-clay-50/40 py-20">
      <WeavePattern className="pointer-events-none absolute inset-0 text-clay-800 opacity-[0.05]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-500">Our Collection</p>
          <h2 className="mt-2 font-serif text-3xl text-clay-800 md:text-4xl">Handwoven, Just for You</h2>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-clay-700 underline decoration-clay-300 underline-offset-4 transition-colors hover:text-brand-600"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
