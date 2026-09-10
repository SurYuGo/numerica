import PDFDocument from "pdfkit";
import { getAnalysisById } from "../../../../lib/db";
import {
  LIFE_PATH_DATA,
  ELEMENTS,
  SUPPORTER_OF,
  CONTROLLER_OF,
  COMPAT,
} from "../../../../lib/numerology";

export const dynamic = "force-dynamic";

function streamToBuffer(doc) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

export async function GET(request, { params }) {
  try {
    const record = await getAnalysisById(params.id);
    if (!record) {
      return Response.json({ error: "Data analisis tidak ditemukan." }, { status: 404 });
    }

    const lp = LIFE_PATH_DATA[record.lifePathNumber];
    const el = ELEMENTS[record.element];
    const supportEl = ELEMENTS[SUPPORTER_OF[record.element]];
    const controlEl = ELEMENTS[CONTROLLER_OF[record.element]];
    const compat = COMPAT[record.lifePathNumber];

    const doc = new PDFDocument({ size: "A4", margin: 56 });
    const bufferPromise = streamToBuffer(doc);

    const gold = "#8A6A2E";
    const ink = "#1A1A2E";
    const muted = "#5A5A75";

    doc.font("Helvetica-Bold").fontSize(20).fillColor(ink)
      .text("Numerica — Laporan Numerologi Pribadi");
    doc.moveDown(0.4);
    doc.strokeColor(gold).lineWidth(1)
      .moveTo(56, doc.y).lineTo(539, doc.y).stroke();
    doc.moveDown(1);

    doc.font("Helvetica").fontSize(11).fillColor(muted);
    doc.text(`Nama: ${record.fullName}`);
    doc.text(`Tanggal lahir: ${record.birthDate}`);
    doc.text(`Tanggal analisis: ${new Date(record.createdAt).toLocaleDateString("id-ID")}`);
    doc.moveDown(1.2);

    doc.font("Helvetica-Bold").fontSize(15).fillColor(ink)
      .text(`Life Path ${record.lifePathNumber} — ${lp.title}`);
    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(11).fillColor(muted).text(lp.desc, { width: 483 });
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fillColor(ink).text("Sifat utama: ", { continued: true });
    doc.font("Helvetica").fillColor(muted).text(lp.traits.join(", "));
    doc.font("Helvetica-Bold").fillColor(ink).text("Catatan: ", { continued: true });
    doc.font("Helvetica").fillColor(muted).text(lp.highlight);
    doc.moveDown(1.2);

    doc.font("Helvetica-Bold").fontSize(15).fillColor(ink)
      .text(`Elemen dasar: ${el.name}`);
    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(11).fillColor(muted).text(el.desc, { width: 483 });
    doc.moveDown(1.2);

    doc.font("Helvetica-Bold").fontSize(13).fillColor(ink).text("Rekomendasi");
    doc.moveDown(0.4);
    doc.font("Helvetica").fontSize(11).fillColor(muted).text(
      `Elemen pendukung: ${supportEl.name} — warna ${supportEl.colors}; bidang: ${supportEl.industries}`,
      { width: 483 }
    );
    doc.moveDown(0.4);
    doc.text(
      `Elemen pengontrol: ${controlEl.name} — kurangi warna ${controlEl.colors}; waspada area ${controlEl.industries}`,
      { width: 483 }
    );
    doc.moveDown(0.4);
    doc.text(`Angka life path selaras: ${compat.cocok.join(", ")}`);
    doc.text(`Angka yang butuh penyesuaian ekstra: ${compat.perhatian.join(", ")}`);
    doc.moveDown(1.5);

    doc.fontSize(9).fillColor("#9090A0").text(
      "Numerica — laporan dihasilkan otomatis berdasarkan rumus numerologi Life Path.",
      { width: 483 }
    );

    doc.end();
    const buffer = await bufferPromise;

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Numerica-${record.fullName.replace(/\s+/g, "_")}.pdf"`,
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Gagal membuat laporan PDF." }, { status: 500 });
  }
}
