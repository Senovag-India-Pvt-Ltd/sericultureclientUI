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

// 4 value columns split into 2 groups (Current Year / Previous Year)
// Each group has Month Start / Month End sub-columns.
const GROUPS = [
  {
    key: "cy",
    label: "ಪ್ರಸಕ್ತ ವರ್ಷ",
    sublabel: "Current Year",
    grad: "linear-gradient(135deg,#0f766e,#14b8a6)",
    head: "#0f766e",
    light: "#ccfbf1",
    softer: "#ecfdf5",
    dark: "#134e4a",
    cells: [
      { key: "cy_start_val", label: "ತಿಂಗಳ ಆರಂಭ", sub: "Month Start" },
      { key: "cy_end_val",   label: "ತಿಂಗಳ ಅಂತ್ಯ",  sub: "Month End"   },
    ],
  },
  {
    key: "py",
    label: "ಹಿಂದಿನ ವರ್ಷ",
    sublabel: "Previous Year",
    grad: "linear-gradient(135deg,#4338ca,#6366f1)",
    head: "#4338ca",
    light: "#e0e7ff",
    softer: "#eef2ff",
    dark: "#312e81",
    cells: [
      { key: "py_start_val", label: "ತಿಂಗಳ ಆರಂಭ", sub: "Month Start" },
      { key: "py_end_val",   label: "ತಿಂಗಳ ಅಂತ್ಯ",  sub: "Month End"   },
    ],
  },
];

const VALUE_KEYS = GROUPS.flatMap((g) => g.cells.map((c) => c.key));

