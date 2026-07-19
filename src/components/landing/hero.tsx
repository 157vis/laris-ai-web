import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Hero Section — Laris.AI landing page
 * Headline kuat, social proof (rating & jumlah pengguna), dual CTA, dan mockup chat WhatsApp.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-background to-background px-6 py-16 dark:from-brand-950/30 sm:py-24 lg:py-32">
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-32 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-700/20"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left: copy */}
        <div>
          <Badge
            variant="outline"
            className="mb-5 border-brand-300 bg-brand-50 px-3 py-1 text-brand-700 dark:border-brand-700 dark:bg-brand-950/50 dark:text-brand-300"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            AI Kasir #1 untuk UMKM Indonesia
          </Badge>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Catat Penjualan via{" "}
            <span className="bg-gradient-to-r from-brand-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              WhatsApp
            </span>
            <br />
            Kelola Warung dari{" "}
            <span className="bg-gradient-to-r from-brand-500 to-emerald-600 bg-clip-text text-transparent">
              Satu Tempat
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl">
            AI kasir pintar untuk UMKM Indonesia. Catat transaksi, kelola stok, dan lapor KUR —
            semuanya otomatis lewat chat WhatsApp yang sudah Anda pakai setiap hari.
          </p>

          {/* Social proof */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="font-medium text-foreground">4.9/5</span>
              <span>dari 500+ pengguna</span>
            </div>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-brand-500" />
              <span>Setup 60 detik</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="text-base">
              <Link href="/register">
                Daftar Gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link href="/login">Sudah Punya Akun</Link>
            </Button>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            ✨ Gratis selamanya untuk 1 toko · Tidak perlu kartu kredit
          </p>
        </div>

        {/* Right: WhatsApp mockup */}
        <div className="relative">
          <div className="relative mx-auto w-full max-w-sm rounded-[2.5rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl dark:border-zinc-700">
            {/* Notch */}
            <div className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />
            {/* Screen */}
            <div className="overflow-hidden rounded-[1.7rem] bg-[#ECE5DD] dark:bg-[#0b141a]">
              {/* Header */}
              <div className="flex items-center gap-3 bg-brand-600 px-4 py-3 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                  W
                </div>
                <div>
                  <p className="text-sm font-semibold">Warung Bu Siti</p>
                  <p className="text-xs text-white/80">online</p>
                </div>
              </div>
              {/* Messages */}
              <div className="space-y-2 p-4">
                <div className="ml-auto max-w-[80%] rounded-lg rounded-tr-sm bg-[#dcf8c6] px-3 py-2 text-sm text-zinc-900 shadow-sm dark:bg-[#005c4b] dark:text-zinc-100">
                  Laku 3 kopi @ 5rb
                </div>
                <div className="max-w-[85%] rounded-lg rounded-tl-sm bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm dark:bg-[#202c33] dark:text-zinc-100">
                  <p className="mb-1 font-semibold text-brand-700 dark:text-brand-300">
                    ✅ Tercatat!
                  </p>
                  <p className="text-xs">
                    + Rp 15.000 · Kopi: 3
                    <br />
                    Stok kopi sisa: 27
                    <br />
                    Omset hari ini: Rp 245.000
                  </p>
                </div>
                <div className="ml-auto max-w-[80%] rounded-lg rounded-tr-sm bg-[#dcf8c6] px-3 py-2 text-sm text-zinc-900 shadow-sm dark:bg-[#005c4b] dark:text-zinc-100">
                  Beli stok kopi 50rb
                </div>
                <div className="max-w-[85%] rounded-lg rounded-tl-sm bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm dark:bg-[#202c33] dark:text-zinc-100">
                  <p className="text-xs">
                    📦 Stok kopi +10
                    <br />
                    💸 Pengeluaran: Rp 50.000
                    <br />
                    📊 Laba bersih minggu ini: Rp 1.2jt
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -left-4 top-12 hidden rounded-2xl border bg-background p-3 shadow-lg sm:flex sm:items-center sm:gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
              <MessageCircle className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-xs font-semibold">Auto-catat</p>
              <p className="text-[10px] text-muted-foreground">dari chat WA</p>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-2 hidden rounded-2xl border bg-background p-3 shadow-lg sm:flex sm:items-center sm:gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
              <span className="text-base">📊</span>
            </div>
            <div>
              <p className="text-xs font-semibold">Laporan KUR</p>
              <p className="text-[10px] text-muted-foreground">otomatis tiap bulan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
