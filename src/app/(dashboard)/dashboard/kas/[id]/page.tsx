import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Receipt, Tag, Calendar, FileText, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatIDR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Detail Transaksi",
  description: "Detail lengkap transaksi.",
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function KasDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Ambil transaction utama (skema real)
  const { data: tx } = await supabase
    .from("transactions")
    .select("id, date, type, amount, category, note, receipt_no, running_balance, is_prive, user_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!tx) notFound();

  const isIncome = tx.type === "Pemasukan";

  // Format date 'YYYY-MM-DD HH:MM' → readable
  const dateObj = new Date(tx.date.replace(" ", "T"));
  const dateFormatted = dateObj.toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/kas">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Buku Kas
          </Link>
        </Button>
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4" />
          Cetak Struk
        </Button>
      </div>

      {/* Success banner */}
      <div
        className={`rounded-2xl p-6 text-white shadow-lg ${
          isIncome
            ? "bg-gradient-to-br from-emerald-500 to-brand-600"
            : "bg-gradient-to-br from-rose-500 to-orange-500"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Receipt className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-white/90">
              Transaksi {isIncome ? "Pemasukan" : "Pengeluaran"} {tx.is_prive && "· Prive"}
            </p>
            <p className="text-2xl font-bold">
              {isIncome ? "+" : "-"}
              {formatIDR(tx.amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{dateFormatted}</span>
          </div>
          {tx.receipt_no && (
            <div className="flex items-center gap-3 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono">{tx.receipt_no}</span>
            </div>
          )}
          {tx.category && (
            <div className="flex items-center gap-3 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">{tx.category}</Badge>
            </div>
          )}
          {tx.note && (
            <div className="rounded-lg border bg-muted/50 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Catatan:</p>
              <p>{tx.note}</p>
            </div>
          )}
          {tx.running_balance != null && (
            <div className="rounded-lg border border-brand-200 bg-brand-50/50 p-3 text-sm dark:bg-brand-950/20">
              <p className="text-xs text-muted-foreground">Saldo setelah transaksi:</p>
              <p className="text-lg font-bold text-brand-700 dark:text-brand-300">
                {formatIDR(tx.running_balance)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Catatan: Tabel transaction_items TIDAK ADA di Supabase, jadi info item
          ada di tx.note (gabungan nama + qty) dan tx.category (kategori). */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Item</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            ℹ️ Skema Supabase saat ini menggunakan format single-row (1 transaksi = 1 item utama).
            Detail lengkap nama item, qty, dan harga ada di:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <strong>Catatan:</strong> {tx.note || "(kosong)"}
            </li>
            <li>
              <strong>Kategori:</strong> {tx.category || "(kosong)"}
            </li>
            <li>
              <strong>Total Nominal:</strong> {formatIDR(tx.amount)}
            </li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            💡 Multi-item per transaksi akan didukung setelah tabel{" "}
            <code className="rounded bg-muted px-1 py-0.5">transaction_items</code> dibuat.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
