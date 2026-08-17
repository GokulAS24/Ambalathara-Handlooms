'use client';

import { useEffect, useState } from 'react';
import { loadAdminProducts } from '@/lib/adminProducts';
import { PRODUCTS } from '@/lib/products';
import type { Product } from '@/types';

/**
 * Same hydration-safe shape as useCountdown/LogoReveal elsewhere in this
 * codebase: state starts identical to the server render (the static
 * PRODUCTS array), and only swaps to the admin's localStorage draft after
 * mount, once `window` is known to exist — so there's no hydration
 * mismatch between server and first client render.
 *
 * Listens for both the native `storage` event (fires in *other* tabs when
 * localStorage changes — e.g. the site open in one tab, /admin in another)
 * and the custom `admin-products-updated` event lib/adminProducts.ts
 * dispatches on every save (fires in *this* tab — e.g. /admin embeds this
 * same hook via ProductsSection for a live in-page preview).
 */
export function useAdminProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    const refresh = () => setProducts(loadAdminProducts() ?? PRODUCTS);

    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('admin-products-updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('admin-products-updated', refresh);
    };
  }, []);

  return products;
}
