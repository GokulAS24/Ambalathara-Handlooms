'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { OrnamentalDivider } from '@/components/landing/OrnamentalDivider';
import { Button } from '@/components/ui/Button';
import { LOGO_REVEAL_ASPECT, LOGO_REVEAL_SRC, SITE_CONFIG } from '@/lib/constants';

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/**
 * SITE_CONFIG.description ends "Our doors open soon" — correct copy for
 * the countdown page's SEO metadata, wrong here: this section only ever
 * renders once the doors are, in fact, open. Kept separate rather than
 * editing SITE_CONFIG.description, which still needs the original wording
 * for the pre-launch page.
 */
const HERO_SUBCOPY =
  'Pure handcrafted kasavu, cotton and silk handlooms, woven on traditional pit looms in Kerala. Explore the collection below.';

/**
 * The main site's own hero — distinct from the countdown page's Hero.
 * Opens with the brand mark itself, large and dead-centre: LogoReveal
 * (components/layout/LogoReveal.tsx) only ever plays once, during the
 * transition out of the countdown — anyone landing directly on a live
 * link afterward, or scrolling back to the top later, never sees it. The
 * homepage needed its own opening brand moment independent of that
 * one-time transition. The radial glow behind it is built entirely from
 * the existing cream/gold/maroon tokens (see globals.css `:root`) — no
 * new colours, just applied as a soft light source the mark seems to sit
 * in rather than a flat card behind it.
 */
export function MainHero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[88vh] w-full scroll-mt-20 flex-col items-center justify-center gap-7 overflow-hidden px-5 py-20 text-center sm:gap-9 sm:px-8 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 38%, var(--cream-lit) 0%, var(--cream) 45%, var(--cream-deep) 78%, var(--cream-edge) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[30%] -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(197,160,89,0.28), rgba(107,23,36,0.08) 70%, transparent 100%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 12 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full"
        style={{ width: 'clamp(13rem, 34vw, 23rem)', aspectRatio: LOGO_REVEAL_ASPECT }}
      >
        {/*
          The floating loop lives on the same element as the blend, not a
          wrapping div: `mix-blend-multiply` only sees through to the real
          gradient behind it when nothing between it and that background
          has its own active `transform` — an ancestor mid-animation
          creates a stacking context that isolates the blend to its own
          (backgroundless) box, which silently brought back the exact
          "logo pasted in a white card" problem this technique exists to
          avoid. A plain CSS animation on the image itself doesn't have
          that problem, since it isn't a separate ancestor.
        */}
        <Image
          src={LOGO_REVEAL_SRC}
          alt={`${SITE_CONFIG.name} emblem`}
          fill
          priority
          sizes="(min-width: 640px) 23rem, 34vw"
          className="animate-float-slow object-contain mix-blend-multiply"
        />
      </motion.div>

      <motion.p
        custom={0}
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="font-sans text-xs uppercase tracking-zari text-gold-dark"
      >
        {SITE_CONFIG.established}
      </motion.p>

      <motion.h1
        custom={0.1}
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-3xl text-balance font-serif text-4xl leading-[1.1] text-maroon sm:text-6xl"
      >
        {SITE_CONFIG.tagline}
      </motion.h1>

      <motion.p
        custom={0.2}
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-xl text-balance font-sans text-base leading-relaxed text-earth sm:text-lg"
      >
        {HERO_SUBCOPY}
      </motion.p>

      <motion.div
        custom={0.3}
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="pt-2"
      >
        <Button onClick={scrollToProducts}>Shop the Collection</Button>
      </motion.div>

      <motion.div
        custom={0.4}
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="w-full pt-8"
      >
        <OrnamentalDivider className="mx-auto max-w-md opacity-80" />
      </motion.div>
    </section>
  );
}

function scrollToProducts() {
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default MainHero;
