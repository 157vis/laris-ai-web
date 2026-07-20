"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { Plus, Trash2, Save, Loader2, ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { formatIDR } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
};

type Item = {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  stock: number;
  subtotal: number;
};

type TransactionFormProps = {
  products: Product[];
  action: (formData: FormData) => Promise<void>;
};

export function TransactionForm({ products, action }: TransactionFormProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [note, setNote] = useState("");
  const [type, setType] = useState<"Pemasukan" | "Pengeluaran">("Pemasukan");
  const [category, setCategory] = useState("");
  const [isPrive, setIsPrive] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [isPending, startTransition] = useTransition();

  const total = useMemo(() => items.reduce((s, i) => s + i.subtotal, 0), [items]);

  function addItem() {
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) {
      toast.error("Pilih produk dulu");
      return;
    }
    if (prod.stock <= 0) {
      toast.error(`${prod.name} stok habis`);
      return;
    }
    const existing = items.find((i) => i.product_id === prod.id);
    if (existing) {
      if (existing.quantity + 1 > prod.stock) {
        toast.error(`Stok ${prod.name} tidak cukup`);
        return;
      }
      updateItem(prod.id, existing.quantity + 1, prod.price);
    } else {
      setItems([
        ...items,
        {
          product_id: prod.id,
          name: prod.name,
          quantity: 1,
          price: prod.price,
          stock: prod.stock,
          subtotal: prod.price,
        },
      ]);
    }
    setSelectedProductId("");
  }

  function updateItem(productId: string, qty: number, price: number) {
    setItems(
      items.map((i) =>
        i.product_id === productId
          ? { ...i, quantity: qty, price, subtotal: qty * price }
          : i
      )
    );
  }

  function removeItem(productId: string) {
    setItems(items.filter((i) => i.product_id !== productId));
  }

  function handleSubmit(formData: FormData) {
    if (items.length === 0) {
      toast.error("Tambahkan minimal 1 item");
      return;
    }
    formData.set("items", JSON.stringify(items));
    formData.set("total", String(total));
    formData.set("note", note);
    formData.set("type", type);
    formData.set("category", category);
    formData.set("is_prive", String(isPrive));

    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/kas">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Buku Kas
          </Link>
        </Button>
      </div>

      {/* Item picker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Tambah Item
          </CardTitle>
          <CardDescription>Pilih produk & tambah ke keranjang</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
              <p className="font-medium text-amber-900">Belum ada produk</p>
              <p className="text-amber-700">
                Tambahkan produk dulu di{" "}
                <Link href="/dashboard/produk/new" className="font-bold underline">
                  halaman Produk
                </Link>
              </p>
            </div>
          ) : (
            <div className="flex gap-2">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">— Pilih produk —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    {p.name} · {formatIDR(p.price)} · Stok: {p.stock}
                  </option>
                ))}
              </select>
              <Button type="button" onClick={addItem} disabled={!selectedProductId}>
                <Plus className="h-4 w-4" />
                Tambah
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cart */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Keranjang ({items.length} item)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.product_id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Stok tersedia: {item.stock}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          item.product_id,
                          Math.max(1, Math.min(item.stock, Number(e.target.value) || 1)),
                          item.price
                        )
                      }
                      className="w-20 text-center"
                    />
                    <span className="text-xs text-muted-foreground">×</span>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      value={item.price}
                      onChange={(e) =>
                        updateItem(
                          item.product_id,
                          item.quantity,
                          Math.max(0, Number(e.target.value) || 0)
                        )
                      }
                      className="w-28 text-right"
                    />
                    <span className="hidden w-24 text-right text-sm font-bold sm:block">
                      {formatIDR(item.subtotal)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product_id)}
                      aria-label="Hapus item"
                    >
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <span className="text-lg font-bold">TOTAL</span>
              <span className="text-2xl font-extrabold text-brand-600">
                {formatIDR(total)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Transaksi</CardTitle>
          <CardDescription>Tipe, kategori, dan catatan (opsional)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tipe Transaksi</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["Pemasukan", "Pengeluaran"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      type === t
                        ? t === "Pemasukan"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30"
                          : "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30"
                        : "bg-background hover:bg-muted"
                    }`}
                  >
                    {t === "Pemasukan" ? "💰 Pemasukan" : "💸 Pengeluaran"}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="cth: Penjualan, Bensin, Beli Stok"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="note">Catatan / Nama</Label>
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="cth: Jual kopi 2, Beli bensin, Gaji"
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                id="is_prive"
                checked={isPrive}
                onChange={(e) => setIsPrive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_prive" className="cursor-pointer">
                Transaksi Prive (pengambilan pribadi, tidak masuk bisnis)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-between gap-2 sticky bottom-4 rounded-lg border bg-card p-3 shadow-lg">
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-extrabold text-brand-600">{formatIDR(total)}</p>
        </div>
        <Button type="submit" size="lg" disabled={isPending || items.length === 0}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Simpan Transaksi
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
