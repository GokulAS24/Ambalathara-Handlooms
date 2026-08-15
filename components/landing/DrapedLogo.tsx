'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion';
import { BRAND_LOGO_SRC, BRAND_VIDEO_SRC } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * The brand mark: the studio's own animated render of the logo — the red
 * "A", the loom bar and warp threads, the kasavu saree draped across the
 * wordmark, breathing with a slow, continuous sway. It is the hero's one
 * moment of real scale, not a video *in* the page — no frame, no controls,
 * nothing reading as a player. `BRAND_LOGO_SRC` (the same composition as a
 * still) is both the `poster` shown before playback starts and the
 * fallback if the clip ever fails to load — `onError` swaps the whole
 * element for an `<Image>`, so a missing or unsupported video never leaves
 * a blank box.
 *
 * Feathered on every edge (see EDGE_FEATHER) so its rectangular frame never
 * reads as a box sitting on the page — it just fades into the cloth ground
 * behind it, the same trick a vignette does in print.
 */

/**
 * Where the composition sits inside the 1920×1080 frame, as a fraction of
 * the box — measured, not eyeballed: the source video was decoded to
 * frames spread across its full loop and diffed against a heavily blurred
 * copy of themselves (a local-contrast pass, since the vignette itself is
 * too close in colour to a fixed background sample to threshold against
 * directly). The union across every sampled frame is x[24.1%, 75.9%],
 * y[13.9%, 85.0%] — center (50.0%, 49.4%), half-extent (25.9%, 35.6%).
 * EDGE_FEATHER's opaque radius clears that half-extent with a margin at
 * every stop; re-measure both if the source composition ever changes.
 */
const EDGE_FEATHER = 'radial-gradient(ellipse 42% 49% at 50% 49.4%, #000 70%, transparent 100%)';

const SIZES = '(min-height: 800px) 44rem, 76vw';

export function DrapedLogo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    const play = () => {
      video.play().catch(() => {
        // Muted autoplay is still blocked by some mobile browsers until a
        // real gesture; wait for the first one and retry rather than
        // leaving the loop frozen on its poster frame.
        const resume = () => void video.play();
        window.addEventListener('pointerdown', resume, { once: true });
        window.addEventListener('touchstart', resume, { once: true });
      });
    };

    if (!prefersReduced) play();

    // A backgrounded tab gains nothing from decoding a hidden video every
    // frame; pausing there and resuming on return is a pure cost saving.
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (!prefersReduced) play();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [prefersReduced, videoFailed]);

  return (
    <div
      className={cn(
        'relative mx-auto select-none',
        videoFailed ? 'aspect-square' : 'aspect-video',
        className
      )}
      style={{
        width: 'var(--logo-size)',
        WebkitMaskImage: EDGE_FEATHER,
        maskImage: EDGE_FEATHER,
      }}
    >
      {videoFailed ? (
        <Image
          src={BRAND_LOGO_SRC}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes={SIZES}
          className="object-contain"
        />
      ) : (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          autoPlay={!prefersReduced}
          preload="auto"
          poster={BRAND_LOGO_SRC}
          disablePictureInPicture
          disableRemotePlayback
          controls={false}
          tabIndex={-1}
          aria-hidden="true"
          onError={() => setVideoFailed(true)}
        >
          <source src={BRAND_VIDEO_SRC} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

export default DrapedLogo;
