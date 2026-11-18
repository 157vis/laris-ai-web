"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  ShoppingCart,
  BookOpen,
  Package,
  BarChart3,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canAccess } from "@/lib/auth/rbac";
import type { UserRole } from "@/types/auth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kasir", href: "/dashboard/kas/new", icon: ShoppingCart },
  { label: "Buku Kas", href: "/dashboard/kas", icon: BookOpen },
  { label: "Produk", href: "/dashboard/produk", icon: Package },
  { label: "Laporan", href: "/dashboard/laporan", icon: BarChart3 },
  { label: "AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];

export function MobileSidebar({
  open,
  onClose,
  role,
}: {
  open: boolean;
  onClose: () => void;
  role: UserRole;
}) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-foreground/35 backdrop-blur-[2px] lg:hidden"
        onClick={onClose}
        aria-label="Tutup menu navigasi"
      />

      <aside
        id="mobile-navigation"
        aria-label="Navigasi utama"
        className="fixed inset-y-0 left-0 z-50 flex w-[min(19rem,88vw)] flex-col border-r border-border/70 bg-card shadow-2xl lg:hidden"
      >
        <div className="flex h-[72px] items-center justify-between border-b border-border/70 px-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-brand-700 text-white">
              <Sparkles className="size-5" />
            </span>
            <span className="text-base font-bold text-brand-800 dark:text-brand-200">Laris.AI</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="flex size-11 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav aria-label="Menu utama" className="flex-1 overflow-y-auto px-3 py-5">
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.filter((item) => canAccess(item.href, role)).map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : item.href === "/dashboard/kas"
                    ? pathname === item.href || (pathname.startsWith(`${item.href}/`) && pathname !== "/dashboard/kas/new")
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-brand-50 text-brand-800 dark:bg-brand-950/40 dark:text-brand-200"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn("size-[18px]", isActive && "text-brand-700 dark:text-brand-300")} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
