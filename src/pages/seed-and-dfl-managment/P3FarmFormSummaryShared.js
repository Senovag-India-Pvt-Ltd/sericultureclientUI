// Shared component for the 7-column "Form Summary" P3 farm reports
// (Sheets 5, 6, 7, 8) — all return the same shape:
//   serial_number, sub_label, description_kannada, cy_month, cy_cum, py_month, py_cum
//
// Pages pass a `config` describing endpoint + headers + palette; this component
// owns the Farm/FY/Month filter, fetch + PDF/Excel download, KPI strip, and table.
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

export const MONTHS = [
  { value: 1,  label: "January"   }, { value: 2,  label: "February"  },
  { value: 3,  label: "March"     }, { value: 4,  label: "April"     },
  { value: 5,  label: "May"       }, { value: 6,  label: "June"      },
  { value: 7,  label: "July"      }, { value: 8,  label: "August"    },
  { value: 9,  label: "September" }, { value: 10, label: "October"   },
  { value: 11, label: "November"  }, { value: 12, label: "December"  },
];
export const MONTH_KN = [
  "", "ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್",
  "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್",
];

export const sel = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "7px 11px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
export const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
export const btnStyle = (bg, shadow, disabled) => ({
  background: disabled ? "#c8d6e5" : bg, border: "none", borderRadius: "9px", padding: "8px 18px",
  fontWeight: 700, fontSize: "13px", color: "#fff",
  cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : shadow,
  display: "flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap",
});
export const farmSelectStylesFor = (accent, bg, accentHex) => ({
  control: (base, state) => ({ ...base, borderRadius: "8px", border: state.isFocused ? `1.5px solid ${accent}` : "1.5px solid #d0d9e8", background: bg, minHeight: "38px", fontSize: "13px", boxShadow: state.isFocused ? `0 0 0 2px ${accentHex}` : "none", "&:hover": { border: `1.5px solid ${accent}` } }),
  valueContainer: (b) => ({ ...b, padding: "2px 9px" }),
  placeholder: (b) => ({ ...b, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (b) => ({ ...b, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (b) => ({ ...b, color: accent }),
  menu: (b) => ({ ...b, borderRadius: "10px", overflow: "hidden", boxShadow: `0 10px 30px ${accentHex}` }),
  menuPortal: (b) => ({ ...b, zIndex: 9999 }),
  menuList: (b) => ({ ...b, padding: 0, maxHeight: "260px" }),
  option: (b, s) => ({ ...b, fontSize: "13px", padding: "8px 12px", background: s.isSelected ? `linear-gradient(135deg,${accent},${accent})` : s.isFocused ? bg : "#fff", color: s.isSelected ? "#fff" : "#0f172a", cursor: "pointer" }),
});

export const numOrZero = (v) => { const n = parseFloat(String(v ?? "").replace(/[^\d.\-]/g, "")); return isNaN(n) ? 0 : n; };
export const fmt = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "";
  const n = parseFloat(s.replace(/,/g, ""));
  if (isNaN(n)) return s;
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};
export const isEmpty = (v) => { const s = String(v ?? "").trim(); return s === "" || s === "0"; };
export const extractYear = (str) => { if (!str) return null; const y = parseInt(String(str).trim().split("-")[0], 10); return isNaN(y) ? null : y; };

// Inject one shared stylesheet for all P3 form-summary pages.
if (typeof document !== "undefined" && !document.getElementById("p3fs-styles")) {
  const s = document.createElement("style");
  s.id = "p3fs-styles";
  s.innerHTML = `
    .p3fs-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .p3fs-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .p3fs-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes p3fs-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .p3fs-wrap { animation: p3fs-in .35s ease; }
    .p3fs-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .p3fs-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .p3fs-scroll::-webkit-scrollbar { height:9px; }
    .p3fs-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .p3fs-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#475569,#1e293b); border-radius:6px; }
  `;
  document.head.appendChild(s);
}

const chip = { background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 };
const kpiBox = (bgFrom, border) => ({ background: `linear-gradient(135deg,${bgFrom},#ffffff)`, border: `1.5px solid ${border}`, borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" });
const kpiLbl = (color) => ({ fontSize: "11px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" });
const kpiVal = (color, sz, w) => ({ fontSize: `${sz}px`, color, fontWeight: w || 800, marginTop: "2px" });

/**
 * @param {object} cfg
 * @param {string} cfg.sheet           - "5" | "6" | "7" | "8"
 * @param {string} cfg.titleKn         - Kannada title
 * @param {string} cfg.titleEn         - English subtitle
 * @param {string} cfg.tagText         - badge text e.g. "Sheet-5 · Crop Part 1"
 * @param {string} cfg.icon            - emoji
 * @param {{primary:string, deep:string, light:string, lightHex:string, ringHex:string, gradientFrom:string, gradientMid:string, gradientTo:string, chipBg:string, chipBorder:string, chipText:string}} cfg.palette
 * @param {string} cfg.endpoint        - relative to baseURLSeedDFL (e.g. "p3-farm/sheet5")
 */
export function P3FarmFormSummaryReport({ cfg }) {
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
    if (!filter.farmId)                return "Please select a Farm.";
    if (!filter.financialYearMasterId) return "Please select a Financial Year.";
    if (!filter.month)                 return "Please select a Month.";
    if (!fyStartYear)                  return "Could not determine the financial year start year.";
    return null;
  };
  const showWarn = (msg) => Swal.fire({ icon: "warning", title: "Required Fields", html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;color:#78350f">${msg}</div></div>`, confirmButtonText: "Got it", confirmButtonColor: "#d97706", customClass: { popup: "p3fs-swal" } });
  const showErr = (title, msg) => Swal.fire({ icon: "error", title, html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;color:#9b2c2c">${msg}</div></div>`, confirmButtonText: "Close", confirmButtonColor: "#e53e3e", customClass: { popup: "p3fs-swal" } });

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
      const res = await api.get(baseURLSeedDFL + cfg.endpoint, { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []); setHasReport(true);
    } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          showErr("No Data Found", "No data found for the selected filters.");
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          showErr("Fetch Failed", backendMsg || err?.message || `Failed to load the Sheet-${cfg.sheet} report.`);
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + cfg.endpoint + "/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + cfg.endpoint + "/excel", { params: params(), responseType: "blob" });
      const p = params();
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url; a.download = `p3_farm_sheet${cfg.sheet}_${p.farmId}_${p.year}_${p.month}.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const farmName     = selectedFarm?.farmName || "—";
  const monthNum     = Number(filter.month);
  const monthKn      = MONTH_KN[monthNum] || "";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear    = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const currFy       = fyStartYear ? `${fyStartYear}-${String((fyStartYear + 1) % 100).padStart(2, "0")}` : "";
  const prevFy       = fyStartYear ? `${fyStartYear - 1}-${String(fyStartYear % 100).padStart(2, "0")}`     : "";

  // Group consecutive rows sharing the same serial_number — first row in the group
  // (sub_label = "") is the section header.
  const sections = useMemo(() => {
    const map = new Map();
    dataRows.forEach((r) => {
      const sn = String(r.serial_number ?? "");
      if (!map.has(sn)) map.set(sn, { sn, header: null, rows: [] });
      const g = map.get(sn);
      const sub = String(r.sub_label ?? "").trim();
      if (sub === "" && !g.header) g.header = r;
      else g.rows.push(r);
    });
    return Array.from(map.values());
  }, [dataRows]);

  const kpis = useMemo(() => {
    const popRows = dataRows.filter((r) => [r.cy_month, r.cy_cum, r.py_month, r.py_cum].some((v) => !isEmpty(v)));
    const totalCyM = dataRows.reduce((s, r) => s + numOrZero(r.cy_month), 0);
    const totalCyC = dataRows.reduce((s, r) => s + numOrZero(r.cy_cum), 0);
    const totalPyM = dataRows.reduce((s, r) => s + numOrZero(r.py_month), 0);
    return { totalCyM, totalCyC, totalPyM, populated: popRows.length, total: dataRows.length };
  }, [dataRows]);

  const completeness = kpis.total === 0 ? 0 : (kpis.populated / kpis.total) * 100;
  const farmSelectStyles = farmSelectStylesFor(cfg.palette.primary, cfg.palette.light, cfg.palette.ringHex);

  return (
    <Layout title={t(`Sheet-${cfg.sheet} · ${cfg.titleEn}`)}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t(cfg.titleKn)}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: cfg.palette.chipBg, color: cfg.palette.chipText, padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: `1px solid ${cfg.palette.chipBorder}`, verticalAlign: "middle" }}>{cfg.tagText}</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: `0 4px 20px ${cfg.palette.ringHex}`, overflow: "hidden" }}>
          <div style={{ background: `linear-gradient(135deg,${cfg.palette.gradientFrom} 0%,${cfg.palette.gradientMid} 50%,${cfg.palette.gradientTo} 100%)`, padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{cfg.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                {cfg.titleKn}
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Sheet-{cfg.sheet}</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>{cfg.descEn}</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={chip}>{farmName}</span>
                <span style={chip}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
                <span style={chip}>{kpis.populated}/{kpis.total} populated</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: `linear-gradient(180deg,#ffffff,${cfg.palette.light})` }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>Farm <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={farmList.map((f) => ({ value: String(f.farmId), label: f.farmName }))}
                    placeholder="— Search Farm —" isSearchable isClearable
                    menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed"
                    styles={farmSelectStyles}
                    value={farmList.map((f) => ({ value: String(f.farmId), label: f.farmName })).find((o) => o.value === String(filter.farmId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, farmId: opt?.value || "" })); setHasReport(false); setDataRows([]); }}
                    noOptionsMessage={() => "No farm found"}
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
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btnStyle(`linear-gradient(135deg,${cfg.palette.primary},${cfg.palette.gradientTo})`, `0 4px 12px ${cfg.palette.ringHex}`, isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btnStyle("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📄 PDF</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btnStyle("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📊 Excel</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="p3fs-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpiBox(cfg.palette.light, cfg.palette.chipBorder)}><span style={kpiLbl(cfg.palette.deep)}>Farm</span><span style={kpiVal(cfg.palette.deep, 14, 800)}>{farmName}</span></div>
              <div style={kpiBox(cfg.palette.light, cfg.palette.chipBorder)}><span style={kpiLbl(cfg.palette.deep)}>Period</span><span style={kpiVal(cfg.palette.deep, 13.5, 700)}>{monthLabel} {monthKn} {monthYear || ""}</span><span style={{ fontSize: "10.5px", color: cfg.palette.deep, fontWeight: 700 }}>FY {currFy} · PY {prevFy}</span></div>
              <div style={kpiBox("#bfdbfe", "#93c5fd")}><span style={kpiLbl("#1e40af")}>📅 CY Month total</span><span className="p3fs-num" style={kpiVal("#1e3a8a", 18, 800)}>{kpis.totalCyM.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span><span style={{ fontSize: "10.5px", color: "#1e40af", fontWeight: 700 }}>FY Cum {kpis.totalCyC.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
              <div style={kpiBox("#ddd6fe", "#c4b5fd")}><span style={kpiLbl("#5b21b6")}>📆 PY Month total</span><span className="p3fs-num" style={kpiVal("#4c1d95", 18, 800)}>{kpis.totalPyM.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
              <div style={kpiBox(
                completeness >= 80 ? "#bbf7d0" : completeness >= 50 ? "#fde68a" : "#fecaca",
                completeness >= 80 ? "#86efac" : completeness >= 50 ? "#fcd34d" : "#fca5a5",
              )}>
                <span style={kpiLbl(completeness >= 80 ? "#14532d" : completeness >= 50 ? "#92400e" : "#7f1d1d")}>📋 Data Completeness</span>
                <span className="p3fs-num" style={kpiVal(completeness >= 80 ? "#14532d" : completeness >= 50 ? "#78350f" : "#7f1d1d", 16, 800)}>{completeness.toFixed(0)}%</span>
                <span style={{ fontSize: "10.5px", color: completeness >= 80 ? "#166534" : completeness >= 50 ? "#92400e" : "#9f1239", fontWeight: 700 }}>{kpis.populated} / {kpis.total} rows</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: `0 6px 28px ${cfg.palette.ringHex}`, overflow: "hidden" }}>
              <div style={{ background: `linear-gradient(135deg,${cfg.palette.gradientFrom},${cfg.palette.gradientMid} 50%,${cfg.palette.gradientTo})`, color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                {cfg.titleKn} · {farmName} · {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  {cfg.titleEn} · CY {currFy} vs PY {prevFy} · {monthLabel}
                </div>
              </div>
              <div className="p3fs-scroll" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "950px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "420px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರಗಳು</div><div style={hdrEn}>Description</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#475569,#64748b)", "85px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಉಪ</div><div style={hdrEn}>Sub</div>
                      </th>
                      <th colSpan={2} style={hdr(`linear-gradient(135deg,${cfg.palette.primary},${cfg.palette.gradientTo})`)}>
                        <div style={{ fontSize: "12.5px" }}>ಪ್ರಸಕ್ತ ವರ್ಷ {currFy}</div>
                        <div style={hdrEn}>Current Year</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#3730a3,#6366f1)")}>
                        <div style={{ fontSize: "12.5px" }}>ಹಿಂದಿನ ವರ್ಷ {prevFy}</div>
                        <div style={hdrEn}>Previous Year</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={subhdr(cfg.palette.subhdrA, cfg.palette.deep)}><div style={{ fontSize: "10.5px" }}>ಮಾಸ</div><div style={subhdrEn}>Month</div></th>
                      <th style={subhdr(cfg.palette.subhdrB, cfg.palette.deep)}><div style={{ fontSize: "10.5px" }}>ಮಾಸಾಂತ್ಯ</div><div style={subhdrEn}>Cumulative</div></th>
                      <th style={subhdr("linear-gradient(135deg,#c7d2fe,#a5b4fc)", "#312e81")}><div style={{ fontSize: "10.5px" }}>ಮಾಸ</div><div style={subhdrEn}>Month</div></th>
                      <th style={subhdr("linear-gradient(135deg,#a5b4fc,#818cf8)", "#3730a3")}><div style={{ fontSize: "10.5px" }}>ಮಾಸಾಂತ್ಯ</div><div style={subhdrEn}>Cumulative</div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.length === 0 && (
                      <tr><td colSpan={7} style={{ padding: "60px 20px", textAlign: "center", background: `linear-gradient(180deg,${cfg.palette.light},#fff)` }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>{cfg.icon}</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: cfg.palette.deep, marginBottom: "4px" }}>ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No data found for {farmName} in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {sections.map((sec) => {
                      const rows = [];
                      // Header row (sub_label blank, may have totals attached)
                      if (sec.header) {
                        const h = sec.header;
                        const headerHasVals = [h.cy_month, h.cy_cum, h.py_month, h.py_cum].some((v) => !isEmpty(v));
                        rows.push(
                          <tr key={`h-${sec.sn}`}>
                            <td style={td("center", cfg.palette.deep, 800, cfg.palette.chipBg)}>{sec.sn}</td>
                            <td style={td("left", cfg.palette.deep, 800, cfg.palette.chipBg)}>{h.description_kannada || "—"}</td>
                            <td style={td("center", "#94a3b8", 600, cfg.palette.chipBg)}>—</td>
                            <td className="p3fs-num" style={td("right", headerHasVals && !isEmpty(h.cy_month) ? cfg.palette.deep : "#cbd5e0", 800, cfg.palette.chipBg)}>{isEmpty(h.cy_month) ? "—" : fmt(h.cy_month)}</td>
                            <td className="p3fs-num" style={td("right", headerHasVals && !isEmpty(h.cy_cum) ? cfg.palette.deep : "#cbd5e0", 800, cfg.palette.chipBg, "2px solid #e2e8f0")}>{isEmpty(h.cy_cum) ? "—" : fmt(h.cy_cum)}</td>
                            <td className="p3fs-num" style={td("right", headerHasVals && !isEmpty(h.py_month) ? "#3730a3" : "#cbd5e0", 800, cfg.palette.chipBg)}>{isEmpty(h.py_month) ? "—" : fmt(h.py_month)}</td>
                            <td className="p3fs-num" style={td("right", headerHasVals && !isEmpty(h.py_cum) ? "#3730a3" : "#cbd5e0", 800, cfg.palette.chipBg)}>{isEmpty(h.py_cum) ? "—" : fmt(h.py_cum)}</td>
                          </tr>
                        );
                      }
                      // Sub-rows
                      sec.rows.forEach((r, ri) => {
                        const muted = ![r.cy_month, r.cy_cum, r.py_month, r.py_cum].some((v) => !isEmpty(v));
                        rows.push(
                          <tr key={`r-${sec.sn}-${ri}`} className="p3fs-tr" style={{ background: ri % 2 === 1 ? cfg.palette.light : "#fff", opacity: muted ? .7 : 1 }}>
                            <td style={td("center", "#94a3b8", 600, "transparent")}></td>
                            <td style={td("left", muted ? "#94a3b8" : "#1c1917", 600, "transparent")}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: cfg.palette.deep, opacity: muted ? .3 : .85 }} />
                                <span>{r.description_kannada || "—"}</span>
                                {muted && (<span style={{ fontSize: "9.5px", fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "2px 7px", borderRadius: "999px", border: "1px solid #cbd5e1", marginLeft: "4px" }}>no data</span>)}
                              </div>
                            </td>
                            <td style={td("center", cfg.palette.deep, 800, "transparent")}>
                              {String(r.sub_label || "").trim()
                                ? <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "999px", background: cfg.palette.chipBg, color: cfg.palette.deep, fontWeight: 800, fontSize: "11px" }}>{r.sub_label}</span>
                                : <span style={{ color: "#cbd5e0", fontSize: "11px" }}>—</span>}
                            </td>
                            <td className="p3fs-num" style={td("right", isEmpty(r.cy_month) ? "#cbd5e0" : cfg.palette.deep, 700, isEmpty(r.cy_month) ? "transparent" : cfg.palette.cellM)}>{isEmpty(r.cy_month) ? "—" : fmt(r.cy_month)}</td>
                            <td className="p3fs-num" style={td("right", isEmpty(r.cy_cum) ? "#cbd5e0" : cfg.palette.deep, 800, isEmpty(r.cy_cum) ? "transparent" : cfg.palette.cellC, "2px solid #e2e8f0")}>{isEmpty(r.cy_cum) ? "—" : fmt(r.cy_cum)}</td>
                            <td className="p3fs-num" style={td("right", isEmpty(r.py_month) ? "#cbd5e0" : "#312e81", 700, isEmpty(r.py_month) ? "transparent" : "linear-gradient(135deg,#eef2ff,#e0e7ff)")}>{isEmpty(r.py_month) ? "—" : fmt(r.py_month)}</td>
                            <td className="p3fs-num" style={td("right", isEmpty(r.py_cum) ? "#cbd5e0" : "#3730a3", 800, isEmpty(r.py_cum) ? "transparent" : "linear-gradient(135deg,#e0e7ff,#c7d2fe)")}>{isEmpty(r.py_cum) ? "—" : fmt(r.py_cum)}</td>
                          </tr>
                        );
                      });
                      return rows;
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ background: `linear-gradient(135deg,${cfg.palette.light},${cfg.palette.chipBg})`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: `1.5px solid ${cfg.palette.chipBorder}` }}>
                <span style={{ fontSize: "12px", color: cfg.palette.deep, fontWeight: 600 }}>
                  Sheet-{cfg.sheet} · {farmName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {kpis.populated}/{kpis.total} rows populated &nbsp;·&nbsp; CY Mon {kpis.totalCyM.toLocaleString(undefined, { maximumFractionDigits: 2 })} / Cum {kpis.totalCyC.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <div className="d-flex gap-2 flex-wrap">
                  <button type="button" onClick={handlePdf} disabled={isDownloadingPdf} style={btnStyle("linear-gradient(135deg,#b91c1c,#dc2626)", "0 2px 8px rgba(185,28,28,.25)", isDownloadingPdf)}>
                    {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} /> Generating…</> : <>📄 Download PDF</>}
                  </button>
                  <button type="button" onClick={handleExcel} disabled={isDownloadingExcel} style={btnStyle("linear-gradient(135deg,#15803d,#16a34a)", "0 2px 8px rgba(21,128,61,.25)", isDownloadingExcel)}>
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

const hdrEn = { fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" };
const subhdrEn = { fontSize: "8.5px", opacity: .8, marginTop: "1px", fontWeight: 700 };
const hdr = (bg, minW, single, align) => ({ background: bg, color: "#fff", padding: "10px 8px", textAlign: align || "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: minW || "120px", verticalAlign: single ? "middle" : "top" });
const subhdr = (bg, color) => ({ background: bg, color, padding: "8px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "115px" });
const td = (align, color, weight, bg, borderRight) => ({ padding: "10px 12px", textAlign: align || "center", borderBottom: "1px solid #f1f5f9", borderRight: borderRight || "1px solid #f8fafc", background: bg || "transparent", color: color || "#0f172a", fontWeight: weight || 600, fontSize: "12.5px" });
