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

if (!document.getElementById("gf10-styles")) {
  const s = document.createElement("style");
  s.id = "gf10-styles";
  s.innerHTML = `
    .gf10-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gf10-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gf10-swal .swal2-icon { margin:20px auto 4px !important; }
    .gf10-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gf10-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gf10-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .gf10-wrap { animation: gf10-in .35s ease; }
    @keyframes gf10-tabIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
    .gf10-tab-content { animation: gf10-tabIn .25s ease; }
    .gf10-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gf10-table th { letter-spacing:.02em; }
    .gf10-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gf10-scroll::-webkit-scrollbar { height:9px; }
    .gf10-scroll::-webkit-scrollbar-track { background:#f0fdfa; border-radius:6px; }
    .gf10-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#3730a3); border-radius:6px; }
    .gf10-tab { transition: transform .12s ease, box-shadow .12s ease; }
    .gf10-tab:hover { transform: translateY(-1px); }
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

// Indian-style rupee formatting for cost/income sections (3 & 4)
const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
const fmtINR = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "—";
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  if (n === 0) return "₹ 0";
  return `₹ ${inr.format(n)}`;
};

const pctBand = (p) => {
  if (p >= 100) return { bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d", border: "#4ade80" };
  if (p >= 75)  return { bg: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", color: "#065f46", border: "#34d399" };
  if (p >= 50)  return { bg: "linear-gradient(135deg,#fde68a,#fcd34d)", color: "#92400e", border: "#fbbf24" };
  return         { bg: "linear-gradient(135deg,#fecaca,#fca5a5)", color: "#7f1d1d", border: "#f87171" };
};

// Per-tab metadata
const TABS = [
  { key: "cy",     icon: "📈", knTitle: "ಭಾಗ-1 · ಪ್ರಸಕ್ತ ವರ್ಷ",   enTitle: "Section-1 · Current Year (Production, in lakhs)", hue: "teal",   pathSeg: "grainage-form10",        dataKey: "section1_cy" },
  { key: "py",     icon: "📉", knTitle: "ಭಾಗ-2 · ಹಿಂದಿನ ವರ್ಷ",   enTitle: "Section-2 · Previous Year (Production, in lakhs)", hue: "indigo", pathSeg: "grainage-form10-py",     dataKey: "section2_py" },
  { key: "cost",   icon: "💸", knTitle: "ಭಾಗ-3 · ಖರ್ಚಾಯ",       enTitle: "Section-3 · Cost & Production Details (in ₹)",     hue: "rose",   pathSeg: "grainage-form10-cost",   dataKey: "section3_cost" },
  { key: "income", icon: "💰", knTitle: "ಭಾಗ-4 · ಆದಾಯ",         enTitle: "Section-4 · Income (in ₹)",                          hue: "emerald", pathSeg: "grainage-form10-income", dataKey: "section4_income" },
];

const TAB_HUE = {
  teal:    { band: "linear-gradient(135deg,#0f766e,#14b8a6)", soft: "#ccfbf1", border: "#5eead4", text: "#0f766e", deep: "#134e4a" },
  indigo:  { band: "linear-gradient(135deg,#3730a3,#6366f1)", soft: "#c7d2fe", border: "#a5b4fc", text: "#3730a3", deep: "#312e81" },
  rose:    { band: "linear-gradient(135deg,#9f1239,#e11d48)", soft: "#fecdd3", border: "#fda4af", text: "#9f1239", deep: "#881337" },
  emerald: { band: "linear-gradient(135deg,#065f46,#10b981)", soft: "#a7f3d0", border: "#6ee7b7", text: "#065f46", deep: "#064e3b" },
};

function GrainageForm10ProductionReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ grainageId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [grainageList,      setGrainageList]      = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [allData,    setAllData]    = useState({ section1_cy: [], section2_py: [], section3_cost: [], section4_income: [] });
  const [hasReport,  setHasReport]  = useState(false);
  const [isLoading,  setIsLoading]  = useState(false);
  const [pdfLoadingKey,   setPdfLoadingKey]   = useState(null);
  const [excelLoadingKey, setExcelLoadingKey] = useState(null);

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
    setHasReport(false);
    setAllData({ section1_cy: [], section2_py: [], section3_cost: [], section4_income: [] });
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
      background: "#fff", customClass: { popup: "gf10-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gf10-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { grainageId: filter.grainageId, year, month: m };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false);
    setAllData({ section1_cy: [], section2_py: [], section3_cost: [], section4_income: [] });
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-form10-all", { params: params() });
      const data = res.data || {};
      setAllData({
        section1_cy:     Array.isArray(data.section1_cy)     ? data.section1_cy     : [],
        section2_py:     Array.isArray(data.section2_py)     ? data.section2_py     : [],
        section3_cost:   Array.isArray(data.section3_cost)   ? data.section3_cost   : [],
        section4_income: Array.isArray(data.section4_income) ? data.section4_income : [],
      });
      setHasReport(true);
    } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          showErr("No Data Found", "No data found for the selected filters.");
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Grainage Form-10 report.");
        }
      } finally { setIsLoading(false); }
  };

  const handlePdf = async (tabKey) => {
    const err = validate(); if (err) { showWarn(err); return; }
    setPdfLoadingKey(tabKey);
    try {
      const tab = TABS.find((x) => x.key === tabKey);
      const res = await api.get(baseURLSeedDFL + `grainage-progress-report/${tab.pathSeg}/pdf`, { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setPdfLoadingKey(null); }
  };

  const handleExcel = async (tabKey) => {
    const err = validate(); if (err) { showWarn(err); return; }
    setExcelLoadingKey(tabKey);
    try {
      const tab = TABS.find((x) => x.key === tabKey);
      const res = await api.get(baseURLSeedDFL + `grainage-progress-report/${tab.pathSeg}/excel`, { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `${tab.pathSeg.replace(/-/g, "_")}_${filter.grainageId}_${year}_${m}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); }
    finally { setExcelLoadingKey(null); }
  };

  const selectedGrainage = grainageList.find((g) => String(g.grainageMasterId) === String(filter.grainageId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const grainageName = selectedGrainage?.grainageMasterName || "—";

  // Top-level KPIs across all 4 sections
  const overview = useMemo(() => {
    const cyMonth = (allData.section1_cy.find((r) => String(r.sl_no) === "1") || {});
    const cyCum   = (allData.section1_cy.find((r) => String(r.sl_no) === "2") || {});
    const pyMonth = (allData.section2_py.find((r) => String(r.sl_no) === "1") || {});
    const costCum = (allData.section3_cost.find((r) => String(r.sl_no) === "2") || {});
    const incomeCum = (allData.section4_income.find((r) => String(r.sl_no) === "2") || {});

    const cyTgtZone = numOrZero(cyMonth.tgt_zone_total);
    const cyAchM    = numOrZero(cyMonth.ach_zone_total);
    const cyAchCum  = numOrZero(cyCum.ach_zone_total);
    const pyAchM    = numOrZero(pyMonth.ach_zone_total);
    const totalCost = numOrZero(costCum.total_cost_with_staff);
    const totalIncome = numOrZero(incomeCum.grand_total);
    const profit = totalIncome - totalCost;
    return {
      cyTgtZone, cyAchM, cyAchCum, pyAchM,
      pctCY: cyTgtZone === 0 ? 0 : (cyAchM / cyTgtZone) * 100,
      yoy: pyAchM === 0 ? 0 : ((cyAchM - pyAchM) / pyAchM) * 100,
      annualTgt: numOrZero(cyMonth.ann_tot),
      annualPct: numOrZero(cyMonth.ann_tot) === 0 ? 0 : (cyAchCum / numOrZero(cyMonth.ann_tot)) * 100,
      totalCost, totalIncome, profit,
    };
  }, [allData]);

  return (
    <Layout title={t("Grainage Form-10 · Production · PY · Cost · Income")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ಪಾತ ಸಂಖ್ಯೆ-10 · ಬಿತ್ತನೆ ಕೋಠಿ ಮಾಹೆಯ ಪ್ರಗತಿ ವರದಿ — 4 ಭಾಗಗಳು")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
            color: "#0f766e", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #5eead4", verticalAlign: "middle",
          }}>P1 & P2 · Bivoltine · Form-10 · CY + PY + Cost + Income</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(15,118,110,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#3730a3 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📑</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಪಾತ ಸಂಖ್ಯೆ-10 · ಬಿತ್ತನೆ ಕೋಠಿ ಮಾಹೆಯ ಪ್ರಗತಿ — 4 ಭಾಗಗಳು
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Form-10</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P1 &amp; P2 Grainage (Bivoltine) — Section-1 CY · Section-2 PY · Section-3 Cost · Section-4 Income, all in one form</div>
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
                      setHasReport(false);
                      setAllData({ section1_cy: [], section2_py: [], section3_cost: [], section4_income: [] });
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
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading all 4 sections…</> : <>📋 View All 4 Sections</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="gf10-wrap mt-4">
            {/* Top-line overview KPIs across all sections */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-stretch">
              <div style={kpi("#ccfbf1", "#5eead4", "#0f766e")}>
                <span style={kpiLbl("#0f766e")}>Grainage</span>
                <span style={{ ...kpiVal("#134e4a", 14), fontWeight: 800 }}>{grainageName}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>Period</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={kpi("#a7f3d0", "#6ee7b7", "#065f46")}>
                <span style={kpiLbl("#065f46")}>📈 CY Zone Ach (Month)</span>
                <span className="gf10-num" style={kpiVal("#064e3b", 16)}>{overview.cyAchM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#065f46", fontWeight: 700, marginTop: "1px" }}>FY Cum: {overview.cyAchCum.toLocaleString()}</span>
              </div>
              <div style={kpi("#c7d2fe", "#a5b4fc", "#3730a3")}>
                <span style={kpiLbl("#3730a3")}>📉 PY Zone Ach (Month)</span>
                <span className="gf10-num" style={kpiVal("#312e81", 16)}>{overview.pyAchM.toLocaleString()}</span>
              </div>
              <div style={{
                ...kpi(
                  overview.yoy >= 0 ? "#bbf7d0" : "#fecdd3",
                  overview.yoy >= 0 ? "#86efac" : "#fda4af",
                  overview.yoy >= 0 ? "#14532d" : "#9f1239",
                ),
              }}>
                <span style={kpiLbl(overview.yoy >= 0 ? "#14532d" : "#9f1239")}>
                  {overview.yoy >= 0 ? "↗" : "↘"} YoY (Month)
                </span>
                <span className="gf10-num" style={kpiVal(overview.yoy >= 0 ? "#14532d" : "#881337", 16)}>
                  {(overview.yoy >= 0 ? "+" : "") + overview.yoy.toFixed(2)}%
                </span>
              </div>
              <div style={kpi("#fecdd3", "#fda4af", "#9f1239")}>
                <span style={kpiLbl("#9f1239")}>💸 Total Cost (FY Cum)</span>
                <span className="gf10-num" style={kpiVal("#881337", 15)}>{fmtINR(overview.totalCost)}</span>
              </div>
              <div style={kpi("#bbf7d0", "#86efac", "#166534")}>
                <span style={kpiLbl("#166534")}>💰 Total Income (FY Cum)</span>
                <span className="gf10-num" style={kpiVal("#14532d", 15)}>{fmtINR(overview.totalIncome)}</span>
              </div>
              <div style={{
                ...kpi(
                  overview.profit >= 0 ? "#a7f3d0" : "#fecdd3",
                  overview.profit >= 0 ? "#6ee7b7" : "#fda4af",
                  overview.profit >= 0 ? "#065f46" : "#9f1239",
                ),
              }}>
                <span style={kpiLbl(overview.profit >= 0 ? "#065f46" : "#9f1239")}>
                  {overview.profit >= 0 ? "📈 ಲಾಭ Profit" : "📉 ನಷ್ಟ Loss"} (FY Cum)
                </span>
                <span className="gf10-num" style={kpiVal(overview.profit >= 0 ? "#064e3b" : "#881337", 15)}>
                  {(overview.profit >= 0 ? "+" : "") + fmtINR(Math.abs(overview.profit)).replace("₹", "₹")}
                </span>
              </div>
            </div>

            {/* Section quick-nav strip — clicking jumps to that section below */}
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 14px rgba(15,118,110,.10)", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: "8px",
                padding: "14px 18px",
                background: "linear-gradient(135deg,#f0fdfa,#eef2ff)",
              }}>
                {TABS.map((tab) => {
                  const pal = TAB_HUE[tab.hue];
                  return (
                    <a
                      key={tab.key}
                      href={`#gf10-${tab.key}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(`gf10-${tab.key}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="gf10-tab"
                      style={{
                        flex: "1 1 220px",
                        border: `2px solid ${pal.border}`,
                        background: pal.band,
                        color: "#fff",
                        borderRadius: "12px",
                        padding: "12px 18px",
                        fontWeight: 800,
                        fontSize: "13px",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,.12)",
                        textDecoration: "none",
                        display: "block",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{
                          fontSize: "20px",
                          width: "36px", height: "36px", borderRadius: "10px",
                          background: "rgba(255,255,255,.22)",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                        }}>{tab.icon}</span>
                        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                          <span style={{ fontWeight: 800, fontSize: "13.5px" }}>{tab.knTitle}</span>
                          <span style={{ fontSize: "10.5px", fontWeight: 700, opacity: .92 }}>{tab.enTitle}</span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </Card>

            {/* All four sections rendered vertically — Section-1 (CY), Section-2 (PY), Section-3 (Cost), Section-4 (Income) */}
            <div id="gf10-cy">
              <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden", marginBottom: "20px" }}>
                <ProductionSection rows={allData.section1_cy} hue="teal"
                  titleKn="ಭಾಗ-1 · ಪ್ರಸಕ್ತ ವರ್ಷ ಮೊಟ್ಟೆಗಳ ಉತ್ಪಾದನಾ ಪ್ರಗತಿ (ಲಕ್ಷಗಳಲ್ಲಿ)"
                  titleEn="Section-1 · Current Year Production Progress (in lakhs)"
                  monthKn={monthKn} monthYear={monthYear} monthLabel={monthLabel}
                  grainageName={grainageName}
                  tabKey="cy"
                  handlePdf={handlePdf} handleExcel={handleExcel}
                  pdfLoading={pdfLoadingKey === "cy"}
                  excelLoading={excelLoadingKey === "cy"} />
              </Card>
            </div>

            <div id="gf10-py">
              <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden", marginBottom: "20px" }}>
                <ProductionSection rows={allData.section2_py} hue="indigo"
                  titleKn={`ಭಾಗ-2 · ಹಿಂದಿನ ವರ್ಷ ${monthYear ? `(${monthYear - 1}-${monthYear % 100})` : ""} ಮೊಟ್ಟೆಗಳ ಉತ್ಪಾದನಾ ಪ್ರಗತಿ (ಲಕ್ಷಗಳಲ್ಲಿ)`}
                  titleEn={`Section-2 · Previous Year ${monthYear ? `(${monthYear - 1}-${monthYear % 100})` : ""} Production Progress (in lakhs)`}
                  monthKn={monthKn} monthYear={monthYear} monthLabel={monthLabel}
                  grainageName={grainageName}
                  tabKey="py"
                  handlePdf={handlePdf} handleExcel={handleExcel}
                  pdfLoading={pdfLoadingKey === "py"}
                  excelLoading={excelLoadingKey === "py"} />
              </Card>
            </div>

            <div id="gf10-cost">
              <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden", marginBottom: "20px" }}>
                <CostSection rows={allData.section3_cost}
                  monthKn={monthKn} monthYear={monthYear} monthLabel={monthLabel}
                  grainageName={grainageName}
                  handlePdf={handlePdf} handleExcel={handleExcel}
                  pdfLoading={pdfLoadingKey === "cost"}
                  excelLoading={excelLoadingKey === "cost"} />
              </Card>
            </div>

            <div id="gf10-income">
              <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden", marginBottom: "20px" }}>
                <IncomeSection rows={allData.section4_income}
                  monthKn={monthKn} monthYear={monthYear} monthLabel={monthLabel}
                  grainageName={grainageName}
                  handlePdf={handlePdf} handleExcel={handleExcel}
                  pdfLoading={pdfLoadingKey === "income"}
                  excelLoading={excelLoadingKey === "income"} />
              </Card>
            </div>
          </div>
        )}
      </Block>
    </Layout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 1 / Section 2 — 16-col Production table (CY or PY)
// Both share the same shape & header; just different data + theme hue.
// ─────────────────────────────────────────────────────────────────────────────
function ProductionSection({ rows, hue, titleKn, titleEn, monthKn, monthYear, monthLabel, grainageName, tabKey,
                             handlePdf, handleExcel, pdfLoading, excelLoading }) {
  const pal = TAB_HUE[hue];
  const yearLabelText = tabKey === "cy"
    ? (monthYear ? `${monthYear}-${(monthYear + 1) % 100}` : "")
    : (monthYear ? `${monthYear - 1}-${monthYear % 100}` : "");
  const monthRow = rows.find((r) => String(r.sl_no) === "1") || {};
  const cumRow   = rows.find((r) => String(r.sl_no) === "2") || {};
  const tgtZ = numOrZero(monthRow.tgt_zone_total);
  const achZ = numOrZero(monthRow.ach_zone_total);
  const pct  = tgtZ === 0 ? 0 : (achZ / tgtZ) * 100;
  const band = pctBand(pct);

  return (
    <>
      {/* Title strip */}
      <div style={{
        background: pal.band,
        color: "#fff", padding: "16px 22px",
        fontWeight: 800, fontSize: "15px", textAlign: "center",
      }}>
        {titleKn}
        <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
          {titleEn} &nbsp;·&nbsp; {grainageName} &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
        </div>
      </div>

      {/* Sub KPI strip for this section */}
      <div className="d-flex flex-wrap gap-3" style={{ padding: "16px 22px", background: "#fafdfc", borderBottom: "1px solid #e2e8f0" }}>
        <div style={kpi(pal.soft, pal.border, pal.text)}>
          <span style={kpiLbl(pal.text)}>📅 ಮಾಸ ಗುರಿ Monthly Tgt</span>
          <span className="gf10-num" style={kpiVal(pal.deep, 15)}>{tgtZ.toLocaleString()}</span>
          <span style={{ fontSize: "10.5px", color: pal.text, fontWeight: 700, marginTop: "1px" }}>Annual: {numOrZero(monthRow.ann_tot).toLocaleString()}</span>
        </div>
        <div style={kpi(pal.soft, pal.border, pal.text)}>
          <span style={kpiLbl(pal.text)}>✅ ಸಾಧನೆ Zone (Month)</span>
          <span className="gf10-num" style={kpiVal(pal.deep, 15)}>{achZ.toLocaleString()}</span>
          <span style={{ fontSize: "10.5px", color: pal.text, fontWeight: 700, marginTop: "1px" }}>FY Cum: {numOrZero(cumRow.ach_zone_total).toLocaleString()}</span>
        </div>
        <div style={kpi(pal.soft, pal.border, pal.text)}>
          <span style={kpiLbl(pal.text)}>🥚 ದ್ವಿತಳಿ BV (Month)</span>
          <span className="gf10-num" style={kpiVal(pal.deep, 15)}>{numOrZero(monthRow.ach_bv_total).toLocaleString()}</span>
          <span style={{ fontSize: "10.5px", color: pal.text, fontWeight: 700, marginTop: "1px" }}>FY Cum: {numOrZero(cumRow.ach_bv_total).toLocaleString()}</span>
        </div>
        <div style={{
          ...kpi(band.bg, band.border, band.color),
          background: band.bg + ", #ffffff",
        }}>
          <span style={kpiLbl(band.color)}>
            {pct >= 100 ? "🎉" : "📊"} ಶೇ. ಸಾಧನೆ Zone Ach %
          </span>
          <span className="gf10-num" style={kpiVal(band.color, 18)}>{pct.toFixed(2)}%</span>
        </div>
      </div>

      <ProductionTable rows={rows} hue={hue} yearLabelText={yearLabelText} />

      <ActionFooter
        text={`${tabKey === "cy" ? "Section-1" : "Section-2"} · ${grainageName} — ${monthLabel} ${monthKn} ${monthYear} · All values in lakhs · Zone Ach (Month) ${achZ.toLocaleString()} (${pct.toFixed(1)}%)`}
        tabKey={tabKey} handlePdf={handlePdf} handleExcel={handleExcel}
        pdfLoading={pdfLoading} excelLoading={excelLoading}
        bg="linear-gradient(135deg,#f0fdfa,#eef2ff)" border="#a7f3d0" textColor="#0f766e"
      />
    </>
  );
}

function ProductionTable({ rows, yearLabelText }) {
  return (
    <div className="gf10-scroll" style={{ overflowX: "auto" }}>
      <table className="gf10-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1700px" }}>
        <thead>
          <tr>
            <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
              <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl</div>
            </th>
            <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "120px", true, "left")}>
              <div style={{ fontSize: "12px" }}>ಸಾಲು</div><div style={hdrEn}>Row</div>
            </th>
            <th colSpan={3} style={hdr("linear-gradient(135deg,#b45309,#d97706)")}>
              <div style={{ fontSize: "12px" }}>🎯 ವಾರ್ಷಿಕ ಗುರಿ {yearLabelText}</div>
              <div style={hdrEn}>Annual Target</div>
            </th>
            <th colSpan={5} style={hdr("linear-gradient(135deg,#9a3412,#ea580c)")}>
              <div style={{ fontSize: "12px" }}>📅 ಗುರಿ Programme</div>
              <div style={hdrEn}>Monthly Target / Programme</div>
            </th>
            <th colSpan={6} style={hdr("linear-gradient(135deg,#0f766e,#14b8a6)")}>
              <div style={{ fontSize: "12px" }}>✅ ಸಾಧನೆ Achievement</div>
              <div style={hdrEn}>Achievement</div>
            </th>
          </tr>
          <tr>
            <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
              <div style={{ fontSize: "10px" }}>ಮಿಶ್ರ</div><div style={subhdrEn}>CB</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
              <div style={{ fontSize: "10px" }}>ದ್ವಿತಳಿ</div><div style={subhdrEn}>BV</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#fcd34d,#fbbf24)", "#78350f")}>
              <div style={{ fontSize: "10px" }}>ಒಟ್ಟು</div><div style={subhdrEn}>Total</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#bfdbfe,#93c5fd)", "#1e3a8a")}>
              <div style={{ fontSize: "10px" }}>ಪಿ2</div><div style={subhdrEn}>P2</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#c7d2fe,#a5b4fc)", "#3730a3")}>
              <div style={{ fontSize: "10px" }}>ಪಿ1</div><div style={subhdrEn}>P1</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#a7f3d0,#6ee7b7)", "#064e3b")}>
              <div style={{ fontSize: "10px" }}>ಹೈ</div><div style={subhdrEn}>HY</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
              <div style={{ fontSize: "10px" }}>ದ್ವಿ ಒಟ್ಟು</div><div style={subhdrEn}>BV Tot</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#fcd34d,#fbbf24)", "#78350f")}>
              <div style={{ fontSize: "10px" }}>ವಲಯ</div><div style={subhdrEn}>Zone</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
              <div style={{ fontSize: "10px" }}>ಮಿಶ್ರ</div><div style={subhdrEn}>CB</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#bfdbfe,#93c5fd)", "#1e3a8a")}>
              <div style={{ fontSize: "10px" }}>ಪಿ2</div><div style={subhdrEn}>P2</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#c7d2fe,#a5b4fc)", "#3730a3")}>
              <div style={{ fontSize: "10px" }}>ಪಿ1</div><div style={subhdrEn}>P1</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#a7f3d0,#6ee7b7)", "#064e3b")}>
              <div style={{ fontSize: "10px" }}>ಹೈ</div><div style={subhdrEn}>HY</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
              <div style={{ fontSize: "10px" }}>ದ್ವಿ ಒಟ್ಟು</div><div style={subhdrEn}>BV Tot</div>
            </th>
            <th style={subhdr("linear-gradient(135deg,#fcd34d,#fbbf24)", "#78350f")}>
              <div style={{ fontSize: "10px" }}>ವಲಯ</div><div style={subhdrEn}>Zone</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={16} style={{ padding: "60px 20px", textAlign: "center", background: "#fff" }}>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>📈</div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f766e", marginBottom: "4px" }}>ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
              <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No production data found.</div>
            </td></tr>
          )}
          {rows.map((row, ri) => {
            const isCum = String(row.sl_no) === "2";
            const rowBg = isCum ? "linear-gradient(135deg,#fef3c7,#fde68a)" : "#ffffff";
            const meta = isCum
              ? { icon: "Σ", label: "ಮಾಸಾಂತ್ಯ", labelEn: "FY Cum", text: "#78350f", chipBg: "linear-gradient(135deg,#fcd34d,#fbbf24)" }
              : { icon: "📅", label: "ತಿಂಗಳ", labelEn: "Month", text: "#134e4a", chipBg: "linear-gradient(135deg,#a7f3d0,#6ee7b7)" };
            return (
              <tr key={ri} className="gf10-tr" style={{ background: rowBg }}>
                <td style={{
                  padding: "12px 6px", textAlign: "center",
                  borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                  background: meta.chipBg, fontWeight: 800,
                }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "16px" }}>{meta.icon}</span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      minWidth: "24px", height: "24px", borderRadius: "50%",
                      background: "rgba(255,255,255,.92)",
                      color: meta.text, fontWeight: 800, fontSize: "11.5px",
                    }}>{row.sl_no}</span>
                  </div>
                </td>
                <td style={{
                  padding: "12px 14px", textAlign: "left",
                  borderBottom: "1px solid #e2e8f0", borderRight: "2px solid #e2e8f0",
                  color: meta.text, fontWeight: 800, fontSize: "13px",
                }}>
                  <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                    <span>{row.row_label || meta.label}</span>
                    <span style={{ fontSize: "10.5px", fontWeight: 700, opacity: .8 }}>{meta.labelEn}</span>
                  </div>
                </td>
                <ValCell v={row.ann_cb}    color="#7c2d12" bg="#fff7ed" />
                <ValCell v={row.ann_bv}    color="#4c1d95" bg="#f5f3ff" />
                <ValCell v={row.ann_tot}   color="#78350f" bg="linear-gradient(135deg,#fef3c7,#fde68a)" weight={800} right="2px solid #e2e8f0" />
                <ValCell v={row.tgt_p2}    color="#1e3a8a" bg="#eff6ff" />
                <ValCell v={row.tgt_p1}    color="#3730a3" bg="#eef2ff" />
                <ValCell v={row.tgt_hy}    color="#064e3b" bg="#ecfdf5" />
                <ValCell v={row.tgt_bv_total}   color="#4c1d95" bg="linear-gradient(135deg,#ddd6fe,#c4b5fd)" weight={800} />
                <ValCell v={row.tgt_zone_total} color="#78350f" bg="linear-gradient(135deg,#fcd34d,#fbbf24)" weight={800} right="2px solid #e2e8f0" />
                <ValCell v={row.ach_cb}    color="#7c2d12" bg="linear-gradient(135deg,#fed7aa,#fdba74)" />
                <ValCell v={row.ach_p2}    color="#1e3a8a" bg="linear-gradient(135deg,#bfdbfe,#93c5fd)" />
                <ValCell v={row.ach_p1}    color="#3730a3" bg="linear-gradient(135deg,#c7d2fe,#a5b4fc)" />
                <ValCell v={row.ach_hy}    color="#064e3b" bg="linear-gradient(135deg,#a7f3d0,#6ee7b7)" />
                <ValCell v={row.ach_bv_total}   color="#4c1d95" bg="linear-gradient(135deg,#ddd6fe,#c4b5fd)" weight={800} />
                <ValCell v={row.ach_zone_total} color="#78350f" bg="linear-gradient(135deg,#fcd34d,#fbbf24)" weight={800} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 3 — Cost & Production Details (₹) — 13 cols
// ─────────────────────────────────────────────────────────────────────────────
function CostSection({ rows, monthKn, monthYear, monthLabel, grainageName,
                       handlePdf, handleExcel, pdfLoading, excelLoading }) {
  const pal = TAB_HUE.rose;
  const cum = rows.find((r) => String(r.sl_no) === "2") || {};

  return (
    <>
      <div style={{
        background: pal.band, color: "#fff", padding: "16px 22px",
        fontWeight: 800, fontSize: "15px", textAlign: "center",
      }}>
        ಭಾಗ-3 · ಖರ್ಚಾಯ ವಿವರಗಳು (ರೂಗಳಲ್ಲಿ)
        <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
          Section-3 · Cost &amp; Production Details (in ₹) &nbsp;·&nbsp; {grainageName} &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
        </div>
      </div>

      <div className="d-flex flex-wrap gap-3" style={{ padding: "16px 22px", background: "#fafdfc", borderBottom: "1px solid #e2e8f0" }}>
        <div style={kpi(pal.soft, pal.border, pal.text)}>
          <span style={kpiLbl(pal.text)}>💸 ವೆಚ್ಚ ಸಹಿತ ಒಟ್ಟು With-Staff (FY Cum)</span>
          <span className="gf10-num" style={kpiVal(pal.deep, 15)}>{fmtINR(cum.cost_with_total)}</span>
        </div>
        <div style={kpi(pal.soft, pal.border, pal.text)}>
          <span style={kpiLbl(pal.text)}>💰 ಒಟ್ಟು ಸಿಬ್ಬಂದಿ ಸಹಿತ Total With-Staff</span>
          <span className="gf10-num" style={kpiVal(pal.deep, 15)}>{fmtINR(cum.total_cost_with_staff)}</span>
        </div>
        <div style={kpi(pal.soft, pal.border, pal.text)}>
          <span style={kpiLbl(pal.text)}>💰 ಒಟ್ಟು ಸಿಬ್ಬಂದಿ ರಹಿತ Total No-Staff</span>
          <span className="gf10-num" style={kpiVal(pal.deep, 15)}>{fmtINR(cum.total_cost_no_staff)}</span>
        </div>
        <div style={kpi(pal.soft, pal.border, pal.text)}>
          <span style={kpiLbl(pal.text)}>📊 ಒಟ್ಟು ಉತ್ಪಾದನೆ Total Production</span>
          <span className="gf10-num" style={kpiVal(pal.deep, 15)}>{fmt(cum.prod_total)}</span>
        </div>
      </div>

      <div className="gf10-scroll" style={{ overflowX: "auto" }}>
        <table className="gf10-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1500px" }}>
          <thead>
            <tr>
              <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl</div>
              </th>
              <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "120px", true, "left")}>
                <div style={{ fontSize: "12px" }}>ಸಾಲು</div><div style={hdrEn}>Row</div>
              </th>
              <th colSpan={3} style={hdr("linear-gradient(135deg,#0f766e,#14b8a6)")}>
                <div style={{ fontSize: "12px" }}>📊 ಮೊಟ್ಟೆ ಉತ್ಪಾದನೆ</div>
                <div style={hdrEn}>DFL Production (lakhs)</div>
              </th>
              <th colSpan={3} style={hdr("linear-gradient(135deg,#b45309,#d97706)")}>
                <div style={{ fontSize: "12px" }}>💸 ಉತ್ಪಾದನಾ ವೆಚ್ಚ ಸಹಿತ</div>
                <div style={hdrEn}>Production Cost (with Staff) ₹</div>
              </th>
              <th colSpan={3} style={hdr("linear-gradient(135deg,#5b21b6,#7c3aed)")}>
                <div style={{ fontSize: "12px" }}>💰 100 ಮೊಟ್ಟೆಗೆ (ಸಿಬ್ಬಂದಿ ರಹಿತ)</div>
                <div style={hdrEn}>Cost / 100 DFL (no Staff) ₹</div>
              </th>
              <th colSpan={2} style={hdr("linear-gradient(135deg,#9f1239,#e11d48)")}>
                <div style={{ fontSize: "12px" }}>Σ ಒಟ್ಟು ವೆಚ್ಚ</div>
                <div style={hdrEn}>Total Cost ₹</div>
              </th>
            </tr>
            <tr>
              <th style={subhdr("linear-gradient(135deg,#a7f3d0,#6ee7b7)", "#064e3b")}>
                <div style={{ fontSize: "10px" }}>ದ್ವಿತಳಿ</div><div style={subhdrEn}>BV</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#99f6e4,#5eead4)", "#134e4a")}>
                <div style={{ fontSize: "10px" }}>ಮಿಶ್ರತಳಿ</div><div style={subhdrEn}>CB</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#5eead4,#2dd4bf)", "#0f766e")}>
                <div style={{ fontSize: "10px" }}>ಒಟ್ಟು</div><div style={subhdrEn}>Total</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
                <div style={{ fontSize: "10px" }}>ದ್ವಿತಳಿ</div><div style={subhdrEn}>BV</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
                <div style={{ fontSize: "10px" }}>ಮಿಶ್ರತಳಿ</div><div style={subhdrEn}>CB</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#fdba74,#f59e0b)", "#7c2d12")}>
                <div style={{ fontSize: "10px" }}>ಒಟ್ಟು</div><div style={subhdrEn}>Total</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                <div style={{ fontSize: "10px" }}>ದ್ವಿತಳಿ</div><div style={subhdrEn}>BV</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                <div style={{ fontSize: "10px" }}>ಮಿಶ್ರತಳಿ</div><div style={subhdrEn}>CB</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#c4b5fd,#a78bfa)", "#4c1d95")}>
                <div style={{ fontSize: "10px" }}>ಒಟ್ಟು</div><div style={subhdrEn}>Total</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#fecdd3,#fda4af)", "#881337")}>
                <div style={{ fontSize: "10px" }}>ರಹಿತ</div><div style={subhdrEn}>No-Staff</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#fda4af,#f87171)", "#7f1d1d")}>
                <div style={{ fontSize: "10px" }}>ಸಹಿತ</div><div style={subhdrEn}>With-Staff</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={13} style={{ padding: "60px 20px", textAlign: "center", background: "#fff" }}>
                <div style={{ fontSize: "40px", marginBottom: "8px" }}>💸</div>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#9f1239", marginBottom: "4px" }}>ಯಾವುದೇ ಖರ್ಚಿನ ಮಾಹಿತಿ ಇಲ್ಲ</div>
                <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No cost data found.</div>
              </td></tr>
            )}
            {rows.map((row, ri) => {
              const isCum = String(row.sl_no) === "2";
              const rowBg = isCum ? "linear-gradient(135deg,#fef3c7,#fde68a)" : "#ffffff";
              const meta = isCum
                ? { icon: "Σ", label: "ಮಾಸಾಂತ್ಯ", labelEn: "FY Cum", text: "#78350f", chipBg: "linear-gradient(135deg,#fcd34d,#fbbf24)" }
                : { icon: "📅", label: "ತಿಂಗಳ", labelEn: "Month", text: "#881337", chipBg: "linear-gradient(135deg,#fecdd3,#fda4af)" };
              return (
                <tr key={ri} className="gf10-tr" style={{ background: rowBg }}>
                  <td style={{
                    padding: "12px 6px", textAlign: "center",
                    borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                    background: meta.chipBg, fontWeight: 800,
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "16px" }}>{meta.icon}</span>
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        minWidth: "24px", height: "24px", borderRadius: "50%",
                        background: "rgba(255,255,255,.92)",
                        color: meta.text, fontWeight: 800, fontSize: "11.5px",
                      }}>{row.sl_no}</span>
                    </div>
                  </td>
                  <td style={{
                    padding: "12px 14px", textAlign: "left",
                    borderBottom: "1px solid #e2e8f0", borderRight: "2px solid #e2e8f0",
                    color: meta.text, fontWeight: 800, fontSize: "13px",
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                      <span>{row.row_label || meta.label}</span>
                      <span style={{ fontSize: "10.5px", fontWeight: 700, opacity: .8 }}>{meta.labelEn}</span>
                    </div>
                  </td>
                  <ValCell v={row.prod_bv}      color="#064e3b" bg="#ecfdf5" />
                  <ValCell v={row.prod_cb}      color="#134e4a" bg="#f0fdfa" />
                  <ValCell v={row.prod_total}   color="#0f766e" bg="linear-gradient(135deg,#ccfbf1,#99f6e4)" weight={800} right="2px solid #e2e8f0" />
                  <ValCellINR v={row.cost_with_bv}    color="#7c2d12" bg="#fff7ed" />
                  <ValCellINR v={row.cost_with_cb}    color="#7c2d12" bg="#fff7ed" />
                  <ValCellINR v={row.cost_with_total} color="#7c2d12" bg="linear-gradient(135deg,#fed7aa,#fdba74)" weight={800} right="2px solid #e2e8f0" />
                  <ValCellINR v={row.cost_per100_bv}    color="#4c1d95" bg="#f5f3ff" />
                  <ValCellINR v={row.cost_per100_cb}    color="#4c1d95" bg="#f5f3ff" />
                  <ValCellINR v={row.cost_per100_total} color="#4c1d95" bg="linear-gradient(135deg,#ddd6fe,#c4b5fd)" weight={800} right="2px solid #e2e8f0" />
                  <ValCellINR v={row.total_cost_no_staff}    color="#881337" bg="linear-gradient(135deg,#fff1f2,#ffe4e6)" weight={800} />
                  <ValCellINR v={row.total_cost_with_staff}  color="#7f1d1d" bg="linear-gradient(135deg,#fecdd3,#fda4af)" weight={800} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ActionFooter
        text={`Section-3 · ${grainageName} — ${monthLabel} ${monthKn} ${monthYear} · Total Cost ${fmtINR(cum.total_cost_with_staff)} (with staff)`}
        tabKey="cost" handlePdf={handlePdf} handleExcel={handleExcel}
        pdfLoading={pdfLoading} excelLoading={excelLoading}
        bg="linear-gradient(135deg,#fff1f2,#ffe4e6)" border="#fda4af" textColor="#9f1239"
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 4 — Income Details (₹) — 13 cols
// ─────────────────────────────────────────────────────────────────────────────
function IncomeSection({ rows, monthKn, monthYear, monthLabel, grainageName,
                         handlePdf, handleExcel, pdfLoading, excelLoading }) {
  const pal = TAB_HUE.emerald;
  const cum = rows.find((r) => String(r.sl_no) === "2") || {};

  return (
    <>
      <div style={{
        background: pal.band, color: "#fff", padding: "16px 22px",
        fontWeight: 800, fontSize: "15px", textAlign: "center",
      }}>
        ಭಾಗ-4 · ಆದಾಯಗಳ ವಿವರಗಳು (ರೂಗಳಲ್ಲಿ)
        <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
          Section-4 · Income (in ₹) &nbsp;·&nbsp; {grainageName} &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
        </div>
      </div>

      <div className="d-flex flex-wrap gap-3" style={{ padding: "16px 22px", background: "#fafdfc", borderBottom: "1px solid #e2e8f0" }}>
        <div style={kpi(pal.soft, pal.border, pal.text)}>
          <span style={kpiLbl(pal.text)}>🥚 ಮೊಟ್ಟೆ ಮೌಲ್ಯ DFL Sales (FY Cum)</span>
          <span className="gf10-num" style={kpiVal(pal.deep, 15)}>{fmtINR(cum.dfl_val_total)}</span>
        </div>
        <div style={kpi(pal.soft, pal.border, pal.text)}>
          <span style={kpiLbl(pal.text)}>🪺 ಗೂಡಿನ ಮೌಲ್ಯ Cocoon Sales (FY Cum)</span>
          <span className="gf10-num" style={kpiVal(pal.deep, 15)}>{fmtINR(cum.coc_val_total)}</span>
        </div>
        <div style={kpi(pal.soft, pal.border, pal.text)}>
          <span style={kpiLbl(pal.text)}>👤 ವ್ಯಕ್ತಿಗತ Personal</span>
          <span className="gf10-num" style={kpiVal(pal.deep, 15)}>{fmtINR(cum.personal_share)}</span>
        </div>
        <div style={kpi("#fde68a", "#fcd34d", "#78350f")}>
          <span style={kpiLbl("#78350f")}>Σ ಒಟ್ಟು Grand Total</span>
          <span className="gf10-num" style={kpiVal("#78350f", 16)}>{fmtINR(cum.grand_total)}</span>
        </div>
      </div>

      <div className="gf10-scroll" style={{ overflowX: "auto" }}>
        <table className="gf10-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1500px" }}>
          <thead>
            <tr>
              <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl</div>
              </th>
              <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "120px", true, "left")}>
                <div style={{ fontSize: "12px" }}>ಸಾಲು</div><div style={hdrEn}>Row</div>
              </th>
              <th colSpan={3} style={hdr("linear-gradient(135deg,#0f766e,#14b8a6)")}>
                <div style={{ fontSize: "12px" }}>🥚 ಮೊಟ್ಟೆಗಳ ಮೌಲ್ಯ</div>
                <div style={hdrEn}>DFL Sales Value ₹</div>
              </th>
              <th colSpan={3} style={hdr("linear-gradient(135deg,#b45309,#d97706)")}>
                <div style={{ fontSize: "12px" }}>🪺 ಬಿತ್ತನೆ ಗೂಡಿನ ಮೌಲ್ಯ</div>
                <div style={hdrEn}>Cocoon Sales Value ₹</div>
              </th>
              <th colSpan={2} style={hdr("linear-gradient(135deg,#5b21b6,#7c3aed)")}>
                <div style={{ fontSize: "12px" }}>🩺 ಡಿ.ಸಿ.ಬಿ ವೆಚ್ಚ</div>
                <div style={hdrEn}>DCB Cost ₹</div>
              </th>
              <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e40af,#3b82f6)", "115px", true)}>
                <div style={{ fontSize: "11.5px" }}>ವ್ಯಕ್ತಿಗತ</div><div style={hdrEn}>Personal ₹</div>
              </th>
              <th rowSpan={2} style={hdr("linear-gradient(135deg,#475569,#64748b)", "100px", true)}>
                <div style={{ fontSize: "11.5px" }}>ಇತರೆ</div><div style={hdrEn}>Others ₹</div>
              </th>
              <th rowSpan={2} style={hdr("linear-gradient(135deg,#9f1239,#e11d48)", "150px", true)}>
                <div style={{ fontSize: "12px" }}>Σ ಒಟ್ಟು</div><div style={hdrEn}>Grand Total ₹</div>
              </th>
            </tr>
            <tr>
              <th style={subhdr("linear-gradient(135deg,#a7f3d0,#6ee7b7)", "#064e3b")}>
                <div style={{ fontSize: "10px" }}>ದ್ವಿತಳಿ</div><div style={subhdrEn}>BV</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#99f6e4,#5eead4)", "#134e4a")}>
                <div style={{ fontSize: "10px" }}>ಮಿಶ್ರತಳಿ</div><div style={subhdrEn}>CB</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#5eead4,#2dd4bf)", "#0f766e")}>
                <div style={{ fontSize: "10px" }}>ಒಟ್ಟು</div><div style={subhdrEn}>Total</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
                <div style={{ fontSize: "10px" }}>ದ್ವಿತಳಿ</div><div style={subhdrEn}>BV</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
                <div style={{ fontSize: "10px" }}>ಮಿಶ್ರತಳಿ</div><div style={subhdrEn}>CB</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#fdba74,#f59e0b)", "#7c2d12")}>
                <div style={{ fontSize: "10px" }}>ಒಟ್ಟು</div><div style={subhdrEn}>Total</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                <div style={{ fontSize: "10px" }}>ದ್ವಿತಳಿ</div><div style={subhdrEn}>BV</div>
              </th>
              <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                <div style={{ fontSize: "10px" }}>ಮಿಶ್ರತಳಿ</div><div style={subhdrEn}>CB</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={13} style={{ padding: "60px 20px", textAlign: "center", background: "#fff" }}>
                <div style={{ fontSize: "40px", marginBottom: "8px" }}>💰</div>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#065f46", marginBottom: "4px" }}>ಯಾವುದೇ ಆದಾಯ ಮಾಹಿತಿ ಇಲ್ಲ</div>
                <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No income data found.</div>
              </td></tr>
            )}
            {rows.map((row, ri) => {
              const isCum = String(row.sl_no) === "2";
              const rowBg = isCum ? "linear-gradient(135deg,#fef3c7,#fde68a)" : "#ffffff";
              const meta = isCum
                ? { icon: "Σ", label: "ಮಾಸಾಂತ್ಯ", labelEn: "FY Cum", text: "#78350f", chipBg: "linear-gradient(135deg,#fcd34d,#fbbf24)" }
                : { icon: "📅", label: "ತಿಂಗಳ", labelEn: "Month", text: "#064e3b", chipBg: "linear-gradient(135deg,#a7f3d0,#6ee7b7)" };
              return (
                <tr key={ri} className="gf10-tr" style={{ background: rowBg }}>
                  <td style={{
                    padding: "12px 6px", textAlign: "center",
                    borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                    background: meta.chipBg, fontWeight: 800,
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "16px" }}>{meta.icon}</span>
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        minWidth: "24px", height: "24px", borderRadius: "50%",
                        background: "rgba(255,255,255,.92)",
                        color: meta.text, fontWeight: 800, fontSize: "11.5px",
                      }}>{row.sl_no}</span>
                    </div>
                  </td>
                  <td style={{
                    padding: "12px 14px", textAlign: "left",
                    borderBottom: "1px solid #e2e8f0", borderRight: "2px solid #e2e8f0",
                    color: meta.text, fontWeight: 800, fontSize: "13px",
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                      <span>{row.row_label || meta.label}</span>
                      <span style={{ fontSize: "10.5px", fontWeight: 700, opacity: .8 }}>{meta.labelEn}</span>
                    </div>
                  </td>
                  <ValCellINR v={row.dfl_val_bv}    color="#064e3b" bg="#ecfdf5" />
                  <ValCellINR v={row.dfl_val_cb}    color="#134e4a" bg="#f0fdfa" />
                  <ValCellINR v={row.dfl_val_total} color="#0f766e" bg="linear-gradient(135deg,#ccfbf1,#99f6e4)" weight={800} right="2px solid #e2e8f0" />
                  <ValCellINR v={row.coc_val_bv}    color="#7c2d12" bg="#fff7ed" />
                  <ValCellINR v={row.coc_val_cb}    color="#7c2d12" bg="#fff7ed" />
                  <ValCellINR v={row.coc_val_total} color="#7c2d12" bg="linear-gradient(135deg,#fed7aa,#fdba74)" weight={800} right="2px solid #e2e8f0" />
                  <ValCellINR v={row.dcb_bv}        color="#4c1d95" bg="#f5f3ff" />
                  <ValCellINR v={row.dcb_cb}        color="#4c1d95" bg="#f5f3ff" right="2px solid #e2e8f0" />
                  <ValCellINR v={row.personal_share} color="#1e3a8a" bg="#eff6ff" />
                  <ValCellINR v={row.others}         color="#334155" bg="#f8fafc" />
                  <ValCellINR v={row.grand_total}    color="#881337" bg="linear-gradient(135deg,#fcd34d,#fbbf24)" weight={800} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ActionFooter
        text={`Section-4 · ${grainageName} — ${monthLabel} ${monthKn} ${monthYear} · Grand Total ${fmtINR(cum.grand_total)} (FY Cum)`}
        tabKey="income" handlePdf={handlePdf} handleExcel={handleExcel}
        pdfLoading={pdfLoading} excelLoading={excelLoading}
        bg="linear-gradient(135deg,#ecfdf5,#f0fdf4)" border="#86efac" textColor="#065f46"
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable bits
// ─────────────────────────────────────────────────────────────────────────────
function ValCell({ v, color, bg, weight, right }) {
  const s = String(v ?? "").trim();
  const empty = s === "";
  const n = numOrZero(v);
  const isZero = !empty && n === 0;
  const display = empty ? "—" : fmt(v);
  return (
    <td className="gf10-num" style={{
      padding: "12px 10px", textAlign: "right",
      borderBottom: "1px solid #f1f5f9",
      borderRight: right || "1px solid #f8fafc",
      background: empty || isZero ? "transparent" : bg,
      color: empty || isZero ? "#cbd5e0" : color,
      fontWeight: weight || 700,
      fontSize: "12.5px",
    }}>{display}</td>
  );
}

function ValCellINR({ v, color, bg, weight, right }) {
  const s = String(v ?? "").trim();
  const empty = s === "";
  const n = numOrZero(v);
  const isZero = !empty && n === 0;
  const display = empty ? "—" : fmtINR(v);
  return (
    <td className="gf10-num" style={{
      padding: "12px 10px", textAlign: "right",
      borderBottom: "1px solid #f1f5f9",
      borderRight: right || "1px solid #f8fafc",
      background: empty || isZero ? "transparent" : bg,
      color: empty || isZero ? "#cbd5e0" : color,
      fontWeight: weight || 700,
      fontSize: "12.5px",
    }}>{display}</td>
  );
}

function ActionFooter({ text, tabKey, handlePdf, handleExcel, pdfLoading, excelLoading,
                        bg, border, textColor }) {
  return (
    <div style={{ background: bg, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: `1.5px solid ${border}` }}>
      <span style={{ fontSize: "12px", color: textColor, fontWeight: 600 }}>
        {text}
      </span>
      <div className="d-flex gap-2 flex-wrap">
        <button type="button" onClick={() => handlePdf(tabKey)} disabled={pdfLoading} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 2px 8px rgba(185,28,28,.25)", pdfLoading)}>
          {pdfLoading ? <><span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} /> Generating…</> : <>📄 Download Section PDF</>}
        </button>
        <button type="button" onClick={() => handleExcel(tabKey)} disabled={excelLoading} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 2px 8px rgba(21,128,61,.25)", excelLoading)}>
          {excelLoading ? <><span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} /> Exporting…</> : <>📊 Download Section Excel</>}
        </button>
      </div>
    </div>
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
  padding: "7px 5px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
  minWidth: "85px",
});

export default GrainageForm10ProductionReport;
