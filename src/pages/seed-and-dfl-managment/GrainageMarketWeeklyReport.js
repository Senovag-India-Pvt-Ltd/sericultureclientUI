import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
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

const WEEKS = [
  { value: 1, range: "1-7"     },
  { value: 2, range: "8-14"    },
  { value: 3, range: "15-21"   },
  { value: 4, range: "22-28"   },
  { value: 5, range: "29-end"  },
];

// Column model — matches the backend repository keys exactly.
// Leading 3 columns: Sl.No, Parental, Date.
const LEADING = [
  { key: "sl_no",              label: "ಕ್ರ.ಸಂ.",   sub: "Sl.No",          tint: "sn",    align: "center", width: 70  },
  { key: "lot_parental_level", label: "ತಂಡಗಳು",    sub: "Parental Level", tint: "ident", align: "left",   width: 220 },
  { key: "auction_date",       label: "ದಿನಾಂಕ",    sub: "Date",           tint: "ident", align: "center", width: 130 },
];

// 5 sub-columns under the grouped header "ರೋ.ರ.ಮೊಟ್ಟೆ".
const RRM_GROUP = [
  { key: "rrm_moola_bittanege", label: "ಮೂಲ ಬಿತ್ತನೆಗೆ", sub: "Source",      tint: "rrm", align: "center", width: 120 },
  { key: "rrm_sa_bi_ko",        label: "ಸ.ಬಿ.ಕೊ",        sub: "Sa.Bi.Ko",    tint: "rrm", align: "center", width: 110 },
  { key: "rrm_ra_re_bi_ko",     label: "ರಾ.ರೇ.ಬಿ.ಕೋ",    sub: "Ra.Re.Bi.Ko", tint: "rrm", align: "center", width: 120 },
  { key: "rrm_kha_mo_ta",       label: "ಖಾ.ಮೊ.ತ",        sub: "Kha.Mo.Ta",   tint: "rrm", align: "center", width: 110 },
  { key: "rrm_itare",           label: "ಇತರೆ",           sub: "Other",       tint: "rrm", align: "center", width: 100 },
];

// Trailing columns: aggregate weights + amounts.
const TRAILING = [
  { key: "total_lot_weight", label: "ಒಟ್ಟು ಪ್ರಮಾಣ",  sub: "Total (kg)",       tint: "metric", align: "center", width: 130, kind: "kg"  },
  { key: "bittane_weight",   label: "ಒಟ್ಟು ಬಿತ್ತನೆ",   sub: "Seed Cocoon (kg)", tint: "seed",   align: "center", width: 150, kind: "kg"  },
  { key: "reeling_weight",   label: "ರೀಲಿಂಗ್",         sub: "Reeling (kg)",     tint: "reel",   align: "center", width: 130, kind: "kg"  },
  { key: "remaining",        label: "ಉಳಿಕೆ ಶೇಖರಣೆ",   sub: "Remaining",        tint: "remain", align: "center", width: 120, kind: "kg"  },
  { key: "bittane_amount",   label: "ಬಿತ್ತನೆ ದರ",      sub: "Seed Amount",      tint: "amt",    align: "center", width: 140, kind: "amt" },
  { key: "reeling_amount",   label: "ರೀಲಿಂಗ್ ದರ",     sub: "Reeling Amount",   tint: "amt",    align: "center", width: 140, kind: "amt" },
];

// Flat list for body rendering — 14 columns total (3 + 5 + 6).
const COLS = [...LEADING, ...RRM_GROUP, ...TRAILING];

