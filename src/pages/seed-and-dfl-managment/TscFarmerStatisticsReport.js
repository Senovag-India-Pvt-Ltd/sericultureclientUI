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

if (!document.getElementById("tscfs-styles")) {
  const s = document.createElement("style");
  s.id = "tscfs-styles";
  s.innerHTML = `
    .tscfs-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tscfs-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tscfs-swal .swal2-icon { margin:20px auto 4px !important; }
    .tscfs-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tscfs-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tscfs-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tscfs-wrap { animation: tscfs-in .35s ease; }
    .tscfs-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tscfs-table th { letter-spacing:.02em; }
    .tscfs-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tscfs-scroll::-webkit-scrollbar { height:9px; }
    .tscfs-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tscfs-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#14b8a6,#5b57ac); border-radius:6px; }
  `;
  document.head.appendChild(s);
}

const sel = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "7px 11px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };

// react-select styles tuned to match the height & look of the other Form.Selects on the page
const tscSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "8px",
    border: state.isFocused ? "1.5px solid #14b8a6" : "1.5px solid #d0d9e8",
    background: "#f8fafd",
    minHeight: "38px",
    fontSize: "13px",
    color: "#333",
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
    ...base,
    fontSize: "13px",
    padding: "8px 12px",
    background: state.isSelected
      ? "linear-gradient(135deg,#0f766e,#14b8a6)"
      : state.isFocused
        ? "#ecfdf5"
        : "#fff",
    color: state.isSelected ? "#fff" : "#0f172a",
    cursor: "pointer",
  }),
};
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

function TscFarmerStatisticsReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ tscId: "", financialYearMasterId: "", month: "" });
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
    if (!fyStartYear)                  return t("Could not determine the financial year start year.", { ns: "reports" });
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: t("Required Fields", { ns: "reports" }),
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">${t("Missing Selection", { ns: "reports" })}</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "tscfs-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close", { ns: "reports" }), confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "tscfs-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { tscId: filter.tscId, year, month: m };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-farmer-stats", { params: params() });
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
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the TSC Farmer Statistics report.", { ns: "reports" }));
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-farmer-stats/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-farmer-stats/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `tsc_farmer_stats_${filter.tscId}_${year}_${m}.xlsx`;
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
  const tscDisplay = selectedTsc?.nameInKannada || selectedTsc?.name || "—";

  // KPI snapshot — pull plain (no sub_label) rows by serial_number
  const kpis = useMemo(() => {
    const find = (sn) => dataRows.find((r) => String(r.serial_number) === String(sn) && (!r.sub_label || r.sub_label === "")) || {};
    return {
      villages:    numOrZero(find(1).cy_month),
      seriVillage: numOrZero(find(2).cy_month),
      farmers:     numOrZero(find(3).cy_month),
      farmersCum:  numOrZero(find(3).cy_cum),
      women:       numOrZero(find(6).cy_month),
      leafBuyers:  numOrZero(find(8).cy_month),
    };
  }, [dataRows]);

  // Annotate rows with kind: section / sub / total / plain
  const enrichedRows = useMemo(() => {
    const counts = {};
    dataRows.forEach((r) => {
      const k = String(r.serial_number);
      counts[k] = (counts[k] || 0) + 1;
    });
    return dataRows.map((r) => {
      const sn = String(r.serial_number);
      const sub = String(r.sub_label || "").trim();
      const grouped = (counts[sn] || 0) > 1;
      // For tsc-farmer-stats: rows where the parent has explicit values AND has children (3, 4)
      // are "plain-with-children" — render them as plain rows but mark children as sub-rows.
      // True section headers (no values + has children) get the dark treatment.
      const has = (k) => String(r[k] ?? "").trim() !== "";
      const noVals = !has("cy_month") && !has("cy_cum") && !has("py_month") && !has("py_cum");
      let kind = "plain";
      if (grouped && sub === "" && noVals) kind = "section";
      else if (sub === "∑")                kind = "total";
      else if (sub !== "")                  kind = "sub";
      else if (grouped && sub === "")       kind = "parent";
      return { ...r, _kind: kind };
    });
  }, [dataRows]);

  return (
    <Layout title={t("TSC Farmer Statistics Report", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ — ರೇಷ್ಮೆ ಬೆಳೆಗಾರರ ಅಂಕಿ ಅಂಶಗಳು")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
                color: "#1e3a8a", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #93c5fd", verticalAlign: "middle",
              }}>ಭಾಗ-1 · Part-1 · Farmer Statistics</span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#5b57ac 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center",
            gap: "12px",
            position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>👨‍🌾</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ — ರೇಷ್ಮೆ ಬೆಳೆಗಾರರ ಅಂಕಿ ಅಂಶಗಳು
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>TSC</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Part-1 · Farmer Statistics — Villages, registrations, caste, gender, holding-size, leaf buyers</div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700, backdropFilter: "blur(6px)" }}>
                  {monthLabel}{monthKn ? ` · ${monthKn}` : ""} {monthYear || ""}
                </span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>{t("TSC")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={tscList.map((tsc) => ({ value: String(tsc.tscMasterId), label: tsc.nameInKannada || tsc.name }))}
                    placeholder={t("— Search TSC —", { ns: "reports" })}
                    isSearchable
                    isClearable
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={tscSelectStyles}
                    value={
                      tscList
                        .map((tsc) => ({ value: String(tsc.tscMasterId), label: tsc.nameInKannada || tsc.name }))
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
                <Col md={3}>
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

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="tscfs-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>TSC</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{tscDisplay}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Period</span>
                <span style={{ fontSize: "14px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಒಟ್ಟು ಗ್ರಾಮಗಳು</span>
                <span className="tscfs-num" style={{ fontSize: "14px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>
                  {kpis.seriVillage.toLocaleString()} <span style={{ fontSize: "11px", color: "#475569", fontWeight: 600 }}>/ {kpis.villages.toLocaleString()}</span>
                </span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಬೆಳೆಗಾರರು (ಮಾಸ / ಒಟ್ಟು)</span>
                <span className="tscfs-num" style={{ fontSize: "14px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>
                  {kpis.farmers.toLocaleString()} / {kpis.farmersCum.toLocaleString()}
                </span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fce7f3,#fdf2f8)", border: "1.5px solid #f9a8d4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "160px" }}>
                <span style={{ fontSize: "11px", color: "#be185d", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಮಹಿಳಾ ಬೆಳೆಗಾರರು</span>
                <span className="tscfs-num" style={{ fontSize: "14px", color: "#831843", fontWeight: 800, marginTop: "2px" }}>{kpis.women.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಸೊಪ್ಪು ಕೊಂಡವರು</span>
                <span className="tscfs-num" style={{ fontSize: "14px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{kpis.leafBuyers.toLocaleString()}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              {/* Title strip */}
              <div style={{
                background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                ಭಾಗ-1 ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ {tscDisplay} — {monthKn} {monthYear || ""} ರೇಷ್ಮೆ ಬೆಳೆಗಾರರ ಅಂಕಿ ಅಂಶಗಳು
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Part-1 · TSC Farmer Statistics &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="tscfs-scroll" style={{ overflowX: "auto" }}>
                <table className="tscfs-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1200px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "55px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "55px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12px" }}>ಉಪ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sub</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#334155,#475569)",
                        color: "#fff", padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "380px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Description</div>
                      </th>
                      <th colSpan={2} style={{
                        background: "linear-gradient(135deg,#0f766e,#14b8a6)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "260px",
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಪ್ರಸಕ್ತ ವರ್ಷ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Current Year</div>
                      </th>
                      <th colSpan={2} style={{
                        background: "linear-gradient(135deg,#4338ca,#6366f1)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "260px",
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಹಿಂದಿನ ವರ್ಷ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Previous Year</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={{
                        background: "linear-gradient(180deg,#14b8a6,#0d9488)",
                        color: "#fff", padding: "8px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                        minWidth: "120px",
                      }}>
                        <div style={{ fontSize: "11px" }}>ಮಾಸ</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "1px" }}>Month</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(180deg,#14b8a6,#0d9488)",
                        color: "#fff", padding: "8px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                        minWidth: "140px",
                      }}>
                        <div style={{ fontSize: "11px" }}>ಮಾಸಾಂತ್ಯ</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "1px" }}>Cumulative</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(180deg,#6366f1,#4f46e5)",
                        color: "#fff", padding: "8px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                        minWidth: "120px",
                      }}>
                        <div style={{ fontSize: "11px" }}>ಮಾಸ</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "1px" }}>Month</div>
                      </th>
                      <th style={{
                        background: "linear-gradient(180deg,#6366f1,#4f46e5)",
                        color: "#fff", padding: "8px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                        minWidth: "140px",
                      }}>
                        <div style={{ fontSize: "11px" }}>ಮಾಸಾಂತ್ಯ</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "1px" }}>Cumulative</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrichedRows.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                    {enrichedRows.map((row, ri) => {
                      const alt = ri % 2 === 1;
                      const k = row._kind;
                      const isSection = k === "section";
                      const isTotal   = k === "total";
                      const isSub     = k === "sub";
                      const isParent  = k === "parent";

                      const rowBg = isSection
                        ? "linear-gradient(135deg,#1e293b,#334155)"
                        : isTotal
                          ? "linear-gradient(135deg,#fde68a,#fef3c7)"
                          : isParent
                            ? "linear-gradient(135deg,#f0fdfa,#ecfdf5)"
                            : (alt ? "#f8fafc" : "#ffffff");

                      const descColor = isSection ? "#fff" : "#0f172a";
                      const valColorCY = isSection ? "#a7f3d0" : "#134e4a";
                      const valColorPY = isSection ? "#c7d2fe" : "#312e81";
                      const valWeight = (isTotal || isSection || isParent) ? 800 : 700;

                      const cyM = row.cy_month;
                      const cyC = row.cy_cum;
                      const pyM = row.py_month;
                      const pyC = row.py_cum;
                      const has = (v) => String(v ?? "").trim() !== "";

                      return (
                        <tr key={`${row.serial_number}-${row.sub_label || ""}-${ri}`} className="tscfs-tr" style={{ background: rowBg }}>
                          <td style={{
                            padding: "10px 8px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            background: isSection ? "rgba(255,255,255,.06)" : "transparent",
                          }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              minWidth: "28px", height: "28px",
                              borderRadius: "50%",
                              background: isSection
                                ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                                : isParent
                                  ? "linear-gradient(135deg,#0f766e,#14b8a6)"
                                  : "linear-gradient(135deg,#475569,#1e293b)",
                              color: isSection ? "#78350f" : "#fff",
                              fontWeight: 800, fontSize: "12px",
                            }}>{row.serial_number}</span>
                          </td>
                          <td style={{
                            padding: "10px 8px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            color: isSection ? "#fef3c7" : (isTotal ? "#78350f" : "#64748b"),
                            fontWeight: 800, fontSize: "12px",
                          }}>
                            {row.sub_label || ""}
                          </td>
                          <td style={{
                            padding: "10px 14px", textAlign: "left",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            color: descColor,
                            fontWeight: (isSection || isTotal || isParent) ? 800 : 600,
                            fontSize: isSection ? "13px" : "12.5px",
                            paddingLeft: (isSub || isTotal) ? "32px" : "14px",
                          }}>
                            {isSub && <span style={{ color: "#94a3b8", marginRight: "6px" }}>↳</span>}
                            {row.description_kannada || "—"}
                          </td>
                          <td className="tscfs-num" style={{
                            padding: "10px 12px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                            background: isSection ? "transparent" : (has(cyM) && numOrZero(cyM) !== 0 ? "#f0fdfa" : "transparent"),
                            color: has(cyM) ? valColorCY : "#cbd5e0",
                            fontWeight: valWeight, fontSize: "12.5px",
                          }}>{has(cyM) ? fmt(cyM) : "—"}</td>
                          <td className="tscfs-num" style={{
                            padding: "10px 12px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                            background: isSection ? "transparent" : (has(cyC) && numOrZero(cyC) !== 0 ? "linear-gradient(135deg,#ccfbf1,#a7f3d0)" : "transparent"),
                            color: has(cyC) ? valColorCY : "#cbd5e0",
                            fontWeight: valWeight, fontSize: "12.5px",
                          }}>{has(cyC) ? fmt(cyC) : "—"}</td>
                          <td className="tscfs-num" style={{
                            padding: "10px 12px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6",
                            background: isSection ? "transparent" : (has(pyM) && numOrZero(pyM) !== 0 ? "#eef2ff" : "transparent"),
                            color: has(pyM) ? valColorPY : "#cbd5e0",
                            fontWeight: valWeight, fontSize: "12.5px",
                          }}>{has(pyM) ? fmt(pyM) : "—"}</td>
                          <td className="tscfs-num" style={{
                            padding: "10px 12px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0",
                            background: isSection ? "transparent" : (has(pyC) && numOrZero(pyC) !== 0 ? "linear-gradient(135deg,#e0e7ff,#c7d2fe)" : "transparent"),
                            color: has(pyC) ? valColorPY : "#cbd5e0",
                            fontWeight: valWeight, fontSize: "12.5px",
                          }}>{has(pyC) ? fmt(pyC) : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {tscDisplay} — {monthLabel} {monthKn} {monthYear}
                  &nbsp;·&nbsp; ಭಾಗ-1 / Part-1 Farmer Statistics
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

export default TscFarmerStatisticsReport;
