import type { SiteConfig, SocialLink } from '@/types';

/**
 * ─────────────────────────────────────────────────────────────
 *  LAUNCH MOMENT
 * ─────────────────────────────────────────────────────────────
 *  The single source of truth for the countdown.
 *
 *  Format: ISO-8601 **with an explicit offset**. `+05:30` is IST.
 *  Keeping the offset in the string means the instant is absolute —
 *  a visitor in Dubai and a visitor in Kochi count down to the same
 *  second, and the server and browser never disagree.
 *
 *  Default below = Monday, 17 August 2026 at 12:00 PM IST.
 *  Override without touching code via NEXT_PUBLIC_LAUNCH_DATE.
 */
export const LAUNCH_DATE_ISO =
  process.env.NEXT_PUBLIC_LAUNCH_DATE ?? '2026-08-17T12:00:00+05:30';

/** Milliseconds since epoch for the launch. Computed once per runtime. */
export const LAUNCH_TIMESTAMP = new Date(LAUNCH_DATE_ISO).getTime();

/**
 * Human-readable launch label, rendered under the timer.
 *
 * Derived from LAUNCH_DATE_ISO rather than typed out, so changing the date
 * above can never leave a stale caption behind. The IST time zone is
 * pinned explicitly, which also makes the string identical on the server
 * and in the browser regardless of where either one sits.
 */
export const LAUNCH_DISPLAY_LABEL = formatLaunchLabel(LAUNCH_DATE_ISO);

function formatLaunchLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const dayPart = `${get('weekday')}, ${get('day')} ${get('month')}`;
  const timePart = `${get('hour')}:${get('minute')} ${get('dayPeriod').toUpperCase()}`;

  return `${dayPart} · ${timePart} IST`;
}

/** How often the countdown re-renders, in ms. */
export const COUNTDOWN_TICK_MS = 1000;

/**
 * ─────────────────────────────────────────────────────────────
 *  STORE METADATA
 * ─────────────────────────────────────────────────────────────
 */
export const SITE_CONFIG: SiteConfig = {
  name: 'Ambalathara Handlooms',
  shortName: 'Ambalathara',
  tagline: 'Threads of Tradition, Woven with Soul',
  description:
    'Ambalathara Handlooms — pure handcrafted kasavu, cotton and silk handlooms woven on traditional pit looms. Our doors open soon.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ambalatharahandlooms.com',
  locale: 'en_IN',
  established: 'Est. Kerala, India',
  contactEmail: 'weave@ambalatharahandloons.com',
};

/**
 * ─────────────────────────────────────────────────────────────
 *  BRAND MARK
 * ─────────────────────────────────────────────────────────────
 *  Both served from /public, not imported, so either can be replaced
 *  without a rebuild. The source of truth for both lives in /assets;
 *  these are the copies Next.js serves.
 *
 *  BRAND_VIDEO_SRC is the primary render: the studio's own animation of
 *  the mark, cloth already moving. BRAND_LOGO_SRC is a still of the same
 *  composition — DrapedLogo uses it as the video's `poster` (shown before
 *  playback starts) and as the fallback if the video ever fails to load.
 *  Because they're the SAME composition, DrapedLogo's edge feather
 *  (`EDGE_FEATHER`) is measured once, off the video, and works for both.
 *  Replacing either with a different composition means re-measuring that
 *  mask — see the comment above `EDGE_FEATHER` in DrapedLogo.tsx.
 */
export const BRAND_LOGO_SRC = '/ambalathara-logo.jpg';

/**
 * The static mark shown by LogoReveal, the moment between the countdown
 * finishing and the main site appearing (replaces the old looping video —
 * see the memory log entry on the mobile freeze that caused that removal).
 *
 * The provided file (1254x671, white background) — source of truth in
 * `/assets`, this is the copy Next.js serves. Untouched pixel-for-pixel:
 * LogoReveal handles the white background with a CSS blend mode rather
 * than anything baked into the file itself, and its container is sized to
 * this exact aspect ratio (see LOGO_REVEAL_ASPECT) so object-contain
 * doesn't letterbox it inside a mismatched box.
 */
export const LOGO_REVEAL_SRC = '/ambalathara-emblem.png';

/** Width / height of LOGO_REVEAL_SRC — re-derive if that file is ever replaced with different proportions. */
export const LOGO_REVEAL_ASPECT = 1254 / 671;
export const BRAND_VIDEO_SRC = '/ambalathara-logo.mp4';

/**
 * ─────────────────────────────────────────────────────────────
 *  WHATSAPP
 * ─────────────────────────────────────────────────────────────
 *  The client's number in full international form, digits only —
 *  country code first, no `+`, spaces, dashes or brackets. For India:
 *  `919876543210`. wa.me silently lands the visitor on an "invalid
 *  number" page for anything else, so the value is normalised here
 *  rather than trusted as typed.
 *
 *  Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local. Left unset, the
 *  floating button does not render at all — better no button than one
 *  that opens a dead chat.
 */
const RAW_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

/** Digits only, with any leading zeros of an `00`-style prefix dropped. */
export const WHATSAPP_NUMBER = RAW_WHATSAPP_NUMBER.replace(/\D/g, '').replace(/^0+/, '');

/** Prefilled first message, so the visitor never faces an empty box. */
export const WHATSAPP_MESSAGE =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
  `Hello ${SITE_CONFIG.name}! I would like to know more about your handlooms.`;

/**
 * `wa.me` is WhatsApp's own link service: it opens the installed app on
 * mobile and WhatsApp Web on desktop. No SDK, no third-party script, and
 * nothing loaded from their servers — it is a plain outbound link.
 *
 * Factored out so every click-to-chat link on the site — this generic one
 * and each product's pre-filled message in the catalog modal — goes
 * through the same central `WHATSAPP_NUMBER`, never a second copy of it.
 */
export function buildWhatsAppUrl(message: string): string {
  return WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}` : '';
}

export const WHATSAPP_URL = buildWhatsAppUrl(WHATSAPP_MESSAGE);

/** `tel:` link for the same central number; empty when unset (see above). */
export const PHONE_URL = WHATSAPP_NUMBER ? `tel:+${WHATSAPP_NUMBER}` : '';

/**
 * Set NEXT_PUBLIC_INSTAGRAM_URL in .env.local to the real profile URL.
 * Left unset, the icon simply does not render — same reasoning as
 * WHATSAPP_URL above: better no icon than one linking to a dead page.
 */
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '';

/** Placeholder handles — swap for the real accounts before launch. */
export const SOCIAL_LINKS: SocialLink[] = [
  ...(INSTAGRAM_URL
    ? [{ label: 'Instagram', href: INSTAGRAM_URL, icon: 'instagram' as const }]
    : []),
  { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { label: 'Email', href: 'mailto:weave@ambalatharahandloons.com', icon: 'mail' },
];

/** Copy for the notify form, kept here so marketing can edit in one place. */
export const NOTIFY_COPY = {
  heading: 'Be the first to know when we weave our doors open',
  subheading: 'One note when we launch. No noise, no clutter.',
  placeholder: 'your@email.com',
  cta: 'Notify Me',
  success: 'Beautiful — your thread is on the loom. We will write to you at launch.',
  duplicate: 'You are already on the list. We will be in touch soon.',
  error: 'Something slipped off the loom. Please try again.',
} as const;
