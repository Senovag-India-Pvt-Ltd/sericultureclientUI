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

if (!document.getElementById("fp2mp-styles")) {
  const s = document.createElement("style");
  s.id = "fp2mp-styles";
  s.innerHTML = `
    .fp2mp-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .fp2mp-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .fp2mp-swal .swal2-icon { margin:20px auto 4px !important; }
    .fp2mp-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .fp2mp-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes fp2mp-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .fp2mp-wrap { animation: fp2mp-in .35s ease; }
    .fp2mp-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .fp2mp-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
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

// Backend serial groups (1..9) + their Kannada section labels for badges/icons.
const SECTION_META = {
  "1": { icon: "🌳", color: "#0f766e", label: "Farm Area" },
  "2": { icon: "🌿", color: "#15803d", label: "Mulberry Area" },
  "3": { icon: "🧬", color: "#15803d", label: "Mulberry Variety" },
  "4": { icon: "💧", color: "#0369a1", label: "Irrigation Type" },
  "5": { icon: "🚰", color: "#0369a1", label: "Irrigation Source" },
  "6": { icon: "🥚", color: "#7c2d12", label: "Brushing (Chawki)" },
  "7": { icon: "🐛", color: "#5b21b6", label: "Cocoon Production" },
  "8": { icon: "📅", color: "#92400e", label: "Next Month Plan" },
  "9": { icon: "💰", color: "#9d174d", label: "Costs" },
};

function FarmP2MonthlyProgressReport() {
  const { t, i18n } = useTranslation();

  const [filter, setFilter] = useState({ farmId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [farmList,          setFarmList]          = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [dataRows,           setDataRows]           = useState([]);
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
    setDataRows([]);
    if (name === "financialYearMasterId") {
      const sel2 = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel2 ? extractYear(sel2.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.farmId)                return t("Please select a Farm.", { ns: "reports" });
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
      background: "#fff", customClass: { popup: "fp2mp-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close", { ns: "reports" }), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "fp2mp-swal" },
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
    setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-p2-monthly-progress", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the P2 Farm Monthly Progress report.", { ns: "reports" }));
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-p2-monthly-progress/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-p2-monthly-progress/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `farm_p2_monthly_progress_${filter.farmId}_${year}_${m}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" }));
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const farmDisplay = (i18n.language === "kn" ? (selectedFarm?.farmNameInKannada || selectedFarm?.farmName) : selectedFarm?.farmName) || "—";

  // KPIs derived from rows
  const findRow = (sl, kw) =>
    dataRows.find((r) => String(r.sl_no) === String(sl) && String(r.description || "").includes(kw));

  const mulberryArea     = numOrZero(findRow("2", "ಹಿಪ್ಪು")?.month_end);
  const brushAnnualTarget= numOrZero(findRow("6", "ವಾರ್ಷಿಕ ಗುರಿ")?.month_end);
  const brushMonthlyTgt  = numOrZero(findRow("6", "ತಿಂಗಳ ಗುರಿ")?.month);
  const brushAchM        = numOrZero(findRow("6", "ಸಾಧನೆ")?.month);
  const brushAchCum      = numOrZero(findRow("6", "ಸಾಧನೆ")?.month_end);
  const cocoonKgM        = numOrZero(findRow("7", "ಕೆ.ಜಿ")?.month);
  const cocoonKgCum      = numOrZero(findRow("7", "ಕೆ.ಜಿ")?.month_end);
  const nextMonthPlan    = numOrZero(findRow("8", "ಮುಂದಿನ")?.month);

  const brushAchPct = brushMonthlyTgt > 0 ? Math.round((brushAchM / brushMonthlyTgt) * 100) : 0;
  const annualAchPct = brushAnnualTarget > 0 ? Math.round((brushAchCum / brushAnnualTarget) * 100) : 0;

  // group rows by serial_number for merged-Sl rendering
  const grouped = useMemo(() => {
    const out = [];
    let curSn = null;
    let curBuf = [];
    dataRows.forEach((r) => {
      const sn = String(r.sl_no || "");
      if (sn !== curSn) {
        if (curBuf.length) out.push({ sn: curSn, rows: curBuf });
        curSn = sn;
        curBuf = [r];
      } else {
        curBuf.push(r);
      }
    });
    if (curBuf.length) out.push({ sn: curSn, rows: curBuf });
    return out;
  }, [dataRows]);

  return (
    <Layout title={t("P2 Farm Monthly Progress Report", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ಸ.ರೇ.ಕೃ. ಕ್ಷೇತ್ರ — ಮಾಹೆಯ ಪ್ರಗತಿ ವಿವರ (P2 Farm)")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#a7f3d0,#6ee7b7)",
                color: "#064e3b", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #34d399", verticalAlign: "middle",
              }}>P2 Farm · Sheet-1</span>
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
            gap: "12px", position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📋</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಕೃಷಿ ಕ್ಷೇತ್ರ — ಮಾಹೆಯ ಪ್ರಗತಿ ವಿವರ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>P2 Farm</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P2 Farm Monthly Progress Report — Sheet 1 (5-col flat description sheet)</div>
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
                  <label style={lbl}>{t("Farm")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="farmId" value={filter.farmId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Farm —", { ns: "reports" })}</option>
                    {farmList.map((f) => (
                      <option key={f.farmId} value={f.farmId}>{i18n.language === "kn" ? (f.farmNameInKannada || f.farmName) : f.farmName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lbl}>{t("Financial Year", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Year —", { ns: "reports" })}</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
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
                    <button type="button" disabled={isDownloadingPdf || !hasReport} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf || !hasReport)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📄 {t("PDF", { ns: "reports" })}</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel || !hasReport} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#22c55e)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel || !hasReport)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📊 {t("Excel", { ns: "reports" })}</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* ── Report ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="fp2mp-wrap mt-3">
            {/* Title strip */}
            <div style={{
              borderRadius: "14px",
              background: "linear-gradient(135deg,#ffffff 0%,#f0fdfa 100%)",
              border: "1.5px solid #99f6e4",
              padding: "13px 18px", display: "flex", alignItems: "center", gap: "12px",
              boxShadow: "0 4px 16px rgba(15,118,110,.10)", marginBottom: "14px",
            }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: "linear-gradient(135deg,#0f766e,#5b57ac)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#fff" }}>🌾</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#0f3a37", letterSpacing: ".01em" }}>
                  ಸ.ರೇ.ಕೃ. ಕ್ಷೇತ್ರ <span style={{ color: "#0f766e" }}>{farmDisplay}</span> · {monthKn} {monthYear || ""}
                </div>
                <div style={{ fontSize: "11.5px", color: "#5a6a7e", marginTop: "1px" }}>
                  Monthly Progress · {monthLabel} {monthYear || ""} · {dataRows.length} entries
                </div>
              </div>
            </div>

            {/* KPI tiles */}
            <Row className="g-2 mb-3">
              {[
                { label: t("Mulberry Area", { ns: "reports" }),       v: fmt(mulberryArea),           sub: "ಎಕರೆ / acre",       bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d", icon: "🌿" },
                { label: t("Brushing Tgt (Year)", { ns: "reports" }), v: fmt(brushAnnualTarget),      sub: "ಚಾಕಿ ವಾರ್ಷಿಕ",  bg: "linear-gradient(135deg,#fde68a,#fcd34d)", color: "#78350f", icon: "🎯" },
                { label: t("Brushing M / Cum", { ns: "reports" }),    v: `${fmt(brushAchM)} / ${fmt(brushAchCum)}`, sub: `${brushAchPct}% of M-tgt · ${annualAchPct}% of Yr`, bg: "linear-gradient(135deg,#bfdbfe,#93c5fd)", color: "#1e3a8a", icon: "🥚" },
                { label: t("Cocoon (kg) M / Cum", { ns: "reports" }), v: `${fmt(cocoonKgM)} / ${fmt(cocoonKgCum)}`, sub: "ಗೂಡು ಉತ್ಪಾದನೆ", bg: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", color: "#4c1d95", icon: "🐛" },
                { label: t("Next-Month Plan", { ns: "reports" }),     v: fmt(nextMonthPlan),          sub: "ಮುಂದಿನ ತಿಂಗಳ ಚಾಕಿ", bg: "linear-gradient(135deg,#fed7aa,#fdba74)", color: "#7c2d12", icon: "📅" },
              ].map((k, i) => (
                <Col key={i} sm={6} md={4} lg>
                  <div style={{
                    background: k.bg, borderRadius: "13px", padding: "12px 14px",
                    border: "1.5px solid rgba(255,255,255,.55)",
                    boxShadow: "0 4px 14px rgba(0,0,0,.07)",
                    display: "flex", alignItems: "center", gap: "11px", height: "100%",
                  }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: "rgba(255,255,255,.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "19px", flexShrink: 0 }}>{k.icon}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "10.5px", fontWeight: 700, color: k.color, opacity: .85, textTransform: "uppercase", letterSpacing: ".06em" }}>{k.label}</div>
                      <div className="fp2mp-num" style={{ fontSize: "17px", fontWeight: 800, color: k.color, lineHeight: 1.15, marginTop: "1px" }}>{k.v || "—"}</div>
                      <div style={{ fontSize: "10px", color: k.color, opacity: .75, marginTop: "1px" }}>{k.sub}</div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* Table */}
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 24px rgba(15,118,110,.10)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#0f766e,#14b8a6)", padding: "10px 16px", color: "#fff", display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, fontSize: "13px" }}>
                <span style={{ fontSize: "16px" }}>📊</span>
                {t("Monthly Progress Sheet", { ns: "reports" })}
                <span style={{ marginLeft: "auto", background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>
                  {dataRows.length} {t("rows", { ns: "reports" })}
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="fp2mp-num" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: "13px" }}>
                  <thead>
                    <tr>
                      {[
                        { t: "ಕ್ರ.ಸಂ. / Sl",            w: "8%",  bg: "#475569", c: "#fff" },
                        { t: "ವಿವರ / Description",    w: "44%", bg: "#0f766e", c: "#fff", align: "left" },
                        { t: "ತಿಂಗಳಲ್ಲಿ / Month",     w: "18%", bg: "#5b57ac", c: "#fff" },
                        { t: "ತಿಂಗಳ ಕೊನೆಗೆ / Month-end", w: "20%", bg: "#5b57ac", c: "#fff" },
                        { t: "ಷರಾ / Notes",            w: "10%", bg: "#475569", c: "#fff", align: "left" },
                      ].map((h, i) => (
                        <th key={i} style={{
                          background: h.bg, color: h.c, padding: "11px 10px",
                          fontSize: "11.5px", fontWeight: 700, letterSpacing: ".03em",
                          textAlign: h.align || "center", width: h.w,
                          borderBottom: "2px solid rgba(0,0,0,.15)", position: "sticky", top: 0,
                          whiteSpace: "pre-line",
                        }}>{h.t}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.length === 0 && (
                      <tr><td colSpan={5} style={{ padding: "26px", textAlign: "center", color: "#7a8aa0", fontSize: "13px" }}>ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / No records found</td></tr>
                    )}
                    {grouped.map((g, gi) => {
                      const meta = SECTION_META[g.sn] || { icon: "•", color: "#5a6a7e", label: "" };
                      const altGroup = gi % 2 === 1;
                      return g.rows.map((row, ri) => {
                        const isHeaderRow = !row.month && !row.month_end;
                        const baseBg = altGroup ? "#f6fbfa" : "#ffffff";
                        return (
                          <tr key={`${gi}-${ri}`} className="fp2mp-tr" style={{ background: isHeaderRow ? "linear-gradient(90deg,#f0fdfa,#fff)" : baseBg }}>
                            {ri === 0 && (
                              <td rowSpan={g.rows.length} style={{
                                padding: "8px 6px", textAlign: "center",
                                borderBottom: "1px solid #e2e8f0",
                                borderRight: "1px solid #e2e8f0",
                                verticalAlign: "middle",
                                background: `${meta.color}10`,
                              }}>
                                <div style={{
                                  width: "32px", height: "32px", borderRadius: "8px",
                                  background: `${meta.color}22`, color: meta.color,
                                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                                  fontWeight: 800, fontSize: "13px", margin: "0 auto",
                                }}>{g.sn}</div>
                                <div style={{ fontSize: "16px", marginTop: "4px" }}>{meta.icon}</div>
                              </td>
                            )}
                            <td style={{
                              padding: "9px 12px", textAlign: "left",
                              borderBottom: "1px solid #e2e8f0",
                              fontWeight: isHeaderRow ? 800 : 500,
                              color: isHeaderRow ? meta.color : "#1f2937",
                              fontSize: isHeaderRow ? "13.5px" : "13px",
                            }}>
                              {row.description || ""}
                            </td>
                            <td style={{
                              padding: "9px 10px", textAlign: "right",
                              borderBottom: "1px solid #e2e8f0",
                              borderLeft: "1px solid #f1f5f9",
                              fontWeight: 700, color: "#0f766e",
                              fontVariantNumeric: "tabular-nums",
                            }}>{fmt(row.month)}</td>
                            <td style={{
                              padding: "9px 10px", textAlign: "right",
                              borderBottom: "1px solid #e2e8f0",
                              borderLeft: "1px solid #f1f5f9",
                              fontWeight: 800, color: "#5b21b6",
                              fontVariantNumeric: "tabular-nums",
                              background: row.month_end ? "rgba(91,87,172,.05)" : "transparent",
                            }}>{fmt(row.month_end)}</td>
                            <td style={{
                              padding: "9px 10px", textAlign: "left",
                              borderBottom: "1px solid #e2e8f0",
                              borderLeft: "1px solid #f1f5f9",
                              color: "#5a6a7e", fontSize: "12px",
                            }}>{row.notes || ""}</td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Footer note */}
            <div style={{ marginTop: "10px", padding: "10px 14px", background: "linear-gradient(135deg,#f0fdfa,#fff)", borderRadius: "10px", border: "1.5px dashed #99f6e4", fontSize: "11.5px", color: "#0f3a37", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>💡</span>
              <span>
                <strong>ಸಾಧನೆ</strong> rows show <span style={{ color: "#0f766e", fontWeight: 700 }}>monthly</span> achievement vs the
                <span style={{ color: "#5b21b6", fontWeight: 700 }}> cumulative</span> from the financial-year start.
                Empty rows are section headers; values come from <em>maintenance_of_mulberry_garden</em>, <em>targets</em>, <em>receipt_of_dfls</em> & <em>supply_of_cocoons</em> (farm cocoon dispatch).
              </span>
            </div>
          </div>
        )}
      </Block>
    </Layout>
  );
}

export default FarmP2MonthlyProgressReport;
