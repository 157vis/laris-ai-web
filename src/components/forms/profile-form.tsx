"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface ProfileData {
  id: string;
  email: string;
  fullName: string;
  businessName: string;
  role: string;
}

/**
 * Form edit profile.
 * FASE 1 hanya update user_metadata (nama & toko).
 * FASE berikutnya: tambah upload avatar (Supabase Storage).
 */
export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
        business_name: businessName.trim(),
      },
    });

    if (error) {
      toast.error("Gagal menyimpan", { description: error.message });
      return;
    }

    toast.success("Profil berhasil diperbarui ✅");
    startTransition(() => {
      // Refresh server component untuk update UI
      window.location.reload();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground">
          Email tidak dapat diubah. Hubungi support jika perlu ganti email.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Nama Lengkap</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isPending}
          required
          minLength={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessName">Nama Toko / Warung</Label>
        <Input
          id="businessName"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <Input value={profile.role} disabled className="bg-muted capitalize" />
        <p className="text-xs text-muted-foreground">
          Role dikelola oleh admin. Hubungi pemilik usaha untuk perubahan.
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={isPending}>
          {!isPending && <Save className="h-4 w-4" />}
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
