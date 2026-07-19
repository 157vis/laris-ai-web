import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { canAccess, isProtectedRoute, isPublicRoute, defaultRouteForRole } from "@/lib/auth/rbac";
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

    // 3. RBAC check: ambil role dari user metadata
    const role = (user.app_metadata?.role as UserRole | undefined) ?? "pemilik";

    if (!canAccess(pathname, role)) {
      // Redirect ke default route role-nya (fallback aman)
      const fallback = defaultRouteForRole(role);
      return Response.redirect(new URL(fallback, request.url));
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
