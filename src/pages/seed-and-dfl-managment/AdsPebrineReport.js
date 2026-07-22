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

if (!document.getElementById("adspeb-styles")) {
  const s = document.createElement("style");
  s.id = "adspeb-styles";
  s.innerHTML = `
    .adspeb-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .adspeb-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .adspeb-swal .swal2-icon { margin:20px auto 4px !important; }
    .adspeb-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .adspeb-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes adspeb-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .adspeb-wrap { animation: adspeb-in .35s ease; }
    .adspeb-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .adspeb-table th { letter-spacing:.02em; }
    .adspeb-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .adspeb-mono { font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; }
    .adspeb-scroll::-webkit-scrollbar { height:9px; }
    .adspeb-scroll::-webkit-scrollbar-track { background:#fef2f2; border-radius:6px; }
    .adspeb-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#dc2626,#7f1d1d); border-radius:6px; }
    @keyframes adspeb-pulse {
      0%, 100% { box-shadow:0 0 0 0 rgba(220,38,38,.45); }
      50%      { box-shadow:0 0 0 6px rgba(220,38,38,0); }
    }
    .adspeb-status-badge { animation: adspeb-pulse 2.2s ease-out infinite; }
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
    border: state.isFocused ? "1.5px solid #dc2626" : "1.5px solid #d0d9e8",
    background: "#fff5f5",
    minHeight: "38px",
    fontSize: "12.5px",
    color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(220,38,38,.18)" : "none",
    "&:hover": { border: "1.5px solid #dc2626" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "12.5px" }),
  multiValue: (base) => ({
    ...base,
    background: "linear-gradient(135deg,#fee2e2,#fecaca)",
    borderRadius: "10px",
    border: "1px solid #fca5a5",
  }),
  multiValueLabel: (base) => ({ ...base, color: "#7f1d1d", fontWeight: 700, fontSize: "11.5px", padding: "2px 6px" }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#991b1b",
    ":hover": { background: "#fca5a5", color: "#7f1d1d" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#991b1b" }),
  clearIndicator: (base) => ({ ...base, padding: "4px 6px", color: "#991b1b" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(220,38,38,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base,
    fontSize: "12.5px",
    padding: "8px 12px",
    background: state.isSelected
      ? "linear-gradient(135deg,#7f1d1d,#dc2626)"
      : state.isFocused
        ? "#fef2f2"
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

// Status badge styling — pebrine_status comes from preparation_of_eggs.test_results.
// Diseased is the SQL filter, but we pattern-match flexibly so other backend states render too.
const STATUS_STYLE = (status) => {
  const s = String(status || "").trim().toLowerCase();
  if (s.includes("disease") && !s.includes("free")) {
    return { bg: "linear-gradient(135deg,#fecaca,#fca5a5)", color: "#7f1d1d", icon: "🦠", pulse: true,  label: status || "Diseased" };
  }
  if (s.includes("free")) {
    return { bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d", icon: "✅", pulse: false, label: status || "Disease-Free" };
  }
  if (!status) {
    return { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#475569", icon: "·", pulse: false, label: "—" };
  }
  return { bg: "linear-gradient(135deg,#fed7aa,#fdba74)", color: "#7c2d12", icon: "⚠️", pulse: false, label: status };
};

function AdsPebrineReport() {
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
      background: "#fff", customClass: { popup: "adspeb-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "adspeb-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-pebrine", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the ADS Pebrine Cases report.");
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-pebrine/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/ads-pebrine/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `ads_pebrine_${year}_${m}.xlsx`;
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

  const totals = useMemo(() => {
    // Exclude the backend grand-total (ಒಟ್ಟು) row so figures are not double-counted.
    const det = dataRows.filter((r) => String(r.lot_no).trim() !== "ಒಟ್ಟು");
    const sum = (k) => det.reduce((a, r) => a + numOrZero(r[k]), 0);
    return {
      cases:       det.length,
      supplied:    sum("supplied_cocoons"),
      suitable:    sum("suitable_cocoons"),
      joints:      sum("joints"),
      dflsPrep:    sum("dfls_prepared"),
      pebrineCount: sum("moths_examined"),
      burnedDfls:  sum("burned_dfls"),
    };
  }, [dataRows]);

  // Detail rows only (exclude the backend grand-total ಒಟ್ಟು row); the footer below
  // renders the single grand total, so the total never appears twice.
  const detRows = dataRows.filter((r) => String(r.lot_no).trim() !== "ಒಟ್ಟು");

  return (
    <Layout title={t("ADS · Pebrine Cases Detail Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ADS · ಗಂಟು ರೋಗದ ಪ್ರಕರಣಗಳ ವರದಿ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#fecaca,#fca5a5)",
                color: "#7f1d1d", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #f87171", verticalAlign: "middle",
              }}>ADS · Pebrine · Diseased Lots</span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(127,29,29,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#7f1d1d 0%,#dc2626 50%,#9f1239 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center",
            gap: "12px",
            position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🦠</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ADS · ಗಂಟು ರೋಗದ ಪ್ರಕರಣಗಳ ವರದಿ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>Pebrine</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Pebrine Cases Detail — Lot-level listing of diseased preparation_of_eggs records</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                <span style={{
                  background: totals.cases > 0 ? "rgba(254,202,202,.30)" : "rgba(255,255,255,.22)",
                  borderRadius: "20px", padding: "4px 12px",
                  color: "#fff", fontSize: "11px", fontWeight: 800, backdropFilter: "blur(6px)",
                  border: totals.cases > 0 ? "1px solid rgba(254,202,202,.6)" : "none",
                }}>
                  {totals.cases > 0 ? "🦠 " : ""}{totals.cases} case{totals.cases === 1 ? "" : "s"}
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#fff5f5)" }}>
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
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#7f1d1d,#dc2626)", "0 4px 12px rgba(127,29,29,.32)", isLoading)}>
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
          <div className="adspeb-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{
                background: totals.cases > 0
                  ? "linear-gradient(135deg,#fecaca,#fee2e2)"
                  : "linear-gradient(135deg,#bbf7d0,#dcfce7)",
                border: totals.cases > 0 ? "1.5px solid #f87171" : "1.5px solid #86efac",
                borderRadius: "12px", padding: "10px 18px",
                display: "flex", flexDirection: "column", minWidth: "180px",
              }}>
                <span style={{
                  fontSize: "11px",
                  color: totals.cases > 0 ? "#7f1d1d" : "#166534",
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em",
                }}>
                  {totals.cases > 0 ? "🦠 ಪ್ರಕರಣಗಳು Cases" : "✅ ಪ್ರಕರಣಗಳಿಲ್ಲ No Cases"}
                </span>
                <span className="adspeb-num" style={{
                  fontSize: "18px",
                  color: totals.cases > 0 ? "#7f1d1d" : "#14532d",
                  fontWeight: 800, marginTop: "2px",
                }}>{totals.cases.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Period</span>
                <span style={{ fontSize: "13.5px", color: "#78350f", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fed7aa,#fff7ed)", border: "1.5px solid #fdba74", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#9a3412", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಸರಬರಾಜು ಗೂಡುಗಳು</span>
                <span className="adspeb-num" style={{ fontSize: "15px", color: "#7c2d12", fontWeight: 800, marginTop: "2px" }}>{totals.supplied.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಯೋಗ್ಯ ಗೂಡುಗಳು</span>
                <span className="adspeb-num" style={{ fontSize: "15px", color: "#0c4a6e", fontWeight: 800, marginTop: "2px" }}>{totals.suitable.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0e7ff,#eef2ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಜೊತೆಗಳು Joints</span>
                <span className="adspeb-num" style={{ fontSize: "15px", color: "#312e81", fontWeight: 800, marginTop: "2px" }}>{totals.joints.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fecdd3,#fff1f2)", border: "1.5px solid #fda4af", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#9f1239", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ತಯಾರಿಸಿದ ಮೊಟ್ಟೆ</span>
                <span className="adspeb-num" style={{ fontSize: "15px", color: "#881337", fontWeight: 800, marginTop: "2px" }}>{totals.dflsPrep.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fee2e2,#fecaca)", border: "1.5px solid #f87171", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#7f1d1d", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>🔥 ನಾಶಪಡಿಸಿದ ಮೊಟ್ಟೆ Burned</span>
                <span className="adspeb-num" style={{ fontSize: "16px", color: "#7f1d1d", fontWeight: 800, marginTop: "2px" }}>{totals.burnedDfls.toLocaleString()}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(127,29,29,.12)", overflow: "hidden" }}>
              {/* Title strip */}
              <div style={{
                background: "linear-gradient(135deg,#450a0a,#7f1d1d 50%,#dc2626)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ADS · ಗಂಟು ರೋಗದ ಪ್ರಕರಣಗಳ ವರದಿ &nbsp;·&nbsp; {monthKn} {monthYear || ""}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Pebrine Cases Detail &nbsp;·&nbsp; {monthLabel} {monthYear || ""} &nbsp;·&nbsp; preparation_of_eggs · test_results = Diseased
                </div>
              </div>

              <div className="adspeb-scroll" style={{ overflowX: "auto" }}>
                <table className="adspeb-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1700px" }}>
                  <thead>
                    <tr>
                      <th style={hdrStyle("linear-gradient(135deg,#1e293b,#36506b)", "60px")}>
                        <div style={{ fontSize: "11.5px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={hdrEn}>Sl.No</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#7f1d1d,#dc2626)", "120px")}>
                        <div style={{ fontSize: "12px" }}>ತಂಡ ಸಂಖ್ಯೆ</div>
                        <div style={hdrEn}>Lot No</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#9a3412,#ea580c)", "130px")}>
                        <div style={{ fontSize: "12px" }}>ಸರಬರಾಜು ಗೂಡುಗಳು</div>
                        <div style={hdrEn}>Supplied</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#9a3412,#ea580c)", "120px")}>
                        <div style={{ fontSize: "12px" }}>ವಿಭಜಿತ ತಂಡ</div>
                        <div style={hdrEn}>Divided Lot</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#0369a1,#0284c7)", "130px")}>
                        <div style={{ fontSize: "12px" }}>ಯೋಗ್ಯ ಗೂಡುಗಳು</div>
                        <div style={hdrEn}>Suitable</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#0369a1,#0284c7)", "130px")}>
                        <div style={{ fontSize: "12px" }}>ಹಣ್ಣಾದ ದಿನಾಂಕ</div>
                        <div style={hdrEn}>Ripe Date</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#475569,#64748b)", "120px")}>
                        <div style={{ fontSize: "12px" }}>ಮೂಲ ತಳಿ</div>
                        <div style={hdrEn}>Source Race</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#475569,#64748b)", "150px")}>
                        <div style={{ fontSize: "12px" }}>ರೈತರ ಹೆಸರು</div>
                        <div style={hdrEn}>Farmer Name</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#3730a3,#4f46e5)", "130px")}>
                        <div style={{ fontSize: "12px" }}>ಮೊಟ್ಟೆ ಇಟ್ಟ ದಿನಾಂಕ</div>
                        <div style={hdrEn}>Laid Date</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#3730a3,#4f46e5)", "100px")}>
                        <div style={{ fontSize: "12px" }}>ಜೊತೆಗಳು</div>
                        <div style={hdrEn}>Joints</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#3730a3,#4f46e5)", "120px")}>
                        <div style={{ fontSize: "12px" }}>ತಯಾರಿಸಿದ ಮೊಟ್ಟೆ</div>
                        <div style={hdrEn}>DFLs Prepared</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#7f1d1d,#dc2626)", "150px")}>
                        <div style={{ fontSize: "12px" }}>ಗಂಟುರೋಗ ಗೋಚರಿಸಿದ ದಿನಾಂಕ</div>
                        <div style={hdrEn}>Detected Date</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#9f1239,#e11d48)", "120px")}>
                        <div style={{ fontSize: "12px" }}>ಗಂಟುರೋಗ ಚಿಟ್ಟೆಗಳ ಸಂಖ್ಯೆ</div>
                        <div style={hdrEn}>Moths Examined</div>
                      </th>
                      <th style={hdrStyle("linear-gradient(135deg,#7f1d1d,#991b1b)", "140px")}>
                        <div style={{ fontSize: "12px" }}>🔥 ನಾಶಪಡಿಸಿದ ಮೊಟ್ಟೆ</div>
                        <div style={hdrEn}>Burned DFLs</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr>
                        <td colSpan={14} style={{ padding: "60px 20px", textAlign: "center", background: "linear-gradient(180deg,#ecfdf5,#fff)", borderTop: "1px solid #f1f5f9" }}>
                          <div style={{ fontSize: "44px", marginBottom: "10px" }}>✅</div>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: "#14532d", marginBottom: "4px" }}>ಯಾವುದೇ ಗಂಟು ರೋಗದ ಪ್ರಕರಣಗಳಿಲ್ಲ</div>
                          <div style={{ fontSize: "13px", color: "#166534", fontWeight: 600 }}>No pebrine cases found in this period — all lots are disease-free.</div>
                        </td>
                      </tr>
                    )}
                    {detRows.map((row, ri) => {
                      const alt = ri % 2 === 1;
                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="adspeb-tr" style={{ background: alt ? "#fafafa" : "#ffffff" }}>
                          <td style={td("center", "70px")}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "30px", height: "30px", borderRadius: "50%",
                              background: "linear-gradient(135deg,#1e293b,#475569)",
                              color: "#fff", fontWeight: 800, fontSize: "11.5px",
                            }}>{row.sl_no || (ri + 1)}</span>
                          </td>
                          <td style={td("left")}>
                            <span className="adspeb-mono" style={{
                              display: "inline-block", padding: "4px 10px", borderRadius: "8px",
                              background: "linear-gradient(135deg,#fee2e2,#fecaca)",
                              color: "#7f1d1d", fontWeight: 800, fontSize: "12px",
                              border: "1px solid #fca5a5",
                            }}>{row.lot_no || "—"}</span>
                          </td>
                          <td className="adspeb-num" style={td("right", null, "#7c2d12", 700)}>
                            {numOrZero(row.supplied_cocoons) ? fmt(row.supplied_cocoons) : "—"}
                          </td>
                          <td style={td("center")}>
                            {row.divided_lot ? (
                              <span className="adspeb-mono" style={{
                                display: "inline-block", padding: "3px 8px", borderRadius: "6px",
                                background: "#fff7ed", color: "#7c2d12", fontWeight: 700, fontSize: "11.5px",
                                border: "1px solid #fdba74",
                              }}>{row.divided_lot}</span>
                            ) : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td className="adspeb-num" style={td("right", null, "#075985", 700)}>
                            {numOrZero(row.suitable_cocoons) ? fmt(row.suitable_cocoons) : "—"}
                          </td>
                          <td style={td("center", null, "#0c4a6e", 700)}>
                            {row.ripe_date ? (
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: "4px",
                                fontSize: "12px",
                              }}>
                                <span style={{ color: "#0284c7" }}>📅</span>
                                {row.ripe_date}
                              </span>
                            ) : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td style={td("left", null, "#475569", 600)}>
                            {row.source_race
                              ? row.source_race
                              : <span style={{ color: "#cbd5e0", fontStyle: "italic", fontSize: "11.5px" }}>—</span>}
                          </td>
                          <td style={td("left", null, "#475569", 600)}>
                            {row.farmer_name
                              ? row.farmer_name
                              : <span style={{ color: "#cbd5e0", fontStyle: "italic", fontSize: "11.5px" }}>—</span>}
                          </td>
                          <td style={td("center", null, "#312e81", 700)}>
                            {row.laid_date ? (
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: "4px",
                                fontSize: "12px",
                              }}>
                                <span style={{ color: "#6366f1" }}>📅</span>
                                {row.laid_date}
                              </span>
                            ) : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td className="adspeb-num" style={td("right", null, "#312e81", 700)}>
                            {numOrZero(row.joints) ? fmt(row.joints) : "—"}
                          </td>
                          <td className="adspeb-num" style={td("right", null, "#3730a3", 800)}>
                            {numOrZero(row.dfls_prepared) ? fmt(row.dfls_prepared) : "—"}
                          </td>
                          <td style={td("center", null, "#7f1d1d", 700)}>
                            {row.detected_date ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                                <span style={{ color: "#dc2626" }}>📅</span>
                                {row.detected_date}
                              </span>
                            ) : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          <td className="adspeb-num" style={td("right", null, "#9f1239", 800, "linear-gradient(135deg,#fff1f2,#ffe4e6)")}>
                            {numOrZero(row.moths_examined) ? fmt(row.moths_examined) : "—"}
                          </td>
                          <td className="adspeb-num" style={td("right", null, "#7f1d1d", 800, "linear-gradient(135deg,#fee2e2,#fecaca)")}>
                            {numOrZero(row.burned_dfls) ? fmt(row.burned_dfls) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                    {detRows.length > 0 && (
                      <tr style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)" }}>
                        <td colSpan={2} style={{
                          padding: "13px 16px", textAlign: "right",
                          color: "#78350f", fontWeight: 800, fontSize: "13px",
                          borderTop: "2px solid #f59e0b",
                        }}>
                          ಒಟ್ಟು &nbsp;/&nbsp; Grand Total
                        </td>
                        <td className="adspeb-num" style={ftd("#7c2d12")}>{fmt(totals.supplied)}</td>
                        <td style={ftd()}>—</td>
                        <td className="adspeb-num" style={ftd("#075985")}>{fmt(totals.suitable)}</td>
                        <td style={ftd()}>—</td>
                        <td style={ftd()}>—</td>
                        <td style={ftd()}>—</td>
                        <td style={ftd()}>—</td>
                        <td className="adspeb-num" style={ftd("#312e81")}>{fmt(totals.joints)}</td>
                        <td className="adspeb-num" style={ftd("#3730a3")}>{fmt(totals.dflsPrep)}</td>
                        <td style={ftd()}>—</td>
                        <td className="adspeb-num" style={ftd("#9f1239")}>{fmt(totals.pebrineCount)}</td>
                        <td className="adspeb-num" style={ftd("#7f1d1d")}>{fmt(totals.burnedDfls)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#fef2f2,#fff1f2)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #fecaca" }}>
                <span style={{ fontSize: "12px", color: "#7f1d1d", fontWeight: 600 }}>
                  ADS · Pebrine — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {totals.cases} case{totals.cases === 1 ? "" : "s"} &nbsp;·&nbsp; {fmt(totals.burnedDfls)} DFLs burned
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

const hdrEn = { fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" };
const hdrStyle = (bg, minW) => ({
  background: bg, color: "#fff",
  padding: "10px 8px", textAlign: "center",
  border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
  minWidth: minW || "100px", whiteSpace: "nowrap",
});
const td = (align, minW, color, weight, bg) => ({
  padding: "10px 10px",
  textAlign: align || "center",
  borderBottom: "1px solid #f1f5f9",
  borderRight: "1px solid #f8fafc",
  background: bg || "transparent",
  color: color || "#0f172a",
  fontWeight: weight || 600,
  fontSize: "12.5px",
  minWidth: minW || undefined,
});
const ftd = (color) => ({
  padding: "13px 10px", textAlign: "right",
  color: color || "#78350f", fontWeight: 800, fontSize: "12.5px",
  borderTop: "2px solid #f59e0b",
  borderRight: "1px solid #fcd34d",
});

export default AdsPebrineReport;
