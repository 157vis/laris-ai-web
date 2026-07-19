import { ROUTE_ACCESS, type UserRole, type UserProfile } from "@/types/auth";

/**
 * Cek apakah role user diizinkan akses suatu path.
 * Digunakan di server (middleware) & client (conditional rendering).
 */
export function canAccess(path: string, role: UserRole | null): boolean {
  if (!role) return false;
  const access = ROUTE_ACCESS.find(
    (r) => path === r.path || path.startsWith(`${r.path}/`)
  );
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
  return publicPaths.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
}

/**
 * Cek apakah path butuh autentikasi.
 */
export function isProtectedRoute(path: string): boolean {
  const protectedPrefixes = [
    "/dashboard",
    "/kasir",
    "/buku-kas",
    "/produk",
    "/laporan",
    "/ai-chat",
    "/settings",
  ];
  return protectedPrefixes.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
}

/** Default landing route setelah login berdasarkan role. */
export function defaultRouteForRole(role: UserRole): string {
  switch (role) {
    case "kasir":
      return "/kasir";
    case "anggota_koperasi":
      return "/buku-kas";
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
