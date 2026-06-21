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

if (!document.getElementById("tscp1chk-styles")) {
  const s = document.createElement("style");
  s.id = "tscp1chk-styles";
  s.innerHTML = `
    .tscp1chk-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tscp1chk-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tscp1chk-swal .swal2-icon { margin:20px auto 4px !important; }
    .tscp1chk-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tscp1chk-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tscp1chk-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tscp1chk-wrap { animation: tscp1chk-in .35s ease; }
    .tscp1chk-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tscp1chk-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tscp1chk-scroll::-webkit-scrollbar { height:9px; }
    .tscp1chk-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tscp1chk-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
    .tscp1chk-pbar-track { width:100%; height:5px; background:rgba(0,0,0,.06); border-radius:99px; overflow:hidden; margin-top:4px; }
    .tscp1chk-pbar-fill  { height:100%; border-radius:99px; transition:width .4s ease; }
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
  null,
  { bg: "linear-gradient(135deg,#e0f2fe,#bae6fd)", color: "#075985", label: "Wk 1" },
  { bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d", label: "Wk 2" },
  { bg: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#854d0e", label: "Wk 3" },
  { bg: "linear-gradient(135deg,#fbcfe8,#f9a8d4)", color: "#9d174d", label: "Wk 4" },
];

const chawkiBarColor = (pct) => {
  if (pct >= 90) return "#16a34a";
  if (pct >= 75) return "#22c55e";
  if (pct >= 60) return "#fbbf24";
  if (pct >  0)  return "#f87171";
  return "#cbd5e1";
};

function TscMonthlyP1ChawkiLotwiseReport() {
  const { t } = useTranslation();

  const today = new Date();
  const [filter, setFilter] = useState({ districtId: "", talukId: "", year: today.getFullYear(), month: today.getMonth() + 1 });
  const [districtList, setDistrictList] = useState([]);
  const [talukList, setTalukList] = useState([]);
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
      confirmButtonText: "Got it", confirmButtonColor: "#d97706", background: "#fff", customClass: { popup: "tscp1chk-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e", background: "#fff", customClass: { popup: "tscp1chk-swal" },
    });

  const params = () => ({ talukId: filter.talukId, year: Number(filter.year), month: Number(filter.month) });

  const handleView = async (e) => {
    e.preventDefault(); const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/p1-chawki-lotwise", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the TSC Monthly P1 Chawki Lot-wise (Sheet 14) report.");
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/p1-chawki-lotwise/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); } finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/p1-chawki-lotwise/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      a.download = `tsc_monthly_p1_chawki_lotwise_${filter.talukId}_${filter.year}_${filter.month}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); } finally { setIsDownloadingExcel(false); }
  };

  const districtName = districtList.find((d) => String(d.districtId) === String(filter.districtId))?.districtName || "—";
  const talukName    = talukList.find((tk) => String(tk.talukId) === String(filter.talukId))?.talukName || "—";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn      = MONTH_KN[Number(filter.month)] || "";

  // When searching, show only matching DATA rows (hide subtotal/note/total);
  // otherwise show the full assembled list (data + weekly subtotals + grand total).
  const filteredRows = useMemo(() => {
    if (!search.trim()) return dataRows;
    const q = search.trim().toLowerCase();
    return dataRows.filter((r) =>
      r.row_type === "data" &&
      [r.zone, r.tsc_name, r.farmer_name, r.village, r.lot_number, r.race].some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [dataRows, search]);

  const kpis = useMemo(() => {
    let totalDfls = 0, pctSum = 0, pctCount = 0, events = 0;
    const farmers = new Set(), villages = new Set(), tscs = new Set(), lots = new Set();
    const byRace = {};
    const byWeek = { 1: 0, 2: 0, 3: 0, 4: 0 };
    dataRows.forEach((r) => {
      if (r.row_type === "subtotal") {
        // farmer_name like "1ನೇ ವಾರದ ಒಟ್ಟು (...)" -> pull leading digit
        const m = String(r.farmer_name || "").match(/^(\d)/);
        if (m) byWeek[Number(m[1])] = numOrZero(r.dfls);
        return;
      }
      if (r.row_type !== "data") return;
      events++;
      totalDfls += numOrZero(r.dfls);
      const p = numOrZero(r.chawki_pct);
      if (p > 0) { pctSum += p; pctCount++; }
      if (r.farmer_name) farmers.add(r.farmer_name);
      if (r.village)     villages.add(r.village);
      if (r.tsc_name)    tscs.add(r.tsc_name);
      if (r.lot_number)  lots.add(r.lot_number);
      const rc = r.race || "—";
      byRace[rc] = (byRace[rc] || 0) + numOrZero(r.dfls);
    });
    const avgPct = pctCount > 0 ? pctSum / pctCount : 0;
    const top    = Object.entries(byRace).sort((a, b) => b[1] - a[1])[0] || ["—", 0];
    return {
      events, totalDfls, avgPct,
      farmers: farmers.size, villages: villages.size, tscs: tscs.size, lots: lots.size,
      byWeek, topRace: top[0], topRaceDfls: top[1],
    };
  }, [dataRows]);

  return (
    <Layout title={t("TSC Monthly P1 Chawki Lot-wise — Sheet 14")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ದ್ವಿತಳಿ ಪಿ1 ಚಾಕಿಯ ಕುಳುವಾರು ವರದಿ — ಮಾಸಿಕ")}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                Sheet 14 · P1 Chawki · per-farmer
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 50%,#0f766e 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🐛</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ದ್ವಿತಳಿ ಪಿ1 ಚಾಕಿಯ ಕುಳುವಾರು — Bivoltine P1 Chawki Lot-wise Detail
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>SHEET 14</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>
                Per-farmer P1 brushing events · Week · TSC · Farmer · Village · Lot · BCO/Race · DFLs · % Chawki
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
                  <Col md={8}>
                    <label style={lbl}>Quick Search (ವಲಯ, TSC, Farmer, Village, Lot, Race)</label>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type to filter…" style={{ ...sel, padding: "8px 12px" }} />
                  </Col>
                  <Col md={4}>
                    <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                      <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                        {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> PDF…</> : <>📄 PDF</>}
                      </button>
                      <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                        {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> Excel…</> : <>📊 Excel</>}
                      </button>
                    </div>
                  </Col>
                </Row>
              )}
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="tscp1chk-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-stretch">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>District / Taluk</span>
                <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{districtName} · {talukName}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Brushing Events</span>
                <span className="tscp1chk-num" style={{ fontSize: "18px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{kpis.events.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Total DFLs</span>
                <span className="tscp1chk-num" style={{ fontSize: "18px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.totalDfls)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Avg % Chawki</span>
                <span className="tscp1chk-num" style={{ fontSize: "18px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{fmtDec(kpis.avgPct)}%</span>
                <div className="tscp1chk-pbar-track">
                  <div className="tscp1chk-pbar-fill" style={{ width: `${Math.min(100, kpis.avgPct)}%`, background: chawkiBarColor(kpis.avgPct) }} />
                </div>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>TSCs / Farmers / Villages / Lots</span>
                <span className="tscp1chk-num" style={{ fontSize: "13px", color: "#155e75", fontWeight: 800, marginTop: "2px" }}>{kpis.tscs} / {kpis.farmers} / {kpis.villages} / {kpis.lots}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef9ec,#fef3c7)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 16px", minWidth: "260px" }}>
                <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#92400e", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "5px" }}>DFLs by Week</div>
                <div style={{ display: "flex", alignItems: "stretch", gap: "5px" }}>
                  {[1, 2, 3, 4].map((w) => {
                    const tone = WEEK_TONES[w];
                    return (
                      <div key={w} style={{ flex: 1, background: tone.bg, color: tone.color, borderRadius: "8px", padding: "5px 4px", textAlign: "center" }}>
                        <div style={{ fontSize: "9px", fontWeight: 800, opacity: .85 }}>{tone.label}</div>
                        <div className="tscp1chk-num" style={{ fontSize: "11.5px", fontWeight: 900, marginTop: "1px" }}>{fmtInt(kpis.byWeek[w])}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Top Race · DFLs</span>
                <span style={{ fontSize: "13px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{kpis.topRace}</span>
                <span className="tscp1chk-num" style={{ fontSize: "11px", color: "#6d28d9", fontWeight: 700, marginTop: "2px" }}>{fmtInt(kpis.topRaceDfls)} DFLs</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "14.5px", textAlign: "center", lineHeight: 1.5 }}>
                ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ {talukName} {monthKn} – {filter.year} ನೇ ಮಾಹೆಯ ದ್ವಿತಳಿ ಪಿ1 ಚಾಕಿಯ ಕುಳುವಾರು ವರದಿ
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  {districtName} · Bivoltine P1 Chawki Lot-wise · {monthLabel} {filter.year}
                </div>
              </div>

              <div className="tscp1chk-scroll" style={{ overflowX: "auto", maxHeight: "72vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1500px" }}>
                  <thead>
                    <tr>
                      {[
                        { kn: "ಕ್ರ.ಸಂ.",                  w: 55,  bg: "linear-gradient(135deg,#1e293b,#36506b)", align: "center" },
                        { kn: "ವಲಯ",                     w: 140, bg: "linear-gradient(135deg,#5b21b6,#7c3aed)", align: "left" },
                        { kn: "ತಾಂ.ಸೇ.ಕೇ",              w: 150, bg: "linear-gradient(135deg,#334155,#475569)", align: "left" },
                        { kn: "ರೈತರ ಹೆಸರು / ತಂದೆಯ ಹೆಸರು", w: 220, bg: "linear-gradient(135deg,#0f766e,#14b8a6)", align: "left" },
                        { kn: "ಗ್ರಾಮ",                   w: 140, bg: "linear-gradient(135deg,#0e7490,#06b6d4)", align: "left" },
                        { kn: "ತಂಡ ಸಂಖ್ಯೆ",              w: 120, bg: "linear-gradient(135deg,#1d4ed8,#3b82f6)", align: "center" },
                        { kn: "ತಳಿ",                     w: 150, bg: "linear-gradient(135deg,#a16207,#ca8a04)", align: "center" },
                        { kn: "ಮೊಟ್ಟೆ",                  w: 110, bg: "linear-gradient(135deg,#15803d,#22c55e)", align: "right" },
                        { kn: "ಚಾಕಿ ದಿನಾಂಕ",             w: 140, bg: "linear-gradient(135deg,#9d174d,#db2777)", align: "center" },
                        { kn: "ಶೇ ಚಾಕಿ",                 w: 150, bg: "linear-gradient(135deg,#a16207,#fbbf24)", align: "center" },
                      ].map((c, i) => (
                        <th key={i} style={{
                          background: c.bg, color: "#fff",
                          padding: "11px 10px", textAlign: c.align === "left" ? "left" : "center",
                          border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: c.w,
                          position: "sticky", top: 0, zIndex: 2, fontSize: "12px",
                        }}>{c.kn}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && (
                      <tr><td colSpan={10} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>{dataRows.length === 0 ? "ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / No records found." : `No matches for the current filters.`}</td></tr>
                    )}
                    {filteredRows.map((row, ri) => {
                      const cb = { padding: "9px 10px", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6", fontSize: "12px", verticalAlign: "middle", whiteSpace: "nowrap" };
                      const rt = row.row_type;

                      // Weekly subtotal / "no data" note rows (yellow band)
                      if (rt === "subtotal" || rt === "note") {
                        return (
                          <tr key={`sub-${ri}`}>
                            <td colSpan={7} style={{ ...cb, textAlign: rt === "note" ? "center" : "right", paddingRight: "14px", background: "#fff9c4", color: "#7c5b00", fontWeight: 800, whiteSpace: "normal" }}>
                              {row.farmer_name}
                            </td>
                            <td className="tscp1chk-num" style={{ ...cb, textAlign: "right", paddingRight: "16px", background: "#fff59d", color: "#5c4400", fontWeight: 900 }}>
                              {rt === "subtotal" ? fmtInt(row.dfls) : ""}
                            </td>
                            <td colSpan={2} style={{ ...cb, background: "#fff9c4" }} />
                          </tr>
                        );
                      }
                      // Grand total row
                      if (rt === "total") {
                        return (
                          <tr key={`tot-${ri}`}>
                            <td colSpan={7} style={{ ...cb, textAlign: "right", paddingRight: "14px", background: "linear-gradient(135deg,#fed7aa,#fdba74)", color: "#7c2d12", fontWeight: 900, fontSize: "13px" }}>
                              {row.farmer_name}
                            </td>
                            <td className="tscp1chk-num" style={{ ...cb, textAlign: "right", paddingRight: "16px", background: "linear-gradient(135deg,#fdba74,#fb923c)", color: "#7c2d12", fontWeight: 900, fontSize: "13px" }}>
                              {fmtInt(row.dfls)}
                            </td>
                            <td colSpan={2} style={{ ...cb, background: "linear-gradient(135deg,#fed7aa,#fdba74)" }} />
                          </tr>
                        );
                      }

                      // Normal data row
                      const rowBg = ri % 2 === 1 ? "#f8fafc" : "#ffffff";
                      const rTone = raceTone(row.race);
                      const dfls = numOrZero(row.dfls);
                      const pct  = numOrZero(row.chawki_pct);
                      const pctClamped = Math.min(100, pct);
                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="tscp1chk-tr" style={{ background: rowBg }}>
                          <td style={{ ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0", color: "#475569", fontWeight: 700 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#1e293b", fontWeight: 800, fontSize: "11px" }}>{row.sl_no}</span>
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "12px", color: "#5b21b6", fontWeight: 700, whiteSpace: "normal" }}>
                            {row.zone || "—"}
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "12px", color: "#0f172a", fontWeight: 700, whiteSpace: "normal" }}>
                            {row.tsc_name || "—"}
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "12px", color: "#0f172a", fontWeight: 700, whiteSpace: "normal" }}>
                            👤 {row.farmer_name || "—"}
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "12px", color: "#0f172a", whiteSpace: "normal" }}>
                            🏘 {row.village || "—"}
                          </td>
                          <td style={{ ...cb, textAlign: "center" }}>
                            {row.lot_number ? (
                              <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "8px", background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1e40af", fontWeight: 800, fontSize: "11.5px", fontFamily: "monospace" }}>
                                #{row.lot_number}
                              </span>
                            ) : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td style={{ ...cb, textAlign: "center", whiteSpace: "normal" }}>
                            {row.race ? (
                              <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "12px", background: rTone.bg, color: rTone.color, fontWeight: 800, fontSize: "11.5px" }}>{row.race}</span>
                            ) : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td className="tscp1chk-num" style={{
                            ...cb, textAlign: "right", paddingRight: "16px",
                            background: dfls > 0 ? "linear-gradient(135deg,#dcfce7,#bbf7d0)" : "transparent",
                            color: dfls > 0 ? "#14532d" : "#cbd5e0",
                            fontWeight: 800,
                          }}>
                            {dfls > 0 ? fmtInt(row.dfls) : "—"}
                          </td>
                          <td style={{ ...cb, textAlign: "center" }}>
                            {row.brushing_date ? (
                              <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "9px", background: "linear-gradient(135deg,#fce7f3,#fbcfe8)", color: "#9d174d", fontWeight: 800, fontSize: "11.5px", fontFamily: "monospace" }}>
                                📅 {row.brushing_date}
                              </span>
                            ) : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td className="tscp1chk-num" style={{
                            ...cb, textAlign: "center",
                            background: pct > 0 ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : "transparent",
                            color: pct > 0 ? "#78350f" : "#cbd5e0",
                            fontWeight: 800,
                          }}>
                            {pct > 0 ? (
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                                <span style={{ fontSize: "13px" }}>{fmtDec(row.chawki_pct)}%</span>
                                <div className="tscp1chk-pbar-track" style={{ marginTop: "4px" }}>
                                  <div className="tscp1chk-pbar-fill" style={{ width: `${pctClamped}%`, background: chawkiBarColor(pct) }} />
                                </div>
                              </div>
                            ) : "—"}
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
                  &nbsp;·&nbsp; Sheet 14 · P1 Chawki Lot-wise · {filteredRows.length} / {dataRows.length} rows
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

export default TscMonthlyP1ChawkiLotwiseReport;
