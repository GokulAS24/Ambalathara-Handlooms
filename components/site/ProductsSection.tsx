'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { OrnamentalDivider } from '@/components/landing/OrnamentalDivider';
import { ProductImageViewer } from '@/components/site/ProductImageViewer';
import { ProductItemCard } from '@/components/site/ProductItemCard';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import type { Product, ProductItem } from '@/types';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/** One product's own section: its name/description, then a grid of its priced items. */
function ProductGroup({ product, onSelect }: { product: Product; onSelect: (product: Product, item: ProductItem) => void }) {
  const activeItems = product.items
    .filter((item) => item.status === 'ACTIVE')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (activeItems.length === 0) return null;

  return (
    <div className="w-full">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="font-serif text-2xl text-maroon sm:text-3xl">{product.name}</h3>
        {product.description && (
          <p className="mt-3 font-sans text-sm leading-relaxed text-earth">{product.description}</p>
        )}
      </div>

      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-8 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
      >
        {activeItems.map((item) => (
          <ProductItemCard
            key={item.id}
            item={item}
            fabric={product.fabric}
            onSelect={(selected) => onSelect(product, selected)}
          />
        ))}
      </motion.ul>
    </div>
  );
}

export function ProductsSection() {
  const products = useAdminProducts();
  const [viewer, setViewer] = useState<{ product: Product; item: ProductItem } | null>(null);

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

        {activeProducts.length === 0 ? (
          <p className="mt-14 text-center font-sans text-sm text-earth">Products will be available soon.</p>
        ) : (
          <div className="mt-14 flex flex-col gap-16">
            {activeProducts.map((product, index) => (
              <div key={product.id} className="flex flex-col gap-16">
                {index > 0 && <OrnamentalDivider className="mx-auto max-w-xs opacity-60" />}
                <ProductGroup product={product} onSelect={(p, item) => setViewer({ product: p, item })} />
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewer && (
          <ProductImageViewer
            product={viewer.product}
            activeItem={viewer.item}
            onNavigate={(item) => setViewer({ product: viewer.product, item })}
            onClose={() => setViewer(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default ProductsSection;
