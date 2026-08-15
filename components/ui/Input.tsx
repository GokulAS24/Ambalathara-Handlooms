import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-[var(--control-h)] w-full rounded-sm border border-gold/45 bg-white/70 px-4',
        'font-sans text-[length:var(--text-control)] text-charcoal placeholder:text-earth/70',
        'transition-colors duration-300',
        'hover:border-gold/70 focus:border-gold focus:bg-white focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    />
  );
});
