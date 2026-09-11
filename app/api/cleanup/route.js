import { deleteOldAnalyses } from "../../../lib/db";

export const dynamic = "force-dynamic";

// Endpoint ini dipanggil otomatis setiap hari oleh Vercel Cron (lihat vercel.json)
// untuk menghapus data analisis yang sudah lebih dari 30 hari.
//
// Kalau CRON_SECRET diisi di environment variable, endpoint ini hanya bisa
// dipanggil oleh Vercel Cron (yang otomatis mengirim header Authorization
// berisi secret tsb) — bukan oleh publik. Kalau CRON_SECRET belum diisi,
// endpoint tetap jalan (berguna untuk tes manual di awal), tapi sebaiknya
// diisi begitu sudah live. Lihat DEPLOY.md.
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const deletedCount = await deleteOldAnalyses(30);
    return Response.json({ ok: true, deletedCount });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Gagal membersihkan data lama." }, { status: 500 });
  }
}
