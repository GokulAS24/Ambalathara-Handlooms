"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import WeavePattern from "@/components/WeavePattern";
import type { Category } from "@prisma/client";

export default function Collections({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section id="collections" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-500">Shop by Collection</p>
          <h2 className="mt-2 font-serif text-3xl text-clay-800 md:text-4xl">Distinctive designs, named with intent</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, index) => (
          <motion.a
            key={category.id}
            href={`/shop?category=${category.slug}`}
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.65, 0, 0.35, 1] }}
            className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-clay-800"
          >
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <WeavePattern className="pointer-events-none absolute inset-0 text-sand-100 opacity-[0.08]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-clay-900/80 via-clay-900/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-sand-50 sm:p-6">
              <div>
                <h3 className="font-serif text-lg sm:text-2xl">{category.name}</h3>
                {category.description && (
                  <p className="mt-1 hidden text-sm text-sand-200 sm:block">{category.description}</p>
                )}
              </div>
              <motion.span
                whileHover={{ rotate: 45 }}
                transition={{ duration: 0.25 }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sand-100/60 transition-colors group-hover:bg-sand-50 group-hover:text-clay-900 sm:h-9 sm:w-9"
              >
                <ArrowUpRight size={16} />
              </motion.span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
