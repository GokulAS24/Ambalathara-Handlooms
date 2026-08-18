"use client";

import { motion } from "framer-motion";

const items = [
  "Handspun Yarn",
  "Naturally Dyed",
  "Pit Loom Woven",
  "Artisan Made",
  "Kerala Craft",
];

export default function Marquee() {
  const track = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-clay-100 bg-clay-900 py-4">
      <motion.div
        className="flex w-max shrink-0 gap-10"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.25em] text-sand-200"
          >
            {item}
            <span className="text-brand-400">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
