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
    <div className="min-h-svh bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border/70 bg-card lg:block">
        <Sidebar role={user.role} />
      </aside>

      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={user.role}
      />

      <Header
        user={user}
        onMenuClick={() => setSidebarOpen(true)}
        sidebarOpen={sidebarOpen}
      />

      <main className="lg:pl-64">
        <div className="mx-auto max-w-[1480px] px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
          {children}
        </div>
      </main>

      <BottomNav role={user.role} />
    </div>
  );
}
