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

if (!document.getElementById("adsrear-styles")) {
  const s = document.createElement("style");
  s.id = "adsrear-styles";
  s.innerHTML = `
    .adsrear-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .adsrear-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .adsrear-swal .swal2-icon { margin:20px auto 4px !important; }
    .adsrear-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .adsrear-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes adsrear-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .adsrear-wrap { animation: adsrear-in .35s ease; }
    .adsrear-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .adsrear-table th { letter-spacing:.02em; }
    .adsrear-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .adsrear-scroll::-webkit-scrollbar { height:9px; }
    .adsrear-scroll::-webkit-scrollbar-track { background:#ecfeff; border-radius:6px; }
    .adsrear-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0e7490,#1d4ed8); border-radius:6px; }
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

const tscSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "8px",
    border: state.isFocused ? "1.5px solid #0e7490" : "1.5px solid #d0d9e8",
    background: "#f7feff",
    minHeight: "38px",
    fontSize: "12.5px",
    color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(14,116,144,.18)" : "none",
    "&:hover": { border: "1.5px solid #0e7490" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "12.5px" }),
  multiValue: (base) => ({ ...base, background: "linear-gradient(135deg,#cffafe,#a5f3fc)", borderRadius: "10px", border: "1px solid #67e8f9" }),
  multiValueLabel: (base) => ({ ...base, color: "#155e75", fontWeight: 700, fontSize: "11.5px", padding: "2px 6px" }),
  multiValueRemove: (base) => ({ ...base, color: "#0e7490", ":hover": { background: "#67e8f9", color: "#155e75" } }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#0e7490" }),
  clearIndicator: (base) => ({ ...base, padding: "4px 6px", color: "#0e7490" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(14,116,144,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base, fontSize: "12.5px", padding: "8px 12px",
    background: state.isSelected ? "linear-gradient(135deg,#155e75,#0e7490)" : state.isFocused ? "#ecfeff" : "#fff",
    color: state.isSelected ? "#fff" : "#0f172a",
    cursor: "pointer",
  }),
};

const numOrZero = (v) => {
  const n = parseFloat(String(v ?? "").replace(/[^\d.\-]/g, ""));
  return isNaN(n) ? 0 : n;
};
const fmt = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "—";
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};
const pct = (num, denom) => {
  if (!denom) return 0;
  return (num / denom) * 100;
};

function AdsRearerDetailsReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ tscIds: [], financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [tscList,           setTscList]           = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "tscMaster/get-all").then((r) => setTscList(r.data.content.tscMaster || [])).catch(() => setTscList([]));
    api.get(baseURL + "financialYearMaster/get-all").then((r) => setFinancialYearList(r.data.content.financialYearMaster || [])).catch(() => setFinancialYearList([]));
    api.get(baseURL + "financialYearMaster/get-is-default").then((r) => {
      const fy = r.data.content;
      if (fy) {
        setFilter((p) => ({ ...p, financialYearMasterId: fy.financialYearMasterId }));
        setFyStartYear(extractYear(fy.financialYear));
      }
    }).catch(() => {});
  }, []);

  const extractYear = (str) => {
    if (!str) return null;
    const yr = parseInt(String(str).trim().split("-")[0], 10);
    return isNaN(yr) ? null : yr;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((p) => ({ ...p, [name]: value }));
    setHasReport(false); setDataRows([]);
    if (name === "financialYearMasterId") {
      const sel2 = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel2 ? extractYear(sel2.financialYear) : null);
    }
  };

  const validate = () => {
    if (!filter.financialYearMasterId) return t("Please select a Financial Year.", { ns: "reports" });
    if (!filter.month)                 return t("Please select a Month.", { ns: "reports" });
    if (!fyStartYear)                  return t("Could not determine the financial year start year.", { ns: "reports" });
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: t("Required Fields", { ns: "reports" }),
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">${t("Missing Selection", { ns: "reports" })}</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "adsrear-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "adsrear-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    const ids = (filter.tscIds || []).map((o) => o.value).filter(Boolean).join(",");
    const p = { year, month: m };
    if (ids) p.tscIds = ids;
    return p;
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-rearer-details", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          showErr(t("No Data Found", { ns: "reports" }), t("No data found for the selected filters.", { ns: "reports" }));
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the ADS Rearer Details report.", { ns: "reports" }));
        }
      } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-rearer-details/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-rearer-details/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `ads_rearer_details_${year}_${m}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); }
    finally { setIsDownloadingExcel(false); }
  };

  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);

  const totals = useMemo(() => {
    // Backend emits a grand-total (ಒಟ್ಟು) pair (current year first, then previous).
    // Use the current-year grand-total row directly so we don't double-count it or
    // sum the current + previous year rows together. TSC count = named CY rows.
    const grand = dataRows.find((r) => String(r.tsc).trim() === "ಒಟ್ಟು") || {};
    const g = (k) => numOrZero(grand[k]);
    return {
      tsc: dataRows.filter((r) => { const n = String(r.tsc).trim(); return n && n !== "ಒಟ್ಟು"; }).length,
      gp: g("gp_count"),
      farmers: g("farmer_count"),
      women: g("women_count"),
      sc: g("sc_count"),
      st: g("st_count"),
      min: g("minority_count"),
      large: g("large_count"),
      medium: g("medium_count"),
      small: g("small_count"),
      marginal: g("marginal_count"),
    };
  }, [dataRows]);

  const womenPct = pct(totals.women, totals.farmers);
  const reservedPct = pct(totals.sc + totals.st + totals.min, totals.farmers);
  const smallMarginal = totals.small + totals.marginal;

  return (
    <Layout title={t("ADS · TSC Farmer Demographics Report", { ns: "reports" })}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ADS · ರೇಷ್ಮೆ ಬೆಳೆಗಾರರ ಅಂಕಿ ಅಂಶಗಳು")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#cffafe,#a5f3fc)",
            color: "#155e75", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #67e8f9", verticalAlign: "middle",
          }}>ADS · TSC · Demographics</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(14,116,144,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#155e75 0%,#0e7490 50%,#1d4ed8 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>👥</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ADS · ರೇಷ್ಮೆ ಬೆಳೆಗಾರರ ಅಂಕಿ ಅಂಶಗಳು
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Demographics</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>TSC Farmer Demographics — Total · Women · SC/ST/Minority · Land Holdings</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{totals.farmers.toLocaleString()} farmers</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#ecfeff)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>{t("TSCs", { ns: "reports" })} <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>{t("(optional · empty = all TSCs)", { ns: "reports" })}</span></label>
                  <ReactSelect
                    isMulti
                    options={tscList.map((tsc) => ({ value: String(tsc.tscMasterId), label: tsc.name }))}
                    placeholder={t("— Select one or more —", { ns: "reports" })}
                    isSearchable isClearable closeMenuOnSelect={false}
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={tscSelectStyles}
                    value={filter.tscIds}
                    onChange={(opts) => { setFilter((p) => ({ ...p, tscIds: opts || [] })); setHasReport(false); setDataRows([]); }}
                    noOptionsMessage={() => t("No TSC found", { ns: "reports" })}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Financial Year")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Year —", { ns: "reports" })}</option>
                    {financialYearList.map((f) => (<option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">{t("— Month —", { ns: "reports" })}</option>
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#155e75,#0e7490)", "0 4px 12px rgba(14,116,144,.32)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> {t("Loading…", { ns: "reports" })}</> : <>📋 {t("View", { ns: "reports" })}</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📄 {t("PDF", { ns: "reports" })}</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📊 {t("Excel", { ns: "reports" })}</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="adsrear-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpi("#cffafe", "#67e8f9", "#155e75")}>
                <span style={kpiLbl("#155e75")}>{t("TSCs", { ns: "reports" })}</span>
                <span style={kpiVal("#155e75", 16)}>{totals.tsc}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>{t("Period", { ns: "reports" })}</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={kpi("#dbeafe", "#93c5fd", "#1e40af")}>
                <span style={kpiLbl("#1e40af")}>👨‍🌾 ಒಟ್ಟು ಬೆಳೆಗಾರರು Farmers</span>
                <span className="adsrear-num" style={kpiVal("#1e3a8a", 18)}>{totals.farmers.toLocaleString()}</span>
              </div>
              <div style={kpi("#fce7f3", "#f9a8d4", "#9d174d")}>
                <span style={kpiLbl("#9d174d")}>👩 ಮಹಿಳಾ Women</span>
                <span className="adsrear-num" style={kpiVal("#831843", 16)}>{totals.women.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#9d174d", fontWeight: 700, marginTop: "1px" }}>{womenPct.toFixed(1)}% of total</span>
              </div>
              <div style={kpi("#ede9fe", "#c4b5fd", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>SC + ST + Min</span>
                <span className="adsrear-num" style={kpiVal("#4c1d95", 16)}>{(totals.sc + totals.st + totals.min).toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#5b21b6", fontWeight: 700, marginTop: "1px" }}>{reservedPct.toFixed(1)}% of total</span>
              </div>
              <div style={kpi("#dcfce7", "#86efac", "#166534")}>
                <span style={kpiLbl("#166534")}>🌾 ಸಣ್ಣ + ಅತಿ ಸಣ್ಣ</span>
                <span className="adsrear-num" style={kpiVal("#14532d", 16)}>{smallMarginal.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#166534", fontWeight: 700, marginTop: "1px" }}>Small + Marginal</span>
              </div>
              <div style={kpi("#fed7aa", "#fb923c", "#9a3412")}>
                <span style={kpiLbl("#9a3412")}>🏞️ ದೊಡ್ಡ Large</span>
                <span className="adsrear-num" style={kpiVal("#7c2d12", 16)}>{totals.large.toLocaleString()}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(14,116,144,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#0c4a6e,#0e7490 50%,#1d4ed8)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                ADS · ರೇಷ್ಮೆ ಬೆಳೆಗಾರರ ಅಂಕಿ ಅಂಶಗಳು &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  TSC Farmer Demographics &nbsp;·&nbsp; cumulative through {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="adsrear-scroll" style={{ overflowX: "auto" }}>
                <table className="adsrear-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1400px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "190px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ</div><div style={hdrEn}>TSC</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#475569,#64748b)", "100px", true)}>
                        <div style={{ fontSize: "12px" }}>ಹಳ್ಳಿಗಳ ಸಂಖ್ಯೆ</div><div style={hdrEn}>Villages</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1d4ed8,#3b82f6)", "120px", true)}>
                        <div style={{ fontSize: "12px" }}>👨‍🌾 ಒಟ್ಟು ಬೆಳೆಗಾರರು</div><div style={hdrEn}>Farmers</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#9d174d,#db2777)", "115px", true)}>
                        <div style={{ fontSize: "12px" }}>👩 ಮಹಿಳಾ</div><div style={hdrEn}>Women</div>
                      </th>
                      <th colSpan={3} style={hdr("linear-gradient(135deg,#5b21b6,#7c3aed)")}>
                        <div style={{ fontSize: "12.5px" }}>ಮೀಸಲಾತಿ ವರ್ಗಗಳು</div>
                        <div style={hdrEn}>Reserved Categories</div>
                      </th>
                      <th colSpan={4} style={hdr("linear-gradient(135deg,#9a3412,#ea580c)")}>
                        <div style={{ fontSize: "12.5px" }}>🏞️ ಭೂ-ಹಿಡುವಳಿ ವರ್ಗ</div>
                        <div style={hdrEn}>Land Holding</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#5b21b6")}>
                        <div style={{ fontSize: "10.5px" }}>ಪ.ಜಾ</div><div style={subhdrEn}>SC</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#5b21b6")}>
                        <div style={{ fontSize: "10.5px" }}>ಪ.ಪಂ</div><div style={subhdrEn}>ST</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#5b21b6")}>
                        <div style={{ fontSize: "10.5px" }}>ಅ.ಸಂ.</div><div style={subhdrEn}>Minority</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#9a3412")}>
                        <div style={{ fontSize: "10.5px" }}>ದೊಡ್ಡ</div><div style={subhdrEn}>Large &gt;2 ha</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#9a3412")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಧ್ಯಮ</div><div style={subhdrEn}>Medium 1‑2</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#9a3412")}>
                        <div style={{ fontSize: "10.5px" }}>ಸಣ್ಣ</div><div style={subhdrEn}>Small 0.4‑1</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#9a3412")}>
                        <div style={{ fontSize: "10.5px" }}>ಅತಿ ಸಣ್ಣ</div><div style={subhdrEn}>Marginal &lt;0.4</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={12} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.</td></tr>
                    )}
                    {dataRows.filter((r) => String(r.ord) !== "999999").map((row, ri) => {
                      const alt = ri % 2 === 1;
                      const farmers = numOrZero(row.farmer_count);
                      const wPct = pct(numOrZero(row.women_count), farmers);
                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="adsrear-tr" style={{ background: alt ? "#f7feff" : "#ffffff" }}>
                          <td style={td("center", null, "#475569", 700)}>
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#cffafe,#a5f3fc)", color: "#155e75", fontWeight: 800, fontSize: "11.5px" }}>{row.sl_no}</span>
                          </td>
                          <td style={td("left", null, "#0f172a", 700)}>{row.tsc || "—"}</td>
                          <td className="adsrear-num" style={td("right", null, "#475569", 700, "#f8fafc")}>{fmt(row.gp_count)}</td>
                          <td className="adsrear-num" style={td("right", null, "#1e3a8a", 800, "linear-gradient(135deg,#dbeafe,#bfdbfe)")}>{fmt(row.farmer_count)}</td>
                          <td style={td("right", null, "#831843", 700, "#fce7f3")}>
                            <span className="adsrear-num">{fmt(row.women_count)}</span>
                            {farmers > 0 && (
                              <span style={{ display: "block", fontSize: "10.5px", color: "#9d174d", fontWeight: 700, marginTop: "1px" }}>{wPct.toFixed(1)}%</span>
                            )}
                          </td>
                          <td className="adsrear-num" style={td("right", null, "#5b21b6", 700, "#f5f3ff")}>{fmt(row.sc_count)}</td>
                          <td className="adsrear-num" style={td("right", null, "#5b21b6", 700, "#f5f3ff")}>{fmt(row.st_count)}</td>
                          <td className="adsrear-num" style={td("right", null, "#4c1d95", 800, "#ede9fe")}>{fmt(row.minority_count)}</td>
                          <td className="adsrear-num" style={td("right", null, "#7c2d12", 700, "#fff7ed")}>{fmt(row.large_count)}</td>
                          <td className="adsrear-num" style={td("right", null, "#7c2d12", 700, "#ffedd5")}>{fmt(row.medium_count)}</td>
                          <td className="adsrear-num" style={td("right", null, "#7c2d12", 700, "#fed7aa")}>{fmt(row.small_count)}</td>
                          <td className="adsrear-num" style={td("right", null, "#7c2d12", 800, "#fdba74")}>{fmt(row.marginal_count)}</td>
                        </tr>
                      );
                    })}
                    {dataRows.length > 0 && (
                      <tr style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)" }}>
                        <td colSpan={2} style={{ padding: "13px 16px", textAlign: "right", color: "#78350f", fontWeight: 800, fontSize: "13px", borderTop: "2px solid #f59e0b" }}>ಒಟ್ಟು &nbsp;/&nbsp; Grand Total</td>
                        <td className="adsrear-num" style={ftd("#475569")}>{fmt(totals.gp)}</td>
                        <td className="adsrear-num" style={ftd("#1e3a8a")}>{fmt(totals.farmers)}</td>
                        <td className="adsrear-num" style={ftd("#831843")}>{fmt(totals.women)}</td>
                        <td className="adsrear-num" style={ftd("#5b21b6")}>{fmt(totals.sc)}</td>
                        <td className="adsrear-num" style={ftd("#5b21b6")}>{fmt(totals.st)}</td>
                        <td className="adsrear-num" style={ftd("#4c1d95")}>{fmt(totals.min)}</td>
                        <td className="adsrear-num" style={ftd("#7c2d12")}>{fmt(totals.large)}</td>
                        <td className="adsrear-num" style={ftd("#7c2d12")}>{fmt(totals.medium)}</td>
                        <td className="adsrear-num" style={ftd("#7c2d12")}>{fmt(totals.small)}</td>
                        <td className="adsrear-num" style={ftd("#7c2d12")}>{fmt(totals.marginal)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#ecfeff,#dbeafe)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #93c5fd" }}>
                <span style={{ fontSize: "12px", color: "#155e75", fontWeight: 600 }}>
                  ADS · Demographics — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {totals.tsc} TSC{totals.tsc === 1 ? "" : "s"} &nbsp;·&nbsp; {totals.farmers.toLocaleString()} farmers
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

const kpi = (bgFrom, border, text) => ({
  background: `linear-gradient(135deg,${bgFrom},#ffffff)`,
  border: `1.5px solid ${border}`,
  borderRadius: "12px",
  padding: "10px 18px",
  display: "flex", flexDirection: "column", minWidth: "170px",
});
const kpiLbl = (color) => ({ fontSize: "11px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" });
const kpiVal = (color, sz) => ({ fontSize: `${sz}px`, color, fontWeight: 800, marginTop: "2px" });

const hdrEn = { fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" };
const subhdrEn = { fontSize: "8.5px", opacity: .8, marginTop: "1px", fontWeight: 700 };
const hdr = (bg, minW, single, align) => ({
  background: bg, color: "#fff",
  padding: "10px 8px",
  textAlign: align || "center",
  border: "1px solid rgba(255,255,255,.18)",
  fontWeight: 800,
  minWidth: minW || "100px",
  verticalAlign: single ? "middle" : "top",
});
const subhdr = (bg, color) => ({
  background: bg, color,
  padding: "8px 6px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
  minWidth: "100px",
});
const td = (align, minW, color, weight, bg) => ({
  padding: "10px 10px", textAlign: align || "center",
  borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc",
  background: bg || "transparent",
  color: color || "#0f172a", fontWeight: weight || 600,
  fontSize: "12.5px", minWidth: minW || undefined,
});
const ftd = (color) => ({
  padding: "13px 10px", textAlign: "right",
  color: color || "#78350f", fontWeight: 800, fontSize: "12.5px",
  borderTop: "2px solid #f59e0b", borderRight: "1px solid #fcd34d",
});

export default AdsRearerDetailsReport;
