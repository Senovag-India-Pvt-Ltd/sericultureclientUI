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

if (!document.getElementById("ff2-styles")) {
  const s = document.createElement("style");
  s.id = "ff2-styles";
  s.innerHTML = `
    .ff2-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .ff2-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .ff2-swal .swal2-icon { margin:20px auto 4px !important; }
    .ff2-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .ff2-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes ff2-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .ff2-wrap { animation: ff2-in .35s ease; }
    .ff2-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .ff2-table th { letter-spacing:.02em; }
    .ff2-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .ff2-mono { font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; }
    .ff2-scroll::-webkit-scrollbar { height:9px; }
    .ff2-scroll::-webkit-scrollbar-track { background:#f0fdfa; border-radius:6px; }
    .ff2-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#3730a3); border-radius:6px; }
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
  if (!s) return "—";
  const n = parseFloat(s);
  if (isNaN(n)) return s;
  if (n === 0) return "0";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

function FarmForm2ProgressReport() {
  const { t, i18n } = useTranslation();

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
    if (!filter.farmId)                return t("Please select a Farm.", { ns: "reports" });
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
      background: "#fff", customClass: { popup: "ff2-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "ff2-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-form2-progress", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the Form F-2 Progress report.", { ns: "reports" }));
        }
      } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-form2-progress/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-form2-progress/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `farm_form2_progress_${filter.farmId}_${year}_${m}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const farmName   = (i18n.language === "kn" ? (selectedFarm?.farmNameInKannada || selectedFarm?.farmName) : selectedFarm?.farmName) || "—";

  const totals = useMemo(() => {
    const sum = (k) => dataRows.reduce((a, r) => a + numOrZero(r[k]), 0);
    return {
      lots:        dataRows.length,
      brushed:     sum("brushed_dfls"),
      cocoonQty:   sum("cocoon_qty"),
      cocoonWt:    sum("cocoon_wt"),
      supplyQty:   sum("supply_qty"),
      supplyWt:    sum("supply_wt"),
    };
  }, [dataRows]);

  const avgYieldQty = totals.brushed === 0 ? 0 : (totals.cocoonQty * 100) / totals.brushed;
  const avgYieldWt  = totals.brushed === 0 ? 0 : (totals.cocoonWt  * 100) / totals.brushed;

  return (
    <Layout title={t("Form F-2 · Farm Monthly Progress Report", { ns: "reports" })}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ನಮೂನೆ ಎಫ್-2 · ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಕೃಷಿಕ್ಷೇತ್ರ — ಮಾಹೆಯ ಪ್ರಗತಿ ವರದಿ")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
            color: "#0f766e", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #5eead4", verticalAlign: "middle",
          }}>P3 Farms · Bivoltine · Form F-2</span>
        </Block.Title>
      </Block.HeadContent></Block.HeadBetween></Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(15,118,110,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#3730a3 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📋</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ನಮೂನೆ ಎಫ್-2 · ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಕೃಷಿಕ್ಷೇತ್ರ — ಮಾಹೆಯ ಪ್ರಗತಿ ವರದಿ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Form F-2</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P3 Farms (Bivoltine) — Per-lot Brushing → Cocoon → Supply detail (rearing_of_dfls)</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{farmName}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{totals.lots} lot{totals.lots === 1 ? "" : "s"}</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f0fdfa)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>{t("Farm")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={farmList.map((f) => ({ value: String(f.farmId), label: i18n.language === "kn" ? (f.farmNameInKannada || f.farmName) : f.farmName }))}
                    placeholder={t("— Search Farm —", { ns: "reports" })}
                    isSearchable isClearable
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={farmSelectStyles}
                    value={
                      farmList
                        .map((f) => ({ value: String(f.farmId), label: i18n.language === "kn" ? (f.farmNameInKannada || f.farmName) : f.farmName }))
                        .find((o) => o.value === String(filter.farmId)) || null
                    }
                    onChange={(opt) => {
                      setFilter((p) => ({ ...p, farmId: opt?.value || "" }));
                      setHasReport(false); setDataRows([]);
                    }}
                    noOptionsMessage={() => t("No farm found", { ns: "reports" })}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Financial Year")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">{t("— Select Year —", { ns: "reports" })}</option>
                    {financialYearList.map((f) => (<option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">{t("— Month —", { ns: "reports" })}</option>
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
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
          <div className="ff2-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={kpi("#ccfbf1", "#5eead4", "#0f766e")}>
                <span style={kpiLbl("#0f766e")}>ತಂಡಗಳು Lots</span>
                <span style={kpiVal("#134e4a", 18)}>{totals.lots.toLocaleString()}</span>
              </div>
              <div style={kpi("#fef3c7", "#fcd34d", "#92400e")}>
                <span style={kpiLbl("#92400e")}>Period</span>
                <span style={{ ...kpiVal("#78350f", 13.5), fontWeight: 700 }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={kpi("#dbeafe", "#93c5fd", "#1e40af")}>
                <span style={kpiLbl("#1e40af")}>🥚 ಸುಲಿದ ಮೊಟ್ಟೆ Brushed</span>
                <span className="ff2-num" style={kpiVal("#1e3a8a", 16)}>{totals.brushed.toLocaleString()}</span>
              </div>
              <div style={kpi("#fed7aa", "#fb923c", "#7c2d12")}>
                <span style={kpiLbl("#7c2d12")}>🪺 ಗೂಡು ಸಂಖ್ಯೆ Cocoons</span>
                <span className="ff2-num" style={kpiVal("#7c2d12", 16)}>{totals.cocoonQty.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#9a3412", fontWeight: 700, marginTop: "1px" }}>{totals.cocoonWt.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg</span>
              </div>
              <div style={kpi("#a7f3d0", "#6ee7b7", "#065f46")}>
                <span style={kpiLbl("#065f46")}>📊 ಸರಾಸರಿ ಇಳುವರಿ /100</span>
                <span className="ff2-num" style={kpiVal("#064e3b", 16)}>{avgYieldQty.toFixed(2)} qty</span>
                <span style={{ fontSize: "10.5px", color: "#065f46", fontWeight: 700, marginTop: "1px" }}>{avgYieldWt.toFixed(2)} kg / 100 DFL</span>
              </div>
              <div style={kpi("#ede9fe", "#c4b5fd", "#5b21b6")}>
                <span style={kpiLbl("#5b21b6")}>🚚 ಸರಬರಾಜು Supply</span>
                <span className="ff2-num" style={kpiVal("#4c1d95", 16)}>{totals.supplyQty.toLocaleString()}</span>
                <span style={{ fontSize: "10.5px", color: "#5b21b6", fontWeight: 700, marginTop: "1px" }}>{totals.supplyWt.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#0c4a6e,#0f766e 50%,#312e81)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                ನಮೂನೆ ಎಫ್-2 · ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಕೃಷಿಕ್ಷೇತ್ರ {farmName} &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Form F-2 · Farm Monthly Progress (per-lot Brushing → Cocoon → Supply) &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="ff2-scroll" style={{ overflowX: "auto" }}>
                <table className="ff2-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1900px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "55px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl.No</div>
                      </th>
                      <th colSpan={4} style={hdr("linear-gradient(135deg,#334155,#475569)")}>
                        <div style={{ fontSize: "12.5px" }}>ಗುರುತಿನ ಮಾಹಿತಿ</div>
                        <div style={hdrEn}>Identity</div>
                      </th>
                      <th colSpan={3} style={hdr("linear-gradient(135deg,#0f766e,#14b8a6)")}>
                        <div style={{ fontSize: "12.5px" }}>🥚 ಸುಲಿದ ಮೊಟ್ಟೆಗಳು</div>
                        <div style={hdrEn}>Brushed DFLs</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#b45309,#d97706)")}>
                        <div style={{ fontSize: "12.5px" }}>🪺 ಗೂಡಿನ ಕಟಾವು</div>
                        <div style={hdrEn}>Cocoon Harvest</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#065f46,#10b981)")}>
                        <div style={{ fontSize: "12.5px" }}>📊 100 ಮೊಟ್ಟೆಗೆ ಇಳುವರಿ</div>
                        <div style={hdrEn}>Yield per 100</div>
                      </th>
                      <th colSpan={3} style={hdr("linear-gradient(135deg,#5b21b6,#7c3aed)")}>
                        <div style={{ fontSize: "12.5px" }}>🚚 ಬಿತ್ತನೆಕೋಠಿಗೆ ಸರಬರಾಜು</div>
                        <div style={hdrEn}>Supply to Grainage</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={subhdr("linear-gradient(135deg,#cbd5e1,#94a3b8)", "#1e293b")}>
                        <div style={{ fontSize: "10.5px" }}>ಬೆಳೆ</div><div style={subhdrEn}>Crop No</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#cbd5e1,#94a3b8)", "#1e293b")}>
                        <div style={{ fontSize: "10.5px" }}>ತಳಿ</div><div style={subhdrEn}>Race</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#cbd5e1,#94a3b8)", "#1e293b")}>
                        <div style={{ fontSize: "10.5px" }}>ಮೂಲ ಬಿತ್ತನೆಕೋಠಿ</div><div style={subhdrEn}>Source Grainage</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#cbd5e1,#94a3b8)", "#1e293b")}>
                        <div style={{ fontSize: "10.5px" }}>ತಂಡ ಸಂಖ್ಯೆ</div><div style={subhdrEn}>Lot No</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#a7f3d0,#6ee7b7)", "#064e3b")}>
                        <div style={{ fontSize: "10.5px" }}>ಮೊಟ್ಟೆ</div><div style={subhdrEn}>DFL Count</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#a7f3d0,#6ee7b7)", "#064e3b")}>
                        <div style={{ fontSize: "10.5px" }}>ಸರಾಸರಿ /ಬೆಳೆ</div><div style={subhdrEn}>Avg Loose</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#a7f3d0,#6ee7b7)", "#064e3b")}>
                        <div style={{ fontSize: "10.5px" }}>ಚಾಕಿ ಶೇ.</div><div style={subhdrEn}>Chawki %</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
                        <div style={{ fontSize: "10.5px" }}>ಸಂಖ್ಯೆ</div><div style={subhdrEn}>Qty</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
                        <div style={{ fontSize: "10.5px" }}>ತೂಕ (ಕೆ.ಜಿ.)</div><div style={subhdrEn}>Wt (kg)</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#bbf7d0,#86efac)", "#14532d")}>
                        <div style={{ fontSize: "10.5px" }}>ಸಂಖ್ಯೆ</div><div style={subhdrEn}>Qty</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#bbf7d0,#86efac)", "#14532d")}>
                        <div style={{ fontSize: "10.5px" }}>ತೂಕ (ಕೆ.ಜಿ.)</div><div style={subhdrEn}>Wt (kg)</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ಬಿತ್ತನೆಕೋಠಿ</div><div style={subhdrEn}>To</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ಸಂಖ್ಯೆ</div><div style={subhdrEn}>Qty</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ತೂಕ (ಕೆ.ಜಿ.)</div><div style={subhdrEn}>Wt (kg)</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={15} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#f0fdfa,#fff)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "8px" }}>📋</div>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f766e", marginBottom: "4px" }}>ಯಾವುದೇ ಬೆಳೆ ಮಾಹಿತಿ ಇಲ್ಲ</div>
                        <div style={{ fontSize: "13px", color: "#475569", fontWeight: 600 }}>No rearing lots found for this farm in {monthLabel} {monthYear}.</div>
                      </td></tr>
                    )}
                    {dataRows.map((row, ri) => {
                      const alt = ri % 2 === 1;
                      const chawkiPct = numOrZero(row.chawki_pct);
                      const chawkiTone = chawkiPct >= 95 ? "linear-gradient(135deg,#bbf7d0,#86efac)" :
                                          chawkiPct >= 80 ? "linear-gradient(135deg,#a7f3d0,#6ee7b7)" :
                                          chawkiPct >= 60 ? "linear-gradient(135deg,#fde68a,#fcd34d)" :
                                          chawkiPct > 0   ? "linear-gradient(135deg,#fecaca,#fca5a5)" : "transparent";
                      const chawkiText = chawkiPct >= 95 ? "#14532d" :
                                          chawkiPct >= 80 ? "#065f46" :
                                          chawkiPct >= 60 ? "#92400e" :
                                          chawkiPct > 0   ? "#7f1d1d" : "#cbd5e0";
                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="ff2-tr" style={{ background: alt ? "#f7fdfb" : "#ffffff" }}>
                          <td style={td("center", "#475569", 700)}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "28px", height: "28px", borderRadius: "50%",
                              background: "linear-gradient(135deg,#ccfbf1,#5eead4)",
                              color: "#0f766e", fontWeight: 800, fontSize: "11.5px",
                            }}>{row.sl_no}</span>
                          </td>
                          <td className="ff2-num" style={td("center", "#1e293b", 700, "#f8fafc")}>
                            {row.crop_no ? fmt(row.crop_no) : "—"}
                          </td>
                          <td style={td("left", "#0f172a", 700)}>
                            {row.race
                              ? <span style={{
                                  display: "inline-block", padding: "3px 10px", borderRadius: "999px",
                                  background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
                                  color: "#1e3a8a", fontWeight: 800, fontSize: "11.5px",
                                  border: "1px solid #93c5fd",
                                }}>{row.race}</span>
                              : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td style={td("left", "#475569", 700)}>
                            {row.source_grainage || <span style={{ color: "#cbd5e0", fontStyle: "italic", fontSize: "11.5px" }}>—</span>}
                          </td>
                          <td style={td("center")}>
                            {row.lot_number
                              ? <span className="ff2-mono" style={{
                                  display: "inline-block", padding: "3px 10px", borderRadius: "8px",
                                  background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
                                  color: "#0f172a", fontWeight: 800, fontSize: "11.5px",
                                  border: "1px solid #cbd5e1",
                                }}>{row.lot_number}</span>
                              : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td className="ff2-num" style={td("right", "#134e4a", 800, "linear-gradient(135deg,#ecfdf5,#d1fae5)")}>{fmt(row.brushed_dfls)}</td>
                          <td className="ff2-num" style={td("right", "#0f766e", 700, "#f0fdfa")}>{fmt(row.avg_loose_dfl)}</td>
                          <td style={td("center", chawkiText, 800,
                            chawkiTone === "transparent"
                              ? (alt ? "#f7fdfb" : "transparent")
                              : chawkiTone)}>
                            {chawkiPct === 0 ? "—" : `${fmt(row.chawki_pct)}%`}
                          </td>
                          <td className="ff2-num" style={td("right", "#7c2d12", 800, "linear-gradient(135deg,#fff7ed,#ffedd5)")}>{fmt(row.cocoon_qty)}</td>
                          <td className="ff2-num" style={td("right", "#9a3412", 700, "#fff7ed")}>{fmt(row.cocoon_wt)}</td>
                          <td className="ff2-num" style={td("right", "#14532d", 800, "linear-gradient(135deg,#f0fdf4,#dcfce7)")}>{fmt(row.yield_per100_qty)}</td>
                          <td className="ff2-num" style={td("right", "#166534", 700, "#f0fdf4")}>{fmt(row.yield_per100_wt)}</td>
                          <td style={td("left", "#475569", 700)}>
                            {row.supply_to
                              ? <span style={{
                                  display: "inline-block", padding: "3px 9px", borderRadius: "999px",
                                  background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
                                  color: "#4c1d95", fontWeight: 700, fontSize: "11.5px",
                                  border: "1px solid #c4b5fd",
                                }}>{row.supply_to}</span>
                              : <span style={{ color: "#cbd5e0", fontStyle: "italic", fontSize: "11.5px" }}>—</span>}
                          </td>
                          <td className="ff2-num" style={td("right", "#4c1d95", 800, "linear-gradient(135deg,#f5f3ff,#ede9fe)")}>{fmt(row.supply_qty)}</td>
                          <td className="ff2-num" style={td("right", "#5b21b6", 700, "#f5f3ff")}>{fmt(row.supply_wt)}</td>
                        </tr>
                      );
                    })}
                    {dataRows.length > 0 && (
                      <tr style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)" }}>
                        <td colSpan={5} style={{ padding: "13px 16px", textAlign: "right", color: "#78350f", fontWeight: 800, fontSize: "13px", borderTop: "2px solid #f59e0b" }}>
                          ಒಟ್ಟು &nbsp;/&nbsp; Grand Total &nbsp;<span style={{ color: "#92400e", fontWeight: 600, fontSize: "11.5px" }}>({totals.lots} lot{totals.lots === 1 ? "" : "s"})</span>
                        </td>
                        <td className="ff2-num" style={ftd("#134e4a")}>{fmt(totals.brushed)}</td>
                        <td style={ftd()}>—</td>
                        <td style={ftd()}>—</td>
                        <td className="ff2-num" style={ftd("#7c2d12")}>{fmt(totals.cocoonQty)}</td>
                        <td className="ff2-num" style={ftd("#9a3412")}>{fmt(totals.cocoonWt)}</td>
                        <td className="ff2-num" style={ftd("#14532d")}>{avgYieldQty.toFixed(2)}</td>
                        <td className="ff2-num" style={ftd("#166534")}>{avgYieldWt.toFixed(2)}</td>
                        <td style={ftd()}>—</td>
                        <td className="ff2-num" style={ftd("#4c1d95")}>{fmt(totals.supplyQty)}</td>
                        <td className="ff2-num" style={ftd("#5b21b6")}>{fmt(totals.supplyWt)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #a7f3d0" }}>
                <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                  Form F-2 · {farmName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {totals.lots} lot{totals.lots === 1 ? "" : "s"} &nbsp;·&nbsp; {fmt(totals.cocoonQty)} cocoons / {fmt(totals.cocoonWt)} kg &nbsp;·&nbsp; Yield {avgYieldQty.toFixed(2)} qty / {avgYieldWt.toFixed(2)} kg per 100 DFL
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
const hdr = (bg, minW, single) => ({
  background: bg, color: "#fff",
  padding: "10px 8px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)",
  fontWeight: 800,
  minWidth: minW || "100px",
  verticalAlign: single ? "middle" : "top",
});
const subhdr = (bg, color) => ({
  background: bg, color,
  padding: "8px 6px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
  minWidth: "110px",
});
const td = (align, color, weight, bg) => ({
  padding: "10px 10px", textAlign: align || "center",
  borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc",
  background: bg || "transparent",
  color: color || "#0f172a", fontWeight: weight || 600,
  fontSize: "12.5px",
});
const ftd = (color) => ({
  padding: "13px 10px", textAlign: "right",
  color: color || "#78350f", fontWeight: 800, fontSize: "12.5px",
  borderTop: "2px solid #f59e0b", borderRight: "1px solid #fcd34d",
});

export default FarmForm2ProgressReport;
