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
 *
 * The horizontal radius and stop come from `--logo-feather-rx` /
 * `--logo-feather-stop` (globals.css) so they can swap for the 4:3 mobile
 * crop — vertical numbers stay literal since object-cover never crops
 * height when only the box's width fraction narrows. See the media query
 * next to `--logo-aspect` in globals.css for that derivation.
 *
 * This is a real `mask-image`, applied to the live, playing video too —
 * masking an *actively decoding* video knocks some mobile GPUs off their
 * fast hardware video-compositing path onto a software one that re-masks
 * every frame, which is fine for a bounded clip but not something to run
 * forever. See LOOP_LIMIT below for how that's kept bounded rather than
 * solved by dropping the mask (tried faking the fade with a flat overlay
 * color instead of a true mask — it cannot match the actual, non-flat
 * background behind it, and visibly regressed to exactly the "logo pasted
 * on the page" seam this mask exists to avoid).
 */
const EDGE_FEATHER =
  'radial-gradient(ellipse var(--logo-feather-rx) 49% at 50% 49.4%, #000 var(--logo-feather-stop), transparent 100%)';

const SIZES = '(min-height: 800px) 44rem, 76vw';

/**
 * Loops before the video settles and holds its final frame rather than
 * playing forever. The composition is designed to loop seamlessly (a slow
 * continuous sway, end state ≈ start state), so stopping here reads as
 * settling, not stuttering.
 *
 * This is the actual fix for a real bug: a masked, `loop`-forever video
 * keeps paying the (mobile-GPU-heavy) masked-compositing cost for as long
 * as the tab stays open, which was reported pinning a phone hard enough to
 * need a restart. A masked but *stopped* video costs the same as a masked
 * static image — this bounds the expensive window to one ~14s play-through
 * instead of forever. Kept at 1, not something larger: this is a bug fix
 * for a device-freezing report, not a place to spend extra margin.
 */
const LOOP_LIMIT = 1;

export function DrapedLogo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    let loopsPlayed = 0;
    // Set once LOOP_LIMIT is reached, so a tab refocus (see onVisibility
    // below) can't resume playback and reopen the expensive masked-video
    // window this whole effect exists to close.
    let settled = false;

    const play = () => {
      if (settled) return;
      video.play().catch(() => {
        // Muted autoplay is still blocked by some mobile browsers until a
        // real gesture; wait for the first one and retry rather than
        // leaving the loop frozen on its poster frame.
        const resume = () => void play();
        window.addEventListener('pointerdown', resume, { once: true });
        window.addEventListener('touchstart', resume, { once: true });
      });
    };

    // `loop` is intentionally left off the <video> element (see LOOP_LIMIT)
    // so this fires instead of the browser silently restarting playback.
    const onEnded = () => {
      loopsPlayed += 1;
      if (loopsPlayed >= LOOP_LIMIT) {
        settled = true;
        return;
      }
      video.currentTime = 0;
      play();
    };

    if (!prefersReduced) {
      video.addEventListener('ended', onEnded);
      play();
    }

    // A backgrounded tab gains nothing from decoding a hidden video every
    // frame; pausing there and resuming on return is a pure cost saving.
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (!prefersReduced) play();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      video.removeEventListener('ended', onEnded);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [prefersReduced, videoFailed]);

  return (
    <div
      className={cn('relative mx-auto select-none', className)}
      style={{
        width: 'var(--logo-size)',
        aspectRatio: videoFailed ? '1 / 1' : 'var(--logo-aspect)',
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
