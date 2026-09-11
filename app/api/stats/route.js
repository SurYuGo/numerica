import { countAnalyses } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const total = await countAnalyses();
    return Response.json({ total });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Gagal mengambil statistik." }, { status: 500 });
  }
}
