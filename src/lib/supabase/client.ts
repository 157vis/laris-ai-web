import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk komponen Client Component ('use client').
 * Singleton agar tidak membuat instance baru tiap render.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
