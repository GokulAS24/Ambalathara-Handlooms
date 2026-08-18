"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import WeavePattern from "@/components/WeavePattern";

export default function ProductGallery({
  images,
  alt,
  children,
}: {
  images: string[];
  alt: string;
  children?: ReactNode;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-clay-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[active]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            {images[active] && (
              <Image
                src={images[active]}
                alt={alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
        <WeavePattern className="pointer-events-none absolute inset-0 text-clay-900 opacity-[0.08]" />
        {children}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              aria-label={`View image ${i + 1}`}
              aria-current={active === i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-sm transition-all ${
                active === i
                  ? "ring-2 ring-clay-800 ring-offset-2 ring-offset-sand-50"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`${alt} thumbnail ${i + 1}`} fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
