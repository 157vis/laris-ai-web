import { create } from "zustand";
import type { UserProfile } from "@/types/auth";

/**
 * Store untuk state auth di client (UI helper, BUKAN source of truth).
 * Source of truth tetap di Supabase session cookies.
 *
 * Ref: brief FASE 1 — Zustand untuk client state.
 */
interface AuthState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));
