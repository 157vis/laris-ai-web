import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, ArrowRight, User } from "lucide-react";
import { formatIDR, timeAgo } from "@/lib/dashboard/queries";

type Transaction = {
  id: string;
  customer_name: string | null;
  total: number;
  created_at: string;
  items_count: number;
};

/**
 * Daftar transaksi terakhir — Recent activity feed.
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
            {transactions.map((t) => (
              <Link
                key={t.id}
                href={`/dashboard/transaksi/${t.id}`}
                className="flex items-center justify-between gap-3 px-6 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {t.customer_name || "Pelanggan"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.items_count} item · {timeAgo(t.created_at)}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-bold text-foreground">
                  {formatIDR(t.total)}
                </p>
              </Link>
            ))}
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
