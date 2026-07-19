# Laris.AI Web — Next.js PWA untuk UMKM Indonesia

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20RLS-green)](https://supabase.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-Installable-purple)](https://web.dev/progressive-web-apps/)

Migrasi **Laris.AI** dari Streamlit ke **Next.js 14 PWA** yang mobile-first, production-ready, dan siap pakai UMKM Indonesia.

> **Status:** FASE 1 (Foundation) selesai ✅ — Lanjut FASE 2 (Landing Page)

---

## 🎯 Fitur

- **🔐 Auth + RBAC:** Supabase Auth dengan 4 role (admin, kasir, pemilik, anggota_koperasi)
- **📱 Mobile-First:** Bottom-nav, touch targets ≥44px, iOS-safe inputs (no zoom)
- **🎨 Design System:** Emerald brand (#10B981), shadcn/ui, dark mode
- **🌐 Bahasa Indonesia:** 100% UI text dalam Bahasa Indonesia
- **⚡ Performance:** Server Components, dynamic imports, lazy loading
- **📦 PWA:** Installable di HP (Android & iOS), offline support

---

## 🚀 Quick Start

### 1. Setup Supabase
1. Buat project baru di [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Settings → API** → copy URL & anon key
3. **SQL Editor** → jalankan schema dari `migration-notes/FASE-1-foundation.md`

### 2. Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local: isi NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Install & Run
```bash
npm install
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) 🎉

---

## 📂 Struktur Project

```
laris-ai-web/
├── src/
│   ├── app/
│   │   ├── (auth)/              ← Login, Register, Forgot Password
│   │   ├── (dashboard)/         ← Protected routes (sidebar + bottom-nav)
│   │   ├── landing/             ← Public landing page
│   │   └── api/                 ← API routes
│   ├── components/
│   │   ├── ui/                  ← shadcn/ui components
│   │   ├── shared/              ← Sidebar, BottomNav, Header, UserMenu
│   │   └── forms/               ← LoginForm, RegisterForm, ProfileForm
│   ├── lib/
│   │   ├── supabase/            ← client.ts, server.ts, middleware.ts
│   │   └── auth/rbac.ts         ← Role-based access control
│   ├── stores/                  ← Zustand stores
│   └── types/                   ← TypeScript types
├── public/                      ← PWA assets (manifest, icons)
└── migration-notes/             ← Catatan per fase
```

---

## 🗺️ Roadmap 7 Fase

| # | Fase | Status |
|---|------|--------|
| 1 | **Foundation** (Auth, RBAC, Layout, Settings) | ✅ Selesai |
| 2 | Landing Page (Hero, Pricing, SEO) | ⏭️ Next |
| 3 | Dashboard Kasir (Quick Action, KPI, Charts) | 📋 |
| 4 | Buku Kas + Produk (CRUD + Barcode) | 📋 |
| 5 | AI Chat + Print (Streaming chat + struk) | 📋 |
| 6 | Laporan + Settings (Charts + PDF export) | 📋 |
| 7 | PWA + Production (next-pwa + Vercel deploy) | 📋 |

Detail progress: lihat `migration-notes/FASE-1-foundation.md`

---

## 🔗 Repository Terkait

- **`bukuwarung-ai/`** — Referensi logika bisnis Streamlit (JANGAN dimodifikasi)
- **`bukuwarung-ai/kita-cuan-wa-bot/`** — Backend FastAPI WhatsApp bot (JANGAN dimodifikasi)
- **`laris-ai-web/`** — Repo ini (Next.js PWA)

---

## 📜 License

© 2026 Laris.AI — Dibuat khusus untuk UMKM Indonesia 🇮🇩
