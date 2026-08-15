'use client';

import { useEffect, useState } from 'react';
import { OrnamentalDivider } from '@/components/landing/OrnamentalDivider';
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion';
import { SITE_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * How long the veil stays fully opaque before it starts fading, so a fast
 * load never reads as a flicker. `FADE_MS` is the fade itself, on top.
 */
const HOLD_MS = 500;
const FADE_MS = 300;

/**
 * Branded loading veil, mounted once in the root layout so it is part of
 * the very first HTML the server sends — sighted visitors see the brand
 * mark before anything else, rather than a flash of the real page settling
 * into place underneath (fonts swapping in, ViewportFit's first measure).
 *
 * Purely a cover, not a gate: the real page is already in the DOM beneath
 * it the whole time, so it is marked `aria-hidden` and assistive tech goes
 * straight to that content instead of waiting out an animation that only
 * exists for sighted users.
 *
 * Starts identically on the server and the first client render (fully
 * opaque, `prefersReduced` false) so there is no hydration mismatch — the
 * same isReady-after-mount shape as `useCountdown`. Visitors who prefer
 * reduced motion skip the hold and fade entirely once that preference is
 * known, rather than sitting through a held frame for no motion payoff.
 */
export function SplashScreen() {
  const [stage, setStage] = useState<'hold' | 'fade' | 'done'>('hold');
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setStage('done');
      return;
    }

    const toFade = window.setTimeout(() => setStage('fade'), HOLD_MS);
    return () => window.clearTimeout(toFade);
  }, [prefersReduced]);

  useEffect(() => {
    if (stage !== 'fade') return;
    const toDone = window.setTimeout(() => setStage('done'), FADE_MS);
    return () => window.clearTimeout(toDone);
  }, [stage]);

  if (stage === 'done') return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'cotton-glow fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 px-6',
        'transition-opacity duration-300 ease-out',
        stage === 'fade' ? 'pointer-events-none opacity-0' : 'opacity-100'
      )}
    >
      {/*
        Sized off `min(vw, vh)`, not `vh` alone: this is a single unbroken
        word (no spaces for normal wrapping to break at), so width — the
        scarce axis on a narrow phone — has to bound the font size directly
        or the wide `tracking` blows past the viewport edge and gets
        clipped by `overflow: hidden` rather than wrapping. `max-w` +
        `break-words` is the last-resort net if it ever still doesn't fit.
      */}
      <p className="max-w-[92vw] break-words text-center font-serif text-[clamp(1.1rem,min(7vw,6vh),2.75rem)] uppercase tracking-[0.18em] text-zari">
        {SITE_CONFIG.shortName}
      </p>
      <OrnamentalDivider className="max-w-[16rem]" />
    </div>
  );
}

export default SplashScreen;
