'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Guarantees the page never scrolls, on top of (not instead of) the fluid
 * `clamp()` sizing in globals.css.
 *
 * The CSS tokens are tuned so real devices need no help — this only
 * engages for the cases no clamp budget can plan around: an OS font-size
 * boost, a fallback font with different metrics, a browser zoomed to
 * 500%, or a viewport shorter than the design's own legibility floor (a
 * folded foldable, a resized dev-tools pane). In those cases the content
 * is measured against the space actually available and scaled down as one
 * block — centred, aspect preserved — rather than letting it clip or
 * scroll.
 *
 * `children` must be exactly the content to fit; this component supplies
 * the flex centring around it.
 */
export function ViewportFit({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const fit = () => {
      // Measured at scale 1 first — shrinking the last frame's transform
      // would make the content measure smaller than it actually is and
      // the fit would ratchet down every call.
      inner.style.transform = 'scale(1)';

      const available = outer.clientHeight;
      const needed = inner.scrollHeight;
      const next = needed > available ? available / needed : 1;

      inner.style.transform = next < 1 ? `scale(${next})` : '';
      setScale(next);
    };

    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(outer);
    observer.observe(inner);

    // iOS Safari fires resize late (and sometimes not at all) around an
    // orientation change; this catches it independently of ResizeObserver.
    window.addEventListener('orientationchange', fit);

    return () => {
      observer.disconnect();
      window.removeEventListener('orientationchange', fit);
    };
  }, []);

  return (
    <div ref={outerRef} className={cn('flex min-h-0 flex-1 items-center justify-center overflow-hidden', className)}>
      <div
        ref={innerRef}
        className="w-full"
        style={{
          transformOrigin: 'center center',
          // Scaling is deliberately un-animated: it only ever runs once on
          // mount/resize, and animating it would mean the layout visibly
          // "settles" on first paint.
          transform: scale < 1 ? `scale(${scale})` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default ViewportFit;
