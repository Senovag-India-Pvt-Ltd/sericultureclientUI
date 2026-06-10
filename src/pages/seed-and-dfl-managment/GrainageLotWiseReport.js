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
  { value: 1, label: "January" }, { value: 2, label: "February" },
  { value: 3, label: "March" },   { value: 4, label: "April" },
  { value: 5, label: "May" },     { value: 6, label: "June" },
  { value: 7, label: "July" },    { value: 8, label: "August" },
  { value: 9, label: "September" },{ value: 10, label: "October" },
  { value: 11, label: "November" },{ value: 12, label: "December" },
];

const MONTH_KN = ["","ಜನವರಿ","ಫೆಬ್ರವರಿ","ಮಾರ್ಚ್","ಏಪ್ರಿಲ್","ಮೇ","ಜೂನ್","ಜುಲೈ","ಆಗಸ್ಟ್","ಸೆಪ್ಟೆಂಬರ್","ಅಕ್ಟೋಬರ್","ನವೆಂಬರ್","ಡಿಸೆಂಬರ್"];

// Rows that contain text/dates instead of numbers
const TEXT_ROWS = new Set([1, 2, 3, 4, 5, 9, 14]);

if (!document.getElementById("glwr-styles")) {
  const s = document.createElement("style");
  s.id = "glwr-styles";
  s.innerHTML = `
    .glwr-swal { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22) !important; }
    .glwr-swal .swal2-title { font-size: 21px !important; font-weight: 800 !important; color: #1a202c !important; }
    .glwr-swal .swal2-icon { margin: 20px auto 4px !important; }
    .glwr-swal .swal2-html-container { margin: 0 !important; padding: 0 !important; }
    .glwr-swal .swal2-confirm { border-radius: 11px !important; padding: 12px 30px !important; font-weight: 700 !important; }
    @keyframes glwr-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
    .glwr-wrap { animation: glwr-in 0.3s ease; }
    .glwr-tr:hover td { background: #eef5fd !important; }
  `;
  document.head.appendChild(s);
}

function GrainageLotWiseReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ grainageMasterId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [grainageList, setGrainageList] = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [reportRows, setReportRows] = useState([]);
  const [hasReport, setHasReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
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
    setReportRows([]);
    if (name === "financialYearMasterId") {
      const sel = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel ? extractYear(sel.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.grainageMasterId) return "Please select a Grainage.";
    if (!filter.financialYearMasterId) return "Please select a Financial Year.";
    if (!filter.month) return "Please select a Month.";
    if (!fyStartYear) return "Could not determine the financial year start year.";
    return null;
  };

  const warn = (msg) =>
    Swal.fire({
      icon: "warning", title: "Required Fields",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 4px">Missing Selection</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.6">${msg}</p></div></div></div>`,
      confirmButtonText: "Got it", confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "glwr-swal" },
    });

  const errAlert = (title, bodyMsg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 4px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.6">${bodyMsg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "glwr-swal" },
    });

  const params = () => ({ grainageId: filter.grainageMasterId, fyStartYear, month: filter.month });

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { warn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setReportRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/lotwise", { params: params() });
      setReportRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          errAlert("No Data Found", "No data found for the selected filters.");
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          errAlert("Fetch Failed", backendMsg || err?.message || "Failed to load the lot-wise report. Please try again.");
        }
      } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async () => {
    const err = validate();
    if (err) { warn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/lotwise/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch {
      errAlert("PDF Failed", "Could not generate the PDF report. Please try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleExcel = async () => {
    const err = validate();
    if (err) { warn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/lotwise/excel", {
        params: params(),
        responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `grainage_lotwise_${filter.grainageMasterId}_${fyStartYear}_${filter.month}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      errAlert("Excel Failed", "Could not generate the Excel report. Please try again.");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedGrainage = grainageList.find((g) => String(g.grainageMasterId) === String(filter.grainageMasterId));
  const monthLabel = filter.month ? MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "" : "";
  const monthKn    = filter.month ? MONTH_KN[parseInt(filter.month, 10)] : "";
  const selectedFy = financialYearList.find((f) => String(f.financialYearMasterId) === String(filter.financialYearMasterId));
  const fyLabel    = selectedFy?.financialYear || "—";

  // button style helper
  const mkBtn = (bg, shadow, busy) => ({
    background: busy ? "#c8d6e5" : bg,
    border: "none", borderRadius: "8px", padding: "7px 16px",
    fontWeight: 700, fontSize: "13px", color: "#fff",
    cursor: busy ? "not-allowed" : "pointer",
    boxShadow: busy ? "none" : shadow,
    display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap",
  });
  const sel = { borderRadius: "7px", border: "1.5px solid #d0d9e8", padding: "6px 10px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
  const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "3px", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" };

  // ── week column theme ──────────────────────────────────────────────
  const weekTheme = [
    { hdr: "#1e6fab", subHdr: "#2980b9", num: "#1e3a8a", numBg: "#dbeafe" },
    { hdr: "#1a7a62", subHdr: "#27ae60", num: "#065f46", numBg: "#d1fae5" },
    { hdr: "#7b4fa6", subHdr: "#8e44ad", num: "#4c1d95", numBg: "#ede9fe" },
    { hdr: "#b56a00", subHdr: "#d97706", num: "#78350f", numBg: "#fef3c7" },
  ];

  return (
    <Layout title={t("Grainage Lot-wise Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Grainage Lot-wise Egg Production Report")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ── */}
        <Card className="mt-1" style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)" }}>
          <div style={{
            background: "linear-gradient(135deg,#6a11cb 0%,#2575fc 60%,#38b2ac 100%)",
            padding: "10px 18px", display: "flex", alignItems: "center",
            gap: "10px", borderRadius: "12px 12px 0 0",
          }}>
            <span style={{ fontSize: "18px" }}>🗂️</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", lineHeight: 1.2 }}>ತಂಡವಾರು ಮೊಟ್ಟೆ ಉತ್ಪಾದನಾ ವರದಿ</div>
              <div style={{ color: "rgba(255,255,255,0.78)", fontSize: "11px" }}>Lot-wise Egg Production Report — 1 Report · 5 Part</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ background: "rgba(255,255,255,0.18)", borderRadius: "20px", padding: "3px 10px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""}
                </span>
                <span style={{ background: "rgba(255,255,255,0.18)", borderRadius: "20px", padding: "3px 10px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>
                  {fyLabel}
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
                    <button type="submit" disabled={isLoading} style={mkBtn("linear-gradient(135deg,#6a11cb,#2575fc)", "0 3px 10px rgba(106,17,203,0.28)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={mkBtn("linear-gradient(135deg,#276749,#38a169)", "0 3px 10px rgba(39,103,73,0.28)", isDownloadingPdf)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📥 PDF</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={mkBtn("linear-gradient(135deg,#1d6a3a,#22883f)", "0 3px 10px rgba(29,106,58,0.28)", isDownloadingExcel)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>🟢 Excel</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* ── Report Table ── */}
        {hasReport && (
          <div className="glwr-wrap mt-3">

            {/* Summary pills */}
            <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
              {[
                { label: "Grainage", value: selectedGrainage?.grainageMasterName || "—", accent: "#bee3f8", bg: "linear-gradient(135deg,#ebf8ff,#e6fffa)", text: "#2b6cb0" },
                { label: "Month",    value: `${monthLabel} ${monthKn}`,                   accent: "#9ae6b4", bg: "linear-gradient(135deg,#f0fff4,#f7fafc)", text: "#276749" },
                { label: "FY",       value: fyLabel,                                       accent: "#d6bcfa", bg: "linear-gradient(135deg,#faf5ff,#f5f0ff)", text: "#553c9a" },
              ].map((p) => (
                <div key={p.label} style={{ background: p.bg, border: `1.5px solid ${p.accent}`, borderRadius: "10px", padding: "8px 16px", display: "flex", flexDirection: "column", minWidth: "130px" }}>
                  <span style={{ fontSize: "10px", color: p.text, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{p.label}</span>
                  <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700, marginTop: "1px" }}>{p.value}</span>
                </div>
              ))}
              <div style={{ marginLeft: "auto" }}>
                <span style={{ background: "#edf2f7", border: "1.5px solid #cbd5e0", borderRadius: "20px", padding: "5px 14px", fontSize: "12px", color: "#4a5568", fontWeight: 600 }}>
                  {reportRows.length} rows
                </span>
              </div>
            </div>

            <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 3px 20px rgba(106,17,203,0.10)", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    {/* Row 1 */}
                    <tr>
                      <th rowSpan={2} style={thBase("#1e3a8a", "50px", "center")}>ಕ್ರ.ಸಂ</th>
                      <th rowSpan={2} style={{ ...thBase("#1e3a8a", "auto", "left"), minWidth: "220px", padding: "11px 14px" }}>ವಿವರಗಳು</th>
                      {weekTheme.map((wk, i) => (
                        <th key={i} style={thBase(wk.hdr, "auto", "center")}>
                          {i + 1}ನೇ ತಂಡ
                        </th>
                      ))}
                    </tr>
                    {/* Row 2 (sub-header label) */}
                    <tr>
                      {weekTheme.map((wk, i) => (
                        <th key={i} style={{ background: wk.subHdr, color: "#fff", padding: "7px 12px", textAlign: "center", fontSize: "11.5px", fontWeight: 600, borderBottom: "2px solid rgba(255,255,255,0.25)" }}>
                          {["1ನೇ ವಾರ","2ನೇ ವಾರ","3ನೇ ವಾರ","4ನೇ ವಾರ"][i]}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {reportRows.map((row, idx) => {
                      const isAlt = idx % 2 === 1;
                      const rowBg = isAlt ? "#f7fafd" : "#fff";
                      const sn    = row.serial_number ?? row.serialNumber ?? idx + 1;
                      const desc  = row.description_kannada ?? row.descriptionKannada ?? "";
                      const vals  = [
                        row.week1_val ?? row.week1Val ?? "",
                        row.week2_val ?? row.week2Val ?? "",
                        row.week3_val ?? row.week3Val ?? "",
                        row.week4_val ?? row.week4Val ?? "",
                      ];
                      const isText = TEXT_ROWS.has(Number(sn));

                      return (
                        <tr key={idx} className="glwr-tr" style={{ background: rowBg }}>
                          <td style={{ padding: "10px 10px", textAlign: "center", borderBottom: "1px solid #e8edf5", borderRight: "1px solid #e8edf5", fontWeight: 700, color: "#6a11cb", fontSize: "12.5px" }}>
                            {sn}
                          </td>
                          <td style={{ padding: "10px 14px", borderBottom: "1px solid #e8edf5", borderRight: "1px solid #e8edf5", color: "#2d3748", fontWeight: 500 }}>
                            {desc}
                          </td>
                          {vals.map((v, wi) => (
                            <td key={wi} style={{
                              padding: "10px 12px",
                              textAlign: isText ? "center" : "right",
                              borderBottom: "1px solid #e8edf5",
                              borderRight: wi < 3 ? "1px solid #e8edf5" : undefined,
                              fontVariantNumeric: "tabular-nums",
                              fontWeight: 600,
                              color: weekTheme[wi].num,
                              background: isAlt ? weekTheme[wi].numBg + "44" : undefined,
                              fontSize: "12.5px",
                            }}>
                              {v === "" || v === null || v === undefined ? "—" : v}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                    {reportRows.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          No data available for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div style={{ background: "linear-gradient(135deg,#f7fafc,#edf2f7)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #e2e8f0" }}>
                <span style={{ fontSize: "12px", color: "#718096", fontWeight: 600 }}>
                  ಬಿತ್ತನೆಕೋಠಿ {selectedGrainage?.grainageMasterName || ""} — {monthLabel} {monthKn} · {fyLabel}
                </span>
                <div className="d-flex gap-2">
                  <button onClick={handlePdf} disabled={isDownloadingPdf} type="button"
                    style={{ background: isDownloadingPdf ? "#c8d6e5" : "linear-gradient(135deg,#276749,#38a169)", border: "none", borderRadius: "7px", padding: "6px 16px", fontWeight: 700, fontSize: "12px", color: "#fff", cursor: isDownloadingPdf ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                    {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" style={{ width: "13px", height: "13px" }} /> …</> : <>📥 PDF</>}
                  </button>
                  <button onClick={handleExcel} disabled={isDownloadingExcel} type="button"
                    style={{ background: isDownloadingExcel ? "#c8d6e5" : "linear-gradient(135deg,#1d6a3a,#22883f)", border: "none", borderRadius: "7px", padding: "6px 16px", fontWeight: 700, fontSize: "12px", color: "#fff", cursor: isDownloadingExcel ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                    {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" style={{ width: "13px", height: "13px" }} /> …</> : <>🟢 Excel</>}
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

function thBase(bg, width, align) {
  return {
    background: bg, color: "#fff", padding: "11px 12px",
    textAlign: align, fontWeight: 700, fontSize: "13px",
    borderRight: "1px solid rgba(255,255,255,0.18)",
    borderBottom: "1px solid rgba(255,255,255,0.18)",
    whiteSpace: "nowrap",
    ...(width !== "auto" ? { width } : {}),
  };
}

export default GrainageLotWiseReport;
