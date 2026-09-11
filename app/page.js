"use client";

import { useState, useEffect, useRef } from "react";
import Starfield from "./components/Starfield";
import ElementWheel from "./components/ElementWheel";

const STEPS = ["form", "calc", "result", "element", "recommend"];
const STEP_LABELS = ["Data diri", "Life path", "Elemen", "Rekomendasi"];
const CALC_MESSAGES = [
  "Menerjemahkan angka…",
  "Membaca pola tanggal lahir…",
  "Menyelaraskan dengan elemen…",
  "Hampir selesai…",
];

function stepperIndex(step) {
  if (step === "form") return 0;
  if (step === "calc" || step === "result") return 1;
  if (step === "element") return 2;
  return 3;
}

export default function Page() {
  const [step, setStep] = useState("form");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [calcMessage, setCalcMessage] = useState(CALC_MESSAGES[0]);
  const [downloading, setDownloading] = useState(false);
  const [totalCount, setTotalCount] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const msgIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (msgIntervalRef.current) clearInterval(msgIntervalRef.current);
    };
  }, []);

  // Deteksi keyboard on-screen (Visual Viewport API) supaya layout bisa
  // menyesuaikan posisi — penting untuk layar sangat tinggi seperti kiosk/
  // signage vertikal, di mana keyboard bawaan sistem bisa terasa jauh dari
  // form kalau posisi form tidak ikut menyesuaikan.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    function handleViewportResize() {
      // Keyboard dianggap terbuka kalau tinggi visual viewport menyusut
      // signifikan dibanding tinggi layar penuh.
      const shrunk = vv.height < window.innerHeight * 0.75;
      document.body.classList.toggle("keyboard-open", shrunk);
    }

    vv.addEventListener("resize", handleViewportResize);
    return () => vv.removeEventListener("resize", handleViewportResize);
  }, []);

  // Saat input difokus (keyboard baru saja terbuka), pastikan input itu
  // tetap terlihat jelas di atas keyboard, di layar berapa pun tingginya.
  function scrollFieldIntoView(e) {
    const target = e.target;
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Nama lengkap wajib diisi.";
    if (!birthDate) newErrors.birthDate = "Tanggal lahir wajib diisi.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitError("");
    setStep("calc");
    let mi = 0;
    setCalcMessage(CALC_MESSAGES[0]);
    msgIntervalRef.current = setInterval(() => {
      mi = (mi + 1) % CALC_MESSAGES.length;
      setCalcMessage(CALC_MESSAGES[mi]);
    }, 500);

    const minDelay = new Promise((resolve) => setTimeout(resolve, 1900));

    try {
      const [res] = await Promise.all([
        fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName: fullName.trim(), birthDate }),
        }),
        minDelay,
      ]);

      clearInterval(msgIntervalRef.current);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || "Gagal menghitung analisis. Coba lagi.");
        setStep("form");
        return;
      }

      const data = await res.json();
      setResult(data);
      setStep("result");
      fetch("/api/stats")
        .then((r) => (r.ok ? r.json() : null))
        .then((s) => s && setTotalCount(s.total))
        .catch(() => {});
    } catch (err) {
      clearInterval(msgIntervalRef.current);
      setSubmitError("Tidak bisa terhubung ke server. Coba lagi.");
      setStep("form");
    }
  }

  async function handleDownloadPdf() {
    if (!result?.id) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/report/${result.id}`);
      if (!res.ok) throw new Error("gagal");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Numerica-${result.fullName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Gagal mengunduh laporan PDF. Coba lagi.");
    } finally {
      setDownloading(false);
    }
  }

  function handleRestart() {
    setFullName("");
    setBirthDate("");
    setResult(null);
    setErrors({});
    setSubmitError("");
    setStep("form");
  }

  const activeIdx = stepperIndex(step);

  return (
    <>
      <Starfield />
      <div className="app">
        <header className="top">
          <div className="brand">
            <span className="mark"></span>
            <span className="name">Numerica</span>
            <span className="tag">&nbsp;— numerologi &amp; elemen diri</span>
          </div>
        </header>

        <nav className="stepper">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className={`node ${i === activeIdx ? "active" : ""} ${i < activeIdx ? "done" : ""}`}>
              {i < STEP_LABELS.length - 1 && <div className="connector"></div>}
              <div className="circle">{i + 1}</div>
              <div className="label">{label}</div>
            </div>
          ))}
        </nav>

        <main>
          {step === "form" && (
            <section className="step">
              <div className="panel">
                <div className="step-heading">
                  <h2>Temukan jalur hidupmu</h2>
                  <p>Masukkan nama lengkap dan tanggal lahirmu. Kami akan membaca angka life path dan elemen dasarmu.</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label htmlFor="fullname">Nama lengkap</label>
                    <input
                      type="text" id="fullname" placeholder="cth. Juni Pratama"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={scrollFieldIntoView}
                    />
                    {errors.fullName && <div className="error">{errors.fullName}</div>}
                  </div>
                  <div className="field">
                    <label htmlFor="dob">Tanggal lahir</label>
                    <input
                      type="date" id="dob"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      onFocus={scrollFieldIntoView}
                    />
                    {errors.birthDate && <div className="error">{errors.birthDate}</div>}
                  </div>
                  {submitError && <div className="error" style={{ marginBottom: 16 }}>{submitError}</div>}
                  <button type="submit" className="btn btn-primary">Analisis sekarang</button>
                </form>
              </div>
            </section>
          )}

          {step === "calc" && (
            <section className="step">
              <div className="panel calc-wrap">
                <div className="orb"></div>
                <div id="calc-message">{calcMessage}</div>
              </div>
            </section>
          )}

          {step === "result" && result && (
            <section className="step">
              <div className="panel result-hero">
                <div className="num-badge"><span className="num-display">{result.lifePathNumber}</span></div>
                <h2 className="life-title">{result.lifePathTitle}</h2>
                <p className="life-desc">{result.lifePathDesc}</p>
                <div className="trait-row">
                  {result.lifePathTraits.map((t) => (
                    <span className="trait-chip" key={t}>{t}</span>
                  ))}
                </div>
                <div className="career-line"><b>Catatan:</b> {result.lifePathHighlight}</div>
                <div className="btn-row">
                  <button className="btn btn-primary" onClick={() => setStep("element")}>
                    Lihat elemen dasar
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === "element" && result && (
            <section className="step">
              <div className="panel">
                <div className="step-heading">
                  <h2>Elemen dasarmu</h2>
                  <p>Berdasarkan angka life path, berikut posisi elemenmu dalam siklus Wu Xing (lima elemen).</p>
                </div>
                <div className="wheel-wrap">
                  <ElementWheel activeElement={result.element} />
                </div>
                <div className="element-caption">
                  <div className="el-name" style={{ color: `var(--${result.element})` }}>{result.elementName}</div>
                  <p className="el-desc">{result.elementDesc}</p>
                </div>
                <div className="btn-row">
                  <button className="btn btn-primary" onClick={() => setStep("recommend")}>
                    Lihat rekomendasi
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === "recommend" && result && (
            <section className="step">
              <div className="panel">
                <div className="step-heading">
                  <h2>Rekomendasi untukmu</h2>
                  <p>Elemen pendukung memperkuat energimu. Elemen pengontrol perlu diseimbangkan agar tidak berlebihan.</p>
                </div>

                <div className="rec-grid">
                  <div className="rec-card support">
                    <div className="rec-kicker">Elemen pendukung</div>
                    <div className="rec-element" style={{ color: `var(--${result.supportElement})` }}>
                      {result.supportElementName}
                    </div>
                    <ul>
                      <li><b>Warna:</b> {result.supportColors}</li>
                      <li><b>Bidang yang cocok:</b> {result.supportIndustries}</li>
                    </ul>
                  </div>
                  <div className="rec-card control">
                    <div className="rec-kicker">Elemen pengontrol — perlu diwaspadai</div>
                    <div className="rec-element" style={{ color: `var(--${result.controlElement})` }}>
                      {result.controlElementName}
                    </div>
                    <ul>
                      <li><b>Kurangi:</b> {result.controlColors}</li>
                      <li><b>Perhatikan:</b> hindari konflik berlebihan di area {result.controlIndustries}</li>
                    </ul>
                  </div>
                </div>

                <div className="compat-row">
                  <div className="compat-col">
                    <h3>Angka life path yang selaras</h3>
                    <div className="compat-nums good">
                      {result.compatGood.map((n) => <span key={n}>{n}</span>)}
                    </div>
                  </div>
                  <div className="compat-col">
                    <h3>Angka yang butuh penyesuaian ekstra</h3>
                    <div className="compat-nums watch">
                      {result.compatWatch.map((n) => <span key={n}>{n}</span>)}
                    </div>
                  </div>
                </div>

                <div className="btn-row">
                  <button className="btn btn-primary" onClick={handleDownloadPdf} disabled={downloading}>
                    {downloading ? "Menyiapkan PDF…" : "Unduh laporan PDF"}
                  </button>
                  <button className="btn btn-ghost" onClick={handleRestart}>Mulai ulang</button>
                </div>

                {totalCount !== null && (
                  <div className="total-count">
                    Sudah <span>{totalCount.toLocaleString("id-ID")}</span> orang menemukan jalur hidup mereka di sini
                  </div>
                )}
              </div>
            </section>
          )}
        </main>

        <footer className="note">
          Kalkulasi Life Path memakai rumus numerologi resmi (reduksi digit tanggal lahir).<br />
          Setiap hasil analisis tersimpan otomatis di database.
        </footer>
      </div>
    </>
  );
}
