import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight, TrendingUp, Package, ShoppingCart, Receipt, Plus, Mic, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Ringkasan bisnis UMKM Anda hari ini.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-brand-500 to-brand-700 p-6 text-white shadow-lg sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge className="mb-2 bg-white/20 text-white hover:bg-white/30">
              FASE 2 Selesai ✅
            </Badge>
            <h1 className="text-2xl font-bold sm:text-3xl">Selamat Datang di Laris.AI</h1>
            <p className="mt-2 text-sm text-white/90 sm:text-base">
              Landing page publik live di <strong>larisai.my.id</strong>. Lanjut FASE 3 untuk Dashboard Kasir.
            </p>
          </div>
          <Sparkles className="hidden h-12 w-12 shrink-0 text-white/30 sm:block" />
        </div>
      </div>

      {/* Quick action bar (FASE 3 preview) */}
      <Card className="border-brand-200 bg-gradient-to-r from-brand-50 to-emerald-50 dark:border-brand-900/40 dark:from-brand-950/30 dark:to-emerald-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">⚡ Aksi Cepat</CardTitle>
          <CardDescription>Catat transaksi dalam 10 detik via WhatsApp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Button variant="default" size="lg" className="h-auto flex-col gap-1 py-4">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Catat Manual</span>
            </Button>
            <Button variant="outline" size="lg" className="h-auto flex-col gap-1 py-4">
              <Mic className="h-5 w-5" />
              <span className="text-xs">Voice Note</span>
            </Button>
            <Button variant="outline" size="lg" className="h-auto flex-col gap-1 py-4" asChild>
              <Link href="/dashboard/kas">
                <Receipt className="h-5 w-5" />
                <span className="text-xs">Buku Kas</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-auto flex-col gap-1 py-4" asChild>
              <Link href="/dashboard/produk">
                <Package className="h-5 w-5" />
                <span className="text-xs">Stok</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI cards (placeholder untuk FASE 3) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Hari Ini"
          value="Rp 0"
          subtitle="0 transaksi"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KpiCard
          title="Stok Menipis"
          value="0"
          subtitle="produk perlu restock"
          icon={<Package className="h-5 w-5" />}
        />
        <KpiCard
          title="Total Transaksi"
          value="0"
          subtitle="bulan ini"
          icon={<Receipt className="h-5 w-5" />}
        />
        <KpiCard
          title="Pelanggan Aktif"
          value="0"
          subtitle="via WhatsApp"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
      </div>

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
          <RoadmapItem phase={3} status="next" title="Dashboard Kasir" description="Quick action, KPI live, charts" />
          <RoadmapItem phase={4} status="todo" title="Buku Kas + Produk" description="CRUD + barcode scanner" />
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
              <BarChart3 className="h-5 w-5" />
              Mulai FASE 3
            </CardTitle>
            <CardDescription>Dashboard kasir dengan quick action & KPI live</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="default">
              <Link href="/landing">
                Preview Landing Live
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

function KpiCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-6">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">{title}</p>
          <p className="mt-1 text-xl font-bold sm:text-2xl">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
          {icon}
        </div>
      </CardContent>
    </Card>
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
