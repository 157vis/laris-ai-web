"use client";

import { useState, useTransition } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Email wajib diisi.");
      return;
    }

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?reset=1`,
    });

    if (resetError) {
      setError(resetError.message);
      toast.error("Gagal kirim link", { description: resetError.message });
      return;
    }

    toast.success("Link reset terkirim! 📬", {
      description: "Cek inbox email Anda untuk instruksi selanjutnya.",
      duration: 6000,
    });
    startTransition(() => setEmail(""));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Terdaftar</Label>
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

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" loading={isPending}>
        {!isPending && <Send className="h-4 w-4" />}
        Kirim Link Reset
      </Button>
    </form>
  );
}
