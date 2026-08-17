'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
] as const;

/**
 * `sticky` rather than `fixed` so it starts in normal flow and doesn't need
 * a compensating top-padding hack on the hero beneath it. Client component
 * (unlike the rest of this file's server-safe siblings) partly for the
 * scroll listener that deepens its shadow/border once the hero has scrolled
 * past, and partly for `usePathname` — these are plain `#anchor` scrolls
 * that only work on `/` itself; any other route (e.g. a product's own page)
 * needs the `/` prefixed back on so the browser navigates home first.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b bg-cream-100/90 backdrop-blur-md transition-shadow duration-300',
        scrolled ? 'border-gold/50 shadow-md' : 'border-gold/30'
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-1.5 px-3 py-3.5 sm:gap-4 sm:px-8 sm:py-4"
      >
        <a
          href={onHome ? '#home' : '/#home'}
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
                href={onHome ? link.href : `/${link.href}`}
                className="group relative whitespace-nowrap py-1 transition-colors duration-300 hover:text-maroon"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-maroon transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
