"use client";

import { useState, useEffect, useRef } from "react";
import Starfield from "./components/Starfield";
import ElementWheel from "./components/ElementWheel";
import { UI, LANG_LABELS } from "../lib/i18n";

function stepperIndex(step) {
  if (step === "form") return 0;
  if (step === "calc" || step === "result") return 1;
  if (step === "element") return 2;
  return 3;
}

export default function Page() {
  const [lang, setLang] = useState("id");
  const [step, setStep] = useState("form");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [calcMessage, setCalcMessage] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [totalCount, setTotalCount] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const msgIntervalRef = useRef(null);

  const t = UI[lang];

  // Muat preferensi bahasa yang tersimpan (kalau ada) saat pertama kali dibuka.
  useEffect(() => {
    const saved = window.localStorage.getItem("numerica-lang");
    if (saved && UI[saved]) setLang(saved);
  }, []);

  function changeLang(newLang) {
    setLang(newLang);
    window.localStorage.setItem("numerica-lang", newLang);
  }

  useEffect(() => {
    return () => {
      if (msgIntervalRef.current) clearInterval(msgIntervalRef.current);
    };
  }, []);

  // Saat input difokus, keyboard bawaan sistem akan muncul (biasanya di
  // bagian bawah layar, di luar kendali halaman web). Supaya input yang
  // sedang diketik tetap terlihat nyaman meski di layar sangat tinggi
  // (mis. kiosk), field-nya digeser ke posisi yang enak dilihat di area
  // yang masih tersisa setelah keyboard muncul — tanpa mengubah posisi
  // halaman secara keseluruhan.
  function scrollFieldIntoView(e) {
    const target = e.target;
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = t.errFullName;
    if (!birthDate) newErrors.birthDate = t.errDob;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitError("");
    setStep("calc");
    let mi = 0;
    setCalcMessage(t.calcMessages[0]);
    msgIntervalRef.current = setInterval(() => {
      mi = (mi + 1) % t.calcMessages.length;
      setCalcMessage(t.calcMessages[mi]);
    }, 500);

    const minDelay = new Promise((resolve) => setTimeout(resolve, 1900));

    try {
      const [res] = await Promise.all([
        fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName: fullName.trim(), birthDate, lang }),
        }),
        minDelay,
      ]);

      clearInterval(msgIntervalRef.current);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || t.errCalcFailed);
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
      setSubmitError(t.errConnection);
      setStep("form");
    }
  }

  async function handleDownloadPdf() {
    if (!result?.id) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/report/${result.id}?lang=${lang}`);
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
      alert(t.errDownloadPdf);
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
            <span className="tag">&nbsp;— {t.tag}</span>
          </div>
          <div className="lang-switch">
            {Object.keys(LANG_LABELS).map((code) => (
              <button
                key={code}
                type="button"
                className={`lang-btn ${lang === code ? "active" : ""}`}
                onClick={() => changeLang(code)}
              >
                {LANG_LABELS[code]}
              </button>
            ))}
          </div>
        </header>

        <nav className="stepper">
          {t.stepLabels.map((label, i) => (
            <div key={label} className={`node ${i === activeIdx ? "active" : ""} ${i < activeIdx ? "done" : ""}`}>
              {i < t.stepLabels.length - 1 && <div className="connector"></div>}
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
                  <h2>{t.formHeading}</h2>
                  <p>{t.formSubtitle}</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label htmlFor="fullname">{t.labelFullName}</label>
                    <input
                      type="text" id="fullname" placeholder={t.placeholderFullName}
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={scrollFieldIntoView}
                    />
                    {errors.fullName && <div className="error">{errors.fullName}</div>}
                  </div>
                  <div className="field">
                    <label htmlFor="dob">{t.labelDob}</label>
                    <input
                      type="date" id="dob"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      onFocus={scrollFieldIntoView}
                    />
                    {errors.birthDate && <div className="error">{errors.birthDate}</div>}
                  </div>
                  {submitError && <div className="error" style={{ marginBottom: 16 }}>{submitError}</div>}
                  <button type="submit" className="btn btn-primary">{t.btnAnalyze}</button>
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
                  {result.lifePathTraits.map((tr) => (
                    <span className="trait-chip" key={tr}>{tr}</span>
                  ))}
                </div>
                <div className="career-line"><b>{t.noteLabel}</b> {result.lifePathHighlight}</div>
                <div className="btn-row">
                  <button className="btn btn-primary" onClick={() => setStep("element")}>
                    {t.btnSeeElement}
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === "element" && result && (
            <section className="step">
              <div className="panel">
                <div className="step-heading">
                  <h2>{t.elementHeading}</h2>
                  <p>{t.elementSubtitle}</p>
                </div>
                <div className="wheel-wrap">
                  <ElementWheel activeElement={result.element} lang={lang} />
                </div>
                <div className="element-caption">
                  <div className="el-name" style={{ color: `var(--${result.element})` }}>{result.elementName}</div>
                  <p className="el-desc">{result.elementDesc}</p>
                </div>
                <div className="btn-row">
                  <button className="btn btn-primary" onClick={() => setStep("recommend")}>
                    {t.btnSeeRecommend}
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === "recommend" && result && (
            <section className="step">
              <div className="panel">
                <div className="step-heading">
                  <h2>{t.recommendHeading}</h2>
                  <p>{t.recommendSubtitle}</p>
                </div>

                <div className="rec-grid">
                  <div className="rec-card support">
                    <div className="rec-kicker">{t.supportKicker}</div>
                    <div className="rec-element" style={{ color: `var(--${result.supportElement})` }}>
                      {result.supportElementName}
                    </div>
                    <ul>
                      <li><b>{t.colorLabel}</b> {result.supportColors}</li>
                      <li><b>{t.supportIndustryLabel}</b> {result.supportIndustries}</li>
                    </ul>
                  </div>
                  <div className="rec-card control">
                    <div className="rec-kicker">{t.controlKicker}</div>
                    <div className="rec-element" style={{ color: `var(--${result.controlElement})` }}>
                      {result.controlElementName}
                    </div>
                    <ul>
                      <li><b>{t.reduceLabel}</b> {result.controlColors}</li>
                      <li><b>{t.watchLabel}</b> {result.controlIndustries}</li>
                    </ul>
                  </div>
                </div>

                <div className="compat-row">
                  <div className="compat-col">
                    <h3>{t.compatGoodTitle}</h3>
                    <div className="compat-nums good">
                      {result.compatGood.map((n) => <span key={n}>{n}</span>)}
                    </div>
                  </div>
                  <div className="compat-col">
                    <h3>{t.compatWatchTitle}</h3>
                    <div className="compat-nums watch">
                      {result.compatWatch.map((n) => <span key={n}>{n}</span>)}
                    </div>
                  </div>
                </div>

                <div className="btn-row">
                  <button className="btn btn-primary" onClick={handleDownloadPdf} disabled={downloading}>
                    {downloading ? t.btnPreparingPdf : t.btnDownloadPdf}
                  </button>
                  <button className="btn btn-ghost" onClick={handleRestart}>{t.btnRestart}</button>
                </div>

                {totalCount !== null && (
                  <div className="total-count">
                    {t.totalCount(totalCount)}
                  </div>
                )}
              </div>
            </section>
          )}
        </main>

        <footer className="note">
          {t.footerLine1}<br />
          {t.footerLine2}
        </footer>
      </div>
    </>
  );
}
