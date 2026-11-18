import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { isUserRole } from "@/lib/auth/rbac";

/**
 * Layout untuk route group (dashboard): semua halaman setelah login.
 * Memvalidasi session di server, lalu render shell dengan sidebar/bottom-nav.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil profile dari app_metadata (diset saat register)
  const fullName = (user.user_metadata?.full_name as string | undefined) ?? "Pengguna";
  const businessName = (user.user_metadata?.business_name as string | undefined) ?? null;
  const rawRole: unknown = user.app_metadata?.role;
  if (!isUserRole(rawRole)) {
    redirect("/access-denied");
  }
  const role = rawRole;

  return (
    <DashboardShell
      user={{
        id: user.id,
        email: user.email ?? "",
        fullName,
        avatarUrl: null,
        role,
        businessName,
        createdAt: user.created_at,
      }}
    >
      {children}
    </DashboardShell>
  );
}
