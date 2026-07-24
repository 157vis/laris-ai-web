# 📊 PROJECT STATUS — LARIS.AI (laris-ai-web)

**Last updated:** 2026-07-24
**Current phase:** FASE 6 selesai, FASE 7 menunggu user
**Repo:** https://github.com/157vis/laris-ai-web
**Deploy:** Vercel (auto dari GitHub main)

---

## 🎯 Project Goal

Aplikasi **pembukuan digital untuk warung/UMKM Indonesia**. User bisa:
- 📱 Catat transaksi via WhatsApp bot ("catat jualan 50rb")
- 💻 Lihat dashboard di web (income/expense/produk/piutang)
- 📊 Export laporan ke CSV / Markdown (untuk di-baca AI)
- 👑 Super admin manage multi-tenant

**Live URL:** https://larisai.my.id (Next.js) + WA bot (Fonnte + Railway)

---

## 📈 Progres Ringkas

| Fase | Deskripsi | Status | Tanggal |
|------|-----------|--------|---------|
| 0 | Setup awal (repo, Supabase, Vercel) | ✅ Selesai | 2026-07 awal |
| 1-4 | Dashboard user (kas, produk, laporan basic) | ✅ Selesai | 2026-07-15 |
| 5 | Super Admin Console (RBAC, audit, roadmap) | ✅ Selesai | 2026-07-21 |
| 6 | Laporan Komprehensif (piutang + export) | ✅ Selesai | 2026-07-23 |
| 7 | Stabilization + Polish + Customer + PWA | ⏳ Belum | - |

**Progress:** ~75% complete (fungsi core sudah jalan, tinggal polish + PWA)

---

## ✅ Yang Sudah Jalan (Tested & Verified)

### Dashboard User Routes

#### `/dashboard` — Main Dashboard
- ✅ 5 KPI cards: today income, today expense, month income, month expense, low stock
- ✅ Piutang aktif (kalau ada)
- ✅ Recent transactions list (5 terakhir)
- ✅ Quick links ke sub-pages
- ✅ Admin card muncul HANYA untuk `role='admin'`

#### `/dashboard/kas` — Buku Kas
- ✅ List semua transaksi (income/expense)
- ✅ KPI cards: hari ini, bulan ini
- ✅ Filter by date range (planned: FASE 7 P3)
- ✅ Edit/delete transaction
- ✅ Auto-generate `receipt_no` (format: `TX-YYYYMMDD-XXX`)
- ✅ Running balance calculation

#### `/dashboard/kas/new` — Tambah Transaksi
- ✅ Item picker (dari `products` table)
- ✅ Multi-item support
- ✅ Toggle "Transaksi Prive" (pengambilan pribadi)
- ✅ Toggle "Catat sebagai Piutang" → muncul field customer (nama, phone, due_date)
- ✅ Validasi piutang: nama wajib

#### `/dashboard/produk` — Manajemen Produk
- ✅ CRUD (Create, Read, Update, Delete)
- ✅ Field: nama, harga, stok, kategori, gambar, deskripsi
- ✅ Low stock indicator (stock < 5)
- ✅ Image upload (URL, bukan file upload)

#### `/dashboard/laporan` — **Laporan Keuangan Komprehensif** 🌟
- ✅ **KPI Cards bulan ini:**
  - Total Pemasukan
  - Total Pengeluaran
  - Net Cashflow
  - Piutang Aktif (highlight kuning kalau ada)
- ✅ **Tabel Piutang** dengan aging analysis:
  - Status badge (current, 0-30, 31-60, 61-90, 90+ hari)
  - Amount remaining
  - Customer name + phone
  - Due date
- ✅ **Export Buttons:**
  - CSV (untuk Excel, semua kolom)
  - Markdown (ringkasan + tabel, untuk AI)
  - Copy for AI (copy markdown ke clipboard)
- ✅ **Per-kategori breakdown** (income & expense)
- ✅ **Quick links** ke transaksi/produk
- ✅ **Tip:** "Paste ke ChatGPT/Claude untuk insight"

### Super Admin Console (Khusus `role='admin'`)

#### `/dashboard/admin` — Overview
- ✅ Hero card "Selamat datang, Super Admin" (gradient)
- ✅ 4 stats cards: Total Users, Active Tenants, Total Revenue, System Health
- ✅ Quick links ke sub-pages
- ✅ Recent admin audit log
- ✅ Non-admin melihat `AccessDenied` component

#### `/dashboard/admin/users` — User Management
- ✅ Table semua user
- ✅ Columns: email, full name, role, client_id, business_name, created_at
- ✅ Search/filter (planned: FASE 7)
- ✅ Action: lihat detail (edit/delete: planned)

#### `/dashboard/admin/database` — Database Info
- ✅ View schema (read-only)
- ✅ List RPC functions
- ✅ List RLS policies
- ✅ Connection info