if (!document.getElementById("gmwr-styles")) {
  const s = document.createElement("style");
  s.id = "gmwr-styles";
  s.innerHTML = `
    .gmwr-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gmwr-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gmwr-swal .swal2-icon { margin:20px auto 4px !important; }
    .gmwr-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gmwr-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gmwr-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    @keyframes gmwr-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(20,184,166,.35);} 50% { box-shadow:0 0 0 8px rgba(20,184,166,0);} }
    .gmwr-wrap { animation: gmwr-in .35s ease; }
    .gmwr-tr:hover td { background:#f0fdfa !important; transition:background .12s; }
    .gmwr-pill { animation: gmwr-pulse 2.4s infinite; }
    .gmwr-table th { letter-spacing:.02em; }
    .gmwr-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gmwr-grp-cy  { background: linear-gradient(135deg,#0f766e,#14b8a6) !important; }
    .gmwr-grp-py  { background: linear-gradient(135deg,#4338ca,#6366f1) !important; }
    .gmwr-sub-cy  { background: linear-gradient(180deg,#14b8a6,#0d9488) !important; }
    .gmwr-sub-py  { background: linear-gradient(180deg,#6366f1,#4f46e5) !important; }
    .gmwr-cell-cy { background: rgba(204,251,241,.35); }
    .gmwr-cell-py { background: rgba(224,231,255,.35); }
    .gmwr-cell-cy-alt { background: rgba(204,251,241,.65); }
    .gmwr-cell-py-alt { background: rgba(224,231,255,.65); }
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

function GrainageMulberryWeeklyReport() {
  const { t } = useTranslation();

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
      background: "#fff", customClass: { popup: "gmwr-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gmwr-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/mulberry-weekly", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Mulberry Maintenance report.");
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/mulberry-weekly/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/mulberry-weekly/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `mulberry_weekly_${filter.farmId}_${year}_${m}.xlsx`;
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
  const prevYear   = monthYear ? monthYear - 1 : null;

  const filledCount = dataRows.reduce((acc, r) => {
    let c = 0;
    VALUE_KEYS.forEach((k) => { if (r[k] && String(r[k]).trim() !== "" && r[k] !== "0") c++; });
    return acc + c;
  }, 0);
  const totalCells = dataRows.length * VALUE_KEYS.length;

  return (
    <Layout title={t("Mulberry Farm Maintenance Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("ಮಲ್ಬರಿ ತೋಟ ನಿರ್ವಹಣಾ ವರದಿ")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 55%,#22d3ee 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center",
            gap: "12px",
            position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🌿</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>ಮಲ್ಬರಿ ತೋಟ ನಿರ್ವಹಣಾ ವರದಿ</div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Mulberry Farm Maintenance Report — Current Year vs Previous Year</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                <span className="gmwr-pill" style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {dataRows.length} rows
                </span>
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

        {/* ── Report Table ─────────────────────────────────────────────── */}
        {hasReport && (
          <div className="gmwr-wrap mt-4">
            {/* Summary pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Farm</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{selectedFarm?.farmName || "—"}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Period</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fffbeb)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "120px" }}>
                <span style={{ fontSize: "11px", color: "#a16207", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Filled</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{filledCount} / {totalCells}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಪ್ರಸಕ್ತ ವರ್ಷ</span>
                <span style={{ fontSize: "13px", color: "#134e4a", fontWeight: 700, marginTop: "2px" }}>Current Year · {monthYear || "—"}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0e7ff,#eef2ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಹಿಂದಿನ ವರ್ಷ</span>
                <span style={{ fontSize: "13px", color: "#312e81", fontWeight: 700, marginTop: "2px" }}>Previous Year · {prevYear || "—"}</span>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{ background: "linear-gradient(135deg,#edf2f7,#e2e8f0)", border: "1.5px solid #cbd5e0", borderRadius: "20px", padding: "6px 16px", fontSize: "12px", color: "#4a5568", fontWeight: 600 }}>
                  {dataRows.length} rows
                </span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              {/* Title strip on top of table (PDF/Excel parity) */}
              <div style={{
                background: "linear-gradient(135deg,#134e4a,#0f766e)",
                color: "#fff", padding: "14px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ಕ್ಷೇತ್ರ {selectedFarm?.farmNameInKannada || selectedFarm?.farmName || ""}
                {" ನ  "}{monthKn}{" -"}{monthYear}
                {"  ರ ಮಲ್ಬರಿ ತೋಟ ನಿರ್ವಹಣಾ ವರದಿ"}
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="gmwr-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                  <thead>
                    {/* Row 1 — Sl/Desc span 2 rows; group cells span 2 cols */}
                    <tr>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#134e4a,#0f766e)", color: "#fff", padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 700, whiteSpace: "nowrap", width: "70px", verticalAlign: "middle" }}>
                        ಕ್ರ.ಸಂ.
                      </th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#134e4a,#0f766e)", color: "#fff", padding: "12px 16px", textAlign: "left", border: "1px solid rgba(255,255,255,.18)", fontWeight: 700, minWidth: "260px", verticalAlign: "middle" }}>
                        ವಿವರಗಳು
                      </th>
                      {GROUPS.map((g) => (
                        <th key={g.key} colSpan={2} className={`gmwr-grp-${g.key}`} style={{ color: "#fff", padding: "10px 12px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800 }}>
                          <div style={{ fontSize: "13.5px", fontWeight: 800 }}>{g.label}</div>
                          <div style={{ fontSize: "10.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>
                            {g.sublabel}{g.key === "cy" ? ` · ${monthYear || ""}` : ` · ${prevYear || ""}`}
                          </div>
                        </th>
                      ))}
                    </tr>
                    {/* Row 2 — Month Start / Month End sub-headers under each group */}
                    <tr>
                      {GROUPS.map((g) =>
                        g.cells.map((c) => (
                          <th key={c.key} className={`gmwr-sub-${g.key}`} style={{ color: "#fff", padding: "9px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 700, minWidth: "130px" }}>
                            <div style={{ fontSize: "12.5px", fontWeight: 700 }}>{c.label}</div>
                            <div style={{ fontSize: "10px", fontWeight: 500, opacity: .85, marginTop: "1px" }}>{c.sub}</div>
                          </th>
                        ))
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, idx) => {
                      const sn  = row.serial_number;
                      const alt = idx % 2 === 1;
                      const bg  = alt ? "#f8fafc" : "#ffffff";

                      return (
                        <tr key={`${sn}-${idx}`} className="gmwr-tr" style={{ background: bg }}>
                          <td style={{
                            padding: "12px 10px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            fontWeight: 700, color: "#0f766e", fontSize: "13px",
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "26px", height: "26px", padding: "0 8px",
                              borderRadius: "50%", background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
                              color: "#065f46", fontWeight: 800, fontSize: "12px",
                            }}>
                              {String(sn).padStart(2, "0")}
                            </span>
                          </td>
                          <td style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            color: "#134e4a", fontWeight: 600,
                          }}>
                            {row.description_kannada || ""}
                          </td>
                          {GROUPS.map((g) =>
                            g.cells.map((c) => {
                              const val = row[c.key];
                              const has = val !== null && val !== undefined && String(val).trim() !== "" && String(val) !== "0";
                              return (
                                <td
                                  key={c.key}
                                  className={`gmwr-num gmwr-cell-${g.key}${alt ? "-alt" : ""}`}
                                  style={{
                                    padding: "12px 14px", textAlign: "center",
                                    borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                                    fontWeight: 700,
                                    color: has ? g.dark : "#cbd5e0",
                                    fontSize: "13px",
                                  }}
                                >
                                  {has ? val : "—"}
                                </td>
                              );
                            })
                          )}
                        </tr>
                      );
                    })}
                    {dataRows.length === 0 && (
                      <tr><td colSpan={6} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>No data available for the selected filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer signatures (mirrors PDF/Excel) */}
              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#ecfeff)", padding: "16px 24px 14px", borderTop: "1.5px solid #ccfbf1" }}>
                <Row className="g-2">
                  <Col md={6}>
                    <div style={{ fontSize: "12.5px", color: "#134e4a", fontWeight: 700, marginBottom: "6px" }}>
                      ಸ್ಥಳ : <span style={{ color: "#94a3b8", letterSpacing: ".4em" }}>____________________</span>
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#134e4a", fontWeight: 700 }}>
                      ದಿನಾಂಕ : <span style={{ color: "#94a3b8", letterSpacing: ".4em" }}>____________________</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ fontSize: "12.5px", color: "#134e4a", fontWeight: 700, marginBottom: "6px" }}>
                      ಸಹಿ : <span style={{ color: "#94a3b8", letterSpacing: ".4em" }}>____________________</span>
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#134e4a", fontWeight: 700 }}>
                      ಹುದ್ದೆ : <span style={{ color: "#94a3b8", letterSpacing: ".4em" }}>____________________</span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#f0fdfa)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #ccfbf1" }}>
                <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                  {selectedFarm?.farmName || ""} — {monthLabel} {monthKn} {monthYear}
                  &nbsp;·&nbsp; ಪ್ರಸಕ್ತ ವರ್ಷ {monthYear || ""} · ಹಿಂದಿನ ವರ್ಷ {prevYear || ""}
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

export default GrainageMulberryWeeklyReport;
