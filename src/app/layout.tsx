import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import {
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Ref: bukuwarung-ai/app.py + bukuwarung-ai/README.md (brand Laris.AI)
// Metadata SEO konsisten untuk seluruh aplikasi
export const metadata: Metadata = {
  metadataBase: new URL("https://larisai.id"),
  title: {
    default: "Laris.AI — Aset AI untuk UMKM Indonesia",
    template: "%s | Laris.AI",
  },
  description:
    "Catat penjualan, kelola stok, dan lapor KUR otomatis lewat WhatsApp. Dirancang khusus untuk warung, toko kelontong, dan UMKM Indonesia.",
  keywords: [
    "AI kasir UMKM",
    "aplikasi kasir WhatsApp",
    "pencatatan keuangan UMKM",
    "laporan KUR",
    "Laris.AI",
  ],
  authors: [{ name: "Laris.AI" }],
  creator: "Laris.AI",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Laris.AI",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://larisai.id",
    siteName: "Laris.AI",
    title: "Laris.AI — Aset AI untuk UMKM Indonesia",
    description:
      "Catat penjualan, kelola stok, dan lapor KUR otomatis lewat WhatsApp.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#064e3b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data untuk SEO Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd()),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
