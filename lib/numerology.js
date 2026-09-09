// ============================================================
// SUMBER DATA NUMEROLOGI & WU XING (LIMA ELEMEN)
// ============================================================

export const LIFE_PATH_DATA = {
  1: { title: "Sang Pemimpin", desc: "Individu dengan jiwa mandiri, penuh inisiatif, dan berani memulai jalan yang belum pernah dilalui orang lain. Motivasi terbesarnya adalah menciptakan sesuatu dari nol dan membuktikan kemampuannya sendiri.", traits: ["Mandiri", "Inisiatif", "Percaya diri"], career: "wirausaha, manajemen, riset & pengembangan" },
  2: { title: "Sang Penyeimbang", desc: "Peka terhadap perasaan orang lain, ahli menjembatani perbedaan, dan tumbuh lewat kerja sama, bukan kompetisi. Kekuatannya ada pada kesabaran dan kemampuan mendengarkan.", traits: ["Empatik", "Diplomatis", "Kooperatif"], career: "mediasi, konseling, hubungan masyarakat" },
  3: { title: "Sang Kreator", desc: "Ekspresif, imajinatif, dan punya cara pandang yang menyegarkan. Energinya paling hidup ketika bisa berbagi ide lewat kata, gambar, atau pertunjukan.", traits: ["Ekspresif", "Optimis", "Imajinatif"], career: "seni, penulisan, marketing kreatif" },
  4: { title: "Sang Pembangun", desc: "Tekun, terstruktur, dan percaya bahwa hasil yang bertahan lama dibangun lewat proses yang disiplin. Ia adalah fondasi yang bisa diandalkan tim mana pun.", traits: ["Disiplin", "Teliti", "Bertanggung jawab"], career: "teknik, manajemen proyek, keuangan" },
  5: { title: "Sang Penjelajah", desc: "Haus akan pengalaman baru, gesit beradaptasi, dan gelisah bila terlalu lama berada di zona nyaman. Perubahan bukan ancaman baginya, melainkan bahan bakar.", traits: ["Adaptif", "Bebas", "Rasa ingin tahu tinggi"], career: "media, travel & pariwisata, sales" },
  6: { title: "Sang Pengasuh", desc: "Bertanggung jawab besar terhadap orang-orang di sekitarnya, hangat, dan menemukan makna lewat memberi. Rumah dan komunitas menjadi pusat dunianya.", traits: ["Penyayang", "Bertanggung jawab", "Harmonis"], career: "pendidikan, kesehatan, layanan komunitas" },
  7: { title: "Sang Pencari", desc: "Reflektif, analitis, dan lebih tertarik pada makna di balik sesuatu daripada tampilan luarnya. Butuh waktu sendiri untuk mengolah pikiran secara mendalam.", traits: ["Analitis", "Intuitif", "Reflektif"], career: "riset, teknologi, spiritualitas & filsafat" },
  8: { title: "Sang Pengelola", desc: "Berorientasi pada hasil, punya insting bisnis yang kuat, dan nyaman memegang kendali atas sumber daya besar. Ambisinya berjalan seiring kemampuan eksekusinya.", traits: ["Ambisius", "Strategis", "Berwibawa"], career: "bisnis, investasi, kepemimpinan eksekutif" },
  9: { title: "Sang Penyempurna", desc: "Berpandangan luas, peduli pada kepentingan bersama, dan sering menjadi tempat orang lain mencari nasihat. Perjalanan hidupnya cenderung soal memberi makna yang lebih besar.", traits: ["Humanis", "Bijaksana", "Berwawasan luas"], career: "filantropi, advokasi, pendidikan tinggi" },
};

// mapping angka life path -> elemen dasar (Wu Xing)
export const ELEMENT_MAP = { 1: "logam", 6: "logam", 2: "air", 7: "air", 3: "api", 8: "api", 4: "kayu", 9: "kayu", 5: "tanah" };

