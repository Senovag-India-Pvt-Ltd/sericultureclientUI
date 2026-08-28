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

if (!document.getElementById("glw-styles")) {
  const s = document.createElement("style");
  s.id = "glw-styles";
  s.innerHTML = `
    .glw-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .glw-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .glw-swal .swal2-icon { margin:20px auto 4px !important; }
    .glw-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .glw-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes glw-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .glw-wrap { animation: glw-in .35s ease; }
    .glw-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .glw-table th { letter-spacing:.02em; }
    .glw-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .glw-mono { font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; }
    .glw-scroll::-webkit-scrollbar { height:9px; }
    .glw-scroll::-webkit-scrollbar-track { background:#f0fdfa; border-radius:6px; }
    .glw-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#3730a3); border-radius:6px; }
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

// Detects date strings sent by the SQL (CONVERT style 103 → DD/MM/YYYY)
// Matches a single date, a range ("dd/mm/yyyy - dd/mm/yyyy"), or a comma-list of
// dates ("dd/mm/yyyy, dd/mm/yyyy, ..."). Without the range/list arms, the spun-on
// and multi-moth-date cells fall through to numeric parsing and render as a bare day.
const isDateLike = (s) => /^\s*\d{1,2}\/\d{1,2}\/\d{4}(\s*[-,]\s*\d{1,2}\/\d{1,2}\/\d{4})*\s*$/.test(String(s ?? ""));

// Section meta — icon + hue per Sl group, plus row-level overrides
const SECTION_META = {
  "1":  { icon: "📥", hue: "teal",    en: "Received Cocoons" },
  "2":  { icon: "📦", hue: "orange",  en: "Stored for Seed" },
  "3":  { icon: "🚫", hue: "rose",    en: "Rejected Cocoons" },
  "4":  { icon: "🦠", hue: "red",     en: "Pebrine Test Result", isStatus: true },
  "5":  { icon: "👥", hue: "violet",  en: "Pairs Obtained" },
  "6":  { icon: "🦋", hue: "indigo",  en: "Moth Emergence Date", isDate: true },
  "7":  { icon: "🥚", hue: "emerald", en: "DFLs Obtained" },
  "8":  { icon: "📊", hue: "lime",    en: "Yield (%)", isPct: true },
  "9":  { icon: "🚚", hue: "blue",    en: "DFL Distribution" },
};

const HUE = {
  teal:    { band: "linear-gradient(135deg,#99f6e4,#5eead4)", text: "#134e4a", chipBg: "#f0fdfa" },
  orange:  { band: "linear-gradient(135deg,#fed7aa,#fb923c)", text: "#7c2d12", chipBg: "#fff7ed" },
  rose:    { band: "linear-gradient(135deg,#fecdd3,#fda4af)", text: "#881337", chipBg: "#fff1f2" },
  red:     { band: "linear-gradient(135deg,#fecaca,#fca5a5)", text: "#7f1d1d", chipBg: "#fef2f2" },
  violet:  { band: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", text: "#4c1d95", chipBg: "#f5f3ff" },
  indigo:  { band: "linear-gradient(135deg,#c7d2fe,#a5b4fc)", text: "#3730a3", chipBg: "#eef2ff" },
  emerald: { band: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", text: "#064e3b", chipBg: "#ecfdf5" },
  lime:    { band: "linear-gradient(135deg,#d9f99d,#bef264)", text: "#3f6212", chipBg: "#f7fee7" },
  blue:    { band: "linear-gradient(135deg,#bfdbfe,#93c5fd)", text: "#1e3a8a", chipBg: "#eff6ff" },
  slate:   { band: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", text: "#334155", chipBg: "#f8fafc" },
};

// Pebrine status pill for section 4
const STATUS_STYLE = (status) => {
  const s = String(status || "").trim().toLowerCase();
  if (!s) return { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#475569", icon: "·", label: "—" };
  if (s.includes("disease") && !s.includes("free"))
                      return { bg: "linear-gradient(135deg,#fecaca,#fca5a5)", color: "#7f1d1d", icon: "🦠", label: status };
  if (s.includes("free"))
                      return { bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d", icon: "✅", label: status };
  return                  { bg: "linear-gradient(135deg,#fed7aa,#fdba74)", color: "#7c2d12", icon: "⚠️", label: status };
};

// "Total" sub-row detector
const isTotalSub = (sub) => {
  const s = String(sub || "").trim();
  return s === "ಒಟ್ಟು" || s.startsWith("ಒಟ್ಟು") || s.endsWith("ಒ");
};

const hasAnyLot = (row) => {
  return ["lot1", "lot2", "lot3", "lot4"].some((k) => String(row[k] ?? "").trim() !== "");
};

function GrainageLotwiseDetailReport() {
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
    if (!filter.grainageId)            return t("Please select a Grainage.", { ns: "reports" });
    if (!filter.financialYearMasterId) return t("Please select a Financial Year.", { ns: "reports" });
    if (!filter.month)                 return t("Please select a Month.", { ns: "reports" });
    if (!fyStartYear)                  return t("Could not determine the financial year start year.", { ns: "reports" });
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: t("Required Fields", { ns: "reports" }),
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">${t("Missing Selection", { ns: "reports" })}</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "glw-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close", { ns: "reports" }), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "glw-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-lotwise-detail", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          showErr(t("No Data Found", { ns: "reports" }), t("No data found for the selected filters.", { ns: "reports" }));
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the lot-wise report. Please try again.", { ns: "reports" }));
        }
      } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-lotwise-detail/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-lotwise-detail/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `grainage_lotwise_detail_${filter.grainageId}_${year}_${m}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedGrainage = grainageList.find((g) => String(g.grainageMasterId) === String(filter.grainageId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const grainageName = selectedGrainage?.grainageMasterName || "—";

  // Lift the lot-number header row out of the body
  const lotHeaderRow = useMemo(() => {
    return dataRows.find((r) => String(r.sl_no) === "0") || {};
  }, [dataRows]);

  // Group remaining rows (sl_no >= 1) by serial_number for rowSpan rendering
  const grouped = useMemo(() => {
    const map = new Map();
    dataRows.filter((r) => String(r.sl_no) !== "0").forEach((r) => {
      const k = String(r.sl_no);
      if (!map.has(k)) map.set(k, { sn: k, rows: [] });
      map.get(k).rows.push(r);
    });
    return Array.from(map.values());
  }, [dataRows]);

  // KPI extraction — count active lots and sum key metrics
  const kpis = useMemo(() => {
    const activeLotCount = ["lot1", "lot2", "lot3", "lot4"]
      .filter((k) => String(lotHeaderRow[k] ?? "").trim() !== "").length;
    const find = (sn, sub) => dataRows.find(
      (r) => String(r.sl_no) === String(sn) && String(r.sub_label).trim() === (sub ?? "")
    ) || {};
    const ripeRow      = find(1, "ಇ");
    const dflsTotalRow = find(7, "ಒಟ್ಟು");
    const distTotalRow = find(9, "ಒಟ್ಟು");
    const yieldVsRcv   = find(8, "ಅ");
    const sumLots = (r) => ["lot1", "lot2", "lot3", "lot4"].reduce((a, k) => a + numOrZero(r[k]), 0);
    return {
      activeLotCount,
      ripeCocoonsTotal:   sumLots(ripeRow),
      dflsTotalAcrossLots: sumLots(dflsTotalRow),
      distTotalAcrossLots: sumLots(distTotalRow),
      yieldAvg: (() => {
        const vals = ["lot1", "lot2", "lot3", "lot4"]
          .map((k) => numOrZero(yieldVsRcv[k]))
          .filter((v, i) => String(lotHeaderRow[`lot${i + 1}`] ?? "").trim() !== "");
        if (!vals.length) return 0;
        return vals.reduce((a, v) => a + v, 0) / vals.length;
      })(),
    };
  }, [dataRows, lotHeaderRow]);

  return (
    <Layout title={t("Lot-wise Detail (top 4 lots)", { ns: "reports" })}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ತಂಡಗಳವಾರು ವಿವರ ವರದಿ — ಬಿತ್ತನೆಕೋಠಿ (Top-4 Lots)")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
            color: "#0f766e", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #5eead4", verticalAlign: "middle",
          }}>P1 & P2 · Bivoltine · Lot-wise · Top 4</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(15,118,110,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#3730a3 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🧩</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ತಂಡಗಳವಾರು ವಿವರ ವರದಿ — ಬಿತ್ತನೆ ಕೋಠಿ (ಮೊದಲ 4 ತಂಡಗಳು)
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Lot-wise</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P1 &amp; P2 Grainage (Bivoltine) — Top-4 lots × 9 attribute groups (Receipt → Storage → Reject → Pebrine → Pairs → Moth → DFLs → Yield → Distribution)</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{grainageName}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{kpis.activeLotCount} active lot{kpis.activeLotCount === 1 ? "" : "s"}</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f0fdfa)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>{t("Grainage", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={grainageList.map((g) => ({
                      value: String(g.grainageMasterId),
                      label: g.grainageMasterName + (g.grainageType ? ` · ${g.grainageType}` : ""),
                    }))}
                    placeholder={t("— Search Grainage —", { ns: "reports" })}
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
                    noOptionsMessage={() => t("No grainage found", { ns: "reports" })}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Financial Year", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Year —", { ns: "reports" })}</option>
                    {financialYearList.map((f) => (<option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">{t("— Month —", { ns: "reports" })}</option>
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> {t("Loading…", { ns: "reports" })}</> : <>📋 {t("View", { ns: "reports" })}</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📄 {t("PDF", { ns: "reports" })}</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📊 {t("Excel", { ns: "reports" })}</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="glw-wrap mt-4">
            {/* KPIs */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpi("#ccfbf1", "#5eead4", "#0f766e")}>
                <span style={kpiLbl("#0f766e")}>{t("Grainage", { ns: "reports" })}</span>
                <span style={{ ...kpiVal("#134e4a", 14), fontWeight: 800 }}>{grainageName}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>{t("Period", { ns: "reports" })}</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={kpi("#dbeafe", "#93c5fd", "#1e40af")}>
                <span style={kpiLbl("#1e40af")}>🧩 Active Lots</span>
                <span style={kpiVal("#1e3a8a", 18)}>{kpis.activeLotCount} / 4</span>
              </div>
              <div style={kpi("#fed7aa", "#fb923c", "#7c2d12")}>
                <span style={kpiLbl("#7c2d12")}>📥 ಹಣ್ಣಾದ ಗೂಡುಗಳು Ripe Cocoons</span>
                <span className="glw-num" style={kpiVal("#7c2d12", 16)}>{kpis.ripeCocoonsTotal.toLocaleString()}</span>
              </div>
              <div style={kpi("#a7f3d0", "#6ee7b7", "#065f46")}>
                <span style={kpiLbl("#065f46")}>🥚 ಒಟ್ಟು ಮೊಟ್ಟೆ Total DFLs</span>
                <span className="glw-num" style={kpiVal("#064e3b", 16)}>{kpis.dflsTotalAcrossLots.toLocaleString()}</span>
              </div>
              <div style={kpi("#d9f99d", "#bef264", "#3f6212")}>
                <span style={kpiLbl("#3f6212")}>📊 ಸರಾಸರಿ ಇಳುವರಿ Avg Yield</span>
                <span className="glw-num" style={kpiVal("#365314", 16)}>{kpis.yieldAvg.toFixed(2)}%</span>
              </div>
              <div style={kpi("#bfdbfe", "#93c5fd", "#1e3a8a")}>
                <span style={kpiLbl("#1e3a8a")}>🚚 ಒಟ್ಟು ವಿಲೇವಾರಿ Total Dist.</span>
                <span className="glw-num" style={kpiVal("#1e3a8a", 16)}>{kpis.distTotalAcrossLots.toLocaleString()}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#0c4a6e,#0f766e 50%,#312e81)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                ತಂಡಗಳವಾರು ವಿವರ ವರದಿ · ಬಿತ್ತನೆಕೋಠಿ {grainageName} &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Grainage Lot-wise Detail · Top-4 Lots × 9 Attribute Groups &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="glw-scroll" style={{ overflowX: "auto" }}>
                <table className="glw-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1200px" }}>
                  <thead>
                    {/* Row 1: top-level groups — Sl/Sub/Description span 2 rows; Lots span 4 cols */}
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#475569,#64748b)", "85px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಉಪ</div><div style={hdrEn}>Sub</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "320px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರಗಳು</div><div style={hdrEn}>Description</div>
                      </th>
                      <th colSpan={4} style={hdr("linear-gradient(135deg,#0f766e,#14b8a6)")}>
                        <div style={{ fontSize: "12.5px" }}>🧩 ತಂಡಗಳು</div>
                        <div style={hdrEn}>Top-4 Lots (lot numbers from latest preparation_of_eggs)</div>
                      </th>
                    </tr>
                    {/* Row 2: per-lot leaf cells — show actual lot numbers from row 0 */}
                    <tr>
                      {[1, 2, 3, 4].map((n) => {
                        const lotNo = String(lotHeaderRow[`lot${n}`] ?? "").trim();
                        const empty = !lotNo;
                        return (
                          <th key={n} style={{
                            background: empty
                              ? "linear-gradient(135deg,#cbd5e1,#94a3b8)"
                              : "linear-gradient(135deg,#5eead4,#2dd4bf)",
                            color: empty ? "#475569" : "#0f766e",
                            padding: "10px 8px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: "150px",
                            opacity: empty ? .75 : 1,
                          }}>
                            <div style={{ fontSize: "10.5px", fontWeight: 700, opacity: .85 }}>ತಂಡ {n} · Lot {n}</div>
                            <div className="glw-mono" style={{ fontSize: "13px", fontWeight: 800, marginTop: "3px" }}>
                              {empty ? "—" : lotNo}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.length === 0 && (
                      <tr><td colSpan={7} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#f0fdfa,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🧩</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f766e", marginBottom: "4px" }}>ಯಾವುದೇ ತಂಡದ ಮಾಹಿತಿ ಇಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No lot data found for this grainage in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {grouped.map((g) => {
                      const meta = SECTION_META[g.sn] || { icon: "·", hue: "slate", en: "" };
                      const pal = HUE[meta.hue];
                      return g.rows.map((row, ri) => {
                        const isFirst = ri === 0;
                        const sub = String(row.sub_label ?? "").trim();
                        const populated = hasAnyLot(row);
                        const totalSub = isTotalSub(sub);
                        const muted = !populated && !sub;
                        return (
                          <tr key={`${g.sn}-${ri}`} className="glw-tr"
                              style={{
                                background: totalSub
                                  ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                                  : (ri % 2 === 1 ? "#f8fafc" : "#ffffff"),
                                opacity: muted ? .65 : 1,
                              }}>
                            {isFirst && (
                              <td rowSpan={g.rows.length} style={{
                                padding: "10px 6px", textAlign: "center",
                                borderBottom: "2px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
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
                              padding: "10px 6px", textAlign: "center",
                              borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #e2e8f0",
                            }}>
                              {sub ? (
                                <span style={{
                                  display: "inline-block", padding: "3px 10px", borderRadius: "999px",
                                  background: totalSub
                                    ? "linear-gradient(135deg,#fcd34d,#fbbf24)"
                                    : pal.band,
                                  color: totalSub ? "#78350f" : pal.text,
                                  fontWeight: 800, fontSize: "11px",
                                }}>{sub}</span>
                              ) : (
                                <span style={{ color: "#cbd5e0", fontSize: "11px" }}>—</span>
                              )}
                            </td>
                            <td style={{
                              padding: "10px 14px", textAlign: "left",
                              borderBottom: "1px solid #f1f5f9", borderRight: "2px solid #e2e8f0",
                              color: totalSub ? "#78350f" : "#0f172a",
                              fontWeight: totalSub ? 800 : (sub ? 600 : 700),
                              fontSize: "12.5px",
                              background: isFirst && !sub ? pal.chipBg : "transparent",
                              paddingLeft: sub ? "26px" : "14px",
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span>{row.description || "—"}</span>
                                {meta.en && isFirst && (
                                  <span style={{ fontSize: "10.5px", fontWeight: 700, color: pal.text, opacity: .85 }}>
                                    · {meta.en}
                                  </span>
                                )}
                              </div>
                            </td>
                            {[1, 2, 3, 4].map((n) => {
                              const v = row[`lot${n}`];
                              const lotEmpty = !String(lotHeaderRow[`lot${n}`] ?? "").trim();
                              return (
                                <LotCell
                                  key={n} v={v} meta={meta} totalSub={totalSub} hue={pal}
                                  lotInactive={lotEmpty}
                                />
                              );
                            })}
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #a7f3d0" }}>
                <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                  Lot-wise Detail · {grainageName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {kpis.activeLotCount} active lots &nbsp;·&nbsp; Avg Yield {kpis.yieldAvg.toFixed(1)}% &nbsp;·&nbsp; Total DFLs {kpis.dflsTotalAcrossLots.toLocaleString()}
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

// Per-lot value cell — handles status pills, dates, percentages, numbers, plain text
function LotCell({ v, meta, totalSub, hue, lotInactive }) {
  const s = String(v ?? "").trim();
  const empty = s === "";

  // Inactive lot column — render dash with very muted styling
  if (lotInactive) {
    return (
      <td style={{
        padding: "10px 12px", textAlign: "center",
        borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc",
        background: "#f8fafc", color: "#cbd5e0", fontWeight: 600, fontSize: "12px",
      }}>—</td>
    );
  }

  // Section 4 — pebrine status badge
  if (meta.isStatus) {
    const st = STATUS_STYLE(s);
    return (
      <td style={{
        padding: "10px 12px", textAlign: "center",
        borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc",
        background: empty ? "transparent" : "transparent",
      }}>
        {empty ? <span style={{ color: "#cbd5e0" }}>—</span> : (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            padding: "3px 10px", borderRadius: "999px",
            background: st.bg, color: st.color,
            fontWeight: 800, fontSize: "11px",
          }}>
            <span style={{ fontSize: "12px", lineHeight: 1 }}>{st.icon}</span>
            {st.label}
          </span>
        )}
      </td>
    );
  }

  // Section 6 (or any cell containing a DD/MM/YYYY string) — date pill
  if (meta.isDate || isDateLike(s)) {
    return (
      <td style={{
        padding: "10px 12px", textAlign: "center",
        borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc",
        background: empty ? "transparent" : hue.chipBg,
        color: empty ? "#cbd5e0" : hue.text,
        fontWeight: 700, fontSize: "12px",
      }}>
        {empty ? "—" : <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>📅 {s}</span>}
      </td>
    );
  }

  // Numeric or percentage rendering with empty/zero treatment
  const n = numOrZero(v);
  // Strict: only a fully-numeric string counts (Number("29/09/2025") is NaN, whereas
  // parseFloat would have returned 29 and shown a date as a bare number).
  const isNumeric = s !== "" && !isNaN(Number(s));
  const isZero = isNumeric && n === 0;
  const display = empty
    ? "—"
    : (meta.isPct && isNumeric ? `${fmt(v)}%` : (isNumeric ? fmt(v) : s));
  return (
    <td className="glw-num" style={{
      padding: "10px 12px",
      textAlign: isNumeric ? "right" : "left",
      borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc",
      background: empty || isZero ? "transparent" : (totalSub ? "linear-gradient(135deg,#fde68a,#fcd34d)" : hue.chipBg),
      color: empty ? "#cbd5e0" : (isZero ? "#94a3b8" : (totalSub ? "#78350f" : hue.text)),
      fontWeight: totalSub ? 800 : 700,
      fontSize: "12.5px",
    }}>{display}</td>
  );
}

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
const hdr = (bg, minW, single, align) => ({
  background: bg, color: "#fff",
  padding: "10px 8px", textAlign: align || "center",
  border: "1px solid rgba(255,255,255,.18)",
  fontWeight: 800,
  minWidth: minW || "100px",
  verticalAlign: single ? "middle" : "top",
});

export default GrainageLotwiseDetailReport;
