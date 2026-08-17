'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion';
import { LOGO_REVEAL_ASPECT, LOGO_REVEAL_SRC } from '@/lib/constants';
import { cn } from '@/lib/utils';

/** How long the mark holds at full size before it fades toward the site. */
const HOLD_MS = 1600;
const FADE_MS = 500;

/**
 * The transitional stage between the countdown finishing and the main site
 * mounting — replaces the old looping brand video there (see the 2026-08-16
 * memory log entry: a masked, forever-looping video was pinning some
 * Android phones hard enough to need a restart). This is a static image,
 * shown once, briefly — no continuous decode/compositing cost at all.
 *
 * The logo's own file has a white background. Rather than editing the
 * asset, `mix-blend-multiply` makes white pixels drop out against the
 * cream page behind it while the mark's own ink stays put — the same
 * "blend into the cloth" goal DrapedLogo's EDGE_FEATHER mask served for the
 * video, achieved here with a technique that costs nothing on a static
 * image (unlike masking a video, see the memory log entry above).
 *
 * Same hold-then-fade shape as SplashScreen, with one difference: this is
 * a real stage in LaunchGate's state machine (CountdownLanding has already
 * unmounted, MainSite hasn't mounted yet), not a decorative veil sitting
 * on top of already-rendered content, so it calls `onComplete` rather than
 * just unmounting itself. Visitors who prefer reduced motion skip it
 * entirely, same reasoning as SplashScreen: no held frame with no motion
 * payoff, straight through to the real content.
 */
export function LogoReveal({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'hold' | 'fade'>('hold');
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      onComplete();
      return;
    }
    const toFade = window.setTimeout(() => setStage('fade'), HOLD_MS);
    return () => window.clearTimeout(toFade);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onComplete is a fresh setState wrapper every render, not a dependency that should retrigger this
  }, [prefersReduced]);

  useEffect(() => {
    if (stage !== 'fade') return;
    const toDone = window.setTimeout(onComplete, FADE_MS);
    return () => window.clearTimeout(toDone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'cotton-glow fixed inset-0 z-[100] flex items-center justify-center',
        'transition-opacity ease-out',
        stage === 'fade' ? 'pointer-events-none opacity-0' : 'opacity-100'
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.86 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-[92vw]"
        style={{ width: 'clamp(14rem, 60vw, 28rem)', aspectRatio: LOGO_REVEAL_ASPECT }}
      >
        <Image
          src={LOGO_REVEAL_SRC}
          alt=""
          fill
          priority
          sizes="(min-width: 640px) 28rem, 60vw"
          className="object-contain mix-blend-multiply"
        />
      </motion.div>
    </div>
  );
}

export default LogoReveal;
