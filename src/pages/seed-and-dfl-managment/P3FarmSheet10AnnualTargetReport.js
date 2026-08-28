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

// 16 columns grouped: SN + Month | Chawki Target M/C, Achieved M/C, % M/C | Cocoon Target M/C, Bittane #/wt, Reeling #/wt | % Cocoon M/C
const COLS = [
  { key: "sl_no",             kn: "ಕ್ರ.ಸಂ",                  en: "Sl.No",            group: "sn",    minW: 55  },
  { key: "month_name",        kn: "ಮಾಹೆ",                    en: "Month",            group: "sn",    minW: 110 },
  { key: "target_eggs_m",     kn: "ಚಾಕಿ ಗುರಿ",                en: "Chawki Target",    group: "tgt-m", minW: 110 },
  { key: "target_eggs_c",     kn: "ಚಾಕಿ ಗುರಿ",                en: "Chawki Target",    group: "tgt-c", minW: 110 },
  { key: "achieved_eggs_m",   kn: "ಚಾಕಿ ಸಾಧನೆ",               en: "Chawki Achieved",  group: "ach-m", minW: 110 },
  { key: "achieved_eggs_c",   kn: "ಚಾಕಿ ಸಾಧನೆ",               en: "Chawki Achieved",  group: "ach-c", minW: 110 },
  { key: "pct_achievement_m", kn: "ಶೇ. ಸಾಧನೆ",                en: "% Achievement",    group: "pct-m", minW: 95,  isPct: true },
  { key: "pct_achievement_c", kn: "ಶೇ. ಸಾಧನೆ",                en: "% Achievement",    group: "pct-c", minW: 95,  isPct: true },
  { key: "cocoon_target_m",   kn: "ಗೂಡು ಗುರಿ",                en: "Cocoon Target",    group: "cgt-m", minW: 105 },
  { key: "cocoon_target_c",   kn: "ಗೂಡು ಗುರಿ",                en: "Cocoon Target",    group: "cgt-c", minW: 105 },
  { key: "bittane_no",        kn: "ಬಿತ್ತನೆ (ಸಂ)",             en: "Seed (#)",         group: "btn",   minW: 95  },
  { key: "bittane_wt",        kn: "ಬಿತ್ತನೆ (ತೂಕ)",            en: "Seed (kg)",        group: "btn",   minW: 95  },
  { key: "reeling_no",        kn: "ನೂಲಿಗೆ (ಸಂ)",              en: "Reel (#)",         group: "reel",  minW: 95  },
  { key: "reeling_wt",        kn: "ನೂಲಿಗೆ (ತೂಕ)",             en: "Reel (kg)",        group: "reel",  minW: 95  },
  { key: "pct_cocoon_m",      kn: "ಶೇ. ಗೂಡು",                 en: "% Cocoon",         group: "pctC-m",minW: 90,  isPct: true },
  { key: "pct_cocoon_c",      kn: "ಶೇ. ಗೂಡು",                 en: "% Cocoon",         group: "pctC-c",minW: 90,  isPct: true },
];

if (!document.getElementById("p3s10-styles")) {
  const s = document.createElement("style");
  s.id = "p3s10-styles";
  s.innerHTML = `
    .p3s10-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .p3s10-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .p3s10-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes p3s10-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .p3s10-wrap { animation: p3s10-in .35s ease; }
    .p3s10-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .p3s10-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .p3s10-scroll::-webkit-scrollbar { height:9px; }
    .p3s10-scroll::-webkit-scrollbar-track { background:#fdf4ff; border-radius:6px; }
    .p3s10-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#86198f,#c026d3); border-radius:6px; }
  `;
  document.head.appendChild(s);
}

