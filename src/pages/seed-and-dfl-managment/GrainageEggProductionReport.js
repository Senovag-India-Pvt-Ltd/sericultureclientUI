import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import api from "../../services/auth/api";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const baseURL        = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDFL = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

const MONTHS = [
  { value: 1,  label: "January"   }, { value: 2,  label: "February"  },
  { value: 3,  label: "March"     }, { value: 4,  label: "April"     },
  { value: 5,  label: "May"       }, { value: 6,  label: "June"      },
  { value: 7,  label: "July"      }, { value: 8,  label: "August"    },
  { value: 9,  label: "September" }, { value: 10, label: "October"   },
  { value: 11, label: "November"  }, { value: 12, label: "December"  },
];

const MONTH_KN = [
  "", "ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್",
  "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್",
];

const WEEK_KEYS  = ["w1", "w2", "w3", "w4"];
const WEEK_LABEL = ["I ವಾರ", "II ವಾರ", "III ವಾರ", "IV ವಾರ"];

const DATA_KEYS = [
  "target_w1","target_w2","target_w3","target_w4","target_total",
  "achieve_w1","achieve_w2","achieve_w3","achieve_w4","achieve_total",
  "next_w1","next_w2","next_w3","next_w4","next_total",
];

const GROUPS = [
  { label: "ಗುರಿ",               prefix: "target",  hdr: "#5b21b6", sub: "#7c3aed", num: "#4c1d95", numBg: "#ede9fe", pill: "#7c3aed" },
  { label: "ಸಾಧನೆ",              prefix: "achieve", hdr: "#065f46", sub: "#059669", num: "#064e3b", numBg: "#d1fae5", pill: "#059669" },
  { label: "ಮುಂದಿನ ಮಾಹೆಯ ಗುರಿ", prefix: "next",    hdr: "#92400e", sub: "#d97706", num: "#78350f", numBg: "#fef3c7", pill: "#d97706" },
];

if (!document.getElementById("gepr-styles")) {
  const s = document.createElement("style");
  s.id = "gepr-styles";
  s.innerHTML = `
    .gepr-swal { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22) !important; }
    .gepr-swal .swal2-title { font-size: 21px !important; font-weight: 800 !important; color: #1a202c !important; }
    .gepr-swal .swal2-icon { margin: 20px auto 4px !important; }
    .gepr-swal .swal2-html-container { margin: 0 !important; padding: 0 !important; }
    .gepr-swal .swal2-confirm { border-radius: 11px !important; padding: 12px 30px !important; font-weight: 700 !important; }
    @keyframes gepr-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    .gepr-wrap { animation: gepr-in 0.35s ease; }
    .gepr-kpi { transition: transform 0.18s ease, box-shadow 0.18s ease; }
    .gepr-kpi:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.18) !important; }
    .gepr-week-card { transition: transform 0.15s ease; }
    .gepr-week-card:hover { transform: scale(1.025); }
  `;
  document.head.appendChild(s);
}

function GrainageEggProductionReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ grainageMasterId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [grainageList,      setGrainageList]      = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [reportRow,          setReportRow]          = useState(null);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "grainageMaster/get-all")
      .then((r) => setGrainageList(r.data.content.grainageMaster || []))
      .catch(() => setGrainageList([]));

    api.get(baseURL + "financialYearMaster/get-all")
      .then((r) => setFinancialYearList(r.data.content.financialYearMaster || []))
      .catch(() => setFinancialYearList([]));

    api.get(baseURL + "financialYearMaster/get-is-default")
      .then((r) => {
        const fy = r.data.content;
        if (fy) {
          setFilter((p) => ({ ...p, financialYearMasterId: fy.financialYearMasterId }));
          setFyStartYear(extractYear(fy.financialYear));
        }
      })
      .catch(() => {});
  }, []);

  const extractYear = (str) => {
    if (!str) return null;
    const yr = parseInt(String(str).trim().split("-")[0], 10);
    return isNaN(yr) ? null : yr;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((p) => ({ ...p, [name]: value }));
    setHasReport(false);
    setReportRow(null);
    if (name === "financialYearMasterId") {
      const sel = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel ? extractYear(sel.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.grainageMasterId)      return "Please select a Grainage.";
    if (!filter.financialYearMasterId) return "Please select a Financial Year.";
    if (!filter.month)                 return "Please select a Month.";
    if (!fyStartYear)                  return "Could not determine the financial year start year.";
    return null;
  };

  const warn = (msg) =>
    Swal.fire({
      icon: "warning", title: "Required Fields",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 4px">Missing Selection</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.6">${msg}</p></div></div></div>`,
      confirmButtonText: "Got it", confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "gepr-swal" },
    });

  const errAlert = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 4px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.6">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gepr-swal" },
    });

  const params = () => ({
    grainageId: filter.grainageMasterId,
    finYearId:  filter.financialYearMasterId,
    fyStartYear,
    month: filter.month,
  });

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { warn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setReportRow(null);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/egg-production", { params: params() });
      const all = Array.isArray(res.data) ? res.data : [];
      setReportRow(all[0] || null);
      setHasReport(true);
    } catch {
      errAlert("Fetch Failed", "Failed to load the egg production report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async () => {
    const err = validate();
    if (err) { warn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/egg-production/pdf", {
        params: params(), responseType: "blob",
      });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch {
      errAlert("PDF Failed", "Could not generate the PDF report. Please try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleExcel = async () => {
    const err = validate();
    if (err) { warn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/egg-production/excel", {
        params: params(), responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `grainage_egg_production_${filter.grainageMasterId}_${fyStartYear}_${filter.month}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      errAlert("Excel Failed", "Could not generate the Excel report. Please try again.");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedGrainage = grainageList.find(
    (g) => String(g.grainageMasterId) === String(filter.grainageMasterId)
  );
  const monthLabel = filter.month
    ? MONTHS.find((m) => String(m.value) === String(filter.month))?.label || ""
    : "";
  const monthKn = filter.month ? MONTH_KN[parseInt(filter.month, 10)] : "";
  const selectedFy = financialYearList.find(
    (f) => String(f.financialYearMasterId) === String(filter.financialYearMasterId)
  );
  const fyLabel = selectedFy?.financialYear || "—";

  // derived numbers for KPI section
  const num = (key) => parseFloat(reportRow?.[key]) || 0;
  const targetTotal  = num("target_total");
  const achieveTotal = num("achieve_total");
  const nextTotal    = num("next_total");
  const achievePct   = targetTotal > 0 ? Math.min(((achieveTotal / targetTotal) * 100).toFixed(1), 999) : 0;

  const mkBtn = (bg, shadow, busy) => ({
    background: busy ? "#c8d6e5" : bg,
    border: "none", borderRadius: "8px", padding: "7px 16px",
    fontWeight: 700, fontSize: "13px", color: "#fff",
    cursor: busy ? "not-allowed" : "pointer",
    boxShadow: busy ? "none" : shadow,
    display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap",
  });
  const selSt = { borderRadius: "7px", border: "1.5px solid #d0d9e8", padding: "6px 10px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
  const lblSt = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "3px", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <Layout title={t("P4 Grainage Egg Production Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("P4 Grainage Egg Production Report")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ── */}
        <Card className="mt-1" style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(91,33,182,0.12)" }}>
          <div style={{
            background: "linear-gradient(135deg,#3b0764 0%,#5b21b6 50%,#7c3aed 100%)",
            padding: "10px 18px", display: "flex", alignItems: "center",
            gap: "10px", borderRadius: "12px 12px 0 0",
          }}>
            <span style={{ fontSize: "18px" }}>🎯</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", lineHeight: 1.2 }}>ಉತ್ಪಾದಿಸಿದ ಮೊಟ್ಟೆಗಳ ವಿವರ</div>
              <div style={{ color: "rgba(255,255,255,0.78)", fontSize: "11px" }}>P4 Egg Production Report — Target · Achievement · Next Month Target</div>
            </div>
            {hasReport && reportRow && (
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ background: "rgba(255,255,255,0.18)", borderRadius: "20px", padding: "3px 10px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""}
                </span>
                <span style={{ background: "rgba(255,255,255,0.18)", borderRadius: "20px", padding: "3px 10px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>
                  {fyLabel}
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "14px 18px 16px" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lblSt}>Grainage <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="grainageMasterId" value={filter.grainageMasterId} onChange={handleChange} style={selSt}>
                    <option value="">— Select Grainage —</option>
                    {grainageList.map((g) => (
                      <option key={g.grainageMasterId} value={g.grainageMasterId}>{g.grainageMasterName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lblSt}>Financial Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={selSt}>
                    <option value="">— Select Year —</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lblSt}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={selSt}>
                    <option value="">— Month —</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading}
                      style={mkBtn("linear-gradient(135deg,#3b0764,#7c3aed)", "0 3px 10px rgba(91,33,182,0.35)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf} onClick={handlePdf}
                      style={mkBtn("linear-gradient(135deg,#276749,#38a169)", "0 3px 10px rgba(39,103,73,0.28)", isDownloadingPdf)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📥 PDF</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel} onClick={handleExcel}
                      style={mkBtn("linear-gradient(135deg,#1d6a3a,#22883f)", "0 3px 10px rgba(29,106,58,0.28)", isDownloadingExcel)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>🟢 Excel</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* ── Report ── */}
        {hasReport && reportRow && (
          <div className="gepr-wrap mt-3">

            {/* ── KPI Cards ── */}
            <Row className="g-3 mb-3">
              {/* Target */}
              <Col md={3}>
                <div className="gepr-kpi" style={{ background: "linear-gradient(135deg,#3b0764,#5b21b6)", borderRadius: "14px", padding: "18px 22px", boxShadow: "0 4px 20px rgba(91,33,182,0.30)", height: "100%" }}>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>ಗುರಿ (Target)</div>
                  <div style={{ color: "#fff", fontSize: "36px", fontWeight: 900, lineHeight: 1, marginBottom: "4px" }}>
                    {targetTotal.toLocaleString()}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px" }}>DFLs for {monthLabel}</div>
                </div>
              </Col>

              {/* Achievement + gauge */}
              <Col md={4}>
                <div className="gepr-kpi" style={{ background: "linear-gradient(135deg,#064e3b,#065f46)", borderRadius: "14px", padding: "18px 22px", boxShadow: "0 4px 20px rgba(6,95,70,0.30)", height: "100%" }}>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>ಸಾಧನೆ (Achievement)</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
                    <div style={{ color: "#fff", fontSize: "36px", fontWeight: 900, lineHeight: 1 }}>
                      {achieveTotal.toLocaleString()}
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <span style={{ background: achievePct >= 100 ? "#34d399" : achievePct >= 70 ? "#fbbf24" : "#f87171", color: "#fff", borderRadius: "20px", padding: "2px 10px", fontSize: "12px", fontWeight: 800 }}>
                        {achievePct}%
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ marginTop: "10px", background: "rgba(255,255,255,0.15)", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
                    <div style={{
                      width: `${Math.min(parseFloat(achievePct), 100)}%`,
                      height: "100%",
                      background: achievePct >= 100 ? "#34d399" : achievePct >= 70 ? "#fbbf24" : "#f87171",
                      borderRadius: "6px",
                      transition: "width 0.8s ease",
                    }} />
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "10px", marginTop: "4px" }}>of {targetTotal.toLocaleString()} target DFLs</div>
                </div>
              </Col>

              {/* Next month target */}
              <Col md={3}>
                <div className="gepr-kpi" style={{ background: "linear-gradient(135deg,#78350f,#92400e)", borderRadius: "14px", padding: "18px 22px", boxShadow: "0 4px 20px rgba(146,64,14,0.30)", height: "100%" }}>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>ಮುಂದಿನ ಮಾಹೆಯ ಗುರಿ</div>
                  <div style={{ color: "#fff", fontSize: "36px", fontWeight: 900, lineHeight: 1, marginBottom: "4px" }}>
                    {nextTotal.toLocaleString()}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px" }}>DFLs next month</div>
                </div>
              </Col>

              {/* Info pills */}
              <Col md={2}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", height: "100%", justifyContent: "center" }}>
                  {[
                    { label: "Grainage", value: selectedGrainage?.grainageMasterName || "—", accent: "#c4b5fd", bg: "linear-gradient(135deg,#faf5ff,#ede9fe)", text: "#5b21b6" },
                    { label: "Month",    value: `${monthLabel} ${monthKn}`,                   accent: "#9ae6b4", bg: "linear-gradient(135deg,#f0fff4,#f7fafc)",    text: "#276749" },
                    { label: "FY",       value: fyLabel,                                       accent: "#bee3f8", bg: "linear-gradient(135deg,#ebf8ff,#e6fffa)",    text: "#2b6cb0" },
                  ].map((p) => (
                    <div key={p.label} style={{ background: p.bg, border: `1.5px solid ${p.accent}`, borderRadius: "8px", padding: "5px 10px" }}>
                      <span style={{ fontSize: "9px", color: p.text, fontWeight: 700, textTransform: "uppercase", display: "block", letterSpacing: "0.06em" }}>{p.label}</span>
                      <span style={{ fontSize: "11px", color: "#1a202c", fontWeight: 700 }}>{p.value}</span>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>

            {/* ── Week-wise comparison grid ── */}
            <div className="d-flex flex-wrap gap-2 mb-3">
              {WEEK_KEYS.map((wk, wi) => {
                const tgt = parseFloat(reportRow[`target_${wk}`]) || 0;
                const ach = parseFloat(reportRow[`achieve_${wk}`]) || 0;
                const nxt = parseFloat(reportRow[`next_${wk}`]) || 0;
                const pct = tgt > 0 ? Math.min(((ach / tgt) * 100).toFixed(0), 100) : 0;
                return (
                  <div key={wi} className="gepr-week-card" style={{ flex: 1, minWidth: "170px", background: "#fff", borderRadius: "12px", padding: "14px 16px", boxShadow: "0 2px 12px rgba(91,33,182,0.09)", border: "1.5px solid #ede9fe" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontWeight: 800, fontSize: "13px", color: "#5b21b6" }}>{WEEK_LABEL[wi]}</span>
                      <span style={{ background: "#ede9fe", color: "#5b21b6", borderRadius: "20px", padding: "2px 8px", fontSize: "10px", fontWeight: 700 }}>
                        {pct}%
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "space-between", fontSize: "11px" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "#718096", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", marginBottom: "2px" }}>ಗುರಿ</div>
                        <div style={{ fontWeight: 800, color: "#5b21b6", fontSize: "14px" }}>{tgt || "—"}</div>
                      </div>
                      <div style={{ width: "1px", background: "#e2e8f0", alignSelf: "stretch" }} />
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "#718096", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", marginBottom: "2px" }}>ಸಾಧನೆ</div>
                        <div style={{ fontWeight: 800, color: "#065f46", fontSize: "14px" }}>{ach || "—"}</div>
                      </div>
                      <div style={{ width: "1px", background: "#e2e8f0", alignSelf: "stretch" }} />
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "#718096", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", marginBottom: "2px" }}>ಮುಂದಿನ</div>
                        <div style={{ fontWeight: 800, color: "#92400e", fontSize: "14px" }}>{nxt || "—"}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: "8px", background: "#ede9fe", borderRadius: "4px", height: "5px", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: pct >= 100 ? "#34d399" : pct >= 70 ? "#fbbf24" : "#7c3aed", borderRadius: "4px", transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Formal table ── */}
            <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 3px 20px rgba(91,33,182,0.10)", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
                  <thead>
                    {/* Row 1 */}
                    <tr>
                      <th rowSpan={2} style={thBase("#3b0764", "44px", "center")}>ಕ್ರ.ಸಂ</th>
                      {GROUPS.map((g, gi) => (
                        <th key={gi} colSpan={5} style={thBase(g.hdr, "auto", "center")}>{g.label}</th>
                      ))}
                    </tr>
                    {/* Row 2 */}
                    <tr>
                      {GROUPS.map((g, gi) =>
                        ["I", "II", "III", "IV", "ಒಟ್ಟು"].map((wl, wi) => (
                          <th key={`${gi}-${wi}`} style={{
                            background: g.sub, color: "#fff",
                            padding: "8px 12px", textAlign: "center",
                            fontWeight: 700, fontSize: "12px",
                            borderRight: "1px solid rgba(255,255,255,0.20)",
                            borderBottom: "2px solid rgba(255,255,255,0.25)",
                            minWidth: "68px",
                          }}>
                            {wl}
                          </th>
                        ))
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td style={{ padding: "14px 8px", textAlign: "center", borderBottom: "1px solid #ede9fe", borderRight: "1px solid #ede9fe", fontWeight: 700, color: "#5b21b6", fontSize: "13px" }}>
                        01
                      </td>
                      {DATA_KEYS.map((key, ci) => {
                        const grp   = GROUPS[Math.floor(ci / 5)];
                        const isLast = ci % 5 === 4;
                        const val   = reportRow[key];
                        return (
                          <td key={ci} style={{
                            padding: "14px 12px",
                            textAlign: "right",
                            borderBottom: "1px solid #ede9fe",
                            borderRight: isLast
                              ? `2.5px solid ${grp.hdr}`
                              : "1px solid #ede9fe",
                            fontVariantNumeric: "tabular-nums",
                            fontWeight: isLast ? 800 : 600,
                            color: grp.num,
                            background: isLast ? grp.numBg + "55" : undefined,
                            fontSize: isLast ? "13px" : "12.5px",
                          }}>
                            {val === null || val === undefined || val === "" ? "—" : val}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer bar */}
              <div style={{
                background: "linear-gradient(135deg,#faf5ff,#ede9fe)",
                padding: "10px 20px", display: "flex", alignItems: "center",
                justifyContent: "space-between", flexWrap: "wrap", gap: "8px",
                borderTop: "1.5px solid #c4b5fd",
              }}>
                <span style={{ fontSize: "12px", color: "#5b21b6", fontWeight: 600 }}>
                  ಬಿತ್ತನೆಕೋಠಿ {selectedGrainage?.grainageMasterName || ""} — {monthLabel} {monthKn} · {fyLabel}
                </span>
                <div className="d-flex gap-2">
                  <button onClick={handlePdf} disabled={isDownloadingPdf} type="button"
                    style={{ background: isDownloadingPdf ? "#c8d6e5" : "linear-gradient(135deg,#276749,#38a169)", border: "none", borderRadius: "7px", padding: "6px 16px", fontWeight: 700, fontSize: "12px", color: "#fff", cursor: isDownloadingPdf ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                    {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" style={{ width: "13px", height: "13px" }} /> …</> : <>📥 PDF</>}
                  </button>
                  <button onClick={handleExcel} disabled={isDownloadingExcel} type="button"
                    style={{ background: isDownloadingExcel ? "#c8d6e5" : "linear-gradient(135deg,#1d6a3a,#22883f)", border: "none", borderRadius: "7px", padding: "6px 16px", fontWeight: 700, fontSize: "12px", color: "#fff", cursor: isDownloadingExcel ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                    {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" style={{ width: "13px", height: "13px" }} /> …</> : <>🟢 Excel</>}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {hasReport && !reportRow && (
          <div className="mt-4 text-center" style={{ color: "#a0aec0", fontSize: "14px", padding: "30px" }}>
            No egg production data found for the selected filters.
          </div>
        )}
      </Block>
    </Layout>
  );
}

function thBase(bg, width, align) {
  return {
    background: bg, color: "#fff", padding: "11px 12px",
    textAlign: align, fontWeight: 700, fontSize: "13px",
    borderRight: "1px solid rgba(255,255,255,0.18)",
    borderBottom: "1px solid rgba(255,255,255,0.18)",
    whiteSpace: "nowrap",
    ...(width !== "auto" ? { width } : {}),
  };
}

export default GrainageEggProductionReport;
