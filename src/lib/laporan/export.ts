/**
 * Export helpers — generate CSV (untuk Excel) & Markdown (untuk AI).
 *
 * Dipakai oleh halaman Laporan + bisa di-share ke user lain atau dibaca AI.
 */

export type ReportRow = {
  date: string;
  type: "Pemasukan" | "Pengeluaran";
  category: string | null;
  amount: number;
  amount_paid?: number | null;
  amount_remaining?: number | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  due_date?: string | null;
  piutang_status?: string | null;
  days_overdue?: number;
  aging_bucket?: string;
  note: string | null;
  receipt_no?: string | null;
};

export type ReportSummary = {
  period: { start: string; end: string };
  totals: {
    income: number;
    expense: number;
    net: number;
    txCount: number;
  };
  byCategory: Array<{
    type: "Pemasukan" | "Pengeluaran";
    category: string;
    count: number;
    total: number;
  }>;
  piutang?: {
    totalUnpaid: number;
    countUnpaid: number;
    countOverdue: number;
    aging: Array<{
      bucket: string;
      label: string;
      count: number;
      total: number;
    }>;
  };
  products?: {
    totalProducts: number;
    totalStockValue: number;
    lowStockCount: number;
  };
};

/**
 * Convert array of rows to CSV string (untuk Excel/spreadsheet).
 */
export function rowsToCSV(rows: ReportRow[]): string {
  const headers = [
    "Tanggal",
    "Tipe",
    "Kategori",
    "Jumlah",
    "Sudah Dibayar",
    "Sisa",
    "Customer",
    "No HP",
    "Jatuh Tempo",
    "Status Piutang",
    "Hari Telat",
    "Aging",
    "Catatan",
    "No Resi",
  ];

  const lines = [headers.join(",")];
  for (const r of rows) {
    const vals = [
      r.date,
      r.type,
      r.category ?? "",
      r.amount,
      r.amount_paid ?? 0,
      r.amount_remaining ?? r.amount,
      r.customer_name ?? "",
      r.customer_phone ?? "",
      r.due_date ?? "",
      r.piutang_status ?? "",
      r.days_overdue ?? 0,
      r.aging_bucket ?? "",
      escapeCSV(r.note ?? ""),
      r.receipt_no ?? "",
    ];
    lines.push(vals.join(","));
  }
  return lines.join("\n");
}

