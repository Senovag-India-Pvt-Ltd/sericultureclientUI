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

const COLS = [
  { key: "sl_no",             kn: "ಕ್ರ.ಸಂ",                  en: "Sl.No",            minW: 60 },
  { key: "crop_number",       kn: "ಬೆಳೆ ಸಂಖ್ಯೆ",             en: "Crop No.",         minW: 90 },
  { key: "chawki_eggs",       kn: "ಚಾಕಿ ಮೊಟ್ಟೆ ಸಂಖ್ಯೆ",      en: "Chawki Eggs",      minW: 110 },
  { key: "source",            kn: "ಮೂಲ",                       en: "Source",           minW: 130 },
  { key: "batch_number",      kn: "ತಂಡದ ಸಂಖ್ಯೆ",              en: "Batch No.",        minW: 110 },
  { key: "breed",             kn: "ತಳಿ",                       en: "Breed",            minW: 120 },
  { key: "laid_on_date",      kn: "ಮೊಟ್ಟೆ ಇಟ್ಟ ದಿನಾಂಕ",       en: "Laid On",          minW: 110, isDate: true },
  { key: "chawki_date",       kn: "ಚಾಕಿ ಮಾಡಿದ ದಿನಾಂಕ",        en: "Chawki Date",      minW: 110, isDate: true },
  { key: "chawki_percentage", kn: "ಶೇಕಡ ಚಾಕಿ",                en: "Chawki %",         minW: 90,  isPct: true },
  { key: "worm_mature_date",  kn: "ಹುಳು ಹಣ್ಣಾದ ದಿನಾಂಕ",      en: "Worm Mature",      minW: 110, isDate: true },
  { key: "bittane_no",        kn: "ಬಿತ್ತನೆ (ಸಂಖ್ಯೆ)",         en: "Seed (#)",         minW: 100 },
  { key: "bittane_wt",        kn: "ಬಿತ್ತನೆ (ತೂಕ)",            en: "Seed (kg)",        minW: 100 },
  { key: "reeling_no",        kn: "ನೂಲಿಗೆ (ಸಂಖ್ಯೆ)",          en: "Reeling (#)",      minW: 100 },
  { key: "reeling_wt",        kn: "ನೂಲಿಗೆ (ತೂಕ)",             en: "Reeling (kg)",     minW: 100 },
  { key: "avg_yield_no",      kn: "ಸರಾಸರಿ ಇಳುವರಿ (ಸಂಖ್ಯೆ)",   en: "Avg Yield (#)",    minW: 95 },
  { key: "avg_yield_wt",      kn: "ಸರಾಸರಿ ಇಳುವರಿ (ತೂಕ)",      en: "Avg Yield (kg)",   minW: 95 },
];

if (!document.getElementById("p3s3-styles")) {
  const s = document.createElement("style");
  s.id = "p3s3-styles";
  s.innerHTML = `
    .p3s3-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .p3s3-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .p3s3-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes p3s3-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .p3s3-wrap { animation: p3s3-in .35s ease; }
    .p3s3-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .p3s3-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .p3s3-scroll::-webkit-scrollbar { height:9px; }
    .p3s3-scroll::-webkit-scrollbar-track { background:#ecfdf5; border-radius:6px; }
    .p3s3-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#047857,#065f46); border-radius:6px; }
  `;
  document.head.appendChild(s);
}

