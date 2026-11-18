import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Layout untuk route group (auth): login, register, forgot-password.
 * Mobile-first: card di tengah, logo besar di atas.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-gradient-to-b from-secondary via-background to-background">
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col px-6 py-8">
        {/* Logo & brand */}
        <Link href="/landing" className="mb-8 flex items-center gap-2 self-start">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-primary">
              Laris.AI
            </p>
            <p className="text-xs text-muted-foreground">Kasir digital warung</p>
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center">{children}</div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Laris.AI · Dibuat untuk UMKM Indonesia
        </p>
      </div>
    </div>
  );
}
