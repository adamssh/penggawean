# PENGGAWEAN: To-Do List Eisenhower Matrix

Sebuah aplikasi manajemen tugas (*To-Do List*) modern yang dibangun menggunakan metodologi **Eisenhower Matrix** (membagi tugas berdasarkan tingkat kepentingan dan urgensi). Aplikasi ini dirancang agar ringan, responsif, dan mendukung fitur sinkronisasi *realtime* di seluruh perangkat Anda.

## ✨ Fitur Utama

- **Eisenhower Matrix System**: Kategorisasi tugas dalam 4 kuadran (Important & Urgent, Important & Not Urgent, Not Important & Urgent, Not Important & Not Urgent).
- **Guest / Offline Mode**: Pengguna dapat langsung menggunakan aplikasi tanpa perlu mendaftar. Data akan disimpan secara lokal (*localStorage*).
- **Cloud Sync & Authentication**: Fitur Login/Register (didukung oleh Supabase Auth) memungkinkan pengguna menyimpan dan menyinkronkan tugas secara aman di *cloud*.
- **Supabase Realtime**: Perubahan pada *task* (tambah, edit, centang, hapus) dari satu perangkat akan langsung muncul di perangkat lain seketika (*realtime*) tanpa perlu *refresh*.
- **Optimistic UI**: Penambahan dan interaksi tugas terasa instan dan responsif.
- **Mobile-Ready**: Desain responsif dengan antarmuka khusus untuk perangkat mobile. Struktur project siap di-*build* menjadi aplikasi Android menggunakan Capacitor.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State Management**: Zustand (dengan sinkronisasi Supabase & *persist*)
- **Backend / Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Mobile Wrapper**: Capacitor

## 📦 Panduan Instalasi & Setup

### 1. Persiapan Lingkungan (*Environment*)

Pastikan Anda memiliki [Node.js](https://nodejs.org/) yang terinstal. Lalu *clone/copy* proyek ini dan jalankan:

```bash
npm install
```

### 2. Setup Supabase

Aplikasi ini menggunakan **Supabase** sebagai *backend*. Anda perlu membuat proyek di [Supabase](https://supabase.com) dan mengatur kredensial:

1. Buat file `.env` di *root directory* proyek.
2. Tambahkan kredensial berikut:

```env
VITE_SUPABASE_URL=https://[PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
```

### 3. Migrasi Database (Supabase SQL Editor)

Jalankan *query* SQL berikut di dalam **SQL Editor** pada *dashboard* Supabase Anda untuk membuat tabel, mengaktifkan RLS (keamanan), dan mengaktifkan fitur *Realtime*:

```sql
-- 1. Buat tabel tasks
CREATE TABLE tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    category text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    starred boolean DEFAULT false NOT NULL,
    due_date timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 3. Policy: User hanya berinteraksi dengan task miliknya sendiri
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- 4. Aktifkan Realtime untuk tabel tasks
begin;
  alter publication supabase_realtime add table tasks;
commit;
```

### 4. Menjalankan Server (Development)

Untuk melihat aplikasi di browser, jalankan:

```bash
npm run dev
# atau 'npm run dev -- --host' untuk mengakses dari HP (Local IP)
```

Aplikasi akan terbuka secara otomatis di `http://localhost:5173`.

### 5. Build untuk Produksi & Mobile

```bash
npm run build
```
*(Direktori `/dist` akan dibuat dan siap di-*deploy* atau diintegrasikan ke Capacitor untuk Android/iOS).*

---

*Project ini dikembangkan sebagai bagian dari eksperimen modernisasi aplikasi produktivitas lintas perangkat.*
