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

const COLS = [
  { key: "sl_no",             kn: "ಕ್ರ.ಸಂ",                              en: "Sl.No",            minW: 60  },
  { key: "crop_number",       kn: "ಬೆಳೆ ಸಂಖ್ಯೆ",                          en: "Crop No.",         minW: 90  },
  { key: "breed",             kn: "ತಳಿ",                                    en: "Breed",            minW: 130 },
  { key: "source",            kn: "ಮೂಲ",                                    en: "Source",           minW: 130 },
  { key: "batch_number",      kn: "ತಂಡದ ಸಂಖ್ಯೆ",                           en: "Batch No.",        minW: 110 },
  { key: "chawki_eggs",       kn: "ಚಾಕಿ ಮಾಡಿದ ಮೊಟ್ಟೆಗಳ ಸಂಖ್ಯೆ",          en: "Chawki Eggs",      minW: 120 },
  { key: "avg_loose_eggs",    kn: "ಸರಾಸರಿ ಬಿಡಿ ಮೊಟ್ಟೆಗಳ ಸಂಖ್ಯೆ",        en: "Avg Loose Eggs",   minW: 130 },
  { key: "chawki_percentage", kn: "ಶೇಕಡ ಚಾಕಿ ಪ್ರಮಾಣ",                     en: "Chawki %",         minW: 105, isPct: true },
  { key: "cocoons_number",    kn: "ಉತ್ಪಾದಿಸಿದ ಗೂಡು (ಸಂಖ್ಯೆ)",            en: "Cocoons (#)",      minW: 120 },
  { key: "cocoons_weight",    kn: "ಉತ್ಪಾದಿಸಿದ ಗೂಡು (ತೂಕ)",               en: "Cocoons (kg)",     minW: 120 },
  { key: "yield_per_100_no",  kn: "100 ಮೊಟ್ಟೆಗಳ ಸರಾಸರಿ ಇಳುವರಿ (ಸಂಖ್ಯೆ)", en: "Yield/100 (#)",    minW: 135 },
  { key: "yield_per_100_wt",  kn: "100 ಮೊಟ್ಟೆಗಳ ಸರಾಸರಿ ಇಳುವರಿ (ತೂಕ)",   en: "Yield/100 (kg)",   minW: 135 },
  { key: "seed_centre",       kn: "ಬಿತ್ತನೆಕೋಪಿ ಹೆಸರು",                     en: "Seed Centre",      minW: 140 },
  { key: "avg_cocoon_no",     kn: "ಗೂಡಿನ ಸರಾಸರಿ (ಸಂಖ್ಯೆ)",                en: "Avg Cocoon (#)",   minW: 115 },
  { key: "avg_cocoon_wt",     kn: "ಗೂಡಿನ ಸರಾಸರಿ (ತೂಕ)",                  en: "Avg Cocoon (kg)",  minW: 115 },
];

if (!document.getElementById("p3s1-styles")) {
  const s = document.createElement("style");
  s.id = "p3s1-styles";
  s.innerHTML = `
    .p3s1-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .p3s1-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .p3s1-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes p3s1-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .p3s1-wrap { animation: p3s1-in .35s ease; }
    .p3s1-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .p3s1-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .p3s1-scroll::-webkit-scrollbar { height:9px; }
    .p3s1-scroll::-webkit-scrollbar-track { background:#eef2ff; border-radius:6px; }
    .p3s1-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#3730a3,#1e40af); border-radius:6px; }
  `;
  document.head.appendChild(s);
}

const sel = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "7px 11px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
const btn = (bg, shadow, disabled) => ({
  background: disabled ? "#c8d6e5" : bg, border: "none", borderRadius: "9px", padding: "8px 18px",
  fontWeight: 700, fontSize: "13px", color: "#fff",
  cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : shadow,
  display: "flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap",
});

