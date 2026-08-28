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

if (!document.getElementById("tscp1coc-styles")) {
  const s = document.createElement("style");
  s.id = "tscp1coc-styles";
  s.innerHTML = `
    .tscp1coc-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tscp1coc-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tscp1coc-swal .swal2-icon { margin:20px auto 4px !important; }
    .tscp1coc-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tscp1coc-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tscp1coc-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tscp1coc-wrap { animation: tscp1coc-in .35s ease; }
    .tscp1coc-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tscp1coc-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tscp1coc-scroll::-webkit-scrollbar { height:9px; }
    .tscp1coc-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tscp1coc-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
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
const fmtINR = (n) => "₹ " + (n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }));

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

function TscMonthlyP1CocoonLotwiseReport() {
  const { t, i18n } = useTranslation();

  const today = new Date();
  const [filter, setFilter] = useState({ districtId: "", talukId: "", year: today.getFullYear(), month: today.getMonth() + 1 });
  const [districtList, setDistrictList] = useState([]);
  const [talukList, setTalukList] = useState([]);
  const [search, setSearch] = useState("");
  const [weekFilter, setWeekFilter] = useState("");
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

  const reset = () => { setHasReport(false); setDataRows([]); setSearch(""); setWeekFilter(""); };
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
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706", background: "#fff", customClass: { popup: "tscp1coc-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e", background: "#fff", customClass: { popup: "tscp1coc-swal" },
    });

  const params = () => ({ talukId: filter.talukId, year: Number(filter.year), month: Number(filter.month) });

  const handleView = async (e) => {
    e.preventDefault(); const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/p1-cocoon-lotwise", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the TSC Monthly P1 Cocoon Lot-wise (Sheet 15) report.", { ns: "reports" }));
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/p1-cocoon-lotwise/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); } finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/p1-cocoon-lotwise/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      a.download = `tsc_monthly_p1_cocoon_lotwise_${filter.talukId}_${filter.year}_${filter.month}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); } finally { setIsDownloadingExcel(false); }
  };

  const selectedDistrict = districtList.find((d) => String(d.districtId) === String(filter.districtId));
  const selectedTaluk    = talukList.find((tk) => String(tk.talukId) === String(filter.talukId));
  const districtName = (i18n.language === "kn" ? (selectedDistrict?.districtNameInKannada || selectedDistrict?.districtName) : selectedDistrict?.districtName) || "—";
  const talukName    = (i18n.language === "kn" ? (selectedTaluk?.talukNameInKannada || selectedTaluk?.talukName) : selectedTaluk?.talukName) || "—";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn      = MONTH_KN[Number(filter.month)] || "";

  const filteredRows = useMemo(() => {
    let rows = dataRows;
    if (weekFilter) rows = rows.filter((r) => String(r.week_no) === String(weekFilter));
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((r) =>
      [r.tsc_name, r.farmer_name, r.village, r.lot_number, r.bco, r.market].some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [dataRows, search, weekFilter]);

  const kpis = useMemo(() => {
    let totalDfls = 0, totalKg = 0, totalSale = 0, rateSum = 0, rateCount = 0;
    const farmers = new Set(), markets = new Set(), tscs = new Set(), lots = new Set();
    const byMarketKg = {};
    const byWeekKg  = { 1: 0, 2: 0, 3: 0, 4: 0 };
    let cocoonRowsCount = 0, soldRowsCount = 0;
    dataRows.forEach((r) => {
      const d = numOrZero(r.dfls);
      const kg = numOrZero(r.cocoon_kg);
      const rate = numOrZero(r.rate);
      totalDfls += d; totalKg += kg;
      if (kg > 0) cocoonRowsCount++;
      if (rate > 0) { rateSum += rate; rateCount++; }
      if (kg > 0 && rate > 0) { totalSale += kg * rate; soldRowsCount++; }
      if (r.farmer_name) farmers.add(r.farmer_name);
      if (r.market)      markets.add(r.market);
      if (r.tsc_name)    tscs.add(r.tsc_name);
      if (r.lot_number)  lots.add(r.lot_number);
      const wk = Number(r.week_no);
      if (wk >= 1 && wk <= 4) byWeekKg[wk] += kg;
      if (r.market) byMarketKg[r.market] = (byMarketKg[r.market] || 0) + kg;
    });
    const avgRate    = rateCount > 0 ? rateSum / rateCount : 0;
    const avgYield   = totalDfls > 0 ? (totalKg * 100) / totalDfls : 0;
    const conversionPct = dataRows.length > 0 ? (cocoonRowsCount * 100) / dataRows.length : 0;
    const topMarket  = Object.entries(byMarketKg).sort((a, b) => b[1] - a[1])[0] || ["—", 0];
    return {
      events: dataRows.length, totalDfls, totalKg, totalSale, avgRate, avgYield,
      farmers: farmers.size, markets: markets.size, tscs: tscs.size, lots: lots.size,
      byWeekKg, topMarket, conversionPct,
      cocoonRowsCount, soldRowsCount,
    };
  }, [dataRows]);

  const distinctWeeks = useMemo(() => {
    const set = new Set();
    dataRows.forEach((r) => { if (r.week_no) set.add(String(r.week_no)); });
    return Array.from(set).sort();
  }, [dataRows]);

  return (
    <Layout title={t("TSC Monthly P1 Cocoon Lot-wise — Sheet 15", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ದ್ವಿತಳಿ ಪಿ1 ಗೂಡು ಕುಳುವಾರು ವರದಿ — ಮಾಸಿಕ")}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                Sheet 15 · P1 Cocoon end-to-end
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#a16207 0%,#ca8a04 50%,#15803d 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🪺</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ದ್ವಿತಳಿ ಪಿ1 ಗೂಡು ಕುಳುವಾರು — Bivoltine P1 Cocoon Lot-wise (Brushing → Ripening → Cocoon → Sale)
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>SHEET 15</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>
                Per-farmer end-to-end lot trace · Brushing date → Ripe date → Cocoon kg → Rate → Market → Sale date
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
                    options={districtList.map((d) => ({ value: String(d.districtId), label: i18n.language === "kn" ? (d.districtNameInKannada || d.districtName) : d.districtName }))}
                    placeholder={t("— Search District —", { ns: "reports" })}
                    isSearchable isClearable menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed" styles={reactSelectStyles}
                    value={districtList.map((d) => ({ value: String(d.districtId), label: i18n.language === "kn" ? (d.districtNameInKannada || d.districtName) : d.districtName })).find((o) => o.value === String(filter.districtId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, districtId: opt?.value || "", talukId: "" })); reset(); }}
                    noOptionsMessage={() => t("No districts", { ns: "reports" })}
                  />
                </Col>
                <Col md={3}>
                  <label style={lbl}>{t("Taluk")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={talukList.map((tk) => ({ value: String(tk.talukId), label: i18n.language === "kn" ? (tk.talukNameInKannada || tk.talukName) : tk.talukName }))}
                    placeholder={filter.districtId ? t("— Search Taluk —", { ns: "reports" }) : t("Select District first", { ns: "reports" })}
                    isSearchable isClearable isDisabled={!filter.districtId} menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed" styles={reactSelectStyles}
                    value={talukList.map((tk) => ({ value: String(tk.talukId), label: i18n.language === "kn" ? (tk.talukNameInKannada || tk.talukName) : tk.talukName })).find((o) => o.value === String(filter.talukId)) || null}
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
                  <Col md={5}>
                    <label style={lbl}>{t("Quick Search (TSC, Farmer, Village, Lot, Race, Market)", { ns: "reports" })}</label>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Type to filter…", { ns: "reports" })} style={{ ...sel, padding: "8px 12px" }} />
                  </Col>
                  <Col md={3}>
                    <label style={lbl}>{t("Filter by Week", { ns: "reports" })}</label>
                    <div className="d-flex gap-1 flex-wrap">
                      {[
                        { v: "",  label: t("All") },
                        ...distinctWeeks.map((w) => ({ v: w, label: WEEK_TONES[Number(w)]?.label || `Wk ${w}` })),
                      ].map((opt) => (
                        <button key={opt.v} type="button" onClick={() => setWeekFilter(opt.v)}
                          style={{
                            padding: "6px 12px", borderRadius: "9px", border: "none",
                            background: weekFilter === opt.v ? "linear-gradient(135deg,#0f766e,#14b8a6)" : "#f1f5f9",
                            color: weekFilter === opt.v ? "#fff" : "#475569",
                            fontWeight: 700, fontSize: "11.5px", cursor: "pointer",
                            boxShadow: weekFilter === opt.v ? "0 2px 6px rgba(15,118,110,.30)" : "none",
                          }}>{opt.label}</button>
                      ))}
                    </div>
                  </Col>
                  <Col md={4}>
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
          <div className="tscp1coc-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-stretch">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("District / Taluk", { ns: "reports" })}</span>
                <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{districtName} · {talukName}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Brushing Events", { ns: "reports" })}</span>
                <span className="tscp1coc-num" style={{ fontSize: "18px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{kpis.events.toLocaleString()}</span>
                <span className="tscp1coc-num" style={{ fontSize: "10.5px", color: "#1e40af", fontWeight: 700, marginTop: "1px" }}>{t("Cocoon-yielded:", { ns: "reports" })} {kpis.cocoonRowsCount} ({kpis.conversionPct.toFixed(1)}%)</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Total DFLs", { ns: "reports" })}</span>
                <span className="tscp1coc-num" style={{ fontSize: "16px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.totalDfls)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Total Cocoon", { ns: "reports" })}</span>
                <span className="tscp1coc-num" style={{ fontSize: "16px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{fmtDec(kpis.totalKg)} kg</span>
                <span className="tscp1coc-num" style={{ fontSize: "10.5px", color: "#a16207", fontWeight: 700, marginTop: "1px" }}>{t("Avg Yield:", { ns: "reports" })} {fmtDec(kpis.avgYield)} kg / 100 DFLs</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fce7f3,#fdf2f8)", border: "1.5px solid #f9a8d4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#9d174d", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Total Sale Value", { ns: "reports" })}</span>
                <span className="tscp1coc-num" style={{ fontSize: "16px", color: "#831843", fontWeight: 800, marginTop: "2px" }}>{fmtINR(kpis.totalSale)}</span>
                <span className="tscp1coc-num" style={{ fontSize: "10.5px", color: "#be185d", fontWeight: 700, marginTop: "1px" }}>{t("Avg Rate:", { ns: "reports" })} ₹ {fmtDec(kpis.avgRate)} / kg</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef9ec,#fef3c7)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 16px", minWidth: "260px" }}>
                <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#92400e", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "5px" }}>{t("Cocoon kg by Week", { ns: "reports" })}</div>
                <div style={{ display: "flex", alignItems: "stretch", gap: "5px" }}>
                  {[1, 2, 3, 4].map((w) => {
                    const tone = WEEK_TONES[w];
                    return (
                      <div key={w} style={{ flex: 1, background: tone.bg, color: tone.color, borderRadius: "8px", padding: "5px 4px", textAlign: "center" }}>
                        <div style={{ fontSize: "9px", fontWeight: 800, opacity: .85 }}>{tone.label}</div>
                        <div className="tscp1coc-num" style={{ fontSize: "11.5px", fontWeight: 900, marginTop: "1px" }}>{fmtDec(kpis.byWeekKg[w])}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("TSCs / Farmers / Lots / Markets", { ns: "reports" })}</span>
                <span className="tscp1coc-num" style={{ fontSize: "13px", color: "#155e75", fontWeight: 800, marginTop: "2px" }}>{kpis.tscs} / {kpis.farmers} / {kpis.lots} / {kpis.markets}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Top Market · Cocoon kg", { ns: "reports" })}</span>
                <span style={{ fontSize: "13px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>🏪 {kpis.topMarket[0]}</span>
                <span className="tscp1coc-num" style={{ fontSize: "11px", color: "#6d28d9", fontWeight: 700, marginTop: "2px" }}>{fmtDec(kpis.topMarket[1])} kg</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                Sheet 15 · ದ್ವಿತಳಿ ಪಿ1 ಗೂಡು ಕುಳುವಾರು ವರದಿ — {talukName} — {monthKn} {filter.year}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Bivoltine P1 Cocoon Lot-wise · per-farmer end-to-end · {monthLabel} {filter.year}
                </div>
              </div>

              <div className="tscp1coc-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "2100px" }}>
                  <thead>
                    <tr>
                      {[
                        { kn: "ಕ್ರ.ಸಂ.",       en: "Sl",            w: 55,  bg: "linear-gradient(135deg,#1e293b,#36506b)", align: "center" },
                        { kn: "ವಾರ",          en: "Week",          w: 90,  bg: "linear-gradient(135deg,#5b21b6,#7c3aed)", align: "center" },
                        { kn: "ತಾಂ.ಸೇ.ಕೇ",   en: "TSC",           w: 150, bg: "linear-gradient(135deg,#334155,#475569)", align: "left" },
                        { kn: "ರೈತರ ಹೆಸರು",  en: "Farmer",        w: 180, bg: "linear-gradient(135deg,#0f766e,#14b8a6)", align: "left" },
                        { kn: "ಗ್ರಾಮ",       en: "Village",       w: 130, bg: "linear-gradient(135deg,#0e7490,#06b6d4)", align: "left" },
                        { kn: "ತಂಡ ಸಂಖ್ಯೆ",   en: "Lot No",        w: 110, bg: "linear-gradient(135deg,#1d4ed8,#3b82f6)", align: "center" },
                        { kn: "ಬಿಕೋ / ತಳಿ",  en: "BCO / Race",    w: 140, bg: "linear-gradient(135deg,#a16207,#ca8a04)", align: "center" },
                        { kn: "ಮೊಟ್ಟೆ",      en: "DFLs",          w: 100, bg: "linear-gradient(135deg,#15803d,#22c55e)", align: "right" },
                        { kn: "ಚಾಕಿ ದಿನಾಂಕ",  en: "Brushing",      w: 120, bg: "linear-gradient(135deg,#0e7490,#06b6d4)", align: "center" },
                        { kn: "ಹಣ್ಣಾದ ದಿನಾಂಕ",en: "Ripe",          w: 120, bg: "linear-gradient(135deg,#7c3aed,#a78bfa)", align: "center" },
                        { kn: "ಗೂಡು ಕೆ.ಜಿ",   en: "Cocoon (kg)",   w: 130, bg: "linear-gradient(135deg,#a16207,#fbbf24)", align: "right" },
                        { kn: "ದರ",          en: "Rate (₹/kg)",   w: 110, bg: "linear-gradient(135deg,#9d174d,#db2777)", align: "right" },
                        { kn: "ಮಾರುಕಟ್ಟೆ",   en: "Market",        w: 160, bg: "linear-gradient(135deg,#15803d,#22c55e)", align: "left" },
                        { kn: "ವಿಲೇವಾರಿ",     en: "Sale Date",     w: 120, bg: "linear-gradient(135deg,#9d174d,#db2777)", align: "center" },
                      ].map((c, i) => (
                        <th key={i} style={{
                          background: c.bg, color: "#fff",
                          padding: "10px 8px", textAlign: c.align === "left" ? "left" : "center",
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
                      <tr><td colSpan={14} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>{dataRows.length === 0 ? "ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / No records found." : t("No matches for the current filters.", { ns: "reports" })}</td></tr>
                    )}
                    {filteredRows.map((row, ri) => {
                      const rowBg = ri % 2 === 1 ? "#f8fafc" : "#ffffff";
                      const wk = Number(row.week_no);
                      const wkTone = WEEK_TONES[wk] || { bg: "#e2e8f0", color: "#334155", label: `Wk ${row.week_no}` };
                      const rTone = raceTone(row.bco);
                      const dfls = numOrZero(row.dfls);
                      const kg = numOrZero(row.cocoon_kg);
                      const rate = numOrZero(row.rate);
                      const cb = { padding: "9px 8px", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6", fontSize: "11.5px", verticalAlign: "middle", whiteSpace: "nowrap" };
                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="tscp1coc-tr" style={{ background: rowBg }}>
                          <td style={{ ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0", color: "#475569", fontWeight: 700 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#1e293b", fontWeight: 800, fontSize: "11px" }}>{row.sl_no}</span>
                          </td>
                          <td style={{ ...cb, textAlign: "center" }}>
                            <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "12px", background: wkTone.bg, color: wkTone.color, fontWeight: 800, fontSize: "11px" }}>{wkTone.label}</span>
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "10px", color: "#0f172a", fontWeight: 700 }}>
                            {row.tsc_name || "—"}
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "10px", color: "#0f172a", fontWeight: 700 }}>
                            👤 {row.farmer_name || "—"}
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "10px", color: "#0f172a" }}>
                            🏘 {row.village || "—"}
                          </td>
                          <td style={{ ...cb, textAlign: "center" }}>
                            {row.lot_number ? (
                              <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "8px", background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1e40af", fontWeight: 800, fontSize: "11.5px", fontFamily: "monospace" }}>
                                #{row.lot_number}
                              </span>
                            ) : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td style={{ ...cb, textAlign: "center" }}>
                            {row.bco ? (
                              <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "12px", background: rTone.bg, color: rTone.color, fontWeight: 800, fontSize: "11.5px" }}>{row.bco}</span>
                            ) : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td className="tscp1coc-num" style={{
                            ...cb, textAlign: "right", paddingRight: "12px",
                            background: dfls > 0 ? "linear-gradient(135deg,#dcfce7,#bbf7d0)" : "transparent",
                            color: dfls > 0 ? "#14532d" : "#cbd5e0",
                            fontWeight: 800,
                          }}>
                            {dfls > 0 ? fmtInt(row.dfls) : "—"}
                          </td>
                          <td style={{ ...cb, textAlign: "center" }}>
                            {row.brushing_date ? (
                              <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: "9px", background: "linear-gradient(135deg,#cffafe,#a5f3fc)", color: "#155e75", fontWeight: 700, fontSize: "11px", fontFamily: "monospace" }}>
                                {row.brushing_date}
                              </span>
                            ) : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td style={{ ...cb, textAlign: "center" }}>
                            {row.ripe_date ? (
                              <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: "9px", background: "linear-gradient(135deg,#ede9fe,#ddd6fe)", color: "#5b21b6", fontWeight: 700, fontSize: "11px", fontFamily: "monospace" }}>
                                ↗ {row.ripe_date}
                              </span>
                            ) : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td className="tscp1coc-num" style={{
                            ...cb, textAlign: "right", paddingRight: "12px",
                            background: kg > 0 ? "linear-gradient(135deg,#fef3c7,#fde68a)" : "transparent",
                            color: kg > 0 ? "#78350f" : "#cbd5e0",
                            fontWeight: 800,
                          }}>
                            {kg > 0 ? fmtDec(row.cocoon_kg) : "—"}
                          </td>
                          <td className="tscp1coc-num" style={{
                            ...cb, textAlign: "right", paddingRight: "12px",
                            background: rate > 0 ? "linear-gradient(135deg,#fce7f3,#fbcfe8)" : "transparent",
                            color: rate > 0 ? "#9d174d" : "#cbd5e0",
                            fontWeight: 800,
                          }}>
                            {rate > 0 ? `₹ ${fmtDec(row.rate)}` : "—"}
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "10px" }}>
                            {row.market ? <>🏪 {row.market}</> : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td style={{ ...cb, textAlign: "center" }}>
                            {row.sale_date ? (
                              <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: "9px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", fontWeight: 700, fontSize: "11px", fontFamily: "monospace" }}>
                                ✓ {row.sale_date}
                              </span>
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
                  &nbsp;·&nbsp; Sheet 15 · P1 Cocoon Lot-wise · {filteredRows.length} / {dataRows.length} rows · Sold: {kpis.soldRowsCount}
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

export default TscMonthlyP1CocoonLotwiseReport;
