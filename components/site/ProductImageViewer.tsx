'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, Phone, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ProductSwatch } from '@/components/site/ProductSwatch';
import { buttonClassName } from '@/components/ui/Button';
import { buildWhatsAppUrl, PHONE_URL } from '@/lib/constants';
import { cn, effectivePrice, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

/**
 * The product's full gallery — cover image first, then the rest in display
 * order — plus its description, specs, availability, delivery and
 * Call/WhatsApp actions. Owns which image is showing internally (starting
 * at the product's primary item) so the catalogue grid only ever needs to
 * pass the product itself, not a pre-selected item.
 */
export function ProductImageViewer({ product, onClose }: { product: Product; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const activeItems = useMemo(() => {
    const items = product.items.filter((item) => item.status === 'ACTIVE');
    const primaryIndex = items.findIndex((item) => item.isPrimary);
    if (primaryIndex <= 0) return items;
    return [items[primaryIndex], ...items.slice(0, primaryIndex), ...items.slice(primaryIndex + 1)];
  }, [product.items]);

  const [index, setIndex] = useState(0);
  const activeItem = activeItems[index];

  const goTo = (nextIndex: number) => setIndex((nextIndex + activeItems.length) % activeItems.length);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && activeItems.length > 1) goTo(index - 1);
      if (event.key === 'ArrowRight' && activeItems.length > 1) goTo(index + 1);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-binding on every index change is unnecessary; goTo/onClose read current props via closure each keydown
  }, [index, activeItems.length]);

  if (!activeItem) return null;

  const price = effectivePrice(product, activeItem);
  const caption = activeItem.description || product.description;
  const waMessage = buildWhatsAppUrl(
    `Hi! I'm interested in "${product.name}" (${formatPrice(price)}). ${product.description} — could you share more details?`
  );

  return (
    <motion.div
      role="presentation"
      className="fixed inset-0 z-[300] flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-viewer-title"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="card-handloom relative grid max-h-[90vh] w-full max-w-3xl grid-cols-1 overflow-y-auto rounded-sm shadow-zari outline-none sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream-100/90 text-charcoal transition-colors hover:bg-cream-100 hover:text-maroon"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div>
          <div className="relative">
            {activeItem.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- product images are user-supplied and may live outside next/image's static analysis
              <img
                src={activeItem.image}
                alt={`${product.name}, ${product.fabric}`}
                className="h-64 w-full object-cover sm:h-96"
              />
            ) : (
              <ProductSwatch fabric={product.fabric} className="aspect-auto h-64 rounded-t-sm sm:h-96 sm:rounded-l-sm sm:rounded-tr-none" />
            )}

            {activeItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream-100/90 text-charcoal transition-colors hover:bg-cream-100 hover:text-maroon"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream-100/90 text-charcoal transition-colors hover:bg-cream-100 hover:text-maroon"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-charcoal/60 px-2.5 py-0.5 font-sans text-[0.65rem] text-cream-100">
                  {index + 1} / {activeItems.length}
                </span>
              </>
            )}
          </div>

          {activeItems.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {activeItems.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    'h-12 w-12 shrink-0 overflow-hidden rounded-sm border-2 transition-colors',
                    i === index ? 'border-maroon' : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- thumbnail of a user-supplied image
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ProductSwatch fabric={product.fabric} className="aspect-square h-full w-full" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <div>
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-gold-dark">{product.fabric}</p>
            <h2 id="product-viewer-title" className="mt-1 font-serif text-2xl text-maroon">
              {product.name}
            </h2>
            <p className="mt-2 font-serif text-2xl text-maroon">{formatPrice(price)}</p>
          </div>

          <p className="font-sans text-sm leading-relaxed text-earth">{caption}</p>

          {product.specifications.length > 0 && (
            <dl className="divide-y divide-gold/20 border-y border-gold/30 font-sans text-sm">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-4 py-2">
                  <dt className="text-earth/80">{spec.label}</dt>
                  <dd className="text-right text-charcoal">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="grid grid-cols-1 gap-1.5 font-sans text-sm sm:grid-cols-2">
            {product.availability && (
              <p>
                <span className="text-earth/80">Availability — </span>
                <span className="text-charcoal">{product.availability}</span>
              </p>
            )}
            {product.delivery && (
              <p>
                <span className="text-earth/80">Delivery — </span>
                <span className="text-charcoal">{product.delivery}</span>
              </p>
            )}
          </div>

          {(PHONE_URL || waMessage) && (
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              {PHONE_URL && (
                <a href={PHONE_URL} className={cn(buttonClassName('primary', 'md'), 'flex-1 whitespace-nowrap')}>
                  <Phone className="h-4 w-4" aria-hidden />
                  Call Us
                </a>
              )}
              {waMessage && (
                <a
                  href={waMessage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonClassName('ghost', 'md'), 'flex-1 whitespace-nowrap')}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProductImageViewer;
