"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, BookOpen, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { canAccess } from "@/lib/auth/rbac";
import type { UserRole } from "@/types/auth";

/**
 * Bottom navigation untuk mobile (fixed di bawah).
 * Ref: brief FASE 1 — Bottom Navigation mobile-first dengan 4-5 menu utama.
 */
export function BottomNav({ role }: { role: UserRole }) {
  const pathname = usePathname();

  // Pilih 5 menu paling penting untuk mobile
  const items = [
    { label: "Beranda", href: "/dashboard", icon: LayoutDashboard },
    { label: "Kasir", href: "/dashboard/kas/new", icon: ShoppingCart },
    { label: "Kas", href: "/dashboard/kas", icon: BookOpen },
    { label: "AI", href: "/dashboard/ai-chat", icon: MessageSquare },
    { label: "Setting", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background shadow-lg lg:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          // Sembunyikan menu jika role tidak diizinkan
          if (!canAccess(item.href, role)) {
            return <div key={item.href} />;
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[60px] flex-col items-center justify-center gap-1 py-2 text-xs transition-colors",
                isActive
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive && "scale-110"
                )}
              />
              <span className={cn("font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
