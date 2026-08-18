"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ShoppingBag, Menu, X, Heart, RotateCcw, Truck, Gift } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import ShareButton from "@/components/ShareButton";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import type { Prisma } from "@prisma/client";

type SettingsWithRelations = Prisma.SiteSettingsGetPayload<{
  include: { phoneNumbers: true; emails: true; socialLinks: true };
}>;

const highlights = [
  { label: "Easy Returns", icon: RotateCcw },
  { label: "Fast Delivery", icon: Truck },
  { label: "Free Shipping", icon: Gift },
];

const rightLinks = [
  { label: "Collections", href: "/#collections" },
  { label: "Our Craft", href: "/#craft" },
  { label: "Contact", href: "/contact" },
];

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="group relative text-[13px] font-medium uppercase tracking-wider text-clay-600 transition-colors hover:text-brand-600"
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brand-500 transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  );
}

function HighlightBadge({ label, icon: Icon }: { label: string; icon: typeof RotateCcw }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
      <Icon size={13} strokeWidth={2.25} />
      {label}
    </span>
  );
}

function WishlistLink({ count }: { count: number }) {
  return (
    <Link href="/wishlist" aria-label="Wishlist" className="relative text-clay-700 transition-colors hover:text-brand-600">
      <Heart size={19} strokeWidth={1.75} />
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-semibold text-sand-50"
        >
          {count}
        </motion.span>
      )}
    </Link>
  );
}

function CartLink({ count }: { count: number }) {
  return (
    <Link href="/cart" aria-label="Cart" className="relative text-clay-700 transition-colors hover:text-brand-600">
      <ShoppingBag size={19} strokeWidth={1.75} />
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-semibold text-sand-50"
        >
          {count}
        </motion.span>
      )}
    </Link>
  );
}

export default function Header({ settings }: { settings: SettingsWithRelations }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { wishlist } = useWishlist();
  const { totalItems } = useCart();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const whatsappHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "Hi! I'm interested in your handloom collection."
  )}`;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 border-b bg-sand-50/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
        scrolled ? "border-clay-200 shadow-sm" : "border-transparent"
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-7xl items-center justify-between px-6 transition-[padding] duration-300 ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        <button
          aria-label="Toggle menu"
          className="shrink-0 text-clay-700 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="hidden flex-1 items-center gap-2.5 md:flex">
          {highlights.map((item) => (
            <HighlightBadge key={item.label} {...item} />
          ))}
        </div>

        <Link
          href="/"
          className="flex flex-1 items-center justify-center md:flex-none md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
        >
          <Logo markClassName="h-7 w-auto sm:h-9" wordmarkClassName="text-sm sm:text-lg" label={settings.siteName} />
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-7 md:flex">
          {rightLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
          <div className="flex items-center gap-5">
            {isHome && (
              <ShareButton
                title={settings.siteName}
                text={settings.tagline ?? undefined}
                ariaLabel="Share this site"
                size={19}
                className="text-clay-700 transition-colors hover:text-brand-600"
              />
            )}
            <WishlistLink count={wishlist.length} />
            <CartLink count={totalItems} />
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="text-[#25D366] transition-opacity hover:opacity-80"
            >
              <WhatsAppIcon className="h-[21px] w-[21px]" />
            </a>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 md:hidden">
          {isHome && (
            <ShareButton
              title={settings.siteName}
              text={settings.tagline ?? undefined}
              ariaLabel="Share this site"
              size={19}
              className="text-clay-700 transition-colors hover:text-brand-600"
            />
          )}
          <WishlistLink count={wishlist.length} />
          <CartLink count={totalItems} />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="text-[#25D366] transition-opacity hover:opacity-80"
          >
            <WhatsAppIcon className="h-[21px] w-[21px]" />
          </a>
        </div>
      </div>

      <motion.nav
        initial={false}
        animate={open ? "open" : "closed"}
        variants={{
          open: { height: "auto", opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden border-t border-clay-100 bg-sand-50 md:hidden"
      >
        <motion.div
          variants={{
            open: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
          }}
          className="flex flex-col gap-5 px-6 py-5"
        >
          <div className="flex flex-col gap-4">
            {rightLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -12 },
                }}
                className="text-sm font-medium uppercase tracking-wider text-clay-600"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.nav>
    </motion.header>
  );
}
