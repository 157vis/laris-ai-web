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
  { label: "Kasir", href: "/kasir", icon: ShoppingCart, description: "Catat penjualan" },
  { label: "Buku Kas", href: "/buku-kas", icon: BookOpen, description: "Pemasukan & pengeluaran" },
  { label: "Produk", href: "/produk", icon: Package, description: "Stok barang" },
  { label: "Laporan", href: "/laporan", icon: BarChart3, description: "Laporan keuangan" },
  { label: "AI Chat", href: "/ai-chat", icon: MessageSquare, description: "Tanya AI asisten" },
  { label: "Pengaturan", href: "/settings", icon: Settings, description: "Profil & toko" },
];

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-bold leading-none text-brand-700 dark:text-brand-300">
            Laris.AI
          </p>
          <p className="text-xs text-muted-foreground">UMKM</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV_ITEMS.filter((item) => canAccess(item.href, role)).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", isActive && "text-brand-600")} />
              <div>
                <p className="font-medium">{item.label}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer: logout */}
      <div className="border-t p-4">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Keluar</span>
          </button>
        </form>
      </div>
    </div>
  );
}
