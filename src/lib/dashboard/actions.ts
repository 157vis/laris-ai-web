/**
 * Server Actions untuk CRUD Buku Kas + Produk.
 * Ref: bukuwarung-ai/sql/setup_laris_ai_unified.sql
 */
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// ============ VALIDATION SCHEMAS ============

const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi").max(120),
  sku: z.string().max(50).optional().nullable(),
  barcode: z.string().max(50).optional().nullable(),
  price: z.coerce.number().min(0, "Harga minimal 0").default(0),
  cost: z.coerce.number().min(0).default(0),
  stock: z.coerce.number().int().min(0).default(0),
  min_stock: z.coerce.number().int().min(0).default(5),
  unit: z.string().max(20).default("pcs"),
  category: z.string().max(50).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
});

const transactionItemSchema = z.object({
  product_id: z.string().uuid().optional().nullable(),
  name: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0),
  subtotal: z.coerce.number().min(0),
});

const transactionSchema = z.object({
  customer_name: z.string().max(120).optional().nullable(),
  customer_phone: z.string().max(20).optional().nullable(),
  payment_method: z.enum(["tunai", "qris", "transfer", "kredit"]).default("tunai"),
  notes: z.string().max(500).optional().nullable(),
  items: z.array(transactionItemSchema).min(1, "Minimal 1 item"),
  total: z.coerce.number().min(0),
});

// ============ PRODUCT ACTIONS ============

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = productSchema.parse({
    name: formData.get("name"),
    sku: formData.get("sku") || null,
    barcode: formData.get("barcode") || null,
    price: formData.get("price") || 0,
    cost: formData.get("cost") || 0,
    stock: formData.get("stock") || 0,
    min_stock: formData.get("min_stock") || 5,
    unit: formData.get("unit") || "pcs",
    category: formData.get("category") || null,
    description: formData.get("description") || null,
  });

  const { error } = await supabase.from("products").insert({
    user_id: user.id,
    ...parsed,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/produk");
  redirect("/dashboard/produk");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = productSchema.parse({
    name: formData.get("name"),
    sku: formData.get("sku") || null,
    barcode: formData.get("barcode") || null,
    price: formData.get("price") || 0,
    cost: formData.get("cost") || 0,
    stock: formData.get("stock") || 0,
    min_stock: formData.get("min_stock") || 5,
    unit: formData.get("unit") || "pcs",
    category: formData.get("category") || null,
    description: formData.get("description") || null,
  });

  const { error } = await supabase
    .from("products")
    .update(parsed)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/produk");
  revalidatePath(`/dashboard/produk/${id}`);
  redirect("/dashboard/produk");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/produk");
}

export async function adjustStock(id: string, delta: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Ambil stok saat ini
  const { data: prod } = await supabase
    .from("products")
    .select("stock")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!prod) throw new Error("Produk tidak ditemukan");

  const newStock = Math.max(0, (prod.stock ?? 0) + delta);

  const { error } = await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/produk");
}

// ============ TRANSACTION ACTIONS ============

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Parse items JSON
  const itemsJson = formData.get("items") as string;
  const items = JSON.parse(itemsJson);

  const parsed = transactionSchema.parse({
    customer_name: formData.get("customer_name") || null,
    customer_phone: formData.get("customer_phone") || null,
    payment_method: formData.get("payment_method") || "tunai",
    notes: formData.get("notes") || null,
    items,
    total: formData.get("total") || 0,
  });

  // 1) Create transaction
  const { data: tx, error: txError } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      customer_name: parsed.customer_name,
      customer_phone: parsed.customer_phone,
      payment_method: parsed.payment_method,
      notes: parsed.notes,
      total: parsed.total,
    })
    .select("id")
    .single();

  if (txError || !tx) throw new Error(txError?.message ?? "Gagal membuat transaksi");

  // 2) Insert transaction_items + kurangi stok
  const itemsToInsert = parsed.items.map((it) => ({
    user_id: user.id,
    transaction_id: tx.id,
    product_id: it.product_id ?? null,
    name: it.name,
    quantity: it.quantity,
    price: it.price,
    subtotal: it.subtotal,
  }));

  const { error: itemsError } = await supabase
    .from("transaction_items")
    .insert(itemsToInsert);

  if (itemsError) throw new Error(itemsError.message);

  // 3) Kurangi stok untuk produk yang valid
  for (const it of parsed.items) {
    if (it.product_id) {
      // Ambil stok saat ini, decrement
      const { data: prod } = await supabase
        .from("products")
        .select("stock")
        .eq("id", it.product_id)
        .single();

      if (prod) {
        await supabase
          .from("products")
          .update({ stock: Math.max(0, (prod.stock ?? 0) - it.quantity) })
          .eq("id", it.product_id);
      }
    }
  }

  revalidatePath("/dashboard/kas");
  revalidatePath("/dashboard");
  redirect(`/dashboard/kas/${tx.id}`);
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Hapus items dulu (jika FK cascade OK, kalau tidak)
  await supabase
    .from("transaction_items")
    .delete()
    .eq("transaction_id", id);

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/kas");
  revalidatePath("/dashboard");
}
