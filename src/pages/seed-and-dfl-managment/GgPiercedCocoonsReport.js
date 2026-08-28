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
//  GG Monthly Report — Sheet 5 / Form 8 — Pierced Cocoon Details
//  Backed by:
//    GET /grainage-progress-report/gg-monthly/pierced-cocoons         (JSON)
//    GET /grainage-progress-report/gg-monthly/pierced-cocoons/pdf     (PDF)
//    GET /grainage-progress-report/gg-monthly/pierced-cocoons/excel   (Excel)
//
//  Shape: { sl_no, description, cy_mo, cy_me, py_mo, py_me } per row.
//  Three fixed rows: Collected / Distributed / Remaining (kg).
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

const ENDPOINT = "grainage-progress-report/gg-monthly/pierced-cocoons";
const FILE_TAG = "gg_form8_pierced";

// Distinct accent for this report — a butterfly-themed purple/amber gradient
// so it doesn't visually collide with the existing GG report screens.
const ACCENT_HEADER = "linear-gradient(135deg,#7c3aed 0%,#a855f7 60%,#f59e0b 100%)";
const ACCENT_TABLE  = "linear-gradient(135deg,#6d28d9,#9333ea)";

if (typeof document !== "undefined" && !document.getElementById("ggpc-swal-styles")) {
  const s = document.createElement("style");
  s.id = "ggpc-swal-styles";
  s.innerHTML = `
    .ggpc-swal { border-radius: 22px !important; padding: 8px !important; box-shadow: 0 30px 90px rgba(0,0,0,0.22) !important; }
    .ggpc-swal .swal2-title { font-size: 20px !important; font-weight: 800 !important; color: #1a202c !important; }
    .ggpc-swal .swal2-actions { gap: 10px !important; }
    .ggpc-swal .swal2-confirm { border-radius: 11px !important; padding: 11px 26px !important; font-weight: 700 !important; font-size: 14px !important; }
    @keyframes ggpc-fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
    .ggpc-table-wrap { animation: ggpc-fadeIn 0.32s ease; }
  `;
  document.head.appendChild(s);
}

