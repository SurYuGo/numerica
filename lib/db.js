import { Pool } from "pg";
import { randomUUID } from "node:crypto";

// Koneksi ke PostgreSQL. Untuk lokal, arahkan DATABASE_URL ke Postgres lokal.
// Untuk produksi (Neon, Supabase, Vercel Postgres, dll), DATABASE_URL cukup
// diisi connection string yang diberikan platform tersebut lewat environment
// variable — tidak ada perubahan kode yang diperlukan.
const globalForDb = globalThis;

function getPool() {
  if (globalForDb.__numericaPool) return globalForDb.__numericaPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL belum diset. Isi environment variable DATABASE_URL dengan connection string PostgreSQL kamu (lihat .env.example)."
    );
  }

  const pool = new Pool({
    connectionString,
    // Neon/Supabase/kebanyakan Postgres hosted mewajibkan SSL.
    // Postgres lokal biasanya tidak butuh SSL, jadi kita deteksi otomatis.
    ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
  });

  globalForDb.__numericaPool = pool;
  return pool;
}

let schemaReady = null;
async function ensureSchema() {
  if (schemaReady) return schemaReady;
  const pool = getPool();
  schemaReady = pool.query(`
    CREATE TABLE IF NOT EXISTS analysis (
      id TEXT PRIMARY KEY,
      "fullName" TEXT NOT NULL,
      "birthDate" TEXT NOT NULL,
      "lifePathNumber" INTEGER NOT NULL,
      element TEXT NOT NULL,
      "supportElement" TEXT NOT NULL,
      "controlElement" TEXT NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  return schemaReady;
}

export async function createAnalysis(data) {
  const pool = getPool();
  await ensureSchema();
  const id = randomUUID();
  const result = await pool.query(
    `INSERT INTO analysis (id, "fullName", "birthDate", "lifePathNumber", element, "supportElement", "controlElement")
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id, "createdAt"`,
    [id, data.fullName, data.birthDate, data.lifePathNumber, data.element, data.supportElement, data.controlElement]
  );
  return result.rows[0];
}

export async function listRecentAnalyses(limit = 20) {
  const pool = getPool();
  await ensureSchema();
  const result = await pool.query(
    `SELECT * FROM analysis ORDER BY "createdAt" DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export async function getAnalysisById(id) {
  const pool = getPool();
  await ensureSchema();
  const result = await pool.query(`SELECT * FROM analysis WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

// Total jumlah orang yang pernah menghitung (dipakai untuk statistik di halaman
// hasil — hanya angkanya saja, tidak menampilkan daftar/nama siapa pun).
export async function countAnalyses() {
  const pool = getPool();
  await ensureSchema();
  const result = await pool.query(`SELECT COUNT(*)::int AS count FROM analysis`);
  return result.rows[0].count;
}

// Menghapus data analisis yang lebih lama dari `days` hari (default 30).
// Dipakai supaya tabel tidak terus membesar tanpa batas.
export async function deleteOldAnalyses(days = 30) {
  const pool = getPool();
  await ensureSchema();
  const result = await pool.query(
    `DELETE FROM analysis WHERE "createdAt" < now() - ($1 || ' days')::interval`,
    [days]
  );
  return result.rowCount;
}
