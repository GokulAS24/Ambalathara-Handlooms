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
 * Opens with the brand mark itself: LogoReveal (components/layout/
 * LogoReveal.tsx) only ever plays once, during the transition out of the
 * countdown — anyone landing directly on a live link afterward, or
 * scrolling back to the top later, never sees it. The homepage needed its
 * own opening brand moment independent of that one-time transition.
 */
export function MainHero() {
  return (
    <section
      id="home"
      className="relative flex w-full scroll-mt-20 flex-col items-center gap-6 px-5 pb-20 pt-16 text-center sm:gap-8 sm:px-8 sm:pb-28 sm:pt-24"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full"
        style={{ width: 'clamp(6rem, 22vw, 9rem)', aspectRatio: LOGO_REVEAL_ASPECT }}
      >
        <Image
          src={LOGO_REVEAL_SRC}
          alt={`${SITE_CONFIG.name} emblem`}
          fill
          sizes="9rem"
          className="object-contain mix-blend-multiply"
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
        className="max-w-3xl font-serif text-3xl leading-tight text-maroon sm:text-5xl"
      >
        {SITE_CONFIG.tagline}
      </motion.h1>

      <motion.p
        custom={0.2}
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-xl font-sans text-sm leading-relaxed text-earth sm:text-base"
      >
        {HERO_SUBCOPY}
      </motion.p>

      <motion.div
        custom={0.3}
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <Button onClick={scrollToProducts}>Shop the Collection</Button>
      </motion.div>

      <motion.div
        custom={0.4}
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="w-full pt-6"
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
