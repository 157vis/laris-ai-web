"use client";

import { Menu } from "lucide-react";
import { UserMenu } from "./user-menu";
import type { UserProfile } from "@/types/auth";

/**
 * Top bar dengan hamburger (mobile) + user menu.
 */
export function Header({
  user,
  onMenuClick,
}: {
  user: UserProfile;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur sm:px-6 lg:pl-72 lg:pr-8">
      {/* Mobile: hamburger */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 hover:bg-muted lg:hidden"
        aria-label="Buka menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Spacer untuk desktop */}
      <div className="hidden lg:block" />

      {/* User menu */}
      <UserMenu user={user} />
    </header>
  );
}
