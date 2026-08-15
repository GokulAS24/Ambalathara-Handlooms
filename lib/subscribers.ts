import 'server-only';

/**
 * Placeholder subscriber store.
 *
 * In-memory on purpose: it keeps the landing page dependency-free while
 * exposing the exact async surface a real store will have. When the
 * commerce phase lands, swap the body of these two functions for a
 * Prisma/Drizzle/Supabase call (or a Mailchimp/Resend audience) — every
 * caller stays untouched.
 *
 * NOTE: a module-level Map does not survive a server restart and is not
 * shared across serverless instances. It is a stand-in, not storage.
 */
const subscribers = new Map<string, { email: string; source: string; createdAt: string }>();

export interface AddSubscriberResult {
  created: boolean;
}

export async function addSubscriber(
  email: string,
  source = 'coming-soon'
): Promise<AddSubscriberResult> {
  if (subscribers.has(email)) {
    return { created: false };
  }

  subscribers.set(email, {
    email,
    source,
    createdAt: new Date().toISOString(),
  });

  return { created: true };
}

export async function countSubscribers(): Promise<number> {
  return subscribers.size;
}
