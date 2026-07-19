import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Bu Siti Aminah",
    role: "Pemilik Warung Kelontong",
    location: "Depok, Jawa Barat",
    avatar: "S",
    rating: 5,
    quote:
      "Dulu saya catat di buku tulis, sering lupa dan basah kena hujan. Sekarang tinggal chat WA 'laku 3 kopi 5rb' langsung tercatat. Anak saya yang setting, 5 menit jadi!",
  },
  {
    name: "Pak Hartono",
    role: "Pemilik Toko Bangunan",
    location: "Surabaya, Jawa Timur",
    avatar: "H",
    rating: 5,
    quote:
      "Laporan KUR ke bank dulu makan waktu seharian bikin Excel. Sekarang tinggal download PDF dari dashboard, kirim ke bank, selesai. Hemat 5 jam sebulan!",
  },
  {
    name: "Mbak Rina",
    role: "Pemilik Kedai Kopi",
    location: "Bandung, Jawa Barat",
    avatar: "R",
    rating: 5,
    quote:
      "Yang paling saya suka: AI-nya paham bahasa Indonesia sehari-hari. 'Jajan 2 roti' langsung diproses. Tidak perlu bahasa kaku kayak software kasir mahal.",
  },
  {
    name: "Koperasi Maju Bersama",
    role: "Manajer Koperasi",
    location: "Yogyakarta",
    avatar: "K",
    rating: 5,
    quote:
      "Koperasi kami 45 anggota, masing-masing punya warung. Dengan Laris.AI, saya bisa lihat omset semua anggota dalam satu dashboard. Game-changer untuk koperasi!",
  },
  {
    name: "Pak Joko",
    role: "Pemilik Warung Sembako",
    location: "Semarang, Jawa Tengah",
    avatar: "J",
    rating: 5,
    quote:
      "Stok kopi sering kosong di rak, pelanggan kecewa. Sekarang kalau stok tinggal 5, langsung ada notifikasi WA. Auto-order ke supplier juga bisa.",
  },
  {
    name: "Bu Dewi",
    role: "Pemilik Toko Kosmetik",
    location: "Medan, Sumatera Utara",
    avatar: "D",
    rating: 5,
    quote:
      "Awalnya ragu karena gratis, tapi ternyata fiturnya lengkap banget. Sekarang upgrade ke Pro karena butuh laporan KUR. Worth it banget Rp 49rb!",
  },
];

/**
 * Testimonials — 6 testimoni dari berbagai tipe UMKM Indonesia.
 */
export function Testimonials() {
  return (
    <section id="testimoni" className="bg-muted/30 px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Testimoni Pengguna
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Dipercaya 500+ UMKM Indonesia
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Dari warung kelontong sampai koperasi — semuanya sudah merasakan mudahnya catat jualan.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative flex flex-col rounded-2xl border bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-brand-100 dark:text-brand-900" />

              <div className="mb-3 flex gap-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="flex-1 text-sm leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-4 flex items-center gap-3 border-t pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-emerald-500 text-sm font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
