import { redirect } from "next/navigation";

/**
 * Halaman root: redirect ke dashboard jika sudah login, atau ke landing page.
 * Logika cek session dilakukan di middleware.ts (lebih efisien).
 */
export default function RootPage() {
  // Middleware sudah handle redirect berdasarkan session.
  // Fallback ini hanya untuk client tanpa cookie (pertama kali buka).
  redirect("/landing");
}
