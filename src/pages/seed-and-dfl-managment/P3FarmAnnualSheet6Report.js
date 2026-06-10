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

if (!document.getElementById("p3s6-styles")) {
  const s = document.createElement("style");
  s.id = "p3s6-styles";
  s.innerHTML = `
    .p3s6-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .p3s6-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .p3s6-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes p3s6-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .p3s6-wrap { animation: p3s6-in .35s ease; }
    .p3s6-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .p3s6-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .p3s6-scroll::-webkit-scrollbar { height:9px; }
    .p3s6-scroll::-webkit-scrollbar-track { background:#fef3c7; border-radius:6px; }
    .p3s6-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#b45309,#92400e); border-radius:6px; }
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
    border: state.isFocused ? "1.5px solid #b45309" : "1.5px solid #d0d9e8",
    background: "#fffbeb", minHeight: "38px", fontSize: "13px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(180,83,9,.18)" : "none",
    "&:hover": { border: "1.5px solid #b45309" },
  }),
  valueContainer: (b) => ({ ...b, padding: "2px 9px" }),
  placeholder: (b) => ({ ...b, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (b) => ({ ...b, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (b) => ({ ...b, color: "#b45309" }),
  menu: (b) => ({ ...b, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(180,83,9,.18)" }),
  menuPortal: (b) => ({ ...b, zIndex: 9999 }),
  menuList: (b) => ({ ...b, padding: 0, maxHeight: "260px" }),
  option: (b, s) => ({
    ...b, fontSize: "13px", padding: "8px 12px",
    background: s.isSelected ? "linear-gradient(135deg,#b45309,#d97706)" : s.isFocused ? "#fef3c7" : "#fff",
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

const SECTION_META = {
  "15": { icon: "🥚", hue: "blue",    en: "2nd Instar — Feeding & Moult"          },
  "16": { icon: "🐛", hue: "teal",    en: "3rd Instar — Feeding & Moult"          },
  "17": { icon: "🍃", hue: "lime",    en: "3rd Instar — Total Leaf Use & Value"   },
  "18": { icon: "↪️", hue: "amber",   en: "3rd → 4th Instar Moult Records"        },
  "19": { icon: "🐛", hue: "violet",  en: "4th Instar — Feeding & Moult"          },
  "20": { icon: "🍃", hue: "lime",    en: "4th Instar — Total Leaf Use & Value"   },
  "21": { icon: "↪️", hue: "amber",   en: "4th → 5th Instar Moult Records"        },
  "22": { icon: "🦋", hue: "rose",    en: "5th Instar — Feeding & Moult"          },
};
const HUE = {
  amber:   { band: "linear-gradient(135deg,#fed7aa,#fdba74)", text: "#7c2d12" },
  teal:    { band: "linear-gradient(135deg,#99f6e4,#5eead4)", text: "#134e4a" },
  blue:    { band: "linear-gradient(135deg,#bfdbfe,#93c5fd)", text: "#1e3a8a" },
  violet:  { band: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", text: "#4c1d95" },
  rose:    { band: "linear-gradient(135deg,#fecdd3,#fda4af)", text: "#881337" },
  lime:    { band: "linear-gradient(135deg,#d9f99d,#bef264)", text: "#3f6212" },
  slate:   { band: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", text: "#334155" },
};

const isEmpty = (v) => { const s = String(v ?? "").trim(); return s === "" || s === "0" || s === "0.00"; };
const hasAnyData = (row) => [row.curr_qty, row.curr_amt, row.prev_qty, row.prev_amt].some((v) => !isEmpty(v));
const toBool = (v) => {
  if (v == null) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  const s = String(v).trim();
  return s === "1" || s.toLowerCase() === "true";
};

function P3FarmAnnualSheet6Report() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState({ farmId: "", financialYearMasterId: "" });
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
    if (!filter.farmId)                return "Please select a Farm.";
    if (!filter.financialYearMasterId) return "Please select a Financial Year.";
    if (!fyStartYear)                  return "Could not determine the financial year start year.";
    return null;
  };
  const showWarn = (msg) => Swal.fire({ icon: "warning", title: "Required Fields", html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;color:#78350f">${msg}</div></div>`, confirmButtonText: "Got it", confirmButtonColor: "#d97706", customClass: { popup: "p3s6-swal" } });
  const showErr = (title, msg) => Swal.fire({ icon: "error", title, html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;color:#9b2c2c">${msg}</div></div>`, confirmButtonText: "Close", confirmButtonColor: "#e53e3e", customClass: { popup: "p3s6-swal" } });

  const params = () => ({ farmId: filter.farmId, fyStartYear });

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm-annual-report/sheet6", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Sheet-6 Annual Report.");
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm-annual-report/sheet6/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm-annual-report/sheet6/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url; a.download = `p3_farm_annual_sheet6_${filter.farmId}_${fyStartYear}.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const farmName     = selectedFarm?.farmName || "—";
  const currFy       = fyStartYear ? `${fyStartYear}-${String((fyStartYear + 1) % 100).padStart(2, "0")}` : "";
  const prevFy       = fyStartYear ? `${fyStartYear - 1}-${String(fyStartYear % 100).padStart(2, "0")}`     : "";

  const sections = useMemo(() => {
    const out = [];
    let cur = null;
    dataRows.forEach((r) => {
      if (toBool(r.is_header)) {
        cur = { sn: String(r.serial_number ?? ""), title: r.description_kannada || "", rows: [] };
        out.push(cur);
      } else {
        if (!cur) { cur = { sn: "", title: "", rows: [] }; out.push(cur); }
        cur.rows.push(r);
      }
    });
    return out;
  }, [dataRows]);

  const kpis = useMemo(() => {
    const totals = dataRows.filter((r) => !toBool(r.is_header) && (String(r.serial_number) === "17" || String(r.serial_number) === "20"));
    const totalLeafCY = totals.reduce((s, r) => s + numOrZero(r.curr_qty), 0);
    const totalLeafPY = totals.reduce((s, r) => s + numOrZero(r.prev_qty), 0);
    const totalValCY  = totals.reduce((s, r) => s + numOrZero(r.curr_amt), 0);
    const totalValPY  = totals.reduce((s, r) => s + numOrZero(r.prev_amt), 0);
    const populated = dataRows.filter((r) => !toBool(r.is_header) && hasAnyData(r)).length;
    const totalRows = dataRows.filter((r) => !toBool(r.is_header)).length;
    return { totalLeafCY, totalLeafPY, totalValCY, totalValPY, populated, totalRows };
  }, [dataRows]);

  const completeness = kpis.totalRows === 0 ? 0 : (kpis.populated / kpis.totalRows) * 100;

  return (
    <Layout title={t("Sheet-6 · P3 Farm Annual Report")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ಪ್ರಪತ್ರ 6 · ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಕೃಷಿಕ್ಷೇತ್ರ — 2ರಿಂದ 5ನೇ ಹಂತದ ಆಹಾರ ಮತ್ತು ಮೌಲ್ಟ್‌ ವಿವರ")}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#92400e", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #fcd34d", verticalAlign: "middle" }}>P3 Farms · Bivoltine · Sheet-6 · Feeding & Moult</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(180,83,9,.12)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#92400e 0%,#b45309 50%,#d97706 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🐛</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಪ್ರಪತ್ರ 6 — 2ರಿಂದ 5ನೇ ಹಂತದ ಆಹಾರ ಮತ್ತು ಮೌಲ್ಟ್‌ ವಿವರ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Sheet-6</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P3 Farms (Bivoltine) — Annual Report · 2nd–5th instar leaf consumption &amp; moult records · CY vs PY</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={chip}>{farmName}</span>
                <span style={chip}>FY {currFy}</span>
                <span style={chip}>{kpis.populated}/{kpis.totalRows} populated</span>
              </div>
            )}
          </div>
          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#fffbeb)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={5}>
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
                <Col md={3}>
                  <label style={lbl}>Financial Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">— Select Year —</option>
                    {financialYearList.map((f) => (<option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#b45309,#d97706)", "0 4px 12px rgba(180,83,9,.32)", isLoading)}>
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
          <div className="p3s6-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpiBox("#fef3c7", "#fcd34d")}><span style={kpiLbl("#92400e")}>Farm</span><span style={kpiVal("#78350f", 14, 800)}>{farmName}</span></div>
              <div style={kpiBox("#fed7aa", "#fb923c")}><span style={kpiLbl("#7c2d12")}>Financial Year (CY)</span><span style={kpiVal("#7c2d12", 14, 800)}>{currFy || "—"}</span><span style={{ fontSize: "10.5px", color: "#9a3412", fontWeight: 700 }}>vs PY {prevFy || "—"}</span></div>
              <div style={kpiBox("#d9f99d", "#bef264")}><span style={kpiLbl("#3f6212")}>🍃 Total Leaf Used (CY)</span><span className="p3s6-num" style={kpiVal("#3f6212", 18, 800)}>{kpis.totalLeafCY.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span><span style={{ fontSize: "10.5px", color: "#4d7c0f", fontWeight: 700 }}>PY {kpis.totalLeafPY.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg</span></div>
              <div style={kpiBox("#a7f3d0", "#6ee7b7")}><span style={kpiLbl("#065f46")}>💰 Estimated Leaf Value (CY)</span><span className="p3s6-num" style={kpiVal("#064e3b", 18, 800)}>₹ {kpis.totalValCY.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span><span style={{ fontSize: "10.5px", color: "#065f46", fontWeight: 700 }}>PY ₹ {kpis.totalValPY.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
              <div style={kpiBox(
                completeness >= 80 ? "#bbf7d0" : completeness >= 50 ? "#fde68a" : "#fecaca",
                completeness >= 80 ? "#86efac" : completeness >= 50 ? "#fcd34d" : "#fca5a5",
              )}>
                <span style={kpiLbl(completeness >= 80 ? "#14532d" : completeness >= 50 ? "#92400e" : "#7f1d1d")}>📋 Data Completeness</span>
                <span className="p3s6-num" style={kpiVal(completeness >= 80 ? "#14532d" : completeness >= 50 ? "#78350f" : "#7f1d1d", 16, 800)}>{completeness.toFixed(0)}%</span>
                <span style={{ fontSize: "10.5px", color: completeness >= 80 ? "#166534" : completeness >= 50 ? "#92400e" : "#9f1239", fontWeight: 700 }}>{kpis.populated} / {kpis.totalRows} rows</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(180,83,9,.14)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#78350f,#92400e 50%,#b45309)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ಪ್ರಪತ್ರ 6 · ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಕೃಷಿಕ್ಷೇತ್ರ {farmName} · ವಾರ್ಷಿಕ ವರದಿ
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>Sheet-6 · 2nd–5th Instar Feeding &amp; Moult &nbsp;·&nbsp; CY {currFy} vs PY {prevFy}</div>
              </div>
              <div className="p3s6-scroll" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1000px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "420px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರಗಳು</div><div style={hdrEn}>Description</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#b45309,#d97706)")}>
                        <div style={{ fontSize: "12.5px" }}>ಪ್ರಸಕ್ತ ವರ್ಷ {currFy}</div>
                        <div style={hdrEn}>Current Year</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#3730a3,#6366f1)")}>
                        <div style={{ fontSize: "12.5px" }}>ಹಿಂದಿನ ವರ್ಷ {prevFy}</div>
                        <div style={hdrEn}>Previous Year</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={subhdr("linear-gradient(135deg,#fde68a,#fcd34d)", "#78350f")}><div style={{ fontSize: "10.5px" }}>ಕೆ.ಜಿ.</div><div style={subhdrEn}>Kg</div></th>
                      <th style={subhdr("linear-gradient(135deg,#fcd34d,#fbbf24)", "#7c2d12")}><div style={{ fontSize: "10.5px" }}>ಮೌಲ್ಯ (₹)</div><div style={subhdrEn}>Value (₹)</div></th>
                      <th style={subhdr("linear-gradient(135deg,#c7d2fe,#a5b4fc)", "#312e81")}><div style={{ fontSize: "10.5px" }}>ಕೆ.ಜಿ.</div><div style={subhdrEn}>Kg</div></th>
                      <th style={subhdr("linear-gradient(135deg,#a5b4fc,#818cf8)", "#3730a3")}><div style={{ fontSize: "10.5px" }}>ಮೌಲ್ಯ (₹)</div><div style={subhdrEn}>Value (₹)</div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.length === 0 && (
                      <tr><td colSpan={6} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#fffbeb,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🐛</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#92400e", marginBottom: "4px" }}>ಯಾವುದೇ ಆಹಾರ/ಮೌಲ್ಟ್ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#78350f", fontWeight: 600 }}>No feeding / moult data found for this farm in FY {currFy}.</div>
                      </td></tr>
                    )}
                    {sections.map((sec, si) => {
                      const meta = SECTION_META[sec.sn] || { icon: "·", hue: "slate", en: "" };
                      const pal  = HUE[meta.hue];
                      if (!sec.title) {
                        return sec.rows.map((row, ri) => {
                          const muted = !hasAnyData(row);
                          return (
                            <tr key={`solo-${si}-${ri}`} className="p3s6-tr" style={{ background: ri % 2 === 1 ? "#fffbeb" : "#fff", opacity: muted ? .65 : 1 }}>
                              <td style={td("center", "#78350f", 800, "linear-gradient(135deg,#fef3c7,#fde68a)")}>{row.serial_number || "—"}</td>
                              <td style={td("left", "#1c1917", 700, "transparent")}>{row.description_kannada || "—"}</td>
                              <td className="p3s6-num" style={td("right", isEmpty(row.curr_qty) ? "#cbd5e0" : "#92400e", 700, isEmpty(row.curr_qty) ? "transparent" : "linear-gradient(135deg,#fffbeb,#fef3c7)")}>{isEmpty(row.curr_qty) ? "—" : fmt(row.curr_qty)}</td>
                              <td className="p3s6-num" style={td("right", isEmpty(row.curr_amt) ? "#cbd5e0" : "#b45309", 800, isEmpty(row.curr_amt) ? "transparent" : "linear-gradient(135deg,#fef3c7,#fde68a)", "2px solid #e2e8f0")}>{isEmpty(row.curr_amt) ? "—" : `₹ ${fmt(row.curr_amt)}`}</td>
                              <td className="p3s6-num" style={td("right", isEmpty(row.prev_qty) ? "#cbd5e0" : "#312e81", 700, isEmpty(row.prev_qty) ? "transparent" : "linear-gradient(135deg,#eef2ff,#e0e7ff)")}>{isEmpty(row.prev_qty) ? "—" : fmt(row.prev_qty)}</td>
                              <td className="p3s6-num" style={td("right", isEmpty(row.prev_amt) ? "#cbd5e0" : "#3730a3", 800, isEmpty(row.prev_amt) ? "transparent" : "linear-gradient(135deg,#e0e7ff,#c7d2fe)")}>{isEmpty(row.prev_amt) ? "—" : `₹ ${fmt(row.prev_amt)}`}</td>
                            </tr>
                          );
                        });
                      }
                      return (
                        <React.Fragment key={`sec-${si}`}>
                          <tr>
                            <td colSpan={6} style={{ padding: "10px 16px", background: pal.band, color: pal.text, fontWeight: 800, fontSize: "13px", borderTop: "2px solid rgba(0,0,0,.06)", borderBottom: "1.5px solid rgba(0,0,0,.06)" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "18px" }}>{meta.icon}</span>
                                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "30px", height: "26px", borderRadius: "999px", background: "rgba(255,255,255,.92)", color: pal.text, fontWeight: 800, fontSize: "12px", padding: "0 9px" }}>{sec.sn}</span>
                                <span>{sec.title}</span>
                                {meta.en && (<span style={{ fontSize: "10.5px", fontWeight: 700, opacity: .85, marginLeft: "auto" }}>· {meta.en}</span>)}
                              </div>
                            </td>
                          </tr>
                          {sec.rows.map((row, ri) => {
                            const muted = !hasAnyData(row);
                            return (
                              <tr key={`sec-${si}-r-${ri}`} className="p3s6-tr" style={{ background: ri % 2 === 1 ? "#fffbeb" : "#fff", opacity: muted ? .65 : 1 }}>
                                <td style={td("center", muted ? "#94a3b8" : "#475569", 700, "transparent")}>{row.serial_number ? row.serial_number : ""}</td>
                                <td style={td("left", muted ? "#94a3b8" : "#1c1917", 600, "transparent")}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: pal.text, opacity: muted ? .35 : .85 }} />
                                    <span>{row.description_kannada || "—"}</span>
                                    {muted && (<span style={{ fontSize: "9.5px", fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "2px 7px", borderRadius: "999px", border: "1px solid #cbd5e1", marginLeft: "4px" }}>no data</span>)}
                                  </div>
                                </td>
                                <td className="p3s6-num" style={td("right", isEmpty(row.curr_qty) ? "#cbd5e0" : "#92400e", 700, isEmpty(row.curr_qty) ? "transparent" : "linear-gradient(135deg,#fffbeb,#fef3c7)")}>{isEmpty(row.curr_qty) ? "—" : fmt(row.curr_qty)}</td>
                                <td className="p3s6-num" style={td("right", isEmpty(row.curr_amt) ? "#cbd5e0" : "#b45309", 800, isEmpty(row.curr_amt) ? "transparent" : "linear-gradient(135deg,#fef3c7,#fde68a)", "2px solid #e2e8f0")}>{isEmpty(row.curr_amt) ? "—" : `₹ ${fmt(row.curr_amt)}`}</td>
                                <td className="p3s6-num" style={td("right", isEmpty(row.prev_qty) ? "#cbd5e0" : "#312e81", 700, isEmpty(row.prev_qty) ? "transparent" : "linear-gradient(135deg,#eef2ff,#e0e7ff)")}>{isEmpty(row.prev_qty) ? "—" : fmt(row.prev_qty)}</td>
                                <td className="p3s6-num" style={td("right", isEmpty(row.prev_amt) ? "#cbd5e0" : "#3730a3", 800, isEmpty(row.prev_amt) ? "transparent" : "linear-gradient(135deg,#e0e7ff,#c7d2fe)")}>{isEmpty(row.prev_amt) ? "—" : `₹ ${fmt(row.prev_amt)}`}</td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fffbeb,#fef3c7)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #fcd34d" }}>
                <span style={{ fontSize: "12px", color: "#78350f", fontWeight: 600 }}>
                  Sheet-6 · {farmName} — FY {currFy} &nbsp;·&nbsp; {kpis.populated}/{kpis.totalRows} rows populated &nbsp;·&nbsp; 🍃 {kpis.totalLeafCY.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg leaf · ₹ {kpis.totalValCY.toLocaleString(undefined, { maximumFractionDigits: 2 })}
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

const chip = { background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 };
const kpiBox = (bgFrom, border) => ({ background: `linear-gradient(135deg,${bgFrom},#ffffff)`, border: `1.5px solid ${border}`, borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" });
const kpiLbl = (color) => ({ fontSize: "11px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" });
const kpiVal = (color, sz, w) => ({ fontSize: `${sz}px`, color, fontWeight: w || 800, marginTop: "2px" });
const hdrEn = { fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" };
const subhdrEn = { fontSize: "8.5px", opacity: .8, marginTop: "1px", fontWeight: 700 };
const hdr = (bg, minW, single, align) => ({ background: bg, color: "#fff", padding: "10px 8px", textAlign: align || "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: minW || "120px", verticalAlign: single ? "middle" : "top" });
const subhdr = (bg, color) => ({ background: bg, color, padding: "8px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "115px" });
const td = (align, color, weight, bg, borderRight) => ({ padding: "10px 12px", textAlign: align || "center", borderBottom: "1px solid #f1f5f9", borderRight: borderRight || "1px solid #f8fafc", background: bg || "transparent", color: color || "#0f172a", fontWeight: weight || 600, fontSize: "12.5px" });

export default P3FarmAnnualSheet6Report;
