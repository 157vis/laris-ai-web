import type { Metadata } from "next";
import Link from "next/link";
import {Plus, Package, AlertTriangle, Pencil, BarChart3} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatIDR } from "@/lib/format";
import { deleteProduct, adjustStock } from "@/lib/dashboard/actions";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { StockAdjuster } from "@/components/dashboard/stock-adjuster";

export const metadata: Metadata = {
  title: "Produk",
  description: "Kelola daftar produk dan stok warung Anda.",
};

export const dynamic = "force-dynamic";

type Product = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  cost: number | null;
  stock: number;
  min_stock: number;
  unit: string;
  category: string | null;
};

export default async function ProdukPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: products } = await supabase
    .from("products")
    .select("id, name, sku, price, cost, stock, min_stock, unit, category")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  const list = (products ?? []) as Product[];
  const totalProducts = list.length;
  const lowStock = list.filter((p) => p.stock <= (p.min_stock ?? 5));
  const totalStockValue = list.reduce((s, p) => s + (p.stock ?? 0) * (p.price ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">📦 Produk</h1>
          <p className="text-sm text-muted-foreground">
            Kelola daftar produk & stok warung Anda
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/produk/new">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Produk</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-brand-500" />
          </CardContent>
        </Card>
        <Card className={lowStock.length > 0 ? "border-amber-300" : ""}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Stok Menipis</p>
              <p className="text-2xl font-bold text-amber-600">{lowStock.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Nilai Inventaris</p>
              <p className="text-lg font-bold">{formatIDR(totalStockValue)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
      </div>

      {/* Product list */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>
            Klik produk untuk edit, atau gunakan tombol stok untuk cepat restock
          </CardDescription>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2">
              {list.map((p) => {
                const isLow = p.stock <= (p.min_stock ?? 5);
                const isOut = p.stock === 0;
                return (
                  <div
                    key={p.id}
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.category ?? "Tanpa kategori"} · {p.sku ?? "Tanpa SKU"} · {p.unit ?? "pcs"}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge variant={isOut ? "destructive" : isLow ? "outline" : "secondary"}>
                            Stok: {p.stock} {p.unit ?? "pcs"}
                          </Badge>
                          <span className="text-xs font-semibold">{formatIDR(p.price ?? 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StockAdjuster
                        productId={p.id}
                        stock={p.stock}
                        adjustStock={adjustStock}
                      />
                      <Button asChild variant="outline" size="icon">
                        <Link href={`/dashboard/produk/${p.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton
                        id={p.id}
                        name={p.name}
                        deleteAction={deleteProduct}
                        redirectTo="/dashboard/produk"
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
        <Package className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold">Belum ada produk</p>
        <p className="text-sm text-muted-foreground">
          Tambahkan produk pertama Anda untuk mulai berjualan
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/produk/new">
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Link>
      </Button>
    </div>
  );
}
