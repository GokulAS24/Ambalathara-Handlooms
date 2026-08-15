import { NextResponse } from 'next/server';
import type { SubscribeRequest, SubscribeResponse } from '@/types';
import { isValidEmail, normalizeEmail } from '@/lib/utils';
import { addSubscriber } from '@/lib/subscribers';
import { NOTIFY_COPY } from '@/lib/constants';

/**
 * POST /api/subscribe
 *
 * Reference route handler for the launch mailing list, and the template
 * every future endpoint (products, cart, checkout) should follow:
 * parse → validate → delegate to a lib/ function → typed JSON response.
 * No business logic lives in the route itself.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(body: SubscribeResponse, status: number) {
  return NextResponse.json<SubscribeResponse>(body, { status });
}

export async function POST(request: Request) {
  let payload: SubscribeRequest;

  try {
    payload = (await request.json()) as SubscribeRequest;
  } catch {
    return json({ success: false, message: 'Malformed request body.' }, 400);
  }

  // Honeypot: a filled `website` field means a bot. Answer 200 so the
  // bot believes it succeeded, but store nothing.
  if (payload.website) {
    return json({ success: true, message: NOTIFY_COPY.success }, 200);
  }

  const email = normalizeEmail(payload.email ?? '');

  if (!isValidEmail(email)) {
    return json({ success: false, message: 'Please enter a valid email address.' }, 422);
  }

  try {
    const { created } = await addSubscriber(email, payload.source ?? 'coming-soon');

    // TODO(commerce): enqueue the double opt-in mail here.
    return json(
      {
        success: true,
        message: created ? NOTIFY_COPY.success : NOTIFY_COPY.duplicate,
        alreadySubscribed: !created,
      },
      created ? 201 : 200
    );
  } catch (error) {
    console.error('[subscribe] failed to store subscriber', error);
    return json({ success: false, message: NOTIFY_COPY.error }, 500);
  }
}

/** Method guard so a stray GET returns something sensible. */
export async function GET() {
  return NextResponse.json({ message: 'POST an { email } payload to subscribe.' }, { status: 405 });
}
