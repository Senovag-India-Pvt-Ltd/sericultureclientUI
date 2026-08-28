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

if (!document.getElementById("gf27b-styles")) {
  const s = document.createElement("style");
  s.id = "gf27b-styles";
  s.innerHTML = `
    .gf27b-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gf27b-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gf27b-swal .swal2-icon { margin:20px auto 4px !important; }
    .gf27b-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gf27b-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gf27b-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .gf27b-wrap { animation: gf27b-in .35s ease; }
    .gf27b-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gf27b-table th { letter-spacing:.02em; }
    .gf27b-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gf27b-scroll::-webkit-scrollbar { height:9px; }
    .gf27b-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .gf27b-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#14b8a6,#5b57ac); border-radius:6px; }
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

// 7 metric groups defined in the backend SQL — keys m1..m7, each with _m / _c suffixes
const METRICS = [
  { key: "m1", kn: "ಚಾಕಿಯಾದ ಮೊಟ್ಟೆಗಳು",      en: "Hatched DFLs"    },
  { key: "m2", kn: "ಯಶಸ್ವಿ ಬೆಳೆ ಪಡೆದ",         en: "Successful Crop" },
  { key: "m3", kn: "ವಿಫಲವಾದ",                    en: "Failed"          },
  { key: "m4", kn: "ಒಟ್ಟು",                       en: "Total"           },
  { key: "m5", kn: "ಗೂಡಿನ ಪ್ರಮಾಣ",            en: "Cocoon Qty"      },
  { key: "m6", kn: "ಸರಾಸರಿ ಇಳುವರಿ %",         en: "Avg Yield %"     },
  { key: "m7", kn: "ಇಆರ್‌ಆರ್",                  en: "ERR"             },
];

function GrainageFarmForm27BReport() {
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
      background: "#fff", customClass: { popup: "gf27b-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gf27b-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-form27b", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the Farm Form-27 B report.", { ns: "reports" }));
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-form27b/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-form27b/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `farm_form27b_${filter.farmId}_${year}_${m}.xlsx`;
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

  // KPIs from the CY ಸಾಧನೆ row (sl 2): hatched, cocoons, ERR, yield-%
  const cyAch = useMemo(
    () => dataRows.find((r) => String(r.serial_number) === "2") || {},
    [dataRows],
  );
  const kpiHatched = numOrZero(cyAch.m1_m);
  const kpiCocoons = numOrZero(cyAch.m5_m);
  const kpiYield   = numOrZero(cyAch.m6_m);
  const kpiErr     = numOrZero(cyAch.m7_m);

  return (
    <Layout title={t("Farm Form-27 B Report", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ನಮೂನೆ-27 ಬಿ — ಚಾಕಿಯಾದ ಮೊಟ್ಟೆಗಳ ಪಾಲನೆ ವರದಿ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#fef3c7,#fde68a)",
                color: "#92400e", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #fcd34d", verticalAlign: "middle",
              }}>{t("Farm · Form-27 B", { ns: "reports" })}</span>
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
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📑</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ನಮೂನೆ-27 ಬಿ — ಚಾಕಿಯಾದ ಮೊಟ್ಟೆಗಳ ಪಾಲನೆ ವರದಿ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>{t("Farm")}</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Form-27 B Hatched DFL Maintenance — Target / Achievement, Current Year vs Previous Year</div>
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
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> {t("Loading…", { ns: "reports" })}</> : <>📋 {t("View")}</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📄 {t("PDF")}</>}
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
          <div className="gf27b-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Farm")}</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{farmDisplay}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Period", { ns: "reports" })}</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಚಾಕಿ ಮೊಟ್ಟೆಗಳು</span>
                <span className="gf27b-num" style={{ fontSize: "14px", color: "#134e4a", fontWeight: 800, marginTop: "2px" }}>{kpiHatched.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0e7ff,#eef2ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಗೂಡಿನ ಪ್ರಮಾಣ</span>
                <span className="gf27b-num" style={{ fontSize: "14px", color: "#312e81", fontWeight: 800, marginTop: "2px" }}>{kpiCocoons.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಸರಾಸರಿ ಇಳುವರಿ</span>
                <span className="gf27b-num" style={{ fontSize: "14px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{kpiYield > 0 ? `${fmt(kpiYield)}%` : "—"}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಇಆರ್‌ಆರ್ (ERR)</span>
                <span className="gf27b-num" style={{ fontSize: "14px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{kpiErr > 0 ? fmt(kpiErr) : "—"}</span>
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
                ನಮೂನೆ-27 ಬಿ &nbsp;·&nbsp; Form-27 B — Hatched DFL Maintenance
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  {farmDisplay} &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                </div>
              </div>

              <div className="gf27b-scroll" style={{ overflowX: "auto" }}>
                <table className="gf27b-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1500px" }}>
                  <thead>
                    {/* Row 1 — Year-Label / Row-Label spans 2 rows; metric groups span 2 cols each */}
                    <tr>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "55px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "10px 12px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "120px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12px" }}>ಆರ್ಥಿಕ ವರ್ಷ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>FY</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#334155,#475569)",
                        color: "#fff", padding: "10px 12px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "100px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12px" }}>ವಿಭಾಗ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Type</div>
                      </th>
                      {METRICS.map((m, i) => (
                        <th key={m.key} colSpan={2} style={{
                          background: i % 2 === 0
                            ? "linear-gradient(135deg,#0f766e,#14b8a6)"
                            : "linear-gradient(135deg,#4338ca,#6366f1)",
                          color: "#fff", padding: "10px 8px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                          minWidth: "180px",
                        }}>
                          <div style={{ fontSize: "12.5px", fontWeight: 800 }}>{m.kn}</div>
                          <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>{m.en}</div>
                        </th>
                      ))}
                    </tr>
                    {/* Row 2 — Month / Cumulative under each metric group */}
                    <tr>
                      {METRICS.map((m, i) => {
                        const tone = i % 2 === 0
                          ? "linear-gradient(180deg,#14b8a6,#0d9488)"
                          : "linear-gradient(180deg,#6366f1,#4f46e5)";
                        return [
                          <th key={`${m.key}_m`} style={{
                            background: tone,
                            color: "#fff", padding: "8px 8px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                            minWidth: "85px",
                          }}>
                            <div style={{ fontSize: "11px" }}>ಮಾಸ</div>
                            <div style={{ fontSize: "9px", opacity: .85, marginTop: "1px" }}>Month</div>
                          </th>,
                          <th key={`${m.key}_c`} style={{
                            background: tone,
                            color: "#fff", padding: "8px 8px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                            minWidth: "95px",
                          }}>
                            <div style={{ fontSize: "11px" }}>ಮಾಸಾಂತ್ಯ</div>
                            <div style={{ fontSize: "9px", opacity: .85, marginTop: "1px" }}>Cumul.</div>
                          </th>,
                        ];
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr>
                        <td colSpan={17} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                    {dataRows.map((row, ri) => {
                      const alt = ri % 2 === 1;
                      const isTarget = String(row.row_label || "").includes("ಗುರಿ");
                      const labelTone = isTarget
                        ? { bg: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#78350f" }
                        : { bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d" };
                      return (
                        <tr key={ri} className="gf27b-tr" style={{ background: alt ? "#f8fafc" : "#ffffff" }}>
                          <td style={{
                            padding: "11px 8px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            background: alt ? "#f1f5f9" : "#f8fafc",
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "28px", height: "28px",
                              borderRadius: "50%", background: "linear-gradient(135deg,#475569,#1e293b)",
                              color: "#fff", fontWeight: 800, fontSize: "12px",
                            }}>{row.serial_number}</span>
                          </td>
                          <td style={{
                            padding: "11px 12px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            color: "#334155", fontSize: "12.5px", fontWeight: 700,
                          }}>
                            {row.year_label || "—"}
                          </td>
                          <td style={{
                            padding: "11px 10px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                          }}>
                            <span style={{
                              display: "inline-block", padding: "3px 12px", borderRadius: "20px",
                              background: labelTone.bg, color: labelTone.color,
                              fontWeight: 700, fontSize: "11.5px",
                            }}>
                              {row.row_label || "—"}
                            </span>
                          </td>
                          {METRICS.map((m, gi) => {
                            const mKey = `${m.key}_m`;
                            const cKey = `${m.key}_c`;
                            const mv = row[mKey];
                            const cv = row[cKey];
                            const mh = String(mv ?? "").trim() !== "" && numOrZero(mv) !== 0;
                            const ch = String(cv ?? "").trim() !== "" && numOrZero(cv) !== 0;
                            const tone = gi % 2 === 0
                              ? { bgM: "#f0fdfa", bgC: "linear-gradient(135deg,#ccfbf1,#a7f3d0)", color: "#134e4a" }
                              : { bgM: "#eef2ff", bgC: "linear-gradient(135deg,#e0e7ff,#c7d2fe)", color: "#312e81" };
                            return [
                              <td key={mKey} className="gf27b-num" style={{
                                padding: "11px 8px", textAlign: "center",
                                borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                                background: mh ? tone.bgM : (alt ? "#f8fafc" : "#ffffff"),
                                color: mh ? tone.color : "#cbd5e0",
                                fontWeight: 700, fontSize: "12.5px",
                              }}>{mh ? fmt(mv) : "—"}</td>,
                              <td key={cKey} className="gf27b-num" style={{
                                padding: "11px 8px", textAlign: "center",
                                borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                                background: ch ? tone.bgC : (alt ? "#f8fafc" : "#ffffff"),
                                color: ch ? tone.color : "#cbd5e0",
                                fontWeight: 800, fontSize: "12.5px",
                              }}>{ch ? fmt(cv) : "—"}</td>,
                            ];
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {farmDisplay} — {monthLabel} {monthKn} {monthYear}
                  &nbsp;·&nbsp; ನಮೂನೆ-27 ಬಿ / Form-27 B
                </span>
                <div className="d-flex gap-2 flex-wrap">
                  <button type="button" onClick={handlePdf} disabled={isDownloadingPdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 2px 8px rgba(185,28,28,.25)", isDownloadingPdf)}>
                    {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} /> {t("Generating…", { ns: "reports" })}</> : <>📄 {t("Download PDF")}</>}
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

export default GrainageFarmForm27BReport;
