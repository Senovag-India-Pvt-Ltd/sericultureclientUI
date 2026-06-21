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

// Sericulture week boundaries baked into the backend SQL — surfaced in UI hints
const WEEK_HINTS = [
  { wk: 1, hint: "24 → end of prev. month" },
  { wk: 2, hint: "1 → 7" },
  { wk: 3, hint: "8 → 15" },
  { wk: 4, hint: "16 → 23" },
];

if (!document.getElementById("gdw-styles")) {
  const s = document.createElement("style");
  s.id = "gdw-styles";
  s.innerHTML = `
    .gdw-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .gdw-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .gdw-swal .swal2-icon { margin:20px auto 4px !important; }
    .gdw-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .gdw-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes gdw-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .gdw-wrap { animation: gdw-in .35s ease; }
    .gdw-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .gdw-table th { letter-spacing:.02em; }
    .gdw-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .gdw-scroll::-webkit-scrollbar { height:9px; }
    .gdw-scroll::-webkit-scrollbar-track { background:#f0fdfa; border-radius:6px; }
    .gdw-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#3730a3); border-radius:6px; }
    @keyframes gdw-fill { from { height: 0; } to { height: var(--h, 0%); } }
    .gdw-bar { animation: gdw-fill 1s cubic-bezier(.22,.61,.36,1) both; }
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

// Race badge palette
const RACE_STYLE = (race) => {
  const r = String(race || "").trim();
  if (r.includes("ಸಿಎಸ್") || r.toLowerCase().includes("csr"))
    return { bg: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", color: "#4c1d95", icon: "Σ", isTotal: false };
  if (r === "ಪಿ1" || r.toLowerCase() === "p1")
    return { bg: "linear-gradient(135deg,#bfdbfe,#93c5fd)", color: "#1e3a8a", icon: "①", isTotal: false };
  if (r === "ಪಿ2" || r.toLowerCase() === "p2")
    return { bg: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", color: "#064e3b", icon: "②", isTotal: false };
  if (r.includes("ಒಟ್ಟು") || r.toLowerCase() === "total")
    return { bg: "linear-gradient(135deg,#fde68a,#fcd34d)", color: "#78350f", icon: "Σ", isTotal: true };
  return { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#334155", icon: "·", isTotal: false };
};

function GrainageDaywiseChawkiReport() {
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
    api.get(baseURL + "grainageMaster/get-all").then((r) => setGrainageList(r.data.content.grainageMaster || [])).catch(() => setGrainageList([]));
    api.get(baseURL + "district/get-all").then((r) => setDistrictList(r.data?.content?.district || [])).catch(() => setDistrictList([]));
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
      background: "#fff", customClass: { popup: "gdw-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "gdw-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-daywise-chawki", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Daywise Chawki report.");
        }
      } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-daywise-chawki/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/grainage-daywise-chawki/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `grainage_daywise_chawki_${filter.grainageId}_${year}_${m}.xlsx`;
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
  const districtName = selectedDistrict?.districtName || "—";

  const totalRow = dataRows.find((r) => RACE_STYLE(r.race).isTotal) || {};

  // KPIs sourced from the Total race row + identify peak week
  const kpis = useMemo(() => {
    const homeWeeks  = [1, 2, 3, 4].map((wk) => numOrZero(totalRow[`hw${wk}`]));
    const otherWeeks = [1, 2, 3, 4].map((wk) => numOrZero(totalRow[`ow${wk}`]));
    const weekTotals = homeWeeks.map((h, i) => h + otherWeeks[i]);
    const homeTotal  = numOrZero(totalRow.htot);
    const otherTotal = numOrZero(totalRow.otot);
    const grand      = numOrZero(totalRow.grand);

    let peakWk = -1, peakVal = 0;
    weekTotals.forEach((v, i) => { if (v > peakVal) { peakVal = v; peakWk = i + 1; } });

    return {
      homeWeeks, otherWeeks, weekTotals,
      homeTotal, otherTotal, grand,
      peakWk, peakVal,
      homePct:  grand === 0 ? 0 : (homeTotal / grand) * 100,
      otherPct: grand === 0 ? 0 : (otherTotal / grand) * 100,
    };
  }, [totalRow]);

  // Bar-chart max (used to normalise heights against tallest week)
  const chartMax = useMemo(
    () => kpis.weekTotals.reduce((m, v) => Math.max(m, v), 0),
    [kpis.weekTotals]
  );

  return (
    <Layout title={t("Grainage Day-wise Chawki Distribution (week × race × home/other)")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ದಿನಾಂಕವಾರು ಚಾಕಿ ವಿವರ — ಬಿತ್ತನೆ ಕೋಠಿ (ಸೆರಿ ಮಾಸ)")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
            color: "#0f766e", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #5eead4", verticalAlign: "middle",
          }}>ಪಿ1 ಮತ್ತು ಪಿ2 · ದ್ವಿತಳಿ · ತಳಿ × ವಾರ 1‑4 × ಸ್ಥಳೀಯ/ಹೊರ</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(15,118,110,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#3730a3 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📅</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ದಿನಾಂಕವಾರು ಚಾಕಿ ವಿವರ — ಬಿತ್ತನೆ ಕೋಠಿ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>ದಿನಾಂಕವಾರು ಚಾಕಿ</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>ಪಿ1 ಮತ್ತು ಪಿ2 ಗ್ರೇನೇಜ್ (ದ್ವಿತಳಿ) — ರೇಷ್ಮೆ ಮಾಸದ ಚಾಕಿ ವಿತರಣೆ: ಸಿಎಸ್ಆರ್-2 (ಪಿ1/ಪಿ2) × 4  ವಾರಗಳು × ಸ್ಥಳೀಯ/ಹೊರ ಜಿಲ್ಲೆ</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{grainageName}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
                {selectedDistrict && (
                  <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>🏠 {districtName}</span>
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

              {/* Sericulture-week hint strip */}
              <div className="d-flex flex-wrap gap-2 mt-3" style={{ fontSize: "11px", color: "#475569" }}>
                <span style={{ fontWeight: 800, color: "#0f766e" }}>📐 Sericulture month:</span>
                {WEEK_HINTS.map((w) => (
                  <span key={w.wk} style={{
                    padding: "3px 10px", borderRadius: "999px",
                    background: "linear-gradient(135deg,#ecfeff,#f0fdfa)",
                    border: "1px solid #5eead4", fontWeight: 700,
                    color: "#0f766e",
                  }}>W{w.wk} · {w.hint}</span>
                ))}
              </div>
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="gdw-wrap mt-4">
            {/* KPIs */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-stretch">
              <div style={kpi("#ccfbf1", "#5eead4", "#0f766e")}>
                <span style={kpiLbl("#0f766e")}>Grainage</span>
                <span style={{ ...kpiVal("#134e4a", 14), fontWeight: 800 }}>{grainageName}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>Period (Seri Month)</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
                <span style={{ fontSize: "10.5px", color: "#92400e", fontWeight: 700, marginTop: "1px" }}>24 prev → 23 current</span>
              </div>
              <div style={kpi("#a7f3d0", "#6ee7b7", "#065f46")}>
                <span style={kpiLbl("#065f46")}>🏠 Home Total {selectedDistrict ? `(${districtName})` : ""}</span>
                <span className="gdw-num" style={kpiVal("#064e3b", 16)}>{kpis.homeTotal.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#065f46", fontWeight: 700, marginTop: "1px" }}>{kpis.homePct.toFixed(1)}% of Σ</span>
              </div>
              <div style={kpi("#c7d2fe", "#a5b4fc", "#3730a3")}>
                <span style={kpiLbl("#3730a3")}>🌐 Other Total</span>
                <span className="gdw-num" style={kpiVal("#312e81", 16)}>{kpis.otherTotal.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#3730a3", fontWeight: 700, marginTop: "1px" }}>{kpis.otherPct.toFixed(1)}% of Σ</span>
              </div>
              <div style={kpi("#fde68a", "#fcd34d", "#78350f")}>
                <span style={kpiLbl("#78350f")}>Σ ಒಟ್ಟು Grand Total</span>
                <span className="gdw-num" style={kpiVal("#78350f", 18)}>{kpis.grand.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#92400e", fontWeight: 700, marginTop: "1px" }}>across 4 weeks · CSR-2 ಪಿ1/ಪಿ2</span>
              </div>
              <div style={kpi("#ddd6fe", "#a78bfa", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>📈 Peak Week</span>
                <span className="gdw-num" style={kpiVal("#4c1d95", 18)}>
                  {kpis.peakWk > 0 ? `W${kpis.peakWk}` : "—"}
                </span>
                <span style={{ fontSize: "10.5px", color: "#5b21b6", fontWeight: 700, marginTop: "1px" }}>
                  {kpis.peakWk > 0 ? `${kpis.peakVal.toLocaleString()} DFLs · ${WEEK_HINTS[kpis.peakWk - 1]?.hint}` : "no data"}
                </span>
              </div>
            </div>

            {/* Stacked bar chart — 4 weeks × home/other split */}
            {chartMax > 0 && (
              <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 18px rgba(15,118,110,.10)", overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ padding: "16px 22px", background: "linear-gradient(180deg,#ffffff,#f0fdfa)" }}>
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ fontSize: "11.5px", color: "#475569", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em" }}>
                      📊 Weekly distribution · Home (teal) + Other (indigo)
                    </span>
                    <span className="gdw-num" style={{ fontSize: "12px", color: "#0f172a", fontWeight: 800 }}>
                      Peak: W{kpis.peakWk} · {kpis.peakVal.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "180px", padding: "0 8px" }}>
                    {[0, 1, 2, 3].map((i) => {
                      const h = kpis.homeWeeks[i];
                      const o = kpis.otherWeeks[i];
                      const total = h + o;
                      const maxBarHeight = 150;
                      const totalH = chartMax === 0 ? 0 : (total / chartMax) * maxBarHeight;
                      const hH = total === 0 ? 0 : (h / total) * totalH;
                      const oH = total === 0 ? 0 : (o / total) * totalH;
                      const isPeak = total > 0 && total === kpis.peakVal;
                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: 0 }}>
                          <span className="gdw-num" style={{ fontSize: "11px", fontWeight: 800, color: total === 0 ? "#cbd5e0" : "#0f172a" }}>
                            {total === 0 ? "—" : total.toLocaleString()}
                          </span>
                          <div style={{
                            width: "100%", maxWidth: "80px", height: `${maxBarHeight}px`,
                            display: "flex", flexDirection: "column", justifyContent: "flex-end",
                            background: "rgba(0,0,0,.04)", borderRadius: "8px 8px 4px 4px",
                            position: "relative",
                            border: isPeak ? "2px solid #fcd34d" : "1px solid transparent",
                          }}>
                            {o > 0 && (
                              <div className="gdw-bar" style={{
                                background: "linear-gradient(180deg,#a5b4fc,#6366f1)",
                                height: `${oH}px`, "--h": `${oH}px`,
                                borderRadius: h > 0 ? "8px 8px 0 0" : "8px 8px 4px 4px",
                                width: "100%",
                              }} title={`Other: ${o.toLocaleString()} DFLs`} />
                            )}
                            {h > 0 && (
                              <div className="gdw-bar" style={{
                                background: "linear-gradient(180deg,#5eead4,#0d9488)",
                                height: `${hH}px`, "--h": `${hH}px`,
                                borderRadius: "0 0 4px 4px",
                                width: "100%",
                              }} title={`Home: ${h.toLocaleString()} DFLs`} />
                            )}
                            {isPeak && (
                              <span style={{
                                position: "absolute", top: "-26px", left: "50%", transform: "translateX(-50%)",
                                fontSize: "9px", fontWeight: 800,
                                background: "linear-gradient(135deg,#fde68a,#fcd34d)",
                                color: "#78350f", padding: "2px 7px", borderRadius: "999px",
                                border: "1px solid #fcd34d", whiteSpace: "nowrap",
                              }}>📈 PEAK</span>
                            )}
                          </div>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textAlign: "center", lineHeight: 1.2 }}>
                            <div style={{ fontWeight: 800, color: "#0f172a" }}>W{i + 1}</div>
                            <div style={{ fontSize: "9.5px", opacity: .8, fontWeight: 600 }}>{WEEK_HINTS[i].hint}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="d-flex flex-wrap gap-3 mt-3" style={{ fontSize: "11px", color: "#475569" }}>
                    <span><span style={{ display: "inline-block", width: "12px", height: "12px", background: "linear-gradient(180deg,#5eead4,#0d9488)", borderRadius: "3px", marginRight: "5px", verticalAlign: "middle" }}></span>🏠 Home {selectedDistrict ? `(${districtName})` : ""} · {kpis.homeTotal.toLocaleString()} DFLs</span>
                    <span><span style={{ display: "inline-block", width: "12px", height: "12px", background: "linear-gradient(180deg,#a5b4fc,#6366f1)", borderRadius: "3px", marginRight: "5px", verticalAlign: "middle" }}></span>🌐 Other Districts · {kpis.otherTotal.toLocaleString()} DFLs</span>
                    {!selectedDistrict && (
                      <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Select a Home District above to see the home/other split</span>
                    )}
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
                ದಿನಾಂಕವಾರು ಚಾಕಿ ವಿವರ · ಬಿತ್ತನೆ ಕೋಠಿ {grainageName} &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  ದಿನಾಂಕವಾರು ಚಾಕಿ · ರೇಷ್ಮೆ ಮಾಸ (ಹಿಂದಿನ 24 → ಪ್ರಸ್ತುತ 23) · ತಳಿ × ವಾರ × {selectedDistrict ? `ಸ್ಥಳೀಯ (${districtName}) ಮತ್ತು ಹೊರ` : "ಹೊರ ಜಿಲ್ಲೆಗಳು"}
                </div>
              </div>

              <div className="gdw-scroll" style={{ overflowX: "auto" }}>
                <table className="gdw-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1300px" }}>
                  <thead>
                    {/* Row 1: top groups */}
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "150px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>ತಳಿ ಸಿಎಸ್ಆರ್-2</div><div style={hdrEn}>Race CSR-2</div>
                      </th>
                      <th colSpan={5} style={hdr("linear-gradient(135deg,#0d9488,#14b8a6)")}>
                        <div style={{ fontSize: "12.5px" }}>🏠 ಜಿಲ್ಲೆ Home {selectedDistrict ? `· ${districtName}` : ""}</div>
                        <div style={hdrEn}>Home District (4 weeks + total)</div>
                      </th>
                      <th colSpan={5} style={hdr("linear-gradient(135deg,#3730a3,#6366f1)")}>
                        <div style={{ fontSize: "12.5px" }}>🌐 ಹೊರ ಜಿಲ್ಲೆ</div>
                        <div style={hdrEn}>Other Districts (4 weeks + total)</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#9a3412,#ea580c)", "120px", true)}>
                        <div style={{ fontSize: "12.5px" }}>Σ ಒಟ್ಟು</div><div style={hdrEn}>Grand Total</div>
                      </th>
                    </tr>
                    {/* Row 2: weekly leaves under each group */}
                    <tr>
                      {/* Home group */}
                      {[1, 2, 3, 4].map((wk) => (
                        <th key={`h${wk}`} style={subhdr("linear-gradient(135deg,#a7f3d0,#6ee7b7)", "#064e3b")}>
                          <div style={{ fontSize: "10.5px" }}>W{wk}</div>
                          <div style={subhdrEn}>{WEEK_HINTS[wk - 1].hint}</div>
                        </th>
                      ))}
                      <th style={subhdr("linear-gradient(135deg,#5eead4,#2dd4bf)", "#0f766e")}>
                        <div style={{ fontSize: "10.5px" }}>Σ ಒಟ್ಟು</div><div style={subhdrEn}>Home Tot</div>
                      </th>
                      {/* Other group */}
                      {[1, 2, 3, 4].map((wk) => (
                        <th key={`o${wk}`} style={subhdr("linear-gradient(135deg,#c7d2fe,#a5b4fc)", "#312e81")}>
                          <div style={{ fontSize: "10.5px" }}>W{wk}</div>
                          <div style={subhdrEn}>{WEEK_HINTS[wk - 1].hint}</div>
                        </th>
                      ))}
                      <th style={subhdr("linear-gradient(135deg,#a5b4fc,#818cf8)", "#3730a3")}>
                        <div style={{ fontSize: "10.5px" }}>Σ ಒಟ್ಟು</div><div style={subhdrEn}>Other Tot</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={12} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#f0fdfa,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>📅</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f766e", marginBottom: "4px" }}>ಯಾವುದೇ ಚಾಕಿ ಮಾಹಿತಿ ಇಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No daywise chawki data found for this grainage in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {dataRows.map((row, ri) => {
                      const raceMeta = RACE_STYLE(row.race);
                      const isTotal = raceMeta.isTotal;
                      const rowBg = isTotal
                        ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                        : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      return (
                        <tr key={ri} className="gdw-tr" style={{ background: rowBg }}>
                          <td style={{
                            padding: "12px 14px", textAlign: "left",
                            borderBottom: "1px solid #e2e8f0", borderRight: "2px solid #e2e8f0",
                            fontWeight: 800, fontSize: "13px",
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "8px",
                              padding: "4px 12px", borderRadius: "999px",
                              background: raceMeta.bg, color: raceMeta.color,
                              fontWeight: 800, fontSize: "12px",
                              border: isTotal ? "1.5px solid #fbbf24" : "1px solid rgba(0,0,0,.06)",
                            }}>
                              <span style={{ fontSize: "13px", lineHeight: 1 }}>{raceMeta.icon}</span>
                              {row.race || "—"}
                            </span>
                          </td>
                          {/* Home group */}
                          <ValCell v={row.hw1} isTotal={isTotal}
                                   color="#064e3b" bg="linear-gradient(135deg,#ecfdf5,#d1fae5)" />
                          <ValCell v={row.hw2} isTotal={isTotal}
                                   color="#064e3b" bg="linear-gradient(135deg,#d1fae5,#a7f3d0)" />
                          <ValCell v={row.hw3} isTotal={isTotal}
                                   color="#064e3b" bg="linear-gradient(135deg,#a7f3d0,#6ee7b7)" />
                          <ValCell v={row.hw4} isTotal={isTotal}
                                   color="#065f46" bg="linear-gradient(135deg,#6ee7b7,#34d399)" />
                          <ValCell v={row.htot} isTotal={isTotal}
                                   color="#0f766e" bg="linear-gradient(135deg,#5eead4,#2dd4bf)"
                                   weight={800} right="2px solid #e2e8f0" />
                          {/* Other group */}
                          <ValCell v={row.ow1} isTotal={isTotal}
                                   color="#312e81" bg="linear-gradient(135deg,#eef2ff,#e0e7ff)" />
                          <ValCell v={row.ow2} isTotal={isTotal}
                                   color="#312e81" bg="linear-gradient(135deg,#e0e7ff,#c7d2fe)" />
                          <ValCell v={row.ow3} isTotal={isTotal}
                                   color="#312e81" bg="linear-gradient(135deg,#c7d2fe,#a5b4fc)" />
                          <ValCell v={row.ow4} isTotal={isTotal}
                                   color="#3730a3" bg="linear-gradient(135deg,#a5b4fc,#818cf8)" />
                          <ValCell v={row.otot} isTotal={isTotal}
                                   color="#3730a3" bg="linear-gradient(135deg,#818cf8,#6366f1)"
                                   weight={800} textOnDark right="2px solid #e2e8f0" />
                          {/* Grand total */}
                          <ValCell v={row.grand} isTotal={isTotal}
                                   color="#7c2d12" bg="linear-gradient(135deg,#fed7aa,#fb923c)"
                                   weight={800} fontSize={13.5} />
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #a7f3d0" }}>
                <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                  Day-wise · {grainageName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; Σ {kpis.grand.toLocaleString()} DFLs · Peak {kpis.peakWk > 0 ? `W${kpis.peakWk}` : "—"}
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

function ValCell({ v, isTotal, color, bg, weight, right, textOnDark, fontSize }) {
  const s = String(v ?? "").trim();
  const empty = s === "";
  const n = numOrZero(v);
  const isZero = !empty && n === 0;
  const display = empty ? "—" : fmt(v);
  return (
    <td className="gdw-num" style={{
      padding: "12px 10px", textAlign: "right",
      borderBottom: "1px solid #e2e8f0",
      borderRight: right || "1px solid #f8fafc",
      background: empty || isZero ? "transparent" : (isTotal ? "linear-gradient(135deg,#fde68a,#fcd34d)" : bg),
      color: empty ? "#cbd5e0" : (isZero ? "#94a3b8" : (isTotal ? "#78350f" : (textOnDark ? "#fff" : color))),
      fontWeight: weight || (isTotal ? 800 : 700),
      fontSize: `${fontSize || 12.5}px`,
    }}>{display}</td>
  );
}

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
const subhdrEn = { fontSize: "8.5px", opacity: .8, marginTop: "1px", fontWeight: 700 };
const hdr = (bg, minW, single, align) => ({
  background: bg, color: "#fff",
  padding: "10px 8px", textAlign: align || "center",
  border: "1px solid rgba(255,255,255,.18)",
  fontWeight: 800,
  minWidth: minW || "100px",
  verticalAlign: single ? "middle" : "top",
});
const subhdr = (bg, color) => ({
  background: bg, color,
  padding: "7px 5px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
  minWidth: "80px",
});

export default GrainageDaywiseChawkiReport;
