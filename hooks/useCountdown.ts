'use client';

import { useEffect, useRef, useState } from 'react';
import type { CountdownState } from '@/types';
import { getTimeLeft, ZERO_TIME } from '@/lib/countdown';

/**
 * Countdown to an absolute instant, hydration-safe.
 *
 * Why `isReady` exists: the server renders at time T₀ and the browser
 * hydrates at T₁. Any clock-derived markup would differ between the two
 * and React would scream about it. So the first client render is
 * deliberately identical to the server's (all zeros, `isReady: false`),
 * and the real value only lands in the effect that runs after mount.
 *
 * Ticking is a self-correcting `setTimeout` chain rather than
 * `setInterval` — it re-aligns to the next whole second every pass, so a
 * throttled background tab or a slow frame cannot make the clock drift.
 *
 * @param targetTimestamp Epoch milliseconds of the launch moment.
 */
export function useCountdown(targetTimestamp: number): CountdownState {
  const [state, setState] = useState<CountdownState>({
    ...ZERO_TIME,
    isReady: false,
    isComplete: false,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      const now = Date.now();
      const timeLeft = getTimeLeft(targetTimestamp, now);

      setState({
        ...timeLeft,
        isReady: true,
        isComplete: timeLeft.total <= 0,
      });

      if (timeLeft.total <= 0) return; // Launched — stop the chain.

      // Fire just after the next whole-second boundary.
      const delay = 1000 - (now % 1000) + 20;
      timeoutRef.current = setTimeout(tick, delay);
    };

    tick();

    // A backgrounded tab has its timers throttled; resync on return.
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      tick();
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [targetTimestamp]);

  return state;
}
