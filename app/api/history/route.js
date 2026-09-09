import { listRecentAnalyses } from "../../../lib/db";
import { ELEMENTS } from "../../../lib/numerology";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await listRecentAnalyses(20);

    const result = items.map((item) => ({
      id: item.id,
      fullName: item.fullName,
      lifePathNumber: item.lifePathNumber,
      elementName: ELEMENTS[item.element]?.name || item.element,
      createdAt: item.createdAt,
    }));

    return Response.json(result);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Gagal mengambil riwayat." }, { status: 500 });
  }
}
