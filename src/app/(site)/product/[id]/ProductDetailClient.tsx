"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Minus, Plus, Check, ChevronRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import StarRating from "@/components/StarRating";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import TrustBadges from "@/components/TrustBadges";
import ShareButton from "@/components/ShareButton";
import ProductGallery from "@/components/ProductGallery";
import { createReview } from "@/lib/actions/reviews.actions";
import type { Prisma } from "@prisma/client";

type ProductFull = Prisma.ProductGetPayload<{
  include: { images: true; specs: true; reviews: true; category: true };
}>;

const WHATSAPP_GREEN = "#25D366";
const CLAY_900 = "#190f0a";

export default function ProductDetailClient({
  product,
  related,
}: {
  product: ProductFull;
  related: ProductCardData[];
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const liked = isWishlisted(product.id);

  function handleAddToCart() {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    if (redirecting) return;
    setRedirecting(true);
    const total = (product.price * qty).toLocaleString("en-IN");
    const message = [
      "Hi! I'd like to purchase:",
      "",
      `*${product.name}*`,
      `Quantity: ${qty}`,
      `Price: Rs. ${product.price.toLocaleString("en-IN")} each`,
      `Total: Rs. ${total}`,
      "",
      "Could you confirm availability?",
    ].join("\n");
    setTimeout(() => {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    }, 650);
    setTimeout(() => setRedirecting(false), 2400);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-clay-400">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight size={12} />
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-brand-600">
          {product.category.name}
        </Link>
        <ChevronRight size={12} />
        <span className="text-clay-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images.map((i) => i.url)} alt={product.name}>
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <ShareButton
              title={product.name}
              text={`Check out ${product.name}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-sand-50/90 text-clay-700 shadow-sm backdrop-blur-sm transition-colors hover:text-brand-600"
            />
            <button
              type="button"
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWishlist(product.id)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-sand-50/90 text-clay-700 shadow-sm backdrop-blur-sm transition-colors hover:text-brand-600"
            >
              <Heart size={18} className={liked ? "fill-brand-500 text-brand-500" : ""} />
            </button>
          </div>
        </ProductGallery>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-clay-400">
            {product.category.name} · {product.weaveType}
          </p>
          <h1 className="mt-2 text-2xl font-semibold uppercase tracking-[0.08em] text-clay-800 md:text-3xl">
            {product.name}
          </h1>

          {product.reviewCount > 0 && (
            <div className="mt-3">
              <StarRating rating={product.avgRating} reviewCount={product.reviewCount} size={15} />
            </div>
          )}

          <p className="mt-5 text-xl font-medium uppercase tracking-wide text-clay-800">
            Rs. {product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-sm text-clay-400">
            Tax included. <span className="cursor-pointer underline underline-offset-2">Shipping calculated</span> at checkout.
          </p>

          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-clay-500">{product.description}</p>

          <div className="mt-8 border-t border-clay-200" />

          <div className="mt-6 flex h-13 items-stretch border border-clay-300">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex w-14 items-center justify-center text-clay-600 transition-colors hover:bg-clay-50 hover:text-brand-600"
            >
              <Minus size={14} />
            </button>
            <span className="flex flex-1 items-center justify-center border-x border-clay-300 text-sm font-medium text-clay-800">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(product.stock || 10, q + 1))}
              className="flex w-14 items-center justify-center text-clay-600 transition-colors hover:bg-clay-50 hover:text-brand-600"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="relative mt-3 h-13 w-full overflow-hidden border border-clay-800 text-xs font-semibold uppercase tracking-[0.2em] text-clay-800 transition-colors hover:bg-clay-50 disabled:opacity-40"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full items-center justify-center gap-2"
                >
                  <Check size={14} /> Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full items-center justify-center"
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <motion.button
            type="button"
            onClick={handleBuyNow}
            animate={{ backgroundColor: redirecting ? WHATSAPP_GREEN : CLAY_900 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative mt-3 h-13 w-full overflow-hidden text-xs font-semibold uppercase tracking-[0.2em] text-sand-50"
          >
            <AnimatePresence mode="wait" initial={false}>
              {redirecting ? (
                <motion.span
                  key="redirecting"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Redirecting to WhatsApp…
                </motion.span>
              ) : (
                <motion.span
                  key="buy"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full items-center justify-center"
                >
                  Buy It Now
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="mt-5 bg-clay-50 py-3 text-center text-sm text-clay-600">
            Delivery Time <span className="font-semibold text-clay-800">7–10 DAYS</span> FROM DATE OF ORDER
          </div>

          <TrustBadges />

          {product.specs.length > 0 && (
            <div className="mt-6 border-t border-clay-100 pt-6">
              <h2 className="text-xl font-bold text-clay-900">Product details</h2>
              <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                {product.specs.map((spec) => (
                  <div key={spec.id} className="border-b border-clay-100 pb-4">
                    <p className="text-sm text-clay-400">{spec.label}</p>
                    <p className="mt-1 text-lg text-clay-800">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="mt-20 border-t border-clay-100 pt-12">
        <h2 className="font-serif text-2xl text-clay-800">
          Reviews <span className="ml-2 text-base font-sans font-normal text-clay-400">({product.reviews.length})</span>
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {product.reviews.map((review) => (
            <div key={review.id} className="rounded-sm border border-clay-100 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-clay-800">{review.author}</p>
                <span className="text-xs text-clay-400">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </span>
              </div>
              <StarRating rating={review.rating} className="mt-1.5" />
              <p className="mt-3 text-sm leading-relaxed text-clay-500">{review.comment}</p>
            </div>
          ))}
        </div>

        <form action={createReview.bind(null, product.id)} className="mt-8 flex max-w-md flex-col gap-3">
          <input name="author" placeholder="Your name" required className="border border-clay-200 p-2" />
          <select name="rating" required className="border border-clay-200 p-2">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} Stars</option>
            ))}
          </select>
          <textarea name="comment" placeholder="Your review" required className="border border-clay-200 p-2" />
          <button type="submit" className="bg-clay-900 py-2 text-sm text-sand-50">Submit Review</button>
        </form>
      </section>

      {related.length > 0 && (
        <section className="mt-20 border-t border-clay-100 pt-12">
          <h2 className="mb-8 font-serif text-2xl text-clay-800">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
