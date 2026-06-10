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

// Week sub-columns shared across all three sections.
const WEEK_COLS = [
  { key: "w1", label: "1ನೇ ವಾರ", sub: "Week 1 (1-7)"   },
  { key: "w2", label: "2ನೇ ವಾರ", sub: "Week 2 (8-14)"  },
  { key: "w3", label: "3ನೇ ವಾರ", sub: "Week 3 (15-21)" },
  { key: "w4", label: "4ನೇ ವಾರ", sub: "Week 4 (22-end)"},
  { key: "total", label: "ಒಟ್ಟು", sub: "Total"          },
];

if (!document.getElementById("gp4w-styles")) {
  const s = document.createElement("style");
  s.id = "gp4w-styles";
  s.innerHTML = `
    .gp4w-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gp4w-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gp4w-swal .swal2-icon { margin:20px auto 4px !important; }
    .gp4w-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gp4w-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gp4w-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    @keyframes gp4w-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(91,87,172,.35);} 50% { box-shadow:0 0 0 8px rgba(91,87,172,0);} }
    .gp4w-wrap { animation: gp4w-in .35s ease; }
    .gp4w-pill { animation: gp4w-pulse 2.4s infinite; }
    .gp4w-table th { letter-spacing:.02em; }
    .gp4w-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gp4w-card { transition: transform .15s ease, box-shadow .15s ease; }
    .gp4w-card:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(67,56,202,.15); }
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

const numOrZero = (v) => {
  const n = parseFloat(String(v ?? "").replace(/[^\d.\-]/g, ""));
  return isNaN(n) ? 0 : n;
};
const fmt = (v) => {
  const n = numOrZero(v);
  return n.toLocaleString();
};

// Adds {monthDelta} months to (year, month) — handles year rollover.
const shiftMonth = (year, month, delta) => {
  const d = new Date(year, month - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
};

function GrainageP4WeeklyProgrammeReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ farmId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [farmList,          setFarmList]          = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [cocoonRow,    setCocoonRow]    = useState(null); // first row of cocoonWeekly
  const [hatchingRow,  setHatchingRow]  = useState(null); // first row of hatchingWeekly
  const [upcomingRows, setUpcomingRows] = useState([]);   // 0..3 rows of upcomingProgram

  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "farmMaster/get-all")
      .then((r) => setFarmList(r.data.content.farmMaster || []))
      .catch(() => setFarmList([]));

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
  }, []);

  const extractYear = (str) => {
    if (!str) return null;
    const yr = parseInt(String(str).trim().split("-")[0], 10);
    return isNaN(yr) ? null : yr;
  };

  const reset = () => {
    setHasReport(false);
    setCocoonRow(null);
    setHatchingRow(null);
    setUpcomingRows([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((p) => ({ ...p, [name]: value }));
    reset();
    if (name === "financialYearMasterId") {
      const sel2 = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel2 ? extractYear(sel2.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.farmId)                return "Please select a Farm.";
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
      background: "#fff", customClass: { popup: "gp4w-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gp4w-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { farmId: filter.farmId, year, month: m };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    reset();
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/p4-weekly-programme", { params: params() });
      const payload = res.data || {};
      const c = Array.isArray(payload.cocoonWeekly)    ? payload.cocoonWeekly    : [];
      const h = Array.isArray(payload.hatchingWeekly)  ? payload.hatchingWeekly  : [];
      const u = Array.isArray(payload.upcomingProgram) ? payload.upcomingProgram : [];
      setCocoonRow(c[0] || null);
      setHatchingRow(h[0] || null);
      setUpcomingRows(u);
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the P4 Weekly Programme report.");
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/p4-weekly-programme/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/p4-weekly-programme/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `p4_weekly_programme_${filter.farmId}_${year}_${m}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr("Excel Failed", "Could not generate the Excel report.");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const farmDisplay = selectedFarm?.farmName || "ಬಿಳಿದೇವಾಲಯ";

  // Previous-month label for cocoon production header
  const prevLabel = (() => {
    if (!monthNum || !monthYear) return "—";
    const { year, month } = shiftMonth(monthYear, monthNum, -1);
    return `${MONTH_KN[month]}-${year}`;
  })();
  const thisLabel = monthYear ? `${monthKn}-${monthYear}` : "—";

  // Section KPIs
  const cocPrevTot = numOrZero(cocoonRow?.prev_total);
  const cocThisTot = numOrZero(cocoonRow?.this_total);
  const progTot    = numOrZero(hatchingRow?.prog_total);
  const achTot     = numOrZero(hatchingRow?.ach_total);
  const achPct     = progTot > 0 ? Math.round((achTot / progTot) * 100) : null;

  // Generic rendering of a "Target/Achievement" or "Prev/This" 5-col data table.
  // sideA + sideB live in the SAME row from the API so we render them stacked
  // for clarity (each side gets its own header + data row).
  const SideTable = ({ title, color, data, prefix }) => {
    const grad = color === "teal"
      ? "linear-gradient(135deg,#0f766e,#14b8a6)"
      : color === "indigo"
      ? "linear-gradient(135deg,#4338ca,#6366f1)"
      : "linear-gradient(135deg,#5b57ac,#7d79c6)";
    const subGrad = color === "teal"
      ? "linear-gradient(180deg,#14b8a6,#0d9488)"
      : color === "indigo"
      ? "linear-gradient(180deg,#6366f1,#4f46e5)"
      : "linear-gradient(180deg,#7d79c6,#5b57ac)";
    const cellBg = color === "teal" ? "#f0fdfa" : color === "indigo" ? "#eef2ff" : "#f5f3ff";
    const totalBg = color === "teal"
      ? "linear-gradient(135deg,#ccfbf1,#a7f3d0)"
      : color === "indigo"
      ? "linear-gradient(135deg,#e0e7ff,#c7d2fe)"
      : "linear-gradient(135deg,#ddd6fe,#ede9fe)";
    const textColor = color === "teal" ? "#134e4a" : color === "indigo" ? "#312e81" : "#4c1d95";

    return (
      <div style={{ flex: 1, minWidth: "320px" }}>
        <div style={{
          background: grad, color: "#fff",
          padding: "10px 14px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px",
          fontWeight: 800, fontSize: "13px", textAlign: "center", letterSpacing: ".01em",
        }}>
          {title}
        </div>
        <div style={{ overflowX: "auto", border: "1.5px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 10px 10px" }}>
          <table className="gp4w-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "440px" }}>
            <thead>
              <tr>
                {WEEK_COLS.map((w) => (
                  <th key={w.key} style={{
                    background: subGrad, color: "#fff",
                    padding: "8px 10px", textAlign: "center",
                    border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                  }}>
                    <div style={{ fontSize: "12px" }}>{w.label}</div>
                    <div style={{ fontSize: "9.5px", opacity: .85, marginTop: "1px" }}>{w.sub}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {WEEK_COLS.map((w) => {
                  const key = `${prefix}_${w.key}`;
                  const v = data?.[key];
                  const has = v !== null && v !== undefined && String(v).trim() !== "";
                  const isTotal = w.key === "total";
                  return (
                    <td key={w.key} className="gp4w-num" style={{
                      padding: "14px 10px", textAlign: "center",
                      borderRight: "1px solid #eef2f6",
                      background: isTotal ? totalBg : cellBg,
                      color: has ? textColor : "#cbd5e0",
                      fontWeight: isTotal ? 800 : 700, fontSize: "13.5px",
                    }}>{has ? fmt(v) : "—"}</td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Layout title={t("P4 Weekly Programme — Cocoon, Hatching & Upcoming Plan")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("ಪಿ4 ಬಿಳಿದೇವಾಲಯ ವಾರವಾರು ಕಾರ್ಯಕ್ರಮ")}</Block.Title>
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
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📅</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>ಪಿ4 ಬಿಳಿದೇವಾಲಯ ವಾರವಾರು ಕಾರ್ಯಕ್ರಮ</div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P4 Weekly Programme — Cocoon Production · Hatching Programme · Upcoming Plan</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                {achPct !== null && (
                  <span className="gp4w-pill" style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                    {achPct}% Achievement
                  </span>
                )}
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>Farm <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="farmId" value={filter.farmId} onChange={handleChange} style={sel}>
                    <option value="">— Select Farm —</option>
                    {farmList.map((f) => (
                      <option key={f.farmId} value={f.farmId}>{f.farmName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lbl}>Financial Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">— Select Year —</option>
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

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="gp4w-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Farm</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{farmDisplay}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Period</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Cocoon Prev / This</span>
                <span className="gp4w-num" style={{ fontSize: "13.5px", color: "#134e4a", fontWeight: 800, marginTop: "2px" }}>
                  {cocPrevTot.toLocaleString()} → {cocThisTot.toLocaleString()}
                </span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0e7ff,#eef2ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಕಾರ್ಯಕ್ರಮ vs ಸಾಧನೆ</span>
                <span className="gp4w-num" style={{ fontSize: "13.5px", color: "#312e81", fontWeight: 800, marginTop: "2px" }}>
                  {progTot.toLocaleString()} → {achTot.toLocaleString()}{achPct !== null ? ` · ${achPct}%` : ""}
                </span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Upcoming Plan</span>
                <span style={{ fontSize: "13.5px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>
                  {upcomingRows.length} month{upcomingRows.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {/* ── Section 1: Cocoon Production ─────────────────────── */}
            <Card className="gp4w-card" style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden", marginBottom: "20px" }}>
              <div style={{
                background: "linear-gradient(135deg,#134e4a,#0f766e 60%,#2ea98d)",
                color: "#fff", padding: "14px 22px",
                fontWeight: 800, fontSize: "14.5px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ಗೂಡುಗಳ ಉತ್ಪಾದನೆ ಹಾಗೂ ಮುಂದಿನ ಮಾಹೆಯ ಲಭ್ಯತೆ ವಿವರಗಳು
                <div style={{ fontSize: "11.5px", fontWeight: 600, opacity: .9, marginTop: "3px" }}>
                  Cocoon Production (Previous Month) · Estimated Availability (This Month)
                </div>
              </div>
              <div style={{ padding: "16px", display: "flex", gap: "16px", flexWrap: "wrap", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
                <SideTable
                  title={`${prevLabel} — ಮಾಹೆಯಲ್ಲಿ ಉತ್ಪಾದಿಸಿದ ಗೂಡುಗಳು`}
                  color="teal"
                  data={cocoonRow}
                  prefix="prev"
                />
                <SideTable
                  title={`${thisLabel} — ಬಿತ್ತನೆ ಗೂಡುಗಳ ಅಂದಾಜು ಲಭ್ಯತೆ`}
                  color="indigo"
                  data={cocoonRow}
                  prefix="this"
                />
              </div>
            </Card>

            {/* ── Section 2: Hatching Programme vs Achievement ─────── */}
            <Card className="gp4w-card" style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(67,56,202,.10)", overflow: "hidden", marginBottom: "20px" }}>
              <div style={{
                background: "linear-gradient(135deg,#312e81,#4338ca 60%,#6366f1)",
                color: "#fff", padding: "14px 22px",
                fontWeight: 800, fontSize: "14.5px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ಮೊಟ್ಟೆಗಳ ಚಾಕಿ ಕಾರ್ಯಕ್ರಮ ಹಾಗೂ ಸಾಧನೆ ವಿವರಗಳು — {monthKn} {monthYear}
                <div style={{ fontSize: "11.5px", fontWeight: 600, opacity: .9, marginTop: "3px" }}>
                  Hatching Programme vs Achievement
                </div>
              </div>
              <div style={{ padding: "16px", display: "flex", gap: "16px", flexWrap: "wrap", background: "linear-gradient(180deg,#ffffff,#f8f8ff)" }}>
                <SideTable title="ಕಾರ್ಯಕ್ರಮ · Programme"     color="teal"   data={hatchingRow} prefix="prog" />
                <SideTable title="ಸಾಧನೆ · Achievement"        color="indigo" data={hatchingRow} prefix="ach"  />
              </div>
            </Card>

            {/* ── Section 3: Upcoming 3-month Plan ─────────────────── */}
            <Card className="gp4w-card" style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(124,58,237,.10)", overflow: "hidden", marginBottom: "20px" }}>
              <div style={{
                background: "linear-gradient(135deg,#4c1d95,#7c3aed 60%,#a855f7)",
                color: "#fff", padding: "14px 22px",
                fontWeight: 800, fontSize: "14.5px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ಮುಂಬರುವ ಮಾಹೆಯಲ್ಲಿ ಮೊಟ್ಟೆಗಳ ಚಾಕಿ ಕಾರ್ಯಕ್ರಮ
                <div style={{ fontSize: "11.5px", fontWeight: 600, opacity: .9, marginTop: "3px" }}>
                  Upcoming 3-Month Hatching Programme
                </div>
              </div>
              <div style={{ padding: "16px", display: "flex", gap: "16px", flexWrap: "wrap", background: "linear-gradient(180deg,#ffffff,#faf8ff)" }}>
                {(upcomingRows.length > 0 ? upcomingRows : [null, null, null]).slice(0, 3).map((row, i) => {
                  const rowMaxIfTotal = WEEK_COLS.filter((w) => w.key !== "total").reduce((m, w) => Math.max(m, numOrZero(row?.[w.key])), 0);
                  return (
                    <div key={i} style={{ flex: 1, minWidth: "300px" }}>
                      <div style={{
                        background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                        color: "#fff", padding: "10px 14px",
                        borderTopLeftRadius: "10px", borderTopRightRadius: "10px",
                        fontWeight: 800, fontSize: "13px", textAlign: "center",
                        letterSpacing: ".02em",
                      }}>
                        {row?.month_label || `Month ${i + 1}`}
                      </div>
                      <div style={{ overflowX: "auto", border: "1.5px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 10px 10px" }}>
                        <table className="gp4w-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "320px" }}>
                          <thead>
                            <tr>
                              {WEEK_COLS.map((w) => (
                                <th key={w.key} style={{
                                  background: "linear-gradient(180deg,#a855f7,#7c3aed)",
                                  color: "#fff", padding: "8px 8px", textAlign: "center",
                                  border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                                }}>
                                  <div style={{ fontSize: "11.5px" }}>{w.label}</div>
                                  <div style={{ fontSize: "9.5px", opacity: .85, marginTop: "1px" }}>{w.sub}</div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {WEEK_COLS.map((w) => {
                                const v = row?.[w.key];
                                const has = v !== null && v !== undefined && String(v).trim() !== "";
                                const isTotal = w.key === "total";
                                const n = numOrZero(v);
                                const pct = !isTotal && rowMaxIfTotal > 0 ? Math.min(100, (n / rowMaxIfTotal) * 100) : 0;
                                return (
                                  <td key={w.key} className="gp4w-num" style={{
                                    padding: "10px 8px", textAlign: "center",
                                    borderRight: "1px solid #eef2f6",
                                    background: isTotal ? "linear-gradient(135deg,#ddd6fe,#ede9fe)" : "#faf5ff",
                                    color: has ? "#4c1d95" : "#cbd5e0",
                                    fontWeight: isTotal ? 800 : 700, fontSize: "13px",
                                    verticalAlign: "middle",
                                  }}>
                                    <div>{has ? fmt(v) : "—"}</div>
                                    {!isTotal && has && rowMaxIfTotal > 0 && (
                                      <div style={{
                                        marginTop: "5px", height: "3px", borderRadius: "3px",
                                        background: "#e9d5ff", overflow: "hidden",
                                      }}>
                                        <div style={{
                                          height: "100%", width: `${pct}%`,
                                          background: "linear-gradient(135deg,#a855f7,#7c3aed)",
                                          borderRadius: "3px", transition: "width .3s",
                                        }} />
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#faf5ff,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #ddd6fe" }}>
                <span style={{ fontSize: "12px", color: "#5b21b6", fontWeight: 600 }}>
                  {farmDisplay} — {monthLabel} {monthKn} {monthYear}
                  &nbsp;·&nbsp; P4 Weekly Programme
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

export default GrainageP4WeeklyProgrammeReport;
