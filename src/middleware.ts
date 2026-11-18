import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  canAccess,
  defaultRouteForRole,
  isProtectedRoute,
  isPublicRoute,
  isUserRole,
} from "@/lib/auth/rbac";

const RBAC_DENY_MESSAGE_PATHS = ["/dashboard/admin"];

function redirectWithSession(path: string, request: NextRequest, response: NextResponse) {
  const redirectResponse = NextResponse.redirect(new URL(path, request.url));
  response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  return redirectResponse;
}

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;
  const role = isUserRole(user?.app_metadata?.role) ? user.app_metadata.role : null;

  if (isPublicRoute(pathname)) {
    if (user && (pathname === "/login" || pathname === "/register")) {
      return redirectWithSession(
        role ? defaultRouteForRole(role) : "/access-denied",
        request,
        response
      );
    }
    return response;
  }

  if (isProtectedRoute(pathname)) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return redirectWithSession(`${loginUrl.pathname}${loginUrl.search}`, request, response);
    }

    if (!role) {
      return redirectWithSession("/access-denied", request, response);
    }

    if (!canAccess(pathname, role)) {
      const shouldShowAccessDenied = RBAC_DENY_MESSAGE_PATHS.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      );
      if (shouldShowAccessDenied) return response;
      return redirectWithSession(defaultRouteForRole(role), request, response);
    }
  }

  if (pathname === "/") {
    return redirectWithSession("/landing", request, response);
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
