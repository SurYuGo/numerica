import { createAnalysis, deleteOldAnalyses } from "../../../lib/db";
import { buildAnalysis } from "../../../lib/numerology";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const fullName = (body.fullName || "").trim();
    const birthDate = (body.birthDate || "").trim();
    const lang = body.lang || "id";

    if (!fullName || !birthDate) {
      return Response.json(
        { error: "Nama lengkap dan tanggal lahir wajib diisi." },
        { status: 400 }
      );
    }

    const analysis = buildAnalysis(fullName, birthDate, lang);

    const saved = await createAnalysis({
      fullName: analysis.fullName,
      birthDate: analysis.birthDate,
      lifePathNumber: analysis.lifePathNumber,
      element: analysis.element,
      supportElement: analysis.supportElement,
      controlElement: analysis.controlElement,
    });

    // Bersih-bersih data lama (>30 hari) sesekali saat ada trafik, supaya
    // tabel tidak terus membesar tanpa perlu infra tambahan. Dijalankan
    // dengan peluang kecil (bukan tiap request) supaya tidak menambah beban.
    // Untuk jaminan pembersihan harian meski trafik sepi, lihat /api/cleanup
    // yang dipanggil oleh Vercel Cron (lihat vercel.json).
    if (Math.random() < 0.1) {
      try {
        await deleteOldAnalyses(30);
      } catch (cleanupErr) {
        console.error("Gagal membersihkan data lama:", cleanupErr);
      }
    }

    return Response.json({ id: saved.id, createdAt: saved.createdAt, ...analysis });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Terjadi kesalahan saat menghitung analisis." }, { status: 500 });
  }
}
