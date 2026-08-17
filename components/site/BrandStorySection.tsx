'use client';

import { motion } from 'framer-motion';
import { Hand, Leaf, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/**
 * Only claims already established elsewhere in the codebase (Kerala,
 * pit-loom weaving, kasavu/cotton/silk) — no invented founding year,
 * lineage or awards. A short brand-story beat between the hero and the
 * catalogue, Apple-style: one clear statement, generous whitespace, three
 * quiet supporting facts rather than a wall of copy.
 */
const PILLARS = [
  {
    icon: MapPin,
    title: 'Rooted in Kerala',
    description: 'Every piece is woven here, in the heart of the state’s handloom tradition.',
  },
  {
    icon: Hand,
    title: 'Hand, Not Machine',
    description: 'Set on traditional pit looms — the same craft passed down through generations of weavers.',
  },
  {
    icon: Leaf,
    title: 'Pure Natural Fibre',
    description: 'Kasavu, cotton and silk only, chosen for how they wear, drape and last.',
  },
] as const;

export function BrandStorySection() {
  return (
    <section className="w-full px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          custom={0}
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="text-balance font-serif text-3xl leading-snug text-maroon sm:text-4xl"
        >
          A craft kept alive, one thread at a time.
        </motion.h2>

        <motion.p
          custom={0.1}
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto mt-6 max-w-xl text-balance font-sans text-base leading-relaxed text-earth"
        >
          {SITE_CONFIG.name} exists to keep Kerala&rsquo;s handloom weaving alive and worn — not
          preserved behind glass, but draped, gifted and passed down.
        </motion.p>
      </div>

      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8"
      >
        {PILLARS.map((pillar) => (
          <motion.div
            key={pillar.title}
            variants={rise}
            custom={0}
            className="flex flex-col items-center gap-3 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-maroon">
              <pillar.icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="font-serif text-lg text-maroon">{pillar.title}</h3>
            <p className="max-w-[16rem] font-sans text-sm leading-relaxed text-earth">{pillar.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default BrandStorySection;
