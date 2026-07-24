# 🚀 HANDOFF PROMPT — LARIS.AI (Next.js + Supabase)

> **Cara pakai:** Copy seluruh isi file ini (dari `## MULAI` sampai `## SELESAI`) → paste ke chat baru dengan akun/email baru → agent akan langsung paham project state dan tanya mau lanjut ke mana.

---

## MULAI

Saya melanjutkan project **LARIS.AI** (https://larisai.my.id) — pembukuan warung/UMKM via WhatsApp bot + dashboard web. Dashboard sudah migrasi dari **Streamlit → Next.js**.

### 📂 Lokasi Project
- **Next.js code:** `F:\bukuwarungai\laris-ai-web` (atau di agent: `/path/to/laris-ai-web`)
- **SQL migrations:** `C:\Users\Teknik SAP MTAL\bukuwarungai\sql\` (semua file `.sql`)
- **WA bot:** `C:\Users\Teknik SAP MTAL\kita-cuan-wa-bot\` (Python)
- **Repo GitHub:** `git@github.com:157vis/laris-ai-web.git` (branch: `main`)
- **Vercel:** auto-deploy dari GitHub webhook
- **Supabase URL:** `https://tagyexrsuvogrlhcthcp.supabase.co`
- **Supabase dashboard:** https://supabase.com/dashboard/project/tagyexrsuvogrlhcthcp

---

### 🎯 Project Goal
Aplikasi pembukuan digital untuk warung/UMKM Indonesia. User bisa:
- Catat transaksi via WhatsApp bot ("catat jualan 50rb")
- Lihat dashboard di web (income/expense/produk/piutang)
- Export laporan ke CSV / Markdown (untuk dibaca AI)
- Super admin manage multi-tenant (saat ini 3 user)

---

### 📦 Tech Stack
| Layer | Tools |
|-------|-------|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| **UI** | Shadcn UI, Lucide icons, Recharts (planned) |
| **State** | Zustand, Zod validation |
| **Backend** | Supabase (PostgreSQL + Auth + RLS) |
| **Auth** | Supabase Auth + `@supabase/ssr` |
| **Deploy** | Vercel (auto-deploy via GitHub webhook) |
| **WA Bot** | Python + Fonnte API + Railway deploy |
| **DB Schema** | **Tetap** schema bukuwarung-ai (dari Streamlit lama) |

---

### 🗂️ Schema Database (YANG DIGUNAKAN SEKARANG — JANGAN DIUBAH)

#### Tabel Utama
```sql
-- Transaksi (Pemasukan/Pengeluaran + Piutang tracking)
transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  date TEXT,                          -- "2026-07-24 14:30" format
  type TEXT CHECK (type IN ('Pemasukan','Pengeluaran')),
  amount NUMERIC,
  category TEXT,
  note TEXT,
  receipt_no TEXT,
  running_balance NUMERIC,
  is_prive BOOLEAN DEFAULT false,
  -- FASE 6 additions (piutang tracking):
  customer_name TEXT,
  customer_phone TEXT,
  due_date DATE,
  piutang_status TEXT CHECK (piutang_status IN ('unpaid','partial','paid')),
  amount_paid NUMERIC DEFAULT 0
)

-- Produk
products (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  price NUMERIC,
  stock INTEGER,
  category TEXT,
  image_url TEXT,
  description TEXT
)

-- Tenants (per-user workspace)
clients (
  client_id TEXT PRIMARY KEY,        -- misal: "admin_19583499"
  name TEXT,
  owner_user_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,                    -- {"plan":"free","industry":"toko"}
  report_settings JSONB              -- FASE 6: template config
)

-- User profile (FASE 5)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin','pemilik','kasir','anggota_koperasi')) DEFAULT 'pemilik',
  phone TEXT,
  industry TEXT,
  business_name TEXT,
  client_id TEXT REFERENCES clients(client_id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)

-- Audit log (admin only, FASE 5)
admin_audit_log (
  id BIGSERIAL PRIMARY KEY,
  admin_user_id UUID,
  action TEXT,
  target_table TEXT,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT now()
)

-- Roadmap items (FASE 5)
roadmap_items (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  status TEXT CHECK (status IN ('planned','in_progress','completed','cancelled')),
  priority TEXT CHECK (priority IN ('P0','P1','P2','P3','P4')),
  phase TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

#### View + RPC (FASE 6)
```sql
-- View komprehensif (1 query untuk semua data laporan)
CREATE VIEW public.v_full_report AS
SELECT t.*, c.name AS client_name,
  CASE WHEN t.due_date IS NOT NULL AND t.piutang_status != 'paid'
    THEN GREATEST(0, (CURRENT_DATE - t.due_date)) ELSE 0 END AS days_overdue,
  CASE WHEN t.piutang_status = 'paid' THEN 'paid'
    WHEN t.due_date IS NULL THEN 'no_due_date'
    WHEN CURRENT_DATE <= t.due_date THEN 'current'
    WHEN CURRENT_DATE - t.due_date <= 30 THEN 'aging_0_30'
    WHEN CURRENT_DATE - t.due_date <= 60 THEN 'aging_31_60'
    WHEN CURRENT_DATE - t.due_date <= 90 THEN 'aging_61_90'
    ELSE 'aging_90_plus' END AS aging_bucket
FROM transactions t LEFT JOIN clients c ON c.owner_user_id = t.user_id;

-- RPC untuk aggregate summary
CREATE FUNCTION public.aggregate_report(
  p_user_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
) RETURNS JSONB ...

-- RPC untuk setup tenant baru (atomic, FASE 5)
CREATE FUNCTION public.setup_new_tenant(
  p_user_id UUID, p_email TEXT, p_full_name TEXT,
  p_phone TEXT, p_industry TEXT, p_business_name TEXT
) RETURNS JSONB ...
```

---

### ✅ YG SUDAH SELESAI (JANGAN DIULANG)

#### FASE 0 — Setup Awal
- [x] Repo Next.js connected ke Supabase via `@supabase/ssr`
- [x] Schema TETAP pakai `bukuwarung-ai` (Streamlit lama) — Next.js di-adapt, bukan sebaliknya
- [x] Supabase key: pakai `service_role` (0087e1546e2a...) di Vercel env
- [x] SSH key GitHub configured
- [x] Git identity: `user.name` & `user.email` set di repo lokal

#### FASE 1–4 — Dashboard User (pemilik/kasir)
- [x] **`/dashboard`** — KPI cards: today income/expense, month income/expense, low stock count, piutang aktif, net cashflow
- [x] **`/dashboard/kas`** — list transaksi + form input (single + multi item) + edit/delete + receipt number auto-generated
- [x] **`/dashboard/kas/new`** — form tambah transaksi dengan item picker (dari `products`)
- [x] **`/dashboard/kas/[id]`** — detail transaksi
- [x] **`/dashboard/produk`** — CRUD produk (nama, harga, stok, kategori, gambar, deskripsi)
- [x] **`/dashboard/laporan`** — Laporan Keuangan Komprehensif (lihat detail di bawah)

#### FASE 5 — Super Admin Console
- [x] **Role-based access control (RBAC)** di `middleware.ts`:
  - Baca dari `user.app_metadata.role` (Edge-compatible)
  - Role: `admin`, `pemilik`, `kasir`, `anggota_koperasi`
  - Sync dari `profiles.role` → `auth.users.app_metadata.role` (via SQL script)
- [x] **Admin user existing:** `rafihrr1@gmail.com`
  - `id: 19583499-ea06-40c8-8fcb-7f3e2d6d5f9b`
  - `client_id: admin_19583499`
  - `role: admin`
- [x] **`/dashboard/admin`** — Super Admin Console overview (shield icon, stats, quick links)
- [x] **`/dashboard/admin/users`** — list semua user dengan role/client_id
- [x] **`/dashboard/admin/database`** — view schema + RPC + RLS policies (read-only)
- [x] **`/dashboard/admin/roadmap`** — manage roadmap items (super admin only)
- [x] **`AccessDenied`** component (untuk non-admin yang akses `/dashboard/admin`)
- [x] **`createAdminClient()`** di `src/lib/supabase/admin.ts` — pakai `SUPABASE_SERVICE_ROLE_KEY` untuk bypass RLS

#### FASE 6 — Laporan Keuangan Komprehensif
- [x] Tambah kolom `customer_name`, `customer_phone`, `due_date`, `piutang_status`, `amount_paid` ke `transactions`
- [x] Tambah `report_settings` JSONB ke `clients` (config template laporan)
- [x] View `v_full_report` (JOIN `transactions` + `clients` via `owner_user_id`)
- [x] RPC `aggregate_report(p_user_id UUID, p_start_date DATE, p_end_date DATE)` → JSONB
- [x] **`/dashboard/laporan`** features:
  - KPI cards: Pemasukan, Pengeluaran, Net Cashflow, Piutang Aktif
  - **Tabel Piutang** dengan aging analysis (current, 0-30, 31-60, 61-90, 90+ hari)
  - **Export CSV** (untuk Excel) — semua kolom transaksi
  - **Export Markdown** (untuk AI) — ringkasan + tabel + summary
  - **Copy for AI** — copy markdown ke clipboard
  - Per-kategori breakdown (income & expense)
  - Quick links ke transaksi/produk

#### FASE 6 — Schema migrations (sudah dijalankan)
- `fase_6_laporan_schema.sql` ✅
- `fase_5_1_super_admin_schema.sql` ✅
- `fase_5_2_setup_new_tenant_rpc.sql` ✅
- `seed_existing_users_to_profiles.sql` ✅
- `promote_admin_rafihrr1.sql` ✅
- `sync_role_to_app_metadata.sql` ✅

---

### 📁 File-File Penting di Next.js

```
src/
├── middleware.ts                           # RBAC + session refresh
├── lib/
│   ├── auth/rbac.ts                        # Role definitions + route access
│   ├── admin/rbac.ts                       # requireAdmin + getCurrentAdminProfile
│   ├── supabase/
│   │   ├── server.ts                       # Server Component client
│   │   ├── admin.ts                        # Service-role client (bypass RLS)
│   │   └── middleware.ts                   # Middleware client
│   ├── dashboard/
│   │   ├── queries.ts                      # getDashboardStats
│   │   └── actions.ts                      # createTransaction, etc.
│   ├── laporan/
│   │   ├── queries.ts                      # getFullReport (view v_full_report)
│   │   └── export.ts                       # rowsToCSV, summaryToMarkdown, computeSummary
│   └── format.ts                           # formatIDR, formatDate
├── components/
│   ├── dashboard/
│   │   ├── kpi-card.tsx
│   │   ├── transaction-form.tsx            # + Piutang checkbox
│   │   ├── product-form.tsx
│   │   ├── recent-transactions.tsx
│   │   └── export-buttons.tsx
│   ├── laporan/
│   │   ├── export-buttons.tsx              # CSV/MD/Copy for AI
│   │   └── piutang-table.tsx               # Aging analysis
│   ├── admin/
│   │   └── access-denied.tsx
│   └── ui/                                 # Shadcn components
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (auth)/register/page.tsx            # Plain registration (FASE 7: tambah fields)
│   └── (dashboard)/
│       ├── dashboard/page.tsx              # Main dashboard
│       ├── dashboard/kas/page.tsx          # Transaction list
│       ├── dashboard/kas/new/page.tsx
│       ├── dashboard/kas/[id]/page.tsx
│       ├── dashboard/produk/page.tsx
│       ├── dashboard/laporan/page.tsx      # COMPREHENSIVE REPORT
│       ├── dashboard/ai-chat/page.tsx
│       ├── dashboard/settings/page.tsx
│       └── dashboard/admin/
│           ├── page.tsx                    # Console overview
│           ├── users/page.tsx
│           ├── database/page.tsx
│           └── roadmap/page.tsx
└── types/
    ├── auth.ts                             # UserRole, ROUTE_ACCESS
    └── admin.ts                            # AdminStats, UserProfile
```

---

### ⏳ YANG BELUM (Priority List)

#### 🔴 P1 — Stabilization & Bug Fix (SEGERA)
- [ ] E2E test: register → login → catat transaksi → lihat di laporan → export CSV/MD
- [ ] Verifikasi admin bisa akses `/dashboard/admin` & sub-pages
- [ ] Verifikasi non-admin melihat `AccessDenied` (bukan silent redirect)
- [ ] Cek responsive design di mobile (iPhone/Android)
- [ ] Handle edge case: stale JWT (user harus logout/login ulang setelah role sync)
- [ ] Test piutang: buat transaksi piutang → lihat di tabel → cek aging
- [ ] Test export: CSV bisa dibuka di Excel, MD bisa di-paste ke ChatGPT/Claude

#### 🟠 P2 — Customer Management (1-1.5 jam)
- [ ] **Tabel `customers`** baru: `id, client_id, name, phone, address, notes, created_at`
- [ ] **Halaman `/dashboard/customers`** — list + search + form tambah/edit/hapus
- [ ] **Dropdown "Pilih customer"** di form transaksi piutang (auto-fill phone)
- [ ] **Halaman `/dashboard/customers/[id]`** — detail customer + history transaksi
- [ ] Quick action "Buat piutang baru untuk customer ini" dari detail page

#### 🟡 P3 — Polish Laporan Keuangan (~30-45 mnt)
- [ ] **Date range picker** (custom start/end, default = bulan ini)
- [ ] **Print button** (`window.print()` + CSS `@media print` khusus)
- [ ] **Top 5 sections**:
  - Top 5 produk terlaris (by quantity sold)
  - Top 5 kategori terbesar (by amount)
  - Top 5 customer piutang terbesar (by amount_remaining)
- [ ] **Chart/grafik** (Recharts): trend income vs expense (last 30 days)
- [ ] **Comparison bulan ini vs bulan lalu** (% growth)

#### ⚪ P4 — PWA & Push Notification (Opsional, 1-2 jam)
- [ ] Verifikasi `manifest.json` (icon, theme color, name)
- [ ] **Service worker** (`sw.js`) untuk offline mode + cache pages
- [ ] **Install prompt** ("Add to Home Screen")
- [ ] **Push notification**:
  - "Piutang Pak Budi sudah lewat 30 hari"
  - "Target harian tercapai: Rp 500.000"
  - Setup via VAPID key + web-push library
- [ ] Update notification preferences di settings page

---

### 🔧 CARA MELANJUTKAN (PENTING!)

#### 1. Sebelum mulai task apapun:
```bash
cd F:\bukuwarungai\laris-ai-web
git log --oneline -10        # lihat commit terakhir
git status                   # pastikan clean
```

Baca file-file penting ini untuk paham state:
- `src/middleware.ts` — RBAC logic
- `src/lib/admin/rbac.ts` — admin role detection
- `src/lib/laporan/queries.ts` — comprehensive report query
- `sql/fase_6_laporan_schema.sql` — schema terbaru

#### 2. Konvensi coding:
- **Server Components by default** (pakai `"use client"` cuma kalau perlu state/onClick)
- **Server Actions** di `src/lib/[feature]/actions.ts`
- **Types** di `src/types/[feature].ts`
- **SQL migrations** di `C:\Users\Teknik SAP MTAL\bukuwarungai\sql\[phase]_[name].sql`
- **Komponen reusable**: pakai shadcn/ui (`Card`, `Badge`, `Button`, `Input`, dll)
- **Bahasa Indonesia** untuk semua UI copy + comments
- **Jangan ubah schema** Supabase kecuali sangat perlu (user lebih suka extend, bukan alter)

#### 3. Sebelum push:
```bash
npm run build                # pastiin GAK ADA error TypeScript
git add -A
git commit -m "feat/fix: ..."
git push origin main         # Vercel auto-deploy
```

#### 4. Ingatkan user kalau SQL perlu di-run manual:
> "Jalankan SQL ini di **Supabase Dashboard → SQL Editor** lalu paste hasilnya di sini"

#### 5. Cara debug build error Vercel:
- Cek error message lengkap di Vercel deploy log
- Hapus unused variables/imports (TypeScript strict)
- Cek type compatibility (misal: `string` vs `"Pemasukan" | "Pengeluaran"`)

---

### 👤 User Context (untuk agent baru)

- **Nama:** Pak Rafli (sering dipanggil "rafihrr1" / "raflhrrl1")
- **Background:** Non-teknis, owner UMKM sekaligus developer project ini
- **Bahasa:** Indonesia (pakai bahasa santai, jangan terlalu formal)
- **Komputer:** Windows 11, **PowerShell** (sering problem dengan encoding + command tertentu)
- **Workaround PowerShell:** kalau command aneh, pakai `cmd /c "command"` untuk bypass
- **Sering lupa:** run SQL di Supabase dashboard → **SELALU INGATKAN**
- **Suka:** quick wins, lihat progress visual, instruksi step-by-step
- **Tidak suka:** terlalu banyak halaman/setting terpisah (lebih suka 1 halaman komprehensif)

#### 📞 Kontak user
- **WA:** 082112826851 (untuk diskusi strategis / scheduling)
- **Email utama:** `raflhrrl1@gmail.com` (admin user)
- **Email sekunder:** `157vis` (GitHub username)

---

### 💡 NEXT STEP (yang user mau sekarang)

**TANYA USER DULU** — JANGAN LANGSUNG MULAI KERJA. Mau lanjut ke mana?

Lihat pilihan di `PROJECT_STATUS.md` section "Belum" atau di atas (P1 / P2 / P3 / P4).

User akan jawab seperti: "P3", "lanjut customer", "stabilization dulu", dll.

Kalau user bilang "lanjut saja" / "mana yang penting" → rekomendasi **P1 Stabilization** (karena semua fitur baru akan lebih stabil kalau bug fix dulu).

---

## SELESAI