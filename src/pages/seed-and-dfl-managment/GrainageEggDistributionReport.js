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
  { key: "week1_val", label: "1ನೇ ವಾರ" },
  { key: "week2_val", label: "2ನೇ ವಾರ" },
  { key: "week3_val", label: "3ನೇ ವಾರ" },
  { key: "week4_val", label: "4ನೇ ವಾರ" },
];

// week column colour theme
const WEEK_THEME = [
  { hdr: "#be185d", sub: "#db2777", num: "#831843", numBg: "#fce7f3" },
  { hdr: "#7c3aed", sub: "#8b5cf6", num: "#4c1d95", numBg: "#ede9fe" },
  { hdr: "#0f766e", sub: "#0d9488", num: "#134e4a", numBg: "#ccfbf1" },
  { hdr: "#b45309", sub: "#d97706", num: "#78350f", numBg: "#fef3c7" },
];

if (!document.getElementById("gedr-styles")) {
  const s = document.createElement("style");
  s.id = "gedr-styles";
  s.innerHTML = `
    .gedr-swal { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22) !important; }
    .gedr-swal .swal2-title { font-size: 21px !important; font-weight: 800 !important; color: #1a202c !important; }
    .gedr-swal .swal2-icon { margin: 20px auto 4px !important; }
    .gedr-swal .swal2-html-container { margin: 0 !important; padding: 0 !important; }
    .gedr-swal .swal2-confirm { border-radius: 11px !important; padding: 12px 30px !important; font-weight: 700 !important; }
    @keyframes gedr-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
    .gedr-wrap { animation: gedr-in 0.3s ease; }
    .gedr-tr:hover td { background: #fff0f6 !important; }
    .gedr-total td { background: #1a3c5e !important; color: #fff !important; font-weight: 800 !important; }
  `;
  document.head.appendChild(s);
}

function GrainageEggDistributionReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ grainageMasterId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [grainageList,      setGrainageList]      = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [dataRows,           setDataRows]           = useState([]);
  const [totalRow,           setTotalRow]           = useState(null);
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
    setTotalRow(null);
    if (name === "financialYearMasterId") {
      const sel = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel ? extractYear(sel.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.grainageMasterId)      return "Please select a Grainage.";
    if (!filter.financialYearMasterId) return "Please select a Financial Year.";
    if (!filter.month)                 return "Please select a Month.";
    if (!fyStartYear)                  return "Could not determine the financial year start year.";
    return null;
  };

  const warn = (msg) =>
    Swal.fire({
      icon: "warning", title: "Required Fields",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 4px">Missing Selection</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.6">${msg}</p></div></div></div>`,
      confirmButtonText: "Got it", confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "gedr-swal" },
    });

  const errAlert = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 4px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.6">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gedr-swal" },
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
    setDataRows([]);
    setTotalRow(null);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/egg-distribution", { params: params() });
      const all = Array.isArray(res.data) ? res.data : [];
      setTotalRow(all.find((r) => Number(r.serial_number) === 99) || null);
      setDataRows(all.filter((r) => Number(r.serial_number) !== 99));
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
          errAlert("Fetch Failed", backendMsg || err?.message || "Failed to load the egg distribution report. Please try again.");
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/egg-distribution/pdf", {
        params: params(), responseType: "blob",
      });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/egg-distribution/excel", {
        params: params(), responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `grainage_egg_distribution_${filter.grainageMasterId}_${fyStartYear}_${filter.month}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      errAlert("Excel Failed", "Could not generate the Excel report. Please try again.");
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

  // compute week totals from dataRows for mini stat cards
  const weekTotals = WEEK_COLS.map((wc) =>
    dataRows.reduce((sum, r) => sum + (parseFloat(r[wc.key]) || 0), 0)
  );
  const grandTotal = totalRow ? (parseFloat(totalRow.total_val) || 0) : weekTotals.reduce((a, b) => a + b, 0);

  return (
    <Layout title={t("P4 Grainage Egg Distribution Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("P4 Grainage Egg Distribution Report")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ── */}
        <Card className="mt-1" style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(190,24,93,0.10)" }}>
          <div style={{
            background: "linear-gradient(135deg,#831843 0%,#be185d 55%,#f472b6 100%)",
            padding: "10px 18px", display: "flex", alignItems: "center",
            gap: "10px", borderRadius: "12px 12px 0 0",
          }}>
            <span style={{ fontSize: "18px" }}>🥚</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", lineHeight: 1.2 }}>ಮೊಟ್ಟೆ ವಿತರಣಾ ವಿವರ</div>
              <div style={{ color: "rgba(255,255,255,0.78)", fontSize: "11px" }}>P4 Grainage Egg Distribution Report — Farm-wise · 4 Weeks</div>
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
                  <label style={lblSt}>Grainage <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="grainageMasterId" value={filter.grainageMasterId} onChange={handleChange} style={selSt}>
                    <option value="">— Select Grainage —</option>
                    {grainageList.map((g) => (
                      <option key={g.grainageMasterId} value={g.grainageMasterId}>{g.grainageMasterName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lblSt}>Financial Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={selSt}>
                    <option value="">— Select Year —</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lblSt}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={selSt}>
                    <option value="">— Month —</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading}
                      style={mkBtn("linear-gradient(135deg,#831843,#be185d)", "0 3px 10px rgba(131,24,67,0.30)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf} onClick={handlePdf}
                      style={mkBtn("linear-gradient(135deg,#276749,#38a169)", "0 3px 10px rgba(39,103,73,0.28)", isDownloadingPdf)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📥 PDF</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel} onClick={handleExcel}
                      style={mkBtn("linear-gradient(135deg,#1d6a3a,#22883f)", "0 3px 10px rgba(29,106,58,0.28)", isDownloadingExcel)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>🟢 Excel</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* ── Report ── */}
        {hasReport && (
          <div className="gedr-wrap mt-3">

            {/* ── Summary pills + stat cards ── */}
            <div className="d-flex flex-wrap gap-2 mb-3 align-items-stretch">
              {/* Info pills */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", justifyContent: "center" }}>
                {[
                  { label: "Grainage", value: selectedGrainage?.grainageMasterName || "—", accent: "#fbcfe8", bg: "linear-gradient(135deg,#fff0f6,#fce7f3)", text: "#831843" },
                  { label: "Month",    value: `${monthLabel} ${monthKn}`,                   accent: "#bee3f8", bg: "linear-gradient(135deg,#ebf8ff,#e6fffa)",    text: "#2b6cb0" },
                  { label: "FY",       value: fyLabel,                                       accent: "#d6bcfa", bg: "linear-gradient(135deg,#faf5ff,#f5f0ff)",    text: "#553c9a" },
                ].map((p) => (
                  <div key={p.label} style={{ background: p.bg, border: `1.5px solid ${p.accent}`, borderRadius: "10px", padding: "6px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "10px", color: p.text, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", minWidth: "52px" }}>{p.label}</span>
                    <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700 }}>{p.value}</span>
                  </div>
                ))}
              </div>

              {/* Week stat cards */}
              {WEEK_COLS.map((wc, wi) => (
                <div key={wi} style={{
                  background: `linear-gradient(135deg,${WEEK_THEME[wi].hdr},${WEEK_THEME[wi].sub})`,
                  borderRadius: "12px", padding: "12px 18px",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  minWidth: "110px", flex: "1",
                  boxShadow: `0 4px 16px ${WEEK_THEME[wi].hdr}44`,
                }}>
                  <span style={{ color: "rgba(255,255,255,0.80)", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>{wc.label}</span>
                  <span style={{ color: "#fff", fontSize: "22px", fontWeight: 800, lineHeight: 1 }}>
                    {weekTotals[wi].toLocaleString()}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "10px", marginTop: "3px" }}>DFLs</span>
                </div>
              ))}

              {/* Grand total card */}
              <div style={{
                background: "linear-gradient(135deg,#1a3c5e,#2c5282)",
                borderRadius: "12px", padding: "12px 18px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                minWidth: "120px", flex: "1.2",
                boxShadow: "0 4px 16px rgba(26,60,94,0.40)",
              }}>
                <span style={{ color: "rgba(255,255,255,0.80)", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>ಒಟ್ಟು Total</span>
                <span style={{ color: "#fff", fontSize: "26px", fontWeight: 800, lineHeight: 1 }}>
                  {grandTotal.toLocaleString()}
                </span>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "10px", marginTop: "3px" }}>DFLs · {dataRows.length} Farms</span>
              </div>
            </div>

            {/* ── Table ── */}
            <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 3px 20px rgba(190,24,93,0.10)", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr>
                      <th style={thBase("#831843", "46px",  "center")}>ಕ್ರ.ಸಂ</th>
                      <th style={{ ...thBase("#831843", "auto", "left"), minWidth: "200px", padding: "11px 16px" }}>ಕೃಷಿ ಕ್ಷೇತ್ರ</th>
                      {WEEK_COLS.map((wc, wi) => (
                        <th key={wi} style={thBase(WEEK_THEME[wi].hdr, "auto", "center")}>
                          {wc.label}
                        </th>
                      ))}
                      <th style={thBase("#1a3c5e", "auto", "center")}>ಒಟ್ಟು</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dataRows.map((row, idx) => {
                      const isAlt = idx % 2 === 1;
                      const rowBg = isAlt ? "#fff0f6" : "#fff";
                      const sn    = row.serial_number ?? idx + 1;

                      return (
                        <tr key={idx} className="gedr-tr" style={{ background: rowBg }}>
                          <td style={{ padding: "10px 8px", textAlign: "center", borderBottom: "1px solid #fbcfe8", borderRight: "1px solid #fbcfe8", fontWeight: 700, color: "#be185d", fontSize: "12.5px" }}>
                            {sn}
                          </td>
                          <td style={{ padding: "10px 14px", borderBottom: "1px solid #fbcfe8", borderRight: "1px solid #fbcfe8", color: "#1a202c", fontWeight: 600 }}>
                            {row.farm_name || "—"}
                          </td>
                          {WEEK_COLS.map((wc, wi) => {
                            const val = row[wc.key];
                            return (
                              <td key={wi} style={{
                                padding: "10px 14px", textAlign: "right",
                                borderBottom: "1px solid #fbcfe8",
                                borderRight: "1px solid #fbcfe8",
                                fontVariantNumeric: "tabular-nums",
                                fontWeight: 600,
                                color: WEEK_THEME[wi].num,
                                background: isAlt ? WEEK_THEME[wi].numBg + "55" : undefined,
                                fontSize: "12.5px",
                              }}>
                                {val === "" || val === null || val === undefined ? "—" : val}
                              </td>
                            );
                          })}
                          <td style={{ padding: "10px 14px", textAlign: "right", borderBottom: "1px solid #fbcfe8", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: "#1a3c5e", fontSize: "12.5px", background: isAlt ? "#e2e8f055" : undefined }}>
                            {row.total_val || "—"}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Total row */}
                    {totalRow && (
                      <tr className="gedr-total">
                        <td colSpan={2} style={{ padding: "12px 16px", borderTop: "2px solid #1a3c5e", fontWeight: 800, fontSize: "13px", letterSpacing: "0.03em" }}>
                          ಒಟ್ಟು
                        </td>
                        {WEEK_COLS.map((wc, wi) => (
                          <td key={wi} style={{ padding: "12px 14px", textAlign: "right", borderTop: "2px solid #1a3c5e", fontVariantNumeric: "tabular-nums", fontWeight: 800, fontSize: "13px" }}>
                            {totalRow[wc.key] || "0"}
                          </td>
                        ))}
                        <td style={{ padding: "12px 14px", textAlign: "right", borderTop: "2px solid #1a3c5e", fontVariantNumeric: "tabular-nums", fontWeight: 800, fontSize: "14px" }}>
                          {totalRow.total_val || "0"}
                        </td>
                      </tr>
                    )}

                    {dataRows.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          No egg distribution data found for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer bar */}
              <div style={{
                background: "linear-gradient(135deg,#fff0f6,#fce7f3)",
                padding: "10px 20px", display: "flex", alignItems: "center",
                justifyContent: "space-between", flexWrap: "wrap", gap: "8px",
                borderTop: "1.5px solid #fbcfe8",
              }}>
                <span style={{ fontSize: "12px", color: "#831843", fontWeight: 600 }}>
                  ಬಿತ್ತನೆಕೋಠಿ {selectedGrainage?.grainageMasterName || ""} — {monthLabel} {monthKn} · {fyLabel} · {dataRows.length} Farms
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

export default GrainageEggDistributionReport;
