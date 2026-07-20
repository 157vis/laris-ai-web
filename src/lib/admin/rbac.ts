/**
 * Server-side helpers untuk Super Admin Console.
 * Hanya user dengan role 'admin' yang boleh akses.
 */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { UserProfile } from "@/types/auth";

/**
 * Require user dengan role admin. Redirect ke /dashboard kalau bukan.
 */
export async function requireAdmin(): Promise<UserProfile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, phone, industry, client_id, business_name, created_at")
    .eq("id", user.id)
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
 */
export async function getAllUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
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
 */
export async function getAdminStats() {
  const supabase = await createClient();

  const [usersRes, clientsRes, productsRes, txRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("clients").select("client_id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("transactions").select("id", { count: "exact", head: true }),
  ]);

  // Users by role
  const { data: byRole } = await supabase
    .from("profiles")
    .select("role")
    .then((res) => {
      const counts: Record<string, number> = {};
      (res.data ?? []).forEach((r: { role: string }) => {
        counts[r.role] = (counts[r.role] ?? 0) + 1;
      });
      return { data: counts };
    });

  return {
    totalUsers: usersRes.count ?? 0,
    totalClients: clientsRes.count ?? 0,
    totalProducts: productsRes.count ?? 0,
    totalTransactions: txRes.count ?? 0,
    usersByRole: byRole ?? {},
  };
}

/**
 * Get roadmap items (admin can read all).
 */
export async function getRoadmapItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
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
  const supabase = await createClient();
  const { error } = await supabase
    .from("roadmap_items")
    .update({
      status,
      updated_at: new Date().toISOString(),
      updated_by: adminId,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Log audit
  await supabase.from("admin_audit_log").insert({
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
  const supabase = await createClient();
  await supabase.from("admin_audit_log").insert({
    admin_user_id: adminId,
    action,
    target,
    metadata,
  });
}
