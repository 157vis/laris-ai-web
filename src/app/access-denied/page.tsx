import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Akses belum tersedia",
  robots: { index: false, follow: false },
};

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <CardTitle>Hak akses belum tersedia</CardTitle>
          <CardDescription>
            Role akun belum dapat diverifikasi. Keluar lalu masuk kembali agar sesi terbaru dimuat.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <form action="/api/auth/logout" method="post">
            <Button type="submit" className="w-full">
              Keluar dan masuk kembali
            </Button>
          </form>
          <Button asChild variant="outline" className="w-full">
            <Link href="/landing">Kembali ke beranda</Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Jika pesan ini tetap muncul setelah masuk kembali, minta admin memeriksa role akun Anda.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
