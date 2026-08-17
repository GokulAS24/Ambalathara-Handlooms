'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProductSwatch } from '@/components/site/ProductSwatch';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

const card = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

/**
 * One card per product — its cover (primary) image, name, fabric and
 * price. Clicking navigates to that product's own page (app/products/[id])
 * for its full gallery and details. Interactivity is signalled identically
 * on hover and `:focus-visible`, since hover-only affordances fail touch
 * and keyboard users.
 */
export function ProductCard({ product }: { product: Product }) {
  const activeItems = product.items.filter((item) => item.status === 'ACTIVE');
  const cover = activeItems.find((item) => item.isPrimary) ?? activeItems[0];

  return (
    <motion.li variants={card} className="list-none">
      <Link
        href={`/products/${product.id}`}
        className="card-handloom group flex w-full flex-col overflow-hidden rounded-sm text-left shadow-zari transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-lg focus-visible:-translate-y-1 focus-visible:border-gold focus-visible:shadow-lg"
      >
        <div className="relative overflow-hidden">
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full border border-gold/60 bg-cream-100/85 px-2.5 py-0.5 font-sans text-[0.6rem] uppercase tracking-[0.25em] text-gold-dark backdrop-blur-sm">
            {product.fabric}
          </span>
          {activeItems.length > 1 && (
            <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-charcoal/60 px-2 py-0.5 font-sans text-[0.6rem] text-cream-100">
              {activeItems.length} photos
            </span>
          )}
          {cover?.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- product images are user-supplied and may live outside next/image's static analysis
            <img
              src={cover.image}
              alt={`${product.name}, ${product.fabric}`}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105"
            />
          ) : (
            <ProductSwatch fabric={product.fabric} />
          )}
        </div>

        <div className="flex flex-col gap-1 p-4 text-center">
          <h3 className="font-serif text-lg text-maroon">{product.name}</h3>
          <p className="font-sans text-base text-charcoal">{formatPrice(product.price)}</p>
          <span className="mx-auto font-sans text-[0.65rem] uppercase tracking-[0.2em] text-earth/70 transition-colors duration-300 group-hover:text-maroon group-focus-visible:text-maroon">
            Explore
            <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1">
              →
            </span>
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

export default ProductCard;
