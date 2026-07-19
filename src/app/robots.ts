import type { MetadataRoute } from "next";

/**
 * robots.txt otomatis Next.js App Router.
 * File ini akan di-generate jadi /robots.txt oleh Next.js.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/settings", "/api", "/auth"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/dashboard", "/settings", "/api", "/auth"],
      },
    ],
    sitemap: "https://larisai.id/sitemap.xml",
    host: "https://larisai.id",
  };
}
