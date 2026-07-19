"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type ProductFormProps = {
  initial?: {
    id?: string;
    name?: string;
    sku?: string | null;
    barcode?: string | null;
    price?: number;
    cost?: number | null;
    stock?: number;
    min_stock?: number;
    unit?: string;
    category?: string | null;
    description?: string | null;
  };
  action: (formData: FormData) => Promise<void>;
};

/**
 * Form tambah/edit produk.
 * Dipakai di /dashboard/produk/new & /dashboard/produk/[id]/edit.
 */
export function ProductForm({ initial, action }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal menyimpan produk");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/produk">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{initial?.id ? "Edit Produk" : "Tambah Produk Baru"}</CardTitle>
          <CardDescription>
            Isi informasi produk. Field dengan * wajib diisi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Nama Produk *</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Contoh: Kopi Sachet"
                defaultValue={initial?.name ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                placeholder="Kopi-001"
                defaultValue={initial?.sku ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                name="barcode"
                placeholder="8991234567890"
                defaultValue={initial?.barcode ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                name="category"
                placeholder="Minuman"
                defaultValue={initial?.category ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Satuan</Label>
              <Input
                id="unit"
                name="unit"
                placeholder="pcs / pack / kg"
                defaultValue={initial?.unit ?? "pcs"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Harga & Stok</CardTitle>
          <CardDescription>Atur harga jual, modal, dan stok</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Harga Jual *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step={100}
                required
                placeholder="5000"
                defaultValue={initial?.price ?? 0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Harga Modal</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                min={0}
                step={100}
                placeholder="3500"
                defaultValue={initial?.cost ?? 0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stok Awal *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min={0}
                step={1}
                required
                placeholder="50"
                defaultValue={initial?.stock ?? 0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_stock">Stok Minimum</Label>
              <Input
                id="min_stock"
                name="min_stock"
                type="number"
                min={0}
                step={1}
                placeholder="5"
                defaultValue={initial?.min_stock ?? 5}
              />
              <p className="text-xs text-muted-foreground">
                Alert kalau stok di bawah nilai ini
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catatan (Opsional)</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Tambahkan catatan tentang produk ini..."
            defaultValue={initial?.description ?? ""}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button asChild variant="outline">
          <Link href="/dashboard/produk">Batal</Link>
        </Button>
        <Button type="submit" disabled={isPending} size="lg">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {initial?.id ? "Update Produk" : "Simpan Produk"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
