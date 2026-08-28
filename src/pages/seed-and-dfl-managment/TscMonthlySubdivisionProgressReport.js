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

if (!document.getElementById("tscsubdiv-styles")) {
  const s = document.createElement("style");
  s.id = "tscsubdiv-styles";
  s.innerHTML = `
    .tscsubdiv-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tscsubdiv-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tscsubdiv-swal .swal2-icon { margin:20px auto 4px !important; }
    .tscsubdiv-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tscsubdiv-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tscsubdiv-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tscsubdiv-wrap { animation: tscsubdiv-in .35s ease; }
    .tscsubdiv-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tscsubdiv-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tscsubdiv-scroll::-webkit-scrollbar { height:9px; }
    .tscsubdiv-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tscsubdiv-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
    .tscsubdiv-pbar-track { width:100%; height:6px; background:rgba(0,0,0,.06); border-radius:99px; overflow:hidden; margin-top:4px; }
    .tscsubdiv-pbar-fill  { height:100%; border-radius:99px; transition:width .4s ease; }
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
const fmtDec = (v) => { const s = String(v ?? "").trim(); if (!s) return ""; const n = parseFloat(s); if (isNaN(n)) return s; return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
const fmtPct = (v) => { const n = numOrZero(v); return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%"; };

const yearOptions = (() => {
  const cur = new Date().getFullYear(); const arr = [];
  for (let y = cur + 1; y >= cur - 5; y--) arr.push({ value: y, label: String(y) });
  return arr;
})();

// Programme catalog with per-row tone + icon + unit (from SQL: 5 fixed programmes)
const PROGRAMME_META = {
  "ಹಿಪ್ಪುನೇರಳೆ ನಾಟಿ":                            { en: "Mulberry Plantation",            tone: { hdr: "linear-gradient(135deg,#15803d,#22c55e)", chip: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d" }, icon: "🌱", unit: "ha" },
  "ರೇಷ್ಮೆ ಹುಳು ಚಾಕಿ":                            { en: "Silkworm Brushing",              tone: { hdr: "linear-gradient(135deg,#0f766e,#14b8a6)", chip: "linear-gradient(135deg,#ccfbf1,#99f6e4)", color: "#115e59" }, icon: "🥚", unit: "lakhs" },
  "ರೇಷ್ಮೆಗೂಡು ಉತ್ಪಾದನೆ (MT)":                   { en: "Cocoon Production",              tone: { hdr: "linear-gradient(135deg,#a16207,#ca8a04)", chip: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#854d0e" }, icon: "🪺", unit: "MT" },
  "ರೇಷ್ಮೆ ಹುಳು ಚಾಕಿ (CSR-2)":                   { en: "Silkworm Brushing (CSR-2)",      tone: { hdr: "linear-gradient(135deg,#1d4ed8,#3b82f6)", chip: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1e40af" }, icon: "🐛", unit: "lakhs" },
  "ರೇಷ್ಮೆಗೂಡು (CSR-2) ಉತ್ಪಾದನೆ (ಲಕ್ಷ)":           { en: "Cocoon Production (CSR-2)",      tone: { hdr: "linear-gradient(135deg,#7c3aed,#a78bfa)", chip: "linear-gradient(135deg,#ede9fe,#ddd6fe)", color: "#5b21b6" }, icon: "🟫", unit: "lakhs" },
};
const programmeMeta = (name) => PROGRAMME_META[name] || { en: name || "—", tone: { hdr: "linear-gradient(135deg,#475569,#64748b)", chip: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#334155" }, icon: "📌", unit: "" };

const pctColor = (p) => p >= 100 ? "#16a34a" : p >= 60 ? "#ca8a04" : p > 0 ? "#dc2626" : "#cbd5e1";

function TscMonthlySubdivisionProgressReport() {
  const { t } = useTranslation();

  const today = new Date();
  const [filter, setFilter] = useState({ districtId: "", talukId: "", year: today.getFullYear(), month: today.getMonth() + 1 });
  const [districtList, setDistrictList] = useState([]);
  const [talukList, setTalukList] = useState([]);
  const [search, setSearch] = useState("");
  const [programmeFilter, setProgrammeFilter] = useState("");
  const [hideTotals, setHideTotals] = useState(false);

  const [dataRows, setDataRows] = useState([]);
  const [hasReport, setHasReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => { api.get(baseURL + "district/get-all").then((r) => setDistrictList(r.data.content.district || [])).catch(() => setDistrictList([])); }, []);
  useEffect(() => {
    if (!filter.districtId) { setTalukList([]); return; }
    api.get(baseURL + `taluk/get-by-district-id/${filter.districtId}`).then((r) => setTalukList(r.data.content.taluk || [])).catch(() => setTalukList([]));
  }, [filter.districtId]);

  const reset = () => { setHasReport(false); setDataRows([]); setSearch(""); setProgrammeFilter(""); setHideTotals(false); };
  const validate = () => {
    if (!filter.districtId) return t("Please select a District.", { ns: "reports" });
    if (!filter.talukId)    return t("Please select a Taluk.", { ns: "reports" });
    if (!filter.year)       return t("Please select a Year.", { ns: "reports" });
    if (!filter.month)      return t("Please select a Month.", { ns: "reports" });
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: t("Required Fields", { ns: "reports" }),
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">${t("Missing Selection", { ns: "reports" })}</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706", background: "#fff", customClass: { popup: "tscsubdiv-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e", background: "#fff", customClass: { popup: "tscsubdiv-swal" },
    });

  const params = () => ({ talukId: filter.talukId, year: Number(filter.year), month: Number(filter.month) });

  const handleView = async (e) => {
    e.preventDefault(); const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/subdivision-progress", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the TSC Monthly Subdivision Progress report.", { ns: "reports" }));
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/subdivision-progress/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); } finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/subdivision-progress/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      a.download = `tsc_monthly_subdivision_progress_${filter.talukId}_${filter.year}_${filter.month}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); } finally { setIsDownloadingExcel(false); }
  };

  const districtName = districtList.find((d) => String(d.districtId) === String(filter.districtId))?.districtName || "—";
  const talukName    = talukList.find((tk) => String(tk.talukId) === String(filter.talukId))?.talukName || "—";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn      = MONTH_KN[Number(filter.month)] || "";

  const isTotalRow = (r) => String(r.tsc_name || "").trim() === "ಒಟ್ಟು";

  const filteredRows = useMemo(() => {
    let rows = dataRows;
    if (programmeFilter) rows = rows.filter((r) => r.programme === programmeFilter);
    if (hideTotals) rows = rows.filter((r) => !isTotalRow(r));
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((r) => [r.tsc_name, r.programme].some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [dataRows, search, programmeFilter, hideTotals]);

  // Programme-merge groups
  const progMerges = useMemo(() => {
    const merges = []; let i = 0;
    while (i < filteredRows.length) {
      const p = String(filteredRows[i].programme ?? "");
      let j = i + 1;
      while (j < filteredRows.length && String(filteredRows[j].programme ?? "") === p) j++;
      merges.push({ start: i, count: j - i });
      i = j;
    }
    return merges;
  }, [filteredRows]);
  const firstRowOfGroup = useMemo(() => { const set = new Set(); progMerges.forEach((m) => set.add(m.start)); return set; }, [progMerges]);
  const groupSizeAt     = useMemo(() => { const map = new Map(); progMerges.forEach((m) => map.set(m.start, m.count)); return map; }, [progMerges]);
  const groupIdxAt      = useMemo(() => { const map = new Map(); progMerges.forEach((m, gi) => { for (let k = m.start; k < m.start + m.count; k++) map.set(k, gi); }); return map; }, [progMerges]);

  // KPIs: per-programme totals (find the "ಒಟ್ಟು" row of each programme)
  const programmeTotals = useMemo(() => {
    const map = {};
    dataRows.forEach((r) => {
      if (isTotalRow(r)) {
        map[r.programme] = {
          annual: numOrZero(r.annual_target),
          moTgt:  numOrZero(r.mo_target),
          meTgt:  numOrZero(r.me_target),
          moAch:  numOrZero(r.mo_ach),
          meAch:  numOrZero(r.me_ach),
          pctMo:  numOrZero(r.pct_mo),
          pctMe:  numOrZero(r.pct_me),
        };
      }
    });
    return map;
  }, [dataRows]);

  const distinctProgrammes = useMemo(() => {
    const seen = new Set(); const arr = [];
    dataRows.forEach((r) => { if (r.programme && !seen.has(r.programme)) { seen.add(r.programme); arr.push(r.programme); } });
    return arr;
  }, [dataRows]);

  return (
    <Layout title={t("TSC Monthly Subdivision Progress", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ರೇಷ್ಮೆ ಇಲಾಖೆ ಮಾಹೆಯ ಪ್ರಗತಿ ವಿವರ — ಮಾಸಿಕ")}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                Subdivision · 5 Programmes
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#15803d 0%,#0f766e 35%,#1d4ed8 70%,#7c3aed 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>📊</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ರೇಷ್ಮೆ ಇಲಾಖೆ ಮಾಹೆಯ ಪ್ರಗತಿ — Subdivision Monthly Progress · 5 Programmes
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>
                Mulberry Plantation · Silkworm Brushing · Cocoon Production · CSR-2 Brushing · CSR-2 Cocoon — TSC-wise Annual / Mo / ME Target vs Achievement
              </div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{monthLabel} · {monthKn} {filter.year}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{filteredRows.length} / {dataRows.length} rows</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>{t("District")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={districtList.map((d) => ({ value: String(d.districtId), label: d.districtName }))}
                    placeholder={t("— Search District —", { ns: "reports" })}
                    isSearchable isClearable menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed" styles={reactSelectStyles}
                    value={districtList.map((d) => ({ value: String(d.districtId), label: d.districtName })).find((o) => o.value === String(filter.districtId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, districtId: opt?.value || "", talukId: "" })); reset(); }}
                    noOptionsMessage={() => t("No districts", { ns: "reports" })}
                  />
                </Col>
                <Col md={3}>
                  <label style={lbl}>{t("Taluk")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={talukList.map((tk) => ({ value: String(tk.talukId), label: tk.talukName }))}
                    placeholder={filter.districtId ? t("— Search Taluk —", { ns: "reports" }) : t("Select District first", { ns: "reports" })}
                    isSearchable isClearable isDisabled={!filter.districtId} menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed" styles={reactSelectStyles}
                    value={talukList.map((tk) => ({ value: String(tk.talukId), label: tk.talukName })).find((o) => o.value === String(filter.talukId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, talukId: opt?.value || "" })); reset(); }}
                    noOptionsMessage={() => t("No taluks", { ns: "reports" })}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Year", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select value={filter.year} onChange={(e) => { setFilter((p) => ({ ...p, year: e.target.value })); reset(); }} style={sel}>
                    {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
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
                  <Col md={4}>
                    <label style={lbl}>{t("Quick Search (TSC, Programme)", { ns: "reports" })}</label>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Type to filter…", { ns: "reports" })} style={{ ...sel, padding: "8px 12px" }} />
                  </Col>
                  <Col md={4}>
                    <label style={lbl}>{t("Filter by Programme", { ns: "reports" })}</label>
                    <ReactSelect
                      options={[{ value: "", label: t("All Programmes", { ns: "reports" }) }, ...distinctProgrammes.map((p) => ({ value: p, label: `${programmeMeta(p).icon} ${p}` }))]}
                      value={programmeFilter ? { value: programmeFilter, label: `${programmeMeta(programmeFilter).icon} ${programmeFilter}` } : { value: "", label: t("All Programmes", { ns: "reports" }) }}
                      onChange={(opt) => setProgrammeFilter(opt?.value || "")}
                      isSearchable isClearable menuPlacement="auto"
                      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                      menuPosition="fixed" styles={reactSelectStyles}
                    />
                  </Col>
                  <Col md={2}>
                    <label style={lbl}>{t("Totals", { ns: "reports" })}</label>
                    <button type="button" onClick={() => setHideTotals((v) => !v)}
                      style={{
                        width: "100%", padding: "7px 12px", borderRadius: "9px", border: "none",
                        background: hideTotals ? "#f1f5f9" : "linear-gradient(135deg,#fef3c7,#fde68a)",
                        color: hideTotals ? "#475569" : "#854d0e",
                        fontWeight: 800, fontSize: "12.5px", cursor: "pointer",
                        boxShadow: hideTotals ? "none" : "0 2px 6px rgba(202,138,4,.20)",
                      }}>
                      {hideTotals ? `🚫 ${t("Totals hidden", { ns: "reports" })}` : `✓ ${t("Totals shown", { ns: "reports" })}`}
                    </button>
                  </Col>
                  <Col md={2}>
                    <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                      <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                        {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> {t("PDF…", { ns: "reports" })}</> : <>📄 {t("PDF", { ns: "reports" })}</>}
                      </button>
                      <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                        {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> {t("Excel…", { ns: "reports" })}</> : <>📊 {t("Excel", { ns: "reports" })}</>}
                      </button>
                    </div>
                  </Col>
                </Row>
              )}
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="tscsubdiv-wrap mt-4">
            {/* Programme KPI cards */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-stretch">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("District / Taluk", { ns: "reports" })}</span>
                <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{districtName} · {talukName}</span>
              </div>
              {distinctProgrammes.map((p) => {
                const meta = programmeMeta(p);
                const tot  = programmeTotals[p];
                if (!tot) return null;
                const pct = tot.pctMe;
                return (
                  <div key={p} style={{ background: meta.tone.chip, border: `1.5px solid ${meta.tone.color}33`, borderRadius: "12px", padding: "10px 14px", minWidth: "230px", flex: 1, maxWidth: "320px" }}>
                    <div style={{ fontSize: "11px", color: meta.tone.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: "2px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "14px" }}>{meta.icon}</span> {p}
                    </div>
                    <div style={{ fontSize: "10.5px", color: meta.tone.color, fontWeight: 600, opacity: .8 }}>{meta.en} · ({meta.unit})</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
                      <span className="tscsubdiv-num" style={{ fontSize: "15px", fontWeight: 800, color: meta.tone.color }}>{fmtDec(tot.meAch)}</span>
                      <span style={{ fontSize: "10.5px", color: meta.tone.color, opacity: .75, fontWeight: 700 }}>/ {fmtDec(tot.meTgt)} target</span>
                    </div>
                    <div className="tscsubdiv-pbar-track" style={{ marginTop: "4px" }}>
                      <div className="tscsubdiv-pbar-fill" style={{ width: `${Math.min(100, pct)}%`, background: pctColor(pct) }} />
                    </div>
                    <div className="tscsubdiv-num" style={{ fontSize: "10.5px", color: meta.tone.color, fontWeight: 800, marginTop: "3px" }}>
                      ME: {fmtPct(pct)} &nbsp;·&nbsp; Mo: {fmtPct(tot.pctMo)}
                    </div>
                  </div>
                );
              })}
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ರೇಷ್ಮೆ ಇಲಾಖೆ ಮಾಹೆಯ ಪ್ರಗತಿ ವಿವರ — {talukName} — {monthKn} {filter.year}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Subdivision Progress · 5 Programmes × TSC-wise Annual / Mo / ME · {monthLabel} {filter.year}
                </div>
              </div>

              <div className="tscsubdiv-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1700px" }}>
                  <thead>
                    <tr>
                      {[
                        { kn: "ಕ್ರ.ಸಂ.",        en: "Sl",         w: 55,  bg: "linear-gradient(135deg,#1e293b,#36506b)", align: "center" },
                        { kn: "ಕಾರ್ಯಕ್ರಮ",     en: "Programme",  w: 260, bg: "linear-gradient(135deg,#5b21b6,#7c3aed)", align: "left" },
                        { kn: "ತಾಂ.ಸೇ.ಕೇಂದ್ರ",  en: "TSC",        w: 170, bg: "linear-gradient(135deg,#334155,#475569)", align: "left" },
                        { kn: "ವಾರ್ಷಿಕ ಗುರಿ",    en: "Annual Tgt", w: 130, bg: "linear-gradient(135deg,#0e7490,#06b6d4)", align: "right" },
                        { kn: "ತಿಂಗಳ ಗುರಿ",     en: "Mo Target",  w: 130, bg: "linear-gradient(135deg,#1d4ed8,#3b82f6)", align: "right" },
                        { kn: "ಅಂತ್ಯಕ್ಕೆ ಗುರಿ",  en: "ME Target",  w: 130, bg: "linear-gradient(135deg,#1d4ed8,#3b82f6)", align: "right" },
                        { kn: "ತಿಂಗಳ ಸಾಧನೆ",    en: "Mo Ach",     w: 130, bg: "linear-gradient(135deg,#0f766e,#14b8a6)", align: "right" },
                        { kn: "ಅಂತ್ಯಕ್ಕೆ ಸಾಧನೆ", en: "ME Ach",     w: 130, bg: "linear-gradient(135deg,#15803d,#22c55e)", align: "right" },
                        { kn: "% ತಿಂಗಳ",        en: "% Mo",       w: 140, bg: "linear-gradient(135deg,#a16207,#ca8a04)", align: "center" },
                        { kn: "% ಅಂತ್ಯಕ್ಕೆ",     en: "% ME",       w: 140, bg: "linear-gradient(135deg,#a16207,#fbbf24)", align: "center" },
                        { kn: "ಷರಾ",            en: "Notes",      w: 140, bg: "linear-gradient(135deg,#475569,#64748b)", align: "left" },
                      ].map((c, i) => (
                        <th key={i} style={{
                          background: c.bg, color: "#fff",
                          padding: "10px 8px", textAlign: c.align === "left" ? "left" : c.align === "right" ? "right" : "center",
                          border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: c.w,
                          position: "sticky", top: 0, zIndex: 2,
                        }}>
                          <div style={{ fontSize: "11.5px" }}>{c.kn}</div>
                          <div style={{ fontSize: "9px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && (
                      <tr><td colSpan={11} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>{dataRows.length === 0 ? "ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / No records found." : t("No matches for the current filters.", { ns: "reports" })}</td></tr>
                    )}
                    {filteredRows.map((row, ri) => {
                      const isFirstInGroup = firstRowOfGroup.has(ri);
                      const groupSize = isFirstInGroup ? groupSizeAt.get(ri) : 0;
                      const groupIdx = groupIdxAt.get(ri) || 0;
                      const meta = programmeMeta(row.programme);
                      const isTotal = isTotalRow(row);
                      const rowBg = isTotal
                        ? "linear-gradient(135deg,#fffbeb,#fef3c7)"
                        : (groupIdx % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const annual = numOrZero(row.annual_target);
                      const moTgt = numOrZero(row.mo_target);
                      const meTgt = numOrZero(row.me_target);
                      const moAch = numOrZero(row.mo_ach);
                      const meAch = numOrZero(row.me_ach);
                      const pctMo = numOrZero(row.pct_mo);
                      const pctMe = numOrZero(row.pct_me);

                      const cb = {
                        padding: "9px 8px",
                        borderBottom: isTotal ? "2px solid #fcd34d" : "1px solid #e2e8f0",
                        borderRight: "1px solid #eef2f6",
                        borderTop: isTotal ? "1.5px solid #fcd34d" : "none",
                        fontSize: "12px", verticalAlign: "middle",
                      };
                      const numHas = (v) => v !== 0;
                      const numCell = (val, has, palBg, palText, extra = {}) => (
                        <td className="tscsubdiv-num" style={{
                          ...cb, ...extra, textAlign: "right", paddingRight: "14px",
                          background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (has ? palBg : "transparent"),
                          color: isTotal ? "#78350f" : (has ? palText : "#cbd5e0"),
                          fontWeight: isTotal ? 900 : 700,
                        }}>{has ? fmtDec(val) : "—"}</td>
                      );
                      const pctCell = (p) => (
                        <td className="tscsubdiv-num" style={{
                          ...cb, textAlign: "center",
                          background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : "transparent",
                          color: isTotal ? "#78350f" : pctColor(p),
                          fontWeight: isTotal ? 900 : 800,
                        }}>
                          {p > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                              <span style={{ fontSize: "12.5px" }}>{fmtPct(p)}</span>
                              <div className="tscsubdiv-pbar-track" style={{ marginTop: "3px" }}>
                                <div className="tscsubdiv-pbar-fill" style={{ width: `${Math.min(100, p)}%`, background: pctColor(p) }} />
                              </div>
                            </div>
                          ) : "—"}
                        </td>
                      );

                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="tscsubdiv-tr" style={{ background: rowBg }}>
                          <td style={{
                            ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0",
                            color: isTotal ? "#78350f" : "#475569", fontWeight: isTotal ? 900 : 700,
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "26px", height: "26px", borderRadius: "50%",
                              background: isTotal ? "linear-gradient(135deg,#fbbf24,#f59e0b)" : "linear-gradient(135deg,#e2e8f0,#cbd5e1)",
                              color: isTotal ? "#fff" : "#1e293b",
                              fontWeight: 800, fontSize: "11px",
                            }}>{row.sl_no}</span>
                          </td>
                          {isFirstInGroup ? (
                            <td rowSpan={groupSize} style={{
                              ...cb, textAlign: "left", paddingLeft: "12px", verticalAlign: "top",
                              borderRight: "2px solid #e2e8f0",
                              background: meta.tone.chip,
                            }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: meta.tone.color, fontWeight: 900, fontSize: "12.5px" }}>
                                  <span style={{ fontSize: "18px" }}>{meta.icon}</span> {row.programme}
                                </span>
                                <span style={{ fontSize: "10px", color: meta.tone.color, opacity: .8, fontWeight: 700 }}>{meta.en} · ({meta.unit})</span>
                              </div>
                            </td>
                          ) : null}
                          <td style={{
                            ...cb, textAlign: "left", paddingLeft: "12px",
                            color: isTotal ? "#78350f" : "#0f172a",
                            fontWeight: isTotal ? 900 : 700,
                          }}>
                            {isTotal ? <>🟰 <span style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>{row.tsc_name}</span></> : (row.tsc_name || "—")}
                          </td>
                          {numCell(annual, numHas(annual), "#ecfeff", "#155e75")}
                          {numCell(moTgt,  numHas(moTgt),  "#eff6ff", "#1e40af")}
                          {numCell(meTgt,  numHas(meTgt),  "linear-gradient(135deg,#dbeafe,#bfdbfe)", "#1e3a8a")}
                          {numCell(moAch,  numHas(moAch),  "#f0fdfa", "#115e59")}
                          {numCell(meAch,  numHas(meAch),  "linear-gradient(135deg,#dcfce7,#bbf7d0)", "#14532d")}
                          {pctCell(pctMo)}
                          {pctCell(pctMe)}
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "10px", color: "#64748b", fontStyle: "italic" }}>
                            {row.notes ? row.notes : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {districtName} · {talukName} — {monthLabel} {monthKn} {filter.year}
                  &nbsp;·&nbsp; {t("Subdivision Progress · 5 Programmes", { ns: "reports" })} · {filteredRows.length} / {dataRows.length} {t("rows", { ns: "reports" })}
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

export default TscMonthlySubdivisionProgressReport;
