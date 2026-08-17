import { CountdownTimer } from '@/components/landing/CountdownTimer';
import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { OrnamentalDivider } from '@/components/landing/OrnamentalDivider';
import { ViewportFit } from '@/components/layout/ViewportFit';

/**
 * The pre-launch page, moved out of app/page.tsx unchanged so LaunchGate can
 * pick between this and MainSite. Nothing in here differs from the original
 * page body — same markup, same classes, same comments — this file only
 * exists so the mode switch has something to switch between.
 *
 * BackgroundPatterns, WhatsAppButton and StructuredData stay in
 * app/page.tsx itself: they already apply regardless of mode, and
 * WhatsAppButton specifically must stay outside anything ViewportFit
 * scales (see the comment at its call site).
 */
export function CountdownLanding() {
  return (
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
  );
}

export default CountdownLanding;
