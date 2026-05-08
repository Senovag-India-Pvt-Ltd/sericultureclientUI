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

if (!document.getElementById("tscpld-styles")) {
  const s = document.createElement("style");
  s.id = "tscpld-styles";
  s.innerHTML = `
    .tscpld-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tscpld-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tscpld-swal .swal2-icon { margin:20px auto 4px !important; }
    .tscpld-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tscpld-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tscpld-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tscpld-wrap { animation: tscpld-in .35s ease; }
    .tscpld-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tscpld-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tscpld-scroll::-webkit-scrollbar { height:9px; }
    .tscpld-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tscpld-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
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

const fmtArea = (v) => {
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

function TscMonthlyPlantationDetailReport() {
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
      background: "#fff", customClass: { popup: "tscpld-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "tscpld-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/plantation-detail", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch {
      showErr("Fetch Failed", "Failed to load the TSC Monthly Plantation Detail (Sheet 4) report.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/plantation-detail/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/plantation-detail/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `tsc_monthly_plantation_detail_${filter.talukId}_${filter.year}_${filter.month}.xlsx`;
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

  const kpis = useMemo(() => {
    let totalArea = 0;
    const farmers = new Set(), villages = new Set(), tscs = new Set();
    const varieties = {};
    const types = {};
    dataRows.forEach((r) => {
      totalArea += numOrZero(r.mulberry_area);
      if (r.farmer_name) farmers.add(r.farmer_name);
      if (r.village)     villages.add(r.village);
      if (r.tsc_name)    tscs.add(r.tsc_name);
      const v = (r.variety || "").toString().trim() || "—";
      varieties[v] = (varieties[v] || 0) + numOrZero(r.mulberry_area);
      const tp = (r.plantation_type || "").toString().trim() || "—";
      types[tp] = (types[tp] || 0) + 1;
    });
    const topVar = Object.entries(varieties).sort((a, b) => b[1] - a[1])[0] || ["—", 0];
    return {
      events: dataRows.length,
      totalArea,
      farmers: farmers.size,
      villages: villages.size,
      tscs: tscs.size,
      topVariety: topVar[0],
      topVarietyArea: topVar[1],
      types,
    };
  }, [dataRows]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return dataRows;
    const q = search.trim().toLowerCase();
    return dataRows.filter((r) =>
      [r.tsc_name, r.farmer_name, r.father_name, r.village, r.variety, r.survey_number, r.plantation_method, r.seed_source, r.farmer_category, r.plantation_type]
        .some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [dataRows, search]);

  const COLS = [
    { key: "sl_no",             kn: "ಕ್ರ.ಸಂ.",       en: "Sl",         w: 50,  align: "center" },
    { key: "tsc_name",          kn: "ತಾಂತ್ರಿಕ ಕೇಂದ್ರ", en: "TSC",       w: 160, align: "left" },
    { key: "farmer_name",       kn: "ರೈತರ ಹೆಸರು",     en: "Farmer",     w: 180, align: "left", strong: true },
    { key: "father_name",       kn: "ತಂದೆ/ಪತಿ",       en: "Father",     w: 150, align: "left" },
    { key: "village",           kn: "ಗ್ರಾಮ",          en: "Village",    w: 130, align: "left" },
    { key: "mulberry_area",     kn: "ಹಿಪ್ಪು. ವಿಸ್ತೀ.", en: "Area (ha)", w: 90,  align: "right",  num: true },
    { key: "variety",           kn: "ತಳಿ",            en: "Variety",    w: 110, align: "center", chip: "variety" },
    { key: "survey_number",     kn: "ಸರ್ವೇ ನಂಬರ್",   en: "Survey #",   w: 110, align: "center" },
    { key: "irrigation_source", kn: "ನೀರಾವರಿ ಮೂಲ",   en: "Irr Src",    w: 120, align: "center" },
    { key: "plantation_date",   kn: "ನಾಟಿ ದಿನಾಂಕ",    en: "Date",       w: 110, align: "center", chip: "date" },
    { key: "plantation_method", kn: "ನಾಟಿ ವಿಧಾನ",     en: "Method",     w: 130, align: "center" },
    { key: "seed_source",       kn: "ಬಿತ್ತನೆ ಮೂಲ",    en: "Seed Src",   w: 130, align: "center" },
    { key: "farmer_category",   kn: "ರೈತರ ವರ್ಗ",     en: "Category",   w: 130, align: "center", chip: "category" },
    { key: "plantation_type",   kn: "ನಾಟಿ/ವಿಸ್ತರಣೆ", en: "Type",       w: 110, align: "center", chip: "type" },
  ];

  const chipStyle = (kind, val) => {
    const v = String(val || "").toLowerCase();
    let bg = "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color = "#334155";
    if (kind === "variety") {
      if (v.includes("v1") || v.includes("v-1"))     { bg = "linear-gradient(135deg,#bbf7d0,#86efac)"; color = "#14532d"; }
      else if (v.includes("s13") || v.includes("s-13")) { bg = "linear-gradient(135deg,#fef3c7,#fde68a)"; color = "#78350f"; }
      else if (v.includes("s34") || v.includes("s-34")) { bg = "linear-gradient(135deg,#dbeafe,#bfdbfe)"; color = "#1e3a8a"; }
      else if (v.includes("s36") || v.includes("s-36")) { bg = "linear-gradient(135deg,#cffafe,#a5f3fc)"; color = "#155e75"; }
      else if (v.includes("s54") || v.includes("s-54")) { bg = "linear-gradient(135deg,#ede9fe,#ddd6fe)"; color = "#5b21b6"; }
      else                                              { bg = "linear-gradient(135deg,#fbcfe8,#f9a8d4)"; color = "#9d174d"; }
    } else if (kind === "type") {
      if (v.includes("ಹೊಸ") || v.includes("new")) { bg = "linear-gradient(135deg,#dcfce7,#bbf7d0)"; color = "#14532d"; }
      else                                          { bg = "linear-gradient(135deg,#dbeafe,#bfdbfe)"; color = "#1e40af"; }
    } else if (kind === "category") {
      bg = "linear-gradient(135deg,#fef3c7,#fde68a)"; color = "#92400e";
    } else if (kind === "date") {
      bg = "linear-gradient(135deg,#e0e7ff,#c7d2fe)"; color = "#3730a3";
    }
    return { bg, color };
  };

  return (
    <Layout title={t("TSC Monthly Plantation Detail — Sheet 4")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ಹೊಸ ಹಿಪ್ಪುನೇರಳೆ ನಾಟಿ ವಿವರ — ಮಾಸಿಕ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
                color: "#14532d", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #86efac", verticalAlign: "middle",
              }}>Sheet-4 · Per-farmer rows</span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#5b57ac 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📝</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ಹೊಸ ಹಿಪ್ಪುನೇರಳೆ ನಾಟಿ ವಿವರ — TSC-wise New Plantation Detail
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>SHEET 4</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>
                Per-farmer planting events — Farmer · Village · Area · Variety · Survey · Method · Seed Source · Category
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
                    <label style={lbl}>Quick Search (TSC, Farmer, Village, Variety…)</label>
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
          <div className="tscpld-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "190px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>District / Taluk</span>
                <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{districtName} · {talukName}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Plantings</span>
                <span className="tscpld-num" style={{ fontSize: "16px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{kpis.events.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#1e40af", marginTop: "2px" }}>events this month</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "170px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Total Area</span>
                <span className="tscpld-num" style={{ fontSize: "16px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{fmtArea(kpis.totalArea)} ha</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fbcfe8,#fce7f3)", border: "1.5px solid #f9a8d4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#9d174d", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Distinct Farmers</span>
                <span className="tscpld-num" style={{ fontSize: "16px", color: "#831843", fontWeight: 800, marginTop: "2px" }}>{kpis.farmers.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>TSCs / Villages</span>
                <span className="tscpld-num" style={{ fontSize: "14px", color: "#155e75", fontWeight: 800, marginTop: "2px" }}>{kpis.tscs} / {kpis.villages}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Top Variety</span>
                <span style={{ fontSize: "14px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{kpis.topVariety}</span>
                <span className="tscpld-num" style={{ fontSize: "11px", color: "#6d28d9", fontWeight: 700, marginTop: "2px" }}>{fmtArea(kpis.topVarietyArea)} ha</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                Sheet-4 · ಹೊಸ ಹಿಪ್ಪುನೇರಳೆ ನಾಟಿ ವಿವರ — {talukName} — {monthKn} {filter.year}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  TSC-wise New Mulberry Plantation Detail · per-farmer planting events · {monthLabel} {filter.year}
                </div>
              </div>

              <div className="tscpld-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1700px" }}>
                  <thead>
                    <tr>
                      {COLS.map((c, i) => {
                        const isFirst = i === 0;
                        const isSecond = i === 1;
                        const bg = isFirst
                          ? "linear-gradient(135deg,#1e293b,#36506b)"
                          : isSecond
                            ? "linear-gradient(135deg,#334155,#475569)"
                            : (i < 5 ? "linear-gradient(135deg,#0f766e,#14b8a6)" : "linear-gradient(135deg,#5b57ac,#7c3aed)");
                        return (
                          <th key={c.key} style={{
                            background: bg, color: "#fff",
                            padding: "10px 8px", textAlign: c.align === "left" ? "left" : "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: c.w, position: "sticky", top: 0, zIndex: 2,
                          }}>
                            <div style={{ fontSize: "11.5px" }}>{c.kn}</div>
                            <div style={{ fontSize: "9px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>{c.en}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && (
                      <tr>
                        <td colSpan={COLS.length} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          {dataRows.length === 0
                            ? "ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / No records found."
                            : `No matches for "${search}".`}
                        </td>
                      </tr>
                    )}
                    {filteredRows.map((row, ri) => {
                      const rowBg = ri % 2 === 1 ? "#f8fafc" : "#ffffff";
                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="tscpld-tr" style={{ background: rowBg }}>
                          {COLS.map((c, ci) => {
                            const v = row[c.key];
                            const display = c.num ? fmtArea(v) : (v == null || v === "" ? "—" : v);
                            const baseStyle = {
                              padding: "9px 10px",
                              textAlign: c.align,
                              borderBottom: "1px solid #e2e8f0",
                              borderRight: "1px solid #eef2f6",
                              color: "#0f172a",
                              fontWeight: c.strong ? 700 : 500,
                              whiteSpace: "nowrap",
                              fontSize: "12px",
                            };
                            if (ci === 0) {
                              return (
                                <td key={c.key} style={{ ...baseStyle, color: "#475569", fontWeight: 700 }}>
                                  <span style={{
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    minWidth: "26px", height: "26px", borderRadius: "50%",
                                    background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)",
                                    color: "#1e293b", fontWeight: 800, fontSize: "11px",
                                  }}>{v}</span>
                                </td>
                              );
                            }
                            if (c.chip) {
                              const has = display && display !== "—";
                              const ch = chipStyle(c.chip, v);
                              return (
                                <td key={c.key} style={baseStyle}>
                                  {has ? (
                                    <span style={{
                                      display: "inline-block",
                                      padding: "3px 10px", borderRadius: "12px",
                                      background: ch.bg, color: ch.color,
                                      fontWeight: 800, fontSize: "11px",
                                      maxWidth: "100%", whiteSpace: "nowrap",
                                      overflow: "hidden", textOverflow: "ellipsis",
                                    }}>{display}</span>
                                  ) : <span style={{ color: "#cbd5e0" }}>—</span>}
                                </td>
                              );
                            }
                            if (c.num) {
                              return (
                                <td key={c.key} className="tscpld-num" style={{
                                  ...baseStyle,
                                  color: numOrZero(v) > 0 ? "#14532d" : "#cbd5e0",
                                  fontWeight: 700,
                                }}>
                                  {display}
                                </td>
                              );
                            }
                            return (
                              <td key={c.key} style={baseStyle}>
                                {display}
                              </td>
                            );
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
                  &nbsp;·&nbsp; Sheet-4 — Plantation Detail · {filteredRows.length} / {dataRows.length} rows
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

export default TscMonthlyPlantationDetailReport;
