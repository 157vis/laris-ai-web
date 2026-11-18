"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  BookOpen,
  Package,
  BarChart3,
  MessageSquare,
  Settings,
  Sparkles,
  LogOut,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canAccess } from "@/lib/auth/rbac";
import type { UserRole } from "@/types/auth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Ringkasan hari ini" },
  { label: "Kasir", href: "/dashboard/kas/new", icon: ShoppingCart, description: "Catat penjualan" },
  { label: "Buku Kas", href: "/dashboard/kas", icon: BookOpen, description: "Pemasukan & pengeluaran" },
  { label: "Produk", href: "/dashboard/produk", icon: Package, description: "Stok barang" },
  { label: "Laporan", href: "/dashboard/laporan", icon: BarChart3, description: "Laporan keuangan" },
  { label: "AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare, description: "Tanya asisten usaha" },
  { label: "Pengaturan", href: "/settings", icon: Settings, description: "Profil & toko" },
];

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] items-center gap-3 border-b border-border/70 px-6">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-sm shadow-brand-900/15">
          <Sparkles className="size-5" />
        </div>
        <div>
          <p className="text-base font-bold leading-none tracking-tight text-brand-800 dark:text-brand-200">
            Laris.AI
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Usaha tumbuh
          </p>
        </div>
      </div>

      <nav aria-label="Navigasi utama" className="flex-1 overflow-y-auto px-3 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Menu utama
        </p>
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
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors",
                  isActive
                    ? "border-brand-200/70 bg-brand-50 text-brand-800 dark:border-brand-800/60 dark:bg-brand-950/40 dark:text-brand-200"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-brand-700 text-white shadow-sm"
                      : "bg-muted/70 text-muted-foreground group-hover:bg-background group-hover:text-brand-700"
                  )}
                >
                  <Icon className="size-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{item.label}</span>
                  {item.description && (
                    <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-3 pb-3">
        <div className="rounded-2xl border border-brand-200/70 bg-brand-50/80 p-3 dark:border-brand-800/50 dark:bg-brand-950/30">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-800 dark:text-brand-200">
            <Store className="size-4" />
            Ruang usaha aktif
          </div>
          <p className="mt-1 pl-6 text-[11px] leading-relaxed text-muted-foreground">
            Catat, pantau, dan kembangkan usaha dalam satu tempat.
          </p>
        </div>
      </div>

      <div className="border-t border-border/70 p-3">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-[18px]" />
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </div>
  );
}
