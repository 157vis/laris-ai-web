"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { canAccess, defaultRouteForRole, isUserRole } from "@/lib/auth/rbac";

/**
 * Form login dengan Supabase Auth.
 * Ref: bukuwarung-ai/README.md (auth flow)
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(() =>
    searchParams.get("error") === "auth_callback"
      ? "Tautan verifikasi tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru."
      : null
  );
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    let signInResult: Awaited<
      ReturnType<ReturnType<typeof createClient>["auth"]["signInWithPassword"]>
    >;
    try {
      const supabase = createClient();
      signInResult = await supabase.auth.signInWithPassword({ email, password });
    } catch {
      const message = "Layanan login sedang bermasalah. Coba lagi beberapa saat.";
      setError(message);
      toast.error("Gagal masuk", { description: message });
      return;
    }

    const { data, error: signInError } = signInResult;
    if (signInError) {
      const message =
        signInError.code === "email_not_confirmed"
          ? "Konfirmasi email Anda sebelum masuk. Periksa kotak masuk dan folder spam."
          : signInError.code === "over_request_rate_limit"
            ? "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi."
            : "Email atau password salah. Coba lagi.";
      setError(message);
      toast.error("Gagal masuk", { description: message });
      return;
    }

    if (!data.user) {
      setError("Gagal mendapatkan data pengguna.");
      return;
    }

    toast.success("Berhasil masuk! 🎉");

    startTransition(() => {
      // Tentukan redirect: param ?redirectTo, atau default sesuai role
      const rawRole: unknown = data.user.app_metadata?.role;
      if (!isUserRole(rawRole)) {
        router.push("/access-denied");
        router.refresh();
        return;
      }

      let target = defaultRouteForRole(rawRole);
      if (redirectTo) {
        try {
          const requestedUrl = new URL(redirectTo, window.location.origin);
          if (
            requestedUrl.origin === window.location.origin &&
            canAccess(requestedUrl.pathname, rawRole)
          ) {
            target = `${requestedUrl.pathname}${requestedUrl.search}${requestedUrl.hash}`;
          }
        } catch {
          // Ignore malformed or external return URLs and use the role's home page.
        }
      }
      router.push(target);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nama@warung.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-brand-600 hover:underline"
          >
            Lupa?
          </Link>
        </div>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="pointer-events-auto"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          required
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" loading={isPending}>
        {!isPending && <LogIn className="h-4 w-4" />}
        Masuk
      </Button>
    </form>
  );
}

/**
 * Wrapper dengan Suspense untuk handle useSearchParams() di Next.js 14+.
 * Ref: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
 */
export function LoginFormWrapper() {
  return (
    <Suspense fallback={<div className="h-48 animate-pulse rounded-md bg-muted" />}>
      <LoginForm />
    </Suspense>
  );
}
