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

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              <Receipt className="size-4" />
            </span>
            Transaksi terbaru
          </CardTitle>
          <CardDescription className="mt-1">Aktivitas keuangan terkini</CardDescription>
        </div>
        <Link
          href="/dashboard/transaksi"
          className="flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-950/40"
        >
          Lihat semua
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {transactions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-border/60">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === "Pemasukan";
              return (
                <Link
                  key={transaction.id}
                  href={`/dashboard/transaksi/${transaction.id}`}
                  className="flex min-h-[68px] items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/40 sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                        isIncome
                          ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                      }`}
                    >
                      {isIncome ? <ArrowUpRight className="size-[18px]" /> : <ArrowDownRight className="size-[18px]" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {transaction.note || transaction.category || "Transaksi"}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                        {transaction.category && transaction.category !== transaction.note && (
                          <>
                            <Tag className="size-3 shrink-0" />
                            {transaction.category}
                            <span>·</span>
                          </>
                        )}
                        {timeAgo(transaction.date)}
                      </span>
                    </span>
                  </div>
                  <span
                    className={`shrink-0 text-right text-sm font-bold ${
                      isIncome ? "text-brand-700 dark:text-brand-300" : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isIncome ? "+" : "−"}
                    {formatIDR(transaction.amount)}
                  </span>
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
      <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Receipt className="size-5" />
      </span>
      <p className="text-sm font-semibold">Belum ada transaksi</p>
      <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
        Catat penjualan pertama untuk mulai melihat ringkasan aktivitas di sini.
      </p>
    </div>
  );
}
