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

// Sericulture week convention (per backend SQL):
//   W1 : day-8..day-1 from month start (8 days, prev-month overlap, 24 → end)
//   W2 : 1..7
//   W3 : 8..15
//   W4 : 16..23
const WEEKS = [
  { value: 1, label: "Week 1", kn: "1ನೇ ವಾರ", hint: "24 → end of prev. month" },
  { value: 2, label: "Week 2", kn: "2ನೇ ವಾರ", hint: "1 → 7" },
  { value: 3, label: "Week 3", kn: "3ನೇ ವಾರ", hint: "8 → 15" },
  { value: 4, label: "Week 4", kn: "4ನೇ ವಾರ", hint: "16 → 23" },
];

if (!document.getElementById("ddswk-styles")) {
  const s = document.createElement("style");
  s.id = "ddswk-styles";
  s.innerHTML = `
    .ddswk-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .ddswk-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .ddswk-swal .swal2-icon { margin:20px auto 4px !important; }
    .ddswk-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .ddswk-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes ddswk-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .ddswk-wrap { animation: ddswk-in .35s ease; }
    .ddswk-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .ddswk-table th { letter-spacing:.02em; }
    .ddswk-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .ddswk-scroll::-webkit-scrollbar { height:9px; }
    .ddswk-scroll::-webkit-scrollbar-track { background:#eff6ff; border-radius:6px; }
    .ddswk-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#1e3a8a,#0e7490); border-radius:6px; }
    .ddswk-week-pill { transition: transform .12s ease, box-shadow .12s ease; }
    .ddswk-week-pill:hover { transform: translateY(-1px); }
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
    border: state.isFocused ? "1.5px solid #1e3a8a" : "1.5px solid #d0d9e8",
    background: "#f7f9ff",
    minHeight: "38px",
    fontSize: "12.5px",
    color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(30,58,138,.18)" : "none",
    "&:hover": { border: "1.5px solid #1e3a8a" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "12.5px" }),
  multiValue: (base) => ({ ...base, background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", borderRadius: "10px", border: "1px solid #93c5fd" }),
  multiValueLabel: (base) => ({ ...base, color: "#1e3a8a", fontWeight: 700, fontSize: "11.5px", padding: "2px 6px" }),
  multiValueRemove: (base) => ({ ...base, color: "#1e40af", ":hover": { background: "#93c5fd", color: "#1e3a8a" } }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#1e40af" }),
  clearIndicator: (base) => ({ ...base, padding: "4px 6px", color: "#1e40af" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(30,58,138,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base, fontSize: "12.5px", padding: "8px 12px",
    background: state.isSelected ? "linear-gradient(135deg,#1e3a8a,#3b82f6)" : state.isFocused ? "#eff6ff" : "#fff",
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

// Tier badge palette
const TIER_STYLE = (tier) => {
  const t = String(tier || "").trim();
  if (t === "ಪಿ1" || t.toUpperCase() === "P1") {
    return { bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1e3a8a", icon: "①", label: t || "ಪಿ1", isTotal: false };
  }
  if (t === "ಪಿ2" || t.toUpperCase() === "P2") {
    return { bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", color: "#5b21b6", icon: "②", label: t || "ಪಿ2", isTotal: false };
  }
  if (t === "ಒಟ್ಟು" || t.toLowerCase() === "total") {
    return { bg: "linear-gradient(135deg,#fde68a,#fcd34d)", color: "#78350f", icon: "Σ", label: t || "ಒಟ್ಟು", isTotal: true };
  }
  return { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#334155", icon: "·", label: t || "—", isTotal: false };
};

function DdsWeeklyChawkiReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ tscIds: [], financialYearMasterId: "", month: "", week: "" });
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
    if (!filter.financialYearMasterId) return "Please select a Financial Year.";
    if (!filter.month)                 return "Please select a Month.";
    if (!filter.week)                  return "Please select a Week.";
    if (!fyStartYear)                  return "Could not determine the financial year start year.";
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: "Required Fields",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">Missing Selection</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Got it", confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "ddswk-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "ddswk-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    const ids = (filter.tscIds || []).map((o) => o.value).filter(Boolean).join(",");
    const p = { year, month: m, week: Number(filter.week) };
    if (ids) p.tscIds = ids;
    return p;
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/dds-weekly-chawki", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the DDS Weekly Chawki report.");
        }
      } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/dds-weekly-chawki/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/dds-weekly-chawki/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `dds_weekly_chawki_${year}_${m}_w${filter.week}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); }
    finally { setIsDownloadingExcel(false); }
  };

  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const weekKn     = WEEKS.find((w) => String(w.value) === String(filter.week))?.kn || "";

  // Group by sl_no/tsc_name (3 rows per TSC: P1, P2, Total)
  const grouped = useMemo(() => {
    const map = {};
    const order = [];
    dataRows.forEach((r) => {
      const k = String(r.sl_no) + "::" + String(r.tsc_name);
      if (!map[k]) {
        map[k] = { sl_no: r.sl_no, tsc_name: r.tsc_name, rows: [] };
        order.push(k);
      }
      map[k].rows.push(r);
    });
    // Within each group sort by tier order: P1, P2, Total
    const tierRank = { "ಪಿ1": 0, "ಪಿ2": 1, "ಒಟ್ಟು": 2 };
    return order.map((k) => {
      const g = map[k];
      g.rows.sort((a, b) => (tierRank[String(a.tier).trim()] ?? 99) - (tierRank[String(b.tier).trim()] ?? 99));
      return g;
    });
  }, [dataRows]);

  // KPIs from per-TSC tier rows — EXCLUDE the backend grand-total row
  // (tsc_name === "ಒಟ್ಟು"), otherwise every figure is double-counted.
  const kpis = useMemo(() => {
    const isGrand   = (r) => String(r.tsc_name).trim() === "ಒಟ್ಟು";
    const totalRows = dataRows.filter((r) => String(r.tier).trim() === "ಒಟ್ಟು" && !isGrand(r));
    const p1Rows    = dataRows.filter((r) => String(r.tier).trim() === "ಪಿ1"   && !isGrand(r));
    const p2Rows    = dataRows.filter((r) => String(r.tier).trim() === "ಪಿ2"   && !isGrand(r));
    const sum = (rows, k) => rows.reduce((a, r) => a + numOrZero(r[k]), 0);
    return {
      tscs:         grouped.filter((g) => String(g.tsc_name).trim() !== "ಒಟ್ಟು").length,
      goalW:        sum(totalRows, "goal_w"),
      goalM:        sum(totalRows, "goal_m"),
      totalDfl:     sum(totalRows, "total_dfl"),
      totalCrop:    sum(totalRows, "total_crop"),
      p1Dfl:        sum(p1Rows,    "total_dfl"),
      p2Dfl:        sum(p2Rows,    "total_dfl"),
    };
  }, [dataRows, grouped]);

  const achPct = kpis.goalW === 0 ? 0 : (kpis.totalDfl / kpis.goalW) * 100;

  return (
    <Layout title={t("DDS · Weekly Chawki Report")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("DDS · ವಾರಗಳ ಚಾಕಿ ವರದಿ")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
            color: "#1e3a8a", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #93c5fd", verticalAlign: "middle",
          }}>DDS · TSC × Tier × 8 Days</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(30,58,138,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#1e3a8a 0%,#1e40af 50%,#0e7490 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📅</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                DDS · ವಾರಗಳ ಚಾಕಿ ವರದಿ — ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರಗಳ ದಿನವಹಿ DFL ಮತ್ತು ಬೆಳೆ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>DDS</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Deputy Director (Sericulture) — Daily DFL & Crop totals split by Tier (P1 · P2 · Total) over 8 days of the selected week</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
                {weekKn && <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{weekKn}</span>}
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{kpis.tscs} TSC{kpis.tscs === 1 ? "" : "s"}</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#eff6ff)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>TSCs <span style={{ color: "#94a3b8", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>(optional · empty = all TSCs)</span></label>
                  <ReactSelect
                    isMulti
                    options={tscList.map((tsc) => ({ value: String(tsc.tscMasterId), label: tsc.name }))}
                    placeholder="— Select one or more —"
                    isSearchable isClearable closeMenuOnSelect={false}
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={tscSelectStyles}
                    value={filter.tscIds}
                    onChange={(opts) => { setFilter((p) => ({ ...p, tscIds: opts || [] })); setHasReport(false); setDataRows([]); }}
                    noOptionsMessage={() => "No TSC found"}
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
                  <label style={lbl}>Week <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="week" value={filter.week} onChange={handleChange} style={sel}>
                    <option value="">— Week —</option>
                    {WEEKS.map((w) => (<option key={w.value} value={w.value}>{w.label} ({w.hint})</option>))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#1e3a8a,#1e40af)", "0 4px 12px rgba(30,58,138,.32)", isLoading)}>
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

              {/* Week quick-pick chips */}
              <div className="d-flex flex-wrap gap-2 mt-3">
                {WEEKS.map((w) => {
                  const active = String(filter.week) === String(w.value);
                  return (
                    <button
                      key={w.value}
                      type="button"
                      className="ddswk-week-pill"
                      onClick={() => {
                        setFilter((p) => ({ ...p, week: String(w.value) }));
                        setHasReport(false); setDataRows([]);
                      }}
                      style={{
                        border: active ? "1.5px solid #1e40af" : "1.5px solid #d0d9e8",
                        background: active
                          ? "linear-gradient(135deg,#1e3a8a,#1e40af)"
                          : "linear-gradient(135deg,#ffffff,#f1f5f9)",
                        color: active ? "#fff" : "#1e293b",
                        borderRadius: "999px",
                        padding: "6px 14px",
                        fontWeight: 700, fontSize: "12px",
                        boxShadow: active ? "0 4px 12px rgba(30,58,138,.28)" : "none",
                        cursor: "pointer",
                        display: "inline-flex", alignItems: "center", gap: "8px",
                      }}
                    >
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: "20px", height: "20px", borderRadius: "50%",
                        background: active ? "rgba(255,255,255,.22)" : "linear-gradient(135deg,#1e3a8a,#1e40af)",
                        color: "#fff", fontSize: "11px", fontWeight: 800,
                      }}>{w.value}</span>
                      <span>{w.kn} · {w.label}</span>
                      <span style={{ fontSize: "10.5px", opacity: .75, fontWeight: 600 }}>{w.hint}</span>
                    </button>
                  );
                })}
              </div>
            </Form>
          </Card.Body>
        </Card>

        {hasReport && (
          <div className="ddswk-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpi("#dbeafe", "#93c5fd", "#1e40af")}>
                <span style={kpiLbl("#1e40af")}>TSCs</span>
                <span style={kpiVal("#1e3a8a", 16)}>{kpis.tscs}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>Period</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear} · W{filter.week}</span>
              </div>
              <div style={kpi("#dbeafe", "#93c5fd", "#1e40af")}>
                <span style={kpiLbl("#1e40af")}>① P1 ಒಟ್ಟು DFL</span>
                <span className="ddswk-num" style={kpiVal("#1e3a8a", 16)}>{kpis.p1Dfl.toLocaleString()}</span>
              </div>
              <div style={kpi("#ede9fe", "#c4b5fd", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>② P2 ಒಟ್ಟು DFL</span>
                <span className="ddswk-num" style={kpiVal("#4c1d95", 16)}>{kpis.p2Dfl.toLocaleString()}</span>
              </div>
              <div style={kpi("#fde68a", "#fcd34d", "#78350f")}>
                <span style={kpiLbl("#78350f")}>Σ ಒಟ್ಟು DFL (Total)</span>
                <span className="ddswk-num" style={kpiVal("#78350f", 18)}>{kpis.totalDfl.toLocaleString()}</span>
              </div>
              <div style={kpi("#cffafe", "#67e8f9", "#155e75")}>
                <span style={kpiLbl("#155e75")}>ಒಟ್ಟು ಬೆಳೆಗಳು (Lots)</span>
                <span className="ddswk-num" style={kpiVal("#0c4a6e", 16)}>{kpis.totalCrop.toLocaleString()}</span>
              </div>
              <div style={kpi("#dcfce7", "#86efac", "#166534")}>
                <span style={kpiLbl("#166534")}>ಶೇ. ಸಾಧನೆ Achievement</span>
                <span className="ddswk-num" style={kpiVal("#14532d", 16)}>{achPct.toFixed(2)}%</span>
                <span style={{ fontSize: "10.5px", color: "#166534", fontWeight: 600, marginTop: "1px" }}>vs Goal {kpis.goalW.toLocaleString()}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(30,58,138,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#172554,#1e40af 50%,#0e7490)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                DDS · ವಾರ ಚಾಕಿ ವರದಿ &nbsp;·&nbsp; {monthKn} {monthYear || ""} · {weekKn}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Deputy Director (Sericulture) — Weekly Chawki by TSC × Tier · Daily DFL + Crop &nbsp;·&nbsp; Week {filter.week}
                </div>
              </div>

              <div className="ddswk-scroll" style={{ overflowX: "auto" }}>
                <table className="ddswk-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1900px" }}>
                  <thead>
                    {/* Row 1: top-level grouping */}
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#334155,#475569)", "190px", true, "left")}>
                        <div style={{ fontSize: "12px" }}>ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ</div><div style={hdrEn}>TSC</div>
                      </th>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#475569,#64748b)", "85px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ತಿಯರ್</div><div style={hdrEn}>Tier</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#b45309,#d97706)")}>
                        <div style={{ fontSize: "11.5px" }}>🎯 ಗುರಿ</div>
                        <div style={hdrEn}>Goal</div>
                      </th>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
                        <th key={d} colSpan={2} style={hdr("linear-gradient(135deg,#1e40af,#3b82f6)")}>
                          <div style={{ fontSize: "11.5px" }}>{`ದಿನ ${d}`}</div>
                          <div style={hdrEn}>{`Day ${d}`}</div>
                        </th>
                      ))}
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#7f1d1d,#9f1239)")}>
                        <div style={{ fontSize: "11.5px" }}>Σ ಒಟ್ಟು</div>
                        <div style={hdrEn}>Total</div>
                      </th>
                    </tr>
                    {/* Row 2: leaves under each group */}
                    <tr>
                      {/* Goal: W, M */}
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12", "70px")}>
                        <div style={{ fontSize: "10px" }}>ವಾರ</div><div style={subhdrEn}>Week</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12", "70px")}>
                        <div style={{ fontSize: "10px" }}>ಮಾಸ</div><div style={subhdrEn}>Month</div>
                      </th>
                      {/* 8 day pairs: DFL, Crop */}
                      {[1, 2, 3, 4, 5, 6, 7, 8].flatMap((d) => ([
                        <th key={`d${d}-dfl`} style={subhdr("linear-gradient(135deg,#bfdbfe,#93c5fd)", "#1e3a8a", "60px")}>
                          <div style={{ fontSize: "10px" }}>ಮೊಟ್ಟೆ</div><div style={subhdrEn}>DFL</div>
                        </th>,
                        <th key={`d${d}-crop`} style={subhdr("linear-gradient(135deg,#a5f3fc,#67e8f9)", "#155e75", "55px")}>
                          <div style={{ fontSize: "10px" }}>ಬೆಳೆ</div><div style={subhdrEn}>Crop</div>
                        </th>,
                      ]))}
                      {/* Total: DFL, Crop */}
                      <th style={subhdr("linear-gradient(135deg,#fecdd3,#fda4af)", "#7f1d1d", "85px")}>
                        <div style={{ fontSize: "10px" }}>ಮೊಟ್ಟೆ</div><div style={subhdrEn}>DFL</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fecdd3,#fda4af)", "#7f1d1d", "75px")}>
                        <div style={{ fontSize: "10px" }}>ಬೆಳೆ</div><div style={subhdrEn}>Crop</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.length === 0 && (
                      <tr><td colSpan={23} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.</td></tr>
                    )}
                    {grouped.map((group, gi) => {
                      const groupBg = gi % 2 === 0 ? "#ffffff" : "#f7f9ff";
                      return group.rows.map((row, ri) => {
                        const isFirst = ri === 0;
                        const tierMeta = TIER_STYLE(row.tier);
                        const isTotal = tierMeta.isTotal;
                        const rowBg = isTotal
                          ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                          : groupBg;
                        return (
                          <tr key={`${group.sl_no}-${ri}`} className="ddswk-tr" style={{ background: rowBg }}>
                            {isFirst && (
                              <td rowSpan={group.rows.length} style={{
                                padding: "10px 6px", textAlign: "center",
                                borderBottom: "2px solid #c7d2fe", borderRight: "1px solid #e2e8f0",
                                background: "linear-gradient(135deg,#1e293b,#334155)",
                                verticalAlign: "middle",
                              }}>
                                <span style={{
                                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                                  minWidth: "30px", height: "30px", borderRadius: "50%",
                                  background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
                                  color: "#1e3a8a", fontWeight: 800, fontSize: "12px",
                                }}>{group.sl_no}</span>
                              </td>
                            )}
                            {isFirst && (
                              <td rowSpan={group.rows.length} style={{
                                padding: "10px 14px", textAlign: "left",
                                borderBottom: "2px solid #c7d2fe", borderRight: "1px solid #e2e8f0",
                                background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                                color: "#1e3a8a", fontWeight: 800, fontSize: "12.5px",
                                verticalAlign: "middle",
                              }}>
                                {group.tsc_name || "—"}
                              </td>
                            )}
                            <td style={{
                              padding: "8px 4px", textAlign: "center",
                              borderBottom: ri === group.rows.length - 1 ? "2px solid #c7d2fe" : "1px solid #f1f5f9",
                              borderRight: "2px solid #e2e8f0",
                            }}>
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: "5px",
                                padding: "3px 9px", borderRadius: "999px",
                                background: tierMeta.bg, color: tierMeta.color,
                                fontWeight: 800, fontSize: "10.5px",
                              }}>
                                <span style={{ fontSize: "11.5px", lineHeight: 1 }}>{tierMeta.icon}</span>
                                {tierMeta.label}
                              </span>
                            </td>
                            <td className="ddswk-num" style={td(isTotal ? "#78350f" : "#7c2d12", 700, isTotal ? "transparent" : "#fff7ed")}>
                              {fmt(row.goal_w)}
                            </td>
                            <td className="ddswk-num" style={td(isTotal ? "#78350f" : "#7c2d12", 700, isTotal ? "transparent" : "#ffedd5")}>
                              {fmt(row.goal_m)}
                            </td>
                            {[1, 2, 3, 4, 5, 6, 7, 8].flatMap((d) => {
                              const dflVal = row[`d${d}_dfl`];
                              const cropVal = row[`d${d}_crop`];
                              const dflHas = numOrZero(dflVal) !== 0;
                              const cropHas = numOrZero(cropVal) !== 0;
                              return ([
                                <td key={`d${d}-dfl`} className="ddswk-num" style={td(
                                  isTotal ? "#78350f" : (dflHas ? "#1e3a8a" : "#cbd5e0"),
                                  isTotal ? 800 : (dflHas ? 700 : 600),
                                  isTotal ? "transparent" : (dflHas ? "#eff6ff" : "transparent"),
                                  "1px solid #f1f5f9",
                                )}>
                                  {dflHas ? fmt(dflVal) : "0"}
                                </td>,
                                <td key={`d${d}-crop`} className="ddswk-num" style={td(
                                  isTotal ? "#78350f" : (cropHas ? "#155e75" : "#cbd5e0"),
                                  isTotal ? 800 : (cropHas ? 700 : 600),
                                  isTotal ? "transparent" : (cropHas ? "#ecfeff" : "transparent"),
                                  d === 8 ? "2px solid #e2e8f0" : "1px solid #f1f5f9",
                                )}>
                                  {cropHas ? fmt(cropVal) : "0"}
                                </td>,
                              ]);
                            })}
                            <td className="ddswk-num" style={td(
                              isTotal ? "#78350f" : "#7f1d1d", 800,
                              isTotal ? "linear-gradient(135deg,#fcd34d,#fbbf24)" : "linear-gradient(135deg,#fff1f2,#ffe4e6)",
                              "1px solid #f1f5f9",
                            )}>
                              {fmt(row.total_dfl)}
                            </td>
                            <td className="ddswk-num" style={td(
                              isTotal ? "#78350f" : "#9f1239", 800,
                              isTotal ? "linear-gradient(135deg,#fbbf24,#f59e0b)" : "linear-gradient(135deg,#ffe4e6,#fecdd3)",
                            )}>
                              {fmt(row.total_crop)}
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#eff6ff,#ecfeff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #93c5fd" }}>
                <span style={{ fontSize: "12px", color: "#1e3a8a", fontWeight: 600 }}>
                  DDS · Weekly Chawki — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {weekKn} &nbsp;·&nbsp; {kpis.tscs} TSC{kpis.tscs === 1 ? "" : "s"} &nbsp;·&nbsp; Σ {kpis.totalDfl.toLocaleString()} DFLs
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
  padding: "9px 6px",
  textAlign: align || "center",
  border: "1px solid rgba(255,255,255,.18)",
  fontWeight: 800,
  minWidth: minW || "100px",
  verticalAlign: single ? "middle" : "top",
});
const subhdr = (bg, color, minW) => ({
  background: bg, color,
  padding: "6px 4px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
  minWidth: minW || "60px",
});
const td = (color, weight, bg, borderRight) => ({
  padding: "9px 6px", textAlign: "center",
  borderBottom: "1px solid #f1f5f9",
  borderRight: borderRight || "1px solid #f8fafc",
  background: bg || "transparent",
  color: color || "#0f172a",
  fontWeight: weight || 600,
  fontSize: "11.5px",
});

export default DdsWeeklyChawkiReport;
