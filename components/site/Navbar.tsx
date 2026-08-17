import { SITE_CONFIG } from '@/lib/constants';

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'Contact', href: '#contact' },
] as const;

/**
 * Server-safe: plain `#anchor` links to same-page sections (not Next
 * `Link`, which is for route transitions), relying on the global
 * `scroll-behavior: smooth` already set in globals.css — no extra JS for
 * the scrolling itself. `sticky` rather than `fixed` so it starts in
 * normal flow and doesn't need a compensating top-padding hack on the
 * hero beneath it.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gold/30 bg-cream-100/90 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-1.5 px-3 py-3.5 sm:gap-4 sm:px-8 sm:py-4"
      >
        <a
          href="#home"
          className="shrink-0 font-serif text-[0.9rem] font-semibold tracking-wide text-maroon sm:text-xl"
        >
          {SITE_CONFIG.shortName}{' '}
          <span className="hidden font-sans text-[0.6rem] font-medium uppercase tracking-[0.3em] text-gold-dark sm:inline">
            Handlooms
          </span>
        </a>

        <ul className="flex items-center gap-1.5 font-sans text-[0.5rem] font-medium uppercase tracking-[0.04em] text-earth sm:gap-8 sm:text-xs sm:tracking-[0.2em]">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="whitespace-nowrap transition-colors duration-300 hover:text-maroon"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
