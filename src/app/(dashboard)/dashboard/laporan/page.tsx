import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download, ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatIDR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Laporan",
  description: "Laporan keuangan & analitik toko.",
};

export const dynamic = "force-dynamic";

type Tx = {
  id: string;
  date: string;
  type: "Pemasukan" | "Pengeluaran";
  amount: number;
  category: string | null;
  note: string | null;
  receipt_no: string | null;
};

export default async function LaporanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Ambil semua transaksi user (limit 2000 untuk full month + history)
  const { data: txs } = await supabase
    .from("transactions")
    .select("id, date, type, amount, category, note, receipt_no")
    .eq("user_id", user.id)
    .order("id", { ascending: false })
    .limit(2000);

  const list = (txs ?? []) as Tx[];

  // Filter bulan ini (date TEXT 'YYYY-MM-DD HH:MM')
  const now = new Date();
  const yyyymm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthList = list.filter((t) => t.date.startsWith(yyyymm));

  // Hitung ringkasan bulan ini
  const monthIn = monthList
    .filter((t) => t.type === "Pemasukan")
    .reduce((s, t) => s + Number(t.amount ?? 0), 0);
  const monthOut = monthList
    .filter((t) => t.type === "Pengeluaran")
    .reduce((s, t) => s + Number(t.amount ?? 0), 0);
  const monthNet = monthIn - monthOut;
  const txCount = monthList.length;
  const avgTx = monthList.filter((t) => t.type === "Pemasukan").length > 0
    ? monthIn / monthList.filter((t) => t.type === "Pemasukan").length
    : 0;

  // Group by category
  const byCategory: Record<string, { count: number; total: number; type: string }> = {};
  monthList.forEach((t) => {
    const c = t.category || "(Tanpa kategori)";
    if (!byCategory[c]) byCategory[c] = { count: 0, total: 0, type: t.type };
    byCategory[c].count += 1;
    byCategory[c].total += Number(t.amount ?? 0);
  });
  const categoryList = Object.entries(byCategory)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">📊 Laporan</h1>
        <p className="text-sm text-muted-foreground">
          Periode: {now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Ringkasan bulan ini */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              Total Pemasukan
            </CardDescription>
            <CardTitle className="text-2xl text-emerald-600">
              {formatIDR(monthIn)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {monthList.filter((t) => t.type === "Pemasukan").length} transaksi
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3" />
              Total Pengeluaran
            </CardDescription>
            <CardTitle className="text-2xl text-rose-600">
              {formatIDR(monthOut)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {monthList.filter((t) => t.type === "Pengeluaran").length} transaksi
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Cashflow Net
            </CardDescription>
            <CardTitle
              className={`text-2xl ${
                monthNet >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {formatIDR(monthNet)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {monthNet >= 0 ? "Untung bulan ini" : "Rugi bulan ini"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Rata-rata Transaksi
            </CardDescription>
            <CardTitle className="text-2xl">{formatIDR(avgTx)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            per transaksi pemasukan
          </CardContent>
        </Card>
      </div>

      {/* Breakdown by category */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Top Kategori Bulan Ini</CardTitle>
          <CardDescription>10 kategori dengan nominal terbesar</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryList.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada transaksi bulan ini
            </p>
          ) : (
            <div className="space-y-2">
              {categoryList.map(([name, data]) => {
                const max = categoryList[0][1].total;
                const pct = (data.total / max) * 100;
                const isIncome = data.type === "Pemasukan";
                return (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant={isIncome ? "default" : "destructive"}>
                          {isIncome ? "💰" : "💸"} {name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {data.count} tx
                        </span>
                      </div>
                      <span className="font-semibold">{formatIDR(data.total)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full ${
                          isIncome ? "bg-emerald-500" : "bg-rose-500"
                        }`}
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

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>📦 Cek Stok Produk</CardTitle>
            <CardDescription>Lihat inventaris &amp; produk yang perlu restock</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/produk">
                Buka Halaman Produk
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>💰 Detail Buku Kas</CardTitle>
            <CardDescription>Lihat semua transaksi bulan ini</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/kas">
                Buka Buku Kas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        💡 Untuk export PDF/Excel, gunakan fitur download di Supabase Dashboard
      </p>
    </div>
  );
}
