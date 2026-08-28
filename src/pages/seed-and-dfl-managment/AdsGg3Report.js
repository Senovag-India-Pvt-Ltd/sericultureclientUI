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

if (!document.getElementById("adsgg3-styles")) {
  const s = document.createElement("style");
  s.id = "adsgg3-styles";
  s.innerHTML = `
    .adsgg3-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .adsgg3-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .adsgg3-swal .swal2-icon { margin:20px auto 4px !important; }
    .adsgg3-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .adsgg3-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes adsgg3-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .adsgg3-wrap { animation: adsgg3-in .35s ease; }
    .adsgg3-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .adsgg3-table th { letter-spacing:.02em; }
    .adsgg3-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .adsgg3-scroll::-webkit-scrollbar { height:9px; }
    .adsgg3-scroll::-webkit-scrollbar-track { background:#fff7ed; border-radius:6px; }
    .adsgg3-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#ea580c,#15803d); border-radius:6px; }
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

// Indian-style rupee formatting (e.g. ₹ 1,23,45,678.50)
const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
const fmtINR = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "—";
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  if (n === 0) return "₹ 0";
  return `₹ ${inr.format(n)}`;
};
const fmtSigned = (n) => {
  if (n === 0) return "₹ 0";
  return (n < 0 ? "-" : "+") + " ₹ " + inr.format(Math.abs(n));
};

// 6 financial metric groups × (Month, Cumulative) → 12 numeric cells per row
const METRICS = [
  { key: "cost_with_staff", kn: "ಸಿಬ್ಬಂದಿ ಸೇರಿ ವೆಚ್ಚ",  en: "Cost (incl. Staff)", hue: "red"      },
  { key: "cost_no_staff",   kn: "ಸಿಬ್ಬಂದಿ ಹೊರತಾಗಿ ವೆಚ್ಚ", en: "Cost (excl. Staff)", hue: "rose"     },
  { key: "staff_cost",      kn: "ಸಿಬ್ಬಂದಿ ವೆಚ್ಚ",      en: "Staff Cost",         hue: "amber"    },
  { key: "other_cost",      kn: "ಇತರೆ ವೆಚ್ಚ",         en: "Other Cost",         hue: "violet"   },
  { key: "total_cost",      kn: "ಒಟ್ಟು ವೆಚ್ಚ",         en: "Total Cost",         hue: "darkRed"  },
  { key: "income",          kn: "ಆದಾಯ",            en: "Income",             hue: "emerald"  },
];

const HUE_PALETTE = {
  red:     { hdr: "linear-gradient(135deg,#991b1b,#dc2626)", sub: "linear-gradient(135deg,#fecaca,#fca5a5)", subText: "#7f1d1d", cell: "#fef2f2", cellText: "#7f1d1d", cumCell: "#fee2e2", cumText: "#991b1b" },
  rose:    { hdr: "linear-gradient(135deg,#9f1239,#e11d48)", sub: "linear-gradient(135deg,#ffe4e6,#fecdd3)", subText: "#881337", cell: "#fff1f2", cellText: "#881337", cumCell: "#ffe4e6", cumText: "#9f1239" },
  amber:   { hdr: "linear-gradient(135deg,#b45309,#d97706)", sub: "linear-gradient(135deg,#fed7aa,#fdba74)", subText: "#7c2d12", cell: "#fff7ed", cellText: "#7c2d12", cumCell: "#ffedd5", cumText: "#9a3412" },
  violet:  { hdr: "linear-gradient(135deg,#5b21b6,#7c3aed)", sub: "linear-gradient(135deg,#ede9fe,#ddd6fe)", subText: "#4c1d95", cell: "#f5f3ff", cellText: "#4c1d95", cumCell: "#ede9fe", cumText: "#5b21b6" },
  darkRed: { hdr: "linear-gradient(135deg,#7f1d1d,#991b1b)", sub: "linear-gradient(135deg,#fecaca,#f87171)", subText: "#450a0a", cell: "#fef2f2", cellText: "#7f1d1d", cumCell: "#fee2e2", cumText: "#7f1d1d" },
  emerald: { hdr: "linear-gradient(135deg,#065f46,#10b981)", sub: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", subText: "#064e3b", cell: "#ecfdf5", cellText: "#064e3b", cumCell: "#d1fae5", cumText: "#065f46" },
};

function AdsGg3Report() {
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
      background: "#fff", customClass: { popup: "adsgg3-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "adsgg3-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-gg3", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the ADS GG3 report.", { ns: "reports" }));
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-gg3/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-gg3/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `ads_gg3_${year}_${m}.xlsx`;
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
    return order.map((k) => {
      const g = map[k];
      // Sort CY (newer year) first by descending year string
      g.rows.sort((a, b) => String(b.yr).localeCompare(String(a.yr)));
      return g;
    });
  }, [dataRows]);

  // KPIs over CY rows only (latest year per grainage)
  const kpis = useMemo(() => {
    const cyRows = grouped.map((g) => g.rows[0]).filter(Boolean);
    const sum = (k) => cyRows.reduce((a, r) => a + numOrZero(r[k]), 0);
    const totalCostM   = sum("total_cost_m");
    const totalCostMe  = sum("total_cost_me");
    const incomeM      = sum("income_m");
    const incomeMe     = sum("income_me");
    const profitM      = incomeM - totalCostM;
    const profitMe     = incomeMe - totalCostMe;
    const marginM      = incomeM === 0 ? 0 : (profitM / incomeM) * 100;
    return {
      grainages: grouped.length,
      totalCostM, totalCostMe,
      incomeM,    incomeMe,
      profitM,    profitMe,
      marginM,
    };
  }, [grouped]);

  return (
    <Layout title={t("ADS · GG-3 — Production Cost & Income (CY vs PY)", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ADS · ಬಿತ್ತನೆ ಕೋಠಿ ಉತ್ಪಾದನಾ ವೆಚ್ಚ ಮತ್ತು ಆದಾಯ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#fed7aa,#fdba74)",
                color: "#7c2d12", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #fb923c", verticalAlign: "middle",
              }}>ADS · GG-3 · Cost & Income</span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(124,45,18,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#7f1d1d 0%,#ea580c 50%,#15803d 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center",
            gap: "12px",
            position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>💰</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ADS · ಬಿತ್ತನೆ ಕೋಠಿ ಉತ್ಪಾದನಾ ವೆಚ್ಚ ಮತ್ತು ಆದಾಯ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>GG-3</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P1 Grainage Production Cost & Income — Staff · Other · Total · Income (CY vs PY)</div>
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
                    {t("Grainages", { ns: "reports" })} <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>{t("(optional · empty = all P1)", { ns: "reports" })}</span>
                  </label>
                  <ReactSelect
                    isMulti
                    options={grainageList.map((g) => ({
                      value: String(g.grainageMasterId),
                      label: g.grainageMasterName,
                    }))}
                    placeholder={t("— Select one or more —", { ns: "reports" })}
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
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#7f1d1d,#dc2626)", "0 4px 12px rgba(127,29,29,.32)", isLoading)}>
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
          <div className="adsgg3-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#fed7aa,#ffedd5)", border: "1.5px solid #fb923c", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#7c2d12", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Grainages", { ns: "reports" })}</span>
                <span style={{ fontSize: "16px", color: "#7c2d12", fontWeight: 800, marginTop: "2px" }}>{kpis.grainages}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Period", { ns: "reports" })}</span>
                <span style={{ fontSize: "13.5px", color: "#78350f", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fecaca,#fee2e2)", border: "1.5px solid #fca5a5", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#7f1d1d", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಒಟ್ಟು ವೆಚ್ಚ (Month)</span>
                <span className="adsgg3-num" style={{ fontSize: "15px", color: "#7f1d1d", fontWeight: 800, marginTop: "2px" }}>{fmtINR(kpis.totalCostM)}</span>
                <span style={{ fontSize: "10.5px", color: "#991b1b", fontWeight: 600, marginTop: "1px" }}>FY Cum: {fmtINR(kpis.totalCostMe)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಆದಾಯ (Month)</span>
                <span className="adsgg3-num" style={{ fontSize: "15px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{fmtINR(kpis.incomeM)}</span>
                <span style={{ fontSize: "10.5px", color: "#166534", fontWeight: 600, marginTop: "1px" }}>FY Cum: {fmtINR(kpis.incomeMe)}</span>
              </div>
              <div style={{
                background: kpis.profitM >= 0
                  ? "linear-gradient(135deg,#a7f3d0,#ecfdf5)"
                  : "linear-gradient(135deg,#fecdd3,#fff1f2)",
                border: kpis.profitM >= 0 ? "1.5px solid #6ee7b7" : "1.5px solid #fda4af",
                borderRadius: "12px", padding: "10px 18px",
                display: "flex", flexDirection: "column", minWidth: "200px",
              }}>
                <span style={{
                  fontSize: "11px",
                  color: kpis.profitM >= 0 ? "#065f46" : "#9f1239",
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em",
                }}>
                  {kpis.profitM >= 0 ? "ಲಾಭ Profit (Month)" : "ನಷ್ಟ Loss (Month)"}
                </span>
                <span className="adsgg3-num" style={{
                  fontSize: "15px",
                  color: kpis.profitM >= 0 ? "#064e3b" : "#881337",
                  fontWeight: 800, marginTop: "2px",
                }}>{fmtSigned(kpis.profitM)}</span>
                <span style={{
                  fontSize: "10.5px",
                  color: kpis.profitMe >= 0 ? "#166534" : "#9f1239",
                  fontWeight: 600, marginTop: "1px",
                }}>FY Cum: {fmtSigned(kpis.profitMe)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0e7ff,#eef2ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Margin (Month)", { ns: "reports" })}</span>
                <span className="adsgg3-num" style={{ fontSize: "16px", color: "#312e81", fontWeight: 800, marginTop: "2px" }}>{kpis.marginM.toFixed(2)}%</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(154,52,18,.12)", overflow: "hidden" }}>
              {/* Title strip */}
              <div style={{
                background: "linear-gradient(135deg,#7f1d1d,#b45309 50%,#15803d)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ADS · ಬಿತ್ತನೆ ಕೋಠಿ ಉತ್ಪಾದನಾ ವೆಚ್ಚ ಮತ್ತು ಆದಾಯ &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  P1 Grainage Production Cost & Income &nbsp;·&nbsp; Current Year vs Previous Year &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="adsgg3-scroll" style={{ overflowX: "auto" }}>
                <table className="adsgg3-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1700px" }}>
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
                            <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .9, marginTop: "2px" }}>{m.en} <span style={{ opacity: .85 }}>(₹)</span></div>
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
                            minWidth: "115px",
                          }}>
                            <div style={{ fontSize: "10.5px" }}>ಮಾಸ</div>
                            <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>Month</div>
                          </th>,
                          <th key={`${m.key}-me`} style={{
                            background: pal.sub, color: pal.subText,
                            padding: "8px 6px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: "120px",
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
                        const isCY = isFirst;
                        const yearTone = isCY
                          ? "linear-gradient(135deg,#fed7aa,#fdba74)"
                          : "linear-gradient(135deg,#e2e8f0,#cbd5e1)";
                        const yearText = isCY ? "#7c2d12" : "#334155";
                        const yearLabelKn = isCY ? "ಪ್ರಸಕ್ತ" : "ಹಿಂದಿನ";
                        const yearLabelEn = isCY ? "Current" : "Previous";
                        return (
                          <tr key={`${group.sl_no}-${ri}`} className="adsgg3-tr" style={{ background: groupBg }}>
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
                              const monthHas = String(vMonth ?? "").trim() !== "" && numOrZero(vMonth) !== 0;
                              const cumHas   = String(vCum   ?? "").trim() !== "" && numOrZero(vCum)   !== 0;
                              return ([
                                <td key={`${m.key}-m`} className="adsgg3-num" style={{
                                  padding: "9px 8px", textAlign: "right",
                                  borderBottom: ri === group.rows.length - 1 ? "2px solid #fed7aa" : "1px solid #f1f5f9",
                                  borderRight: "1px solid #f1f5f9",
                                  background: monthHas ? pal.cell : "transparent",
                                  color: monthHas ? pal.cellText : "#cbd5e0",
                                  fontWeight: monthHas ? 700 : 600,
                                  fontSize: "12px",
                                }}>
                                  {monthHas ? fmtINR(vMonth) : "—"}
                                </td>,
                                <td key={`${m.key}-me`} className="adsgg3-num" style={{
                                  padding: "9px 8px", textAlign: "right",
                                  borderBottom: ri === group.rows.length - 1 ? "2px solid #fed7aa" : "1px solid #f1f5f9",
                                  borderRight: "2px solid #e2e8f0",
                                  background: cumHas ? pal.cumCell : "transparent",
                                  color: cumHas ? pal.cumText : "#cbd5e0",
                                  fontWeight: 800,
                                  fontSize: "12px",
                                }}>
                                  {cumHas ? fmtINR(vCum) : "—"}
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
                  ADS · GG-3 — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {kpis.grainages} grainage{kpis.grainages === 1 ? "" : "s"}
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

export default AdsGg3Report;
