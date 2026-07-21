/**
 * Server-side helpers untuk Super Admin Console.
 * Hanya user dengan role 'admin' yang boleh akses.
 *
 * Pakai admin client (service role) untuk bypass RLS — karena:
 * - profiles_self_read hanya izinkan user baca row sendiri
 * - Untuk getAllUsers/getAdminStats butuh lihat semua user
 * - Untuk requireAdmin, kita cek role sendiri (bisa pakai anon, tapi
 *   lebih reliable pakai service-role untuk konsistensi)
 */
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { UserProfile } from "@/types/auth";

/**
 * Helper: resolve user_id dari session aktif.
 * Returns null kalau tidak ada session.
 */
async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Ambil profile user saat ini.
 * Return null kalau:
 * - Tidak ada session
 * - User tidak ditemukan di profiles table
 *
 * PENTING: Middleware pakai app_metadata.role (Edge-compatible).
 * Untuk konsistensi, kita cek dua sumber:
 * 1. profiles.role (via service-role → paling reliable)
 * 2. app_metadata.role (fallback kalau service-role belum diset)
 */
export async function getCurrentAdminProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const roleFromMeta = user.app_metadata?.role as string | undefined;

  // Strategi 1: coba baca profiles via service-role (paling reliable)
  try {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("id, email, full_name, role, phone, industry, client_id, business_name, created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      return {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name ?? "User",
        avatarUrl: null,
        role: profile.role as UserProfile["role"],
        businessName: profile.business_name ?? null,
        createdAt: profile.created_at,
      };
    }

    // Profile row belum ada — kemungkinan signup baru. Fallback ke app_metadata.
    if (roleFromMeta) {
      return {
        id: user.id,
        email: user.email ?? "",
        fullName: (user.user_metadata?.full_name as string) ?? user.email ?? "User",
        avatarUrl: null,
        role: roleFromMeta as UserProfile["role"],
        businessName: null,
        createdAt: user.created_at,
      };
    }
    return null;
  } catch (err) {
    // Service-role belum di-set → fallback ke app_metadata
    console.warn(
      "[admin] service-role unavailable, fallback to app_metadata.role:",
      err instanceof Error ? err.message : err
    );

    if (roleFromMeta) {
      return {
        id: user.id,
        email: user.email ?? "",
        fullName: (user.user_metadata?.full_name as string) ?? user.email ?? "User",
        avatarUrl: null,
        role: roleFromMeta as UserProfile["role"],
        businessName: null,
        createdAt: user.created_at,
      };
    }

    // Last resort: query profiles via anon client (RLS self_read izinkan ini)
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, phone, industry, client_id, business_name, created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) return null;

    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name ?? "User",
      avatarUrl: null,
      role: profile.role as UserProfile["role"],
      businessName: profile.business_name ?? null,
      createdAt: profile.created_at,
    };
  }
}

/**
 * Require user dengan role admin. Redirect ke /dashboard kalau bukan.
 *
 * Untuk halaman admin yang ingin render "Access Denied" UI (lebih user-friendly
 * dari silent redirect), pakai `getCurrentAdminProfile()` lalu cek `profile?.role`
 * secara manual di page component.
 */
export async function requireAdmin(): Promise<UserProfile> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const admin = createAdminClient();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("id, email, full_name, role, phone, industry, client_id, business_name, created_at")
    .eq("id", userId)
    .single();

  if (error || !profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name ?? "Admin",
    avatarUrl: null,
    role: profile.role as UserProfile["role"],
    businessName: profile.business_name ?? null,
    createdAt: profile.created_at,
  };
}

/**
 * Get semua users untuk admin user management.
 * Pakai service-role (bypass RLS) supaya bisa lihat semua user.
 */
export async function getAllUsers() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, full_name, role, phone, industry, client_id, business_name, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("[admin] getAllUsers error:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Get summary stats untuk admin dashboard.
 * Pakai service-role untuk konsistensi count.
 */
export async function getAdminStats() {
  const admin = createAdminClient();

  const [usersRes, clientsRes, productsRes, txRes] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("clients").select("client_id", { count: "exact", head: true }),
    admin.from("products").select("id", { count: "exact", head: true }),
    admin.from("transactions").select("id", { count: "exact", head: true }),
  ]);

  // Users by role (service-role, full visibility)
  const { data: roles } = await admin.from("profiles").select("role");
  const byRole: Record<string, number> = {};
  (roles ?? []).forEach((r: { role: string }) => {
    byRole[r.role] = (byRole[r.role] ?? 0) + 1;
  });

  return {
    totalUsers: usersRes.count ?? 0,
    totalClients: clientsRes.count ?? 0,
    totalProducts: productsRes.count ?? 0,
    totalTransactions: txRes.count ?? 0,
    usersByRole: byRole,
  };
}

/**
 * Get roadmap items (admin can read all).
 */
export async function getRoadmapItems() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("roadmap_items")
    .select("id, phase, title, description, status, updated_at")
    .order("phase", { ascending: true });

  if (error) {
    console.error("[admin] getRoadmapItems error:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Update roadmap item status (admin only).
 */
export async function updateRoadmapItem(
  id: number,
  status: "todo" | "next" | "done",
  adminId: string
) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("roadmap_items")
    .update({
      status,
      updated_at: new Date().toISOString(),
      updated_by: adminId,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Log audit
  await admin.from("admin_audit_log").insert({
    admin_user_id: adminId,
    action: "update_roadmap",
    target: `roadmap_item:${id}`,
    metadata: { new_status: status },
  });
}

/**
 * Log admin action ke audit log.
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  target?: string,
  metadata: Record<string, unknown> = {}
) {
  const admin = createAdminClient();
  await admin.from("admin_audit_log").insert({
    admin_user_id: adminId,
    action,
    target,
    metadata,
  });
}
