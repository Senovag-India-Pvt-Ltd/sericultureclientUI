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

const WEEK_COLS = [
  { key: "week1_val", label: "1ನೇ ವಾರ",  range: "1–10",   hdr: "#1d4ed8", sub: "#2563eb", light: "#dbeafe", dark: "#1e3a8a" },
  { key: "week2_val", label: "2ನೇ ವಾರ",  range: "11–20",  hdr: "#6d28d9", sub: "#7c3aed", light: "#ede9fe", dark: "#4c1d95" },
  { key: "week3_val", label: "3ನೇ ವಾರ",  range: "21–30",  hdr: "#b45309", sub: "#d97706", light: "#fef3c7", dark: "#78350f" },
  { key: "week4_val", label: "4ನೇ ವಾರ",  range: "31+",    hdr: "#be185d", sub: "#db2777", light: "#fce7f3", dark: "#831843" },
];

const TOTAL_ROWS   = new Set([1]);
const VARIETY_ROWS = new Set([2, 3, 4, 5, 6]);

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
    .gmwr-wrap { animation: gmwr-in .3s ease; }
    .gmwr-tr-variety:hover td { background:#ecfdf5 !important; transition:background .12s; }
    .gmwr-tr-op:hover td { background:#eff6ff !important; transition:background .12s; }
    .gmwr-group-sep td {
      background: linear-gradient(90deg,#f0fdf4,#fff) !important;
      border-left: 3px solid #10b981 !important;
      color: #065f46 !important;
      font-size: 11px !important;
      font-weight: 800 !important;
      text-transform: uppercase;
      letter-spacing: .07em;
      padding: 5px 14px !important;
    }
    .gmwr-group-sep-op td {
      background: linear-gradient(90deg,#eff6ff,#fff) !important;
      border-left: 3px solid #3b82f6 !important;
      color: #1e3a8a !important;
    }
  `;
  document.head.appendChild(s);
}

const sel = { borderRadius: "7px", border: "1.5px solid #d0d9e8", padding: "6px 10px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "3px", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" };
const btn = (bg, shadow, disabled) => ({
  background: disabled ? "#c8d6e5" : bg,
  border: "none", borderRadius: "8px", padding: "7px 16px",
  fontWeight: 700, fontSize: "13px", color: "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: disabled ? "none" : shadow,
  display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap",
});

function GrainageMulberryWeeklyReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ grainageMasterId: "", financialYearMasterId: "", month: "" });
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
    if (!filter.grainageMasterId)      return "Please select a Grainage.";
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

  const params = () => ({ grainageId: filter.grainageMasterId, fyStartYear, month: filter.month });

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/mulberry-weekly", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data.filter((r) => Number(r.serial_number) >= 1) : []);
      setHasReport(true);
    } catch {
      showErr("Fetch Failed", "Failed to load the Mulberry Weekly report.");
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
      a.download = `grainage_mulberry_weekly_${filter.grainageMasterId}_${fyStartYear}_${filter.month}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr("Excel Failed", "Could not generate the Excel report.");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedGrainage = grainageList.find((g) => String(g.grainageMasterId) === String(filter.grainageMasterId));
  const monthKn    = MONTH_KN[Number(filter.month)] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";

  return (
    <Layout title={t("Mulberry Farm Monthly Achievement Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("ಮಾಸಿಕ ಮಲ್ಬರಿ ಕ್ಷೇತ್ರ ಸಾಧನೆ")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(6,78,59,.10)" }}>
          <div style={{
            background: "linear-gradient(135deg,#064e3b 0%,#047857 60%,#059669 100%)",
            padding: "10px 18px", display: "flex", alignItems: "center",
            gap: "10px", borderRadius: "12px 12px 0 0",
          }}>
            <span style={{ fontSize: "18px" }}>🌿</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", lineHeight: 1.2 }}>ಮಾಸಿಕ ಮಲ್ಬರಿ ಕ್ಷೇತ್ರ ಸಾಧನೆ</div>
              <div style={{ color: "rgba(255,255,255,.78)", fontSize: "11px" }}>P4 BSF Kunigal — Mulberry Farm Monthly Achievement Report</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ background: "rgba(255,255,255,.18)", borderRadius: "20px", padding: "3px 10px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""}
                </span>
                <span style={{ background: "rgba(255,255,255,.18)", borderRadius: "20px", padding: "3px 10px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>
                  {dataRows.length} rows
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "14px 18px 16px" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>Grainage <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="grainageMasterId" value={filter.grainageMasterId} onChange={handleChange} style={sel}>
                    <option value="">— Select Grainage —</option>
                    {grainageList.map((g) => (
                      <option key={g.grainageMasterId} value={g.grainageMasterId}>{g.grainageMasterName}</option>
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
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#064e3b,#047857)", "0 3px 10px rgba(6,78,59,.30)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 3px 10px rgba(185,28,28,.28)", isDownloadingPdf)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📄 PDF</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 3px 10px rgba(21,128,61,.28)", isDownloadingExcel)}>
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
              <div style={{ background: "linear-gradient(135deg,#d1fae5,#ecfdf5)", border: "1.5px solid #6ee7b7", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "160px" }}>
                <span style={{ fontSize: "11px", color: "#065f46", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Grainage</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{selectedGrainage?.grainageMasterName || "—"}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#d1fae5,#f0fdf4)", border: "1.5px solid #a7f3d0", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "140px" }}>
                <span style={{ fontSize: "11px", color: "#047857", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Month</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthKn}</span>
              </div>
              {WEEK_COLS.map((w) => (
                <div key={w.key} style={{ background: "#fff", border: `1.5px solid ${w.light}`, borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "100px" }}>
                  <span style={{ fontSize: "11px", color: w.dark, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{w.label}</span>
                  <span style={{ fontSize: "12px", color: w.hdr, fontWeight: 700, marginTop: "2px" }}>ದಿನ {w.range}</span>
                </div>
              ))}
              <div style={{ marginLeft: "auto" }}>
                <span style={{ background: "linear-gradient(135deg,#edf2f7,#e2e8f0)", border: "1.5px solid #cbd5e0", borderRadius: "20px", padding: "6px 16px", fontSize: "12px", color: "#4a5568", fontWeight: 600 }}>
                  {dataRows.length} rows
                </span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(6,78,59,.10)", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                  <thead>
                    {/* Header row 1 */}
                    <tr>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#064e3b,#047857)", color: "#fff", padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,.2)", fontWeight: 700, whiteSpace: "nowrap", width: "50px" }}>
                        ಕ್ರ.ಸಂ
                      </th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#064e3b,#047857)", color: "#fff", padding: "12px 16px", textAlign: "left", border: "1px solid rgba(255,255,255,.2)", fontWeight: 700, minWidth: "220px" }}>
                        ವಿವರಗಳು
                      </th>
                      {WEEK_COLS.map((w) => (
                        <th key={w.key} style={{ background: w.hdr, color: "#fff", padding: "10px 12px", textAlign: "center", border: "1px solid rgba(255,255,255,.2)", fontWeight: 700, minWidth: "100px" }}>
                          {w.label}
                        </th>
                      ))}
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#022c22,#064e3b)", color: "#fff", padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,.2)", fontWeight: 700, minWidth: "90px" }}>
                        ಒಟ್ಟು
                      </th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#022c22,#064e3b)", color: "#fff", padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,.2)", fontWeight: 700, minWidth: "90px" }}>
                        ಸಂಚಿತ
                      </th>
                    </tr>
                    {/* Header row 2 — week date ranges */}
                    <tr>
                      {WEEK_COLS.map((w) => (
                        <th key={w.key} style={{ background: w.sub, color: "#fff", padding: "7px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,.2)", fontWeight: 600, fontSize: "11.5px" }}>
                          ದಿನ {w.range}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, idx) => {
                      const sn        = Number(row.serial_number);
                      const isTotal   = TOTAL_ROWS.has(sn);
                      const isVariety = VARIETY_ROWS.has(sn);
                      const alt       = idx % 2 === 1;
                      const bg        = isTotal   ? "#0f172a"
                                      : isVariety ? (alt ? "#f0fdf4" : "#fff")
                                      : (alt ? "#eff6ff" : "#fff");
                      const trClass   = isTotal ? "" : isVariety ? "gmwr-tr-variety" : "gmwr-tr-op";
                      const showVarietyLabel = sn === 2;
                      const showOpLabel      = sn === 7;

                      return (
                        <React.Fragment key={sn}>
                          {showVarietyLabel && (
                            <tr className="gmwr-group-sep">
                              <td colSpan={8}>🌿 ತಳಿ ವಾರ ಕ್ಷೇತ್ರ (Variety-wise Weekly Area)</td>
                            </tr>
                          )}
                          {showOpLabel && (
                            <tr className="gmwr-group-sep gmwr-group-sep-op">
                              <td colSpan={8}>⚙️ ಕ್ರಿಯೆ ವಾರ ಕ್ಷೇತ್ರ (Operation-wise Weekly Area)</td>
                            </tr>
                          )}
                          <tr className={trClass} style={{ background: bg }}
                            onMouseEnter={isTotal ? undefined : (e) => (e.currentTarget.style.background = isVariety ? "#ecfdf5" : "#eff6ff")}
                            onMouseLeave={isTotal ? undefined : (e) => (e.currentTarget.style.background = bg)}
                          >
                            <td style={{ padding: "11px 10px", textAlign: "center", borderBottom: "1px solid #e8edf5", borderRight: "1px solid #e8edf5", fontWeight: 700, color: isTotal ? "rgba(255,255,255,.5)" : "#047857", fontSize: "13px" }}>
                              {String(sn).padStart(2, "0")}
                            </td>
                            <td style={{ padding: "11px 16px", borderBottom: "1px solid #e8edf5", borderRight: "1px solid #e8edf5", color: isTotal ? "#fff" : isVariety ? "#065f46" : "#1e3a8a", fontWeight: isTotal ? 800 : 500 }}>
                              {isTotal && <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#10b981", marginRight: 7, verticalAlign: "middle" }} />}
                              {row.description_kannada || ""}
                            </td>
                            {WEEK_COLS.map((w) => {
                              const val = row[w.key];
                              return (
                                <td key={w.key} style={{ padding: "11px 14px", textAlign: "right", borderBottom: "1px solid #e8edf5", borderRight: "1px solid #e8edf5", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: isTotal ? w.light : w.dark, background: isTotal ? "rgba(255,255,255,.05)" : (val && val !== "0" ? (alt ? w.light + "aa" : w.light + "66") : undefined), fontSize: "13px" }}>
                                  {val || "—"}
                                </td>
                              );
                            })}
                            <td style={{ padding: "11px 14px", textAlign: "right", borderBottom: "1px solid #e8edf5", borderRight: "1px solid #e8edf5", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: isTotal ? "#d1fae5" : "#047857", background: isTotal ? "rgba(16,185,129,.2)" : "#d1fae5", fontSize: "13px" }}>
                              {row.total_val || "—"}
                            </td>
                            <td style={{ padding: "11px 14px", textAlign: "right", borderBottom: "1px solid #e8edf5", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: isTotal ? "#d1fae5" : "#065f46", background: isTotal ? "rgba(16,185,129,.14)" : "#bbf7d0", fontSize: "13px" }}>
                              {row.cumul_val || "—"}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                    {dataRows.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>No data available for the selected filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div style={{ background: "linear-gradient(135deg,#f0fdf4,#f7fafc)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #d1fae5" }}>
                <span style={{ fontSize: "12px", color: "#718096", fontWeight: 600 }}>
                  {selectedGrainage?.grainageMasterName || ""} — {monthLabel} {monthKn} ಮಾಹೆ &nbsp;·&nbsp; ವಾರ 1: 1-10 · ವಾರ 2: 11-20 · ವಾರ 3: 21-30 · ವಾರ 4: 31+
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
