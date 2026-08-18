"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Handspun Yarn",
    text: "Cotton and silk fibers are spun by hand into fine, even threads.",
  },
  {
    title: "Natural Dyeing",
    text: "Yarns are dyed using traditional, plant-based colors like indigo and madder.",
  },
  {
    title: "Pit Loom Weaving",
    text: "Artisans weave each piece by hand on wooden pit looms, thread by thread.",
  },
  {
    title: "Finishing Touches",
    text: "Every textile is checked, washed, and finished with care before it reaches you.",
  },
];

export default function Craft() {
  return (
    <section id="craft" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-14 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-500">
          Our Craft
        </p>
        <h2 className="mt-2 font-serif text-3xl text-clay-800 md:text-4xl">
          From Thread to Textile
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            className="relative pt-5"
          >
            <div className="absolute left-0 top-0 h-px w-full overflow-hidden bg-clay-200">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 + index * 0.12, ease: "easeOut" }}
                className="block h-full w-full origin-left bg-brand-500"
              />
            </div>
            <span className="text-xs font-medium tracking-wider text-brand-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 text-base font-medium text-clay-800">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-clay-500">
              {step.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
