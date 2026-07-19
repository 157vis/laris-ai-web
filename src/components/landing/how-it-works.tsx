import { MessageSquare, UserPlus, Sparkles } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Daftar Gratis",
    description:
      "Buat akun dengan email & nomor WhatsApp Anda. Proses 60 detik, tidak perlu kartu kredit.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Chat WhatsApp",
    description:
      "Sambungkan nomor WhatsApp Anda. Mulai ketik transaksi seperti biasa — AI kami yang proses.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Pantau di Dashboard",
    description:
      "Lihat omset, stok, laba bersih, dan laporan KUR dalam satu layar. Export PDF/Excel kapan saja.",
  },
];

/**
 * How It Works — 3 langkah sederhana untuk memulai.
 */
export function HowItWorks() {
  return (
    <section id="cara-kerja" className="bg-muted/30 px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Cara Kerja
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Mulai dalam 3 Langkah
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Tidak perlu training, tidak perlu ganti sistem. Laris.AI langsung nyambung.
          </p>
        </div>

        <div className="relative mt-12 grid gap-8 lg:grid-cols-3">
          {/* Connector line (desktop only) */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent lg:block"
          />

          {steps.map((s) => (
            <div
              key={s.step}
              className="relative rounded-2xl border bg-background p-8 text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-emerald-500 text-white shadow-lg">
                <s.icon className="h-8 w-8" />
              </div>
              <div className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                LANGKAH {s.step}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
