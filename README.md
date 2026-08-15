# Ambalathara Handlooms — Launching Soon

A coming-soon landing page for a traditional handloom brand. Next.js 14 (App Router),
TypeScript, Tailwind CSS, Framer Motion, Lucide.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint
```

Copy `.env.example` to `.env.local` to override the launch date or site URL.

## Changing the launch date

One line, in [`lib/constants.ts`](lib/constants.ts):

```ts
export const LAUNCH_DATE_ISO =
  process.env.NEXT_PUBLIC_LAUNCH_DATE ?? '2026-08-17T12:00:00+05:30';
```

Keep the `+05:30` offset — it pins the countdown to an absolute instant, so every
visitor worldwide counts down to the same second and the server never disagrees with
the browser. Update `LAUNCH_DISPLAY_LABEL` in the same file to match.

## Folder tree

```
ambalathara-handloons/
├── app/
│   ├── api/
│   │   └── subscribe/
│   │       └── route.ts          # POST endpoint — the template for future APIs
│   ├── globals.css               # Tailwind layers + weave/zari custom animations
│   ├── icon.svg                  # Favicon — lotus + temple mark
│   ├── layout.tsx                # Fonts, metadata, viewport, <html> shell
│   └── page.tsx                  # Landing page composition (server component)
├── components/
│   ├── landing/
│   │   ├── BackgroundPatterns.tsx  # Loom atmosphere: texture, temple borders, shuttle
│   │   ├── CountdownTimer.tsx      # The countdown cards
│   │   ├── Footer.tsx              # Socials + copyright (zero JS)
│   │   ├── Hero.tsx                # Brand name, tagline, craft pillars
│   │   ├── NotifyForm.tsx          # Email capture → /api/subscribe
│   │   └── OrnamentalDivider.tsx   # Lotus + temple-triangle divider (zero JS)
│   └── ui/
│       ├── Button.tsx            # Reusable primitive
│       ├── Input.tsx             # Reusable primitive
│       └── MotionProvider.tsx    # Root MotionConfig (reduced-motion handling)
├── hooks/
│   ├── useCountdown.ts           # Hydration-safe, drift-corrected countdown
│   └── useReducedMotion.ts       # prefers-reduced-motion tracking
├── lib/
│   ├── constants.ts              # Launch date + store metadata (edit here)
│   ├── countdown.ts              # Pure time math + display formatting
│   ├── subscribers.ts            # Placeholder store — swap for a real DB
│   └── utils.ts                  # cn(), pad(), email helpers
├── types/
│   └── index.ts                  # Shared types, incl. a stub Product model
├── next.config.mjs
├── tailwind.config.ts            # Handloom palette, fonts, keyframes
├── postcss.config.mjs
└── tsconfig.json                 # `@/*` path alias
```

## Architecture notes

**Server/client split.** `app/page.tsx`, `Footer` and `OrnamentalDivider` are server
components and ship no JavaScript. Only `BackgroundPatterns`, `Hero`, `CountdownTimer`
and `NotifyForm` are `'use client'` — the four things that genuinely need the browser.

**Hydration safety.** `useCountdown` returns `isReady: false` with all-zero values on
the server *and* on the first client render, so the two trees are identical; the real
clock value only arrives in the post-mount effect. The timer renders a `––` skeleton
for that one frame. Ticking uses a self-correcting `setTimeout` chain (re-aligned to
the next whole second each pass) rather than `setInterval`, plus a `visibilitychange`
resync, so a throttled background tab cannot make it drift.

**Extending to commerce.** `/api/subscribe` is the reference shape for every future
route: parse → validate → delegate to a `lib/` function → typed JSON response. No
business logic in the route itself. Add `app/(shop)/products/…` alongside the existing
pages, put data access in `lib/`, and reuse the `components/ui` primitives. A stub
`Product` type already sits in `types/index.ts`.

**Subscribers are not persisted.** `lib/subscribers.ts` is an in-memory `Map` — a
stand-in with the right async signature, not storage. It does not survive a restart and
is not shared across serverless instances. Replace its two function bodies with a
Prisma/Supabase call or a Mailchimp/Resend audience before launch; callers stay
untouched.

## Design

| Role | Colour |
| --- | --- |
| Ground | `#FDFBF7` cream → `#FAF7F2` unbleached cotton |
| Primary | `#6B1724` madder maroon |
| Accent | `#C5A059` kasavu zari gold |
| Text | `#2E2A26` charcoal, `#5C4A3D` earth |

Headings are Playfair Display (a second instance supplies true italics), body and timer
labels are Inter with wide tracking. Both are self-hosted by `next/font` — no
render-blocking request to Google, no layout shift.

Motion respects `prefers-reduced-motion` on three levels: `MotionProvider` sets Framer's
`reducedMotion="user"` at the root, so transform animations are skipped and only opacity
fades remain; `BackgroundPatterns` uses `usePrefersReducedMotion` to drop its looping
decorations entirely; and a global CSS media query catches the pure-CSS shimmer. The
page has been rendered under emulated reduced motion to confirm nothing gets stranded
mid-animation.

## Known quirk

Requesting `style: ['normal','italic']` together with multiple weights in a single
`next/font/google` call fails to build on Next 14.2.x (a URL-parsing bug in the font
loader). The italic face is loaded as a separate instance in `app/layout.tsx` instead,
exposed as `--font-playfair-italic` / the `font-serif-italic` Tailwind utility.
