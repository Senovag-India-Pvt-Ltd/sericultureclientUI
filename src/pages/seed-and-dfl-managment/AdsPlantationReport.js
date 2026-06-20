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

if (!document.getElementById("adsplant-styles")) {
  const s = document.createElement("style");
  s.id = "adsplant-styles";
  s.innerHTML = `
    .adsplant-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .adsplant-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .adsplant-swal .swal2-icon { margin:20px auto 4px !important; }
    .adsplant-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .adsplant-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes adsplant-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .adsplant-wrap { animation: adsplant-in .35s ease; }
    .adsplant-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .adsplant-table th { letter-spacing:.02em; }
    .adsplant-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .adsplant-scroll::-webkit-scrollbar { height:9px; }
    .adsplant-scroll::-webkit-scrollbar-track { background:#f0fdf4; border-radius:6px; }
    .adsplant-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#16a34a,#65a30d); border-radius:6px; }
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
    ...base,
    borderRadius: "8px",
    border: state.isFocused ? "1.5px solid #16a34a" : "1.5px solid #d0d9e8",
    background: "#f7fef8",
    minHeight: "38px",
    fontSize: "12.5px",
    color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(22,163,74,.18)" : "none",
    "&:hover": { border: "1.5px solid #16a34a" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "12.5px" }),
  multiValue: (base) => ({
    ...base,
    background: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
    borderRadius: "10px",
    border: "1px solid #86efac",
  }),
  multiValueLabel: (base) => ({ ...base, color: "#14532d", fontWeight: 700, fontSize: "11.5px", padding: "2px 6px" }),
  multiValueRemove: (base) => ({ ...base, color: "#166534", ":hover": { background: "#86efac", color: "#14532d" } }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#166534" }),
  clearIndicator: (base) => ({ ...base, padding: "4px 6px", color: "#166534" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(22,163,74,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base,
    fontSize: "12.5px",
    padding: "8px 12px",
    background: state.isSelected
      ? "linear-gradient(135deg,#166534,#16a34a)"
      : state.isFocused ? "#f0fdf4" : "#fff",
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
  if (!s) return "";
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};
const fmtHa = (v) => {
  const n = numOrZero(v);
  if (n === 0 && String(v ?? "").trim() === "") return "—";
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ha`;
};
const fmtSignedHa = (n) => {
  if (n === 0) return "0 ha";
  return (n > 0 ? "+" : "") + n.toLocaleString(undefined, { maximumFractionDigits: 2 }) + " ha";
};

