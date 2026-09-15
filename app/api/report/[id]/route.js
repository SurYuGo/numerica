import PDFDocument from "pdfkit";
import path from "node:path";
import { getAnalysisById } from "../../../../lib/db";
import {
  ELEMENT_MAP,
  SUPPORTER_OF,
  CONTROLLER_OF,
  COMPAT,
} from "../../../../lib/numerology";
import { LIFE_PATH_CONTENT, ELEMENT_CONTENT, normalizeLang } from "../../../../lib/content";
import { PDF_LABELS } from "../../../../lib/i18n";

export const dynamic = "force-dynamic";

// Font Latin bawaan pdfkit (Helvetica) tidak punya glyph Hanzi, jadi untuk
// laporan berbahasa Mandarin kita pakai Noto Sans SC yang di-subset otomatis
// oleh pdfkit saat embed (hasil PDF tetap kecil, meski file sumbernya besar).
const ZH_FONT_PATH = path.join(process.cwd(), "assets", "fonts", "NotoSansSC-Regular.ttf");

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
    const { searchParams } = new URL(request.url);
    const lang = normalizeLang(searchParams.get("lang"));
    const labels = PDF_LABELS[lang];

    const record = await getAnalysisById(params.id);
    if (!record) {
      return Response.json({ error: "Data analisis tidak ditemukan." }, { status: 404 });
    }

    const lp = LIFE_PATH_CONTENT[lang][record.lifePathNumber];
    const elements = ELEMENT_CONTENT[lang];
    const el = elements[record.element];
    const supportEl = elements[SUPPORTER_OF[record.element]];
    const controlEl = elements[CONTROLLER_OF[record.element]];
    const compat = COMPAT[record.lifePathNumber];

    const doc = new PDFDocument({ size: "A4", margin: 56 });
    const bufferPromise = streamToBuffer(doc);

    // Untuk Mandarin pakai Noto Sans SC (support Hanzi) untuk semua teks —
    // termasuk bagian "bold", karena instance bold terpisah tidak diregister
    // (hierarki visual tetap terjaga lewat perbedaan ukuran font).
    const fontRegular = lang === "zh" ? ZH_FONT_PATH : "Helvetica";
    const fontBold = lang === "zh" ? ZH_FONT_PATH : "Helvetica-Bold";

    const gold = "#8A6A2E";
    const ink = "#1A1A2E";
    const muted = "#5A5A75";

    doc.font(fontBold).fontSize(20).fillColor(ink).text(labels.docTitle);
    doc.moveDown(0.4);
    doc.strokeColor(gold).lineWidth(1)
      .moveTo(56, doc.y).lineTo(539, doc.y).stroke();
    doc.moveDown(1);

    doc.font(fontRegular).fontSize(11).fillColor(muted);
    doc.text(`${labels.name}: ${record.fullName}`);
    doc.text(`${labels.dob}: ${record.birthDate}`);
    doc.text(`${labels.analysisDate}: ${new Date(record.createdAt).toLocaleDateString(labels.dateLocale)}`);
    doc.moveDown(1.2);

    doc.font(fontBold).fontSize(15).fillColor(ink)
      .text(`Life Path ${record.lifePathNumber} — ${lp.title}`);
    doc.moveDown(0.3);
    doc.font(fontRegular).fontSize(11).fillColor(muted).text(lp.desc, { width: 483 });
    doc.moveDown(0.5);
    doc.font(fontBold).fillColor(ink).text(`${labels.keyTraits}: `, { continued: true });
    doc.font(fontRegular).fillColor(muted).text(lp.traits.join(", "));
    doc.font(fontBold).fillColor(ink).text(`${labels.note}: `, { continued: true });
    doc.font(fontRegular).fillColor(muted).text(lp.highlight);
    doc.moveDown(1.2);

    doc.font(fontBold).fontSize(15).fillColor(ink)
      .text(`${labels.coreElement}: ${el.name}`);
    doc.moveDown(0.3);
    doc.font(fontRegular).fontSize(11).fillColor(muted).text(el.desc, { width: 483 });
    doc.moveDown(1.2);

    doc.font(fontBold).fontSize(13).fillColor(ink).text(labels.recommendations);
    doc.moveDown(0.4);
    doc.font(fontRegular).fontSize(11).fillColor(muted).text(
      `${labels.supportElement}: ${supportEl.name} — ${labels.colors} ${supportEl.colors}; ${labels.fields}: ${supportEl.industries}`,
      { width: 483 }
    );
    doc.moveDown(0.4);
    doc.text(
      `${labels.controlElement}: ${controlEl.name} — ${labels.reduceColors} ${controlEl.colors}; ${labels.watchArea} ${controlEl.industries}`,
      { width: 483 }
    );
    doc.moveDown(0.4);
    doc.text(`${labels.compatGood}: ${compat.cocok.join(", ")}`);
    doc.text(`${labels.compatWatch}: ${compat.perhatian.join(", ")}`);
    doc.moveDown(1.5);

    doc.fontSize(9).fillColor("#9090A0").text(labels.footerNote, { width: 483 });

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
