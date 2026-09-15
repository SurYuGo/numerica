/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // pdfkit membaca file data (.afm font metrics) secara relatif ke posisinya
  // di node_modules saat runtime — kalau di-bundle oleh webpack, path itu rusak.
  // Ini memastikan pdfkit (dan fontkit turunannya) dipakai langsung dari
  // node_modules tanpa dibundel, supaya path file datanya tetap valid.
  experimental: {
    serverComponentsExternalPackages: ["pdfkit", "fontkit"],
    // Font CJK (untuk laporan PDF berbahasa Mandarin) dimuat lewat fs.readFileSync
    // dengan path dinamis, yang tidak selalu terdeteksi otomatis oleh output
    // file tracing Vercel — baris ini memastikan filenya tetap ikut ter-bundle.
    outputFileTracingIncludes: {
      "/api/report/[id]": ["./assets/fonts/**"],
    },
  },
};

module.exports = nextConfig;
