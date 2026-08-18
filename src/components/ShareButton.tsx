"use client";

import { useState, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Check } from "lucide-react";

export default function ShareButton({
  title,
  text,
  className,
  size = 16,
  ariaLabel = "Share this product",
}: {
  title: string;
  text?: string;
  className?: string;
  size?: number;
  ariaLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user cancelled the native share sheet
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={handleShare}
        className={
          className ??
          "flex h-10 w-10 items-center justify-center rounded-full bg-sand-50/90 text-clay-700 shadow-sm backdrop-blur-sm transition-colors hover:text-brand-600"
        }
      >
        <Share2 size={size} strokeWidth={1.75} />
      </button>

      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-10 mt-2 flex items-center gap-1 whitespace-nowrap rounded-sm bg-clay-900 px-2.5 py-1.5 text-xs text-sand-50 shadow-lg"
          >
            <Check size={12} /> Link copied
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
