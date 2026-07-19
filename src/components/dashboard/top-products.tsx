import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowRight, Package } from "lucide-react";
import { formatIDR } from "@/lib/format";

type TopProduct = { name: string; sold: number; revenue: number };

const MEDALS = ["🥇", "🥈", "🥉", "4.", "5."];

/**
 * Top 5 produk terlaris bulan ini.
 */
export function TopProducts({ products }: { products: TopProduct[] }) {
  const maxRevenue = Math.max(...products.map((p) => p.revenue), 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-amber-500" />
              Top Produk
            </CardTitle>
            <CardDescription>5 produk terlaris bulan ini</CardDescription>
          </div>
          <Link
            href="/dashboard/produk"
            className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
          >
            Kelola
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {products.map((p, i) => {
              const widthPct = (p.revenue / maxRevenue) * 100;
              return (
                <div key={p.name} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="w-6 text-base">{MEDALS[i] ?? `${i + 1}.`}</span>
                      <span className="truncate font-medium">{p.name}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {p.sold} terjual
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {formatIDR(p.revenue)}
                  </p>
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
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Package className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">Belum ada data</p>
      <p className="text-xs text-muted-foreground">
        Produk terlaris akan muncul setelah ada penjualan
      </p>
    </div>
  );
}
