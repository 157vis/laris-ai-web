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
    price?: number;
    stock?: number;
    category?: string | null;
    description?: string | null;
    image_url?: string | null;
  };
  action: (formData: FormData) => Promise<void>;
};

/**
 * Form tambah/edit produk.
 * ADAPTASI: Skema Supabase 'products' hanya punya:
 *   id, user_id, name, price, stock, category, description, image_url, is_active, created_at
 * Field cost/min_stock/sku/barcode/unit TIDAK ADA → tidak dipakai di form.
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
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                name="category"
                placeholder="Minuman, Sembako, dll"
                defaultValue={initial?.category ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL Gambar</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                placeholder="https://..."
                defaultValue={initial?.image_url ?? ""}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Deskripsi produk (opsional)"
                defaultValue={initial?.description ?? ""}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Harga & Stok</CardTitle>
          <CardDescription>Atur harga jual dan stok</CardDescription>
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
              <p className="text-xs text-muted-foreground">
                ⚠️ Produk dengan stok &lt; 5 akan ditandai "Stok Menipis"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button asChild variant="outline" type="button">
          <Link href="/dashboard/produk">Batal</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Produk
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
