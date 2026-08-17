'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { OrnamentalDivider } from '@/components/landing/OrnamentalDivider';
import { ProductCard } from '@/components/site/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export function ProductsSection() {
  const { products, loading, error, refetch } = useProducts();

  const activeProducts = useMemo(
    () =>
      products
        .filter((product) => product.status === 'ACTIVE' && product.items.some((item) => item.status === 'ACTIVE'))
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [products]
  );

  return (
    <section id="products" className="w-full scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-sans text-xs uppercase tracking-zari text-gold-dark">The Collection</h2>
          <p className="mt-3 font-serif text-3xl text-maroon sm:text-4xl">Handwoven, Piece by Piece</p>
          <OrnamentalDivider className="mx-auto mt-6 max-w-xs opacity-80" />
        </div>

        {loading ? (
          <ProductGridSkeleton />
        ) : error ? (
          <div className="mt-14 text-center">
            <p className="font-sans text-sm text-maroon">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-3 font-sans text-xs uppercase tracking-wide text-maroon underline"
            >
              Try again
            </button>
          </div>
        ) : activeProducts.length === 0 ? (
          <p className="mt-14 text-center font-sans text-sm text-earth">Products will be available soon.</p>
        ) : (
          <motion.ul
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-14 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
          >
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}

/**
 * Stands in the exact shape of the real grid below (same columns/gaps) so
 * there's no layout jump once products arrive — a shimmering placeholder
 * card, not a spinner or bare text, in keeping with the catalogue's own
 * "zari sheen" motif (the same sweep CountdownTimer uses). Card count and
 * heights are illustrative, not meaningful, so they're aria-hidden with a
 * single accessible "loading" announcement instead.
 */
function ProductGridSkeleton() {
  return (
    <div
      className="mt-14 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
      role="status"
      aria-label="Loading collection"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="card-handloom flex flex-col overflow-hidden rounded-sm shadow-zari"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream-300">
            <span
              className="absolute inset-y-0 -left-1/2 w-1/2 bg-zari-sweep opacity-60 animate-zari-shimmer"
              style={{ animationDelay: `${(i % 4) * 0.35}s` }}
            />
          </div>
          <div className="flex flex-col items-center gap-2 p-4">
            <span className="h-3 w-2/3 rounded-full bg-cream-300" />
            <span className="h-3 w-1/3 rounded-full bg-cream-300" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductsSection;
