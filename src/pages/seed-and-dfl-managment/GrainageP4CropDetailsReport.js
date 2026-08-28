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

if (!document.getElementById("gp4c-styles")) {
  const s = document.createElement("style");
  s.id = "gp4c-styles";
  s.innerHTML = `
    .gp4c-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gp4c-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gp4c-swal .swal2-icon { margin:20px auto 4px !important; }
    .gp4c-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gp4c-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gp4c-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    @keyframes gp4c-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(91,87,172,.35);} 50% { box-shadow:0 0 0 8px rgba(91,87,172,0);} }
    .gp4c-wrap { animation: gp4c-in .35s ease; }
    .gp4c-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gp4c-pill { animation: gp4c-pulse 2.4s infinite; }
    .gp4c-table th { letter-spacing:.02em; }
    .gp4c-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
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

const hasVal = (v) => v !== null && v !== undefined && String(v).trim() !== "";

function GrainageP4CropDetailsReport() {
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
      background: "#fff", customClass: { popup: "gp4c-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gp4c-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/p4-crop-details", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the P4 Crop Details report.");
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/p4-crop-details/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/p4-crop-details/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `p4_crop_details_${filter.farmId}_${year}_${m}.xlsx`;
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
  const farmDisplay = (i18n.language === "kn" ? (selectedFarm?.farmNameInKannada || selectedFarm?.farmName) : selectedFarm?.farmName) || "ಬಿಳಿದೇವಾಲಯ";

  // Counts for KPI pills — how many rows have a value on each side.
  const harvestedFilled = dataRows.filter((r) => hasVal(r.harvested)).length;
  const hatchedFilled   = dataRows.filter((r) => hasVal(r.hatched)).length;

  return (
    <Layout title={t("P4 Crop Harvest & Hatching Details")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("ಪಿ4 ಬಿಳಿದೇವಾಲಯ — ಕಟಾವಾದ ಹಾಗೂ ಚಾಕಿಯಾದ ಬೆಳೆಗಳ ವಿವರಗಳು")}</Block.Title>
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
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🌾</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>ಕಟಾವಾದ ಹಾಗೂ ಚಾಕಿಯಾದ ಬೆಳೆಗಳ ವಿವರಗಳು</div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P4 Bilidevalaya Crop Harvest &amp; Hatching Details — 26-row crop summary</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                <span className="gp4c-pill" style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  H:{harvestedFilled} · h:{hatchedFilled}
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
                      <option key={f.farmId} value={f.farmId}>{i18n.language === "kn" ? (f.farmNameInKannada || f.farmName) : f.farmName}</option>
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

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="gp4c-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Farm</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{farmDisplay}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Period</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಕಟಾವಾದ Filled</span>
                <span className="gp4c-num" style={{ fontSize: "14px", color: "#134e4a", fontWeight: 800, marginTop: "2px" }}>{harvestedFilled} / {dataRows.length}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0e7ff,#eef2ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಚಾಕಿಯಾದ Filled</span>
                <span className="gp4c-num" style={{ fontSize: "14px", color: "#312e81", fontWeight: 800, marginTop: "2px" }}>{hatchedFilled} / {dataRows.length}</span>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{ background: "linear-gradient(135deg,#edf2f7,#e2e8f0)", border: "1.5px solid #cbd5e0", borderRadius: "20px", padding: "6px 16px", fontSize: "12px", color: "#4a5568", fontWeight: 600 }}>
                  {dataRows.length} rows
                </span>
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
                ಕಟಾವಾದ ಹಾಗೂ ಚಾಕಿಯಾದ ಬೆಳೆಗಳ ವಿವರಗಳು — {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  P4 Bilidevalaya Crop Harvest &amp; Hatching Details &nbsp;·&nbsp; {farmDisplay}
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="gp4c-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "900px" }}>
                  <thead>
                    <tr>
                      <th style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "12px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "70px",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.No</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "12px 16px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "440px",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರಗಳು</div>
                        <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Description</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(135deg,#0f766e,#14b8a6)",
                        color: "#fff", padding: "12px 14px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "190px",
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಕಟಾವಾದ ಬೆಳೆಗಳು</div>
                        <div style={{ fontSize: "10.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Harvested Crops</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(135deg,#4338ca,#6366f1)",
                        color: "#fff", padding: "12px 14px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "190px",
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಚಾಕಿಯಾದ ಬೆಳೆಗಳು</div>
                        <div style={{ fontSize: "10.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Hatched Crops</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, idx) => {
                      const alt = idx % 2 === 1;
                      const sn  = row.sl_no;
                      const harvHas  = hasVal(row.harvested);
                      const hatchHas = hasVal(row.hatched);
                      // Highlight rows where at least one side has data
                      const isActive = harvHas || hatchHas;

                      return (
                        <tr key={`${sn}-${idx}`} className="gp4c-tr" style={{ background: alt ? "#f8fafc" : "#ffffff" }}>
                          <td style={{
                            padding: "10px 8px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            background: alt ? "#f1f5f9" : "#f8fafc",
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "30px", height: "30px",
                              borderRadius: "50%",
                              background: isActive
                                ? "linear-gradient(135deg,#475569,#1e293b)"
                                : "linear-gradient(135deg,#cbd5e1,#94a3b8)",
                              color: "#fff", fontWeight: 800, fontSize: "12.5px",
                            }}>
                              {String(sn ?? "").padStart(2, "0")}
                            </span>
                          </td>
                          <td style={{
                            padding: "11px 16px",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            color: isActive ? "#0f172a" : "#64748b",
                            fontWeight: isActive ? 700 : 500,
                            fontSize: "13px",
                          }}>
                            {row.description_kannada || "—"}
                          </td>
                          <td className="gp4c-num" style={{
                            padding: "11px 14px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                            background: harvHas
                              ? "linear-gradient(135deg,#ccfbf1,#a7f3d0)"
                              : (alt ? "#f8fafc" : "#ffffff"),
                            color: harvHas ? "#134e4a" : "#cbd5e0",
                            fontWeight: 800, fontSize: "13px",
                          }}>
                            {harvHas ? row.harvested : "—"}
                          </td>
                          <td className="gp4c-num" style={{
                            padding: "11px 14px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0",
                            background: hatchHas
                              ? "linear-gradient(135deg,#e0e7ff,#c7d2fe)"
                              : (alt ? "#f8fafc" : "#ffffff"),
                            color: hatchHas ? "#312e81" : "#cbd5e0",
                            fontWeight: 800, fontSize: "13px",
                          }}>
                            {hatchHas ? row.hatched : "—"}
                          </td>
                        </tr>
                      );
                    })}
                    {dataRows.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {farmDisplay} — {monthLabel} {monthKn} {monthYear}
                  &nbsp;·&nbsp; {dataRows.length} rows · ಕಟಾವಾದ {harvestedFilled} · ಚಾಕಿಯಾದ {hatchedFilled}
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

export default GrainageP4CropDetailsReport;