const sel = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "7px 11px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
const btn = (bg, shadow, disabled) => ({ background: disabled ? "#c8d6e5" : bg, border: "none", borderRadius: "9px", padding: "8px 18px", fontWeight: 700, fontSize: "13px", color: "#fff", cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : shadow, display: "flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap" });
const farmSelectStyles = {
  control: (base, state) => ({ ...base, borderRadius: "8px", border: state.isFocused ? "1.5px solid #a21caf" : "1.5px solid #d0d9e8", background: "#fdf4ff", minHeight: "38px", fontSize: "13px", boxShadow: state.isFocused ? "0 0 0 2px rgba(162,28,175,.18)" : "none", "&:hover": { border: "1.5px solid #a21caf" } }),
  valueContainer: (b) => ({ ...b, padding: "2px 9px" }),
  placeholder: (b) => ({ ...b, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (b) => ({ ...b, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (b) => ({ ...b, color: "#a21caf" }),
  menu: (b) => ({ ...b, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(162,28,175,.18)" }),
  menuPortal: (b) => ({ ...b, zIndex: 9999 }),
  menuList: (b) => ({ ...b, padding: 0, maxHeight: "260px" }),
  option: (b, s) => ({ ...b, fontSize: "13px", padding: "8px 12px", background: s.isSelected ? "linear-gradient(135deg,#a21caf,#c026d3)" : s.isFocused ? "#fae8ff" : "#fff", color: s.isSelected ? "#fff" : "#0f172a", cursor: "pointer" }),
};
const numOrZero = (v) => { const n = parseFloat(String(v ?? "").replace(/[^\d.\-]/g, "")); return isNaN(n) ? 0 : n; };
const fmt = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "";
  const n = parseFloat(s.replace(/,/g, ""));
  if (isNaN(n)) return s;
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};
const isEmpty = (v) => { const s = String(v ?? "").trim(); return s === "" || s === "0" || s === "0.00"; };

function P3FarmSheet10AnnualTargetReport() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState({ farmId: "", financialYearMasterId: "" });
  const [fyStartYear, setFyStartYear] = useState(null);
  const [farmList,          setFarmList]          = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  const extractYear = (str) => { if (!str) return null; const y = parseInt(String(str).trim().split("-")[0], 10); return isNaN(y) ? null : y; };

  useEffect(() => {
    api.get(baseURL + "farmMaster/get-all").then((r) => setFarmList(r.data.content.farmMaster || [])).catch(() => setFarmList([]));
    api.get(baseURL + "financialYearMaster/get-all").then((r) => setFinancialYearList(r.data.content.financialYearMaster || [])).catch(() => setFinancialYearList([]));
    api.get(baseURL + "financialYearMaster/get-is-default").then((r) => {
      const fy = r.data.content;
      if (fy) { setFilter((p) => ({ ...p, financialYearMasterId: fy.financialYearMasterId })); setFyStartYear(extractYear(fy.financialYear)); }
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((p) => ({ ...p, [name]: value })); setHasReport(false); setDataRows([]);
    if (name === "financialYearMasterId") {
      const sel2 = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel2 ? extractYear(sel2.financialYear) : null);
    }
  };
  const validate = () => {
    if (!filter.farmId)                return t("Please select a Farm.", { ns: "reports" });
    if (!filter.financialYearMasterId) return t("Please select a Financial Year.", { ns: "reports" });
    if (!fyStartYear)                  return t("Could not determine the financial year start year.", { ns: "reports" });
    return null;
  };
  const showWarn = (msg) => Swal.fire({ icon: "warning", title: t("Required Fields", { ns: "reports" }), html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;color:#78350f">${msg}</div></div>`, confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706", customClass: { popup: "p3s10-swal" } });
  const showErr = (title, msg) => Swal.fire({ icon: "error", title, html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;color:#9b2c2c">${msg}</div></div>`, confirmButtonText: t("Close", { ns: "reports" }), confirmButtonColor: "#e53e3e", customClass: { popup: "p3s10-swal" } });

  // Sheet 10 view takes only year. PDF/Excel additionally take month (defaults server-side to 1).
  const params = () => ({ farmId: filter.farmId, year: fyStartYear });

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet10", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the Sheet-10 Annual Target report.", { ns: "reports" }));
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet10/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); }
    finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet10/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url; a.download = `p3_farm_sheet10_${filter.farmId}_${fyStartYear}.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const farmName     = (i18n.language === "kn" ? (selectedFarm?.farmNameInKannada || selectedFarm?.farmName) : selectedFarm?.farmName) || "—";

  const kpis = useMemo(() => {
    const sum = (k) => dataRows.reduce((s, r) => s + numOrZero(r[k]), 0);
    const targetEggs   = sum("target_eggs_m");
    const achievedEggs = sum("achieved_eggs_m");
    const cocoonTarget = sum("cocoon_target_m");
    const monthsWithData = dataRows.filter((r) => numOrZero(r.target_eggs_m) > 0 || numOrZero(r.achieved_eggs_m) > 0).length;
    const overallPct = targetEggs > 0 ? (achievedEggs / targetEggs) * 100 : 0;
    return { targetEggs, achievedEggs, cocoonTarget, monthsWithData, overallPct };
  }, [dataRows]);

  const groupHdr = (group) => {
    if (group === "sn")    return { bg: "linear-gradient(135deg,#1e293b,#36506b)", text: "Common · ಸಾಮಾನ್ಯ" };
    if (group.startsWith("tgt")) return { bg: "linear-gradient(135deg,#86198f,#a21caf)", text: "Chawki Target · ಗುರಿ" };
    if (group.startsWith("ach")) return { bg: "linear-gradient(135deg,#0369a1,#0ea5e9)", text: "Chawki Achieved · ಸಾಧನೆ" };
    if (group.startsWith("pct-")) return { bg: "linear-gradient(135deg,#065f46,#10b981)", text: "% Achievement" };
    if (group.startsWith("cgt")) return { bg: "linear-gradient(135deg,#9a3412,#c2410c)", text: "Cocoon Target · ಗೂಡು ಗುರಿ" };
    if (group === "btn")  return { bg: "linear-gradient(135deg,#a16207,#ca8a04)", text: "Bittane · ಬಿತ್ತನೆ" };
    if (group === "reel") return { bg: "linear-gradient(135deg,#9f1239,#be123c)", text: "Reeling · ನೂಲಿಗೆ" };
    return { bg: "linear-gradient(135deg,#3730a3,#4f46e5)", text: "% Cocoon · ಶೇ. ಗೂಡು" };
  };
  const groupSpans = useMemo(() => {
    const out = []; let i = 0;
    while (i < COLS.length) {
      // collapse adjacent columns sharing the same logical category (sn, tgt-*, ach-*, etc.)
      const base = COLS[i].group.split("-")[0];
      let j = i;
      while (j < COLS.length && COLS[j].group.split("-")[0] === base) j++;
      out.push({ base, span: j - i });
      i = j;
    }
    return out;
  }, []);

  return (
    <Layout title={t("Sheet-10 · P3 Farm Annual Target vs Achievement", { ns: "reports" })}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ಪ್ರಪತ್ರ 10 · ವಾರ್ಷಿಕ ಬಿತ್ತನೆ ಗೂಡಿನ ಉತ್ಪಾದನಾ ಗುರಿ ಮತ್ತು ಸಾಧನೆ")}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#fae8ff,#f5d0fe)", color: "#86198f", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #f0abfc", verticalAlign: "middle" }}>P3 Farms · Bivoltine · Sheet-10 · Annual Target</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(162,28,175,.12)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#581c87 0%,#86198f 50%,#a21caf 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🎯</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಪ್ರಪತ್ರ 10 — ವಾರ್ಷಿಕ ಬಿತ್ತನೆ ಗೂಡಿನ ಉತ್ಪಾದನಾ ಗುರಿ ಮತ್ತು ಸಾಧನೆ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Sheet-10</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P3 Farms (Bivoltine) — month-by-month chawki target vs achievement, cocoon target, dispatch · annual roll-up</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={chip}>{farmName}</span>
                <span style={chip}>Year {fyStartYear || "—"}</span>
                <span style={chip}>{kpis.monthsWithData}/12 months with data</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#fdf4ff)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={5}>
                  <label style={lbl}>{t("Farm", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={farmList.map((f) => ({ value: String(f.farmId), label: i18n.language === "kn" ? (f.farmNameInKannada || f.farmName) : f.farmName }))}
                    placeholder={t("— Search Farm —", { ns: "reports" })} isSearchable isClearable
                    menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed"
                    styles={farmSelectStyles}
                    value={farmList.map((f) => ({ value: String(f.farmId), label: i18n.language === "kn" ? (f.farmNameInKannada || f.farmName) : f.farmName })).find((o) => o.value === String(filter.farmId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, farmId: opt?.value || "" })); setHasReport(false); setDataRows([]); }}
                    noOptionsMessage={() => t("No farm found", { ns: "reports" })}
                  />
                </Col>
                <Col md={3}>
                  <label style={lbl}>{t("Financial Year", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Year —", { ns: "reports" })}</option>
                    {financialYearList.map((f) => (<option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#86198f,#a21caf)", "0 4px 12px rgba(162,28,175,.32)", isLoading)}>
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
          <div className="p3s10-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpiBox("#fae8ff", "#f0abfc")}><span style={kpiLbl("#86198f")}>{t("Farm", { ns: "reports" })}</span><span style={kpiVal("#581c87", 14, 800)}>{farmName}</span></div>
              <div style={kpiBox("#f5d0fe", "#f0abfc")}><span style={kpiLbl("#86198f")}>{t("Year", { ns: "reports" })}</span><span style={kpiVal("#581c87", 14, 800)}>{fyStartYear || "—"}</span></div>
              <div style={kpiBox("#fae8ff", "#f0abfc")}><span style={kpiLbl("#86198f")}>🎯 {t("Annual Chawki Target", { ns: "reports" })}</span><span className="p3s10-num" style={kpiVal("#581c87", 18, 800)}>{kpis.targetEggs.toLocaleString()}</span></div>
              <div style={kpiBox("#bae6fd", "#7dd3fc")}><span style={kpiLbl("#0c4a6e")}>🥚 {t("Annual Achieved", { ns: "reports" })}</span><span className="p3s10-num" style={kpiVal("#0c4a6e", 18, 800)}>{kpis.achievedEggs.toLocaleString()}</span></div>
              <div style={kpiBox(kpis.overallPct >= 80 ? "#bbf7d0" : kpis.overallPct >= 50 ? "#fde68a" : "#fecaca", kpis.overallPct >= 80 ? "#86efac" : kpis.overallPct >= 50 ? "#fcd34d" : "#fca5a5")}>
                <span style={kpiLbl(kpis.overallPct >= 80 ? "#14532d" : kpis.overallPct >= 50 ? "#92400e" : "#7f1d1d")}>📊 {t("Overall % Achievement", { ns: "reports" })}</span>
                <span className="p3s10-num" style={kpiVal(kpis.overallPct >= 80 ? "#14532d" : kpis.overallPct >= 50 ? "#78350f" : "#7f1d1d", 18, 800)}>{kpis.overallPct.toFixed(1)}%</span>
              </div>
              <div style={kpiBox("#fed7aa", "#fdba74")}><span style={kpiLbl("#7c2d12")}>🪺 {t("Annual Cocoon Target", { ns: "reports" })}</span><span className="p3s10-num" style={kpiVal("#7c2d12", 18, 800)}>{kpis.cocoonTarget.toLocaleString()}</span></div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(162,28,175,.14)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#581c87,#86198f 50%,#a21caf)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ಪ್ರಪತ್ರ 10 · {fyStartYear || ""} ರ ಸಾಲಿನ ವಾರ್ಷಿಕ ಬಿತ್ತನೆ ಗೂಡಿನ ಉತ್ಪಾದನಾ ಗುರಿ ಮತ್ತು ಸಾಧನೆ · {farmName}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>Annual Target vs Achievement · Year {fyStartYear}</div>
              </div>
              <div className="p3s10-scroll" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1900px" }}>
                  <thead>
                    <tr>
                      {groupSpans.map((g, i) => {
                        const meta = groupHdr(`${g.base}-`);
                        return (<th key={i} colSpan={g.span} style={{ background: meta.bg, color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, fontSize: "11.5px" }}>{meta.text}</th>);
                      })}
                    </tr>
                    <tr>
                      {COLS.map((c, i) => {
                        const isMonthBucket = c.group.endsWith("-m");
                        const isCumBucket   = c.group.endsWith("-c");
                        return (
                          <th key={c.key} style={hdr(
                            c.group === "sn" ? "linear-gradient(135deg,#334155,#475569)"
                              : isMonthBucket ? "linear-gradient(135deg,#7e22ce,#a855f7)"
                              : isCumBucket   ? "linear-gradient(135deg,#a855f7,#c084fc)"
                              : "linear-gradient(135deg,#9333ea,#a855f7)",
                            c.minW,
                          )}>
                            <div style={{ fontSize: "11.5px" }}>{c.kn}</div>
                            <div style={hdrEn}>{c.en}{isMonthBucket ? " · Mon" : isCumBucket ? " · Cum" : ""}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={COLS.length} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#fdf4ff,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🎯</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#86198f", marginBottom: "4px" }}>ಯಾವುದೇ ವಾರ್ಷಿಕ ಗುರಿ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No target/achievement data found for {farmName} in {fyStartYear || "—"}.</div>
                      </td></tr>
                    )}
                    {dataRows.map((row, ri) => (
                      <tr key={ri} className="p3s10-tr" style={{ background: ri % 2 === 1 ? "#fdf4ff" : "#fff" }}>
                        {COLS.map((c, ci) => {
                          const v = row[c.key];
                          const empty = isEmpty(v);
                          const isNum = ci >= 2;
                          const isMon = c.group.endsWith("-m");
                          const bg = empty ? "transparent"
                            : c.group === "sn" ? "linear-gradient(135deg,#fae8ff,#f5d0fe)"
                            : isMon ? "linear-gradient(135deg,#fdf4ff,#fae8ff)"
                            : "linear-gradient(135deg,#fae8ff,#f5d0fe)";
                          const color = empty ? "#cbd5e0" : c.group === "sn" ? "#581c87" : "#6b21a8";
                          return (
                            <td key={c.key} className={isNum ? "p3s10-num" : ""} style={td(
                              ci === 0 ? "center" : ci === 1 ? "left" : "right",
                              color, ci <= 1 ? 800 : 700, bg,
                            )}>
                              {empty ? "—" : c.isPct ? `${fmt(v)}%` : fmt(v)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fdf4ff,#fae8ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #f0abfc" }}>
                <span style={{ fontSize: "12px", color: "#86198f", fontWeight: 600 }}>
                  Sheet-10 · {farmName} — Year {fyStartYear} &nbsp;·&nbsp; {kpis.monthsWithData}/12 months · 🎯 Tgt {kpis.targetEggs.toLocaleString()} · 🥚 Ach {kpis.achievedEggs.toLocaleString()} ({kpis.overallPct.toFixed(1)}%) · 🪺 Cocoon Tgt {kpis.cocoonTarget.toLocaleString()}
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

const chip = { background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 };
const kpiBox = (bgFrom, border) => ({ background: `linear-gradient(135deg,${bgFrom},#ffffff)`, border: `1.5px solid ${border}`, borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" });
const kpiLbl = (color) => ({ fontSize: "11px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" });
const kpiVal = (color, sz, w) => ({ fontSize: `${sz}px`, color, fontWeight: w || 800, marginTop: "2px" });
const hdrEn = { fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" };
const hdr = (bg, minW) => ({ background: bg, color: "#fff", padding: "10px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: `${minW}px` });
const td = (align, color, weight, bg) => ({ padding: "9px 10px", textAlign: align || "center", borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc", background: bg || "transparent", color: color || "#0f172a", fontWeight: weight || 600, fontSize: "12.5px" });

export default P3FarmSheet10AnnualTargetReport;