const farmSelectStyles = {
  control: (base, state) => ({
    ...base, borderRadius: "8px",
    border: state.isFocused ? "1.5px solid #3730a3" : "1.5px solid #d0d9e8",
    background: "#eef2ff", minHeight: "38px", fontSize: "13px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(55,48,163,.18)" : "none",
    "&:hover": { border: "1.5px solid #3730a3" },
  }),
  valueContainer: (b) => ({ ...b, padding: "2px 9px" }),
  placeholder: (b) => ({ ...b, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (b) => ({ ...b, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (b) => ({ ...b, color: "#3730a3" }),
  menu: (b) => ({ ...b, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(55,48,163,.18)" }),
  menuPortal: (b) => ({ ...b, zIndex: 9999 }),
  menuList: (b) => ({ ...b, padding: 0, maxHeight: "260px" }),
  option: (b, s) => ({
    ...b, fontSize: "13px", padding: "8px 12px",
    background: s.isSelected ? "linear-gradient(135deg,#3730a3,#4f46e5)" : s.isFocused ? "#e0e7ff" : "#fff",
    color: s.isSelected ? "#fff" : "#0f172a", cursor: "pointer",
  }),
};

const numOrZero = (v) => { const n = parseFloat(String(v ?? "").replace(/[^\d.\-]/g, "")); return isNaN(n) ? 0 : n; };
const fmt = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "";
  const n = parseFloat(s.replace(/,/g, ""));
  if (isNaN(n)) return s;
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};
const isEmpty = (v) => { const s = String(v ?? "").trim(); return s === "" || s === "0"; };

function P3FarmSheet1MonthlyProgressReport() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState({ farmId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);
  const [farmList,          setFarmList]          = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  const extractYear = (str) => { if (!str) return null; const y = parseInt(String(str).trim().split("-")[0], 10); return isNaN(y) ? null : y; };

  useEffect(() => {
    api.get(baseURL + "farmMaster/get-all").then((r) => setFarmList(r.data.content.farmMaster || [])).catch(() => setFarmList([]));
    api.get(baseURL + "financialYearMaster/get-all").then((r) => setFinancialYearList(r.data.content.financialYearMaster || [])).catch(() => setFinancialYearList([]));
    api.get(baseURL + "financialYearMaster/get-is-default").then((r) => {
      const fy = r.data.content;
      if (fy) { setFilter((p) => ({ ...p, financialYearMasterId: fy.financialYearMasterId })); setFyStartYear(extractYear(fy.financialYear)); }
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((p) => ({ ...p, [name]: value })); setHasReport(false); setDataRows([]);
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
  const showWarn = (msg) => Swal.fire({ icon: "warning", title: t("Required Fields", { ns: "reports" }),
    html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;color:#78350f">${msg}</div></div>`,
    confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706", customClass: { popup: "p3s1-swal" } });
  const showErr = (title, msg) => Swal.fire({ icon: "error", title,
    html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;color:#9b2c2c">${msg}</div></div>`,
    confirmButtonText: t("Close", { ns: "reports" }), confirmButtonColor: "#e53e3e", customClass: { popup: "p3s1-swal" } });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { farmId: filter.farmId, year, month: m };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet1", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []); setHasReport(true);
    } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          showErr(t("No Data Found", { ns: "reports" }), t("No data found for the selected filters.", { ns: "reports" }));
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the Sheet-1 Monthly Progress report.", { ns: "reports" }));
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet1/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); }
    finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet1/excel", { params: params(), responseType: "blob" });
      const p = params();
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url; a.download = `p3_farm_sheet1_${p.farmId}_${p.year}_${p.month}.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const farmName     = (i18n.language === "kn" ? (selectedFarm?.farmNameInKannada || selectedFarm?.farmName) : selectedFarm?.farmName) || "—";
  const monthNum     = Number(filter.month);
  const monthKn      = MONTH_KN[monthNum] || "";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear    = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);

  const kpis = useMemo(() => {
    const totalChawki  = dataRows.reduce((s, r) => s + numOrZero(r.chawki_eggs), 0);
    const totalCoc     = dataRows.reduce((s, r) => s + numOrZero(r.cocoons_number), 0);
    const totalCocWt   = dataRows.reduce((s, r) => s + numOrZero(r.cocoons_weight), 0);
    const avgChawkiPct = dataRows.length ? dataRows.reduce((s, r) => s + numOrZero(r.chawki_percentage), 0) / dataRows.length : 0;
    return { totalChawki, totalCoc, totalCocWt, avgChawkiPct, count: dataRows.length };
  }, [dataRows]);

  return (
    <Layout title={t("Sheet-1 · P3 Farm Monthly Progress (Form F-2)", { ns: "reports" })}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ಪ್ರಪತ್ರ 1 · ಮಾಸಿಕ ಪ್ರಗತಿ ವರದಿ — ನಮೂನೆ ಎಫ್-2")}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#e0e7ff,#c7d2fe)", color: "#3730a3", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #a5b4fc", verticalAlign: "middle" }}>P3 Farms · Bivoltine · Sheet-1 · Form F-2</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(55,48,163,.12)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#3730a3 50%,#4f46e5 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>📋</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಪ್ರಪತ್ರ 1 — ಮಾಸಿಕ ಪ್ರಗತಿ ವರದಿ (ನಮೂನೆ-ಎಫ್2)
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Sheet-1</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P3 Farms (Bivoltine) — per-lot monthly progress: breed, source, chawki %, cocoon yield</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={chip}>{farmName}</span>
                <span style={chip}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
                <span style={chip}>{kpis.count} lots</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#eef2ff)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>{t("Farm")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={farmList.map((f) => ({ value: String(f.farmId), label: i18n.language === "kn" ? (f.farmNameInKannada || f.farmName) : f.farmName }))}
                    placeholder={t("— Search Farm —", { ns: "reports" })} isSearchable isClearable
                    menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed"
                    styles={farmSelectStyles}
                    value={farmList.map((f) => ({ value: String(f.farmId), label: i18n.language === "kn" ? (f.farmNameInKannada || f.farmName) : f.farmName })).find((o) => o.value === String(filter.farmId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, farmId: opt?.value || "" })); setHasReport(false); setDataRows([]); }}
                    noOptionsMessage={() => t("No farm found", { ns: "reports" })}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Financial Year", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Year —", { ns: "reports" })}</option>
                    {financialYearList.map((f) => (<option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">{t("— Month —", { ns: "reports" })}</option>
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#3730a3,#4f46e5)", "0 4px 12px rgba(55,48,163,.32)", isLoading)}>
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

        {hasReport && (
          <div className="p3s1-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpiBox("#e0e7ff", "#a5b4fc")}><span style={kpiLbl("#3730a3")}>{t("Farm")}</span><span style={kpiVal("#1e1b4b", 14, 800)}>{farmName}</span></div>
              <div style={kpiBox("#c7d2fe", "#a5b4fc")}><span style={kpiLbl("#3730a3")}>{t("Period", { ns: "reports" })}</span><span style={kpiVal("#312e81", 13.5, 700)}>{monthLabel} {monthKn} {monthYear || ""}</span></div>
              <div style={kpiBox("#bfdbfe", "#93c5fd")}><span style={kpiLbl("#1e40af")}>🐛 {t("Lots Brushed", { ns: "reports" })}</span><span className="p3s1-num" style={kpiVal("#1e3a8a", 18, 800)}>{kpis.count.toLocaleString()}</span></div>
              <div style={kpiBox("#ddd6fe", "#c4b5fd")}><span style={kpiLbl("#5b21b6")}>🥚 {t("Chawki Eggs", { ns: "reports" })}</span><span className="p3s1-num" style={kpiVal("#4c1d95", 16, 800)}>{kpis.totalChawki.toLocaleString()}</span></div>
              <div style={kpiBox("#fed7aa", "#fdba74")}><span style={kpiLbl("#7c2d12")}>🪺 {t("Cocoons (#)", { ns: "reports" })}</span><span className="p3s1-num" style={kpiVal("#7c2d12", 16, 800)}>{kpis.totalCoc.toLocaleString()}</span><span style={{ fontSize: "10.5px", color: "#9a3412", fontWeight: 700 }}>{kpis.totalCocWt.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg</span></div>
              <div style={kpiBox("#a7f3d0", "#6ee7b7")}><span style={kpiLbl("#065f46")}>📊 {t("Avg Chawki %", { ns: "reports" })}</span><span className="p3s1-num" style={kpiVal("#064e3b", 18, 800)}>{kpis.avgChawkiPct.toFixed(2)}%</span></div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(55,48,163,.14)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#1e1b4b,#3730a3 50%,#4f46e5)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ಪ್ರಪತ್ರ 1 · ಸರ್ಕಾರಿ ಪಿ3 ರೇಷ್ಮೆ ಕೃಷಿ ಕ್ಷೇತ್ರ {farmName} · {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Form F-2 · Monthly Progress · {monthLabel} {monthYear}
                </div>
              </div>
              <div className="p3s1-scroll" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1750px" }}>
                  <thead>
                    <tr>
                      {COLS.map((c, i) => (
                        <th key={c.key} style={hdr(i === 0 ? "linear-gradient(135deg,#1e293b,#36506b)" : i < COLS.length / 2 + 1 ? "linear-gradient(135deg,#3730a3,#4f46e5)" : "linear-gradient(135deg,#4f46e5,#6366f1)", c.minW)}>
                          <div style={{ fontSize: "12px" }}>{c.kn}</div>
                          <div style={hdrEn}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={COLS.length} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#eef2ff,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>📋</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#3730a3", marginBottom: "4px" }}>ಯಾವುದೇ ಮಾಸಿಕ ಪ್ರಗತಿ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No monthly progress data found for this farm in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {dataRows.map((row, ri) => (
                      <tr key={ri} className="p3s1-tr" style={{ background: ri % 2 === 1 ? "#eef2ff" : "#fff" }}>
                        {COLS.map((c, ci) => {
                          const v = row[c.key];
                          const empty = isEmpty(v);
                          // ci 5..11 + 13..14 are numeric; ci 12 (seed_centre) is text
                          const isNum = (ci >= 5 && ci !== 12);
                          return (
                            <td key={c.key} className={isNum ? "p3s1-num" : ""} style={td(
                              ci === 0 ? "center" : isNum ? "right" : "left",
                              empty ? "#cbd5e0" : ci === 0 ? "#3730a3" : "#1e293b",
                              ci === 0 ? 800 : 600,
                              ci === 0 ? "linear-gradient(135deg,#e0e7ff,#c7d2fe)" : empty ? "transparent" : isNum ? "linear-gradient(135deg,#eef2ff,#e0e7ff)" : "transparent",
                            )}>
                              {empty ? "—" : c.isPct ? `${fmt(v)}%` : fmt(v)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ background: "linear-gradient(135deg,#eef2ff,#e0e7ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #a5b4fc" }}>
                <span style={{ fontSize: "12px", color: "#3730a3", fontWeight: 600 }}>
                  Sheet-1 · {farmName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {kpis.count} lots · 🥚 {kpis.totalChawki.toLocaleString()} chawki · 🪺 {kpis.totalCoc.toLocaleString()} cocoons / {kpis.totalCocWt.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg · 📊 {kpis.avgChawkiPct.toFixed(1)}% chawki
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

const chip = { background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 };
const kpiBox = (bgFrom, border) => ({ background: `linear-gradient(135deg,${bgFrom},#ffffff)`, border: `1.5px solid ${border}`, borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" });
const kpiLbl = (color) => ({ fontSize: "11px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" });
const kpiVal = (color, sz, w) => ({ fontSize: `${sz}px`, color, fontWeight: w || 800, marginTop: "2px" });
const hdrEn = { fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" };
const hdr = (bg, minW) => ({ background: bg, color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: `${minW}px` });
const td = (align, color, weight, bg) => ({ padding: "10px 12px", textAlign: align || "center", borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc", background: bg || "transparent", color: color || "#0f172a", fontWeight: weight || 600, fontSize: "12.5px" });

export default P3FarmSheet1MonthlyProgressReport;
