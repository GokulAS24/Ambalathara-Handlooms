import { Facebook, Instagram, Mail } from 'lucide-react';
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';
import type { SocialLink } from '@/types';

const ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  mail: Mail,
} as const;

/** Server component — static, ships no JavaScript. */
export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center gap-[var(--space-stack)] pt-[var(--space-stack)]">
      <ul className="flex items-center gap-[var(--control-gap)]">
        {SOCIAL_LINKS.map((link: SocialLink) => {
          const Icon = ICONS[link.icon];
          return (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex items-center justify-center rounded-full border border-gold/40 text-earth/85 transition-all duration-300 hover:border-gold hover:text-maroon"
                style={{ height: 'var(--icon-size)', width: 'var(--icon-size)' }}
              >
                <Icon className="h-[42%] w-[42%]" aria-hidden />
              </a>
            </li>
          );
        })}
      </ul>

      <p className="text-center font-sans text-[length:var(--text-footer-copy)] uppercase tracking-[0.22em] text-earth/90">
        © {new Date().getFullYear()} {SITE_CONFIG.name} · Handwoven in Kerala
      </p>
    </footer>
  );
}

export default Footer;
