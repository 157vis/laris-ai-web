import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Hero Section — Laris.AI landing page
 * Headline kuat, social proof (rating & jumlah pengguna), dual CTA, dan mockup chat WhatsApp.
 */
export function Hero() {
  return (
    <section className="overflow-hidden bg-primary text-primary-foreground">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/landing" className="flex items-center gap-3" aria-label="Laris.AI beranda">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <ShoppingBag className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">Laris<span className="text-emerald-200">.AI</span></span>
        </Link>
        <nav aria-label="Navigasi utama" className="hidden items-center gap-8 text-sm text-white/75 md:flex">
          <a className="transition-colors hover:text-white" href="#fitur">Fitur</a>
          <a className="transition-colors hover:text-white" href="#cara-kerja">Cara kerja</a>
          <a className="transition-colors hover:text-white" href="#harga">Harga</a>
          <a className="transition-colors hover:text-white" href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="inline-flex rounded-full px-2 py-2.5 text-xs font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white sm:px-4 sm:text-sm">
            Masuk
          </Link>
          <Button asChild className="rounded-full bg-white px-5 text-primary hover:bg-white/90">
            <Link href="/register">Coba gratis <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-14 pt-8 sm:px-8 sm:pb-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-12 lg:pb-24 lg:pt-12">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-2 text-xs font-medium text-emerald-100 sm:text-sm">
            <Sparkles className="size-4" aria-hidden="true" />
            Kasir pintar yang paham cara kerja warung
          </div>
          <h1 className="max-w-xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Jualan lancar. Catatan rapi. <span className="text-emerald-200">Pikiran lega.</span>
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            Catat penjualan cukup lewat WhatsApp. Laris.AI bantu urus stok, hitung laba, dan siapkan laporan usaha — tanpa cara kerja yang ribet.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full bg-emerald-200 px-6 text-primary hover:bg-emerald-100">
              <Link href="/register">Mulai gratis <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/25 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
              <a href="#cara-kerja">Lihat cara kerja</a>
            </Button>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-white/65 sm:text-sm">
            <span className="inline-flex items-center gap-2"><Check className="size-4 text-emerald-200" aria-hidden="true" />Gratis untuk mulai</span>
            <span className="inline-flex items-center gap-2"><Check className="size-4 text-emerald-200" aria-hidden="true" />Tidak perlu kartu kredit</span>
            <span className="inline-flex items-center gap-2"><Check className="size-4 text-emerald-200" aria-hidden="true" />Siap dalam 60 detik</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl pb-7 pl-0 sm:pl-7">
          <div className="relative aspect-[1.12/1] overflow-hidden rounded-[2rem] bg-emerald-950 shadow-2xl shadow-black/20 sm:aspect-[1.18/1] sm:rounded-[2.5rem]">
            <Image
              src="/images/warung-owner-hero.png"
              alt="Pemilik warung Indonesia mencatat penjualan menggunakan ponsel di tokonya"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 54vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-emerald-950/10" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 text-white sm:bottom-7 sm:left-7 sm:right-7">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-100/80">Teman usaha setiap hari</p>
                <p className="mt-1 text-lg font-semibold sm:text-xl">Dari chat jadi catatan rapi.</p>
              </div>
              <span className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur sm:flex">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="absolute -left-1 top-7 hidden w-52 rounded-2xl border border-border/70 bg-card p-4 text-card-foreground shadow-xl sm:block lg:-left-2">
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary"><BarChart3 className="size-4" aria-hidden="true" /></span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary"><TrendingUp className="size-3.5" aria-hidden="true" />Hari ini</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Omset tercatat</p>
            <p className="mt-0.5 text-xl font-semibold tracking-tight">Rp 1.245.000</p>
            <p className="mt-1 text-xs text-muted-foreground">12 transaksi dari WhatsApp</p>
          </div>

          <div className="absolute -bottom-1 right-0 flex max-w-[17rem] items-center gap-3 rounded-2xl border border-border/70 bg-card p-3.5 text-card-foreground shadow-xl sm:right-4 sm:p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><MessageCircle className="size-5" aria-hidden="true" /></span>
            <div className="min-w-0">
              <p className="text-xs font-semibold">Pesan WhatsApp</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">&quot;Laku 3 kopi, lima ribu&quot;</p>
            </div>
            <span className="ml-auto size-2 shrink-0 rounded-full bg-primary" aria-label="Tercatat" />
          </div>
        </div>
      </div>
    </section>
  );
}
