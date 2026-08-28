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

// 7 metric groups (each split ತಿಂ / ಅಂತ್ಯ) — matches the source format
const GROUPS = [
  { key: "brushed", kn: "ಚಾಕಿಯಾದ ಮೊಟ್ಟೆ",            en: "Brushed (DFLs)",     fmt: "int", band: "linear-gradient(135deg,#1d4ed8,#3b82f6)", leaf: "linear-gradient(180deg,#93c5fd,#60a5fa)", cell: "#eff6ff", tot: "linear-gradient(135deg,#dbeafe,#bfdbfe)", text: "#1e40af" },
  { key: "ripe",    kn: "ಹಣ್ಣಾದ ಮೊಟ್ಟೆ",             en: "Ripe (DFLs)",        fmt: "int", band: "linear-gradient(135deg,#7c3aed,#a78bfa)", leaf: "linear-gradient(180deg,#c4b5fd,#a78bfa)", cell: "#f5f3ff", tot: "linear-gradient(135deg,#ede9fe,#ddd6fe)", text: "#5b21b6" },
  { key: "cocoon",  kn: "ಗೂಡು ಉತ್ಪಾದನೆ",             en: "Cocoon (kg)",        fmt: "dec", band: "linear-gradient(135deg,#15803d,#22c55e)", leaf: "linear-gradient(180deg,#86efac,#4ade80)", cell: "#f0fdf4", tot: "linear-gradient(135deg,#dcfce7,#bbf7d0)", text: "#166534" },
  { key: "yield",   kn: "ಸರಾಸರಿ ಇಳುವರಿ",             en: "Avg Yield",          fmt: "dec", band: "linear-gradient(135deg,#a16207,#fbbf24)", leaf: "linear-gradient(180deg,#fde68a,#fcd34d)", cell: "#fffbeb", tot: "linear-gradient(135deg,#fef3c7,#fde68a)", text: "#854d0e" },
  { key: "cpk",     kn: "ಪ್ರತಿ ಕೆ.ಜಿ.ಗೆ ಗೂಡಿನ ಸಂಖ್ಯೆ", en: "Cocoons / kg",      fmt: "int", band: "linear-gradient(135deg,#0e7490,#06b6d4)", leaf: "linear-gradient(180deg,#67e8f9,#22d3ee)", cell: "#ecfeff", tot: "linear-gradient(135deg,#cffafe,#a5f3fc)", text: "#155e75" },
  { key: "area",    kn: "ಹಿ.ನೇ.ವಿಸ್ತೀರ್ಣ",            en: "Mulberry Area (ha)", fmt: "dec", band: "linear-gradient(135deg,#0f766e,#14b8a6)", leaf: "linear-gradient(180deg,#5eead4,#2dd4bf)", cell: "#f0fdfa", tot: "linear-gradient(135deg,#ccfbf1,#99f6e4)", text: "#115e59" },
  { key: "growers", kn: "ಬೆಳೆಗಾರರ ಸಂಖ್ಯೆ",           en: "Growers",            fmt: "int", band: "linear-gradient(135deg,#5b57ac,#818cf8)", leaf: "linear-gradient(180deg,#a5b4fc,#818cf8)", cell: "#eef2ff", tot: "linear-gradient(135deg,#e0e7ff,#c7d2fe)", text: "#3730a3" },
];

