import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { formatIDR } from "@/lib/format";

/**
 * Revenue chart — SVG-based bar chart 7 hari terakhir.
 * Pure SVG tanpa dependency eksternal (no recharts).
 */

type DataPoint = { date: string; revenue: number };

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function RevenueChart({ data }: { data: DataPoint[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const totalWeek = data.reduce((s, d) => s + d.revenue, 0);
  const avgDay = totalWeek / 7;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-brand-600" />
              Omset 7 Hari
            </CardTitle>
            <CardDescription>Tren penjualan minggu ini</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Rata-rata/hari</p>
            <p className="text-sm font-bold text-brand-600">{formatIDR(Math.round(avgDay))}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-end gap-2 sm:gap-3">
          {data.map((d, i) => {
            const heightPct = maxRevenue === 0 ? 0 : (d.revenue / maxRevenue) * 100;
            const dayIndex = new Date(d.date).getDay();
            const dayLabel = DAY_LABELS[dayIndex] ?? "?";
            const isToday = i === data.length - 1;

            return (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative flex h-40 w-full items-end justify-center">
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      isToday
                        ? "bg-gradient-to-t from-brand-600 to-emerald-500"
                        : d.revenue > 0
                        ? "bg-gradient-to-t from-brand-400 to-brand-200"
                        : "bg-muted"
                    }`}
                    style={{ height: `${Math.max(heightPct, 3)}%` }}
                    title={`${dayLabel}: ${formatIDR(d.revenue)}`}
                  />
                  {d.revenue > 0 && (
                    <div className="absolute -top-5 left-0 right-0 text-center text-[10px] font-medium text-foreground">
                      {formatIDR(d.revenue).replace("Rp", "").trim()}
                    </div>
                  )}
                </div>
                <span className={`text-[10px] ${isToday ? "font-bold text-brand-600" : "text-muted-foreground"}`}>
                  {dayLabel}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
          <span className="text-muted-foreground">Total minggu ini</span>
          <span className="font-bold text-foreground">{formatIDR(totalWeek)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
