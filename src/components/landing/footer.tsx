import Link from "next/link";
import { Sparkles, Github, Twitter, Instagram, Mail, MessageCircle } from "lucide-react";

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
  { label: "Karir", href: "/careers" },
  { label: "Kontak", href: "/contact" },
];

const legalLinks = [
  { label: "Kebijakan Privasi", href: "/privacy" },
  { label: "Syarat & Ketentuan", href: "/terms" },
  { label: "Kebijakan Cookie", href: "/cookies" },
];

const socialLinks = [
  { label: "WhatsApp", href: "https://wa.me/628123456789", icon: MessageCircle },
  { label: "Email", href: "mailto:halo@larisai.id", icon: Mail },
  { label: "Instagram", href: "https://instagram.com/laris.ai", icon: Instagram },
  { label: "Twitter", href: "https://twitter.com/laris_ai", icon: Twitter },
  { label: "GitHub", href: "https://github.com/laris-ai", icon: Github },
];

/**
 * Footer — Multi-kolom dengan link produk, perusahaan, legal, dan sosial media.
 */
export function Footer() {
  return (
    <footer className="border-t bg-muted/30 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/landing" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">Laris.AI</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              AI kasir pintar untuk UMKM Indonesia. Catat penjualan via WhatsApp,
              kelola stok otomatis, dan lapor KUR tanpa ribet.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
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
            © {new Date().getFullYear()} Laris.AI · Dibuat untuk UMKM Indonesia 🇮🇩
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
