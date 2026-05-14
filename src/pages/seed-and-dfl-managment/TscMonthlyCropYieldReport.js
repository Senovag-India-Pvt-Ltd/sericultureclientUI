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

if (!document.getElementById("tsccy-styles")) {
  const s = document.createElement("style");
  s.id = "tsccy-styles";
  s.innerHTML = `
    .tsccy-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tsccy-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tsccy-swal .swal2-icon { margin:20px auto 4px !important; }
    .tsccy-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tsccy-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tsccy-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tsccy-wrap { animation: tsccy-in .35s ease; }
    .tsccy-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tsccy-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tsccy-scroll::-webkit-scrollbar { height:9px; }
    .tsccy-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tsccy-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
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
    background: state.isSelected
      ? "linear-gradient(135deg,#0f766e,#14b8a6)"
      : state.isFocused ? "#ecfdf5" : "#fff",
    color: state.isSelected ? "#fff" : "#0f172a",
    cursor: "pointer",
  }),
};

const numOrZero = (v) => {
  const n = parseFloat(String(v ?? "").replace(/[^\d.\-]/g, ""));
  return isNaN(n) ? 0 : n;
};

const fmtInt = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "";
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  return Math.round(n).toLocaleString();
};

const fmtDec = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "";
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const yearOptions = (() => {
  const cur = new Date().getFullYear();
  const arr = [];
  for (let y = cur + 1; y >= cur - 5; y--) arr.push({ value: y, label: String(y) });
  return arr;
})();

const raceTone = (raceRaw) => {
  const r = String(raceRaw || "").toUpperCase();
  if (r.includes(" X ") || r.includes("CROSS") || r.includes("BVDH") || r.includes("CB ") || r.includes("HYBRID")) {
    return { bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", color: "#5b21b6", label: "Hybrid" };
  }
  if (r.includes("CSR")) {
    return { bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1e40af", label: "CSR" };
  }
  if (r.includes("SK")) {
    return { bg: "linear-gradient(135deg,#cffafe,#a5f3fc)", color: "#0c4a6e", label: "SK" };
  }
  if (r === "PM" || r.includes("PURE MYSORE")) {
    return { bg: "linear-gradient(135deg,#fed7aa,#fdba74)", color: "#7c2d12", label: "Pure Mysore" };
  }
  if (r.includes("FC")) {
    return { bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d", label: "FC" };
  }
  return { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#334155", label: "Other" };
};

// 7 metric groups × 2 (Mo / ME) = 14 numeric leaves
const METRIC_GROUPS = [
  { key: "brushed", kn: "ಚಾಕಿ",         en: "Brushed",        suffix: "brushed", tone: "blue",   fmt: "int" },
  { key: "low",     kn: "ಕಡಿಮೆ ಇಳುವರಿ", en: "Low Yield",      suffix: "low",     tone: "amber",  fmt: "int" },
  { key: "fail",    kn: "ವಿಫಲ",        en: "Failed",         suffix: "fail",    tone: "red",    fmt: "int" },
  { key: "succ",    kn: "ಯಶಸ್ವಿ ಕಟಾವು", en: "Successful",     suffix: "succ",    tone: "green",  fmt: "int" },
  { key: "total",   kn: "ಒಟ್ಟು ಕಟಾವು",   en: "Total Harvest",  suffix: "total",   tone: "teal",   fmt: "int", strong: true },
  { key: "kg",      kn: "ಗೂಡು ಕೆ.ಜಿ",    en: "Cocoon (kg)",    suffix: "kg",      tone: "purple", fmt: "dec" },
  { key: "avg",     kn: "ಸರಾಸರಿ ಇಳುವರಿ", en: "Avg Yield (kg/100 DFLs)", suffix: "avg", tone: "indigo", fmt: "dec", strong: true },
];

const TONE_PALETTES = {
  blue:   { hdr: "linear-gradient(180deg,#93c5fd,#60a5fa)", hdrText: "#1e3a8a", cellBg: "#eff6ff", totalBg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", text: "#1e40af" },
  amber:  { hdr: "linear-gradient(180deg,#fde68a,#fcd34d)", hdrText: "#78350f", cellBg: "#fffbeb", totalBg: "linear-gradient(135deg,#fef3c7,#fde68a)", text: "#854d0e" },
  red:    { hdr: "linear-gradient(180deg,#fca5a5,#f87171)", hdrText: "#7f1d1d", cellBg: "#fef2f2", totalBg: "linear-gradient(135deg,#fee2e2,#fecaca)", text: "#991b1b" },
  green:  { hdr: "linear-gradient(180deg,#86efac,#4ade80)", hdrText: "#14532d", cellBg: "#f0fdf4", totalBg: "linear-gradient(135deg,#dcfce7,#bbf7d0)", text: "#166534" },
  teal:   { hdr: "linear-gradient(180deg,#5eead4,#2dd4bf)", hdrText: "#0f766e", cellBg: "#f0fdfa", totalBg: "linear-gradient(135deg,#ccfbf1,#99f6e4)", text: "#115e59" },
  purple: { hdr: "linear-gradient(180deg,#c4b5fd,#a78bfa)", hdrText: "#4c1d95", cellBg: "#f5f3ff", totalBg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", text: "#5b21b6" },
  indigo: { hdr: "linear-gradient(180deg,#a5b4fc,#818cf8)", hdrText: "#3730a3", cellBg: "#eef2ff", totalBg: "linear-gradient(135deg,#e0e7ff,#c7d2fe)", text: "#4338ca" },
};

function TscMonthlyCropYieldReport() {
  const { t } = useTranslation();

  const today = new Date();
  const [filter, setFilter] = useState({
    districtId: "",
    talukId: "",
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const [districtList, setDistrictList] = useState([]);
  const [talukList,    setTalukList]    = useState([]);

  const [search, setSearch] = useState("");

  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "district/get-all")
      .then((r) => setDistrictList(r.data.content.district || []))
      .catch(() => setDistrictList([]));
  }, []);

  useEffect(() => {
    if (!filter.districtId) { setTalukList([]); return; }
    api.get(baseURL + `taluk/get-by-district-id/${filter.districtId}`)
      .then((r) => setTalukList(r.data.content.taluk || []))
      .catch(() => setTalukList([]));
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
      confirmButtonText: "Got it", confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "tsccy-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "tsccy-swal" },
    });

  const params = () => ({
    talukId: filter.talukId,
    year:    Number(filter.year),
    month:   Number(filter.month),
  });

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/crop-yield", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch {
      showErr("Fetch Failed", "Failed to load the TSC Monthly Crop Yield (Sheet 6) report.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/crop-yield/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch {
      showErr("PDF Failed", "Could not generate the PDF report.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleExcel = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/crop-yield/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `tsc_monthly_crop_yield_${filter.talukId}_${filter.year}_${filter.month}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr("Excel Failed", "Could not generate the Excel report.");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const districtName = districtList.find((d) => String(d.districtId) === String(filter.districtId))?.districtName || "—";
  const talukName    = talukList.find((tk) => String(tk.talukId) === String(filter.talukId))?.talukName || "—";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn      = MONTH_KN[Number(filter.month)] || "";

  const filteredRows = useMemo(() => {
    if (!search.trim()) return dataRows;
    const q = search.trim().toLowerCase();
    return dataRows.filter((r) =>
      [r.tsc_name, r.race].some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [dataRows, search]);

  // Sl-merge groups (consecutive rows with same sl_no)
  const slMerges = useMemo(() => {
    const merges = [];
    let i = 0;
    while (i < filteredRows.length) {
      const sn = String(filteredRows[i].sl_no ?? "");
      let j = i + 1;
      while (j < filteredRows.length && String(filteredRows[j].sl_no ?? "") === sn) j++;
      merges.push({ start: i, count: j - i });
      i = j;
    }
    return merges;
  }, [filteredRows]);

  const firstRowOfGroup = useMemo(() => {
    const set = new Set();
    slMerges.forEach((m) => set.add(m.start));
    return set;
  }, [slMerges]);
  const groupSizeAt = useMemo(() => {
    const map = new Map();
    slMerges.forEach((m) => map.set(m.start, m.count));
    return map;
  }, [slMerges]);
  const groupIdxAt = useMemo(() => {
    const map = new Map();
    slMerges.forEach((m, gi) => {
      for (let k = m.start; k < m.start + m.count; k++) map.set(k, gi);
    });
    return map;
  }, [slMerges]);

  const kpis = useMemo(() => {
    let brushedMo = 0, brushedMe = 0;
    let succMe = 0, failMe = 0, lowMe = 0, totalMe = 0;
    let kgMo = 0, kgMe = 0;
    const tscs = new Set(), races = new Set();
    dataRows.forEach((r) => {
      brushedMo += numOrZero(r.mo_brushed);
      brushedMe += numOrZero(r.me_brushed);
      succMe    += numOrZero(r.me_succ);
      failMe    += numOrZero(r.me_fail);
      lowMe     += numOrZero(r.me_low);
      totalMe   += numOrZero(r.me_total);
      kgMo      += numOrZero(r.mo_kg);
      kgMe      += numOrZero(r.me_kg);
      if (r.tsc_name) tscs.add(r.tsc_name);
      if (r.race)     races.add(r.race);
    });
    const avgYieldMe = brushedMe > 0 ? (kgMe * 100) / brushedMe : 0;
    const avgYieldMo = brushedMo > 0 ? (kgMo * 100) / brushedMo : 0;
    const succPct    = (succMe + failMe) > 0 ? (succMe * 100) / (succMe + failMe) : 0;
    return {
      brushedMo, brushedMe,
      succMe, failMe, lowMe, totalMe,
      kgMo, kgMe,
      avgYieldMe, avgYieldMo, succPct,
      tscCount: tscs.size,
      raceCount: races.size,
    };
  }, [dataRows]);

  const formatVal = (group, raw) => {
    const n = numOrZero(raw);
    if (n === 0) return "—";
    if (group.fmt === "dec") return fmtDec(raw);
    return fmtInt(raw);
  };

  return (
    <Layout title={t("TSC Monthly Crop Yield — Sheet 6")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ತಳಿವಾರು ಬೆಳೆ ಇಳುವರಿ ವಿವರ — ಮಾಸಿಕ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
                color: "#14532d", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #86efac", verticalAlign: "middle",
              }}>ನಮೂನೆ-27ಬಿ · Form 27B · Crop Yield</span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#15803d 0%,#22c55e 50%,#5b57ac 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🌾</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ತಳಿವಾರು ಬೆಳೆ ಇಳುವರಿ ವಿವರ — TSC × Race Crop Yield Detail
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>SHEET 6 · FORM 27B</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>
                Brushed · Low Yield · Failed · Successful · Total Harvest · Cocoon (kg) · Avg Yield (kg / 100 DFLs)
              </div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {filter.year}
                </span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {filteredRows.length} / {dataRows.length} rows
                </span>
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
                    isSearchable isClearable menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed" styles={reactSelectStyles}
                    value={
                      districtList
                        .map((d) => ({ value: String(d.districtId), label: d.districtName }))
                        .find((o) => o.value === String(filter.districtId)) || null
                    }
                    onChange={(opt) => { setFilter((p) => ({ ...p, districtId: opt?.value || "", talukId: "" })); reset(); }}
                    noOptionsMessage={() => "No districts"}
                  />
                </Col>
                <Col md={3}>
                  <label style={lbl}>Taluk <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={talukList.map((tk) => ({ value: String(tk.talukId), label: tk.talukName }))}
                    placeholder={filter.districtId ? "— Search Taluk —" : "Select District first"}
                    isSearchable isClearable isDisabled={!filter.districtId} menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed" styles={reactSelectStyles}
                    value={
                      talukList
                        .map((tk) => ({ value: String(tk.talukId), label: tk.talukName }))
                        .find((o) => o.value === String(filter.talukId)) || null
                    }
                    onChange={(opt) => { setFilter((p) => ({ ...p, talukId: opt?.value || "" })); reset(); }}
                    noOptionsMessage={() => "No taluks"}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="year" value={filter.year}
                               onChange={(e) => { setFilter((p) => ({ ...p, year: e.target.value })); reset(); }}
                               style={sel}>
                    {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month}
                               onChange={(e) => { setFilter((p) => ({ ...p, month: e.target.value })); reset(); }}
                               style={sel}>
                    {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                    </button>
                  </div>
                </Col>
              </Row>
              {hasReport && (
                <Row className="g-2 mt-2 align-items-end">
                  <Col md={6}>
                    <label style={lbl}>Quick Search (TSC, Race)</label>
                    <input
                      type="text" value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Type to filter the loaded rows…"
                      style={{ ...sel, padding: "8px 12px" }}
                    />
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

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="tsccy-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "190px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>District / Taluk</span>
                <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{districtName} · {talukName}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ME · Brushed DFLs</span>
                <span className="tsccy-num" style={{ fontSize: "16px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.brushedMe)}</span>
                <span className="tsccy-num" style={{ fontSize: "11px", color: "#1e40af", marginTop: "2px" }}>Mo: {fmtInt(kpis.brushedMo)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ME · Successful / Failed</span>
                <span className="tsccy-num" style={{ fontSize: "14px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.succMe)} / {fmtInt(kpis.failMe)}</span>
                <span className="tsccy-num" style={{ fontSize: "11px", color: "#15803d", fontWeight: 700, marginTop: "2px" }}>Success rate: {kpis.succPct.toFixed(2)}%</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ME · Low Yield</span>
                <span className="tsccy-num" style={{ fontSize: "14px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.lowMe)} DFLs</span>
                <span style={{ fontSize: "10.5px", color: "#a16207", marginTop: "2px" }}>{"<30 kg / 100 DFLs"}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ME · Cocoon Production</span>
                <span className="tsccy-num" style={{ fontSize: "14px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{fmtDec(kpis.kgMe)} kg</span>
                <span className="tsccy-num" style={{ fontSize: "11px", color: "#6d28d9", fontWeight: 700, marginTop: "2px" }}>Mo: {fmtDec(kpis.kgMo)} kg</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0e7ff,#eef2ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ME · Avg Yield</span>
                <span className="tsccy-num" style={{ fontSize: "16px", color: "#3730a3", fontWeight: 800, marginTop: "2px" }}>{fmtDec(kpis.avgYieldMe)} kg / 100 DFLs</span>
                <span className="tsccy-num" style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, marginTop: "2px" }}>Mo: {fmtDec(kpis.avgYieldMo)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>TSCs / Races</span>
                <span className="tsccy-num" style={{ fontSize: "14px", color: "#155e75", fontWeight: 800, marginTop: "2px" }}>{kpis.tscCount} / {kpis.raceCount}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ನಮೂನೆ-27ಬಿ · ತಳಿವಾರು ಬೆಳೆ ಇಳುವರಿ ವಿವರ — {talukName} — {monthKn} {filter.year}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Form 27B · TSC × Race Crop Yield Detail · {monthLabel} {filter.year}
                </div>
              </div>

              <div className="tsccy-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1900px" }}>
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
                        background: "linear-gradient(135deg,#334155,#475569)", color: "#fff",
                        padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "190px", verticalAlign: "middle",
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>TSC</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#a16207,#ca8a04)", color: "#fff",
                        padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "180px", verticalAlign: "middle",
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ತಳಿ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Race</div>
                      </th>
                      {METRIC_GROUPS.map((g) => {
                        const tone = TONE_PALETTES[g.tone];
                        return (
                          <th key={g.key} colSpan={2} style={{
                            background: tone.hdr, color: tone.hdrText,
                            padding: "10px 8px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)",
                            fontWeight: g.strong ? 800 : 700,
                            position: "sticky", top: 0, zIndex: 2,
                          }}>
                            <div style={{ fontSize: "11.5px" }}>{g.kn}</div>
                            <div style={{ fontSize: "9px", fontWeight: 600, opacity: .8, marginTop: "1px" }}>{g.en}</div>
                          </th>
                        );
                      })}
                    </tr>
                    {/* Row 2 — Mo / ME leaves */}
                    <tr>
                      {METRIC_GROUPS.map((g) => {
                        const tone = TONE_PALETTES[g.tone];
                        const cellSt = {
                          background: tone.hdr, color: tone.hdrText,
                          padding: "6px 4px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)",
                          fontWeight: 700, minWidth: "80px",
                          opacity: 0.92,
                          position: "sticky", top: "44px", zIndex: 2,
                        };
                        return [
                          <th key={`${g.key}-mo`} style={cellSt}>
                            <div style={{ fontSize: "10px" }}>ಮಾಸ</div>
                            <div style={{ fontSize: "8.5px", opacity: .8 }}>Mo</div>
                          </th>,
                          <th key={`${g.key}-me`} style={{ ...cellSt, fontWeight: g.strong ? 800 : 700 }}>
                            <div style={{ fontSize: "10px" }}>ಅಂತ್ಯ</div>
                            <div style={{ fontSize: "8.5px", opacity: .8 }}>ME</div>
                          </th>,
                        ];
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && (
                      <tr>
                        <td colSpan={3 + METRIC_GROUPS.length * 2} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          {dataRows.length === 0
                            ? "ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / No records found."
                            : `No matches for "${search}".`}
                        </td>
                      </tr>
                    )}
                    {filteredRows.map((row, ri) => {
                      const isFirstInGroup = firstRowOfGroup.has(ri);
                      const groupSize = isFirstInGroup ? groupSizeAt.get(ri) : 0;
                      const groupIdx = groupIdxAt.get(ri) || 0;
                      const tone = raceTone(row.race);
                      const rowBg = groupIdx % 2 === 1 ? "#f8fafc" : "#ffffff";
                      const cellBase = {
                        padding: "9px 6px",
                        borderBottom: "1px solid #e2e8f0",
                        borderRight: "1px solid #eef2f6",
                        fontSize: "11.5px",
                        verticalAlign: "middle",
                      };
                      return (
                        <tr key={`${row.sl_no}-${row.race}-${ri}`} className="tsccy-tr" style={{ background: rowBg }}>
                          {isFirstInGroup ? (
                            <td rowSpan={groupSize} style={{
                              ...cellBase, textAlign: "center",
                              borderRight: "1px solid #e2e8f0",
                              color: "#475569", fontWeight: 700,
                              background: groupIdx % 2 === 1 ? "#f1f5f9" : "#f8fafc",
                            }}>
                              <span style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                minWidth: "26px", height: "26px", borderRadius: "50%",
                                background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)",
                                color: "#1e293b", fontWeight: 800, fontSize: "11px",
                              }}>{row.sl_no}</span>
                            </td>
                          ) : null}
                          {isFirstInGroup ? (
                            <td rowSpan={groupSize} style={{
                              ...cellBase, textAlign: "left", paddingLeft: "14px",
                              color: "#0f172a", fontWeight: 800,
                              borderRight: "2px solid #e2e8f0",
                              background: groupIdx % 2 === 1 ? "#f1f5f9" : "#f8fafc",
                            }}>
                              {row.tsc_name || "—"}
                            </td>
                          ) : null}
                          <td style={{ ...cellBase, textAlign: "left", paddingLeft: "14px", borderRight: "2px solid #e2e8f0" }}>
                            <span style={{
                              display: "inline-block", padding: "3px 10px", borderRadius: "12px",
                              background: tone.bg, color: tone.color,
                              fontWeight: 800, fontSize: "11.5px",
                            }}>
                              {row.race || "—"}
                            </span>
                          </td>
                          {METRIC_GROUPS.map((g) => {
                            const palette = TONE_PALETTES[g.tone];
                            const moV = row[`mo_${g.suffix}`];
                            const meV = row[`me_${g.suffix}`];
                            const moHas = numOrZero(moV) !== 0;
                            const meHas = numOrZero(meV) !== 0;
                            return [
                              <td key={`${g.key}-mo`} className="tsccy-num" style={{
                                ...cellBase, textAlign: "center",
                                background: moHas ? palette.cellBg : "transparent",
                                color: moHas ? palette.text : "#cbd5e0",
                                fontWeight: 600,
                              }}>
                                {moHas ? formatVal(g, moV) : "—"}
                              </td>,
                              <td key={`${g.key}-me`} className="tsccy-num" style={{
                                ...cellBase, textAlign: "center",
                                background: meHas ? (g.strong ? palette.totalBg : palette.cellBg) : "transparent",
                                color: meHas ? palette.text : "#cbd5e0",
                                fontWeight: g.strong ? 800 : 700,
                              }}>
                                {meHas ? formatVal(g, meV) : "—"}
                              </td>,
                            ];
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{
                background: "linear-gradient(135deg,#ecfdf5,#eef2ff)",
                padding: "12px 24px", display: "flex",
                alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "8px",
                borderTop: "1.5px solid #c7d2fe",
              }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {districtName} · {talukName} — {monthLabel} {monthKn} {filter.year}
                  &nbsp;·&nbsp; ನಮೂನೆ-27ಬಿ / Form 27B — Crop Yield · {filteredRows.length} / {dataRows.length} rows
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

export default TscMonthlyCropYieldReport;