const TINT = {
  sn:     { headBg: "linear-gradient(135deg,#1e293b,#36506b)", cellBg: "#f8fafc", text: "#475569" },
  ident:  { headBg: "linear-gradient(135deg,#1e293b,#36506b)", cellBg: "#ffffff", text: "#0f172a" },
  rrm:    { headBg: "linear-gradient(180deg,#14b8a6,#0d9488)", cellBg: "#f0fdfa", text: "#134e4a" },
  metric: { headBg: "linear-gradient(135deg,#0f766e,#14b8a6)", cellBg: "#f0fdfa", text: "#134e4a" },
  seed:   { headBg: "linear-gradient(135deg,#15803d,#22c55e)", cellBg: "#f0fdf4", text: "#14532d" },
  reel:   { headBg: "linear-gradient(135deg,#0e7490,#06b6d4)", cellBg: "#ecfeff", text: "#155e75" },
  remain: { headBg: "linear-gradient(135deg,#b45309,#f59e0b)", cellBg: "#fffbeb", text: "#92400e" },
  amt:    { headBg: "linear-gradient(135deg,#4338ca,#6366f1)", cellBg: "#eef2ff", text: "#312e81" },
};

// ರೋ.ರ.ಮೊಟ್ಟೆ group header background (parent of the 5 sub-cols).
const RRM_GROUP_BG = "linear-gradient(135deg,#0f766e,#14b8a6)";

