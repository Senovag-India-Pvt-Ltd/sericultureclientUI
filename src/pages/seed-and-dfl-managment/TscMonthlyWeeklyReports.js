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

if (!document.getElementById("tscwk-styles")) {
  const s = document.createElement("style");
  s.id = "tscwk-styles";
  s.innerHTML = `
    .tscwk-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tscwk-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tscwk-swal .swal2-icon { margin:20px auto 4px !important; }
    .tscwk-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tscwk-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tscwk-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tscwk-wrap { animation: tscwk-in .35s ease; }
    .tscwk-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tscwk-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tscwk-scroll::-webkit-scrollbar { height:9px; }
    .tscwk-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tscwk-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
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
const fmtVal = (v, fmt) => fmt === "dec" ? fmtDec(v) : fmtInt(v);

const yearOptions = (() => {
  const cur = new Date().getFullYear(); const arr = [];
  for (let y = cur + 1; y >= cur - 5; y--) arr.push({ value: y, label: String(y) });
  return arr;
})();

const raceTone = (raceRaw) => {
  const r = String(raceRaw || "").toUpperCase();
  if (r.includes(" X ") || r.includes("CROSS") || r.includes("BVDH") || r.includes("CB ") || r.includes("HYBRID"))
    return { bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", color: "#5b21b6" };
  if (r.includes("CSR")) return { bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1e40af" };
  if (r.includes("SK"))  return { bg: "linear-gradient(135deg,#cffafe,#a5f3fc)", color: "#0c4a6e" };
  if (r === "PM" || r.includes("PURE MYSORE")) return { bg: "linear-gradient(135deg,#fed7aa,#fdba74)", color: "#7c2d12" };
  if (r.includes("FC"))  return { bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d" };
  return { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#334155" };
};

const WEEK_TONES = [
  null, // 0 unused
  { bg: "linear-gradient(135deg,#e0f2fe,#bae6fd)", color: "#075985", label: "Wk 1 (1-7)" },
  { bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d", label: "Wk 2 (8-14)" },
  { bg: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#854d0e", label: "Wk 3 (15-21)" },
  { bg: "linear-gradient(135deg,#fbcfe8,#f9a8d4)", color: "#9d174d", label: "Wk 4 (22+)" },
];

/**
 * Reusable component for the 4 weekly-format reports (10a, 10b, 11a, 11b).
 *
 * config:
 *   pageTitleEn, pageTitleKn, sheetBadge, formNo, icon, gradient,
 *   headerBlurbEn, headerBlurbKn, downloadFilenamePrefix,
 *   endpoint        (e.g. "grainage-progress-report/tsc-monthly/weekly-brushing"),
 *   metric1: { kn, en, key, fmt, paletteKey },
 *   metric2: { kn, en, key, fmt, paletteKey },
 *   kpiUnit         (e.g. "DFLs", "kg"),
 *   kpiLabelEnM1, kpiLabelEnM2.
 */
function TscMonthlyWeeklyReport({ config }) {
  const { t } = useTranslation();

  const today = new Date();
  const [filter, setFilter] = useState({ districtId: "", talukId: "", year: today.getFullYear(), month: today.getMonth() + 1 });
  const [districtList, setDistrictList] = useState([]);
  const [talukList,    setTalukList]    = useState([]);
  const [search, setSearch] = useState("");
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

  // Reset on config change so stale data doesn't render for a different sheet
  useEffect(() => { setHasReport(false); setDataRows([]); setSearch(""); /* eslint-disable-next-line */ }, [config.endpoint]);

  const reset = () => { setHasReport(false); setDataRows([]); setSearch(""); };
  const validate = () => {
    if (!filter.districtId) return "Please select a District.";
    if (!filter.talukId)    return "Please select a Taluk.";
    if (!filter.year)       return "Please select a Year.";
    if (!filter.month)      return "Please select a Month.";
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: "Required Fields",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">Missing Selection</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Got it", confirmButtonColor: "#d97706", background: "#fff", customClass: { popup: "tscwk-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e", background: "#fff", customClass: { popup: "tscwk-swal" },
    });

  const params = () => ({ talukId: filter.talukId, year: Number(filter.year), month: Number(filter.month) });

  const handleView = async (e) => {
    e.preventDefault(); const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + config.endpoint, { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []); setHasReport(true);
    } catch { showErr("Fetch Failed", `Failed to load the ${config.pageTitleEn} report.`); }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + config.endpoint + "/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); } finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + config.endpoint + "/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      a.download = `${config.downloadFilenamePrefix}_${filter.talukId}_${filter.year}_${filter.month}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); } finally { setIsDownloadingExcel(false); }
  };

  const districtName = districtList.find((d) => String(d.districtId) === String(filter.districtId))?.districtName || "—";
  const talukName    = talukList.find((tk) => String(tk.talukId) === String(filter.talukId))?.talukName || "—";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn      = MONTH_KN[Number(filter.month)] || "";

  const filteredRows = useMemo(() => {
    if (!search.trim()) return dataRows;
    const q = search.trim().toLowerCase();
    return dataRows.filter((r) =>
      [r.race, r.week_no].some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [dataRows, search]);

  // Race-merge groups (consecutive rows with same race)
  const raceMerges = useMemo(() => {
    const merges = []; let i = 0;
    while (i < filteredRows.length) {
      const rc = String(filteredRows[i].race ?? "");
      let j = i + 1;
      while (j < filteredRows.length && String(filteredRows[j].race ?? "") === rc) j++;
      merges.push({ start: i, count: j - i });
      i = j;
    }
    return merges;
  }, [filteredRows]);
  const firstRowOfGroup = useMemo(() => { const set = new Set(); raceMerges.forEach((m) => set.add(m.start)); return set; }, [raceMerges]);
  const groupSizeAt     = useMemo(() => { const map = new Map(); raceMerges.forEach((m) => map.set(m.start, m.count)); return map; }, [raceMerges]);
  const groupIdxAt      = useMemo(() => { const map = new Map(); raceMerges.forEach((m, gi) => { for (let k = m.start; k < m.start + m.count; k++) map.set(k, gi); }); return map; }, [raceMerges]);

  const kpis = useMemo(() => {
    let m1 = 0, m2 = 0;
    const races = new Set();
    const byWeekM1 = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const byRaceM1 = {};
    dataRows.forEach((r) => {
      m1 += numOrZero(r[config.metric1.key]);
      m2 += numOrZero(r[config.metric2.key]);
      if (r.race) races.add(r.race);
      const wk = Number(r.week_no);
      if (wk >= 1 && wk <= 4) byWeekM1[wk] += numOrZero(r[config.metric1.key]);
      const rc = r.race || "—";
      byRaceM1[rc] = (byRaceM1[rc] || 0) + numOrZero(r[config.metric1.key]);
    });
    const topRace = Object.entries(byRaceM1).sort((a, b) => b[1] - a[1])[0] || ["—", 0];
    return { m1, m2, races: races.size, byWeekM1, topRace };
  }, [dataRows, config.metric1.key, config.metric2.key]);

  const PALETTES = {
    blue:   { hdr: "linear-gradient(135deg,#1d4ed8,#3b82f6)", cellBg: "#eff6ff", text: "#1e40af" },
    teal:   { hdr: "linear-gradient(135deg,#0f766e,#14b8a6)", cellBg: "#f0fdfa", text: "#115e59" },
    green:  { hdr: "linear-gradient(135deg,#15803d,#22c55e)", cellBg: "#f0fdf4", text: "#166534" },
    red:    { hdr: "linear-gradient(135deg,#b91c1c,#dc2626)", cellBg: "#fef2f2", text: "#991b1b" },
    amber:  { hdr: "linear-gradient(135deg,#a16207,#ca8a04)", cellBg: "#fffbeb", text: "#854d0e" },
    purple: { hdr: "linear-gradient(135deg,#7c3aed,#a78bfa)", cellBg: "#f5f3ff", text: "#5b21b6" },
    indigo: { hdr: "linear-gradient(135deg,#4338ca,#6366f1)", cellBg: "#eef2ff", text: "#4338ca" },
  };

  const m1Pal = PALETTES[config.metric1.paletteKey] || PALETTES.teal;
  const m2Pal = PALETTES[config.metric2.paletteKey] || PALETTES.green;

  return (
    <Layout title={t(config.pageTitleEn)}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t(config.pageTitleKn)}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                {config.sheetBadge}
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{ background: config.gradient, padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{config.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                {config.headerBlurbKn} — {config.headerBlurbEn}
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>{config.formNo}</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>
                Race × Week (Wk1: 1-7 · Wk2: 8-14 · Wk3: 15-21 · Wk4: 22-end) — for the selected Taluk
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
                  <label style={lbl}>District <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={districtList.map((d) => ({ value: String(d.districtId), label: d.districtName }))}
                    placeholder="— Search District —"
                    isSearchable isClearable menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed" styles={reactSelectStyles}
                    value={districtList.map((d) => ({ value: String(d.districtId), label: d.districtName })).find((o) => o.value === String(filter.districtId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, districtId: opt?.value || "", talukId: "" })); reset(); }}
                    noOptionsMessage={() => "No districts"}
                  />
                </Col>
                <Col md={3}>
                  <label style={lbl}>Taluk <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={talukList.map((tk) => ({ value: String(tk.talukId), label: tk.talukName }))}
                    placeholder={filter.districtId ? "— Search Taluk —" : "Select District first"}
                    isSearchable isClearable isDisabled={!filter.districtId} menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed" styles={reactSelectStyles}
                    value={talukList.map((tk) => ({ value: String(tk.talukId), label: tk.talukName })).find((o) => o.value === String(filter.talukId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, talukId: opt?.value || "" })); reset(); }}
                    noOptionsMessage={() => "No taluks"}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select value={filter.year} onChange={(e) => { setFilter((p) => ({ ...p, year: e.target.value })); reset(); }} style={sel}>
                    {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select value={filter.month} onChange={(e) => { setFilter((p) => ({ ...p, month: e.target.value })); reset(); }} style={sel}>
                    {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                    {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                  </button>
                </Col>
              </Row>
              {hasReport && (
                <Row className="g-2 mt-2 align-items-end">
                  <Col md={6}>
                    <label style={lbl}>Quick Search (Race, Week)</label>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type to filter…" style={{ ...sel, padding: "8px 12px" }} />
                  </Col>
                  <Col md={6}>
                    <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                      <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                        {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> Generating PDF…</> : <>📄 PDF</>}
                      </button>
                      <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                        {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> Exporting…</> : <>📊 Excel</>}
                      </button>
                    </div>
                  </Col>
                </Row>
              )}
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="tscwk-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>District / Taluk</span>
                <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{districtName} · {talukName}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{config.kpiLabelEnM1}</span>
                <span className="tscwk-num" style={{ fontSize: "16px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{fmtVal(kpis.m1, config.metric1.fmt)} {config.metric1.unit || ""}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{config.kpiLabelEnM2}</span>
                <span className="tscwk-num" style={{ fontSize: "16px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{fmtVal(kpis.m2, config.metric2.fmt)} {config.metric2.unit || ""}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "260px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{config.metric1.en} by Week</span>
                <span className="tscwk-num" style={{ fontSize: "11.5px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>
                  W1: {fmtVal(kpis.byWeekM1[1], config.metric1.fmt)} &nbsp;|&nbsp; W2: {fmtVal(kpis.byWeekM1[2], config.metric1.fmt)}
                </span>
                <span className="tscwk-num" style={{ fontSize: "11.5px", color: "#a16207", fontWeight: 700, marginTop: "1px" }}>
                  W3: {fmtVal(kpis.byWeekM1[3], config.metric1.fmt)} &nbsp;|&nbsp; W4: {fmtVal(kpis.byWeekM1[4], config.metric1.fmt)}
                </span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Top Race · {config.metric1.en}</span>
                <span style={{ fontSize: "13px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{kpis.topRace[0]}</span>
                <span className="tscwk-num" style={{ fontSize: "11px", color: "#6d28d9", fontWeight: 700, marginTop: "2px" }}>{fmtVal(kpis.topRace[1], config.metric1.fmt)} {config.metric1.unit || ""}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Distinct Races</span>
                <span className="tscwk-num" style={{ fontSize: "16px", color: "#155e75", fontWeight: 800, marginTop: "2px" }}>{kpis.races}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                {config.formNo} · {config.headerBlurbKn} — {talukName} — {monthKn} {filter.year}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  {config.headerBlurbEn} · Race × Week · {monthLabel} {filter.year}
                </div>
              </div>

              <div className="tscwk-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "900px" }}>
                  <thead>
                    <tr>
                      {[
                        { kn: "ಕ್ರ.ಸಂ.", en: "Sl",        w: 60,  bg: "linear-gradient(135deg,#1e293b,#36506b)", align: "center" },
                        { kn: "ತಳಿ",     en: "Race",      w: 240, bg: "linear-gradient(135deg,#a16207,#ca8a04)", align: "left" },
                        { kn: "ವಾರ",     en: "Week",      w: 140, bg: "linear-gradient(135deg,#5b21b6,#7c3aed)", align: "center" },
                        { kn: config.metric1.kn, en: config.metric1.en, w: 170, bg: m1Pal.hdr, align: "right" },
                        { kn: config.metric2.kn, en: config.metric2.en, w: 170, bg: m2Pal.hdr, align: "right" },
                      ].map((c, i) => (
                        <th key={i} style={{
                          background: c.bg, color: "#fff",
                          padding: "10px 10px", textAlign: c.align === "left" ? "left" : "center",
                          border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: c.w,
                          position: "sticky", top: 0, zIndex: 2,
                        }}>
                          <div style={{ fontSize: "12px" }}>{c.kn}</div>
                          <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && (
                      <tr><td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>{dataRows.length === 0 ? "ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / No records found." : `No matches for "${search}".`}</td></tr>
                    )}
                    {filteredRows.map((row, ri) => {
                      const isFirstInGroup = firstRowOfGroup.has(ri);
                      const groupSize = isFirstInGroup ? groupSizeAt.get(ri) : 0;
                      const groupIdx = groupIdxAt.get(ri) || 0;
                      const rowBg = groupIdx % 2 === 1 ? "#f8fafc" : "#ffffff";
                      const rTone = raceTone(row.race);
                      const wk = Number(row.week_no);
                      const wkTone = WEEK_TONES[wk] || { bg: "#e2e8f0", color: "#334155", label: `Wk ${row.week_no}` };
                      const m1V = row[config.metric1.key]; const m2V = row[config.metric2.key];
                      const m1Has = numOrZero(m1V) !== 0; const m2Has = numOrZero(m2V) !== 0;
                      const cb = { padding: "9px 10px", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6", fontSize: "12px", verticalAlign: "middle" };
                      return (
                        <tr key={`${row.sl_no}-${row.race}-${row.week_no}-${ri}`} className="tscwk-tr" style={{ background: rowBg }}>
                          <td style={{ ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0", color: "#475569", fontWeight: 700 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#1e293b", fontWeight: 800, fontSize: "11px" }}>{row.sl_no}</span>
                          </td>
                          {isFirstInGroup ? (
                            <td rowSpan={groupSize} style={{ ...cb, textAlign: "left", paddingLeft: "14px", borderRight: "2px solid #e2e8f0", background: groupIdx % 2 === 1 ? "#f1f5f9" : "#f8fafc" }}>
                              <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "12px", background: rTone.bg, color: rTone.color, fontWeight: 800, fontSize: "12px" }}>
                                {row.race || "—"}
                              </span>
                            </td>
                          ) : null}
                          <td style={{ ...cb, textAlign: "center" }}>
                            <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "12px", background: wkTone.bg, color: wkTone.color, fontWeight: 800, fontSize: "11px" }}>
                              {wkTone.label}
                            </span>
                          </td>
                          <td className="tscwk-num" style={{ ...cb, textAlign: "right", paddingRight: "16px", background: m1Has ? m1Pal.cellBg : "transparent", color: m1Has ? m1Pal.text : "#cbd5e0", fontWeight: 700 }}>
                            {m1Has ? fmtVal(m1V, config.metric1.fmt) : "—"}
                          </td>
                          <td className="tscwk-num" style={{ ...cb, textAlign: "right", paddingRight: "16px", background: m2Has ? m2Pal.cellBg : "transparent", color: m2Has ? m2Pal.text : "#cbd5e0", fontWeight: 700 }}>
                            {m2Has ? fmtVal(m2V, config.metric2.fmt) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {districtName} · {talukName} — {monthLabel} {monthKn} {filter.year} &nbsp;·&nbsp; {config.formNo} · Race × Week
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

// ── Sheet 10a — Weekly Brushing (Form S-2) ──────────────────────────────────
const WEEKLY_BRUSHING_CONFIG = {
  pageTitleEn: "TSC Monthly Weekly Brushing — Sheet 10a",
  pageTitleKn: "ವಾರವಾರು ಚಾಕಿ ಪ್ರಗತಿ — ಮಾಸಿಕ",
  sheetBadge:  "ನಮೂನೆ ಎಸ್-2 · Sheet 10a",
  formNo:      "Form S-2",
  icon:        "🥚",
  gradient:    "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#5b57ac 100%)",
  headerBlurbKn: "ವಾರವಾರು ಚಾಕಿ ಪ್ರಗತಿ",
  headerBlurbEn: "Weekly Brushing Progress",
  endpoint:      "grainage-progress-report/tsc-monthly/weekly-brushing",
  downloadFilenamePrefix: "tsc_monthly_weekly_brushing",
  metric1: { kn: "ಚಾಕಿಯಾದ ಬೆಳೆ", en: "Brushed", key: "brushed", fmt: "int", paletteKey: "teal", unit: "DFLs" },
  metric2: { kn: "ವಿಫಲವಾದ ಬೆಳೆ", en: "Failed",  key: "failed",  fmt: "int", paletteKey: "red",  unit: "" },
  kpiLabelEnM1: "Total Brushed (DFLs)",
  kpiLabelEnM2: "Total Failed",
};

// ── Sheet 10b — Weekly Cocoon Production (Form S-3) ─────────────────────────
const WEEKLY_COCOON_CONFIG = {
  pageTitleEn: "TSC Monthly Weekly Cocoon Production — Sheet 10b",
  pageTitleKn: "ವಾರವಾರು ಗೂಡು ಉತ್ಪಾದನೆ — ಮಾಸಿಕ",
  sheetBadge:  "ನಮೂನೆ ಎಸ್-3 · Sheet 10b",
  formNo:      "Form S-3",
  icon:        "🟫",
  gradient:    "linear-gradient(135deg,#a16207 0%,#ca8a04 50%,#0f766e 100%)",
  headerBlurbKn: "ವಾರವಾರು ಗೂಡು ಉತ್ಪಾದನೆ",
  headerBlurbEn: "Weekly Cocoon Production",
  endpoint:      "grainage-progress-report/tsc-monthly/weekly-cocoon",
  downloadFilenamePrefix: "tsc_monthly_weekly_cocoon",
  metric1: { kn: "ಗೂಡು ಕೆ.ಜಿ", en: "Cocoon (kg)", key: "cocoon_kg", fmt: "dec", paletteKey: "amber", unit: "kg" },
  metric2: { kn: "ಬೆಳೆ ಸಂಖ್ಯೆ", en: "Crops",      key: "crops",     fmt: "int", paletteKey: "green", unit: "" },
  kpiLabelEnM1: "Total Cocoon (kg)",
  kpiLabelEnM2: "Total Crops",
};

// ── Sheet 11a — NS-1 Race-Week Chawki Target & Achievement ──────────────────
const NS1_CONFIG = {
  pageTitleEn: "TSC Monthly NS-1 Chawki Target & Achievement — Sheet 11a",
  pageTitleKn: "ತಳಿವಾರು ಚಾಕಿ ಗುರಿ ಮತ್ತು ಸಾಧನೆ — ಮಾಸಿಕ",
  sheetBadge:  "ನಮೂನೆ ಎನ್.ಎಸ್-1 · Sheet 11a",
  formNo:      "Form NS-1",
  icon:        "🎯",
  gradient:    "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 50%,#7c3aed 100%)",
  headerBlurbKn: "ತಳಿವಾರು ಚಾಕಿ ಗುರಿ ಮತ್ತು ಸಾಧನೆ",
  headerBlurbEn: "Race-Week Chawki Target & Achievement",
  endpoint:      "grainage-progress-report/tsc-monthly/ns1-chawki",
  downloadFilenamePrefix: "tsc_monthly_ns1_chawki",
  metric1: { kn: "ಗುರಿ",   en: "Target",      key: "target",      fmt: "dec", paletteKey: "blue",  unit: "" },
  metric2: { kn: "ಸಾಧನೆ", en: "Achievement",  key: "achievement", fmt: "int", paletteKey: "green", unit: "" },
  kpiLabelEnM1: "Total Target",
  kpiLabelEnM2: "Total Achievement",
};

// ── Sheet 11b — NS-2 Weekly Cocoon with Ripe Eggs ───────────────────────────
const NS2_CONFIG = {
  pageTitleEn: "TSC Monthly NS-2 Weekly Cocoon Production — Sheet 11b",
  pageTitleKn: "ತಳಿವಾರು ವಾರವಾರು ಗೂಡು ಉತ್ಪಾದನೆ — ಮಾಸಿಕ",
  sheetBadge:  "ನಮೂನೆ ಎನ್.ಎಸ್-2 · Sheet 11b",
  formNo:      "Form NS-2",
  icon:        "🥚",
  gradient:    "linear-gradient(135deg,#7c3aed 0%,#a78bfa 50%,#a16207 100%)",
  headerBlurbKn: "ತಳಿವಾರು:ವಾರವಾರು ಗೂಡು ಉತ್ಪಾದನೆ",
  headerBlurbEn: "Race-Week Cocoon Production with Ripe Eggs",
  endpoint:      "grainage-progress-report/tsc-monthly/ns2-cocoon",
  downloadFilenamePrefix: "tsc_monthly_ns2_cocoon",
  metric1: { kn: "ಹಣ್ಣಾದ ಮೊಟ್ಟೆಗಳು", en: "Ripe Eggs",    key: "ripe_eggs", fmt: "dec", paletteKey: "purple", unit: "" },
  metric2: { kn: "ಗೂಡು ಕೆ.ಜಿ",      en: "Cocoon (kg)",  key: "cocoon_kg", fmt: "dec", paletteKey: "amber",  unit: "kg" },
  kpiLabelEnM1: "Total Ripe Eggs",
  kpiLabelEnM2: "Total Cocoon (kg)",
};

// ── Sheet 13a — S-4 Race-Week Seed Cocoon Production ────────────────────────
const S4_SEED_COCOON_CONFIG = {
  pageTitleEn: "TSC Monthly S-4 Seed Cocoon Weekly Production — Sheet 13a",
  pageTitleKn: "ತಳಿವಾರು:ವಾರವಾರು ಬಿತ್ತನೆ ಗೂಡುಗಳ ಉತ್ಪಾದನೆ — ಮಾಸಿಕ",
  sheetBadge:  "ನಮೂನೆ ಎಸ್-4 · Sheet 13a",
  formNo:      "Form S-4",
  icon:        "🪺",
  gradient:    "linear-gradient(135deg,#15803d 0%,#22c55e 50%,#a16207 100%)",
  headerBlurbKn: "ತಳಿವಾರು:ವಾರವಾರು ಬಿತ್ತನೆ ಗೂಡುಗಳ ಉತ್ಪಾದನೆ",
  headerBlurbEn: "Race-Week Seed Cocoon Production",
  endpoint:      "grainage-progress-report/tsc-monthly/s4-weekly",
  downloadFilenamePrefix: "tsc_monthly_s4_weekly",
  metric1: { kn: "ಬೆಳೆ ಸಂಖ್ಯೆ", en: "Crops",       key: "crops",     fmt: "int", paletteKey: "green", unit: "" },
  metric2: { kn: "ಗೂಡು ಕೆ.ಜಿ", en: "Cocoon (kg)",  key: "cocoon_kg", fmt: "dec", paletteKey: "amber", unit: "kg" },
  kpiLabelEnM1: "Total Crops",
  kpiLabelEnM2: "Total Cocoon (kg)",
};

export function TscMonthlyWeeklyBrushingReport()         { return <TscMonthlyWeeklyReport config={WEEKLY_BRUSHING_CONFIG} />; }
export function TscMonthlyWeeklyCocoonReport()           { return <TscMonthlyWeeklyReport config={WEEKLY_COCOON_CONFIG}   />; }
export function TscMonthlyNs1ChawkiReport()              { return <TscMonthlyWeeklyReport config={NS1_CONFIG}             />; }
export function TscMonthlyNs2CocoonReport()              { return <TscMonthlyWeeklyReport config={NS2_CONFIG}             />; }
export function TscMonthlyS4SeedCocoonWeeklyReport()     { return <TscMonthlyWeeklyReport config={S4_SEED_COCOON_CONFIG}  />; }

export default TscMonthlyWeeklyReport;
