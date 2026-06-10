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

if (!document.getElementById("gdl-styles")) {
  const s = document.createElement("style");
  s.id = "gdl-styles";
  s.innerHTML = `
    .gdl-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gdl-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gdl-swal .swal2-icon { margin:20px auto 4px !important; }
    .gdl-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gdl-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gdl-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .gdl-wrap { animation: gdl-in .35s ease; }
    .gdl-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gdl-table th { letter-spacing:.02em; }
    .gdl-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gdl-scroll::-webkit-scrollbar { height:9px; }
    .gdl-scroll::-webkit-scrollbar-track { background:#f0fdfa; border-radius:6px; }
    .gdl-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#3730a3); border-radius:6px; }
    @keyframes gdl-fill { from { width: 0; } to { width: var(--w, 0%); } }
    .gdl-bar-fill { animation: gdl-fill 1.1s cubic-bezier(.22,.61,.36,1) both; }
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

const reactSelectStyles = (focusColor, focusRgba, optionGradient, focusBg) => ({
  control: (base, state) => ({
    ...base, borderRadius: "8px",
    border: state.isFocused ? `1.5px solid ${focusColor}` : "1.5px solid #d0d9e8",
    background: "#f8fafd",
    minHeight: "38px", fontSize: "13px", color: "#333",
    boxShadow: state.isFocused ? `0 0 0 2px ${focusRgba}` : "none",
    "&:hover": { border: `1.5px solid ${focusColor}` },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (base) => ({ ...base, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: focusColor }),
  clearIndicator: (base) => ({ ...base, padding: "4px 6px", color: focusColor }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: `0 10px 30px ${focusRgba}` }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base, fontSize: "13px", padding: "8px 12px",
    background: state.isSelected ? optionGradient : state.isFocused ? focusBg : "#fff",
    color: state.isSelected ? "#fff" : "#0f172a",
    cursor: "pointer",
  }),
});

const grainageSelectStyles = reactSelectStyles("#0f766e", "rgba(15,118,110,.18)", "linear-gradient(135deg,#0f766e,#14b8a6)", "#ecfdf5");
const districtSelectStyles = reactSelectStyles("#5b21b6", "rgba(91,33,182,.18)", "linear-gradient(135deg,#5b21b6,#7c3aed)", "#f5f3ff");

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

const isTotalRow = (slNo) => String(slNo || "").trim() === "ಒಟ್ಟು";

// Section meta — keyed by sort_idx
const SECTION = {
  HOME_DATA:   { sortIdx: 1, icon: "🏠", hue: "teal",   label: "ಜಿಲ್ಲೆಯ ತಾಲೂಕುಗಳು",  labelEn: "Home District Taluks" },
  HOME_TOTAL:  { sortIdx: 2, icon: "Σ",  hue: "teal",   label: "ಜಿಲ್ಲೆಯ ಒಟ್ಟು",      labelEn: "Home District Subtotal" },
  OTHER_DATA:  { sortIdx: 3, icon: "🌐", hue: "indigo", label: "ಹೊರ ಜಿಲ್ಲೆಗಳು",      labelEn: "Other Districts" },
  OTHER_TOTAL: { sortIdx: 4, icon: "Σ",  hue: "indigo", label: "ಹೊರ ಜಿಲ್ಲೆಗಳ ಒಟ್ಟು", labelEn: "Other Districts Subtotal" },
};

const HUE = {
  teal:    { band: "linear-gradient(135deg,#0f766e,#14b8a6)", soft: "#ccfbf1", text: "#0f766e", deep: "#134e4a", chipBg: "#f0fdfa" },
  indigo:  { band: "linear-gradient(135deg,#3730a3,#6366f1)", soft: "#c7d2fe", text: "#3730a3", deep: "#312e81", chipBg: "#eef2ff" },
};

function GrainageDflDistributionLocationReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ grainageId: "", homeDistrictId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [grainageList,      setGrainageList]      = useState([]);
  const [districtList,      setDistrictList]      = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "grainageMaster/get-all")
      .then((r) => setGrainageList(r.data.content.grainageMaster || []))
      .catch(() => setGrainageList([]));

    api.get(baseURL + "district/get-all")
      .then((r) => setDistrictList(r.data?.content?.district || []))
      .catch(() => setDistrictList([]));

    api.get(baseURL + "financialYearMaster/get-all")
      .then((r) => setFinancialYearList(r.data.content.financialYearMaster || []))
      .catch(() => setFinancialYearList([]));

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
    if (!filter.grainageId)            return "Please select a Grainage.";
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
      background: "#fff", customClass: { popup: "gdl-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gdl-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    const p = { grainageId: filter.grainageId, year, month: m };
    if (filter.homeDistrictId) p.homeDistrictId = filter.homeDistrictId;
    return p;
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-dfl-distribution-location", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the DFL Distribution by Location report.");
        }
      } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-dfl-distribution-location/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-dfl-distribution-location/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `grainage_dfl_distribution_location_${filter.grainageId}_${year}_${m}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedGrainage = grainageList.find((g) => String(g.grainageMasterId) === String(filter.grainageId));
  const selectedDistrict = districtList.find((d) => String(d.districtId) === String(filter.homeDistrictId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const grainageName = selectedGrainage?.grainageMasterName || "—";
  const districtName = selectedDistrict?.districtName || "All Districts";

  // Group rows by sort_idx so we can render section bands between them
  const sections = useMemo(() => {
    const homeData   = dataRows.filter((r) => Number(r.sort_idx) === 1);
    const homeTotal  = dataRows.find((r)   => Number(r.sort_idx) === 2);
    const otherData  = dataRows.filter((r) => Number(r.sort_idx) === 3);
    const otherTotal = dataRows.find((r)   => Number(r.sort_idx) === 4);
    return { homeData, homeTotal, otherData, otherTotal };
  }, [dataRows]);

  // KPIs across both sections + top destination identification
  const kpis = useMemo(() => {
    const homeP1     = numOrZero(sections.homeTotal?.csr2_p1);
    const homeP2     = numOrZero(sections.homeTotal?.csr2_p2);
    const homeTotal  = numOrZero(sections.homeTotal?.total);
    const otherP1    = numOrZero(sections.otherTotal?.csr2_p1);
    const otherP2    = numOrZero(sections.otherTotal?.csr2_p2);
    const otherTotal = numOrZero(sections.otherTotal?.total);
    const grandTotal = homeTotal + otherTotal;

    // Top destination (single location with most DFLs)
    const allDataRows = [...sections.homeData, ...sections.otherData];
    let topRow = null;
    let topVal = 0;
    allDataRows.forEach((r) => {
      const v = numOrZero(r.total);
      if (v > topVal) { topVal = v; topRow = r; }
    });

    return {
      homeCount: sections.homeData.length,
      otherCount: sections.otherData.length,
      homeP1, homeP2, homeTotal,
      otherP1, otherP2, otherTotal,
      grandTotal,
      grandP1: homeP1 + otherP1,
      grandP2: homeP2 + otherP2,
      homePct:  grandTotal === 0 ? 0 : (homeTotal / grandTotal) * 100,
      otherPct: grandTotal === 0 ? 0 : (otherTotal / grandTotal) * 100,
      topLocation: topRow?.location || "—",
      topValue:    topVal,
    };
  }, [sections]);

  return (
    <Layout title={t("Grainage DFL Distribution by Taluk / District")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ಮೊಟ್ಟೆ ವಿಲೇವಾರಿ ವಿವರ — ತಾಲೂಕು / ಜಿಲ್ಲೆವಾರು")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
            color: "#0f766e", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #5eead4", verticalAlign: "middle",
          }}>P1 & P2 · Bivoltine · Distribution × Location</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(15,118,110,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#3730a3 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🗺️</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಮೊಟ್ಟೆ ವಿಲೇವಾರಿ ವಿವರ — ತಾಲೂಕು / ಜಿಲ್ಲೆವಾರು (ಬಿತ್ತನೆ ಕೋಠಿ)
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Distribution</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P1 &amp; P2 Grainage (Bivoltine) — DFL Distribution by Taluk / District (CSR-2 P1 vs CSR-2 P2)</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{grainageName}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
                {selectedDistrict && (
                  <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>🏠 {selectedDistrict.districtName}</span>
                )}
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f0fdfa)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>Grainage <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={grainageList.map((g) => ({
                      value: String(g.grainageMasterId),
                      label: g.grainageMasterName + (g.grainageType ? ` · ${g.grainageType}` : ""),
                    }))}
                    placeholder="— Search Grainage —"
                    isSearchable isClearable
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={grainageSelectStyles}
                    value={
                      grainageList
                        .map((g) => ({
                          value: String(g.grainageMasterId),
                          label: g.grainageMasterName + (g.grainageType ? ` · ${g.grainageType}` : ""),
                        }))
                        .find((o) => o.value === String(filter.grainageId)) || null
                    }
                    onChange={(opt) => {
                      setFilter((p) => ({ ...p, grainageId: opt?.value || "" }));
                      setHasReport(false); setDataRows([]);
                    }}
                    noOptionsMessage={() => "No grainage found"}
                  />
                </Col>
                <Col md={3}>
                  <label style={lbl}>
                    🏠 Home District <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>(optional · enables home/other split)</span>
                  </label>
                  <ReactSelect
                    options={districtList.map((d) => ({ value: String(d.districtId), label: d.districtName }))}
                    placeholder="— Search District —"
                    isSearchable isClearable
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={districtSelectStyles}
                    value={
                      districtList
                        .map((d) => ({ value: String(d.districtId), label: d.districtName }))
                        .find((o) => o.value === String(filter.homeDistrictId)) || null
                    }
                    onChange={(opt) => {
                      setFilter((p) => ({ ...p, homeDistrictId: opt?.value || "" }));
                      setHasReport(false); setDataRows([]);
                    }}
                    noOptionsMessage={() => "No district found"}
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
                <Col md={2}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📋 View</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📄</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📊</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="gdl-wrap mt-4">
            {/* KPIs */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-stretch">
              <div style={kpi("#ccfbf1", "#5eead4", "#0f766e")}>
                <span style={kpiLbl("#0f766e")}>Grainage</span>
                <span style={{ ...kpiVal("#134e4a", 14), fontWeight: 800 }}>{grainageName}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>Period</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={kpi("#a7f3d0", "#6ee7b7", "#065f46")}>
                <span style={kpiLbl("#065f46")}>🏠 ಜಿಲ್ಲೆಯ ತಾಲೂಕುಗಳು Home</span>
                <span className="gdl-num" style={kpiVal("#064e3b", 16)}>{kpis.homeTotal.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#065f46", fontWeight: 700, marginTop: "1px" }}>{kpis.homeCount} taluk{kpis.homeCount === 1 ? "" : "s"} · {kpis.homePct.toFixed(1)}%</span>
              </div>
              <div style={kpi("#c7d2fe", "#a5b4fc", "#3730a3")}>
                <span style={kpiLbl("#3730a3")}>🌐 ಹೊರ ಜಿಲ್ಲೆಗಳು Other</span>
                <span className="gdl-num" style={kpiVal("#312e81", 16)}>{kpis.otherTotal.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#3730a3", fontWeight: 700, marginTop: "1px" }}>{kpis.otherCount} district{kpis.otherCount === 1 ? "" : "s"} · {kpis.otherPct.toFixed(1)}%</span>
              </div>
              <div style={kpi("#fde68a", "#fcd34d", "#78350f")}>
                <span style={kpiLbl("#78350f")}>Σ ಒಟ್ಟು Grand Total DFLs</span>
                <span className="gdl-num" style={kpiVal("#78350f", 18)}>{kpis.grandTotal.toLocaleString()}</span>
              </div>
              <div style={kpi("#ddd6fe", "#a78bfa", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>📍 Top Destination</span>
                <span style={{ ...kpiVal("#4c1d95", 14), fontWeight: 800, lineHeight: 1.2 }}>{kpis.topLocation}</span>
                <span className="gdl-num" style={{ fontSize: "11.5px", color: "#5b21b6", fontWeight: 700, marginTop: "2px" }}>{kpis.topValue.toLocaleString()} DFLs</span>
              </div>
            </div>

            {/* Home / Other share visualisation */}
            {kpis.grandTotal > 0 && filter.homeDistrictId && (
              <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 3px 14px rgba(15,118,110,.08)", overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ padding: "14px 22px", background: "linear-gradient(180deg,#ffffff,#f0fdfa)" }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{ fontSize: "11.5px", color: "#475569", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em" }}>
                      🗺️ ವಿಲೇವಾರಿ ವಿತರಣೆ · Distribution Split
                    </span>
                    <span className="gdl-num" style={{ fontSize: "12px", color: "#0f172a", fontWeight: 800 }}>
                      Total {kpis.grandTotal.toLocaleString()} DFLs
                    </span>
                  </div>
                  <div style={{
                    display: "flex", height: "22px", borderRadius: "999px", overflow: "hidden",
                    background: "#e2e8f0", boxShadow: "inset 0 1px 3px rgba(0,0,0,.06)",
                  }}>
                    <div
                      className="gdl-bar-fill"
                      style={{
                        height: "100%",
                        background: "linear-gradient(90deg,#0f766e,#14b8a6)",
                        "--w": `${kpis.homePct}%`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: "11px", fontWeight: 800,
                      }}
                    >
                      {kpis.homePct >= 8 && `🏠 ${kpis.homePct.toFixed(1)}%`}
                    </div>
                    <div
                      className="gdl-bar-fill"
                      style={{
                        height: "100%",
                        background: "linear-gradient(90deg,#3730a3,#6366f1)",
                        "--w": `${kpis.otherPct}%`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: "11px", fontWeight: 800,
                      }}
                    >
                      {kpis.otherPct >= 8 && `🌐 ${kpis.otherPct.toFixed(1)}%`}
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-3 mt-2" style={{ fontSize: "11px", color: "#475569" }}>
                    <span><span style={{ display: "inline-block", width: "10px", height: "10px", background: "#0f766e", borderRadius: "3px", marginRight: "5px", verticalAlign: "middle" }}></span>🏠 {selectedDistrict?.districtName} ({selectedDistrict?.districtName ? "Home" : "Home"}) · {kpis.homeTotal.toLocaleString()} DFLs · {kpis.homeCount} taluks</span>
                    <span><span style={{ display: "inline-block", width: "10px", height: "10px", background: "#3730a3", borderRadius: "3px", marginRight: "5px", verticalAlign: "middle" }}></span>🌐 Other Districts · {kpis.otherTotal.toLocaleString()} DFLs · {kpis.otherCount} districts</span>
                  </div>
                </div>
              </Card>
            )}

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#0c4a6e,#0f766e 50%,#312e81)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                ಮೊಟ್ಟೆ ವಿಲೇವಾರಿ ವಿವರ · ಬಿತ್ತನೆ ಕೋಠಿ {grainageName} &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  DFL Distribution by Taluk / District &nbsp;·&nbsp; Home: <strong>{districtName}</strong> &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="gdl-scroll" style={{ overflowX: "auto" }}>
                <table className="gdl-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "900px" }}>
                  <thead>
                    <tr>
                      <th style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "60px")}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl.No</div>
                      </th>
                      <th style={hdr("linear-gradient(135deg,#334155,#475569)", "320px", "left")}>
                        <div style={{ fontSize: "12.5px" }}>📍 ತಾಲೂಕು / ಜಿಲ್ಲೆ</div>
                        <div style={hdrEn}>Taluk / District</div>
                      </th>
                      <th style={hdr("linear-gradient(135deg,#0f766e,#14b8a6)", "150px")}>
                        <div style={{ fontSize: "12.5px" }}>① CSR-2 P1</div>
                        <div style={hdrEn}>Race CSR-2 P1 DFLs</div>
                      </th>
                      <th style={hdr("linear-gradient(135deg,#5b21b6,#7c3aed)", "150px")}>
                        <div style={{ fontSize: "12.5px" }}>② CSR-2 P2</div>
                        <div style={hdrEn}>Race CSR-2 P2 DFLs</div>
                      </th>
                      <th style={hdr("linear-gradient(135deg,#9a3412,#ea580c)", "160px")}>
                        <div style={{ fontSize: "12.5px" }}>Σ ಒಟ್ಟು Total</div>
                        <div style={hdrEn}>Combined Total DFLs</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={5} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#f0fdfa,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🗺️</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f766e", marginBottom: "4px" }}>ಯಾವುದೇ ವಿಲೇವಾರಿ ಮಾಹಿತಿ ಇಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No DFL distribution data found for this grainage in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}

                    {/* Section 1 — Home district taluks */}
                    {sections.homeData.length > 0 && (
                      <SectionHeaderRow meta={SECTION.HOME_DATA} count={sections.homeData.length}
                                        homeName={selectedDistrict?.districtName} />
                    )}
                    {sections.homeData.map((row, ri) => (
                      <DataRow key={`h-${ri}`} row={row} ri={ri} hue={HUE.teal}
                               kindIcon="🏛️" totalKpi={kpis.homeTotal} />
                    ))}
                    {sections.homeTotal && sections.homeData.length > 0 && (
                      <SubtotalRow row={sections.homeTotal} hue={HUE.teal} label="ಜಿಲ್ಲೆಯ ಒಟ್ಟು Home Subtotal" />
                    )}

                    {/* Section 2 — Other districts */}
                    {sections.otherData.length > 0 && (
                      <SectionHeaderRow meta={SECTION.OTHER_DATA} count={sections.otherData.length} />
                    )}
                    {sections.otherData.map((row, ri) => (
                      <DataRow key={`o-${ri}`} row={row} ri={ri} hue={HUE.indigo}
                               kindIcon="🌐" totalKpi={kpis.otherTotal} />
                    ))}
                    {sections.otherTotal && sections.otherData.length > 0 && (
                      <SubtotalRow row={sections.otherTotal} hue={HUE.indigo} label="ಹೊರ ಜಿಲ್ಲೆಗಳ ಒಟ್ಟು Other Subtotal" />
                    )}

                    {/* Grand total row */}
                    {kpis.grandTotal > 0 && (
                      <tr style={{ background: "linear-gradient(135deg,#fcd34d,#fbbf24)" }}>
                        <td colSpan={2} style={{
                          padding: "14px 16px", textAlign: "right",
                          color: "#78350f", fontWeight: 800, fontSize: "14px",
                          borderTop: "3px solid #f59e0b",
                        }}>
                          Σ ಎಲ್ಲಾ ಒಟ್ಟು · Grand Total
                        </td>
                        <td className="gdl-num" style={{
                          padding: "14px 12px", textAlign: "right",
                          color: "#7c2d12", fontWeight: 800, fontSize: "14px",
                          borderTop: "3px solid #f59e0b",
                          background: "linear-gradient(135deg,#fde68a,#fcd34d)",
                        }}>{fmt(kpis.grandP1)}</td>
                        <td className="gdl-num" style={{
                          padding: "14px 12px", textAlign: "right",
                          color: "#7c2d12", fontWeight: 800, fontSize: "14px",
                          borderTop: "3px solid #f59e0b",
                          background: "linear-gradient(135deg,#fde68a,#fcd34d)",
                        }}>{fmt(kpis.grandP2)}</td>
                        <td className="gdl-num" style={{
                          padding: "14px 12px", textAlign: "right",
                          color: "#7c2d12", fontWeight: 800, fontSize: "15px",
                          borderTop: "3px solid #f59e0b",
                          background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                        }}>{fmt(kpis.grandTotal)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #a7f3d0" }}>
                <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                  Distribution · {grainageName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {kpis.homeCount} home + {kpis.otherCount} other = {kpis.grandTotal.toLocaleString()} DFLs
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

// Coloured section band row — full-width strip introducing each section
function SectionHeaderRow({ meta, count, homeName }) {
  const pal = HUE[meta.hue];
  return (
    <tr>
      <td colSpan={5} style={{
        background: pal.band,
        padding: "12px 18px",
        borderTop: "2px solid #e2e8f0",
        borderBottom: "1px solid #e2e8f0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            fontSize: "20px",
            width: "36px", height: "36px", borderRadius: "10px",
            background: "rgba(255,255,255,.92)",
            color: pal.text,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800,
          }}>{meta.icon}</span>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ fontSize: "14.5px", fontWeight: 800, color: "#fff" }}>
              {meta.label}{homeName ? ` · ${homeName}` : ""}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff", opacity: .85 }}>
              {meta.labelEn} · {count} {meta.sortIdx === 1 ? "taluk" : "district"}{count === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
}

function DataRow({ row, ri, hue, kindIcon, totalKpi }) {
  const total = numOrZero(row.total);
  const sharePct = totalKpi === 0 ? 0 : (total / totalKpi) * 100;
  const alt = ri % 2 === 1;
  return (
    <tr className="gdl-tr" style={{ background: alt ? "#f8fafc" : "#ffffff" }}>
      <td style={{
        padding: "11px 8px", textAlign: "center",
        borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #e2e8f0",
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          minWidth: "28px", height: "28px", borderRadius: "50%",
          background: hue.band, color: "#fff",
          fontWeight: 800, fontSize: "11.5px",
        }}>{row.sl_no}</span>
      </td>
      <td style={{
        padding: "11px 14px", textAlign: "left",
        borderBottom: "1px solid #f1f5f9", borderRight: "2px solid #e2e8f0",
        color: "#0f172a", fontWeight: 700, fontSize: "12.5px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "3px 10px", borderRadius: "999px",
            background: hue.chipBg, color: hue.deep,
            fontWeight: 800, fontSize: "11.5px",
            border: `1px solid ${hue.soft}`,
          }}>
            <span>{kindIcon}</span>
            {row.location || "—"}
          </span>
          {sharePct > 0 && (
            <span style={{
              fontSize: "10px", fontWeight: 700, color: "#64748b",
              background: "#f1f5f9", padding: "2px 7px", borderRadius: "999px",
              border: "1px solid #cbd5e1",
            }}>{sharePct.toFixed(1)}% of section</span>
          )}
        </div>
      </td>
      <ValCell v={row.csr2_p1} color="#0f766e" bg="linear-gradient(135deg,#f0fdfa,#ccfbf1)" />
      <ValCell v={row.csr2_p2} color="#5b21b6" bg="linear-gradient(135deg,#f5f3ff,#ede9fe)" />
      <ValCell v={row.total}   color="#7c2d12" bg="linear-gradient(135deg,#fff7ed,#fed7aa)" weight={800} />
    </tr>
  );
}

function SubtotalRow({ row, hue, label }) {
  return (
    <tr className="gdl-tr" style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)" }}>
      <td style={{
        padding: "13px 8px", textAlign: "center",
        borderBottom: "2px solid #f59e0b", borderRight: "1px solid #e2e8f0",
        background: "linear-gradient(135deg,#fcd34d,#fbbf24)",
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          minWidth: "28px", height: "28px", borderRadius: "50%",
          background: "rgba(255,255,255,.92)",
          color: "#78350f", fontWeight: 800, fontSize: "12px",
        }}>Σ</span>
      </td>
      <td style={{
        padding: "13px 14px", textAlign: "left",
        borderBottom: "2px solid #f59e0b", borderRight: "2px solid #e2e8f0",
        color: "#78350f", fontWeight: 800, fontSize: "13px",
      }}>{label}</td>
      <td className="gdl-num" style={subtotalCell("#7c2d12")}>{fmt(row.csr2_p1)}</td>
      <td className="gdl-num" style={subtotalCell("#7c2d12")}>{fmt(row.csr2_p2)}</td>
      <td className="gdl-num" style={{ ...subtotalCell("#78350f"), fontSize: "14px",
                                       background: "linear-gradient(135deg,#fbbf24,#f59e0b)" }}>{fmt(row.total)}</td>
    </tr>
  );
}

function ValCell({ v, color, bg, weight }) {
  const s = String(v ?? "").trim();
  const empty = s === "";
  const n = numOrZero(v);
  const isZero = !empty && n === 0;
  const display = empty ? "—" : fmt(v);
  return (
    <td className="gdl-num" style={{
      padding: "11px 12px", textAlign: "right",
      borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc",
      background: empty || isZero ? "transparent" : bg,
      color: empty || isZero ? "#cbd5e0" : color,
      fontWeight: weight || 700,
      fontSize: "12.5px",
    }}>{display}</td>
  );
}

const subtotalCell = (color) => ({
  padding: "13px 12px", textAlign: "right",
  borderBottom: "2px solid #f59e0b",
  background: "linear-gradient(135deg,#fde68a,#fcd34d)",
  color, fontWeight: 800, fontSize: "13px",
});

const kpi = (bgFrom, border, _t) => ({
  background: `linear-gradient(135deg,${bgFrom},#ffffff)`,
  border: `1.5px solid ${border}`,
  borderRadius: "12px",
  padding: "10px 18px",
  display: "flex", flexDirection: "column", minWidth: "180px",
});
const kpiLbl = (color) => ({ fontSize: "11px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" });
const kpiVal = (color, sz) => ({ fontSize: `${sz}px`, color, fontWeight: 800, marginTop: "2px" });

const hdrEn = { fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" };
const hdr = (bg, minW, align) => ({
  background: bg, color: "#fff",
  padding: "10px 8px", textAlign: align || "center",
  border: "1px solid rgba(255,255,255,.18)",
  fontWeight: 800,
  minWidth: minW || "100px",
});

export default GrainageDflDistributionLocationReport;
