import React, { useEffect, useMemo, useState } from "react";
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

if (!document.getElementById("gffc-styles")) {
  const s = document.createElement("style");
  s.id = "gffc-styles";
  s.innerHTML = `
    .gffc-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gffc-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gffc-swal .swal2-icon { margin:20px auto 4px !important; }
    .gffc-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gffc-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gffc-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .gffc-wrap { animation: gffc-in .35s ease; }
    .gffc-table th { letter-spacing:.02em; }
    .gffc-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gffc-scroll::-webkit-scrollbar { height:9px; }
    .gffc-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .gffc-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#14b8a6,#5b57ac); border-radius:6px; }
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
  const s = String(v ?? "").trim();
  if (!s) return "—";
  if (s === "-") return "—";
  if (!/^-?\d+(\.\d+)?$/.test(s)) return s;
  const n = parseFloat(s);
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const SECTION_TITLE_STYLE = {
  background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)",
  color: "#fff", padding: "14px 20px",
  fontWeight: 800, fontSize: "14.5px", letterSpacing: ".02em",
  textAlign: "center",
};

const TH_TEAL = {
  background: "linear-gradient(135deg,#0f766e,#14b8a6)",
  color: "#fff", padding: "10px 12px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
};
const TH_INDIGO = {
  background: "linear-gradient(135deg,#4338ca,#6366f1)",
  color: "#fff", padding: "10px 12px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
};
const TH_DARK = {
  background: "linear-gradient(135deg,#1e293b,#36506b)",
  color: "#fff", padding: "10px 12px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
};
const TH_SUB_TEAL = {
  background: "linear-gradient(180deg,#14b8a6,#0d9488)",
  color: "#fff", padding: "8px 10px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
};
const TH_SUB_INDIGO = {
  background: "linear-gradient(180deg,#6366f1,#4f46e5)",
  color: "#fff", padding: "8px 10px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
};

const valCell = (tone, isTotal) => ({
  padding: "11px 12px", textAlign: "center",
  borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
  background: tone === "teal"
    ? (isTotal ? "linear-gradient(135deg,#ccfbf1,#a7f3d0)" : "#f0fdfa")
    : (isTotal ? "linear-gradient(135deg,#e0e7ff,#c7d2fe)" : "#eef2ff"),
  color: tone === "teal" ? "#134e4a" : "#312e81",
  fontWeight: isTotal ? 800 : 700, fontSize: "13px",
});

function GrainageFarmFutureChawkiPlanReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ farmId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [farmList,          setFarmList]          = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  // sections returned by the backend
  const [upcoming,        setUpcoming]        = useState([]);
  const [targetVsActual,  setTargetVsActual]  = useState([]);
  const [p3CocoonsNext,   setP3CocoonsNext]   = useState([]);
  const [plotwise,        setPlotwise]        = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((p) => ({ ...p, [name]: value }));
    setHasReport(false);
    setUpcoming([]); setTargetVsActual([]); setP3CocoonsNext([]);
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
      background: "#fff", customClass: { popup: "gffc-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gffc-swal" },
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
    setHasReport(false);
    setUpcoming([]); setTargetVsActual([]); setP3CocoonsNext([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-future-chawki-plan", { params: params() });
      const data = res.data || {};
      setUpcoming(Array.isArray(data.upcoming) ? data.upcoming : []);
      setTargetVsActual(Array.isArray(data.targetVsActual) ? data.targetVsActual : []);
      setP3CocoonsNext(Array.isArray(data.p3CocoonsNext) ? data.p3CocoonsNext : []);
      setPlotwise(Array.isArray(data.plotwise) ? data.plotwise : []);
      setHasReport(true);
    } catch {
      showErr("Fetch Failed", "Failed to load the Future Chawki Plan report.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-future-chawki-plan/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-future-chawki-plan/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `farm_future_chawki_${filter.farmId}_${year}_${m}.xlsx`;
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
  const farmDisplay = selectedFarm?.farmName || "—";

  const tva   = targetVsActual[0] || {};
  const cocs  = p3CocoonsNext[0] || {};
  const progTotal = numOrZero(tva.prog_total);
  const achTotal  = numOrZero(tva.ach_total);
  const achPct    = progTotal > 0 ? Math.round((achTotal / progTotal) * 100) : null;
  const upcomingTotal = useMemo(() => upcoming.reduce((a, r) => a + numOrZero(r.w_total), 0), [upcoming]);
  const cocsTotal = numOrZero(cocs.w_total);

  const achTone =
    achPct === null  ? { bg: "linear-gradient(135deg,#e0e7ff,#eef2ff)", color: "#312e81" }
    : achPct >= 100  ? { bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d" }
    : achPct >= 75   ? { bg: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#92400e" }
                     : { bg: "linear-gradient(135deg,#fecaca,#fca5a5)", color: "#7f1d1d" };

  return (
    <Layout title={t("Farm Future Chawki Plan Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ಮುಂಬರುವ ಮಾಹೆಯ ಚಾಕಿ ಯೋಜನೆ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#fef3c7,#fde68a)",
                color: "#92400e", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #fcd34d", verticalAlign: "middle",
              }}>Farm · Future Chawki Plan</span>
            </Block.Title>
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
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ಮುಂಬರುವ ಮಾಹೆಯ ಚಾಕಿ ಯೋಜನೆ &amp; ಸಾಧನೆ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Farm</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Future Chawki Plan — Upcoming 3-month forecast · This-month Programme vs Achievement · Next-month P3 cocoon availability</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                {achPct !== null && (
                  <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                    {achPct}% achieved
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
          <div className="gffc-wrap mt-4">
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
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಕಾರ್ಯಕ್ರಮ (Target)</span>
                <span className="gffc-num" style={{ fontSize: "14px", color: "#134e4a", fontWeight: 800, marginTop: "2px" }}>{progTotal.toLocaleString()}</span>
              </div>
              <div style={{ background: achTone.bg, border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: achTone.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಸಾಧನೆ (Achievement)</span>
                <span className="gffc-num" style={{ fontSize: "14px", color: achTone.color, fontWeight: 800, marginTop: "2px" }}>
                  {achTotal.toLocaleString()}{achPct !== null ? ` · ${achPct}%` : ""}
                </span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಮುಂಬರುವ 3 ಮಾಹೆ (Forecast)</span>
                <span className="gffc-num" style={{ fontSize: "14px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{upcomingTotal.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಮುಂದಿನ ಮಾಹೆ ಪಿ3 ಗೂಡು</span>
                <span className="gffc-num" style={{ fontSize: "14px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{cocsTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* ── Section 1: Programme vs Achievement (current month) ──── */}
            <Card className="mb-4" style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={SECTION_TITLE_STYLE}>
                ಮೊಟ್ಟೆಗಳ ಚಾಕಿ ಕಾರ್ಯಕ್ರಮ ಹಾಗೂ ಸಾಧನೆ ವಿವರಗಳು — {monthKn} {monthYear || ""}
                <div style={{ fontSize: "11.5px", fontWeight: 600, opacity: .9, marginTop: "3px" }}>Programme vs Achievement (this month, weekly)</div>
              </div>
              <div className="gffc-scroll" style={{ overflowX: "auto" }}>
                <table className="gffc-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "900px" }}>
                  <thead>
                    <tr>
                      <th colSpan={5} style={TH_TEAL}>
                        <div style={{ fontSize: "13px" }}>ಕಾರ್ಯಕ್ರಮ</div>
                        <div style={{ fontSize: "10.5px", opacity: .85, marginTop: "1px" }}>Programme</div>
                      </th>
                      <th colSpan={5} style={TH_INDIGO}>
                        <div style={{ fontSize: "13px" }}>ಸಾಧನೆ</div>
                        <div style={{ fontSize: "10.5px", opacity: .85, marginTop: "1px" }}>Achievement</div>
                      </th>
                    </tr>
                    <tr>
                      {["I", "II", "III", "IV", "ಒಟ್ಟು"].map((s, i) => (
                        <th key={`p-${i}`} style={TH_SUB_TEAL}>
                          <div style={{ fontSize: "11.5px" }}>{s}</div>
                          <div style={{ fontSize: "9px", opacity: .85 }}>{i === 4 ? "Total" : `Wk ${i + 1}`}</div>
                        </th>
                      ))}
                      {["I", "II", "III", "IV", "ಒಟ್ಟು"].map((s, i) => (
                        <th key={`a-${i}`} style={TH_SUB_INDIGO}>
                          <div style={{ fontSize: "11.5px" }}>{s}</div>
                          <div style={{ fontSize: "9px", opacity: .85 }}>{i === 4 ? "Total" : `Wk ${i + 1}`}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {targetVsActual.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ padding: "30px", textAlign: "center", color: "#a0aec0", fontSize: "13.5px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        {["prog_w1", "prog_w2", "prog_w3", "prog_w4", "prog_total"].map((k, i) => (
                          <td key={k} className="gffc-num" style={valCell("teal", i === 4)}>{fmt(tva[k])}</td>
                        ))}
                        {["ach_w1", "ach_w2", "ach_w3", "ach_w4", "ach_total"].map((k, i) => (
                          <td key={k} className="gffc-num" style={valCell("indigo", i === 4)}>{fmt(tva[k])}</td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* ── Section 2: Upcoming 3-Month Hatching Plan ────────────── */}
            <Card className="mb-4" style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={SECTION_TITLE_STYLE}>
                ಮುಂಬರುವ ಮಾಹೆಯಲ್ಲಿ ಮೊಟ್ಟೆಗಳ ಚಾಕಿ ಕಾರ್ಯಕ್ರಮ
                <div style={{ fontSize: "11.5px", fontWeight: 600, opacity: .9, marginTop: "3px" }}>Upcoming 3-Month Hatching Programme — Forecast based on expected hatching dates</div>
              </div>
              <div className="gffc-scroll" style={{ overflowX: "auto" }}>
                <table className="gffc-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "900px" }}>
                  <thead>
                    <tr>
                      <th style={{ ...TH_DARK, minWidth: "180px" }}>
                        <div style={{ fontSize: "12.5px" }}>ಮಾಹೆ</div>
                        <div style={{ fontSize: "10px", opacity: .85, marginTop: "1px" }}>Month</div>
                      </th>
                      {[1, 2, 3, 4].map((n) => (
                        <th key={n} style={{ ...TH_TEAL, minWidth: "120px" }}>
                          <div style={{ fontSize: "12.5px" }}>{n}ನೇ ವಾರ</div>
                          <div style={{ fontSize: "10px", opacity: .85, marginTop: "1px" }}>Week {n}</div>
                        </th>
                      ))}
                      <th style={{ ...TH_INDIGO, minWidth: "140px" }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಒಟ್ಟು</div>
                        <div style={{ fontSize: "10.5px", opacity: .85, marginTop: "1px" }}>Total</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "30px", textAlign: "center", color: "#a0aec0", fontSize: "13.5px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No upcoming hatchings planned.
                        </td>
                      </tr>
                    ) : (
                      upcoming.map((row, ri) => {
                        const alt = ri % 2 === 1;
                        return (
                          <tr key={`up-${ri}`} style={{ background: alt ? "#f8fafc" : "#ffffff" }}>
                            <td style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                              color: "#0f172a", fontWeight: 800, fontSize: "13px",
                              background: "linear-gradient(135deg,#f1f5f9,#f8fafc)",
                            }}>
                              {row.month_label || "—"}
                            </td>
                            {["w1", "w2", "w3", "w4"].map((k) => (
                              <td key={k} className="gffc-num" style={valCell("teal", false)}>{fmt(row[k])}</td>
                            ))}
                            <td className="gffc-num" style={valCell("indigo", true)}>{fmt(row.w_total)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* ── Section 3: P3 Cocoons availability for next month ─────── */}
            <Card className="mb-4" style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={SECTION_TITLE_STYLE}>
                ಮುಂದಿನ ಮಾಹೆಯ ಪಿ3 ಗೂಡಿನ ಲಭ್ಯತೆ
                <div style={{ fontSize: "11.5px", fontWeight: 600, opacity: .9, marginTop: "3px" }}>Next-month P3 Cocoon availability — weekly buckets (date_of_seed_cocoon_supply)</div>
              </div>
              <div className="gffc-scroll" style={{ overflowX: "auto" }}>
                <table className="gffc-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "700px" }}>
                  <thead>
                    <tr>
                      {[1, 2, 3, 4].map((n) => (
                        <th key={n} style={{ ...TH_TEAL, minWidth: "140px" }}>
                          <div style={{ fontSize: "12.5px" }}>{n}ನೇ ವಾರ</div>
                          <div style={{ fontSize: "10px", opacity: .85, marginTop: "1px" }}>Week {n}</div>
                        </th>
                      ))}
                      <th style={{ ...TH_INDIGO, minWidth: "160px" }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಒಟ್ಟು</div>
                        <div style={{ fontSize: "10.5px", opacity: .85, marginTop: "1px" }}>Total</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {p3CocoonsNext.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "30px", textAlign: "center", color: "#a0aec0", fontSize: "13.5px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No P3 cocoon supply scheduled for next month.
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        {["w1", "w2", "w3", "w4"].map((k) => (
                          <td key={k} className="gffc-num" style={valCell("teal", false)}>{fmt(cocs[k])}</td>
                        ))}
                        <td className="gffc-num" style={valCell("indigo", true)}>{fmt(cocs.w_total)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* ── Section 4: Plot-wise leaf consumption & fertilizer ─────── */}
            <Card className="mb-4" style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={SECTION_TITLE_STYLE}>
                ತೋಟವಾರು ಸೊಪ್ಪಿನ ಬಳಕೆ ಹಾಗೂ ಗೊಬ್ಬರದ ವಿವರ
                <div style={{ fontSize: "11.5px", fontWeight: 600, opacity: .9, marginTop: "3px" }}>Plot-wise leaf consumption &amp; fertilizer applied (maintenance_of_mulberry_garden)</div>
              </div>
              <div className="gffc-scroll" style={{ overflowX: "auto" }}>
                <table className="gffc-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "820px" }}>
                  <thead>
                    <tr>
                      <th style={{ ...TH_TEAL, minWidth: "120px", textAlign: "left" }}>
                        <div style={{ fontSize: "12.5px" }}>ತೋಟ</div>
                        <div style={{ fontSize: "10px", opacity: .85, marginTop: "1px" }}>Plot</div>
                      </th>
                      <th style={{ ...TH_TEAL, minWidth: "120px" }}>
                        <div style={{ fontSize: "12.5px" }}>ಸೊಪ್ಪು (ಕಿ.ಗ್ರಾಂ)</div>
                        <div style={{ fontSize: "10px", opacity: .85, marginTop: "1px" }}>Leaf (Kg)</div>
                      </th>
                      <th style={{ ...TH_INDIGO, minWidth: "120px" }}>
                        <div style={{ fontSize: "12.5px" }}>ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ</div>
                        <div style={{ fontSize: "10px", opacity: .85, marginTop: "1px" }}>FYM</div>
                      </th>
                      <th style={{ ...TH_INDIGO, minWidth: "130px" }}>
                        <div style={{ fontSize: "12.5px" }}>ಅಮೋನಿಯಂ ಸಲ್ಫೇಟ್</div>
                        <div style={{ fontSize: "10px", opacity: .85, marginTop: "1px" }}>Ammonium Sulphate</div>
                      </th>
                      <th style={{ ...TH_INDIGO, minWidth: "130px" }}>
                        <div style={{ fontSize: "12.5px" }}>ಸಿ.ಸೂ.ಪಾಸ್ಫೇಟ್</div>
                        <div style={{ fontSize: "10px", opacity: .85, marginTop: "1px" }}>Super Phosphate</div>
                      </th>
                      <th style={{ ...TH_INDIGO, minWidth: "120px" }}>
                        <div style={{ fontSize: "12.5px" }}>ಮ್ಯೂ.ಪೊಟ್ಯಾಷ್</div>
                        <div style={{ fontSize: "10px", opacity: .85, marginTop: "1px" }}>Muriate of Potash</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {plotwise.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "30px", textAlign: "center", color: "#a0aec0", fontSize: "13.5px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No leaf/fertilizer activity recorded for this month.
                        </td>
                      </tr>
                    ) : (
                      plotwise.map((row, ri) => (
                        <tr key={`pw-${ri}`}>
                          <td style={{ padding: "10px 14px", fontWeight: 700, color: "#0f172a", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0" }}>
                            {row.plot_number || "—"}
                          </td>
                          <td className="gffc-num" style={valCell("teal", false)}>{fmt(row.leaf_kg)}</td>
                          <td className="gffc-num" style={valCell("indigo", false)}>{fmt(row.fym)}</td>
                          <td className="gffc-num" style={valCell("indigo", false)}>{fmt(row.ammonium_sulphate)}</td>
                          <td className="gffc-num" style={valCell("indigo", false)}>{fmt(row.super_phosphate)}</td>
                          <td className="gffc-num" style={valCell("indigo", false)}>{fmt(row.muriate_of_potash)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Action footer */}
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 14px rgba(13,78,72,.08)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {farmDisplay} — {monthLabel} {monthKn} {monthYear}
                  &nbsp;·&nbsp; ಮುಂಬರುವ ಚಾಕಿ ಯೋಜನೆ / Future Chawki Plan
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

export default GrainageFarmFutureChawkiPlanReport;
