"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Building2,
  UserPlus,
  Eye,
  EyeOff,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { defaultRouteForRole } from "@/lib/auth/rbac";
import type { UserRole } from "@/types/auth";

type Industry = "toko" | "warung" | "koperasi" | "jasa" | "lainnya";

/**
 * Form registrasi UMKM baru.
 *
 * FASE 5.2: Setelah signUp sukses, server action otomatis insert:
 *   1. Row di `public.profiles` (dengan phone, industry, client_id)
 *   2. Row di `public.clients` (dengan client_id, name, owner_user_id, owner_phones)
 *
 * Ref: bukuwarung-ai/sql/fase_5_1_super_admin_schema.sql
 */
export function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState<Industry>("toko");
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
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Nomor WhatsApp minimal 10 digit.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    // Normalisasi phone ke format 628xxx (untuk Fonnte)
    const phoneNormalized = phone.replace(/\D/g, "");
    const phoneFonnte = phoneNormalized.startsWith("0")
      ? `62${phoneNormalized.slice(1)}`
      : phoneNormalized.startsWith("62")
      ? phoneNormalized
      : `62${phoneNormalized}`;

    const supabase = createClient();

    // 1) Sign up di auth.users
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          business_name: businessName.trim(),
          phone: phoneFonnte,
          industry,
          // Default role untuk UMKM baru: pemilik (atau anggota_koperasi jika koperasi)
          role:
            industry === "koperasi"
              ? ("anggota_koperasi" satisfies UserRole)
              : ("pemilik" satisfies UserRole),
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      toast.error("Gagal daftar", { description: signUpError.message });
      return;
    }

    // Auto-confirm ON (Supabase dev): langsung login → setup data
    if (data.session && data.user) {
      const userId = data.user.id;

      try {
        // 2) Insert ke clients (setup toko) — via service-role di server action
        //    Pakai RPC function supaya atomic & bisa dipanggil dari client
        const { error: rpcError } = await supabase.rpc("setup_new_tenant", {
          p_user_id: userId,
          p_email: email,
          p_full_name: fullName.trim(),
          p_business_name: businessName.trim(),
          p_phone: phoneFonnte,
          p_industry: industry,
        });

        if (rpcError) {
          // Non-fatal: profile akan dibuat via trigger handle_new_user
          console.warn("setup_new_tenant RPC gagal:", rpcError.message);
        }
      } catch (err) {
        console.warn("setup_new_tenant exception:", err);
      }

      toast.success("Akun berhasil dibuat! 🎉", {
        description: "Selamat datang di Laris.AI",
      });
      startTransition(() => {
        router.push(
          industry === "koperasi"
            ? defaultRouteForRole("anggota_koperasi")
            : defaultRouteForRole("pemilik")
        );
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
        <Label htmlFor="businessName">Nama Toko / Warung / Koperasi</Label>
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
        <Label htmlFor="industry">Jenis Usaha</Label>
        <select
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value as Industry)}
          disabled={isPending}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="toko">🏪 Toko / Retail</option>
          <option value="warung">🏬 Warung Kelontong</option>
          <option value="koperasi">🤝 Koperasi / Jaringan</option>
          <option value="jasa">🛠️ Jasa / Service</option>
          <option value="lainnya">📦 Lainnya</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Nomor WhatsApp</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="081234567890"
          leftIcon={<Phone className="h-4 w-4" />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isPending}
          required
        />
        <p className="text-xs text-muted-foreground">
          Untuk terima laporan & integrasi WhatsApp bot
        </p>
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
