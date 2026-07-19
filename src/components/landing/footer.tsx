import Link from "next/link";
import { Sparkles, Github, Twitter, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { WA_DISPLAY, CONTACT_EMAIL, waLink } from "@/lib/whatsapp";

const productLinks = [
  { label: "Fitur", href: "#fitur" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Harga", href: "#harga" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "FAQ", href: "#faq" },
];

const companyLinks = [
  { label: "Tentang Kami", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Kontak", href: "/contact" },
];

const legalLinks = [
  { label: "Kebijakan Privasi", href: "/privacy" },
  { label: "Syarat & Ketentuan", href: "/terms" },
  { label: "Kebijakan Cookie", href: "/cookies" },
];

const socialLinks = [
  { label: `WhatsApp ${WA_DISPLAY}`, href: waLink(), icon: MessageCircle },
  { label: `Email ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}`, icon: Mail },
  { label: "Instagram", href: "https://instagram.com/laris.ai", icon: Instagram },
  { label: "Twitter", href: "https://twitter.com/laris_ai", icon: Twitter },
  { label: "GitHub", href: "https://github.com/157vis/laris-ai-web", icon: Github },
];

/**
 * Footer — Multi-kolom dengan link produk, perusahaan, legal, dan sosial media.
 * Kontak utama: WhatsApp 0821-1282-6851, halo@larisai.my.id
 */
export function Footer() {
  return (
    <footer className="border-t bg-muted/30 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">Laris.AI</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              AI kasir pintar untuk UMKM Indonesia. Catat penjualan via WhatsApp,
              kelola stok otomatis, dan lapor KUR tanpa ribet.
            </p>

            {/* Kontak WhatsApp */}
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
            >
              <Phone className="h-4 w-4" />
              Daftar via WhatsApp: {WA_DISPLAY}
            </a>

            <div className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 dark:hover:text-brand-400"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Produk */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Produk</h4>
            <ul className="space-y-2 text-sm">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Perusahaan</h4>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} Laris.AI · larisai.my.id · Dibuat untuk UMKM Indonesia 🇮🇩
          </p>
          <p>
            Powered by{" "}
            <span className="font-medium text-foreground">Next.js</span>,{" "}
            <span className="font-medium text-foreground">Supabase</span>, &{" "}
            <span className="font-medium text-foreground">Vercel</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
