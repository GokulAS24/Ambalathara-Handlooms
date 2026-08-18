"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LogoFull } from "@/components/Logo";
import type { Category, Prisma } from "@prisma/client";

type SettingsWithRelations = Prisma.SiteSettingsGetPayload<{
  include: { phoneNumbers: true; emails: true; socialLinks: true };
}>;

const helpLinks = [
  { label: "Shipping", href: "/cash-on-delivery" },
  { label: "Returns & Exchanges", href: "/returns" },
  { label: "Customer Support", href: "/support" },
];

export default function Footer({
  settings,
  categories,
}: {
  settings: SettingsWithRelations;
  categories: Category[];
}) {
  const shopLinks = categories.slice(0, 6);
  return (
    <footer className="border-t border-clay-100 bg-sand-100">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start justify-between gap-6 border-b border-clay-200 pb-12 sm:flex-row sm:items-end"
        >
          <div>
            <h4 className="font-serif text-2xl text-clay-800">Stay in the loop</h4>
            <p className="mt-1.5 text-sm text-clay-500">
              New weaves and studio stories, once or twice a month.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="group flex w-full max-w-sm items-end gap-3 border-b border-clay-300 pb-2 transition-colors focus-within:border-brand-500"
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              className="w-full bg-transparent text-sm text-clay-800 placeholder:text-clay-400 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="text-clay-500 transition-colors group-focus-within:text-brand-600 hover:text-brand-600"
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 gap-10 pt-12 sm:grid-cols-2 md:grid-cols-5"
        >
          <div className="sm:col-span-2">
            <LogoFull className="h-16 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-clay-500">{settings.footerText}</p>
            {settings.socialLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {settings.socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-wider text-clay-500 hover:text-brand-600"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-clay-800">Shop</h4>
            <ul className="mt-4 space-y-2.5">
              {shopLinks.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="text-sm text-clay-500 transition-colors hover:text-brand-600"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {categories.length > shopLinks.length && (
                <li>
                  <Link href="/shop" className="text-sm text-clay-500 underline transition-colors hover:text-brand-600">
                    View All
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-clay-800">Help</h4>
            <ul className="mt-4 space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-clay-500 transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-clay-800">Get in Touch</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-clay-500">
              <li>{settings.address}</li>
              {settings.emails.map((e) => (
                <li key={e.id}>{e.email}</li>
              ))}
              {settings.phoneNumbers.map((p) => (
                <li key={p.id}>{p.number}</li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-clay-200 pt-6 text-xs text-clay-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
          <p>Handwoven with care in Kerala</p>
        </div>
      </div>
    </footer>
  );
}
