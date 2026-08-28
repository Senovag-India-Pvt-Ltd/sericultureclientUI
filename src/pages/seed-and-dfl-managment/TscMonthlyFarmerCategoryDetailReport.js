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

if (!document.getElementById("tscfcd-styles")) {
  const s = document.createElement("style");
  s.id = "tscfcd-styles";
  s.innerHTML = `
    .tscfcd-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tscfcd-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tscfcd-swal .swal2-icon { margin:20px auto 4px !important; }
    .tscfcd-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tscfcd-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tscfcd-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tscfcd-wrap { animation: tscfcd-in .35s ease; }
    .tscfcd-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tscfcd-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tscfcd-scroll::-webkit-scrollbar { height:9px; }
    .tscfcd-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tscfcd-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
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

const yearOptions = (() => {
  const cur = new Date().getFullYear(); const arr = [];
  for (let y = cur + 1; y >= cur - 5; y--) arr.push({ value: y, label: String(y) });
  return arr;
})();

function TscMonthlyFarmerCategoryDetailReport() {
  const { t, i18n } = useTranslation();

  const today = new Date();
  const [filter, setFilter] = useState({ districtId: "", talukId: "", year: today.getFullYear(), month: today.getMonth() + 1 });
  const [districtList, setDistrictList] = useState([]);
  const [talukList, setTalukList] = useState([]);
  const [search, setSearch] = useState("");
  const [hideTotals, setHideTotals] = useState(false);

  const [dataRows, setDataRows] = useState([]);
  const [hasReport, setHasReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => { api.get(baseURL + "district/get-all").then((r) => setDistrictList(r.data.content.district || [])).catch(() => setDistrictList([])); }, []);
  useEffect(() => {
    if (!filter.districtId) { setTalukList([]); return; }
    api.get(baseURL + `taluk/get-by-district-id/${filter.districtId}`).then((r) => setTalukList(r.data.content.taluk || [])).catch(() => setTalukList([]));
  }, [filter.districtId]);

  const reset = () => { setHasReport(false); setDataRows([]); setSearch(""); setHideTotals(false); };
  const validate = () => {
    if (!filter.districtId) return t("Please select a District.", { ns: "reports" });
    if (!filter.talukId)    return t("Please select a Taluk.", { ns: "reports" });
    if (!filter.year)       return t("Please select a Year.", { ns: "reports" });
    if (!filter.month)      return t("Please select a Month.", { ns: "reports" });
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: t("Required Fields", { ns: "reports" }),
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">${t("Missing Selection", { ns: "reports" })}</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706", background: "#fff", customClass: { popup: "tscfcd-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e", background: "#fff", customClass: { popup: "tscfcd-swal" },
    });

  const params = () => ({ talukId: filter.talukId, year: Number(filter.year), month: Number(filter.month) });

  const handleView = async (e) => {
    e.preventDefault(); const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/farmer-category-detail", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the TSC Monthly Farmer Category Detail report.", { ns: "reports" }));
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/farmer-category-detail/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); } finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/farmer-category-detail/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      a.download = `tsc_monthly_farmer_category_detail_${filter.talukId}_${filter.year}_${filter.month}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); } finally { setIsDownloadingExcel(false); }
  };

  const selectedDistrict = districtList.find((d) => String(d.districtId) === String(filter.districtId));
  const selectedTaluk    = talukList.find((tk) => String(tk.talukId) === String(filter.talukId));
  const districtName = (i18n.language === "kn" ? (selectedDistrict?.districtNameInKannada || selectedDistrict?.districtName) : selectedDistrict?.districtName) || "—";
  const talukName    = (i18n.language === "kn" ? (selectedTaluk?.talukNameInKannada || selectedTaluk?.talukName) : selectedTaluk?.talukName) || "—";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn      = MONTH_KN[Number(filter.month)] || "";

  const isTotalRow = (r) => String(r.tsc_name || "").trim() === "ಒಟ್ಟು";

  const filteredRows = useMemo(() => {
    let rows = dataRows;
    if (hideTotals) rows = rows.filter((r) => !isTotalRow(r));
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((r) => String(r.tsc_name ?? "").toLowerCase().includes(q));
  }, [dataRows, search, hideTotals]);

  const kpis = useMemo(() => {
    const totalRow = dataRows.find(isTotalRow);
    if (!totalRow) return null;
    const farmer = numOrZero(totalRow.farmer_count);
    const sc = numOrZero(totalRow.sc_cnt), st = numOrZero(totalRow.st_cnt);
    const min = numOrZero(totalRow.min_cnt), dis = numOrZero(totalRow.dis_cnt);
    const women = numOrZero(totalRow.women), men = numOrZero(totalRow.men);
    const marg = numOrZero(totalRow.marg), big = numOrZero(totalRow.big);
    return {
      villages: numOrZero(totalRow.villages),
      area:     numOrZero(totalRow.area),
      farmer,
      sc, st, min, dis,
      women, men, marg, big,
      womenPct: farmer > 0 ? (women * 100) / farmer : 0,
      menPct:   farmer > 0 ? (men   * 100) / farmer : 0,
      margPct:  farmer > 0 ? (marg  * 100) / farmer : 0,
      bigPct:   farmer > 0 ? (big   * 100) / farmer : 0,
    };
  }, [dataRows]);

  return (
    <Layout title={t("TSC Monthly Farmer Category Detail", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ರೇಷ್ಮೆ ಬೆಳೆಗಾರರ ವರ್ಗವಾರು ವಿವರ — ಮಾಸಿಕ")}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                ADS · Farmer Category Detail
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#0e7490 0%,#06b6d4 35%,#7c3aed 70%,#15803d 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>👥</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ರೇಷ್ಮೆ ಬೆಳೆಗಾರರ ವರ್ಗವಾರು ವಿವರ — Farmer Category Detail
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>
                Coverage (Villages · Area · Farmers) · By Category (SC/ST/Min/Dis/Other) · By Land Holding (Big/Mid/Small/Marg) · By Gender (Women/Men)
              </div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{monthLabel} · {monthKn} {filter.year}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{filteredRows.length} / {dataRows.length} rows</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>{t("District")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={districtList.map((d) => ({ value: String(d.districtId), label: i18n.language === "kn" ? (d.districtNameInKannada || d.districtName) : d.districtName }))}
                    placeholder={t("— Search District —", { ns: "reports" })}
                    isSearchable isClearable menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed" styles={reactSelectStyles}
                    value={districtList.map((d) => ({ value: String(d.districtId), label: i18n.language === "kn" ? (d.districtNameInKannada || d.districtName) : d.districtName })).find((o) => o.value === String(filter.districtId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, districtId: opt?.value || "", talukId: "" })); reset(); }}
                    noOptionsMessage={() => t("No districts", { ns: "reports" })}
                  />
                </Col>
                <Col md={3}>
                  <label style={lbl}>{t("Taluk")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={talukList.map((tk) => ({ value: String(tk.talukId), label: i18n.language === "kn" ? (tk.talukNameInKannada || tk.talukName) : tk.talukName }))}
                    placeholder={filter.districtId ? t("— Search Taluk —", { ns: "reports" }) : t("Select District first", { ns: "reports" })}
                    isSearchable isClearable isDisabled={!filter.districtId} menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed" styles={reactSelectStyles}
                    value={talukList.map((tk) => ({ value: String(tk.talukId), label: i18n.language === "kn" ? (tk.talukNameInKannada || tk.talukName) : tk.talukName })).find((o) => o.value === String(filter.talukId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, talukId: opt?.value || "" })); reset(); }}
                    noOptionsMessage={() => t("No taluks", { ns: "reports" })}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Year", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select value={filter.year} onChange={(e) => { setFilter((p) => ({ ...p, year: e.target.value })); reset(); }} style={sel}>
                    {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
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
                  <Col md={5}>
                    <label style={lbl}>{t("Quick Search (TSC)", { ns: "reports" })}</label>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Type to filter…", { ns: "reports" })} style={{ ...sel, padding: "8px 12px" }} />
                  </Col>
                  <Col md={3}>
                    <label style={lbl}>{t("Totals row", { ns: "reports" })}</label>
                    <button type="button" onClick={() => setHideTotals((v) => !v)}
                      style={{
                        width: "100%", padding: "7px 12px", borderRadius: "9px", border: "none",
                        background: hideTotals ? "#f1f5f9" : "linear-gradient(135deg,#fef3c7,#fde68a)",
                        color: hideTotals ? "#475569" : "#854d0e",
                        fontWeight: 800, fontSize: "12.5px", cursor: "pointer",
                      }}>
                      {hideTotals ? `🚫 ${t("Totals hidden", { ns: "reports" })}` : `✓ ${t("Totals shown", { ns: "reports" })}`}
                    </button>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                      <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                        {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> {t("PDF…", { ns: "reports" })}</> : <>📄 {t("PDF", { ns: "reports" })}</>}
                      </button>
                      <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                        {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> {t("Excel…", { ns: "reports" })}</> : <>📊 {t("Excel", { ns: "reports" })}</>}
                      </button>
                    </div>
                  </Col>
                </Row>
              )}
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="tscfcd-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-stretch">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("District / Taluk", { ns: "reports" })}</span>
                <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{districtName} · {talukName}</span>
              </div>
              {kpis && (
                <>
                  <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                    <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Total Farmers", { ns: "reports" })}</span>
                    <span className="tscfcd-num" style={{ fontSize: "18px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.farmer)}</span>
                    <span style={{ fontSize: "10.5px", color: "#1e40af", marginTop: "1px" }}>{t("Villages", { ns: "reports" })}: {fmtInt(kpis.villages)} · {t("Area", { ns: "reports" })}: {fmtDec(kpis.area)} ha</span>
                  </div>
                  <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "170px" }}>
                    <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("SC / ST", { ns: "reports" })}</span>
                    <span className="tscfcd-num" style={{ fontSize: "16px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.sc)} / {fmtInt(kpis.st)}</span>
                  </div>
                  <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                    <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Minority / Disabled", { ns: "reports" })}</span>
                    <span className="tscfcd-num" style={{ fontSize: "16px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.min)} / {fmtInt(kpis.dis)}</span>
                  </div>
                  <div style={{ background: "linear-gradient(135deg,#fbcfe8,#fce7f3)", border: "1.5px solid #f9a8d4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                    <span style={{ fontSize: "11px", color: "#9d174d", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Women / Men", { ns: "reports" })}</span>
                    <span className="tscfcd-num" style={{ fontSize: "16px", color: "#831843", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.women)} / {fmtInt(kpis.men)}</span>
                    <span className="tscfcd-num" style={{ fontSize: "10.5px", color: "#be185d", marginTop: "1px", fontWeight: 700 }}>{kpis.womenPct.toFixed(1)}% / {kpis.menPct.toFixed(1)}%</span>
                  </div>
                  <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                    <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Marginal ≤ 1 ha", { ns: "reports" })}</span>
                    <span className="tscfcd-num" style={{ fontSize: "16px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.marg)}</span>
                    <span className="tscfcd-num" style={{ fontSize: "10.5px", color: "#15803d", fontWeight: 700, marginTop: "1px" }}>{t("{{pct}}% of farmers", { ns: "reports", pct: kpis.margPct.toFixed(1) })}</span>
                  </div>
                  <div style={{ background: "linear-gradient(135deg,#fed7aa,#fde68a)", border: "1.5px solid #fdba74", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                    <span style={{ fontSize: "11px", color: "#9a3412", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Big > 10 ha", { ns: "reports" })}</span>
                    <span className="tscfcd-num" style={{ fontSize: "16px", color: "#7c2d12", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.big)}</span>
                    <span className="tscfcd-num" style={{ fontSize: "10.5px", color: "#9a3412", fontWeight: 700, marginTop: "1px" }}>{t("{{pct}}% of farmers", { ns: "reports", pct: kpis.bigPct.toFixed(1) })}</span>
                  </div>
                </>
              )}
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ರೇಷ್ಮೆ ಬೆಳೆಗಾರರ ವರ್ಗವಾರು ವಿವರ — {talukName} — {monthKn} {filter.year}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Farmer Category Detail · Coverage × Category × Land Holding × Gender · {monthLabel} {filter.year}
                </div>
              </div>

              <div className="tscfcd-scroll" style={{ overflowX: "auto", maxHeight: "70vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1800px" }}>
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
                        <div style={{ fontSize: "12px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#334155,#475569)", color: "#fff",
                        padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "180px", verticalAlign: "middle",
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>TSC</div>
                      </th>
                      <th colSpan={3} style={{
                        background: "linear-gradient(135deg,#0e7490,#06b6d4)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ವ್ಯಾಪ್ತಿ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Coverage</div>
                      </th>
                      <th colSpan={6} style={{
                        background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ವರ್ಗ ಆಧಾರ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>By Category</div>
                      </th>
                      <th colSpan={4} style={{
                        background: "linear-gradient(135deg,#15803d,#22c55e)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಭೂ ಹಿಡುವಳಿ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>By Land Holding</div>
                      </th>
                      <th colSpan={2} style={{
                        background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        position: "sticky", top: 0, zIndex: 2,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಲಿಂಗ ಆಧಾರ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>By Gender</div>
                      </th>
                    </tr>
                    {/* Row 2 — leaf headers */}
                    <tr>
                      {[
                        // Coverage (3)
                        { kn: "ಹಳ್ಳಿಗಳು",     en: "Villages",   tone: "linear-gradient(180deg,#67e8f9,#22d3ee)", text: "#0c4a6e" },
                        { kn: "ವಿಸ್ತೀರ್ಣ",   en: "Area (ha)",  tone: "linear-gradient(180deg,#67e8f9,#22d3ee)", text: "#0c4a6e" },
                        { kn: "ರೈತರು",       en: "Farmers",    tone: "linear-gradient(180deg,#67e8f9,#22d3ee)", text: "#0c4a6e", strong: true },
                        // By Category (6)
                        { kn: "ಪ.ಜಾ",         en: "SC",         tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a" },
                        { kn: "ಪ.ಪಂ",         en: "ST",         tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a" },
                        { kn: "ಅಲ್ಪಸಂ",      en: "Minority",   tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a" },
                        { kn: "ಅಂಗವಿಕಲ",     en: "Disabled",   tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a" },
                        { kn: "ಇತರೆ",         en: "Other",      tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a" },
                        { kn: "ಒಟ್ಟು",       en: "Cat Total",  tone: "linear-gradient(180deg,#93c5fd,#60a5fa)", text: "#1e3a8a", strong: true },
                        // By Land Holding (4)
                        { kn: "ದೊಡ್ಡ",        en: "Big > 10 ha",   tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d" },
                        { kn: "ಮಧ್ಯಮ",       en: "Mid 2-4 ha",    tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d" },
                        { kn: "ಸಣ್ಣ",         en: "Small 1-2 ha",  tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d" },
                        { kn: "ಅತಿ ಸಣ್ಣ",     en: "Marg ≤ 1 ha",   tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d" },
                        // By Gender (2)
                        { kn: "ಮಹಿಳೆ",        en: "Women",      tone: "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: "#4c1d95" },
                        { kn: "ಪುರುಷ",        en: "Men",        tone: "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: "#4c1d95" },
                      ].map((c, i) => (
                        <th key={i} style={{
                          background: c.tone, color: c.text,
                          padding: "8px 4px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)",
                          fontWeight: c.strong ? 800 : 700, minWidth: "80px",
                          position: "sticky", top: "44px", zIndex: 2,
                        }}>
                          <div style={{ fontSize: "10.5px" }}>{c.kn}</div>
                          <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 && (
                      <tr><td colSpan={17} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>{dataRows.length === 0 ? "ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / No records found." : t('No matches for "{{search}}".', { ns: "reports", search })}</td></tr>
                    )}
                    {filteredRows.map((row, ri) => {
                      const isTotal = isTotalRow(row);
                      const rowBg = isTotal
                        ? "linear-gradient(135deg,#fffbeb,#fef3c7)"
                        : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const cb = {
                        padding: "9px 6px",
                        borderBottom: isTotal ? "2px solid #fcd34d" : "1px solid #e2e8f0",
                        borderTop: isTotal ? "1.5px solid #fcd34d" : "none",
                        borderRight: "1px solid #eef2f6",
                        fontSize: "11.5px", verticalAlign: "middle",
                      };

                      const numCell = (val, palBg, palText, isDec = false, isTotalCol = false, extra = {}) => {
                        const v = numOrZero(val);
                        const has = v !== 0;
                        return (
                          <td className="tscfcd-num" style={{
                            ...cb, ...extra, textAlign: "right", paddingRight: "12px",
                            background: isTotal
                              ? "linear-gradient(135deg,#fde68a,#fcd34d)"
                              : (has ? (isTotalCol ? palBg : palBg) : "transparent"),
                            color: isTotal ? "#78350f" : (has ? palText : "#cbd5e0"),
                            fontWeight: isTotal ? 900 : (isTotalCol ? 800 : 700),
                          }}>
                            {has ? (isDec ? fmtDec(val) : fmtInt(val)) : "—"}
                          </td>
                        );
                      };

                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="tscfcd-tr" style={{ background: rowBg }}>
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
                            color: isTotal ? "#78350f" : "#0f172a", fontWeight: isTotal ? 900 : 700,
                            borderRight: "2px solid #e2e8f0",
                          }}>
                            {isTotal ? <>🟰 <span style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>{row.tsc_name}</span></> : (row.tsc_name || "—")}
                          </td>
                          {/* Coverage */}
                          {numCell(row.villages,     "#ecfeff", "#155e75", false, false)}
                          {numCell(row.area,         "#ecfeff", "#155e75", true,  false)}
                          {numCell(row.farmer_count, "linear-gradient(135deg,#cffafe,#a5f3fc)", "#0c4a6e", false, true, { borderRight: "2px solid #e2e8f0" })}
                          {/* Category */}
                          {numCell(row.sc_cnt,    "#eff6ff", "#1e40af", false, false)}
                          {numCell(row.st_cnt,    "#eff6ff", "#1e40af", false, false)}
                          {numCell(row.min_cnt,   "#eff6ff", "#1e40af", false, false)}
                          {numCell(row.dis_cnt,   "#eff6ff", "#1e40af", false, false)}
                          {numCell(row.oth_cnt,   "#eff6ff", "#1e40af", false, false)}
                          {numCell(row.cat_total, "linear-gradient(135deg,#dbeafe,#bfdbfe)", "#1e3a8a", false, true, { borderRight: "2px solid #e2e8f0" })}
                          {/* Land holding */}
                          {numCell(row.big,    "#f0fdf4", "#166534", false, false)}
                          {numCell(row.mid,    "#f0fdf4", "#166534", false, false)}
                          {numCell(row.small_, "#f0fdf4", "#166534", false, false)}
                          {numCell(row.marg,   "#f0fdf4", "#166534", false, false, { borderRight: "2px solid #e2e8f0" })}
                          {/* Gender */}
                          {numCell(row.women, "#f5f3ff", "#5b21b6", false, false)}
                          {numCell(row.men,   "#f5f3ff", "#5b21b6", false, false)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {districtName} · {talukName} — {monthLabel} {monthKn} {filter.year}
                  &nbsp;·&nbsp; {t("Farmer Category Detail", { ns: "reports" })} · {filteredRows.length} / {dataRows.length} {t("rows", { ns: "reports" })}
                </span>
                <div className="d-flex gap-2 flex-wrap">
                  <button type="button" onClick={handlePdf} disabled={isDownloadingPdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 2px 8px rgba(185,28,28,.25)", isDownloadingPdf)}>
                    {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} /> {t("Generating…", { ns: "reports" })}</> : <>📄 {t("Download PDF", { ns: "reports" })}</>}
                  </button>
                  <button type="button" onClick={handleExcel} disabled={isDownloadingExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 2px 8px rgba(21,128,61,.25)", isDownloadingExcel)}>
                    {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px" }} /> {t("Exporting…", { ns: "reports" })}</> : <>📊 {t("Download Excel", { ns: "reports" })}</>}
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

export default TscMonthlyFarmerCategoryDetailReport;
