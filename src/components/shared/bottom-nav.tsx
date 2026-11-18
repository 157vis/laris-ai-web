"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, BookOpen, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { canAccess } from "@/lib/auth/rbac";
import type { UserRole } from "@/types/auth";

export function BottomNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = [
    { label: "Beranda", href: "/dashboard", icon: LayoutDashboard },
    { label: "Kasir", href: "/dashboard/kas/new", icon: ShoppingCart },
    { label: "Kas", href: "/dashboard/kas", icon: BookOpen },
    { label: "AI", href: "/dashboard/ai-chat", icon: MessageSquare },
    { label: "Setting", href: "/settings", icon: Settings },
  ].filter((item) => canAccess(item.href, role));

  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/95 shadow-[0_-8px_24px_-18px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden"
    >
      <div className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => {
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
                "relative flex min-h-[64px] flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] transition-colors",
                isActive ? "font-semibold text-brand-700 dark:text-brand-300" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && <span className="absolute inset-x-5 top-0 h-0.5 rounded-b-full bg-brand-600" />}
              <Icon className={cn("size-[18px] transition-transform", isActive && "-translate-y-0.5")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
