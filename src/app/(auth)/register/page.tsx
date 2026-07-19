import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Daftar Akun",
  description: "Daftarkan warung atau toko UMKM Anda di Laris.AI gratis.",
};

export default function RegisterPage() {
  return (
    <Card className="w-full border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="space-y-1 px-0 sm:px-6">
        <CardTitle className="text-2xl">Mulai Gratis 🚀</CardTitle>
        <CardDescription>
          Daftarkan bisnis UMKM Anda — tanpa kartu kredit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0 sm:px-6">
        <RegisterForm />

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            atau
          </span>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
