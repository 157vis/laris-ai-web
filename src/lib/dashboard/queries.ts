/**
 * Dashboard queries — Server-side data fetching untuk Dashboard Kasir (FASE 3).
 * Ref: bukuwarung-ai/sql/setup_laris_ai_unified.sql (schema transactions, products)
 */

import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  todayRevenue: number;
  todayTransactions: number;
  lowStockCount: number;
  monthTransactions: number;
  activeCustomers: number;
  revenueLast7Days: Array<{ date: string; revenue: number }>;
  topProducts: Array<{ name: string; sold: number; revenue: number }>;
  recentTransactions: Array<{
    id: string;
    customer_name: string | null;
    total: number;
    created_at: string;
    items_count: number;
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
  const now = Date.now();
  const then = new Date(iso).getTime();
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
 */
function last7DaysSkeleton(): Array<{ date: string; revenue: number }> {
  const days: Array<{ date: string; revenue: number }> = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push({
      date: d.toISOString().split("T")[0],
      revenue: 0,
    });
  }
  return days;
}

/**
 * Fetch semua stats dashboard untuk user yang login.
 * Jika query gagal, return data kosong (graceful degradation).
 */
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createClient();
  const skeleton = last7DaysSkeleton();
  const empty: DashboardStats = {
    todayRevenue: 0,
    todayTransactions: 0,
    lowStockCount: 0,
    monthTransactions: 0,
    activeCustomers: 0,
    revenueLast7Days: skeleton,
    topProducts: [],
    recentTransactions: [],
  };

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // 1) Today revenue & count (transactions table)
    const { data: todayRows } = await supabase
      .from("transactions")
      .select("total")
      .eq("user_id", userId)
      .gte("created_at", todayStart.toISOString());

    const todayRevenue =
      todayRows?.reduce((s, r) => s + (Number(r.total) || 0), 0) ?? 0;

    // 2) Month transaction count
    const { count: monthCount } = await supabase
      .from("transactions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", monthStart.toISOString());

    // 3) Revenue 7 hari terakhir (group by date)
    const { data: weekRows } = await supabase
      .from("transactions")
      .select("total, created_at")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgo.toISOString());

    const revenueMap = new Map<string, number>();
    skeleton.forEach((d) => revenueMap.set(d.date, 0));
    weekRows?.forEach((r) => {
      const dateKey = new Date(r.created_at).toISOString().split("T")[0];
      revenueMap.set(dateKey, (revenueMap.get(dateKey) ?? 0) + Number(r.total || 0));
    });
    const revenueLast7Days = skeleton.map((d) => ({
      ...d,
      revenue: revenueMap.get(d.date) ?? 0,
    }));

    // 4) Low stock products (stock < min_stock OR stock < 5)
    const { count: lowStockCount } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .or("stock.lt.5,stock.lt.min_stock");

    // 5) Active customers (distinct customer_phone dalam 30 hari)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data: customers } = await supabase
      .from("transactions")
      .select("customer_phone")
      .eq("user_id", userId)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .not("customer_phone", "is", null);
    const uniqueCustomers = new Set(
      customers?.map((c) => c.customer_phone).filter(Boolean) ?? []
    );

    // 6) Top products (aggregate dari transaction_items)
    let topProducts: Array<{ name: string; sold: number; revenue: number }> = [];
    try {
      const { data: items } = await supabase
        .from("transaction_items")
        .select("quantity, subtotal, product_id, products(name)")
        .eq("user_id", userId)
        .gte("created_at", monthStart.toISOString())
        .limit(500);

      const productMap = new Map<string, { name: string; sold: number; revenue: number }>();
      items?.forEach((it: { quantity: number; subtotal: number; product_id: string; products: { name: string } | { name: string }[] | null }) => {
        const prod = Array.isArray(it.products) ? it.products[0] : it.products;
        const name = prod?.name ?? "Produk";
        const existing = productMap.get(it.product_id) ?? { name, sold: 0, revenue: 0 };
        existing.sold += Number(it.quantity || 0);
        existing.revenue += Number(it.subtotal || 0);
        productMap.set(it.product_id, existing);
      });
      topProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    } catch {
      // table transaction_items mungkin belum ada
    }

    // 7) Recent transactions
    const { data: recent } = await supabase
      .from("transactions")
      .select("id, customer_name, total, created_at, transaction_items(id)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    const recentTransactions =
      recent?.map((r) => ({
        id: r.id,
        customer_name: r.customer_name ?? null,
        total: Number(r.total) || 0,
        created_at: r.created_at,
        items_count: Array.isArray(r.transaction_items) ? r.transaction_items.length : 0,
      })) ?? [];

    return {
      todayRevenue,
      todayTransactions: todayRows?.length ?? 0,
      lowStockCount: lowStockCount ?? 0,
      monthTransactions: monthCount ?? 0,
      activeCustomers: uniqueCustomers.size,
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
