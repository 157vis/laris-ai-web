/**
 * Query helper untuk Laporan Keuangan Komprehensif.
 *
 * CATATAN: Skema existing pakai `user_id` (UUID, link ke auth.users),
 * bukan `client_id`. Kita pakai `user_id` untuk filter di mana-mana.
 *
 * View `v_full_report` (dari SQL migration) melakukan LEFT JOIN ke
 * `clients` via `clients.owner_user_id = transactions.user_id`.
 */
import { createClient } from "@/lib/supabase/server";

export type FullReportRow = {
  transaction_id: number;
  date: string;
  type: "Pemasukan" | "Pengeluaran";
  category: string | null;
  amount: number;
  amount_paid: number | null;
  amount_remaining: number;
  note: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  due_date: string | null;
  piutang_status: string | null;
  days_overdue: number;
  aging_bucket: string;
  client_id: string | null;
  client_name: string | null;
  receipt_no: string | null;
  user_id: string;
};

/**
 * Ambil data laporan lengkap untuk 1 user (filter by user_id).
 * Range date optional — kalau kosong, ambil semua data.
 */
export async function getFullReport(opts: {
  userId: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;
}): Promise<FullReportRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from("v_full_report")
    .select("*")
    .eq("user_id", opts.userId)
    .order("date", { ascending: false })
    .limit(5000);

  if (opts.startDate) {
    query = query.gte("date", opts.startDate);
  }
  if (opts.endDate) {
    query = query.lte("date", opts.endDate);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[laporan] getFullReport error:", error);
    return [];
  }
  return (data ?? []) as FullReportRow[];
}

/**
 * Ambil summary aggregate via RPC `aggregate_report`.
 * CATATAN: RPC sekarang pakai user_id (UUID), bukan client_id.
 */
export async function getReportSummary(opts: {
  userId: string;
  startDate?: string;
  endDate?: string;
}): Promise<unknown | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("aggregate_report", {
    p_user_id: opts.userId,
    p_start_date: opts.startDate ?? null,
    p_end_date: opts.endDate ?? null,
  });
  if (error) {
    console.error("[laporan] aggregate_report error:", error);
    return null;
  }
  return data;
}

/**
 * Ambil ringkasan piutang aktif (untuk widget di dashboard atau laporan).
 */
export async function getPiutangSummary(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("id, date, amount, amount_paid, due_date, piutang_status, customer_name, customer_phone, note")
    .eq("user_id", userId)
    .not("piutang_status", "is", null)
    .order("due_date", { ascending: true });

  if (error) {
    console.error("[laporan] getPiutangSummary error:", error);
    return [];
  }
  return data ?? [];
}
