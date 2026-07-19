import {
  BarChart3,
  Boxes,
  Brain,
  CreditCard,
  MessageSquare,
  Smartphone,
  Users,
  Wallet,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Catat via WhatsApp",
    description:
      "Ketik 'Laku 3 kopi @ 5rb' di WhatsApp, otomatis tercatat. Tidak perlu install app baru, tidak perlu training karyawan.",
    color: "from-brand-400 to-emerald-500",
  },
  {
    icon: Brain,
    title: "AI Cerdas Bahasa Indonesia",
    description:
      "Paham bahasa sehari-hari: 'jajan', 'laku', 'beli stok', sampai singkatan 'rb' (ribu) dan 'jt' (juta).",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Boxes,
    title: "Stok Otomatis",
    description:
      "Stok berkurang saat ada penjualan, bertambah saat ada pembelian. Notifikasi WhatsApp saat stok mau habis.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Laporan KUR Otomatis",
    description:
      "Generate laporan keuangan bulanan format Excel/CSV yang siap kirim ke bank. Hemat 5 jam tiap bulan.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: Users,
    title: "Multi-role & Multi-cabang",
    description:
      "Pemilik, kasir, dan anggota koperasi punya akses berbeda. Cocok untuk warung jaringan atau koperasi UMKM.",
    color: "from-rose-400 to-red-500",
  },
  {
    icon: Smartphone,
    title: "PWA — Install Seperti App",
    description:
      "Tambah ke Home Screen HP, jalan offline, dapat notifikasi. Ringan, tidak makan storage.",
    color: "from-cyan-400 to-teal-500",
  },
  {
    icon: CreditCard,
    title: "Pembayaran QRIS",
    description:
      "Terima QRIS, e-wallet, dan transfer bank. Rekap otomatis masuk ke pembukuan.",
    color: "from-violet-400 to-purple-500",
  },
  {
    icon: Wallet,
    title: "Pisahkan Modal & Laba",
    description:
      "Tidak bingung lagi uang operasional vs uang pribadi. Laris.AI otomatis hitung laba bersih tiap minggu.",
    color: "from-lime-400 to-green-500",
  },
];

/**
 * Features Grid — Showcase 8 fitur utama Laris.AI.
 */
export function Features() {
  return (
    <section id="fitur" className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Fitur Lengkap
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Semua yang Warung Anda Butuhkan
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Dari catat jualan harian sampai laporan KUR bulanan — semuanya dalam satu aplikasi.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-md`}
              >
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
