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

if (!document.getElementById("p3s9-styles")) {
  const s = document.createElement("style");
  s.id = "p3s9-styles";
  s.innerHTML = `
    .p3s9-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .p3s9-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .p3s9-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes p3s9-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .p3s9-wrap { animation: p3s9-in .35s ease; }
    .p3s9-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .p3s9-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
  `;
  document.head.appendChild(s);
}

const sel = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "7px 11px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
const btn = (bg, shadow, disabled) => ({ background: disabled ? "#c8d6e5" : bg, border: "none", borderRadius: "9px", padding: "8px 18px", fontWeight: 700, fontSize: "13px", color: "#fff", cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : shadow, display: "flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap" });
const farmSelectStyles = {
  control: (base, state) => ({ ...base, borderRadius: "8px", border: state.isFocused ? "1.5px solid #0ea5e9" : "1.5px solid #d0d9e8", background: "#f0f9ff", minHeight: "38px", fontSize: "13px", boxShadow: state.isFocused ? "0 0 0 2px rgba(14,165,233,.18)" : "none", "&:hover": { border: "1.5px solid #0ea5e9" } }),
  valueContainer: (b) => ({ ...b, padding: "2px 9px" }),
  placeholder: (b) => ({ ...b, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (b) => ({ ...b, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (b) => ({ ...b, color: "#0ea5e9" }),
  menu: (b) => ({ ...b, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(14,165,233,.18)" }),
  menuPortal: (b) => ({ ...b, zIndex: 9999 }),
  menuList: (b) => ({ ...b, padding: 0, maxHeight: "260px" }),
  option: (b, s) => ({ ...b, fontSize: "13px", padding: "8px 12px", background: s.isSelected ? "linear-gradient(135deg,#0ea5e9,#38bdf8)" : s.isFocused ? "#e0f2fe" : "#fff", color: s.isSelected ? "#fff" : "#0f172a", cursor: "pointer" }),
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

const COLS = [
  { key: "sl_no",     kn: "ಕ್ರ.ಸಂ",      en: "Sr.No",    minW: 70  },
  { key: "race_name", kn: "ತಳಿ",         en: "Race",     minW: 200 },
  { key: "w1",        kn: "1ನೇ ವಾರ",     en: "Week 1",   minW: 110, week: true },
  { key: "w2",        kn: "2ನೇ ವಾರ",     en: "Week 2",   minW: 110, week: true },
  { key: "w3",        kn: "3ನೇ ವಾರ",     en: "Week 3",   minW: 110, week: true },
  { key: "w4",        kn: "4ನೇ ವಾರ",     en: "Week 4+",  minW: 110, week: true },
  { key: "total",     kn: "ಒಟ್ಟು",        en: "Total",    minW: 130, isTotal: true },
];

function P3FarmSheet9WeeklyHatchingReport() {
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
    if (!filter.farmId)                return "Please select a Farm.";
    if (!filter.financialYearMasterId) return "Please select a Financial Year.";
    if (!filter.month)                 return "Please select a Month.";
    if (!fyStartYear)                  return "Could not determine the financial year start year.";
    return null;
  };
  const showWarn = (msg) => Swal.fire({ icon: "warning", title: "Required Fields", html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;color:#78350f">${msg}</div></div>`, confirmButtonText: "Got it", confirmButtonColor: "#d97706", customClass: { popup: "p3s9-swal" } });
  const showErr = (title, msg) => Swal.fire({ icon: "error", title, html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;color:#9b2c2c">${msg}</div></div>`, confirmButtonText: "Close", confirmButtonColor: "#e53e3e", customClass: { popup: "p3s9-swal" } });

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
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet9", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Sheet-9 Weekly Hatching report.");
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet9/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet9/excel", { params: params(), responseType: "blob" });
      const p = params();
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url; a.download = `p3_farm_sheet9_${p.farmId}_${p.year}_${p.month}.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const farmName     = selectedFarm?.farmName || "—";
  const monthNum     = Number(filter.month);
  const monthKn      = MONTH_KN[monthNum] || "";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear    = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);

  const kpis = useMemo(() => {
    const sumW = (k) => dataRows.reduce((s, r) => s + numOrZero(r[k]), 0);
    const w1 = sumW("w1"), w2 = sumW("w2"), w3 = sumW("w3"), w4 = sumW("w4");
    const total = w1 + w2 + w3 + w4;
    const races = dataRows.filter((r) => numOrZero(r.total) > 0).length;
    return { w1, w2, w3, w4, total, races, allRaces: dataRows.length };
  }, [dataRows]);

  return (
    <Layout title={t("Sheet-9 · P3 Farm Weekly Cocoon Hatching Programme")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ಪ್ರಪತ್ರ 9 · ವಾರವಾರು ಗೂಡು/ಮೊಟ್ಟೆ ಕಾರ್ಯಕ್ರಮ")}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#e0f2fe,#bae6fd)", color: "#0c4a6e", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #7dd3fc", verticalAlign: "middle" }}>P3 Farms · Bivoltine · Sheet-9 · Weekly</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(14,165,233,.12)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#0c4a6e 0%,#0369a1 50%,#0ea5e9 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>📅</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಪ್ರಪತ್ರ 9 — ವಾರವಾರು ಗೂಡು/ಮೊಟ್ಟೆ ಕಾರ್ಯಕ್ರಮ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Sheet-9</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P3 Farms (Bivoltine) — race-wise weekly cocoon dispatch buckets (W1: 1–7 · W2: 8–14 · W3: 15–21 · W4+: 22–31)</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={chip}>{farmName}</span>
                <span style={chip}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
                <span style={chip}>{kpis.races}/{kpis.allRaces} races active</span>
              </div>
            )}
          </div>
          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f0f9ff)" }}>
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
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0369a1,#0ea5e9)", "0 4px 12px rgba(14,165,233,.32)", isLoading)}>
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
          <div className="p3s9-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpiBox("#e0f2fe", "#7dd3fc")}><span style={kpiLbl("#0c4a6e")}>Farm</span><span style={kpiVal("#0c4a6e", 14, 800)}>{farmName}</span></div>
              <div style={kpiBox("#bae6fd", "#7dd3fc")}><span style={kpiLbl("#0c4a6e")}>Period</span><span style={kpiVal("#0c4a6e", 13.5, 700)}>{monthLabel} {monthKn} {monthYear || ""}</span></div>
              <div style={kpiBox("#fef3c7", "#fcd34d")}><span style={kpiLbl("#92400e")}>📅 Week 1 (1–7)</span><span className="p3s9-num" style={kpiVal("#78350f", 16, 800)}>{kpis.w1.toLocaleString()}</span></div>
              <div style={kpiBox("#fed7aa", "#fdba74")}><span style={kpiLbl("#7c2d12")}>📅 Week 2 (8–14)</span><span className="p3s9-num" style={kpiVal("#7c2d12", 16, 800)}>{kpis.w2.toLocaleString()}</span></div>
              <div style={kpiBox("#fecdd3", "#fda4af")}><span style={kpiLbl("#9f1239")}>📅 Week 3 (15–21)</span><span className="p3s9-num" style={kpiVal("#881337", 16, 800)}>{kpis.w3.toLocaleString()}</span></div>
              <div style={kpiBox("#ddd6fe", "#c4b5fd")}><span style={kpiLbl("#5b21b6")}>📅 Week 4+ (22–31)</span><span className="p3s9-num" style={kpiVal("#4c1d95", 16, 800)}>{kpis.w4.toLocaleString()}</span></div>
              <div style={kpiBox("#a7f3d0", "#6ee7b7")}><span style={kpiLbl("#065f46")}>🪺 Month Total</span><span className="p3s9-num" style={kpiVal("#064e3b", 18, 800)}>{kpis.total.toLocaleString()}</span><span style={{ fontSize: "10.5px", color: "#065f46", fontWeight: 700 }}>across {kpis.races} active races</span></div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(14,165,233,.14)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#0c4a6e,#0369a1 50%,#0ea5e9)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ಪ್ರಪತ್ರ 9 · {monthKn} {monthYear || ""} ರ ವಾರವಾರು ಗೂಡು ಲಭ್ಯತೆ — {farmName}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>Race-wise Weekly Cocoon Programme · {monthLabel} {monthYear}</div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "900px" }}>
                  <thead>
                    <tr>
                      {COLS.map((c, i) => (
                        <th key={c.key} style={hdr(i === 0 ? "linear-gradient(135deg,#1e293b,#36506b)" : c.isTotal ? "linear-gradient(135deg,#065f46,#10b981)" : c.week ? "linear-gradient(135deg,#0369a1,#0ea5e9)" : "linear-gradient(135deg,#334155,#475569)", c.minW)}>
                          <div style={{ fontSize: "12.5px" }}>{c.kn}</div>
                          <div style={hdrEn}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={COLS.length} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#f0f9ff,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>📅</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#0369a1", marginBottom: "4px" }}>ಯಾವುದೇ ಗೂಡು ಲಭ್ಯತೆ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No weekly cocoon data found for {farmName} in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {dataRows.map((row, ri) => {
                      const total = numOrZero(row.total);
                      const muted = total === 0;
                      return (
                        <tr key={ri} className="p3s9-tr" style={{ background: ri % 2 === 1 ? "#f0f9ff" : "#fff", opacity: muted ? .6 : 1 }}>
                          {COLS.map((c, ci) => {
                            const v = row[c.key];
                            const empty = String(v ?? "").trim() === "" || numOrZero(v) === 0;
                            const isNumCol = c.week || c.isTotal || ci === 0;
                            return (
                              <td key={c.key} className={isNumCol ? "p3s9-num" : ""} style={td(
                                ci === 0 ? "center" : isNumCol ? "right" : "left",
                                empty ? "#cbd5e0" : c.isTotal ? "#065f46" : ci === 0 ? "#0c4a6e" : c.week ? "#0c4a6e" : "#1e293b",
                                c.isTotal ? 800 : ci === 0 ? 800 : 600,
                                ci === 0 ? "linear-gradient(135deg,#e0f2fe,#bae6fd)"
                                  : c.isTotal ? (empty ? "transparent" : "linear-gradient(135deg,#d1fae5,#a7f3d0)")
                                  : c.week ? (empty ? "transparent" : "linear-gradient(135deg,#f0f9ff,#e0f2fe)")
                                  : "transparent",
                              )}>
                                {ci === 0 ? (ri + 1) : empty ? "—" : fmt(v)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    {dataRows.length > 0 && (
                      <tr style={{ background: "linear-gradient(135deg,#d1fae5,#a7f3d0)", fontWeight: 800 }}>
                        <td style={td("center", "#065f46", 900, "transparent")}>Σ</td>
                        <td style={td("left", "#065f46", 900, "transparent")}>ಎಲ್ಲಾ ತಳಿಗಳ ಒಟ್ಟು · Total (All Races)</td>
                        <td className="p3s9-num" style={td("right", "#065f46", 900, "transparent")}>{kpis.w1.toLocaleString()}</td>
                        <td className="p3s9-num" style={td("right", "#065f46", 900, "transparent")}>{kpis.w2.toLocaleString()}</td>
                        <td className="p3s9-num" style={td("right", "#065f46", 900, "transparent")}>{kpis.w3.toLocaleString()}</td>
                        <td className="p3s9-num" style={td("right", "#065f46", 900, "transparent")}>{kpis.w4.toLocaleString()}</td>
                        <td className="p3s9-num" style={td("right", "#064e3b", 900, "linear-gradient(135deg,#a7f3d0,#6ee7b7)")}>{kpis.total.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #7dd3fc" }}>
                <span style={{ fontSize: "12px", color: "#0c4a6e", fontWeight: 600 }}>
                  Sheet-9 · {farmName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {kpis.races}/{kpis.allRaces} races active · W1 {kpis.w1.toLocaleString()} · W2 {kpis.w2.toLocaleString()} · W3 {kpis.w3.toLocaleString()} · W4+ {kpis.w4.toLocaleString()} · Σ {kpis.total.toLocaleString()}
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
const kpiBox = (bgFrom, border) => ({ background: `linear-gradient(135deg,${bgFrom},#ffffff)`, border: `1.5px solid ${border}`, borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" });
const kpiLbl = (color) => ({ fontSize: "11px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" });
const kpiVal = (color, sz, w) => ({ fontSize: `${sz}px`, color, fontWeight: w || 800, marginTop: "2px" });
const hdrEn = { fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" };
const hdr = (bg, minW) => ({ background: bg, color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: `${minW}px` });
const td = (align, color, weight, bg) => ({ padding: "10px 12px", textAlign: align || "center", borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc", background: bg || "transparent", color: color || "#0f172a", fontWeight: weight || 600, fontSize: "12.5px" });

export default P3FarmSheet9WeeklyHatchingReport;
