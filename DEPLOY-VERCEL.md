# 🚀 Deploy Laris.AI ke Vercel — Panduan Online

> **Cara paling cepat & mudah untuk testing online TANPA perlu `npm install` di lokal!**

Vercel akan otomatis install dependencies, build, dan deploy project Next.js Anda ke URL publik.

---

## 📋 Prerequisites

1. **Akun GitHub** — [github.com/signup](https://github.com/signup) (gratis)
2. **Akun Vercel** — [vercel.com/signup](https://vercel.com/signup) (gratis, login dengan GitHub)
3. **Akun Supabase** — [supabase.com/dashboard](https://supabase.com/dashboard) (gratis, untuk auth)
4. **Git terinstall** — [git-scm.com](https://git-scm.com) (cek: `git --version` di terminal)

---

## 🎯 Step 1: Buat Repository Baru di GitHub

1. Buka [github.com/new](https://github.com/new)
2. Isi detail:
   - **Repository name:** `laris-ai-web` (atau nama lain yang Anda suka)
   - **Description:** `AI kasir pintar untuk UMKM Indonesia — Next.js PWA`
   - **Visibility:** `Private` (disarankan) atau `Public`
3. ❌ **JANGAN centang** "Add a README file", "Add .gitignore", "Choose a license"
   (karena kita sudah punya semua di lokal)
4. Klik **Create repository**
5. Catat URL repo (contoh: `https://github.com/username/laris-ai-web.git`)

---

## 🎯 Step 2: Push Kode dari Lokal ke GitHub

Buka terminal (PowerShell/CMD) di folder project, lalu jalankan:

```bash
cd f:\bukuwarungai\laris-ai-web

# Inisialisasi git
git init
git config user.name "Nama Anda"
git config user.email "email@anda.com"

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "feat: FASE 1 Foundation - Auth, RBAC, Dashboard shell"

# Hubungkan ke GitHub (ganti USERNAME dan REPO dengan milik Anda)
git remote add origin https://github.com/USERNAME/laris-ai-web.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

> 💡 **Tips:** Setiap kali edit file di VS Code, gunakan panel **Source Control** (icon branch di sidebar kiri) → klik ✓ untuk commit → klik "..." → Push.

---

## 🎯 Step 3: Setup Supabase (Auth + Database)

1. Buka [supabase.com/dashboard](https://supabase.com/dashboard)
2. Klik **"New project"**
3. Isi:
   - **Name:** `laris-ai`
   - **Database Password:** (buat password kuat, **simpan baik-baik!**)
   - **Region:** `Singapore` (paling dekat dengan Indonesia)
4. Klik **Create new project** — tunggu ~2 menit

### 3a. Copy API Keys

Setelah project ready:
1. Buka **Settings → API** (sidebar kiri)
2. Copy 2 nilai ini:
   - **Project URL** → `https://xxxxx.supabase.co` (jadi `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public key** → `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (jadi `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 3b. Jalankan Schema SQL

1. Buka **SQL Editor** (sidebar kiri)
2. Klik **"+ New query"**
3. Copy-paste SQL di bawah ini, lalu klik **Run**:

```sql
-- ============================================
-- Laris.AI — Schema FASE 1
-- ============================================

-- Tabel profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  business_name TEXT,
  role TEXT NOT NULL DEFAULT 'pemilik'
    CHECK (role IN ('admin', 'kasir', 'pemilik', 'anggota_koperasi')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies: user bisa baca profil sendiri
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- User bisa update profil sendiri
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Service role bisa baca semua (untuk admin dashboard)
CREATE POLICY "Service role can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Trigger: auto-create profile saat user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, business_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Pengguna Baru'),
    NEW.raw_user_meta_data->>'business_name',
    COALESCE(NEW.raw_app_meta_data->>'role', 'pemilik')
  );
  RETURN NEW;
END;
$$;

-- Trigger aktif setelah INSERT ke auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
```

4. Pastikan tidak ada error (lihat panel **Results** di bawah)

### 3c. Konfigurasi Auth (Disable Email Confirmation untuk Dev)

Supabase default-nya butuh email konfirmasi sebelum bisa login. Untuk testing cepat:

1. **Authentication → Providers → Email** (sidebar)
2. **Nonaktifkan** "Confirm email" toggle (hijau → abu-abu)
3. Klik **Save**

> ⚠️ **Production nanti:** Aktifkan kembali untuk keamanan. Untuk FASE 1 testing, nonaktifkan agar register → langsung login.

---

## 🎯 Step 4: Deploy ke Vercel

### 4a. Connect GitHub ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new)
2. Klik **"Import Git Repository"**
3. Pilih akun GitHub Anda
4. Pilih repo `laris-ai-web`
5. Klik **"Import"**

### 4b. Konfigurasi Project

1. **Project Name:** `laris-ai-web` (atau sesuai selera, ini jadi subdomain vercel.app)
2. **Framework Preset:** `Next.js` (otomatis terdeteksi)
3. **Root Directory:** `./` (default)
4. **Build Command:** `next build` (default, JANGAN diubah)
5. **Output Directory:** `.next` (default)
6. **Install Command:** `npm install` (default)

### 4c. Set Environment Variables

Klik **"Environment Variables"** (expand section), lalu tambahkan 3 variabel ini:

| Name | Value | Environment |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL dari Supabase (Step 3a) | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key dari Supabase (Step 3a) | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://laris-ai-web.vercel.app` (ganti dengan URL Vercel Anda, lihat setelah deploy) | Production |

Klik **"Deploy"** 🚀

### 4d. Tunggu Deploy Selesai

- Build biasanya butuh **2-4 menit**
- Anda akan lihat log build real-time
- Kalau sukses → muncul confetti 🎉 dan link URL production
- Contoh URL: `https://laris-ai-web.vercel.app`

---

## 🎯 Step 5: Set Site URL di Supabase

Supabase perlu tahu URL production untuk redirect email confirmation & OAuth callback.

1. Kembali ke **Supabase Dashboard**
2. **Authentication → URL Configuration**
3. Isi **Site URL:** `https://laris-ai-web.vercel.app` (URL Vercel Anda)
4. Tambahkan ke **Redirect URLs:**
   - `https://laris-ai-web.vercel.app/**`
   - `https://laris-ai-web.vercel.app/auth/callback`
5. Klik **Save**

---

## 🎯 Step 6: Test di Browser

1. Buka URL Vercel Anda: `https://laris-ai-web.vercel.app`
2. Seharusnya muncul halaman landing
3. Test flow:
   - **Daftar Gratis** → isi form → otomatis login → masuk dashboard
   - **Login** → cek sidebar muncul di desktop, bottom-nav di mobile
   - **Settings** → ubah profil → simpan → toast sukses
   - **Logout** → kembali ke login

---

## 🎯 Step 7: Test Mobile (PWA Install)

1. Buka URL di HP Android/iOS
2. **Android Chrome:** Muncul banner "Add to Home screen" → install
3. **iOS Safari:** Klik tombol Share → "Add to Home Screen"
4. Sekarang Laris.AI ada di home screen HP Anda seperti aplikasi native! 🎉

---

## 🔄 Auto-Deploy Setiap Push

Setelah setup awal, setiap kali Anda push kode ke GitHub:
1. Vercel otomatis detect perubahan
2. Build & deploy dalam 2-4 menit
3. Dapat email notifikasi kalau ada error

Cara push dari VS Code:
```bash
git add .
git commit -m "pesan perubahan"
git push
```
Atau pakai panel **Source Control** di VS Code (icon branch di sidebar kiri).

---

## 🔐 Custom Domain (Opsional)

Kalau punya domain sendiri (misal `laris-ai.com`):

1. Beli domain di Namecheap / Cloudflare / Niagahoster
2. Di Vercel: **Settings → Domains → Add**
3. Ikuti instruksi DNS
4. Gratis SSL otomatis dari Vercel

---

## 📊 Monitoring & Analytics (Opsional)

Vercel punya analytics bawaan:
1. **Project → Analytics** (tab atas)
2. Aktifkan **Web Analytics** (gratis 100k events/bulan)

---

## 🐛 Troubleshooting

### Build Error: "Cannot find module 'next'"
- Pastikan `package.json` ada di root project
- Cek **Root Directory** di Vercel settings = `./`

### Build Error: "supabaseUrl is required"
- ENV vars belum diset
- Buka **Settings → Environment Variables** di Vercel
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` ada
- Klik **"Redeploy"**

### Login Error: "Invalid login credentials"
- Cek email/password benar
- Atau **buat akun baru** lewat `/register` dulu

### "Email not confirmed" 
- Nonaktifkan "Confirm email" di Supabase Auth settings (Step 3c)
- Atau cek inbox email & klik link konfirmasi

### Logo/icon PWA tidak muncul
- Folder `public/icons/` masih kosong (TODO FASE 7)
- Untuk sekarang, PWA pakai favicon default

---

## 📜 Perintah Berguna

```bash
# Cek status git
git status

# Lihat log commit
git log --oneline

# Lihat ENV vars di Vercel
vercel env ls

# Deploy manual (kalau belum connect GitHub)
npm install -g vercel
vercel login
vercel --prod
```

---

## 🎯 Next Step: FASE 2

Setelah deploy berhasil dan test manual sukses:
1. Balas ke AI assistant: **"online sudah jalan, lanjut FASE 2"**
2. Saya akan lanjut bangun:
   - **Landing page publik lengkap** (Hero 3D, Pain Points, Feature Showcase, Pricing 3 tier)
   - **Full SEO** (metadata dinamis, OG image, JSON-LD, sitemap.xml, robots.txt)
   - **PWA icons** (192x192, 512x512, apple-touch-icon)

Selamat deploy! 🚀🇮🇩
