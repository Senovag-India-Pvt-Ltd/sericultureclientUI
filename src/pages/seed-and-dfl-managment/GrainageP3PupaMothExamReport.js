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

if (!document.getElementById("gp3pm-styles")) {
  const s = document.createElement("style");
  s.id = "gp3pm-styles";
  s.innerHTML = `
    .gp3pm-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gp3pm-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gp3pm-swal .swal2-icon { margin:20px auto 4px !important; }
    .gp3pm-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gp3pm-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gp3pm-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .gp3pm-wrap { animation: gp3pm-in .35s ease; }
    .gp3pm-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gp3pm-table th { letter-spacing:.02em; }
    .gp3pm-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gp3pm-scroll::-webkit-scrollbar { height:9px; }
    .gp3pm-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .gp3pm-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#14b8a6,#5b57ac); border-radius:6px; }
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

// Sub-group → leaf metric column key suffixes (must match backend keys)
const SUB_GROUPS = [
  { prefix: "m_in",   topGroup: "m"   }, // Month / In-week
  { prefix: "m_end",  topGroup: "m"   }, // Month / Week-end cumulative
  { prefix: "my_in",  topGroup: "my"  }, // Month-end / In-week
  { prefix: "my_end", topGroup: "my"  }, // Month-end / Week-end cumulative
];
const METRIC_SUFFIXES = ["lots", "beds", "disease", "avg"];

function GrainageP3PupaMothExamReport() {
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
      background: "#fff", customClass: { popup: "gp3pm-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gp3pm-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/p3-pupa-moth-exam", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the P3 Pupa & Moth Examination report.", { ns: "reports" }));
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/p3-pupa-moth-exam/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/p3-pupa-moth-exam/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `p3_pupa_moth_exam_${filter.grainageId}_${year}_${m}.xlsx`;
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
  const grainageDisplay = selectedGrainage?.grainageMasterName || "ಬಿಳಿದೇವಾಲಯ";

  // Totals across the 4 weekly rows for the in-month tested-lots / diseased-beds columns
  const totals = useMemo(() => {
    const t = { lots: 0, disease: 0 };
    dataRows.forEach((r) => {
      t.lots    += numOrZero(r.m_in_lots);
      t.disease += numOrZero(r.m_in_disease);
    });
    return t;
  }, [dataRows]);

  return (
    <Layout title={t("P3 Pupa & Moth Examination Report", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ಪಿ3 ಬಿತ್ತನೆಕೋಠಿಯಲ್ಲಿ ಕೋಶ ಮತ್ತು ಚಿಟ್ಟೆ ಪರೀಕ್ಷಾ ವಿವರಗಳು")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#fef3c7,#fde68a)",
                color: "#92400e", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #fcd34d", verticalAlign: "middle",
              }}>P3 · Pupa &amp; Moth Exam</span>
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
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🔬</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ಪಿ3 ಬಿತ್ತನೆಕೋಠಿಯಲ್ಲಿ ಕೋಶ ಮತ್ತು ಚಿಟ್ಟೆ ಪರೀಕ್ಷಾ ವಿವರಗಳು
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>P3</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P3 Pupa &amp; Moth Examination — Weekly results from testing_of_moth_pupa</div>
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
                  <label style={lbl}>{t("Grainage")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="grainageId" value={filter.grainageId} onChange={handleChange} style={sel}>
                    <option value="">— {t("Select Grainage", { ns: "reports" })} —</option>
                    {grainageList.map((g) => (
                      <option key={g.grainageMasterId} value={g.grainageMasterId}>{g.grainageMasterName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lbl}>{t("Financial Year")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">— {t("Select Year", { ns: "reports" })} —</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">— {t("Month")} —</option>
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
          <div className="gp3pm-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Grainage</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{grainageDisplay}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Period</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ತಂಡಗಳು (Lots tested)</span>
                <span className="gp3pm-num" style={{ fontSize: "14px", color: "#134e4a", fontWeight: 800, marginTop: "2px" }}>{totals.lots.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fecaca,#fca5a5)", border: "1.5px solid #f87171", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#991b1b", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಗಂಟುರೋಗದ ಹಾಸಿಗೆಗಳು (Diseased)</span>
                <span className="gp3pm-num" style={{ fontSize: "14px", color: "#7f1d1d", fontWeight: 800, marginTop: "2px" }}>{totals.disease.toLocaleString()}</span>
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
                ಕೋಶ ಮತ್ತು ಚಿಟ್ಟೆ ಪರೀಕ್ಷಾ ವಿವರಗಳು &nbsp;·&nbsp; Pupa &amp; Moth Examination
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  {grainageDisplay} &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                </div>
              </div>

              <div className="gp3pm-scroll" style={{ overflowX: "auto" }}>
                <table className="gp3pm-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1400px" }}>
                  <thead>
                    {/* Row 1 — top groups (ಮಾಸ | ಮಾಸಾಂತ್ಯ); Sl.No spans 3 rows */}
                    <tr>
                      <th rowSpan={3} style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "12px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "60px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.No</div>
                      </th>
                      <th colSpan={8} style={{
                        background: "linear-gradient(135deg,#0f766e,#14b8a6)",
                        color: "#fff", padding: "10px 12px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಮಾಸ</div>
                        <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Month</div>
                      </th>
                      <th colSpan={8} style={{
                        background: "linear-gradient(135deg,#4338ca,#6366f1)",
                        color: "#fff", padding: "10px 12px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಮಾಸಾಂತ್ಯ</div>
                        <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Month-end Cumulative</div>
                      </th>
                    </tr>
                    {/* Row 2 — mid groups (ವಾರದಲ್ಲಿ | ವಾರಾಂತ್ಯ) for each top group */}
                    <tr>
                      <th colSpan={4} style={{
                        background: "linear-gradient(180deg,#14b8a6,#0d9488)",
                        color: "#fff", padding: "8px 10px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                      }}>
                        <div style={{ fontSize: "12px" }}>ವಾರದಲ್ಲಿ</div>
                        <div style={{ fontSize: "9.5px", opacity: .85, marginTop: "1px" }}>In Week</div>
                      </th>
                      <th colSpan={4} style={{
                        background: "linear-gradient(180deg,#14b8a6,#0d9488)",
                        color: "#fff", padding: "8px 10px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                      }}>
                        <div style={{ fontSize: "12px" }}>ವಾರಾಂತ್ಯ</div>
                        <div style={{ fontSize: "9.5px", opacity: .85, marginTop: "1px" }}>Week-end</div>
                      </th>
                      <th colSpan={4} style={{
                        background: "linear-gradient(180deg,#6366f1,#4f46e5)",
                        color: "#fff", padding: "8px 10px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                      }}>
                        <div style={{ fontSize: "12px" }}>ವಾರದಲ್ಲಿ</div>
                        <div style={{ fontSize: "9.5px", opacity: .85, marginTop: "1px" }}>In Week</div>
                      </th>
                      <th colSpan={4} style={{
                        background: "linear-gradient(180deg,#6366f1,#4f46e5)",
                        color: "#fff", padding: "8px 10px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                      }}>
                        <div style={{ fontSize: "12px" }}>ವಾರಾಂತ್ಯ</div>
                        <div style={{ fontSize: "9.5px", opacity: .85, marginTop: "1px" }}>Week-end</div>
                      </th>
                    </tr>
                    {/* Row 3 — leaf metric headers (4 metrics × 4 sub-groups = 16) */}
                    <tr>
                      {SUB_GROUPS.map((sg, sgi) => {
                        const tone = sg.topGroup === "m"
                          ? "linear-gradient(135deg,#4db8a8,#3aa890)"
                          : "linear-gradient(135deg,#7d79c6,#6864b8)";
                        return ["ತಂಡಗಳು", "ಹಾಸಿಗೆಗಳು", "ಗಂಟುರೋಗದ", "ಸರಾಸರಿ"].map((leaf, mi) => (
                          <th key={`${sgi}-${mi}`} style={{
                            background: tone,
                            color: "#fff", padding: "10px 6px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                            minWidth: "80px",
                          }}>
                            <div style={{ fontSize: "11px" }}>{leaf}</div>
                            <div style={{ fontSize: "9px", opacity: .85, marginTop: "1px" }}>
                              {["Lots", "Beds", "Diseased", "Avg"][mi]}
                            </div>
                          </th>
                        ));
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
                      return (
                        <tr key={ri} className="gp3pm-tr" style={{ background: alt ? "#f8fafc" : "#ffffff" }}>
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
                            }}>{row.sl_no}</span>
                          </td>
                          {SUB_GROUPS.flatMap((sg) =>
                            METRIC_SUFFIXES.map((suf) => {
                              const key = `${sg.prefix}_${suf}`;
                              const v = row[key];
                              const has = String(v ?? "").trim() !== "" && numOrZero(v) !== 0;
                              const tone = sg.topGroup === "m"
                                ? { bg: has ? "#f0fdfa" : (alt ? "#f8fafc" : "#ffffff"), color: "#134e4a" }
                                : { bg: has ? "#eef2ff" : (alt ? "#f8fafc" : "#ffffff"), color: "#312e81" };
                              const isDisease = suf === "disease";
                              return (
                                <td key={key} className="gp3pm-num" style={{
                                  padding: "11px 6px", textAlign: "center",
                                  borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                                  background: tone.bg,
                                  color: has ? (isDisease ? "#7f1d1d" : tone.color) : "#cbd5e0",
                                  fontWeight: isDisease && has ? 800 : 700, fontSize: "12.5px",
                                }}>{has ? fmt(v) : "—"}</td>
                              );
                            })
                          )}
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
                  &nbsp;·&nbsp; ಪಿ3 / Pupa &amp; Moth Examination
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

export default GrainageP3PupaMothExamReport;
