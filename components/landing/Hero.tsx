'use client';

import { motion } from 'framer-motion';
import { DrapedLogo } from '@/components/landing/DrapedLogo';
import { OrnamentalDivider } from '@/components/landing/OrnamentalDivider';
import { SITE_CONFIG } from '@/lib/constants';

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  return (
    <header className="flex flex-col items-center text-center">
      {/* Eyebrow */}
      <motion.p
        custom={0}
        variants={rise}
        initial="hidden"
        animate="show"
        className="font-sans text-[length:var(--text-eyebrow)] uppercase tracking-zari text-gold-dark"
      >
        {SITE_CONFIG.established}
      </motion.p>

      <motion.div
        custom={0.1}
        variants={rise}
        initial="hidden"
        animate="show"
        className="mt-[var(--space-stack)] w-full"
      >
        <OrnamentalDivider />
      </motion.div>

      {/* Brand mark — the one moment of real scale on the page. The cloth
          keeps the wordmark covered; the name still ships to crawlers and
          screen readers through the heading below it. */}
      <motion.div
        custom={0.25}
        variants={rise}
        initial="hidden"
        animate="show"
        className="mt-[var(--space-stack)] w-full"
      >
        <h1 className="sr-only">
          {SITE_CONFIG.name} — {SITE_CONFIG.tagline}
        </h1>
        <DrapedLogo />
      </motion.div>
    </header>
  );
}

export default Hero;
