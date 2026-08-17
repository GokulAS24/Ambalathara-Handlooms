'use client';

import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase/client';

/**
 * Real authentication now (Supabase Auth), replacing the earlier
 * client-side password check — this project moved from browser-local
 * product drafts to a real shared Supabase database, and RLS needs an
 * actual signed-in session to tell an admin's write from a stranger's
 * (see supabase/migrations/0001_init.sql: any `authenticated` user can
 * write, so the only account that should exist is the one admin creates
 * directly in the Supabase dashboard — Authentication -> Add user. There
 * is no sign-up flow here on purpose).
 *
 * Session persistence/refresh is handled by the Supabase client itself
 * (it keeps a token in this browser's localStorage) — that's the SDK's
 * own normal mechanism for staying signed in, unrelated to this project's
 * earlier, since-removed practice of keeping *product data* in
 * localStorage.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  if (!checked) return null;

  if (session) {
    return (
      <div>
        <div className="flex items-center justify-end gap-3 bg-cream-300 px-5 py-2 font-sans text-xs text-earth sm:px-8">
          <span>Signed in as {session.user.email}</span>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="uppercase tracking-wide text-maroon underline"
          >
            Sign out
          </button>
        </div>
        {children}
      </div>
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);
    if (signInError) setError('Incorrect email or password.');
  };

  return (
    <div className="cotton-glow flex min-h-screen w-full items-center justify-center px-5">
      <form onSubmit={submit} className="card-handloom w-full max-w-sm rounded-sm p-8 shadow-zari">
        <h1 className="font-serif text-xl text-maroon">Admin sign in</h1>
        <p className="mt-2 font-sans text-xs leading-relaxed text-earth">
          Sign in with the admin account created in the Supabase dashboard.
        </p>

        <label className="mt-5 flex flex-col gap-1.5">
          <span className="font-sans text-xs uppercase tracking-wide text-earth">Email</span>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoFocus
            required
          />
        </label>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="font-sans text-xs uppercase tracking-wide text-earth">Password</span>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <p className="mt-3 font-sans text-xs text-maroon">{error}</p>}

        <Button type="submit" disabled={submitting} className="mt-5 w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}

export default AdminGate;
