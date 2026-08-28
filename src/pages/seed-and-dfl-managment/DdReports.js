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

if (!document.getElementById("dd-styles")) {
  const s = document.createElement("style");
  s.id = "dd-styles";
  s.innerHTML = `
    .dd-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .dd-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .dd-swal .swal2-icon { margin:20px auto 4px !important; }
    .dd-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .dd-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes dd-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .dd-wrap { animation: dd-in .35s ease; }
    .dd-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .dd-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .dd-scroll::-webkit-scrollbar { height:9px; }
    .dd-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .dd-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
    .dd-pbar-track { width:100%; height:5px; background:rgba(0,0,0,.06); border-radius:99px; overflow:hidden; margin-top:4px; }
    .dd-pbar-fill { height:100%; border-radius:99px; transition:width .4s ease; }
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
const reactSelectStyles = {
  control: (base, state) => ({
    ...base, borderRadius: "8px",
    border: state.isFocused ? "1.5px solid #14b8a6" : "1.5px solid #d0d9e8",
    background: "#f8fafd", minHeight: "38px", fontSize: "13px", color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(20,184,166,.15)" : "none",
    "&:hover": { border: "1.5px solid #14b8a6" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (base) => ({ ...base, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#64748b" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(13,78,72,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base, fontSize: "13px", padding: "8px 12px",
    background: state.isSelected ? "linear-gradient(135deg,#0f766e,#14b8a6)" : state.isFocused ? "#ecfdf5" : "#fff",
    color: state.isSelected ? "#fff" : "#0f172a", cursor: "pointer",
  }),
};

const numOrZero = (v) => { const n = parseFloat(String(v ?? "").replace(/[^\d.\-]/g, "")); return isNaN(n) ? 0 : n; };
const fmtInt = (v) => { const s = String(v ?? "").trim(); if (!s) return ""; const n = parseFloat(s); if (isNaN(n)) return s; return Math.round(n).toLocaleString(); };
const fmtDec = (v) => { const s = String(v ?? "").trim(); if (!s) return ""; const n = parseFloat(s); if (isNaN(n)) return s; return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
// Parameterised decimal formatter so UI precision matches the query/PDF/Excel exactly.
const fmtDecN = (v, d) => { const s = String(v ?? "").trim(); if (!s) return ""; const n = parseFloat(s); if (isNaN(n)) return s; return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }); };
const fmtPct = (v) => numOrZero(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";

const yearOptions = (() => {
  const cur = new Date().getFullYear(); const arr = [];
  for (let y = cur + 1; y >= cur - 5; y--) arr.push({ value: y, label: String(y) });
  return arr;
})();

const isTotalRow = (r, key = "taluk_name") => {
  const v = String(r?.[key] || "").trim();
  return v === "ಒಟ್ಟು" || v.toLowerCase() === "total";
};

const pctColor = (p) => p >= 100 ? "#16a34a" : p >= 60 ? "#ca8a04" : p > 0 ? "#dc2626" : "#cbd5e1";

const RACE_TONES = {
  "ಶುದ್ಧ":   { bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1e40af", icon: "🥚", en: "Pure" },
  "ಎಫ್ಸಿ1":  { bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d", icon: "🌱", en: "FC1" },
  "ಸಂಕರಣ": { bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", color: "#5b21b6", icon: "🧬", en: "Cross" },
  "ಒಟ್ಟು":  { bg: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#854d0e", icon: "Σ",  en: "Total" },
};
const raceTone = (r) => RACE_TONES[String(r || "").trim()] || { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#334155", icon: "•", en: r || "—" };

// ──────────────────────────────────────────────────────────────────────────
// Shared filter card — District + Year + Month
// ──────────────────────────────────────────────────────────────────────────
function DistrictFilterCard({
  config, filter, setFilter, reset, districtList,
  isLoading, hasReport, dataRows, filteredRows,
  isDownloadingPdf, isDownloadingExcel,
  onSubmit, onPdf, onExcel, extraRow,
}) {
  const { t, i18n } = useTranslation();
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn    = MONTH_KN[Number(filter.month)] || "";
  return (
    <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
      <div style={{ background: config.gradient, padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{config.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
            {config.headerKn} — {config.headerEn}
            <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>{config.formNo}</span>
          </div>
          <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>{config.subtitle}</div>
        </div>
        {hasReport && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{monthLabel} · {monthKn} {filter.year}</span>
            <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{filteredRows.length} / {dataRows.length} rows</span>
          </div>
        )}
      </div>
      <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
        <Form onSubmit={onSubmit}>
          <Row className="g-2 align-items-end">
            <Col md={5}>
              <label style={lbl}>{t("District")} <span style={{ color: "#e53e3e" }}>*</span></label>
              <ReactSelect
                options={districtList.map((d) => ({ value: String(d.districtId), label: i18n.language === "kn" ? (d.districtNameInKannada || d.districtName) : d.districtName }))}
                placeholder={t("— Search District —", { ns: "reports" })}
                isSearchable isClearable menuPlacement="auto"
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed" styles={reactSelectStyles}
                value={districtList.map((d) => ({ value: String(d.districtId), label: i18n.language === "kn" ? (d.districtNameInKannada || d.districtName) : d.districtName })).find((o) => o.value === String(filter.districtId)) || null}
                onChange={(opt) => { setFilter((p) => ({ ...p, districtId: opt?.value || "" })); reset(); }}
                noOptionsMessage={() => t("No districts", { ns: "reports" })}
              />
            </Col>
            <Col md={2}>
              <label style={lbl}>{t("Year", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
              <Form.Select value={filter.year} onChange={(e) => { setFilter((p) => ({ ...p, year: e.target.value })); reset(); }} style={sel}>
                {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
              </Form.Select>
            </Col>
            <Col md={3}>
              <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
              <Form.Select value={filter.month} onChange={(e) => { setFilter((p) => ({ ...p, month: e.target.value })); reset(); }} style={sel}>
                {MONTHS.map((m) => <option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                {isLoading ? <><span className="spinner-border spinner-border-sm" /> {t("Loading…", { ns: "reports" })}</> : <>📋 {t("View", { ns: "reports" })}</>}
              </button>
            </Col>
          </Row>
          {hasReport && (
            <Row className="g-2 mt-2 align-items-end">
              {extraRow}
              <Col md={extraRow ? 4 : 12}>
                <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                  <button type="button" disabled={isDownloadingPdf} onClick={onPdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                    {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> {t("PDF…", { ns: "reports" })}</> : <>📄 {t("PDF", { ns: "reports" })}</>}
                  </button>
                  <button type="button" disabled={isDownloadingExcel} onClick={onExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                    {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> {t("Excel…", { ns: "reports" })}</> : <>📊 {t("Excel", { ns: "reports" })}</>}
                  </button>
                </div>
              </Col>
            </Row>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Shared hook
// ──────────────────────────────────────────────────────────────────────────
function useDdReport(endpointKey, filenamePrefix, friendlyTitle) {
  const { t, i18n } = useTranslation();
  const today = new Date();
  const [filter, setFilter] = useState({ districtId: "", year: today.getFullYear(), month: today.getMonth() + 1 });
  const [districtList, setDistrictList] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [hasReport, setHasReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "district/get-all")
      .then((r) => setDistrictList(r.data.content.district || []))
      .catch(() => setDistrictList([]));
  }, []);

  const reset = () => { setHasReport(false); setDataRows([]); };
  const validate = () => {
    if (!filter.districtId) return t("Please select a District.", { ns: "reports" });
    if (!filter.year)       return t("Please select a Year.", { ns: "reports" });
    if (!filter.month)      return t("Please select a Month.", { ns: "reports" });
    return null;
  };
  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: t("Required Fields", { ns: "reports" }),
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px"><p style="color:#92400e;font-size:14px;font-weight:700;margin:0">${msg}</p></div></div>`,
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "dd-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px"><p style="color:#9b2c2c;font-size:13px;font-weight:600;margin:0">${msg}</p></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "dd-swal" },
    });

  const params = () => ({ districtId: filter.districtId, year: Number(filter.year), month: Number(filter.month) });
  const handleView = async (e) => {
    e.preventDefault(); const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + `grainage-progress-report/${endpointKey}`, { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the {{title}} report.", { ns: "reports", title: friendlyTitle }));
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + `grainage-progress-report/${endpointKey}/pdf`, { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); } finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + `grainage-progress-report/${endpointKey}/excel`, { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      a.download = `${filenamePrefix}_${filter.districtId}_${filter.year}_${filter.month}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); } finally { setIsDownloadingExcel(false); }
  };

  const selectedDistrictObj = districtList.find((d) => String(d.districtId) === String(filter.districtId));
  const districtName = (i18n.language === "kn" ? (selectedDistrictObj?.districtNameInKannada || selectedDistrictObj?.districtName) : selectedDistrictObj?.districtName) || "—";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn      = MONTH_KN[Number(filter.month)] || "";

  return {
    filter, setFilter, reset,
    districtList, districtName, monthLabel, monthKn,
    dataRows, hasReport, isLoading, isDownloadingPdf, isDownloadingExcel,
    handleView, handlePdf, handleExcel,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  Form 27A — Mulberry Area Progress (11 cols, per-taluk + Total)
// ═══════════════════════════════════════════════════════════════════════════
export function DdMulberryAreaReport() {
  const { t } = useTranslation();
  const rpt = useDdReport("dd-report/mulberry-area", "dd_27a_mulberry_area", "DD Form 27A · Mulberry Area");
  const [search, setSearch] = useState("");
  const [hideTotals, setHideTotals] = useState(false);
  // FY-end snapshot date is dynamic: 31-03 of the financial-year start year
  // (months Apr–Dec → this year; Jan–Mar → previous year). Never hardcoded.
  const fyEndYear = (Number(rpt.filter.month) >= 4 ? Number(rpt.filter.year) : Number(rpt.filter.year) - 1) || rpt.filter.year;
  const fyEndLabel = `31-03-${fyEndYear}`;

  const filteredRows = useMemo(() => {
    let rows = rpt.dataRows;
    if (hideTotals) rows = rows.filter((r) => !isTotalRow(r));
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((r) => String(r.taluk_name ?? "").toLowerCase().includes(q));
  }, [rpt.dataRows, search, hideTotals]);

  const kpis = useMemo(() => {
    const t = rpt.dataRows.find(isTotalRow); if (!t) return null;
    const annual = numOrZero(t.annual_target), meAch = numOrZero(t.me_ach), moAch = numOrZero(t.mo_ach);
    return {
      fyEnd: numOrZero(t.fy_end_total),
      annual, moTgt: numOrZero(t.mo_target), meTgt: numOrZero(t.me_target),
      moAch, meAch,
      pctMo: numOrZero(t.pct_mo), pctMe: numOrZero(t.pct_me),
      curTotal: numOrZero(t.cur_total),
      annualPct: annual > 0 ? (meAch * 100) / annual : 0,
    };
  }, [rpt.dataRows]);

  return (
    <Layout title={t("DD Report — Form 27A Mulberry Area", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ನಮೂನೆ-27ಎ · ಹಿಪ್ಪುನೇರಳೆ ವಿಸ್ತೀರ್ಣದ ಪ್ರಗತಿ ವರದಿ")}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                DD · Form 27A
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <DistrictFilterCard
          config={{ formNo: "Form 27A", icon: "🌱",
            gradient: "linear-gradient(135deg,#15803d 0%,#22c55e 50%,#5b57ac 100%)",
            headerKn: "ಹಿಪ್ಪುನೇರಳೆ ವಿಸ್ತೀರ್ಣದ ಪ್ರಗತಿ", headerEn: "Mulberry Area Progress",
            subtitle: `District-level taluk-wise · FY-end (${fyEndLabel}) · Annual / Mo / ME Target vs Achievement · Current Total (ha)` }}
          filter={rpt.filter} setFilter={rpt.setFilter} reset={() => { rpt.reset(); setSearch(""); setHideTotals(false); }}
          districtList={rpt.districtList} isLoading={rpt.isLoading} hasReport={rpt.hasReport}
          dataRows={rpt.dataRows} filteredRows={filteredRows}
          isDownloadingPdf={rpt.isDownloadingPdf} isDownloadingExcel={rpt.isDownloadingExcel}
          onSubmit={rpt.handleView} onPdf={rpt.handlePdf} onExcel={rpt.handleExcel}
          extraRow={
            <>
              <Col md={5}><label style={lbl}>{t("Quick Search (Taluk)", { ns: "reports" })}</label>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Type to filter…", { ns: "reports" })} style={{ ...sel, padding: "8px 12px" }} />
              </Col>
              <Col md={3}><label style={lbl}>{t("Total row", { ns: "reports" })}</label>
                <button type="button" onClick={() => setHideTotals((v) => !v)} style={{ width: "100%", padding: "7px 12px", borderRadius: "9px", border: "none", background: hideTotals ? "#f1f5f9" : "linear-gradient(135deg,#fef3c7,#fde68a)", color: hideTotals ? "#475569" : "#854d0e", fontWeight: 800, fontSize: "12.5px", cursor: "pointer" }}>
                  {hideTotals ? `🚫 ${t("Total hidden", { ns: "reports" })}` : `✓ ${t("Total shown", { ns: "reports" })}`}
                </button>
              </Col>
            </>
          }
        />

        {rpt.hasReport && (
          <div className="dd-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", minWidth: "180px" }}>
                <div style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>District</div>
                <div style={{ fontSize: "14px", color: "#1a202c", fontWeight: 800, marginTop: "2px" }}>{rpt.districtName}</div>
                <div style={{ fontSize: "10.5px", color: "#0f766e", marginTop: "1px" }}>{rpt.monthLabel} {rpt.filter.year}</div>
              </div>
              {kpis && <>
                <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", minWidth: "180px" }}>
                  <div style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{fyEndLabel} ಒಟ್ಟು</div>
                  <div className="dd-num" style={{ fontSize: "16px", color: "#155e75", fontWeight: 800 }}>{fmtDec(kpis.fyEnd)} ha</div>
                </div>
                <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", minWidth: "190px" }}>
                  <div style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ME ಸಾಧನೆ / ಗುರಿ</div>
                  <div className="dd-num" style={{ fontSize: "14px", color: "#1e3a8a", fontWeight: 800 }}>{fmtDec(kpis.meAch)} / {fmtDec(kpis.meTgt)} ha</div>
                  <div className="dd-pbar-track"><div className="dd-pbar-fill" style={{ width: `${Math.min(100, kpis.pctMe)}%`, background: pctColor(kpis.pctMe) }} /></div>
                  <div className="dd-num" style={{ fontSize: "10.5px", color: "#1e40af", fontWeight: 700, marginTop: "2px" }}>{fmtPct(kpis.pctMe)}</div>
                </div>
                <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", minWidth: "180px" }}>
                  <div style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ವಾರ್ಷಿಕ ಗುರಿ · % achieved</div>
                  <div className="dd-num" style={{ fontSize: "16px", color: "#78350f", fontWeight: 800 }}>{fmtDec(kpis.annual)} ha</div>
                  <div className="dd-num" style={{ fontSize: "10.5px", color: "#a16207", fontWeight: 700 }}>{fmtPct(kpis.annualPct)}</div>
                </div>
                <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", minWidth: "200px" }}>
                  <div style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಹಾಲಿ ಒಟ್ಟು ವಿಸ್ತೀರ್ಣ</div>
                  <div className="dd-num" style={{ fontSize: "16px", color: "#4c1d95", fontWeight: 800 }}>{fmtDec(kpis.curTotal)} ha</div>
                  <div style={{ fontSize: "10.5px", color: "#6d28d9", marginTop: "1px" }}>FY-end + ME achievement</div>
                </div>
              </>}
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                {rpt.districtName} ಜಿಲ್ಲೆಯ ಹಿಪ್ಪುನೇರಳೆ ವಿಸ್ತೀರ್ಣದ ಪ್ರಗತಿ ವರದಿ · ನಮೂನೆ-27ಎ — {rpt.monthKn} {rpt.filter.year}
              </div>
              <div className="dd-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1500px" }}>
                  <thead><tr>
                    {[
                      { kn: "ಕ್ರ.ಸಂ.", en: "Sl",            w: 55,  bg: "linear-gradient(135deg,#1e293b,#36506b)", align: "center" },
                      { kn: "ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ ಹೆಸರು/ತಾಲ್ಲೂಕು", en: "TSC / Taluk", w: 200, bg: "linear-gradient(135deg,#334155,#475569)", align: "left" },
                      { kn: `ದಿ:${fyEndLabel} ನೀರಾ`, en: "FY-end Area (Irrigated)", w: 150, bg: "linear-gradient(135deg,#0e7490,#06b6d4)", align: "right" },
                      { kn: "ವಾರ್ಷಿಕ ಗುರಿ (ಹೆಕ್ಟೇರ್)", en: "Annual Tgt (ha)",    w: 120, bg: "linear-gradient(135deg,#a16207,#ca8a04)", align: "right" },
                      { kn: "ಮಾಸ ಗುರಿ", en: "Mo Target",    w: 120, bg: "linear-gradient(135deg,#1d4ed8,#3b82f6)", align: "right" },
                      { kn: "ಅಂತ್ಯ ಗುರಿ", en: "ME Target",   w: 120, bg: "linear-gradient(135deg,#1d4ed8,#3b82f6)", align: "right" },
                      { kn: "ಮಾಸ ಸಾಧನೆ (ನೀರಾವರಿ)", en: "Mo Ach (Irrig)",      w: 120, bg: "linear-gradient(135deg,#0f766e,#14b8a6)", align: "right" },
                      { kn: "ಅಂತ್ಯ ಸಾಧನೆ (ನೀರಾವರಿ)", en: "ME Ach (Irrig)",     w: 120, bg: "linear-gradient(135deg,#15803d,#22c55e)", align: "right" },
                      { kn: "% ಮಾಸ",   en: "% Mo",          w: 130, bg: "linear-gradient(135deg,#a16207,#ca8a04)", align: "center" },
                      { kn: "% ಅಂತ್ಯ",  en: "% ME",          w: 130, bg: "linear-gradient(135deg,#a16207,#fbbf24)", align: "center" },
                      { kn: "ಕಡ್ಡಿ ಕಿತ್ತ ವಿಸ್ತೀರ್ಣ", en: "Uprooted",   w: 120, bg: "linear-gradient(135deg,#b91c1c,#ef4444)", align: "right" },
                      { kn: "ಕಡ್ಡಿ ಕಿತ್ತ ರೈತರು",   en: "Upr Farmers", w: 110, bg: "linear-gradient(135deg,#b91c1c,#f87171)", align: "right" },
                      { kn: "ಪ್ರಾರಂಭದಿಂದ ಸಾಧನೆ",  en: "Inception (Irrigated)", w: 140, bg: "linear-gradient(135deg,#7c3aed,#a78bfa)", align: "right" },
                      { kn: "ರೈತರ ಸಂಖ್ಯೆ",        en: "Farmers",     w: 110, bg: "linear-gradient(135deg,#7c3aed,#c4b5fd)", align: "right" },
                    ].map((c, i) => (
                      <th key={i} style={{ background: c.bg, color: "#fff", padding: "10px 8px", textAlign: c.align === "left" ? "left" : c.align === "right" ? "right" : "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: c.w, position: "sticky", top: 0, zIndex: 2 }}>
                        <div style={{ fontSize: "11.5px" }}>{c.kn}</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>{c.en}</div>
                      </th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filteredRows.length === 0 && <tr><td colSpan={14} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0" }}>{rpt.dataRows.length === 0 ? t("No records found.", { ns: "reports" }) : t('No matches for "{{search}}".', { ns: "reports", search })}</td></tr>}
                    {filteredRows.map((row, ri) => {
                      const isTotal = isTotalRow(row);
                      const rowBg = isTotal ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const cb = { padding: "9px 8px", borderBottom: isTotal ? "2px solid #fcd34d" : "1px solid #e2e8f0", borderTop: isTotal ? "1.5px solid #fcd34d" : "none", borderRight: "1px solid #eef2f6", fontSize: "12px", verticalAlign: "middle" };
                      const numCell = (v, palBg, palText, isStrong = false) => {
                        const n = numOrZero(v); const has = n !== 0;
                        return <td className="dd-num" style={{ ...cb, textAlign: "right", paddingRight: "12px", background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (has ? palBg : "transparent"), color: isTotal ? "#78350f" : (has ? palText : "#cbd5e0"), fontWeight: isTotal ? 900 : (isStrong ? 800 : 700) }}>{has ? fmtDec(v) : "—"}</td>;
                      };
                      const intCell = (v) => {
                        const n = numOrZero(v); const has = n !== 0;
                        return <td className="dd-num" style={{ ...cb, textAlign: "right", paddingRight: "12px", background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (has ? "#faf5ff" : "transparent"), color: isTotal ? "#78350f" : (has ? "#6b21a8" : "#cbd5e0"), fontWeight: isTotal ? 900 : 700 }}>{has ? Math.round(n).toLocaleString() : "—"}</td>;
                      };
                      const pctCell = (p) => (
                        <td className="dd-num" style={{ ...cb, textAlign: "center", background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : "transparent", color: isTotal ? "#78350f" : pctColor(p), fontWeight: isTotal ? 900 : 800 }}>
                          {p > 0 ? <><div>{fmtPct(p)}</div><div className="dd-pbar-track"><div className="dd-pbar-fill" style={{ width: `${Math.min(100, p)}%`, background: pctColor(p) }} /></div></> : "—"}
                        </td>
                      );
                      return (
                        <tr key={ri} className="dd-tr" style={{ background: rowBg }}>
                          <td style={{ ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0", color: isTotal ? "#78350f" : "#475569", fontWeight: isTotal ? 900 : 700 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "26px", height: "26px", borderRadius: "50%", background: isTotal ? "linear-gradient(135deg,#fbbf24,#f59e0b)" : "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: isTotal ? "#fff" : "#1e293b", fontWeight: 800, fontSize: "11px" }}>{row.sl_no}</span>
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "12px", color: isTotal ? "#78350f" : "#0f172a", fontWeight: isTotal ? 900 : 700, borderRight: "2px solid #e2e8f0" }}>
                            {isTotal ? <>🟰 <span style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>{row.taluk_name}</span></> : <>📍 {row.taluk_name || "—"}</>}
                          </td>
                          {numCell(row.fy_end_total,  "#ecfeff", "#155e75", true)}
                          {numCell(row.annual_target, "#fffbeb", "#854d0e", true)}
                          {numCell(row.mo_target,     "#eff6ff", "#1e40af")}
                          {numCell(row.me_target,     "linear-gradient(135deg,#dbeafe,#bfdbfe)", "#1e3a8a", true)}
                          {numCell(row.mo_ach,        "#f0fdfa", "#115e59")}
                          {numCell(row.me_ach,        "linear-gradient(135deg,#dcfce7,#bbf7d0)", "#14532d", true)}
                          {pctCell(numOrZero(row.pct_mo))}
                          {pctCell(numOrZero(row.pct_me))}
                          {numCell(row.uprooted,         "#fef2f2", "#991b1b")}
                          {intCell(row.uprooted_farmers)}
                          {numCell(row.cur_total,     "linear-gradient(135deg,#ede9fe,#ddd6fe)", "#4c1d95", true)}
                          {intCell(row.farmer_count)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </Block>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Form 27B — Crop Yield Detail (per-taluk × race, 13 cols)
// ═══════════════════════════════════════════════════════════════════════════
export function DdCropYieldReport() {
  const { t } = useTranslation();
  const rpt = useDdReport("dd-report/crop-yield", "dd_27b_crop_yield", "DD Form 27B · Crop Yield");
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rpt.dataRows;
    const q = search.trim().toLowerCase();
    return rpt.dataRows.filter((r) => [r.taluk_name, r.race].some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [rpt.dataRows, search]);

  // Taluk-merge groups
  const merges = useMemo(() => {
    const m = []; let i = 0;
    while (i < filteredRows.length) {
      const v = String(filteredRows[i].taluk_name ?? ""); let j = i + 1;
      while (j < filteredRows.length && String(filteredRows[j].taluk_name ?? "") === v) j++;
      m.push({ start: i, count: j - i }); i = j;
    }
    return m;
  }, [filteredRows]);
  const firstOfGroup = useMemo(() => { const s = new Set(); merges.forEach((m) => s.add(m.start)); return s; }, [merges]);
  const sizeAt = useMemo(() => { const m = new Map(); merges.forEach((g) => m.set(g.start, g.count)); return m; }, [merges]);
  const idxAt = useMemo(() => { const m = new Map(); merges.forEach((g, gi) => { for (let k = g.start; k < g.start + g.count; k++) m.set(k, gi); }); return m; }, [merges]);

  return (
    <Layout title={t("DD Report — Form 27B Crop Yield", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ನಮೂನೆ-27ಬಿ · ರೇಷ್ಮೆ ಬೆಳೆಗಳ ವಿವರ ಹಾಗೂ ಪಡೆದ ಇಳುವರಿ ಬಗೆಗಿನ ವಿವರ")}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                DD · Form 27B
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <DistrictFilterCard
          config={{ formNo: "Form 27B", icon: "🌾",
            gradient: "linear-gradient(135deg,#a16207 0%,#ca8a04 50%,#15803d 100%)",
            headerKn: "ರೇಷ್ಮೆ ಬೆಳೆಗಳ ವಿವರ — ತಾಲ್ಲೂಕು × ತಳಿ", headerEn: "Crop Yield · Taluk × Race",
            subtitle: "Pure · FC1 · Cross · Total · Brushed / Failed / Successful · Cocoon MT · Avg Yield (kg/100 DFLs)" }}
          filter={rpt.filter} setFilter={rpt.setFilter} reset={() => { rpt.reset(); setSearch(""); }}
          districtList={rpt.districtList} isLoading={rpt.isLoading} hasReport={rpt.hasReport}
          dataRows={rpt.dataRows} filteredRows={filteredRows}
          isDownloadingPdf={rpt.isDownloadingPdf} isDownloadingExcel={rpt.isDownloadingExcel}
          onSubmit={rpt.handleView} onPdf={rpt.handlePdf} onExcel={rpt.handleExcel}
          extraRow={
            <Col md={8}><label style={lbl}>{t("Quick Search (Taluk, Race)", { ns: "reports" })}</label>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Type to filter…", { ns: "reports" })} style={{ ...sel, padding: "8px 12px" }} />
            </Col>
          }
        />

        {rpt.hasReport && (
          <div className="dd-wrap mt-4">
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                {rpt.districtName} ಜಿಲ್ಲೆ · ನಮೂನೆ-27ಬಿ · ರೇಷ್ಮೆ ಬೆಳೆಗಳ ವಿವರ ಹಾಗೂ ಪಡೆದ ಇಳುವರಿ ಬಗೆಗಿನ ವಿವರ — {rpt.monthKn} {rpt.filter.year}
              </div>
              <div className="dd-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1700px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#1e293b,#36506b)", color: "#fff", padding: "10px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, width: "55px", position: "sticky", top: 0, zIndex: 2 }}>ಕ್ರ.ಸಂ.<div style={{ fontSize: "9px", opacity: .85 }}>Sl.</div></th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#334155,#475569)", color: "#fff", padding: "10px 14px", textAlign: "left", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "160px", position: "sticky", top: 0, zIndex: 2 }}>ವಲಯದ ಹೆಸರು<div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Zone</div></th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#a16207,#ca8a04)", color: "#fff", padding: "10px 14px", textAlign: "left", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "140px", position: "sticky", top: 0, zIndex: 2 }}>ತಳಿ<div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Race</div></th>
                      {[
                        { kn: "ಚಾಕಿ ಕಟ್ಟಿದ ಮೊಟ್ಟೆಗಳ ಸಂಖ್ಯೆ", en: "Brushed",      tone: "linear-gradient(135deg,#1d4ed8,#3b82f6)" },
                        { kn: "ಕಡಿಮೆ ಇಳುವರಿ ನೀಡಿದ ಮೊಟ್ಟೆ",  en: "Low Yield",    tone: "linear-gradient(135deg,#c2410c,#ea580c)" },
                        { kn: "ವಿಫಲವಾದ ಮೊಟ್ಟೆಗಳು",       en: "Failed",        tone: "linear-gradient(135deg,#b91c1c,#dc2626)" },
                        { kn: "ಯಶಸ್ವಿ ಕಟಾವಾದ ಮೊಟ್ಟೆಗಳು",  en: "Successful",    tone: "linear-gradient(135deg,#15803d,#22c55e)" },
                        { kn: "ಒಟ್ಟು ಕಟಾವಾದ ಮೊಟ್ಟೆಗಳು",   en: "Total Harvested", tone: "linear-gradient(135deg,#0f766e,#14b8a6)" },
                        { kn: "ಕಟಾವಾದ ಗೂಡು (ಮೆ.ಟನ್)",   en: "Cocoon (MT)",   tone: "linear-gradient(135deg,#a16207,#fbbf24)" },
                        { kn: "ಸರಾಸರಿ ಇಳುವರಿ (ಕೆ.ಜಿ.)",  en: "Avg (kg/100)",  tone: "linear-gradient(135deg,#4338ca,#6366f1)" },
                      ].map((g, gi) => (
                        <th key={gi} colSpan={2} style={{ background: g.tone, color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}>
                          <div style={{ fontSize: "11.5px" }}>{g.kn}</div>
                          <div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>{g.en}</div>
                        </th>
                      ))}
                    </tr>
                    <tr>
                      {[0, 1, 2, 3, 4, 5, 6].flatMap((gi) => {
                        const tones = [
                          "linear-gradient(180deg,#93c5fd,#60a5fa)", "linear-gradient(180deg,#fdba74,#fb923c)",
                          "linear-gradient(180deg,#fca5a5,#f87171)", "linear-gradient(180deg,#86efac,#4ade80)",
                          "linear-gradient(180deg,#5eead4,#2dd4bf)", "linear-gradient(180deg,#fde68a,#fcd34d)",
                          "linear-gradient(180deg,#a5b4fc,#818cf8)"
                        ];
                        const texts = ["#1e3a8a", "#7c2d12", "#7f1d1d", "#14532d", "#0f766e", "#78350f", "#3730a3"];
                        return [
                          { en: "ಮಾಹೆ", tone: tones[gi], text: texts[gi] },
                          { en: "ಅಂತ್ಯ", tone: tones[gi], text: texts[gi], strong: true },
                        ];
                      }).map((c, i) => (
                        <th key={i} style={{ background: c.tone, color: c.text, padding: "7px 4px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: c.strong ? 800 : 700, minWidth: "85px", position: "sticky", top: "44px", zIndex: 2 }}>
                          <div style={{ fontSize: "10.5px" }}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && <tr><td colSpan={17} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0" }}>{rpt.dataRows.length === 0 ? t("No records found.", { ns: "reports" }) : t('No matches for "{{search}}".', { ns: "reports", search })}</td></tr>}
                    {filteredRows.map((row, ri) => {
                      const isFirst = firstOfGroup.has(ri);
                      const size = isFirst ? sizeAt.get(ri) : 0;
                      const gIdx = idxAt.get(ri) || 0;
                      const tone = raceTone(row.race);
                      const isRaceTotal = String(row.race || "").trim() === "ಒಟ್ಟು";
                      const rowBg = isRaceTotal ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : (gIdx % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const cb = { padding: "9px 6px",
                        borderBottom: isRaceTotal ? "2px solid #fcd34d" : "1px solid #e2e8f0",
                        borderTop: isRaceTotal ? "1.5px solid #fcd34d" : "none",
                        borderRight: "1px solid #eef2f6", fontSize: "11.5px", verticalAlign: "middle" };
                      const numCell = (v, palBg, palText, isStrong = false, isDec = false) => {
                        const n = numOrZero(v); const has = n !== 0;
                        return <td className="dd-num" style={{ ...cb, textAlign: "right", paddingRight: "10px",
                          background: isRaceTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (has ? palBg : "transparent"),
                          color: isRaceTotal ? "#78350f" : (has ? palText : "#cbd5e0"),
                          fontWeight: isRaceTotal ? 900 : (isStrong ? 800 : 700) }}>
                          {has ? (isDec ? fmtDec(v) : fmtInt(v)) : "—"}
                        </td>;
                      };
                      return (
                        <tr key={ri} className="dd-tr" style={{ background: rowBg }}>
                          {isFirst ? (
                            <td rowSpan={size} style={{ ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0", color: "#475569", fontWeight: 700, verticalAlign: "middle" }}>
                              {row.sl_no ? <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#1e293b", fontWeight: 800, fontSize: "10.5px" }}>{row.sl_no}</span> : null}
                            </td>
                          ) : null}
                          {isFirst ? (
                            <td rowSpan={size} style={{ ...cb, textAlign: "left", paddingLeft: "12px", color: "#0f172a", fontWeight: 800, borderRight: "2px solid #e2e8f0", background: gIdx % 2 === 1 ? "#f1f5f9" : "#f8fafc" }}>
                              📍 {row.taluk_name || "—"}
                            </td>
                          ) : null}
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "10px", borderRight: "2px solid #e2e8f0" }}>
                            <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "12px", background: tone.bg, color: tone.color, fontWeight: 800, fontSize: "11.5px" }}>
                              {tone.icon} {row.race}
                            </span>
                          </td>
                          {numCell(row.brushed_mo, "#eff6ff", "#1e40af")}
                          {numCell(row.brushed_me, "linear-gradient(135deg,#dbeafe,#bfdbfe)", "#1e3a8a", true)}
                          {numCell(row.low_mo,     "#fff7ed", "#9a3412")}
                          {numCell(row.low_me,     "linear-gradient(135deg,#ffedd5,#fed7aa)", "#7c2d12", true)}
                          {numCell(row.fail_mo,    "#fef2f2", "#991b1b")}
                          {numCell(row.fail_me,    "linear-gradient(135deg,#fee2e2,#fecaca)", "#7f1d1d", true)}
                          {numCell(row.succ_mo,    "#f0fdf4", "#166534")}
                          {numCell(row.succ_me,    "linear-gradient(135deg,#dcfce7,#bbf7d0)", "#14532d", true)}
                          {numCell(row.tot_mo,     "#f0fdfa", "#115e59")}
                          {numCell(row.tot_me,     "linear-gradient(135deg,#ccfbf1,#99f6e4)", "#0f766e", true)}
                          {numCell(row.kg_mo,      "#fffbeb", "#854d0e", false, true)}
                          {numCell(row.kg_me,      "linear-gradient(135deg,#fef3c7,#fde68a)", "#78350f", true, true)}
                          {numCell(row.avg_mo,     "#eef2ff", "#4338ca", false, true)}
                          {numCell(row.avg_me,     "linear-gradient(135deg,#e0e7ff,#c7d2fe)", "#3730a3", true, true)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </Block>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Forms 28 + 32 — Shared 17-col CY/PY (per-taluk × race)
// ═══════════════════════════════════════════════════════════════════════════
function DdCYPYReport({ config }) {
  const { t } = useTranslation();
  const rpt = useDdReport(config.endpointKey, config.filenamePrefix, config.friendlyTitle);
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rpt.dataRows;
    const q = search.trim().toLowerCase();
    return rpt.dataRows.filter((r) => [r.taluk_name, r.race].some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [rpt.dataRows, search]);

  const merges = useMemo(() => {
    const m = []; let i = 0;
    while (i < filteredRows.length) {
      const v = String(filteredRows[i].taluk_name ?? ""); let j = i + 1;
      while (j < filteredRows.length && String(filteredRows[j].taluk_name ?? "") === v) j++;
      m.push({ start: i, count: j - i }); i = j;
    }
    return m;
  }, [filteredRows]);
  const firstOfGroup = useMemo(() => { const s = new Set(); merges.forEach((m) => s.add(m.start)); return s; }, [merges]);
  const sizeAt = useMemo(() => { const m = new Map(); merges.forEach((g) => m.set(g.start, g.count)); return m; }, [merges]);
  const idxAt = useMemo(() => { const m = new Map(); merges.forEach((g, gi) => { for (let k = g.start; k < g.start + g.count; k++) m.set(k, gi); }); return m; }, [merges]);

  // Dynamic financial-year labels (e.g. 2025-2026) shown on the CY/PY column bands.
  const cyStart = (Number(rpt.filter.month) >= 4 ? Number(rpt.filter.year) : Number(rpt.filter.year) - 1) || rpt.filter.year;
  const cyLabel = `${cyStart}-${cyStart + 1}`;
  const pyLabel = `${cyStart - 1}-${cyStart}`;
  const dec = config.decimals ?? 2;   // decimal precision (32=MT→3, 28=DFLs→2) kept consistent with query/PDF/Excel
  return (
    <Layout title={t(config.layoutTitle, { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t(config.pageTitleKn)}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                DD · {config.formNo}
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <DistrictFilterCard
          config={{ formNo: config.formNo, icon: config.icon, gradient: config.gradient,
            headerKn: config.headerKn, headerEn: config.headerEn, subtitle: config.subtitle }}
          filter={rpt.filter} setFilter={rpt.setFilter} reset={() => { rpt.reset(); setSearch(""); }}
          districtList={rpt.districtList} isLoading={rpt.isLoading} hasReport={rpt.hasReport}
          dataRows={rpt.dataRows} filteredRows={filteredRows}
          isDownloadingPdf={rpt.isDownloadingPdf} isDownloadingExcel={rpt.isDownloadingExcel}
          onSubmit={rpt.handleView} onPdf={rpt.handlePdf} onExcel={rpt.handleExcel}
          extraRow={
            <Col md={8}><label style={lbl}>{t("Quick Search (Taluk, Race)", { ns: "reports" })}</label>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Type to filter…", { ns: "reports" })} style={{ ...sel, padding: "8px 12px" }} />
            </Col>
          }
        />

        {rpt.hasReport && (
          <div className="dd-wrap mt-4">
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                {config.titleKn} — {rpt.districtName} — {rpt.monthKn} {rpt.filter.year}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>{config.formNo} · CY vs PY · {config.metricUnit}</div>
              </div>

              <div className="dd-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", minWidth: "2100px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#1e293b,#36506b)", color: "#fff", padding: "10px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, width: "50px", position: "sticky", top: 0, zIndex: 2 }}>ಕ್ರ.ಸಂ.<div style={{ fontSize: "9px", opacity: .85 }}>Sl.</div></th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#334155,#475569)", color: "#fff", padding: "10px 14px", textAlign: "left", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "140px", position: "sticky", top: 0, zIndex: 2 }}>ತಾಲ್ಲೂಕು<div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Taluk</div></th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#a16207,#ca8a04)", color: "#fff", padding: "10px 14px", textAlign: "left", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "130px", position: "sticky", top: 0, zIndex: 2 }}>ತಳಿ<div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Race</div></th>
                      <th colSpan={7} style={{ background: "linear-gradient(135deg,#0f766e,#14b8a6)", color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}>{cyLabel}ನೇ ಸಾಲು · CY</th>
                      <th colSpan={7} style={{ background: "linear-gradient(135deg,#5b21b6,#7c3aed)", color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}>{pyLabel}ನೇ ಸಾಲು · PY</th>
                    </tr>
                    <tr>
                      {[
                        { en: "Annual", tone: "linear-gradient(180deg,#5eead4,#2dd4bf)", text: "#0f766e", strong: true },
                        { en: "Mo Tgt", tone: "linear-gradient(180deg,#5eead4,#2dd4bf)", text: "#0f766e" },
                        { en: "ME Tgt", tone: "linear-gradient(180deg,#5eead4,#2dd4bf)", text: "#0f766e", strong: true },
                        { en: "Mo Ach", tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d" },
                        { en: "ME Ach", tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d", strong: true },
                        { en: "% Mo",  tone: "linear-gradient(180deg,#fde68a,#fcd34d)", text: "#78350f" },
                        { en: "% ME",  tone: "linear-gradient(180deg,#fde68a,#fcd34d)", text: "#78350f", strong: true },
                        { en: "Annual", tone: "linear-gradient(180deg,#a5b4fc,#818cf8)", text: "#3730a3", strong: true },
                        { en: "Mo Tgt", tone: "linear-gradient(180deg,#a5b4fc,#818cf8)", text: "#3730a3" },
                        { en: "ME Tgt", tone: "linear-gradient(180deg,#a5b4fc,#818cf8)", text: "#3730a3", strong: true },
                        { en: "Mo Ach", tone: "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: "#4c1d95" },
                        { en: "ME Ach", tone: "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: "#4c1d95", strong: true },
                        { en: "% Mo",  tone: "linear-gradient(180deg,#fcd34d,#fbbf24)", text: "#78350f" },
                        { en: "% ME",  tone: "linear-gradient(180deg,#fcd34d,#fbbf24)", text: "#78350f", strong: true },
                      ].map((c, i) => (
                        <th key={i} style={{ background: c.tone, color: c.text, padding: "7px 4px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: c.strong ? 800 : 700, minWidth: "90px", position: "sticky", top: "44px", zIndex: 2 }}>
                          <div style={{ fontSize: "10px" }}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && <tr><td colSpan={17} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0" }}>{rpt.dataRows.length === 0 ? t("No records found.", { ns: "reports" }) : t('No matches for "{{search}}".', { ns: "reports", search })}</td></tr>}
                    {filteredRows.map((row, ri) => {
                      const isFirst = firstOfGroup.has(ri);
                      const size = isFirst ? sizeAt.get(ri) : 0;
                      const gIdx = idxAt.get(ri) || 0;
                      const tone = raceTone(row.race);
                      const isRaceTotal = String(row.race || "").trim() === "ಒಟ್ಟು";
                      const rowBg = isRaceTotal ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : (gIdx % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const cb = { padding: "8px 6px",
                        borderBottom: isRaceTotal ? "2px solid #fcd34d" : "1px solid #e2e8f0",
                        borderTop: isRaceTotal ? "1.5px solid #fcd34d" : "none",
                        borderRight: "1px solid #eef2f6", fontSize: "11px", verticalAlign: "middle" };
                      const numCell = (v, palBg, palText, isStrong = false, extra = {}) => {
                        const n = numOrZero(v); const has = n !== 0;
                        return <td className="dd-num" style={{ ...cb, ...extra, textAlign: "right", paddingRight: "10px",
                          background: isRaceTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (has ? palBg : "transparent"),
                          color: isRaceTotal ? "#78350f" : (has ? palText : "#cbd5e0"),
                          fontWeight: isRaceTotal ? 900 : (isStrong ? 800 : 700) }}>
                          {has ? fmtDecN(v, dec) : "—"}
                        </td>;
                      };
                      const pctCell = (p, extra = {}) => (
                        <td className="dd-num" style={{ ...cb, ...extra, textAlign: "center",
                          background: isRaceTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : "transparent",
                          color: isRaceTotal ? "#78350f" : pctColor(p), fontWeight: isRaceTotal ? 900 : 800 }}>
                          {p > 0 ? fmtPct(p) : "—"}
                        </td>
                      );
                      return (
                        <tr key={ri} className="dd-tr" style={{ background: rowBg }}>
                          <td style={{ ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0", color: "#475569", fontWeight: 700 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#1e293b", fontWeight: 800, fontSize: "10px" }}>{row.sl_no}</span>
                          </td>
                          {isFirst ? (
                            <td rowSpan={size} style={{ ...cb, textAlign: "left", paddingLeft: "12px", color: "#0f172a", fontWeight: 800, borderRight: "2px solid #e2e8f0", background: gIdx % 2 === 1 ? "#f1f5f9" : "#f8fafc" }}>
                              📍 {row.taluk_name || "—"}
                            </td>
                          ) : null}
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "10px", borderRight: "2px solid #e2e8f0" }}>
                            <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "12px", background: tone.bg, color: tone.color, fontWeight: 800, fontSize: "11px" }}>
                              {tone.icon} {row.race}
                            </span>
                          </td>
                          {numCell(row.cy_annual,    "#ccfbf1", "#0f766e", true)}
                          {numCell(row.cy_mo_target, "#f0fdfa", "#115e59")}
                          {numCell(row.cy_me_target, "linear-gradient(135deg,#ccfbf1,#99f6e4)", "#115e59", true)}
                          {numCell(row.cy_mo_ach,    "#f0fdf4", "#166534")}
                          {numCell(row.cy_me_ach,    "linear-gradient(135deg,#dcfce7,#bbf7d0)", "#14532d", true)}
                          {pctCell(numOrZero(row.cy_pct_mo))}
                          {pctCell(numOrZero(row.cy_pct_me), { borderRight: "2px solid #e2e8f0" })}
                          {numCell(row.py_annual,    "#e0e7ff", "#3730a3", true)}
                          {numCell(row.py_mo_target, "#eef2ff", "#4338ca")}
                          {numCell(row.py_me_target, "linear-gradient(135deg,#e0e7ff,#c7d2fe)", "#3730a3", true)}
                          {numCell(row.py_mo_ach,    "#f5f3ff", "#5b21b6")}
                          {numCell(row.py_me_ach,    "linear-gradient(135deg,#ede9fe,#ddd6fe)", "#4c1d95", true)}
                          {pctCell(numOrZero(row.py_pct_mo))}
                          {pctCell(numOrZero(row.py_pct_me))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </Block>
    </Layout>
  );
}

// ── Form 28 Chawki Progress ──────────────────────────────────────────────
export function DdChawkiProgressReport() {
  return <DdCYPYReport config={{
    endpointKey: "dd-report/chawki-progress", filenamePrefix: "dd_28_chawki_progress",
    friendlyTitle: "DD Form 28 · Chawki Progress",
    layoutTitle:  "DD Report — Form 28 Chawki Progress",
    pageTitleKn:  "ನಮೂನೆ-28 · ದ್ವಿತಳಿ ಮೊಟ್ಟೆಗಳ ಚಾಕಿ ಪ್ರಗತಿ ವರದಿ",
    formNo: "Form 28", icon: "🥚",
    gradient: "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 50%,#7c3aed 100%)",
    headerKn: "ದ್ವಿತಳಿ ಮೊಟ್ಟೆಗಳ ಚಾಕಿ ಪ್ರಗತಿ", headerEn: "Bivoltine DFL Brushing Progress · Taluk × Race",
    subtitle: "Race buckets — Pure · FC1 · Cross · Total · CY vs PY (DFLs)",
    titleKn: "ನಮೂನೆ-28 · ದ್ವಿತಳಿ ಮೊಟ್ಟೆಗಳ ಚಾಕಿ ಪ್ರಗತಿ ವರದಿ",
    metricUnit: "DFLs", decimals: 2,
  }} />;
}

// ── Form 32 Cocoon Production ────────────────────────────────────────────
export function DdCocoonProgressReport() {
  return <DdCYPYReport config={{
    endpointKey: "dd-report/cocoon-progress", filenamePrefix: "dd_32_cocoon_progress",
    friendlyTitle: "DD Form 32 · Cocoon Production",
    layoutTitle:  "DD Report — Form 32 Cocoon Production",
    pageTitleKn:  "ನಮೂನೆ-32 · ದ್ವಿತಳಿ ಗೂಡು ಉತ್ಪಾದನಾ ಪ್ರಗತಿ ವರದಿ",
    formNo: "Form 32", icon: "🪺",
    gradient: "linear-gradient(135deg,#a16207 0%,#ca8a04 50%,#0f766e 100%)",
    headerKn: "ದ್ವಿತಳಿ ಗೂಡು ಉತ್ಪಾದನಾ ಪ್ರಗತಿ", headerEn: "Bivoltine Cocoon Production · Taluk × Race",
    subtitle: "Race buckets — Pure · FC1 · Cross · Total · CY vs PY (MT)",
    titleKn: "ನಮೂನೆ-32 · ದ್ವಿತಳಿ ಗೂಡು ಉತ್ಪಾದನಾ ಪ್ರಗತಿ ವರದಿ",
    metricUnit: "MT (cocoon)", decimals: 3,
  }} />;
}
