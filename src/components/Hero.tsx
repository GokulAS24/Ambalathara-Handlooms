"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import type { Prisma } from "@prisma/client";

type HeroBannerWithCategory = Prisma.HeroBannerGetPayload<{ include: { category: true } }>;

const SLIDE_DURATION = 4000;

// Responsive art-direction: the browser only downloads the source that
// matches the current viewport, never both.
function BannerPicture({
  desktopSrc,
  mobileSrc,
  alt,
  variant,
}: {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  variant: "blurred" | "sharp";
}) {
  return (
    <picture className="absolute inset-0 block h-full w-full">
      <source media="(min-width: 768px)" srcSet={desktopSrc} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mobileSrc}
        alt={alt}
        aria-hidden={variant === "blurred"}
        loading="eager"
        fetchPriority={variant === "sharp" ? "high" : undefined}
        className={
          variant === "blurred"
            ? "h-full w-full scale-125 object-cover object-center blur-3xl"
            : "h-full w-full object-contain"
        }
      />
    </picture>
  );
}

export default function Hero({ banners }: { banners: HeroBannerWithCategory[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const goTo = useCallback(
    (index: number) => {
      setActive((index + banners.length) % banners.length);
    },
    [banners.length]
  );

  useEffect(() => {
    if (paused || banners.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % banners.length), SLIDE_DURATION);
    return () => clearInterval(id);
  }, [active, paused, banners.length]);

  if (banners.length === 0) return null;
  const banner = banners[active];
  const hasTextContent = Boolean(
    banner.title || banner.subtitle || banner.discountText || (banner.ctaLabel && banner.category)
  );
  const desktopSrc = banner.desktopImageUrl;
  const mobileSrc = banner.mobileImageUrl || banner.desktopImageUrl;

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured banners"
      className="relative flex h-[60vh] min-h-[420px] items-end overflow-hidden bg-clay-900 sm:h-[75vh] sm:min-h-[520px] lg:h-[86vh] lg:min-h-[600px]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={banner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <BannerPicture desktopSrc={desktopSrc} mobileSrc={mobileSrc} alt="" variant="blurred" />
          <BannerPicture
            desktopSrc={desktopSrc}
            mobileSrc={mobileSrc}
            alt={banner.title || "Featured banner"}
            variant="sharp"
          />
          {hasTextContent && (
            <div className="absolute inset-0 bg-gradient-to-t from-clay-900/85 via-clay-900/25 to-transparent" />
          )}
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous banner"
            onClick={() => goTo(active - 1)}
            className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-sand-50/15 p-2 text-sand-50 backdrop-blur-sm transition-colors hover:bg-sand-50/25 sm:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next banner"
            onClick={() => goTo(active + 1)}
            className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-sand-50/15 p-2 text-sand-50 backdrop-blur-sm transition-colors hover:bg-sand-50/25 sm:flex"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-16 text-center text-sand-50 md:pb-20"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {banner.discountText && (
              <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-brand-300">
                {banner.discountText}
              </span>
            )}
            {banner.title && (
              <h1 className="max-w-2xl font-serif text-4xl leading-[1.1] md:text-6xl">{banner.title}</h1>
            )}
            {banner.subtitle && (
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-sand-200">{banner.subtitle}</p>
            )}
            {banner.ctaLabel && banner.category && (
              <MagneticButton
                href={`/shop?category=${banner.category.slug}`}
                className="mt-8 inline-block rounded-sm bg-brand-500 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-sand-50 transition-colors hover:bg-brand-600"
              >
                {banner.ctaLabel}
              </MagneticButton>
            )}
          </motion.div>
        </AnimatePresence>

        {banners.length > 1 && (
          <div className="mt-10 flex items-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={`Go to banner ${i + 1}`}
                aria-current={i === active}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-brand-400" : "w-1.5 bg-sand-50/40 hover:bg-sand-50/70"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sand-200"
      >
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
}