const sel = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "7px 11px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
const btn = (bg, shadow, disabled) => ({ background: disabled ? "#c8d6e5" : bg, border: "none", borderRadius: "9px", padding: "8px 18px", fontWeight: 700, fontSize: "13px", color: "#fff", cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : shadow, display: "flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap" });
const farmSelectStyles = {
  control: (base, state) => ({ ...base, borderRadius: "8px", border: state.isFocused ? "1.5px solid #047857" : "1.5px solid #d0d9e8", background: "#ecfdf5", minHeight: "38px", fontSize: "13px", boxShadow: state.isFocused ? "0 0 0 2px rgba(4,120,87,.18)" : "none", "&:hover": { border: "1.5px solid #047857" } }),
  valueContainer: (b) => ({ ...b, padding: "2px 9px" }),
  placeholder: (b) => ({ ...b, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (b) => ({ ...b, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (b) => ({ ...b, color: "#047857" }),
  menu: (b) => ({ ...b, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(4,120,87,.18)" }),
  menuPortal: (b) => ({ ...b, zIndex: 9999 }),
  menuList: (b) => ({ ...b, padding: 0, maxHeight: "260px" }),
  option: (b, s) => ({ ...b, fontSize: "13px", padding: "8px 12px", background: s.isSelected ? "linear-gradient(135deg,#047857,#10b981)" : s.isFocused ? "#d1fae5" : "#fff", color: s.isSelected ? "#fff" : "#0f172a", cursor: "pointer" }),
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

function P3FarmSheet3AnnualCropsReport() {
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
  const showWarn = (msg) => Swal.fire({ icon: "warning", title: "Required Fields", html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;color:#78350f">${msg}</div></div>`, confirmButtonText: "Got it", confirmButtonColor: "#d97706", customClass: { popup: "p3s3-swal" } });
  const showErr = (title, msg) => Swal.fire({ icon: "error", title, html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;color:#9b2c2c">${msg}</div></div>`, confirmButtonText: "Close", confirmButtonColor: "#e53e3e", customClass: { popup: "p3s3-swal" } });

  // Sheet 3 is annual — use fyStartYear as the :year param (the calendar year that opens the FY).
  const params = () => ({ farmId: filter.farmId, year: fyStartYear });

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet3", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Sheet-3 Annual Crops report.");
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet3/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet3/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url; a.download = `p3_farm_sheet3_${filter.farmId}_${fyStartYear}.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const farmName     = selectedFarm?.farmName || "—";

  // KPIs reflect populated columns only. Backend returns blank for
  // reeling_no / reeling_wt / avg_yield in the current Sheet 3 query,
  // so we surface dispatched-cocoon totals (bittane_*) instead.
  const kpis = useMemo(() => {
    const totalChawki  = dataRows.reduce((s, r) => s + numOrZero(r.chawki_eggs), 0);
    const totalCocNo   = dataRows.reduce((s, r) => s + numOrZero(r.bittane_no), 0);
    const totalCocWt   = dataRows.reduce((s, r) => s + numOrZero(r.bittane_wt), 0);
    const avgChawkiPct = dataRows.length ? dataRows.reduce((s, r) => s + numOrZero(r.chawki_percentage), 0) / dataRows.length : 0;
    return { totalChawki, totalCocNo, totalCocWt, avgChawkiPct, count: dataRows.length };
  }, [dataRows]);

  return (
    <Layout title={t("Sheet-3 · P3 Farm Annual Crops Grown")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ಪ್ರಪತ್ರ 3 · ವಾರ್ಷಿಕ ಬೆಳೆ ವರದಿ")}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#d1fae5,#a7f3d0)", color: "#065f46", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #6ee7b7", verticalAlign: "middle" }}>P3 Farms · Bivoltine · Sheet-3 · Annual Crops</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(4,120,87,.12)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#064e3b 0%,#047857 50%,#10b981 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🌾</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಪ್ರಪತ್ರ 3 — ವಾರ್ಷಿಕ ಬೆಳೆ ವರದಿ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Sheet-3</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P3 Farms (Bivoltine) — annual crops grown: laid-on, hatching, chawki, spinning &amp; reeling per lot</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={chip}>{farmName}</span>
                <span style={chip}>Year {fyStartYear || "—"}</span>
                <span style={chip}>{kpis.count} lots</span>
              </div>
            )}
          </div>
          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#ecfdf5)" }}>
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
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#047857,#10b981)", "0 4px 12px rgba(4,120,87,.32)", isLoading)}>
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
          <div className="p3s3-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpiBox("#d1fae5", "#6ee7b7")}><span style={kpiLbl("#065f46")}>Farm</span><span style={kpiVal("#064e3b", 14, 800)}>{farmName}</span></div>
              <div style={kpiBox("#a7f3d0", "#6ee7b7")}><span style={kpiLbl("#065f46")}>Year</span><span style={kpiVal("#064e3b", 14, 800)}>{fyStartYear || "—"}</span></div>
              <div style={kpiBox("#bfdbfe", "#93c5fd")}><span style={kpiLbl("#1e40af")}>🌾 Total Lots</span><span className="p3s3-num" style={kpiVal("#1e3a8a", 18, 800)}>{kpis.count.toLocaleString()}</span></div>
              <div style={kpiBox("#ddd6fe", "#c4b5fd")}><span style={kpiLbl("#5b21b6")}>🥚 Chawki Eggs</span><span className="p3s3-num" style={kpiVal("#4c1d95", 16, 800)}>{kpis.totalChawki.toLocaleString()}</span></div>
              <div style={kpiBox("#fed7aa", "#fdba74")}><span style={kpiLbl("#7c2d12")}>🪺 Dispatched Cocoons</span><span className="p3s3-num" style={kpiVal("#7c2d12", 16, 800)}>{kpis.totalCocNo.toLocaleString()}</span><span style={{ fontSize: "10.5px", color: "#9a3412", fontWeight: 700 }}>{kpis.totalCocWt.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg</span></div>
              <div style={kpiBox("#a7f3d0", "#6ee7b7")}><span style={kpiLbl("#065f46")}>📊 Avg Chawki %</span><span className="p3s3-num" style={kpiVal("#064e3b", 18, 800)}>{kpis.avgChawkiPct.toFixed(2)}%</span></div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(4,120,87,.14)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#064e3b,#047857 50%,#10b981)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ಪ್ರಪತ್ರ 3 · {fyStartYear || ""}ನೇ ಸಾಲಿನ ವಾರ್ಷಿಕ ಬೆಳೆ ವರದಿ · {farmName}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>Annual Crops Grown · Year {fyStartYear || "—"}</div>
              </div>
              <div className="p3s3-scroll" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1700px" }}>
                  <thead>
                    <tr>
                      {COLS.map((c, i) => (
                        <th key={c.key} style={hdr(i === 0 ? "linear-gradient(135deg,#1e293b,#36506b)" : i < COLS.length / 2 + 1 ? "linear-gradient(135deg,#047857,#10b981)" : "linear-gradient(135deg,#10b981,#34d399)", c.minW)}>
                          <div style={{ fontSize: "12px" }}>{c.kn}</div>
                          <div style={hdrEn}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={COLS.length} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#ecfdf5,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🌾</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#047857", marginBottom: "4px" }}>ಯಾವುದೇ ವಾರ್ಷಿಕ ಬೆಳೆ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No crops grown found for {farmName} in {fyStartYear || "—"}.</div>
                      </td></tr>
                    )}
                    {dataRows.map((row, ri) => (
                      <tr key={ri} className="p3s3-tr" style={{ background: ri % 2 === 1 ? "#ecfdf5" : "#fff" }}>
                        {COLS.map((c, ci) => {
                          const v = row[c.key];
                          const empty = isEmpty(v);
                          const isNum = !c.isDate && (ci >= 8 || ci === 2);
                          return (
                            <td key={c.key} className={isNum ? "p3s3-num" : ""} style={td(
                              ci === 0 ? "center" : isNum ? "right" : "left",
                              empty ? "#cbd5e0" : ci === 0 ? "#047857" : "#1e293b",
                              ci === 0 ? 800 : 600,
                              ci === 0 ? "linear-gradient(135deg,#d1fae5,#a7f3d0)" : empty ? "transparent" : isNum ? "linear-gradient(135deg,#ecfdf5,#d1fae5)" : "transparent",
                            )}>
                              {empty ? "—" : c.isPct ? `${fmt(v)}%` : c.isDate ? String(v) : fmt(v)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #6ee7b7" }}>
                <span style={{ fontSize: "12px", color: "#065f46", fontWeight: 600 }}>
                  Sheet-3 · {farmName} — Year {fyStartYear} &nbsp;·&nbsp; {kpis.count} lots · 🥚 {kpis.totalChawki.toLocaleString()} chawki · 🪺 {kpis.totalCocNo.toLocaleString()} dispatched / {kpis.totalCocWt.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg · 📊 {kpis.avgChawkiPct.toFixed(1)}%
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
const hdr = (bg, minW) => ({ background: bg, color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: `${minW}px` });
const td = (align, color, weight, bg) => ({ padding: "10px 12px", textAlign: align || "center", borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc", background: bg || "transparent", color: color || "#0f172a", fontWeight: weight || 600, fontSize: "12.5px" });

export default P3FarmSheet3AnnualCropsReport;
