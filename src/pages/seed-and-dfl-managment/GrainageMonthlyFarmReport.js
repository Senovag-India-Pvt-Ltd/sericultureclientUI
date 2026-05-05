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

// Column model — header, sub-header (English), data key, alignment, color tint
const COLS = [
  { key: "sl_no",               label: "ಕ್ರ.ಸಂ.",                                  sub: "Sl.No.",                align: "center", tint: "neutral", width: 70  },
  { key: "crop_number",         label: "ಬೆಳೆ ಸಂಖ್ಯೆ",                                 sub: "Crop Number",           align: "center", tint: "ident",   width: 110 },
  { key: "lot_number",          label: "ತಂಡದ ಸಂಖ್ಯೆ",                                sub: "Lot Number",            align: "center", tint: "ident",   width: 150 },
  { key: "number_of_dfls",      label: "ಮೊಟ್ಟೆಗಳ ಸಂಖ್ಯೆ",                              sub: "Number of DFLs",        align: "center", tint: "metric",  width: 130 },
  { key: "laid_on_date",        label: "ಮೊಟ್ಟೆಯಿಟ್ಟ ದಿನಾಂಕ",                         sub: "Laid On Date",          align: "center", tint: "date",    width: 130 },
  { key: "hatching_date",       label: "ಚಾಕಿಯಾದ ದಿನಾಂಕ",                          sub: "Hatching Date",         align: "center", tint: "date",    width: 130 },
  { key: "single_egg_break",    label: "ಒಂದು ಮೊಟ್ಟೆಯಲ್ಲಿನ ಬಿಡಿ ಮೊಟ್ಟೆಗಳ ಸಂಖ್ಯೆ", sub: "Single Egg Break Count",align: "center", tint: "egg",     width: 200 },
  { key: "hatched_larvae",      label: "ಚಾಕಿಯಾದ ಮರಿಗಳು",                       sub: "Hatched Larvae",        align: "center", tint: "larva",   width: 140 },
  { key: "chawki_percentage",   label: "ಪ್ರತಿಶತ ಚಾಕಿ",                              sub: "Chawki %",              align: "center", tint: "kpi",     width: 110 },
  { key: "fourth_stage_larvae", label: "4ನೇ ಹಂತದ ಹುಳುಗಳು",                    sub: "4th Stage Larvae",      align: "center", tint: "stage",   width: 150 },
  { key: "spun_date_range",     label: "ಅಂದಾಜು ಹಣ್ಣಾಗುವ ದಿನಾಂಕ",                sub: "Estimated Spun Date",   align: "center", tint: "spun",    width: 220 },
  { key: "cocoon_produced",     label: "ಅಂದಾಜು ಗೂಡುಗಳು",                       sub: "Estimated Cocoons",     align: "center", tint: "output",  width: 150 },
];

// Tint palette per column-tint
const TINT = {
  neutral: { headBg: "linear-gradient(135deg,#0f766e,#14b8a6)", cellBg: "#f8fafc", text: "#475569" },
  ident:   { headBg: "linear-gradient(135deg,#0f766e,#14b8a6)", cellBg: "#ffffff", text: "#0f172a" },
  metric:  { headBg: "linear-gradient(135deg,#0e7490,#06b6d4)", cellBg: "#ecfeff", text: "#155e75" },
  date:    { headBg: "linear-gradient(135deg,#7c3aed,#8b5cf6)", cellBg: "#f5f3ff", text: "#4c1d95" },
  egg:     { headBg: "linear-gradient(135deg,#0369a1,#0ea5e9)", cellBg: "#f0f9ff", text: "#0c4a6e" },
  larva:   { headBg: "linear-gradient(135deg,#0d9488,#2dd4bf)", cellBg: "#f0fdfa", text: "#134e4a" },
  kpi:     { headBg: "linear-gradient(135deg,#b45309,#f59e0b)", cellBg: "#fffbeb", text: "#92400e" },
  stage:   { headBg: "linear-gradient(135deg,#9333ea,#c084fc)", cellBg: "#faf5ff", text: "#581c87" },
  spun:    { headBg: "linear-gradient(135deg,#be185d,#ec4899)", cellBg: "#fdf2f8", text: "#831843" },
  output:  { headBg: "linear-gradient(135deg,#15803d,#22c55e)", cellBg: "#f0fdf4", text: "#14532d" },
};

