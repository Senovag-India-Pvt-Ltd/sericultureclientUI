import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import api from "../../services/auth/api";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDFL = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

// =============================================================================
//  GG Monthly Report — Sheet 2 — Lot-wise Progress
//    GET /grainage-progress-report/gg-monthly/lot-wise-progress
//    GET /grainage-progress-report/gg-monthly/lot-wise-progress/pdf
//    GET /grainage-progress-report/gg-monthly/lot-wise-progress/excel
// =============================================================================

const MONTHS = [
  { value: 1, label: "January" }, { value: 2, label: "February" },
  { value: 3, label: "March" }, { value: 4, label: "April" },
  { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" },
  { value: 9, label: "September" }, { value: 10, label: "October" },
  { value: 11, label: "November" }, { value: 12, label: "December" },
];
const MONTH_NAMES_KN = [
  "", "ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್",
  "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್",
];

const ENDPOINT = "grainage-progress-report/gg-monthly/lot-wise-progress";
const FILE_TAG = "gg_sheet2_lotwise";

// Blue accent — matches the "primary" GG report family.
const ACCENT_HEADER = "linear-gradient(135deg,#1a5f9e 0%,#2c8fd4 60%,#38b2ac 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#1a5f9e,#2c8fd4)";

const COLUMNS = [
  { key: "sl_no", label: "Sl", kn: "ಕ್ರ.ಸಂ", align: "center", width: "48px" },
  { key: "lot_number", label: "Lot No", kn: "ತಂಡದ ಸಂಖ್ಯೆ", align: "left" },
  { key: "parent_lot_number", label: "Parent Lot", kn: "ಮೂಲ ಬಿತ್ತನೆ ತಂಡ", align: "left" },
  { key: "farmer_name", label: "Farmer / Address", kn: "ರೈತನ ಹೆಸರು / ವಿಳಾಸ", align: "left", min: "200px" },
  { key: "ripe_date", label: "Ripe Date", kn: "ಹಣ್ಣಾದ ದಿನಾಂಕ", align: "center" },
  { key: "cocoons_supplied", label: "Cocoons Sup.", kn: "ಸರಬರಾಜು ಗೂಡುಗಳು", align: "right" },
  { key: "cocoons_fit", label: "Fit Seed", kn: "ಬಿತ್ತನೆಗೆ ಯೋಗ್ಯ", align: "right" },
  { key: "cocoons_rejected", label: "Rej Cocoons", kn: "ತಿರಸ್ಕೃತ ಗೂಡು", align: "right" },
  { key: "pairs_no", label: "Pairs", kn: "ಜೋತೆಗಳು", align: "right" },
  { key: "pairs_pct", label: "Pairs %", kn: "ಜೋತೆಗಳ %", align: "right", pct: true },
  { key: "rejected_dfls", label: "Rej DFLs", kn: "ತಿರಸ್ಕೃತ ಮೊಟ್ಟೆ", align: "right" },
  { key: "rejected_dfls_pct", label: "Rej %", kn: "ತಿರಸ್ಕೃತ %", align: "right", pct: true },
  { key: "received_dfls", label: "Rec DFLs", kn: "ಪಡೆದ ಮೊಟ್ಟೆ", align: "right" },
  { key: "received_dfls_pct", label: "Rec %", kn: "ಪಡೆದ %", align: "right", pct: true },
  { key: "dfl_date", label: "DFL Date", kn: "ಮೊಟ್ಟೆ ಇಟ್ಟ ದಿನಾಂಕ", align: "center" },
  { key: "yield_per_cocoon", label: "Yield / Cocoon", kn: "ಒಟ್ಟು ಗೂಡಿಗೆ ಇಳುವರಿ", align: "right" },
];

if (typeof document !== "undefined" && !document.getElementById("gglw-swal-styles")) {
  const s = document.createElement("style");
  s.id = "gglw-swal-styles";
  s.innerHTML = `
    .gglw-swal { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22) !important; }
    .gglw-swal .swal2-title { font-size: 20px !important; font-weight: 800 !important; color: #1a202c !important; }
    .gglw-swal .swal2-actions { gap: 10px !important; }
    .gglw-swal .swal2-confirm { border-radius: 11px !important; padding: 11px 26px !important; font-weight: 700 !important; font-size: 14px !important; }
    @keyframes gglw-fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
    .gglw-table-wrap { animation: gglw-fadeIn 0.32s ease; }
  `;
  document.head.appendChild(s);
}

function GgLotWiseProgressReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({
    grainageMasterId: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [grainageList, setGrainageList] = useState([]);
  const [rows, setRows] = useState([]);
  const [shown, setShown] = useState(false);
  const [loadView, setLoadView] = useState(false);
  const [loadPdf, setLoadPdf] = useState(false);
  const [loadExcel, setLoadExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "grainageMaster/get-all")
      .then((r) => setGrainageList(r.data.content.grainageMaster || []))
      .catch(() => setGrainageList([]));
  }, []);

  const yearOptions = (() => {
    const y = new Date().getFullYear();
    const out = [];
    for (let i = y - 4; i <= y + 1; i++) out.push(i);
    return out;
  })();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    setShown(false);
    setRows([]);
  };

  const validate = () => {
    if (!filter.grainageMasterId) return "Please select a Grainage.";
    if (!filter.year) return "Please select a Year.";
    if (!filter.month) return "Please select a Month.";
    return null;
  };

  const showValidationError = (msg) =>
    Swal.fire({
      icon: "warning",
      title: "Required Fields",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">Missing Selection</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Got it",
      confirmButtonColor: "#d97706",
      background: "#fff",
      customClass: { popup: "gglw-swal" },
    });

  const showServerError = (icon, title, message) =>
    Swal.fire({
      icon: "error",
      title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${icon}</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${title}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${message}</p></div></div></div>`,
      confirmButtonText: "Close",
      confirmButtonColor: "#e53e3e",
      background: "#fff",
      customClass: { popup: "gglw-swal" },
    });

  const params = () => ({
    grainageId: filter.grainageMasterId,
    year: filter.year,
    month: filter.month,
  });

  const handleView = async () => {
    const err = validate();
    if (err) return showValidationError(err);
    setLoadView(true);
    try {
      const res = await api.get(baseURLSeedDFL + ENDPOINT, { params: params() });
      setRows(Array.isArray(res.data) ? res.data : []);
      setShown(true);
    } catch {
      showServerError("🔌", "Could Not Load Report",
        "Failed to fetch the lot-wise report. Please try again.");
    } finally { setLoadView(false); }
  };

  const downloadFile = async (kind) => {
    const err = validate();
    if (err) return showValidationError(err);
    const setter = kind === "pdf" ? setLoadPdf : setLoadExcel;
    setter(true);
    try {
      const res = await api.get(baseURLSeedDFL + ENDPOINT + "/" + kind, {
        params: params(),
        responseType: "blob",
      });
      const mime = kind === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const url = URL.createObjectURL(new Blob([res.data], { type: mime }));
      if (kind === "pdf") {
        window.open(url);
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${FILE_TAG}_${filter.grainageMasterId}_${filter.year}_${filter.month}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      showServerError(kind === "pdf" ? "📄" : "📊",
        kind === "pdf" ? "PDF Generation Failed" : "Excel Generation Failed",
        `Could not generate the ${kind.toUpperCase()} report. Please verify your selection and try again.`);
    } finally { setter(false); }
  };

  const selectedGrainage = grainageList.find(
    (g) => String(g.grainageMasterId) === String(filter.grainageMasterId)
  );
  const monthLabel = MONTHS.find((m) => Number(m.value) === Number(filter.month))?.label || "";
  const monthKn = MONTH_NAMES_KN[Number(filter.month) || 0] || "";

  const fmt = (val, col) => {
    if (val === null || val === undefined || val === "") return "—";
    const n = parseFloat(val);
    if (isNaN(n)) return String(val);
    const out = n === Math.floor(n) ? String(Math.round(n)) : n.toFixed(2);
    return col?.pct ? out + " %" : out;
  };

  const sel = { borderRadius: "7px", border: "1.5px solid #d0d9e8", padding: "6px 10px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
  const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "3px", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" };
  const btn = (bg, shadow, disabled) => ({
    background: disabled ? "#c8d6e5" : bg,
    border: "none", borderRadius: "8px", padding: "8px 18px",
    fontWeight: 700, fontSize: "13px", color: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : shadow,
    display: "inline-flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap",
  });

  return (
    <Layout title={t("GG Lot-wise Progress (Sheet 2)")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("GG Lot-wise Progress (Sheet 2)")}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(30,103,168,0.10)" }}>
          <div style={{
            background: ACCENT_HEADER, padding: "11px 18px",
            display: "flex", alignItems: "center", gap: "10px",
            borderRadius: "12px 12px 0 0",
          }}>
            <span style={{ fontSize: "20px" }}>📋</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", lineHeight: 1.2 }}>
                ನಮೂನೆ-2 · ಪಿ1 ಬಿತ್ತನೆ ಕೋಠಿ ತಂಡವಾರು ಪ್ರಗತಿ
              </div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>
                GG Monthly — Lot-wise Progress (Sheet 2)
              </div>
            </div>
            {(shown || filter.grainageMasterId) && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {selectedGrainage && (
                  <span style={{ background: "rgba(255,255,255,0.22)", borderRadius: "20px", padding: "3px 10px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>
                    {selectedGrainage.grainageMasterName}
                  </span>
                )}
                <span style={{ background: "rgba(255,255,255,0.22)", borderRadius: "20px", padding: "3px 10px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} · {filter.year}
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "14px 18px 16px" }}>
            <Form onSubmit={(e) => { e.preventDefault(); handleView(); }}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>Grainage <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="grainageMasterId" value={filter.grainageMasterId} onChange={handleFilterChange} style={sel}>
                    <option value="">— Select Grainage —</option>
                    {grainageList.map((g) => (
                      <option key={g.grainageMasterId} value={g.grainageMasterId}>{g.grainageMasterName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="year" value={filter.year} onChange={handleFilterChange} style={sel}>
                    {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lbl}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleFilterChange} style={sel}>
                    {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={loadView}
                      style={btn("linear-gradient(135deg,#1a5f9e,#2c8fd4)", "0 3px 10px rgba(26,95,158,0.30)", loadView)}>
                      {loadView ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                    </button>
                    <button type="button" disabled={loadPdf} onClick={() => downloadFile("pdf")}
                      style={btn("linear-gradient(135deg,#c53030,#e53e3e)", "0 3px 10px rgba(197,48,48,0.28)", loadPdf)}>
                      {loadPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📥 PDF</>}
                    </button>
                    <button type="button" disabled={loadExcel} onClick={() => downloadFile("excel")}
                      style={btn("linear-gradient(135deg,#1d6a3a,#22883f)", "0 3px 10px rgba(29,106,58,0.28)", loadExcel)}>
                      {loadExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>🟢 Excel</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {shown && (
          <div className="gglw-table-wrap mt-3">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ebf8ff,#e6fffa)", border: "1.5px solid #bee3f8", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#2b6cb0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>Grainage</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{selectedGrainage?.grainageMasterName || "—"}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#f0fff4,#f7fafc)", border: "1.5px solid #9ae6b4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "160px" }}>
                <span style={{ fontSize: "11px", color: "#276749", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>Period</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthKn} · {filter.year}</span>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{ background: "linear-gradient(135deg,#edf2f7,#e2e8f0)", border: "1.5px solid #cbd5e0", borderRadius: "20px", padding: "6px 16px", fontSize: "12px", color: "#4a5568", fontWeight: 600 }}>{rows.length} rows</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr>
                      {COLUMNS.map((c, i) => (
                        <th key={c.key}
                          style={{
                            background: ACCENT_TABLE, color: "#fff",
                            padding: "10px 12px", textAlign: c.align || "left",
                            borderRight: i < COLUMNS.length - 1 ? "1px solid rgba(255,255,255,0.18)" : undefined,
                            fontWeight: 700, whiteSpace: "nowrap",
                            width: c.width, minWidth: c.min,
                          }}>
                          <div style={{ fontSize: "12px", opacity: 0.92, fontWeight: 600 }}>{c.kn}</div>
                          <div style={{ fontSize: "13px" }}>{c.label}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => {
                      const bg = idx % 2 === 0 ? "#fff" : "#f7fafd";
                      return (
                        <tr key={idx}
                          style={{ background: bg, transition: "background 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#eef5fd")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = bg)}>
                          {COLUMNS.map((c) => (
                            <td key={c.key}
                              style={{
                                padding: "10px 12px",
                                textAlign: c.align || "left",
                                borderBottom: "1px solid #e8edf5",
                                borderRight: "1px solid #eef2f7",
                                color: c.align === "right" ? "#1e40af" : "#2d3748",
                                fontVariantNumeric: c.align === "right" ? "tabular-nums" : undefined,
                                fontWeight: c.align === "right" ? 600 : 500,
                                whiteSpace: c.align === "right" ? "nowrap" : "normal",
                              }}>
                              {c.align === "right" ? fmt(row[c.key], c) : (row[c.key] ?? "—")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={COLUMNS.length}
                          style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          No data available for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{
                background: "linear-gradient(135deg,#f7fafc,#edf2f7)",
                padding: "12px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "8px",
                borderTop: "1.5px solid #e2e8f0",
              }}>
                <span style={{ fontSize: "12px", color: "#718096", fontWeight: 600 }}>
                  📋 {selectedGrainage?.grainageMasterName || ""} — {monthLabel} {monthKn} · {filter.year}
                </span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => downloadFile("pdf")} disabled={loadPdf}
                    style={btn("linear-gradient(135deg,#c53030,#e53e3e)", "0 2px 8px rgba(197,48,48,0.25)", loadPdf)}>
                    {loadPdf ? <><span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14 }} /> Generating…</> : <>📥 Download PDF</>}
                  </button>
                  <button type="button" onClick={() => downloadFile("excel")} disabled={loadExcel}
                    style={btn("linear-gradient(135deg,#1d6a3a,#22883f)", "0 2px 8px rgba(29,106,58,0.25)", loadExcel)}>
                    {loadExcel ? <><span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14 }} /> Exporting…</> : <>🟢 Download Excel</>}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {!shown && (
          <Card className="mt-3" style={{ borderRadius: "12px", border: "1.5px dashed #cbd5e0", background: "#fafcff", boxShadow: "none" }}>
            <Card.Body style={{ padding: "32px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>📂</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a202c", marginBottom: "4px" }}>
                Sheet 2 — Lot-wise Progress
              </div>
              <div style={{ fontSize: "13px", color: "#718096" }}>
                Pick Grainage / Year / Month above, then click <b style={{ color: "#1a5f9e" }}>View</b> to load this report — or <b style={{ color: "#c53030" }}>PDF</b> / <b style={{ color: "#1d6a3a" }}>Excel</b> for a direct download.
              </div>
            </Card.Body>
          </Card>
        )}
      </Block>
    </Layout>
  );
}

export default GgLotWiseProgressReport;
