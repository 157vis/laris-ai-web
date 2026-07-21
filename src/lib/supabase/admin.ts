import { createClient as createBaseClient } from "@supabase/supabase-js";

/**
 * Supabase admin client (SERVICE ROLE) — bypasses RLS.
 *
 * GUNAKAN HANYA untuk:
 * - Server actions yang butuh akses admin
 * - Background jobs / cron
 * - Internal admin tasks (e.g. getRoleForUser)
 *
 * JANGAN PERNAH import dari Client Component ('use client')!
 * Service role key bisa bypass RLS dan akses semua data.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. " +
        "Tambahkan SUPABASE_SERVICE_ROLE_KEY di Vercel Environment Variables."
    );
  }

  return createBaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
