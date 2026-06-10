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

// 11 cols in 3 logical groups: Common (sl_no), Target, Achievement, Future
const COLS = [
  { key: "sl_no",           kn: "ಕ್ರ.ಸಂ",          en: "Sl.No",           group: "sn",     minW: 55  },
  { key: "breed",           kn: "ತಳಿ",             en: "Breed",           group: "tgt",    minW: 140 },
  { key: "target_eggs",     kn: "ಚಾಕಿ ಗುರಿ (ಮೊಟ್ಟೆ)",   en: "Target Eggs",     group: "tgt",    minW: 120 },
  { key: "target_date",     kn: "ಚಾಕಿ ಗುರಿ (ದಿನಾಂಕ)",  en: "Target Date",     group: "tgt",    minW: 115, isDate: true },
  { key: "achieved_breed",  kn: "ತಳಿ (ಸಾಧನೆ)",       en: "Achieved Breed",  group: "ach",    minW: 140 },
  { key: "achieved_eggs",   kn: "ಚಾಕಿ ಸಾಧನೆ (ಮೊಟ್ಟೆ)", en: "Achieved Eggs",   group: "ach",    minW: 120 },
  { key: "achieved_date",   kn: "ಚಾಕಿ ಸಾಧನೆ (ದಿನಾಂಕ)",en: "Achieved Date",   group: "ach",    minW: 115, isDate: true },
  { key: "future_breed",    kn: "ತಳಿ (ಮುಂದಿನ)",     en: "Future Breed",    group: "fut",    minW: 140 },
  { key: "future_eggs",     kn: "ಮುಂದಿನ ಗುರಿ (ಮೊಟ್ಟೆ)", en: "Future Target",   group: "fut",    minW: 120 },
  { key: "future_date",     kn: "ಮುಂದಿನ ಗುರಿ (ದಿನಾಂಕ)",en: "Future Date",     group: "fut",    minW: 115, isDate: true },
  { key: "future_achieved", kn: "ಮುಂದಿನ ಸಾಧನೆ",     en: "Future Achieved", group: "fut",    minW: 120 },
];

if (!document.getElementById("p3s15-styles")) {
  const s = document.createElement("style");
  s.id = "p3s15-styles";
  s.innerHTML = `
    .p3s15-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .p3s15-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .p3s15-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes p3s15-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .p3s15-wrap { animation: p3s15-in .35s ease; }
    .p3s15-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .p3s15-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .p3s15-scroll::-webkit-scrollbar { height:9px; }
    .p3s15-scroll::-webkit-scrollbar-track { background:#fff7ed; border-radius:6px; }
    .p3s15-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#c2410c,#ea580c); border-radius:6px; }
  `;
  document.head.appendChild(s);
}

