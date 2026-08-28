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

// Column groups: first 3 are common, then alternating Month/Cumulative pairs.
const COLS = [
  { key: "sl_no",             kn: "ಕ್ರ.ಸಂ",                      en: "Sl.No",         group: "sn",  minW: 60  },
  { key: "month_year",        kn: "ಮಾಹೆ-ವರ್ಷ",                    en: "Month-Year",    group: "sn",  minW: 110 },
  { key: "farm_area",         kn: "ಕ್ಷೇತ್ರ ವಿಸ್ತೀರ್ಣ",            en: "Farm Area",     group: "sn",  minW: 100 },
  { key: "chawki_eggs_m",     kn: "ಚಾಕಿ ಮೊಟ್ಟೆ",                   en: "Chawki Eggs",   group: "m",   minW: 105 },
  { key: "chawki_eggs_c",     kn: "ಚಾಕಿ ಮೊಟ್ಟೆ",                   en: "Chawki Eggs",   group: "c",   minW: 105 },
  { key: "low_yield_eggs_m",  kn: "ಕಡಿಮೆ ಇಳುವರಿ ಮೊಟ್ಟೆ",         en: "Low-Yield Eggs", group: "m",  minW: 115 },
  { key: "low_yield_eggs_c",  kn: "ಕಡಿಮೆ ಇಳುವರಿ ಮೊಟ್ಟೆ",         en: "Low-Yield Eggs", group: "c",  minW: 115 },
  { key: "failed_eggs_m",     kn: "ವಿಫಲ ಮೊಟ್ಟೆ",                  en: "Failed Eggs",   group: "m",   minW: 105 },
  { key: "failed_eggs_c",     kn: "ವಿಫಲ ಮೊಟ್ಟೆ",                  en: "Failed Eggs",   group: "c",   minW: 105 },
  { key: "harvested_eggs_m",  kn: "ಕಟಾವು ಮೊಟ್ಟೆ",                en: "Harvested",     group: "m",   minW: 105 },
  { key: "harvested_eggs_c",  kn: "ಕಟಾವು ಮೊಟ್ಟೆ",                en: "Harvested",     group: "c",   minW: 105 },
  { key: "cocoon_grown_no_m", kn: "ಗೂಡು ಸಂಖ್ಯೆ",                  en: "Cocoons (#)",   group: "m",   minW: 105 },
  { key: "cocoon_grown_wt_m", kn: "ಗೂಡು ತೂಕ",                     en: "Cocoons (kg)",  group: "m",   minW: 105 },
  { key: "cocoon_grown_no_c", kn: "ಗೂಡು ಸಂಖ್ಯೆ",                  en: "Cocoons (#)",   group: "c",   minW: 105 },
  { key: "cocoon_grown_wt_c", kn: "ಗೂಡು ತೂಕ",                     en: "Cocoons (kg)",  group: "c",   minW: 105 },
  { key: "yield_100_no_m",    kn: "100 ಮೊಟ್ಟೆ ಇಳುವರಿ (ಸಂ)",       en: "Yield/100 (#)", group: "m",   minW: 115 },
  { key: "yield_100_wt_m",    kn: "100 ಮೊಟ್ಟೆ ಇಳುವರಿ (ತೂಕ)",      en: "Yield/100 (kg)", group: "m",  minW: 115 },
  { key: "yield_100_no_c",    kn: "100 ಮೊಟ್ಟೆ ಇಳುವರಿ (ಸಂ)",       en: "Yield/100 (#)", group: "c",   minW: 115 },
];

if (!document.getElementById("p3s4-styles")) {
  const s = document.createElement("style");
  s.id = "p3s4-styles";
  s.innerHTML = `
    .p3s4-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .p3s4-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .p3s4-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes p3s4-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .p3s4-wrap { animation: p3s4-in .35s ease; }
    .p3s4-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .p3s4-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .p3s4-scroll::-webkit-scrollbar { height:9px; }
    .p3s4-scroll::-webkit-scrollbar-track { background:#fff1f2; border-radius:6px; }
    .p3s4-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#9f1239,#be123c); border-radius:6px; }
  `;
  document.head.appendChild(s);
}

