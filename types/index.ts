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

/* ── Product catalog (components/site, components/admin) ───── */

export type ProductStatus = 'ACTIVE' | 'INACTIVE';

export interface ProductSpec {
  label: string;
  value: string;
}

/**
 * One orderable image within a product's gallery — e.g. a detail shot or
 * colourway. Priced independently only when `price` is set; `null` means
 * "use the parent product's price" (see `effectivePrice` in lib/utils.ts),
 * which is the common case — most images of one product share one price.
 */
export interface ProductItem {
  id: string;
  /** Path under /public, a Supabase Storage URL, or empty for the fabric-tinted placeholder swatch. */
  image: string;
  /** This image's own caption — distinct from the product's own description. */
  description: string;
  /** null = inherit the product's price. */
  price: number | null;
  /** The product's cover image — shown on its catalogue card. At most one per product. */
  isPrimary: boolean;
  displayOrder: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  currency: 'INR';
  /** Default price for the product and any item that doesn't set its own. */
  price: number;
  fabric: 'cotton' | 'silk' | 'kasavu' | 'linen';
  specifications: ProductSpec[];
  availability: string;
  delivery: string;
  items: ProductItem[];
}
