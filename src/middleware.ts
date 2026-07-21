import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { canAccess, isProtectedRoute, isPublicRoute, defaultRouteForRole } from "@/lib/auth/rbac";
import type { UserRole } from "@/types/auth";

/**
 * Middleware utama: handle Supabase session refresh + RBAC route protection.
 *
 * CATATAN PENTING: Middleware Vercel jalan di Edge Runtime.
 * `@supabase/supabase-js` (createAdminClient) TIDAK kompatibel dengan Edge
 * (butuh Node.js APIs). Jadi kita pakai alternatif:
 * 1. Baca role dari user.app_metadata?.role (default fallback: 'pemilik')
 * 2. Middleware ini CEGAH akses route yang butuh role spesifik
 * 3. Server component / page itu sendiri verify role via service-role
 *    (lib/admin/rbac.ts → requireAdmin() — yang Node.js compatible)
 *
 * Untuk sync role dari profiles → app_metadata, lihat:
 * sql/sync_role_to_app_metadata.sql
 */
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

    // 3. RBAC check: ambil role dari user.app_metadata?.role
    //    (Edge-compatible — tidak butuh DB query)
    //    Default 'pemilik' untuk user yang belum di-sync role-nya
    const role: UserRole =
      (user.app_metadata?.role as UserRole | undefined) ?? "pemilik";

    if (!canAccess(pathname, role)) {
      const fallback = defaultRouteForRole(role);
      console.log(
        `[middleware] RBAC deny: user=${user.email} role=${role} path=${pathname} -> ${fallback}`
      );
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
