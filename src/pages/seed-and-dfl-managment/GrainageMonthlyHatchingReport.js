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

// Top table — 9 metric groups × 2 sub-cols (Month Start / Month End).
// Each group has its own tint so the wide table stays scannable.
const METRIC_GROUPS = [
  { label: "ಚಾಕಿಯಾದ ಮೊಟ್ಟೆಗಳ ಗುರಿ",      sub: "Target",            ms: "target_ms", me: "target_me", grad: "linear-gradient(135deg,#0f766e,#14b8a6)", tint: "#ccfbf1", text: "#134e4a" },
  { label: "ಚಾಕಿಯಾದ ಮೊಟ್ಟೆಗಳ ಸಾಧನೆ",   sub: "Achievement",       ms: "ach_ms",    me: "ach_me",    grad: "linear-gradient(135deg,#4338ca,#6366f1)", tint: "#e0e7ff", text: "#312e81" },
  { label: "ಯಶಸ್ವಿಯಾಗಿ ಕಟಾವಾದ",       sub: "Successful DFLs",   ms: "succ_ms",   me: "succ_me",   grad: "linear-gradient(135deg,#15803d,#22c55e)", tint: "#dcfce7", text: "#14532d" },
  { label: "ವಿಫಲವಾದ ಮೊಟ್ಟೆಗಳು",       sub: "Failed DFLs",       ms: "fail_ms",   me: "fail_me",   grad: "linear-gradient(135deg,#b91c1c,#ef4444)", tint: "#fee2e2", text: "#7f1d1d" },
  { label: "ಒಟ್ಟು ಕಟಾವಾದ",            sub: "Total Harvested",   ms: "total_ms",  me: "total_me",  grad: "linear-gradient(135deg,#0e7490,#06b6d4)", tint: "#cffafe", text: "#155e75" },
  { label: "ಕಟಾವಾದ ಗೂಡಿನ ಪ್ರಮಾಣ",    sub: "Cocoon Qty",        ms: "qty_ms",    me: "qty_me",    grad: "linear-gradient(135deg,#7c3aed,#a855f7)", tint: "#ede9fe", text: "#4c1d95" },
  { label: "ಗೂಡುಗಳು ತೂಕ",            sub: "Cocoon Wt (kg)",    ms: "wt_ms",     me: "wt_me",     grad: "linear-gradient(135deg,#be185d,#ec4899)", tint: "#fce7f3", text: "#831843" },
  { label: "ಸರಾಸರಿ ಸಂಖ್ಯೆ",            sub: "Avg Yield (count)", ms: "avg_ct_ms", me: "avg_ct_me", grad: "linear-gradient(135deg,#b45309,#f59e0b)", tint: "#fef3c7", text: "#78350f" },
  { label: "ಸರಾಸರಿ ತೂಕ",              sub: "Avg Yield (weight)",ms: "avg_wt_ms", me: "avg_wt_me", grad: "linear-gradient(135deg,#9a3412,#f97316)", tint: "#ffedd5", text: "#7c2d12" },
];

// Weekly columns
const WEEK_KEYS = [
  { key: "w1",    label: "1ನೇ ವಾರ", sub: "Week 1" },
  { key: "w2",    label: "2ನೇ ವಾರ", sub: "Week 2" },
  { key: "w3",    label: "3ನೇ ವಾರ", sub: "Week 3" },
  { key: "w4",    label: "4ನೇ ವಾರ", sub: "Week 4" },
  { key: "total", label: "ಒಟ್ಟು",    sub: "Total"  },
];

