import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * CTA Section — Penutup sebelum footer dengan ajakan bertindak yang kuat.
 */
export function CtaSection() {
  return (
    <section className="relative overflow-hidden px-6 py-16 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-emerald-500 to-teal-500" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15),transparent_50%)]"
      />

      <div className="relative mx-auto max-w-4xl text-center text-white">
        <Sparkles className="mx-auto mb-4 h-10 w-10" />
        <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          Siap Bikin Warung Anda Lebih Cuan?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-white/90 sm:text-xl">
          Mulai gratis sekarang. Tidak perlu kartu kredit. Setup 60 detik.
          <br className="hidden sm:block" />
          Batal kapan saja, data tetap milik Anda.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-white text-brand-700 hover:bg-white/90"
          >
            <Link href="/register">
              Daftar Gratis Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <Link href="/login">Saya Sudah Punya Akun</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-white/80">
          ✨ 500+ UMKM sudah bergabung · ⭐ Rating 4.9/5
        </p>
      </div>
    </section>
  );
}
