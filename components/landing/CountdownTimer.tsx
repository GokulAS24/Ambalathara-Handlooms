'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCountdown } from '@/hooks/useCountdown';
import { toAccessibleLabel, toSegments } from '@/lib/countdown';
import { LAUNCH_DISPLAY_LABEL, LAUNCH_TIMESTAMP } from '@/lib/constants';
import type { CountdownSegment } from '@/types';
import { cn } from '@/lib/utils';

/** Placeholder shown for the single frame before the clock is trusted. */
const SKELETON: CountdownSegment[] = [
  { unit: 'days', label: 'Days', value: 0, display: '––' },
  { unit: 'hours', label: 'Hours', value: 0, display: '––' },
  { unit: 'minutes', label: 'Minutes', value: 0, display: '––' },
  { unit: 'seconds', label: 'Seconds', value: 0, display: '––' },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const card = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function CountdownTimer({ className }: { className?: string }) {
  const time = useCountdown(LAUNCH_TIMESTAMP);
  const segments = time.isReady ? toSegments(time) : SKELETON;

  if (time.isComplete) {
    return <LaunchedNotice className={className} />;
  }

  return (
    <div className={cn('w-full', className)}>
      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        /* Always a single row of four: on a fixed one-screen page a wrapped
           2×2 doubles this section's vertical footprint, which is the one
           thing there's no room to spare. Card padding and digit size are
           fluid, so four-across stays comfortable down to a narrow phone. */
        className="mx-auto grid w-full max-w-[26rem] grid-cols-4 gap-[var(--card-gap)] sm:max-w-2xl md:max-w-3xl"
        role="timer"
        aria-label="Time remaining until launch"
      >
        {segments.map((segment) => (
          <motion.li key={segment.unit} variants={card} className="w-full">
            <TimeCard segment={segment} dim={!time.isReady} />
          </motion.li>
        ))}
      </motion.ul>

      {/* Digits are decorative to assistive tech; this is the real reading. */}
      <p className="sr-only">{time.isReady ? toAccessibleLabel(time) : 'Loading countdown.'}</p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mt-[var(--space-stack)] text-center font-sans text-[length:var(--text-launch-label)] uppercase tracking-[0.32em] text-earth/90"
      >
        {LAUNCH_DISPLAY_LABEL}
      </motion.p>
    </div>
  );
}

function TimeCard({ segment, dim }: { segment: CountdownSegment; dim: boolean }) {
  return (
    <div
      className={cn(
        // Capped width keeps the card near-square at every breakpoint; left
        // to fill a wide grid cell it stretches into a letterbox.
        'card-handloom relative mx-auto w-full max-w-[9.5rem] rounded-sm shadow-zari',
        'px-[var(--card-px)] py-[var(--card-py)] transition-opacity duration-500',
        dim && 'opacity-60'
      )}
    >
      <CornerAccents />

      {/* Zari sheen travelling across the digits */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm sheen-mask">
        <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-zari-sweep opacity-25 animate-zari-shimmer" />
      </span>

      <div
        className="relative flex justify-center font-serif text-[length:var(--text-card-digit)] leading-none text-maroon digit-tabular"
        aria-hidden="true"
      >
        {segment.display.split('').map((char, index) => (
          <DigitSlot key={`${segment.unit}-${index}`} char={char} />
        ))}
      </div>

      <div className="relative mt-[var(--card-gap)] text-center font-sans text-[length:var(--text-card-label)] font-medium uppercase tracking-[0.28em] text-earth/90">
        {segment.label}
      </div>
    </div>
  );
}

/**
 * One digit position. The invisible "0" reserves width — with tabular
 * figures every numeral is the same advance, so the card never reflows —
 * while the animated glyph is absolutely positioned on top and slides in
 * from above as the previous one falls away.
 */
function DigitSlot({ char }: { char: string }) {
  return (
    <span className="relative inline-block overflow-hidden">
      <span className="invisible" aria-hidden="true">
        0
      </span>
      {/* Sync mode: outgoing and incoming glyphs are both absolute, so they
          cross over each other without any layout thrash. */}
      <AnimatePresence initial={false}>
        <motion.span
          key={char}
          initial={{ y: '-85%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '85%', opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Four gold corner ticks — the mitred corner of a woven border. */
function CornerAccents() {
  const base = 'pointer-events-none absolute h-2.5 w-2.5 border-gold/70';
  return (
    <>
      <span className={cn(base, 'left-1.5 top-1.5 border-l border-t')} />
      <span className={cn(base, 'right-1.5 top-1.5 border-r border-t')} />
      <span className={cn(base, 'bottom-1.5 left-1.5 border-b border-l')} />
      <span className={cn(base, 'bottom-1.5 right-1.5 border-b border-r')} />
    </>
  );
}

function LaunchedNotice({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'card-handloom relative mx-auto max-w-xl rounded-sm shadow-zari',
        'px-[var(--card-px)] py-[var(--space-stack-lg)]',
        className
      )}
    >
      <CornerAccents />
      <p className="font-serif text-[length:var(--text-tagline)] text-maroon">The loom is open.</p>
      <p className="mt-[var(--space-stack)] font-sans text-[length:var(--text-subcopy)] leading-snug text-earth/90">
        Our first collection is ready. Thank you for waiting with us.
      </p>
    </motion.div>
  );
}

export default CountdownTimer;
