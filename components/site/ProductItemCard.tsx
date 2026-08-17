'use client';

import { motion } from 'framer-motion';
import { ProductSwatch } from '@/components/site/ProductSwatch';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductItem } from '@/types';

const card = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

/**
 * One priced image within a product's grid — deliberately minimal (image +
 * price, per the catalog spec), not a repeat of the product's own name and
 * description above it.
 */
export function ProductItemCard({
  item,
  fabric,
  onSelect,
}: {
  item: ProductItem;
  fabric: Product['fabric'];
  onSelect: (item: ProductItem) => void;
}) {
  return (
    <motion.li variants={card} className="list-none">
      <button
        type="button"
        onClick={() => onSelect(item)}
        aria-haspopup="dialog"
        className="card-handloom group flex w-full flex-col overflow-hidden rounded-sm text-left shadow-zari transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1"
      >
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- product images are user-supplied and may live outside next/image's static analysis
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          <ProductSwatch fabric={fabric} />
        )}

        <p className="p-4 text-center font-serif text-lg text-maroon">{formatPrice(item.price)}</p>
      </button>
    </motion.li>
  );
}

export default ProductItemCard;
