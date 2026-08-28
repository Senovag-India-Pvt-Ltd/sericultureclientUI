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

const DATA_KEYS = [
  "coc_w_lots", "coc_w_beds", "coc_w_diseased", "coc_w_avg",
  "coc_c_lots", "coc_c_beds", "coc_c_diseased", "coc_c_avg",
  "but_w_lots", "but_w_beds", "but_w_diseased", "but_w_avg",
  "but_c_lots", "but_c_beds", "but_c_diseased", "but_c_avg",
];

const LEAF_LABELS = ["ತಂಡಗಳು", "ಹಾಸಿಗೆಗಳು", "ಗಂಟು ರೋಗದ ಹಾಸಿಗೆಗಳು", "ಸರಾಸರಿ"];

// 4 column groups: coc-week, coc-cum, but-week, but-cum
const GROUP_THEME = [
  { hdr1: "#1a5276", hdr2: "#2471a3", hdr3: "#2e86c1", num: "#1a3a5c", numBg: "#d6eaf8" },
  { hdr1: "#1a5276", hdr2: "#1a7a8a", hdr3: "#1abc9c", num: "#0e4d5a", numBg: "#d1f2eb" },
  { hdr1: "#6c3483", hdr2: "#8e44ad", hdr3: "#a569bd", num: "#4a1a6b", numBg: "#e8daef" },
  { hdr1: "#6c3483", hdr2: "#117a65", hdr3: "#1abc9c", num: "#0b5345", numBg: "#a9dfbf" },
];

if (!document.getElementById("gcbr-styles")) {
  const s = document.createElement("style");
  s.id = "gcbr-styles";
  s.innerHTML = `
    .gcbr-swal { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22) !important; }
    .gcbr-swal .swal2-title { font-size: 21px !important; font-weight: 800 !important; color: #1a202c !important; }
    .gcbr-swal .swal2-icon { margin: 20px auto 4px !important; }
    .gcbr-swal .swal2-html-container { margin: 0 !important; padding: 0 !important; }
    .gcbr-swal .swal2-confirm { border-radius: 11px !important; padding: 12px 30px !important; font-weight: 700 !important; }
    @keyframes gcbr-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
    .gcbr-wrap { animation: gcbr-in 0.3s ease; }
    .gcbr-tr:hover td { background: #e8f8f5 !important; }
    .gcbr-th-leaf {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      white-space: nowrap;
      text-align: center;
      vertical-align: bottom;
      padding: 10px 6px 8px !important;
      font-size: 11px !important;
      min-width: 48px;
    }
  `;
  document.head.appendChild(s);
}

function GrainageCocoonButterflyReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ grainageMasterId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [grainageList,      setGrainageList]      = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [reportRows,         setReportRows]         = useState([]);
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
    setReportRows([]);
    if (name === "financialYearMasterId") {
      const sel = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel ? extractYear(sel.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.grainageMasterId)      return t("Please select a Grainage.", { ns: "reports" });
    if (!filter.financialYearMasterId) return t("Please select a Financial Year.", { ns: "reports" });
    if (!filter.month)                 return t("Please select a Month.", { ns: "reports" });
    if (!fyStartYear)                  return t("Could not determine the financial year start year.", { ns: "reports" });
    return null;
  };

  const warn = (msg) =>
    Swal.fire({
      icon: "warning", title: t("Required Fields", { ns: "reports" }),
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 4px">${t("Missing Selection", { ns: "reports" })}</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.6">${msg}</p></div></div></div>`,
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "gcbr-swal" },
    });

  const errAlert = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 4px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.6">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gcbr-swal" },
    });

  const params = () => ({
    grainageId: filter.grainageMasterId,
    fyStartYear,
    month: filter.month,
  });

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { warn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setReportRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/cocoon-butterfly", { params: params() });
      setReportRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          errAlert(t("No Data Found", { ns: "reports" }), t("No data found for the selected filters.", { ns: "reports" }));
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          errAlert(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the cocoon/butterfly report. Please try again.", { ns: "reports" }));
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/cocoon-butterfly/pdf", {
        params: params(), responseType: "blob",
      });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch {
      errAlert(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report. Please try again.", { ns: "reports" }));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleExcel = async () => {
    const err = validate();
    if (err) { warn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/cocoon-butterfly/excel", {
        params: params(), responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `grainage_cocoon_butterfly_${filter.grainageMasterId}_${fyStartYear}_${filter.month}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      errAlert(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report. Please try again.", { ns: "reports" }));
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedGrainage = grainageList.find(
    (g) => String(g.grainageMasterId) === String(filter.grainageMasterId)
  );
  const monthLabel = filter.month
    ? MONTHS.find((m) => String(m.value) === String(filter.month))?.label || ""
    : "";
  const monthKn = filter.month ? MONTH_KN[parseInt(filter.month, 10)] : "";
  const selectedFy = financialYearList.find(
    (f) => String(f.financialYearMasterId) === String(filter.financialYearMasterId)
  );
  const fyLabel = selectedFy?.financialYear || "—";

  const mkBtn = (bg, shadow, busy) => ({
    background: busy ? "#c8d6e5" : bg,
    border: "none", borderRadius: "8px", padding: "7px 16px",
    fontWeight: 700, fontSize: "13px", color: "#fff",
    cursor: busy ? "not-allowed" : "pointer",
    boxShadow: busy ? "none" : shadow,
    display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap",
  });
  const selSt = { borderRadius: "7px", border: "1.5px solid #d0d9e8", padding: "6px 10px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
  const lblSt = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "3px", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" };

  // group index for a data column index 0-15
  const groupOf = (colIdx) => Math.floor(colIdx / 4);

  return (
    <Layout title={t("P4 Cocoon / Butterfly Examination Report", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("P4 Cocoon / Butterfly Examination Report", { ns: "reports" })}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ── */}
        <Card className="mt-1" style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(26,82,118,0.10)" }}>
          <div style={{
            background: "linear-gradient(135deg,#0e4d5a 0%,#148f77 55%,#1abc9c 100%)",
            padding: "10px 18px", display: "flex", alignItems: "center",
            gap: "10px", borderRadius: "12px 12px 0 0",
          }}>
            <span style={{ fontSize: "18px" }}>🦋</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", lineHeight: 1.2 }}>ಕೋಶ / ಚಿಟ್ಟೆ ಪರೀಕ್ಷ ವಿವರ</div>
              <div style={{ color: "rgba(255,255,255,0.78)", fontSize: "11px" }}>P4 Cocoon / Butterfly Examination Report — 4 Weeks · 16 Columns</div>
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
                  <label style={lblSt}>{t("Grainage")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="grainageMasterId" value={filter.grainageMasterId} onChange={handleChange} style={selSt}>
                    <option value="">{`— ${t("Select Grainage", { ns: "reports" })} —`}</option>
                    {grainageList.map((g) => (
                      <option key={g.grainageMasterId} value={g.grainageMasterId}>{g.grainageMasterName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lblSt}>{t("Financial Year", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={selSt}>
                    <option value="">{t("— Select Year —", { ns: "reports" })}</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lblSt}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={selSt}>
                    <option value="">{t("— Month —", { ns: "reports" })}</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading}
                      style={mkBtn("linear-gradient(135deg,#0e4d5a,#148f77)", "0 3px 10px rgba(14,77,90,0.28)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> {t("Loading…", { ns: "reports" })}</> : <>📋 {t("View")}</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf} onClick={handlePdf}
                      style={mkBtn("linear-gradient(135deg,#276749,#38a169)", "0 3px 10px rgba(39,103,73,0.28)", isDownloadingPdf)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📥 {t("PDF")}</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel} onClick={handleExcel}
                      style={mkBtn("linear-gradient(135deg,#1d6a3a,#22883f)", "0 3px 10px rgba(29,106,58,0.28)", isDownloadingExcel)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>🟢 {t("Excel", { ns: "reports" })}</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* ── Report Table ── */}
        {hasReport && (
          <div className="gcbr-wrap mt-3">

            {/* Summary pills */}
            <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
              {[
                { label: t("Grainage"), value: selectedGrainage?.grainageMasterName || "—", accent: "#a2d9ce", bg: "linear-gradient(135deg,#e8f8f5,#d5f5e3)", text: "#0e6655" },
                { label: t("Month"),    value: `${monthLabel} ${monthKn}`,                   accent: "#bee3f8", bg: "linear-gradient(135deg,#ebf8ff,#e6fffa)", text: "#2b6cb0" },
                { label: t("FY", { ns: "reports" }), value: fyLabel,                         accent: "#d6bcfa", bg: "linear-gradient(135deg,#faf5ff,#f5f0ff)", text: "#553c9a" },
              ].map((p) => (
                <div key={p.label} style={{ background: p.bg, border: `1.5px solid ${p.accent}`, borderRadius: "10px", padding: "8px 16px", display: "flex", flexDirection: "column", minWidth: "130px" }}>
                  <span style={{ fontSize: "10px", color: p.text, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{p.label}</span>
                  <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700, marginTop: "1px" }}>{p.value}</span>
                </div>
              ))}
              {/* legend */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginLeft: "auto" }}>
                {[
                  { label: "ಕೋಶ · ವಾರ", color: GROUP_THEME[0].hdr2 },
                  { label: "ಕೋಶ · ಒಟ್ಟು", color: GROUP_THEME[1].hdr2 },
                  { label: "ಚಿಟ್ಟೆ · ವಾರ", color: GROUP_THEME[2].hdr2 },
                  { label: "ಚಿಟ್ಟೆ · ಒಟ್ಟು", color: GROUP_THEME[3].hdr2 },
                ].map((l) => (
                  <span key={l.label} style={{ background: l.color, color: "#fff", borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: 700 }}>
                    {l.label}
                  </span>
                ))}
              </div>
            </div>

            <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 3px 20px rgba(14,77,90,0.10)", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
                  <thead>

                    {/* ── Header row 1: Week# | ಕೋಶ (8) | ಚಿಟ್ಟೆ (8) ── */}
                    <tr>
                      <th rowSpan={3} style={thBase("#0d3b4e", "46px", "center")}>
                        ವಾರ
                      </th>
                      {/* ಕೋಶ spans 8 */}
                      <th colSpan={8} style={thBase(GROUP_THEME[0].hdr1, "auto", "center")}>
                        ಕೋಶ
                      </th>
                      {/* ಚಿಟ್ಟೆ spans 8 */}
                      <th colSpan={8} style={thBase(GROUP_THEME[2].hdr1, "auto", "center")}>
                        ಚಿಟ್ಟೆ
                      </th>
                    </tr>

                    {/* ── Header row 2: ವಾರದಲ್ಲಿ (4) | ವಾರಾಂತ್ಯ (4) | ವಾರದಲ್ಲಿ (4) | ವಾರಾಂತ್ಯ (4) ── */}
                    <tr>
                      {[
                        { label: "ವಾರದಲ್ಲಿ", theme: GROUP_THEME[0] },
                        { label: "ವಾರಾಂತ್ಯ",  theme: GROUP_THEME[1] },
                        { label: "ವಾರದಲ್ಲಿ", theme: GROUP_THEME[2] },
                        { label: "ವಾರಾಂತ್ಯ",  theme: GROUP_THEME[3] },
                      ].map((g2, i) => (
                        <th key={i} colSpan={4} style={{
                          background: g2.theme.hdr2, color: "#fff",
                          padding: "8px 10px", textAlign: "center",
                          fontWeight: 700, fontSize: "12px",
                          borderRight: "1px solid rgba(255,255,255,0.20)",
                          borderBottom: "1px solid rgba(255,255,255,0.20)",
                        }}>
                          {g2.label}
                        </th>
                      ))}
                    </tr>

                    {/* ── Header row 3: leaf labels (vertical) ── */}
                    <tr>
                      {DATA_KEYS.map((_, ci) => (
                        <th key={ci} className="gcbr-th-leaf" style={{
                          background: GROUP_THEME[groupOf(ci)].hdr3,
                          color: "#fff",
                          borderRight: "1px solid rgba(255,255,255,0.18)",
                          borderBottom: "2px solid rgba(255,255,255,0.30)",
                          height: "90px",
                        }}>
                          {LEAF_LABELS[ci % 4]}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {reportRows.map((row, idx) => {
                      const isAlt = idx % 2 === 1;
                      const rowBg = isAlt ? "#e8f8f5" : "#fff";
                      const wn    = row.week_num ?? row.weekNum ?? idx + 1;

                      return (
                        <tr key={idx} className="gcbr-tr" style={{ background: rowBg }}>
                          {/* week number */}
                          <td style={{
                            padding: "10px 8px", textAlign: "center",
                            borderBottom: "1px solid #a2d9ce",
                            borderRight: "2px solid #0d3b4e",
                            fontWeight: 800, color: "#0e4d5a", fontSize: "13px",
                          }}>
                            {String(wn).padStart(2, "0")}
                          </td>

                          {/* 16 data columns */}
                          {DATA_KEYS.map((key, ci) => {
                            const grp = groupOf(ci);
                            const val = row[key];
                            const isEmpty = val === null || val === undefined || val === "";
                            const isLast  = ci % 4 === 3;
                            return (
                              <td key={ci} style={{
                                padding: "10px 10px",
                                textAlign: "center",
                                borderBottom: "1px solid #a2d9ce",
                                borderRight: isLast
                                  ? `2px solid ${GROUP_THEME[grp].hdr1}`
                                  : "1px solid #d1e8e2",
                                fontVariantNumeric: "tabular-nums",
                                fontWeight: 600,
                                color: GROUP_THEME[grp].num,
                                background: isAlt ? GROUP_THEME[grp].numBg + "66" : undefined,
                                fontSize: "12.5px",
                              }}>
                                {isEmpty ? "—" : val}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                    {reportRows.length === 0 && (
                      <tr>
                        <td colSpan={17} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          {t("No data available for the selected filters.", { ns: "reports" })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer bar */}
              <div style={{
                background: "linear-gradient(135deg,#e8f8f5,#d5f5e3)",
                padding: "10px 20px", display: "flex", alignItems: "center",
                justifyContent: "space-between", flexWrap: "wrap", gap: "8px",
                borderTop: "1.5px solid #a2d9ce",
              }}>
                <span style={{ fontSize: "12px", color: "#0e6655", fontWeight: 600 }}>
                  ಬಿತ್ತನೆಕೋಠಿ {selectedGrainage?.grainageMasterName || ""} — {monthLabel} {monthKn} · {fyLabel}
                </span>
                <div className="d-flex gap-2">
                  <button onClick={handlePdf} disabled={isDownloadingPdf} type="button"
                    style={{ background: isDownloadingPdf ? "#c8d6e5" : "linear-gradient(135deg,#276749,#38a169)", border: "none", borderRadius: "7px", padding: "6px 16px", fontWeight: 700, fontSize: "12px", color: "#fff", cursor: isDownloadingPdf ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                    {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" style={{ width: "13px", height: "13px" }} /> …</> : <>📥 {t("PDF")}</>}
                  </button>
                  <button onClick={handleExcel} disabled={isDownloadingExcel} type="button"
                    style={{ background: isDownloadingExcel ? "#c8d6e5" : "linear-gradient(135deg,#1d6a3a,#22883f)", border: "none", borderRadius: "7px", padding: "6px 16px", fontWeight: 700, fontSize: "12px", color: "#fff", cursor: isDownloadingExcel ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                    {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" style={{ width: "13px", height: "13px" }} /> …</> : <>🟢 {t("Excel", { ns: "reports" })}</>}
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
    background: bg, color: "#fff", padding: "10px 12px",
    textAlign: align, fontWeight: 700, fontSize: "13px",
    borderRight: "1px solid rgba(255,255,255,0.18)",
    borderBottom: "1px solid rgba(255,255,255,0.18)",
    whiteSpace: "nowrap",
    ...(width !== "auto" ? { width } : {}),
  };
}

export default GrainageCocoonButterflyReport;
