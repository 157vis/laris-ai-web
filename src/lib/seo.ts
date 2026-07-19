/**
 * SEO utility: JSON-LD structured data untuk Laris.AI.
 * Dipakai di layout.tsx untuk Organization + di landing page untuk Product/FAQ.
 */

const SITE_URL = "https://larisai.id";
const SITE_NAME = "Laris.AI";
const SITE_DESCRIPTION =
  "AI kasir pintar untuk UMKM Indonesia. Catat penjualan via WhatsApp, kelola stok otomatis, dan lapor KUR tanpa ribet.";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512x512.png`,
    description: SITE_DESCRIPTION,
    foundingDate: "2024",
    founders: [
      {
        "@type": "Person",
        name: "Laris.AI Team",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
      addressRegion: "DKI Jakarta",
      addressLocality: "Jakarta Selatan",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+62-812-3456-7890",
        email: "halo@larisai.id",
        availableLanguage: ["Indonesian", "English"],
        areaServed: "ID",
      },
    ],
    sameAs: [
      "https://instagram.com/laris.ai",
      "https://twitter.com/laris_ai",
      "https://github.com/laris-ai",
    ],
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Point of Sale",
    operatingSystem: "Web, Android, iOS",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    downloadUrl: `${SITE_URL}/register`,
    image: `${SITE_URL}/og-image.png`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "500",
      bestRating: "5",
      worstRating: "1",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Pemilik Warung",
        price: "0",
        priceCurrency: "IDR",
        description: "Gratis selamanya untuk 1 toko & 1 pengguna",
      },
      {
        "@type": "Offer",
        name: "Pemilik Pro",
        price: "49000",
        priceCurrency: "IDR",
        description: "Transaksi unlimited, laporan KUR otomatis, multi-user",
        priceValidUntil: "2027-12-31",
      },
    ],
    featureList: [
      "Catat transaksi via WhatsApp",
      "AI cerdas bahasa Indonesia",
      "Stok otomatis real-time",
      "Laporan KUR otomatis",
      "Multi-role & multi-cabang",
      "PWA install di HP",
      "QRIS & multi-pembayaran",
      "Export Excel/PDF",
    ],
  };
}

export function faqJsonLd(
  faqs: Array<{ q: string; a: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "id-ID",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export const seoConstants = {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
};
