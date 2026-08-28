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

if (!document.getElementById("adschawki-styles")) {
  const s = document.createElement("style");
  s.id = "adschawki-styles";
  s.innerHTML = `
    .adschawki-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .adschawki-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .adschawki-swal .swal2-icon { margin:20px auto 4px !important; }
    .adschawki-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .adschawki-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes adschawki-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .adschawki-wrap { animation: adschawki-in .35s ease; }
    .adschawki-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .adschawki-table th { letter-spacing:.02em; }
    .adschawki-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .adschawki-scroll::-webkit-scrollbar { height:9px; }
    .adschawki-scroll::-webkit-scrollbar-track { background:#f5f3ff; border-radius:6px; }
    .adschawki-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#7c3aed,#475569); border-radius:6px; }
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

const tscSelectStyles = {
  control: (base, state) => ({
    ...base, borderRadius: "8px",
    border: state.isFocused ? "1.5px solid #7c3aed" : "1.5px solid #d0d9e8",
    background: "#fbfaff",
    minHeight: "38px", fontSize: "12.5px", color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(124,58,237,.18)" : "none",
    "&:hover": { border: "1.5px solid #7c3aed" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "12.5px" }),
  multiValue: (base) => ({ ...base, background: "linear-gradient(135deg,#ede9fe,#ddd6fe)", borderRadius: "10px", border: "1px solid #c4b5fd" }),
  multiValueLabel: (base) => ({ ...base, color: "#4c1d95", fontWeight: 700, fontSize: "11.5px", padding: "2px 6px" }),
  multiValueRemove: (base) => ({ ...base, color: "#5b21b6", ":hover": { background: "#c4b5fd", color: "#4c1d95" } }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#5b21b6" }),
  clearIndicator: (base) => ({ ...base, padding: "4px 6px", color: "#5b21b6" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(124,58,237,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base, fontSize: "12.5px", padding: "8px 12px",
    background: state.isSelected ? "linear-gradient(135deg,#5b21b6,#7c3aed)" : state.isFocused ? "#f5f3ff" : "#fff",
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

function AdsChawkiReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ tscIds: [], financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [tscList,           setTscList]           = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "tscMaster/get-all").then((r) => setTscList(r.data.content.tscMaster || [])).catch(() => setTscList([]));
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
      background: "#fff", customClass: { popup: "adschawki-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "adschawki-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    const ids = (filter.tscIds || []).map((o) => o.value).filter(Boolean).join(",");
    const p = { year, month: m };
    if (ids) p.tscIds = ids;
    return p;
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-chawki", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the ADS Chawki report.", { ns: "reports" }));
        }
      } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-chawki/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-chawki/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `ads_chawki_${year}_${m}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); }
    finally { setIsDownloadingExcel(false); }
  };

  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);

  const totals = useMemo(() => {
    // Sum only the ಮೊಟ್ಟೆ (DFL) detail rows: exclude the ಬೆಳೆ (crop) rows (which
    // carry crop counts, not goals/DFLs) and the backend grand-total (ಒಟ್ಟು) row,
    // so figures are neither mixed nor double-counted.
    const det = dataRows.filter((r) => String(r.metric).trim() === "ಮೊಟ್ಟೆ" && String(r.tsc).trim() !== "ಒಟ್ಟು");
    const sum = (k) => det.reduce((a, r) => a + numOrZero(r[k]), 0);
    return {
      tsc: det.length,
      annualCY: sum("annual_goal_cy"),
      goalCYM:  sum("goal_cy_m"),
      achCYM:   sum("ach_cy_m"),
      achCYMe:  sum("ach_cy_me"),
      annualPY: sum("annual_goal_py"),
      goalPYM:  sum("goal_py_m"),
      achPYM:   sum("ach_py_m"),
      achPYMe:  sum("ach_py_me"),
    };
  }, [dataRows]);

  const yoyM   = totals.achPYM === 0 ? 0 : ((totals.achCYM - totals.achPYM) / totals.achPYM) * 100;
  const yoyMe  = totals.achPYMe === 0 ? 0 : ((totals.achCYMe - totals.achPYMe) / totals.achPYMe) * 100;

  // Detail rows only: the ಮೊಟ್ಟೆ (DFL) metric, excluding the backend ಒಟ್ಟು totals;
  // the footer renders the single grand total (matches the Excel/PDF which are also ಮೊಟ್ಟೆ).
  const detRows = dataRows.filter((r) => String(r.metric).trim() === "ಮೊಟ್ಟೆ" && String(r.tsc).trim() !== "ಒಟ್ಟು");

  return (
    <Layout title={t("ADS · TSC Chawki Programme & Achievement", { ns: "reports" })}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ADS · ತಾ.ಸೇ.ಕೇಂದ್ರಗಳ ಚಾಕಿ ಕಾರ್ಯಕ್ರಮ ಮತ್ತು ಸಾಧನೆ")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#ddd6fe,#c4b5fd)",
            color: "#4c1d95", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #a78bfa", verticalAlign: "middle",
          }}>ADS · TSC · Chawki · CY vs PY</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(76,29,149,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#4c1d95 0%,#7c3aed 50%,#475569 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📅</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ADS · ತಾ.ಸೇ.ಕೇಂದ್ರಗಳ ಚಾಕಿ ಕಾರ್ಯಕ್ರಮ ಮತ್ತು ಸಾಧನೆ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Chawki</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>TSC Monthly Chawki DFL Programme & Achievement (CY vs PY) — receipt_of_dfls</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{totals.tsc} TSC{totals.tsc === 1 ? "" : "s"}</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#faf5ff)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>{t("TSCs", { ns: "reports" })} <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>{t("(optional · empty = all TSCs)", { ns: "reports" })}</span></label>
                  <ReactSelect
                    isMulti
                    options={tscList.map((tsc) => ({ value: String(tsc.tscMasterId), label: tsc.name }))}
                    placeholder={t("— Select one or more —", { ns: "reports" })}
                    isSearchable isClearable closeMenuOnSelect={false}
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={tscSelectStyles}
                    value={filter.tscIds}
                    onChange={(opts) => { setFilter((p) => ({ ...p, tscIds: opts || [] })); setHasReport(false); setDataRows([]); }}
                    noOptionsMessage={() => t("No TSC found", { ns: "reports" })}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Financial Year")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Year —", { ns: "reports" })}</option>
                    {financialYearList.map((f) => (<option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">{t("— Month —", { ns: "reports" })}</option>
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#4c1d95,#7c3aed)", "0 4px 12px rgba(76,29,149,.32)", isLoading)}>
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
          <div className="adschawki-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpi("#ddd6fe", "#a78bfa", "#4c1d95")}>
                <span style={kpiLbl("#4c1d95")}>TSCs</span>
                <span style={kpiVal("#4c1d95", 16)}>{totals.tsc}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>Period</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={kpi("#ede9fe", "#c4b5fd", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>ಪ್ರಸಕ್ತ ಮಾಸ Ach (CY M)</span>
                <span className="adschawki-num" style={kpiVal("#4c1d95", 16)}>{totals.achCYM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#5b21b6", fontWeight: 700, marginTop: "1px" }}>FY Cum: {totals.achCYMe.toLocaleString()}</span>
              </div>
              <div style={kpi("#e2e8f0", "#94a3b8", "#334155")}>
                <span style={kpiLbl("#334155")}>ಹಿಂದಿನ ಮಾಸ Ach (PY M)</span>
                <span className="adschawki-num" style={kpiVal("#1e293b", 16)}>{totals.achPYM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#475569", fontWeight: 700, marginTop: "1px" }}>FY Cum: {totals.achPYMe.toLocaleString()}</span>
              </div>
              <div style={{
                ...kpi(yoyM >= 0 ? "#bbf7d0" : "#fecdd3",
                       yoyM >= 0 ? "#86efac" : "#fda4af",
                       yoyM >= 0 ? "#166534" : "#9f1239"),
              }}>
                <span style={kpiLbl(yoyM >= 0 ? "#166534" : "#9f1239")}>
                  {yoyM >= 0 ? "↗" : "↘"} YoY (Month)
                </span>
                <span className="adschawki-num" style={kpiVal(yoyM >= 0 ? "#14532d" : "#881337", 16)}>{(yoyM >= 0 ? "+" : "") + yoyM.toFixed(2)}%</span>
              </div>
              <div style={{
                ...kpi(yoyMe >= 0 ? "#a7f3d0" : "#fecdd3",
                       yoyMe >= 0 ? "#6ee7b7" : "#fda4af",
                       yoyMe >= 0 ? "#065f46" : "#9f1239"),
              }}>
                <span style={kpiLbl(yoyMe >= 0 ? "#065f46" : "#9f1239")}>
                  {yoyMe >= 0 ? "↗" : "↘"} YoY (FY Cum.)
                </span>
                <span className="adschawki-num" style={kpiVal(yoyMe >= 0 ? "#064e3b" : "#881337", 16)}>{(yoyMe >= 0 ? "+" : "") + yoyMe.toFixed(2)}%</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(76,29,149,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#312e81,#5b21b6 50%,#475569)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                ADS · ತಾ.ಸೇ.ಕೇಂದ್ರಗಳ ಚಾಕಿ ಕಾರ್ಯಕ್ರಮ ಮತ್ತು ಸಾಧನೆ &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  TSC Monthly Chawki Programme & Achievement &nbsp;·&nbsp; CY vs PY &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="adschawki-scroll" style={{ overflowX: "auto" }}>
                <table className="adschawki-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1300px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "210px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ</div><div style={hdrEn}>TSC</div>
                      </th>
                      <th colSpan={4} style={hdr("linear-gradient(135deg,#5b21b6,#7c3aed)")}>
                        <div style={{ fontSize: "12.5px", fontWeight: 800 }}>ಪ್ರಸಕ್ತ ವರ್ಷ {monthYear ? `${monthYear}-${(monthYear + 1) % 100}` : ""}</div>
                        <div style={hdrEn}>Current Year</div>
                      </th>
                      <th colSpan={4} style={hdr("linear-gradient(135deg,#475569,#64748b)")}>
                        <div style={{ fontSize: "12.5px", fontWeight: 800 }}>ಹಿಂದಿನ ವರ್ಷ {monthYear ? `${monthYear - 1}-${monthYear % 100}` : ""}</div>
                        <div style={hdrEn}>Previous Year</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ವಾರ್ಷಿಕ ಗುರಿ</div><div style={subhdrEn}>Annual Goal</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ಗುರಿ-ಮಾಸ</div><div style={subhdrEn}>Goal · Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#ede9fe,#ddd6fe)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ಸಾಧನೆ-ಮಾಸ</div><div style={subhdrEn}>Ach · Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#a78bfa,#8b5cf6)", "#fff")}>
                        <div style={{ fontSize: "10.5px" }}>ಸಾಧನೆ-ಮಾಸಾಂತ್ಯ</div><div style={subhdrEn}>Ach · FY Cum</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#e2e8f0,#cbd5e1)", "#334155")}>
                        <div style={{ fontSize: "10.5px" }}>ವಾರ್ಷಿಕ ಗುರಿ</div><div style={subhdrEn}>Annual Goal</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#e2e8f0,#cbd5e1)", "#334155")}>
                        <div style={{ fontSize: "10.5px" }}>ಗುರಿ-ಮಾಸ</div><div style={subhdrEn}>Goal · Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#cbd5e1,#94a3b8)", "#1e293b")}>
                        <div style={{ fontSize: "10.5px" }}>ಸಾಧನೆ-ಮಾಸ</div><div style={subhdrEn}>Ach · Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#94a3b8,#64748b)", "#fff")}>
                        <div style={{ fontSize: "10.5px" }}>ಸಾಧನೆ-ಮಾಸಾಂತ್ಯ</div><div style={subhdrEn}>Ach · FY Cum</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={10} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.</td></tr>
                    )}
                    {detRows.map((row, ri) => {
                      const alt = ri % 2 === 1;
                      const cyM  = numOrZero(row.ach_cy_m);
                      const pyM  = numOrZero(row.ach_py_m);
                      const rowYoy = pyM === 0 ? null : ((cyM - pyM) / pyM) * 100;
                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="adschawki-tr" style={{ background: alt ? "#fbfaff" : "#ffffff" }}>
                          <td style={td("center", null, "#475569", 700)}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#ede9fe,#ddd6fe)", color: "#4c1d95", fontWeight: 800, fontSize: "11.5px" }}>{row.sl_no}</span>
                          </td>
                          <td style={td("left", null, "#0f172a", 700)}>
                            {row.tsc || "—"}
                            {rowYoy !== null && (
                              <span style={{
                                display: "inline-block", marginLeft: "8px", padding: "2px 8px", borderRadius: "999px",
                                background: rowYoy >= 0 ? "linear-gradient(135deg,#bbf7d0,#86efac)" : "linear-gradient(135deg,#fecdd3,#fda4af)",
                                color: rowYoy >= 0 ? "#14532d" : "#881337",
                                fontWeight: 800, fontSize: "10.5px",
                              }}>
                                {rowYoy >= 0 ? "↗ +" : "↘ "}{rowYoy.toFixed(1)}%
                              </span>
                            )}
                          </td>
                          <td className="adschawki-num" style={td("right", null, "#5b21b6", 700, "#f5f3ff")}>{fmt(row.annual_goal_cy)}</td>
                          <td className="adschawki-num" style={td("right", null, "#5b21b6", 700, "#f5f3ff")}>{fmt(row.goal_cy_m)}</td>
                          <td className="adschawki-num" style={td("right", null, "#4c1d95", 800, "#ede9fe")}>{fmt(row.ach_cy_m)}</td>
                          <td className="adschawki-num" style={td("right", null, "#fff", 800, "linear-gradient(135deg,#a78bfa,#8b5cf6)")}>{fmt(row.ach_cy_me)}</td>
                          <td className="adschawki-num" style={td("right", null, "#334155", 700, "#f1f5f9")}>{fmt(row.annual_goal_py)}</td>
                          <td className="adschawki-num" style={td("right", null, "#334155", 700, "#f1f5f9")}>{fmt(row.goal_py_m)}</td>
                          <td className="adschawki-num" style={td("right", null, "#1e293b", 800, "#e2e8f0")}>{fmt(row.ach_py_m)}</td>
                          <td className="adschawki-num" style={td("right", null, "#fff", 800, "linear-gradient(135deg,#94a3b8,#64748b)")}>{fmt(row.ach_py_me)}</td>
                        </tr>
                      );
                    })}
                    {detRows.length > 0 && (
                      <tr style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)" }}>
                        <td colSpan={2} style={{ padding: "13px 16px", textAlign: "right", color: "#78350f", fontWeight: 800, fontSize: "13px", borderTop: "2px solid #f59e0b" }}>ಒಟ್ಟು &nbsp;/&nbsp; Grand Total</td>
                        <td className="adschawki-num" style={ftd("#5b21b6")}>{fmt(totals.annualCY)}</td>
                        <td className="adschawki-num" style={ftd("#5b21b6")}>{fmt(totals.goalCYM)}</td>
                        <td className="adschawki-num" style={ftd("#4c1d95")}>{fmt(totals.achCYM)}</td>
                        <td className="adschawki-num" style={ftd("#4c1d95")}>{fmt(totals.achCYMe)}</td>
                        <td className="adschawki-num" style={ftd("#334155")}>{fmt(totals.annualPY)}</td>
                        <td className="adschawki-num" style={ftd("#334155")}>{fmt(totals.goalPYM)}</td>
                        <td className="adschawki-num" style={ftd("#1e293b")}>{fmt(totals.achPYM)}</td>
                        <td className="adschawki-num" style={ftd("#1e293b")}>{fmt(totals.achPYMe)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#faf5ff,#f1f5f9)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c4b5fd" }}>
                <span style={{ fontSize: "12px", color: "#4c1d95", fontWeight: 600 }}>
                  ADS · Chawki — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {totals.tsc} TSC{totals.tsc === 1 ? "" : "s"} &nbsp;·&nbsp; CY {totals.achCYM.toLocaleString()} vs PY {totals.achPYM.toLocaleString()}
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

const kpi = (bgFrom, border, text) => ({
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
  padding: "10px 8px",
  textAlign: align || "center",
  border: "1px solid rgba(255,255,255,.18)",
  fontWeight: 800,
  minWidth: minW || "100px",
  verticalAlign: single ? "middle" : "top",
});
const subhdr = (bg, color) => ({
  background: bg, color,
  padding: "8px 6px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
  minWidth: "120px",
});
const td = (align, minW, color, weight, bg) => ({
  padding: "10px 10px", textAlign: align || "center",
  borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc",
  background: bg || "transparent",
  color: color || "#0f172a", fontWeight: weight || 600,
  fontSize: "12.5px", minWidth: minW || undefined,
});
const ftd = (color) => ({
  padding: "13px 10px", textAlign: "right",
  color: color || "#78350f", fontWeight: 800, fontSize: "12.5px",
  borderTop: "2px solid #f59e0b", borderRight: "1px solid #fcd34d",
});

export default AdsChawkiReport;
