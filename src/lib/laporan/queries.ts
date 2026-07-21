/**
 * Query helper untuk Laporan Keuangan Komprehensif.
 *
 * Pakai view `v_full_report` (dari SQL migration) untuk 1-query ambil
 * semua data + aging piutang.
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
};

/**
 * Ambil data laporan lengkap untuk 1 client (filter by client_id dari profile).
 * Range date optional — kalau kosong, ambil semua data.
 */
export async function getFullReport(opts: {
  clientId: string | null;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;
  includePaid?: boolean;
}): Promise<FullReportRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from("v_full_report")
    .select("*")
    .order("date", { ascending: false })
    .limit(5000);

  if (opts.clientId) {
    query = query.eq("client_id", opts.clientId);
  }
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
 */
export async function getReportSummary(opts: {
  clientId: string;
  startDate?: string;
  endDate?: string;
}): Promise<unknown | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("aggregate_report", {
    p_client_id: opts.clientId,
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
export async function getPiutangSummary(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("id, date, amount, amount_paid, due_date, piutang_status, customer_name, customer_phone, note")
    .eq("client_id", clientId)
    .not("piutang_status", "is", null)
    .order("due_date", { ascending: true });

  if (error) {
    console.error("[laporan] getPiutangSummary error:", error);
    return [];
  }
  return data ?? [];
}
