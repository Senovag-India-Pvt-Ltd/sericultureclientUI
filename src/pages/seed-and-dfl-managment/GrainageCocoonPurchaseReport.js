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

if (!document.getElementById("gcp-styles")) {
  const s = document.createElement("style");
  s.id = "gcp-styles";
  s.innerHTML = `
    .gcp-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gcp-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gcp-swal .swal2-icon { margin:20px auto 4px !important; }
    .gcp-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gcp-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gcp-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .gcp-wrap { animation: gcp-in .35s ease; }
    .gcp-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gcp-table th { letter-spacing:.02em; }
    .gcp-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gcp-scroll::-webkit-scrollbar { height:9px; }
    .gcp-scroll::-webkit-scrollbar-track { background:#f0fdfa; border-radius:6px; }
    .gcp-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#3730a3); border-radius:6px; }
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

// 3 logical sections, each has a header row (sl=0/2/4) + data rows (sl=1/3/5)
const SECTION_META = {
  "0": { icon: "🪺", hue: "orange",  en: "Purchased Cocoons", isHeader: true },
  "1": { icon: "🪺", hue: "orange",  en: "Purchased Cocoons", isHeader: false, isPct: false },
  "2": { icon: "🥚", hue: "violet",  en: "Received DFLs",     isHeader: true },
  "3": { icon: "🥚", hue: "violet",  en: "Received DFLs",     isHeader: false, isPct: false },
  "4": { icon: "📊", hue: "emerald", en: "Yield Obtained",    isHeader: true },
  "5": { icon: "📊", hue: "emerald", en: "Yield Obtained",    isHeader: false, isPct: true },
};

const HUE = {
  orange:  { band: "linear-gradient(135deg,#fed7aa,#fb923c)", text: "#7c2d12", chipBg: "#fff7ed" },
  violet:  { band: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", text: "#4c1d95", chipBg: "#f5f3ff" },
  emerald: { band: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", text: "#064e3b", chipBg: "#ecfdf5" },
};

const yieldBand = (p) => {
  if (p >= 100) return { bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d", border: "#4ade80" };
  if (p >= 75)  return { bg: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", color: "#065f46", border: "#34d399" };
  if (p >= 50)  return { bg: "linear-gradient(135deg,#fde68a,#fcd34d)", color: "#92400e", border: "#fbbf24" };
  if (p > 0)   return { bg: "linear-gradient(135deg,#fecaca,#fca5a5)", color: "#7f1d1d", border: "#f87171" };
  return         { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#475569", border: "#94a3b8" };
};

const isTotalSub = (sub) => {
  const s = String(sub || "").trim();
  return s === "ಒಟ್ಟು" || s.startsWith("ಒಟ್ಟು");
};

function GrainageCocoonPurchaseReport() {
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
      background: "#fff", customClass: { popup: "gcp-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gcp-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-cocoon-purchase", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch {
      showErr("Fetch Failed", "Failed to load the Grainage Cocoon Purchase report.");
    } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-cocoon-purchase/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-cocoon-purchase/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `grainage_cocoon_purchase_${filter.grainageId}_${year}_${m}.xlsx`;
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

  // KPI extraction — pick the "ಒಟ್ಟು" sub-row of each section
  const kpis = useMemo(() => {
    const find = (sn) => dataRows.find(
      (r) => String(r.sl_no) === String(sn) && isTotalSub(r.sub_label)
    ) || {};
    const cocTot = find(1);   // Section 1 total
    const dflTot = find(3);   // Section 2 total
    const yldTot = find(5);   // Section 3 total (yield %)
    return {
      cocM:   numOrZero(cocTot.m_total),
      cocMe:  numOrZero(cocTot.me_total),
      dflM:   numOrZero(dflTot.m_total),
      dflMe:  numOrZero(dflTot.me_total),
      yldM:   numOrZero(yldTot.m_total),
      yldMe:  numOrZero(yldTot.me_total),
      // Source split (Farm vs Purchase) for cocoons (Month)
      cocFarmM:     numOrZero(cocTot.m_farm),
      cocPurchM:    numOrZero(cocTot.m_purchase),
    };
  }, [dataRows]);

  return (
    <Layout title={t("Grainage Cocoon Purchase Report (Cocoons / DFLs / Yield)")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ಮಾಹೆಯ ಅಂತ್ಯಕ್ಕೆ ಖರೀದಿಸಿದ ಗೂಡುಗಳ ವರದಿ — ಬಿತ್ತನೆ ಕೋಠಿ")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
            color: "#0f766e", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #5eead4", verticalAlign: "middle",
          }}>P1 & P2 · Bivoltine · Cocoons → DFLs → Yield (Farm + Purchase)</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(15,118,110,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#3730a3 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🛒</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಮಾಹೆಯ ಅಂತ್ಯಕ್ಕೆ ಖರೀದಿಸಿದ ಗೂಡುಗಳ ವರದಿ — ಬಿತ್ತನೆ ಕೋಠಿ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Cocoon Purchase</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P1 &amp; P2 Grainage (Bivoltine) — Cocoons / DFLs / Yield split by source: Farm vs Purchased (Month + FY-Cum)</div>
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
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
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
          <div className="gcp-wrap mt-4">
            {/* Source-split legend */}
            <div className="d-flex flex-wrap gap-2 mb-3">
              <div style={legendChip("linear-gradient(135deg,#dbeafe,#bfdbfe)", "#1e3a8a", "#93c5fd")}>
                <span style={{ fontSize: "11px", fontWeight: 800 }}>🌾</span>
                <span style={{ fontSize: "11.5px", fontWeight: 700 }}>ರೇಷ್ಮೆ ಕೃಷಿ ಕ್ಷೇತ್ರ · Farm-source</span>
              </div>
              <div style={legendChip("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12", "#fb923c")}>
                <span style={{ fontSize: "11px", fontWeight: 800 }}>🛒</span>
                <span style={{ fontSize: "11.5px", fontWeight: 700 }}>ಖರೀದಿ · Purchased</span>
              </div>
              <div style={legendChip("linear-gradient(135deg,#fcd34d,#fbbf24)", "#78350f", "#f59e0b")}>
                <span style={{ fontSize: "11px", fontWeight: 800 }}>Σ</span>
                <span style={{ fontSize: "11.5px", fontWeight: 700 }}>ಒಟ್ಟು · Combined Total</span>
              </div>
            </div>

            {/* KPIs */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-stretch">
              <div style={kpi("#ccfbf1", "#5eead4", "#0f766e")}>
                <span style={kpiLbl("#0f766e")}>Grainage</span>
                <span style={{ ...kpiVal("#134e4a", 14), fontWeight: 800 }}>{grainageName}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>Period</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={kpi("#fed7aa", "#fb923c", "#7c2d12")}>
                <span style={kpiLbl("#7c2d12")}>🪺 ಗೂಡುಗಳು Cocoons (M)</span>
                <span className="gcp-num" style={kpiVal("#7c2d12", 16)}>{kpis.cocM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#9a3412", fontWeight: 700, marginTop: "1px" }}>FY Cum: {kpis.cocMe.toLocaleString()}</span>
              </div>
              <div style={kpi("#ddd6fe", "#a78bfa", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>🥚 ಮೊಟ್ಟೆಗಳು DFLs (M)</span>
                <span className="gcp-num" style={kpiVal("#4c1d95", 16)}>{kpis.dflM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#5b21b6", fontWeight: 700, marginTop: "1px" }}>FY Cum: {kpis.dflMe.toLocaleString()}</span>
              </div>
              <div style={{
                ...kpi(yieldBand(kpis.yldM).bg, yieldBand(kpis.yldM).border, yieldBand(kpis.yldM).color),
                background: yieldBand(kpis.yldM).bg + ", #ffffff",
              }}>
                <span style={kpiLbl(yieldBand(kpis.yldM).color)}>📊 ಇಳುವರಿ Yield (M)</span>
                <span className="gcp-num" style={kpiVal(yieldBand(kpis.yldM).color, 18)}>{kpis.yldM.toFixed(2)}%</span>
                <span style={{ fontSize: "10.5px", color: yieldBand(kpis.yldM).color, fontWeight: 700, marginTop: "1px", opacity: .9 }}>FY Cum: {kpis.yldMe.toFixed(2)}%</span>
              </div>
              <div style={kpi("#dbeafe", "#93c5fd", "#1e40af")}>
                <span style={kpiLbl("#1e40af")}>🌾 Farm-source (M)</span>
                <span className="gcp-num" style={kpiVal("#1e3a8a", 15)}>{kpis.cocFarmM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#1e40af", fontWeight: 700, marginTop: "1px" }}>cocoons</span>
              </div>
              <div style={kpi("#fed7aa", "#fb923c", "#9a3412")}>
                <span style={kpiLbl("#9a3412")}>🛒 Purchased (M)</span>
                <span className="gcp-num" style={kpiVal("#7c2d12", 15)}>{kpis.cocPurchM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#9a3412", fontWeight: 700, marginTop: "1px" }}>{kpis.cocPurchM === 0 ? "(not yet tracked)" : "cocoons"}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#0c4a6e,#0f766e 50%,#312e81)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                {monthKn} {monthYear || ""}ರ ಮಾಹೆಯ ಅಂತ್ಯಕ್ಕೆ ಖರೀದಿಸಿದ ಗೂಡುಗಳು · ಬಿತ್ತನೆ ಕೋಠಿ {grainageName}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Cocoon Purchase Report · Cocoons → DFLs → Yield, by source (Farm vs Purchased) &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="gcp-scroll" style={{ overflowX: "auto" }}>
                <table className="gcp-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1300px" }}>
                  <thead>
                    {/* Row 1: top-level groups */}
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#475569,#64748b)", "75px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಉಪ</div><div style={hdrEn}>Sub</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "260px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರಗಳು</div><div style={hdrEn}>Description</div>
                      </th>
                      <th colSpan={3} style={hdr("linear-gradient(135deg,#0f766e,#14b8a6)")}>
                        <div style={{ fontSize: "12.5px" }}>📅 ಮಾಸ</div>
                        <div style={hdrEn}>Month</div>
                      </th>
                      <th colSpan={3} style={hdr("linear-gradient(135deg,#3730a3,#6366f1)")}>
                        <div style={{ fontSize: "12.5px" }}>Σ ಮಾಸಾಂತ್ಯ</div>
                        <div style={hdrEn}>FY Cum (Month-end)</div>
                      </th>
                    </tr>
                    {/* Row 2: leaves Farm / Purchase / Total per group */}
                    <tr>
                      <th style={subhdr("linear-gradient(135deg,#bfdbfe,#93c5fd)", "#1e3a8a")}>
                        <div style={{ fontSize: "10.5px" }}>🌾 ಕೃಷಿ ಕ್ಷೇತ್ರ</div><div style={subhdrEn}>Farm</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
                        <div style={{ fontSize: "10.5px" }}>🛒 ಖರೀದಿ</div><div style={subhdrEn}>Purchase</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fcd34d,#fbbf24)", "#78350f")}>
                        <div style={{ fontSize: "10.5px" }}>Σ ಒಟ್ಟು</div><div style={subhdrEn}>Total</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#bfdbfe,#93c5fd)", "#1e3a8a")}>
                        <div style={{ fontSize: "10.5px" }}>🌾 ಕೃಷಿ ಕ್ಷೇತ್ರ</div><div style={subhdrEn}>Farm</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
                        <div style={{ fontSize: "10.5px" }}>🛒 ಖರೀದಿ</div><div style={subhdrEn}>Purchase</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fcd34d,#fbbf24)", "#78350f")}>
                        <div style={{ fontSize: "10.5px" }}>Σ ಒಟ್ಟು</div><div style={subhdrEn}>Total</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={9} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#f0fdfa,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🛒</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f766e", marginBottom: "4px" }}>ಯಾವುದೇ ಗೂಡು ಖರೀದಿ ಮಾಹಿತಿ ಇಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No cocoon purchase data found for this grainage in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {dataRows.map((row, ri) => {
                      const sn = String(row.sl_no);
                      const meta = SECTION_META[sn] || { icon: "·", hue: "orange", isHeader: false };
                      const pal = HUE[meta.hue];
                      const isSectionHeader = meta.isHeader;
                      const sub = String(row.sub_label ?? "").trim();
                      const totalSub = isTotalSub(sub);

                      // Section header rows render full-width as a coloured band
                      if (isSectionHeader) {
                        return (
                          <tr key={ri}>
                            <td colSpan={9} style={{
                              background: pal.band,
                              padding: "12px 18px",
                              borderTop: ri === 0 ? "none" : "2px solid #e2e8f0",
                              borderBottom: "1px solid #e2e8f0",
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{
                                  fontSize: "20px",
                                  width: "36px", height: "36px", borderRadius: "10px",
                                  background: "rgba(255,255,255,.92)",
                                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                                }}>{meta.icon}</span>
                                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                                  <span style={{ fontSize: "14.5px", fontWeight: 800, color: pal.text }}>
                                    {row.description || "—"}
                                  </span>
                                  <span style={{ fontSize: "11px", fontWeight: 700, color: pal.text, opacity: .85 }}>
                                    {meta.en}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      // Data row
                      return (
                        <tr key={ri} className="gcp-tr"
                            style={{
                              background: totalSub
                                ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                                : (ri % 2 === 1 ? "#f8fafc" : "#ffffff"),
                            }}>
                          <td style={{
                            padding: "12px 6px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            background: pal.band,
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "26px", height: "26px", borderRadius: "50%",
                              background: "rgba(255,255,255,.92)",
                              color: pal.text, fontWeight: 800, fontSize: "11.5px",
                            }}>{row.sl_no}</span>
                          </td>
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
                            padding: "12px 14px", textAlign: "left",
                            borderBottom: "1px solid #f1f5f9", borderRight: "2px solid #e2e8f0",
                            color: totalSub ? "#78350f" : "#0f172a",
                            fontWeight: totalSub ? 800 : 700,
                            fontSize: "12.5px",
                            paddingLeft: totalSub ? "14px" : "26px",
                          }}>
                            {row.description || "—"}
                          </td>
                          <ValCell v={row.m_farm}     meta={meta} totalSub={totalSub}
                                   color="#1e3a8a" bg="linear-gradient(135deg,#eff6ff,#dbeafe)" source="farm" />
                          <ValCell v={row.m_purchase} meta={meta} totalSub={totalSub}
                                   color="#7c2d12" bg="linear-gradient(135deg,#fff7ed,#fed7aa)" source="purchase" />
                          <ValCell v={row.m_total}    meta={meta} totalSub={totalSub}
                                   color="#78350f" bg="linear-gradient(135deg,#fef3c7,#fde68a)"
                                   weight={800} right="2px solid #e2e8f0" source="total" />
                          <ValCell v={row.me_farm}    meta={meta} totalSub={totalSub}
                                   color="#1e3a8a" bg="linear-gradient(135deg,#dbeafe,#bfdbfe)" source="farm" />
                          <ValCell v={row.me_purchase} meta={meta} totalSub={totalSub}
                                   color="#7c2d12" bg="linear-gradient(135deg,#fed7aa,#fdba74)" source="purchase" />
                          <ValCell v={row.me_total}   meta={meta} totalSub={totalSub}
                                   color="#78350f" bg="linear-gradient(135deg,#fcd34d,#fbbf24)"
                                   weight={800} source="total" />
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #a7f3d0" }}>
                <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                  Cocoon Purchase · {grainageName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; Cocoons {kpis.cocM.toLocaleString()} → DFLs {kpis.dflM.toLocaleString()} → Yield {kpis.yldM.toFixed(1)}%
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

// Per-cell renderer — handles % suffix for yield section, source-aware backgrounds,
// and a "not yet tracked" treatment for the Purchase columns when they're 0
// (the SQL hardcodes them to 0 — backend placeholder).
function ValCell({ v, meta, totalSub, color, bg, weight, right, source }) {
  const s = String(v ?? "").trim();
  const empty = s === "";
  const n = numOrZero(v);
  const isZero = !empty && n === 0;
  const isNumeric = !isNaN(parseFloat(s));
  const display = empty
    ? "—"
    : (meta.isPct && isNumeric ? `${fmt(v)}%` : (isNumeric ? fmt(v) : s));

  // Purchase-column placeholder treatment — render greyed since backend always sends 0
  const isPlaceholderPurchase = source === "purchase" && isZero;

  let resolvedBg, resolvedColor;
  if (empty) {
    resolvedBg = "transparent";
    resolvedColor = "#cbd5e0";
  } else if (isPlaceholderPurchase) {
    resolvedBg = "repeating-linear-gradient(135deg,#f8fafc,#f8fafc 6px,#f1f5f9 6px,#f1f5f9 12px)";
    resolvedColor = "#94a3b8";
  } else if (isZero) {
    resolvedBg = "transparent";
    resolvedColor = "#94a3b8";
  } else if (totalSub) {
    resolvedBg = "linear-gradient(135deg,#fde68a,#fcd34d)";
    resolvedColor = "#78350f";
  } else {
    resolvedBg = bg;
    resolvedColor = color;
  }

  return (
    <td className="gcp-num" style={{
      padding: "12px 12px", textAlign: "right",
      borderBottom: "1px solid #f1f5f9",
      borderRight: right || "1px solid #f8fafc",
      background: resolvedBg,
      color: resolvedColor,
      fontWeight: weight || (totalSub ? 800 : 700),
      fontSize: "12.5px",
    }}
    title={isPlaceholderPurchase ? "Purchase data not yet tracked" : undefined}>
      {display}
    </td>
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

export default GrainageCocoonPurchaseReport;
