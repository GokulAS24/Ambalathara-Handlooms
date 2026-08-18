"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import WeavePattern from "@/components/WeavePattern";

const stats = [
  { value: 40, suffix: "+", label: "Years of Craft" },
  { value: 120, suffix: "+", label: "Artisan Weavers" },
  { value: 6, suffix: "", label: "States We Ship To" },
  { value: 100, suffix: "%", label: "Handmade" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 90 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(
    () =>
      spring.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = `${Math.round(latest)}${suffix}`;
        }
      }),
    [spring, suffix]
  );

  return <span ref={ref}>0{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-clay-100 bg-sand-50">
      <WeavePattern className="pointer-events-none absolute inset-0 text-clay-800 opacity-[0.05]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="text-center"
          >
            <p className="font-serif text-4xl text-brand-600 md:text-5xl">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-clay-500">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