function escapeCSV(v: string): string {
  if (!v) return "";
  // Escape koma, kutip, newline
  if (/[",\n]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

/**
 * Convert report ke format Markdown — readable untuk AI/LLM.
 *
 * Format:
 *   # Laporan Keuangan [Nama Toko]
 *   Periode: ...
 *   ## Ringkasan
 *   - Pemasukan: ...
 *   - Pengeluaran: ...
 *   ...
 */
export function summaryToMarkdown(summary: ReportSummary, clientName?: string): string {
  const period = `${summary.period.start} → ${summary.period.end}`;
  const lines: string[] = [];

  lines.push(`# Laporan Keuangan${clientName ? ` — ${clientName}` : ""}`);
  lines.push("");
  lines.push(`**Periode:** ${period}`);
  lines.push(`**Tanggal generate:** ${new Date().toISOString()}`);
  lines.push("");

  // Ringkasan
  lines.push("## Ringkasan");
  lines.push("");
  lines.push(`- **Pemasukan:** Rp ${summary.totals.income.toLocaleString("id-ID")}`);
  lines.push(`- **Pengeluaran:** Rp ${summary.totals.expense.toLocaleString("id-ID")}`);
  lines.push(`- **Net (Laba/Rugi):** Rp ${summary.totals.net.toLocaleString("id-ID")}`);
  lines.push(`- **Jumlah transaksi:** ${summary.totals.txCount}`);
  lines.push("");

  // By category
  if (summary.byCategory.length > 0) {
    lines.push("## Per Kategori");
    lines.push("");
    lines.push("| Tipe | Kategori | Jumlah Tx | Total |");
    lines.push("|------|----------|-----------|-------|");
    for (const c of summary.byCategory) {
      lines.push(
        `| ${c.type} | ${c.category} | ${c.count} | Rp ${c.total.toLocaleString("id-ID")} |`
      );
    }
    lines.push("");
  }

  // Piutang
  if (summary.piutang && (summary.piutang.countUnpaid > 0 || summary.piutang.totalUnpaid > 0)) {
    lines.push("## Piutang Aktif");
    lines.push("");
    lines.push(`- **Total piutang belum dibayar:** Rp ${summary.piutang.totalUnpaid.toLocaleString("id-ID")}`);
    lines.push(`- **Jumlah piutang aktif:** ${summary.piutang.countUnpaid}`);
    lines.push(`- **Lewat jatuh tempo:** ${summary.piutang.countOverdue}`);
    lines.push("");
    if (summary.piutang.aging.length > 0) {
      lines.push("### Aging Piutang");
      lines.push("");
      lines.push("| Bucket | Label | Jumlah | Total |");
      lines.push("|--------|-------|--------|-------|");
      for (const a of summary.piutang.aging) {
        lines.push(`| ${a.bucket} | ${a.label} | ${a.count} | Rp ${a.total.toLocaleString("id-ID")} |`);
      }
      lines.push("");
    }
  }

  // Produk
  if (summary.products) {
    lines.push("## Inventaris");
    lines.push("");
    lines.push(`- **Total produk:** ${summary.products.totalProducts}`);
    lines.push(`- **Nilai stok:** Rp ${summary.products.totalStockValue.toLocaleString("id-ID")}`);
    lines.push(`- **Stok menipis (<5):** ${summary.products.lowStockCount}`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push("_Laporan ini di-generate otomatis oleh sistem Laris.AI._");
  lines.push("_Bisa dibaca oleh AI/LLM untuk analisis lebih lanjut._");

  return lines.join("\n");
}

/**
 * Trigger browser download.
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Compute summary dari array of rows.
 */
export function computeSummary(
  rows: ReportRow[],
  period: { start: string; end: string }
): ReportSummary {
  const income = rows
    .filter((r) => r.type === "Pemasukan")
    .reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const expense = rows
    .filter((r) => r.type === "Pengeluaran")
    .reduce((s, r) => s + Number(r.amount ?? 0), 0);

  const byCategoryMap: Record<string, { count: number; total: number }> = {};
  for (const r of rows) {
    const cat = r.category ?? "Tanpa Kategori";
    const key = `${r.type}|${cat}`;
    if (!byCategoryMap[key]) byCategoryMap[key] = { count: 0, total: 0 };
    byCategoryMap[key].count += 1;
    byCategoryMap[key].total += Number(r.amount ?? 0);
  }

  const byCategory = Object.entries(byCategoryMap).map(([k, v]) => {
    const [type, category] = k.split("|");
    return { type: type as "Pemasukan" | "Pengeluaran", category, ...v };
  });

  // Piutang
  const piutangRows = rows.filter((r) => r.piutang_status);
  const totalUnpaid = piutangRows
    .filter((r) => r.piutang_status !== "paid")
    .reduce((s, r) => s + Number(r.amount_remaining ?? r.amount ?? 0), 0);
  const countUnpaid = piutangRows.filter((r) => r.piutang_status !== "paid").length;
  const countOverdue = piutangRows.filter((r) => (r.days_overdue ?? 0) > 0).length;

  const agingMap: Record<string, { count: number; total: number }> = {};
  for (const r of piutangRows) {
    if (r.piutang_status === "paid") continue;
    const bucket = r.aging_bucket ?? "unknown";
    if (!agingMap[bucket]) agingMap[bucket] = { count: 0, total: 0 };
    agingMap[bucket].count += 1;
    agingMap[bucket].total += Number(r.amount_remaining ?? r.amount ?? 0);
  }

  const AGING_LABELS: Record<string, string> = {
    current: "Belum jatuh tempo",
    aging_0_30: "1-30 hari telat",
    aging_31_60: "31-60 hari telat",
    aging_61_90: "61-90 hari telat",
    aging_90_plus: ">90 hari telat (kritis)",
    no_due_date: "Tanpa jatuh tempo",
  };

  const aging = Object.entries(agingMap).map(([bucket, v]) => ({
    bucket,
    label: AGING_LABELS[bucket] ?? bucket,
    ...v,
  }));

  return {
    period,
    totals: { income, expense, net: income - expense, txCount: rows.length },
    byCategory,
    piutang: piutangRows.length > 0
      ? { totalUnpaid, countUnpaid, countOverdue, aging }
      : undefined,
  };
}
