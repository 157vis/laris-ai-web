/**
 * Dashboard queries — Server-side data fetching untuk Dashboard Kasir.
 * Ref: bukuwarung-ai/sql/setup_laris_ai_unified.sql
 *
 * IMPORTANT: Skema tabel ini ADAPT ke schema REAL Supabase existing:
 *   - products: id, user_id, name, price, stock, category, description, image_url, is_active, created_at
 *   - transactions: id, date (TEXT), type ('Pemasukan'|'Pengeluaran'),
 *                   amount, category, note, receipt_no, running_balance, is_prive, user_id, tenant_id
 *   - transaction_items: TIDAK ADA (skip)
 *
 * Backend lama (bukuwarung-ai) pakai schema ini, jadi Next.js align.
 */

import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  todayRevenue: number;
  todayExpenses: number;
  netCashflow: number;
  todayTransactions: number;
  lowStockCount: number;
  monthTransactions: number;
  monthRevenue: number;
  monthExpenses: number;
  activeCustomers: number;
  revenueLast7Days: Array<{ date: string; revenue: number }>;
  topProducts: Array<{ name: string; sold: number; revenue: number }>;
  recentTransactions: Array<{
    id: string;
    note: string | null;
    category: string | null;
    type: "Pemasukan" | "Pengeluaran";
    amount: number;
    date: string;
  }>;
};

/**
 * Format IDR (Rupiah).
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal relatif: "Baru saja", "5 menit lalu", "2 jam lalu", dst.
 */
export function timeAgo(iso: string): string {
  // Handle date format 'YYYY-MM-DD HH:MM' (string) atau ISO datetime
  const then = new Date(iso.replace(" ", "T")).getTime();
  const now = Date.now();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Build array 7 hari terakhir dengan date label & revenue default 0.
 * Return date dalam format YYYY-MM-DD (string match dengan date column).
 */
function last7DaysSkeleton(): Array<{ date: string; revenue: number }> {
  const days: Array<{ date: string; revenue: number }> = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split("T")[0], // YYYY-MM-DD
      revenue: 0,
    });
  }
  return days;
}

/**
 * Parse date string 'YYYY-MM-DD HH:MM' → Date.
 * Schema transactions pakai format ini (bukan ISO).
 */
function parseTxDate(dateStr: string): Date {
  // Replace space dengan T supaya Date bisa parse
  return new Date(dateStr.replace(" ", "T"));
}

/**
 * Compare transaction date with today start.
 */
function isToday(dateStr: string, todayStart: Date): boolean {
  const d = parseTxDate(dateStr);
  return d >= todayStart;
}

/**
 * Compare transaction date with N days ago.
 */
function isWithinDays(dateStr: string, daysAgo: Date): boolean {
  const d = parseTxDate(dateStr);
  return d >= daysAgo;
}

/**
 * Fetch semua stats dashboard untuk user yang login.
 * Jika query gagal, return data kosong (graceful degradation).
 *
 * ADAPTASI SKEMA:
 * - transactions: pakai 'date' (TEXT) bukan 'created_at'
 * - type: 'Pemasukan' = revenue, 'Pengeluaran' = expense
 * - amount: nominal transaksi
 * - category + note: informasi tambahan (gabungan dipakai untuk display)
 * - products: pakai 'created_at' (ISO datetime) dan 'stock' untuk low stock
 */
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createClient();
  const skeleton = last7DaysSkeleton();
  const empty: DashboardStats = {
    todayRevenue: 0,
    todayExpenses: 0,
    netCashflow: 0,
    todayTransactions: 0,
    lowStockCount: 0,
    monthTransactions: 0,
    monthRevenue: 0,
    monthExpenses: 0,
    activeCustomers: 0,
    revenueLast7Days: skeleton,
    topProducts: [],
    recentTransactions: [],
  };

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // 1) ALL transactions user ini (filter di client karena date TEXT)
    // Pakai limit besar supaya dapat semua data
    const { data: allTx, error: txError } = await supabase
      .from("transactions")
      .select("id, date, type, amount, category, note, receipt_no, running_balance, is_prive")
      .eq("user_id", userId)
      .order("id", { ascending: false })
      .limit(2000);

    if (txError) {
      console.error("[dashboard] transactions query error:", txError);
      return empty;
    }

    const txList = allTx || [];

    // Today revenue & expenses
    const todayTx = txList.filter((t) => isToday(t.date, todayStart));
    const todayRevenue = todayTx
      .filter((t) => t.type === "Pemasukan")
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const todayExpenses = todayTx
      .filter((t) => t.type === "Pengeluaran")
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const todayTransactions = todayTx.length;
    const netCashflow = todayRevenue - todayExpenses;

    // Month stats (30 hari terakhir)
    const monthTx = txList.filter((t) => isWithinDays(t.date, monthAgo));
    const monthRevenue = monthTx
      .filter((t) => t.type === "Pemasukan")
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const monthExpenses = monthTx
      .filter((t) => t.type === "Pengeluaran")
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const monthTransactions = monthTx.length;

    // Revenue 7 hari terakhir
    const weekTx = txList.filter((t) => isWithinDays(t.date, sevenDaysAgo));
    const revenueMap = new Map<string, number>();
    skeleton.forEach((d) => revenueMap.set(d.date, 0));
    weekTx
      .filter((t) => t.type === "Pemasukan")
      .forEach((t) => {
        const dateKey = t.date.split(" ")[0]; // YYYY-MM-DD
        if (revenueMap.has(dateKey)) {
          revenueMap.set(dateKey, (revenueMap.get(dateKey) ?? 0) + Number(t.amount || 0));
        }
      });
    const revenueLast7Days = skeleton.map((d) => ({
      ...d,
      revenue: revenueMap.get(d.date) ?? 0,
    }));

    // Active customers (distinct note yang ada, 30 hari terakhir)
    // Karena tidak ada customer_phone, kita pakai 'note' sbg identifier customer
    const uniqueNotes = new Set(
      monthTx
        .map((t) => (t.note || "").trim())
        .filter((n) => n && n.length > 0 && !n.toLowerCase().includes("jual"))
    );

    // Low stock products (stock < 5)
    const { count: lowStockCount } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .lt("stock", 5)
      .eq("is_active", true);

    // Top products (aggregate dari note transaksi, karena tidak ada transaction_items)
    // Kita parse note untuk extract nama produk jika ada pola 'jual X' atau 'X'
    const productMap = new Map<string, { name: string; sold: number; revenue: number }>();
    monthTx
      .filter((t) => t.type === "Pemasukan")
      .forEach((t) => {
        const name = (t.category || t.note || "Penjualan").trim() || "Penjualan";
        const existing = productMap.get(name) ?? { name, sold: 0, revenue: 0 };
        existing.sold += 1;
        existing.revenue += Number(t.amount || 0);
        productMap.set(name, existing);
      });
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent transactions (10 terakhir)
    const recentTransactions = txList.slice(0, 10).map((t) => ({
      id: String(t.id),
      note: t.note ?? null,
      category: t.category ?? null,
      type: t.type,
      amount: Number(t.amount) || 0,
      date: t.date,
    }));

    return {
      todayRevenue,
      todayExpenses,
      netCashflow,
      todayTransactions,
      lowStockCount: lowStockCount ?? 0,
      monthTransactions,
      monthRevenue,
      monthExpenses,
      activeCustomers: uniqueNotes.size,
      revenueLast7Days,
      topProducts,
      recentTransactions,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[dashboard] getDashboardStats error:", err);
    return empty;
  }
}
