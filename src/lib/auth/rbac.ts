import { ROUTE_ACCESS, ROLE_LABELS, type UserRole, type UserProfile } from "@/types/auth";

/**
 * Cek apakah role user diizinkan akses suatu path.
 * Digunakan di server (middleware) & client (conditional rendering).
 */
const VALID_ROLES = new Set<UserRole>(Object.keys(ROLE_LABELS) as UserRole[]);

export function isUserRole(role: unknown): role is UserRole {
  return typeof role === "string" && VALID_ROLES.has(role as UserRole);
}

export function canAccess(path: string, role: UserRole | null): boolean {
  if (!role) return false;
  const access = ROUTE_ACCESS
    .filter((route) => path === route.path || path.startsWith(`${route.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0];

  if (!access) {
    // Route tanpa aturan RBAC explicit = publik (mis. landing, /login)
    return true;
  }
  return access.allowedRoles.includes(role);
}

/**
 * Cek apakah path adalah route publik (tidak perlu login).
 */
export function isPublicRoute(path: string): boolean {
  const publicPaths = ["/landing", "/login", "/register", "/forgot-password"];
  return publicPaths.some((route) => path === route || path.startsWith(`${route}/`));
}

/**
 * Cek apakah path butuh autentikasi.
 */
export function isProtectedRoute(path: string): boolean {
  const protectedPrefixes = ["/dashboard", "/settings"];
  return protectedPrefixes.some((route) => path === route || path.startsWith(`${route}/`));
}

/** Default landing route setelah login berdasarkan role. */
export function defaultRouteForRole(role: UserRole): string {
  switch (role) {
    case "kasir":
      return "/dashboard/kas/new";
    case "anggota_koperasi":
      return "/dashboard/kas";
    case "admin":
    case "pemilik":
    default:
      return "/dashboard";
  }
}

/** Sanitasi profile object agar konsisten untuk client. */
export function sanitizeProfile(profile: UserProfile | null): UserProfile | null {
  if (!profile) return null;
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName?.trim() || "Pengguna",
    avatarUrl: profile.avatarUrl,
    role: profile.role,
    businessName: profile.businessName?.trim() || null,
    createdAt: profile.createdAt,
  };
}
