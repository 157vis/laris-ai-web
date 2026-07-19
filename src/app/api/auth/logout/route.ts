import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Logout endpoint — dipanggil dari form action di sidebar.
 * Ref: brief FASE 1 — RBAC + secure logout.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Redirect ke login setelah logout
  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl, { status: 303 });
}

// Cegah GET method
export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed. Gunakan POST." },
    { status: 405 }
  );
}
