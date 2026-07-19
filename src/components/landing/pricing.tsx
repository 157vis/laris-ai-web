import Link from "next/link";
import { Check, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Pemilik Warung",
    price: "Gratis",
    priceSuffix: "selamanya",
    description: "Untuk warung kecil yang baru mulai catat jualan digital.",
    cta: "Mulai Gratis",
    href: "/register",
    highlighted: false,
    features: [
      "1 toko / 1 pengguna",
      "Catat transaksi via WhatsApp (50/bulan)",
      "Stok otomatis hingga 30 produk",
      "Laporan omset harian & mingguan",
      "Dashboard web & PWA mobile",
      "Komunitas Telegram support",
    ],
  },
  {
    name: "Pemilik Pro",
    price: "Rp 49rb",
    priceSuffix: "/bulan",
    description: "Untuk warung berkembang & butuh laporan lengkap.",
    cta: "Coba 14 Hari Gratis",
    href: "/register?plan=pro",
    highlighted: true,
    badge: "PALING LARIS",
    features: [
      "1 toko / 3 pengguna (pemilik + 2 kasir)",
      "Transaksi WhatsApp unlimited",
      "Stok unlimited + notifikasi stok habis",
      "Laporan KUR otomatis (Excel/PDF)",
      "Multi-metode bayar (tunai, QRIS, transfer)",
      "Export data ke Excel/CSV",
      "Priority WhatsApp support",
    ],
  },
  {
    name: "Koperasi / Jaringan",
    price: "Custom",
    priceSuffix: "hubungi kami",
    description: "Untuk koperasi, franchise, atau jaringan 5+ warung.",
    cta: "Hubungi Sales",
    href: "/register?plan=enterprise",
    highlighted: false,
    features: [
      "Multi-cabang unlimited",
      "Pengguna unlimited + RBAC lengkap",
      "Dashboard konsolidasi lintas cabang",
      "API integrasi ke sistem akuntansi",
      "Onboarding & training tim",
      "SLA & support dedicated",
      "White-label opsional",
    ],
  },
];

/**
 * Pricing — 3 tier dengan highlight di plan tengah (Pro).
 */
export function Pricing() {
  return (
    <section id="harga" className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Harga
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Mulai Gratis, Upgrade Kapan Saja
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Tidak ada biaya tersembunyi. Batal kapan saja, data Anda tetap milik Anda.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col rounded-3xl border p-8 transition-all",
                tier.highlighted
                  ? "border-brand-500 bg-gradient-to-b from-brand-50 to-background shadow-xl ring-2 ring-brand-500 dark:from-brand-950/40"
                  : "bg-background hover:border-brand-300 hover:shadow-lg"
              )}
            >
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-emerald-500 px-3 py-1 text-white shadow-md">
                  <Sparkles className="mr-1 h-3 w-3" />
                  {tier.badge}
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span
                  className={cn(
                    "text-4xl font-extrabold tracking-tight",
                    tier.highlighted && "text-brand-600 dark:text-brand-400"
                  )}
                >
                  {tier.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {tier.priceSuffix}
                </span>
              </div>

              <Button
                asChild
                variant={tier.highlighted ? "default" : "outline"}
                size="lg"
                className="mb-6 w-full"
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>

              <ul className="space-y-3 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 flex-shrink-0",
                        tier.highlighted
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-brand-500"
                      )}
                    />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              {tier.highlighted && (
                <div className="mt-6 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>Dipilih 78% pengguna aktif</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
          💳 Pembayaran via QRIS, transfer bank, atau e-wallet. Faktur otomatis.
          <br />
          Semua paket sudah termasuk update fitur gratis selamanya.
        </p>
      </div>
    </section>
  );
}
