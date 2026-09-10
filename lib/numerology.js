// ============================================================
// SUMBER DATA NUMEROLOGI & WU XING (LIMA ELEMEN)
// ============================================================

// Sumber: materi resmi Wuterra (Angka Akar / Life Path Number 1-9).
export const LIFE_PATH_DATA = {
  1: { title: "Sang Pemikir Bijaksana", desc: "Anda adalah pemikir yang bijaksana dengan kemampuan analisa yang kuat — jika diarahkan dengan baik, sifat ini bisa menjadikan Anda orang yang terpelajar. Jawaban Anda penuh pertimbangan, mendetail, dan penuh kreativitas, dilengkapi selera humor yang membuat Anda mudah menjalin relasi. Jiwa kepemimpinan dan karisma Anda justru semakin kuat seiring bertambahnya usia.", traits: ["Analitis", "Bijaksana", "Karismatik"], highlight: "Puncak peluang kesuksesan finansial ada di rentang usia 32-42 tahun" },
  2: { title: "Sang Penghubung yang Empatik", desc: "Anda supel dan pandai bicara, mampu membangun relasi baik dengan siapa pun berkat sikap yang ramah. Empati Anda tinggi dan sensitif terhadap perasaan orang lain, sekaligus terorganisir dan pekerja keras — menyukai kerapian dan selalu mempertimbangkan hasil akhir sebelum memulai sesuatu.", traits: ["Empatik", "Supel", "Terorganisir"], highlight: "Berhati lembut dan banyak bicara — mendapat dukungan dari lawan jenis" },
  3: { title: "Sang Pengejar Peluang", desc: "Anda atraktif sejak usia muda, agresif, dan berorientasi ke masa depan — mampu membaca peluang bahkan di tengah situasi yang sulit dan mengambil keputusan dengan cepat. Jiwa kepemimpinan ini bisa membawa Anda pada kehidupan yang mapan sebelum usia 30 tahun. Di balik semangat itu, waspadai kecenderungan tidak sabar dan cepat marah, meski sisi spiritual Anda cukup kuat.", traits: ["Agresif", "Cepat bertindak", "Spiritual"], highlight: "Berpeluang hidup mapan sebelum usia 30 tahun" },
  4: { title: "Sang Perencana Cerdas", desc: "Anda cerdas, artistik, dan unggul dalam bidang akademis — layak dipercaya dan mudah bergaul di masyarakat. Sebagai perencana dan pemikir alami, Anda selalu berpikir dahulu sebelum bertindak dalam mengambil keputusan. Bakat Anda terlihat sejak usia muda, termasuk cita rasa tinggi dalam kuliner yang berpotensi menjadikan Anda seorang chef handal.", traits: ["Cerdas", "Artistik", "Perencana"], highlight: "Cocok berkarier di bidang akademik, seni, atau kuliner" },
  5: { title: "Sang Pejuang Tangguh", desc: "Anda terlahir dengan karakter yang kuat dan jiwa kepemimpinan yang karismatik. Realistis dan pekerja keras, Anda mampu menyesuaikan diri dengan situasi sulit serta menghadapi rintangan dengan daya juang tinggi. Tantangan terbesar Anda adalah belajar lebih menghargai pendapat orang lain di sekitar Anda.", traits: ["Tangguh", "Realistis", "Pekerja keras"], highlight: "Kekuatan terbesar ada pada daya juang menghadapi rintangan" },
  6: { title: "Sang Pengelola Kesejahteraan", desc: "Anda cakap dalam mengontrol kekayaan dan kesejahteraan, sopan, dan memiliki selera tinggi dalam menjalani hidup. Karier Anda akan bersinar di bidang seni, keagamaan, atau pendidikan, dan Anda punya potensi menjadi figur yang populer. Keluarga adalah prioritas utama Anda — namun waspadai kecenderungan posesif dalam hubungan dekat.", traits: ["Pengelola andal", "Berorientasi keluarga", "Populer"], highlight: "Keberuntungan besar cenderung datang sekitar usia 45 tahun" },
  7: { title: "Sang Pencari Makna", desc: "Anda sangat detail dan tahu balas budi, dengan semangat mengejar ketenaran dan keberuntungan. Di usia matang, Anda berpotensi menjadi figur atau pemimpin religius yang dihormati. Keberuntungan Anda didukung oleh perhatian dan dukungan dari lawan jenis.", traits: ["Detail", "Setia", "Reflektif"], highlight: "Potensi menjadi figur atau pemimpin religius di atas usia 50 tahun" },
  8: { title: "Sang Penjaga Komitmen", desc: "Anda pendiam dan konservatif, namun sangat bertanggung jawab dalam memegang komitmen. Meski terlihat tegas dan keras di luar, hati Anda sebenarnya lembut. Kesibukan dan sisi emosional membuat Anda rentan stres di bawah tekanan, tapi rasa tanggung jawab Anda tetap menjadi kekuatan utama.", traits: ["Bertanggung jawab", "Tegas", "Berhati lembut"], highlight: "Kekuatan utama: memegang komitmen meski di bawah tekanan" },
  9: { title: "Sang Visioner Optimis", desc: "Anda optimis, berpikiran terbuka, dan senang tampil elegan. Pribadi yang bersahaja dan sensitif ini pandai mengambil simpati orang lain, serta bekerja keras untuk mengejar impian besar. Keberuntungan dan kesuksesan cenderung datang di atas usia 35 tahun — tetap waspadai kecenderungan serakah saat mengejar ambisi.", traits: ["Optimis", "Inovatif", "Berimpian besar"], highlight: "Keberuntungan & kesuksesan besar cenderung muncul di atas usia 35 tahun" },
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

// Menghasilkan objek hasil analisis lengkap dari nama + tanggal lahir.
// (Nama disimpan untuk keperluan laporan/tampilan; rumus life path
// murni berdasarkan tanggal lahir, sesuai materi.)
export function buildAnalysis(fullName, birthDate) {
  const lifePathNumber = calculateLifePath(birthDate);
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
    lifePathHighlight: lp.highlight,
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
