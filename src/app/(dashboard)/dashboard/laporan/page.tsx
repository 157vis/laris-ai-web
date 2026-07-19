import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, TrendingUp, Calendar, Download, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatIDR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Laporan",
  description: "Laporan keuangan & analitik toko.",
};

export const dynamic = "force-dynamic";

export default async function LaporanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Hitung ringkasan bulan ini
  const { data: txs } = await supabase
    .from("transactions")
    .select("id, total, payment_method, created_at")
    .eq("user_id", user.id)
    .gte("created_at", firstOfMonth);

  const list = txs ?? [];
  const totalRevenue = list.reduce((s, t) => s + Number(t.total ?? 0), 0);
  const txCount = list.length;
  const avgTx = txCount > 0 ? totalRevenue / txCount : 0;

  // Group by payment method
  const byMethod: Record<string, { count: number; total: number }> = {};
  list.forEach((t) => {
    const m = t.payment_method ?? "tunai";
    if (!byMethod[m]) byMethod[m] = { count: 0, total: 0 };
    byMethod[m].count += 1;
    byMethod[m].total += Number(t.total ?? 0);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Laporan</h1>
        <p className="text-sm text-muted-foreground">
          Periode: {now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Ringkasan bulan ini */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pendapatan</CardDescription>
            <CardTitle className="text-2xl">{formatIDR(totalRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              Bulan ini
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Jumlah Transaksi</CardDescription>
            <CardTitle className="text-2xl">{txCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Sejak 1 {now.toLocaleDateString("id-ID", { month: "short" })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rata-rata Transaksi</CardDescription>
            <CardTitle className="text-2xl">{formatIDR(avgTx)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BarChart3 className="h-3 w-3" />
              Per transaksi
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown metode pembayaran */}
      <Card>
        <CardHeader>
          <CardTitle>Metode Pembayaran</CardTitle>
          <CardDescription>Distribusi bulan ini</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(byMethod).length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Belum ada transaksi bulan ini.
              </p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/dashboard/kas/new">
                  Catat Transaksi <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(byMethod).map(([m, v]) => {
                const pct = totalRevenue > 0 ? (v.total / totalRevenue) * 100 : 0;
                return (
                  <div key={m}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize">{m}</span>
                      <span className="text-muted-foreground">
                        {v.count}× · {formatIDR(v.total)} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-brand-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coming soon cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📊 Laporan Harian</CardTitle>
            <CardDescription>Grafik penjualan 7 / 30 hari ke belakang</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📥 Export CSV / PDF</CardTitle>
            <CardDescription>Download laporan bulanan untuk arsip</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              Segera Hadir
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
