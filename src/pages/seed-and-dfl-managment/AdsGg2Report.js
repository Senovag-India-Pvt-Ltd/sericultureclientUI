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

if (!document.getElementById("adsgg2-styles")) {
  const s = document.createElement("style");
  s.id = "adsgg2-styles";
  s.innerHTML = `
    .adsgg2-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .adsgg2-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .adsgg2-swal .swal2-icon { margin:20px auto 4px !important; }
    .adsgg2-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .adsgg2-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes adsgg2-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .adsgg2-wrap { animation: adsgg2-in .35s ease; }
    .adsgg2-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .adsgg2-table th { letter-spacing:.02em; }
    .adsgg2-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .adsgg2-scroll::-webkit-scrollbar { height:9px; }
    .adsgg2-scroll::-webkit-scrollbar-track { background:#fff7ed; border-radius:6px; }
    .adsgg2-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#ea580c,#b91c1c); border-radius:6px; }
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

// Backend caps at TOP 6 P1 grainages — surface this to the user
const GRAINAGE_CAP = 6;

// 7 metrics (sl_no 1..7). Some metrics only populate `total` and zero-out W1..W4.
const METRIC_META = {
  "1": {
    en: "DFL Production Target",
    icon: "🎯",
    hue: "amber",
    weeklyMeaningful: true,   // weeks present (target/4)
    note: "Target ÷ 4 across weeks",
    isPct: false,
  },
  "2": {
    en: "DFLs Produced",
    icon: "🥚",
    hue: "teal",
    weeklyMeaningful: true,
    note: "Actual DFLs laid by week",
    isPct: false,
  },
  "3": {
    en: "Achievement %",
    icon: "📊",
    hue: "emerald",
    weeklyMeaningful: false,  // only total carries data
    note: "Produced ÷ Target × 100",
    isPct: true,
  },
  "4": {
    en: "Diseased Lots",
    icon: "⚠️",
    hue: "rose",
    weeklyMeaningful: false,
    note: "Lots with test_results=Diseased",
    isPct: false,
  },
  "5": {
    en: "Diseased DFLs",
    icon: "🦠",
    hue: "red",
    weeklyMeaningful: false,
    note: "DFLs from diseased lots",
    isPct: false,
  },
  "6": {
    en: "Disease-Free DFLs",
    icon: "✅",
    hue: "green",
    weeklyMeaningful: true,
    note: "DFLs from non-diseased lots, by week",
    isPct: false,
  },
  "7": {
    en: "Next Month Programme",
    icon: "📅",
    hue: "violet",
    weeklyMeaningful: true,   // next-month target/4
    note: "Next month target ÷ 4",
    isPct: false,
  },
};

const HUE = {
  amber:   { band: "linear-gradient(135deg,#b45309,#d97706)",  cell: "#fff7ed", text: "#7c2d12", totalCell: "linear-gradient(135deg,#fed7aa,#fdba74)", totalText: "#7c2d12" },
  teal:    { band: "linear-gradient(135deg,#0f766e,#14b8a6)",  cell: "#f0fdfa", text: "#134e4a", totalCell: "linear-gradient(135deg,#99f6e4,#5eead4)", totalText: "#134e4a" },
  emerald: { band: "linear-gradient(135deg,#065f46,#10b981)",  cell: "#ecfdf5", text: "#064e3b", totalCell: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", totalText: "#064e3b" },
  rose:    { band: "linear-gradient(135deg,#9f1239,#e11d48)",  cell: "#fff1f2", text: "#881337", totalCell: "linear-gradient(135deg,#fecdd3,#fda4af)", totalText: "#881337" },
  red:     { band: "linear-gradient(135deg,#991b1b,#dc2626)",  cell: "#fef2f2", text: "#7f1d1d", totalCell: "linear-gradient(135deg,#fecaca,#fca5a5)", totalText: "#7f1d1d" },
  green:   { band: "linear-gradient(135deg,#166534,#16a34a)",  cell: "#f0fdf4", text: "#14532d", totalCell: "linear-gradient(135deg,#bbf7d0,#86efac)", totalText: "#14532d" },
  violet:  { band: "linear-gradient(135deg,#5b21b6,#7c3aed)",  cell: "#f5f3ff", text: "#4c1d95", totalCell: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", totalText: "#4c1d95" },
};

function AdsGg2Report() {
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
      background: "#fff", customClass: { popup: "adsgg2-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "adsgg2-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-gg2", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the ADS GG2 report.", { ns: "reports" }));
        }
      } finally {
      setIsLoading(false);
    }
  };

  const handlePdf = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-gg2/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch {
      showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" }));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleExcel = async () => {
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-gg2/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `ads_gg2_${year}_${m}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" }));
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);

  const overCap = (filter.grainageIds || []).length > GRAINAGE_CAP;

  // Group rows by metric (sl_no). Preserve backend order via a Map.
  const grouped = useMemo(() => {
    const m = new Map();
    dataRows.forEach((r) => {
      const k = String(r.sl_no);
      if (!m.has(k)) m.set(k, { sl: k, metric: r.metric, rows: [] });
      m.get(k).rows.push(r);
    });
    // Within each metric, sort by `rn` (backend already orders, but be safe)
    m.forEach((g) => g.rows.sort((a, b) => numOrZero(a.rn) - numOrZero(b.rn)));
    return Array.from(m.values());
  }, [dataRows]);

  // KPI summary — compute over CY (current month) data
  const kpis = useMemo(() => {
    const sumTotal = (slNo) => {
      const g = grouped.find((x) => x.sl === String(slNo));
      if (!g) return 0;
      return g.rows.reduce((acc, r) => acc + numOrZero(r.total), 0);
    };
    const grainageCount = grouped.length === 0 ? 0 : (grouped[0]?.rows.length || 0);
    const target  = sumTotal(1);
    const produced = sumTotal(2);
    const diseased = sumTotal(5);
    const diseaseFree = sumTotal(6);
    const next   = sumTotal(7);
    const pct = target === 0 ? 0 : (produced / target) * 100;
    return { grainageCount, target, produced, diseased, diseaseFree, next, pct };
  }, [grouped]);

  return (
    <Layout title={t("ADS · GG-2 — Weekly DFL Production Progress", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ADS · ಬಿತ್ತನೆ ಕೋಠಿಗಳ ವಾರಾವಾರು ಮೊಟ್ಟೆ ಉತ್ಪಾದನಾ ಪ್ರಗತಿ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#fed7aa,#fdba74)",
                color: "#7c2d12", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #fb923c", verticalAlign: "middle",
              }}>ADS · GG-2 · Weekly</span>
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
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📊</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ADS · ಬಿತ್ತನೆ ಕೋಠಿಗಳ ವಾರಾವಾರು ಮೊಟ್ಟೆ ಉತ್ಪಾದನಾ ಪ್ರಗತಿ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>GG-2</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Weekly DFL Production by Grainage — Target · Produced · % Achieved · Disease · Next Month</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {kpis.grainageCount} grainage{kpis.grainageCount === 1 ? "" : "s"}
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#fff7ed)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>
                    {t("Grainages", { ns: "reports" })} <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>{t("(optional · max {{cap}} P1)", { cap: GRAINAGE_CAP, ns: "reports" })}</span>
                  </label>
                  <ReactSelect
                    isMulti
                    options={grainageList.map((g) => ({
                      value: String(g.grainageMasterId),
                      label: g.grainageMasterName,
                    }))}
                    placeholder={t("— Select up to {{cap}} P1 grainages —", { cap: GRAINAGE_CAP, ns: "reports" })}
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
                    noOptionsMessage={() => t("No grainage found", { ns: "reports" })}
                  />
                  {overCap && (
                    <div style={{
                      marginTop: "6px", fontSize: "11px", fontWeight: 700,
                      color: "#9a3412", background: "#fff7ed",
                      border: "1px solid #fdba74", borderRadius: "8px",
                      padding: "6px 10px", display: "inline-flex", alignItems: "center", gap: "6px",
                    }}>
                      ⓘ {t("Backend caps at {{cap}} grainages — only the first {{cap}} will be used.", { cap: GRAINAGE_CAP, ns: "reports" })}
                    </div>
                  )}
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Financial Year")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Year —", { ns: "reports" })}</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">{t("— Month —", { ns: "reports" })}</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#9a3412,#ea580c)", "0 4px 12px rgba(154,52,18,.32)", isLoading)}>
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

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="adsgg2-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#fed7aa,#ffedd5)", border: "1.5px solid #fb923c", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "140px" }}>
                <span style={{ fontSize: "11px", color: "#7c2d12", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Grainages", { ns: "reports" })}</span>
                <span style={{ fontSize: "16px", color: "#7c2d12", fontWeight: 800, marginTop: "2px" }}>{kpis.grainageCount}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Period", { ns: "reports" })}</span>
                <span style={{ fontSize: "13.5px", color: "#78350f", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fed7aa,#fff7ed)", border: "1.5px solid #fdba74", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "160px" }}>
                <span style={{ fontSize: "11px", color: "#9a3412", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಗುರಿ Target</span>
                <span className="adsgg2-num" style={{ fontSize: "15px", color: "#7c2d12", fontWeight: 800, marginTop: "2px" }}>{kpis.target.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#f0fdfa)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "160px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಸಾಧನೆ Produced</span>
                <span className="adsgg2-num" style={{ fontSize: "15px", color: "#134e4a", fontWeight: 800, marginTop: "2px" }}>{kpis.produced.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#a7f3d0,#ecfdf5)", border: "1.5px solid #6ee7b7", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#065f46", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("% Achieved", { ns: "reports" })}</span>
                <span className="adsgg2-num" style={{ fontSize: "16px", color: "#064e3b", fontWeight: 800, marginTop: "2px" }}>{fmt(kpis.pct.toFixed(2))}%</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fecdd3,#fff1f2)", border: "1.5px solid #fda4af", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "160px" }}>
                <span style={{ fontSize: "11px", color: "#9f1239", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಗಂಟು ರೋಗ Diseased</span>
                <span className="adsgg2-num" style={{ fontSize: "15px", color: "#881337", fontWeight: 800, marginTop: "2px" }}>{kpis.diseased.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#f0fdf4)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "160px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ರೋಗ ರಹಿತ Disease-Free</span>
                <span className="adsgg2-num" style={{ fontSize: "15px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{kpis.diseaseFree.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ddd6fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#5b21b6", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಮುಂದಿನ ಕಾರ್ಯಕ್ರಮ</span>
                <span className="adsgg2-num" style={{ fontSize: "15px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{kpis.next.toLocaleString()}</span>
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
                ADS · ಬಿತ್ತನೆ ಕೋಠಿಗಳ ವಾರಾವಾರು ಮೊಟ್ಟೆ ಉತ್ಪಾದನಾ ಪ್ರಗತಿ &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Weekly DFL Production Progress per Grainage &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="adsgg2-scroll" style={{ overflowX: "auto" }}>
                <table className="adsgg2-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1100px" }}>
                  <thead>
                    <tr>
                      <th style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "10px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "55px",
                      }}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.No</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(135deg,#334155,#475569)",
                        color: "#fff", padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "230px",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರಗಳು</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Metric</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(135deg,#475569,#64748b)",
                        color: "#fff", padding: "10px 12px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "180px",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಬಿತ್ತನೆ ಕೋಠಿ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Grainage</div>
                      </th>
                      {[1, 2, 3, 4].map((wk) => (
                        <th key={wk} style={{
                          background: "linear-gradient(180deg,#fb923c,#ea580c)",
                          color: "#fff", padding: "10px 8px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                          minWidth: "105px",
                        }}>
                          <div style={{ fontSize: "12px" }}>{wk}ನೇ ವಾರ</div>
                          <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .9, marginTop: "2px" }}>
                            Week {wk} · {wk === 1 ? "1‑7" : wk === 2 ? "8‑14" : wk === 3 ? "15‑21" : "22‑31"}
                          </div>
                        </th>
                      ))}
                      <th style={{
                        background: "linear-gradient(135deg,#7c2d12,#b91c1c)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "120px",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಒಟ್ಟು</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Total</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                    {grouped.map((g) => {
                      const meta = METRIC_META[g.sl] || { en: "", icon: "·", hue: "amber", weeklyMeaningful: true, isPct: false };
                      const pal = HUE[meta.hue];
                      const span = g.rows.length;
                      return g.rows.map((row, ri) => {
                        const isFirst = ri === 0;
                        const rowBg = ri % 2 === 0 ? "#ffffff" : "#fafaf7";
                        const totalText = String(row.total ?? "").trim();
                        const totalNum = numOrZero(row.total);
                        const totalDisplay = meta.isPct
                          ? `${fmt(totalText || 0)}%`
                          : (totalText === "" ? "—" : fmt(totalText));
                        return (
                          <tr key={`${g.sl}-${ri}`} className="adsgg2-tr" style={{ background: rowBg }}>
                            {isFirst && (
                              <td rowSpan={span} style={{
                                padding: "10px 6px", textAlign: "center",
                                borderBottom: "2px solid " + (pal.text === "#7c2d12" ? "#fed7aa" : "#e2e8f0"),
                                borderRight: "1px solid #e2e8f0",
                                background: pal.band,
                                verticalAlign: "middle",
                              }}>
                                <span style={{
                                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                                  minWidth: "30px", height: "30px", borderRadius: "50%",
                                  background: "rgba(255,255,255,.92)",
                                  color: pal.text, fontWeight: 800, fontSize: "12px",
                                }}>{g.sl}</span>
                              </td>
                            )}
                            {isFirst && (
                              <td rowSpan={span} style={{
                                padding: "10px 14px", textAlign: "left",
                                borderBottom: "2px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                                background: pal.cell,
                                color: pal.text, fontWeight: 800, fontSize: "12.5px",
                                verticalAlign: "middle",
                              }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    width: "30px", height: "30px", borderRadius: "10px",
                                    background: pal.band, color: "#fff", fontSize: "14px",
                                  }}>{meta.icon}</span>
                                  <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                                    <span style={{ fontWeight: 800 }}>{g.metric || "—"}</span>
                                    <span style={{ fontSize: "10.5px", opacity: .8, fontWeight: 600 }}>{meta.en}{meta.note ? ` · ${meta.note}` : ""}</span>
                                  </div>
                                </div>
                              </td>
                            )}
                            <td style={{
                              padding: "9px 12px", textAlign: "left",
                              borderBottom: "1px solid #f1f5f9", borderRight: "2px solid #e2e8f0",
                              color: "#0f172a", fontWeight: 700, fontSize: "12.5px",
                            }}>
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: "8px",
                              }}>
                                <span style={{
                                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                                  width: "22px", height: "22px", borderRadius: "50%",
                                  background: "linear-gradient(135deg,#fed7aa,#fdba74)",
                                  color: "#7c2d12", fontWeight: 800, fontSize: "11px",
                                }}>{row.rn || (ri + 1)}</span>
                                <span>{row.grainage || "—"}</span>
                              </span>
                            </td>
                            {[1, 2, 3, 4].map((wk) => {
                              const v = row[`w${wk}`];
                              const has = String(v ?? "").trim() !== "" && numOrZero(v) !== 0;
                              const meaningful = meta.weeklyMeaningful;
                              return (
                                <td key={wk} className="adsgg2-num" style={{
                                  padding: "9px 6px", textAlign: "center",
                                  borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f1f5f9",
                                  background: !meaningful ? "#fafaf7" : (has ? pal.cell : "transparent"),
                                  color: !meaningful ? "#cbd5e0" : (has ? pal.text : "#cbd5e0"),
                                  fontWeight: has ? 700 : 600,
                                  fontSize: "12.5px",
                                }}>
                                  {!meaningful ? "—" : (has ? (meta.isPct ? `${fmt(v)}%` : fmt(v)) : "0")}
                                </td>
                              );
                            })}
                            <td className="adsgg2-num" style={{
                              padding: "9px 8px", textAlign: "center",
                              borderBottom: "1px solid #f1f5f9",
                              background: pal.totalCell,
                              color: pal.totalText,
                              fontWeight: 800, fontSize: "13px",
                            }}>
                              {totalDisplay}
                              {meta.isPct && totalNum >= 100 && (
                                <span style={{ marginLeft: "4px", fontSize: "11px" }}>🎉</span>
                              )}
                            </td>
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
                  ADS · GG-2 — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {kpis.grainageCount} grainage{kpis.grainageCount === 1 ? "" : "s"} &nbsp;·&nbsp; {grouped.length} metric{grouped.length === 1 ? "" : "s"}
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

export default AdsGg2Report;
