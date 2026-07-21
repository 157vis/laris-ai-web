import type { Metadata } from "next";
import { Users, Shield, Store, Briefcase, UserCog } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentAdminProfile, getAllUsers, logAdminAction } from "@/lib/admin/rbac";
import { ROLE_LABELS } from "@/types/auth";
import { AccessDenied } from "@/components/admin/access-denied";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Manajemen User",
  description: "Semua user terdaftar di Laris.AI",
};

export const dynamic = "force-dynamic";

const ROLE_ICONS: Record<string, typeof Shield> = {
  admin: Shield,
  pemilik: Store,
  kasir: UserCog,
  anggota_koperasi: Briefcase,
};

export default async function AdminUsersPage() {
  const adminProfile = await getCurrentAdminProfile();

  // Render AccessDenied kalau user bukan admin
  if (!adminProfile || adminProfile.role !== "admin") {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return (
      <AccessDenied
        currentRole={adminProfile?.role ?? "pemilik"}
        userEmail={user?.email ?? undefined}
      />
    );
  }

  const users = await getAllUsers();

  // Log admin visit
  await logAdminAction(adminProfile.id, "view_admin_users", "admin_users_page");

  // Hitung statistik per role
  const byRole = users.reduce<Record<string, number>>((acc, u) => {
    const r = u.role ?? "pemilik";
    acc[r] = (acc[r] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Users className="h-6 w-6" />
          Manajemen User
        </h1>
        <p className="text-sm text-muted-foreground">
          {users.length} user terdaftar · lihat detail per role di bawah
        </p>
      </div>

      {/* Role summary */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(ROLE_LABELS).map(([role, label]) => {
          const Icon = ROLE_ICONS[role] ?? Users;
          const count = byRole[role] ?? 0;
          return (
            <Card key={role}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <Icon className="h-8 w-8 text-slate-400" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User list */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Daftar User</CardTitle>
          <CardDescription>
            500 user terakhir yang terdaftar. Klik untuk lihat detail (coming soon).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada user terdaftar
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Nama</th>
                    <th className="px-3 py-2 font-medium">Role</th>
                    <th className="px-3 py-2 font-medium">Industry</th>
                    <th className="px-3 py-2 font-medium">Toko</th>
                    <th className="px-3 py-2 font-medium">Phone</th>
                    <th className="px-3 py-2 font-medium">Daftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => {
                    const Icon = ROLE_ICONS[u.role ?? ""] ?? Users;
                    return (
                      <tr key={u.id} className="hover:bg-muted/40">
                        <td className="px-3 py-2 font-mono text-xs">
                          {u.email}
                        </td>
                        <td className="px-3 py-2">{u.full_name ?? "—"}</td>
                        <td className="px-3 py-2">
                          <Badge variant="outline" className="gap-1">
                            <Icon className="h-3 w-3" />
                            {ROLE_LABELS[(u.role as keyof typeof ROLE_LABELS) ?? "pemilik"] ?? u.role}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">{u.industry ?? "—"}</td>
                        <td className="px-3 py-2 text-xs">
                          {u.client_id ? (
                            <code className="rounded bg-muted px-1 py-0.5">
                              {u.client_id}
                            </code>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs">{u.phone ?? "—"}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString("id-ID")
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        💡 Fitur edit user (ubah role, suspend, hapus) akan ditambah di FASE berikutnya
      </p>
    </div>
  );
}
