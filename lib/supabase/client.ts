import { createClient } from '@supabase/supabase-js';

/**
 * Single browser-side Supabase client, used by both the public catalog
 * (anon reads, RLS restricts it to ACTIVE rows — see
 * supabase/migrations/0001_init.sql) and the admin panel (same client;
 * once signed in via AdminGate, its session grants the `authenticated`
 * role RLS checks for write access).
 *
 * Only ever the anon/public key here — the service role key must never
 * reach browser code, and nothing in this project uses it.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Fails loudly at build/dev time rather than surfacing as a confusing
  // runtime fetch error the first time a component tries to query.
  // eslint-disable-next-line no-console -- intentional startup diagnostic, not a stray debug log
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY — set them in .env (and in Vercel for production).'
  );
}

/**
 * `createClient` throws synchronously on an empty URL — fine once real
 * env vars are set, fatal during Next.js's static-shell prerendering of
 * `/` and `/admin` if they're ever momentarily absent (this app's own
 * local build without a configured .env hit exactly this). Every actual
 * query only ever runs client-side inside a useEffect, after real
 * hydration in the browser (where the real env vars are always present,
 * injected at build time) — so this placeholder is never actually called
 * against, it just has to be syntactically valid so module load doesn't
 * crash the one-time server-side shell render.
 */
export const supabase = createClient(SUPABASE_URL || 'https://placeholder.supabase.co', SUPABASE_ANON_KEY || 'placeholder-anon-key');
