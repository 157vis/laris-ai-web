"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Building2, UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { defaultRouteForRole } from "@/lib/auth/rbac";
import type { UserRole } from "@/types/auth";

/**
 * Form registrasi UMKM baru.
 * Ref: bukuwarung-ai/setup_laris_ai.sql (kolom profile & role default)
 */
export function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Validasi dasar
    if (!fullName.trim() || !email || !password || !businessName.trim()) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          business_name: businessName.trim(),
          // Default role untuk UMKM baru: pemilik
          role: "pemilik" satisfies UserRole,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      toast.error("Gagal daftar", { description: signUpError.message });
      return;
    }

    // Auto-confirm ON (Supabase dev): langsung login
    if (data.session) {
      toast.success("Akun berhasil dibuat! 🎉", {
        description: "Selamat datang di Laris.AI",
      });
      startTransition(() => {
        router.push(defaultRouteForRole("pemilik"));
        router.refresh();
      });
      return;
    }

    // Email confirmation ON (production)
    toast.success("Cek email Anda! 📬", {
      description: "Kami mengirim link konfirmasi. Klik untuk aktivasi akun.",
      duration: 6000,
    });
    startTransition(() => router.push("/login"));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nama Lengkap</Label>
        <Input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="Bu Sari"
          leftIcon={<User className="h-4 w-4" />}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessName">Nama Toko / Warung</Label>
        <Input
          id="businessName"
          type="text"
          placeholder="Warung Sari Rasa"
          leftIcon={<Building2 className="h-4 w-4" />}
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          disabled={isPending}
          required
        />
      </div>

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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
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
          minLength={8}
        />
        <p className="text-xs text-muted-foreground">
          Gunakan minimal 8 karakter dengan kombinasi huruf & angka.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" loading={isPending}>
        {!isPending && <UserPlus className="h-4 w-4" />}
        Daftar Gratis
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Dengan mendaftar, Anda setuju dengan{" "}
        <a href="#" className="underline hover:text-foreground">
          Syarat & Ketentuan
        </a>{" "}
        kami.
      </p>
    </form>
  );
}
