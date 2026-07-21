import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { canAccess, isProtectedRoute, isPublicRoute, defaultRouteForRole } from "@/lib/auth/rbac";
import type { UserRole } from "@/types/auth";

/**
 * Middleware utama: handle Supabase session refresh + RBAC route protection.
 *
 * Strategy:
 * - Public routes: biarkan lewat
 * - Protected routes: wajib ada user (kalau tidak → /login)
 * - RBAC strict (mis. /kasir, /laporan): kalau role tidak sesuai → redirect
 *   ke default route role-nya (silent — biar UX bersih)
 * - RBAC display-with-error (mis. /dashboard/admin/*): kalau role tidak sesuai
 *   → biarkan lewat (jangan redirect). Page itu sendiri akan render
 *   "Access Denied" component dengan link kembali ke dashboard.
 *
 * Flag `allowDenyWithMessage` di `protected_routes_rbac` di bawah mengatur
 * strategi mana yang dipakai per path.
 */
const RBAC_REDIRECT_PATHS = [
  // Path-path yang HARUS redirect kalau role tidak sesuai (UX ketat)
  "/kasir",
  "/buku-kas",
  "/produk",
  "/laporan",
  "/ai-chat",
  "/settings",
];

const RBAC_DENY_MESSAGE_PATHS = [
  // Path-path yang lebih baik render "Access Denied" page
  "/dashboard/admin",
];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // 1. Route publik: biarkan lewat
  if (isPublicRoute(pathname)) {
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

    // 3. Baca role dari app_metadata (Edge-compatible)
    const role: UserRole =
      (user.app_metadata?.role as UserRole | undefined) ?? "pemilik";

    // 4. Cek RBAC
    if (!canAccess(pathname, role)) {
      // 4a. Kalau path masuk kategori "deny with message" → biarkan lewat,
      //     page akan render UI "Access Denied"
      const isDenyWithMessage = RBAC_DENY_MESSAGE_PATHS.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
      );
      if (isDenyWithMessage) {
        console.log(
          `[middleware] RBAC deny (show message): user=${user.email} role=${role} path=${pathname}`
        );
        return response;
      }

      // 4b. Path RBAC strict → redirect ke default route role-nya
      if (RBAC_REDIRECT_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
        const fallback = defaultRouteForRole(role);
        console.log(
          `[middleware] RBAC deny (redirect): user=${user.email} role=${role} path=${pathname} -> ${fallback}`
        );
        return Response.redirect(new URL(fallback, request.url));
      }

      // 4c. Fallback: biarkan lewat (default route /dashboard tidak butuh role strict)
      return response;
    }
  }

  // 5. Root path '/': redirect ke landing publik
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
