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
//   W1 : previous month 24..end (8 days, may overlap month boundary)
//   W2 : 1..7    (current month)
//   W3 : 8..15
//   W4 : 16..23
const WEEKS = [
  { value: 1, label: "Week 1", kn: "1ನೇ ವಾರ", hint: "24 → end of prev. month" },
  { value: 2, label: "Week 2", kn: "2ನೇ ವಾರ", hint: "1 → 7" },
  { value: 3, label: "Week 3", kn: "3ನೇ ವಾರ", hint: "8 → 15" },
  { value: 4, label: "Week 4", kn: "4ನೇ ವಾರ", hint: "16 → 23" },
];

if (!document.getElementById("tscdcw-styles")) {
  const s = document.createElement("style");
  s.id = "tscdcw-styles";
  s.innerHTML = `
    .tscdcw-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tscdcw-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tscdcw-swal .swal2-icon { margin:20px auto 4px !important; }
    .tscdcw-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tscdcw-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tscdcw-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tscdcw-wrap { animation: tscdcw-in .35s ease; }
    .tscdcw-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tscdcw-table th { letter-spacing:.02em; }
    .tscdcw-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tscdcw-scroll::-webkit-scrollbar { height:9px; }
    .tscdcw-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tscdcw-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#2563eb,#7c3aed); border-radius:6px; }
    .tscdcw-week-pill { transition: transform .12s ease, box-shadow .12s ease; }
    .tscdcw-week-pill:hover { transform: translateY(-1px); }
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
    border: state.isFocused ? "1.5px solid #2563eb" : "1.5px solid #d0d9e8",
    background: "#f8fafd",
    minHeight: "38px",
    fontSize: "13px",
    color: "#333",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(37,99,235,.15)" : "none",
    "&:hover": { border: "1.5px solid #2563eb" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 9px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "#333" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "13px" }),
  singleValue: (base) => ({ ...base, color: "#0f172a", fontWeight: 600 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#64748b" }),
  menu: (base) => ({ ...base, borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(37,99,235,.18)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: "260px" }),
  option: (base, state) => ({
    ...base,
    fontSize: "13px",
    padding: "8px 12px",
    background: state.isSelected
      ? "linear-gradient(135deg,#1d4ed8,#2563eb)"
      : state.isFocused
        ? "#eff6ff"
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

// Tier badge palette — distinct colors per tier so the rows scan instantly
const TIER_STYLE = {
  "P1":   { bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1e3a8a", icon: "①" },
  "P2":   { bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", color: "#5b21b6", icon: "②" },
  "ಒಟ್ಟು": { bg: "linear-gradient(135deg,#fde68a,#fcd34d)", color: "#78350f", icon: "Σ" },
};
const tierStyleFor = (tier) => TIER_STYLE[String(tier).trim()] ||
  { bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#334155", icon: "·" };

function TscDailyChawkiWeekReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ tscId: "", financialYearMasterId: "", month: "", week: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [tscList,           setTscList]           = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  const [dataRows,           setDataRows]           = useState([]);
  const [hasReport,          setHasReport]          = useState(false);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isDownloadingPdf,   setIsDownloadingPdf]   = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "tscMaster/get-all")
      .then((r) => setTscList(r.data.content.tscMaster || []))
      .catch(() => setTscList([]));

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
    if (!filter.tscId)                 return t("Please select a TSC.", { ns: "reports" });
    if (!filter.financialYearMasterId) return t("Please select a Financial Year.", { ns: "reports" });
    if (!filter.month)                 return t("Please select a Month.", { ns: "reports" });
    if (!filter.week)                  return t("Please select a Week.", { ns: "reports" });
    if (!fyStartYear)                  return t("Could not determine the financial year start year.", { ns: "reports" });
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: t("Required Fields", { ns: "reports" }),
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">${t("Missing Selection", { ns: "reports" })}</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "tscdcw-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "tscdcw-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { tscId: filter.tscId, year, month: m, week: Number(filter.week) };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-daily-chawki-week", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the TSC Daily Chawki Weekly report.", { ns: "reports" }));
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-daily-chawki-week/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-daily-chawki-week/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `tsc_daily_chawki_week_${filter.tscId}_${year}_${m}_w${filter.week}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" }));
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedTsc = tscList.find((g) => String(g.tscMasterId) === String(filter.tscId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const tscDisplay = selectedTsc?.name || "—";
  const weekKn     = WEEKS.find((w) => String(w.value) === String(filter.week))?.kn || "";

  // Day labels are uniform across the 3 rows — pull from the first row.
  const dayLabels = useMemo(() => {
    const r0 = dataRows[0] || {};
    return Array.from({ length: 8 }, (_, i) => String(r0[`d${i + 1}_date`] ?? "").trim());
  }, [dataRows]);

  // KPIs from the ಒಟ್ಟು (Total) row
  const totals = useMemo(() => {
    const tot = dataRows.find((r) => String(r.tier).trim() === "ಒಟ್ಟು") || {};
    const p1  = dataRows.find((r) => String(r.tier).trim() === "P1") || {};
    const p2  = dataRows.find((r) => String(r.tier).trim() === "P2") || {};
    return {
      week: numOrZero(tot.week_total_dfl),
      cum:  numOrZero(tot.cum_total_dfl),
      p1Week: numOrZero(p1.week_total_dfl),
      p2Week: numOrZero(p2.week_total_dfl),
    };
  }, [dataRows]);

  // Render order: P1, P2, Total — tolerate any backend order.
  const orderedRows = useMemo(() => {
    const order = { "P1": 0, "P2": 1, "ಒಟ್ಟು": 2 };
    return [...dataRows].sort(
      (a, b) => (order[String(a.tier).trim()] ?? 99) - (order[String(b.tier).trim()] ?? 99)
    );
  }, [dataRows]);

  return (
    <Layout title={t("TSC Daily Chawki Weekly Report", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ — ದಿನವಹಿ ಚಾಕಿ ವಾರದ ವರದಿ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#dbeafe,#c7d2fe)",
                color: "#1e3a8a", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #93c5fd", verticalAlign: "middle",
              }}>TSC · Daily × 8 Days</span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(30,58,138,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#1e40af 0%,#2563eb 50%,#7c3aed 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center",
            gap: "12px",
            position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📆</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ರೇಷ್ಮೆ ಉಪ ನಿರ್ದೇಶಕರು — ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ ದಿನವಹಿ ಚಾಕಿ ವಾರದ ವರದಿ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>TSC</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Daily Chawki DFLs distributed to farmers — P1 / P2 across 8 days of the selected week</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
                {weekKn && (
                  <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                    {weekKn}
                  </span>
                )}
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fafe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>{t("TSC")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={tscList.map((tsc) => ({ value: String(tsc.tscMasterId), label: tsc.name }))}
                    placeholder={t("— Search TSC —", { ns: "reports" })}
                    isSearchable
                    isClearable
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={tscSelectStyles}
                    value={
                      tscList
                        .map((tsc) => ({ value: String(tsc.tscMasterId), label: tsc.name }))
                        .find((o) => o.value === String(filter.tscId)) || null
                    }
                    onChange={(opt) => {
                      setFilter((p) => ({ ...p, tscId: opt?.value || "" }));
                      setHasReport(false);
                      setDataRows([]);
                    }}
                    noOptionsMessage={() => t("No TSC found", { ns: "reports" })}
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
                <Col md={2}>
                  <label style={lbl}>{t("Week", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="week" value={filter.week} onChange={handleChange} style={sel}>
                    <option value="">{t("— Week —", { ns: "reports" })}</option>
                    {WEEKS.map((w) => (
                      <option key={w.value} value={w.value}>{w.label} ({w.hint})</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#1e40af,#2563eb)", "0 4px 12px rgba(30,64,175,.32)", isLoading)}>
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

              {/* Week quick-pick chips (mirror the dropdown for one-tap selection) */}
              <div className="d-flex flex-wrap gap-2 mt-3">
                {WEEKS.map((w) => {
                  const active = String(filter.week) === String(w.value);
                  return (
                    <button
                      key={w.value}
                      type="button"
                      className="tscdcw-week-pill"
                      onClick={() => {
                        setFilter((p) => ({ ...p, week: String(w.value) }));
                        setHasReport(false);
                        setDataRows([]);
                      }}
                      style={{
                        border: active ? "1.5px solid #2563eb" : "1.5px solid #d0d9e8",
                        background: active
                          ? "linear-gradient(135deg,#1e40af,#2563eb)"
                          : "linear-gradient(135deg,#ffffff,#f1f5f9)",
                        color: active ? "#fff" : "#1e293b",
                        borderRadius: "999px",
                        padding: "6px 14px",
                        fontWeight: 700,
                        fontSize: "12px",
                        boxShadow: active ? "0 4px 12px rgba(37,99,235,.28)" : "none",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: "20px", height: "20px", borderRadius: "50%",
                        background: active ? "rgba(255,255,255,.22)" : "linear-gradient(135deg,#1e40af,#2563eb)",
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

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="tscdcw-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#1e40af", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("TSC")}</span>
                <span style={{ fontSize: "13.5px", color: "#0f172a", fontWeight: 700, marginTop: "2px" }}>{tscDisplay}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>{t("Period", { ns: "reports" })}</span>
                <span style={{ fontSize: "13.5px", color: "#0c4a6e", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear} · W{filter.week}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#1e40af", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>P1 ವಾರ</span>
                <span className="tscdcw-num" style={{ fontSize: "15px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{totals.p1Week.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#6d28d9", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>P2 ವಾರ</span>
                <span className="tscdcw-num" style={{ fontSize: "15px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{totals.p2Week.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ವಾರದಲ್ಲಿ ಒಟ್ಟು</span>
                <span className="tscdcw-num" style={{ fontSize: "16px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{totals.week.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ವಾರಾಂತ್ಯ ಒಟ್ಟು (FY Cum.)</span>
                <span className="tscdcw-num" style={{ fontSize: "16px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{totals.cum.toLocaleString()}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(30,58,138,.12)", overflow: "hidden" }}>
              {/* Title strip */}
              <div style={{
                background: "linear-gradient(135deg,#1e3a8a,#2563eb 50%,#7c3aed)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ರೇಷ್ಮೆ ಉಪ ನಿರ್ದೇಶಕರು · ತಾ.ಸೇ.ಕೇ. {tscDisplay} · {monthKn}-{monthYear || ""} · {weekKn} ದಿನವಹಿ ಚಾಕಿ ವರದಿ
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Daily Chawki Weekly Report &nbsp;·&nbsp; {monthLabel} {monthYear || ""} &nbsp;·&nbsp; Week {filter.week}
                </div>
              </div>

              <div className="tscdcw-scroll" style={{ overflowX: "auto" }}>
                <table className="tscdcw-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1300px" }}>
                  <thead>
                    <tr>
                      <th style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "10px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "55px",
                      }}>
                        <div style={{ fontSize: "12px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.No</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(135deg,#334155,#475569)",
                        color: "#fff", padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "200px",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>TSC</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(135deg,#475569,#64748b)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "85px",
                      }}>
                        <div style={{ fontSize: "12px" }}>ತಳಿ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Tier</div>
                      </th>
                      {dayLabels.map((d, i) => {
                        const blank = !d || d === "—";
                        return (
                          <th key={`d-${i}`} style={{
                            background: blank
                              ? "linear-gradient(135deg,#94a3b8,#cbd5e1)"
                              : "linear-gradient(135deg,#1d4ed8,#3b82f6)",
                            color: "#fff", padding: "10px 6px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: "98px",
                            opacity: blank ? .65 : 1,
                          }}>
                            <div style={{ fontSize: "11.5px" }}>{`Day ${i + 1}`}</div>
                            <div style={{ fontSize: "10.5px", fontWeight: 700, opacity: .92, marginTop: "2px" }}>
                              {blank ? "—" : d}
                            </div>
                          </th>
                        );
                      })}
                      <th style={{
                        background: "linear-gradient(135deg,#5b21b6,#7c3aed)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "115px",
                      }}>
                        <div style={{ fontSize: "12px" }}>ವಾರದಲ್ಲಿ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Week Total</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(135deg,#4338ca,#6366f1)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "115px",
                      }}>
                        <div style={{ fontSize: "12px" }}>ವಾರಾಂತ್ಯ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Cumulative</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderedRows.length === 0 && (
                      <tr>
                        <td colSpan={13} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                    {orderedRows.map((row, ri) => {
                      const tier = String(row.tier || "").trim();
                      const isTotal = tier === "ಒಟ್ಟು";
                      const tierMeta = tierStyleFor(tier);
                      const rowBg = isTotal
                        ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                        : (ri % 2 === 0 ? "#ffffff" : "#f8fafc");

                      return (
                        <tr key={`${tier}-${ri}`} className="tscdcw-tr" style={{ background: rowBg }}>
                          {ri === 0 ? (
                            <td rowSpan={orderedRows.length} style={{
                              padding: "10px 6px", textAlign: "center",
                              borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                              background: "linear-gradient(135deg,#1e293b,#334155)",
                              verticalAlign: "middle",
                            }}>
                              <span style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                minWidth: "28px", height: "28px", borderRadius: "50%",
                                background: "linear-gradient(135deg,#fef3c7,#fde68a)",
                                color: "#78350f", fontWeight: 800, fontSize: "12px",
                              }}>{row.sl_no || (ri + 1)}</span>
                            </td>
                          ) : null}
                          {ri === 0 ? (
                            <td rowSpan={orderedRows.length} style={{
                              padding: "10px 14px", textAlign: "left",
                              borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                              background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
                              color: "#0f172a", fontWeight: 800, fontSize: "13px",
                              verticalAlign: "middle",
                            }}>
                              {row.tsc_name || tscDisplay || "—"}
                            </td>
                          ) : null}
                          <td style={{
                            padding: "10px 6px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "2px solid #e2e8f0",
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "6px",
                              padding: "4px 12px", borderRadius: "999px",
                              background: tierMeta.bg,
                              color: tierMeta.color, fontWeight: 800, fontSize: "11.5px",
                            }}>
                              <span style={{ fontSize: "12.5px", lineHeight: 1 }}>{tierMeta.icon}</span>
                              {tier || "—"}
                            </span>
                          </td>
                          {Array.from({ length: 8 }).map((_, i) => {
                            const v = row[`d${i + 1}_dfl`];
                            const dateLabel = dayLabels[i];
                            const has = String(v ?? "").trim() !== "" && numOrZero(v) !== 0;
                            const blankDay = !dateLabel;
                            return (
                              <td key={`v-${i}`} className="tscdcw-num" style={{
                                padding: "10px 6px", textAlign: "center",
                                borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                                background: isTotal
                                  ? "transparent"
                                  : (blankDay
                                      ? "#f8fafc"
                                      : (has ? "#eff6ff" : "transparent")),
                                color: blankDay
                                  ? "#cbd5e0"
                                  : (isTotal ? "#78350f" : (has ? "#1e3a8a" : "#cbd5e0")),
                                fontWeight: isTotal ? 800 : (has ? 700 : 600),
                                fontSize: "12.5px",
                              }}>
                                {blankDay ? "—" : (has ? fmt(v) : "0")}
                              </td>
                            );
                          })}
                          <td className="tscdcw-num" style={{
                            padding: "10px 8px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                            background: isTotal
                              ? "linear-gradient(135deg,#fde68a,#fcd34d)"
                              : "linear-gradient(135deg,#ede9fe,#ddd6fe)",
                            color: isTotal ? "#78350f" : "#5b21b6",
                            fontWeight: 800, fontSize: "13px",
                          }}>
                            {fmt(row.week_total_dfl ?? 0)}
                          </td>
                          <td className="tscdcw-num" style={{
                            padding: "10px 8px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0",
                            background: isTotal
                              ? "linear-gradient(135deg,#fcd34d,#fbbf24)"
                              : "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
                            color: isTotal ? "#78350f" : "#312e81",
                            fontWeight: 800, fontSize: "13px",
                          }}>
                            {fmt(row.cum_total_dfl ?? 0)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#eff6ff,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#1e40af", fontWeight: 600 }}>
                  {tscDisplay} — {monthLabel} {monthKn} {monthYear} &nbsp;·&nbsp; {weekKn}
                  &nbsp;·&nbsp; Daily Chawki × 8 Days
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

export default TscDailyChawkiWeekReport;
