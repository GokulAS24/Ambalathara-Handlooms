'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks `prefers-reduced-motion`. Returns false on the server and the
 * first client render so markup matches; decorative loops are switched
 * off after mount for visitors who ask for stillness.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return prefersReduced;
}
