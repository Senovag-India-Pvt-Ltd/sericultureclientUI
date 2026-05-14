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

if (!document.getElementById("smkt-styles")) {
  const s = document.createElement("style");
  s.id = "smkt-styles";
  s.innerHTML = `
    .smkt-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .smkt-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .smkt-swal .swal2-icon { margin:20px auto 4px !important; }
    .smkt-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .smkt-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes smkt-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .smkt-wrap { animation: smkt-in .35s ease; }
    .smkt-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .smkt-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .smkt-scroll::-webkit-scrollbar { height:9px; }
    .smkt-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .smkt-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
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
const fmtINR = (n) => "₹ " + numOrZero(n).toLocaleString(undefined, { maximumFractionDigits: 0 });

const yearOptions = (() => {
  const cur = new Date().getFullYear(); const arr = [];
  for (let y = cur + 1; y >= cur - 5; y--) arr.push({ value: y, label: String(y) });
  return arr;
})();

const isTotalRow = (r, key = "district") => {
  const v = String(r?.[key] || "").trim();
  return v === "ಒಟ್ಟು" || v.toLowerCase() === "total";
};

// ──────────────────────────────────────────────────────────────────────────
// Shared filter card (Market + Year + Month) — used by all 3 reports
// ──────────────────────────────────────────────────────────────────────────
function MarketFilterCard({
  config, filter, setFilter, reset, marketList,
  isLoading, hasReport, dataRows, filteredRows,
  isDownloadingPdf, isDownloadingExcel,
  onSubmit, onPdf, onExcel, extraTopRight, extraRow,
}) {
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn    = MONTH_KN[Number(filter.month)] || "";

  return (
    <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
      <div style={{ background: config.gradient, padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{config.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
            {config.headerKn} — {config.headerEn}
            <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>{config.badge}</span>
          </div>
          <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>{config.subtitle}</div>
        </div>
        {hasReport && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{monthLabel} · {monthKn} {filter.year}</span>
            <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{filteredRows.length} / {dataRows.length} rows</span>
            {extraTopRight}
          </div>
        )}
      </div>

      <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
        <Form onSubmit={onSubmit}>
          <Row className="g-2 align-items-end">
            <Col md={5}>
              <label style={lbl}>Market <span style={{ color: "#e53e3e" }}>*</span></label>
              <ReactSelect
                options={marketList.map((m) => ({ value: String(m.marketMasterId), label: m.marketMasterName }))}
                placeholder="— Search Market —"
                isSearchable isClearable menuPlacement="auto"
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed" styles={reactSelectStyles}
                value={marketList.map((m) => ({ value: String(m.marketMasterId), label: m.marketMasterName })).find((o) => o.value === String(filter.marketId)) || null}
                onChange={(opt) => { setFilter((p) => ({ ...p, marketId: opt?.value || "" })); reset(); }}
                noOptionsMessage={() => "No markets"}
              />
            </Col>
            <Col md={2}>
              <label style={lbl}>Year <span style={{ color: "#e53e3e" }}>*</span></label>
              <Form.Select value={filter.year} onChange={(e) => { setFilter((p) => ({ ...p, year: e.target.value })); reset(); }} style={sel}>
                {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
              </Form.Select>
            </Col>
            <Col md={3}>
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
              {extraRow}
              <Col md={extraRow ? 12 : 12}>
                <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                  <button type="button" disabled={isDownloadingPdf} onClick={onPdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                    {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> PDF…</> : <>📄 PDF</>}
                  </button>
                  <button type="button" disabled={isDownloadingExcel} onClick={onExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                    {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> Excel…</> : <>📊 Excel</>}
                  </button>
                </div>
              </Col>
            </Row>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Shared hook — market list + filter state + view/pdf/excel actions
// ──────────────────────────────────────────────────────────────────────────
function useSeedMarketReport(endpointKey, filenamePrefix, friendlyTitle) {
  const today = new Date();
  const [filter, setFilter] = useState({
    marketId: localStorage.getItem("marketId") || "",
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });
  const [marketList, setMarketList] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [hasReport, setHasReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "marketMaster/get-all")
      .then((r) => setMarketList(r.data.content.marketMaster || []))
      .catch(() => setMarketList([]));
  }, []);

  const reset = () => { setHasReport(false); setDataRows([]); };

  const validate = () => {
    if (!filter.marketId) return "Please select a Market.";
    if (!filter.year)     return "Please select a Year.";
    if (!filter.month)    return "Please select a Month.";
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: "Required Fields",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px"><p style="color:#92400e;font-size:14px;font-weight:700;margin:0">${msg}</p></div></div>`,
      confirmButtonText: "Got it", confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "smkt-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px"><p style="color:#9b2c2c;font-size:13px;font-weight:600;margin:0">${msg}</p></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "smkt-swal" },
    });

  const params = () => ({ marketId: filter.marketId, year: Number(filter.year), month: Number(filter.month) });

  const handleView = async (e) => {
    e.preventDefault(); const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + `grainage-progress-report/${endpointKey}`, { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []); setHasReport(true);
    } catch { showErr("Fetch Failed", `Failed to load the ${friendlyTitle} report.`); }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + `grainage-progress-report/${endpointKey}/pdf`, { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); } finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + `grainage-progress-report/${endpointKey}/excel`, { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      a.download = `${filenamePrefix}_${filter.marketId}_${filter.year}_${filter.month}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); } finally { setIsDownloadingExcel(false); }
  };

  const marketName = marketList.find((m) => String(m.marketMasterId) === String(filter.marketId))?.marketMasterName || "—";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn    = MONTH_KN[Number(filter.month)] || "";

  return {
    filter, setFilter, reset,
    marketList, marketName, monthLabel, monthKn,
    dataRows, hasReport, isLoading, isDownloadingPdf, isDownloadingExcel,
    handleView, handlePdf, handleExcel,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  Sheet 1 — Seed Market Monthly Progress (hierarchical 7-col)
// ═══════════════════════════════════════════════════════════════════════════
export function SeedMarketMonthlyProgressReport() {
  const { t } = useTranslation();
  const rpt = useSeedMarketReport("seed-market/monthly-progress", "seed_market_monthly_progress", "Seed Market Monthly Progress");

  const fyLabel    = (() => { const m = Number(rpt.filter.month), y = Number(rpt.filter.year); return m >= 4 ? `${y}-${String(y + 1).slice(-2)}` : `${y - 1}-${String(y).slice(-2)}`; })();
  const pyFyLabel  = (() => { const m = Number(rpt.filter.month), y = Number(rpt.filter.year); return m >= 4 ? `${y - 1}-${String(y).slice(-2)}` : `${y - 2}-${String(y - 1).slice(-2)}`; })();

  const isSubRow = (r) => !r.sl_no || String(r.sl_no).trim() === "";
  const isParentOfSub = (rows, idx) => idx < rows.length - 1 && isSubRow(rows[idx + 1]);

  return (
    <Layout title={t("Seed Market Monthly Progress")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಗೂಡಿನ ಮಾರುಕಟ್ಟೆ ಮಾಹೆಯ ಪ್ರಗತಿ ವರದಿ")}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                Sheet 1 · Seed Market
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <MarketFilterCard
          config={{
            badge: "Sheet 1", icon: "🏪",
            gradient: "linear-gradient(135deg,#15803d 0%,#22c55e 50%,#5b57ac 100%)",
            headerKn: "ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಗೂಡಿನ ಮಾರುಕಟ್ಟೆ ಮಾಹೆಯ ಪ್ರಗತಿ",
            headerEn: "Seed Market Monthly Progress",
            subtitle: `Lots · MT · DFLs — CY ${fyLabel} vs PY ${pyFyLabel} · Mahe + Antya`,
          }}
          filter={rpt.filter} setFilter={rpt.setFilter} reset={rpt.reset}
          marketList={rpt.marketList} isLoading={rpt.isLoading} hasReport={rpt.hasReport}
          dataRows={rpt.dataRows} filteredRows={rpt.dataRows}
          isDownloadingPdf={rpt.isDownloadingPdf} isDownloadingExcel={rpt.isDownloadingExcel}
          onSubmit={rpt.handleView} onPdf={rpt.handlePdf} onExcel={rpt.handleExcel}
        />

        {rpt.hasReport && (
          <div className="smkt-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", minWidth: "220px" }}>
                <div style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Market</div>
                <div style={{ fontSize: "14px", color: "#1a202c", fontWeight: 800, marginTop: "2px" }}>{rpt.marketName}</div>
                <div style={{ fontSize: "10.5px", color: "#0f766e", marginTop: "1px" }}>CY {fyLabel} vs PY {pyFyLabel}</div>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                Sheet 1 · ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಗೂಡಿನ ಮಾರುಕಟ್ಟೆ ಮಾಹೆಯ ಪ್ರಗತಿ — {rpt.marketName} — {rpt.monthKn} {rpt.filter.year}
              </div>

              <div className="smkt-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1100px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#1e293b,#36506b)", color: "#fff", padding: "10px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, width: "55px", position: "sticky", top: 0, zIndex: 2 }}>
                        <div style={{ fontSize: "12px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Sl.</div>
                      </th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#334155,#475569)", color: "#fff", padding: "10px 14px", textAlign: "left", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "300px", position: "sticky", top: 0, zIndex: 2 }}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರ</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Description</div>
                      </th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#a16207,#ca8a04)", color: "#fff", padding: "10px 14px", textAlign: "left", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "150px", position: "sticky", top: 0, zIndex: 2 }}>
                        <div style={{ fontSize: "12.5px" }}>ಉಪ ವಿವರ</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Sub-detail</div>
                      </th>
                      <th colSpan={2} style={{ background: "linear-gradient(135deg,#15803d,#22c55e)", color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}>
                        <div style={{ fontSize: "12.5px" }}>ಪ್ರಸಕ್ತ ವರ್ಷ · CY {fyLabel}</div>
                      </th>
                      <th colSpan={2} style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}>
                        <div style={{ fontSize: "12.5px" }}>ಹಿಂದಿನ ವರ್ಷ · PY {pyFyLabel}</div>
                      </th>
                    </tr>
                    <tr>
                      {[
                        { kn: "ತಿಂಗಳಲ್ಲಿ", en: "Mahe", tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d" },
                        { kn: "ಅಂತ್ಯಕ್ಕೆ",  en: "Antya", tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d", strong: true },
                        { kn: "ತಿಂಗಳಲ್ಲಿ", en: "Mahe", tone: "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: "#4c1d95" },
                        { kn: "ಅಂತ್ಯಕ್ಕೆ",  en: "Antya", tone: "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: "#4c1d95", strong: true },
                      ].map((c, i) => (
                        <th key={i} style={{
                          background: c.tone, color: c.text,
                          padding: "8px 4px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)",
                          fontWeight: c.strong ? 800 : 700, minWidth: "120px",
                          position: "sticky", top: "44px", zIndex: 2,
                        }}>
                          <div style={{ fontSize: "10.5px" }}>{c.kn}</div>
                          <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rpt.dataRows.length === 0 && (
                      <tr><td colSpan={7} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>No records found.</td></tr>
                    )}
                    {rpt.dataRows.map((row, ri) => {
                      const sub = isSubRow(row);
                      const isParent = isParentOfSub(rpt.dataRows, ri);
                      const rowBg = sub ? "#f8fafc" : (isParent ? "linear-gradient(135deg,#fffbeb,#fef9ec)" : (ri % 2 === 1 ? "#f8fafc" : "#ffffff"));
                      const cb = { padding: "9px 8px", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6", fontSize: "12px", verticalAlign: "middle" };
                      const numCell = (v, palBg, palText, isStrong = false) => {
                        const n = numOrZero(v); const has = n !== 0;
                        return (
                          <td className="smkt-num" style={{ ...cb, textAlign: "right", paddingRight: "14px",
                            background: has ? palBg : "transparent", color: has ? palText : "#cbd5e0",
                            fontWeight: isStrong ? 800 : 700 }}>
                            {has ? (Number.isInteger(n) ? fmtInt(v) : fmtDec(v)) : "—"}
                          </td>
                        );
                      };
                      return (
                        <tr key={ri} className="smkt-tr" style={{ background: rowBg }}>
                          <td style={{ ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0", color: "#475569", fontWeight: 700 }}>
                            {row.sl_no ? (
                              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "26px", height: "26px", borderRadius: "50%", background: isParent ? "linear-gradient(135deg,#fbbf24,#f59e0b)" : "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: isParent ? "#fff" : "#1e293b", fontWeight: 800, fontSize: "11px" }}>{row.sl_no}</span>
                            ) : <span style={{ color: "#cbd5e0", fontSize: "10px" }}>↳</span>}
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: sub ? "32px" : "12px", color: "#0f172a", fontWeight: isParent ? 800 : 600, fontStyle: sub ? "italic" : "normal" }}>
                            {sub && <span style={{ color: "#94a3b8", marginRight: "6px" }}>↳</span>}
                            {row.description || "—"}
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "12px", color: "#a16207", fontWeight: 700, borderRight: "2px solid #e2e8f0" }}>
                            {row.sub_desc || <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          {numCell(row.cy_mo, "#f0fdf4", "#166534")}
                          {numCell(row.cy_me, "linear-gradient(135deg,#dcfce7,#bbf7d0)", "#14532d", true)}
                          {numCell(row.py_mo, "#f5f3ff", "#5b21b6")}
                          {numCell(row.py_me, "linear-gradient(135deg,#ede9fe,#ddd6fe)", "#4c1d95", true)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>{rpt.marketName} — {rpt.monthLabel} {rpt.monthKn} {rpt.filter.year} · Sheet 1</span>
              </div>
            </Card>
          </div>
        )}
      </Block>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Sheet 2 — Seed Market Pricing Summary (3 rows × 14 cols, ₹/kg)
// ═══════════════════════════════════════════════════════════════════════════
export function SeedMarketMonthlyPricingReport() {
  const { t } = useTranslation();
  const rpt = useSeedMarketReport("seed-market/monthly-pricing", "seed_market_monthly_pricing", "Seed Market Pricing Summary");
  const fyLabel   = (() => { const m = Number(rpt.filter.month), y = Number(rpt.filter.year); return m >= 4 ? `${y}-${String(y + 1).slice(-2)}` : `${y - 1}-${String(y).slice(-2)}`; })();
  const pyFyLabel = (() => { const m = Number(rpt.filter.month), y = Number(rpt.filter.year); return m >= 4 ? `${y - 1}-${String(y).slice(-2)}` : `${y - 2}-${String(y - 1).slice(-2)}`; })();

  const categoryTone = (cat) => {
    const c = String(cat || "").trim();
    if (c.includes("ಬಿತ್ತ"))   return { bg: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", icon: "🌱" };
    if (c.includes("ನೂಲು"))   return { bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", color: "#5b21b6", icon: "🧵" };
    if (c.includes("ಒಟ್ಟು"))   return { bg: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#854d0e", icon: "Σ" };
    return { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#334155", icon: "•" };
  };

  return (
    <Layout title={t("Seed Market Pricing Summary")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ಧಾರಣೆ ಸಾರಾಂಶ — ಪ್ರತಿ ಕೆ.ಜಿಗೆ")}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                Sheet 2 · Pricing
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <MarketFilterCard
          config={{
            badge: "Sheet 2", icon: "💰",
            gradient: "linear-gradient(135deg,#a16207 0%,#ca8a04 50%,#7c3aed 100%)",
            headerKn: "ಧಾರಣೆ ಸಾರಾಂಶ (ಪ್ರತಿ ಕೆ.ಜಿಗೆ)",
            headerEn: "Pricing Summary (per kg)",
            subtitle: `Min / Max / Avg rates — CY ${fyLabel} vs PY ${pyFyLabel} · Mahe + Antya`,
          }}
          filter={rpt.filter} setFilter={rpt.setFilter} reset={rpt.reset}
          marketList={rpt.marketList} isLoading={rpt.isLoading} hasReport={rpt.hasReport}
          dataRows={rpt.dataRows} filteredRows={rpt.dataRows}
          isDownloadingPdf={rpt.isDownloadingPdf} isDownloadingExcel={rpt.isDownloadingExcel}
          onSubmit={rpt.handleView} onPdf={rpt.handlePdf} onExcel={rpt.handleExcel}
        />

        {rpt.hasReport && (
          <div className="smkt-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3">
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", minWidth: "220px" }}>
                <div style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Market</div>
                <div style={{ fontSize: "14px", color: "#1a202c", fontWeight: 800, marginTop: "2px" }}>{rpt.marketName}</div>
                <div style={{ fontSize: "10.5px", color: "#a16207", marginTop: "1px" }}>Period: {rpt.monthLabel} {rpt.filter.year} · ₹ / kg</div>
              </div>
              {rpt.dataRows.map((row, i) => {
                const tone = categoryTone(row.category);
                const cyMeAvg = numOrZero(row.cy_me_avg);
                const pyMeAvg = numOrZero(row.py_me_avg);
                const delta = pyMeAvg > 0 ? ((cyMeAvg - pyMeAvg) * 100) / pyMeAvg : 0;
                return (
                  <div key={i} style={{ background: tone.bg, border: `1.5px solid ${tone.color}33`, borderRadius: "12px", padding: "10px 14px", minWidth: "220px", flex: 1 }}>
                    <div style={{ fontSize: "11px", color: tone.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em" }}>{tone.icon} {row.category}</div>
                    <div className="smkt-num" style={{ fontSize: "18px", color: tone.color, fontWeight: 900, marginTop: "2px" }}>₹ {fmtDec(cyMeAvg)} <span style={{ fontSize: "10.5px", fontWeight: 600 }}>/ kg avg</span></div>
                    <div className="smkt-num" style={{ fontSize: "10.5px", color: tone.color, fontWeight: 700, marginTop: "1px" }}>
                      vs PY: {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}% &nbsp;·&nbsp; CY Mo: ₹ {fmtDec(row.cy_mo_avg)}
                    </div>
                  </div>
                );
              })}
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                Sheet 2 · ಧಾರಣೆ ಸಾರಾಂಶ — {rpt.marketName} — {rpt.monthKn} {rpt.filter.year}
              </div>

              <div className="smkt-scroll" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1500px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#1e293b,#36506b)", color: "#fff", padding: "10px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, width: "55px", position: "sticky", top: 0, zIndex: 2 }}>
                        <div>ಕ್ರ.ಸಂ.</div><div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Sl.</div>
                      </th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#334155,#475569)", color: "#fff", padding: "10px 14px", textAlign: "left", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "180px", position: "sticky", top: 0, zIndex: 2 }}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರ</div><div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Category</div>
                      </th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#9d174d,#db2777)", color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "110px", position: "sticky", top: 0, zIndex: 2 }}>
                        <div style={{ fontSize: "12px" }}>ಮಹಿಳಾ ಸಂಖ್ಯೆ</div><div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Women (CY ME)</div>
                      </th>
                      {[
                        { en: `CY ${fyLabel} · Mahe`,  tone: "linear-gradient(135deg,#15803d,#22c55e)" },
                        { en: `CY ${fyLabel} · Antya`, tone: "linear-gradient(135deg,#0f766e,#14b8a6)" },
                        { en: `PY ${pyFyLabel} · Mahe`,  tone: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
                        { en: `PY ${pyFyLabel} · Antya`, tone: "linear-gradient(135deg,#5b21b6,#7c3aed)" },
                      ].map((p, i) => (
                        <th key={i} colSpan={3} style={{ background: p.tone, color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}>
                          <div style={{ fontSize: "11.5px" }}>{p.en}</div>
                          <div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>₹ / kg</div>
                        </th>
                      ))}
                    </tr>
                    <tr>
                      {[0, 1, 2, 3].flatMap((g) => ([
                        { en: "Min", tone: g < 2 ? "linear-gradient(180deg,#86efac,#4ade80)" : "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: g < 2 ? "#14532d" : "#4c1d95" },
                        { en: "Max", tone: g < 2 ? "linear-gradient(180deg,#86efac,#4ade80)" : "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: g < 2 ? "#14532d" : "#4c1d95" },
                        { en: "Avg", tone: g < 2 ? "linear-gradient(180deg,#86efac,#4ade80)" : "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: g < 2 ? "#14532d" : "#4c1d95", strong: true },
                      ])).map((c, i) => (
                        <th key={i} style={{ background: c.tone, color: c.text, padding: "7px 4px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: c.strong ? 800 : 700, minWidth: "85px", position: "sticky", top: "44px", zIndex: 2 }}>
                          <div style={{ fontSize: "10.5px" }}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rpt.dataRows.length === 0 && <tr><td colSpan={15} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>No records found.</td></tr>}
                    {rpt.dataRows.map((row, ri) => {
                      const tone = categoryTone(row.category);
                      const cb = { padding: "9px 6px", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6", fontSize: "11.5px", verticalAlign: "middle" };
                      const isTotal = String(row.category || "").includes("ಒಟ್ಟು");
                      const rowBg = isTotal ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const numCell = (v, palBg, palText, isStrong = false, extra = {}) => {
                        const n = numOrZero(v); const has = n !== 0;
                        return (
                          <td className="smkt-num" style={{ ...cb, ...extra, textAlign: "right", paddingRight: "12px",
                            background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (has ? palBg : "transparent"),
                            color: isTotal ? "#78350f" : (has ? palText : "#cbd5e0"),
                            fontWeight: isTotal ? 900 : (isStrong ? 800 : 700) }}>
                            {has ? `₹ ${fmtDec(v)}` : "—"}
                          </td>
                        );
                      };
                      return (
                        <tr key={ri} className="smkt-tr" style={{ background: rowBg }}>
                          <td style={{ ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0", fontWeight: 800 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "26px", height: "26px", borderRadius: "50%", background: isTotal ? "linear-gradient(135deg,#fbbf24,#f59e0b)" : "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: isTotal ? "#fff" : "#1e293b", fontWeight: 800, fontSize: "11px" }}>{row.sl_no}</span>
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "14px", borderRight: "2px solid #e2e8f0" }}>
                            <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "12px", background: tone.bg, color: tone.color, fontWeight: 800, fontSize: "12px" }}>
                              {tone.icon} {row.category || "—"}
                            </span>
                          </td>
                          {(() => {
                            const n = numOrZero(row.women_count); const has = n !== 0;
                            return (
                              <td className="smkt-num" style={{
                                ...cb, textAlign: "center",
                                background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (has ? "linear-gradient(135deg,#fce7f3,#fbcfe8)" : "transparent"),
                                color: isTotal ? "#78350f" : (has ? "#9d174d" : "#cbd5e0"),
                                fontWeight: isTotal ? 900 : 800,
                                borderRight: "2px solid #e2e8f0",
                              }}>
                                {has ? <>👩 {fmtInt(row.women_count)}</> : "—"}
                              </td>
                            );
                          })()}
                          {numCell(row.cy_mo_min, "#f0fdf4", "#166534")}
                          {numCell(row.cy_mo_max, "#f0fdf4", "#166534")}
                          {numCell(row.cy_mo_avg, "linear-gradient(135deg,#dcfce7,#bbf7d0)", "#14532d", true, { borderRight: "2px solid #e2e8f0" })}
                          {numCell(row.cy_me_min, "#f0fdfa", "#115e59")}
                          {numCell(row.cy_me_max, "#f0fdfa", "#115e59")}
                          {numCell(row.cy_me_avg, "linear-gradient(135deg,#ccfbf1,#99f6e4)", "#0f766e", true, { borderRight: "2px solid #e2e8f0" })}
                          {numCell(row.py_mo_min, "#f5f3ff", "#5b21b6")}
                          {numCell(row.py_mo_max, "#f5f3ff", "#5b21b6")}
                          {numCell(row.py_mo_avg, "linear-gradient(135deg,#ede9fe,#ddd6fe)", "#4c1d95", true, { borderRight: "2px solid #e2e8f0" })}
                          {numCell(row.py_me_min, "#eef2ff", "#3730a3")}
                          {numCell(row.py_me_max, "#eef2ff", "#3730a3")}
                          {numCell(row.py_me_avg, "linear-gradient(135deg,#e0e7ff,#c7d2fe)", "#3730a3", true)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>{rpt.marketName} — {rpt.monthLabel} {rpt.monthKn} {rpt.filter.year} · Sheet 2 · ₹ / kg</span>
              </div>
            </Card>
          </div>
        )}
      </Block>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Sheet 3 — Seed Market District-wise Cocoon Sales (14 cols)
// ═══════════════════════════════════════════════════════════════════════════
export function SeedMarketDistrictWiseReport() {
  const { t } = useTranslation();
  const rpt = useSeedMarketReport("seed-market/district-wise", "seed_market_district_wise", "Seed Market District-wise Sales");
  const [search, setSearch] = useState("");
  const [hideTotals, setHideTotals] = useState(false);

  const filteredRows = useMemo(() => {
    let rows = rpt.dataRows;
    if (hideTotals) rows = rows.filter((r) => !isTotalRow(r, "district"));
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((r) => String(r.district ?? "").toLowerCase().includes(q));
  }, [rpt.dataRows, search, hideTotals]);

  const kpis = useMemo(() => {
    const total = rpt.dataRows.find((r) => isTotalRow(r, "district"));
    if (!total) return null;
    return {
      moQty:  numOrZero(total.cy_mo_tot_qty),
      moAmt:  numOrZero(total.cy_mo_tot_amt),
      meQty:  numOrZero(total.cy_me_tot_qty),
      meAmt:  numOrZero(total.cy_me_tot_amt),
      seedMe: numOrZero(total.cy_me_seed_qty),
      thrMe:  numOrZero(total.cy_me_thr_qty),
    };
  }, [rpt.dataRows]);

  return (
    <Layout title={t("Seed Market District-wise Sales")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ಜಿಲ್ಲಾವಾರು ಗೂಡು ಮಾರಾಟ ವರದಿ — ಮಾಸಿಕ")}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                Sheet 3 · District-wise
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <MarketFilterCard
          config={{
            badge: "Sheet 3", icon: "🗺",
            gradient: "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 50%,#15803d 100%)",
            headerKn: "ಜಿಲ್ಲಾವಾರು ಗೂಡು ಮಾರಾಟ",
            headerEn: "District-wise Cocoon Sales",
            subtitle: "Seed (RSP/Govt/NSSO) vs Thread (Reeling) vs Total — Qty (kg) and Value (₹) per district",
          }}
          filter={rpt.filter} setFilter={rpt.setFilter} reset={() => { rpt.reset(); setSearch(""); setHideTotals(false); }}
          marketList={rpt.marketList} isLoading={rpt.isLoading} hasReport={rpt.hasReport}
          dataRows={rpt.dataRows} filteredRows={filteredRows}
          isDownloadingPdf={rpt.isDownloadingPdf} isDownloadingExcel={rpt.isDownloadingExcel}
          onSubmit={rpt.handleView} onPdf={rpt.handlePdf} onExcel={rpt.handleExcel}
          extraRow={
            <>
              <Col md={5}>
                <label style={lbl}>Quick Search (District)</label>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type to filter…" style={{ ...sel, padding: "8px 12px" }} />
              </Col>
              <Col md={3}>
                <label style={lbl}>Total row</label>
                <button type="button" onClick={() => setHideTotals((v) => !v)}
                  style={{ width: "100%", padding: "7px 12px", borderRadius: "9px", border: "none",
                    background: hideTotals ? "#f1f5f9" : "linear-gradient(135deg,#fef3c7,#fde68a)",
                    color: hideTotals ? "#475569" : "#854d0e",
                    fontWeight: 800, fontSize: "12.5px", cursor: "pointer" }}>
                  {hideTotals ? "🚫 Total hidden" : "✓ Total shown"}
                </button>
              </Col>
            </>
          }
        />

        {rpt.hasReport && (
          <div className="smkt-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", minWidth: "200px" }}>
                <div style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Market</div>
                <div style={{ fontSize: "14px", color: "#1a202c", fontWeight: 800, marginTop: "2px" }}>{rpt.marketName}</div>
              </div>
              {kpis && (
                <>
                  <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", minWidth: "220px" }}>
                    <div style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ME · Total Qty</div>
                    <div className="smkt-num" style={{ fontSize: "16px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{fmtDec(kpis.meQty)} kg</div>
                    <div className="smkt-num" style={{ fontSize: "10.5px", color: "#15803d", marginTop: "1px", fontWeight: 700 }}>Mo: {fmtDec(kpis.moQty)} kg</div>
                  </div>
                  <div style={{ background: "linear-gradient(135deg,#fce7f3,#fdf2f8)", border: "1.5px solid #f9a8d4", borderRadius: "12px", padding: "10px 18px", minWidth: "220px" }}>
                    <div style={{ fontSize: "11px", color: "#9d174d", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ME · Total Value</div>
                    <div className="smkt-num" style={{ fontSize: "16px", color: "#831843", fontWeight: 800, marginTop: "2px" }}>{fmtINR(kpis.meAmt)}</div>
                    <div className="smkt-num" style={{ fontSize: "10.5px", color: "#be185d", marginTop: "1px", fontWeight: 700 }}>Mo: {fmtINR(kpis.moAmt)}</div>
                  </div>
                  <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", minWidth: "240px" }}>
                    <div style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ME · Seed / Thread split</div>
                    <div className="smkt-num" style={{ fontSize: "13px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>🌱 {fmtDec(kpis.seedMe)} kg &nbsp;·&nbsp; 🧵 {fmtDec(kpis.thrMe)} kg</div>
                  </div>
                </>
              )}
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                Sheet 3 · ಜಿಲ್ಲಾವಾರು ಗೂಡು ಮಾರಾಟ — {rpt.marketName} — {rpt.monthKn} {rpt.filter.year}
              </div>

              <div className="smkt-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1800px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={3} style={{ background: "linear-gradient(135deg,#1e293b,#36506b)", color: "#fff", padding: "10px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, width: "55px", position: "sticky", top: 0, zIndex: 2 }}>
                        <div>ಕ್ರ.ಸಂ.</div><div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Sl.</div>
                      </th>
                      <th rowSpan={3} style={{ background: "linear-gradient(135deg,#334155,#475569)", color: "#fff", padding: "10px 14px", textAlign: "left", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "180px", position: "sticky", top: 0, zIndex: 2 }}>
                        <div style={{ fontSize: "12.5px" }}>ಜಿಲ್ಲೆ</div><div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>District</div>
                      </th>
                      <th colSpan={6} style={{ background: "linear-gradient(135deg,#15803d,#22c55e)", color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}>
                        <div style={{ fontSize: "12.5px" }}>CY · ತಿಂಗಳಲ್ಲಿ · Mahe</div>
                      </th>
                      <th colSpan={6} style={{ background: "linear-gradient(135deg,#0f766e,#14b8a6)", color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}>
                        <div style={{ fontSize: "12.5px" }}>CY · ಅಂತ್ಯಕ್ಕೆ · Antya</div>
                      </th>
                    </tr>
                    <tr>
                      {[0, 1].flatMap(() => ([
                        { label: "🌱 ಬಿತ್ತನೆ · Seed",    span: 2, tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d" },
                        { label: "🧵 ನೂಲು · Thread",    span: 2, tone: "linear-gradient(180deg,#a5b4fc,#818cf8)", text: "#3730a3" },
                        { label: "Σ ಒಟ್ಟು · Total",     span: 2, tone: "linear-gradient(180deg,#fde68a,#fcd34d)", text: "#854d0e" },
                      ])).map((g, i) => (
                        <th key={i} colSpan={g.span} style={{ background: g.tone, color: g.text, padding: "8px 4px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: "44px", zIndex: 2 }}>
                          <div style={{ fontSize: "11px" }}>{g.label}</div>
                        </th>
                      ))}
                    </tr>
                    <tr>
                      {[0, 1, 2, 3, 4, 5].map((i) => ([
                        <th key={`q-${i}`} style={{ background: "linear-gradient(180deg,#cbd5e1,#94a3b8)", color: "#1e293b", padding: "6px 4px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 700, fontSize: "10px", minWidth: "85px", position: "sticky", top: "85px", zIndex: 2 }}>Qty (kg)</th>,
                        <th key={`v-${i}`} style={{ background: "linear-gradient(180deg,#cbd5e1,#94a3b8)", color: "#1e293b", padding: "6px 4px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 700, fontSize: "10px", minWidth: "100px", position: "sticky", top: "85px", zIndex: 2 }}>Value (₹)</th>,
                      ]))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && <tr><td colSpan={14} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>{rpt.dataRows.length === 0 ? "No records found." : `No matches for "${search}".`}</td></tr>}
                    {filteredRows.map((row, ri) => {
                      const isTotal = isTotalRow(row, "district");
                      const rowBg = isTotal ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const cb = {
                        padding: "9px 6px",
                        borderBottom: isTotal ? "2px solid #fcd34d" : "1px solid #e2e8f0",
                        borderTop: isTotal ? "1.5px solid #fcd34d" : "none",
                        borderRight: "1px solid #eef2f6",
                        fontSize: "11.5px", verticalAlign: "middle",
                      };
                      const qtyCell = (v, palBg, palText, extra = {}) => {
                        const n = numOrZero(v); const has = n !== 0;
                        return (
                          <td className="smkt-num" style={{ ...cb, ...extra, textAlign: "right", paddingRight: "10px",
                            background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (has ? palBg : "transparent"),
                            color: isTotal ? "#78350f" : (has ? palText : "#cbd5e0"),
                            fontWeight: isTotal ? 900 : 700 }}>
                            {has ? fmtDec(v) : "—"}
                          </td>
                        );
                      };
                      const amtCell = (v, palBg, palText, extra = {}) => {
                        const n = numOrZero(v); const has = n !== 0;
                        return (
                          <td className="smkt-num" style={{ ...cb, ...extra, textAlign: "right", paddingRight: "10px",
                            background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (has ? palBg : "transparent"),
                            color: isTotal ? "#78350f" : (has ? palText : "#cbd5e0"),
                            fontWeight: isTotal ? 900 : 700 }}>
                            {has ? fmtINR(v) : "—"}
                          </td>
                        );
                      };
                      return (
                        <tr key={ri} className="smkt-tr" style={{ background: rowBg }}>
                          <td style={{ ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0", color: isTotal ? "#78350f" : "#475569", fontWeight: isTotal ? 900 : 700 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "26px", height: "26px", borderRadius: "50%", background: isTotal ? "linear-gradient(135deg,#fbbf24,#f59e0b)" : "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: isTotal ? "#fff" : "#1e293b", fontWeight: 800, fontSize: "11px" }}>{row.sl_no}</span>
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "12px", color: isTotal ? "#78350f" : "#0f172a", fontWeight: isTotal ? 900 : 700, borderRight: "2px solid #e2e8f0" }}>
                            {isTotal ? <>🟰 <span style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>{row.district}</span></> : <>📍 {row.district || "—"}</>}
                          </td>
                          {/* CY Mahe */}
                          {qtyCell(row.cy_mo_seed_qty, "#f0fdf4", "#166534")}
                          {amtCell(row.cy_mo_seed_amt, "#f0fdf4", "#166534")}
                          {qtyCell(row.cy_mo_thr_qty,  "#eef2ff", "#3730a3")}
                          {amtCell(row.cy_mo_thr_amt,  "#eef2ff", "#3730a3")}
                          {qtyCell(row.cy_mo_tot_qty,  "linear-gradient(135deg,#fef3c7,#fde68a)", "#854d0e")}
                          {amtCell(row.cy_mo_tot_amt,  "linear-gradient(135deg,#fef3c7,#fde68a)", "#854d0e", { borderRight: "2px solid #e2e8f0" })}
                          {/* CY Antya */}
                          {qtyCell(row.cy_me_seed_qty, "linear-gradient(135deg,#dcfce7,#bbf7d0)", "#14532d")}
                          {amtCell(row.cy_me_seed_amt, "linear-gradient(135deg,#dcfce7,#bbf7d0)", "#14532d")}
                          {qtyCell(row.cy_me_thr_qty,  "linear-gradient(135deg,#e0e7ff,#c7d2fe)", "#3730a3")}
                          {amtCell(row.cy_me_thr_amt,  "linear-gradient(135deg,#e0e7ff,#c7d2fe)", "#3730a3")}
                          {qtyCell(row.cy_me_tot_qty,  "linear-gradient(135deg,#fde68a,#fcd34d)", "#78350f")}
                          {amtCell(row.cy_me_tot_amt,  "linear-gradient(135deg,#fde68a,#fcd34d)", "#78350f")}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>{rpt.marketName} — {rpt.monthLabel} {rpt.monthKn} {rpt.filter.year} · Sheet 3 · {filteredRows.length} / {rpt.dataRows.length} rows</span>
              </div>
            </Card>
          </div>
        )}
      </Block>
    </Layout>
  );
}
