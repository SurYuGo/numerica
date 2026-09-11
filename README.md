# Numerica — Website Numerologi & Elemen Wu Xing

Website full-stack (frontend + backend + database) untuk analisis Life Path numerologi dan elemen dasar (Wu Xing), lengkap dengan laporan PDF yang bisa diunduh. **Sudah dibangun, di-build, dan diuji end-to-end** (termasuk dites langsung ke database PostgreSQL sungguhan) — siap di-hosting.

---

## Yang sudah dibangun & teruji

| Bagian | Teknologi | Keterangan |
|---|---|---|
| Frontend | **Next.js (React)** | Wizard 4 langkah: data diri → life path → elemen → rekomendasi |
| Backend | **Next.js API Routes** | `/api/calculate`, `/api/stats`, `/api/report/[id]`, `/api/cleanup` |
| Database | **PostgreSQL** (lewat package `pg`) | Dipilih supaya cocok dengan hosting gratis serverless (lihat `DEPLOY.md`) |
| Laporan PDF | **pdfkit** (server-side) | Dibuat dari data yang sama yang tersimpan di database |
| Kalkulasi | **Rumus resmi** (materi Wuterra) | Reduksi digit tanggal lahir (DD+MM+YYYY → 1 digit), interpretasi Angka Akar 1-9 sesuai materi |
| Pembersihan data | Otomatis, **>30 hari dihapus** | Berjalan sesekali saat ada trafik + dijamin harian lewat Vercel Cron (`vercel.json`) |

---

## Tentang halaman hasil

Di segmen akhir (setelah rekomendasi), yang ditampilkan ke pengunjung **hanya total angka** "sudah X orang menemukan jalur hidup mereka di sini" — bukan daftar nama atau riwayat siapa pun. Diambil dari `/api/stats` yang cuma mengembalikan hitungan (`COUNT`), tidak ada data personal yang di-expose ke publik.

---

## Tentang pembersihan data otomatis (>30 hari)

Supaya database tidak terus membesar, data analisis yang lebih lama dari 30 hari dihapus otomatis lewat dua jalur:
1. **Saat ada trafik** — setiap kali ada yang submit form, ada peluang kecil (10%) sistem sekalian membersihkan data lama. Tidak butuh infra tambahan.
2. **Cron harian** — `vercel.json` sudah berisi konfigurasi Vercel Cron yang memanggil `/api/cleanup` tiap hari jam 3 pagi UTC, sebagai jaminan meski trafik sepi.

**Opsional tapi disarankan:** tambahkan environment variable `CRON_SECRET` (isi bebas, string acak) di Vercel supaya endpoint `/api/cleanup` tidak bisa dipanggil publik sembarangan. Detail lengkap ada di `DEPLOY.md`.

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

## Tentang rumus kalkulasi

Life Path dihitung di `lib/numerology.js`, fungsi `calculateLifePath(birthDate)`, sesuai **Metode 2** dari materi Wuterra: jumlahkan semua digit tanggal lahir (DD+MM+YYYY), reduksi terus sampai 1 digit.

```javascript
export function calculateLifePath(birthDate) {
  // Contoh dari materi: 25-08-1985 -> 2+5+0+8+1+9+8+5 = 38 -> 3+8 = 11 -> 1+1 = 2
  ...
}
```

Sudah diverifikasi menghasilkan angka yang sama persis dengan contoh di materi. Interpretasi Angka Akar 1-9 (judul, deskripsi, sifat, catatan) juga sudah diambil langsung dari materi tersebut, di object `LIFE_PATH_DATA` pada file yang sama.

Kalau nanti mau menambahkan **Metode 1** (piramida A-X untuk elemen dominan/hilang, ada di materi tapi belum diimplementasikan) atau menyesuaikan rumus lain, semua tetap di file ini — struktur API, database, dan tampilan tidak perlu diubah selama fungsi ini tetap mengembalikan angka 1-9.

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
