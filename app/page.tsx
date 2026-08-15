import { BackgroundPatterns } from '@/components/landing/BackgroundPatterns';
import { CountdownTimer } from '@/components/landing/CountdownTimer';
import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { OrnamentalDivider } from '@/components/landing/OrnamentalDivider';
import { WhatsAppButton } from '@/components/landing/WhatsAppButton';
import { ViewportFit } from '@/components/layout/ViewportFit';
import { LAUNCH_DATE_ISO, SITE_CONFIG } from '@/lib/constants';

/**
 * Server component. Only the pieces that genuinely need the browser —
 * background motion, the clock, the hero's entrance, the form, and the
 * viewport-fit measurement — are client components; the divider and the
 * footer ship as HTML with no JavaScript attached.
 *
 * The whole page is one screen, on purpose: `h-dvh` pins `<main>` to
 * exactly the visible viewport (the dynamic unit tracks mobile browser
 * chrome showing and hiding), every section inside uses the fluid
 * `clamp()` tokens from globals.css instead of fixed spacing, and
 * ViewportFit scales the whole stack down as a last resort on whatever
 * that budget doesn't cover. Nothing scrolls, on any of them.
 */
export default function HomePage() {
  return (
    <>
      <BackgroundPatterns />

      <main className="relative flex h-dvh w-full flex-col overflow-hidden px-[var(--space-page-x)] py-[var(--space-page-y)]">
        <ViewportFit>
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-[var(--space-stack-lg)]">
            <Hero />

            {/* Countdown */}
            <section aria-labelledby="countdown-heading" className="w-full">
              <h2
                id="countdown-heading"
                className="mb-[var(--space-stack)] text-center font-sans text-[length:var(--text-eyebrow)] uppercase tracking-zari text-gold-dark"
              >
                Weaving Our Doors Open In
              </h2>
              <CountdownTimer />
            </section>

            <OrnamentalDivider className="max-w-2xl opacity-80" />

            {/*
              PARKED — the email capture. WhatsApp is the contact route for
              now, via the floating button below.

              Only this call site is commented out. `NotifyForm`, its
              `/api/subscribe` route, `lib/subscribers.ts` and NOTIFY_COPY
              are all untouched and still build, so restoring the section is
              deleting these two lines.

              <div className="flex w-full flex-col items-center">
                <NotifyForm />
              </div>
            */}

            <Footer />
          </div>
        </ViewportFit>
      </main>

      {/*
        Outside <main>, and so outside ViewportFit: that component applies
        `transform: scale()` when it shrinks the page, and a transformed
        ancestor becomes the containing block for `position: fixed`
        children. Nested inside, this would scale with the content and pin
        to the corner of the scaled box rather than the viewport.
      */}
      <WhatsAppButton />

      <StructuredData />
    </>
  );
}

/** Organisation schema — lets search engines index the brand pre-launch. */
function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    slogan: SITE_CONFIG.tagline,
    email: SITE_CONFIG.contactEmail,
    foundingLocation: 'Kerala, India',
    sameAs: ['https://instagram.com', 'https://facebook.com'],
    event: {
      '@type': 'Event',
      name: `${SITE_CONFIG.name} Launch`,
      startDate: LAUNCH_DATE_ISO,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    },
  };

  return (
    <script
      type="application/ld+json"
      // Static, developer-authored object — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