#### `/dashboard/admin/roadmap` — Roadmap Management
- ✅ List roadmap items (sorted by priority)
- ✅ Add/edit/delete items
- ✅ Status badge: planned, in_progress, completed, cancelled
- ✅ Priority badge: P0-P4

### WA Bot (kita-cuan-wa-bot, Python)
- ✅ Catat transaksi via chat
- ✅ Shareen persona (bot name)
- ✅ Greeting based on time (pagi/siang/sore/malam)
- ✅ Income logging (gaji, dll)
- ✅ Tier-based feature gating (Free user: no Gudang/Product)
- ✅ Laporan keuangan (ringkasan saldo)

---

## ⏳ Yang Belum (Priority List)

### 🔴 P1 — Stabilization & Bug Fix (Paling Penting)

**Estimasi:** 2-3 jam
**Tujuan:** Pastiin semua flow jalan mulus sebelum tambah fitur baru

- [ ] **E2E Test Flow:**
  - Register → email verification → login → dashboard
  - Catat transaksi penjualan (lengkap)
  - Catat transaksi piutang (dengan customer)
  - Edit/delete transaksi
  - Lihat di laporan → export CSV/MD
- [ ] **Verifikasi RBAC:**
  - Admin bisa akses `/dashboard/admin/*`
  - Non-admin melihat `AccessDenied` (bukan redirect ke dashboard)
  - Kasir bisa akses `/dashboard/kas` tapi tidak `/dashboard/admin`
- [ ] **Edge Cases:**
  - Stale JWT (setelah role sync, user harus logout/login)
  - Empty states (kalau belum ada transaksi)
  - Error handling (network error, server error)
- [ ] **Responsive Design:**
  - Test di iPhone (Safari)
  - Test di Android (Chrome)
  - Test di tablet
- [ ] **Performance:**
  - Initial load < 3 detik
  - Smooth navigation
  - No console errors

### 🟠 P2 — Customer Management

**Estimasi:** 1-1.5 jam
**Tujuan:** Kelola data customer terpisah dari transaksi

#### Schema baru:
```sql
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  client_id TEXT REFERENCES clients(client_id),
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### Halaman baru:
- `/dashboard/customers` — list + search + form
- `/dashboard/customers/new` — tambah customer
- `/dashboard/customers/[id]` — detail + history transaksi

#### Integrasi:
- Dropdown "Pilih customer" di form transaksi piutang
- Auto-fill `customer_name` & `customer_phone` dari customers table
- Quick action "Buat piutang baru" dari detail customer

### 🟡 P3 — Polish Laporan Keuangan

**Estimasi:** 30-45 menit
**Tujuan:** Laporan lebih powerful & siap di-share

- [ ] **Date range picker** (custom start/end, default = bulan ini)
  - Filter laporan by tanggal
  - Update semua KPI + tabel piutang + export
- [ ] **Print button** (`window.print()` + CSS khusus)
  - Format print-friendly (hide nav, sidebar)
  - Auto-print dialog
- [ ] **Top 5 Sections:**
  - Top 5 produk terlaris (by quantity sold, parse dari `note`)
  - Top 5 kategori terbesar (by amount)
  - Top 5 customer piutang terbesar
- [ ] **Charts (Recharts):**
  - Trend income vs expense (line chart, last 30 days)
  - Pie chart: expense by category
- [ ] **Comparison:**
  - Bulan ini vs bulan lalu (% growth)

### ⚪ P4 — PWA & Push Notification

**Estimasi:** 1-2 jam (opsional)
**Tujuan:** Aplikasi installable + ada notifikasi

- [ ] **manifest.json** (verify sudah lengkap)
- [ ] **Service worker** (offline mode + cache)
- [ ] **Install prompt** ("Add to Home Screen")
- [ ] **Push notification:**
  - VAPID key setup
  - web-push library
  - Trigger: piutang overdue, target harian tercapai
- [ ] **Settings page** untuk notification preferences

---

## 🗄️ Database State Saat Ini

### Tabel Utama (existing)
| Tabel | Rows | Keterangan |
|-------|------|------------|
| `auth.users` | 3 | 1 admin + 2 user biasa |
| `profiles` | 3 | synced dari auth.users |
| `clients` | 3 | 1 admin + 2 user |
| `transactions` | varies | data testing |
| `products` | varies | data testing |

### Tabel Admin (FASE 5)
| Tabel | Rows | Keterangan |
|-------|------|------------|
| `admin_audit_log` | 0 | kosong (siap dipake) |
| `roadmap_items` | seeded | sudah ada items |

### View + RPC (FASE 6)
| Object | Status | Keterangan |
|--------|--------|------------|
| `v_full_report` | ✅ | view komprehensif |
| `aggregate_report()` | ✅ | RPC untuk summary |

### File SQL yang sudah dijalankan
```
✅ fase_5_1_super_admin_schema.sql       (profiles + RLS + admin tables)
✅ fase_5_2_setup_new_tenant_rpc.sql     (setup_new_tenant RPC)
✅ seed_existing_users_to_profiles.sql   (populate profiles)
✅ promote_admin_rafihrr1.sql            (promote admin user)
✅ sync_role_to_app_metadata.sql         (sync role ke JWT)
✅ fase_6_laporan_schema.sql             (piutang + view + RPC)
```

---

## 🔑 Credentials & Secrets

### Supabase
- **URL:** `https://tagyexrsuvogrlhcthcp.supabase.co` (public, di `.env.local` & Vercel)
- **Anon key:** ada di `.env.local` (untuk client-side)
- **Service role key:** `0087e1546e2a...` (di Vercel env sebagai `SUPABASE_SERVICE_ROLE_KEY`)

