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

if (!document.getElementById("adsgg1-styles")) {
  const s = document.createElement("style");
  s.id = "adsgg1-styles";
  s.innerHTML = `
    .adsgg1-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .adsgg1-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .adsgg1-swal .swal2-icon { margin:20px auto 4px !important; }
    .adsgg1-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .adsgg1-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes adsgg1-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .adsgg1-wrap { animation: adsgg1-in .35s ease; }
    .adsgg1-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .adsgg1-table th { letter-spacing:.02em; }
    .adsgg1-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .adsgg1-scroll::-webkit-scrollbar { height:9px; }
    .adsgg1-scroll::-webkit-scrollbar-track { background:#fff7ed; border-radius:6px; }
    .adsgg1-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#ea580c,#b91c1c); border-radius:6px; }
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

const grainageSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "8px",
    border: state.isFocused ? "1.5px solid #ea580c" : "1.5px solid #d0d9e8",
    background: "#fffaf5",
    minHeight: "38px",
    fontSize: "12.5px",
    color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(234,88,12,.18)" : "none",
    "&:hover": { border: "1.5px solid #ea580c" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "12.5px" }),
  multiValue: (base) => ({
    ...base,
    background: "linear-gradient(135deg,#ffedd5,#fed7aa)",
    borderRadius: "10px",
    border: "1px solid #fdba74",
  }),
  multiValueLabel: (base) => ({ ...base, color: "#7c2d12", fontWeight: 700, fontSize: "11.5px", padding: "2px 6px" }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#9a3412",
    ":hover": { background: "#fdba74", color: "#7c2d12" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#9a3412" }),
  clearIndicator: (base) => ({ ...base, padding: "4px 6px", color: "#9a3412" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(234,88,12,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base,
    fontSize: "12.5px",
    padding: "8px 12px",
    background: state.isSelected
      ? "linear-gradient(135deg,#9a3412,#ea580c)"
      : state.isFocused
        ? "#fff7ed"
        : "#fff",
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
  if (isNaN(n)) return s;
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

// 7 metrics × (Month, Cumulative) → 14 numeric cells per row
const METRICS = [
  { key: "prog",        kn: "ಕಾರ್ಯಕ್ರಮ",          en: "Programme",       hue: "amber"  },
  { key: "rcv",         kn: "ಪಡೆದ ಗೂಡುಗಳು",       en: "Cocoons Recvd",   hue: "teal"   },
  { key: "stored",      kn: "ಸಂಗ್ರಹಿಸಿದ",         en: "Stored",          hue: "sky"    },
  { key: "joints",      kn: "ಜೊತೆಗಳು",          en: "Joints",          hue: "violet" },
  { key: "dfls",        kn: "ಉತ್ಪಾದಿಸಿದ ಮೊಟ್ಟೆ",  en: "DFLs Produced",   hue: "rose"   },
  { key: "yield_total", kn: "ಒಟ್ಟು ಗೂಡಿಗೆ ಇಳುವರಿ", en: "Yield / Total",   hue: "emerald", pct: true },
  { key: "yield_sel",   kn: "ಆಯ್ಕೆ ಗೂಡಿಗೆ ಇಳುವರಿ", en: "Yield / Selected",hue: "indigo",  pct: true },
];

const HUE_PALETTE = {
  amber:   { hdr: "linear-gradient(135deg,#b45309,#d97706)", sub: "linear-gradient(135deg,#fed7aa,#fdba74)", subText: "#7c2d12", cell: "#fff7ed", cellText: "#7c2d12", cumCell: "#ffedd5", cumText: "#9a3412" },
  teal:    { hdr: "linear-gradient(135deg,#0f766e,#14b8a6)", sub: "linear-gradient(135deg,#ccfbf1,#99f6e4)", subText: "#134e4a", cell: "#f0fdfa", cellText: "#134e4a", cumCell: "#ccfbf1", cumText: "#115e59" },
  sky:     { hdr: "linear-gradient(135deg,#0369a1,#0284c7)", sub: "linear-gradient(135deg,#e0f2fe,#bae6fd)", subText: "#075985", cell: "#f0f9ff", cellText: "#075985", cumCell: "#e0f2fe", cumText: "#0c4a6e" },
  violet:  { hdr: "linear-gradient(135deg,#5b21b6,#7c3aed)", sub: "linear-gradient(135deg,#ede9fe,#ddd6fe)", subText: "#4c1d95", cell: "#f5f3ff", cellText: "#4c1d95", cumCell: "#ede9fe", cumText: "#5b21b6" },
  rose:    { hdr: "linear-gradient(135deg,#9f1239,#e11d48)", sub: "linear-gradient(135deg,#ffe4e6,#fecdd3)", subText: "#881337", cell: "#fff1f2", cellText: "#881337", cumCell: "#ffe4e6", cumText: "#9f1239" },
  emerald: { hdr: "linear-gradient(135deg,#065f46,#10b981)", sub: "linear-gradient(135deg,#d1fae5,#a7f3d0)", subText: "#064e3b", cell: "#ecfdf5", cellText: "#064e3b", cumCell: "#d1fae5", cumText: "#065f46" },
  indigo:  { hdr: "linear-gradient(135deg,#3730a3,#4f46e5)", sub: "linear-gradient(135deg,#e0e7ff,#c7d2fe)", subText: "#312e81", cell: "#eef2ff", cellText: "#312e81", cumCell: "#e0e7ff", cumText: "#3730a3" },
};

function AdsGg1Report() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ grainageIds: [], financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [grainageList,      setGrainageList]      = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "grainageMaster/get-all")
      .then((r) => {
        const list = r.data.content.grainageMaster || [];
        // Backend filters to P1 anyway; show only P1-tagged options to users when type is exposed.
        const p1Only = list.filter((g) =>
          !g.grainageType || String(g.grainageType).trim().toUpperCase() === "P1"
        );
        setGrainageList(p1Only.length ? p1Only : list);
      })
      .catch(() => setGrainageList([]));

    api.get(baseURL + "financialYearMaster/get-all")
      .then((r) => setFinancialYearList(r.data.content.financialYearMaster || []))
      .catch(() => setFinancialYearList([]));

    api.get(baseURL + "financialYearMaster/get-is-default")
      .then((r) => {
        const fy = r.data.content;
        if (fy) {
          setFilter((p) => ({ ...p, financialYearMasterId: fy.financialYearMasterId }));
          setFyStartYear(extractYear(fy.financialYear));
        }
      })
      .catch(() => {});
  }, []);

  const extractYear = (str) => {
    if (!str) return null;
    const yr = parseInt(String(str).trim().split("-")[0], 10);
    return isNaN(yr) ? null : yr;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((p) => ({ ...p, [name]: value }));
    setHasReport(false);
    setDataRows([]);
    if (name === "financialYearMasterId") {
      const sel2 = financialYearList.find((f) => String(f.financialYearMasterId) === String(value));
      setFyStartYear(sel2 ? extractYear(sel2.financialYear) : null);
    }
  };

  const validate = () => {
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
      background: "#fff", customClass: { popup: "adsgg1-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "adsgg1-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    const ids = (filter.grainageIds || []).map((o) => o.value).filter(Boolean).join(",");
    const p = { year, month: m };
    if (ids) p.grainageIds = ids;
    return p;
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-gg1", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []);
      setHasReport(true);
    } catch {
      showErr("Fetch Failed", "Failed to load the ADS GG1 report.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-gg1/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch {
      showErr("PDF Failed", "Could not generate the PDF report.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleExcel = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-gg1/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `ads_gg1_${year}_${m}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr("Excel Failed", "Could not generate the Excel report.");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);

  // Group rows by grainage (each grainage emits 2 rows: CY + PY)
  const grouped = useMemo(() => {
    const map = {};
    const order = [];
    dataRows.forEach((r) => {
      const key = String(r.sl_no) + "::" + String(r.grainage);
      if (!map[key]) {
        map[key] = { sl_no: r.sl_no, grainage: r.grainage, rows: [] };
        order.push(key);
      }
      map[key].rows.push(r);
    });
    // Within each group, sort CY before PY (CY year is the larger one)
    return order.map((k) => {
      const g = map[k];
      g.rows.sort((a, b) => String(b.yr).localeCompare(String(a.yr)));
      return g;
    });
  }, [dataRows]);

  // KPIs from CY rows only (latest year per grainage) — exclude the grand-total group
  const kpis = useMemo(() => {
    const det = grouped.filter((g) => String(g.grainage).trim() !== "ಒಟ್ಟು");
    const cyRows = det.map((g) => g.rows[0]).filter(Boolean);
    const sum = (k) => cyRows.reduce((a, r) => a + numOrZero(r[k]), 0);
    return {
      grainages: det.length,
      progM:   sum("prog_m"),
      rcvM:    sum("rcv_m"),
      dflsM:   sum("dfls_m"),
      dflsMe:  sum("dfls_me"),
    };
  }, [grouped]);

  const cellLooksPct = (key) => key.startsWith("yield_");

  return (
    <Layout title={t("ADS · P1 Grainage Monthly Progress Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ADS · ಪಿ1 ಬಿತ್ತನೆ ಕೋಠಿಗಳ ಪ್ರಗತಿ ವರದಿ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#fed7aa,#fdba74)",
                color: "#7c2d12", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #fb923c", verticalAlign: "middle",
              }}>ADS · GG1 · CY vs PY</span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(124,45,18,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#9a3412 0%,#ea580c 50%,#b91c1c 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center",
            gap: "12px",
            position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📈</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ADS · ಪಿ1 ಬಿತ್ತನೆ ಕೋಠಿಗಳ ಪ್ರಗತಿ ವರದಿ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>GG-1</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P1 Grainage Monthly Progress — Programme · Cocoons · Joints · DFLs · Yield (CY vs PY)</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {kpis.grainages} grainage{kpis.grainages === 1 ? "" : "s"}
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#fff7ed)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>
                    Grainages <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>(optional · empty = all P1)</span>
                  </label>
                  <ReactSelect
                    isMulti
                    options={grainageList.map((g) => ({
                      value: String(g.grainageMasterId),
                      label: g.grainageMasterName,
                    }))}
                    placeholder="— Select one or more —"
                    isSearchable
                    isClearable
                    closeMenuOnSelect={false}
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={grainageSelectStyles}
                    value={filter.grainageIds}
                    onChange={(opts) => {
                      setFilter((p) => ({ ...p, grainageIds: opts || [] }));
                      setHasReport(false);
                      setDataRows([]);
                    }}
                    noOptionsMessage={() => "No grainage found"}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>Financial Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">— Select Year —</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">— Month —</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#9a3412,#ea580c)", "0 4px 12px rgba(154,52,18,.32)", isLoading)}>
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

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="adsgg1-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#fed7aa,#ffedd5)", border: "1.5px solid #fb923c", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#7c2d12", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Grainages</span>
                <span style={{ fontSize: "16px", color: "#7c2d12", fontWeight: 800, marginTop: "2px" }}>{kpis.grainages}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Period</span>
                <span style={{ fontSize: "13.5px", color: "#78350f", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", border: "1.5px solid #fdba74", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#9a3412", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಮಾಸದ ಕಾರ್ಯಕ್ರಮ</span>
                <span className="adsgg1-num" style={{ fontSize: "15px", color: "#7c2d12", fontWeight: 800, marginTop: "2px" }}>{kpis.progM.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಮಾಸದ ಗೂಡುಗಳು</span>
                <span className="adsgg1-num" style={{ fontSize: "15px", color: "#134e4a", fontWeight: 800, marginTop: "2px" }}>{kpis.rcvM.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ffe4e6,#fff1f2)", border: "1.5px solid #fda4af", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#9f1239", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಮಾಸದ ಮೊಟ್ಟೆಗಳು</span>
                <span className="adsgg1-num" style={{ fontSize: "15px", color: "#881337", fontWeight: 800, marginTop: "2px" }}>{kpis.dflsM.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0e7ff,#eef2ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ವಾರಾಂತ್ಯ ಮೊಟ್ಟೆಗಳು (Cum.)</span>
                <span className="adsgg1-num" style={{ fontSize: "15px", color: "#312e81", fontWeight: 800, marginTop: "2px" }}>{kpis.dflsMe.toLocaleString()}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(154,52,18,.12)", overflow: "hidden" }}>
              {/* Title strip */}
              <div style={{
                background: "linear-gradient(135deg,#7c2d12,#b45309 50%,#b91c1c)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ADS · ಪಿ1 ಬಿತ್ತನೆ ಕೋಠಿಗಳ ಪ್ರಗತಿ ವರದಿ &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  P1 Grainage Monthly Progress &nbsp;·&nbsp; Current Year vs Previous Year &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="adsgg1-scroll" style={{ overflowX: "auto" }}>
                <table className="adsgg1-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1700px" }}>
                  <thead>
                    {/* Row 1: top-level groups */}
                    <tr>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "10px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "55px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#334155,#475569)",
                        color: "#fff", padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "200px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಬಿತ್ತನೆ ಕೋಠಿ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Grainage</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#475569,#64748b)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "100px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12px" }}>ವರ್ಷ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Year</div>
                      </th>
                      {METRICS.map((m) => {
                        const pal = HUE_PALETTE[m.hue];
                        return (
                          <th key={m.key} colSpan={2} style={{
                            background: pal.hdr,
                            color: "#fff", padding: "10px 8px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                          }}>
                            <div style={{ fontSize: "12.5px", fontWeight: 800 }}>{m.kn}</div>
                            <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .9, marginTop: "2px" }}>{m.en}{m.pct ? " (%)" : ""}</div>
                          </th>
                        );
                      })}
                    </tr>
                    {/* Row 2: month / cumulative leaves per metric */}
                    <tr>
                      {METRICS.map((m) => {
                        const pal = HUE_PALETTE[m.hue];
                        return ([
                          <th key={`${m.key}-m`} style={{
                            background: pal.sub, color: pal.subText,
                            padding: "8px 6px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: "85px",
                          }}>
                            <div style={{ fontSize: "10.5px" }}>ಮಾಸ</div>
                            <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>Month</div>
                          </th>,
                          <th key={`${m.key}-me`} style={{
                            background: pal.sub, color: pal.subText,
                            padding: "8px 6px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: "95px",
                          }}>
                            <div style={{ fontSize: "10.5px" }}>ವಾರಾಂತ್ಯ</div>
                            <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>Cumulative</div>
                          </th>,
                        ]);
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.length === 0 && (
                      <tr>
                        <td colSpan={3 + METRICS.length * 2} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                    {grouped.map((group, gi) => {
                      const groupBg = gi % 2 === 0 ? "#ffffff" : "#fffaf3";
                      return group.rows.map((row, ri) => {
                        const isFirst = ri === 0;
                        const isCY = isFirst; // first row of each group is CY (newest year)
                        const yearTone = isCY
                          ? "linear-gradient(135deg,#fed7aa,#fdba74)"
                          : "linear-gradient(135deg,#e2e8f0,#cbd5e1)";
                        const yearText = isCY ? "#7c2d12" : "#334155";
                        const yearLabelKn = isCY ? "ಪ್ರಸಕ್ತ" : "ಹಿಂದಿನ";
                        const yearLabelEn = isCY ? "Current" : "Previous";
                        return (
                          <tr key={`${group.sl_no}-${ri}`} className="adsgg1-tr" style={{ background: groupBg }}>
                            {isFirst && (
                              <td rowSpan={group.rows.length} style={{
                                padding: "10px 6px", textAlign: "center",
                                borderBottom: "2px solid #fed7aa", borderRight: "1px solid #e2e8f0",
                                background: "linear-gradient(135deg,#1e293b,#334155)",
                                verticalAlign: "middle",
                              }}>
                                <span style={{
                                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                                  minWidth: "30px", height: "30px", borderRadius: "50%",
                                  background: "linear-gradient(135deg,#fed7aa,#fdba74)",
                                  color: "#7c2d12", fontWeight: 800, fontSize: "12px",
                                }}>{group.sl_no}</span>
                              </td>
                            )}
                            {isFirst && (
                              <td rowSpan={group.rows.length} style={{
                                padding: "10px 14px", textAlign: "left",
                                borderBottom: "2px solid #fed7aa", borderRight: "1px solid #e2e8f0",
                                background: "linear-gradient(135deg,#fff7ed,#ffedd5)",
                                color: "#7c2d12", fontWeight: 800, fontSize: "12.5px",
                                verticalAlign: "middle",
                              }}>
                                {group.grainage || "—"}
                              </td>
                            )}
                            <td style={{
                              padding: "8px 6px", textAlign: "center",
                              borderBottom: ri === group.rows.length - 1 ? "2px solid #fed7aa" : "1px solid #f1f5f9",
                              borderRight: "2px solid #e2e8f0",
                            }}>
                              <span style={{
                                display: "inline-flex", flexDirection: "column", alignItems: "center",
                                padding: "4px 10px", borderRadius: "12px",
                                background: yearTone, color: yearText,
                                fontWeight: 800, fontSize: "11px", lineHeight: 1.2,
                              }}>
                                <span>{row.yr || "—"}</span>
                                <span style={{ fontSize: "9px", fontWeight: 700, opacity: .85, marginTop: "2px" }}>
                                  {yearLabelKn} · {yearLabelEn}
                                </span>
                              </span>
                            </td>
                            {METRICS.map((m) => {
                              const pal = HUE_PALETTE[m.hue];
                              const vMonth = row[`${m.key}_m`];
                              const vCum   = row[`${m.key}_me`];
                              const isPct = cellLooksPct(m.key);
                              const monthHas = String(vMonth ?? "").trim() !== "" && numOrZero(vMonth) !== 0;
                              const cumHas   = String(vCum   ?? "").trim() !== "" && numOrZero(vCum)   !== 0;
                              return ([
                                <td key={`${m.key}-m`} className="adsgg1-num" style={{
                                  padding: "9px 6px", textAlign: "center",
                                  borderBottom: ri === group.rows.length - 1 ? "2px solid #fed7aa" : "1px solid #f1f5f9",
                                  borderRight: "1px solid #f1f5f9",
                                  background: monthHas ? pal.cell : "transparent",
                                  color: monthHas ? pal.cellText : "#cbd5e0",
                                  fontWeight: monthHas ? 700 : 600,
                                  fontSize: "12px",
                                }}>
                                  {monthHas ? (isPct ? `${fmt(vMonth)}` : fmt(vMonth)) : "—"}
                                </td>,
                                <td key={`${m.key}-me`} className="adsgg1-num" style={{
                                  padding: "9px 6px", textAlign: "center",
                                  borderBottom: ri === group.rows.length - 1 ? "2px solid #fed7aa" : "1px solid #f1f5f9",
                                  borderRight: "2px solid #e2e8f0",
                                  background: cumHas ? pal.cumCell : "transparent",
                                  color: cumHas ? pal.cumText : "#cbd5e0",
                                  fontWeight: 800,
                                  fontSize: "12px",
                                }}>
                                  {cumHas ? (isPct ? `${fmt(vCum)}` : fmt(vCum)) : "—"}
                                </td>,
                              ]);
                            })}
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#fff7ed,#fef3c7)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #fdba74" }}>
                <span style={{ fontSize: "12px", color: "#7c2d12", fontWeight: 600 }}>
                  ADS · GG-1 — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {kpis.grainages} grainage{kpis.grainages === 1 ? "" : "s"}
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

export default AdsGg1Report;