const sel = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "7px 11px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
const btn = (bg, shadow, disabled) => ({ background: disabled ? "#c8d6e5" : bg, border: "none", borderRadius: "9px", padding: "8px 18px", fontWeight: 700, fontSize: "13px", color: "#fff", cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : shadow, display: "flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap" });
const farmSelectStyles = {
  control: (base, state) => ({ ...base, borderRadius: "8px", border: state.isFocused ? "1.5px solid #c2410c" : "1.5px solid #d0d9e8", background: "#fff7ed", minHeight: "38px", fontSize: "13px", boxShadow: state.isFocused ? "0 0 0 2px rgba(194,65,12,.18)" : "none", "&:hover": { border: "1.5px solid #c2410c" } }),
  valueContainer: (b) => ({ ...b, padding: "2px 9px" }),
  placeholder: (b) => ({ ...b, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (b) => ({ ...b, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (b) => ({ ...b, color: "#c2410c" }),
  menu: (b) => ({ ...b, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(194,65,12,.18)" }),
  menuPortal: (b) => ({ ...b, zIndex: 9999 }),
  menuList: (b) => ({ ...b, padding: 0, maxHeight: "260px" }),
  option: (b, s) => ({ ...b, fontSize: "13px", padding: "8px 12px", background: s.isSelected ? "linear-gradient(135deg,#c2410c,#ea580c)" : s.isFocused ? "#ffedd5" : "#fff", color: s.isSelected ? "#fff" : "#0f172a", cursor: "pointer" }),
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
const isEmpty = (v) => { const s = String(v ?? "").trim(); return s === "" || s === "0"; };

function P3FarmSheet15ChowkiTargetF1Report() {
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
    if (!filter.farmId)                return "Please select a Farm.";
    if (!filter.financialYearMasterId) return "Please select a Financial Year.";
    if (!filter.month)                 return "Please select a Month.";
    if (!fyStartYear)                  return "Could not determine the financial year start year.";
    return null;
  };
  const showWarn = (msg) => Swal.fire({ icon: "warning", title: "Required Fields", html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;color:#78350f">${msg}</div></div>`, confirmButtonText: "Got it", confirmButtonColor: "#d97706", customClass: { popup: "p3s15-swal" } });
  const showErr = (title, msg) => Swal.fire({ icon: "error", title, html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;color:#9b2c2c">${msg}</div></div>`, confirmButtonText: "Close", confirmButtonColor: "#e53e3e", customClass: { popup: "p3s15-swal" } });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { farmId: filter.farmId, year, month: m };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet15", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Sheet-15 Chowki Target F-1 report.");
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet15/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "p3-farm/sheet15/excel", { params: params(), responseType: "blob" });
      const p = params();
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url; a.download = `p3_farm_sheet15_${p.farmId}_${p.year}_${p.month}.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const farmName     = selectedFarm?.farmName || "—";
  const monthNum     = Number(filter.month);
  const monthKn      = MONTH_KN[monthNum] || "";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear    = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);

  const kpis = useMemo(() => {
    const totalTarget   = dataRows.reduce((s, r) => s + numOrZero(r.target_eggs),   0);
    const totalAchieved = dataRows.reduce((s, r) => s + numOrZero(r.achieved_eggs), 0);
    const totalFutureTgt= dataRows.reduce((s, r) => s + numOrZero(r.future_eggs),   0);
    const totalFutureAch= dataRows.reduce((s, r) => s + numOrZero(r.future_achieved), 0);
    const racesWithAch  = dataRows.filter((r) => numOrZero(r.achieved_eggs) > 0).length;
    const overallPct = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;
    return { totalTarget, totalAchieved, totalFutureTgt, totalFutureAch, racesWithAch, allRaces: dataRows.length, overallPct };
  }, [dataRows]);

  const groupSpans = useMemo(() => {
    const out = []; let i = 0;
    while (i < COLS.length) {
      const g = COLS[i].group; let j = i;
      while (j < COLS.length && COLS[j].group === g) j++;
      out.push({ group: g, span: j - i });
      i = j;
    }
    return out;
  }, []);

  const groupHdr = (group) => {
    if (group === "sn")  return { bg: "linear-gradient(135deg,#1e293b,#36506b)", text: "ಸಾಮಾನ್ಯ · Common" };
    if (group === "tgt") return { bg: "linear-gradient(135deg,#9a3412,#c2410c)", text: "ಗುರಿ · Target" };
    if (group === "ach") return { bg: "linear-gradient(135deg,#0369a1,#0ea5e9)", text: "ಸಾಧನೆ · Achievement" };
    return { bg: "linear-gradient(135deg,#7e22ce,#a855f7)", text: "ಮುಂದಿನ · Future" };
  };

  return (
    <Layout title={t("Sheet-15 · P3 Farm Chowki Target Achievement (Form F-1)")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ಪ್ರಪತ್ರ 15 · ಚಾಕಿ ಗುರಿ ಸಾಧನೆ ವರದಿ — ನಮೂನೆ ಎಫ್-1")}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#ffedd5,#fed7aa)", color: "#9a3412", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #fdba74", verticalAlign: "middle" }}>P3 Farms · Bivoltine · Sheet-15 · Form F-1</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(194,65,12,.12)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#7c2d12 0%,#9a3412 50%,#c2410c 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🎯</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಪ್ರಪತ್ರ 15 — ಚಾಕಿ ಗುರಿ ಸಾಧನೆ ವರದಿ (ನಮೂನೆ ಎಫ್-1)
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Sheet-15</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P3 Farms (Bivoltine) — Form F-1 · race-wise chawki target vs achievement, next-month plan</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={chip}>{farmName}</span>
                <span style={chip}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
                <span style={chip}>{kpis.racesWithAch}/{kpis.allRaces} races active</span>
              </div>
            )}
          </div>
          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#fff7ed)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>Farm <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={farmList.map((f) => ({ value: String(f.farmId), label: f.farmName }))}
                    placeholder="— Search Farm —" isSearchable isClearable
                    menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed"
                    styles={farmSelectStyles}
                    value={farmList.map((f) => ({ value: String(f.farmId), label: f.farmName })).find((o) => o.value === String(filter.farmId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, farmId: opt?.value || "" })); setHasReport(false); setDataRows([]); }}
                    noOptionsMessage={() => "No farm found"}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>Financial Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">— Select Year —</option>
                    {financialYearList.map((f) => (<option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">— Month —</option>
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#9a3412,#c2410c)", "0 4px 12px rgba(194,65,12,.32)", isLoading)}>
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

        {hasReport && (
          <div className="p3s15-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpiBox("#ffedd5", "#fdba74")}><span style={kpiLbl("#9a3412")}>Farm</span><span style={kpiVal("#7c2d12", 14, 800)}>{farmName}</span></div>
              <div style={kpiBox("#fed7aa", "#fdba74")}><span style={kpiLbl("#9a3412")}>Period</span><span style={kpiVal("#7c2d12", 13.5, 700)}>{monthLabel} {monthKn} {monthYear || ""}</span></div>
              <div style={kpiBox("#ffedd5", "#fdba74")}><span style={kpiLbl("#9a3412")}>🎯 Chawki Target</span><span className="p3s15-num" style={kpiVal("#7c2d12", 18, 800)}>{kpis.totalTarget.toLocaleString()}</span></div>
              <div style={kpiBox("#bae6fd", "#7dd3fc")}><span style={kpiLbl("#0c4a6e")}>🥚 Chawki Achieved</span><span className="p3s15-num" style={kpiVal("#0c4a6e", 18, 800)}>{kpis.totalAchieved.toLocaleString()}</span></div>
              <div style={kpiBox(kpis.overallPct >= 80 ? "#bbf7d0" : kpis.overallPct >= 50 ? "#fde68a" : "#fecaca", kpis.overallPct >= 80 ? "#86efac" : kpis.overallPct >= 50 ? "#fcd34d" : "#fca5a5")}>
                <span style={kpiLbl(kpis.overallPct >= 80 ? "#14532d" : kpis.overallPct >= 50 ? "#92400e" : "#7f1d1d")}>📊 % Achievement</span>
                <span className="p3s15-num" style={kpiVal(kpis.overallPct >= 80 ? "#14532d" : kpis.overallPct >= 50 ? "#78350f" : "#7f1d1d", 18, 800)}>{kpis.overallPct.toFixed(1)}%</span>
              </div>
              <div style={kpiBox("#e9d5ff", "#c4b5fd")}><span style={kpiLbl("#6b21a8")}>📅 Future Achieved</span><span className="p3s15-num" style={kpiVal("#581c87", 16, 800)}>{kpis.totalFutureAch.toLocaleString()}</span></div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(194,65,12,.14)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#7c2d12,#9a3412 50%,#c2410c)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "15px", textAlign: "center" }}>
                ಪ್ರಪತ್ರ 15 · ನಮೂನೆ ಎಫ್-1 · {monthYear || ""}ರ {monthKn} ಮಾಹೆಯ ಚಾಕಿ ಗುರಿ ಸಾಧನೆ · {farmName}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>Form F-1 · Chowki Target Achievement · {monthLabel} {monthYear}</div>
              </div>
              <div className="p3s15-scroll" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1400px" }}>
                  <thead>
                    <tr>
                      {groupSpans.map((g, i) => {
                        const meta = groupHdr(g.group);
                        return (<th key={i} colSpan={g.span} style={{ background: meta.bg, color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, fontSize: "11.5px" }}>{meta.text}</th>);
                      })}
                    </tr>
                    <tr>
                      {COLS.map((c) => (
                        <th key={c.key} style={hdr(
                          c.group === "sn"  ? "linear-gradient(135deg,#334155,#475569)"
                          : c.group === "tgt" ? "linear-gradient(135deg,#c2410c,#ea580c)"
                          : c.group === "ach" ? "linear-gradient(135deg,#0ea5e9,#38bdf8)"
                          : "linear-gradient(135deg,#a855f7,#c084fc)",
                          c.minW,
                        )}>
                          <div style={{ fontSize: "11.5px" }}>{c.kn}</div>
                          <div style={hdrEn}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={COLS.length} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#fff7ed,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🎯</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#9a3412", marginBottom: "4px" }}>ಯಾವುದೇ ಚಾಕಿ ಗುರಿ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No chowki target/achievement data found for {farmName} in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {dataRows.map((row, ri) => {
                      const ach = numOrZero(row.achieved_eggs);
                      const muted = ach === 0;
                      return (
                        <tr key={ri} className="p3s15-tr" style={{ background: ri % 2 === 1 ? "#fff7ed" : "#fff", opacity: muted ? .75 : 1 }}>
                          {COLS.map((c, ci) => {
                            const v = row[c.key];
                            const empty = isEmpty(v) && !c.isDate;
                            const isBreed = c.key === "breed" || c.key === "achieved_breed" || c.key === "future_breed";
                            const isNum = !c.isDate && !isBreed && ci > 0;
                            const bg = empty ? "transparent"
                              : c.group === "sn"  ? "linear-gradient(135deg,#fae8ff,#f5d0fe)"
                              : c.group === "tgt" ? (isBreed ? "transparent" : "linear-gradient(135deg,#fff7ed,#ffedd5)")
                              : c.group === "ach" ? (isBreed ? "transparent" : "linear-gradient(135deg,#f0f9ff,#bae6fd)")
                              : (isBreed ? "transparent" : "linear-gradient(135deg,#faf5ff,#e9d5ff)");
                            const color = empty ? "#cbd5e0"
                              : c.group === "sn"  ? "#86198f"
                              : c.group === "tgt" ? "#9a3412"
                              : c.group === "ach" ? "#0c4a6e"
                              : "#6b21a8";
                            return (
                              <td key={c.key} className={isNum ? "p3s15-num" : ""} style={td(
                                ci === 0 ? "center" : isNum ? "right" : "left",
                                color, ci === 0 ? 800 : isBreed ? 700 : 700, bg,
                              )}>
                                {empty
                                  ? "—"
                                  : c.isDate
                                    ? (String(v).trim() || "—")
                                    : isBreed
                                      ? String(v)
                                      : fmt(v)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    {dataRows.length > 0 && (
                      <tr style={{ background: "linear-gradient(135deg,#fed7aa,#fdba74)", fontWeight: 800 }}>
                        <td style={td("center", "#7c2d12", 900, "transparent")}>Σ</td>
                        <td style={td("left", "#7c2d12", 900, "transparent")}>ಎಲ್ಲಾ ತಳಿಗಳ ಒಟ್ಟು · Total</td>
                        <td className="p3s15-num" style={td("right", "#7c2d12", 900, "transparent")}>{kpis.totalTarget.toLocaleString()}</td>
                        <td style={td("center", "#94a3b8", 600, "transparent")}>—</td>
                        <td style={td("left", "#94a3b8", 600, "transparent")}>—</td>
                        <td className="p3s15-num" style={td("right", "#0c4a6e", 900, "linear-gradient(135deg,#bae6fd,#7dd3fc)")}>{kpis.totalAchieved.toLocaleString()}</td>
                        <td style={td("center", "#94a3b8", 600, "transparent")}>—</td>
                        <td style={td("left", "#94a3b8", 600, "transparent")}>—</td>
                        <td className="p3s15-num" style={td("right", "#6b21a8", 900, "transparent")}>{kpis.totalFutureTgt.toLocaleString()}</td>
                        <td style={td("center", "#94a3b8", 600, "transparent")}>—</td>
                        <td className="p3s15-num" style={td("right", "#581c87", 900, "linear-gradient(135deg,#e9d5ff,#c4b5fd)")}>{kpis.totalFutureAch.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #fdba74" }}>
                <span style={{ fontSize: "12px", color: "#9a3412", fontWeight: 600 }}>
                  Sheet-15 · {farmName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {kpis.racesWithAch}/{kpis.allRaces} races active · 🎯 Tgt {kpis.totalTarget.toLocaleString()} · 🥚 Ach {kpis.totalAchieved.toLocaleString()} ({kpis.overallPct.toFixed(1)}%) · 📅 Future Ach {kpis.totalFutureAch.toLocaleString()}
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

const chip = { background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 };
const kpiBox = (bgFrom, border) => ({ background: `linear-gradient(135deg,${bgFrom},#ffffff)`, border: `1.5px solid ${border}`, borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" });
const kpiLbl = (color) => ({ fontSize: "11px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" });
const kpiVal = (color, sz, w) => ({ fontSize: `${sz}px`, color, fontWeight: w || 800, marginTop: "2px" });
const hdrEn = { fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" };
const hdr = (bg, minW) => ({ background: bg, color: "#fff", padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,.18)", fontWeight: 800, minWidth: `${minW}px` });
const td = (align, color, weight, bg) => ({ padding: "9px 10px", textAlign: align || "center", borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc", background: bg || "transparent", color: color || "#0f172a", fontWeight: weight || 600, fontSize: "12.5px" });

export default P3FarmSheet15ChowkiTargetF1Report;
