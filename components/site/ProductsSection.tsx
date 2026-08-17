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
          <p className="mt-14 text-center font-sans text-sm text-earth">Loading collection…</p>
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

export default ProductsSection;
