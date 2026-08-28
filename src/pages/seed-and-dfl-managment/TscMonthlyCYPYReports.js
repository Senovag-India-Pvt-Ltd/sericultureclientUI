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

if (!document.getElementById("tsccypy-styles")) {
  const s = document.createElement("style");
  s.id = "tsccypy-styles";
  s.innerHTML = `
    .tsccypy-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tsccypy-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tsccypy-swal .swal2-icon { margin:20px auto 4px !important; }
    .tsccypy-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tsccypy-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tsccypy-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tsccypy-wrap { animation: tsccypy-in .35s ease; }
    .tsccypy-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tsccypy-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tsccypy-scroll::-webkit-scrollbar { height:9px; }
    .tsccypy-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tsccypy-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
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

const reactSelectStyles = {
  control: (base, state) => ({
    ...base, borderRadius: "8px",
    border: state.isFocused ? "1.5px solid #14b8a6" : "1.5px solid #d0d9e8",
    background: "#f8fafd", minHeight: "38px", fontSize: "13px", color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(20,184,166,.15)" : "none",
    "&:hover": { border: "1.5px solid #14b8a6" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (base) => ({ ...base, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#64748b" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(13,78,72,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base, fontSize: "13px", padding: "8px 12px",
    background: state.isSelected
      ? "linear-gradient(135deg,#0f766e,#14b8a6)"
      : state.isFocused ? "#ecfdf5" : "#fff",
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
  if (n === 0) return "0.00";
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtPct = (v) => {
  const n = numOrZero(v);
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
};

const yearOptions = (() => {
  const cur = new Date().getFullYear();
  const arr = [];
  for (let y = cur + 1; y >= cur - 5; y--) arr.push({ value: y, label: String(y) });
  return arr;
})();

/**
 * Reusable CY/PY 16-column TSC monthly report (Form 28 / Form 32 family).
 * Renders for: Pure Brushing (5a), Cross Brushing (5b), Pure Cocoon Production (5d).
 *
 * config:
 *   pageTitleEn, pageTitleKn, sheetBadge, formNo, icon, gradient,
 *   headerBlurbEn, headerBlurbKn, downloadFilenamePrefix,
 *   endpoint        (e.g. "grainage-progress-report/tsc-monthly/pure-brushing"),
 *   metricUnit      (e.g. "DFLs" or "kg"),
 *   metricLabelEn   (e.g. "DFLs Brushed", "Cocoon Supplied (kg)").
 */
function TscMonthlyCYPYReport({ config }) {
  const { t } = useTranslation();

  const today = new Date();
  const [filter, setFilter] = useState({
    districtId: "",
    talukId: "",
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const [districtList, setDistrictList] = useState([]);
  const [talukList,    setTalukList]    = useState([]);

  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "district/get-all")
      .then((r) => setDistrictList(r.data.content.district || []))
      .catch(() => setDistrictList([]));
  }, []);

  useEffect(() => {
    if (!filter.districtId) { setTalukList([]); return; }
    api.get(baseURL + `taluk/get-by-district-id/${filter.districtId}`)
      .then((r) => setTalukList(r.data.content.taluk || []))
      .catch(() => setTalukList([]));
  }, [filter.districtId]);

  // Reset table when filter changes (so stale data isn't shown for a new filter)
  useEffect(() => { setHasReport(false); setDataRows([]); /* eslint-disable-next-line */ }, [config.endpoint]);

  const reset = () => { setHasReport(false); setDataRows([]); };

  const validate = () => {
    if (!filter.districtId) return t("Please select a District.", { ns: "reports" });
    if (!filter.talukId)    return t("Please select a Taluk.", { ns: "reports" });
    if (!filter.year)       return t("Please select a Year.", { ns: "reports" });
    if (!filter.month)      return t("Please select a Month.", { ns: "reports" });
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: t("Required Fields", { ns: "reports" }),
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">${t("Missing Selection", { ns: "reports" })}</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "tsccypy-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "tsccypy-swal" },
    });

  const params = () => ({
    talukId: filter.talukId,
    year:    Number(filter.year),
    month:   Number(filter.month),
  });

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + config.endpoint, { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the {{title}} report.", { ns: "reports", title: config.pageTitleEn }));
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
      const res = await api.get(baseURLSeedDFL + config.endpoint + "/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + config.endpoint + "/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${config.downloadFilenamePrefix}_${filter.talukId}_${filter.year}_${filter.month}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" }));
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const districtName = districtList.find((d) => String(d.districtId) === String(filter.districtId))?.districtName || "—";
  const talukName    = talukList.find((tk) => String(tk.talukId) === String(filter.talukId))?.talukName || "—";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn      = MONTH_KN[Number(filter.month)] || "";

  const fyLabel = (() => {
    const m = Number(filter.month), yr = Number(filter.year);
    return m >= 4 ? `${yr}-${String(yr + 1).slice(-2)}` : `${yr - 1}-${String(yr).slice(-2)}`;
  })();
  const pyFyLabel = (() => {
    const m = Number(filter.month), yr = Number(filter.year);
    return m >= 4 ? `${yr - 1}-${String(yr).slice(-2)}` : `${yr - 2}-${String(yr - 1).slice(-2)}`;
  })();

  const kpis = useMemo(() => {
    let cyAnnual = 0, cyTgtMo = 0, cyTgtMe = 0, cyAchMo = 0, cyAchMe = 0;
    let pyAnnual = 0,                pyTgtMe = 0,             pyAchMe = 0;
    // Exclude the API grand-total row (tsc_name === "ಒಟ್ಟು") to avoid double-counting.
    dataRows.filter((r) => String(r.tsc_name || "").trim() !== "ಒಟ್ಟು" && String(r.race || "").trim() !== "ಒಟ್ಟು").forEach((r) => {
      cyAnnual += numOrZero(r.cy_annual);
      cyTgtMo  += numOrZero(r.cy_target_mo);
      cyTgtMe  += numOrZero(r.cy_target_me);
      cyAchMo  += numOrZero(r.cy_ach_mo);
      cyAchMe  += numOrZero(r.cy_ach_me);
      pyAnnual += numOrZero(r.py_annual);
      pyTgtMe  += numOrZero(r.py_target_me);
      pyAchMe  += numOrZero(r.py_ach_me);
    });
    const cyPctMo = cyTgtMo > 0 ? (cyAchMo * 100) / cyTgtMo : 0;
    const cyPctMe = cyTgtMe > 0 ? (cyAchMe * 100) / cyTgtMe : 0;
    const pyPctMe = pyTgtMe > 0 ? (pyAchMe * 100) / pyTgtMe : 0;
    const yoy     = pyAchMe > 0 ? ((cyAchMe - pyAchMe) * 100) / pyAchMe : 0;
    return { cyAnnual, cyTgtMo, cyTgtMe, cyAchMo, cyAchMe, pyAnnual, pyTgtMe, pyAchMe, cyPctMo, cyPctMe, pyPctMe, yoy };
  }, [dataRows]);

  // 14 numeric column descriptors (col 0=Sl, 1=TSC handled separately)
  const NUM_COLS = [
    { key: "cy_annual",    palette: "blueDeep", isTotal: true,  pct: false },
    { key: "cy_target_mo", palette: "blue",     isTotal: false, pct: false },
    { key: "cy_target_me", palette: "blue",     isTotal: true,  pct: false },
    { key: "cy_ach_mo",    palette: "teal",     isTotal: false, pct: false, separator: false },
    { key: "cy_ach_me",    palette: "teal",     isTotal: true,  pct: false },
    { key: "cy_pct_mo",    palette: "yellow",   isTotal: false, pct: true  },
    { key: "cy_pct_me",    palette: "yellow",   isTotal: true,  pct: true,  separator: true },
    { key: "py_annual",    palette: "indigoDeep", isTotal: true,pct: false },
    { key: "py_target_mo", palette: "indigo",   isTotal: false, pct: false },
    { key: "py_target_me", palette: "indigo",   isTotal: true,  pct: false },
    { key: "py_ach_mo",    palette: "purple",   isTotal: false, pct: false },
    { key: "py_ach_me",    palette: "purple",   isTotal: true,  pct: false },
    { key: "py_pct_mo",    palette: "amber",    isTotal: false, pct: true  },
    { key: "py_pct_me",    palette: "amber",    isTotal: true,  pct: true  },
  ];

  const PALETTES = {
    blueDeep:  { bg: "#dbeafe", totalBg: "linear-gradient(135deg,#bfdbfe,#93c5fd)", text: "#1e3a8a" },
    blue:      { bg: "#eff6ff", totalBg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", text: "#1e40af" },
    teal:      { bg: "#f0fdfa", totalBg: "linear-gradient(135deg,#ccfbf1,#99f6e4)", text: "#115e59" },
    yellow:    { bg: "#fef9c3", totalBg: "linear-gradient(135deg,#fef3c7,#fde68a)", text: "#854d0e" },
    indigoDeep:{ bg: "#e0e7ff", totalBg: "linear-gradient(135deg,#c7d2fe,#a5b4fc)", text: "#3730a3" },
    indigo:    { bg: "#eef2ff", totalBg: "linear-gradient(135deg,#e0e7ff,#c7d2fe)", text: "#4338ca" },
    purple:    { bg: "#f5f3ff", totalBg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", text: "#5b21b6" },
    amber:     { bg: "#fffbeb", totalBg: "linear-gradient(135deg,#fef3c7,#fde68a)", text: "#78350f" },
  };

  return (
    <Layout title={t(config.pageTitleEn, { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t(config.pageTitleKn)}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
                color: "#14532d", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #86efac", verticalAlign: "middle",
              }}>{config.sheetBadge}</span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{
            background: config.gradient || "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#5b57ac 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>{config.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                {config.headerBlurbKn} — {config.headerBlurbEn}
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>{config.formNo}</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>
                CY {fyLabel} vs PY {pyFyLabel} · Annual / Mo / ME Target · Mo / ME Achievement · % · {config.metricLabelEn}
              </div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {filter.year}
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>{t("District")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={districtList.map((d) => ({ value: String(d.districtId), label: d.districtName }))}
                    placeholder={t("— Search District —", { ns: "reports" })}
                    isSearchable isClearable menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed" styles={reactSelectStyles}
                    value={
                      districtList
                        .map((d) => ({ value: String(d.districtId), label: d.districtName }))
                        .find((o) => o.value === String(filter.districtId)) || null
                    }
                    onChange={(opt) => { setFilter((p) => ({ ...p, districtId: opt?.value || "", talukId: "" })); reset(); }}
                    noOptionsMessage={() => t("No districts", { ns: "reports" })}
                  />
                </Col>
                <Col md={3}>
                  <label style={lbl}>{t("Taluk")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={talukList.map((tk) => ({ value: String(tk.talukId), label: tk.talukName }))}
                    placeholder={filter.districtId ? t("— Search Taluk —", { ns: "reports" }) : t("Select District first", { ns: "reports" })}
                    isSearchable isClearable isDisabled={!filter.districtId} menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed" styles={reactSelectStyles}
                    value={
                      talukList
                        .map((tk) => ({ value: String(tk.talukId), label: tk.talukName }))
                        .find((o) => o.value === String(filter.talukId)) || null
                    }
                    onChange={(opt) => { setFilter((p) => ({ ...p, talukId: opt?.value || "" })); reset(); }}
                    noOptionsMessage={() => t("No taluks", { ns: "reports" })}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Year", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="year" value={filter.year}
                               onChange={(e) => { setFilter((p) => ({ ...p, year: e.target.value })); reset(); }}
                               style={sel}>
                    {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month}
                               onChange={(e) => { setFilter((p) => ({ ...p, month: e.target.value })); reset(); }}
                               style={sel}>
                    {MONTHS.map((m) => <option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> {t("Loading…", { ns: "reports" })}</> : <>📋 {t("View", { ns: "reports" })}</>}
                    </button>
                  </div>
                </Col>
              </Row>
              {hasReport && (
                <Row className="mt-2">
                  <Col md={12}>
                    <div className="d-flex gap-2 flex-wrap">
                      <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                        {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> {t("Generating…", { ns: "reports" })}</> : <>📄 {t("PDF", { ns: "reports" })}</>}
                      </button>
                      <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                        {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> {t("Exporting…", { ns: "reports" })}</> : <>📊 {t("Excel", { ns: "reports" })}</>}
                      </button>
                    </div>
                  </Col>
                </Row>
              )}
            </Form>
          </Card.Body>
        </Card>

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="tsccypy-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "190px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("District / Taluk", { ns: "reports" })}</span>
                <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{districtName} · {talukName}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "190px" }}>
                <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("CY Annual Target", { ns: "reports" })}</span>
                <span className="tsccypy-num" style={{ fontSize: "16px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{fmt(kpis.cyAnnual)} <span style={{ fontSize: "11px", color: "#1e40af" }}>{config.metricUnit}</span></span>
                <span style={{ fontSize: "10.5px", color: "#1e40af", marginTop: "2px" }}>FY {fyLabel}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("CY · Mo Achievement", { ns: "reports" })}</span>
                <span className="tsccypy-num" style={{ fontSize: "14px", color: "#115e59", fontWeight: 800, marginTop: "2px" }}>{fmt(kpis.cyAchMo)} / {fmt(kpis.cyTgtMo)}</span>
                <span className="tsccypy-num" style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, marginTop: "2px" }}>{fmtPct(kpis.cyPctMo)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("CY · ME Achievement", { ns: "reports" })}</span>
                <span className="tsccypy-num" style={{ fontSize: "14px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{fmt(kpis.cyAchMe)} / {fmt(kpis.cyTgtMe)}</span>
                <span className="tsccypy-num" style={{ fontSize: "11px", color: "#15803d", fontWeight: 700, marginTop: "2px" }}>{fmtPct(kpis.cyPctMe)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("PY · ME Achievement", { ns: "reports" })}</span>
                <span className="tsccypy-num" style={{ fontSize: "14px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{fmt(kpis.pyAchMe)} / {fmt(kpis.pyTgtMe)}</span>
                <span className="tsccypy-num" style={{ fontSize: "11px", color: "#6d28d9", fontWeight: 700, marginTop: "2px" }}>{fmtPct(kpis.pyPctMe)} · FY {pyFyLabel}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("YoY Δ ME", { ns: "reports" })}</span>
                <span className="tsccypy-num" style={{ fontSize: "16px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{kpis.yoy >= 0 ? "▲" : "▼"} {fmtPct(Math.abs(kpis.yoy))}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                {config.formNo} · {config.headerBlurbKn} — {talukName} — {monthKn} {filter.year}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  {config.headerBlurbEn} ({config.metricUnit}) · CY {fyLabel} vs PY {pyFyLabel} · {monthLabel} {filter.year}
                </div>
              </div>

              <div className="tsccypy-scroll" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "1900px" }}>
                  <thead>
                    {/* Row 1 — top bands: Sl, TSC (rowspan=2), CY (colspan=7), PY (colspan=7) */}
                    <tr>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)", color: "#fff",
                        padding: "10px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "55px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#334155,#475569)", color: "#fff",
                        padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "200px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>TSC</div>
                      </th>
                      <th colSpan={7} style={{
                        background: "linear-gradient(135deg,#0f766e,#14b8a6)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "13px" }}>ಪ್ರಸಕ್ತ ವರ್ಷ · CY {fyLabel}</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Annual · Targets · Achievement · %</div>
                      </th>
                      <th colSpan={7} style={{
                        background: "linear-gradient(135deg,#5b21b6,#7c3aed)", color: "#fff",
                        padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "13px" }}>ಹಿಂದಿನ ವರ್ಷ · PY {pyFyLabel}</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Annual · Targets · Achievement · %</div>
                      </th>
                    </tr>
                    {/* Row 2 — leaf headers */}
                    <tr>
                      {[
                        { kn: "ವಾರ್ಷಿಕ", en: "Annual",   tone: "linear-gradient(180deg,#5eead4,#2dd4bf)", text: "#0f766e", strong: true },
                        { kn: "ಮಾಸ ಗುರಿ", en: "Mo Tgt",  tone: "linear-gradient(180deg,#5eead4,#2dd4bf)", text: "#0f766e" },
                        { kn: "ಅಂತ್ಯ ಗುರಿ", en: "ME Tgt",tone: "linear-gradient(180deg,#5eead4,#2dd4bf)", text: "#0f766e", strong: true },
                        { kn: "ಮಾಸ ಸಾಧನೆ", en: "Mo Ach", tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d" },
                        { kn: "ಅಂತ್ಯ ಸಾಧನೆ", en: "ME Ach",tone: "linear-gradient(180deg,#86efac,#4ade80)", text: "#14532d", strong: true },
                        { kn: "% ಮಾಸ", en: "% Mo",       tone: "linear-gradient(180deg,#fde68a,#fcd34d)", text: "#78350f" },
                        { kn: "% ಅಂತ್ಯ", en: "% ME",     tone: "linear-gradient(180deg,#fde68a,#fcd34d)", text: "#78350f", strong: true },

                        { kn: "ವಾರ್ಷಿಕ", en: "Annual",   tone: "linear-gradient(180deg,#a5b4fc,#818cf8)", text: "#3730a3", strong: true },
                        { kn: "ಮಾಸ ಗುರಿ", en: "Mo Tgt",  tone: "linear-gradient(180deg,#a5b4fc,#818cf8)", text: "#3730a3" },
                        { kn: "ಅಂತ್ಯ ಗುರಿ", en: "ME Tgt",tone: "linear-gradient(180deg,#a5b4fc,#818cf8)", text: "#3730a3", strong: true },
                        { kn: "ಮಾಸ ಸಾಧನೆ", en: "Mo Ach", tone: "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: "#4c1d95" },
                        { kn: "ಅಂತ್ಯ ಸಾಧನೆ", en: "ME Ach",tone: "linear-gradient(180deg,#c4b5fd,#a78bfa)", text: "#4c1d95", strong: true },
                        { kn: "% ಮಾಸ", en: "% Mo",       tone: "linear-gradient(180deg,#fcd34d,#fbbf24)", text: "#78350f" },
                        { kn: "% ಅಂತ್ಯ", en: "% ME",     tone: "linear-gradient(180deg,#fcd34d,#fbbf24)", text: "#78350f", strong: true },
                      ].map((c, i) => (
                        <th key={i} style={{
                          background: c.tone, color: c.text,
                          padding: "8px 4px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)",
                          fontWeight: c.strong ? 800 : 700, minWidth: "90px",
                        }}>
                          <div style={{ fontSize: "10.5px" }}>{c.kn}</div>
                          <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>{c.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr>
                        <td colSpan={16} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                    {dataRows.map((row, ri) => {
                      const rowBg = ri % 2 === 1 ? "#f8fafc" : "#ffffff";
                      const cellBase = {
                        padding: "10px 6px", textAlign: "center",
                        borderBottom: "1px solid #e2e8f0",
                        borderRight: "1px solid #eef2f6",
                        fontSize: "12px",
                      };
                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="tsccypy-tr" style={{ background: rowBg }}>
                          <td style={{ ...cellBase, borderRight: "1px solid #e2e8f0", color: "#475569", fontWeight: 700 }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "26px", height: "26px", borderRadius: "50%",
                              background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)",
                              color: "#1e293b", fontWeight: 800, fontSize: "11px",
                            }}>{row.sl_no}</span>
                          </td>
                          <td style={{
                            ...cellBase, textAlign: "left", paddingLeft: "14px",
                            color: "#0f172a", fontWeight: 700,
                            borderRight: "2px solid #e2e8f0",
                          }}>
                            {row.tsc_name || "—"}
                          </td>
                          {NUM_COLS.map((c, ci) => {
                            const v = row[c.key];
                            const has = String(v ?? "").trim() !== "" && numOrZero(v) !== 0;
                            const palette = PALETTES[c.palette];
                            const extra = c.separator ? { borderRight: "2px solid #e2e8f0" } : {};
                            return (
                              <td key={c.key} className="tsccypy-num" style={{
                                ...cellBase, ...extra,
                                background: has ? (c.isTotal ? palette.totalBg : palette.bg) : "transparent",
                                color: has ? palette.text : "#cbd5e0",
                                fontWeight: c.isTotal ? 800 : 600,
                              }}>
                                {has ? (c.pct ? fmtPct(v) : fmt(v)) : (c.pct ? "0.00%" : "—")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{
                background: "linear-gradient(135deg,#ecfdf5,#eef2ff)",
                padding: "12px 24px", display: "flex",
                alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "8px",
                borderTop: "1.5px solid #c7d2fe",
              }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {districtName} · {talukName} — {monthLabel} {monthKn} {filter.year}
                  &nbsp;·&nbsp; {config.formNo} — {config.metricLabelEn}
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

// ── Sheet 5a — Pure-race DFL Brushing (Form 28-4) ────────────────────────────
const PURE_BRUSHING_CONFIG = {
  pageTitleEn:    "TSC Monthly Pure-race DFL Brushing — Sheet 5a",
  pageTitleKn:    "ಶುದ್ಧತಳಿ ಮೊಟ್ಟೆ ಚಾಕಿ ಪ್ರಗತಿ — ಮಾಸಿಕ",
  sheetBadge:     "ನಮೂನೆ-28-4 · Form 28-4",
  formNo:         "Form 28-4",
  icon:           "🥚",
  gradient:       "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#5b57ac 100%)",
  headerBlurbKn:  "ಶುದ್ಧತಳಿ ಮೊಟ್ಟೆ ಚಾಕಿ ಪ್ರಗತಿ",
  headerBlurbEn:  "TSC-wise Pure-race DFL Brushing Progress",
  endpoint:       "grainage-progress-report/tsc-monthly/pure-brushing",
  metricUnit:     "DFLs",
  metricLabelEn:  "DFLs Brushed",
  downloadFilenamePrefix: "tsc_monthly_pure_brushing",
};

// ── Sheet 5b — Cross/Hybrid DFL Brushing (Form 28) ───────────────────────────
const CROSS_BRUSHING_CONFIG = {
  pageTitleEn:    "TSC Monthly Cross/Hybrid DFL Brushing — Sheet 5b",
  pageTitleKn:    "ಸಂಕರಣ ಮೊಟ್ಟೆ ಚಾಕಿ ಪ್ರಗತಿ — ಮಾಸಿಕ",
  sheetBadge:     "ನಮೂನೆ-28 · Form 28",
  formNo:         "Form 28",
  icon:           "🪺",
  gradient:       "linear-gradient(135deg,#7c3aed 0%,#a78bfa 50%,#0f766e 100%)",
  headerBlurbKn:  "ಸಂಕರಣ ಮೊಟ್ಟೆ ಚಾಕಿ ಪ್ರಗತಿ",
  headerBlurbEn:  "TSC-wise Cross/Hybrid DFL Brushing Progress",
  endpoint:       "grainage-progress-report/tsc-monthly/cross-brushing",
  metricUnit:     "DFLs",
  metricLabelEn:  "DFLs Brushed",
  downloadFilenamePrefix: "tsc_monthly_cross_brushing",
};

// ── Sheet 5d — Pure-race Cocoon Production (Form 32) ─────────────────────────
const PURE_COCOON_CONFIG = {
  pageTitleEn:    "TSC Monthly Pure-race Cocoon Production — Sheet 5d",
  pageTitleKn:    "ಶುದ್ಧತಳಿ ಗೂಡು ಉತ್ಪಾದನಾ ಪ್ರಗತಿ — ಮಾಸಿಕ",
  sheetBadge:     "ನಮೂನೆ-32 · Form 32",
  formNo:         "Form 32",
  icon:           "🟫",
  gradient:       "linear-gradient(135deg,#a16207 0%,#ca8a04 50%,#5b57ac 100%)",
  headerBlurbKn:  "ಶುದ್ಧತಳಿ ಗೂಡು ಉತ್ಪಾದನಾ ಪ್ರಗತಿ",
  headerBlurbEn:  "TSC-wise Pure-race Cocoon Production Progress",
  endpoint:       "grainage-progress-report/tsc-monthly/pure-cocoon-production",
  metricUnit:     "kg",
  metricLabelEn:  "Cocoon Supplied (kg)",
  downloadFilenamePrefix: "tsc_monthly_pure_cocoon_production",
};

export function TscMonthlyPureBrushingReport()         { return <TscMonthlyCYPYReport config={PURE_BRUSHING_CONFIG}  />; }
export function TscMonthlyCrossBrushingReport()        { return <TscMonthlyCYPYReport config={CROSS_BRUSHING_CONFIG} />; }
export function TscMonthlyPureCocoonProductionReport() { return <TscMonthlyCYPYReport config={PURE_COCOON_CONFIG}    />; }

export default TscMonthlyCYPYReport;
