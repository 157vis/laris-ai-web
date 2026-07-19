import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Package,
  ShoppingCart,
  Receipt,
  Plus,
  Mic,
  BarChart3,
  Users,
  Bell,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TopProducts } from "@/components/dashboard/top-products";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, formatIDR } from "@/lib/dashboard/queries";
import { waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Ringkasan bisnis UMKM Anda hari ini.",
};

// Force dynamic agar data selalu fresh
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  // Get current user
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

  // Fetch stats
  const stats = await getDashboardStats(user.id);
  const userName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "Pengguna";

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
              <a href={waLink("Halo Admin Laris.AI, saya mau catat transaksi")} target="_blank" rel="noopener noreferrer">
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
          title="Hari Ini"
          value={formatIDR(stats.todayRevenue)}
          subtitle={`${stats.todayTransactions} transaksi`}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="success"
        />
        <KpiCard
          title="Stok Menipis"
          value={String(stats.lowStockCount)}
          subtitle="produk perlu restock"
          icon={<Package className="h-5 w-5" />}
          variant={stats.lowStockCount > 0 ? "warning" : "default"}
        />
        <KpiCard
          title="Total Transaksi"
          value={String(stats.monthTransactions)}
          subtitle="bulan ini"
          icon={<Receipt className="h-5 w-5" />}
          variant="info"
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

      {/* Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>🗺️ Roadmap 7 Fase</CardTitle>
          <CardDescription>
            Progress migrasi Streamlit → Next.js PWA. Klik untuk lihat detail fase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <RoadmapItem phase={1} status="done" title="Foundation" description="Auth, RBAC, layout, settings" />
          <RoadmapItem phase={2} status="done" title="Landing Page" description="Hero, pricing, SEO publik, sitemap, JSON-LD" />
          <RoadmapItem phase={3} status="done" title="Dashboard Kasir" description="KPI live, chart 7 hari, top produk, recent tx ✅" />
          <RoadmapItem phase={4} status="next" title="Buku Kas + Produk" description="CRUD + barcode scanner" />
          <RoadmapItem phase={5} status="todo" title="AI Chat + Print" description="Streaming chat + struk thermal" />
          <RoadmapItem phase={6} status="todo" title="Laporan + Settings" description="Charts + PDF export" />
          <RoadmapItem phase={7} status="todo" title="PWA + Production" description="Install + push notification" />
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle>⚙️ Setup Supabase</CardTitle>
            <CardDescription>
              Initial data toko_rafih sudah di-seed. Tambah produk baru di sini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <a
                href="https://supabase.com/dashboard/project/tagyexrsuvogrlhcthcp/editor"
                target="_blank"
                rel="noopener noreferrer"
              >
                Buka Supabase Editor
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RoadmapItem({
  phase,
  status,
  title,
  description,
}: {
  phase: number;
  status: "done" | "next" | "todo";
  title: string;
  description: string;
}) {
  const styles = {
    done: "bg-emerald-100 text-emerald-700 border-emerald-200",
    next: "bg-amber-100 text-amber-700 border-amber-200",
    todo: "bg-muted text-muted-foreground border-border",
  };
  const labels = {
    done: "✅ Selesai",
    next: "⏭️ Berikutnya",
    todo: "📋 Belum",
  };
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${styles[status]}`}
      >
        {phase}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold">{title}</p>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
            {labels[status]}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
