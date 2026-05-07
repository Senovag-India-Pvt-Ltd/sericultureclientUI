import React, { useEffect, useMemo, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import ReactSelect from "react-select";
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

const MONTH_EN_SHORT = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

if (!document.getElementById("gdiap-styles")) {
  const s = document.createElement("style");
  s.id = "gdiap-styles";
  s.innerHTML = `
    .gdiap-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gdiap-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gdiap-swal .swal2-icon { margin:20px auto 4px !important; }
    .gdiap-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gdiap-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gdiap-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .gdiap-wrap { animation: gdiap-in .35s ease; }
    .gdiap-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gdiap-table th { letter-spacing:.02em; }
    .gdiap-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gdiap-scroll::-webkit-scrollbar { height:9px; }
    .gdiap-scroll::-webkit-scrollbar-track { background:#ecfeff; border-radius:6px; }
    .gdiap-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0e7490,#3730a3); border-radius:6px; }
    @keyframes gdiap-fill { from { height: 0; } to { height: var(--h, 0%); } }
    .gdiap-bar { animation: gdiap-fill 1s cubic-bezier(.22,.61,.36,1) both; }
    @keyframes gdiap-snow { 0% { transform:translateY(-2px); opacity:.7; } 50% { transform:translateY(2px); opacity:1; } 100% { transform:translateY(-2px); opacity:.7; } }
    .gdiap-snow { animation: gdiap-snow 2.4s ease-in-out infinite; display:inline-block; }
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

const grainageSelectStyles = {
  control: (base, state) => ({
    ...base, borderRadius: "8px",
    border: state.isFocused ? "1.5px solid #0e7490" : "1.5px solid #d0d9e8",
    background: "#ecfeff",
    minHeight: "38px", fontSize: "13px", color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(14,116,144,.18)" : "none",
    "&:hover": { border: "1.5px solid #0e7490" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (base) => ({ ...base, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#0e7490" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(14,116,144,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base, fontSize: "13px", padding: "8px 12px",
    background: state.isSelected ? "linear-gradient(135deg,#0e7490,#06b6d4)" : state.isFocused ? "#cffafe" : "#fff",
    color: state.isSelected ? "#fff" : "#0f172a",
    cursor: "pointer",
  }),
};

const numOrZero = (v) => {
  const n = parseFloat(String(v ?? "").replace(/[^\d.\-]/g, ""));
  return isNaN(n) ? 0 : n;
};
const fmt = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "—";
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

function GrainageDiapauseAvailabilityReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ grainageId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [grainageList,      setGrainageList]      = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "grainageMaster/get-all").then((r) => setGrainageList(r.data.content.grainageMaster || [])).catch(() => setGrainageList([]));
    api.get(baseURL + "financialYearMaster/get-all").then((r) => setFinancialYearList(r.data.content.financialYearMaster || [])).catch(() => setFinancialYearList([]));
    api.get(baseURL + "financialYearMaster/get-is-default").then((r) => {
      const fy = r.data.content;
      if (fy) {
        setFilter((p) => ({ ...p, financialYearMasterId: fy.financialYearMasterId }));
        setFyStartYear(extractYear(fy.financialYear));
      }
    }).catch(() => {});
  }, []);

  const extractYear = (str) => {
    if (!str) return null;
    const yr = parseInt(String(str).trim().split("-")[0], 10);
    return isNaN(yr) ? null : yr;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((p) => ({ ...p, [name]: value }));
    setHasReport(false); setDataRows([]);
    if (name === "financialYearMasterId") {
      const sel2 = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel2 ? extractYear(sel2.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.grainageId)            return "Please select a Grainage.";
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
      background: "#fff", customClass: { popup: "gdiap-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gdiap-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { grainageId: filter.grainageId, year, month: m };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-diapause-availability", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch {
      showErr("Fetch Failed", "Failed to load the Diapause DFL Availability report.");
    } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-diapause-availability/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-diapause-availability/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `grainage_diapause_availability_${filter.grainageId}_${year}_${m}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedGrainage = grainageList.find((g) => String(g.grainageMasterId) === String(filter.grainageId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const grainageName = selectedGrainage?.grainageMasterName || "—";

  // KPIs over the 5-month window + identify peak month + mark anchor (current) row
  const kpis = useMemo(() => {
    const sumP1Lots  = dataRows.reduce((a, r) => a + numOrZero(r.p1_lots), 0);
    const sumP2Lots  = dataRows.reduce((a, r) => a + numOrZero(r.p2_lots), 0);
    const sumP1Dfls  = dataRows.reduce((a, r) => a + numOrZero(r.p1_dfls), 0);
    const sumP2Dfls  = dataRows.reduce((a, r) => a + numOrZero(r.p2_dfls), 0);
    const grand      = sumP1Dfls + sumP2Dfls;

    let peakRow = null;
    let peakVal = 0;
    dataRows.forEach((r) => {
      const v = numOrZero(r.p1_dfls) + numOrZero(r.p2_dfls);
      if (v > peakVal) { peakVal = v; peakRow = r; }
    });

    return {
      monthCount:  dataRows.length,
      sumP1Lots, sumP2Lots, sumP1Dfls, sumP2Dfls, grand,
      p1Share: grand === 0 ? 0 : (sumP1Dfls / grand) * 100,
      p2Share: grand === 0 ? 0 : (sumP2Dfls / grand) * 100,
      peakLabel: peakRow ? `${MONTH_EN_SHORT[numOrZero(peakRow.month_num)] || ""} ${numOrZero(peakRow.year)}` : "—",
      peakKn:    peakRow ? `${MONTH_KN[numOrZero(peakRow.month_num)] || ""}-${numOrZero(peakRow.year)}` : "—",
      peakVal,
    };
  }, [dataRows]);

  // Bar chart max for normalising heights
  const chartMax = useMemo(() => {
    let m = 0;
    dataRows.forEach((r) => {
      const v = numOrZero(r.p1_dfls) + numOrZero(r.p2_dfls);
      if (v > m) m = v;
    });
    return m;
  }, [dataRows]);

  return (
    <Layout title={t("Grainage Diapause / Refrigerated DFL Availability (5-month forecast)")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          <span className="gdiap-snow" style={{ marginRight: "8px" }}>❄️</span>
          {t("ಶೈತ್ಯೀಕರಿಸಿದ ಶುದ್ಧ ತಳಿ ಮೊಟ್ಟೆಗಳ ಲಭ್ಯತೆ — ಮುಂದಿನ 5 ತಿಂಗಳುಗಳು")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#cffafe,#a5f3fc)",
            color: "#155e75", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #67e8f9", verticalAlign: "middle",
          }}>P1 & P2 · Bivoltine · Diapause · 5-month Forecast</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(14,116,144,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#155e75 0%,#0e7490 50%,#3730a3 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>
              <span className="gdiap-snow">❄️</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಶೈತ್ಯೀಕರಿಸಿದ ಶುದ್ಧ ತಳಿ ಮೊಟ್ಟೆಗಳ ಲಭ್ಯತೆ — ಮುಂದಿನ 5 ತಿಂಗಳುಗಳು
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Diapause · 5-mo</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P1 &amp; P2 Grainage (Bivoltine) — Refrigerated pure-race DFL availability rolling forward 5 months from anchor</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{grainageName}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>Anchor: {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#ecfeff)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>Grainage <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={grainageList.map((g) => ({
                      value: String(g.grainageMasterId),
                      label: g.grainageMasterName + (g.grainageType ? ` · ${g.grainageType}` : ""),
                    }))}
                    placeholder="— Search Grainage —"
                    isSearchable isClearable
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={grainageSelectStyles}
                    value={
                      grainageList
                        .map((g) => ({
                          value: String(g.grainageMasterId),
                          label: g.grainageMasterName + (g.grainageType ? ` · ${g.grainageType}` : ""),
                        }))
                        .find((o) => o.value === String(filter.grainageId)) || null
                    }
                    onChange={(opt) => {
                      setFilter((p) => ({ ...p, grainageId: opt?.value || "" }));
                      setHasReport(false); setDataRows([]);
                    }}
                    noOptionsMessage={() => "No grainage found"}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>Financial Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">— Select Year —</option>
                    {financialYearList.map((f) => (<option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>
                    Anchor Month <span style={{ color: "#e53e3e" }}>*</span>
                    <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "none", letterSpacing: 0, marginLeft: "4px" }}>(forecast = anchor + next 4)</span>
                  </label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">— Month —</option>
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#155e75,#0e7490)", "0 4px 12px rgba(14,116,144,.32)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View month Forecast</>}
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

        {hasReport && (
          <div className="gdiap-wrap mt-4">
            {/* KPIs */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-stretch">
              <div style={kpi("#cffafe", "#67e8f9", "#0e7490")}>
                <span style={kpiLbl("#0e7490")}>Grainage</span>
                <span style={{ ...kpiVal("#0c4a6e", 14), fontWeight: 800 }}>{grainageName}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>Anchor Month</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
                <span style={{ fontSize: "10.5px", color: "#92400e", fontWeight: 700, marginTop: "1px" }}>+ next 4 months</span>
              </div>
              <div style={kpi("#bfdbfe", "#93c5fd", "#1e40af")}>
                <span style={kpiLbl("#1e40af")}>① P1 ಒಟ್ಟು (5 mo)</span>
                <span className="gdiap-num" style={kpiVal("#1e3a8a", 16)}>{kpis.sumP1Dfls.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#1e40af", fontWeight: 700, marginTop: "1px" }}>{kpis.sumP1Lots} lots · {kpis.p1Share.toFixed(1)}%</span>
              </div>
              <div style={kpi("#ddd6fe", "#a78bfa", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>② P2 ಒಟ್ಟು (5 mo)</span>
                <span className="gdiap-num" style={kpiVal("#4c1d95", 16)}>{kpis.sumP2Dfls.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#5b21b6", fontWeight: 700, marginTop: "1px" }}>{kpis.sumP2Lots} lots · {kpis.p2Share.toFixed(1)}%</span>
              </div>
              <div style={kpi("#fde68a", "#fcd34d", "#78350f")}>
                <span style={kpiLbl("#78350f")}>Σ ಒಟ್ಟು Grand Total</span>
                <span className="gdiap-num" style={kpiVal("#78350f", 18)}>{kpis.grand.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#92400e", fontWeight: 700, marginTop: "1px" }}>{kpis.monthCount}-month forecast</span>
              </div>
              <div style={kpi("#a7f3d0", "#6ee7b7", "#065f46")}>
                <span style={kpiLbl("#065f46")}>📈 Peak Month</span>
                <span style={{ ...kpiVal("#064e3b", 14), fontWeight: 800, lineHeight: 1.2 }}>{kpis.peakKn}</span>
                <span className="gdiap-num" style={{ fontSize: "11.5px", color: "#065f46", fontWeight: 700, marginTop: "2px" }}>{kpis.peakVal.toLocaleString()} DFLs</span>
              </div>
            </div>

            {/* 5-month forecast bar chart — stacked P1/P2 per month */}
            {chartMax > 0 && (
              <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 18px rgba(14,116,144,.10)", overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ padding: "16px 22px", background: "linear-gradient(180deg,#ffffff,#f0fdfa)" }}>
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ fontSize: "11.5px", color: "#475569", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em" }}>
                      📊 5-month forecast · DFL availability by month (P1 + P2 stacked)
                    </span>
                    <span className="gdiap-num" style={{ fontSize: "12px", color: "#0f172a", fontWeight: 800 }}>
                      Peak: {kpis.peakVal.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "180px", padding: "0 8px" }}>
                    {dataRows.map((row, ri) => {
                      const p1 = numOrZero(row.p1_dfls);
                      const p2 = numOrZero(row.p2_dfls);
                      const total = p1 + p2;
                      const maxBarHeight = 150;
                      const totalH = chartMax === 0 ? 0 : (total / chartMax) * maxBarHeight;
                      const p1H = total === 0 ? 0 : (p1 / total) * totalH;
                      const p2H = total === 0 ? 0 : (p2 / total) * totalH;
                      const isAnchor = ri === 0;
                      return (
                        <div key={ri} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: 0 }}>
                          <span className="gdiap-num" style={{ fontSize: "11px", fontWeight: 800, color: total === 0 ? "#cbd5e0" : "#0f172a" }}>
                            {total === 0 ? "—" : total.toLocaleString()}
                          </span>
                          <div style={{
                            width: "100%", maxWidth: "70px", height: `${maxBarHeight}px`,
                            display: "flex", flexDirection: "column", justifyContent: "flex-end",
                            background: "rgba(0,0,0,.04)", borderRadius: "8px 8px 4px 4px",
                            position: "relative",
                            border: isAnchor ? "2px solid #5eead4" : "1px solid transparent",
                          }}>
                            {p2 > 0 && (
                              <div className="gdiap-bar" style={{
                                background: "linear-gradient(180deg,#a78bfa,#7c3aed)",
                                height: `${p2H}px`,
                                "--h": `${p2H}px`,
                                borderRadius: p1 > 0 ? "8px 8px 0 0" : "8px 8px 4px 4px",
                                width: "100%",
                              }} title={`P2: ${p2.toLocaleString()} DFLs`} />
                            )}
                            {p1 > 0 && (
                              <div className="gdiap-bar" style={{
                                background: "linear-gradient(180deg,#60a5fa,#2563eb)",
                                height: `${p1H}px`,
                                "--h": `${p1H}px`,
                                borderRadius: "0 0 4px 4px",
                                width: "100%",
                              }} title={`P1: ${p1.toLocaleString()} DFLs`} />
                            )}
                            {isAnchor && (
                              <span style={{
                                position: "absolute", top: "-26px", left: "50%", transform: "translateX(-50%)",
                                fontSize: "9px", fontWeight: 800,
                                background: "linear-gradient(135deg,#5eead4,#2dd4bf)",
                                color: "#134e4a", padding: "2px 7px", borderRadius: "999px",
                                border: "1px solid #2dd4bf", whiteSpace: "nowrap",
                              }}>📍 NOW</span>
                            )}
                          </div>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: isAnchor ? "#0f766e" : "#475569", lineHeight: 1.2, textAlign: "center" }}>
                            <div>{MONTH_EN_SHORT[numOrZero(row.month_num)] || "—"}</div>
                            <div style={{ fontSize: "9.5px", opacity: .8, fontWeight: 600 }}>{numOrZero(row.year)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="d-flex flex-wrap gap-3 mt-3" style={{ fontSize: "11px", color: "#475569" }}>
                    <span><span style={{ display: "inline-block", width: "12px", height: "12px", background: "linear-gradient(180deg,#60a5fa,#2563eb)", borderRadius: "3px", marginRight: "5px", verticalAlign: "middle" }}></span>① ಪಿ1 ತಳಿ (race CSR-2 P1) · {kpis.sumP1Dfls.toLocaleString()} DFLs across {kpis.monthCount} mo</span>
                    <span><span style={{ display: "inline-block", width: "12px", height: "12px", background: "linear-gradient(180deg,#a78bfa,#7c3aed)", borderRadius: "3px", marginRight: "5px", verticalAlign: "middle" }}></span>② ಪಿ2 ತಳಿ (race CSR-2 P2 / Hybrid) · {kpis.sumP2Dfls.toLocaleString()} DFLs across {kpis.monthCount} mo</span>
                    <span><span style={{ display: "inline-block", width: "12px", height: "12px", border: "2px solid #2dd4bf", borderRadius: "3px", marginRight: "5px", verticalAlign: "middle" }}></span>📍 Anchor (current) month — forecast starts here</span>
                  </div>
                </div>
              </Card>
            )}

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(14,116,144,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#0c4a6e,#0e7490 50%,#312e81)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                <span className="gdiap-snow" style={{ marginRight: "6px" }}>❄️</span>
                ಶೈತ್ಯೀಕರಿಸಿದ ಶುದ್ಧ ತಳಿ ಮೊಟ್ಟೆಗಳ ಲಭ್ಯತೆ · ಬಿತ್ತನೆ ಕೋಠಿ {grainageName}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Refrigerated (Diapause) Pure-race DFL Availability · Anchor: {monthLabel} {monthYear} + 4 forward months
                </div>
              </div>

              <div className="gdiap-scroll" style={{ overflowX: "auto" }}>
                <table className="gdiap-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1100px" }}>
                  <thead>
                    {/* Row 1: top groups */}
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "180px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>📅 ಮಾಹೆ</div><div style={hdrEn}>Month</div>
                      </th>
                      <th colSpan={3} style={hdr("linear-gradient(135deg,#1e40af,#3b82f6)")}>
                        <div style={{ fontSize: "12.5px" }}>① ಪಿ1 ತಳಿ (CSR-2 P1)</div>
                        <div style={hdrEn}>Race CSR-2 · P1</div>
                      </th>
                      <th colSpan={3} style={hdr("linear-gradient(135deg,#5b21b6,#7c3aed)")}>
                        <div style={{ fontSize: "12.5px" }}>② ಪಿ2 ತಳಿ (CSR-2 P2 + Hybrid)</div>
                        <div style={hdrEn}>Race CSR-2 P2 / Hybrid</div>
                      </th>
                    </tr>
                    {/* Row 2: leaves */}
                    <tr>
                      <th style={subhdr("linear-gradient(135deg,#bfdbfe,#93c5fd)", "#1e3a8a")}>
                        <div style={{ fontSize: "10.5px" }}>ತಂಡ ಸಂ.</div><div style={subhdrEn}>Lots</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#dbeafe,#bfdbfe)", "#1e3a8a")}>
                        <div style={{ fontSize: "10.5px" }}>ಇಂದ</div><div style={subhdrEn}>From</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#93c5fd,#60a5fa)", "#1e3a8a")}>
                        <div style={{ fontSize: "10.5px" }}>ಮೊಟ್ಟೆಗಳು</div><div style={subhdrEn}>DFLs</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ತಂಡ ಸಂ.</div><div style={subhdrEn}>Lots</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#ede9fe,#ddd6fe)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ಇಂದ</div><div style={subhdrEn}>From</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#c4b5fd,#a78bfa)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ಮೊಟ್ಟೆಗಳು</div><div style={subhdrEn}>DFLs</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#ecfeff,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>❄️</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#0e7490", marginBottom: "4px" }}>ಯಾವುದೇ ಲಭ್ಯತೆ ಮಾಹಿತಿ ಇಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No diapause DFL availability data found for this grainage.</div>
                      </td></tr>
                    )}
                    {dataRows.map((row, ri) => {
                      const isAnchor = ri === 0;
                      const total = numOrZero(row.p1_dfls) + numOrZero(row.p2_dfls);
                      const isPeak = total > 0 && total === kpis.peakVal;
                      const monthName = MONTH_EN_SHORT[numOrZero(row.month_num)] || "";
                      const yr = numOrZero(row.year);
                      const rowBg = isAnchor
                        ? "linear-gradient(135deg,#ecfdf5,#d1fae5)"
                        : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      return (
                        <tr key={ri} className="gdiap-tr" style={{ background: rowBg }}>
                          <td style={{
                            padding: "12px 8px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            background: isAnchor ? "linear-gradient(135deg,#5eead4,#2dd4bf)"
                                                  : "linear-gradient(135deg,#0e7490,#06b6d4)",
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "28px", height: "28px", borderRadius: "50%",
                              background: "rgba(255,255,255,.95)",
                              color: isAnchor ? "#134e4a" : "#0e7490",
                              fontWeight: 800, fontSize: "12px",
                            }}>{row.sl_no}</span>
                          </td>
                          <td style={{
                            padding: "12px 14px", textAlign: "left",
                            borderBottom: "1px solid #e2e8f0", borderRight: "2px solid #e2e8f0",
                            color: "#0f172a", fontWeight: 800, fontSize: "13px",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ fontSize: "16px" }}>{isAnchor ? "📍" : "📅"}</span>
                              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                                <span style={{ fontWeight: 800 }}>{row.month_label || `${monthName} ${yr}`}</span>
                                <span style={{ fontSize: "10.5px", fontWeight: 700, opacity: .7, color: "#475569" }}>
                                  {monthName} {yr}
                                </span>
                              </div>
                              {isAnchor && (
                                <span style={{
                                  display: "inline-block", padding: "2px 8px", borderRadius: "999px",
                                  background: "linear-gradient(135deg,#5eead4,#2dd4bf)",
                                  color: "#134e4a", fontWeight: 800, fontSize: "10px",
                                  border: "1px solid #2dd4bf",
                                }}>NOW</span>
                              )}
                              {isPeak && !isAnchor && (
                                <span style={{
                                  display: "inline-block", padding: "2px 8px", borderRadius: "999px",
                                  background: "linear-gradient(135deg,#fde68a,#fcd34d)",
                                  color: "#78350f", fontWeight: 800, fontSize: "10px",
                                  border: "1px solid #fcd34d",
                                }}>📈 PEAK</span>
                              )}
                            </div>
                          </td>
                          {/* P1 group */}
                          <ValCell v={row.p1_lots} color="#1e3a8a" bg="linear-gradient(135deg,#dbeafe,#bfdbfe)" />
                          <SourceCell v={row.p1_source} />
                          <ValCell v={row.p1_dfls} color="#1e3a8a" bg="linear-gradient(135deg,#bfdbfe,#93c5fd)" weight={800} right="2px solid #e2e8f0" />
                          {/* P2 group */}
                          <ValCell v={row.p2_lots} color="#4c1d95" bg="linear-gradient(135deg,#ede9fe,#ddd6fe)" />
                          <SourceCell v={row.p2_source} />
                          <ValCell v={row.p2_dfls} color="#4c1d95" bg="linear-gradient(135deg,#ddd6fe,#c4b5fd)" weight={800} />
                        </tr>
                      );
                    })}
                    {/* Totals row */}
                    {dataRows.length > 0 && (
                      <tr style={{ background: "linear-gradient(135deg,#fcd34d,#fbbf24)" }}>
                        <td style={{
                          padding: "14px 8px", textAlign: "center",
                          borderTop: "3px solid #f59e0b",
                          background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                        }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            minWidth: "28px", height: "28px", borderRadius: "50%",
                            background: "rgba(255,255,255,.95)",
                            color: "#78350f", fontWeight: 800, fontSize: "12px",
                          }}>Σ</span>
                        </td>
                        <td style={{
                          padding: "14px 14px", textAlign: "left",
                          borderTop: "3px solid #f59e0b",
                          color: "#78350f", fontWeight: 800, fontSize: "13.5px",
                        }}>
                          ಒಟ್ಟು 12 ತಿಂಗಳುಗಳು · 12-Month Total
                        </td>
                        <td className="gdiap-num" style={totalCell("#1e3a8a")}>{fmt(kpis.sumP1Lots)}</td>
                        <td style={totalCell()}>—</td>
                        <td className="gdiap-num" style={{ ...totalCell("#1e3a8a"), background: "linear-gradient(135deg,#bfdbfe,#93c5fd)", borderRight: "2px solid #f59e0b", fontSize: "14px" }}>{fmt(kpis.sumP1Dfls)}</td>
                        <td className="gdiap-num" style={totalCell("#4c1d95")}>{fmt(kpis.sumP2Lots)}</td>
                        <td style={totalCell()}>—</td>
                        <td className="gdiap-num" style={{ ...totalCell("#4c1d95"), background: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", fontSize: "14px" }}>{fmt(kpis.sumP2Dfls)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#ecfeff,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #67e8f9" }}>
                <span style={{ fontSize: "12px", color: "#0e7490", fontWeight: 600 }}>
                  ❄️ Diapause · {grainageName} — Anchor {monthLabel} {monthYear} → {kpis.monthCount}-month forecast &nbsp;·&nbsp; P1 {kpis.sumP1Dfls.toLocaleString()} + P2 {kpis.sumP2Dfls.toLocaleString()} = Σ {kpis.grand.toLocaleString()} DFLs
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

function ValCell({ v, color, bg, weight, right }) {
  const s = String(v ?? "").trim();
  const empty = s === "";
  const n = numOrZero(v);
  const isZero = !empty && n === 0;
  const display = empty ? "—" : fmt(v);
  return (
    <td className="gdiap-num" style={{
      padding: "12px 12px", textAlign: "right",
      borderBottom: "1px solid #f1f5f9",
      borderRight: right || "1px solid #f8fafc",
      background: empty || isZero ? "transparent" : bg,
      color: empty || isZero ? "#cbd5e0" : color,
      fontWeight: weight || 700,
      fontSize: "12.5px",
    }}>{display}</td>
  );
}

// "From" / source cell — backend currently sends an empty string (placeholder
// for the source grainage / cold-storage facility). Render as a striped
// "not yet tracked" tile so users know it's a known-empty column.
function SourceCell({ v }) {
  const s = String(v ?? "").trim();
  const empty = s === "";
  return (
    <td style={{
      padding: "12px 12px", textAlign: "center",
      borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc",
      background: empty
        ? "repeating-linear-gradient(135deg,#f8fafc,#f8fafc 6px,#f1f5f9 6px,#f1f5f9 12px)"
        : "transparent",
      color: empty ? "#94a3b8" : "#334155",
      fontWeight: 600, fontSize: "11.5px",
    }}
    title={empty ? "Source facility not yet tracked" : undefined}>
      {empty ? "—" : s}
    </td>
  );
}

const kpi = (bgFrom, border, _t) => ({
  background: `linear-gradient(135deg,${bgFrom},#ffffff)`,
  border: `1.5px solid ${border}`,
  borderRadius: "12px",
  padding: "10px 18px",
  display: "flex", flexDirection: "column", minWidth: "180px",
});
const kpiLbl = (color) => ({ fontSize: "11px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" });
const kpiVal = (color, sz) => ({ fontSize: `${sz}px`, color, fontWeight: 800, marginTop: "2px" });

const hdrEn = { fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" };
const subhdrEn = { fontSize: "8.5px", opacity: .8, marginTop: "1px", fontWeight: 700 };
const hdr = (bg, minW, single, align) => ({
  background: bg, color: "#fff",
  padding: "10px 8px", textAlign: align || "center",
  border: "1px solid rgba(255,255,255,.18)",
  fontWeight: 800,
  minWidth: minW || "100px",
  verticalAlign: single ? "middle" : "top",
});
const subhdr = (bg, color) => ({
  background: bg, color,
  padding: "8px 6px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
  minWidth: "115px",
});
const totalCell = (color) => ({
  padding: "14px 12px", textAlign: "right",
  borderTop: "3px solid #f59e0b",
  background: "linear-gradient(135deg,#fde68a,#fcd34d)",
  color: color || "#94a3b8", fontWeight: 800, fontSize: "13px",
});

export default GrainageDiapauseAvailabilityReport;
