"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { defaultRouteForRole } from "@/lib/auth/rbac";
import type { UserRole } from "@/types/auth";

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
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      const msg =
        signInError.message === "Invalid login credentials"
          ? "Email atau password salah. Coba lagi ya."
          : signInError.message;
      setError(msg);
      toast.error("Gagal masuk", { description: msg });
      return;
    }

    if (!data.user) {
      setError("Gagal mendapatkan data pengguna.");
      return;
    }

    toast.success("Berhasil masuk! 🎉");

    startTransition(() => {
      // Tentukan redirect: param ?redirectTo, atau default sesuai role
      const role = (data.user.app_metadata?.role as UserRole | undefined) ?? "pemilik";
      const target = redirectTo || defaultRouteForRole(role);
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
