import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Layout untuk route group (auth): login, register, forgot-password.
 * Mobile-first: card di tengah, logo besar di atas.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-gradient-to-b from-brand-50 via-background to-background dark:from-brand-950/20">
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col px-6 py-8">
        {/* Logo & brand */}
        <Link href="/landing" className="mb-8 flex items-center gap-2 self-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-brand-700 dark:text-brand-300">
              Laris.AI
            </p>
            <p className="text-xs text-muted-foreground">Aset AI UMKM</p>
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center">{children}</div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Laris.AI · Dibuat untuk UMKM Indonesia 🇮🇩
        </p>
      </div>
    </div>
  );
}
