"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Apa itu Laris.AI?",
    a: "Laris.AI adalah aplikasi kasir pintar berbasis WhatsApp untuk UMKM Indonesia. Anda cukup mengetik transaksi sehari-hari di WhatsApp (misal 'Laku 3 kopi 5rb'), AI kami akan otomatis mencatat, update stok, dan generate laporan keuangan. Tidak perlu install app baru, tidak perlu training karyawan.",
  },
  {
    q: "Apakah benar-benar gratis?",
    a: "Ya! Paket Pemilik Warung gratis selamanya untuk 1 toko & 1 pengguna, dengan 50 transaksi/bulan via WhatsApp. Anda bisa upgrade ke paket Pro (Rp 49rb/bulan) kapan saja untuk fitur lengkap seperti laporan KUR otomatis, unlimited transaksi, dan multi-user.",
  },
  {
    q: "Bagaimana cara kerjanya? Apakah harus ganti nomor WhatsApp?",
    a: "Tidak perlu ganti nomor. Anda sambungkan nomor WhatsApp yang sudah dipakai sehari-hari ke akun Laris.AI. Setelah itu, chat ke nomor Laris.AI untuk catat transaksi. Atau, Anda bisa invite Laris.AI ke grup WhatsApp warung Anda.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Sangat aman. Data disimpan di Supabase (PostgreSQL enterprise-grade, dipakai oleh perusahaan Fortune 500). Enkripsi end-to-end, backup otomatis harian, dan server di Singapore (compliance ISO 27001). Anda 100% pemilik data, bisa export semua kapan saja.",
  },
  {
    q: "Bagaimana dengan laporan KUR? Apakah formatnya sesuai bank?",
    a: "Laporan KUR Laris.AI mengikuti format standar yang diminta bank-bank BUMN (BRI, BNI, Mandiri, dll): laporan omset bulanan, neraca sederhana, dan arus kas. Format Excel/CSV siap upload ke sistem bank. Anda tinggal download → kirim ke bank.",
  },
  {
    q: "Apakah perlu koneksi internet terus?",
    a: "Untuk catat transaksi via WhatsApp, butuh internet. Tapi untuk lihat dashboard (history, laporan), Laris.AI adalah PWA — bisa dibuka offline dengan data yang sudah di-cache. Setelah online lagi, data akan sync otomatis.",
  },
  {
    q: "Bagaimana jika saya tidak paham teknologi?",
    a: "Justru itu kelebihannya! Laris.AI dirancang untuk orang yang tidak paham teknologi. Tidak perlu install software, tidak perlu belajar menu-menu ribet. Cukup chat WhatsApp seperti biasa. Kalau bingung, ada tim support via WhatsApp 24/7.",
  },
  {
    q: "Apakah Laris.AI support bahasa daerah?",
    a: "AI kami dilatih dengan bahasa Indonesia sehari-hari termasuk slang dan singkatan (rb=ribu, jt=juta, jajan=jual, dll). Untuk bahasa daerah spesifik (Jawa, Sunda, dll), saat ini masih dalam tahap pengembangan. Tapi bahasa Indonesia sehari-hari sudah sangat dipahami.",
  },
  {
    q: "Bisa dipakai untuk usaha apa saja?",
    a: "Laris.AI fleksibel untuk hampir semua jenis UMKM: warung kelontong, toko bangunan, kedai kopi, toko kosmetik, distributor, jasa, sampai koperasi dengan banyak anggota. Yang penting Anda punya produk/jasa yang dijual per unit dan perlu catat stok.",
  },
  {
    q: "Apakah ada kontrak atau biaya tersembunyi?",
    a: "Tidak ada kontrak, tidak ada biaya tersembunyi. Paket gratis = gratis selamanya. Paket Pro = Rp 49rb/bulan, bisa berhenti kapan saja. Tidak ada setup fee, tidak ada minimum transaksi, tidak ada penalti pembatalan.",
  },
];

/**
 * FAQ Section — Accordion dengan state client-side.
 */
export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            FAQ
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Pertanyaan yang Sering Ditanya
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Belum menemukan jawabannya? Hubungi kami via WhatsApp.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-background transition-all",
                  isOpen && "border-brand-300 shadow-sm dark:border-brand-700"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium">{faq.q}</span>
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
