# Panduan Hosting Gratis — Numerica

Kombinasi yang saya siapkan: **Neon** (PostgreSQL gratis, tanpa kartu kredit) + **Vercel** (hosting Next.js gratis). Total waktu kira-kira 10 menit.

> **Catatan jujur:** saya tidak bisa login/membuat akun di Neon atau Vercel atas nama kamu — itu perlu kamu lakukan sendiri (butuh email/GitHub kamu). Tapi semua kode di project ini sudah saya siapkan, build, dan tes penuh (termasuk sudah saya coba sambungkan ke PostgreSQL sungguhan dan berhasil), jadi langkah kamu tinggal klik-klik saja, bukan coding.

---

## Langkah 1 — Buat database gratis di Neon (± 2 menit)

1. Buka **[neon.tech](https://neon.tech)** → **Sign up** (bisa pakai akun GitHub/Google, gratis, tanpa kartu kredit).
2. Setelah masuk dashboard, klik **Create a project**. Beri nama bebas, misalnya `numerica`.
3. Neon otomatis kasih **Connection String** — bentuknya seperti ini:
   ```
   postgresql://neondb_owner:xxxxx@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **Copy connection string ini** — akan dipakai di Langkah 3.

---

## Langkah 2 — Upload project ke GitHub (± 3 menit)

1. Extract file `numerica-app.zip` yang saya berikan.
2. Buat repository baru di [github.com/new](https://github.com/new) (bisa privat).
3. Di folder project, jalankan:
   ```bash
   cd numerica-app
   git init
   git add .
   git commit -m "Numerica — initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
   *(Ganti `USERNAME/NAMA-REPO` dengan repo kamu sendiri.)*

---

## Langkah 3 — Deploy ke Vercel (± 4 menit)

1. Buka **[vercel.com](https://vercel.com)** → **Sign up** (paling gampang pakai akun GitHub yang sama).
2. Klik **Add New** → **Project** → pilih repo `numerica-app` yang barusan kamu push.
3. Vercel otomatis mendeteksi ini project Next.js — biarkan pengaturan build default (tidak perlu diubah).
4. Sebelum klik Deploy, buka bagian **Environment Variables**, tambahkan:
   - **Name:** `DATABASE_URL`
   - **Value:** *(tempel connection string dari Neon di Langkah 1)*
   - *(opsional tapi disarankan)* tambahkan satu lagi — **Name:** `CRON_SECRET`, **Value:** string acak bebas (mis. `numerica-cron-9f8x`) — ini mengunci endpoint pembersihan data otomatis supaya tidak bisa dipanggil publik.
5. Klik **Deploy**. Tunggu ± 1-2 menit.
6. Selesai! Vercel kasih URL publik seperti `numerica-app.vercel.app` — website kamu sudah live dan bisa diakses siapa saja, lengkap dengan database yang benar-benar tersimpan permanen.
7. Vercel otomatis mengaktifkan **Cron Job** dari `vercel.json` yang sudah ada di project ini — setiap hari jam 3 pagi UTC, data analisis yang lebih dari 30 hari otomatis dihapus. Bisa dicek statusnya di tab **Cron Jobs** pada dashboard project.

---

## Alternatif tercepat: tanpa GitHub, langsung dari komputer kamu

Kalau tidak mau ribet dengan GitHub dulu, Vercel juga bisa deploy langsung dari folder di komputer:

```bash
cd numerica-app
npm install -g vercel
vercel login
vercel --prod
```
Ikuti pertanyaan yang muncul di terminal (nama project, dsb). Saat ditanya environment variable, tambahkan `DATABASE_URL` dengan connection string dari Neon (Langkah 1), atau tambahkan belakangan lewat dashboard Vercel → Settings → Environment Variables, lalu redeploy.

---

## Setelah live

- Setiap kamu push perubahan baru ke GitHub (kalau pakai cara Langkah 2), Vercel **otomatis deploy ulang** — tidak perlu upload manual lagi.
- Mau pasang domain sendiri (misalnya `numerica.id`)? Buka project di Vercel → **Settings → Domains** → tambahkan domain kamu, ikuti instruksi DNS-nya.
- Neon free tier cukup untuk ribuan baris data analisis dan trafik ringan-menengah — cocok untuk mulai dan berkembang tanpa biaya.

---

## Kalau nanti mau ganti rumus numerologi

Edit `lib/numerology.js` di repo GitHub kamu (atau di lokal lalu `git push`), Vercel otomatis build ulang dengan rumus barunya. Tidak perlu setup ulang apa pun.