function GgPiercedCocoonsReport() {
  const { t, i18n } = useTranslation();

  // ── Filter state ────────────────────────────────────────────────────────
  const [filter, setFilter] = useState({
    grainageMasterId: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [grainageList, setGrainageList] = useState([]);

  // ── Data / loading state ───────────────────────────────────────────────
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

  // Year range: current year ± 4.
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
    if (!filter.grainageMasterId) return t("Please select a Grainage.", { ns: "reports" });
    if (!filter.year) return t("Please select a Year.", { ns: "reports" });
    if (!filter.month) return t("Please select a Month.", { ns: "reports" });
    return null;
  };

  const showValidationError = (msg) =>
    Swal.fire({
      icon: "warning",
      title: t("Required Fields", { ns: "reports" }),
      html: `
        <div style="padding:8px 2px 12px">
          <div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left">
            <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div>
            <div>
              <p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">${t("Missing Selection", { ns: "reports" })}</p>
              <p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p>
            </div>
          </div>
        </div>`,
      confirmButtonText: t("Got it", { ns: "reports" }),
      confirmButtonColor: "#d97706",
      background: "#fff",
      customClass: { popup: "ggpc-swal" },
    });

  const showServerError = (icon, title, message) =>
    Swal.fire({
      icon: "error",
      title,
      html: `
        <div style="padding:8px 2px 12px">
          <div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left">
            <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${icon}</div>
            <div>
              <p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${title}</p>
              <p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${message}</p>
            </div>
          </div>
        </div>`,
      confirmButtonText: t("Close"),
      confirmButtonColor: "#e53e3e",
      background: "#fff",
      customClass: { popup: "ggpc-swal" },
    });

  const params = () => ({
    grainageId: filter.grainageMasterId,
    year: filter.year,
    month: filter.month,
  });

  // ── Actions ─────────────────────────────────────────────────────────────
  const handleView = async () => {
    const err = validate();
    if (err) return showValidationError(err);
    setLoadView(true);
    try {
      const res = await api.get(baseURLSeedDFL + ENDPOINT, { params: params() });
      setRows(Array.isArray(res.data) ? res.data : []);
      setShown(true);
    } catch {
      showServerError("🔌", t("Could Not Load Report", { ns: "reports" }),
        t("Failed to fetch the pierced cocoon report. Please try again.", { ns: "reports" }));
    } finally {
      setLoadView(false);
    }
  };

  const downloadFile = async (kind /* "pdf" | "excel" */) => {
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
        kind === "pdf" ? t("PDF Generation Failed", { ns: "reports" }) : t("Excel Generation Failed", { ns: "reports" }),
        t("Could not generate the {{kind}} report. Please verify your selection and try again.", { ns: "reports", kind: kind.toUpperCase() }));
    } finally {
      setter(false);
    }
  };

  // ── Derived display values ──────────────────────────────────────────────
  const selectedGrainage = grainageList.find(
    (g) => String(g.grainageMasterId) === String(filter.grainageMasterId)
  );
  const selectedGrainageName = i18n.language === "kn"
    ? (selectedGrainage?.grainageMasterNameInKannada || selectedGrainage?.grainageMasterName)
    : selectedGrainage?.grainageMasterName;
  const monthLabel = MONTHS.find((m) => Number(m.value) === Number(filter.month))?.label || "";
  const monthKn = MONTH_NAMES_KN[Number(filter.month) || 0] || "";
  const cyLabel = `${filter.year}-${String((Number(filter.year) + 1) % 100).padStart(2, "0")}`;
  const pyLabel = `${Number(filter.year) - 1}-${String(Number(filter.year) % 100).padStart(2, "0")}`;

  const fmt = (val) => {
    if (val === null || val === undefined || val === "") return "—";
    const n = parseFloat(val);
    if (isNaN(n)) return String(val);
    return n === Math.floor(n) ? String(Math.round(n)) : n.toFixed(2);
  };

  // Pick a row icon based on the row's description text (collected / distributed / remaining).
  const rowIcon = (desc) => {
    const d = (desc || "").toLowerCase();
    if (d.includes("collected") || d.includes("ಸಂಗ್ರಹ")) return { glyph: "📦", bg: "#ebf8ff", color: "#2b6cb0" };
    if (d.includes("distributed") || d.includes("ವಿಲೇವಾರಿ")) return { glyph: "🚚", bg: "#fef3c7", color: "#92400e" };
    if (d.includes("remaining") || d.includes("ಉಳಿಕೆ")) return { glyph: "🦋", bg: "#faf5ff", color: "#6b46c1" };
    return { glyph: "•", bg: "#edf2f7", color: "#4a5568" };
  };

  // ── Shared styles ───────────────────────────────────────────────────────
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
  const numCell = {
    padding: "12px 14px",
    textAlign: "right",
    borderBottom: "1px solid #e8edf5",
    borderRight: "1px solid #eef2f7",
    fontVariantNumeric: "tabular-nums",
    fontWeight: 700,
    fontSize: "14px",
    whiteSpace: "nowrap",
  };

  return (
    <Layout title={t("GG Pierced Cocoon Details (Form 8)", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("GG Pierced Cocoon Details (Form 8)", { ns: "reports" })}</Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        {/* ── Filter card ───────────────────────────────────────────────── */}
        <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(124,58,237,0.10)" }}>
          <div style={{
            background: ACCENT_HEADER,
            padding: "11px 18px", display: "flex", alignItems: "center",
            gap: "10px", borderRadius: "12px 12px 0 0",
          }}>
            <span style={{ fontSize: "20px" }}>🦋</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", lineHeight: 1.2 }}>
                ನಮೂನೆ-8 · ಚಿಟ್ಟೆ ಕೊರೆದ ಗೂಡುಗಳ ವಿವರ
              </div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "11px" }}>
                GG Monthly — Pierced Cocoon Details (Sheet 5 · Form 8)
              </div>
            </div>
            {(shown || filter.grainageMasterId) && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {selectedGrainage && (
                  <span style={{ background: "rgba(255,255,255,0.22)", borderRadius: "20px", padding: "3px 10px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>
                    {selectedGrainageName}
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
                  <label style={lbl}>{t("Grainage")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="grainageMasterId" value={filter.grainageMasterId} onChange={handleFilterChange} style={sel}>
                    <option value="">{`— ${t("Select Grainage", { ns: "reports" })} —`}</option>
                    {grainageList.map((g) => (
                      <option key={g.grainageMasterId} value={g.grainageMasterId}>{i18n.language === "kn" ? (g.grainageMasterNameInKannada || g.grainageMasterName) : g.grainageMasterName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Year", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="year" value={filter.year} onChange={handleFilterChange} style={sel}>
                    {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleFilterChange} style={sel}>
                    {MONTHS.map((m) => <option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>)}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={loadView}
                      style={btn("linear-gradient(135deg,#6d28d9,#9333ea)", "0 3px 10px rgba(124,58,237,0.30)", loadView)}>
                      {loadView ? <><span className="spinner-border spinner-border-sm" /> {t("Loading…", { ns: "reports" })}</> : <>📋 {t("View")}</>}
                    </button>
                    <button type="button" disabled={loadPdf} onClick={() => downloadFile("pdf")}
                      style={btn("linear-gradient(135deg,#c53030,#e53e3e)", "0 3px 10px rgba(197,48,48,0.28)", loadPdf)}>
                      {loadPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📥 {t("PDF")}</>}
                    </button>
                    <button type="button" disabled={loadExcel} onClick={() => downloadFile("excel")}
                      style={btn("linear-gradient(135deg,#1d6a3a,#22883f)", "0 3px 10px rgba(29,106,58,0.28)", loadExcel)}>
                      {loadExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>🟢 {t("Excel", { ns: "reports" })}</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* ── Report table ──────────────────────────────────────────────── */}
        {shown && (
          <div className="ggpc-table-wrap mt-3">
            {/* Summary pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{
                background: "linear-gradient(135deg,#faf5ff,#fff)",
                border: "1.5px solid #d6bcfa", borderRadius: "12px",
                padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px",
              }}>
                <span style={{ fontSize: "11px", color: "#6b46c1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{t("Grainage")}</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{selectedGrainageName || "—"}</span>
              </div>
              <div style={{
                background: "linear-gradient(135deg,#fef3c7,#fffbeb)",
                border: "1.5px solid #fcd34d", borderRadius: "12px",
                padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "160px",
              }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{t("Period", { ns: "reports" })}</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthKn} · {filter.year}</span>
              </div>
              <div style={{
                background: "linear-gradient(135deg,#ebf8ff,#f7fafc)",
                border: "1.5px solid #bee3f8", borderRadius: "12px",
                padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px",
              }}>
                <span style={{ fontSize: "11px", color: "#2b6cb0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{t("Comparing", { ns: "reports" })}</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{cyLabel} vs {pyLabel}</span>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{
                  background: "linear-gradient(135deg,#edf2f7,#e2e8f0)",
                  border: "1.5px solid #cbd5e0", borderRadius: "20px",
                  padding: "6px 16px", fontSize: "12px", color: "#4a5568", fontWeight: 600,
                }}>{rows.length} {t("rows", { ns: "reports" })}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(124,58,237,0.10)", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                  <thead>
                    {/* Row 1: top-level year group headers */}
                    <tr>
                      <th rowSpan={2}
                        style={{
                          background: ACCENT_TABLE, color: "#fff",
                          padding: "12px 10px", textAlign: "center",
                          borderRight: "1px solid rgba(255,255,255,0.2)",
                          borderBottom: "1px solid rgba(255,255,255,0.2)",
                          fontWeight: 700, whiteSpace: "nowrap", width: "60px",
                        }}>
                        <div style={{ fontSize: "11px", opacity: 0.85, fontWeight: 600 }}>ಕ್ರ.ಸಂ</div>
                        <div style={{ fontSize: "13px" }}>Sl</div>
                      </th>
                      <th rowSpan={2}
                        style={{
                          background: ACCENT_TABLE, color: "#fff",
                          padding: "12px 16px", textAlign: "left",
                          borderRight: "1px solid rgba(255,255,255,0.2)",
                          borderBottom: "1px solid rgba(255,255,255,0.2)",
                          fontWeight: 700, minWidth: "300px",
                        }}>
                        <div style={{ fontSize: "11px", opacity: 0.85, fontWeight: 600 }}>ವಿವರ</div>
                        <div style={{ fontSize: "13px" }}>Description</div>
                      </th>
                      <th colSpan={2}
                        style={{
                          background: "linear-gradient(135deg,#6d28d9,#9333ea)",
                          color: "#fff", padding: "10px 16px", textAlign: "center",
                          borderRight: "1px solid rgba(255,255,255,0.2)",
                          borderBottom: "1px solid rgba(255,255,255,0.15)",
                          fontWeight: 700,
                        }}>
                        {cyLabel}
                      </th>
                      <th colSpan={2}
                        style={{
                          background: "linear-gradient(135deg,#9a3412,#c2410c)",
                          color: "#fff", padding: "10px 16px", textAlign: "center",
                          borderBottom: "1px solid rgba(255,255,255,0.15)",
                          fontWeight: 700,
                        }}>
                        {pyLabel}
                      </th>
                    </tr>

                    {/* Row 2: sub-column headers */}
                    <tr>
                      {[
                        { label: "ಮಾಸ / Month", bg: "#7c3aed" },
                        { label: "ಮಾಸಾಂತ್ಯ / Month End", bg: "#6d28d9", br: true },
                        { label: "ಮಾಸ / Month", bg: "#c2410c" },
                        { label: "ಮಾಸಾಂತ್ಯ / Month End", bg: "#9a3412" },
                      ].map((col, i) => (
                        <th key={i}
                          style={{
                            background: col.bg, color: "#fff",
                            padding: "8px 14px", textAlign: "center",
                            borderRight: col.br ? "1px solid rgba(255,255,255,0.2)" : undefined,
                            fontWeight: 600, fontSize: "12.5px", whiteSpace: "nowrap",
                          }}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, idx) => {
                      const isAlt = idx % 2 === 1;
                      const bg = isAlt ? "#faf7ff" : "#fff";
                      const ic = rowIcon(row.description);
                      return (
                        <tr key={idx}
                          style={{ background: bg, transition: "background 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f3e8ff")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = bg)}>
                          <td style={{
                            padding: "12px 10px", textAlign: "center",
                            borderBottom: "1px solid #e8edf5",
                            borderRight: "1px solid #e8edf5",
                            fontWeight: 800, color: "#6d28d9", fontSize: "13px",
                          }}>
                            {row.sl_no ?? idx + 1}
                          </td>
                          <td style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #e8edf5",
                            borderRight: "1px solid #e8edf5",
                            color: "#1a202c", fontWeight: 500,
                            display: "flex", alignItems: "center", gap: "10px",
                          }}>
                            <span style={{
                              width: "30px", height: "30px", borderRadius: "9px",
                              background: ic.bg, color: ic.color,
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              fontSize: "15px", flexShrink: 0,
                            }}>{ic.glyph}</span>
                            <span>{row.description ?? ""}</span>
                          </td>
                          <td style={{ ...numCell, color: "#5b21b6", background: isAlt ? "#f3e8ff" : "#faf5ff" }}>{fmt(row.cy_mo)}</td>
                          <td style={{ ...numCell, color: "#4c1d95", background: isAlt ? "#ede9fe" : "#f5f0ff", borderRight: "2px solid #d6bcfa" }}>{fmt(row.cy_me)}</td>
                          <td style={{ ...numCell, color: "#9a3412", background: isAlt ? "#fff7ed" : "#fffaf0" }}>{fmt(row.py_mo)}</td>
                          <td style={{ ...numCell, color: "#7c2d12", background: isAlt ? "#fed7aa" : "#ffedd5" }}>{fmt(row.py_me)}</td>
                        </tr>
                      );
                    })}

                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={6}
                          style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          {t("No data available for the selected filters.", { ns: "reports" })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer with secondary download buttons */}
              <div style={{
                background: "linear-gradient(135deg,#faf5ff,#fff5e6)",
                padding: "12px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "8px",
                borderTop: "1.5px solid #e9d5ff",
              }}>
                <span style={{ fontSize: "12px", color: "#6b46c1", fontWeight: 600 }}>
                  🦋 {selectedGrainageName || ""} — {monthLabel} {monthKn} · {filter.year}
                </span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => downloadFile("pdf")} disabled={loadPdf}
                    style={btn("linear-gradient(135deg,#c53030,#e53e3e)", "0 2px 8px rgba(197,48,48,0.25)", loadPdf)}>
                    {loadPdf ? <><span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14 }} /> {t("Generating…", { ns: "reports" })}</> : <>📥 {t("Download PDF")}</>}
                  </button>
                  <button type="button" onClick={() => downloadFile("excel")} disabled={loadExcel}
                    style={btn("linear-gradient(135deg,#1d6a3a,#22883f)", "0 2px 8px rgba(29,106,58,0.25)", loadExcel)}>
                    {loadExcel ? <><span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14 }} /> {t("Exporting…", { ns: "reports" })}</> : <>🟢 {t("Download Excel")}</>}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {!shown && (
          <Card className="mt-3" style={{ borderRadius: "12px", border: "1.5px dashed #d6bcfa", background: "#faf7ff", boxShadow: "none" }}>
            <Card.Body style={{ padding: "32px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>🦋</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a202c", marginBottom: "4px" }}>
                {t("Pierced Cocoon Details (Form 8)", { ns: "reports" })}
              </div>
              <div style={{ fontSize: "13px", color: "#6b46c1" }}>
                {t("Pick Grainage / Year / Month above, then click", { ns: "reports" })} <b>{t("View")}</b> {t("to load this report — or", { ns: "reports" })} <b style={{ color: "#c53030" }}>{t("PDF")}</b> / <b style={{ color: "#1d6a3a" }}>{t("Excel", { ns: "reports" })}</b> {t("for a direct download.", { ns: "reports" })}
              </div>
            </Card.Body>
          </Card>
        )}
      </Block>
    </Layout>
  );
}

export default GgPiercedCocoonsReport;
