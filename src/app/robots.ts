import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/whatsapp";

/**
 * robots.txt otomatis Next.js App Router untuk domain larisai.my.id.
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
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