if (!document.getElementById("gmwk-styles")) {
  const s = document.createElement("style");
  s.id = "gmwk-styles";
  s.innerHTML = `
    .gmwk-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gmwk-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gmwk-swal .swal2-icon { margin:20px auto 4px !important; }
    .gmwk-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gmwk-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gmwk-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    @keyframes gmwk-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(20,184,166,.35);} 50% { box-shadow:0 0 0 8px rgba(20,184,166,0);} }
    .gmwk-wrap { animation: gmwk-in .35s ease; }
    .gmwk-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gmwk-pill { animation: gmwk-pulse 2.4s infinite; }
    .gmwk-table th { letter-spacing:.02em; }
    .gmwk-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gmwk-scroll::-webkit-scrollbar { height:9px; }
    .gmwk-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .gmwk-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#14b8a6,#5b57ac); border-radius:6px; }
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

const num = (v) => {
  if (v === null || v === undefined) return 0;
  const n = parseFloat(String(v).replace(/[^\d.\-]/g, ""));
  return isNaN(n) ? 0 : n;
};
const fmtKg  = (v) => num(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = (v) => Math.round(num(v)).toLocaleString();
const fmtAmt = (v) => `₹ ${Math.round(num(v)).toLocaleString()}`;
const fmtCell = (v, kind) => {
  if (v === null || v === undefined || String(v).trim() === "") return "—";
  if (kind === "kg")  return fmtKg(v);
  if (kind === "int") return fmtInt(v);
  if (kind === "amt") return fmtAmt(v);
  return String(v);
};

function GrainageMarketWeeklyReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ financialYearMasterId: "", month: "", week: "", marketId: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [financialYearList, setFinancialYearList] = useState([]);
  const [marketList,        setMarketList]        = useState([]);

  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "financialYearMaster/get-all")
      .then((r) => setFinancialYearList(r.data.content.financialYearMaster || []))
      .catch(() => setFinancialYearList([]));

    api.get(baseURL + "financialYearMaster/get-is-default")
      .then((r) => {
        const fy = r.data.content;
        if (fy) {
          setFilter((p) => ({ ...p, financialYearMasterId: fy.financialYearMasterId }));
          setFyStartYear(extractYear(fy.financialYear));
        }
      })
      .catch(() => {});

    api.get(baseURL + "marketMaster/get-all")
      .then((r) => setMarketList(r.data.content.marketMaster || []))
      .catch(() => setMarketList([]));
  }, []);

  const extractYear = (str) => {
    if (!str) return null;
    const yr = parseInt(String(str).trim().split("-")[0], 10);
    return isNaN(yr) ? null : yr;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((p) => ({ ...p, [name]: value }));
    setHasReport(false);
    setDataRows([]);
    if (name === "financialYearMasterId") {
      const sel2 = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel2 ? extractYear(sel2.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.marketId)              return "Please select a Market.";
    if (!filter.financialYearMasterId) return "Please select a Financial Year.";
    if (!filter.month)                 return "Please select a Month.";
    if (!filter.week)                  return "Please select a Week.";
    if (!fyStartYear)                  return "Could not determine the financial year start year.";
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: "Required Fields",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">Missing Selection</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Got it", confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "gmwk-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gmwk-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { year, month: m, week: Number(filter.week), marketId: Number(filter.marketId) };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "weekly-market-report", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Market Weekly Report.");
        }
      } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "weekly-market-report/pdf", { params: params(), responseType: "blob" });
      if (!res.data || res.data.size === 0) {
        Swal.fire({ icon: "info", title: "No Data Found", text: "No records found for the selected criteria." });
        return;
      }
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
      const res = await api.get(baseURLSeedDFL + "weekly-market-report/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `market_weekly_${year}_${m}_w${filter.week}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr("Excel Failed", "Could not generate the Excel report.");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const weekNum    = Number(filter.week);
  const weekRange  = WEEKS.find((w) => w.value === weekNum)?.range || "";
  const market     = marketList.find((m) => String(m.marketMasterId) === String(filter.marketId));
  const marketEn   = market?.marketMasterName || "";
  const marketKn   = market?.marketNameInKannada || "";

  // Totals across all rows (DFLs column removed by the backend; matches Excel/PDF totals row).
  const totals = dataRows.reduce((acc, r) => {
    acc.total  += num(r.total_lot_weight);
    acc.seed   += num(r.bittane_weight);
    acc.reel   += num(r.reeling_weight);
    acc.remain += num(r.remaining);
    acc.seedAmt += num(r.bittane_amount);
    acc.reelAmt += num(r.reeling_amount);
    return acc;
  }, { total: 0, seed: 0, reel: 0, remain: 0, seedAmt: 0, reelAmt: 0 });

  const seedPct = totals.total > 0 ? Math.round((totals.seed / totals.total) * 100) : null;
  const reelPct = totals.total > 0 ? Math.round((totals.reel / totals.total) * 100) : null;

  return (
    <Layout title={t("Market Weekly Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("ಮಾರುಕಟ್ಟೆ ವಾರದ ವರದಿ")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#5b57ac 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center",
            gap: "12px",
            position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🛒</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>ಮಾರುಕಟ್ಟೆ ವಾರದ ವರದಿ</div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Market Weekly Report — Auction roll-up by Parental Level (RSP / NSSO / Govt Grainage / Reeling)</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {marketEn && (
                  <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                    🛒 {marketEn}{marketKn ? ` · ${marketKn}` : ""}
                  </span>
                )}
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                <span className="gmwk-pill" style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  Week {weekNum} · days {weekRange}
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>Market <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="marketId" value={filter.marketId} onChange={handleChange} style={sel}>
                    <option value="">— Select Market —</option>
                    {marketList.map((m) => (
                      <option key={m.marketMasterId} value={m.marketMasterId}>
                        {m.marketMasterName}{m.marketNameInKannada ? ` · ${m.marketNameInKannada}` : ""}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>Financial Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">— Year —</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">— Month —</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>Week <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="week" value={filter.week} onChange={handleChange} style={sel}>
                    <option value="">— Week —</option>
                    {WEEKS.map((w) => (
                      <option key={w.value} value={w.value}>W{w.value} · {w.range}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
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

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="gmwk-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Period</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear} · W{weekNum}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#ccfbf1)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಒಟ್ಟು ಪ್ರಮಾಣ</span>
                <span className="gmwk-num" style={{ fontSize: "14px", color: "#134e4a", fontWeight: 800, marginTop: "2px" }}>{fmtKg(totals.total)} kg</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dcfce7,#ecfdf5)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#15803d", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಒಟ್ಟು ಬಿತ್ತನೆ Seed</span>
                <span className="gmwk-num" style={{ fontSize: "14px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>
                  {fmtKg(totals.seed)} kg{seedPct !== null ? ` · ${seedPct}%` : ""}
                </span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ರೀಲಿಂಗ್ Reeling</span>
                <span className="gmwk-num" style={{ fontSize: "14px", color: "#155e75", fontWeight: 800, marginTop: "2px" }}>
                  {fmtKg(totals.reel)} kg{reelPct !== null ? ` · ${reelPct}%` : ""}
                </span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0e7ff,#eef2ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಒಟ್ಟು ದರ Total Amount</span>
                <span className="gmwk-num" style={{ fontSize: "14px", color: "#312e81", fontWeight: 800, marginTop: "2px" }}>
                  {fmtAmt(totals.seedAmt + totals.reelAmt)}
                </span>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{ background: "linear-gradient(135deg,#edf2f7,#e2e8f0)", border: "1.5px solid #cbd5e0", borderRadius: "20px", padding: "6px 16px", fontSize: "12px", color: "#4a5568", fontWeight: 600 }}>
                  {dataRows.length} groups
                </span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              {/* Title strip */}
              <div style={{
                background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಗೂಡು ಮಾರುಕಟ್ಟೆ {marketKn || marketEn} &nbsp;·&nbsp; {monthKn} {monthYear} ನೆ ಮಾಹೆ {weekNum} ನೇ ವಾರದ ವಹಿವಾಟು ವರದಿ
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Market Weekly Report{marketEn ? ` · ${marketEn}` : ""} &nbsp;|&nbsp; {monthLabel} {monthYear} &nbsp;|&nbsp; Week {weekNum} (days {weekRange})
                </div>
              </div>

              <div className="gmwk-scroll" style={{ overflowX: "auto" }}>
                <table className="gmwk-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "1700px" }}>
                  <thead>
                    {/* Row 1 — leading 3 cols (rowSpan 2), ರೋ.ರ.ಮೊಟ್ಟೆ group (colSpan 5), trailing 6 cols (rowSpan 2) */}
                    <tr>
                      {LEADING.map((c) => {
                        const t = TINT[c.tint];
                        return (
                          <th key={c.key} rowSpan={2} style={{
                            background: t.headBg, color: "#fff",
                            padding: "12px 10px", textAlign: c.align,
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: c.width, verticalAlign: "middle", whiteSpace: "nowrap",
                          }}>
                            <div style={{ fontSize: "12.5px" }}>{c.label}</div>
                            <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>{c.sub}</div>
                          </th>
                        );
                      })}
                      <th colSpan={RRM_GROUP.length} style={{
                        background: RRM_GROUP_BG, color: "#fff",
                        padding: "10px 12px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ರೋ.ರ.ಮೊಟ್ಟೆ</div>
                        <div style={{ fontSize: "10.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>DFL Distribution by Source</div>
                      </th>
                      {TRAILING.map((c) => {
                        const t = TINT[c.tint];
                        return (
                          <th key={c.key} rowSpan={2} style={{
                            background: t.headBg, color: "#fff",
                            padding: "12px 10px", textAlign: c.align,
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: c.width, verticalAlign: "middle", whiteSpace: "nowrap",
                          }}>
                            <div style={{ fontSize: "12.5px" }}>{c.label}</div>
                            <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>{c.sub}</div>
                          </th>
                        );
                      })}
                    </tr>
                    {/* Row 2 — 5 sub-headers under the ರೋ.ರ.ಮೊಟ್ಟೆ group */}
                    <tr>
                      {RRM_GROUP.map((c) => (
                        <th key={c.key} style={{
                          background: TINT.rrm.headBg, color: "#fff",
                          padding: "9px 8px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                          minWidth: c.width, whiteSpace: "nowrap",
                        }}>
                          <div style={{ fontSize: "11.5px" }}>{c.label}</div>
                          <div style={{ fontSize: "9.5px", opacity: .85, marginTop: "1px" }}>{c.sub}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, idx) => {
                      const alt = idx % 2 === 1;
                      return (
                        <tr key={idx} className="gmwk-tr" style={{ background: alt ? "#f8fafc" : "#ffffff" }}>
                          {COLS.map((c) => {
                            const t = TINT[c.tint];
                            const v = row[c.key];
                            const has = v !== null && v !== undefined && String(v).trim() !== "";
                            const isSn = c.key === "sl_no";
                            const isDesc = c.key === "lot_parental_level";
                            return (
                              <td
                                key={c.key}
                                className={c.kind ? "gmwk-num" : undefined}
                                style={{
                                  padding: isDesc ? "11px 16px" : "11px 12px",
                                  textAlign: c.align,
                                  borderBottom: "1px solid #e2e8f0",
                                  borderRight: "1px solid #eef2f6",
                                  background: alt ? t.cellBg : "#ffffff",
                                  color: has ? t.text : "#cbd5e0",
                                  fontWeight: 700,
                                  fontSize: "13px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {isSn ? (
                                  <span style={{
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    minWidth: "28px", height: "28px", padding: "0 9px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg,#475569,#1e293b)",
                                    color: "#fff", fontWeight: 800, fontSize: "12px",
                                  }}>
                                    {String(v ?? "").padStart(2, "0")}
                                  </span>
                                ) : (has ? fmtCell(v, c.kind) : "—")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    {dataRows.length === 0 && (
                      <tr>
                        <td colSpan={COLS.length} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                    {dataRows.length > 0 && (
                      <tr style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)" }}>
                        {/* Label spans Sl.No + Parental + Date + 5 ರೋ.ರ.ಮೊಟ್ಟೆ sub-cols (8 cols) */}
                        <td colSpan={LEADING.length + RRM_GROUP.length} style={{
                          padding: "14px 16px", textAlign: "center",
                          borderTop: "2px solid #f59e0b",
                          color: "#78350f", fontWeight: 800, fontSize: "13.5px",
                          letterSpacing: ".02em",
                        }}>
                          ಒಟ್ಟು &nbsp;/&nbsp; Total
                        </td>
                        <td className="gmwk-num" style={{ padding: "14px 12px", textAlign: "center", borderTop: "2px solid #f59e0b", color: "#134e4a", fontWeight: 800, fontSize: "13.5px" }}>{fmtKg(totals.total)}</td>
                        <td className="gmwk-num" style={{ padding: "14px 12px", textAlign: "center", borderTop: "2px solid #f59e0b", color: "#14532d", fontWeight: 800, fontSize: "13.5px" }}>{fmtKg(totals.seed)}</td>
                        <td className="gmwk-num" style={{ padding: "14px 12px", textAlign: "center", borderTop: "2px solid #f59e0b", color: "#155e75", fontWeight: 800, fontSize: "13.5px" }}>{fmtKg(totals.reel)}</td>
                        <td className="gmwk-num" style={{ padding: "14px 12px", textAlign: "center", borderTop: "2px solid #f59e0b", color: "#92400e", fontWeight: 800, fontSize: "13.5px" }}>{fmtKg(totals.remain)}</td>
                        <td className="gmwk-num" style={{ padding: "14px 12px", textAlign: "center", borderTop: "2px solid #f59e0b", color: "#312e81", fontWeight: 800, fontSize: "13.5px" }}>{fmtAmt(totals.seedAmt)}</td>
                        <td className="gmwk-num" style={{ padding: "14px 12px", textAlign: "center", borderTop: "2px solid #f59e0b", color: "#312e81", fontWeight: 800, fontSize: "13.5px" }}>{fmtAmt(totals.reelAmt)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; Week {weekNum} (days {weekRange})
                  &nbsp;·&nbsp; {dataRows.length} group{dataRows.length === 1 ? "" : "s"}
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

export default GrainageMarketWeeklyReport;
