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

if (!document.getElementById("tsccw-styles")) {
  const s = document.createElement("style");
  s.id = "tsccw-styles";
  s.innerHTML = `
    .tsccw-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tsccw-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tsccw-swal .swal2-icon { margin:20px auto 4px !important; }
    .tsccw-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tsccw-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tsccw-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tsccw-wrap { animation: tsccw-in .35s ease; }
    .tsccw-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tsccw-table th { letter-spacing:.02em; }
    .tsccw-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tsccw-scroll::-webkit-scrollbar { height:9px; }
    .tsccw-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tsccw-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#14b8a6,#5b57ac); border-radius:6px; }
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

// 10 numeric value keys: target W1..W4 + total, then achievement W1..W4 + total
const VAL_KEYS = ["t_w1", "t_w2", "t_w3", "t_w4", "t_tot",
                  "a_w1", "a_w2", "a_w3", "a_w4", "a_tot"];

function TscChawkiCocoonWeeklyReport() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState({ tscId: "", grainageId: "", financialYearMasterId: "", month: "" });
  const [fyStartYear, setFyStartYear] = useState(null);

  const [tscList,           setTscList]           = useState([]);
  const [grainageList,      setGrainageList]      = useState([]);
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

    api.get(baseURL + "grainageMaster/get-all")
      .then((r) => setGrainageList(r.data.content.grainageMaster || []))
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
    if (!filter.tscId)                 return "Please select a TSC.";
    if (!filter.grainageId)            return "Please select a Grainage.";
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
      background: "#fff", customClass: { popup: "tsccw-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "tsccw-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { tscId: filter.tscId, grainageId: filter.grainageId, year, month: m };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-chawki-cocoon-weekly", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the TSC Chawki Cocoon Weekly report.");
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-chawki-cocoon-weekly/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-chawki-cocoon-weekly/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `tsc_chawki_cocoon_weekly_${filter.tscId}_${filter.grainageId}_${year}_${m}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr("Excel Failed", "Could not generate the Excel report.");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedTsc = tscList.find((g) => String(g.tscMasterId) === String(filter.tscId));
  const selectedGrainage = grainageList.find((g) => String(g.grainageMasterId) === String(filter.grainageId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const tscDisplay = selectedTsc?.nameInKannada || selectedTsc?.name || "—";
  const grainageDisplay = selectedGrainage?.grainageMasterName || "—";
  const fyLabel = fyStartYear ? `${fyStartYear}-${String(fyStartYear + 1).slice(-2)}` : "";

  // Group by serial_number; first row of each group gets the description rowSpan
  const grouped = useMemo(() => {
    const groups = {};
    const order = [];
    dataRows.forEach((r) => {
      const sn = String(r.serial_number);
      if (!groups[sn]) {
        groups[sn] = { sn, description: r.description_kannada, rows: [] };
        order.push(sn);
      }
      groups[sn].rows.push(r);
    });
    return order.map((sn) => groups[sn]);
  }, [dataRows]);

  // KPIs from section 1 (Chawki) Total/Egg row and section 2 (Cocoon) Total/Cocoon row
  const kpis = useMemo(() => {
    const find = (sn, tier, metric) => dataRows.find((r) =>
      String(r.serial_number) === String(sn) &&
      String(r.p_tier).trim() === tier &&
      String(r.metric).trim() === metric) || {};
    const chawkiTot = find(1, "ಒಟ್ಟು", "ಮೊಟ್ಟೆ");
    const cocoonTot = find(2, "ಒಟ್ಟು", "ಗೂಡು");
    const nextChawki = find(3, "ಒಟ್ಟು", "ಮೊಟ್ಟೆ");
    return {
      chawkiTgt: numOrZero(chawkiTot.t_tot),
      chawkiAch: numOrZero(chawkiTot.a_tot),
      cocoonTgt: numOrZero(cocoonTot.t_tot),
      cocoonAch: numOrZero(cocoonTot.a_tot),
      nextTgt:   numOrZero(nextChawki.t_tot),
    };
  }, [dataRows]);

  return (
    <Layout title={t("TSC Chawki & Cocoon Weekly Programme Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ — ಚಾಕಿ ಮತ್ತು ಗೂಡು ಉತ್ಪಾದನೆ ವಾರಗಳವಾರು ಕಾರ್ಯಕ್ರಮ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#cffafe,#a5f3fc)",
                color: "#155e75", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #67e8f9", verticalAlign: "middle",
              }}>TSC · Weekly Programme</span>
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
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📅</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ — ಚಾಕಿ ಮತ್ತು ಗೂಡು ಉತ್ಪಾದನೆ ವಾರಗಳವಾರು ಕಾರ್ಯಕ್ರಮ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>TSC</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>Chawki & Cocoon Production Weekly Programme — Target vs Achievement, current + next month</div>
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
                  <label style={lbl}>TSC <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={tscList.map((tsc) => ({ value: String(tsc.tscMasterId), label: tsc.nameInKannada || tsc.name }))}
                    placeholder="— Search TSC —"
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
                    noOptionsMessage={() => "No TSC found"}
                  />
                </Col>
                <Col md={3}>
                  <label style={lbl}>Grainage <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={grainageList.map((g) => ({
                      value: String(g.grainageMasterId),
                      label: g.grainageMasterName + (g.grainageType ? ` · ${g.grainageType}` : ""),
                    }))}
                    placeholder="— Search Grainage —"
                    isSearchable
                    isClearable
                    menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={tscSelectStyles}
                    value={
                      grainageList
                        .map((g) => ({
                          value: String(g.grainageMasterId),
                          label: g.grainageMasterName + (g.grainageType ? ` · ${g.grainageType}` : ""),
                        }))
                        .find((o) => o.value === String(filter.grainageId)) || null
                    }
                    onChange={(opt) => {
                      setFilter((p) => ({ ...p, grainageId: opt?.value || "" }));
                      setHasReport(false);
                      setDataRows([]);
                    }}
                    noOptionsMessage={() => "No Grainage found"}
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
                <Col md={2}>
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

        {/* ── Report Body ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="tsccw-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>TSC</span>
                <span style={{ fontSize: "13.5px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{tscDisplay}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Grainage</span>
                <span style={{ fontSize: "13.5px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{grainageDisplay}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Period</span>
                <span style={{ fontSize: "13.5px", color: "#78350f", fontWeight: 700, marginTop: "2px" }}>{monthLabel} {monthYear}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಚಾಕಿ ಗುರಿ / ಸಾಧನೆ</span>
                <span className="tsccw-num" style={{ fontSize: "13.5px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{kpis.chawkiTgt.toLocaleString()} / {kpis.chawkiAch.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#e0e7ff,#eef2ff)", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#4338ca", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಗೂಡು ಗುರಿ / ಸಾಧನೆ</span>
                <span className="tsccw-num" style={{ fontSize: "13.5px", color: "#312e81", fontWeight: 800, marginTop: "2px" }}>{kpis.cocoonTgt.toLocaleString()} / {kpis.cocoonAch.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಮುಂದಿನ ಚಾಕಿ ಗುರಿ</span>
                <span className="tsccw-num" style={{ fontSize: "13.5px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{kpis.nextTgt.toLocaleString()}</span>
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
                ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ {tscDisplay} {fyLabel ? `${fyLabel} ನೇ ಸಾಲಿನ ` : ""}{monthKn}-{monthYear || ""} ನೇ ಮಾಹೆಯಲ್ಲಿ ವಾರವಾರು ಮೊಟ್ಟೆಗಳ ಚಾಕಿ ಮತ್ತು ಬಿತ್ತನೆ ಗೂಡು ಉತ್ಪಾದನಾ ಗುರಿ ಮತ್ತು ಸಾಧನೆ ವಿವರಗಳು
              </div>

              <div className="tsccw-scroll" style={{ overflowX: "auto" }}>
                <table className="tsccw-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "1400px" }}>
                  <thead>
                    {/* Row 1: top-level groups */}
                    <tr>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "10px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "55px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.No</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#334155,#475569)",
                        color: "#fff", padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "260px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರಗಳು</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Description</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#475569,#64748b)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "85px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12px" }}>ತಂಡ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Tier</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#475569,#64748b)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "75px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12px" }}>ವಿಷಯ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Metric</div>
                      </th>
                      <th colSpan={5} style={{
                        background: "linear-gradient(135deg,#0f766e,#14b8a6)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಗುರಿ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Target</div>
                      </th>
                      <th colSpan={5} style={{
                        background: "linear-gradient(135deg,#4338ca,#6366f1)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಸಾಧನೆ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Achievement</div>
                      </th>
                    </tr>
                    {/* Row 2: weekly leaves */}
                    <tr>
                      {[0, 1].map((g) => {
                        const isTgt = g === 0;
                        const tone = isTgt
                          ? "linear-gradient(180deg,#5eead4,#2dd4bf)"
                          : "linear-gradient(180deg,#a5b4fc,#818cf8)";
                        const text = isTgt ? "#0f766e" : "#3730a3";
                        return [1, 2, 3, 4].map((wk) => (
                          <th key={`${g}-w${wk}`} style={{
                            background: tone, color: text, padding: "8px 4px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: "85px",
                          }}>
                            <div style={{ fontSize: "10.5px" }}>{wk}ನೇ ವಾರ</div>
                            <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>W{wk}</div>
                          </th>
                        )).concat(
                          <th key={`${g}-tot`} style={{
                            background: tone, color: text, padding: "8px 4px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: "95px",
                          }}>
                            <div style={{ fontSize: "10.5px" }}>ಒಟ್ಟು</div>
                            <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>Total</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.length === 0 && (
                      <tr>
                        <td colSpan={14} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                    {grouped.map((group) =>
                      group.rows.map((row, gi) => {
                        const isFirst = gi === 0;
                        const tier = String(row.p_tier || "").trim();
                        const isTotal = tier === "ಒಟ್ಟು";

                        const rowBg = isTotal
                          ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                          : (gi % 2 === 0 ? "#ffffff" : "#f8fafc");

                        const tierColor = tier === "ಪಿ1" ? "#1e3a8a"
                                         : tier === "ಪಿ2" ? "#7c3aed"
                                         : "#78350f";
                        const tierBg = tier === "ಪಿ1" ? "linear-gradient(135deg,#dbeafe,#bfdbfe)"
                                      : tier === "ಪಿ2" ? "linear-gradient(135deg,#ede9fe,#ddd6fe)"
                                      : "linear-gradient(135deg,#f59e0b,#fbbf24)";
                        const tierText = isTotal ? "#fff" : tierColor;

                        return (
                          <tr key={`${group.sn}-${gi}`} className="tsccw-tr" style={{ background: rowBg }}>
                            {isFirst && (
                              <td rowSpan={group.rows.length} style={{
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
                                }}>{group.sn}</span>
                              </td>
                            )}
                            {isFirst && (
                              <td rowSpan={group.rows.length} style={{
                                padding: "10px 14px", textAlign: "left",
                                borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                                background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
                                color: "#0f172a", fontWeight: 800, fontSize: "13px",
                                verticalAlign: "middle",
                              }}>
                                {group.description || "—"}
                              </td>
                            )}
                            <td style={{
                              padding: "10px 6px", textAlign: "center",
                              borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            }}>
                              <span style={{
                                display: "inline-block", padding: "3px 10px", borderRadius: "12px",
                                background: tierBg,
                                color: tierText, fontWeight: 800, fontSize: "11px",
                              }}>{tier || "—"}</span>
                            </td>
                            <td style={{
                              padding: "10px 6px", textAlign: "center",
                              borderBottom: "1px solid #e2e8f0", borderRight: "2px solid #e2e8f0",
                              color: isTotal ? "#78350f" : "#475569",
                              fontWeight: 700, fontSize: "12px",
                            }}>
                              {row.metric || "—"}
                            </td>
                            {VAL_KEYS.map((vk, vi) => {
                              const v = row[vk];
                              const has = String(v ?? "").trim() !== "";
                              const isTotalCol = vi === 4 || vi === 9;
                              const isTgt = vi < 5;

                              const cellBg = isTotal
                                ? (isTotalCol
                                    ? (isTgt
                                        ? "linear-gradient(135deg,#ccfbf1,#a7f3d0)"
                                        : "linear-gradient(135deg,#e0e7ff,#c7d2fe)")
                                    : "transparent")
                                : (has && numOrZero(v) !== 0
                                    ? (isTotalCol
                                        ? (isTgt
                                            ? "linear-gradient(135deg,#ccfbf1,#a7f3d0)"
                                            : "linear-gradient(135deg,#e0e7ff,#c7d2fe)")
                                        : (isTgt ? "#f0fdfa" : "#eef2ff"))
                                    : "transparent");

                              const valColor = has
                                ? (isTotal ? "#78350f" : (isTgt ? "#134e4a" : "#312e81"))
                                : "#cbd5e0";

                              return (
                                <td key={vk} className="tsccw-num" style={{
                                  padding: "10px 6px", textAlign: "center",
                                  borderBottom: "1px solid #e2e8f0",
                                  borderRight: vi === 4 ? "2px solid #e2e8f0" : "1px solid #eef2f6",
                                  background: cellBg,
                                  color: valColor,
                                  fontWeight: isTotal ? 800 : (isTotalCol ? 800 : 600),
                                  fontSize: "12px",
                                }}>
                                  {has ? fmt(v) : "—"}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action footer */}
              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {tscDisplay} · {grainageDisplay} — {monthLabel} {monthKn} {monthYear}
                  &nbsp;·&nbsp; ಚಾಕಿ &amp; ಗೂಡು ವಾರಗಳವಾರು
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

export default TscChawkiCocoonWeeklyReport;
