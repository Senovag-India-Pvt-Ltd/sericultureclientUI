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

if (!document.getElementById("tscs4b-styles")) {
  const s = document.createElement("style");
  s.id = "tscs4b-styles";
  s.innerHTML = `
    .tscs4b-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tscs4b-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tscs4b-swal .swal2-icon { margin:20px auto 4px !important; }
    .tscs4b-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tscs4b-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tscs4b-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tscs4b-wrap { animation: tscs4b-in .35s ease; }
    .tscs4b-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tscs4b-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tscs4b-scroll::-webkit-scrollbar { height:9px; }
    .tscs4b-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tscs4b-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
    .tscs4b-pbar-track { width:100%; height:5px; background:rgba(0,0,0,.06); border-radius:99px; overflow:hidden; margin-top:4px; }
    .tscs4b-pbar-fill  { height:100%; border-radius:99px; transition:width .4s ease; }
    .tscs4b-yield-ring {
      display:inline-flex; align-items:center; justify-content:center;
      width:46px; height:46px; border-radius:50%;
      font-weight:900; font-size:11.5px;
      box-shadow:inset 0 0 0 3px rgba(255,255,255,.55);
    }
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

// Yield rating thresholds (kg per 100 DFLs)
const yieldRating = (avg) => {
  if (avg >= 50) return { bg: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", label: "Excellent", icon: "🏆" };
  if (avg >= 35) return { bg: "linear-gradient(135deg,#0f766e,#14b8a6)", color: "#fff", label: "Good",      icon: "✓" };
  if (avg >= 25) return { bg: "linear-gradient(135deg,#ca8a04,#fbbf24)", color: "#78350f", label: "Average", icon: "•" };
  if (avg > 0)   return { bg: "linear-gradient(135deg,#dc2626,#f87171)", color: "#fff", label: "Low",       icon: "✗" };
  return            { bg: "linear-gradient(135deg,#cbd5e1,#e2e8f0)", color: "#475569", label: "—",          icon: "—" };
};

function TscMonthlyS4SummaryReport() {
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
      confirmButtonText: "Got it", confirmButtonColor: "#d97706", background: "#fff", customClass: { popup: "tscs4b-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e", background: "#fff", customClass: { popup: "tscs4b-swal" },
    });

  const params = () => ({ talukId: filter.talukId, year: Number(filter.year), month: Number(filter.month) });

  const handleView = async (e) => {
    e.preventDefault(); const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/s4-summary", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the TSC Monthly S-4 Per-Race Summary (Sheet 13b) report.");
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/s4-summary/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); } finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/s4-summary/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      a.download = `tsc_monthly_s4_summary_${filter.talukId}_${filter.year}_${filter.month}.xlsx`;
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
    return dataRows.filter((r) => String(r.race ?? "").toLowerCase().includes(q));
  }, [dataRows, search]);

  const kpis = useMemo(() => {
    let bMo = 0, bMe = 0, rMo = 0, rMe = 0, cMo = 0, cMe = 0;
    let bestYield = -1, bestYieldRace = "—";
    let topCocoonKg = -1, topCocoonRace = "—";
    dataRows.forEach((r) => {
      bMo += numOrZero(r.brushed_mo);
      bMe += numOrZero(r.brushed_me);
      rMo += numOrZero(r.ripe_mo);
      rMe += numOrZero(r.ripe_me);
      cMo += numOrZero(r.cocoon_mo);
      cMe += numOrZero(r.cocoon_me);
      const y = numOrZero(r.avg_yield);
      if (y > bestYield) { bestYield = y; bestYieldRace = r.race || "—"; }
      const ck = numOrZero(r.cocoon_me);
      if (ck > topCocoonKg) { topCocoonKg = ck; topCocoonRace = r.race || "—"; }
    });
    const overallAvg = bMe > 0 ? (cMe * 100) / bMe : 0;
    const ripeRate   = bMe > 0 ? (rMe * 100) / bMe : 0;
    return { bMo, bMe, rMo, rMe, cMo, cMe, bestYield: bestYield < 0 ? 0 : bestYield, bestYieldRace, topCocoonKg: topCocoonKg < 0 ? 0 : topCocoonKg, topCocoonRace, overallAvg, ripeRate };
  }, [dataRows]);

  const overallRating = yieldRating(kpis.overallAvg);

  return (
    <Layout title={t("TSC Monthly S-4 Per-Race Summary — Sheet 13b")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ತಳಿವಾರು ಸಂಕ್ಷಿಪ್ತ ವರದಿ — ಮಾಸಿಕ")}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                ನಮೂನೆ ಎಸ್-4 · Sheet 13b
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#a16207 0%,#ca8a04 50%,#7c3aed 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>📊</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ತಳಿವಾರು ಸಂಕ್ಷಿಪ್ತ — Per-Race Brushing → Ripening → Cocoon Yield Summary
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>FORM S-4</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>
                Brushed (Mo / ME) → Ripe (Mo / ME) → Cocoon kg (Mo / ME) — with Avg Yield rating per race
              </div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{monthLabel} · {monthKn} {filter.year}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{filteredRows.length} / {dataRows.length} races</span>
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
                    <label style={lbl}>Quick Search (Race)</label>
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
          <div className="tscs4b-wrap mt-4">
            {/* KPI pills — Hero overall yield + flow funnel + tops */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-stretch">
              {/* Hero — Overall Avg Yield ring */}
              <div style={{
                background: overallRating.bg, color: overallRating.color,
                borderRadius: "14px", padding: "12px 18px",
                minWidth: "240px", display: "flex", alignItems: "center", gap: "12px",
                boxShadow: "0 6px 18px rgba(0,0,0,.08)",
              }}>
                <div className="tscs4b-yield-ring" style={{ background: "rgba(255,255,255,.25)", color: overallRating.color }}>
                  {overallRating.icon}
                </div>
                <div>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, opacity: .85, textTransform: "uppercase", letterSpacing: ".07em" }}>Overall Avg Yield</div>
                  <div className="tscs4b-num" style={{ fontSize: "20px", fontWeight: 900, marginTop: "2px", letterSpacing: ".01em" }}>{fmtDec(kpis.overallAvg)}</div>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, opacity: .9 }}>kg / 100 DFLs · {overallRating.label}</div>
                </div>
              </div>

              {/* Funnel: Brushed → Ripe → Cocoon */}
              <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "10px 16px", minWidth: "320px" }}>
                <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "6px" }}>ME Funnel · Brushed → Ripe → Cocoon</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1e40af", padding: "5px 11px", borderRadius: "9px", fontWeight: 800, fontSize: "12.5px" }}>
                    {fmtInt(kpis.bMe)} <span style={{ fontSize: "9.5px", opacity: .8 }}>brushed</span>
                  </div>
                  <span style={{ color: "#94a3b8", fontWeight: 700 }}>›</span>
                  <div style={{ background: "linear-gradient(135deg,#ede9fe,#ddd6fe)", color: "#5b21b6", padding: "5px 11px", borderRadius: "9px", fontWeight: 800, fontSize: "12.5px" }}>
                    {fmtInt(kpis.rMe)} <span style={{ fontSize: "9.5px", opacity: .8 }}>ripe</span>
                  </div>
                  <span style={{ color: "#94a3b8", fontWeight: 700 }}>›</span>
                  <div style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#854d0e", padding: "5px 11px", borderRadius: "9px", fontWeight: 800, fontSize: "12.5px" }}>
                    {fmtDec(kpis.cMe)} <span style={{ fontSize: "9.5px", opacity: .8 }}>kg cocoon</span>
                  </div>
                </div>
                <div className="tscs4b-pbar-track" style={{ marginTop: "8px" }}>
                  <div className="tscs4b-pbar-fill" style={{
                    width: `${Math.min(100, kpis.ripeRate)}%`,
                    background: kpis.ripeRate >= 80 ? "#22c55e" : kpis.ripeRate >= 50 ? "#fbbf24" : "#dc2626",
                  }} />
                </div>
                <div style={{ fontSize: "10.5px", color: "#475569", fontWeight: 700, marginTop: "3px" }}>
                  Ripe / Brushed: <span style={{ color: "#1a202c" }}>{kpis.ripeRate.toFixed(2)}%</span>
                </div>
              </div>

              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Best Yield Race</span>
                <span style={{ fontSize: "13px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>🏆 {kpis.bestYieldRace}</span>
                <span className="tscs4b-num" style={{ fontSize: "11px", color: "#15803d", fontWeight: 700, marginTop: "2px" }}>{fmtDec(kpis.bestYield)} kg / 100 DFLs</span>
              </div>

              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Top Cocoon Race · ME</span>
                <span style={{ fontSize: "13px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>🏅 {kpis.topCocoonRace}</span>
                <span className="tscs4b-num" style={{ fontSize: "11px", color: "#a16207", fontWeight: 700, marginTop: "2px" }}>{fmtDec(kpis.topCocoonKg)} kg</span>
              </div>

              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>District / Taluk</span>
                <span style={{ fontSize: "12.5px", color: "#155e75", fontWeight: 700, marginTop: "2px" }}>{districtName}</span>
                <span style={{ fontSize: "12px", color: "#0e7490", fontWeight: 700 }}>{talukName}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ನಮೂನೆ ಎಸ್-4 · ತಳಿವಾರು ಸಂಕ್ಷಿಪ್ತ ವರದಿ — {talukName} — {monthKn} {filter.year}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Form S-4 · Per-Race Summary · Brushed / Ripe / Cocoon (Mo + ME) + Avg Yield · {monthLabel} {filter.year}
                </div>
              </div>

              <div className="tscs4b-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1300px" }}>
                  <thead>
                    {/* Row 1 — group bands */}
                    <tr>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)", color: "#fff",
                        padding: "10px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "60px", verticalAlign: "middle",
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#a16207,#ca8a04)", color: "#fff",
                        padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "220px", verticalAlign: "middle",
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ತಳಿ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Race</div>
                      </th>
                      <th colSpan={2} style={{
                        background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಚಾಕಿ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Brushed (DFLs)</div>
                      </th>
                      <th colSpan={2} style={{
                        background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಹಣ್ಣಾದ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Ripe (DFLs)</div>
                      </th>
                      <th colSpan={2} style={{
                        background: "linear-gradient(135deg,#15803d,#22c55e)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಗೂಡು</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Cocoon (kg)</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#a16207,#fbbf24)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "180px", verticalAlign: "middle",
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಸರಾಸರಿ ಇಳುವರಿ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Avg Yield · kg / 100 DFLs</div>
                      </th>
                    </tr>
                    {/* Row 2 — Mo / ME for the 3 banded groups */}
                    <tr>
                      {[
                        { kn: "ಮಾಸ", en: "Mo", tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a" },
                        { kn: "ಅಂತ್ಯ", en: "ME", tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a", strong: true },
                        { kn: "ಮಾಸ", en: "Mo", tone: "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: "#4c1d95" },
                        { kn: "ಅಂತ್ಯ", en: "ME", tone: "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: "#4c1d95", strong: true },
                        { kn: "ಮಾಸ", en: "Mo", tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d" },
                        { kn: "ಅಂತ್ಯ", en: "ME", tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d", strong: true },
                      ].map((c, i) => (
                        <th key={i} style={{
                          background: c.tone, color: c.text,
                          padding: "8px 4px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)",
                          fontWeight: c.strong ? 800 : 700, minWidth: "130px",
                          position: "sticky", top: "44px", zIndex: 2,
                        }}>
                          <div style={{ fontSize: "10.5px" }}>{c.kn}</div>
                          <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && (
                      <tr><td colSpan={9} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>{dataRows.length === 0 ? "ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / No records found." : `No matches for "${search}".`}</td></tr>
                    )}
                    {filteredRows.map((row, ri) => {
                      const rowBg = ri % 2 === 1 ? "#f8fafc" : "#ffffff";
                      const rTone = raceTone(row.race);
                      const bMo = numOrZero(row.brushed_mo); const bMe = numOrZero(row.brushed_me);
                      const rMo = numOrZero(row.ripe_mo);    const rMe = numOrZero(row.ripe_me);
                      const cMo = numOrZero(row.cocoon_mo);  const cMe = numOrZero(row.cocoon_me);
                      const yld = numOrZero(row.avg_yield);
                      const rate = yieldRating(yld);
                      const cb = { padding: "10px 10px", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6", fontSize: "12px", verticalAlign: "middle" };

                      const numCell = (val, has, palBg, palTotalBg, palText, isTotal, extra = {}) => (
                        <td className="tscs4b-num" style={{
                          ...cb, ...extra, textAlign: "right", paddingRight: "16px",
                          background: has ? (isTotal ? palTotalBg : palBg) : "transparent",
                          color: has ? palText : "#cbd5e0",
                          fontWeight: isTotal ? 800 : 600,
                        }}>
                          {has ? (val) : "—"}
                        </td>
                      );

                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="tscs4b-tr" style={{ background: rowBg }}>
                          <td style={{ ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0", color: "#475569", fontWeight: 700 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#1e293b", fontWeight: 800, fontSize: "11px" }}>{row.sl_no}</span>
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "14px", borderRight: "2px solid #e2e8f0" }}>
                            <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "12px", background: rTone.bg, color: rTone.color, fontWeight: 800, fontSize: "12.5px" }}>
                              {row.race || "—"}
                            </span>
                          </td>
                          {numCell(fmtInt(row.brushed_mo), bMo > 0, "#eff6ff", "linear-gradient(135deg,#dbeafe,#bfdbfe)", "#1e40af", false)}
                          {numCell(fmtInt(row.brushed_me), bMe > 0, "#eff6ff", "linear-gradient(135deg,#dbeafe,#bfdbfe)", "#1e40af", true,  { borderRight: "2px solid #e2e8f0" })}
                          {numCell(fmtInt(row.ripe_mo),    rMo > 0, "#f5f3ff", "linear-gradient(135deg,#ede9fe,#ddd6fe)", "#5b21b6", false)}
                          {numCell(fmtInt(row.ripe_me),    rMe > 0, "#f5f3ff", "linear-gradient(135deg,#ede9fe,#ddd6fe)", "#5b21b6", true,  { borderRight: "2px solid #e2e8f0" })}
                          {numCell(fmtDec(row.cocoon_mo),  cMo > 0, "#f0fdf4", "linear-gradient(135deg,#dcfce7,#bbf7d0)", "#166534", false)}
                          {numCell(fmtDec(row.cocoon_me),  cMe > 0, "#f0fdf4", "linear-gradient(135deg,#dcfce7,#bbf7d0)", "#166534", true,  { borderRight: "2px solid #e2e8f0" })}
                          <td style={{ ...cb, textAlign: "center" }}>
                            {yld > 0 ? (
                              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                <span style={{
                                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                                  minWidth: "30px", height: "30px", borderRadius: "50%",
                                  background: rate.bg, color: rate.color,
                                  fontWeight: 900, fontSize: "12px",
                                  boxShadow: "inset 0 0 0 2px rgba(255,255,255,.5)",
                                }}>
                                  {rate.icon}
                                </span>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                  <span className="tscs4b-num" style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>{fmtDec(row.avg_yield)}</span>
                                  <span style={{ fontSize: "9.5px", fontWeight: 700, color: rate.color === "#fff" ? "#475569" : rate.color, textTransform: "uppercase", letterSpacing: ".05em" }}>{rate.label}</span>
                                </div>
                              </div>
                            ) : <span style={{ color: "#cbd5e0" }}>—</span>}
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
                  &nbsp;·&nbsp; ನಮೂನೆ ಎಸ್-4 / Form S-4 — Per-Race Summary
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

export default TscMonthlyS4SummaryReport;
