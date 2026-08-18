"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useProductsByIds } from "@/hooks/useProductsByIds";
import ProductCard from "@/components/ProductCard";

export default function WishlistPageClient() {
  const { wishlist } = useWishlist();
  const { products, loading } = useProductsByIds(wishlist);

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-6 py-16">
      <div className="mb-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-500">Your Wishlist</p>
        <h1 className="mt-2 font-serif text-3xl text-clay-800 md:text-4xl">Saved for Later</h1>
      </div>

      {loading ? (
        <p className="text-center text-clay-400">Loading…</p>
      ) : products.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <Heart size={40} strokeWidth={1.25} className="text-clay-300" />
          <p className="text-clay-500">Nothing here yet — tap the heart on any product to save it.</p>
          <Link href="/shop" className="mt-2 rounded-sm bg-clay-800 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-sand-50 transition-colors hover:bg-clay-900">
            Browse the Collection
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