export const ELEMENTS = {
  kayu: { name: "Kayu", hex: "#4F8A63", desc: "Kayu melambangkan pertumbuhan, fleksibilitas, dan kreativitas yang terus berkembang. Orang dengan elemen ini cenderung mudah beradaptasi namun tetap punya arah yang jelas.", colors: "hijau tua, hijau lumut", industries: "kreatif, pendidikan, lingkungan, startup" },
  api: { name: "Api", hex: "#DB6A34", desc: "Api melambangkan semangat, kepemimpinan, dan energi yang menyala terang. Orang dengan elemen ini membawa antusiasme yang mudah menular ke sekitarnya.", colors: "merah, oranye, ungu terang", industries: "wirausaha, hiburan, penjualan, olahraga" },
  tanah: { name: "Tanah", hex: "#B98F49", desc: "Tanah melambangkan stabilitas, kepercayaan, dan kemampuan menopang orang lain. Orang dengan elemen ini menjadi tempat berpijak yang kokoh bagi lingkungannya.", colors: "kuning, cokelat, krem", industries: "properti, keuangan, konsultasi, agrikultur" },
  logam: { name: "Logam", hex: "#AEB3C2", desc: "Logam melambangkan ketelitian, struktur, dan prinsip yang tegas. Orang dengan elemen ini menghargai kualitas dan tidak mudah berkompromi pada standar.", colors: "putih, abu-abu, emas pucat", industries: "hukum, teknik, keuangan, manufaktur" },
  air: { name: "Air", hex: "#3E82A6", desc: "Air melambangkan intuisi, adaptasi, dan kedalaman berpikir. Orang dengan elemen ini bergerak tenang namun mampu menembus hambatan yang paling keras sekalipun.", colors: "biru, hitam, biru dongker", industries: "riset, terapi, sastra, strategi" },
};

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
// FUNGSI KALKULASI — PLACEHOLDER
// ------------------------------------------------------------
// Ini SATU-SATUNYA fungsi yang perlu diganti begitu rumus
// numerologi resmi sudah ada. Input & output-nya jaga tetap sama
// (terima fullName + birthDate string, kembalikan angka 1-9)
// supaya seluruh sistem lain (API, DB, PDF, UI) tidak perlu diubah.
// ============================================================
export function calculateLifePath(fullName, birthDate) {
  // TODO: ganti isi fungsi ini dengan rumus numerologi resmi
  // (misalnya reduksi digit tanggal lahir ala Pythagorean numerology).
  let seed = 0;
  const str = (fullName || "").trim().toLowerCase() + (birthDate || "");
  for (let i = 0; i < str.length; i++) {
    seed = (seed * 31 + str.charCodeAt(i)) >>> 0;
  }
  return (seed % 9) + 1;
}

// Menghasilkan objek hasil analisis lengkap dari nama + tanggal lahir.
export function buildAnalysis(fullName, birthDate) {
  const lifePathNumber = calculateLifePath(fullName, birthDate);
  const element = ELEMENT_MAP[lifePathNumber];
  const supportElement = SUPPORTER_OF[element];
  const controlElement = CONTROLLER_OF[element];
  const lp = LIFE_PATH_DATA[lifePathNumber];
  const compat = COMPAT[lifePathNumber];

  return {
    fullName,
    birthDate,
    lifePathNumber,
    lifePathTitle: lp.title,
    lifePathDesc: lp.desc,
    lifePathTraits: lp.traits,
    lifePathCareer: lp.career,
    element,
    elementName: ELEMENTS[element].name,
    elementDesc: ELEMENTS[element].desc,
    supportElement,
    supportElementName: ELEMENTS[supportElement].name,
    supportColors: ELEMENTS[supportElement].colors,
    supportIndustries: ELEMENTS[supportElement].industries,
    controlElement,
    controlElementName: ELEMENTS[controlElement].name,
    controlColors: ELEMENTS[controlElement].colors,
    controlIndustries: ELEMENTS[controlElement].industries,
    compatGood: compat.cocok,
    compatWatch: compat.perhatian,
  };
}
