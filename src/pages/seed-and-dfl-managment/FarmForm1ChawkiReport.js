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

if (!document.getElementById("ff1-styles")) {
  const s = document.createElement("style");
  s.id = "ff1-styles";
  s.innerHTML = `
    .ff1-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .ff1-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .ff1-swal .swal2-icon { margin:20px auto 4px !important; }
    .ff1-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .ff1-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes ff1-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .ff1-wrap { animation: ff1-in .35s ease; }
    .ff1-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .ff1-table th { letter-spacing:.02em; }
    .ff1-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .ff1-scroll::-webkit-scrollbar { height:9px; }
    .ff1-scroll::-webkit-scrollbar-track { background:#f0fdfa; border-radius:6px; }
    .ff1-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#3730a3); border-radius:6px; }
    @keyframes ff1-fill { from { width: 0; } to { width: var(--w, 0%); } }
    .ff1-bar-fill { animation: ff1-fill 1.1s cubic-bezier(.22,.61,.36,1) both; }
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
const fmtSigned = (n) => {
  if (n === 0) return "0";
  return (n > 0 ? "+" : "") + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

function FarmForm1ChawkiReport() {
  const { t, i18n } = useTranslation();

  const [filter, setFilter] = useState({ farmId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [farmList,          setFarmList]          = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [dataRow,            setDataRow]            = useState(null);
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
    setHasReport(false); setDataRow(null);
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
      background: "#fff", customClass: { popup: "ff1-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "ff1-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { farmId: filter.farmId, year, month: m };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRow(null);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-form1-chawki", { params: params() });
      const rows = Array.isArray(res.data) ? res.data : [];
      setDataRow(rows.length ? rows[0] : {});
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the Form-1 Chawki report.");
        }
      } finally { setIsLoading(false); }
  };

  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-form1-chawki/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr("PDF Failed", "Could not generate the PDF report."); }
    finally { setIsDownloadingPdf(false); }
  };

  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-form1-chawki/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `farm_form1_chawki_${filter.farmId}_${year}_${m}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr("Excel Failed", "Could not generate the Excel report."); }
    finally { setIsDownloadingExcel(false); }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const farmName   = (i18n.language === "kn" ? (selectedFarm?.farmNameInKannada || selectedFarm?.farmName) : selectedFarm?.farmName) || "—";

  const metrics = useMemo(() => {
    const r = dataRow || {};
    return {
      progDfl:  numOrZero(r.prog_dfl),
      progCrop: numOrZero(r.prog_crop),
      progPct:  numOrZero(r.prog_pct),
      achDfl:   numOrZero(r.ach_dfl),
      achCrop:  numOrZero(r.ach_crop),
      achPct:   numOrZero(r.ach_pct),
      futDfl:   numOrZero(r.fut_dfl),
      futCrop:  numOrZero(r.fut_crop),
      availM:   numOrZero(r.avail_m),
      availMe:  numOrZero(r.avail_me),
    };
  }, [dataRow]);

  const shortfall  = metrics.progDfl - metrics.achDfl;
  const overshoot  = metrics.achDfl - metrics.progDfl;
  const onTarget   = metrics.achPct >= 100;
  const barPct     = Math.min(100, metrics.achPct);
  const barColor   = onTarget
    ? "linear-gradient(90deg,#16a34a,#10b981)"
    : metrics.achPct >= 75
      ? "linear-gradient(90deg,#0f766e,#14b8a6)"
      : metrics.achPct >= 50
        ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
        : "linear-gradient(90deg,#dc2626,#f87171)";

  return (
    <Layout title={t("Form-1 · Farm Monthly Chawki / Brushing Achievement")}>
      <Block.Head><Block.HeadBetween><Block.HeadContent>
        <Block.Title tag="h2">
          {t("ನಮೂನೆ-1 · ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಕೃಷಿ ಕ್ಷೇತ್ರ — ಮಾಹೆಯ ಚಿಕ ಗುರಿ ಸಾಧನೆ ವರದಿ")}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
            color: "#0f766e", padding: "2px 10px", borderRadius: "20px",
            fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
            border: "1px solid #5eead4", verticalAlign: "middle",
          }}>P3 Farms · Bivoltine · Form-1</span>
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
                ನಮೂನೆ-1 · ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಕೃಷಿ ಕ್ಷೇತ್ರ — ಮಾಹೆಯ ಚಿಕ ಗುರಿ ಸಾಧನೆ ವರದಿ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Form-1</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P3 Farms (Bivoltine) — Monthly Brushing Programme vs Achievement, plus Next-Month Plan & Available Stock</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{farmName}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>{monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f0fdfa)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <label style={lbl}>Farm <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={farmList.map((f) => ({ value: String(f.farmId), label: i18n.language === "kn" ? (f.farmNameInKannada || f.farmName) : f.farmName }))}
                    placeholder="— Search Farm —"
                    isSearchable
                    isClearable
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
                      setHasReport(false); setDataRow(null);
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
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>))}
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
          <div className="ff1-wrap mt-4">
            {/* Hero "achievement vs programme" panel */}
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden", marginBottom: "18px" }}>
              <div style={{
                background: "linear-gradient(135deg,#ecfdf5,#eef2ff)",
                padding: "20px 24px",
              }}>
                <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                  <div style={{ flex: "1 1 220px" }}>
                    <div style={{ fontSize: "11px", color: "#0f766e", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".07em" }}>Farm</div>
                    <div style={{ fontSize: "17px", color: "#0f172a", fontWeight: 800, marginTop: "2px" }}>{farmName}</div>
                  </div>
                  <div style={{ flex: "1 1 180px" }}>
                    <div style={{ fontSize: "11px", color: "#0f766e", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".07em" }}>Period</div>
                    <div style={{ fontSize: "15px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} · {monthKn} {monthYear}</div>
                  </div>
                  <div style={{
                    padding: "10px 18px",
                    borderRadius: "14px",
                    background: onTarget
                      ? "linear-gradient(135deg,#bbf7d0,#86efac)"
                      : metrics.achPct >= 75
                        ? "linear-gradient(135deg,#ccfbf1,#5eead4)"
                        : metrics.achPct >= 50
                          ? "linear-gradient(135deg,#fef3c7,#fcd34d)"
                          : "linear-gradient(135deg,#fecaca,#fca5a5)",
                    border: onTarget ? "1.5px solid #4ade80" : "1.5px solid rgba(0,0,0,.06)",
                  }}>
                    <div style={{
                      fontSize: "11px",
                      color: onTarget ? "#14532d" : metrics.achPct >= 75 ? "#0f766e" : metrics.achPct >= 50 ? "#92400e" : "#7f1d1d",
                      fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em",
                    }}>
                      {onTarget ? "🎉 ಗುರಿ ಸಾಧಿಸಲಾಗಿದೆ Achieved" : "ಶೇಕಡಾವಾರು ಸಾಧನೆ % Achievement"}
                    </div>
                    <div className="ff1-num" style={{
                      fontSize: "26px",
                      color: onTarget ? "#14532d" : metrics.achPct >= 75 ? "#0f766e" : metrics.achPct >= 50 ? "#78350f" : "#7f1d1d",
                      fontWeight: 800, lineHeight: 1.1, marginTop: "2px",
                    }}>{metrics.achPct.toFixed(2)}%</div>
                  </div>
                </div>

                {/* Programme vs Achievement: side-by-side metric blocks */}
                <Row className="g-3">
                  <Col md={4}>
                    <div style={metricBox("linear-gradient(135deg,#fed7aa,#fff7ed)", "#fb923c", "#7c2d12")}>
                      <div style={metricBoxLbl("#7c2d12")}>🎯 ಕಾರ್ಯಕ್ರಮ Programme</div>
                      <div className="ff1-num" style={metricBoxVal("#7c2d12", 24)}>{metrics.progDfl.toLocaleString()}</div>
                      <div style={metricBoxSub("#9a3412")}>ಮೊಟ್ಟೆ DFL · {metrics.progCrop.toLocaleString()} ಬೆಳೆ Lots</div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div style={metricBox(
                      onTarget
                        ? "linear-gradient(135deg,#bbf7d0,#ecfdf5)"
                        : "linear-gradient(135deg,#ccfbf1,#f0fdfa)",
                      onTarget ? "#4ade80" : "#5eead4",
                      onTarget ? "#14532d" : "#0f766e",
                    )}>
                      <div style={metricBoxLbl(onTarget ? "#14532d" : "#0f766e")}>✅ ಸಾಧನೆ Achievement</div>
                      <div className="ff1-num" style={metricBoxVal(onTarget ? "#14532d" : "#0f766e", 24)}>{metrics.achDfl.toLocaleString()}</div>
                      <div style={metricBoxSub(onTarget ? "#166534" : "#115e59")}>ಮೊಟ್ಟೆ DFL · {metrics.achCrop.toLocaleString()} ಬೆಳೆ Lots</div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div style={metricBox(
                      shortfall <= 0
                        ? "linear-gradient(135deg,#dbeafe,#eff6ff)"
                        : "linear-gradient(135deg,#fecdd3,#fff1f2)",
                      shortfall <= 0 ? "#93c5fd" : "#fda4af",
                      shortfall <= 0 ? "#1e3a8a" : "#9f1239",
                    )}>
                      <div style={metricBoxLbl(shortfall <= 0 ? "#1e3a8a" : "#9f1239")}>
                        {shortfall <= 0 ? "📈 ಹೆಚ್ಚುವರಿ Surplus" : "📉 ಕೊರತೆ Shortfall"}
                      </div>
                      <div className="ff1-num" style={metricBoxVal(shortfall <= 0 ? "#1e3a8a" : "#9f1239", 24)}>
                        {shortfall <= 0
                          ? "+" + Math.abs(overshoot).toLocaleString()
                          : "-" + shortfall.toLocaleString()}
                      </div>
                      <div style={metricBoxSub(shortfall <= 0 ? "#312e81" : "#881337")}>
                        {shortfall <= 0 ? "ಗುರಿಯನ್ನು ಮೀರಿ Beyond target" : "ಗುರಿಯ ಕೆಳಗೆ Below target"}
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Achievement progress bar */}
                <div style={{ marginTop: "16px" }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{ fontSize: "11px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>
                      Achievement progress
                    </span>
                    <span className="ff1-num" style={{ fontSize: "12px", color: "#0f172a", fontWeight: 800 }}>
                      {metrics.achDfl.toLocaleString()} / {metrics.progDfl.toLocaleString()} DFLs
                    </span>
                  </div>
                  <div style={{
                    height: "16px", borderRadius: "999px",
                    background: "#e2e8f0", overflow: "hidden",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,.06)",
                    position: "relative",
                  }}>
                    <div
                      className="ff1-bar-fill"
                      style={{
                        height: "100%",
                        background: barColor,
                        borderRadius: "999px",
                        "--w": `${barPct}%`,
                        boxShadow: "0 1px 4px rgba(0,0,0,.18)",
                        display: "flex", alignItems: "center", justifyContent: "flex-end",
                        paddingRight: "10px",
                        color: "#fff", fontWeight: 800, fontSize: "10.5px",
                      }}
                    >
                      {barPct >= 18 ? `${metrics.achPct.toFixed(1)}%` : ""}
                    </div>
                    {/* Target marker at 100% (only meaningful when achPct > 100) */}
                    {metrics.achPct > 100 && (
                      <div style={{
                        position: "absolute",
                        left: `${(100 / Math.max(metrics.achPct, 1)) * 100}%`,
                        top: 0, bottom: 0,
                        borderLeft: "2px dashed rgba(0,0,0,.35)",
                      }} />
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Form-1 detail table — official layout, single-row data */}
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(15,118,110,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#0c4a6e,#0f766e 50%,#312e81)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", textAlign: "center",
              }}>
                ನಮೂನೆ-1 · ಸರ್ಕಾರಿ ರೇಷ್ಮೆ ಕೃಷಿ ಕ್ಷೇತ್ರ {farmName} &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Form-1 · Farm Monthly Chawki / Brushing Achievement &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="ff1-scroll" style={{ overflowX: "auto" }}>
                <table className="ff1-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1300px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={hdr("linear-gradient(135deg,#1e293b,#36506b)", "60px", true)}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div><div style={hdrEn}>Sl.No</div>
                      </th>
                      <th colSpan={3} style={hdr("linear-gradient(135deg,#b45309,#d97706)")}>
                        <div style={{ fontSize: "12.5px" }}>🎯 ಕಾರ್ಯಕ್ರಮ</div>
                        <div style={hdrEn}>Programme (Target)</div>
                      </th>
                      <th colSpan={3} style={hdr("linear-gradient(135deg,#0f766e,#14b8a6)")}>
                        <div style={{ fontSize: "12.5px" }}>✅ ಸಾಧನೆ</div>
                        <div style={hdrEn}>Achievement</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#5b21b6,#7c3aed)")}>
                        <div style={{ fontSize: "12.5px" }}>📅 ಮುಂದಿನ ಮಾಹೆಯ ಕಾರ್ಯಕ್ರಮ</div>
                        <div style={hdrEn}>Next Month Programme</div>
                      </th>
                      <th colSpan={2} style={hdr("linear-gradient(135deg,#0369a1,#0284c7)")}>
                        <div style={{ fontSize: "12.5px" }}>📦 ಲಭ್ಯ ಮೊಟ್ಟೆಗಳು</div>
                        <div style={hdrEn}>Available DFLs (rcv − brushed)</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
                        <div style={{ fontSize: "10.5px" }}>ಮೊಟ್ಟೆ</div><div style={subhdrEn}>DFL</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
                        <div style={{ fontSize: "10.5px" }}>ಬೆಳೆ</div><div style={subhdrEn}>Lots/Crop</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#fed7aa,#fdba74)", "#7c2d12")}>
                        <div style={{ fontSize: "10.5px" }}>ಶೇ.</div><div style={subhdrEn}>%</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#a7f3d0,#6ee7b7)", "#064e3b")}>
                        <div style={{ fontSize: "10.5px" }}>ಮೊಟ್ಟೆ</div><div style={subhdrEn}>DFL</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#a7f3d0,#6ee7b7)", "#064e3b")}>
                        <div style={{ fontSize: "10.5px" }}>ಬೆಳೆ</div><div style={subhdrEn}>Lots/Crop</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#a7f3d0,#6ee7b7)", "#064e3b")}>
                        <div style={{ fontSize: "10.5px" }}>ಶೇ.</div><div style={subhdrEn}>%</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ಮೊಟ್ಟೆ</div><div style={subhdrEn}>DFL</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#ddd6fe,#c4b5fd)", "#4c1d95")}>
                        <div style={{ fontSize: "10.5px" }}>ಬೆಳೆ</div><div style={subhdrEn}>Lots/Crop</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#bae6fd,#7dd3fc)", "#0c4a6e")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸ</div><div style={subhdrEn}>Month</div>
                      </th>
                      <th style={subhdr("linear-gradient(135deg,#bae6fd,#7dd3fc)", "#0c4a6e")}>
                        <div style={{ fontSize: "10.5px" }}>ಮಾಸಾಂತ್ಯ</div><div style={subhdrEn}>FY Cum.</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!dataRow && (
                      <tr><td colSpan={11} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.</td></tr>
                    )}
                    {dataRow && (
                      <tr className="ff1-tr" style={{ background: "#ffffff" }}>
                        <td style={td("center", "#475569", 700)}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            minWidth: "30px", height: "30px", borderRadius: "50%",
                            background: "linear-gradient(135deg,#ccfbf1,#5eead4)",
                            color: "#0f766e", fontWeight: 800, fontSize: "12px",
                          }}>{dataRow.sl_no || "1"}</span>
                        </td>
                        <td className="ff1-num" style={td("right", "#7c2d12", 800, "linear-gradient(135deg,#fff7ed,#ffedd5)")}>{fmt(dataRow.prog_dfl)}</td>
                        <td className="ff1-num" style={td("right", "#9a3412", 700, "#fff7ed")}>{fmt(dataRow.prog_crop)}</td>
                        <td className="ff1-num" style={td("right", "#7c2d12", 800, "#ffedd5")}>{fmt(dataRow.prog_pct)}%</td>
                        <td className="ff1-num" style={td("right", "#0f766e", 800, "linear-gradient(135deg,#ecfdf5,#d1fae5)")}>{fmt(dataRow.ach_dfl)}</td>
                        <td className="ff1-num" style={td("right", "#115e59", 700, "#ecfdf5")}>{fmt(dataRow.ach_crop)}</td>
                        <td className="ff1-num" style={td("right",
                          metrics.achPct >= 100 ? "#14532d" : metrics.achPct >= 75 ? "#0f766e" : metrics.achPct >= 50 ? "#92400e" : "#7f1d1d",
                          800,
                          metrics.achPct >= 100 ? "linear-gradient(135deg,#bbf7d0,#86efac)" :
                          metrics.achPct >= 75  ? "linear-gradient(135deg,#a7f3d0,#6ee7b7)" :
                          metrics.achPct >= 50  ? "linear-gradient(135deg,#fde68a,#fcd34d)" :
                                                  "linear-gradient(135deg,#fecaca,#fca5a5)"
                        )}>{fmt(dataRow.ach_pct)}%</td>
                        <td className="ff1-num" style={td("right", "#4c1d95", 800, "linear-gradient(135deg,#f5f3ff,#ede9fe)")}>{fmt(dataRow.fut_dfl)}</td>
                        <td className="ff1-num" style={td("right", "#5b21b6", 700, "#f5f3ff")}>{fmt(dataRow.fut_crop)}</td>
                        <td className="ff1-num" style={td("right", "#0c4a6e", 800, "linear-gradient(135deg,#f0f9ff,#e0f2fe)")}>{fmt(dataRow.avail_m)}</td>
                        <td className="ff1-num" style={td("right", "#075985", 800, "linear-gradient(135deg,#e0f2fe,#bae6fd)")}>{fmt(dataRow.avail_me)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer summary strip */}
              <div style={{ background: "linear-gradient(135deg,#f0fdfa,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #a7f3d0" }}>
                <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                  Form-1 · {farmName} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; Available {fmt(metrics.availM)} (Month) / {fmt(metrics.availMe)} (FY Cum.) &nbsp;·&nbsp; Next-month plan {fmt(metrics.futDfl)} DFL · {fmt(metrics.futCrop)} lots
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

const metricBox = (bg, border, _t) => ({
  background: bg,
  border: `1.5px solid ${border}`,
  borderRadius: "14px",
  padding: "14px 18px",
  height: "100%",
});
const metricBoxLbl = (color) => ({ fontSize: "11px", color, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em" });
const metricBoxVal = (color, sz) => ({ fontSize: `${sz}px`, color, fontWeight: 800, lineHeight: 1.05, marginTop: "4px" });
const metricBoxSub = (color) => ({ fontSize: "11.5px", color, fontWeight: 700, marginTop: "4px" });

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
  minWidth: "100px",
});
const td = (align, color, weight, bg) => ({
  padding: "12px 14px", textAlign: align || "center",
  borderBottom: "1px solid #f1f5f9", borderRight: "1px solid #f8fafc",
  background: bg || "transparent",
  color: color || "#0f172a", fontWeight: weight || 600,
  fontSize: "13.5px",
});

export default FarmForm1ChawkiReport;
