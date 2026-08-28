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
const MONTH_KN = [
  "", "ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್",
  "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್",
];

if (!document.getElementById("tr-styles")) {
  const s = document.createElement("style");
  s.id = "tr-styles";
  s.innerHTML = `
    .tr-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tr-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tr-swal .swal2-icon { margin:20px auto 4px !important; }
    .tr-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tr-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tr-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tr-wrap { animation: tr-in .35s ease; }
    .tr-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tr-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tr-scroll::-webkit-scrollbar { height:9px; }
    .tr-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tr-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
    .tr-pbar-track { width:100%; height:5px; background:rgba(0,0,0,.06); border-radius:99px; overflow:hidden; margin-top:4px; }
    .tr-pbar-fill { height:100%; border-radius:99px; transition:width .4s ease; }
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

const isTotalRow = (r, key) => String(r?.[key] || "").trim() === "ಒಟ್ಟು";
const pctColor = (p) => p >= 100 ? "#16a34a" : p >= 60 ? "#ca8a04" : p > 0 ? "#dc2626" : "#cbd5e1";

// ──────────────────────────────────────────────────────────────────────────
// Shared filter card — Institution + Year + Month
// ──────────────────────────────────────────────────────────────────────────
function InstitutionFilterCard({
  config, filter, setFilter, reset, institutionList,
  isLoading, hasReport, dataRows, filteredRows,
  isDownloadingPdf, isDownloadingExcel,
  onSubmit, onPdf, onExcel, extraRow,
}) {
  const { t } = useTranslation();
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn    = MONTH_KN[Number(filter.month)] || "";
  return (
    <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
      <div style={{ background: config.gradient, padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{config.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
            {config.headerKn} — {config.headerEn}
            <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>{config.formNo}</span>
          </div>
          <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>{config.subtitle}</div>
        </div>
        {hasReport && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{monthLabel} · {monthKn} {filter.year}</span>
            <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{filteredRows.length} / {dataRows.length} rows</span>
          </div>
        )}
      </div>
      <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
        <Form onSubmit={onSubmit}>
          <Row className="g-2 align-items-end">
            <Col md={5}>
              <label style={lbl}>{t("Training Institution", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
              <ReactSelect
                options={institutionList.map((i) => ({ value: String(i.trInstitutionMasterId), label: i.trInstitutionMasterName }))}
                placeholder={`— ${t("Search Institution", { ns: "reports" })} —`}
                isSearchable isClearable menuPlacement="auto"
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed" styles={reactSelectStyles}
                value={institutionList.map((i) => ({ value: String(i.trInstitutionMasterId), label: i.trInstitutionMasterName })).find((o) => o.value === String(filter.institutionId)) || null}
                onChange={(opt) => { setFilter((p) => ({ ...p, institutionId: opt?.value || "" })); reset(); }}
                noOptionsMessage={() => t("No institutions", { ns: "reports" })}
              />
            </Col>
            <Col md={2}>
              <label style={lbl}>{t("Year", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
              <Form.Select value={filter.year} onChange={(e) => { setFilter((p) => ({ ...p, year: e.target.value })); reset(); }} style={sel}>
                {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
              </Form.Select>
            </Col>
            <Col md={3}>
              <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
              <Form.Select value={filter.month} onChange={(e) => { setFilter((p) => ({ ...p, month: e.target.value })); reset(); }} style={sel}>
                {MONTHS.map((m) => <option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                {isLoading ? <><span className="spinner-border spinner-border-sm" /> {t("Loading…", { ns: "reports" })}</> : <>📋 {t("View", { ns: "reports" })}</>}
              </button>
            </Col>
          </Row>
          {hasReport && (
            <Row className="g-2 mt-2 align-items-end">
              {extraRow}
              <Col md={extraRow ? 4 : 12}>
                <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                  <button type="button" disabled={isDownloadingPdf} onClick={onPdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                    {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> {t("PDF…", { ns: "reports" })}</> : <>📄 {t("PDF", { ns: "reports" })}</>}
                  </button>
                  <button type="button" disabled={isDownloadingExcel} onClick={onExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                    {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> {t("Excel…", { ns: "reports" })}</> : <>📊 {t("Excel", { ns: "reports" })}</>}
                  </button>
                </div>
              </Col>
            </Row>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}

function useTrainingReport(endpointKey, filenamePrefix, friendlyTitle) {
  const { t } = useTranslation();
  const today = new Date();
  const [filter, setFilter] = useState({ institutionId: "", year: today.getFullYear(), month: today.getMonth() + 1 });
  const [institutionList, setInstitutionList] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [hasReport, setHasReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "trInstitutionMaster/get-all")
      .then((r) => setInstitutionList(r.data.content.trInstitutionMaster || []))
      .catch(() => setInstitutionList([]));
  }, []);

  const reset = () => { setHasReport(false); setDataRows([]); };
  const validate = () => {
    if (!filter.institutionId) return t("Please select a Training Institution.", { ns: "reports" });
    if (!filter.year)          return t("Please select a Year.", { ns: "reports" });
    if (!filter.month)         return t("Please select a Month.", { ns: "reports" });
    return null;
  };
  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: t("Required Fields", { ns: "reports" }),
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px"><p style="color:#92400e;font-size:14px;font-weight:700;margin:0">${msg}</p></div></div>`,
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "tr-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px"><p style="color:#9b2c2c;font-size:13px;font-weight:600;margin:0">${msg}</p></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "tr-swal" },
    });

  const params = () => ({ institutionId: filter.institutionId, year: Number(filter.year), month: Number(filter.month) });
  const handleView = async (e) => {
    e.preventDefault(); const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + `grainage-progress-report/${endpointKey}`, { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []); setHasReport(true);
    } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          showErr(t("No Data Found", { ns: "reports" }), t("No data found for the selected filters.", { ns: "reports" }));
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the {{title}} report.", { ns: "reports", title: friendlyTitle }));
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + `grainage-progress-report/${endpointKey}/pdf`, { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); } finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + `grainage-progress-report/${endpointKey}/excel`, { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      a.download = `${filenamePrefix}_${filter.institutionId}_${filter.year}_${filter.month}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); } finally { setIsDownloadingExcel(false); }
  };

  const institutionName = institutionList.find((i) => String(i.trInstitutionMasterId) === String(filter.institutionId))?.trInstitutionMasterName || "—";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn    = MONTH_KN[Number(filter.month)] || "";

  return {
    filter, setFilter, reset,
    institutionList, institutionName, monthLabel, monthKn,
    dataRows, hasReport, isLoading, isDownloadingPdf, isDownloadingExcel,
    handleView, handlePdf, handleExcel,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  Form 1 — Physical Progress (9 cols)
// ═══════════════════════════════════════════════════════════════════════════
export function TrainingPhysicalProgressReport() {
  const { t } = useTranslation();
  const rpt = useTrainingReport("training-report/physical-progress", "training_form1", "Training Form 1 · Physical Progress");
  const [hideTotals, setHideTotals] = useState(false);

  const filteredRows = useMemo(() => {
    if (hideTotals) return rpt.dataRows.filter((r) => !isTotalRow(r, "course_name"));
    return rpt.dataRows;
  }, [rpt.dataRows, hideTotals]);

  // A % total is only meaningful if at least one course has BOTH a target and an
  // achievement for that period; otherwise the total % would blend unrelated courses.
  const aligned = useMemo(() => {
    const d = rpt.dataRows.filter((r) => !isTotalRow(r, "course_name"));
    return {
      mo: d.some((r) => numOrZero(r.mo_target) > 0 && numOrZero(r.mo_ach) > 0),
      me: d.some((r) => numOrZero(r.me_target) > 0 && numOrZero(r.me_ach) > 0),
    };
  }, [rpt.dataRows]);

  const kpis = useMemo(() => {
    const tot = rpt.dataRows.find((r) => isTotalRow(r, "course_name")); if (!tot) return null;
    return {
      annual: numOrZero(tot.annual_target),
      moTgt:  numOrZero(tot.mo_target),  moAch: numOrZero(tot.mo_ach),
      meTgt:  numOrZero(tot.me_target),  meAch: numOrZero(tot.me_ach),
      pctMo:  aligned.mo ? numOrZero(tot.pct_mo) : null,
      pctMe:  aligned.me ? numOrZero(tot.pct_me) : null,
    };
  }, [rpt.dataRows, aligned]);

  return (
    <Layout title={t("Training · Form 1 · Physical Progress", { ns: "reports" })}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ನಮೂನೆ-1 · ತರಬೇತಿ ಭೌತಿಕ ಪ್ರಗತಿ")}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
            Training · Form 1
          </span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <InstitutionFilterCard
          config={{ formNo: "Form 1", icon: "🎓",
            gradient: "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 50%,#15803d 100%)",
            headerKn: "ತರಬೇತಿ ಭೌತಿಕ ಪ್ರಗತಿ", headerEn: "Training Physical Progress",
            subtitle: "Course × Annual / Mo / ME Target vs Achievement · % completion · Trainees" }}
          filter={rpt.filter} setFilter={rpt.setFilter} reset={() => { rpt.reset(); setHideTotals(false); }}
          institutionList={rpt.institutionList} isLoading={rpt.isLoading} hasReport={rpt.hasReport}
          dataRows={rpt.dataRows} filteredRows={filteredRows}
          isDownloadingPdf={rpt.isDownloadingPdf} isDownloadingExcel={rpt.isDownloadingExcel}
          onSubmit={rpt.handleView} onPdf={rpt.handlePdf} onExcel={rpt.handleExcel}
          extraRow={
            <Col md={4}><label style={lbl}>{t("Total row", { ns: "reports" })}</label>
              <button type="button" onClick={() => setHideTotals((v) => !v)} style={{ width: "100%", padding: "7px 12px", borderRadius: "9px", border: "none", background: hideTotals ? "#f1f5f9" : "linear-gradient(135deg,#fef3c7,#fde68a)", color: hideTotals ? "#475569" : "#854d0e", fontWeight: 800, fontSize: "12.5px", cursor: "pointer" }}>
                {hideTotals ? `🚫 ${t("Total hidden", { ns: "reports" })}` : `✓ ${t("Total shown", { ns: "reports" })}`}
              </button>
            </Col>
          }
        />

        {rpt.hasReport && (
          <div className="tr-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", minWidth: "240px" }}>
                <div style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Institution</div>
                <div style={{ fontSize: "14px", color: "#1a202c", fontWeight: 800, marginTop: "2px" }}>🏫 {rpt.institutionName}</div>
                <div style={{ fontSize: "10.5px", color: "#0f766e", marginTop: "1px" }}>{rpt.monthLabel} {rpt.filter.year}</div>
              </div>
              {kpis && <>
                <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", minWidth: "190px" }}>
                  <div style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ವಾರ್ಷಿಕ ಗುರಿ</div>
                  <div className="tr-num" style={{ fontSize: "18px", color: "#78350f", fontWeight: 800 }}>{fmtInt(kpis.annual)}</div>
                  <div style={{ fontSize: "10.5px", color: "#a16207" }}>trainees · annual target</div>
                </div>
                <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", minWidth: "200px" }}>
                  <div style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Mo · Ach / Tgt</div>
                  <div className="tr-num" style={{ fontSize: "14px", color: "#1e3a8a", fontWeight: 800 }}>{fmtInt(kpis.moAch)} / {fmtInt(kpis.moTgt)}</div>
                  <div className="tr-pbar-track"><div className="tr-pbar-fill" style={{ width: `${Math.min(100, kpis.pctMo || 0)}%`, background: pctColor(kpis.pctMo || 0) }} /></div>
                  <div className="tr-num" style={{ fontSize: "10.5px", color: "#1e40af", fontWeight: 700, marginTop: "2px" }}>{kpis.pctMo == null ? "—" : fmtPct(kpis.pctMo)}</div>
                </div>
                <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", minWidth: "200px" }}>
                  <div style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ME · Ach / Tgt</div>
                  <div className="tr-num" style={{ fontSize: "14px", color: "#14532d", fontWeight: 800 }}>{fmtInt(kpis.meAch)} / {fmtInt(kpis.meTgt)}</div>
                  <div className="tr-pbar-track"><div className="tr-pbar-fill" style={{ width: `${Math.min(100, kpis.pctMe || 0)}%`, background: pctColor(kpis.pctMe || 0) }} /></div>
                  <div className="tr-num" style={{ fontSize: "10.5px", color: "#15803d", fontWeight: 700, marginTop: "2px" }}>{kpis.pctMe == null ? "—" : fmtPct(kpis.pctMe)}</div>
                </div>
              </>}
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ನಮೂನೆ-1 · ತರಬೇತಿ ಭೌತಿಕ ಪ್ರಗತಿ — {rpt.institutionName} — {rpt.monthKn} {rpt.filter.year}
              </div>
              <div className="tr-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1300px" }}>
                  <thead><tr>
                    {[
                      { kn: "ಕ್ರ.ಸಂ.", en: "Sl",         w: 55,  bg: "linear-gradient(135deg,#1e293b,#36506b)", align: "center" },
                      { kn: "ತರಬೇತಿ ವಿವರ", en: "Course",  w: 280, bg: "linear-gradient(135deg,#334155,#475569)", align: "left" },
                      { kn: "ವಾರ್ಷಿಕ", en: "Annual Tgt",  w: 130, bg: "linear-gradient(135deg,#a16207,#ca8a04)", align: "right" },
                      { kn: "ಮಾಸ ಗುರಿ", en: "Mo Target",  w: 120, bg: "linear-gradient(135deg,#1d4ed8,#3b82f6)", align: "right" },
                      { kn: "ಮಾಸ ಸಾಧನೆ", en: "Mo Ach",    w: 120, bg: "linear-gradient(135deg,#0f766e,#14b8a6)", align: "right" },
                      { kn: "% ಮಾಸ", en: "% Mo",          w: 140, bg: "linear-gradient(135deg,#a16207,#ca8a04)", align: "center" },
                      { kn: "ಅಂತ್ಯ ಗುರಿ", en: "ME Target", w: 120, bg: "linear-gradient(135deg,#1d4ed8,#3b82f6)", align: "right" },
                      { kn: "ಅಂತ್ಯ ಸಾಧನೆ", en: "ME Ach",   w: 120, bg: "linear-gradient(135deg,#15803d,#22c55e)", align: "right" },
                      { kn: "% ಅಂತ್ಯ", en: "% ME",         w: 140, bg: "linear-gradient(135deg,#a16207,#fbbf24)", align: "center" },
                    ].map((c, i) => (
                      <th key={i} style={{ background: c.bg, color: "#fff", padding: "10px 8px", textAlign: c.align === "left" ? "left" : c.align === "right" ? "right" : "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: c.w, position: "sticky", top: 0, zIndex: 2 }}>
                        <div style={{ fontSize: "11.5px" }}>{c.kn}</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>{c.en}</div>
                      </th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filteredRows.length === 0 && <tr><td colSpan={9} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0" }}>{rpt.dataRows.length === 0 ? t("No records found.", { ns: "reports" }) : t("Total row is hidden.", { ns: "reports" })}</td></tr>}
                    {filteredRows.map((row, ri) => {
                      const isTotal = isTotalRow(row, "course_name");
                      const rowBg = isTotal ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const cb = { padding: "9px 8px",
                        borderBottom: isTotal ? "2px solid #fcd34d" : "1px solid #e2e8f0",
                        borderTop: isTotal ? "1.5px solid #fcd34d" : "none",
                        borderRight: "1px solid #eef2f6", fontSize: "12px", verticalAlign: "middle" };
                      const numCell = (v, palBg, palText, isStrong = false) => {
                        const n = numOrZero(v); const has = n !== 0;
                        return <td className="tr-num" style={{ ...cb, textAlign: "right", paddingRight: "12px",
                          background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (has ? palBg : "transparent"),
                          color: isTotal ? "#78350f" : (has ? palText : "#cbd5e0"),
                          fontWeight: isTotal ? 900 : (isStrong ? 800 : 700) }}>{has ? fmtInt(v) : "—"}</td>;
                      };
                      const pctCell = (p) => (
                        <td className="tr-num" style={{ ...cb, textAlign: "center", background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : "transparent", color: isTotal ? "#78350f" : pctColor(p), fontWeight: isTotal ? 900 : 800 }}>
                          {p > 0 ? <><div>{fmtPct(p)}</div><div className="tr-pbar-track"><div className="tr-pbar-fill" style={{ width: `${Math.min(100, p)}%`, background: pctColor(p) }} /></div></> : "—"}
                        </td>
                      );
                      return (
                        <tr key={ri} className="tr-tr" style={{ background: rowBg }}>
                          <td style={{ ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0", color: isTotal ? "#78350f" : "#475569", fontWeight: isTotal ? 900 : 700 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "26px", height: "26px", borderRadius: "50%", background: isTotal ? "linear-gradient(135deg,#fbbf24,#f59e0b)" : "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: isTotal ? "#fff" : "#1e293b", fontWeight: 800, fontSize: "11px" }}>{row.sl_no}</span>
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "12px", color: isTotal ? "#78350f" : "#0f172a", fontWeight: isTotal ? 900 : 700, borderRight: "2px solid #e2e8f0" }}>
                            {isTotal ? <>🟰 <span style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>{row.course_name}</span></> : <>📚 {row.course_name || "—"}</>}
                          </td>
                          {numCell(row.annual_target, "#fffbeb", "#854d0e", true)}
                          {numCell(row.mo_target,    "#eff6ff", "#1e40af")}
                          {numCell(row.mo_ach,       "#f0fdfa", "#115e59", true)}
                          {pctCell(isTotal && !aligned.mo ? 0 : numOrZero(row.pct_mo))}
                          {numCell(row.me_target,    "linear-gradient(135deg,#dbeafe,#bfdbfe)", "#1e3a8a")}
                          {numCell(row.me_ach,       "linear-gradient(135deg,#dcfce7,#bbf7d0)", "#14532d", true)}
                          {pctCell(isTotal && !aligned.me ? 0 : numOrZero(row.pct_me))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </Block>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Form 2 — Financial Progress (11 cols)
// ═══════════════════════════════════════════════════════════════════════════
export function TrainingFinancialProgressReport() {
  const { t } = useTranslation();
  const rpt = useTrainingReport("training-report/financial-progress", "training_form2", "Training Form 2 · Financial Progress");
  const [hideTotals, setHideTotals] = useState(false);
  const filteredRows = useMemo(() => hideTotals ? rpt.dataRows.filter((r) => !isTotalRow(r, "course_name")) : rpt.dataRows, [rpt.dataRows, hideTotals]);

  const kpis = useMemo(() => {
    const tot = rpt.dataRows.find((r) => isTotalRow(r, "course_name")); if (!tot) return null;
    return {
      annual: numOrZero(tot.annual_target),
      relMo: numOrZero(tot.released_mo), relMe: numOrZero(tot.released_me),
      spentMo: numOrZero(tot.spent_mo),  spentMe: numOrZero(tot.spent_me),
      pctMo: numOrZero(tot.pct_spent_mo), pctMe: numOrZero(tot.pct_spent_me),
    };
  }, [rpt.dataRows]);

  return (
    <Layout title={t("Training · Form 2 · Financial Progress", { ns: "reports" })}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ನಮೂನೆ-2 · ತರಬೇತಿ ಆರ್ಥಿಕ ಪ್ರಗತಿ")}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
            Training · Form 2
          </span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <InstitutionFilterCard
          config={{ formNo: "Form 2", icon: "💰",
            gradient: "linear-gradient(135deg,#a16207 0%,#ca8a04 50%,#7c3aed 100%)",
            headerKn: "ತರಬೇತಿ ಆರ್ಥಿಕ ಪ್ರಗತಿ", headerEn: "Training Financial Progress",
            subtitle: "Course × Annual Target · Released (Mo/ME) · Target (Mo/ME) · Spent (Mo/ME) · % Spent" }}
          filter={rpt.filter} setFilter={rpt.setFilter} reset={() => { rpt.reset(); setHideTotals(false); }}
          institutionList={rpt.institutionList} isLoading={rpt.isLoading} hasReport={rpt.hasReport}
          dataRows={rpt.dataRows} filteredRows={filteredRows}
          isDownloadingPdf={rpt.isDownloadingPdf} isDownloadingExcel={rpt.isDownloadingExcel}
          onSubmit={rpt.handleView} onPdf={rpt.handlePdf} onExcel={rpt.handleExcel}
          extraRow={
            <Col md={4}><label style={lbl}>{t("Total row", { ns: "reports" })}</label>
              <button type="button" onClick={() => setHideTotals((v) => !v)} style={{ width: "100%", padding: "7px 12px", borderRadius: "9px", border: "none", background: hideTotals ? "#f1f5f9" : "linear-gradient(135deg,#fef3c7,#fde68a)", color: hideTotals ? "#475569" : "#854d0e", fontWeight: 800, fontSize: "12.5px", cursor: "pointer" }}>
                {hideTotals ? `🚫 ${t("Total hidden", { ns: "reports" })}` : `✓ ${t("Total shown", { ns: "reports" })}`}
              </button>
            </Col>
          }
        />

        {rpt.hasReport && (
          <div className="tr-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", minWidth: "240px" }}>
                <div style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Institution</div>
                <div style={{ fontSize: "14px", color: "#1a202c", fontWeight: 800, marginTop: "2px" }}>🏫 {rpt.institutionName}</div>
                <div style={{ fontSize: "10.5px", color: "#0f766e", marginTop: "1px" }}>{rpt.monthLabel} {rpt.filter.year}</div>
              </div>
              {kpis && <>
                <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", minWidth: "190px" }}>
                  <div style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Annual Budget</div>
                  <div className="tr-num" style={{ fontSize: "16px", color: "#78350f", fontWeight: 800 }}>₹ {fmtDec(kpis.annual)} L</div>
                </div>
                <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", minWidth: "200px" }}>
                  <div style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Mo · Spent / Released</div>
                  <div className="tr-num" style={{ fontSize: "13px", color: "#1e3a8a", fontWeight: 800 }}>₹ {fmtDec(kpis.spentMo)} / {fmtDec(kpis.relMo)} L</div>
                  <div className="tr-pbar-track"><div className="tr-pbar-fill" style={{ width: `${Math.min(100, kpis.pctMo)}%`, background: pctColor(kpis.pctMo) }} /></div>
                  <div className="tr-num" style={{ fontSize: "10.5px", color: "#1e40af", fontWeight: 700, marginTop: "2px" }}>{fmtPct(kpis.pctMo)}</div>
                </div>
                <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", minWidth: "210px" }}>
                  <div style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ME · Spent / Released</div>
                  <div className="tr-num" style={{ fontSize: "13px", color: "#14532d", fontWeight: 800 }}>₹ {fmtDec(kpis.spentMe)} / {fmtDec(kpis.relMe)} L</div>
                  <div className="tr-pbar-track"><div className="tr-pbar-fill" style={{ width: `${Math.min(100, kpis.pctMe)}%`, background: pctColor(kpis.pctMe) }} /></div>
                  <div className="tr-num" style={{ fontSize: "10.5px", color: "#15803d", fontWeight: 700, marginTop: "2px" }}>{fmtPct(kpis.pctMe)}</div>
                </div>
              </>}
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ನಮೂನೆ-2 · ತರಬೇತಿ ಆರ್ಥಿಕ ಪ್ರಗತಿ — {rpt.institutionName} — {rpt.monthKn} {rpt.filter.year}
              </div>
              <div className="tr-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1700px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#1e293b,#36506b)", color: "#fff", padding: "10px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, width: "55px", position: "sticky", top: 0, zIndex: 2 }}>ಕ್ರ.ಸಂ.<div style={{ fontSize: "9px", opacity: .85 }}>Sl.</div></th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#334155,#475569)", color: "#fff", padding: "10px 14px", textAlign: "left", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "260px", position: "sticky", top: 0, zIndex: 2 }}><div style={{ fontSize: "12.5px" }}>ತರಬೇತಿ ವಿವರ</div><div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Course</div></th>
                      <th rowSpan={2} style={{ background: "linear-gradient(135deg,#a16207,#ca8a04)", color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "130px", position: "sticky", top: 0, zIndex: 2 }}><div style={{ fontSize: "11.5px" }}>ವಾರ್ಷಿಕ</div><div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Annual (₹L)</div></th>
                      <th colSpan={2} style={{ background: "linear-gradient(135deg,#0e7490,#06b6d4)", color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}><div style={{ fontSize: "12px" }}>ಬಿಡುಗಡೆ</div><div style={{ fontSize: "9px", opacity: .85 }}>Released</div></th>
                      <th colSpan={3} style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}><div style={{ fontSize: "12px" }}>ಮಾಸ ವೆಚ್ಚ</div><div style={{ fontSize: "9px", opacity: .85 }}>Monthly Spend</div></th>
                      <th colSpan={3} style={{ background: "linear-gradient(135deg,#15803d,#22c55e)", color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}><div style={{ fontSize: "12px" }}>ಅಂತ್ಯ ವೆಚ್ಚ</div><div style={{ fontSize: "9px", opacity: .85 }}>ME Spend</div></th>
                    </tr>
                    <tr>
                      {[
                        { en: "Mo (₹L)", tone: "linear-gradient(180deg,#67e8f9,#22d3ee)", text: "#0c4a6e" },
                        { en: "ME (₹L)", tone: "linear-gradient(180deg,#67e8f9,#22d3ee)", text: "#0c4a6e", strong: true },
                        { en: "Tgt Mo",  tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a" },
                        { en: "Spent Mo",tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a", strong: true },
                        { en: "% Spent", tone: "linear-gradient(180deg,#fde68a,#fcd34d)", text: "#78350f" },
                        { en: "Tgt ME",  tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d" },
                        { en: "Spent ME",tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d", strong: true },
                        { en: "% Spent", tone: "linear-gradient(180deg,#fde68a,#fcd34d)", text: "#78350f" },
                      ].map((c, i) => (
                        <th key={i} style={{ background: c.tone, color: c.text, padding: "7px 4px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: c.strong ? 800 : 700, minWidth: "100px", position: "sticky", top: "44px", zIndex: 2 }}>
                          <div style={{ fontSize: "10px" }}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && <tr><td colSpan={11} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0" }}>{rpt.dataRows.length === 0 ? t("No records found.", { ns: "reports" }) : t("Total row is hidden.", { ns: "reports" })}</td></tr>}
                    {filteredRows.map((row, ri) => {
                      const isTotal = isTotalRow(row, "course_name");
                      const rowBg = isTotal ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const cb = { padding: "9px 8px",
                        borderBottom: isTotal ? "2px solid #fcd34d" : "1px solid #e2e8f0",
                        borderTop: isTotal ? "1.5px solid #fcd34d" : "none",
                        borderRight: "1px solid #eef2f6", fontSize: "11.5px", verticalAlign: "middle" };
                      const numCell = (v, palBg, palText, isStrong = false, extra = {}) => {
                        const n = numOrZero(v); const has = n !== 0;
                        return <td className="tr-num" style={{ ...cb, ...extra, textAlign: "right", paddingRight: "12px",
                          background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (has ? palBg : "transparent"),
                          color: isTotal ? "#78350f" : (has ? palText : "#cbd5e0"),
                          fontWeight: isTotal ? 900 : (isStrong ? 800 : 700) }}>{has ? `₹ ${fmtDec(v)}` : "—"}</td>;
                      };
                      const pctCell = (p) => (
                        <td className="tr-num" style={{ ...cb, textAlign: "center", background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : "transparent", color: isTotal ? "#78350f" : pctColor(p), fontWeight: isTotal ? 900 : 800 }}>
                          {p > 0 ? <><div>{fmtPct(p)}</div><div className="tr-pbar-track"><div className="tr-pbar-fill" style={{ width: `${Math.min(100, p)}%`, background: pctColor(p) }} /></div></> : "—"}
                        </td>
                      );
                      return (
                        <tr key={ri} className="tr-tr" style={{ background: rowBg }}>
                          <td style={{ ...cb, textAlign: "center", borderRight: "1px solid #e2e8f0", color: isTotal ? "#78350f" : "#475569", fontWeight: isTotal ? 900 : 700 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "26px", height: "26px", borderRadius: "50%", background: isTotal ? "linear-gradient(135deg,#fbbf24,#f59e0b)" : "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: isTotal ? "#fff" : "#1e293b", fontWeight: 800, fontSize: "11px" }}>{row.sl_no}</span>
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "12px", color: isTotal ? "#78350f" : "#0f172a", fontWeight: isTotal ? 900 : 700, borderRight: "2px solid #e2e8f0" }}>
                            {isTotal ? <>🟰 <span style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>{row.course_name}</span></> : <>📚 {row.course_name || "—"}</>}
                          </td>
                          {numCell(row.annual_target, "#fffbeb", "#854d0e", true, { borderRight: "2px solid #e2e8f0" })}
                          {numCell(row.released_mo,  "#ecfeff", "#155e75")}
                          {numCell(row.released_me,  "linear-gradient(135deg,#cffafe,#a5f3fc)", "#0c4a6e", true, { borderRight: "2px solid #e2e8f0" })}
                          {numCell(row.target_mo,    "#eff6ff", "#1e40af")}
                          {numCell(row.spent_mo,     "linear-gradient(135deg,#dbeafe,#bfdbfe)", "#1e3a8a", true)}
                          {pctCell(numOrZero(row.pct_spent_mo))}
                          {numCell(row.target_me,    "#f0fdf4", "#166534")}
                          {numCell(row.spent_me,     "linear-gradient(135deg,#dcfce7,#bbf7d0)", "#14532d", true)}
                          {pctCell(numOrZero(row.pct_spent_me))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </Block>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Form 3 — Maintenance Expense (3 cols, item-wise)
// ═══════════════════════════════════════════════════════════════════════════
export function TrainingMaintenanceExpenseReport() {
  const { t } = useTranslation();
  const rpt = useTrainingReport("training-report/maintenance-expense", "training_form3", "Training Form 3 · Maintenance Expense");

  const kpis = useMemo(() => {
    const tot = rpt.dataRows.find((r) => isTotalRow(r, "item_description")); if (!tot) return null;
    return { total: numOrZero(tot.amount_spent), itemCount: rpt.dataRows.length - 1 };
  }, [rpt.dataRows]);

  return (
    <Layout title={t("Training · Form 3 · Maintenance Expense", { ns: "reports" })}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ನಮೂನೆ-3 · ನಿರ್ವಹಣಾ ವೆಚ್ಚದ ಐಟಂವಾರು ವಿವರ")}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
            Training · Form 3
          </span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <InstitutionFilterCard
          config={{ formNo: "Form 3", icon: "🧾",
            gradient: "linear-gradient(135deg,#7c3aed 0%,#a78bfa 50%,#ca8a04 100%)",
            headerKn: "ನಿರ್ವಹಣಾ ವೆಚ್ಚದ ಐಟಂವಾರು ವಿವರ", headerEn: "Maintenance Expense — Itemwise",
            subtitle: "Itemwise maintenance expenditure (₹ Lakhs)" }}
          filter={rpt.filter} setFilter={rpt.setFilter} reset={rpt.reset}
          institutionList={rpt.institutionList} isLoading={rpt.isLoading} hasReport={rpt.hasReport}
          dataRows={rpt.dataRows} filteredRows={rpt.dataRows}
          isDownloadingPdf={rpt.isDownloadingPdf} isDownloadingExcel={rpt.isDownloadingExcel}
          onSubmit={rpt.handleView} onPdf={rpt.handlePdf} onExcel={rpt.handleExcel}
        />

        {rpt.hasReport && (
          <div className="tr-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", minWidth: "240px" }}>
                <div style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Institution</div>
                <div style={{ fontSize: "14px", color: "#1a202c", fontWeight: 800, marginTop: "2px" }}>🏫 {rpt.institutionName}</div>
                <div style={{ fontSize: "10.5px", color: "#0f766e", marginTop: "1px" }}>{rpt.monthLabel} {rpt.filter.year}</div>
              </div>
              {kpis && <>
                <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", minWidth: "200px" }}>
                  <div style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Total Maintenance</div>
                  <div className="tr-num" style={{ fontSize: "20px", color: "#78350f", fontWeight: 900 }}>₹ {fmtDec(kpis.total)} L</div>
                </div>
                <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", minWidth: "150px" }}>
                  <div style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Line Items</div>
                  <div className="tr-num" style={{ fontSize: "20px", color: "#4c1d95", fontWeight: 900 }}>{kpis.itemCount}</div>
                </div>
              </>}
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ನಮೂನೆ-3 · ನಿರ್ವಹಣಾ ವೆಚ್ಚ — {rpt.institutionName} — {rpt.monthKn} {rpt.filter.year}
              </div>
              <div className="tr-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "700px" }}>
                  <thead><tr>
                    <th style={{ background: "linear-gradient(135deg,#1e293b,#36506b)", color: "#fff", padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, width: "70px", position: "sticky", top: 0, zIndex: 2 }}>
                      <div style={{ fontSize: "12px" }}>ಕ್ರ.ಸಂ.</div><div style={{ fontSize: "9px", opacity: .85, marginTop: "2px" }}>Sl.</div>
                    </th>
                    <th style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "#fff", padding: "12px 16px", textAlign: "left", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, position: "sticky", top: 0, zIndex: 2 }}>
                      <div style={{ fontSize: "12.5px" }}>ನಿರ್ವಹಣಾ ವೆಚ್ಚದ ಐಟಂವಾರು ವಿವರ</div>
                      <div style={{ fontSize: "9.5px", opacity: .85, marginTop: "2px" }}>Item Description</div>
                    </th>
                    <th style={{ background: "linear-gradient(135deg,#a16207,#ca8a04)", color: "#fff", padding: "12px 12px", textAlign: "right", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: "200px", position: "sticky", top: 0, zIndex: 2 }}>
                      <div style={{ fontSize: "12.5px" }}>ಖರ್ಚಾದ ಮೊತ್ತ</div>
                      <div style={{ fontSize: "9.5px", opacity: .85, marginTop: "2px" }}>Amount Spent (₹ Lakhs)</div>
                    </th>
                  </tr></thead>
                  <tbody>
                    {rpt.dataRows.length === 0 && <tr><td colSpan={3} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0" }}>{t("No records found.", { ns: "reports" })}</td></tr>}
                    {rpt.dataRows.map((row, ri) => {
                      const isTotal = isTotalRow(row, "item_description");
                      const rowBg = isTotal ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const cb = { padding: "10px 12px",
                        borderBottom: isTotal ? "2px solid #fcd34d" : "1px solid #e2e8f0",
                        borderTop: isTotal ? "1.5px solid #fcd34d" : "none",
                        borderRight: "1px solid #eef2f6", fontSize: "12.5px", verticalAlign: "middle" };
                      const amt = numOrZero(row.amount_spent);
                      return (
                        <tr key={ri} className="tr-tr" style={{ background: rowBg }}>
                          <td style={{ ...cb, textAlign: "center", color: isTotal ? "#78350f" : "#475569", fontWeight: isTotal ? 900 : 700 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "28px", height: "28px", borderRadius: "50%", background: isTotal ? "linear-gradient(135deg,#fbbf24,#f59e0b)" : "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: isTotal ? "#fff" : "#1e293b", fontWeight: 800, fontSize: "11.5px" }}>{row.sl_no}</span>
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "16px", color: isTotal ? "#78350f" : "#0f172a", fontWeight: isTotal ? 900 : 600 }}>
                            {isTotal ? <>🟰 <span style={{ textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 800 }}>{row.item_description}</span></> : <>🧾 {row.item_description || "—"}</>}
                          </td>
                          <td className="tr-num" style={{ ...cb, textAlign: "right", paddingRight: "18px",
                            background: isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : (amt > 0 ? "linear-gradient(135deg,#fef9c3,#fef3c7)" : "transparent"),
                            color: isTotal ? "#78350f" : (amt > 0 ? "#854d0e" : "#cbd5e0"),
                            fontWeight: isTotal ? 900 : 800, fontSize: "13.5px" }}>
                            {amt > 0 ? `₹ ${fmtDec(row.amount_spent)} L` : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </Block>
    </Layout>
  );
}
