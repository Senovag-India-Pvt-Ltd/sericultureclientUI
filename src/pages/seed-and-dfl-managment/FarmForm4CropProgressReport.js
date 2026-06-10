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

if (!document.getElementById("ff4-styles")) {
  const s = document.createElement("style");
  s.id = "ff4-styles";
  s.innerHTML = `
    .ff4-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .ff4-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .ff4-swal .swal2-icon { margin:20px auto 4px !important; }
    .ff4-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .ff4-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes ff4-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .ff4-wrap { animation: ff4-in .35s ease; }
    .ff4-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .ff4-table th { letter-spacing:.02em; }
    .ff4-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .ff4-scroll::-webkit-scrollbar { height:9px; }
    .ff4-scroll::-webkit-scrollbar-track { background:#f0fdfa; border-radius:6px; }
    .ff4-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#3730a3); border-radius:6px; }
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

const farmSelectStyles = {
  control: (base, state) => ({
    ...base, borderRadius: "8px",
    border: state.isFocused ? "1.5px solid #0f766e" : "1.5px solid #d0d9e8",
    background: "#f0fdfa",
    minHeight: "38px", fontSize: "13px", color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(15,118,110,.18)" : "none",
    "&:hover": { border: "1.5px solid #0f766e" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (base) => ({ ...base, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#0f766e" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(15,118,110,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base, fontSize: "13px", padding: "8px 12px",
    background: state.isSelected ? "linear-gradient(135deg,#0f766e,#14b8a6)" : state.isFocused ? "#ecfdf5" : "#fff",
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
  if (!s) return "";
  const n = parseFloat(s);
  if (isNaN(n)) return s;          // already formatted (e.g. date string)
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

// Per-metric visual hint (icon + hue) keyed by serial_number
const METRIC_META = {
  "1":  { icon: "🌾", hue: "amber",   en: "Crop No"             },
  "2":  { icon: "🧹", hue: "teal",    en: "Lots Brushed"        },
  "3":  { icon: "📍", hue: "slate",   en: "Source"              },
  "4":  { icon: "🥚", hue: "blue",    en: "DFLs Received"       },
  "5":  { icon: "💀", hue: "rose",    en: "Mortality"           },
  "6":  { icon: "✂️", hue: "orange",  en: "Divided / Distributed" },
  "7":  { icon: "🛏️", hue: "violet",  en: "Rearing Method"      },
  "8":  { icon: "🐛", hue: "lime",    en: "Post-Instar Count"   },
  "9":  { icon: "📅", hue: "teal",    en: "Brushing Date",      isDate: true },
  "10": { icon: "🩺", hue: "slate",   en: "Clinic Info"         },
  "11": { icon: "📈", hue: "lime",    en: "Avg per DFL"         },
  "12": { icon: "⚖️", hue: "violet",  en: "Avg Worm Weight (10)" },
  "13": { icon: "📅", hue: "indigo",  en: "Spun-On Date",       isDate: true },
  "14": { icon: "📊", hue: "emerald", en: "ERR % (Chawki %)",   isPct: true },
  "15": { icon: "🪺", hue: "orange",  en: "Cocoons Harvested"   },
  "16": { icon: "🍃", hue: "lime",    en: "Cocoons / kg leaf"   },
  "17": { icon: "🌿", hue: "lime",    en: "Leaves Used"         },
  "18": { icon: "💰", hue: "emerald", en: "Income"              },
  "19": { icon: "🦠", hue: "rose",    en: "Infections Observed" },
  "20": { icon: "📞", hue: "slate",   en: "Contact Info"        },
};

const HUE = {
  amber:   { band: "linear-gradient(135deg,#fed7aa,#fdba74)", text: "#7c2d12", chipBg: "#fff7ed" },
  teal:    { band: "linear-gradient(135deg,#99f6e4,#5eead4)", text: "#134e4a", chipBg: "#f0fdfa" },
  emerald: { band: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", text: "#064e3b", chipBg: "#ecfdf5" },
  blue:    { band: "linear-gradient(135deg,#bfdbfe,#93c5fd)", text: "#1e3a8a", chipBg: "#eff6ff" },
  indigo:  { band: "linear-gradient(135deg,#c7d2fe,#a5b4fc)", text: "#3730a3", chipBg: "#eef2ff" },
  violet:  { band: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", text: "#4c1d95", chipBg: "#f5f3ff" },
  rose:    { band: "linear-gradient(135deg,#fecdd3,#fda4af)", text: "#881337", chipBg: "#fff1f2" },
  orange:  { band: "linear-gradient(135deg,#fed7aa,#fb923c)", text: "#7c2d12", chipBg: "#fff7ed" },
  lime:    { band: "linear-gradient(135deg,#d9f99d,#bef264)", text: "#3f6212", chipBg: "#f7fee7" },
  slate:   { band: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", text: "#334155", chipBg: "#f8fafc" },
};

const isEmptyVal = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return true;
  if (s === "0" || s === "0.0" || s === "0.00") return false; // zero is a value
  return false;
};

const hasAnyData = (row) => {
  const cy = String(row.cy_month ?? "").trim();
  const cyc = String(row.cy_cum ?? "").trim();
  const py = String(row.py_month ?? "").trim();
  const pyc = String(row.py_cum ?? "").trim();
  return [cy, cyc, py, pyc].some((v) => v !== "");
};

function FarmForm4CropProgressReport() {
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

  useEffect(() => {
    api.get(baseURL + "farmMaster/get-all").then((r) => setFarmList(r.data.content.farmMaster || [])).catch(() => setFarmList([]));
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
    if (!filter.farmId)                return "Please select a Farm.";
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
      background: "#fff", customClass: { popup: "ff4-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "ff4-swal" },
    });

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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-form4-crop-progress", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Form-4 Crop Progress report.");
        }
      } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-form4-crop-progress/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-form4-crop-progress/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `farm_form4_crop_progress_${filter.farmId}_${year}_${m}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const farmName   = selectedFarm?.farmName || "—";

  // Group by serial_number — most groups have a single row (serial 15 has two)
  const grouped = useMemo(() => {
    const map = new Map();
    dataRows.forEach((r) => {
      const k = String(r.serial_number);
      if (!map.has(k)) map.set(k, { sn: k, rows: [] });
      map.get(k).rows.push(r);
    });
    return Array.from(map.values());
  }, [dataRows]);

  // Summary KPIs from rows that have real data
  const kpis = useMemo(() => {
    const find = (sn, sub) => dataRows.find(
      (r) => String(r.serial_number) === String(sn) && String(r.sub_label).trim() === (sub ?? "")
    ) || {};
    const cropNo  = find(1);
    const lots    = find(2);
    const rcv     = find(4);
    const wormWt  = find(12);
    const errPct  = find(14);
    const cocQty  = find(15, "ಸಂಖ್ಯೆ");
    const cocWt   = find(15, "ತೂಕ");

    const populated = dataRows.filter(hasAnyData).length;
    return {
      cropNoCY:    String(cropNo.cy_month ?? "—"),
      lotsCYM:     numOrZero(lots.cy_month),
      lotsCYCum:   numOrZero(lots.cy_cum),
      rcvCYM:      numOrZero(rcv.cy_month),
      rcvCYCum:    numOrZero(rcv.cy_cum),
      cocQtyCYM:   numOrZero(cocQty.cy_month),
      cocQtyCYCum: numOrZero(cocQty.cy_cum),
      cocWtCYM:    numOrZero(cocWt.cy_month),
      cocWtCYCum:  numOrZero(cocWt.cy_cum),
      wormWtCYM:   numOrZero(wormWt.cy_month),
      errPctCYM:   numOrZero(errPct.cy_month),
      populated,
      total:       dataRows.length,
    };
  }, [dataRows]);

  const completeness = kpis.total === 0 ? 0 : (kpis.populated / kpis.total) * 100;

  return (
    <Layout title={t("Form-4 · Farm Crop Progress Report")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ನಮೂನೆ-4 · ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಕೃಷಿಕ್ಷೇತ್ರ — ಹುಳು ಸಾಕಾಣಿಕೆ ಬೆಳೆಯ ಪ್ರಗತಿಯ ವರದಿ")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
            color: "#0f766e", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #5eead4", verticalAlign: "middle",
          }}>P3 Farms · Bivoltine · Form-4 · Crop Progress</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(15,118,110,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#3730a3 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🐛</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ನಮೂನೆ-4 · ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಕೃಷಿಕ್ಷೇತ್ರ — ಹುಳು ಸಾಕಾಣಿಕೆ ಬೆಳೆಯ ಪ್ರಗತಿಯ ವರದಿ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Form-4</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P3 Farms (Bivoltine) — Crop-level Progress: 20 metrics covering rearing, brushing, cocoon yield (CY vs PY)</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{farmName}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {kpis.populated}/{kpis.total} populated
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f0fdfa)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>Farm <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={farmList.map((f) => ({ value: String(f.farmId), label: f.farmName }))}
                    placeholder="— Search Farm —"
                    isSearchable isClearable
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={farmSelectStyles}
                    value={
                      farmList
                        .map((f) => ({ value: String(f.farmId), label: f.farmName }))
                        .find((o) => o.value === String(filter.farmId)) || null
                    }
                    onChange={(opt) => {
                      setFilter((p) => ({ ...p, farmId: opt?.value || "" }));
                      setHasReport(false); setDataRows([]);
                    }}
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
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
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
          <div className="ff4-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpi("#ccfbf1", "#5eead4", "#0f766e")}>
                <span style={kpiLbl("#0f766e")}>Farm</span>
                <span style={{ ...kpiVal("#134e4a", 14), fontWeight: 800 }}>{farmName}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>Period</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={kpi("#fed7aa", "#fb923c", "#7c2d12")}>
                <span style={kpiLbl("#7c2d12")}>🌾 ಬೆಳೆ ಸಂಖ್ಯೆ Crop No (CY)</span>
                <span className="ff4-num" style={kpiVal("#7c2d12", 18)}>{kpis.cropNoCY || "—"}</span>
              </div>
              <div style={kpi("#a7f3d0", "#6ee7b7", "#065f46")}>
                <span style={kpiLbl("#065f46")}>🧹 ತಂಡಗಳು Lots Brushed</span>
                <span className="ff4-num" style={kpiVal("#064e3b", 16)}>{kpis.lotsCYM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#065f46", fontWeight: 700, marginTop: "1px" }}>FY Cum: {kpis.lotsCYCum.toLocaleString()}</span>
              </div>
              <div style={kpi("#dbeafe", "#93c5fd", "#1e40af")}>
                <span style={kpiLbl("#1e40af")}>🥚 ಸ್ವೀಕರಿಸಿದ DFLs Recvd</span>
                <span className="ff4-num" style={kpiVal("#1e3a8a", 16)}>{kpis.rcvCYM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#1e40af", fontWeight: 700, marginTop: "1px" }}>FY Cum: {kpis.rcvCYCum.toLocaleString()}</span>
              </div>
              <div style={kpi("#fed7aa", "#fdba74", "#9a3412")}>
                <span style={kpiLbl("#9a3412")}>🪺 ಗೂಡು Cocoons</span>
                <span className="ff4-num" style={kpiVal("#7c2d12", 16)}>{kpis.cocQtyCYM.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#9a3412", fontWeight: 700, marginTop: "1px" }}>{kpis.cocWtCYM.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg</span>
              </div>
              <div style={kpi("#bbf7d0", "#86efac", "#14532d")}>
                <span style={kpiLbl("#14532d")}>📊 ERR % (CY M)</span>
                <span className="ff4-num" style={kpiVal("#14532d", 18)}>{kpis.errPctCYM.toFixed(2)}%</span>
              </div>
              <div style={kpi("#ddd6fe", "#a78bfa", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>⚖️ ಹುಳು ತೂಕ Worm Wt (10)</span>
                <span className="ff4-num" style={kpiVal("#4c1d95", 16)}>{kpis.wormWtCYM.toFixed(2)}</span>
                <span style={{ fontSize: "10.5px", color: "#5b21b6", fontWeight: 700, marginTop: "1px" }}>g per 10 worms</span>
              </div>
              <div style={kpi(
                completeness >= 80 ? "#bbf7d0" : completeness >= 50 ? "#fde68a" : "#fecaca",
                completeness >= 80 ? "#86efac" : completeness >= 50 ? "#fcd34d" : "#fca5a5",
                completeness >= 80 ? "#14532d" : completeness >= 50 ? "#92400e" : "#7f1d1d",
              )}>
                <span style={kpiLbl(completeness >= 80 ? "#14532d" : completeness >= 50 ? "#92400e" : "#7f1d1d")}>
                  📋 Data Completeness
                </span>
                <span className="ff4-num" style={kpiVal(
                  completeness >= 80 ? "#14532d" : completeness >= 50 ? "#78350f" : "#7f1d1d", 16,
                )}>{completeness.toFixed(0)}%</span>
                <span style={{ fontSize: "10.5px", color: completeness >= 80 ? "#166534" : completeness >= 50 ? "#92400e" : "#9f1239", fontWeight: 700, marginTop: "1px" }}>
                  {kpis.populated} / {kpis.total} metrics
                </span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#0c4a6e,#0f766e 50%,#312e81)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                ನಮೂನೆ-4 · ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಕೃಷಿಕ್ಷೇತ್ರ {farmName} &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Form-4 · Farm Crop Progress &nbsp;·&nbsp; CY {monthYear || ""}-{monthYear ? (monthYear + 1) % 100 : ""} vs PY {monthYear ? monthYear - 1 : ""}-{monthYear ? monthYear % 100 : ""} &nbsp;·&nbsp; {monthLabel}
                </div>
              </div>

              <div className="ff4-scroll" style={{ overflowX: "auto" }}>
                <table className="ff4-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1200px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "380px", true, "left")}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರಗಳು</div><div style={hdrEn}>Description</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#475569,#64748b)", "100px", true)}>
                        <div style={{ fontSize: "12px" }}>ಉಪ-ಗುಂಪು</div><div style={hdrEn}>Sub</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#0f766e,#14b8a6)")}>
                        <div style={{ fontSize: "12.5px" }}>ಪ್ರಸಕ್ತ ವರ್ಷ {monthYear ? `${monthYear}-${(monthYear + 1) % 100}` : ""}</div>
                        <div style={hdrEn}>Current Year</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#3730a3,#6366f1)")}>
                        <div style={{ fontSize: "12.5px" }}>ಹಿಂದಿನ ವರ್ಷ {monthYear ? `${monthYear - 1}-${monthYear % 100}` : ""}</div>
                        <div style={hdrEn}>Previous Year</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={subhdr("linear-gradient(135deg,#99f6e4,#5eead4)", "#134e4a")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸ</div><div style={subhdrEn}>Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#5eead4,#2dd4bf)", "#0f766e")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸಾಂತ್ಯ</div><div style={subhdrEn}>Cumulative</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#c7d2fe,#a5b4fc)", "#312e81")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸ</div><div style={subhdrEn}>Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#a5b4fc,#818cf8)", "#3730a3")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸಾಂತ್ಯ</div><div style={subhdrEn}>Cumulative</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.length === 0 && (
                      <tr><td colSpan={7} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#f0fdfa,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🐛</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f766e", marginBottom: "4px" }}>ಯಾವುದೇ ಬೆಳೆ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No crop progress data found for this farm in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {grouped.map((g) => {
                      const meta = METRIC_META[g.sn] || { icon: "·", hue: "slate", en: "" };
                      const pal = HUE[meta.hue];
                      return g.rows.map((row, ri) => {
                        const isFirst = ri === 0;
                        const sub = String(row.sub_label ?? "").trim();
                        const populated = hasAnyData(row);
                        const muted = !populated;
                        const cyM = isEmptyVal(row.cy_month) ? "" : row.cy_month;
                        const cyC = isEmptyVal(row.cy_cum)   ? "" : row.cy_cum;
                        const pyM = isEmptyVal(row.py_month) ? "" : row.py_month;
                        const pyC = isEmptyVal(row.py_cum)   ? "" : row.py_cum;
                        const renderVal = (v) => {
                          if (v === "" || v == null) return null;
                          if (meta.isPct) return `${fmt(v)}%`;
                          return fmt(v);
                        };
                        return (
                          <tr key={`${g.sn}-${ri}`} className="ff4-tr"
                              style={{ background: ri % 2 === 1 ? "#f8fafc" : "#ffffff", opacity: muted ? .65 : 1 }}>
                            {isFirst && (
                              <td rowSpan={g.rows.length} style={{
                                padding: "10px 6px", textAlign: "center",
                                borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                                background: muted ? "linear-gradient(135deg,#f1f5f9,#e2e8f0)" : pal.band,
                                verticalAlign: "middle",
                              }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                  <span style={{ fontSize: "16px" }}>{meta.icon}</span>
                                  <span style={{
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    minWidth: "26px", height: "26px", borderRadius: "50%",
                                    background: "rgba(255,255,255,.92)",
                                    color: muted ? "#64748b" : pal.text, fontWeight: 800, fontSize: "11.5px",
                                  }}>{g.sn}</span>
                                </div>
                              </td>
                            )}
                            <td style={{
                              padding: "10px 14px", textAlign: "left",
                              borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #e2e8f0",
                              color: "#0f172a", fontWeight: 700, fontSize: "12.5px",
                              background: isFirst && !muted ? pal.chipBg : "transparent",
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ color: muted ? "#94a3b8" : "#0f172a" }}>
                                  {row.description_kannada || "—"}
                                </span>
                                {meta.en && isFirst && (
                                  <span style={{ fontSize: "10.5px", fontWeight: 700, color: muted ? "#94a3b8" : pal.text, opacity: .85 }}>
                                    · {meta.en}
                                  </span>
                                )}
                                {muted && (
                                  <span style={{
                                    fontSize: "9.5px", fontWeight: 700,
                                    color: "#64748b", background: "#f1f5f9",
                                    padding: "2px 7px", borderRadius: "999px",
                                    border: "1px solid #cbd5e1",
                                  }}>not tracked</span>
                                )}
                              </div>
                            </td>
                            <td style={{
                              padding: "10px 8px", textAlign: "center",
                              borderBottom: "1px solid #f1f5f9", borderRight: "2px solid #e2e8f0",
                            }}>
                              {sub ? (
                                <span style={{
                                  display: "inline-block", padding: "3px 10px", borderRadius: "999px",
                                  background: pal.band, color: pal.text,
                                  fontWeight: 800, fontSize: "11px",
                                }}>{sub}</span>
                              ) : (
                                <span style={{ color: "#cbd5e0", fontSize: "11px" }}>—</span>
                              )}
                            </td>
                            <td className="ff4-num" style={td("right",
                              cyM === "" ? "#cbd5e0" : "#134e4a",
                              700,
                              cyM === "" ? "transparent" : "linear-gradient(135deg,#f0fdfa,#ccfbf1)",
                            )}>
                              {renderVal(cyM) || "—"}
                            </td>
                            <td className="ff4-num" style={td("right",
                              cyC === "" ? "#cbd5e0" : "#0f766e",
                              800,
                              cyC === "" ? "transparent" : "linear-gradient(135deg,#ccfbf1,#99f6e4)",
                              "2px solid #e2e8f0",
                            )}>
                              {renderVal(cyC) || "—"}
                            </td>
                            <td className="ff4-num" style={td("right",
                              pyM === "" ? "#cbd5e0" : "#312e81",
                              700,
                              pyM === "" ? "transparent" : "linear-gradient(135deg,#eef2ff,#e0e7ff)",
                            )}>
                              {renderVal(pyM) || "—"}
                            </td>
                            <td className="ff4-num" style={td("right",
                              pyC === "" ? "#cbd5e0" : "#3730a3",
                              800,
                              pyC === "" ? "transparent" : "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
                            )}>
                              {renderVal(pyC) || "—"}
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #a7f3d0" }}>
                <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                  Form-4 · {farmName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {kpis.populated}/{kpis.total} metrics populated &nbsp;·&nbsp; ERR {kpis.errPctCYM.toFixed(1)}% &nbsp;·&nbsp; {kpis.cocQtyCYM.toLocaleString()} cocoons / {kpis.cocWtCYM.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg
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
  padding: "8px 6px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
  minWidth: "115px",
});
const td = (align, color, weight, bg, borderRight) => ({
  padding: "10px 12px", textAlign: align || "center",
  borderBottom: "1px solid #f1f5f9",
  borderRight: borderRight || "1px solid #f8fafc",
  background: bg || "transparent",
  color: color || "#0f172a", fontWeight: weight || 600,
  fontSize: "12.5px",
});

export default FarmForm4CropProgressReport;
