import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowRight, Package } from "lucide-react";
import { formatIDR } from "@/lib/format";

type TopProduct = { name: string; sold: number; revenue: number };

export function TopProducts({ products }: { products: TopProduct[] }) {
  const maxRevenue = Math.max(...products.map((product) => product.revenue), 1);

  return (
    <Card className="h-full rounded-2xl border-border/70 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <Trophy className="size-4" />
            </span>
            Produk terlaris
          </CardTitle>
          <CardDescription className="mt-1">Performa bulan ini</CardDescription>
        </div>
        <Link
          href="/dashboard/produk"
          className="flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-950/40"
        >
          Kelola
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            {products.map((product, index) => {
              const widthPct = (product.revenue / maxRevenue) * 100;
              return (
                <div key={product.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          index === 0
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
                            : "bg-muted text-muted-foreground"
                        }`}
                        aria-label={`Peringkat ${index + 1}`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate text-sm font-semibold">{product.name}</span>
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{product.sold} terjual</span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-label={`Pendapatan ${product.name}`}
                    aria-valuemin={0}
                    aria-valuemax={maxRevenue}
                    aria-valuenow={product.revenue}
                  >
                    <div
                      className={`h-full rounded-full ${index === 0 ? "bg-amber-500" : "bg-brand-400"}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">{formatIDR(product.revenue)}</p>
                </div>
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
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Package className="size-5" />
      </span>
      <p className="text-sm font-semibold">Belum ada data produk</p>
      <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
        Produk terlaris akan terlihat setelah ada penjualan.
      </p>
    </div>
  );
}
