"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Wrapper Sonner dengan tema konsisten.
 * Ref: brief FASE 1 — toast untuk SEMUA mutations.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      expand
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "rounded-xl text-base",
          title: "font-semibold",
          description: "text-sm opacity-90",
        },
      }}
    />
  );
}