const sel = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "7px 11px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
const btn = (bg, shadow, disabled) => ({ background: disabled ? "#c8d6e5" : bg, border: "none", borderRadius: "9px", padding: "8px 18px", fontWeight: 700, fontSize: "13px", color: "#fff", cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : shadow, display: "flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap" });
const farmSelectStyles = {
  control: (base, state) => ({ ...base, borderRadius: "8px", border: state.isFocused ? "1.5px solid #be123c" : "1.5px solid #d0d9e8", background: "#fff1f2", minHeight: "38px", fontSize: "13px", boxShadow: state.isFocused ? "0 0 0 2px rgba(190,18,60,.18)" : "none", "&:hover": { border: "1.5px solid #be123c" } }),
  valueContainer: (b) => ({ ...b, padding: "2px 9px" }),
  placeholder: (b) => ({ ...b, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (b) => ({ ...b, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (b) => ({ ...b, color: "#be123c" }),
  menu: (b) => ({ ...b, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(190,18,60,.18)" }),
  menuPortal: (b) => ({ ...b, zIndex: 9999 }),
  menuList: (b) => ({ ...b, padding: 0, maxHeight: "260px" }),
  option: (b, s) => ({ ...b, fontSize: "13px", padding: "8px 12px", background: s.isSelected ? "linear-gradient(135deg,#be123c,#e11d48)" : s.isFocused ? "#ffe4e6" : "#fff", color: s.isSelected ? "#fff" : "#0f172a", cursor: "pointer" }),
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

function P3FarmSheet4ProductionTargetReport() {
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
  const showWarn = (msg) => Swal.fire({ icon: "warning", title: t("Required Fields", { ns: "reports" }), html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;color:#78350f">${msg}</div></div>`, confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706", customClass: { popup: "p3s4-swal" } });
  const showErr = (title, msg) => Swal.fire({ icon: "error", title, html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;color:#9b2c2c">${msg}</div></div>`, confirmButtonText: t("Close", { ns: "reports" }), confirmButtonColor: "#e53e3e", customClass: { popup: "p3s4-swal" } });

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
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet4", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the Sheet-4 Production Target report.", { ns: "reports" }));
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet4/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); }
    finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet4/excel", { params: params(), responseType: "blob" });
      const p = params();
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url; a.download = `p3_farm_sheet4_${p.farmId}_${p.year}_${p.month}.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const farmName     = selectedFarm?.farmName || "—";
  const monthNum     = Number(filter.month);
  const monthKn      = MONTH_KN[monthNum] || "";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear    = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);

  // Backend currently returns blank for yield_100_no_m / yield_100_wt_m / yield_100_no_c,
  // so we compute the yield per-100-DFLs client-side: cocoons / chawki * 100.
  const kpis = useMemo(() => {
    const r0 = dataRows[0] || {};
    const chawkiM = numOrZero(r0.chawki_eggs_m);
    const chawkiC = numOrZero(r0.chawki_eggs_c);
    const cocM    = numOrZero(r0.cocoon_grown_no_m);
    const cocC    = numOrZero(r0.cocoon_grown_no_c);
    const cocWtM  = numOrZero(r0.cocoon_grown_wt_m);
    const cocWtC  = numOrZero(r0.cocoon_grown_wt_c);
    const yldM    = chawkiM > 0 ? (cocM / chawkiM) * 100 : 0;
    const yldC    = chawkiC > 0 ? (cocC / chawkiC) * 100 : 0;
    const yldWtM  = chawkiM > 0 ? (cocWtM / chawkiM) * 100 : 0;
    return { chawkiM, chawkiC, cocM, cocC, cocWtM, cocWtC, yldM, yldC, yldWtM };
  }, [dataRows]);

  // Build a 3-band header (Common | Month | Cumulative) by spanning groups.
  const groupSpans = useMemo(() => {
    const out = [];
    let i = 0;
    while (i < COLS.length) {
      const g = COLS[i].group;
      let j = i;
      while (j < COLS.length && COLS[j].group === g) j++;
      out.push({ group: g, span: j - i });
      i = j;
    }
    return out;
  }, []);

  return (
    <Layout title={t("Sheet-4 · P3 Farm Production Target (Form 27)", { ns: "reports" })}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ಪ್ರಪತ್ರ 4 · ಬಿತ್ತನೆ ಗೂಡುಗಳ ಉತ್ಪಾದನಾ ಗುರಿ — ನಮೂನೆ 27")}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#ffe4e6,#fecdd3)", color: "#9f1239", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #fda4af", verticalAlign: "middle" }}>P3 Farms · Bivoltine · Sheet-4 · Form 27</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(190,18,60,.12)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#881337 0%,#9f1239 50%,#be123c 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🎯</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಪ್ರಪತ್ರ 4 — ಬಿತ್ತನೆ ಗೂಡುಗಳ ಉತ್ಪಾದನಾ ಗುರಿ (ನಮೂನೆ 27)
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Sheet-4</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P3 Farms (Bivoltine) — monthly &amp; FY-cumulative target vs achievement · chawki, cocoons, yield</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={chip}>{farmName}</span>
                <span style={chip}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
              </div>
            )}
          </div>
          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#fff1f2)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>{t("Farm", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={farmList.map((f) => ({ value: String(f.farmId), label: f.farmName }))}
                    placeholder={t("— Search Farm —", { ns: "reports" })} isSearchable isClearable
                    menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed"
                    styles={farmSelectStyles}
                    value={farmList.map((f) => ({ value: String(f.farmId), label: f.farmName })).find((o) => o.value === String(filter.farmId)) || null}
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
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#9f1239,#be123c)", "0 4px 12px rgba(190,18,60,.32)", isLoading)}>
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
          <div className="p3s4-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpiBox("#ffe4e6", "#fda4af")}><span style={kpiLbl("#9f1239")}>{t("Farm", { ns: "reports" })}</span><span style={kpiVal("#881337", 14, 800)}>{farmName}</span></div>
              <div style={kpiBox("#fecdd3", "#fda4af")}><span style={kpiLbl("#9f1239")}>{t("Period", { ns: "reports" })}</span><span style={kpiVal("#881337", 13.5, 700)}>{monthLabel} {monthKn} {monthYear || ""}</span></div>
              <div style={kpiBox("#ddd6fe", "#c4b5fd")}><span style={kpiLbl("#5b21b6")}>🥚 {t("Chawki (Mon)", { ns: "reports" })}</span><span className="p3s4-num" style={kpiVal("#4c1d95", 16, 800)}>{kpis.chawkiM.toLocaleString()}</span><span style={{ fontSize: "10.5px", color: "#6d28d9", fontWeight: 700 }}>FY Cum: {kpis.chawkiC.toLocaleString()}</span></div>
              <div style={kpiBox("#fed7aa", "#fdba74")}><span style={kpiLbl("#7c2d12")}>🪺 {t("Cocoons (Mon)", { ns: "reports" })}</span><span className="p3s4-num" style={kpiVal("#7c2d12", 16, 800)}>{kpis.cocM.toLocaleString()}</span><span style={{ fontSize: "10.5px", color: "#9a3412", fontWeight: 700 }}>{kpis.cocWtM.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg</span></div>
              <div style={kpiBox("#a7f3d0", "#6ee7b7")}><span style={kpiLbl("#065f46")}>🪺 {t("Cocoons (FY Cum)", { ns: "reports" })}</span><span className="p3s4-num" style={kpiVal("#064e3b", 16, 800)}>{kpis.cocC.toLocaleString()}</span><span style={{ fontSize: "10.5px", color: "#065f46", fontWeight: 700 }}>{kpis.cocWtC.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg</span></div>
              <div style={kpiBox("#bfdbfe", "#93c5fd")}><span style={kpiLbl("#1e40af")}>📊 {t("Yield/100 DFLs (Mon)", { ns: "reports" })}</span><span className="p3s4-num" style={kpiVal("#1e3a8a", 18, 800)}>{kpis.yldM.toFixed(2)}</span><span style={{ fontSize: "10.5px", color: "#1e40af", fontWeight: 700 }}>FY Cum {kpis.yldC.toFixed(2)} · ⌀ wt {kpis.yldWtM.toFixed(2)} kg</span></div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(190,18,60,.14)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#881337,#9f1239 50%,#be123c)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ಪ್ರಪತ್ರ 4 · ನಮೂನೆ 27 · ಬಿತ್ತನೆ ಗೂಡುಗಳ ಉತ್ಪಾದನಾ ಗುರಿ · {farmName}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>Form 27 · Production Target · {monthLabel} {monthYear} · Month + FY Cumulative</div>
              </div>
              <div className="p3s4-scroll" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "2100px" }}>
                  <thead>
                    <tr>
                      {groupSpans.map((g, i) => {
                        const label = g.group === "sn" ? "ಸಾಮಾನ್ಯ / Common" : g.group === "m" ? `${monthKn || monthLabel} ${monthYear || ""} · This Month` : `FY ${fyStartYear}-${String((fyStartYear + 1) % 100).padStart(2, "0")} Cumulative`;
                        return (
                          <th key={i} colSpan={g.span} style={hdrBand(g.group)}>{label}</th>
                        );
                      })}
                    </tr>
                    <tr>
                      {COLS.map((c, i) => (
                        <th key={c.key} style={hdr(c.group, c.minW, i === 0)}>
                          <div style={{ fontSize: "11.5px" }}>{c.kn}</div>
                          <div style={hdrEn}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={COLS.length} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#fff1f2,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🎯</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#9f1239", marginBottom: "4px" }}>ಯಾವುದೇ ಉತ್ಪಾದನಾ ಗುರಿ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No production target data found for this farm in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {dataRows.map((row, ri) => (
                      <tr key={ri} className="p3s4-tr" style={{ background: ri % 2 === 1 ? "#fff1f2" : "#fff" }}>
                        {COLS.map((c, ci) => {
                          const v = row[c.key];
                          const empty = isEmpty(v);
                          const isNum = ci > 2;
                          const bg = empty ? "transparent"
                            : c.group === "sn" ? "linear-gradient(135deg,#ffe4e6,#fecdd3)"
                            : c.group === "m"  ? "linear-gradient(135deg,#fff7ed,#fed7aa)"
                            : "linear-gradient(135deg,#ecfdf5,#a7f3d0)";
                          const color = empty ? "#cbd5e0" : c.group === "sn" ? "#9f1239" : c.group === "m" ? "#7c2d12" : "#065f46";
                          return (
                            <td key={c.key} className={isNum ? "p3s4-num" : ""} style={td(
                              ci === 0 ? "center" : isNum ? "right" : "left",
                              color, ci === 0 ? 800 : 700, bg,
                            )}>
                              {empty ? "—" : fmt(v)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fff1f2,#ffe4e6)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #fda4af" }}>
                <span style={{ fontSize: "12px", color: "#9f1239", fontWeight: 600 }}>
                  Sheet-4 · {farmName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; 🥚 Mon {kpis.chawkiM.toLocaleString()} / Cum {kpis.chawkiC.toLocaleString()} &nbsp;·&nbsp; 🪺 Mon {kpis.cocM.toLocaleString()} / Cum {kpis.cocC.toLocaleString()} &nbsp;·&nbsp; Yield/100 DFLs: {kpis.yldM.toFixed(2)} (Mon, computed)
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
const hdrBand = (group) => ({
  background: group === "sn" ? "linear-gradient(135deg,#1e293b,#36506b)"
             : group === "m"  ? "linear-gradient(135deg,#7c2d12,#9a3412)"
             : "linear-gradient(135deg,#064e3b,#047857)",
  color: "#fff", padding: "10px 8px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, fontSize: "11.5px",
});
const hdr = (group, minW, isFirst) => ({
  background: isFirst ? "linear-gradient(135deg,#334155,#475569)"
             : group === "sn" ? "linear-gradient(135deg,#475569,#64748b)"
             : group === "m"  ? "linear-gradient(135deg,#b45309,#d97706)"
             : "linear-gradient(135deg,#047857,#10b981)",
  color: "#fff", padding: "9px 6px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: `${minW}px`,
});
const td = (align, color, weight, bg) => ({ padding: "9px 10px", textAlign: align || "center", borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc", background: bg || "transparent", color: color || "#0f172a", fontWeight: weight || 600, fontSize: "12.5px" });

export default P3FarmSheet4ProductionTargetReport;
