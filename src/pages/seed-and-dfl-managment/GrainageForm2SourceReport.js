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

if (!document.getElementById("gf2-styles")) {
  const s = document.createElement("style");
  s.id = "gf2-styles";
  s.innerHTML = `
    .gf2-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gf2-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gf2-swal .swal2-icon { margin:20px auto 4px !important; }
    .gf2-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gf2-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gf2-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .gf2-wrap { animation: gf2-in .35s ease; }
    .gf2-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gf2-table th { letter-spacing:.02em; }
    .gf2-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gf2-scroll::-webkit-scrollbar { height:9px; }
    .gf2-scroll::-webkit-scrollbar-track { background:#f0fdfa; border-radius:6px; }
    .gf2-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#3730a3); border-radius:6px; }
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

const grainageSelectStyles = {
  control: (base, state) => ({
    ...base, borderRadius: "8px",
    border: state.isFocused ? "1.5px solid #0f766e" : "1.5px solid #d0d9e8",
    background: "#f0fdfa",
    minHeight: "38px", fontSize: "13px", color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(15,118,110,.18)" : "none",
    "&:hover": { border: "1.5px solid #0f766e" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (base) => ({ ...base, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#0f766e" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(15,118,110,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base, fontSize: "13px", padding: "8px 12px",
    background: state.isSelected ? "linear-gradient(135deg,#0f766e,#14b8a6)" : state.isFocused ? "#ecfdf5" : "#fff",
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

// Section meta — Form-2 has fewer rows than Form-1 since each metric is split
// only by source (farm vs seed) rather than across multiple races.
const SECTION_META = {
  "1":  { icon: "🎯", hue: "amber",   en: "Annual Target" },
  "2":  { icon: "📅", hue: "amber",   en: "Monthly Target" },
  "3":  { icon: "📦", hue: "teal",    en: "Total Stored Lots" },
  "4":  { icon: "🪺", hue: "orange",  en: "Stored Bivoltine Cocoons (by source)" },
  "5":  { icon: "👥", hue: "violet",  en: "Pairs Obtained (by source)" },
  "6":  { icon: "🥚", hue: "indigo",  en: "DFLs Obtained (by source)" },
  "7":  { icon: "📊", hue: "emerald", en: "Yield (by source)", isPct: true },
  "8":  { icon: "🦠", hue: "rose",    en: "Pebrine Destroyed DFLs" },
  "9":  { icon: "🥚", hue: "blue",    en: "DFLs Received" },
  "10": { icon: "Σ",  hue: "emerald", en: "Aggregate Totals" },
  "11": { icon: "💸", hue: "rose",    en: "Expense (₹)" },
  "12": { icon: "💰", hue: "rose",    en: "Production Cost / 100 DFL" },
  "13": { icon: "📈", hue: "emerald", en: "Profit / Loss (₹)" },
};

const HUE = {
  amber:   { band: "linear-gradient(135deg,#fed7aa,#fdba74)", text: "#7c2d12", chipBg: "#fff7ed" },
  teal:    { band: "linear-gradient(135deg,#99f6e4,#5eead4)", text: "#134e4a", chipBg: "#f0fdfa" },
  emerald: { band: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", text: "#064e3b", chipBg: "#ecfdf5" },
  blue:    { band: "linear-gradient(135deg,#bfdbfe,#93c5fd)", text: "#1e3a8a", chipBg: "#eff6ff" },
  indigo:  { band: "linear-gradient(135deg,#c7d2fe,#a5b4fc)", text: "#3730a3", chipBg: "#eef2ff" },
  violet:  { band: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", text: "#4c1d95", chipBg: "#f5f3ff" },
  rose:    { band: "linear-gradient(135deg,#fecdd3,#fda4af)", text: "#881337", chipBg: "#fff1f2" },
  orange:  { band: "linear-gradient(135deg,#fed7aa,#fb923c)", text: "#7c2d12", chipBg: "#fff7ed" },
  slate:   { band: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", text: "#334155", chipBg: "#f8fafc" },
};

// Source-pill mapping by Kannada sub-label
const SOURCE_PILL = (sub) => {
  const s = String(sub || "").trim();
  if (s === "ಅ") return { bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1e3a8a", label: "ಅ · ಕೃಷಿ ಕ್ಷೇತ್ರಗಳಿಂದ Farm-source" };
  if (s === "ಆ") return { bg: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", color: "#4c1d95", label: "ಆ · ಬಿತ್ತನೆ ಸಂಬಂಧದಿಂದ Seed-source" };
  if (s === "ಒಟ್ಟು" || s.startsWith("ಒಟ್ಟು") || s.endsWith("ಒ"))
                  return { bg: "linear-gradient(135deg,#fcd34d,#fbbf24)", color: "#78350f", label: s + " · Total" };
  return            { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#334155", label: s };
};

const isTotalSub = (sub) => {
  const s = String(sub || "").trim();
  return s === "ಒಟ್ಟು" || s.startsWith("ಒಟ್ಟು") || s.endsWith("ಒ");
};

const hasAny = (row) => {
  const v = (k) => String(row[k] ?? "").trim();
  return [v("cy_month"), v("cy_cum"), v("py_month"), v("py_cum")].some((x) => x !== "");
};

function GrainageForm2SourceReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ grainageId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [grainageList,      setGrainageList]      = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "grainageMaster/get-all").then((r) => setGrainageList(r.data.content.grainageMaster || [])).catch(() => setGrainageList([]));
    api.get(baseURL + "financialYearMaster/get-all").then((r) => setFinancialYearList(r.data.content.financialYearMaster || [])).catch(() => setFinancialYearList([]));
    api.get(baseURL + "financialYearMaster/get-is-default").then((r) => {
      const fy = r.data.content;
      if (fy) {
        setFilter((p) => ({ ...p, financialYearMasterId: fy.financialYearMasterId }));
        setFyStartYear(extractYear(fy.financialYear));
      }
    }).catch(() => {});
  }, []);

  const extractYear = (str) => {
    if (!str) return null;
    const yr = parseInt(String(str).trim().split("-")[0], 10);
    return isNaN(yr) ? null : yr;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((p) => ({ ...p, [name]: value }));
    setHasReport(false); setDataRows([]);
    if (name === "financialYearMasterId") {
      const sel2 = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel2 ? extractYear(sel2.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.grainageId)            return "Please select a Grainage.";
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
      background: "#fff", customClass: { popup: "gf2-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gf2-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { grainageId: filter.grainageId, year, month: m };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-form2-source", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch {
      showErr("Fetch Failed", "Failed to load the Grainage Form-2 Source-split report.");
    } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-form2-source/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-form2-source/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `grainage_form2_source_${filter.grainageId}_${year}_${m}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedGrainage = grainageList.find((g) => String(g.grainageMasterId) === String(filter.grainageId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const grainageName = selectedGrainage?.grainageMasterName || "—";

  const grouped = useMemo(() => {
    const map = new Map();
    dataRows.forEach((r) => {
      const k = String(r.serial_number);
      if (!map.has(k)) map.set(k, { sn: k, rows: [] });
      map.get(k).rows.push(r);
    });
    return Array.from(map.values());
  }, [dataRows]);

  const kpis = useMemo(() => {
    const find = (sn, sub) => dataRows.find(
      (r) => String(r.serial_number) === String(sn) && String(r.sub_label).trim() === (sub ?? "")
    ) || {};
    const annual = find(1);
    const monthly = find(2);
    const totalLots = find(3);
    const cocoonsTot = find(4, "ಒಟ್ಟು");
    const dflsTot = find(6, "ಒಟ್ಟು");
    const yieldTot = find(7, "ಒಟ್ಟು");
    const pebrine = find(8);
    const recv = find(9);
    return {
      annualCY: numOrZero(annual.cy_month),
      annualPY: numOrZero(annual.py_month),
      monthlyCY: numOrZero(monthly.cy_month),
      lotsCY: numOrZero(totalLots.cy_month),
      lotsCYCum: numOrZero(totalLots.cy_cum),
      cocCY: numOrZero(cocoonsTot.cy_month),
      cocCYCum: numOrZero(cocoonsTot.cy_cum),
      dflsCY: numOrZero(dflsTot.cy_month),
      dflsCYCum: numOrZero(dflsTot.cy_cum),
      yieldCY: numOrZero(yieldTot.cy_month),
      pebrineCY: numOrZero(pebrine.cy_month),
      recvCY: numOrZero(recv.cy_month),
      populated: dataRows.filter(hasAny).length,
      total: dataRows.length,
    };
  }, [dataRows]);

  const achPct = kpis.monthlyCY === 0 ? 0 : (kpis.dflsCY / kpis.monthlyCY) * 100;

  return (
    <Layout title={t("Grainage Form-2 · Source-split Monthly Progress")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ಪಾತ ಸಂಖ್ಯೆ-2 · ಬಿತ್ತನೆ ಕೋಠಿ ಮಾಹೆಯ ಪ್ರಗತಿಯ ವರದಿ (ಮೂಲವಾರು)")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#dbeafe,#c7d2fe)",
            color: "#3730a3", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #a5b4fc", verticalAlign: "middle",
          }}>P1 & P2 · Bivoltine · Form-2 · Source-split</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(15,118,110,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#1e40af 0%,#0f766e 50%,#5b21b6 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🔀</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಪಾತ ಸಂಖ್ಯೆ-2 · ಬಿತ್ತನೆ ಕೋಠಿ — ಮಾಹೆಯ ಪ್ರಗತಿಯ ವರದಿ (ಮೂಲವಾರು)
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Form-2</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P1 &amp; P2 Grainage (Bivoltine) — Source-split Monthly Progress: Farm-source vs Seed-source (CY vs PY)</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{grainageName}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f0fdfa)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>Grainage <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={grainageList.map((g) => ({
                      value: String(g.grainageMasterId),
                      label: g.grainageMasterName + (g.grainageType ? ` · ${g.grainageType}` : ""),
                    }))}
                    placeholder="— Search Grainage —"
                    isSearchable isClearable
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={grainageSelectStyles}
                    value={
                      grainageList
                        .map((g) => ({
                          value: String(g.grainageMasterId),
                          label: g.grainageMasterName + (g.grainageType ? ` · ${g.grainageType}` : ""),
                        }))
                        .find((o) => o.value === String(filter.grainageId)) || null
                    }
                    onChange={(opt) => {
                      setFilter((p) => ({ ...p, grainageId: opt?.value || "" }));
                      setHasReport(false); setDataRows([]);
                    }}
                    noOptionsMessage={() => "No grainage found"}
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
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#1e40af,#3730a3)", "0 4px 12px rgba(30,64,175,.32)", isLoading)}>
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
          <div className="gf2-wrap mt-4">
            {/* Source-split legend strip */}
            <div className="d-flex flex-wrap gap-2 mb-3">
              <div style={legendChip("linear-gradient(135deg,#dbeafe,#bfdbfe)", "#1e3a8a", "#93c5fd")}>
                <span style={{ fontWeight: 800, fontSize: "11px" }}>ಅ</span>
                <span style={{ fontSize: "11.5px", fontWeight: 700 }}>ಕೃಷಿ ಕ್ಷೇತ್ರಗಳಿಂದ · Farm-source</span>
              </div>
              <div style={legendChip("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95", "#a78bfa")}>
                <span style={{ fontWeight: 800, fontSize: "11px" }}>ಆ</span>
                <span style={{ fontSize: "11.5px", fontWeight: 700 }}>ಬಿತ್ತನೆ ಸಂಬಂಧದಿಂದ · Seed-source</span>
              </div>
              <div style={legendChip("linear-gradient(135deg,#fcd34d,#fbbf24)", "#78350f", "#f59e0b")}>
                <span style={{ fontWeight: 800, fontSize: "11px" }}>Σ</span>
                <span style={{ fontSize: "11.5px", fontWeight: 700 }}>ಒಟ್ಟು · Total</span>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpi("#ccfbf1", "#5eead4", "#0f766e")}>
                <span style={kpiLbl("#0f766e")}>Grainage</span>
                <span style={{ ...kpiVal("#134e4a", 14), fontWeight: 800 }}>{grainageName}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>Period</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={kpi("#fed7aa", "#fb923c", "#7c2d12")}>
                <span style={kpiLbl("#7c2d12")}>📅 ಮಾಸ ಗುರಿ Monthly Tgt</span>
                <span className="gf2-num" style={kpiVal("#7c2d12", 16)}>{kpis.monthlyCY.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#9a3412", fontWeight: 700, marginTop: "1px" }}>Annual: {kpis.annualCY.toLocaleString()}</span>
              </div>
              <div style={kpi("#a7f3d0", "#6ee7b7", "#065f46")}>
                <span style={kpiLbl("#065f46")}>📦 ಶೇಖರಿಸಿದ Stored Lots</span>
                <span className="gf2-num" style={kpiVal("#064e3b", 16)}>{kpis.lotsCY.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#065f46", fontWeight: 700, marginTop: "1px" }}>FY Cum: {kpis.lotsCYCum.toLocaleString()}</span>
              </div>
              <div style={kpi("#fed7aa", "#fdba74", "#9a3412")}>
                <span style={kpiLbl("#9a3412")}>🪺 ಗೂಡು Cocoons</span>
                <span className="gf2-num" style={kpiVal("#7c2d12", 16)}>{kpis.cocCY.toLocaleString()}</span>
              </div>
              <div style={kpi("#ddd6fe", "#a78bfa", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>🥚 ಮೊಟ್ಟೆ DFLs</span>
                <span className="gf2-num" style={kpiVal("#4c1d95", 16)}>{kpis.dflsCY.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#5b21b6", fontWeight: 700, marginTop: "1px" }}>FY Cum: {kpis.dflsCYCum.toLocaleString()}</span>
              </div>
              <div style={kpi("#bbf7d0", "#86efac", "#14532d")}>
                <span style={kpiLbl("#14532d")}>📊 ಇಳುವರಿ Yield</span>
                <span className="gf2-num" style={kpiVal("#14532d", 16)}>{kpis.yieldCY.toFixed(2)}%</span>
              </div>
              <div style={{
                ...kpi(
                  achPct >= 100 ? "#bbf7d0" : achPct >= 75 ? "#a7f3d0" : achPct >= 50 ? "#fde68a" : "#fecaca",
                  achPct >= 100 ? "#86efac" : achPct >= 75 ? "#6ee7b7" : achPct >= 50 ? "#fcd34d" : "#fca5a5",
                  achPct >= 100 ? "#14532d" : achPct >= 75 ? "#065f46" : achPct >= 50 ? "#92400e" : "#7f1d1d",
                ),
              }}>
                <span style={kpiLbl(achPct >= 100 ? "#14532d" : achPct >= 75 ? "#065f46" : achPct >= 50 ? "#92400e" : "#7f1d1d")}>
                  {achPct >= 100 ? "🎉" : "📊"} DFL / Goal
                </span>
                <span className="gf2-num" style={kpiVal(achPct >= 100 ? "#14532d" : achPct >= 75 ? "#064e3b" : achPct >= 50 ? "#78350f" : "#7f1d1d", 16)}>{achPct.toFixed(2)}%</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#1e3a8a,#0f766e 50%,#5b21b6)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                ಪಾತ ಸಂಖ್ಯೆ-2 · ಬಿತ್ತನೆ ಕೋಠಿ {grainageName} &nbsp;·&nbsp; {monthKn} {monthYear || ""} (ಮೂಲವಾರು)
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Form-2 · Source-split Monthly Progress &nbsp;·&nbsp; CY vs PY &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="gf2-scroll" style={{ overflowX: "auto" }}>
                <table className="gf2-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1300px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "320px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರಗಳು</div><div style={hdrEn}>Description</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#475569,#64748b)", "200px", true)}>
                        <div style={{ fontSize: "12px" }}>ಮೂಲ</div><div style={hdrEn}>Source</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#0f766e,#14b8a6)")}>
                        <div style={{ fontSize: "12.5px" }}>ಪ್ರಸಕ್ತ ವರ್ಷ {monthYear ? `${monthYear}-${(monthYear + 1) % 100}` : ""}</div>
                        <div style={hdrEn}>Current Year</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#3730a3,#6366f1)")}>
                        <div style={{ fontSize: "12.5px" }}>ಹಿಂದಿನ ವರ್ಷ {monthYear ? `${monthYear - 1}-${monthYear % 100}` : ""}</div>
                        <div style={hdrEn}>Previous Year</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={subhdr("linear-gradient(135deg,#99f6e4,#5eead4)", "#134e4a")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸ</div><div style={subhdrEn}>Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#5eead4,#2dd4bf)", "#0f766e")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸಾಂತ್ಯ</div><div style={subhdrEn}>Cumulative</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#c7d2fe,#a5b4fc)", "#312e81")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸ</div><div style={subhdrEn}>Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#a5b4fc,#818cf8)", "#3730a3")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸಾಂತ್ಯ</div><div style={subhdrEn}>Cumulative</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.length === 0 && (
                      <tr><td colSpan={7} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#f0fdfa,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🔀</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f766e", marginBottom: "4px" }}>ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No Form-2 source-split data found for this grainage in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {grouped.map((g) => {
                      const meta = SECTION_META[g.sn] || { icon: "·", hue: "slate", en: "" };
                      const pal = HUE[meta.hue];
                      return g.rows.map((row, ri) => {
                        const isFirst = ri === 0;
                        const sub = String(row.sub_label ?? "").trim();
                        const populated = hasAny(row);
                        const muted = !populated;
                        const totalSub = isTotalSub(sub);
                        const srcPill = SOURCE_PILL(sub);
                        return (
                          <tr key={`${g.sn}-${ri}`} className="gf2-tr"
                              style={{
                                background: totalSub
                                  ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                                  : (ri % 2 === 1 ? "#f8fafc" : "#ffffff"),
                                opacity: muted && !totalSub ? .6 : 1,
                              }}>
                            {isFirst && (
                              <td rowSpan={g.rows.length} style={{
                                padding: "10px 6px", textAlign: "center",
                                borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                                background: pal.band,
                                verticalAlign: "middle",
                              }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                  <span style={{ fontSize: "16px" }}>{meta.icon}</span>
                                  <span style={{
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    minWidth: "26px", height: "26px", borderRadius: "50%",
                                    background: "rgba(255,255,255,.92)",
                                    color: pal.text, fontWeight: 800, fontSize: "11.5px",
                                  }}>{g.sn}</span>
                                </div>
                              </td>
                            )}
                            <td style={{
                              padding: "10px 14px", textAlign: "left",
                              borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #e2e8f0",
                              color: totalSub ? "#78350f" : "#0f172a",
                              fontWeight: totalSub ? 800 : (sub ? 600 : 700),
                              fontSize: "12.5px",
                              background: isFirst && !sub ? pal.chipBg : "transparent",
                              paddingLeft: sub ? "30px" : "14px",
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span>{row.description_kannada || "—"}</span>
                                {meta.en && isFirst && (
                                  <span style={{ fontSize: "10.5px", fontWeight: 700, color: pal.text, opacity: .85 }}>
                                    · {meta.en}
                                  </span>
                                )}
                                {muted && !totalSub && (
                                  <span style={{
                                    fontSize: "9.5px", fontWeight: 700,
                                    color: "#64748b", background: "#f1f5f9",
                                    padding: "2px 7px", borderRadius: "999px",
                                    border: "1px solid #cbd5e1",
                                  }}>not tracked</span>
                                )}
                              </div>
                            </td>
                            <td style={{
                              padding: "10px 8px", textAlign: "left",
                              borderBottom: "1px solid #f1f5f9", borderRight: "2px solid #e2e8f0",
                            }}>
                              {sub ? (
                                <span style={{
                                  display: "inline-block", padding: "3px 12px", borderRadius: "999px",
                                  background: srcPill.bg, color: srcPill.color,
                                  fontWeight: 800, fontSize: "11px",
                                }}>{srcPill.label}</span>
                              ) : (
                                <span style={{ color: "#cbd5e0", fontSize: "11px" }}>—</span>
                              )}
                            </td>
                            <ValCell v={row.cy_month} isPct={meta.isPct} totalSub={totalSub}
                                     muted="#cbd5e0" full="#134e4a" bg="linear-gradient(135deg,#f0fdfa,#ccfbf1)" />
                            <ValCell v={row.cy_cum} isPct={meta.isPct} totalSub={totalSub}
                                     muted="#cbd5e0" full="#0f766e" bg="linear-gradient(135deg,#ccfbf1,#99f6e4)" right="2px solid #e2e8f0" weight={800} />
                            <ValCell v={row.py_month} isPct={meta.isPct} totalSub={totalSub}
                                     muted="#cbd5e0" full="#312e81" bg="linear-gradient(135deg,#eef2ff,#e0e7ff)" />
                            <ValCell v={row.py_cum} isPct={meta.isPct} totalSub={totalSub}
                                     muted="#cbd5e0" full="#3730a3" bg="linear-gradient(135deg,#e0e7ff,#c7d2fe)" weight={800} />
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #a7f3d0" }}>
                <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                  Form-2 · {grainageName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {kpis.populated}/{kpis.total} rows populated &nbsp;·&nbsp; DFL achievement {achPct.toFixed(1)}% &nbsp;·&nbsp; Yield {kpis.yieldCY.toFixed(2)}%
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

function ValCell({ v, isPct, totalSub, muted, full, bg, right, weight }) {
  const s = String(v ?? "").trim();
  const empty = s === "";
  const n = numOrZero(v);
  const isZero = !empty && n === 0;
  const display = empty ? "—" : (isPct ? `${fmt(v)}%` : fmt(v));
  return (
    <td className="gf2-num" style={{
      padding: "10px 12px", textAlign: "right",
      borderBottom: "1px solid #f1f5f9",
      borderRight: right || "1px solid #f8fafc",
      background: empty || isZero ? "transparent" : (totalSub ? "linear-gradient(135deg,#fde68a,#fcd34d)" : bg),
      color: empty ? muted : (totalSub ? "#78350f" : (isZero ? "#94a3b8" : full)),
      fontWeight: weight || (totalSub ? 800 : 700),
      fontSize: "12.5px",
    }}>{display}</td>
  );
}

const legendChip = (bg, color, border) => ({
  display: "inline-flex", alignItems: "center", gap: "8px",
  padding: "5px 12px", borderRadius: "999px",
  background: bg, color, border: `1px solid ${border}`,
});

const kpi = (bgFrom, border, _t) => ({
  background: `linear-gradient(135deg,${bgFrom},#ffffff)`,
  border: `1.5px solid ${border}`,
  borderRadius: "12px",
  padding: "10px 18px",
  display: "flex", flexDirection: "column", minWidth: "180px",
});
const kpiLbl = (color) => ({ fontSize: "11px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" });
const kpiVal = (color, sz) => ({ fontSize: `${sz}px`, color, fontWeight: 800, marginTop: "2px" });

const hdrEn = { fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" };
const subhdrEn = { fontSize: "8.5px", opacity: .8, marginTop: "1px", fontWeight: 700 };
const hdr = (bg, minW, single, align) => ({
  background: bg, color: "#fff",
  padding: "10px 8px", textAlign: align || "center",
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

export default GrainageForm2SourceReport;