// Yield rating thresholds (kg per 100 DFLs)
const yieldRating = (avg) => {
  if (avg >= 50) return { bg: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", label: "Excellent", icon: "🏆" };
  if (avg >= 35) return { bg: "linear-gradient(135deg,#0f766e,#14b8a6)", color: "#fff", label: "Good",      icon: "✓" };
  if (avg >= 25) return { bg: "linear-gradient(135deg,#ca8a04,#fbbf24)", color: "#78350f", label: "Average", icon: "•" };
  if (avg > 0)   return { bg: "linear-gradient(135deg,#dc2626,#f87171)", color: "#fff", label: "Low",       icon: "✗" };
  return            { bg: "linear-gradient(135deg,#cbd5e1,#e2e8f0)", color: "#475569", label: "—",          icon: "—" };
};

function TscMonthlyS4SummaryReport() {
  const { t, i18n } = useTranslation();

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
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706", background: "#fff", customClass: { popup: "tscs4b-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e", background: "#fff", customClass: { popup: "tscs4b-swal" },
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
          showErr(t("No Data Found", { ns: "reports" }), t("No data found for the selected filters.", { ns: "reports" }));
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the TSC Monthly S-4 Per-Race Summary (Sheet 13b) report.", { ns: "reports" }));
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
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); } finally { setIsDownloadingPdf(false); }
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
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); } finally { setIsDownloadingExcel(false); }
  };

  const selectedDistrict = districtList.find((d) => String(d.districtId) === String(filter.districtId));
  const selectedTaluk    = talukList.find((tk) => String(tk.talukId) === String(filter.talukId));
  const districtName = (i18n.language === "kn" ? (selectedDistrict?.districtNameInKannada || selectedDistrict?.districtName) : selectedDistrict?.districtName) || "—";
  const talukName    = (i18n.language === "kn" ? (selectedTaluk?.talukNameInKannada || selectedTaluk?.talukName) : selectedTaluk?.talukName) || "—";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn      = MONTH_KN[Number(filter.month)] || "";
  const fyLabel      = (() => {
    const m = Number(filter.month), y = Number(filter.year);
    const fyStart = m >= 4 ? y : y - 1;
    return `${fyStart}-${String((fyStart + 1) % 100).padStart(2, "0")}`;
  })();

  const isTotalRow = (r) => String(r?.race ?? "").trim() === "ಒಟ್ಟು";

  const filteredRows = useMemo(() => {
    if (!search.trim()) return dataRows;
    const q = search.trim().toLowerCase();
    return dataRows.filter((r) => isTotalRow(r) || String(r.race ?? "").toLowerCase().includes(q));
  }, [dataRows, search]);

  const kpis = useMemo(() => {
    let bMo = 0, bMe = 0, rMo = 0, rMe = 0, cMo = 0, cMe = 0, gMe = 0;
    let bestYield = -1, bestYieldRace = "—";
    let topCocoonKg = -1, topCocoonRace = "—";
    dataRows.forEach((r) => {
      if (isTotalRow(r)) return;
      bMo += numOrZero(r.brushed_mo);
      bMe += numOrZero(r.brushed_me);
      rMo += numOrZero(r.ripe_mo);
      rMe += numOrZero(r.ripe_me);
      cMo += numOrZero(r.cocoon_mo);
      cMe += numOrZero(r.cocoon_me);
      gMe += numOrZero(r.growers_me);
      const y = numOrZero(r.yield_me);
      if (y > bestYield) { bestYield = y; bestYieldRace = r.race || "—"; }
      const ck = numOrZero(r.cocoon_me);
      if (ck > topCocoonKg) { topCocoonKg = ck; topCocoonRace = r.race || "—"; }
    });
    const overallAvg = bMe > 0 ? (cMe * 100) / bMe : 0;
    const ripeRate   = bMe > 0 ? (rMe * 100) / bMe : 0;
    return { bMo, bMe, rMo, rMe, cMo, cMe, gMe, bestYield: bestYield < 0 ? 0 : bestYield, bestYieldRace, topCocoonKg: topCocoonKg < 0 ? 0 : topCocoonKg, topCocoonRace, overallAvg, ripeRate };
  }, [dataRows]);

  const overallRating = yieldRating(kpis.overallAvg);

  return (
    <Layout title={t("TSC Monthly S-4 Per-Race Summary — Sheet 13b", { ns: "reports" })}>
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
                  <Col md={6}>
                    <label style={lbl}>{t("Quick Search (Race)", { ns: "reports" })}</label>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Type to filter…", { ns: "reports" })} style={{ ...sel, padding: "8px 12px" }} />
                  </Col>
                  <Col md={6}>
                    <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                      <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                        {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> {t("Generating…", { ns: "reports" })}</> : <>📄 {t("PDF", { ns: "reports" })}</>}
                      </button>
                      <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                        {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> {t("Exporting…", { ns: "reports" })}</> : <>📊 {t("Excel", { ns: "reports" })}</>}
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
                  <div style={{ fontSize: "10.5px", fontWeight: 700, opacity: .85, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Overall Avg Yield", { ns: "reports" })}</div>
                  <div className="tscs4b-num" style={{ fontSize: "20px", fontWeight: 900, marginTop: "2px", letterSpacing: ".01em" }}>{fmtDec(kpis.overallAvg)}</div>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, opacity: .9 }}>kg / 100 DFLs · {overallRating.label}</div>
                </div>
              </div>

              {/* Funnel: Brushed → Ripe → Cocoon */}
              <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "10px 16px", minWidth: "320px" }}>
                <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "6px" }}>{t("ME Funnel · Brushed → Ripe → Cocoon", { ns: "reports" })}</div>
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
                  {t("Ripe / Brushed:", { ns: "reports" })} <span style={{ color: "#1a202c" }}>{kpis.ripeRate.toFixed(2)}%</span>
                </div>
              </div>

              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Best Yield Race", { ns: "reports" })}</span>
                <span style={{ fontSize: "13px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>🏆 {kpis.bestYieldRace}</span>
                <span className="tscs4b-num" style={{ fontSize: "11px", color: "#15803d", fontWeight: 700, marginTop: "2px" }}>{fmtDec(kpis.bestYield)} kg / 100 DFLs</span>
              </div>

              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Top Cocoon Race · ME", { ns: "reports" })}</span>
                <span style={{ fontSize: "13px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>🏅 {kpis.topCocoonRace}</span>
                <span className="tscs4b-num" style={{ fontSize: "11px", color: "#a16207", fontWeight: 700, marginTop: "2px" }}>{fmtDec(kpis.topCocoonKg)} kg</span>
              </div>

              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("District / Taluk", { ns: "reports" })}</span>
                <span style={{ fontSize: "12.5px", color: "#155e75", fontWeight: 700, marginTop: "2px" }}>{districtName}</span>
                <span style={{ fontSize: "12px", color: "#0e7490", fontWeight: 700 }}>{talukName}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "14.5px", textAlign: "center", lineHeight: 1.5 }}>
                {districtName} ಬಿತ್ತನೆ ವಲಯ {talukName} ತಾಲ್ಲೂಕಿನ {monthKn} – {filter.year} ನೇ ಮಾಹೆಯ ಸಂಕ್ಷಿಪ್ತ ವರದಿ ({fyLabel})
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Form S-4 · Per-Race Monthly Summary · {monthLabel} {filter.year}
                </div>
              </div>

              <div className="tscs4b-scroll" style={{ overflowX: "auto", maxHeight: "72vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1700px" }}>
                  <thead>
                    {/* Row 1 — group bands */}
                    <tr>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#1e293b,#36506b)", color: "#fff", padding: "9px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, width: "52px", verticalAlign: "middle", position: "sticky", top: 0, zIndex: 3 }}>ಕ್ರ.<br />ಸಂ.</th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#a16207,#ca8a04)", color: "#fff", padding: "9px 14px", textAlign: "left", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "180px", verticalAlign: "middle", position: "sticky", top: 0, zIndex: 3 }}>ತಳಿ</th>
                      {GROUPS.map((g) => (
                        <th key={g.key} colSpan={2} style={{ background: g.band, color: "#fff", padding: "9px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}>
                          <div style={{ fontSize: "11.5px" }}>{g.kn}</div>
                          <div style={{ fontSize: "8.5px", fontWeight: 600, opacity: .85, marginTop: "1px" }}>{g.en}</div>
                        </th>
                      ))}
                    </tr>
                    {/* Row 2 — ತಿಂ / ಅಂತ್ಯ leaves */}
                    <tr>
                      {GROUPS.map((g) => ([
                        <th key={`${g.key}-mo`} style={{ background: g.leaf, color: g.text, padding: "6px 4px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 700, minWidth: "78px", position: "sticky", top: "42px", zIndex: 2 }}>ತಿಂ</th>,
                        <th key={`${g.key}-me`} style={{ background: g.leaf, color: g.text, padding: "6px 4px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "78px", position: "sticky", top: "42px", zIndex: 2 }}>ಅಂತ್ಯ</th>,
                      ]))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && (
                      <tr><td colSpan={16} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>{dataRows.length === 0 ? "ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / No records found." : t('No matches for "{{search}}".', { ns: "reports", search })}</td></tr>
                    )}
                    {filteredRows.map((row, ri) => {
                      const tot = isTotalRow(row);
                      const rowBg = tot ? "linear-gradient(135deg,#fff7ed,#ffedd5)" : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const rTone = raceTone(row.race);
                      const cb = { padding: "9px 8px", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6", fontSize: "11.5px", verticalAlign: "middle" };
                      const fmtFor = (g, v) => (g.fmt === "dec" ? fmtDec(v) : fmtInt(v));
                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="tscs4b-tr" style={{ background: rowBg, fontWeight: tot ? 800 : 400 }}>
                          <td style={{ ...cb, textAlign: "center", color: "#475569", fontWeight: 700 }}>
                            {tot ? "" : <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#1e293b", fontWeight: 800, fontSize: "10.5px" }}>{row.sl_no}</span>}
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "12px", borderRight: "2px solid #e2e8f0" }}>
                            {tot ? <span style={{ color: "#9a3412", fontWeight: 800 }}>ಒಟ್ಟು</span>
                                 : <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "12px", background: rTone.bg, color: rTone.color, fontWeight: 800, fontSize: "12px" }}>{row.race || "—"}</span>}
                          </td>
                          {GROUPS.map((g) => {
                            const moK = `${g.key}_mo`, meK = `${g.key}_me`;
                            const moV = numOrZero(row[moK]), meV = numOrZero(row[meK]);
                            return ([
                              <td key={moK} className="tscs4b-num" style={{ ...cb, textAlign: "right", paddingRight: "12px", background: moV > 0 ? g.cell : "transparent", color: moV > 0 ? g.text : "#cbd5e0", fontWeight: tot ? 800 : 600 }}>{fmtFor(g, row[moK])}</td>,
                              <td key={meK} className="tscs4b-num" style={{ ...cb, textAlign: "right", paddingRight: "12px", borderRight: "2px solid #e2e8f0", background: meV > 0 ? g.tot : "transparent", color: meV > 0 ? g.text : "#cbd5e0", fontWeight: 800 }}>{fmtFor(g, row[meK])}</td>,
                            ]);
                          })}
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

export default TscMonthlyS4SummaryReport;
