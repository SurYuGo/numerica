# Numerica — Website Numerologi & Elemen Wu Xing

Website full-stack (frontend + backend + database) untuk analisis Life Path numerologi dan elemen dasar (Wu Xing), lengkap dengan laporan PDF yang bisa diunduh. **Sudah dibangun, di-build, dan diuji end-to-end** (termasuk dites langsung ke database PostgreSQL sungguhan) — siap di-hosting.

---

## Yang sudah dibangun & teruji

| Bagian | Teknologi | Keterangan |
|---|---|---|
| Frontend | **Next.js (React)** | Wizard 4 langkah: data diri → life path → elemen → rekomendasi |
| Backend | **Next.js API Routes** | `/api/calculate`, `/api/history`, `/api/report/[id]` |
| Database | **PostgreSQL** (lewat package `pg`) | Dipilih supaya cocok dengan hosting gratis serverless (lihat `DEPLOY.md`) |
| Laporan PDF | **pdfkit** (server-side) | Dibuat dari data yang sama yang tersimpan di database |
| Kalkulasi | Placeholder deterministik | Satu fungsi di `lib/numerology.js`, siap diganti rumus asli |

---

## Cara menjalankan di lokal

**Syarat:** Node.js 18+ dan sebuah database PostgreSQL (lokal atau gratis dari [neon.tech](https://neon.tech) — lihat `DEPLOY.md`).

```bash
cd numerica-app
npm install
cp .env.example .env
# edit .env, isi DATABASE_URL dengan connection string Postgres kamu
npm run dev
```

Buka `http://localhost:3000`. Tabel database dibuat otomatis saat pertama kali ada yang submit form — tidak perlu migrasi manual.

Mode produksi:
```bash
npm run build
npm run start
```

---

## 🚀 Mau langsung di-hosting gratis sekarang?

Buka **`DEPLOY.md`** — panduan lengkap langkah demi langkah untuk hosting **gratis** di Vercel + Neon, bisa selesai dalam waktu sekitar 10 menit.

---

## Cara mengganti rumus kalkulasi nanti

Buka `lib/numerology.js`, cari fungsi ini di bagian bawah file:

```javascript
export function calculateLifePath(fullName, birthDate) {
  // TODO: ganti isi fungsi ini dengan rumus numerologi resmi
  ...
}
```

Ganti isi fungsinya dengan rumus yang benar. Selama fungsi ini tetap menerima `(fullName, birthDate)` dan mengembalikan angka 1-9, **tidak ada bagian lain dari sistem yang perlu diubah**.

---

## Struktur project

```
numerica-app/
├── app/
│   ├── page.js                    ← halaman utama (wizard UI)
│   ├── layout.js                  ← layout & font
│   ├── globals.css                ← semua styling
│   ├── components/
│   │   ├── Starfield.js           ← animasi bintang latar belakang
│   │   └── ElementWheel.js        ← diagram roda elemen Wu Xing
│   └── api/
│       ├── calculate/route.js     ← hitung + simpan ke database
│       ├── history/route.js       ← ambil riwayat dari database
│       └── report/[id]/route.js   ← generate & kirim PDF
├── lib/
│   ├── numerology.js               ← SEMUA data numerologi + fungsi kalkulasi
│   └── db.js                       ← lapisan database (PostgreSQL)
├── package.json
└── next.config.js
```
"# numerica" 
