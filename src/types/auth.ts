/**
 * Tipe untuk autentikasi & RBAC.
 * Ref: bukuwarung-ai/setup_laris_ai.sql (role-based access).
 */

export type UserRole = "admin" | "kasir" | "pemilik" | "anggota_koperasi";

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  kasir: "Kasir",
  pemilik: "Pemilik Toko",
  anggota_koperasi: "Anggota Koperasi",
};

/** Daftar role yang diizinkan akses suatu route. */
export interface RouteAccess {
  path: string;
  allowedRoles: UserRole[];
}

// Ref: bukuwarung-ai/README.md (Agent AI role mapping)
export const ROUTE_ACCESS: RouteAccess[] = [
  { path: "/dashboard", allowedRoles: ["admin", "pemilik"] },
  { path: "/dashboard/admin", allowedRoles: ["admin"] },
  { path: "/dashboard/kas", allowedRoles: ["admin", "kasir", "pemilik", "anggota_koperasi"] },
  { path: "/dashboard/produk", allowedRoles: ["admin", "pemilik"] },
  { path: "/dashboard/laporan", allowedRoles: ["admin", "pemilik"] },
  { path: "/dashboard/ai-chat", allowedRoles: ["admin", "kasir", "pemilik", "anggota_koperasi"] },
  { path: "/settings", allowedRoles: ["admin", "kasir", "pemilik", "anggota_koperasi"] },
];

/** Profile user hasil join dari tabel profiles Supabase. */
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: UserRole;
  businessName: string | null;
  createdAt: string;
}
