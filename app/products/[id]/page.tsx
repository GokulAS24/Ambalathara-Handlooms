'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CircleCheck, MessageCircle, Phone } from 'lucide-react';
import { OrnamentalDivider } from '@/components/landing/OrnamentalDivider';
import { Navbar } from '@/components/site/Navbar';
import { ContactSection } from '@/components/site/ContactSection';
import { ProductSwatch } from '@/components/site/ProductSwatch';
import { buttonClassName } from '@/components/ui/Button';
import { buildWhatsAppUrl, PHONE_URL, SITE_CONFIG } from '@/lib/constants';
import { fetchProducts } from '@/lib/adminProducts';
import { cn, effectivePrice, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

/**
 * A dedicated, shareable page per product — replaces the earlier quick-view
 * modal (ProductImageViewer is now unused; see ProductCard's Link). Client
 * component because product data only ever lives in Supabase and is only
 * ever queried post-hydration in the browser (see lib/adminProducts.ts) —
 * this app has no server-side Supabase client, so there's no
 * generateMetadata for this route; the tab title is set client-side once
 * the product loads instead.
 */
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);

  // html/body default to overflow:hidden site-wide — the countdown page's
  // one-viewport layout depends on it — and are only unlocked by
  // `.site-launched` (see globals.css), which LaunchGate normally toggles
  // once the countdown finishes. This route never mounts LaunchGate, so it
  // needs the exact same unlock itself; same fix AdminApp uses for /admin.
  useEffect(() => {
    document.documentElement.classList.add('site-launched');
    return () => document.documentElement.classList.remove('site-launched');
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const product = products?.find((p) => p.id === params.id) ?? null;

  useEffect(() => {
    if (product) document.title = `${product.name} — ${SITE_CONFIG.shortName}`;
  }, [product]);

  return (
    <main className="relative w-full">
      <Navbar />

      {!products && !error && (
        <p className="px-5 py-32 text-center font-sans text-sm text-earth">Loading…</p>
      )}

      {error && (
        <div className="px-5 py-32 text-center">
          <p className="font-sans text-sm text-maroon">Unable to load this product. Please try again.</p>
          <Link href="/#products" className="mt-3 inline-block font-sans text-xs uppercase tracking-wide text-maroon underline">
            Back to collection
          </Link>
        </div>
      )}

      {products && !product && (
        <div className="px-5 py-32 text-center">
          <p className="font-serif text-2xl text-maroon">This piece is no longer available.</p>
          <Link href="/#products" className="mt-4 inline-block font-sans text-xs uppercase tracking-wide text-maroon underline">
            Back to collection
          </Link>
        </div>
      )}

      {product && <ProductDetail product={product} />}

      <ContactSection />
    </main>
  );
}

function ProductDetail({ product }: { product: Product }) {
  const activeItems = useMemo(() => {
    const items = product.items.filter((item) => item.status === 'ACTIVE');
    const primaryIndex = items.findIndex((item) => item.isPrimary);
    if (primaryIndex <= 0) return items;
    return [items[primaryIndex], ...items.slice(0, primaryIndex), ...items.slice(primaryIndex + 1)];
  }, [product.items]);

  const [index, setIndex] = useState(0);
  const activeItem = activeItems[index] ?? activeItems[0];
  const goTo = (nextIndex: number) => setIndex((nextIndex + activeItems.length) % activeItems.length);

  if (!activeItem) return null;

  const price = effectivePrice(product, activeItem);
  const caption = activeItem.description || product.description;
  const waMessage = buildWhatsAppUrl(
    `Hi! I'm interested in "${product.name}" (${formatPrice(price)}). ${product.description} — could you share more details?`
  );

  return (
    <section className="w-full px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#products"
          className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.2em] text-earth transition-colors hover:text-maroon"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to collection
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-md shadow-zari">
              {activeItem.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- product images are user-supplied and may live outside next/image's static analysis
                <img
                  src={activeItem.image}
                  alt={`${product.name}, ${product.fabric}`}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <ProductSwatch fabric={product.fabric} className="aspect-[4/5] rounded-md" />
              )}

              {activeItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goTo(index - 1)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-100/90 text-charcoal shadow-md transition-transform hover:scale-105 hover:text-maroon"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(index + 1)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-100/90 text-charcoal shadow-md transition-transform hover:scale-105 hover:text-maroon"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-charcoal/60 px-2.5 py-0.5 font-sans text-[0.65rem] text-cream-100">
                    {index + 1} / {activeItems.length}
                  </span>
                </>
              )}
            </div>

            {activeItems.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {activeItems.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === index}
                    className={cn(
                      'h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 shadow-sm transition-all',
                      i === index ? 'border-maroon shadow-md' : 'border-transparent opacity-70 hover:scale-105 hover:opacity-100'
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

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-gold-dark">{product.fabric}</p>
              <h1 className="mt-2 text-balance font-serif text-3xl leading-tight text-maroon sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-3 font-serif text-3xl text-maroon">{formatPrice(price)}</p>
              {product.availability && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 font-sans text-xs font-medium text-gold-dark">
                  <CircleCheck className="h-3.5 w-3.5" aria-hidden />
                  {product.availability}
                </p>
              )}
            </div>

            <OrnamentalDivider className="max-w-[10rem] opacity-70" />

            <p className="font-sans text-base leading-relaxed text-earth">{caption}</p>

            {product.specifications.length > 0 && (
              <dl className="divide-y divide-gold/20 border-y border-gold/30 font-sans text-sm">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-earth/80">{spec.label}</dt>
                    <dd className="text-right text-charcoal">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {product.delivery && (
              <p className="font-sans text-sm">
                <span className="text-earth/80">Delivery — </span>
                <span className="text-charcoal">{product.delivery}</span>
              </p>
            )}

            {(PHONE_URL || waMessage) && (
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                {waMessage && (
                  <a
                    href={waMessage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonClassName('primary', 'lg'),
                      'w-full shadow-loom transition-transform hover:scale-[1.02] active:scale-[0.98] sm:flex-1'
                    )}
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Order on WhatsApp
                  </a>
                )}
                {PHONE_URL && (
                  <a
                    href={PHONE_URL}
                    className={cn(
                      buttonClassName('ghost', 'lg'),
                      'w-full transition-transform hover:scale-[1.02] active:scale-[0.98] sm:flex-1'
                    )}
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    Call to Order
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
