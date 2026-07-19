"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Settings, User as UserIcon, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, type UserProfile } from "@/types/auth";
import { createClient } from "@/lib/supabase/client";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserMenu({ user }: { user: UserProfile }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    setIsLoggingOut(false);

    if (error) {
      toast.error("Gagal keluar", { description: error.message });
      return;
    }

    toast.success("Berhasil keluar");
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted"
      >
        <Avatar className="h-8 w-8">
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
          ) : null}
          <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
        </Avatar>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-tight">{user.fullName}</p>
          <p className="text-xs text-muted-foreground">{user.businessName ?? "UMKM"}</p>
        </div>
        <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full z-20 mt-2 w-64 origin-top-right rounded-xl border bg-card p-2 shadow-lg animate-fade-in">
            {/* User info */}
            <div className="border-b px-3 py-3">
              <p className="font-semibold">{user.fullName}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant="secondary">{ROLE_LABELS[user.role] ?? user.role}</Badge>
                {user.businessName && (
                  <Badge variant="outline">{user.businessName}</Badge>
                )}
              </div>
            </div>

            {/* Menu items */}
            <div className="space-y-0.5 pt-1">
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <UserIcon className="h-4 w-4" />
                Profil Saya
              </Link>
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <Settings className="h-4 w-4" />
                Pengaturan Toko
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t pt-1">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Keluar..." : "Keluar"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
