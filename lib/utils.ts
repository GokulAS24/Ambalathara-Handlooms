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