function AdsPlantationReport() {
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
    api.get(baseURL + "tscMaster/get-all")
      .then((r) => setTscList(r.data.content.tscMaster || []))
      .catch(() => setTscList([]));

    api.get(baseURL + "financialYearMaster/get-all")
      .then((r) => setFinancialYearList(r.data.content.financialYearMaster || []))
      .catch(() => setFinancialYearList([]));

    api.get(baseURL + "financialYearMaster/get-is-default")
      .then((r) => {
        const fy = r.data.content;
        if (fy) {
          setFilter((p) => ({ ...p, financialYearMasterId: fy.financialYearMasterId }));
          setFyStartYear(extractYear(fy.financialYear));
        }
      })
      .catch(() => {});
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
    setDataRows([]);
    if (name === "financialYearMasterId") {
      const sel2 = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel2 ? extractYear(sel2.financialYear) : null);
    }
  };

  const validate = () => {
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
      background: "#fff", customClass: { popup: "adsplant-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "adsplant-swal" },
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
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-plantation", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the ADS Plantation report.");
        }
      } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-plantation/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch {
      showErr("PDF Failed", "Could not generate the PDF report.");
    } finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-plantation/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `ads_plantation_${year}_${m}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch {
      showErr("Excel Failed", "Could not generate the Excel report.");
    } finally { setIsDownloadingExcel(false); }
  };

  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);

  const totals = useMemo(() => {
    // KPI sums use only detail rows (numeric sl_no); division header / subtotal /
    // grand-total rows have an empty sl_no and must be excluded to avoid double-counting.
    const det = dataRows.filter((r) => String(r.sl_no).trim() !== "");
    const sum = (k) => det.reduce((a, r) => a + numOrZero(r[k]), 0);
    return {
      tsc:        det.length,
      prevArea:   sum("prev_area"),
      target:     sum("annual_target"),
      plantedM:   sum("planted_m"),
      plantedMe:  sum("planted_me"),
      uprootedM:  sum("uprooted_m"),
      uprootedMe: sum("uprooted_me"),
      currArea:   sum("current_area"),
      expansion:  sum("expansion"),
    };
  }, [dataRows]);

  return (
    <Layout title={t("ADS · Mulberry Plantation Statistics")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ADS · ಹಿಪ್ಪುನೇರಳೆ ವಿಸ್ತೀರ್ಣದ ವಿವರಗಳು (ಹೆಕ್ಟೇರ್ ಗಳಲ್ಲಿ)")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#bbf7d0,#86efac)",
            color: "#14532d", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #4ade80", verticalAlign: "middle",
          }}>ADS · TSC · Plantation</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(20,83,45,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#14532d 0%,#16a34a 50%,#65a30d 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🌱</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ADS · ಹಿಪ್ಪುನೇರಳೆ ವಿಸ್ತೀರ್ಣದ ವಿವರಗಳು (ಹೆಕ್ಟೇರ್‌ಗಳಲ್ಲಿ)
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Plantation</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>TSC Mulberry Plantation Statistics — Prev. Area · Planted · Uprooted · Current · Expansion (ha)</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {totals.tsc} TSC{totals.tsc === 1 ? "" : "s"}
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f0fdf4)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>TSCs <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>(optional · empty = all TSCs)</span></label>
                  <ReactSelect
                    isMulti
                    options={tscList.map((tsc) => ({ value: String(tsc.tscMasterId), label: tsc.name }))}
                    placeholder="— Select one or more —"
                    isSearchable isClearable closeMenuOnSelect={false}
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={tscSelectStyles}
                    value={filter.tscIds}
                    onChange={(opts) => { setFilter((p) => ({ ...p, tscIds: opts || [] })); setHasReport(false); setDataRows([]); }}
                    noOptionsMessage={() => "No TSC found"}
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
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(22,163,74,.32)", isLoading)}>
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
          <div className="adsplant-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpi("#bbf7d0", "#86efac", "#14532d", "#14532d")}>
                <span style={kpiLbl("#14532d")}>TSCs</span>
                <span style={kpiVal("#14532d", 16)}>{totals.tsc}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e", "#78350f")}>
                <span style={kpiLbl("#92400e")}>Period</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={kpi("#dcfce7", "#86efac", "#166534", "#14532d")}>
                <span style={kpiLbl("#166534")}>ಹಿಂದಿನ ವಿಸ್ತೀರ್ಣ Prev.</span>
                <span className="adsplant-num" style={kpiVal("#14532d", 15)}>{fmtHa(totals.prevArea)}</span>
              </div>
              <div style={kpi("#ecfccb", "#bef264", "#3f6212", "#365314")}>
                <span style={kpiLbl("#3f6212")}>ನೆಟ್ಟ Planted (Month)</span>
                <span className="adsplant-num" style={kpiVal("#365314", 15)}>{fmtHa(totals.plantedM)}</span>
                <span style={{ fontSize: "10.5px", color: "#3f6212", fontWeight: 600, marginTop: "1px" }}>FY Cum: {fmtHa(totals.plantedMe)}</span>
              </div>
              <div style={kpi("#fee2e2", "#fca5a5", "#7f1d1d", "#7f1d1d")}>
                <span style={kpiLbl("#7f1d1d")}>ಕಿತ್ತ Uprooted (Month)</span>
                <span className="adsplant-num" style={kpiVal("#7f1d1d", 15)}>{fmtHa(totals.uprootedM)}</span>
                <span style={{ fontSize: "10.5px", color: "#991b1b", fontWeight: 600, marginTop: "1px" }}>FY Cum: {fmtHa(totals.uprootedMe)}</span>
              </div>
              <div style={kpi("#a7f3d0", "#6ee7b7", "#065f46", "#064e3b")}>
                <span style={kpiLbl("#065f46")}>ಪ್ರಸ್ತುತ ವಿಸ್ತೀರ್ಣ Current</span>
                <span className="adsplant-num" style={kpiVal("#064e3b", 16)}>{fmtHa(totals.currArea)}</span>
              </div>
              <div style={{
                ...kpi(totals.expansion >= 0 ? "#dbeafe" : "#fecdd3",
                       totals.expansion >= 0 ? "#93c5fd" : "#fda4af",
                       totals.expansion >= 0 ? "#1e3a8a" : "#9f1239",
                       totals.expansion >= 0 ? "#1e3a8a" : "#881337"),
              }}>
                <span style={kpiLbl(totals.expansion >= 0 ? "#1e3a8a" : "#9f1239")}>
                  {totals.expansion >= 0 ? "↗ ವಿಸ್ತರಣೆ Expansion" : "↘ ಕಡಿತ Contraction"}
                </span>
                <span className="adsplant-num" style={kpiVal(totals.expansion >= 0 ? "#1e3a8a" : "#881337", 15)}>{fmtSignedHa(totals.expansion)}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(20,83,45,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#14532d,#16a34a 50%,#65a30d)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                ADS · ಹಿಪ್ಪುನೇರಳೆ ವಿಸ್ತೀರ್ಣದ ವಿವರಗಳು (ಹೆಕ್ಟೇರ್‌ಗಳಲ್ಲಿ) &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  TSC Mulberry Plantation Statistics &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="adsplant-scroll" style={{ overflowX: "auto" }}>
                <table className="adsplant-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1300px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={hdrEn}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "200px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ</div>
                        <div style={hdrEn}>TSC</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#15803d,#16a34a)", "120px", true)}>
                        <div style={{ fontSize: "12px" }}>ಹಿಂದಿನ ವಿಸ್ತೀರ್ಣ</div>
                        <div style={hdrEn}>Prev. Area (ha)</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#b45309,#d97706)", "115px", true)}>
                        <div style={{ fontSize: "12px" }}>ವಾರ್ಷಿಕ ಗುರಿ</div>
                        <div style={hdrEn}>Annual Target</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#3f6212,#65a30d)")}>
                        <div style={{ fontSize: "12.5px" }}>🌱 ನೆಟ್ಟ ಪ್ರದೇಶ</div>
                        <div style={hdrEn}>Planted (ha)</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#991b1b,#dc2626)")}>
                        <div style={{ fontSize: "12.5px" }}>🪓 ಕಿತ್ತ ಪ್ರದೇಶ</div>
                        <div style={hdrEn}>Uprooted (ha)</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#065f46,#10b981)", "130px", true)}>
                        <div style={{ fontSize: "12px" }}>ಪ್ರಸ್ತುತ ವಿಸ್ತೀರ್ಣ</div>
                        <div style={hdrEn}>Current (ha)</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e40af,#3730a3)", "130px", true)}>
                        <div style={{ fontSize: "12px" }}>ವಿಸ್ತರಣೆ</div>
                        <div style={hdrEn}>Expansion (ha)</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={subhdr("linear-gradient(135deg,#bef264,#a3e635)", "#3f6212")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸ</div>
                        <div style={subhdrEn}>Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#bef264,#a3e635)", "#3f6212")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸಾಂತ್ಯ</div>
                        <div style={subhdrEn}>Cumulative</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fecaca,#fca5a5)", "#7f1d1d")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸ</div>
                        <div style={subhdrEn}>Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fecaca,#fca5a5)", "#7f1d1d")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸಾಂತ್ಯ</div>
                        <div style={subhdrEn}>Cumulative</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={10} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                        ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                      </td></tr>
                    )}
                    {dataRows.map((row, ri) => {
                      const alt = ri % 2 === 1;
                      const exp = numOrZero(row.expansion);
                      const isHdr = String(row.sl_no).trim() === "" && String(row.tsc || "").startsWith("ವಲಯ");
                      const isTot = String(row.sl_no).trim() === "" && !isHdr;
                      return isHdr ? (
                        <tr key={`${row.sl_no}-${ri}`} className="adsplant-tr" style={{ background: "linear-gradient(135deg,#e0f2fe,#bae6fd)" }}>
                          <td colSpan={10} style={{ padding: "10px 16px", fontWeight: 800, color: "#075985", fontSize: "13px" }}>{row.tsc}</td>
                        </tr>
                      ) : (
                        <tr key={`${row.sl_no}-${ri}`} className="adsplant-tr" style={{ background: isTot ? "linear-gradient(135deg,#fef3c7,#fde68a)" : (alt ? "#f7fef8" : "#ffffff") }}>
                          <td style={td("center", null, "#475569", 700)}>
                            {isTot ? "" : <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", fontWeight: 800, fontSize: "11.5px" }}>{row.sl_no}</span>}
                          </td>
                          <td style={td("left", null, "#0f172a", isTot ? 800 : 700)}>{row.tsc || "—"}</td>
                          <td className="adsplant-num" style={td("right", null, "#14532d", 700, "#f0fdf4")}>{fmtHa(row.prev_area)}</td>
                          <td className="adsplant-num" style={td("right", null, "#92400e", 700, "#fffbeb")}>{fmtHa(row.annual_target)}</td>
                          <td className="adsplant-num" style={td("right", null, "#3f6212", 700, "#f7fee7")}>{fmtHa(row.planted_m)}</td>
                          <td className="adsplant-num" style={td("right", null, "#365314", 800, "#ecfccb")}>{fmtHa(row.planted_me)}</td>
                          <td className="adsplant-num" style={td("right", null, "#7f1d1d", 700, "#fef2f2")}>{fmtHa(row.uprooted_m)}</td>
                          <td className="adsplant-num" style={td("right", null, "#7f1d1d", 800, "#fee2e2")}>{fmtHa(row.uprooted_me)}</td>
                          <td className="adsplant-num" style={td("right", null, "#064e3b", 800, "linear-gradient(135deg,#a7f3d0,#6ee7b7)")}>{fmtHa(row.current_area)}</td>
                          <td className="adsplant-num" style={td("right", null,
                            exp >= 0 ? "#1e3a8a" : "#881337",
                            800,
                            exp >= 0 ? "linear-gradient(135deg,#dbeafe,#bfdbfe)" : "linear-gradient(135deg,#fecdd3,#fda4af)")}>
                            {fmtSignedHa(exp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#f0fdf4,#ecfccb)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #bef264" }}>
                <span style={{ fontSize: "12px", color: "#14532d", fontWeight: 600 }}>
                  ADS · Plantation — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {totals.tsc} TSC{totals.tsc === 1 ? "" : "s"} &nbsp;·&nbsp; {fmtHa(totals.currArea)} current
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

const kpi = (bgFrom, border, text, _v) => ({
  background: `linear-gradient(135deg,${bgFrom},#ffffff)`,
  border: `1.5px solid ${border}`,
  borderRadius: "12px",
  padding: "10px 18px",
  display: "flex", flexDirection: "column", minWidth: "170px",
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
  minWidth: "115px",
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

export default AdsPlantationReport;
