import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { canAccess, isProtectedRoute, isPublicRoute, defaultRouteForRole } from "@/lib/auth/rbac";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/types/auth";

/**
 * Middleware utama: handle Supabase session refresh + RBAC route protection.
 * Ref: bukuwarung-ai/README.md (multi-role system)
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // 1. Route publik: biarkan lewat
  if (isPublicRoute(pathname)) {
    // Jika user SUDAH login & akses halaman login/register, redirect ke dashboard
    if (user && (pathname === "/login" || pathname === "/register")) {
      return Response.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  // 2. Route terproteksi: wajib ada user
  if (isProtectedRoute(pathname)) {
    if (!user) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirectTo", pathname);
      return Response.redirect(redirectUrl);
    }

    // 3. RBAC check: ambil role dari profiles table (lebih reliable
    // daripada app_metadata, karena role sering berubah via admin panel)
    let role: UserRole = "pemilik";
    try {
      const admin = createAdminClient();
      const { data: profile } = await admin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      role = (profile?.role as UserRole | undefined) ?? "pemilik";
    } catch (err) {
      // Fallback ke app_metadata kalau service-role belum diset
      console.warn("[middleware] service-role unavailable, fallback to app_metadata:", err);
      role = (user.app_metadata?.role as UserRole | undefined) ?? "pemilik";
    }

    if (!canAccess(pathname, role)) {
      // Redirect ke default route role-nya (fallback aman)
      const fallback = defaultRouteForRole(role);
      const redirectUrl = new URL(fallback, request.url);
      console.log(
        `[middleware] RBAC deny: user=${user.email} role=${role} path=${pathname} → redirect ${fallback}`
      );
      return Response.redirect(redirectUrl);
    }
  }

  // 4. Root path '/': redirect ke landing publik
  if (pathname === "/") {
    return Response.redirect(new URL("/landing", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match semua request KECUALI:
     * - api routes
     * - _next/static, _next/image, favicon, manifest, sw.js
     * - file dengan ekstensi gambar/video/font
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)",
  ],
};
