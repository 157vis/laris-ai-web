import type { Metadata } from "next";
import { ProfileForm } from "@/components/forms/profile-form";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pengaturan",
  description: "Kelola profil dan toko UMKM Anda.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null; // layout sudah handle redirect

  const profile = {
    id: user.id,
    email: user.email ?? "",
    fullName: (user.user_metadata?.full_name as string | undefined) ?? "",
    businessName: (user.user_metadata?.business_name as string | undefined) ?? "",
    role: (user.app_metadata?.role as string | undefined) ?? "pemilik",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Pengaturan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola profil dan informasi toko UMKM Anda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil Saya</CardTitle>
          <CardDescription>
            Data ini ditampilkan di laporan & struk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keamanan Akun</CardTitle>
          <CardDescription>Ubah password dan kelola akses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Untuk mengganti password, gunakan link "Lupa password" di halaman masuk.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