if (!document.getElementById("gmfr-styles")) {
  const s = document.createElement("style");
  s.id = "gmfr-styles";
  s.innerHTML = `
    .gmfr-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gmfr-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gmfr-swal .swal2-icon { margin:20px auto 4px !important; }
    .gmfr-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gmfr-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gmfr-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    @keyframes gmfr-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(20,184,166,.35);} 50% { box-shadow:0 0 0 8px rgba(20,184,166,0);} }
    .gmfr-wrap { animation: gmfr-in .35s ease; }
    .gmfr-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gmfr-pill { animation: gmfr-pulse 2.4s infinite; }
    .gmfr-table th { letter-spacing:.02em; }
    .gmfr-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gmfr-scroll::-webkit-scrollbar { height:9px; }
    .gmfr-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .gmfr-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#14b8a6,#0f766e); border-radius:6px; }
  `;
  document.head.appendChild(s);
}

const sel = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "7px 11px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
const btn = (bg, shadow, disabled) => ({
  background: disabled ? "#c8d6e5" : bg,
  border: "none", borderRadius: "9px", padding: "8px 18px",
  fontWeight: 700, fontSize: "13px", color: "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: disabled ? "none" : shadow,
  display: "flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap",
  transition: "transform .12s ease, box-shadow .12s ease",
});

function GrainageMonthlyFarmReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ farmId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [farmList,          setFarmList]          = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "farmMaster/get-all")
      .then((r) => setFarmList(r.data.content.farmMaster || []))
      .catch(() => setFarmList([]));

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
    setDataRows([]);
    if (name === "financialYearMasterId") {
      const sel2 = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel2 ? extractYear(sel2.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.financialYearMasterId) return "Please select a Financial Year.";
    if (!filter.month)                 return "Please select a Month.";
    if (!fyStartYear)                  return "Could not determine the financial year start year.";
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: "Required Fields",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">Missing Selection</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Got it", confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "gmfr-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gmfr-swal" },
    });

  // Compose the calendar year + month + (optional) farmId payload.
  // farmId is OPTIONAL on the backend — omit the param entirely when "All Farms".
  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    const p = { year, month: m };
    if (filter.farmId) p.farmId = filter.farmId;
    return p;
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/monthly-farm", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch {
      showErr("Fetch Failed", "Failed to load the Monthly Farm Report.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/monthly-farm/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch {
      showErr("PDF Failed", "Could not generate the PDF report.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleExcel = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/monthly-farm/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `monthly_farm_report_${year}_${m}${filter.farmId ? "_" + filter.farmId : ""}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr("Excel Failed", "Could not generate the Excel report.");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const farmDisplay = selectedFarm?.farmName || "All Farms";

  // Aggregations for summary
  const totalDfls = dataRows.reduce((acc, r) => {
    const n = parseInt(String(r.number_of_dfls || "0").replace(/[^\d-]/g, ""), 10);
    return acc + (isNaN(n) ? 0 : n);
  }, 0);
  const avgChawki = (() => {
    const vals = dataRows
      .map((r) => parseFloat(String(r.chawki_percentage || "").replace(/[^\d.\-]/g, "")))
      .filter((v) => !isNaN(v));
    if (!vals.length) return null;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  })();

  return (
    <Layout title={t("Monthly Farm Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("ಮಾಸಿಕ ಕ್ಷೇತ್ರ ವರದಿ")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 55%,#22d3ee 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center",
            gap: "12px",
            position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🥚</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>ಮಾಸಿಕ ಕ್ಷೇತ್ರ ವರದಿ</div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Monthly Farm Report — DFL hatching activity by farm</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                <span className="gmfr-pill" style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {dataRows.length} rows
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>Financial Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">— Select Year —</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">— Month —</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lbl}>Farm <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                  <Form.Select name="farmId" value={filter.farmId} onChange={handleChange} style={sel}>
                    <option value="">— All Farms —</option>
                    {farmList.map((f) => (
                      <option key={f.farmId} value={f.farmId}>{f.farmName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📄 PDF</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📊 Excel</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* ── Report Table ─────────────────────────────────────────────── */}
        {hasReport && (
          <div className="gmfr-wrap mt-4">
            {/* Summary pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Farm</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{farmDisplay}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Period</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ecfeff,#f0f9ff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Total DFLs</span>
                <span className="gmfr-num" style={{ fontSize: "14px", color: "#155e75", fontWeight: 800, marginTop: "2px" }}>{totalDfls.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fffbeb)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#a16207", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Avg. Chawki %</span>
                <span className="gmfr-num" style={{ fontSize: "14px", color: "#92400e", fontWeight: 800, marginTop: "2px" }}>{avgChawki !== null ? `${avgChawki}%` : "—"}</span>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{ background: "linear-gradient(135deg,#edf2f7,#e2e8f0)", border: "1.5px solid #cbd5e0", borderRadius: "20px", padding: "6px 16px", fontSize: "12px", color: "#4a5568", fontWeight: 600 }}>
                  {dataRows.length} rows
                </span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              {/* Title strip on top of table (PDF/Excel parity) */}
              <div style={{
                background: "linear-gradient(135deg,#134e4a,#0f766e 60%,#2ea98d)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                Monthly Farm Report &nbsp;·&nbsp; ಮಾಸಿಕ ಕ್ಷೇತ್ರ ವರದಿ
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  {farmDisplay} &nbsp;|&nbsp; {monthKn} {monthYear || ""}
                </div>
              </div>

              <div className="gmfr-scroll" style={{ overflowX: "auto" }}>
                <table className="gmfr-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "1700px" }}>
                  <thead>
                    <tr>
                      {COLS.map((c) => {
                        const t = TINT[c.tint];
                        return (
                          <th key={c.key} style={{
                            background: t.headBg,
                            color: "#fff",
                            padding: "11px 10px",
                            textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)",
                            fontWeight: 700,
                            minWidth: c.width,
                            verticalAlign: "middle",
                            whiteSpace: "nowrap",
                          }}>
                            <div style={{ fontSize: "12.5px", fontWeight: 800 }}>{c.label}</div>
                            <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>{c.sub}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, idx) => {
                      const alt = idx % 2 === 1;
                      return (
                        <tr key={idx} className="gmfr-tr">
                          {COLS.map((c) => {
                            const t = TINT[c.tint];
                            const v = row[c.key];
                            const has = v !== null && v !== undefined && String(v).trim() !== "";
                            const isSn = c.key === "sl_no";

                            const baseBg = alt ? t.cellBg : "#ffffff";
                            return (
                              <td
                                key={c.key}
                                className="gmfr-num"
                                style={{
                                  padding: "11px 12px",
                                  textAlign: c.align,
                                  borderBottom: "1px solid #e2e8f0",
                                  borderRight: "1px solid #eef2f6",
                                  background: baseBg,
                                  color: has ? t.text : "#cbd5e0",
                                  fontWeight: 700,
                                  fontSize: "12.5px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {isSn ? (
                                  <span style={{
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    minWidth: "26px", height: "26px", padding: "0 8px",
                                    borderRadius: "50%", background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
                                    color: "#065f46", fontWeight: 800, fontSize: "12px",
                                  }}>
                                    {String(v ?? "").padStart(2, "0")}
                                  </span>
                                ) : c.tint === "kpi" && has ? (
                                  <span style={{
                                    display: "inline-flex", alignItems: "center",
                                    padding: "3px 10px", borderRadius: "20px",
                                    background: "linear-gradient(135deg,#fef3c7,#fde68a)",
                                    color: "#92400e", fontWeight: 800, fontSize: "12px",
                                  }}>
                                    {String(v).includes("%") ? v : `${v}%`}
                                  </span>
                                ) : (has ? v : "—")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    {dataRows.length === 0 && (
                      <tr>
                        <td colSpan={COLS.length} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#f0fdfa)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #ccfbf1" }}>
                <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                  {farmDisplay} — {monthLabel} {monthKn} {monthYear}
                  &nbsp;·&nbsp; {dataRows.length} record{dataRows.length === 1 ? "" : "s"}
                </span>
                <div className="d-flex gap-2 flex-wrap">
                  <button type="button" onClick={handlePdf} disabled={isDownloadingPdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 2px 8px rgba(185,28,28,.25)", isDownloadingPdf)}>
                    {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} /> Generating…</> : <>📄 Download PDF</>}
                  </button>
                  <button type="button" onClick={handleExcel} disabled={isDownloadingExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 2px 8px rgba(21,128,61,.25)", isDownloadingExcel)}>
                    {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} /> Exporting…</> : <>📊 Download Excel</>}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Block>
    </Layout>
  );
}

export default GrainageMonthlyFarmReport;
