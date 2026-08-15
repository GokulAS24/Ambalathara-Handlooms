'use client';

import { motion } from 'framer-motion';
import { ClothGround } from '@/components/landing/ClothGround';
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Purely decorative loom atmosphere: the artwork's own cloth ground, kasavu
 * temple borders, drifting warp threads, a shuttle crossing the weft, and a
 * slow zari light sweep.
 *
 * Everything here is `aria-hidden` and `pointer-events-none` — it must
 * never intercept a click or reach a screen reader. All geometry is
 * hand-authored constants (never Math.random), so the server and client
 * render byte-identical markup.
 */

/** Floating lint motes — fixed coordinates keep hydration deterministic. */
const MOTES = [
  { left: '8%', top: '22%', size: 3, delay: 0, duration: 13 },
  { left: '18%', top: '68%', size: 2, delay: 2.4, duration: 16 },
  { left: '31%', top: '38%', size: 4, delay: 1.1, duration: 11 },
  { left: '46%', top: '78%', size: 2, delay: 3.6, duration: 15 },
  { left: '59%', top: '18%', size: 3, delay: 0.8, duration: 14 },
  { left: '71%', top: '58%', size: 2, delay: 4.2, duration: 12 },
  { left: '84%', top: '32%', size: 3, delay: 1.9, duration: 17 },
  { left: '92%', top: '72%', size: 2, delay: 3.1, duration: 13 },
] as const;

export function BackgroundPatterns() {
  const still = usePrefersReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* 1 — The artwork's ground: its vignette, in CSS so it is right on the
             first paint */}
      <div className="absolute inset-0 cotton-glow" />

      {/* 2 — and its mosaic and paper grain, painted once on mount */}
      <ClothGround className="absolute inset-0" />

      {/* 3 — Kasavu temple borders, hemming the top and bottom of the page */}
      <TempleBorder className="absolute inset-x-0 top-0" idPrefix="top" />
      <TempleBorder
        className="absolute inset-x-0 bottom-0 -scale-y-100"
        idPrefix="bottom"
      />

      {/* 4 — Drifting warp threads (vertical, barely-there) */}
      <motion.div
        className="absolute inset-x-0 -top-1/2 h-[200%] opacity-[0.5]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(107,23,36,0.05) 0px, rgba(107,23,36,0.05) 1px, transparent 1px, transparent 58px)',
        }}
        animate={still ? undefined : { y: ['0%', '-12%'] }}
        transition={{ duration: 26, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
      />

      {/* 5 — Zari light sweep: a broad diagonal glint crossing the cloth */}
      {!still && (
        <motion.div
          className="absolute -inset-y-1/4 w-[46%] bg-zari-sweep opacity-[0.16] blur-2xl"
          style={{ rotate: 14 }}
          initial={{ x: '-70%' }}
          animate={{ x: ['-70%', '170%'] }}
          transition={{
            duration: 11,
            repeat: Infinity,
            repeatDelay: 6,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      )}

      {/* 6 — Loom shuttle crossing the weft, trailing its thread */}
      <div className="absolute inset-x-0 top-[38%] hidden md:block">
        <div className="relative h-px w-full bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        <motion.div
          className="absolute top-0 -translate-y-1/2"
          initial={{ x: '-8%' }}
          animate={still ? undefined : { x: ['-8%', '104%', '-8%'] }}
          transition={{
            duration: 34,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95],
            times: [0, 0.5, 1],
          }}
        >
          <ShuttleGlyph />
        </motion.div>
      </div>

      {/* 7 — Suspended lint / yarn motes catching the light */}
      {!still &&
        MOTES.map((mote, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-gold/45"
            style={{
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
            }}
            animate={{
              y: [0, -26, 0],
              opacity: [0.15, 0.6, 0.15],
            }}
            transition={{
              duration: mote.duration,
              delay: mote.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

      {/* 8 — Softens the decorations above so content stays the hero. Lighter
             than it was: the ground is now warm cloth rather than near-white,
             and a heavier wash here flattened its grain back out. */}
      <div className="absolute inset-0 bg-cream/15" />
    </div>
  );
}

/**
 * A kasavu border band: zari hatch, a row of temple (kovil) triangles,
 * and a closing hairline — faded out at both ends so it never terminates
 * abruptly against the viewport edge.
 *
 * `idPrefix` keeps the pattern/mask ids unique; two instances sharing an
 * id would make the second one inherit the first's fill.
 */
function TempleBorder({ className, idPrefix }: { className?: string; idPrefix: string }) {
  const temple = `${idPrefix}-temple`;
  const hatch = `${idPrefix}-hatch`;
  const fade = `${idPrefix}-fade`;
  const mask = `${idPrefix}-mask`;

  return (
    <svg
      className={className}
      width="100%"
      height="36"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={temple} width="34" height="18" patternUnits="userSpaceOnUse">
          <path d="M0 18 L17 0 L34 18" fill="none" stroke="rgba(197,160,89,0.55)" strokeWidth="1" />
          <circle cx="17" cy="5.5" r="1.1" fill="rgba(197,160,89,0.5)" />
        </pattern>

        <pattern id={hatch} width="9" height="9" patternUnits="userSpaceOnUse">
          <path d="M0 9 L9 0" stroke="rgba(197,160,89,0.3)" strokeWidth="0.7" />
        </pattern>

        <linearGradient id={fade} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="22%" stopColor="white" stopOpacity="0.95" />
          <stop offset="78%" stopColor="white" stopOpacity="0.95" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        <mask id={mask}>
          <rect width="100%" height="36" fill={`url(#${fade})`} />
        </mask>
      </defs>

      <g mask={`url(#${mask})`}>
        <rect y="0" width="100%" height="14" fill={`url(#${hatch})`} />
        <rect y="15" width="100%" height="18" fill={`url(#${temple})`} />
        <rect y="34" width="100%" height="1" fill="rgba(197,160,89,0.35)" />
      </g>
    </svg>
  );
}

/** The weaver's shuttle: pointed at both ends, wound with thread. */
function ShuttleGlyph() {
  return (
    <svg width="66" height="18" viewBox="0 0 66 18" fill="none" className="opacity-45">
      <path
        d="M1 9C1 9 12 1.5 33 1.5S65 9 65 9 54 16.5 33 16.5 1 9 1 9Z"
        fill="rgba(250,240,224,0.9)"
        stroke="rgba(107,23,36,0.5)"
        strokeWidth="1"
      />
      <path d="M20 5.6h26M20 12.4h26" stroke="rgba(197,160,89,0.85)" strokeWidth="1.4" />
      <circle cx="33" cy="9" r="2.1" fill="rgba(197,160,89,0.9)" />
    </svg>
  );
}

export default BackgroundPatterns;