### Vercel Environment Variables (yang penting)
```
NEXT_PUBLIC_SUPABASE_URL          = https://tagyexrsuvogrlhcthcp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY     = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY         = eyJhbGc...
NEXT_PUBLIC_APP_URL               = https://larisai.my.id
```

### Admin User
- **Email:** `rafihrr1@gmail.com`
- **User ID:** `19583499-ea06-40c8-8fcb-7f3e2d6d5f9b`
- **Client ID:** `admin_19583499`
- **Role:** `admin`
- **Login:** via Supabase Auth (password reset bisa di dashboard)

---

## 🐛 Known Bugs / Issues

### Minor (tidak urgent)
- [ ] **Empty states:** beberapa halaman belum ada empty state UI (cuma blank)
- [ ] **Loading states:** tidak ada skeleton loading (cuma "Loading...")
- [ ] **Error toast:** pakai `sonner` tapi belum konsisten di semua form
- [ ] **Date format:** beberapa masih pakai `toLocaleDateString()` (mixed format)

### Major (perlu fix di P1)
- [ ] **JWT stale issue:** kalau admin role di-sync via SQL, user harus logout/login manual
- [ ] **Export filename:** timestamp belum konsisten (ada yang pakai ISO, ada yang pakai Date.toString())
- [ ] **Print preview:** belum tested (planned di P3)

### Won't fix (by design)
- ~~Multi-language~~ — fokus Indonesia dulu
- ~~Dark mode~~ — pakai light mode saja dulu
- ~~Real-time updates~~ — pakai revalidate setiap 30 detik (cukup)

---

## 📂 Repo Structure

```
laris-ai-web/
├── src/
│   ├── middleware.ts
│   ├── lib/
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── dashboard/
│   │   ├── laporan/
│   │   ├── supabase/
│   │   └── format.ts
│   ├── components/
│   │   ├── dashboard/
│   │   ├── laporan/
│   │   ├── admin/
│   │   └── ui/           # shadcn
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── (dashboard)/
│   │       └── dashboard/
│   │           ├── kas/
│   │           ├── produk/
│   │           ├── laporan/
│   │           ├── admin/
│   │           ├── ai-chat/
│   │           └── settings/
│   └── types/
├── docs/                  # ← Anda di sini sekarang
│   ├── HANDOFF_PROMPT.md   # Prompt untuk chat baru / akun baru
│   └── PROJECT_STATUS.md   # File ini
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 📞 Kalau Mau Lanjut (3 Cara)

### Cara 1: Lanjut di Chat Ini
Tinggal bilang "lanjut P1" / "lanjut P3" / dll, langsung dikerjakan.

### Cara 2: Chat Baru (Akun / Email Berbeda)
1. Buka chat baru
2. Copy isi `docs/HANDOFF_PROMPT.md` (dari `## MULAI` sampai `## SELESAI`)
3. Paste ke chat baru
4. Agent baru akan tanya mau lanjut mana

### Cara 3: Chat Baru (Akun yang Sama, Fresh Session)
1. Buka chat baru (akan kehilangan history)
2. Copy isi `docs/HANDOFF_PROMPT.md`
3. Paste

**Rekomendasi:** Cara 1 (lanjut di sini) supaya agent ingat detail kecil (kayak PowerShell quirks, preferensi user, dll).

---

## 📅 Riwayat Singkat (untuk referensi)

| Tanggal | Event |
|---------|-------|
| 2026-07 awal | Setup project, integrasi Supabase |
| 2026-07-12 | Migrasi dari Streamlit → Next.js dimulai |
| 2026-07-15 | Dashboard core selesai (kas, produk, laporan basic) |
| 2026-07-17 | Deploy pertama berhasil di Vercel |
| 2026-07-19 | Mulai FASE 5 (Super Admin Console) |
| 2026-07-21 | Admin Console jalan, RBAC berfungsi |
| 2026-07-23 | FASE 6 selesai (Laporan Komprehensif + Piutang) |
| 2026-07-24 | User request prompt handoff → file ini dibuat |

---

**File ini auto-update setiap ada perubahan major.** Last edited: 2026-07-24.