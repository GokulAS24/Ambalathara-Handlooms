'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { NOTIFY_COPY } from '@/lib/constants';
import { isValidEmail } from '@/lib/utils';
import type { SubmitStatus, SubscribeResponse } from '@/types';
import { cn } from '@/lib/utils';

export function NotifyForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [message, setMessage] = useState('');

  /** Honeypot — off-screen and never focusable, so only bots fill it. */
  const honeypotRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'loading') return;

    // Client-side check first: no round trip for an obvious typo.
    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          website: honeypotRef.current?.value ?? '',
          source: 'coming-soon',
        }),
      });

      const data = (await response.json()) as SubscribeResponse;

      if (!response.ok || !data.success) {
        setStatus('error');
        setMessage(data.message || NOTIFY_COPY.error);
        return;
      }

      setStatus('success');
      setMessage(data.message);
      setEmail('');
    } catch {
      setStatus('error');
      setMessage(NOTIFY_COPY.error);
    }
  }

  const isDone = status === 'success';

  return (
    <section className={cn('w-full max-w-md', className)} aria-labelledby="notify-heading">
      <h2
        id="notify-heading"
        className="text-center font-serif text-[length:var(--text-notify-heading)] leading-snug text-maroon"
      >
        {NOTIFY_COPY.heading}
      </h2>
      <p className="mt-1 text-center font-sans text-[length:var(--text-notify-sub)] text-earth/90">
        {NOTIFY_COPY.subheading}
      </p>

      <form onSubmit={handleSubmit} className="mt-[var(--space-stack)]" noValidate>
        {/* Always a row — even stacked on the narrowest phone this section
            costs one more line than the layout can spare. */}
        <div className="relative flex flex-row gap-[var(--control-gap)]">
          <label htmlFor="notify-email" className="sr-only">
            Email address
          </label>
          <Input
            id="notify-email"
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            placeholder={NOTIFY_COPY.placeholder}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              // Clear a stale error the moment the visitor starts correcting
              // it — leaving it on screen reads as though the new input was
              // rejected too.
              if (status !== 'idle') {
                setStatus('idle');
                setMessage('');
              }
            }}
            disabled={status === 'loading' || isDone}
            aria-invalid={status === 'error'}
            aria-describedby="notify-status"
            className="min-w-0 flex-1"
          />

          {/* Honeypot: hidden from humans, irresistible to bots. */}
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="pointer-events-none absolute h-0 w-0 opacity-0"
          />

          <Button
            type="submit"
            disabled={status === 'loading' || isDone}
            className="w-auto shrink-0 px-4 sm:px-7"
          >
            {status === 'loading' && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />}
            {isDone && <Check className="h-3.5 w-3.5" aria-hidden />}
            {status !== 'loading' && !isDone && <Send className="h-3.5 w-3.5" aria-hidden />}
            <span>{isDone ? 'Added' : NOTIFY_COPY.cta}</span>
          </Button>
        </div>

        {/* Reserved space keeps the layout from jumping when a message lands. */}
        <div
          id="notify-status"
          role="status"
          aria-live="polite"
          className="min-h-[var(--space-status-reserve)] pt-[var(--space-stack)]"
        >
          <AnimatePresence mode="wait">
            {message && (
              <motion.p
                key={message}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'text-center font-sans text-[length:var(--text-notify-sub)] leading-snug',
                  status === 'error' ? 'text-maroon' : 'text-earth/90'
                )}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>
    </section>
  );
}

export default NotifyForm;
