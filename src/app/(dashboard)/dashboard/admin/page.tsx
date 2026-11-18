import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Users,
  Database,
  Map,
  ArrowRight,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { getCurrentAdminProfile, getAdminStats } from "@/lib/admin/rbac";
import { AccessDenied } from "@/components/admin/access-denied";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Super Admin Console",
  description: "Kelola user, tenant, dan sistem Laris.AI.",
};

export const dynamic = "force-dynamic";

export default async function AdminConsolePage() {
  const adminProfile = await getCurrentAdminProfile();

  // Render AccessDenied kalau user bukan admin (lebih baik dari silent redirect)
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

  const adminCards = [
    {
      href: "/dashboard/admin/users",
      icon: Users,
      title: "Manajemen User",
      description: "Lihat semua user terdaftar & ubah role",
      count: stats.totalUsers,
      color: "from-blue-500 to-blue-600",
    },
    {
      href: "/dashboard/admin/database",
      icon: Database,
      title: "Database & Setup",
      description: "Schema info, sample data, backup & reset",
      count: `${stats.totalClients} tenants`,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      href: "/dashboard/admin/roadmap",
      icon: Map,
      title: "Roadmap",
      description: "Kelola fase pengembangan (1-7)",
      count: "7 fase",
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-brand-900 p-6 text-white shadow-lg shadow-brand-900/10 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full border border-white/10" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              <Shield className="size-4" />
              Ruang administrator
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Selamat datang, {adminProfile.fullName}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
              Pantau pengguna, data usaha, dan operasional platform dari satu tempat.
            </p>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs text-white/80">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>Aksi admin tercatat di audit log.</span>
          </div>
        </div>
      </section>

      <section aria-label="Statistik platform" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total pengguna" value={String(stats.totalUsers)} icon={<Users className="size-5" />} variant="info" />
        <KpiCard title="Total toko" value={String(stats.totalClients)} icon={<Database className="size-5" />} variant="success" />
        <KpiCard title="Total produk" value={String(stats.totalProducts)} icon={<Activity className="size-5" />} variant="warning" />
        <KpiCard title="Total transaksi" value={String(stats.totalTransactions)} icon={<Activity className="size-5" />} variant="default" />
      </section>

      {/* User role breakdown */}
      {Object.keys(stats.usersByRole).length > 0 && (
        <Card className="rounded-2xl border-border/70 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-brand-700 dark:text-brand-300" />
              Pengguna berdasarkan peran
            </CardTitle>
            <CardDescription>Komposisi akun di seluruh platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Object.entries(stats.usersByRole).map(([role, count]) => (
                <div key={role} className="rounded-xl border border-border/60 bg-muted/25 p-4">
                  <p className="text-xs font-medium capitalize text-muted-foreground">{role.replace(/_/g, " ")}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-bold tracking-tight">Peralatan admin</h2>
        <p className="mt-1 text-sm text-muted-foreground">Kelola platform dengan aktivitas yang tercatat.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adminCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.href} className="overflow-hidden rounded-2xl border-border/70 shadow-none transition-shadow hover:shadow-md">
              <div className={`h-1 bg-gradient-to-r ${card.color}`} aria-hidden="true" />
              <CardHeader className="pb-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                  <Icon className="size-5" />
                </span>
                <CardTitle className="pt-2 text-base">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm font-semibold text-muted-foreground">{card.count}</p>
                <Button asChild variant="outline" className="w-full rounded-xl">
                  <Link href={card.href}>
                    Buka pengelolaan
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
