import type { Metadata } from "next";
import Link from "next/link";
import {Plus, Receipt, Calendar, ArrowRight, ArrowUpRight, ArrowDownRight} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { createClient } from "@/lib/supabase/server";
import { formatIDR, timeAgo } from "@/lib/format";
import { deleteTransaction } from "@/lib/dashboard/actions";
import { DeleteButton } from "@/components/dashboard/delete-button";

export const metadata: Metadata = {
  title: "Buku Kas",
  description: "Daftar transaksi penjualan & pengeluaran warung Anda.",
};

export const dynamic = "force-dynamic";

type Tx = {
  id: string;
  date: string; // 'YYYY-MM-DD HH:MM'
  type: "Pemasukan" | "Pengeluaran";
  amount: number;
  category: string | null;
  note: string | null;
  receipt_no: string | null;
  running_balance: number | null;
  is_prive: boolean;
};

function parseTxDate(dateStr: string): Date {
  return new Date(dateStr.replace(" ", "T"));
}

export default async function KasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, date, type, amount, category, note, receipt_no, running_balance, is_prive")
    .eq("user_id", user.id)
    .order("id", { ascending: false })
    .limit(100);

  const list = (transactions ?? []) as Tx[];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  // Hitung statistik (filter di JS karena date TEXT)
  const todayTx = list.filter((t) => parseTxDate(t.date) >= today);
  const monthTx = list.filter((t) => parseTxDate(t.date) >= monthStart);

  const todayRev = todayTx
    .filter((t) => t.type === "Pemasukan")
    .reduce((s, t) => s + (t.amount ?? 0), 0);
  const todayExp = todayTx
    .filter((t) => t.type === "Pengeluaran")
    .reduce((s, t) => s + (t.amount ?? 0), 0);
  const monthRev = monthTx
    .filter((t) => t.type === "Pemasukan")
    .reduce((s, t) => s + (t.amount ?? 0), 0);
  const monthExp = monthTx
    .filter((t) => t.type === "Pengeluaran")
    .reduce((s, t) => s + (t.amount ?? 0), 0);
  const monthCount = monthTx.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">💰 Buku Kas</h1>
          <p className="text-sm text-muted-foreground">Catat dan kelola transaksi penjualan & pengeluaran</p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/kas/new">
            <Plus className="h-4 w-4" />
            Catat Transaksi
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Pemasukan Hari Ini</p>
              <p className="text-xl font-bold text-emerald-600">{formatIDR(todayRev)}</p>
            </div>
            <ArrowUpRight className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Pengeluaran Hari Ini</p>
              <p className="text-xl font-bold text-rose-600">{formatIDR(todayExp)}</p>
            </div>
            <ArrowDownRight className="h-8 w-8 text-rose-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Pemasukan Bulan Ini</p>
              <p className="text-xl font-bold text-emerald-600">{formatIDR(monthRev)}</p>
            </div>
            <Calendar className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Pengeluaran Bulan Ini</p>
              <p className="text-xl font-bold text-rose-600">{formatIDR(monthExp)}</p>
            </div>
            <Calendar className="h-8 w-8 text-rose-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Transaksi Bulan Ini</p>
              <p className="text-xl font-bold">{monthCount}</p>
            </div>
            <Receipt className="h-8 w-8 text-brand-500" />
          </CardContent>
        </Card>
      </div>

      {/* Transaction list */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
          <CardDescription>
            100 transaksi terakhir. Klik untuk detail, atau gunakan tombol hapus.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2">
              {list.map((t) => {
                const isIncome = t.type === "Pemasukan";
                return (
                  <div
                    key={t.id}
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          isIncome
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {t.note || t.category || "Transaksi"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.category && t.category !== t.note ? `${t.category} · ` : ""}
                          {t.receipt_no ? `${t.receipt_no} · ` : ""}
                          {timeAgo(t.date)}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge variant={isIncome ? "default" : "destructive"}>
                            {t.type}
                          </Badge>
                          {t.is_prive && (
                            <Badge variant="outline" className="text-xs">Prive</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            isIncome
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatIDR(t.amount)}
                        </p>
                        {t.running_balance != null && (
                          <p className="text-xs text-muted-foreground">
                            Saldo: {formatIDR(t.running_balance)}
                          </p>
                        )}
                      </div>
                      <Button asChild variant="outline" size="icon">
                        <Link href={`/dashboard/kas/${t.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton
                        id={String(t.id)}
                        name={t.note || t.category || `Transaksi ${t.id}`}
                        deleteAction={deleteTransaction}
                        redirectTo="/dashboard/kas"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Receipt className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold">Belum ada transaksi</p>
        <p className="text-sm text-muted-foreground">
          Mulai catat transaksi pertama Anda via WhatsApp atau form di bawah
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/kas/new">
          <Plus className="h-4 w-4" />
          Catat Transaksi
        </Link>
      </Button>
    </div>
  );
}
