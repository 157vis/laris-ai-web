import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Lupa Password",
  description: "Reset password akun Laris.AI Anda.",
};

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="space-y-1 px-0 sm:px-6">
        <CardTitle className="text-2xl">Lupa Password? 🔑</CardTitle>
        <CardDescription>
          Masukkan email Anda, kami akan kirim link untuk reset password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0 sm:px-6">
        <ForgotPasswordForm />

        <p className="text-center text-sm text-muted-foreground">
          Ingat password-nya?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Kembali ke halaman masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
