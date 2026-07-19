import { cn } from "@/lib/utils";

/**
 * Skeleton loading universal.
 * Wajib untuk SEMUA data-fetching components (per brief).
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-label="Memuat..."
      {...props}
    />
  );
}

export { Skeleton };
