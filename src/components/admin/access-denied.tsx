import Link from "next/link";
import { ShieldOff, ArrowLeft, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Tampilan ketika user mencoba akses Super Admin Console tapi rolenya
 * bukan 'admin'. Lebih baik render UI ini daripada redirect silent —
 * user jadi tahu apa yang salah.
 */
export function AccessDenied({ currentRole, userEmail }: { currentRole?: string; userEmail?: string }) {
  return (
    <div className="space-y-6">
      <Card className="border-rose-300 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
            <ShieldOff className="h-6 w-6" />
            Akses Ditolak
          </CardTitle>
          <CardDescription>
            Anda tidak punya izin untuk membuka halaman Super Admin Console.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-rose-200 bg-white/60 p-4 text-sm dark:bg-rose-950/20">
            <p className="font-medium text-rose-900 dark:text-rose-200">
              Halaman ini hanya untuk user dengan role <span className="font-mono font-bold">admin</span>.
            </p>
            <ul className="mt-3 space-y-1 text-rose-800 dark:text-rose-300">
              <li>
                <span className="font-medium">Email:</span> {userEmail ?? "—"}
              </li>
              <li>
                <span className="font-medium">Role saat ini:</span>{" "}
                <span className="font-mono">{currentRole ?? "pemilik"}</span>
              </li>
            </ul>
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Kalau Anda seharusnya jadi admin:</p>
            <ol className="ml-5 mt-2 list-decimal space-y-1">
              <li>Cek email Anda di tabel <span className="font-mono">public.profiles</span></li>
              <li>Pastikan kolom <span className="font-mono">role = &apos;admin&apos;</span></li>
              <li>
                Jalankan SQL:{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">
                  sql/sync_role_to_app_metadata.sql
                </code>
              </li>
              <li>Logout lalu login ulang supaya JWT token refresh</li>
            </ol>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild variant="default">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login Ulang
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
