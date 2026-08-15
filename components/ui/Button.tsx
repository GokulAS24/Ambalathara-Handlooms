import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost';
type Size = 'sm' | 'md';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-maroon text-cream-100 shadow-loom hover:bg-maroon-light active:bg-maroon-dark ' +
    'border border-maroon-dark/40',
  ghost:
    'bg-transparent text-maroon border border-gold/60 hover:bg-gold/10 hover:border-gold',
};

const SIZES: Record<Size, string> = {
  sm: 'h-[var(--control-h-sm)] px-5 text-[length:var(--text-control-sm)]',
  md: 'h-[var(--control-h)] px-7 text-[length:var(--text-control)]',
};

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
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-sm font-sans font-medium uppercase',
        'tracking-[0.2em] transition-all duration-300 ease-out',
        'disabled:cursor-not-allowed disabled:opacity-55',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  );
});
