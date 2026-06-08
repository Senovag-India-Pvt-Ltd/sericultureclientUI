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

if (!document.getElementById("gbm-styles")) {
  const s = document.createElement("style");
  s.id = "gbm-styles";
  s.innerHTML = `
    .gbm-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gbm-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gbm-swal .swal2-icon { margin:20px auto 4px !important; }
    .gbm-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gbm-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gbm-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .gbm-wrap { animation: gbm-in .35s ease; }
    .gbm-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gbm-table th { letter-spacing:.02em; }
    .gbm-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gbm-scroll::-webkit-scrollbar { height:9px; }
    .gbm-scroll::-webkit-scrollbar-track { background:#f0fdfa; border-radius:6px; }
    .gbm-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#3730a3); border-radius:6px; }
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
    border: state.isFocused ? "1.5px solid #0f766e" : "1.5px solid #d0d9e8",
    background: "#f0fdfa",
    minHeight: "38px", fontSize: "13px", color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(15,118,110,.18)" : "none",
    "&:hover": { border: "1.5px solid #0f766e" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (base) => ({ ...base, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#0f766e" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(15,118,110,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base, fontSize: "13px", padding: "8px 12px",
    background: state.isSelected ? "linear-gradient(135deg,#0f766e,#14b8a6)" : state.isFocused ? "#ecfdf5" : "#fff",
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

// Race bucket badge palette — distinguishes the 5 race rows visually
const RACE_STYLE = (race) => {
  const r = String(race || "").trim();
  if (r.includes("ಮಿಶ್ರ"))         return { bg: "linear-gradient(135deg,#fed7aa,#fdba74)", color: "#7c2d12", icon: "🌾", isTotal: false };
  if (r.includes("ಪಿ2"))           return { bg: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", color: "#4c1d95", icon: "②", isTotal: false };
  if (r.includes("ಪಿ1"))           return { bg: "linear-gradient(135deg,#bfdbfe,#93c5fd)", color: "#1e3a8a", icon: "①", isTotal: false };
  if (r.includes("ಹೈ"))             return { bg: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", color: "#064e3b", icon: "ⓗ", isTotal: false };
  if (r.includes("ದ್ವಿತಳಿ"))         return { bg: "linear-gradient(135deg,#bfdbfe,#93c5fd)", color: "#1e3a8a", icon: "Ⓑ", isTotal: false };
  if (r.includes("ಒಟ್ಟು") || r.toLowerCase() === "total")
                                    return { bg: "linear-gradient(135deg,#fde68a,#fcd34d)", color: "#78350f", icon: "Σ", isTotal: true };
  return                                { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#334155", icon: "·", isTotal: false };
};

function GrainageBriefMonthlyReport() {
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
      background: "#fff", customClass: { popup: "gbm-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gbm-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-brief-monthly", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch {
      showErr("Fetch Failed", "Failed to load the Grainage Monthly Brief Progress report.");
    } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-brief-monthly/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-brief-monthly/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `grainage_brief_monthly_${filter.grainageId}_${year}_${m}.xlsx`;
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

  // Group rows by year_label (year_label is a calendar year string from the backend, e.g. "2026")
  // Order: latest year first → older year second. Within each year, sort by sl_no.
  const grouped = useMemo(() => {
    const map = new Map();
    dataRows.forEach((r) => {
      const k = String(r.year_label);
      if (!map.has(k)) map.set(k, { yearLabel: k, rows: [] });
      map.get(k).rows.push(r);
    });
    map.forEach((g) => g.rows.sort((a, b) => numOrZero(a.sl_no) - numOrZero(b.sl_no)));
    return Array.from(map.values()).sort((a, b) => Number(b.yearLabel) - Number(a.yearLabel));
  }, [dataRows]);

  // KPIs — pull from the Total row (sl_no=5) of the most recent year (CY)
  const kpis = useMemo(() => {
    const cyTotal = dataRows.find((r) => String(r.sl_no) === "5" && String(r.year_label) === String(monthYear));
    const pyTotal = dataRows.find((r) => String(r.sl_no) === "5" && String(r.year_label) === String(monthYear ? monthYear - 1 : ""));
    const t = cyTotal || {};
    const p = pyTotal || {};
    const annualTgt   = numOrZero(t.annual_target);
    const progM       = numOrZero(t.prog_m);
    const achM        = numOrZero(t.ach_m);
    const achME       = numOrZero(t.ach_me);
    const distM       = numOrZero(t.dist_m);
    const distME      = numOrZero(t.dist_me);
    const storageM    = numOrZero(t.storage_m);
    const pyAchM      = numOrZero(p.ach_m);
    return {
      annualTgt,
      progM,
      achM, achME,
      distM, distME,
      storageM,
      pctM:  progM === 0 ? 0 : (achM / progM) * 100,
      yoyAch: pyAchM === 0 ? 0 : ((achM - pyAchM) / pyAchM) * 100,
      pyAchM,
    };
  }, [dataRows, monthYear]);

  return (
    <Layout title={t("Grainage Monthly Brief Progress Report (Bivoltine)")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ಮಾಹೆಯ ಪ್ರಗತಿಯ ಸಂಕ್ಷಿಪ್ತ ವರದಿ — ಬಿತ್ತನೆಕೋಠಿ (ದ್ವಿತಳಿ)")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
            color: "#0f766e", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #5eead4", verticalAlign: "middle",
          }}>Bivoltine · CY + PY × Race</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(15,118,110,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#3730a3 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📊</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಬಿತ್ತನೆಕೋಠಿ ಮಾಹೆಯ ಪ್ರಗತಿಯ ಸಂಕ್ಷಿಪ್ತ ವರದಿ — ಮಿಶ್ರ + ದ್ವಿತಳಿ + ಹೈ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Brief</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Grainage (Bivoltine) — Race-wise Programme · Achievement · Storage · Distribution (CY + PY)</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{grainageName}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f0fdfa)" }}>
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
                  <label style={lbl}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">— Month —</option>
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
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

        {hasReport && (
          <div className="gbm-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpi("#ccfbf1", "#5eead4", "#0f766e")}>
                <span style={kpiLbl("#0f766e")}>Grainage</span>
                <span style={{ ...kpiVal("#134e4a", 14), fontWeight: 800 }}>{grainageName}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>Period</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={kpi("#fed7aa", "#fb923c", "#7c2d12")}>
                <span style={kpiLbl("#7c2d12")}>🎯 ಗುರಿ Target (CY M)</span>
                <span className="gbm-num" style={kpiVal("#7c2d12", 16)}>{kpis.progM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#9a3412", fontWeight: 700, marginTop: "1px" }}>Annual: {kpis.annualTgt.toLocaleString()}</span>
              </div>
              <div style={kpi("#a7f3d0", "#6ee7b7", "#065f46")}>
                <span style={kpiLbl("#065f46")}>✅ ಸಾಧನೆ Achievement (CY M)</span>
                <span className="gbm-num" style={kpiVal("#064e3b", 16)}>{kpis.achM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#065f46", fontWeight: 700, marginTop: "1px" }}>FY Cum: {kpis.achME.toLocaleString()}</span>
              </div>
              <div style={{
                ...kpi(
                  kpis.pctM >= 100 ? "#bbf7d0" : kpis.pctM >= 75 ? "#a7f3d0" : kpis.pctM >= 50 ? "#fde68a" : "#fecaca",
                  kpis.pctM >= 100 ? "#86efac" : kpis.pctM >= 75 ? "#6ee7b7" : kpis.pctM >= 50 ? "#fcd34d" : "#fca5a5",
                  kpis.pctM >= 100 ? "#14532d" : kpis.pctM >= 75 ? "#065f46" : kpis.pctM >= 50 ? "#92400e" : "#7f1d1d",
                ),
              }}>
                <span style={kpiLbl(kpis.pctM >= 100 ? "#14532d" : kpis.pctM >= 75 ? "#065f46" : kpis.pctM >= 50 ? "#92400e" : "#7f1d1d")}>
                  {kpis.pctM >= 100 ? "🎉" : "📊"} ಶೇ. ಸಾಧನೆ Ach %
                </span>
                <span className="gbm-num" style={kpiVal(kpis.pctM >= 100 ? "#14532d" : kpis.pctM >= 75 ? "#064e3b" : kpis.pctM >= 50 ? "#78350f" : "#7f1d1d", 18)}>
                  {kpis.pctM.toFixed(2)}%
                </span>
              </div>
              <div style={kpi("#ddd6fe", "#a78bfa", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>🪺 ಸಂಗ್ರಹ Storage (CY M)</span>
                <span className="gbm-num" style={kpiVal("#4c1d95", 15)}>{kpis.storageM.toLocaleString()}</span>
              </div>
              <div style={kpi("#fecdd3", "#fda4af", "#9f1239")}>
                <span style={kpiLbl("#9f1239")}>🚚 ವಿತರಣೆ Distribution (CY M)</span>
                <span className="gbm-num" style={kpiVal("#881337", 15)}>{kpis.distM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#9f1239", fontWeight: 700, marginTop: "1px" }}>FY Cum: {kpis.distME.toLocaleString()}</span>
              </div>
              <div style={{
                ...kpi(
                  kpis.yoyAch >= 0 ? "#dbeafe" : "#fecdd3",
                  kpis.yoyAch >= 0 ? "#93c5fd" : "#fda4af",
                  kpis.yoyAch >= 0 ? "#1e40af" : "#9f1239",
                ),
              }}>
                <span style={kpiLbl(kpis.yoyAch >= 0 ? "#1e40af" : "#9f1239")}>
                  {kpis.yoyAch >= 0 ? "↗ YoY Growth" : "↘ YoY Decline"} (Ach M)
                </span>
                <span className="gbm-num" style={kpiVal(kpis.yoyAch >= 0 ? "#1e3a8a" : "#881337", 16)}>
                  {(kpis.yoyAch >= 0 ? "+" : "") + kpis.yoyAch.toFixed(2)}%
                </span>
                <span style={{ fontSize: "10.5px", color: kpis.yoyAch >= 0 ? "#1e40af" : "#9f1239", fontWeight: 700, marginTop: "1px" }}>vs PY M: {kpis.pyAchM.toLocaleString()}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#0c4a6e,#0f766e 50%,#312e81)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                ಬಿತ್ತನೆಕೋಠಿ {grainageName} &nbsp;·&nbsp; {monthKn} {monthYear || ""} ಮಾಹೆಯ ಪ್ರಗತಿಯ ಸಂಕ್ಷಿಪ್ತ ವರದಿ
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Grainage Monthly Brief Progress &nbsp;·&nbsp; Race-wise · Current Year + Previous Year &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="gbm-scroll" style={{ overflowX: "auto" }}>
                <table className="gbm-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1700px" }}>
                  <thead>
                    {/* Row 1 — top groups */}
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#475569,#64748b)", "100px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ವರ್ಷ</div><div style={hdrEn}>Year</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "180px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>ತಳಿ</div><div style={hdrEn}>Race</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#b45309,#d97706)", "120px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ವಾರ್ಷಿಕ ಗುರಿ</div><div style={hdrEn}>Annual Target</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#9a3412,#ea580c)")}>
                        <div style={{ fontSize: "12px" }}>🎯 ಕಾರ್ಯಕ್ರಮ</div>
                        <div style={hdrEn}>Programme</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#0f766e,#14b8a6)")}>
                        <div style={{ fontSize: "12px" }}>✅ ಸಾಧನೆ</div>
                        <div style={hdrEn}>Achievement</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#065f46,#10b981)")}>
                        <div style={{ fontSize: "12px" }}>📊 ಶೇಕಡಾ</div>
                        <div style={hdrEn}>%</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#5b21b6,#7c3aed)")}>
                        <div style={{ fontSize: "12px" }}>🪺 ಸಂಗ್ರಹ</div>
                        <div style={hdrEn}>Storage</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#0369a1,#0284c7)")}>
                        <div style={{ fontSize: "12px" }}>📈 ಇಳುವರಿ</div>
                        <div style={hdrEn}>Yield</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#9f1239,#e11d48)")}>
                        <div style={{ fontSize: "12px" }}>🚚 ವಿತರಣೆ</div>
                        <div style={hdrEn}>Distribution</div>
                      </th>
                    </tr>
                    {/* Row 2 — Month / FY-Cum sub-leaves */}
                    <tr>
                      {[
                        { bg: "linear-gradient(135deg,#fed7aa,#fdba74)", color: "#7c2d12" }, // prog
                        { bg: "linear-gradient(135deg,#fed7aa,#fdba74)", color: "#7c2d12" },
                        { bg: "linear-gradient(135deg,#99f6e4,#5eead4)", color: "#134e4a" }, // ach
                        { bg: "linear-gradient(135deg,#99f6e4,#5eead4)", color: "#134e4a" },
                        { bg: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", color: "#064e3b" }, // pct
                        { bg: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", color: "#064e3b" },
                        { bg: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", color: "#4c1d95" }, // storage
                        { bg: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", color: "#4c1d95" },
                        { bg: "linear-gradient(135deg,#bae6fd,#7dd3fc)", color: "#0c4a6e" }, // yield
                        { bg: "linear-gradient(135deg,#bae6fd,#7dd3fc)", color: "#0c4a6e" },
                        { bg: "linear-gradient(135deg,#fecdd3,#fda4af)", color: "#881337" }, // dist
                        { bg: "linear-gradient(135deg,#fecdd3,#fda4af)", color: "#881337" },
                      ].map((s, i) => (
                        <th key={i} style={subhdr(s.bg, s.color)}>
                          <div style={{ fontSize: "10.5px" }}>{i % 2 === 0 ? "ಮಾಸ" : "ಮಾಸಾಂತ್ಯ"}</div>
                          <div style={subhdrEn}>{i % 2 === 0 ? "Month" : "FY Cum"}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.length === 0 && (
                      <tr><td colSpan={16} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#f0fdfa,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>📊</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f766e", marginBottom: "4px" }}>ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No data found for this grainage in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {grouped.map((g, gi) => {
                      const yearTone = gi === 0
                        ? { band: "linear-gradient(135deg,#0f766e,#14b8a6)", text: "#fff", subText: "#ccfbf1", label: "ಪ್ರಸಕ್ತ ವರ್ಷ", labelEn: "Current Year" }
                        : { band: "linear-gradient(135deg,#3730a3,#6366f1)", text: "#fff", subText: "#e0e7ff", label: "ಹಿಂದಿನ ವರ್ಷ", labelEn: "Previous Year" };
                      return g.rows.map((row, ri) => {
                        const isFirst = ri === 0;
                        const raceMeta = RACE_STYLE(row.race);
                        const isTotal = raceMeta.isTotal;
                        const rowBg = isTotal
                          ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                          : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                        const cyM = numOrZero(row.ach_m);
                        const cyP = numOrZero(row.prog_m);
                        const computedPct = cyP === 0 ? 0 : (cyM / cyP) * 100;
                        return (
                          <tr key={`${g.yearLabel}-${ri}`} className="gbm-tr" style={{ background: rowBg }}>
                            {isFirst && (
                              <td rowSpan={g.rows.length} style={{
                                padding: "10px 6px", textAlign: "center",
                                borderBottom: "2px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                                background: "linear-gradient(135deg,#1e293b,#334155)",
                                verticalAlign: "middle",
                              }}>
                                <span style={{
                                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                                  minWidth: "30px", height: "30px", borderRadius: "50%",
                                  background: "linear-gradient(135deg,#ccfbf1,#5eead4)",
                                  color: "#0f766e", fontWeight: 800, fontSize: "12px",
                                }}>{row.sl_no}</span>
                              </td>
                            )}
                            {isFirst && (
                              <td rowSpan={g.rows.length} style={{
                                padding: "10px 8px", textAlign: "center",
                                borderBottom: "2px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                                background: yearTone.band,
                                color: yearTone.text, verticalAlign: "middle",
                              }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                                  <span style={{ fontSize: "15px", fontWeight: 800 }}>{g.yearLabel}</span>
                                  <span style={{ fontSize: "10px", fontWeight: 700, color: yearTone.subText }}>{yearTone.label}</span>
                                  <span style={{ fontSize: "9px", fontWeight: 600, color: yearTone.subText, opacity: .85 }}>{yearTone.labelEn}</span>
                                </div>
                              </td>
                            )}
                            <td style={{
                              padding: "10px 14px", textAlign: "left",
                              borderBottom: ri === g.rows.length - 1 ? "2px solid #e2e8f0" : "1px solid #f1f5f9",
                              borderRight: "1px solid #e2e8f0",
                              fontWeight: isTotal ? 800 : 700,
                              fontSize: "12.5px",
                              color: isTotal ? "#78350f" : "#0f172a",
                            }}>
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: "8px",
                                padding: "4px 12px", borderRadius: "999px",
                                background: raceMeta.bg, color: raceMeta.color,
                                fontWeight: 800, fontSize: "11.5px",
                              }}>
                                <span style={{ fontSize: "13px", lineHeight: 1 }}>{raceMeta.icon}</span>
                                {row.race || "—"}
                              </span>
                            </td>
                            <td className="gbm-num" style={td("right",
                              isTotal ? "#78350f" : (numOrZero(row.annual_target) === 0 ? "#cbd5e0" : "#7c2d12"),
                              isTotal ? 800 : 700,
                              isTotal ? "linear-gradient(135deg,#fed7aa,#fdba74)" : (numOrZero(row.annual_target) === 0 ? "transparent" : "#fff7ed"),
                            )}>{numOrZero(row.annual_target) === 0 ? "—" : fmt(row.annual_target)}</td>
                            <td className="gbm-num" style={td("right",
                              isTotal ? "#78350f" : (numOrZero(row.prog_m) === 0 ? "#cbd5e0" : "#7c2d12"),
                              isTotal ? 800 : 700,
                              numOrZero(row.prog_m) === 0 ? "transparent" : "linear-gradient(135deg,#fff7ed,#ffedd5)",
                            )}>{numOrZero(row.prog_m) === 0 ? "—" : fmt(row.prog_m)}</td>
                            <td className="gbm-num" style={td("right",
                              isTotal ? "#78350f" : (numOrZero(row.prog_me) === 0 ? "#cbd5e0" : "#9a3412"),
                              isTotal ? 800 : 800,
                              numOrZero(row.prog_me) === 0 ? "transparent" : "linear-gradient(135deg,#ffedd5,#fed7aa)",
                            )}>{numOrZero(row.prog_me) === 0 ? "—" : fmt(row.prog_me)}</td>
                            <td className="gbm-num" style={td("right",
                              isTotal ? "#78350f" : (numOrZero(row.ach_m) === 0 ? "#cbd5e0" : "#134e4a"),
                              isTotal ? 800 : 800,
                              numOrZero(row.ach_m) === 0 ? "transparent" : "linear-gradient(135deg,#f0fdfa,#ccfbf1)",
                            )}>{numOrZero(row.ach_m) === 0 ? "—" : fmt(row.ach_m)}</td>
                            <td className="gbm-num" style={td("right",
                              isTotal ? "#78350f" : (numOrZero(row.ach_me) === 0 ? "#cbd5e0" : "#0f766e"),
                              isTotal ? 800 : 800,
                              numOrZero(row.ach_me) === 0 ? "transparent" : "linear-gradient(135deg,#ccfbf1,#99f6e4)",
                            )}>{numOrZero(row.ach_me) === 0 ? "—" : fmt(row.ach_me)}</td>
                            {/* % cell — backend sends "0", so for the Total row of the latest year we
                                synthesise it client-side from prog/ach to give the user a real number. */}
                            <td className="gbm-num" style={td("right",
                              isTotal ? "#14532d" : "#cbd5e0",
                              800,
                              isTotal && computedPct >= 100 ? "linear-gradient(135deg,#bbf7d0,#86efac)" :
                              isTotal && computedPct >= 75  ? "linear-gradient(135deg,#a7f3d0,#6ee7b7)" :
                              isTotal && computedPct >= 50  ? "linear-gradient(135deg,#fde68a,#fcd34d)" :
                              isTotal                       ? "linear-gradient(135deg,#fecaca,#fca5a5)" : "transparent",
                            )}>
                              {isTotal ? `${computedPct.toFixed(1)}%` : "—"}
                            </td>
                            <td className="gbm-num" style={td("right", "#cbd5e0", 600, "transparent")}>—</td>
                            <td className="gbm-num" style={td("right",
                              isTotal ? "#78350f" : (numOrZero(row.storage_m) === 0 ? "#cbd5e0" : "#4c1d95"),
                              isTotal ? 800 : 700,
                              numOrZero(row.storage_m) === 0 ? "transparent" : "linear-gradient(135deg,#f5f3ff,#ede9fe)",
                            )}>{numOrZero(row.storage_m) === 0 ? "—" : fmt(row.storage_m)}</td>
                            <td className="gbm-num" style={td("right",
                              isTotal ? "#78350f" : (numOrZero(row.storage_me) === 0 ? "#cbd5e0" : "#5b21b6"),
                              isTotal ? 800 : 800,
                              numOrZero(row.storage_me) === 0 ? "transparent" : "linear-gradient(135deg,#ede9fe,#ddd6fe)",
                            )}>{numOrZero(row.storage_me) === 0 ? "—" : fmt(row.storage_me)}</td>
                            <td className="gbm-num" style={td("right", "#cbd5e0", 600, "transparent")}>—</td>
                            <td className="gbm-num" style={td("right", "#cbd5e0", 600, "transparent")}>—</td>
                            <td className="gbm-num" style={td("right",
                              isTotal ? "#78350f" : (numOrZero(row.dist_m) === 0 ? "#cbd5e0" : "#881337"),
                              isTotal ? 800 : 700,
                              numOrZero(row.dist_m) === 0 ? "transparent" : "linear-gradient(135deg,#fff1f2,#ffe4e6)",
                            )}>{numOrZero(row.dist_m) === 0 ? "—" : fmt(row.dist_m)}</td>
                            <td className="gbm-num" style={td("right",
                              isTotal ? "#78350f" : (numOrZero(row.dist_me) === 0 ? "#cbd5e0" : "#9f1239"),
                              isTotal ? 800 : 800,
                              numOrZero(row.dist_me) === 0 ? "transparent" : "linear-gradient(135deg,#ffe4e6,#fecdd3)",
                            )}>{numOrZero(row.dist_me) === 0 ? "—" : fmt(row.dist_me)}</td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #a7f3d0" }}>
                <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                  {grainageName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; CY Total Achievement {kpis.achM.toLocaleString()} ({kpis.pctM.toFixed(1)}%) &nbsp;·&nbsp; YoY {(kpis.yoyAch >= 0 ? "+" : "") + kpis.yoyAch.toFixed(1)}%
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
  minWidth: "105px",
});
const td = (align, color, weight, bg) => ({
  padding: "9px 10px", textAlign: align || "center",
  borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc",
  background: bg || "transparent",
  color: color || "#0f172a", fontWeight: weight || 600,
  fontSize: "12.5px",
});

export default GrainageBriefMonthlyReport;
