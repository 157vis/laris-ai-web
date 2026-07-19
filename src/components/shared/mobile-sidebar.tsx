"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, ShoppingCart, BookOpen, Package, BarChart3, MessageSquare, Settings } from "lucide-react";
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

/**
 * Mobile drawer sidebar. Muncul saat hamburger diklik.
 */
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r bg-background shadow-xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <p className="text-lg font-bold text-brand-700 dark:text-brand-300">Laris.AI</p>
          <button
            onClick={onClose}
            aria-label="Tutup menu"
            className="rounded-lg p-2 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {NAV_ITEMS.filter((item) => canAccess(item.href, role)).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
