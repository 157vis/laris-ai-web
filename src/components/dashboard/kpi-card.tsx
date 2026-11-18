import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "warning" | "danger" | "info";

const VARIANT_STYLES: Record<Variant, { bg: string; text: string; bar: string }> = {
  default: { bg: "bg-muted", text: "text-muted-foreground", bar: "bg-border" },
  success: { bg: "bg-brand-100 dark:bg-brand-900/40", text: "text-brand-700 dark:text-brand-300", bar: "bg-brand-500" },
  warning: { bg: "bg-amber-100 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", bar: "bg-amber-500" },
  danger: { bg: "bg-rose-100 dark:bg-rose-950/40", text: "text-rose-700 dark:text-rose-300", bar: "bg-rose-500" },
  info: { bg: "bg-sky-100 dark:bg-sky-950/40", text: "text-sky-700 dark:text-sky-300", bar: "bg-sky-500" },
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

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
  trend,
  trendValue,
}: KpiCardProps) {
  const style = VARIANT_STYLES[variant];
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-border/70 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <span className={cn("absolute inset-x-0 top-0 h-1 opacity-80", style.bar)} aria-hidden="true" />
      <CardContent className="p-4 pt-5 sm:p-5 sm:pt-6">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-xs font-semibold text-muted-foreground sm:text-sm">{title}</p>
          <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", style.bg, style.text)}>
            {icon}
          </span>
        </div>
        <p className="mt-4 truncate text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>}
        {trend && trendValue && (
          <p
            className={cn(
              "mt-3 flex items-center gap-1.5 text-xs font-semibold",
              trend === "up" && "text-brand-700 dark:text-brand-300",
              trend === "down" && "text-rose-600 dark:text-rose-400",
              trend === "flat" && "text-muted-foreground"
            )}
          >
            <TrendIcon className="size-3.5" />
            {trendValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
