import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { MotionProvider } from '@/components/ui/MotionProvider';
import { SITE_CONFIG } from '@/lib/constants';
import './globals.css';

/**
 * Fonts are self-hosted by next/font at build time — no render-blocking
 * request to Google, no layout shift, and `display: swap` keeps first
 * paint honest.
 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

/**
 * True italics come from a second instance. Requesting `ital` alongside
 * multiple weights in one call trips a URL-parsing bug in next/font
 * 14.2.x, and a real italic beats a browser-slanted oblique for a serif.
 */
const playfairItalic = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-playfair-italic',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s · ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  keywords: [
    'handloom',
    'kasavu saree',
    'Kerala handloom',
    'handwoven cotton',
    'traditional weaving',
    'Ambalathara Handlooms',
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  themeColor: '#ECD6BF',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${playfair.variable} ${playfairItalic.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-cream font-sans text-charcoal antialiased">
        <SplashScreen />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
