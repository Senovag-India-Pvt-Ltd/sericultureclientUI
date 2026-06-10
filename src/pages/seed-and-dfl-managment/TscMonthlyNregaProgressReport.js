import React, { useEffect, useMemo, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import ReactSelect from "react-select";
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

if (!document.getElementById("tscnrega-styles")) {
  const s = document.createElement("style");
  s.id = "tscnrega-styles";
  s.innerHTML = `
    .tscnrega-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tscnrega-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tscnrega-swal .swal2-icon { margin:20px auto 4px !important; }
    .tscnrega-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tscnrega-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tscnrega-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tscnrega-wrap { animation: tscnrega-in .35s ease; }
    .tscnrega-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tscnrega-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tscnrega-scroll::-webkit-scrollbar { height:9px; }
    .tscnrega-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tscnrega-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
    .tscnrega-pbar-track { width:100%; height:6px; background:rgba(0,0,0,.06); border-radius:99px; overflow:hidden; margin-top:4px; }
    .tscnrega-pbar-fill  { height:100%; border-radius:99px; transition:width .4s ease; }
  `;
  document.head.appendChild(s);
}

const sel = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "7px 11px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
const btn = (bg, shadow, disabled) => ({
  background: disabled ? "#c8d6e5" : bg, border: "none", borderRadius: "9px", padding: "8px 18px",
  fontWeight: 700, fontSize: "13px", color: "#fff",
  cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : shadow,
  display: "flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap",
});

const reactSelectStyles = {
  control: (base, state) => ({
    ...base, borderRadius: "8px",
    border: state.isFocused ? "1.5px solid #14b8a6" : "1.5px solid #d0d9e8",
    background: "#f8fafd", minHeight: "38px", fontSize: "13px", color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(20,184,166,.15)" : "none",
    "&:hover": { border: "1.5px solid #14b8a6" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (base) => ({ ...base, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#64748b" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(13,78,72,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base, fontSize: "13px", padding: "8px 12px",
    background: state.isSelected ? "linear-gradient(135deg,#0f766e,#14b8a6)" : state.isFocused ? "#ecfdf5" : "#fff",
    color: state.isSelected ? "#fff" : "#0f172a", cursor: "pointer",
  }),
};

const numOrZero = (v) => { const n = parseFloat(String(v ?? "").replace(/[^\d.\-]/g, "")); return isNaN(n) ? 0 : n; };
const fmtInt = (v) => { const s = String(v ?? "").trim(); if (!s) return ""; const n = parseFloat(s); if (isNaN(n)) return s; return Math.round(n).toLocaleString(); };
const fmtDec = (v) => { const s = String(v ?? "").trim(); if (!s) return ""; const n = parseFloat(s); if (isNaN(n)) return s; return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
const fmtPct = (v) => numOrZero(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";

const yearOptions = (() => {
  const cur = new Date().getFullYear(); const arr = [];
  for (let y = cur + 1; y >= cur - 5; y--) arr.push({ value: y, label: String(y) });
  return arr;
})();

const pctColor = (p) => p >= 100 ? "#16a34a" : p >= 60 ? "#ca8a04" : p > 0 ? "#dc2626" : "#cbd5e1";

function TscMonthlyNregaProgressReport() {
  const { t } = useTranslation();

  const today = new Date();
  const [filter, setFilter] = useState({ districtId: "", year: today.getFullYear(), month: today.getMonth() + 1 });
  const [districtList, setDistrictList] = useState([]);
  const [search, setSearch] = useState("");
  const [hideTotals, setHideTotals] = useState(false);
  const [dataRows, setDataRows] = useState([]);
  const [hasReport, setHasReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => { api.get(baseURL + "district/get-all").then((r) => setDistrictList(r.data.content.district || [])).catch(() => setDistrictList([])); }, []);

  const reset = () => { setHasReport(false); setDataRows([]); setSearch(""); setHideTotals(false); };
  const validate = () => {
    if (!filter.districtId) return "Please select a District.";
    if (!filter.year)       return "Please select a Year.";
    if (!filter.month)      return "Please select a Month.";
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: "Required Fields",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">Missing Selection</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Got it", confirmButtonColor: "#d97706", background: "#fff", customClass: { popup: "tscnrega-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e", background: "#fff", customClass: { popup: "tscnrega-swal" },
    });

  const params = () => ({ districtId: filter.districtId, year: Number(filter.year), month: Number(filter.month) });

  const handleView = async (e) => {
    e.preventDefault(); const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/nrega-progress", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []); setHasReport(true);
    } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          showErr("No Data Found", "No data found for the selected filters.");
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the NREGA Progress report.");
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/nrega-progress/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); } finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/nrega-progress/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      a.download = `tsc_monthly_nrega_progress_${filter.districtId}_${filter.year}_${filter.month}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); } finally { setIsDownloadingExcel(false); }
  };

  const districtName = districtList.find((d) => String(d.districtId) === String(filter.districtId))?.districtName || "—";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";

  const isTotalRow = (r) => String(r.block_name || "").trim().toLowerCase() === "total";

  const filteredRows = useMemo(() => {
    let rows = dataRows;
    if (hideTotals) rows = rows.filter((r) => !isTotalRow(r));
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((r) => String(r.block_name ?? "").toLowerCase().includes(q));
  }, [dataRows, search, hideTotals]);

  const kpis = useMemo(() => {
    const tot = dataRows.find(isTotalRow);
    if (!tot) return null;
    const approved = numOrZero(tot.approved_cy);
    const completed = numOrZero(tot.completed);
    const ongoingCy = numOrZero(tot.ongoing_cy);
    const expGp = numOrZero(tot.exp_gp);
    const expLine = numOrZero(tot.exp_line);
    const completionPct = approved > 0 ? (completed * 100) / approved : 0;
    return {
      ongoingWorks: numOrZero(tot.ongoing_works),
      ongoingAsOn: numOrZero(tot.ongoing_as_on),
      approved, ongoingCy, completed,
      pctWorks: numOrZero(tot.pct_works),
      expGp, expLine,
      pctExp: numOrZero(tot.pct_exp),
      mandays: numOrZero(tot.mandays),
      completionPct,
    };
  }, [dataRows]);

  return (
    <Layout title={t("NREGA Progress — Physical/Financial of Line Department")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("NREGA Physical / Financial Progress of Line Department")}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                ADS · Executing Agency: SERICULTURE
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 35%,#15803d 70%,#a16207 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🏗</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                Physical / Financial Progress of Line Department · Block-wise (MGNREGA)
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>
                Ongoing · Approved CY · Completed · % Works · GP/PS/Distt Exp · Line Dept Exp · % Exp · Mandays — District-level summary
              </div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{monthLabel} {filter.year}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{filteredRows.length} / {dataRows.length} rows</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>District <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={districtList.map((d) => ({ value: String(d.districtId), label: d.districtName }))}
                    placeholder="— Search District —"
                    isSearchable isClearable menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed" styles={reactSelectStyles}
                    value={districtList.map((d) => ({ value: String(d.districtId), label: d.districtName })).find((o) => o.value === String(filter.districtId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, districtId: opt?.value || "" })); reset(); }}
                    noOptionsMessage={() => "No districts"}
                  />
                </Col>
                <Col md={3}>
                  <label style={lbl}>Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select value={filter.year} onChange={(e) => { setFilter((p) => ({ ...p, year: e.target.value })); reset(); }} style={sel}>
                    {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <label style={lbl}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select value={filter.month} onChange={(e) => { setFilter((p) => ({ ...p, month: e.target.value })); reset(); }} style={sel}>
                    {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                    {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                  </button>
                </Col>
              </Row>
              {hasReport && (
                <Row className="g-2 mt-2 align-items-end">
                  <Col md={5}>
                    <label style={lbl}>Quick Search (Block)</label>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type to filter blocks…" style={{ ...sel, padding: "8px 12px" }} />
                  </Col>
                  <Col md={3}>
                    <label style={lbl}>Totals row</label>
                    <button type="button" onClick={() => setHideTotals((v) => !v)}
                      style={{
                        width: "100%", padding: "7px 12px", borderRadius: "9px", border: "none",
                        background: hideTotals ? "#f1f5f9" : "linear-gradient(135deg,#fef3c7,#fde68a)",
                        color: hideTotals ? "#475569" : "#854d0e",
                        fontWeight: 800, fontSize: "12.5px", cursor: "pointer",
                      }}>
                      {hideTotals ? "🚫 Total hidden" : "✓ Total shown"}
                    </button>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                      <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                        {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> PDF…</> : <>📄 PDF</>}
                      </button>
                      <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                        {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> Excel…</> : <>📊 Excel</>}
                      </button>
                    </div>
                  </Col>
                </Row>
              )}
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="tscnrega-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-stretch">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>District</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 800, marginTop: "2px" }}>{districtName}</span>
                <span style={{ fontSize: "10.5px", color: "#0f766e", fontWeight: 700, marginTop: "1px" }}>Scheme: MGNREGA · Executing: SERICULTURE</span>
              </div>
              {kpis && (
                <>
                  <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                    <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Ongoing Works</span>
                    <span className="tscnrega-num" style={{ fontSize: "20px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.ongoingWorks)}</span>
                    <span style={{ fontSize: "10.5px", color: "#1e40af", marginTop: "1px" }}>As on date: {fmtInt(kpis.ongoingAsOn)}</span>
                  </div>
                  <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                    <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Approved (CY)</span>
                    <span className="tscnrega-num" style={{ fontSize: "20px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.approved)}</span>
                    <span style={{ fontSize: "10.5px", color: "#a16207", marginTop: "1px" }}>Ongoing CY: {fmtInt(kpis.ongoingCy)}</span>
                  </div>
                  <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                    <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Completed (CY)</span>
                    <span className="tscnrega-num" style={{ fontSize: "20px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.completed)}</span>
                    <div className="tscnrega-pbar-track">
                      <div className="tscnrega-pbar-fill" style={{ width: `${Math.min(100, kpis.completionPct)}%`, background: pctColor(kpis.completionPct) }} />
                    </div>
                    <span className="tscnrega-num" style={{ fontSize: "10.5px", color: "#15803d", fontWeight: 700, marginTop: "2px" }}>{fmtPct(kpis.completionPct)} of approved</span>
                  </div>
                  <div style={{ background: "linear-gradient(135deg,#fce7f3,#fdf2f8)", border: "1.5px solid #f9a8d4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                    <span style={{ fontSize: "11px", color: "#9d174d", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Expenditure (Lakhs)</span>
                    <span className="tscnrega-num" style={{ fontSize: "14px", color: "#831843", fontWeight: 800, marginTop: "2px" }}>₹ {fmtDec(kpis.expLine)} / {fmtDec(kpis.expGp)}</span>
                    <span style={{ fontSize: "10.5px", color: "#be185d", fontWeight: 700, marginTop: "1px" }}>Line Dept / Total · {fmtPct(kpis.pctExp)}</span>
                  </div>
                  <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "160px" }}>
                    <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Mandays</span>
                    <span className="tscnrega-num" style={{ fontSize: "20px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.mandays)}</span>
                  </div>
                </>
              )}
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                NREGA Physical / Financial Progress — Line Department · {districtName} · {monthLabel} {filter.year}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Block-wise breakdown · Executing Agency: SERICULTURE
                </div>
              </div>

              <div className="tscnrega-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1500px" }}>
                  <thead>
                    {/* Row 1 — group bands */}
                    <tr>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)", color: "#fff",
                        padding: "10px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "55px", verticalAlign: "middle",
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12px" }}>SNo</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#334155,#475569)", color: "#fff",
                        padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "170px", verticalAlign: "middle",
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>Block (Taluk)</div>
                      </th>
                      <th colSpan={5} style={{
                        background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        Physical Progress · Works
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#a16207,#ca8a04)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "150px", verticalAlign: "middle",
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "11.5px" }}>% of Works taken</div>
                        <div style={{ fontSize: "9px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>by line dept (CY)</div>
                      </th>
                      <th colSpan={2} style={{
                        background: "linear-gradient(135deg,#9d174d,#db2777)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        Financial Progress · Lakhs
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#a16207,#fbbf24)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "140px", verticalAlign: "middle",
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "11.5px" }}>% Exp of line</div>
                        <div style={{ fontSize: "9px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>dept works</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "110px", verticalAlign: "middle",
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "11.5px" }}>Mandays</div>
                      </th>
                    </tr>
                    {/* Row 2 — leaf headers */}
                    <tr>
                      {[
                        { en: "Ongoing Works",    sub: "(count)",      tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a" },
                        { en: "Ongoing as on",    sub: "snapshot",     tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a" },
                        { en: "Approved Works",   sub: "Current FY",   tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a" },
                        { en: "Ongoing Works",    sub: "Current FY",   tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a" },
                        { en: "Completed",        sub: "Current FY",   tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a", strong: true },
                        { en: "GP / PS / Distt",  sub: "Total Exp (₹)",tone: "linear-gradient(180deg,#f9a8d4,#ec4899)", text: "#9d174d" },
                        { en: "Line Dept",        sub: "Exp (₹)",      tone: "linear-gradient(180deg,#f9a8d4,#ec4899)", text: "#9d174d", strong: true },
                      ].map((c, i) => (
                        <th key={i} style={{
                          background: c.tone, color: c.text,
                          padding: "8px 4px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)",
                          fontWeight: c.strong ? 800 : 700, minWidth: "110px",
                          position: "sticky", top: "44px", zIndex: 2,
                        }}>
                          <div style={{ fontSize: "10.5px" }}>{c.en}</div>
                          <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>{c.sub}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && (
                      <tr><td colSpan={12} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>{dataRows.length === 0 ? "No records found." : `No matches for "${search}".`}</td></tr>
                    )}
                    {filteredRows.map((row, ri) => {
                      const isTotal = isTotalRow(row);
                      const rowBg = isTotal
                        ? "linear-gradient(135deg,#fffbeb,#fef3c7)"
                        : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const cb = {
                        padding: "9px 8px",
                        borderBottom: isTotal ? "2px solid #fcd34d" : "1px solid #e2e8f0",
                        borderTop: isTotal ? "1.5px solid #fcd34d" : "none",
                        borderRight: "1px solid #eef2f6",
                        fontSize: "12px", verticalAlign: "middle",
                      };

                      const numCell = (val, palBg, palText, isDec = false, isStrong = false, extra = {}) => {
                        const v = numOrZero(val);
                        const has = v !== 0;
                        return (
                          <td className="tscnrega-num" style={{
                            ...cb, ...extra, textAlign: "right", paddingRight: "12px",
                            background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (has ? palBg : "transparent"),
                            color: isTotal ? "#78350f" : (has ? palText : "#cbd5e0"),
                            fontWeight: isTotal ? 900 : (isStrong ? 800 : 700),
                          }}>
                            {has ? (isDec ? fmtDec(val) : fmtInt(val)) : "—"}
                          </td>
                        );
                      };

                      const pctCell = (p, palBg, palText) => (
                        <td className="tscnrega-num" style={{
                          ...cb, textAlign: "center",
                          background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : palBg,
                          color: isTotal ? "#78350f" : pctColor(p),
                          fontWeight: isTotal ? 900 : 800,
                        }}>
                          {p > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                              <span style={{ fontSize: "12.5px", color: isTotal ? "#78350f" : palText }}>{fmtPct(p)}</span>
                              <div className="tscnrega-pbar-track" style={{ marginTop: "3px" }}>
                                <div className="tscnrega-pbar-fill" style={{ width: `${Math.min(100, p)}%`, background: pctColor(p) }} />
                              </div>
                            </div>
                          ) : "—"}
                        </td>
                      );

                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="tscnrega-tr" style={{ background: rowBg }}>
                          <td style={{
                            ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0",
                            color: isTotal ? "#78350f" : "#475569", fontWeight: isTotal ? 900 : 700,
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "26px", height: "26px", borderRadius: "50%",
                              background: isTotal ? "linear-gradient(135deg,#fbbf24,#f59e0b)" : "linear-gradient(135deg,#e2e8f0,#cbd5e1)",
                              color: isTotal ? "#fff" : "#1e293b",
                              fontWeight: 800, fontSize: "11px",
                            }}>{row.sl_no}</span>
                          </td>
                          <td style={{
                            ...cb, textAlign: "left", paddingLeft: "12px",
                            color: isTotal ? "#78350f" : "#0f172a",
                            fontWeight: isTotal ? 900 : 700,
                            borderRight: "2px solid #e2e8f0",
                          }}>
                            {isTotal ? <>🟰 <span style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>{row.block_name}</span></> : (row.block_name || "—")}
                          </td>
                          {/* Physical works */}
                          {numCell(row.ongoing_works,  "#eff6ff", "#1e40af", false, false)}
                          {numCell(row.ongoing_as_on, "#eff6ff", "#1e40af", false, false)}
                          {numCell(row.approved_cy,    "#eff6ff", "#1e40af", false, false)}
                          {numCell(row.ongoing_cy,     "#eff6ff", "#1e40af", false, false)}
                          {numCell(row.completed,      "linear-gradient(135deg,#dbeafe,#bfdbfe)", "#1e3a8a", false, true, { borderRight: "2px solid #e2e8f0" })}
                          {/* % works */}
                          {pctCell(numOrZero(row.pct_works), "linear-gradient(135deg,#fef9c3,#fef3c7)", "#854d0e")}
                          {/* Financial */}
                          {numCell(row.exp_gp,   "#fdf2f8", "#9d174d", true, false)}
                          {numCell(row.exp_line, "linear-gradient(135deg,#fce7f3,#fbcfe8)", "#831843", true, true, { borderRight: "2px solid #e2e8f0" })}
                          {/* % exp */}
                          {pctCell(numOrZero(row.pct_exp), "linear-gradient(135deg,#fffbeb,#fef3c7)", "#854d0e")}
                          {/* Mandays */}
                          {numCell(row.mandays, "linear-gradient(135deg,#f5f3ff,#ede9fe)", "#5b21b6", false, true)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {districtName} — {monthLabel} {filter.year}
                  &nbsp;·&nbsp; MGNREGA · Sericulture Line Dept · {filteredRows.length} / {dataRows.length} rows
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

export default TscMonthlyNregaProgressReport;
