import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Package,
  Receipt,
  Plus,
  Mic,
  BarChart3,
  Users,
  Bell,
  RefreshCw,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TopProducts } from "@/components/dashboard/top-products";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDashboardStats } from "@/lib/dashboard/queries";
import { formatIDR } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Ringkasan bisnis UMKM Anda hari ini.",
};

// Force dynamic agar data selalu fresh
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Sesi habis. Silakan login ulang.</p>
          <Button asChild className="mt-4">
            <Link href="/login">Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const stats = await getDashboardStats(user.id);
  const userName =
    (user.user_metadata?.full_name as string) ||
    user.email?.split("@")[0] ||
    "Pengguna";

  // Fetch role untuk admin shortcut — pakai service-role client (bypass RLS)
  let userRole: string = "pemilik";
  try {
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    userRole = (profile?.role as string) ?? "pemilik";
  } catch (err) {
    // Fallback ke anon client kalau service-role belum di-set
    console.warn("[dashboard] service-role not available, falling back to anon:", err);
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    userRole = (profile?.role as string) ?? "pemilik";
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-brand-500 to-brand-700 p-6 text-white shadow-lg sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge className="mb-2 border-white/30 bg-white/20 text-white hover:bg-white/30">
              FASE 3: Dashboard Kasir 🚀
            </Badge>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Hai, {userName}! 👋
            </h1>
            <p className="mt-2 text-sm text-white/90 sm:text-base">
              {stats.todayTransactions > 0
                ? `Hari ini ${stats.todayTransactions} transaksi · ${formatIDR(stats.todayRevenue)}`
                : "Belum ada transaksi hari ini. Yuk catat penjualan pertama!"}
            </p>
          </div>
          <Sparkles className="hidden h-12 w-12 shrink-0 text-white/30 sm:block" />
        </div>
      </div>

      {/* Quick action bar */}
      <Card className="border-brand-200 bg-gradient-to-r from-brand-50 to-emerald-50 dark:border-brand-900/40 dark:from-brand-950/30 dark:to-emerald-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">⚡ Aksi Cepat</CardTitle>
          <CardDescription>Catat transaksi dalam 10 detik via WhatsApp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Button asChild size="lg" className="h-auto flex-col gap-1 py-4">
              <a
                href={waLink("Halo Admin Laris.AI, saya mau catat transaksi")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mic className="h-5 w-5" />
                <span className="text-xs">Catat via WA</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-auto flex-col gap-1 py-4">
              <Link href="/dashboard/kas">
                <Plus className="h-5 w-5" />
                <span className="text-xs">Buku Kas</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-auto flex-col gap-1 py-4">
              <Link href="/dashboard/produk">
                <Package className="h-5 w-5" />
                <span className="text-xs">Produk</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-auto flex-col gap-1 py-4">
              <Link href="/dashboard/laporan">
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs">Laporan</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards - LIVE DATA */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Pemasukan Hari Ini"
          value={formatIDR(stats.todayRevenue)}
          subtitle={`${stats.todayTransactions} transaksi`}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="success"
        />
        <KpiCard
          title="Pengeluaran Hari Ini"
          value={formatIDR(stats.todayExpenses)}
          subtitle={stats.todayExpenses > 0 ? "Beban operasional" : "Belum ada"}
          icon={<Package className="h-5 w-5" />}
          variant={stats.todayExpenses > 0 ? "danger" : "default"}
        />
        <KpiCard
          title="Cashflow Net"
          value={formatIDR(stats.netCashflow)}
          subtitle={stats.netCashflow >= 0 ? "Untung hari ini" : "Rugi hari ini"}
          icon={<Receipt className="h-5 w-5" />}
          variant={stats.netCashflow >= 0 ? "success" : "danger"}
        />
        <KpiCard
          title="Stok Menipis"
          value={String(stats.lowStockCount)}
          subtitle="produk perlu restock"
          icon={<Package className="h-5 w-5" />}
          variant={stats.lowStockCount > 0 ? "warning" : "default"}
        />
      </div>

      {/* Secondary KPI row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Pemasukan Bulan Ini"
          value={formatIDR(stats.monthRevenue)}
          subtitle={`${stats.monthTransactions} transaksi`}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="info"
        />
        <KpiCard
          title="Pengeluaran Bulan Ini"
          value={formatIDR(stats.monthExpenses)}
          subtitle="total biaya"
          icon={<Package className="h-5 w-5" />}
          variant="warning"
        />
        <KpiCard
          title="Pelanggan Aktif"
          value={String(stats.activeCustomers)}
          subtitle="30 hari via WA"
          icon={<Users className="h-5 w-5" />}
          variant="default"
        />
      </div>

      {/* Low stock alert */}
      {stats.lowStockCount > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                {stats.lowStockCount} produk stoknya menipis
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-200">
                Segera lakukan restock agar tidak kehabisan saat jam sibuk
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/produk">
                Cek
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chart + Top Products */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={stats.revenueLast7Days} />
        </div>
        <TopProducts products={stats.topProducts} />
      </div>

      {/* Recent transactions */}
      <RecentTransactions transactions={stats.recentTransactions} />

      {/* Refresh indicator */}
      <p className="flex items-center justify-center gap-1 text-center text-xs text-muted-foreground">
        <RefreshCw className="h-3 w-3" />
        Data live dari Supabase · Diperbarui {new Date().toLocaleTimeString("id-ID")}
      </p>

      {/* Quick action — Lanjut FASE 4 */}
      {false && (
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Sparkles className="h-5 w-5" />
              Lanjut FASE 4
            </CardTitle>
            <CardDescription>CRUD buku kas & produk + barcode scanner</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="default">
              <Link href="/dashboard/kas">
                Mulai FASE 4
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Link to admin console (kalau user admin) */}
      {userRole === "admin" && (
        <Card className="border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/30 dark:to-slate-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Shield className="h-5 w-5" />
              Super Admin Console
            </CardTitle>
            <CardDescription>
              Akses khusus admin: lihat semua user, manage database, audit log
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/admin">
                Buka Admin Console
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
