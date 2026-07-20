import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, ArrowRight, ArrowUpRight, ArrowDownRight, Tag } from "lucide-react";
import { formatIDR, timeAgo } from "@/lib/format";

type Transaction = {
  id: string;
  note: string | null;
  category: string | null;
  type: "Pemasukan" | "Pengeluaran";
  amount: number;
  date: string;
};

/**
 * Daftar transaksi terakhir — Recent activity feed.
 * ADAPTASI SKEMA: pakai 'note' (sebelumnya customer_name) dan 'type' (Pemasukan/Pengeluaran)
 */
export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="h-4 w-4 text-brand-600" />
              Transaksi Terbaru
            </CardTitle>
            <CardDescription>10 aktivitas terakhir</CardDescription>
          </div>
          <Link
            href="/dashboard/transaksi"
            className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
          >
            Lihat semua
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {transactions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y">
            {transactions.map((t) => {
              const isIncome = t.type === "Pemasukan";
              return (
                <Link
                  key={t.id}
                  href={`/dashboard/transaksi/${t.id}`}
                  className="flex items-center justify-between gap-3 px-6 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isIncome
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {t.note || t.category || "Transaksi"}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        {t.category && t.category !== t.note && (
                          <>
                            <Tag className="h-3 w-3" />
                            {t.category}
                            <span>·</span>
                          </>
                        )}
                        {timeAgo(t.date)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`shrink-0 text-sm font-bold ${
                      isIncome
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatIDR(t.amount)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Receipt className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">Belum ada transaksi</p>
      <p className="text-xs text-muted-foreground">
        Mulai catat penjualan via WhatsApp untuk melihat data di sini
      </p>
    </div>
  );
}
