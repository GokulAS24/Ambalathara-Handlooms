import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const BUTTON_VARIANTS: Record<Variant, string> = {
  primary:
    'bg-maroon text-cream-100 shadow-loom hover:bg-maroon-light active:bg-maroon-dark ' +
    'border border-maroon-dark/40',
  ghost:
    'bg-transparent text-maroon border border-gold/60 hover:bg-gold/10 hover:border-gold',
};

export const BUTTON_SIZES: Record<Size, string> = {
  sm: 'h-[var(--control-h-sm)] px-5 text-[length:var(--text-control-sm)]',
  md: 'h-[var(--control-h)] px-7 text-[length:var(--text-control)]',
  /**
   * Fixed (not vh-clamped) on purpose — unlike sm/md, this is only used
   * outside the countdown page's one-screen fluid budget (e.g. the
   * product modal's CTAs), where a real scrolling page has no reason to
   * shrink a "Buy Now"-equivalent button as height gets scarce.
   */
  lg: 'h-14 px-8 text-sm',
};

/**
 * The classes Button itself applies, exposed so a non-<button> element
 * (an anchor for a `tel:`/`wa.me` link, say — real interactive content
 * that must not end up nested inside an actual <button>) can look
 * identical without duplicating this string.
 */
export function buttonClassName(variant: Variant = 'primary', size: Size = 'md'): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-sm font-sans font-medium uppercase',
    'tracking-[0.2em] transition-all duration-300 ease-out',
    'disabled:cursor-not-allowed disabled:opacity-55',
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size]
  );
}

/**
 * Server-safe by design — no hooks, no event-handler defaults — so it can
 * be dropped into either a server or a client component.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonClassName(variant, size), className)}
      {...props}
    />
  );
});
