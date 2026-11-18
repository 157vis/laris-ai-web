import { NextRequest, NextResponse } from "next/server";
import { defaultRouteForRole, isUserRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth_callback", request.url));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login?error=auth_callback", request.url));
  }

  const role: unknown = data.user.app_metadata?.role;
  const destination = isUserRole(role)
    ? defaultRouteForRole(role)
    : "/access-denied";

  return NextResponse.redirect(new URL(destination, request.url));
}
