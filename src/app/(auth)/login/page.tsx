import type { Metadata } from "next";
import Link from "next/link";
import { LoginFormWrapper } from "@/components/forms/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun Laris.AI Anda untuk kelola bisnis UMKM.",
};

export default function LoginPage() {
  return (
    <Card className="w-full border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="space-y-1 px-0 sm:px-6">
        <CardTitle className="text-2xl">Selamat Datang Kembali 👋</CardTitle>
        <CardDescription>
          Masuk untuk kelola keuangan & stok warung Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0 sm:px-6">
        <LoginFormWrapper />

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            atau
          </span>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            Daftar gratis
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
