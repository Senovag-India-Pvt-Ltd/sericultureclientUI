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

// Week columns shown in row order from the backend
const WEEK_COLS = [
  { key: "week1", label: "I",   range: "1-7",    sub: "Week 1" },
  { key: "week2", label: "II",  range: "8-14",   sub: "Week 2" },
  { key: "week3", label: "III", range: "15-21",  sub: "Week 3" },
  { key: "week4", label: "IV",  range: "22-end", sub: "Week 4" },
];

if (!document.getElementById("gchr-styles")) {
  const s = document.createElement("style");
  s.id = "gchr-styles";
  s.innerHTML = `
    .gchr-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gchr-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gchr-swal .swal2-icon { margin:20px auto 4px !important; }
    .gchr-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gchr-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gchr-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    @keyframes gchr-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(91,87,172,.35);} 50% { box-shadow:0 0 0 8px rgba(91,87,172,0);} }
    .gchr-wrap { animation: gchr-in .35s ease; }
    .gchr-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gchr-pill { animation: gchr-pulse 2.4s infinite; }
    .gchr-table th { letter-spacing:.02em; }
    .gchr-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gchr-scroll::-webkit-scrollbar { height:9px; }
    .gchr-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .gchr-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#14b8a6,#0f766e); border-radius:6px; }
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

function GrainageCropHarvestReport() {
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
      background: "#fff", customClass: { popup: "gchr-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gchr-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/crop-harvest", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Crop Harvest Details report.");
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/crop-harvest/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/crop-harvest/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `crop_harvest_${filter.farmId}_${year}_${m}.xlsx`;
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
  const farmDisplay = selectedFarm?.farmName || "—";

  // Aggregations for summary pills
  const totalMonth = dataRows.reduce((acc, r) => acc + numOrZero(r.monthly_total), 0);
  const totalCumul = dataRows.reduce((acc, r) => acc + numOrZero(r.cumulative_total), 0);
  const filledRows = dataRows.filter((r) => numOrZero(r.monthly_total) > 0).length;

  return (
    <Layout title={t("Crop Harvest Details Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("ಕಟಾವಾದ ಹಾಗೂ ಚಾಕಿಯಾದ ಬೆಳೆಗಳ ವಿವರಗಳು")}</Block.Title>
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
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Crop Harvest Details — Weekly progress with month & FY-cumulative totals</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                <span className="gchr-pill" style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {filledRows}/{dataRows.length} active
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

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="gchr-wrap mt-4">
            {/* Summary pills */}
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
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Active Rows</span>
                <span className="gchr-num" style={{ fontSize: "14px", color: "#134e4a", fontWeight: 800, marginTop: "2px" }}>{filledRows} / {dataRows.length}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0e7ff,#eef2ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಮಾಸ Total</span>
                <span className="gchr-num" style={{ fontSize: "14px", color: "#312e81", fontWeight: 800, marginTop: "2px" }}>{totalMonth.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ddd6fe,#ede9fe)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#6d28d9", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಮಾಸಾಂತ್ಯ Cumulative</span>
                <span className="gchr-num" style={{ fontSize: "14px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{totalCumul.toLocaleString()}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              {/* Title strip on top of table (PDF/Excel parity) */}
              <div style={{
                background: "linear-gradient(135deg,#134e4a,#0f766e 60%,#5b57ac)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ಕಟಾವಾದ ಹಾಗೂ ಚಾಕಿಯಾದ ಬೆಳೆಗಳ ವಿವರಗಳು &nbsp;·&nbsp; Crop Harvest Details
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  {farmDisplay} &nbsp;|&nbsp; {monthKn} {monthYear || ""}
                </div>
              </div>

              <div className="gchr-scroll" style={{ overflowX: "auto" }}>
                <table className="gchr-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "1100px" }}>
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
                        minWidth: "320px",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರಣೆಗಳು</div>
                        <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Description</div>
                      </th>
                      {WEEK_COLS.map((w) => (
                        <th key={w.key} style={{
                          background: "linear-gradient(135deg,#0f766e,#14b8a6)",
                          color: "#fff", padding: "12px 10px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                          minWidth: "120px",
                        }}>
                          <div style={{ fontSize: "13px", fontWeight: 800 }}>{w.label} ({w.range})</div>
                          <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>{w.sub}</div>
                        </th>
                      ))}
                      <th style={{
                        background: "linear-gradient(135deg,#5b57ac,#7c78d4)",
                        color: "#fff", padding: "12px 10px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "130px",
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಮಾಸ</div>
                        <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Month Total</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(135deg,#3f3c82,#5b57ac)",
                        color: "#fff", padding: "12px 10px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "140px",
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಮಾಸಾಂತ್ಯ</div>
                        <div style={{ fontSize: "10px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>FY-Cumulative</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, idx) => {
                      const alt = idx % 2 === 1;
                      const sn  = row.sl_no;
                      const wkVals = WEEK_COLS.map((w) => numOrZero(row[w.key]));
                      const wkMax  = Math.max(...wkVals, 0);
                      const monthVal = numOrZero(row.monthly_total);
                      const cumVal   = numOrZero(row.cumulative_total);

                      return (
                        <tr key={`${sn}-${idx}`} className="gchr-tr" style={{ background: alt ? "#f8fafc" : "#ffffff" }}>
                          <td style={{
                            padding: "12px 8px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            background: alt ? "#f1f5f9" : "#f8fafc",
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "28px", height: "28px", padding: "0 9px",
                              borderRadius: "50%", background: "linear-gradient(135deg,#cbd5e1,#94a3b8)",
                              color: "#1e293b", fontWeight: 800, fontSize: "12px",
                            }}>
                              {String(sn ?? "").padStart(2, "0")}
                            </span>
                          </td>
                          <td style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            color: "#0f172a", fontWeight: 600, fontSize: "13px",
                          }}>
                            {row.description_kannada || "—"}
                          </td>
                          {WEEK_COLS.map((w, i) => {
                            const v = wkVals[i];
                            const has = v > 0;
                            const pct = wkMax > 0 ? Math.min(100, (v / wkMax) * 100) : 0;
                            return (
                              <td key={w.key} className="gchr-num" style={{
                                padding: "10px 12px", textAlign: "center",
                                borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                                background: alt ? "#f0fdfa" : "#ffffff",
                                color: has ? "#134e4a" : "#cbd5e0",
                                fontWeight: 700, fontSize: "13px", verticalAlign: "middle",
                              }}>
                                <div>{has ? (row[w.key] ?? v) : "—"}</div>
                                {has && wkMax > 0 && (
                                  <div style={{
                                    marginTop: "5px",
                                    height: "4px", borderRadius: "4px",
                                    background: "#e2e8f0", overflow: "hidden",
                                  }}>
                                    <div style={{
                                      height: "100%", width: `${pct}%`,
                                      background: "linear-gradient(135deg,#14b8a6,#0f766e)",
                                      borderRadius: "4px", transition: "width .3s",
                                    }} />
                                  </div>
                                )}
                              </td>
                            );
                          })}
                          <td className="gchr-num" style={{
                            padding: "12px 12px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                            background: monthVal > 0
                              ? "linear-gradient(135deg,#e0e7ff,#eef2ff)"
                              : (alt ? "#f1f5f9" : "#ffffff"),
                            color: monthVal > 0 ? "#312e81" : "#cbd5e0",
                            fontWeight: 800, fontSize: "13.5px",
                          }}>
                            {monthVal > 0 ? (row.monthly_total ?? monthVal) : "—"}
                          </td>
                          <td className="gchr-num" style={{
                            padding: "12px 12px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0",
                            background: cumVal > 0
                              ? "linear-gradient(135deg,#ddd6fe,#ede9fe)"
                              : (alt ? "#f1f5f9" : "#ffffff"),
                            color: cumVal > 0 ? "#4c1d95" : "#cbd5e0",
                            fontWeight: 800, fontSize: "13.5px",
                          }}>
                            {cumVal > 0 ? (row.cumulative_total ?? cumVal) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                    {dataRows.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
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
                  &nbsp;·&nbsp; {dataRows.length} rows · {filledRows} active
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

export default GrainageCropHarvestReport;
