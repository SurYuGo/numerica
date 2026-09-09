import { createAnalysis } from "../../../lib/db";
import { buildAnalysis } from "../../../lib/numerology";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const fullName = (body.fullName || "").trim();
    const birthDate = (body.birthDate || "").trim();

    if (!fullName || !birthDate) {
      return Response.json(
        { error: "Nama lengkap dan tanggal lahir wajib diisi." },
        { status: 400 }
      );
    }

    const analysis = buildAnalysis(fullName, birthDate);

    const saved = await createAnalysis({
      fullName: analysis.fullName,
      birthDate: analysis.birthDate,
      lifePathNumber: analysis.lifePathNumber,
      element: analysis.element,
      supportElement: analysis.supportElement,
      controlElement: analysis.controlElement,
    });

    return Response.json({ id: saved.id, createdAt: saved.createdAt, ...analysis });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Terjadi kesalahan saat menghitung analisis." }, { status: 500 });
  }
}
