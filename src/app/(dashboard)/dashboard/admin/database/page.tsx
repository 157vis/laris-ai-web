import type { Metadata } from "next";
import {
  Database,
  Table,
  Server,
  HardDrive,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentAdminProfile, getAdminStats, logAdminAction } from "@/lib/admin/rbac";
import { AccessDenied } from "@/components/admin/access-denied";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Database & Setup",
  description: "Schema info, statistik tabel, dan link ke Supabase Dashboard",
};

export const dynamic = "force-dynamic";

const TABLES = [
  { name: "profiles", desc: "User profile + role", critical: true },
  { name: "clients", desc: "Tenant (toko) data + Fonnte token", critical: true },
  { name: "products", desc: "Master produk per user", critical: true },
  { name: "transactions", desc: "Buku kas (pemasukan/pengeluaran)", critical: true },
  { name: "wa_users", desc: "WhatsApp user mapping", critical: false },
  { name: "otak_memories", desc: "AI memory storage", critical: false },
  { name: "admin_audit_log", desc: "Audit trail admin actions", critical: false },
  { name: "roadmap_items", desc: "Roadmap phase tracking", critical: false },
];

export default async function AdminDatabasePage() {
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

  const stats = await getAdminStats();
  await logAdminAction(adminProfile.id, "view_admin_database", "admin_database_page");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const projectRef = supabaseUrl.replace(/^https:\/\//, "").split(".")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Database className="h-6 w-6" />
          Database & Setup
        </h1>
        <p className="text-sm text-muted-foreground">
          Schema info & link langsung ke Supabase Dashboard
        </p>
      </div>

      {/* Project info */}
      <Card className="border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <Server className="h-5 w-5" />
            Supabase Project
          </CardTitle>
          <CardDescription>
            Backend production: <code className="rounded bg-muted px-1">{supabaseUrl}</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="default" size="sm">
              <a
                href={`https://supabase.com/dashboard/project/${projectRef}/editor`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Table className="h-4 w-4" />
                Table Editor
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://supabase.com/dashboard/project/${projectRef}/sql`}
                target="_blank"
                rel="noopener noreferrer"
              >
                SQL Editor
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://supabase.com/dashboard/project/${projectRef}/logs`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Logs
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://supabase.com/dashboard/project/${projectRef}/auth/users`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Auth Users
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Tenants</p>
            <p className="text-2xl font-bold">{stats.totalClients}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Transaksi</p>
            <p className="text-2xl font-bold">{stats.totalTransactions}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Schema Tabel
          </CardTitle>
          <CardDescription>
            8 tabel utama. Klik nama tabel untuk lihat di Supabase Editor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {TABLES.map((t) => (
              <a
                key={t.name}
                href={`https://supabase.com/dashboard/project/${projectRef}/editor/${t.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      {t.name}
                    </code>
                    {t.critical && (
                      <Badge variant="secondary" className="text-xs">
                        Critical
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </div>
                <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-rose-200 bg-rose-50/30 dark:bg-rose-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Aksi destruktif — semua tercatat di audit log
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            🚧 Reset data, drop table, dan force re-seed akan diaktifkan di FASE berikutnya
            dengan double-confirmation modal.
          </p>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        💡 Backup/export database ke JSON/CSV akan ditambah di FASE berikutnya
      </p>
    </div>
  );
}
