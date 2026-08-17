'use client';

import { useEffect, useState } from 'react';
import { CountdownLanding } from '@/components/landing/CountdownLanding';
import { PreviewButton } from '@/components/dev/PreviewButton';
import { LogoReveal } from '@/components/layout/LogoReveal';
import { MainSite } from '@/components/site/MainSite';
import { useCountdown } from '@/hooks/useCountdown';
import { LAUNCH_TIMESTAMP } from '@/lib/constants';

type Stage = 'countdown' | 'reveal' | 'site';

/**
 * Owns the full post-countdown flow: countdown -> logo reveal -> main site.
 * Same hydration-safe shape useCountdown already establishes elsewhere
 * (isReady stays false through SSR and the first client render): server
 * and first paint always render CountdownLanding, and the flow only
 * advances after mount, once the real clock is known.
 */
export function LaunchGate() {
  const { isReady, isComplete } = useCountdown(LAUNCH_TIMESTAMP);
  const [stage, setStage] = useState<Stage>('countdown');

  // The real trigger. Guarded to only ever move stage forward — this effect
  // re-running (e.g. once isComplete settles) must never reset a stage
  // already advanced past 'countdown', whether that happened via the real
  // countdown or the (dev-only) preview button below.
  useEffect(() => {
    if (isReady && isComplete) {
      setStage((current) => (current === 'countdown' ? 'reveal' : current));
    }
  }, [isReady, isComplete]);

  useEffect(() => {
    // The countdown page depends on html/body being overflow:hidden (see
    // globals.css) so its one-viewport layout can never scroll. MainSite is
    // a normal multi-section page and needs real document scroll back —
    // scoped to this class so the countdown's own rules stay untouched.
    // LogoReveal is a full-screen fixed overlay either way, so it doesn't
    // need the scroll unlocked yet — only 'site' does.
    document.documentElement.classList.toggle('site-launched', stage === 'site');
  }, [stage]);

  return (
    <>
      {stage === 'countdown' && <CountdownLanding />}
      {stage === 'reveal' && <LogoReveal onComplete={() => setStage('site')} />}
      {stage === 'site' && <MainSite />}

      {/*
        TEMPORARY — DEVELOPMENT ONLY, see components/dev/PreviewButton.tsx.
        Triggers the exact same `setStage('reveal')` transition the real
        countdown completion uses above — not a separate preview path.
        To remove: delete this block, the PreviewButton import above, and
        the PreviewButton.tsx file itself.
      */}
      {stage === 'countdown' && process.env.NODE_ENV === 'development' && (
        <PreviewButton onPreview={() => setStage('reveal')} />
      )}
    </>
  );
}

export default LaunchGate;
