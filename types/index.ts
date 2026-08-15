/** Shared application types. Import via `@/types`. */

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  established: string;
  contactEmail: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: 'instagram' | 'facebook' | 'mail';
}

/** Remaining time, already split into display units. */
export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Raw milliseconds remaining; 0 once the launch moment passes. */
  total: number;
}

export interface CountdownState extends TimeLeft {
  /**
   * False during SSR and the first client render, true after mount.
   * Gate any time-dependent markup on this to avoid hydration mismatch.
   */
  isReady: boolean;
  /** True once the target instant has passed. */
  isComplete: boolean;
}

export type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds';

export interface CountdownSegment {
  unit: CountdownUnit;
  label: string;
  value: number;
  /** Zero-padded string ready for display. */
  display: string;
}

/* ── API contracts ─────────────────────────────────────────── */

export interface SubscribeRequest {
  email: string;
  /** Honeypot field — bots fill it, humans never see it. */
  website?: string;
  source?: string;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
  /** Present when the address was already stored. */
  alreadySubscribed?: boolean;
}

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

/* ── Reserved for the commerce phase ───────────────────────── */

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: 'INR';
  images: string[];
  fabric: 'cotton' | 'silk' | 'kasavu' | 'linen';
  inStock: boolean;
}
