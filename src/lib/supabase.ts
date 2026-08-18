import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const UPLOADS_BUCKET = "uploads";

let client: SupabaseClient | undefined;

export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
    }
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
