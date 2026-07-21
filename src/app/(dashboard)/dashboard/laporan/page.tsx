import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Calendar, ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatIDR } from "@/lib/format";
import { getFullReport, type FullReportRow } from "@/lib/laporan/queries";
import { computeSummary, type ReportRow } from "@/lib/laporan/export";
import { ExportButtons } from "@/components/laporan/export-buttons";
import { PiutangTable } from "@/components/laporan/piutang-table";

export const metadata: Metadata = {
  title: "Laporan",
  description: "Laporan keuangan komprehensif — export CSV/Markdown untuk AI.",
};

export const dynamic = "force-dynamic";

export default async function LaporanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Ambil client_id dari profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("client_id, full_name")
    .eq("id", user.id)
    .maybeSingle();
  const clientId = profile?.client_id ?? null;

  // Pakai view komprehensif (v_full_report) — 1 query ambil semua data + aging
  const reportRows: FullReportRow[] = clientId
    ? await getFullReport({ clientId })
    : [];

  // Filter bulan ini
  const now = new Date();
  const yyyymm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthRows = reportRows.filter((t) => t.date?.startsWith(yyyymm));

  // Hitung ringkasan bulan ini
  const monthIn = monthRows
    .filter((t) => t.type === "Pemasukan")
    .reduce((s, t) => s + Number(t.amount ?? 0), 0);
  const monthOut = monthRows
    .filter((t) => t.type === "Pengeluaran")
    .reduce((s, t) => s + Number(t.amount ?? 0), 0);
  const monthNet = monthIn - monthOut;
  const avgTx =
    monthRows.filter((t) => t.type === "Pemasukan").length > 0
      ? monthIn / monthRows.filter((t) => t.type === "Pemasukan").length
      : 0;

  // Group by category
  const byCategoryMap: Record<
    string,
    { count: number; total: number; type: "Pemasukan" | "Pengeluaran" }
  > = {};
  for (const t of monthRows) {
    const cat = t.category ?? "Tanpa Kategori";
    const key = `${t.type}|${cat}`;
    if (!byCategoryMap[key]) {
      byCategoryMap[key] = { count: 0, total: 0, type: t.type };
    }
    byCategoryMap[key].count += 1;
    byCategoryMap[key].total += Number(t.amount ?? 0);
  }
  const byCategory = Object.values(byCategoryMap).sort((a, b) => b.total - a.total);

  // Convert reportRows → ReportRow format untuk ExportButtons
  const exportRows: ReportRow[] = reportRows.map((r) => ({
    date: r.date,
    type: r.type,
    category: r.category,
    amount: Number(r.amount ?? 0),
    amount_paid: r.amount_paid,
    amount_remaining: Number(r.amount_remaining ?? 0),
    customer_name: r.customer_name,
    customer_phone: r.customer_phone,
    due_date: r.due_date,
    piutang_status: r.piutang_status,
    days_overdue: r.days_overdue,
    aging_bucket: r.aging_bucket,
    note: r.note,
    receipt_no: r.receipt_no,
  }));

  // Compute summary untuk export
  const monthStartDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const todayDate = now.toISOString().slice(0, 10);
  const summary = computeSummary(exportRows, {
    start: monthStartDate,
    end: todayDate,
  });

  // Ambil client name
  const { data: client } = clientId
    ? await supabase
        .from("clients")
        .select("name")
        .eq("client_id", clientId)
        .maybeSingle()
    : { data: null };

  const displayName = client?.name ?? profile?.full_name ?? "Toko Saya";

  // Piutang summary
  const piutangUnpaid = reportRows
    .filter((r) => r.piutang_status && r.piutang_status !== "paid")
    .reduce((s, r) => s + Number(r.amount_remaining ?? 0), 0);
  const piutangOverdue = reportRows.filter((r) => (r.days_overdue ?? 0) > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <TrendingUp className="h-6 w-6" />
          Laporan Keuangan
        </h1>
        <p className="text-sm text-muted-foreground">
          {displayName} · {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI Cards bulan ini */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pemasukan Bulan Ini</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatIDR(monthIn)}</div>
            <p className="text-xs text-muted-foreground">
              {monthRows.filter((t) => t.type === "Pemasukan").length} transaksi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengeluaran Bulan Ini</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{formatIDR(monthOut)}</div>
            <p className="text-xs text-muted-foreground">
              {monthRows.filter((t) => t.type === "Pengeluaran").length} transaksi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cashflow</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthNet >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {formatIDR(monthNet)}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthNet >= 0 ? "Untung" : "Rugi"}
            </p>
          </CardContent>
        </Card>
        <Card className={piutangUnpaid > 0 ? "border-amber-300 bg-amber-50/30" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Piutang Aktif</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatIDR(piutangUnpaid)}</div>
            <p className="text-xs text-muted-foreground">
              {piutangOverdue > 0
                ? `${piutangOverdue} lewat jatuh tempo`
                : "Belum ada overdue"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Piutang Section (NEW) */}
      <PiutangTable rows={reportRows} />

      {/* Export Laporan (NEW) */}
      <ExportButtons rows={exportRows} summary={summary} clientName={displayName} />

      {/* Per Kategori (existing) */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Per Kategori (Bulan Ini)</CardTitle>
          <CardDescription>Pengelompokan transaksi bulan berjalan</CardDescription>
        </CardHeader>
        <CardContent>
          {byCategory.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              Belum ada transaksi bulan ini
            </p>
          ) : (
            <div className="space-y-3">
              {byCategory.map((data) => {
                const isIncome = data.type === "Pemasukan";
                const maxTotal = byCategory[0]?.total ?? 1;
                const pct = Math.max(5, Math.round((data.total / maxTotal) * 100));
                return (
                  <div key={`${data.type}-${data.category}`} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant={isIncome ? "default" : "destructive"}>
                          {isIncome ? "💰" : "💸"} {data.category}
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
        💡 Tip: Pakai <strong>Export Markdown</strong> lalu paste ke ChatGPT/Claude untuk
        tanya insight bisnis: "Analisis laporan saya, apa yang perlu diperbaiki?"
      </p>
    </div>
  );
}
