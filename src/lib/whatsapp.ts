/**
 * Konstanta kontak WhatsApp & domain resmi Laris.AI.
 * Pakai ini di semua komponen yang butuh WA link agar konsisten.
 */
export const WA_NUMBER = "6282112826851"; // 0821-1282-6851
export const WA_DISPLAY = "0821-1282-6851";
export const WA_OWNER_NAME = "Admin Laris.AI";

export const SITE_DOMAIN = "larisai.my.id";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const SITE_NAME = "Laris.AI";
export const SITE_TAGLINE = "Asisten Catat Warung Pintar via WhatsApp";

export const CONTACT_EMAIL = "halo@larisai.my.id";

/**
 * Buat link WhatsApp dengan pesan default yang bisa dikustomisasi.
 */
export function waLink(message?: string): string {
  const text = encodeURIComponent(
    message ||
      `Halo ${WA_OWNER_NAME}, saya tertarik untuk daftar Laris.AI. Mohon info lebih lanjut ya 🙏`
  );
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}
