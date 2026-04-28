import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import api from "../../services/auth/api";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDFL = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const MONTH_NAMES_KN = [
  "", "ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್",
  "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್",
];

if (!document.getElementById("gpr-swal-styles")) {
  const s = document.createElement("style");
  s.id = "gpr-swal-styles";
  s.innerHTML = `
    .gpr-swal { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22) !important; }
    .gpr-swal .swal2-title { font-size: 21px !important; font-weight: 800 !important; color: #1a202c !important; }
    .gpr-swal .swal2-icon { margin: 20px auto 4px !important; }
    .gpr-swal .swal2-html-container { margin: 0 !important; padding: 0 !important; }
    .gpr-swal .swal2-actions { gap: 10px !important; }
    .gpr-swal .swal2-confirm { border-radius: 11px !important; padding: 12px 30px !important; font-weight: 700 !important; font-size: 14px !important; }
    @keyframes gpr-fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    .gpr-table-wrap { animation: gpr-fadeIn 0.35s ease; }
  `;
  document.head.appendChild(s);
}

function GrainageProgressReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({
    grainageMasterId: "",
    financialYearMasterId: "",
    month: "",
  });
  const [fyStartYear, setFyStartYear] = useState(null);
  const [selectedFyString, setSelectedFyString] = useState("");

  const [grainageList, setGrainageList] = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [reportRows, setReportRows] = useState([]);
  const [hasReport, setHasReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "grainageMaster/get-all")
      .then((r) => setGrainageList(r.data.content.grainageMaster || []))
      .catch(() => setGrainageList([]));

    api.get(baseURL + "financialYearMaster/get-all")
      .then((r) => {
        const list = r.data.content.financialYearMaster || [];
        setFinancialYearList(list);
      })
      .catch(() => setFinancialYearList([]));

    api.get(baseURL + "financialYearMaster/get-is-default")
      .then((r) => {
        const fy = r.data.content;
        if (fy) {
          setFilter((prev) => ({ ...prev, financialYearMasterId: fy.financialYearMasterId }));
          const startYear = extractStartYear(fy.financialYear);
          setFyStartYear(startYear);
          setSelectedFyString(fy.financialYear || "");
        }
      })
      .catch(() => {});
  }, []);

  const extractStartYear = (fyStr) => {
    if (!fyStr) return null;
    const parts = String(fyStr).trim().split("-");
    const yr = parseInt(parts[0], 10);
    return isNaN(yr) ? null : yr;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    if (name === "financialYearMasterId") {
      const selected = financialYearList.find(
        (f) => String(f.financialYearMasterId) === String(value)
      );
      if (selected) {
        setFyStartYear(extractStartYear(selected.financialYear));
        setSelectedFyString(selected.financialYear || "");
      } else {
        setFyStartYear(null);
        setSelectedFyString("");
      }
      setHasReport(false);
      setReportRows([]);
    }

    if (name === "grainageMasterId" || name === "month") {
      setHasReport(false);
      setReportRows([]);
    }
  };

  const validate = () => {
    if (!filter.grainageMasterId) return "Please select a Grainage.";
    if (!filter.financialYearMasterId) return "Please select a Financial Year.";
    if (!filter.month) return "Please select a Month.";
    if (!fyStartYear) return "Could not determine the financial year start year.";
    return null;
  };

  const showValidationError = (msg) => {
    Swal.fire({
      icon: "warning",
      title: "Required Fields",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">Missing Selection</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Got it",
      confirmButtonColor: "#d97706",
      background: "#fff",
      customClass: { popup: "gpr-swal" },
    });
  };

  const handleViewReport = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showValidationError(err); return; }

    setIsLoading(true);
    setHasReport(false);
    setReportRows([]);
    try {
      const response = await api.get(baseURLSeedDFL + "grainage-progress-report", {
        params: {
          grainageId: filter.grainageMasterId,
          finYearId: filter.financialYearMasterId,
          fyStartYear,
          month: filter.month,
        },
      });
      const rows = Array.isArray(response.data) ? response.data : [];
      setReportRows(rows);
      setHasReport(true);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Could Not Load Report</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">Failed to fetch the progress report data. Please try again.</p></div></div></div>`,
        confirmButtonText: "Close",
        confirmButtonColor: "#e53e3e",
        background: "#fff",
        customClass: { popup: "gpr-swal" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    const err = validate();
    if (err) { showValidationError(err); return; }

    setIsDownloading(true);
    try {
      const response = await api.get(baseURLSeedDFL + "grainage-progress-report/pdf", {
        params: {
          grainageId: filter.grainageMasterId,
          finYearId: filter.financialYearMasterId,
          fyStartYear,
          month: filter.month,
        },
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      window.open(url);
    } catch {
      Swal.fire({
        icon: "error",
        title: "PDF Generation Failed",
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">📄</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">PDF Not Generated</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">Could not generate the PDF report. Please verify your selection and try again.</p></div></div></div>`,
        confirmButtonText: "Close",
        confirmButtonColor: "#e53e3e",
        background: "#fff",
        customClass: { popup: "gpr-swal" },
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadExcel = async () => {
    const err = validate();
    if (err) { showValidationError(err); return; }

    setIsDownloadingExcel(true);
    try {
      const response = await api.get(baseURLSeedDFL + "grainage-progress-report/excel", {
        params: {
          grainageId: filter.grainageMasterId,
          finYearId: filter.financialYearMasterId,
          fyStartYear,
          month: filter.month,
        },
        responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `grainage_progress_report_${filter.grainageMasterId}_${fyStartYear}_${filter.month}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Excel Generation Failed",
        html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">📊</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Excel Not Generated</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">Could not generate the Excel report. Please verify your selection and try again.</p></div></div></div>`,
        confirmButtonText: "Close",
        confirmButtonColor: "#e53e3e",
        background: "#fff",
        customClass: { popup: "gpr-swal" },
      });
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedGrainage = grainageList.find(
    (g) => String(g.grainageMasterId) === String(filter.grainageMasterId)
  );

  const currFy = fyStartYear ? `${fyStartYear}-${fyStartYear + 1}` : "—";
  const prevFy = fyStartYear ? `${fyStartYear - 1}-${fyStartYear}` : "—";
  const monthKn = filter.month ? MONTH_NAMES_KN[parseInt(filter.month, 10)] : "";
  const monthLabel = filter.month
    ? MONTHS.find((m) => String(m.value) === String(filter.month))?.label || ""
    : "";

  const fmt = (val) => {
    if (val === null || val === undefined) return "—";
    const n = parseFloat(val);
    if (isNaN(n)) return String(val);
    if (n === Math.floor(n)) return String(Math.round(n));
    return n.toFixed(2);
  };

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

  return (
    <Layout title={t("Grainage Monthly Progress Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Grainage Monthly Progress Report")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)" }}>
          {/* Slim header bar */}
          <div style={{
            background: "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 65%,#38b2ac 100%)",
            padding: "10px 18px", display: "flex", alignItems: "center",
            gap: "10px", borderRadius: "12px 12px 0 0",
          }}>
            <span style={{ fontSize: "18px" }}>📊</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", lineHeight: 1.2 }}>ಬಿತ್ತನೆಕೋಠಿ ಪ್ರಗತಿ ವಿವರ</div>
              <div style={{ color: "rgba(255,255,255,0.78)", fontSize: "11px" }}>Grainage Monthly Progress Report — 1 Report · 5 Part</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ background: "rgba(255,255,255,0.18)", borderRadius: "20px", padding: "3px 10px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""}
                </span>
                <span style={{ background: "rgba(255,255,255,0.18)", borderRadius: "20px", padding: "3px 10px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>
                  {currFy} vs {prevFy}
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "14px 18px 16px" }}>
            <Form onSubmit={handleViewReport}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>Grainage <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="grainageMasterId" value={filter.grainageMasterId} onChange={handleFilterChange} style={sel}>
                    <option value="">— Select Grainage —</option>
                    {grainageList.map((g) => (
                      <option key={g.grainageMasterId} value={g.grainageMasterId}>{g.grainageMasterName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lbl}>Financial Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleFilterChange} style={sel}>
                    <option value="">— Select Year —</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleFilterChange} style={sel}>
                    <option value="">— Month —</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#1a5f9e,#2c8fd4)", "0 3px 10px rgba(26,95,158,0.30)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                    </button>
                    <button type="button" disabled={isDownloading} onClick={handleDownloadPdf} style={btn("linear-gradient(135deg,#276749,#38a169)", "0 3px 10px rgba(39,103,73,0.28)", isDownloading)}>
                      {isDownloading ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📥 PDF</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel} onClick={handleDownloadExcel} style={btn("linear-gradient(135deg,#1d6a3a,#22883f)", "0 3px 10px rgba(29,106,58,0.28)", isDownloadingExcel)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>🟢 Excel</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* ── Report Table ───────────────────────────────────────────── */}
        {hasReport && (
          <div className="gpr-table-wrap mt-4">
            {/* Summary pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div
                style={{
                  background: "linear-gradient(135deg,#ebf8ff,#e6fffa)",
                  border: "1.5px solid #bee3f8",
                  borderRadius: "12px", padding: "10px 18px",
                  display: "flex", flexDirection: "column", minWidth: "160px",
                }}
              >
                <span style={{ fontSize: "11px", color: "#2b6cb0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  Grainage
                </span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>
                  {selectedGrainage?.grainageMasterName || "—"}
                </span>
              </div>
              <div
                style={{
                  background: "linear-gradient(135deg,#f0fff4,#f7fafc)",
                  border: "1.5px solid #9ae6b4",
                  borderRadius: "12px", padding: "10px 18px",
                  display: "flex", flexDirection: "column", minWidth: "140px",
                }}
              >
                <span style={{ fontSize: "11px", color: "#276749", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  Month
                </span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>
                  {monthLabel} {monthKn}
                </span>
              </div>
              <div
                style={{
                  background: "linear-gradient(135deg,#fefcbf,#fffff0)",
                  border: "1.5px solid #f6e05e",
                  borderRadius: "12px", padding: "10px 18px",
                  display: "flex", flexDirection: "column", minWidth: "220px",
                }}
              >
                <span style={{ fontSize: "11px", color: "#975a16", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  Comparing
                </span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>
                  {currFy} &nbsp;vs&nbsp; {prevFy}
                </span>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span
                  style={{
                    background: "linear-gradient(135deg,#edf2f7,#e2e8f0)",
                    border: "1.5px solid #cbd5e0",
                    borderRadius: "20px", padding: "6px 16px",
                    fontSize: "12px", color: "#4a5568", fontWeight: 600,
                  }}
                >
                  {reportRows.length} rows
                </span>
              </div>
            </div>

            <Card
              style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)", overflow: "hidden" }}
            >
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                  <thead>
                    {/* Row 1: year group headers */}
                    <tr>
                      <th
                        rowSpan={2}
                        style={{
                          background: "linear-gradient(135deg,#1a5f9e,#2c8fd4)",
                          color: "#fff", padding: "12px 10px", textAlign: "center",
                          borderRight: "1px solid rgba(255,255,255,0.2)",
                          borderBottom: "1px solid rgba(255,255,255,0.2)",
                          fontWeight: 700, whiteSpace: "nowrap", width: "50px",
                        }}
                      >
                        ಕ್ರ.ಸಂ
                      </th>
                      <th
                        rowSpan={2}
                        style={{
                          background: "linear-gradient(135deg,#1a5f9e,#2c8fd4)",
                          color: "#fff", padding: "12px 16px", textAlign: "left",
                          borderRight: "1px solid rgba(255,255,255,0.2)",
                          borderBottom: "1px solid rgba(255,255,255,0.2)",
                          fontWeight: 700, minWidth: "220px",
                        }}
                      >
                        ವಿವರಗಳು
                      </th>
                      <th
                        colSpan={2}
                        style={{
                          background: "linear-gradient(135deg,#2b6cb0,#3182ce)",
                          color: "#fff", padding: "10px 16px", textAlign: "center",
                          borderRight: "1px solid rgba(255,255,255,0.2)",
                          borderBottom: "1px solid rgba(255,255,255,0.15)",
                          fontWeight: 700,
                        }}
                      >
                        {currFy}
                      </th>
                      <th
                        colSpan={2}
                        style={{
                          background: "linear-gradient(135deg,#285e61,#2c7a7b)",
                          color: "#fff", padding: "10px 16px", textAlign: "center",
                          borderBottom: "1px solid rgba(255,255,255,0.15)",
                          fontWeight: 700,
                        }}
                      >
                        {prevFy}
                      </th>
                    </tr>

                    {/* Row 2: sub-column headers */}
                    <tr>
                      {[
                        { label: "ಮಾಸ", bg: "#3182ce" },
                        { label: "ಮಾಸಾಂತ್ಯ", bg: "#2b6cb0", br: true },
                        { label: "ಮಾಸ", bg: "#2c7a7b" },
                        { label: "ಮಾಸಾಂತ್ಯ", bg: "#285e61" },
                      ].map((col, i) => (
                        <th
                          key={i}
                          style={{
                            background: col.bg,
                            color: "#fff", padding: "8px 14px", textAlign: "center",
                            borderRight: col.br ? "1px solid rgba(255,255,255,0.2)" : undefined,
                            fontWeight: 600, fontSize: "12.5px", whiteSpace: "nowrap",
                          }}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {reportRows.map((row, idx) => {
                      const isAlt = idx % 2 === 1;
                      const bg = isAlt ? "#f7fafd" : "#fff";
                      return (
                        <tr key={idx} style={{ background: bg, transition: "background 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#eef5fd")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = bg)}
                        >
                          <td
                            style={{
                              padding: "11px 10px", textAlign: "center",
                              borderBottom: "1px solid #e8edf5",
                              borderRight: "1px solid #e8edf5",
                              fontWeight: 700, color: "#1a5f9e", fontSize: "13px",
                            }}
                          >
                            {row.serial_number ?? row.serialNumber ?? idx + 1}
                          </td>
                          <td
                            style={{
                              padding: "11px 16px",
                              borderBottom: "1px solid #e8edf5",
                              borderRight: "1px solid #e8edf5",
                              color: "#2d3748", fontWeight: 500,
                            }}
                          >
                            {row.description_kannada ?? row.descriptionKannada ?? ""}
                          </td>
                          <td style={numCell("#dbeafe", "#1e40af")}>
                            {fmt(row.curr_month ?? row.currMonth)}
                          </td>
                          <td style={{ ...numCell("#bfdbfe", "#1e3a8a"), borderRight: "2px solid #93c5fd" }}>
                            {fmt(row.curr_cumulative ?? row.currCumulative)}
                          </td>
                          <td style={numCell("#d1fae5", "#065f46")}>
                            {fmt(row.prev_month ?? row.prevMonth)}
                          </td>
                          <td style={numCell("#a7f3d0", "#064e3b")}>
                            {fmt(row.prev_cumulative ?? row.prevCumulative)}
                          </td>
                        </tr>
                      );
                    })}
                    {reportRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            padding: "40px 20px", textAlign: "center",
                            color: "#a0aec0", fontSize: "14px",
                          }}
                        >
                          No data available for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div
                style={{
                  background: "linear-gradient(135deg,#f7fafc,#edf2f7)",
                  padding: "12px 24px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: "8px",
                  borderTop: "1.5px solid #e2e8f0",
                }}
              >
                <span style={{ fontSize: "12px", color: "#718096", fontWeight: 600 }}>
                  ಬಿತ್ತನೆಕೋರಿ {selectedGrainage?.grainageMasterName || ""} — {monthLabel} {monthKn} ಮಾಹೆ
                </span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    style={{
                      background: isDownloading ? "#c8d6e5" : "linear-gradient(135deg,#276749,#38a169)",
                      border: "none", borderRadius: "8px",
                      padding: "8px 20px", fontWeight: 700, fontSize: "13px",
                      color: "#fff", cursor: isDownloading ? "not-allowed" : "pointer",
                      boxShadow: "0 2px 8px rgba(39,103,73,0.25)",
                      display: "flex", alignItems: "center", gap: "6px",
                    }}
                  >
                    {isDownloading ? (
                      <><span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} /> Generating…</>
                    ) : (
                      <>📥 Download PDF</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadExcel}
                    disabled={isDownloadingExcel}
                    style={{
                      background: isDownloadingExcel ? "#c8d6e5" : "linear-gradient(135deg,#1d6a3a,#22883f)",
                      border: "none", borderRadius: "8px",
                      padding: "8px 20px", fontWeight: 700, fontSize: "13px",
                      color: "#fff", cursor: isDownloadingExcel ? "not-allowed" : "pointer",
                      boxShadow: "0 2px 8px rgba(29,106,58,0.25)",
                      display: "flex", alignItems: "center", gap: "6px",
                    }}
                  >
                    {isDownloadingExcel ? (
                      <><span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} /> Exporting…</>
                    ) : (
                      <>🟢 Download Excel</>
                    )}
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

function numCell(bgLight, textColor) {
  return {
    padding: "11px 14px",
    textAlign: "right",
    borderBottom: "1px solid #e8edf5",
    borderRight: "1px solid #e8edf5",
    fontVariantNumeric: "tabular-nums",
    fontWeight: 600,
    color: textColor,
    fontSize: "13px",
  };
}

export default GrainageProgressReport;
