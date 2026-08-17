'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ADMIN_PASSWORD } from '@/lib/constants';

const SESSION_KEY = 'ambalathara-admin-unlocked';

/**
 * Client-side password check — NOT real security. The password ships in
 * the JS bundle; anyone who opens dev tools can read it or skip this
 * entirely. Its actual job is keeping casual visitors from stumbling onto
 * edit controls, not protecting data — there's nothing to protect here,
 * since every edit stays local to the admin's own browser until they
 * choose to export it. Said explicitly below, not just in this comment.
 *
 * Result cached in sessionStorage so it doesn't re-prompt on every
 * navigation within the same browser tab session.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setUnlocked(window.sessionStorage.getItem(SESSION_KEY) === 'true');
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (unlocked) return <>{children}</>;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!ADMIN_PASSWORD) {
      setError(true);
      return;
    }

    if (input === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(SESSION_KEY, 'true');
      setUnlocked(true);
      return;
    }

    setError(true);
  };

  return (
    <div className="cotton-glow flex min-h-screen w-full items-center justify-center px-5">
      <form
        onSubmit={submit}
        className="card-handloom w-full max-w-sm rounded-sm p-8 shadow-zari"
      >
        <h1 className="font-serif text-xl text-maroon">Admin access</h1>
        <p className="mt-2 font-sans text-xs leading-relaxed text-earth">
          Not real security — this only keeps casual visitors out. Edits made here stay in
          this browser until exported, so there is nothing sensitive behind it.
        </p>

        <Input
          type="password"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setError(false);
          }}
          placeholder="Password"
          autoFocus
          className="mt-5"
        />

        {error && (
          <p className="mt-2 font-sans text-xs text-maroon">
            {ADMIN_PASSWORD ? 'Incorrect password.' : 'NEXT_PUBLIC_ADMIN_PASSWORD is not set.'}
          </p>
        )}

        <Button type="submit" className="mt-5 w-full">
          Unlock
        </Button>
      </form>
    </div>
  );
}

export default AdminGate;
