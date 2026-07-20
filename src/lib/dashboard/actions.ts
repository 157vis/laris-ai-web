/**
 * Server Actions untuk CRUD Buku Kas + Produk.
 *
 * ADAPTASI SKEMA Supabase existing (bukuwarung-ai):
 *   - products: id, user_id, name, price, stock, category, description, image_url, is_active, created_at
 *   - transactions: id, date, type ('Pemasukan'|'Pengeluaran'),
 *                   amount, category, note, receipt_no, running_balance, is_prive, user_id
 *   - transaction_items: TIDAK ADA
 *
 * Karena tidak ada transaction_items, kita collapse transaksi jadi 1 row saja
 * dengan amount = total & category = nama produk (jika single item).
 */
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// ============ VALIDATION SCHEMAS ============

const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi").max(120),
  price: z.coerce.number().min(0, "Harga minimal 0").default(0),
  stock: z.coerce.number().int().min(0).default(0),
  category: z.string().max(50).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal("")),
});

const transactionItemSchema = z.object({
  product_id: z.coerce.number().int().optional().nullable(),
  name: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0),
  subtotal: z.coerce.number().min(0),
});

const transactionSchema = z.object({
  // Frontend form pakai 'note' sbg customer_name (mis. "Pelanggan X" atau "Budi")
  note: z.string().max(120).optional().nullable(),
  // type: 'Pemasukan' (jual) atau 'Pengeluaran' (beli)
  type: z.enum(["Pemasukan", "Pengeluaran"]).default("Pemasukan"),
  category: z.string().max(50).optional().nullable(),
  items: z.array(transactionItemSchema).min(1, "Minimal 1 item"),
  total: z.coerce.number().min(0),
  is_prive: z.coerce.boolean().default(false),
});

/**
 * Generate receipt_no otomatis.
 * Format: KM-YYMMDD-NNN (Pemasukan) atau KK-YYMMDD-NNN (Pengeluaran)
 */
async function generateReceiptNo(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  type: "Pemasukan" | "Pengeluaran"
): Promise<string> {
  const prefix = type === "Pemasukan" ? "KM" : "KK";
  const now = new Date();
  const yymmdd =
    now.getFullYear().toString().slice(2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  // Count transaksi hari ini untuk sequence
  const { count } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("type", type);

  const seq = String((count ?? 0) + 1).padStart(3, "0");
  return `${prefix}-${yymmdd}-${seq}`;
}

/**
 * Hitung running_balance baru.
 */
async function getLastRunningBalance(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<number> {
  const { data } = await supabase
    .from("transactions")
    .select("running_balance")
    .eq("user_id", userId)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  return Number(data?.running_balance ?? 0);
}

// ============ PRODUCT ACTIONS ============

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = productSchema.parse({
    name: formData.get("name"),
    price: formData.get("price") || 0,
    stock: formData.get("stock") || 0,
    category: formData.get("category") || null,
    description: formData.get("description") || null,
    image_url: formData.get("image_url") || null,
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
    price: formData.get("price") || 0,
    stock: formData.get("stock") || 0,
    category: formData.get("category") || null,
    description: formData.get("description") || null,
    image_url: formData.get("image_url") || null,
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
    note: formData.get("note") || null,
    type: formData.get("type") || "Pemasukan",
    category: formData.get("category") || null,
    items,
    total: formData.get("total") || 0,
    is_prive: formData.get("is_prive") === "true",
  });

  // === ADAPTASI: Karena tidak ada transaction_items, kita collapse ke 1 row
  // Ambil item pertama sebagai representative
  const firstItem = parsed.items[0];
  const category = parsed.category || firstItem?.name || "Penjualan";
  const noteFull =
    parsed.note ||
    (parsed.items.length === 1
      ? `${firstItem.name} (${firstItem.quantity}x)`
      : `${parsed.items.length} item: ${parsed.items.map((i) => i.name).join(", ")}`);

  // Hitung receipt_no & running_balance
  const receiptNo = await generateReceiptNo(supabase, user.id, parsed.type);
  const lastBalance = await getLastRunningBalance(supabase, user.id);
  const newBalance =
    parsed.type === "Pemasukan" ? lastBalance + parsed.total : lastBalance - parsed.total;

  // Format date 'YYYY-MM-DD HH:MM' (schema existing)
  const now = new Date();
  const dateStr =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    " " +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0");

  // 1) Insert transaction
  const { data: tx, error: txError } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      date: dateStr,
      type: parsed.type,
      amount: parsed.total,
      category,
      note: noteFull,
      receipt_no: receiptNo,
      running_balance: newBalance,
      is_prive: parsed.is_prive,
    })
    .select("id")
    .single();

  if (txError || !tx) throw new Error(txError?.message ?? "Gagal membuat transaksi");

  // 2) Kurangi stok untuk setiap item (jika product_id valid)
  for (const it of parsed.items) {
    if (it.product_id) {
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

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/kas");
  revalidatePath("/dashboard");
}
