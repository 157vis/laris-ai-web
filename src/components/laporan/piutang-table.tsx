import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, TrendingDown, Wallet } from "lucide-react";
import { formatIDR } from "@/lib/format";
import type { FullReportRow } from "@/lib/laporan/queries";

type Props = {
  rows: FullReportRow[];
};

const AGING_STYLES: Record<string, { color: string; label: string; icon: typeof Clock }> = {
  current: {
    color: "bg-emerald-100 text-emerald-700",
    label: "Belum jatuh tempo",
    icon: Clock,
  },
  aging_0_30: {
    color: "bg-amber-100 text-amber-700",
    label: "1-30 hari",
    icon: Clock,
  },
  aging_31_60: {
    color: "bg-orange-100 text-orange-700",
    label: "31-60 hari",
    icon: AlertTriangle,
  },
  aging_61_90: {
    color: "bg-rose-100 text-rose-700",
    label: "61-90 hari",
    icon: AlertTriangle,
  },
  aging_90_plus: {
    color: "bg-red-100 text-red-700",
    label: ">90 hari (KRITIS)",
    icon: TrendingDown,
  },
  no_due_date: {
    color: "bg-slate-100 text-slate-600",
    label: "Tanpa jatuh tempo",
    icon: Clock,
  },
  paid: {
    color: "bg-emerald-50 text-emerald-600",
    label: "Lunas",
    icon: Clock,
  },
};

/**
 * Display piutang aktif + aging analysis. Compact view, fokus ke ringkasan
 * supaya user langsung tahu mana yang perlu ditagih.
 */
export function PiutangTable({ rows }: Props) {
  const piutangRows = rows.filter((r) => r.piutang_status);
  const totalUnpaid = piutangRows
    .filter((r) => r.piutang_status !== "paid")
    .reduce((s, r) => s + Number(r.amount_remaining ?? 0), 0);
  const countOverdue = piutangRows.filter((r) => (r.days_overdue ?? 0) > 0).length;

  if (piutangRows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Piutang Aktif
          </CardTitle>
          <CardDescription>Belum ada piutang tercatat</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground py-4">
            Saat Anda catat penjualan dengan tipe "Piutang" di halaman Buku Kas,
            customer &amp; aging piutang akan tampil di sini.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Piutang Aktif
        </CardTitle>
        <CardDescription>
          Total {formatIDR(totalUnpaid)} belum dibayar · {countOverdue} lewat jatuh tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {piutangRows.slice(0, 20).map((row) => {
            const style = AGING_STYLES[row.aging_bucket] ?? AGING_STYLES.no_due_date;
            const Icon = style.icon;
            const pctPaid =
              Number(row.amount ?? 0) > 0
                ? Math.round(((Number(row.amount_paid ?? 0)) / Number(row.amount ?? 0)) * 100)
                : 0;

            return (
              <div
                key={row.transaction_id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">
                      {row.customer_name ?? "Tanpa nama"}
                    </p>
                    <Badge className={style.color}>
                      <Icon className="mr-1 h-3 w-3" />
                      {style.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {row.customer_phone ?? "—"} · {row.date} · {row.note ?? "Tanpa catatan"}
                  </p>
                  {Number(row.amount_paid ?? 0) > 0 && row.piutang_status !== "paid" && (
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${pctPaid}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-rose-600">
                    {formatIDR(Number(row.amount_remaining ?? 0))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    dari {formatIDR(Number(row.amount ?? 0))}
                  </p>
                </div>
              </div>
            );
          })}
          {piutangRows.length > 20 && (
            <p className="text-center text-xs text-muted-foreground">
              +{piutangRows.length - 20} piutang lainnya (lihat di Buku Kas)
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
