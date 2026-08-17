'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/adminProducts';
import type { Product } from '@/types';

/**
 * Fetches the product catalog from Supabase — the single source of truth
 * for both the public site and the admin panel. RLS decides what each
 * caller actually sees (see supabase/migrations/0001_init.sql): an
 * anonymous visitor gets only ACTIVE rows, a signed-in admin gets
 * everything, from the exact same query.
 *
 * `ProductsSection` only ever mounts once the main site has taken over
 * (well after hydration — see LaunchGate's stage machine), so there's no
 * SSR/first-paint content to match here the way the countdown-era hooks
 * needed; a plain loading-then-loaded client fetch is the correct shape.
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load products. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { products, loading, error, refetch };
}
