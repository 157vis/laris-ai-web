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
  CalendarDays,
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
    <div className="flex flex-col gap-6">
      <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-brand-900 p-6 text-white shadow-lg shadow-brand-900/10 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full border border-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-36 right-24 size-64 rounded-full border border-white/10" aria-hidden="true" />
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-white/15 bg-white/10 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-white/10">
                <Sparkles className="mr-1.5 size-3" />
                Ringkasan usaha
              </Badge>
              <span className="flex items-center gap-1.5 text-xs font-medium text-white/70">
                <CalendarDays className="size-3.5" />
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Halo, {userName}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {stats.todayTransactions > 0
                ? `Hari ini ada ${stats.todayTransactions} transaksi. Berikut ringkasan yang membantu Anda menjaga usaha tetap lancar.`
                : "Belum ada transaksi hari ini. Mulai catat penjualan agar perkembangan usaha terlihat jelas."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="rounded-xl px-4 font-semibold">
                <Link href="/dashboard/kas/new">
                  <Plus data-icon="inline-start" />
                  Catat transaksi
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-white/20 bg-white/5 px-4 text-white hover:bg-white/10 hover:text-white">
                <a
                  href={waLink("Halo Admin Laris.AI, saya mau catat transaksi")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mic data-icon="inline-start" />
                  Catat via WhatsApp
                </a>
              </Button>
            </div>
          </div>
          <div className="w-full rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm xl:max-w-xs">
            <p className="text-xs font-medium text-white/70">Pemasukan hari ini</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{formatIDR(stats.todayRevenue)}</p>
            <div className="mt-4 flex items-center gap-2 border-t border-white/15 pt-3 text-xs text-white/75">
              <span className="flex size-6 items-center justify-center rounded-full bg-white/10">
                <Receipt className="size-3.5" />
              </span>
              {stats.todayTransactions} transaksi tercatat
            </div>
          </div>
        </div>
      </section>

      <Card className="rounded-2xl border-border/70 shadow-none">
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            <Sparkles className="size-5" />
          </span>
          <div>
            <CardTitle className="text-base">Akses cepat</CardTitle>
            <CardDescription className="mt-1">Buka fitur yang paling sering Anda gunakan</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <Button asChild variant="outline" className="h-auto min-h-[72px] justify-start gap-3 rounded-xl border-border/70 bg-background p-3 text-left shadow-none hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 sm:p-4">
              <Link href="/dashboard/kas">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"><Plus className="size-5" /></span>
                <span><span className="block text-sm font-semibold">Buku kas</span><span className="mt-0.5 block text-xs font-normal text-muted-foreground">Pemasukan & pengeluaran</span></span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto min-h-[72px] justify-start gap-3 rounded-xl border-border/70 bg-background p-3 text-left shadow-none hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 sm:p-4">
              <Link href="/dashboard/produk">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"><Package className="size-5" /></span>
                <span><span className="block text-sm font-semibold">Produk & stok</span><span className="mt-0.5 block text-xs font-normal text-muted-foreground">Pantau persediaan</span></span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto min-h-[72px] justify-start gap-3 rounded-xl border-border/70 bg-background p-3 text-left shadow-none hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 sm:p-4">
              <Link href="/dashboard/laporan">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"><BarChart3 className="size-5" /></span>
                <span><span className="block text-sm font-semibold">Laporan usaha</span><span className="mt-0.5 block text-xs font-normal text-muted-foreground">Lihat tren keuangan</span></span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto min-h-[72px] justify-start gap-3 rounded-xl border-border/70 bg-background p-3 text-left shadow-none hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 sm:p-4">
              <Link href="/dashboard/ai-chat">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"><Sparkles className="size-5" /></span>
                <span><span className="block text-sm font-semibold">Asisten AI</span><span className="mt-0.5 block text-xs font-normal text-muted-foreground">Tanya seputar usaha</span></span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <section aria-labelledby="today-summary" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Pantauan harian</p>
            <h2 id="today-summary" className="mt-1 text-lg font-bold tracking-tight">Ringkasan hari ini</h2>
          </div>
          <p className="text-xs text-muted-foreground">Angka diperbarui langsung</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Pemasukan hari ini"
            value={formatIDR(stats.todayRevenue)}
            subtitle={`${stats.todayTransactions} transaksi`}
            icon={<TrendingUp className="size-5" />}
            variant="success"
          />
          <KpiCard
            title="Pengeluaran hari ini"
            value={formatIDR(stats.todayExpenses)}
            subtitle={stats.todayExpenses > 0 ? "Beban operasional" : "Belum ada pengeluaran"}
            icon={<Package className="size-5" />}
            variant={stats.todayExpenses > 0 ? "danger" : "default"}
          />
          <KpiCard
            title="Arus kas bersih"
            value={formatIDR(stats.netCashflow)}
            subtitle={stats.netCashflow >= 0 ? "Positif hari ini" : "Perlu diperhatikan"}
            icon={<Receipt className="size-5" />}
            variant={stats.netCashflow >= 0 ? "success" : "danger"}
          />
          <KpiCard
            title="Stok menipis"
            value={String(stats.lowStockCount)}
            subtitle="produk perlu restock"
            icon={<Package className="size-5" />}
            variant={stats.lowStockCount > 0 ? "warning" : "default"}
          />
        </div>
      </section>

      <section aria-labelledby="month-summary" className="flex flex-col gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Performa usaha</p>
          <h2 id="month-summary" className="mt-1 text-lg font-bold tracking-tight">Bulan ini</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <KpiCard
            title="Pemasukan bulan ini"
            value={formatIDR(stats.monthRevenue)}
            subtitle={`${stats.monthTransactions} transaksi`}
            icon={<TrendingUp className="size-5" />}
            variant="info"
          />
          <KpiCard
            title="Pengeluaran bulan ini"
            value={formatIDR(stats.monthExpenses)}
            subtitle="Total biaya operasional"
            icon={<Package className="size-5" />}
            variant="warning"
          />
          <KpiCard
            title="Pelanggan aktif"
            value={String(stats.activeCustomers)}
            subtitle="Aktif dalam 30 hari via WhatsApp"
            icon={<Users className="size-5" />}
            variant="default"
          />
        </div>
      </section>

      {/* Low stock alert */}
      {stats.lowStockCount > 0 && (
        <Card className="rounded-2xl border-amber-200/80 bg-amber-50/70 shadow-none dark:border-amber-900/50 dark:bg-amber-950/20">
          <CardContent className="flex flex-wrap items-center gap-3 p-4 sm:p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              <Bell className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-950 dark:text-amber-100">
                {stats.lowStockCount} produk perlu segera diisi ulang
              </p>
              <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-200">
                Cek stok sebelum jam ramai agar penjualan tetap lancar.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-lg border-amber-300 bg-transparent text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-100 dark:hover:bg-amber-900/40">
              <Link href="/dashboard/produk">
                Cek stok
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <section aria-label="Performa penjualan" className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RevenueChart data={stats.revenueLast7Days} />
        </div>
        <div className="xl:col-span-2">
          <TopProducts products={stats.topProducts} />
        </div>
      </section>

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

      {userRole === "admin" && (
        <Card className="rounded-2xl border-brand-200/80 bg-brand-50/60 shadow-none dark:border-brand-900/50 dark:bg-brand-950/20">
          <CardHeader className="flex flex-row items-start gap-3 pb-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white">
              <Shield className="size-5" />
            </span>
            <div>
              <CardTitle className="text-base">Pusat admin</CardTitle>
              <CardDescription className="mt-1">
                Kelola pengguna, data usaha, dan operasional platform.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild variant="outline" className="w-full rounded-xl border-brand-300 bg-background hover:bg-brand-100 dark:border-brand-800 dark:hover:bg-brand-900/40">
              <Link href="/dashboard/admin">
                Buka pusat admin
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
