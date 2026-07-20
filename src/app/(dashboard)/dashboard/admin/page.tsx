import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Users,
  Database,
  Map,
  ArrowRight,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAdmin, getAdminStats } from "@/lib/admin/rbac";

export const metadata: Metadata = {
  title: "Super Admin Console",
  description: "Kelola user, tenant, dan sistem Laris.AI.",
};

export const dynamic = "force-dynamic";

export default async function AdminConsolePage() {
  const admin = await requireAdmin();
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
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-white/80">Selamat datang, Super Admin</p>
            <p className="text-2xl font-bold">{admin.fullName}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-white/70">
          ⚠️ Halaman ini hanya untuk admin. Semua aksi tercatat di audit log.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Total User</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Toko</p>
              <p className="text-2xl font-bold">{stats.totalClients}</p>
            </div>
            <Database className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Produk</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <Activity className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Transaksi</p>
              <p className="text-2xl font-bold">{stats.totalTransactions}</p>
            </div>
            <Activity className="h-8 w-8 text-rose-500" />
          </CardContent>
        </Card>
      </div>

      {/* User role breakdown */}
      {Object.keys(stats.usersByRole).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 User by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(stats.usersByRole).map(([role, count]) => (
                <div
                  key={role}
                  className="rounded-lg border bg-muted/30 p-3"
                >
                  <p className="text-xs text-muted-foreground">{role}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin tools */}
      <div>
        <h2 className="text-lg font-semibold">🛠️ Admin Tools</h2>
        <p className="text-sm text-muted-foreground">
          Aksi sensitif — tercatat di audit log
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.href} className="overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${card.color}`} />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-5 w-5" />
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm font-semibold">{card.count}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={card.href}>
                    Buka
                    <ArrowRight className="h-4 w-4" />
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
