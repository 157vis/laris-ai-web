import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Receipt, Search, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { formatIDR, timeAgo } from "@/lib/dashboard/queries";
import { deleteTransaction } from "@/lib/dashboard/actions";
import { DeleteButton } from "@/components/dashboard/delete-button";

export const metadata: Metadata = {
  title: "Buku Kas",
  description: "Daftar transaksi penjualan warung Anda.",
};

export const dynamic = "force-dynamic";

type Tx = {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  total: number;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  transaction_items: { id: string }[];
};

const PAYMENT_LABEL: Record<string, string> = {
  tunai: "💵 Tunai",
  qris: "📱 QRIS",
  transfer: "🏦 Transfer",
  kredit: "📝 Kredit",
};

export default async function KasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, customer_name, customer_phone, total, payment_method, notes, created_at, transaction_items(id)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const list = (transactions ?? []) as Tx[];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const todayRev = list
    .filter((t) => new Date(t.created_at) >= today)
    .reduce((s, t) => s + (t.total ?? 0), 0);
  const monthRev = list
    .filter((t) => new Date(t.created_at) >= monthStart)
    .reduce((s, t) => s + (t.total ?? 0), 0);
  const monthCount = list.filter((t) => new Date(t.created_at) >= monthStart).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">💰 Buku Kas</h1>
          <p className="text-sm text-muted-foreground">Catat dan kelola transaksi penjualan Anda</p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/kas/new">
            <Plus className="h-4 w-4" />
            Catat Transaksi
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Hari Ini</p>
              <p className="text-xl font-bold">{formatIDR(todayRev)}</p>
            </div>
            <Receipt className="h-8 w-8 text-brand-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Bulan Ini</p>
              <p className="text-xl font-bold">{formatIDR(monthRev)}</p>
            </div>
            <Calendar className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Jumlah Transaksi</p>
              <p className="text-xl font-bold">{monthCount}</p>
              <p className="text-xs text-muted-foreground">bulan ini</p>
            </div>
            <ArrowRight className="h-8 w-8 text-sky-500" />
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaksi</CardTitle>
          <CardDescription>100 transaksi terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y">
              {list.map((t) => {
                const items = Array.isArray(t.transaction_items) ? t.transaction_items : [];
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <Link href={`/dashboard/kas/${t.id}`} className="flex flex-1 min-w-0 items-center gap-3 hover:opacity-80">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                        <Receipt className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {t.customer_name || "Pelanggan"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{items.length} item</span>
                          <span>·</span>
                          <Badge variant="outline" className="text-[10px]">
                            {PAYMENT_LABEL[t.payment_method ?? "tunai"] ?? t.payment_method}
                          </Badge>
                          <span>·</span>
                          <span>{timeAgo(t.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      <p className="shrink-0 text-sm font-bold">{formatIDR(t.total ?? 0)}</p>
                      <DeleteButton
                        id={t.id}
                        name={`Transaksi ${formatIDR(t.total ?? 0)}`}
                        deleteAction={deleteTransaction}
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
        <p className="text-sm text-muted-foreground">Catat transaksi pertama Anda untuk mulai berjualan</p>
      </div>
      <Button asChild>
        <Link href="/dashboard/kas/new">
          <Plus className="h-4 w-4" />
          Catat Transaksi Pertama
        </Link>
      </Button>
    </div>
  );
}
