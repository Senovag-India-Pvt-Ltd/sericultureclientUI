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

if (!document.getElementById("grp-styles")) {
  const s = document.createElement("style");
  s.id = "grp-styles";
  s.innerHTML = `
    .grp-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .grp-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .grp-swal .swal2-icon { margin:20px auto 4px !important; }
    .grp-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .grp-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes grp-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .grp-wrap { animation: grp-in .35s ease; }
    .grp-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .grp-table th { letter-spacing:.02em; }
    .grp-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .grp-scroll::-webkit-scrollbar { height:9px; }
    .grp-scroll::-webkit-scrollbar-track { background:#f0fdfa; border-radius:6px; }
    .grp-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#3730a3); border-radius:6px; }
    @keyframes grp-fill { from { width: 0; } to { width: var(--w, 0%); } }
    .grp-bar-fill { animation: grp-fill 1.1s cubic-bezier(.22,.61,.36,1) both; }
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
  if (!s) return "—";
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

// Race badge palette — CSR-2, CSR-4, Total each get distinct colours
const RACE_STYLE = (race) => {
  const r = String(race || "").trim();
  if (r.includes("ಸಿಎಸ್ಆರ್-2") || r.toLowerCase().includes("csr-2"))
    return { bg: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", color: "#4c1d95", icon: "②", isTotal: false };
  if (r.includes("ಸಿಎಸ್ಆರ್-4") || r.toLowerCase().includes("csr-4"))
    return { bg: "linear-gradient(135deg,#bfdbfe,#93c5fd)", color: "#1e3a8a", icon: "④", isTotal: false };
  if (r.includes("ಒಟ್ಟು") || r.toLowerCase() === "total")
    return { bg: "linear-gradient(135deg,#fde68a,#fcd34d)", color: "#78350f", icon: "Σ", isTotal: true };
  return { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#334155", icon: "·", isTotal: false };
};

// Yield % colour band — green at 100+, teal at 75+, amber at 50+, rose <50
const yieldBand = (p) => {
  if (p >= 100) return { bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d", border: "#4ade80" };
  if (p >= 75)  return { bg: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", color: "#065f46", border: "#34d399" };
  if (p >= 50)  return { bg: "linear-gradient(135deg,#fde68a,#fcd34d)", color: "#92400e", border: "#fbbf24" };
  if (p > 0)   return { bg: "linear-gradient(135deg,#fecaca,#fca5a5)", color: "#7f1d1d", border: "#f87171" };
  return         { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#475569", border: "#94a3b8" };
};

function GrainageRaceProgressReport() {
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
      background: "#fff", customClass: { popup: "grp-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "grp-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-race-progress", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          showErr("No Data Found", "No data found for the selected filters.");
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Grainage Race-wise Progress report.");
        }
      } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-race-progress/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-race-progress/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `grainage_race_progress_${filter.grainageId}_${year}_${m}.xlsx`;
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

  // Pull race rows by their backend order: CSR-2 (sl=1), CSR-4 (sl=2), Total (sl=3)
  const rowCSR2  = dataRows.find((r) => String(r.sl_no) === "1") || {};
  const rowCSR4  = dataRows.find((r) => String(r.sl_no) === "2") || {};
  const rowTotal = dataRows.find((r) => String(r.sl_no) === "3") || {};

  const kpis = useMemo(() => {
    const tStoredM  = numOrZero(rowTotal.stored_m);
    const tStoredMe = numOrZero(rowTotal.stored_me);
    const tDflsM    = numOrZero(rowTotal.dfls_m);
    const tDflsMe   = numOrZero(rowTotal.dfls_me);
    const tYieldM   = numOrZero(rowTotal.yield_m);
    const tYieldMe  = numOrZero(rowTotal.yield_me);
    const csr2M     = numOrZero(rowCSR2.dfls_m);
    const csr4M     = numOrZero(rowCSR4.dfls_m);
    // Race share (CY Month)
    const csr2Share = tDflsM === 0 ? 0 : (csr2M / tDflsM) * 100;
    const csr4Share = tDflsM === 0 ? 0 : (csr4M / tDflsM) * 100;
    return {
      tStoredM, tStoredMe, tDflsM, tDflsMe, tYieldM, tYieldMe,
      csr2M, csr4M, csr2Share, csr4Share,
    };
  }, [rowCSR2, rowCSR4, rowTotal]);

  return (
    <Layout title={t("Grainage Race-wise Progress Report (CSR-2 / CSR-4)")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ತಳಿವಾರು ಪ್ರಗತಿ ವರದಿ — ಬಿತ್ತನೆ ಕೋಠಿ (ಸಿಎಸ್ಆರ್-2 / ಸಿಎಸ್ಆರ್-4)")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
            color: "#0f766e", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #5eead4", verticalAlign: "middle",
          }}>P1 & P2 · Bivoltine · Race × Stored / DFL / Yield</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(15,118,110,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#3730a3 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🧬</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ತಳಿವಾರು ಪ್ರಗತಿ ವರದಿ — ಬಿತ್ತನೆ ಕೋಠಿ (ಸಿಎಸ್ಆರ್-2 + ಸಿಎಸ್ಆರ್-4)
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Race-wise</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P1 &amp; P2 Grainage (Bivoltine) — CSR-2 vs CSR-4: Cocoons stored · DFLs prepared · Yield % (Month + FY-Cum)</div>
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
          <div className="grp-wrap mt-4">
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
                <span style={kpiLbl("#7c2d12")}>🪺 ಶೇಖರಿಸಿದ Stored (Month)</span>
                <span className="grp-num" style={kpiVal("#7c2d12", 16)}>{kpis.tStoredM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#9a3412", fontWeight: 700, marginTop: "1px" }}>FY Cum: {kpis.tStoredMe.toLocaleString()}</span>
              </div>
              <div style={kpi("#ddd6fe", "#a78bfa", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>🥚 ಪಡೆದ ಮೊಟ್ಟೆ DFLs (Month)</span>
                <span className="grp-num" style={kpiVal("#4c1d95", 16)}>{kpis.tDflsM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#5b21b6", fontWeight: 700, marginTop: "1px" }}>FY Cum: {kpis.tDflsMe.toLocaleString()}</span>
              </div>
              <div style={{
                ...kpi(
                  yieldBand(kpis.tYieldM).bg.split(",")[0].replace("linear-gradient(135deg", "").replace("(", "") || "#a7f3d0",
                  yieldBand(kpis.tYieldM).border, yieldBand(kpis.tYieldM).color,
                ),
                background: yieldBand(kpis.tYieldM).bg + ", #ffffff",
              }}>
                <span style={kpiLbl(yieldBand(kpis.tYieldM).color)}>📊 ಇಳುವರಿ Yield (Month)</span>
                <span className="grp-num" style={kpiVal(yieldBand(kpis.tYieldM).color, 18)}>{kpis.tYieldM.toFixed(2)}%</span>
                <span style={{ fontSize: "10.5px", color: yieldBand(kpis.tYieldM).color, fontWeight: 700, marginTop: "1px", opacity: .9 }}>FY Cum: {kpis.tYieldMe.toFixed(2)}%</span>
              </div>
              <div style={kpi("#ede9fe", "#c4b5fd", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>② ಸಿಎಸ್ಆರ್-2 Share (M)</span>
                <span className="grp-num" style={kpiVal("#4c1d95", 16)}>{kpis.csr2M.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#5b21b6", fontWeight: 700, marginTop: "1px" }}>{kpis.csr2Share.toFixed(1)}% of total</span>
              </div>
              <div style={kpi("#dbeafe", "#93c5fd", "#1e40af")}>
                <span style={kpiLbl("#1e40af")}>④ ಸಿಎಸ್ಆರ್-4 Share (M)</span>
                <span className="grp-num" style={kpiVal("#1e3a8a", 16)}>{kpis.csr4M.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#1e40af", fontWeight: 700, marginTop: "1px" }}>{kpis.csr4Share.toFixed(1)}% of total</span>
              </div>
            </div>

            {/* CSR-2 vs CSR-4 share visual — quick at-a-glance comparison */}
            {kpis.tDflsM > 0 && (
              <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 3px 14px rgba(15,118,110,.08)", overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ padding: "14px 22px", background: "linear-gradient(180deg,#ffffff,#f5f3ff)" }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{ fontSize: "11.5px", color: "#475569", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em" }}>
                      ತಳಿವಾರು ಪಾಲು · DFL Race Mix (Month)
                    </span>
                    <span className="grp-num" style={{ fontSize: "12px", color: "#0f172a", fontWeight: 800 }}>
                      Total {kpis.tDflsM.toLocaleString()} DFLs
                    </span>
                  </div>
                  <div style={{
                    display: "flex", height: "22px", borderRadius: "999px", overflow: "hidden",
                    background: "#e2e8f0", boxShadow: "inset 0 1px 3px rgba(0,0,0,.06)",
                  }}>
                    <div
                      className="grp-bar-fill"
                      style={{
                        height: "100%",
                        background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
                        "--w": `${kpis.csr2Share}%`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: "11px", fontWeight: 800,
                      }}
                    >
                      {kpis.csr2Share >= 8 && `② ${kpis.csr2Share.toFixed(1)}%`}
                    </div>
                    <div
                      className="grp-bar-fill"
                      style={{
                        height: "100%",
                        background: "linear-gradient(90deg,#3b82f6,#60a5fa)",
                        "--w": `${kpis.csr4Share}%`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: "11px", fontWeight: 800,
                      }}
                    >
                      {kpis.csr4Share >= 8 && `④ ${kpis.csr4Share.toFixed(1)}%`}
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-3 mt-2" style={{ fontSize: "11px", color: "#475569" }}>
                    <span><span style={{ display: "inline-block", width: "10px", height: "10px", background: "#7c3aed", borderRadius: "3px", marginRight: "5px", verticalAlign: "middle" }}></span>ಸಿಎಸ್ಆರ್-2 · {kpis.csr2M.toLocaleString()} DFLs</span>
                    <span><span style={{ display: "inline-block", width: "10px", height: "10px", background: "#3b82f6", borderRadius: "3px", marginRight: "5px", verticalAlign: "middle" }}></span>ಸಿಎಸ್ಆರ್-4 · {kpis.csr4M.toLocaleString()} DFLs</span>
                  </div>
                </div>
              </Card>
            )}

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#0c4a6e,#0f766e 50%,#312e81)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                ತಳಿವಾರು ಪ್ರಗತಿ ವರದಿ · ಬಿತ್ತನೆ ಕೋಠಿ {grainageName} &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Race-wise Progress · CSR-2 vs CSR-4 vs Total &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="grp-scroll" style={{ overflowX: "auto" }}>
                <table className="grp-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1100px" }}>
                  <thead>
                    {/* Row 1: top groups */}
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "180px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>ತಳಿ</div><div style={hdrEn}>Race</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#9a3412,#ea580c)")}>
                        <div style={{ fontSize: "12.5px" }}>🪺 ಶೇಖರಿಸಿದ ಗೂಡು</div>
                        <div style={hdrEn}>Cocoons Stored</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#5b21b6,#7c3aed)")}>
                        <div style={{ fontSize: "12.5px" }}>🥚 ಪಡೆದ ಮೊಟ್ಟೆಗಳು</div>
                        <div style={hdrEn}>DFLs Prepared</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#065f46,#10b981)")}>
                        <div style={{ fontSize: "12.5px" }}>📊 ಇಳುವರಿ</div>
                        <div style={hdrEn}>Yield (DFL ÷ Stored × 100)</div>
                      </th>
                    </tr>
                    {/* Row 2: leaves */}
                    <tr>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸ</div><div style={subhdrEn}>Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fdba74,#fb923c)", "#7c2d12")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸಾಂತ್ಯ</div><div style={subhdrEn}>FY Cum</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸ</div><div style={subhdrEn}>Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#c4b5fd,#a78bfa)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸಾಂತ್ಯ</div><div style={subhdrEn}>FY Cum</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#a7f3d0,#6ee7b7)", "#064e3b")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸ</div><div style={subhdrEn}>Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#6ee7b7,#34d399)", "#064e3b")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸಾಂತ್ಯ</div><div style={subhdrEn}>FY Cum</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#f0fdfa,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🧬</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f766e", marginBottom: "4px" }}>ಯಾವುದೇ ತಳಿ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No race-wise data found for this grainage in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {dataRows.map((row, ri) => {
                      const raceMeta = RACE_STYLE(row.race);
                      const isTotal = raceMeta.isTotal;
                      const rowBg = isTotal
                        ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                        : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const yM = numOrZero(row.yield_m);
                      const yMe = numOrZero(row.yield_me);
                      const ymBand = yieldBand(yM);
                      const ymeBand = yieldBand(yMe);
                      return (
                        <tr key={ri} className="grp-tr" style={{ background: rowBg }}>
                          <td style={{
                            padding: "14px 8px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            background: isTotal ? "linear-gradient(135deg,#fcd34d,#fbbf24)" : "linear-gradient(135deg,#1e293b,#334155)",
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "30px", height: "30px", borderRadius: "50%",
                              background: "rgba(255,255,255,.92)",
                              color: isTotal ? "#78350f" : "#0f766e",
                              fontWeight: 800, fontSize: "12px",
                            }}>{row.sl_no}</span>
                          </td>
                          <td style={{
                            padding: "14px 14px", textAlign: "left",
                            borderBottom: "1px solid #e2e8f0", borderRight: "2px solid #e2e8f0",
                            fontWeight: isTotal ? 800 : 700,
                            fontSize: "13px",
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "8px",
                              padding: "5px 14px", borderRadius: "999px",
                              background: raceMeta.bg, color: raceMeta.color,
                              fontWeight: 800, fontSize: "12px",
                              border: isTotal ? "1.5px solid #fbbf24" : "1px solid rgba(0,0,0,.06)",
                            }}>
                              <span style={{ fontSize: "14px", lineHeight: 1 }}>{raceMeta.icon}</span>
                              {row.race || "—"}
                            </span>
                          </td>
                          <ValCell v={row.stored_m}  isTotal={isTotal}
                                   color="#7c2d12" bg="linear-gradient(135deg,#fff7ed,#ffedd5)" />
                          <ValCell v={row.stored_me} isTotal={isTotal}
                                   color="#9a3412" bg="linear-gradient(135deg,#ffedd5,#fed7aa)"
                                   weight={800} right="2px solid #e2e8f0" />
                          <ValCell v={row.dfls_m}    isTotal={isTotal}
                                   color="#4c1d95" bg="linear-gradient(135deg,#f5f3ff,#ede9fe)" />
                          <ValCell v={row.dfls_me}   isTotal={isTotal}
                                   color="#5b21b6" bg="linear-gradient(135deg,#ede9fe,#ddd6fe)"
                                   weight={800} right="2px solid #e2e8f0" />
                          {/* Yield cells — auto-themed by % */}
                          <td className="grp-num" style={{
                            padding: "14px 12px", textAlign: "right",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #f8fafc",
                            background: yM === 0 ? (isTotal ? "transparent" : "transparent") : (isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : ymBand.bg),
                            color: yM === 0 ? "#cbd5e0" : (isTotal ? "#78350f" : ymBand.color),
                            fontWeight: 800, fontSize: "13px",
                          }}>
                            {yM === 0 ? "—" : `${fmt(row.yield_m)}%`}
                          </td>
                          <td className="grp-num" style={{
                            padding: "14px 12px", textAlign: "right",
                            borderBottom: "1px solid #e2e8f0",
                            background: yMe === 0 ? "transparent" : (isTotal ? "linear-gradient(135deg,#fcd34d,#fbbf24)" : ymeBand.bg),
                            color: yMe === 0 ? "#cbd5e0" : (isTotal ? "#78350f" : ymeBand.color),
                            fontWeight: 800, fontSize: "13.5px",
                          }}>
                            {yMe === 0 ? "—" : `${fmt(row.yield_me)}%`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #a7f3d0" }}>
                <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                  Race-wise · {grainageName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; Stored {kpis.tStoredM.toLocaleString()} → DFLs {kpis.tDflsM.toLocaleString()} → Yield {kpis.tYieldM.toFixed(1)}%
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

function ValCell({ v, isTotal, color, bg, weight, right }) {
  const s = String(v ?? "").trim();
  const empty = s === "";
  const n = numOrZero(v);
  const isZero = !empty && n === 0;
  const display = empty ? "—" : fmt(v);
  return (
    <td className="grp-num" style={{
      padding: "14px 12px", textAlign: "right",
      borderBottom: "1px solid #e2e8f0",
      borderRight: right || "1px solid #f8fafc",
      background: empty || isZero ? "transparent" : (isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : bg),
      color: empty ? "#cbd5e0" : (isZero ? "#94a3b8" : (isTotal ? "#78350f" : color)),
      fontWeight: weight || (isTotal ? 800 : 700),
      fontSize: "13px",
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

export default GrainageRaceProgressReport;
