import { AlertTriangle, BookX, FileQuestion, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: BookX,
    title: "Buku tulis berantakan",
    description:
      "Catatan kertas mudah hilang, basah, atau terbakar. Tidak ada jejak audit saat dibutuhkan.",
  },
  {
    icon: TrendingDown,
    title: "Stok tidak terkontrol",
    description:
      "Barang kosong di rak tanpa sadar, modal tertahan di gudang, pelanggan kecewa pergi.",
  },
  {
    icon: FileQuestion,
    title: "Laporan KUR ribet",
    description:
      "Petugas bank minta laporan keuangan bulanan, tapi Anda tidak sempat membuat Excel.",
  },
  {
    icon: AlertTriangle,
    title: "Tidak tahu laba bersih",
    description:
      "Pemasukan besar tapi rekening kosong? Tanpa pembukuan, Anda tidak tahu uang ke mana.",
  },
];

/**
 * Pain Points — Section yang menunjukkan masalah UMKM.
 * Tujuannya: buat visitor merasa "ini masalah saya juga" lalu tertarik dengan solusi.
 */
export function PainPoints() {
  return (
    <section className="bg-muted/30 px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Masalah UMKM Indonesia
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            4 Masalah yang Bikin Warung Anda Rugi Diam-Diam
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            64 juta UMKM di Indonesia masih mencatat transaksi secara manual. Akibatnya:
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p, i) => (
            <div
              key={p.title}
              className="group relative rounded-2xl border bg-background p-6 transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg dark:hover:border-brand-700"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <span className="absolute right-4 top-4 text-3xl font-bold text-muted-foreground/20">
                0{i + 1}
              </span>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-lg font-medium text-foreground">
          Laris.AI menyelesaikan semua itu — lewat WhatsApp yang sudah Anda pakai setiap hari.
        </p>
      </div>
    </section>
  );
}
