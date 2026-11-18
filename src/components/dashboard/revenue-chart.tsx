import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { formatIDR } from "@/lib/format";

type DataPoint = { date: string; revenue: number };

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function RevenueChart({ data }: { data: DataPoint[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const totalWeek = data.reduce((sum, item) => sum + item.revenue, 0);
  const avgDay = data.length ? totalWeek / data.length : 0;

  return (
    <Card className="h-full rounded-2xl border-border/70 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              <TrendingUp className="size-4" />
            </span>
            Omset 7 hari
          </CardTitle>
          <CardDescription className="mt-1">Tren penjualan minggu ini</CardDescription>
        </div>
        <div className="shrink-0 rounded-xl bg-brand-50 px-3 py-2 text-right dark:bg-brand-950/30">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Rata-rata</p>
          <p className="mt-0.5 text-xs font-bold text-brand-700 dark:text-brand-300 sm:text-sm">
            {formatIDR(Math.round(avgDay))}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="sr-only">Total omzet selama periode ini: {formatIDR(totalWeek)}.</p>
        <div className="flex h-52 items-end gap-2 rounded-2xl bg-muted/35 px-3 pb-3 pt-6 sm:gap-3 sm:px-5">
          {data.map((point, index) => {
            const heightPct = (point.revenue / maxRevenue) * 100;
            const dayLabel = DAY_LABELS[new Date(point.date).getDay()] ?? "?";
            const isToday = index === data.length - 1;

            return (
              <div key={point.date} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <div className="flex h-full w-full items-end rounded-t-xl bg-background/70 px-1">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isToday ? "bg-brand-700 dark:bg-brand-400" : point.revenue > 0 ? "bg-brand-300 dark:bg-brand-700" : "bg-muted"
                    }`}
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                    role="img"
                    aria-label={`${dayLabel}: ${formatIDR(point.revenue)}`}
                    title={`${dayLabel}: ${formatIDR(point.revenue)}`}
                  />
                </div>
                <span className={`text-[10px] ${isToday ? "font-bold text-brand-700 dark:text-brand-300" : "text-muted-foreground"}`}>
                  {dayLabel}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-xs">
          <span className="text-muted-foreground">Total minggu ini</span>
          <span className="font-bold text-foreground">{formatIDR(totalWeek)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