if (!document.getElementById("gmhr-styles")) {
  const s = document.createElement("style");
  s.id = "gmhr-styles";
  s.innerHTML = `
    .gmhr-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gmhr-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gmhr-swal .swal2-icon { margin:20px auto 4px !important; }
    .gmhr-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gmhr-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gmhr-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    @keyframes gmhr-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(20,184,166,.35);} 50% { box-shadow:0 0 0 8px rgba(20,184,166,0);} }
    .gmhr-wrap { animation: gmhr-in .35s ease; }
    .gmhr-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gmhr-pill { animation: gmhr-pulse 2.4s infinite; }
    .gmhr-table th { letter-spacing:.02em; }
    .gmhr-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gmhr-scroll::-webkit-scrollbar { height:9px; }
    .gmhr-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .gmhr-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#14b8a6,#0f766e); border-radius:6px; }
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

function GrainageMonthlyHatchingReport() {
  const { t, i18n } = useTranslation();

  const [filter, setFilter] = useState({ farmId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [farmList,          setFarmList]          = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [yearSummary,        setYearSummary]        = useState([]);
  const [weeklyBreakdown,    setWeeklyBreakdown]    = useState([]);
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
    setYearSummary([]);
    setWeeklyBreakdown([]);
    if (name === "financialYearMasterId") {
      const sel2 = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel2 ? extractYear(sel2.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.farmId)                return t("Please select a Farm.", { ns: "reports" });
    if (!filter.financialYearMasterId) return t("Please select a Financial Year.", { ns: "reports" });
    if (!filter.month)                 return t("Please select a Month.", { ns: "reports" });
    if (!fyStartYear)                  return t("Could not determine the financial year start year.", { ns: "reports" });
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: t("Required Fields", { ns: "reports" }),
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">${t("Missing Selection", { ns: "reports" })}</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "gmhr-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gmhr-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { farmId: filter.farmId, year, month: m };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setYearSummary([]);
    setWeeklyBreakdown([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/monthly-hatching", { params: params() });
      const payload = res.data || {};
      setYearSummary(Array.isArray(payload.yearSummary) ? payload.yearSummary : []);
      setWeeklyBreakdown(Array.isArray(payload.weeklyBreakdown) ? payload.weeklyBreakdown : []);
      setHasReport(true);
    } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          showErr(t("No Data Found", { ns: "reports" }), t("No data found for the selected filters.", { ns: "reports" }));
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the Monthly Hatching Report.", { ns: "reports" }));
        }
      } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/monthly-hatching/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch {
      showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" }));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleExcel = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/monthly-hatching/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `monthly_hatching_${filter.farmId}_${year}_${m}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" }));
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const farmDisplay = (i18n.language === "kn" ? (selectedFarm?.farmNameInKannada || selectedFarm?.farmName) : selectedFarm?.farmName) || "—";

  // Top-level KPIs derived from year summary (current year row, idx 0)
  const cy = yearSummary[0] || {};
  const sumPair = (a, b) => {
    const f = (v) => parseFloat(String(v ?? "").replace(/[^\d.\-]/g, ""));
    const x = f(a), y = f(b);
    return (isNaN(x) ? 0 : x) + (isNaN(y) ? 0 : y);
  };
  const kpiTarget   = sumPair(cy.target_ms, cy.target_me);
  const kpiAch      = sumPair(cy.ach_ms,    cy.ach_me);
  const kpiSucc     = sumPair(cy.succ_ms,   cy.succ_me);
  const kpiCocoonQ  = sumPair(cy.qty_ms,    cy.qty_me);
  const achPct      = kpiTarget > 0 ? Math.round((kpiAch / kpiTarget) * 100) : null;

  return (
    <Layout title={t("Monthly Hatching Report (Form-27)")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("ನಮೂನೆ-27 · ಮಾಸಿಕ ಚಾಕಿ ವರದಿ")}</Block.Title>
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
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📊</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>ನಮೂನೆ-27 · ಮಾಸಿಕ ಚಾಕಿ ವರದಿ</div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Form-27 — Monthly Hatching Report (Year Summary + Weekly Breakdown)</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                {achPct !== null && (
                  <span className="gmhr-pill" style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                    {achPct}% Achievement
                  </span>
                )}
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>{t("Farm", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="farmId" value={filter.farmId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Farm —", { ns: "reports" })}</option>
                    {farmList.map((f) => (
                      <option key={f.farmId} value={f.farmId}>{i18n.language === "kn" ? (f.farmNameInKannada || f.farmName) : f.farmName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lbl}>{t("Financial Year")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Year —", { ns: "reports" })}</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">{t("— Month —", { ns: "reports" })}</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> {t("Loading…", { ns: "reports" })}</> : <>📋 {t("View", { ns: "reports" })}</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📄 {t("PDF", { ns: "reports" })}</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📊 {t("Excel", { ns: "reports" })}</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="gmhr-wrap mt-4">
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
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Target</span>
                <span className="gmhr-num" style={{ fontSize: "14px", color: "#134e4a", fontWeight: 800, marginTop: "2px" }}>{kpiTarget.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0e7ff,#eef2ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Achievement</span>
                <span className="gmhr-num" style={{ fontSize: "14px", color: "#312e81", fontWeight: 800, marginTop: "2px" }}>
                  {kpiAch.toLocaleString()}{achPct !== null ? ` · ${achPct}%` : ""}
                </span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dcfce7,#ecfdf5)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#15803d", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Successful DFLs</span>
                <span className="gmhr-num" style={{ fontSize: "14px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{kpiSucc.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Cocoon Qty</span>
                <span className="gmhr-num" style={{ fontSize: "14px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{kpiCocoonQ.toLocaleString()}</span>
              </div>
            </div>

            {/* ── Top: Year Summary card ─────────────────────────────── */}
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden", marginBottom: "20px" }}>
              <div style={{
                background: "linear-gradient(135deg,#134e4a,#0f766e 60%,#2ea98d)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ನಮೂನೆ-27 &nbsp;·&nbsp; Form-27 — Monthly Hatching Report (Year Summary)
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  {farmDisplay} &nbsp;|&nbsp; {monthKn} {monthYear || ""}
                </div>
              </div>

              <div className="gmhr-scroll" style={{ overflowX: "auto" }}>
                <table className="gmhr-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1700px" }}>
                  <thead>
                    {/* Row 1 — Year (rowSpan 2) + 9 group headers (colSpan 2) */}
                    <tr>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#1e293b,#334155)",
                        color: "#fff", padding: "12px 10px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", minWidth: "120px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "13px" }}>ವರ್ಷ</div>
                        <div style={{ fontSize: "10px", fontWeight: 600, opacity: .8, marginTop: "2px" }}>Year</div>
                      </th>
                      {METRIC_GROUPS.map((g) => (
                        <th key={g.ms} colSpan={2} style={{
                          background: g.grad, color: "#fff",
                          padding: "10px 8px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        }}>
                          <div style={{ fontSize: "12px", fontWeight: 800 }}>{g.label}</div>
                          <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>{g.sub}</div>
                        </th>
                      ))}
                    </tr>
                    {/* Row 2 — ms / me sub-headers under each group */}
                    <tr>
                      {METRIC_GROUPS.map((g) => (
                        <React.Fragment key={`sub-${g.ms}`}>
                          <th style={{
                            background: "linear-gradient(180deg,#0d9488,#0f766e)",
                            color: "#fff", padding: "8px 6px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                            minWidth: "90px",
                          }}>
                            <div style={{ fontSize: "11px" }}>ಮಾಸ</div>
                            <div style={{ fontSize: "9.5px", opacity: .85 }}>Month Start</div>
                          </th>
                          <th style={{
                            background: "linear-gradient(180deg,#0d9488,#0f766e)",
                            color: "#fff", padding: "8px 6px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                            minWidth: "90px",
                          }}>
                            <div style={{ fontSize: "11px" }}>ಮಾಸಾಂತ್ಯ</div>
                            <div style={{ fontSize: "9.5px", opacity: .85 }}>Month End</div>
                          </th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {yearSummary.map((row, idx) => {
                      const alt = idx % 2 === 1;
                      return (
                        <tr key={idx} className="gmhr-tr" style={{ background: alt ? "#f8fafc" : "#ffffff" }}>
                          <td style={{
                            padding: "11px 10px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            color: "#0f172a", fontWeight: 800, fontSize: "13px",
                            background: idx === 0 ? "linear-gradient(135deg,#f0fdfa,#ecfdf5)" : "#f1f5f9",
                          }}>
                            <span style={{
                              display: "inline-block", padding: "4px 12px", borderRadius: "20px",
                              background: idx === 0 ? "linear-gradient(135deg,#14b8a6,#0f766e)" : "linear-gradient(135deg,#94a3b8,#64748b)",
                              color: "#fff", fontWeight: 800, fontSize: "12px",
                            }}>
                              {row.year_label || "—"}
                            </span>
                          </td>
                          {METRIC_GROUPS.map((g) => {
                            const ms = row[g.ms];
                            const me = row[g.me];
                            const hasMs = ms !== null && ms !== undefined && String(ms).trim() !== "";
                            const hasMe = me !== null && me !== undefined && String(me).trim() !== "";
                            return (
                              <React.Fragment key={`${idx}-${g.ms}`}>
                                <td className="gmhr-num" style={{
                                  padding: "11px 10px", textAlign: "center",
                                  borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                                  background: alt ? g.tint : "#ffffff",
                                  color: hasMs ? g.text : "#cbd5e0",
                                  fontWeight: 700, fontSize: "12px",
                                }}>{hasMs ? ms : "—"}</td>
                                <td className="gmhr-num" style={{
                                  padding: "11px 10px", textAlign: "center",
                                  borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                                  background: alt ? g.tint : "#ffffff",
                                  color: hasMe ? g.text : "#cbd5e0",
                                  fontWeight: 700, fontSize: "12px",
                                }}>{hasMe ? me : "—"}</td>
                              </React.Fragment>
                            );
                          })}
                        </tr>
                      );
                    })}
                    {yearSummary.length === 0 && (
                      <tr>
                        <td colSpan={1 + METRIC_GROUPS.length * 2} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* ── Bottom: Weekly Breakdown card ──────────────────────── */}
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(67,56,202,.10)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#312e81,#4338ca 60%,#6366f1)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ವಾರವಾರು ಗುರಿ ಮತ್ತು ಸಾಧನೆ &nbsp;·&nbsp; Weekly Target vs Achievement
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  {farmDisplay} &nbsp;|&nbsp; {monthKn} {monthYear || ""}
                </div>
              </div>

              <div className="gmhr-scroll" style={{ overflowX: "auto" }}>
                <table className="gmhr-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "950px" }}>
                  <thead>
                    {/* Row 1 — Label (rowSpan 2) + Target (colSpan 5) + Achievement (colSpan 5) */}
                    <tr>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#1e293b,#334155)",
                        color: "#fff", padding: "12px 14px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "180px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "13px" }}>ವಾರಗಳು</div>
                        <div style={{ fontSize: "10px", fontWeight: 600, opacity: .8, marginTop: "2px" }}>Row</div>
                      </th>
                      <th colSpan={5} style={{
                        background: "linear-gradient(135deg,#0f766e,#14b8a6)",
                        color: "#fff", padding: "10px 14px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಗುರಿ</div>
                        <div style={{ fontSize: "10.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Target</div>
                      </th>
                      <th colSpan={5} style={{
                        background: "linear-gradient(135deg,#4338ca,#6366f1)",
                        color: "#fff", padding: "10px 14px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಸಾಧನೆ</div>
                        <div style={{ fontSize: "10.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Achievement</div>
                      </th>
                    </tr>
                    {/* Row 2 — w1..w4, total under each group */}
                    <tr>
                      {WEEK_KEYS.map((w) => (
                        <th key={`tgt-${w.key}`} style={{
                          background: "linear-gradient(180deg,#14b8a6,#0d9488)",
                          color: "#fff", padding: "9px 8px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                          minWidth: "100px",
                        }}>
                          <div style={{ fontSize: "11.5px" }}>{w.label}</div>
                          <div style={{ fontSize: "9.5px", opacity: .85, marginTop: "1px" }}>{w.sub}</div>
                        </th>
                      ))}
                      {WEEK_KEYS.map((w) => (
                        <th key={`ach-${w.key}`} style={{
                          background: "linear-gradient(180deg,#6366f1,#4f46e5)",
                          color: "#fff", padding: "9px 8px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                          minWidth: "100px",
                        }}>
                          <div style={{ fontSize: "11.5px" }}>{w.label}</div>
                          <div style={{ fontSize: "9.5px", opacity: .85, marginTop: "1px" }}>{w.sub}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyBreakdown.map((row, idx) => {
                      const alt = idx % 2 === 1;
                      const isEgg = String(row.row_label || "").includes("ಮೊಟ್ಟೆ");
                      return (
                        <tr key={idx} className="gmhr-tr" style={{ background: alt ? "#f8fafc" : "#ffffff" }}>
                          <td style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            color: "#0f172a", fontWeight: 800, fontSize: "13.5px",
                            background: isEgg ? "linear-gradient(135deg,#fef3c7,#fffbeb)" : "linear-gradient(135deg,#dcfce7,#ecfdf5)",
                          }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "16px" }}>{isEgg ? "🥚" : "🐛"}</span>
                              <span>{row.row_label || "—"}</span>
                            </span>
                          </td>
                          {WEEK_KEYS.map((w) => {
                            const v = row[`tgt_${w.key}`];
                            const has = v !== null && v !== undefined && String(v).trim() !== "";
                            const isTotal = w.key === "total";
                            return (
                              <td key={`tgt-${idx}-${w.key}`} className="gmhr-num" style={{
                                padding: "14px 10px", textAlign: "center",
                                borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                                background: alt ? "#ccfbf1" : "#f0fdfa",
                                color: has ? "#134e4a" : "#cbd5e0",
                                fontWeight: isTotal ? 800 : 700, fontSize: "13px",
                              }}>{has ? v : "—"}</td>
                            );
                          })}
                          {WEEK_KEYS.map((w) => {
                            const v = row[`ach_${w.key}`];
                            const has = v !== null && v !== undefined && String(v).trim() !== "";
                            const isTotal = w.key === "total";
                            return (
                              <td key={`ach-${idx}-${w.key}`} className="gmhr-num" style={{
                                padding: "14px 10px", textAlign: "center",
                                borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                                background: alt ? "#e0e7ff" : "#eef2ff",
                                color: has ? "#312e81" : "#cbd5e0",
                                fontWeight: isTotal ? 800 : 700, fontSize: "13px",
                              }}>{has ? v : "—"}</td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    {weeklyBreakdown.length === 0 && (
                      <tr>
                        <td colSpan={11} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#eef2ff,#f0f9ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {farmDisplay} — {monthLabel} {monthKn} {monthYear}
                  &nbsp;·&nbsp; Form-27
                </span>
                <div className="d-flex gap-2 flex-wrap">
                  <button type="button" onClick={handlePdf} disabled={isDownloadingPdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 2px 8px rgba(185,28,28,.25)", isDownloadingPdf)}>
                    {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} /> {t("Generating…", { ns: "reports" })}</> : <>📄 {t("Download PDF", { ns: "reports" })}</>}
                  </button>
                  <button type="button" onClick={handleExcel} disabled={isDownloadingExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 2px 8px rgba(21,128,61,.25)", isDownloadingExcel)}>
                    {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} /> {t("Exporting…", { ns: "reports" })}</> : <>📊 {t("Download Excel", { ns: "reports" })}</>}
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

export default GrainageMonthlyHatchingReport;
