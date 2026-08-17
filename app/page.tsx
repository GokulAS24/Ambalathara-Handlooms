import { BackgroundPatterns } from '@/components/landing/BackgroundPatterns';
import { WhatsAppButton } from '@/components/landing/WhatsAppButton';
import { LaunchGate } from '@/components/layout/LaunchGate';
import { LAUNCH_DATE_ISO, SITE_CONFIG } from '@/lib/constants';

/**
 * Server component. `LaunchGate` (client) picks between the pre-launch
 * countdown page and the full main site the instant the countdown
 * completes — see components/layout/LaunchGate.tsx. Everything here stays
 * a sibling of it, not nested inside, because both apply regardless of
 * which mode is showing.
 */
export default function HomePage() {
  return (
    <>
      <BackgroundPatterns />

      <LaunchGate />

      {/*
        Outside LaunchGate's countdown-mode <main>, and so outside
        ViewportFit: that component applies `transform: scale()` when it
        shrinks the page, and a transformed ancestor becomes the containing
        block for `position: fixed` children. Nested inside, this would
        scale with the content and pin to the corner of the scaled box
        rather than the viewport.
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
