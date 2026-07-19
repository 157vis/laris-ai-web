import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { PainPoints } from "@/components/landing/pain-points";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { Faq } from "@/components/landing/faq";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { faqJsonLd } from "@/lib/seo";

// FAQ data harus sama dengan di faq.tsx agar JSON-LD valid
const landingFaqs = [
  {
    q: "Apa itu Laris.AI?",
    a: "Laris.AI adalah aplikasi kasir pintar berbasis WhatsApp untuk UMKM Indonesia. Anda cukup mengetik transaksi sehari-hari di WhatsApp, AI kami akan otomatis mencatat, update stok, dan generate laporan keuangan.",
  },
  {
    q: "Apakah benar-benar gratis?",
    a: "Ya! Paket Pemilik Warung gratis selamanya untuk 1 toko & 1 pengguna, dengan 50 transaksi/bulan via WhatsApp. Upgrade ke Pro (Rp 49rb/bulan) kapan saja.",
  },
  {
    q: "Bagaimana cara kerjanya?",
    a: "Anda sambungkan nomor WhatsApp yang sudah dipakai sehari-hari ke akun Laris.AI. Setelah itu, chat ke nomor Laris.AI untuk catat transaksi. AI otomatis memproses bahasa sehari-hari Indonesia.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Data disimpan di Supabase (PostgreSQL enterprise-grade, ISO 27001). Enkripsi end-to-end, backup otomatis harian, server di Singapore. Anda 100% pemilik data.",
  },
  {
    q: "Bagaimana dengan laporan KUR?",
    a: "Laporan KUR Laris.AI mengikuti format standar bank BUMN (BRI, BNI, Mandiri): omset bulanan, neraca, arus kas. Format Excel/CSV siap upload ke sistem bank.",
  },
  {
    q: "Apakah perlu koneksi internet terus?",
    a: "Untuk catat via WhatsApp butuh internet. Untuk lihat dashboard, Laris.AI adalah PWA — bisa dibuka offline. Setelah online, data sync otomatis.",
  },
  {
    q: "Bagaimana jika tidak paham teknologi?",
    a: "Justru itu kelebihannya! Cukup chat WhatsApp seperti biasa. Tim support via WhatsApp 24/7 siap bantu.",
  },
  {
    q: "Bisa dipakai untuk usaha apa saja?",
    a: "Fleksibel untuk hampir semua UMKM: warung kelontong, toko bangunan, kedai kopi, toko kosmetik, distributor, sampai koperasi dengan banyak anggota.",
  },
  {
    q: "Apakah ada kontrak atau biaya tersembunyi?",
    a: "Tidak ada kontrak, tidak ada biaya tersembunyi. Paket gratis = gratis selamanya. Pro = Rp 49rb/bulan, bisa berhenti kapan saja.",
  },
];

// SEO metadata khusus landing page (override metadata default dari layout.tsx)
export const metadata: Metadata = {
  title: "Laris.AI — AI Kasir WhatsApp untuk UMKM Indonesia | Catat Jualan Otomatis",
  description:
    "Catat penjualan via WhatsApp, kelola stok otomatis, dan lapor KUR tanpa ribet. AI kasir pintar untuk 500+ UMKM Indonesia. Gratis selamanya untuk 1 toko. Setup 60 detik.",
  keywords: [
    "AI kasir UMKM",
    "aplikasi kasir WhatsApp",
    "aplikasi kasir Indonesia",
    "pencatatan keuangan UMKM",
    "laporan KUR otomatis",
    "stok barang otomatis",
    "software kasir gratis",
    "Laris.AI",
    "aplikasi warung",
    "aplikasi toko kelontong",
    "POS Indonesia",
    "manajemen stok Indonesia",
  ],
  openGraph: {
    title: "Laris.AI — AI Kasir WhatsApp untuk UMKM Indonesia",
    description:
      "Catat penjualan via WhatsApp, kelola stok otomatis, dan lapor KUR tanpa ribet. Gratis selamanya untuk 1 toko.",
    url: "https://larisai.id/landing",
    siteName: "Laris.AI",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Laris.AI — AI Kasir WhatsApp untuk UMKM Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laris.AI — AI Kasir WhatsApp UMKM Indonesia",
    description:
      "Catat penjualan via WhatsApp, kelola stok otomatis, lapor KUR tanpa ribet. Gratis selamanya!",
    images: ["/og-image.png"],
    creator: "@laris_ai",
  },
  alternates: {
    canonical: "https://larisai.id/landing",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Landing page publik lengkap — FASE 2.
 * Susunan section: Hero → Pain Points → Features → How It Works → Pricing → Testimoni → FAQ → CTA → Footer.
 */
export default function LandingPage() {
  return (
    <>
      {/* FAQ JSON-LD untuk Google rich snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(landingFaqs)),
        }}
      />
      <main className="min-h-svh bg-background">
        <Hero />
        <PainPoints />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <Faq />
        <CtaSection />
        <Footer />
      </main>
    </>
  );
}
