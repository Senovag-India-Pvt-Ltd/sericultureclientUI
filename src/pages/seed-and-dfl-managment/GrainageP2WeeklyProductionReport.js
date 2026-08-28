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

if (!document.getElementById("gp2wp-styles")) {
  const s = document.createElement("style");
  s.id = "gp2wp-styles";
  s.innerHTML = `
    .gp2wp-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gp2wp-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gp2wp-swal .swal2-icon { margin:20px auto 4px !important; }
    .gp2wp-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gp2wp-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gp2wp-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .gp2wp-wrap { animation: gp2wp-in .35s ease; }
    .gp2wp-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gp2wp-table th { letter-spacing:.02em; }
    .gp2wp-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gp2wp-scroll::-webkit-scrollbar { height:9px; }
    .gp2wp-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .gp2wp-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#14b8a6,#5b57ac); border-radius:6px; }
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
  if (!s) return "";
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

// Per-row visual hint based on sl_no — target / achievement / percent / disease-free / next target
const ROW_HINTS = {
  1: { tone: "target",  badge: "ಗುರಿ",        badgeBg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", badgeColor: "#1e3a8a" },
  2: { tone: "ach",      badge: "ಸಾಧನೆ",       badgeBg: "linear-gradient(135deg,#bbf7d0,#86efac)", badgeColor: "#14532d" },
  3: { tone: "percent",  badge: "%",            badgeBg: "linear-gradient(135deg,#fef3c7,#fde68a)", badgeColor: "#78350f", percent: true },
  4: { tone: "muted",    badge: "ಗಂಟು",         badgeBg: "linear-gradient(135deg,#fee2e2,#fecaca)", badgeColor: "#7f1d1d" },
  5: { tone: "diseaseFree", badge: "ರೋಗ ರಹಿತ", badgeBg: "linear-gradient(135deg,#ccfbf1,#99f6e4)", badgeColor: "#134e4a" },
  6: { tone: "nextTarget", badge: "ಮುಂದಿನ",     badgeBg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", badgeColor: "#4c1d95" },
};

function GrainageP2WeeklyProductionReport() {
  const { t, i18n } = useTranslation();

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
    api.get(baseURL + "grainageMaster/get-all")
      .then((r) => setGrainageList(r.data.content.grainageMaster || []))
      .catch(() => setGrainageList([]));

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
    setDataRows([]);
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
      background: "#fff", customClass: { popup: "gp2wp-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close", { ns: "reports" }), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gp2wp-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { grainageId: filter.grainageId, year, month: m };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/p2-weekly-production", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the P2 Weekly Production report.", { ns: "reports" }));
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/p2-weekly-production/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch {
      showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" }));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleExcel = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/p2-weekly-production/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `p2_weekly_production_${filter.grainageId}_${year}_${m}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" }));
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedGrainage = grainageList.find((g) => String(g.grainageMasterId) === String(filter.grainageId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const grainageDisplay = i18n.language === "kn"
    ? (selectedGrainage?.grainageMasterNameInKannada || selectedGrainage?.grainageMasterName || "—")
    : (selectedGrainage?.grainageMasterName || "—");

  // KPIs from the rows
  const kpis = useMemo(() => {
    const find = (sn) => dataRows.find((r) => String(r.sl_no) === String(sn)) || {};
    return {
      target:      numOrZero(find(1).total),
      achievement: numOrZero(find(2).total),
      percent:     numOrZero(find(3).total),
      diseaseFree: numOrZero(find(5).total),
      nextTarget:  numOrZero(find(6).total),
    };
  }, [dataRows]);

  return (
    <Layout title={t("P2 Weekly Production Report", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ಪಿ2 ವಾರಗಳವಾರು ಉತ್ಪಾದಿಸಲಾದ ಮೊಟ್ಟೆಗಳ ವಿವರ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#fef3c7,#fde68a)",
                color: "#92400e", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #fcd34d", verticalAlign: "middle",
              }}>P2 · Weekly Production</span>
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
                ಪಿ2 ಬಿತ್ತನೆಕೋಠಿ — ವಾರಗಳವಾರು ಉತ್ಪಾದಿಸಲಾದ ಮೊಟ್ಟೆಗಳು
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>P2</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P2 Weekly Production — Target / Achievement / % / Disease-free / Next month target</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>{t("Grainage", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="grainageId" value={filter.grainageId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Grainage —", { ns: "reports" })}</option>
                    {grainageList.map((g) => (
                      <option key={g.grainageMasterId} value={g.grainageMasterId}>{i18n.language === "kn" ? (g.grainageMasterNameInKannada || g.grainageMasterName) : g.grainageMasterName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lbl}>{t("Financial Year")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Year —", { ns: "reports" })}</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">{t("— Month —", { ns: "reports" })}</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>
                    ))}
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

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="gp2wp-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Grainage", { ns: "reports" })}</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{grainageDisplay}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Period", { ns: "reports" })}</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಮಾಸಿಕ ಗುರಿ</span>
                <span className="gp2wp-num" style={{ fontSize: "14px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{kpis.target.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಸಾಧನೆ</span>
                <span className="gp2wp-num" style={{ fontSize: "14px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{kpis.achievement.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಶೇ. ಸಾಧನೆ</span>
                <span className="gp2wp-num" style={{ fontSize: "14px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{kpis.percent > 0 ? `${fmt(kpis.percent)}%` : "—"}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಮುಂದಿನ ಗುರಿ</span>
                <span className="gp2wp-num" style={{ fontSize: "14px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{kpis.nextTarget.toLocaleString()}</span>
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
                ಪಿ2 ಬಿತ್ತನೆಕೋಠಿ {grainageDisplay} {monthKn}-{monthYear || ""} ವಾರಗಳವಾರು ಉತ್ಪಾದಿಸಲಾದ ಮೊಟ್ಟೆಗಳ ವಿವರ
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  P2 Weekly DFL Production · {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="gp2wp-scroll" style={{ overflowX: "auto" }}>
                <table className="gp2wp-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "1000px" }}>
                  <thead>
                    <tr>
                      <th style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "12px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "70px",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.No</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(135deg,#334155,#475569)",
                        color: "#fff", padding: "12px 16px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "320px",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರ</div>
                        <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Description</div>
                      </th>
                      {[1, 2, 3, 4].map((n) => (
                        <th key={n} style={{
                          background: "linear-gradient(135deg,#0f766e,#14b8a6)",
                          color: "#fff", padding: "12px 10px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                          minWidth: "110px",
                        }}>
                          <div style={{ fontSize: "12.5px" }}>{n}ನೇ ವಾರ</div>
                          <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Week {n}</div>
                        </th>
                      ))}
                      <th style={{
                        background: "linear-gradient(135deg,#4338ca,#6366f1)",
                        color: "#fff", padding: "12px 14px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "130px",
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಒಟ್ಟು</div>
                        <div style={{ fontSize: "10.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Total</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                    {dataRows.map((row, ri) => {
                      const sn = Number(row.sl_no);
                      const hint = ROW_HINTS[sn] || { tone: "plain", badge: "", badgeBg: "transparent", badgeColor: "#64748b" };
                      const alt = ri % 2 === 1;
                      const isPercent = !!hint.percent;

                      // Per-tone color palette for value cells
                      const palette = {
                        target: { bg: "#eff6ff", color: "#1e3a8a", totalBg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", totalColor: "#1e3a8a" },
                        ach:     { bg: "#f0fdf4", color: "#14532d", totalBg: "linear-gradient(135deg,#bbf7d0,#86efac)", totalColor: "#14532d" },
                        percent: { bg: "#fef9ec", color: "#78350f", totalBg: "linear-gradient(135deg,#fef3c7,#fde68a)", totalColor: "#78350f" },
                        muted:   { bg: "#fafafa", color: "#94a3b8", totalBg: "#f1f5f9",                                  totalColor: "#64748b" },
                        diseaseFree: { bg: "#f0fdfa", color: "#134e4a", totalBg: "linear-gradient(135deg,#ccfbf1,#99f6e4)", totalColor: "#134e4a" },
                        nextTarget: { bg: "#f5f3ff", color: "#4c1d95", totalBg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", totalColor: "#4c1d95" },
                        plain:   { bg: "#ffffff", color: "#0f172a", totalBg: "linear-gradient(135deg,#e0e7ff,#c7d2fe)", totalColor: "#312e81" },
                      };
                      const pal = palette[hint.tone] || palette.plain;

                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="gp2wp-tr" style={{ background: alt ? "#f8fafc" : "#ffffff" }}>
                          <td style={{
                            padding: "12px 8px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "30px", height: "30px",
                              borderRadius: "50%", background: "linear-gradient(135deg,#475569,#1e293b)",
                              color: "#fff", fontWeight: 800, fontSize: "12px",
                            }}>{row.sl_no}</span>
                          </td>
                          <td style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            color: "#0f172a", fontWeight: 700, fontSize: "13px",
                          }}>
                            {hint.badge && (
                              <span style={{
                                display: "inline-block", marginRight: "10px",
                                padding: "3px 10px", borderRadius: "20px",
                                background: hint.badgeBg, color: hint.badgeColor,
                                fontSize: "11px", fontWeight: 800,
                              }}>{hint.badge}</span>
                            )}
                            {row.description || "—"}
                          </td>
                          {["w1", "w2", "w3", "w4"].map((k) => {
                            const v = row[k];
                            // Row 3 (% achievement) is a real percentage: 0% is meaningful
                            // (under-achievement that week), not "no data" — don't hide it
                            // like a literal-zero count would be on the other rows.
                            const has = String(v ?? "").trim() !== "" && (isPercent || numOrZero(v) !== 0);
                            return (
                              <td key={k} className="gp2wp-num" style={{
                                padding: "12px 12px", textAlign: "center",
                                borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                                background: has ? pal.bg : (alt ? "#f8fafc" : "#ffffff"),
                                color: has ? pal.color : "#cbd5e0",
                                fontWeight: 700, fontSize: "13px",
                              }}>{has ? `${fmt(v)}${isPercent ? "%" : ""}` : "—"}</td>
                            );
                          })}
                          <td className="gp2wp-num" style={{
                            padding: "12px 12px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0",
                            background: pal.totalBg,
                            color: pal.totalColor,
                            fontWeight: 800, fontSize: "13.5px",
                          }}>{String(row.total ?? "").trim() === "" ? "—" : `${fmt(row.total)}${isPercent ? "%" : ""}`}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {grainageDisplay} — {monthLabel} {monthKn} {monthYear}
                  &nbsp;·&nbsp; ಪಿ2 / P2 Weekly Production
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

export default GrainageP2WeeklyProductionReport;
