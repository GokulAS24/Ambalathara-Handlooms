import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Two-digit zero padding for countdown segments. */
export function pad(value: number, length = 2): string {
  return Math.max(0, value).toString().padStart(length, '0');
}

/**
 * Pragmatic email check — deliberately permissive.
 * Real verification happens with the double opt-in mail at launch.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

const PRICE_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** e.g. 4999 -> "₹4,999". */
export function formatPrice(price: number): string {
  return PRICE_FORMATTER.format(price);
}

/** An item's own price if it set one, otherwise its parent product's. */
export function effectivePrice(product: { price: number }, item: { price: number | null }): number {
  return item.price ?? product.price;
}

/** e.g. "Kasavu Signature Saree" -> "kasavu-signature-saree". Used to seed new product ids. */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * A unique id for a new product item — there's no database to assign one,
 * so the admin portal generates its own. `crypto.randomUUID` is available
 * in every browser this project targets; the timestamp+random fallback
 * only matters for an unusual embedder without it.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
