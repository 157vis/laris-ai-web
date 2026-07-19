import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** cn = className merger untuk shadcn/ui pattern. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format angka ke Rupiah Indonesia. */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/** Format tanggal singkat bahasa Indonesia. */
export function formatTanggal(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Delay helper untuk skeleton loading simulation (dev only). */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Trim string & handle null/undefined safely. */
export function safe(value: string | null | undefined, fallback = ""): string {
  return (value ?? fallback).trim();
}
