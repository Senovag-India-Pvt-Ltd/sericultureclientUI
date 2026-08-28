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

const LOT_COLORS = [
  { hdr: "#1a6faf", sub: "#2980b9", light: "#dbeafe", dark: "#1e3a8a" },
  { hdr: "#0369a1", sub: "#0284c7", light: "#e0f2fe", dark: "#0c4a6e" },
  { hdr: "#0e7490", sub: "#0891b2", light: "#cffafe", dark: "#164e63" },
  { hdr: "#0f766e", sub: "#0d9488", light: "#ccfbf1", dark: "#134e4a" },
];

if (!document.getElementById("gfr-styles")) {
  const s = document.createElement("style");
  s.id = "gfr-styles";
  s.innerHTML = `
    .gfr-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gfr-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gfr-swal .swal2-icon { margin:20px auto 4px !important; }
    .gfr-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gfr-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gfr-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .gfr-wrap { animation: gfr-in .3s ease; }
    .gfr-tr:hover td { background:#e8f4fd !important; transition:background .12s; }
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

function GrainageFarmReport() {
  const { t, i18n } = useTranslation();

  const [filter, setFilter] = useState({ grainageMasterId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [grainageList,      setGrainageList]      = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [lotNames,           setLotNames]           = useState(["", "", "", ""]);
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
    setLotNames(["", "", "", ""]);
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
      background: "#fff", customClass: { popup: "gfr-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gfr-swal" },
    });

  const params = () => ({ grainageId: filter.grainageMasterId, fyStartYear, month: filter.month });

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setDataRows([]);
    setLotNames(["", "", "", ""]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-report", { params: params() });
      const all = Array.isArray(res.data) ? res.data : [];
      const hdr = all.find((r) => Number(r.serial_number) === 0);
      if (hdr) setLotNames([hdr.lot1_val || "", hdr.lot2_val || "", hdr.lot3_val || "", hdr.lot4_val || ""]);
      setDataRows(all.filter((r) => Number(r.serial_number) > 0));
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Farm Technical Achievement report.");
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-report/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-report/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `grainage_farm_report_${filter.grainageMasterId}_${fyStartYear}_${filter.month}.xlsx`;
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
  const grainageName = i18n.language === "kn"
    ? (selectedGrainage?.grainageMasterNameInKannada || selectedGrainage?.grainageMasterName || "—")
    : (selectedGrainage?.grainageMasterName || "—");

  return (
    <Layout title={t("Farm Technical Achievement Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("ಸಾಕಣಾ ಕ್ಷೇತ್ರಗಳ ತಾಂತ್ರಿಕ ಸಾಧನೆ")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(13,71,138,.10)" }}>
          <div style={{
            background: "linear-gradient(135deg,#0d478a 0%,#1a6faf 60%,#2980b9 100%)",
            padding: "10px 18px", display: "flex", alignItems: "center",
            gap: "10px", borderRadius: "12px 12px 0 0",
          }}>
            <span style={{ fontSize: "18px" }}>🌾</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", lineHeight: 1.2 }}>ಸಾಕಣಾ ಕ್ಷೇತ್ರಗಳ ತಾಂತ್ರಿಕ ಸಾಧನೆ</div>
              <div style={{ color: "rgba(255,255,255,.78)", fontSize: "11px" }}>P4 BSF Kunigal — Farm Technical Achievement Report</div>
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
                      <option key={g.grainageMasterId} value={g.grainageMasterId}>{i18n.language === "kn" ? (g.grainageMasterNameInKannada || g.grainageMasterName) : g.grainageMasterName}</option>
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
                      <option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0d478a,#1a6faf)", "0 3px 10px rgba(13,71,138,.30)", isLoading)}>
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
          <div className="gfr-wrap mt-4">
            {/* Summary pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#e0f2fe)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "160px" }}>
                <span style={{ fontSize: "11px", color: "#1e40af", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Grainage</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{grainageName}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0f2fe,#f0f9ff)", border: "1.5px solid #7dd3fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "140px" }}>
                <span style={{ fontSize: "11px", color: "#0369a1", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Month</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthKn}</span>
              </div>
              {lotNames.filter((n) => n).map((name, i) => (
                <div key={i} style={{ background: "#fff", border: `1.5px solid ${LOT_COLORS[i].light}`, borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "120px" }}>
                  <span style={{ fontSize: "11px", color: LOT_COLORS[i].dark, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ತಂಡ {i + 1}</span>
                  <span style={{ fontSize: "13px", color: LOT_COLORS[i].hdr, fontWeight: 700, marginTop: "2px" }}>{name}</span>
                </div>
              ))}
              <div style={{ marginLeft: "auto" }}>
                <span style={{ background: "linear-gradient(135deg,#edf2f7,#e2e8f0)", border: "1.5px solid #cbd5e0", borderRadius: "20px", padding: "6px 16px", fontSize: "12px", color: "#4a5568", fontWeight: 600 }}>
                  {dataRows.length} rows
                </span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(13,71,138,.10)", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                  <thead>
                    {/* Header row 1 */}
                    <tr>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#0d478a,#1a6faf)", color: "#fff", padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,.2)", fontWeight: 700, whiteSpace: "nowrap", width: "50px" }}>
                        ಕ್ರ.ಸಂ
                      </th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#0d478a,#1a6faf)", color: "#fff", padding: "12px 16px", textAlign: "left", border: "1px solid rgba(255,255,255,.2)", fontWeight: 700, minWidth: "240px" }}>
                        ವಿವರಗಳು
                      </th>
                      <th colSpan={4} style={{ background: "linear-gradient(135deg,#1a6faf,#2980b9)", color: "#fff", padding: "10px 16px", textAlign: "center", border: "1px solid rgba(255,255,255,.2)", fontWeight: 700 }}>
                        ತಂಡ ಸಂಖ್ಯೆ
                      </th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#083344,#0e4d6b)", color: "#fff", padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,.2)", fontWeight: 700, minWidth: "90px" }}>
                        ಒಟ್ಟು
                      </th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#083344,#0e4d6b)", color: "#fff", padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,.2)", fontWeight: 700, minWidth: "90px" }}>
                        ಸಂಚಿತ
                      </th>
                    </tr>
                    {/* Header row 2 — lot names */}
                    <tr>
                      {lotNames.map((name, i) => (
                        <th key={i} style={{ background: LOT_COLORS[i].hdr, color: "#fff", padding: "8px 12px", textAlign: "center", border: "1px solid rgba(255,255,255,.2)", fontWeight: 700, fontSize: "12.5px", minWidth: "110px" }}>
                          {name || `ತಂಡ ${i + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, idx) => {
                      const sn  = Number(row.serial_number);
                      const alt = idx % 2 === 1;
                      const bg  = alt ? "#f7fafd" : "#fff";
                      return (
                        <tr key={sn} className="gfr-tr" style={{ background: bg }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#e8f4fd")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = bg)}
                        >
                          <td style={{ padding: "11px 10px", textAlign: "center", borderBottom: "1px solid #e8edf5", borderRight: "1px solid #e8edf5", fontWeight: 700, color: "#1a6faf", fontSize: "13px" }}>
                            {String(sn).padStart(2, "0")}
                          </td>
                          <td style={{ padding: "11px 16px", borderBottom: "1px solid #e8edf5", borderRight: "1px solid #e8edf5", color: "#2d3748", fontWeight: 500 }}>
                            {row.description_kannada || ""}
                          </td>
                          {[row.lot1_val, row.lot2_val, row.lot3_val, row.lot4_val].map((val, ci) => (
                            <td key={ci} style={{ padding: "11px 14px", textAlign: "right", borderBottom: "1px solid #e8edf5", borderRight: "1px solid #e8edf5", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: LOT_COLORS[ci].dark, background: val && val !== "0" ? (alt ? LOT_COLORS[ci].light + "aa" : LOT_COLORS[ci].light + "66") : undefined, fontSize: "13px" }}>
                              {val || "—"}
                            </td>
                          ))}
                          <td style={{ padding: "11px 14px", textAlign: "right", borderBottom: "1px solid #e8edf5", borderRight: "1px solid #e8edf5", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: "#0d478a", background: "#d0e8ff", fontSize: "13px" }}>
                            {row.total_val || "—"}
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "right", borderBottom: "1px solid #e8edf5", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: "#083344", background: "#b8d9f5", fontSize: "13px" }}>
                            {row.cumul_val || "—"}
                          </td>
                        </tr>
                      );
                    })}
                    {dataRows.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>No data available for the selected filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div style={{ background: "linear-gradient(135deg,#f7fafc,#edf2f7)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #e2e8f0" }}>
                <span style={{ fontSize: "12px", color: "#718096", fontWeight: 600 }}>
                  {grainageName} — {monthLabel} {monthKn} ಮಾಹೆ
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

export default GrainageFarmReport;
