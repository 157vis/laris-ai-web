"use client";

import { Menu, Store } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserMenu } from "./user-menu";
import type { UserProfile } from "@/types/auth";

const PAGE_TITLES = [
  { href: "/dashboard/admin", title: "Pusat admin" },
  { href: "/dashboard/kas/new", title: "Kasir" },
  { href: "/dashboard/kas", title: "Buku kas" },
  { href: "/dashboard/produk", title: "Produk & stok" },
  { href: "/dashboard/laporan", title: "Laporan usaha" },
  { href: "/dashboard/ai-chat", title: "Asisten Laris.AI" },
  { href: "/settings", title: "Pengaturan" },
  { href: "/dashboard", title: "Ringkasan usaha" },
];

export function Header({
  user,
  onMenuClick,
  sidebarOpen,
}: {
  user: UserProfile;
  onMenuClick: () => void;
  sidebarOpen: boolean;
}) {
  const pathname = usePathname();
  const currentPage = PAGE_TITLES.find((page) =>
    page.href === "/dashboard"
      ? pathname === page.href
      : pathname === page.href || pathname.startsWith(`${page.href}/`)
  );

  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:pl-72 lg:pr-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex size-11 items-center justify-center rounded-xl border border-border/70 bg-card text-foreground transition-colors hover:bg-muted lg:hidden"
          aria-label="Buka menu navigasi"
          aria-controls="mobile-navigation"
          aria-expanded={sidebarOpen}
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0">
          <p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:block">
            Laris.AI · ruang kerja
          </p>
          <p className="truncate text-sm font-semibold sm:text-base">
            {currentPage?.title ?? "Dashboard"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-2 text-xs font-medium text-muted-foreground sm:flex">
          <Store className="size-4 text-brand-600" />
          Ruang usaha aktif
        </div>
        <UserMenu user={user} />
      </div>
    </header>
  );
}
