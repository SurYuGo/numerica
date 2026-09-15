// ============================================================
// SUMBER DATA NUMEROLOGI & WU XING (LIMA ELEMEN)
// Konten teks (judul, deskripsi, dll) sudah dipindah ke lib/content.js
// supaya mendukung banyak bahasa. File ini fokus pada logika kalkulasi
// dan struktur/hubungan yang tidak berubah antar bahasa.
// ============================================================

import { LIFE_PATH_CONTENT, ELEMENT_CONTENT, normalizeLang } from "./content";

// mapping angka life path -> elemen dasar (Wu Xing)
export const ELEMENT_MAP = { 1: "logam", 6: "logam", 2: "air", 7: "air", 3: "api", 8: "api", 4: "kayu", 9: "kayu", 5: "tanah" };

// warna hex per elemen — dipakai untuk styling, tidak berubah antar bahasa
export const ELEMENT_HEX = { kayu: "#4F8A63", api: "#DB6A34", tanah: "#B98F49", logam: "#AEB3C2", air: "#3E82A6" };

// siklus menghasilkan (sheng): kayu -> api -> tanah -> logam -> air -> kayu
export const WHEEL_ORDER = ["kayu", "api", "tanah", "logam", "air"];
// elemen pendukung = elemen yang MENGHASILKAN elemen X
export const SUPPORTER_OF = { kayu: "air", api: "kayu", tanah: "api", logam: "tanah", air: "logam" };
// elemen pengontrol = elemen yang MENGENDALIKAN/MENAHAN elemen X
export const CONTROLLER_OF = { kayu: "logam", tanah: "kayu", air: "tanah", api: "air", logam: "api" };

export const COMPAT = {
  1: { cocok: [3, 5], perhatian: [2] },
  2: { cocok: [6, 9], perhatian: [1] },
  3: { cocok: [1, 5], perhatian: [7] },
  4: { cocok: [7, 8], perhatian: [3] },
  5: { cocok: [1, 3], perhatian: [6] },
  6: { cocok: [2, 9], perhatian: [5] },
  7: { cocok: [4, 9], perhatian: [8] },
  8: { cocok: [4, 7], perhatian: [1] },
  9: { cocok: [2, 6], perhatian: [8] },
};

// ============================================================
// FUNGSI KALKULASI — RUMUS RESMI (Metode 2, materi Wuterra)
// ------------------------------------------------------------
// Jumlahkan seluruh digit tanggal lahir (DD + MM + YYYY), lalu
// reduksi terus-menerus sampai jadi 1 digit (1-9).
// Contoh dari materi: 25-08-1985 -> 2+5+0+8+1+9+8+5 = 38 -> 3+8 = 11 -> 1+1 = 2
// ============================================================
function reduceToSingleDigit(n) {
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

export function calculateLifePath(birthDate) {
  // birthDate diharapkan dalam format "YYYY-MM-DD" (format bawaan <input type="date">)
  const [yyyy, mm, dd] = (birthDate || "").split("-");
  if (!yyyy || !mm || !dd) return 1; // fallback aman bila format tak terduga

  const combined = `${dd}${mm}${yyyy}`;
  const total = combined
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);

  return reduceToSingleDigit(total);
}

// Menghasilkan objek hasil analisis lengkap dari nama + tanggal lahir,
// dengan teks (judul, deskripsi, dll) dalam bahasa yang dipilih.
// (Nama disimpan untuk keperluan laporan/tampilan; rumus life path
// murni berdasarkan tanggal lahir, sesuai materi — tidak dipengaruhi bahasa.)
export function buildAnalysis(fullName, birthDate, lang = "id") {
  const safeLang = normalizeLang(lang);
  const lifePathNumber = calculateLifePath(birthDate);
  const element = ELEMENT_MAP[lifePathNumber];
  const supportElement = SUPPORTER_OF[element];
  const controlElement = CONTROLLER_OF[element];
  const lp = LIFE_PATH_CONTENT[safeLang][lifePathNumber];
  const elements = ELEMENT_CONTENT[safeLang];
  const compat = COMPAT[lifePathNumber];

  return {
    fullName,
    birthDate,
    lang: safeLang,
    lifePathNumber,
    lifePathTitle: lp.title,
    lifePathDesc: lp.desc,
    lifePathTraits: lp.traits,
    lifePathHighlight: lp.highlight,
    element,
    elementName: elements[element].name,
    elementDesc: elements[element].desc,
    supportElement,
    supportElementName: elements[supportElement].name,
    supportColors: elements[supportElement].colors,
    supportIndustries: elements[supportElement].industries,
    controlElement,
    controlElementName: elements[controlElement].name,
    controlColors: elements[controlElement].colors,
    controlIndustries: elements[controlElement].industries,
    compatGood: compat.cocok,
    compatWatch: compat.perhatian,
  };
}
