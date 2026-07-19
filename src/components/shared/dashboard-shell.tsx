"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { Header } from "./header";
import { MobileSidebar } from "./mobile-sidebar";
import type { UserProfile } from "@/types/auth";

/**
 * Shell untuk semua halaman dashboard.
 * Mobile-first: bottom-nav di mobile, sidebar di desktop.
 * Ref: brief FASE 1 — Bottom Navigation fixed bar untuk mobile.
 */
export function DashboardShell({
  user,
  children,
}: {
  user: UserProfile;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-svh bg-muted/30">
      {/* Sidebar: tampil di desktop, tersembunyi di mobile (jadi drawer) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background lg:block">
        <Sidebar role={user.role} />
      </aside>

      {/* Mobile sidebar drawer */}
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={user.role}
      />

      {/* Header (top bar) */}
      <Header user={user} onMenuClick={() => setSidebarOpen(true)} />

      {/* Main content: offset untuk sidebar desktop & bottom-nav mobile */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          {children}
        </div>
      </main>

      {/* Bottom nav: tampil di mobile & tablet, hidden di desktop */}
      <BottomNav role={user.role} />
    </div>
  );
}
