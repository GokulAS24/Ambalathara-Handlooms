"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MouseEvent, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import StarRating from "@/components/StarRating";
import type { Prisma } from "@prisma/client";

export type ProductCardData = Prisma.ProductGetPayload<{
  include: { images: true; category: true };
}>;

const cardVariants = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };

export default function ProductCard({ product }: { product: ProductCardData }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 20, mass: 0.4 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const liked = isWishlisted(product.id);
  const [justAdded, setJustAdded] = useState(false);

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  function handleLikeClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  }

  function handleAddToCart(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <motion.div variants={cardVariants} transition={{ duration: 0.5 }} className="group">
      <Link href={`/product/${product.id}`} className="block">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformPerspective: 800 }}
          className="relative aspect-[4/5] overflow-hidden rounded-sm bg-clay-50"
        >
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText ?? product.name}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover"
            />
          )}
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.altText ?? product.name}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          <motion.button
            type="button"
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleLikeClick}
            whileTap={{ scale: 0.8 }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-sand-50/90 text-clay-700 shadow-sm backdrop-blur-sm transition-colors hover:text-brand-600"
          >
            <motion.span
              key={liked ? "liked" : "unliked"}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Heart size={16} strokeWidth={2} className={liked ? "fill-brand-500 text-brand-500" : ""} />
            </motion.span>
          </motion.button>

          <motion.button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="absolute inset-x-3 bottom-3 overflow-hidden rounded-sm bg-sand-50/95 py-2.5 text-xs font-semibold uppercase tracking-wider text-clay-800 opacity-100 backdrop-blur-sm transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-40"
          >
            <AnimatePresence mode="wait" initial={false}>
              {justAdded ? (
                <motion.span
                  key="added"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-center gap-1.5"
                >
                  <Check size={13} /> Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="block text-center"
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        <div className="mt-3.5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-clay-400">
            {product.category?.name} · {product.weaveType}
          </p>
          <h3 className="mt-1 text-[15px] text-clay-800">{product.name}</h3>
          {product.reviewCount > 0 && (
            <StarRating rating={product.avgRating} reviewCount={product.reviewCount} className="mt-1.5" />
          )}
          <span className="mt-1.5 block text-sm font-medium text-clay-600">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
