import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "warning" | "danger" | "info";

const VARIANT_STYLES: Record<Variant, { bg: string; text: string }> = {
  default: {
    bg: "bg-muted",
    text: "text-muted-foreground",
  },
  success: {
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  warning: {
    bg: "bg-amber-100 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
  },
  danger: {
    bg: "bg-rose-100 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
  },
  info: {
    bg: "bg-sky-100 dark:bg-sky-950/40",
    text: "text-sky-700 dark:text-sky-300",
  },
};

type Trend = "up" | "down" | "flat" | undefined;

type KpiCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: Variant;
  trend?: Trend;
  trendValue?: string;
};

/**
 * KPI Card — Kartu metrik untuk dashboard.
 */
export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
  trend,
  trendValue,
}: KpiCardProps) {
  const v = VARIANT_STYLES[variant];
  const trendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const TrendIcon = trendIcon;

  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
            {title}
          </p>
          <p className="mt-1 truncate text-xl font-bold sm:text-2xl">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && trendValue && (
            <p
              className={cn(
                "mt-1 flex items-center gap-1 text-xs font-medium",
                trend === "up" && "text-emerald-600",
                trend === "down" && "text-rose-600",
                trend === "flat" && "text-muted-foreground"
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {trendValue}
            </p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", v.bg, v.text)}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
