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

if (!document.getElementById("tscsc-styles")) {
  const s = document.createElement("style");
  s.id = "tscsc-styles";
  s.innerHTML = `
    .tscsc-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tscsc-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tscsc-swal .swal2-icon { margin:20px auto 4px !important; }
    .tscsc-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tscsc-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tscsc-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tscsc-wrap { animation: tscsc-in .35s ease; }
    .tscsc-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tscsc-table th { letter-spacing:.02em; }
    .tscsc-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tscsc-scroll::-webkit-scrollbar { height:9px; }
    .tscsc-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tscsc-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#14b8a6,#5b57ac); border-radius:6px; }
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

// Twelve numeric data keys ordered to match the visual column order
const VAL_KEYS = [
  "cy_m_no", "cy_m_kg", "cy_m_pct",
  "cy_c_no", "cy_c_kg", "cy_c_pct",
  "py_m_no", "py_m_kg", "py_m_pct",
  "py_c_no", "py_c_kg", "py_c_pct",
];

function TscSeedCocoonReport() {
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
      background: "#fff", customClass: { popup: "tscsc-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "tscsc-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-seed-cocoon", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the TSC Seed Cocoon Production report.");
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-seed-cocoon/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-seed-cocoon/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `tsc_seed_cocoon_${filter.tscId}_${filter.grainageId}_${year}_${m}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr("Excel Failed", "Could not generate the Excel report.");
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

  // section / sub / total / dash classification
  const enrichedRows = useMemo(() => {
    return dataRows.map((r) => {
      const sub = String(r.sub_label || "").trim();
      let kind;
      if (sub === "")          kind = "section";
      else if (sub === "∑")    kind = "total";
      else if (sub === "-")    kind = "dash";  // extra metric row
      else                       kind = "sub";   // numeric (P1/P2)
      return { ...r, _kind: kind };
    });
  }, [dataRows]);

  // KPI from section 2 ∑ (achievement totals)
  const kpis = useMemo(() => {
    const find = (sn, sub) => dataRows.find((r) =>
      String(r.serial_number) === String(sn) && String(r.sub_label).trim() === sub) || {};
    const ach   = find(2, "∑");
    const achP1 = find(2, "1");
    const achP2 = find(2, "2");
    return {
      cyMonthNo: numOrZero(ach.cy_m_no),
      cyMonthKg: numOrZero(ach.cy_m_kg),
      cyCumNo:   numOrZero(ach.cy_c_no),
      cyCumKg:   numOrZero(ach.cy_c_kg),
      p1No:      numOrZero(achP1.cy_m_no),
      p2No:      numOrZero(achP2.cy_m_no),
    };
  }, [dataRows]);

  return (
    <Layout title={t("TSC Seed Cocoon Production Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ — ಬಿತ್ತನೆ ಗೂಡು ಉತ್ಪಾದನೆ ಮತ್ತು ವಿಲೇವಾರಿ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#fef9c3,#fef08a)",
                color: "#713f12", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #fde047", verticalAlign: "middle",
              }}>ಭಾಗ-4 · Part-4 · Seed Cocoon Production</span>
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
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🥚</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ — ಬಿತ್ತನೆ ಗೂಡು ಉತ್ಪಾದನೆ ಮತ್ತು ವಿಲೇವಾರಿ ವಿವರಗಳು
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>TSC</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>ಭಾಗ-4 · ಬಿತ್ತನೆ ಗೂಡು — ಗುರಿ / ಸಾಧನೆ / ಸರಾಸರಿ ಇಳುವರಿ / ಗೂಡುಗಳ ವಿಲೇವಾರಿ / ನೂಲು ಬಿಚ್ಚಲು / ಒಟ್ಟು / ಮಾರುಕಟ್ಟೆ ಹೊರಗೆ ವಿಲೇವಾರಿ</div>
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
                  <label style={lbl}>ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ (TSC) <span style={{ color: "#e53e3e" }}>*</span></label>
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
                  <label style={lbl}>ಗ್ರೈನೇಜ್ (Grainage) <span style={{ color: "#e53e3e" }}>*</span></label>
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
                  <label style={lbl}>ಆರ್ಥಿಕ ವರ್ಷ (Financial Year) <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="financialYearMasterId" value={filter.financialYearMasterId} onChange={handleChange} style={sel}>
                    <option value="">— Select Year —</option>
                    {financialYearList.map((f) => (
                      <option key={f.financialYearMasterId} value={f.financialYearMasterId}>{f.financialYear}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>ಮಾಹೆ (Month) <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month} onChange={handleChange} style={sel}>
                    <option value="">— ಮಾಹೆ / Month —</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{MONTH_KN[m.value]} · {m.label}</option>
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
          <div className="tscsc-wrap mt-4">
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
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಸಾಧನೆ ಮಾಸ (ಸಂಖ್ಯೆ / ಕೆ.ಜಿ)</span>
                <span className="tscsc-num" style={{ fontSize: "13.5px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{kpis.cyMonthNo.toLocaleString()} / {fmt(kpis.cyMonthKg)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ddd6fe,#ede9fe)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಸಾಧನೆ ಒಟ್ಟು (ಸಂಖ್ಯೆ / ಕೆ.ಜಿ)</span>
                <span className="tscsc-num" style={{ fontSize: "13.5px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{kpis.cyCumNo.toLocaleString()} / {fmt(kpis.cyCumKg)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಪಿ1 (ಸಂಖ್ಯೆ)</span>
                <span className="tscsc-num" style={{ fontSize: "14px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{kpis.p1No.toLocaleString()}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "150px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಪಿ2 (ಸಂಖ್ಯೆ)</span>
                <span className="tscsc-num" style={{ fontSize: "14px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{kpis.p2No.toLocaleString()}</span>
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
                ಭಾಗ-4 ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ {tscDisplay} — {monthKn} {monthYear || ""} ಬಿತ್ತನೆ ಗೂಡು ಉತ್ಪಾದನೆ ಮತ್ತು ವಿಲೇವಾರಿ ವಿವರಗಳು
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  Part-4 · Seed Cocoon Production &amp; Distribution &nbsp;·&nbsp; {monthLabel} {monthYear || ""}
                </div>
              </div>

              <div className="tscsc-scroll" style={{ overflowX: "auto" }}>
                <table className="tscsc-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1500px" }}>
                  <thead>
                    {/* Row 1: Sl/Desc rowSpan=3, CY group colspan=6, PY group colspan=6 */}
                    <tr>
                      <th rowSpan={3} style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "10px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "55px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.No</div>
                      </th>
                      <th rowSpan={3} style={{
                        background: "linear-gradient(135deg,#334155,#475569)",
                        color: "#fff", padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "320px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ವಿವರಗಳು</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Description</div>
                      </th>
                      <th colSpan={6} style={{
                        background: "linear-gradient(135deg,#0f766e,#14b8a6)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಪ್ರಸಕ್ತ ವರ್ಷ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>
                          Current Year {fyStartYear ? `${fyStartYear}-${String(fyStartYear + 1).slice(-2)}` : ""}
                        </div>
                      </th>
                      <th colSpan={6} style={{
                        background: "linear-gradient(135deg,#4338ca,#6366f1)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 800 }}>ಹಿಂದಿನ ವರ್ಷ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>
                          Previous Year {fyStartYear ? `${fyStartYear - 1}-${String(fyStartYear).slice(-2)}` : ""}
                        </div>
                      </th>
                    </tr>
                    {/* Row 2: Month / Cumulative under each year */}
                    <tr>
                      <th colSpan={3} style={{
                        background: "linear-gradient(180deg,#14b8a6,#0d9488)",
                        color: "#fff", padding: "8px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                      }}>
                        <div style={{ fontSize: "11.5px" }}>ಮಾಸ</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "1px" }}>Month</div>
                      </th>
                      <th colSpan={3} style={{
                        background: "linear-gradient(180deg,#14b8a6,#0d9488)",
                        color: "#fff", padding: "8px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                      }}>
                        <div style={{ fontSize: "11.5px" }}>ಮಾಸಾಂತ್ಯ</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "1px" }}>Cumulative</div>
                      </th>
                      <th colSpan={3} style={{
                        background: "linear-gradient(180deg,#6366f1,#4f46e5)",
                        color: "#fff", padding: "8px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                      }}>
                        <div style={{ fontSize: "11.5px" }}>ಮಾಸ</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "1px" }}>Month</div>
                      </th>
                      <th colSpan={3} style={{
                        background: "linear-gradient(180deg,#6366f1,#4f46e5)",
                        color: "#fff", padding: "8px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 700,
                      }}>
                        <div style={{ fontSize: "11.5px" }}>ಮಾಸಾಂತ್ಯ</div>
                        <div style={{ fontSize: "9px", opacity: .85, marginTop: "1px" }}>Cumulative</div>
                      </th>
                    </tr>
                    {/* Row 3: ಸಂಖ್ಯೆ / ಕೆ.ಜಿ. / % × 4 */}
                    <tr>
                      {[0, 1, 2, 3].map((g) => {
                        const isCy = g < 2;
                        const tone = isCy
                          ? "linear-gradient(180deg,#5eead4,#2dd4bf)"
                          : "linear-gradient(180deg,#a5b4fc,#818cf8)";
                        const text = isCy ? "#0f766e" : "#3730a3";
                        return [
                          <th key={`${g}-n`} style={{
                            background: tone, color: text, padding: "8px 4px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: "85px",
                          }}>
                            <div style={{ fontSize: "10.5px" }}>ಸಂಖ್ಯೆ</div>
                            <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>No.</div>
                          </th>,
                          <th key={`${g}-k`} style={{
                            background: tone, color: text, padding: "8px 4px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: "85px",
                          }}>
                            <div style={{ fontSize: "10.5px" }}>ಕೆ.ಜಿ.</div>
                            <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>Kg</div>
                          </th>,
                          <th key={`${g}-p`} style={{
                            background: tone, color: text, padding: "8px 4px", textAlign: "center",
                            border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                            minWidth: "85px",
                          }}>
                            <div style={{ fontSize: "10.5px" }}>%</div>
                            <div style={{ fontSize: "8.5px", opacity: .8, marginTop: "1px" }}>Pct</div>
                          </th>,
                        ];
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {enrichedRows.length === 0 && (
                      <tr>
                        <td colSpan={14} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
                          ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ &nbsp;/&nbsp; No records found.
                        </td>
                      </tr>
                    )}
                    {enrichedRows.map((row, ri) => {
                      const k = row._kind;
                      const isSection = k === "section";
                      const isTotal   = k === "total";
                      const isDash    = k === "dash";
                      const isSub     = k === "sub";

                      const rowBg = isSection
                        ? "linear-gradient(135deg,#1e293b,#334155)"
                        : isTotal
                          ? "linear-gradient(135deg,#fde68a,#fef3c7)"
                          : isDash
                            ? "linear-gradient(135deg,#f0fdfa,#ecfdf5)"
                            : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");

                      const descColor = isSection ? "#fff" : (isTotal ? "#78350f" : "#0f172a");
                      const valColorCY = isTotal ? "#78350f" : "#134e4a";
                      const valColorPY = isTotal ? "#78350f" : "#312e81";
                      const valWeight = (isTotal || isSection) ? 800 : 600;

                      return (
                        <tr key={`${row.serial_number}-${row.sub_label || ""}-${ri}`} className="tscsc-tr" style={{ background: rowBg }}>
                          <td style={{
                            padding: "10px 6px", textAlign: "center",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            background: isSection ? "rgba(255,255,255,.06)" : "transparent",
                          }}>
                            {isSection ? (
                              <span style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                minWidth: "28px", height: "28px", borderRadius: "50%",
                                background: "linear-gradient(135deg,#fef3c7,#fde68a)",
                                color: "#78350f", fontWeight: 800, fontSize: "12px",
                              }}>{row.serial_number}</span>
                            ) : isDash ? (
                              <span style={{ color: "#94a3b8", fontWeight: 700, fontSize: "14px" }}>•</span>
                            ) : (
                              <span style={{
                                display: "inline-block", padding: "3px 10px", borderRadius: "12px",
                                background: isTotal
                                  ? "linear-gradient(135deg,#f59e0b,#fbbf24)"
                                  : "linear-gradient(135deg,#e2e8f0,#cbd5e1)",
                                color: isTotal ? "#fff" : "#475569", fontWeight: 800, fontSize: "11px",
                              }}>{row.sub_label}</span>
                            )}
                          </td>
                          <td style={{
                            padding: "10px 14px", textAlign: "left",
                            borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0",
                            color: descColor,
                            fontWeight: (isSection || isTotal) ? 800 : 600,
                            fontSize: isSection ? "13px" : "12px",
                            paddingLeft: (isSub || isTotal || isDash) ? "32px" : "14px",
                            fontStyle: isDash && !row.description_kannada ? "italic" : "normal",
                          }}>
                            {(isSub || isDash) && <span style={{ color: "#94a3b8", marginRight: "6px" }}>↳</span>}
                            {row.description_kannada || (isDash ? "—" : "—")}
                          </td>
                          {VAL_KEYS.map((vk, vi) => {
                            const v = row[vk];
                            const has = String(v ?? "").trim() !== "";
                            const isPctCol = vi === 2 || vi === 5 || vi === 8 || vi === 11;
                            const isCY = vi < 6;

                            const cellBg = isSection
                              ? "transparent"
                              : isTotal
                                ? (isPctCol
                                    ? (isCY
                                        ? "linear-gradient(135deg,#ccfbf1,#a7f3d0)"
                                        : "linear-gradient(135deg,#e0e7ff,#c7d2fe)")
                                    : "transparent")
                                : (has && numOrZero(v) !== 0
                                    ? (isPctCol
                                        ? (isCY
                                            ? "linear-gradient(135deg,#ccfbf1,#a7f3d0)"
                                            : "linear-gradient(135deg,#e0e7ff,#c7d2fe)")
                                        : (isCY ? "#f0fdfa" : "#eef2ff"))
                                    : "transparent");

                            const display = has
                              ? (isPctCol && numOrZero(v) !== 0 ? `${fmt(v)}%` : fmt(v))
                              : "—";

                            return (
                              <td key={vk} className="tscsc-num" style={{
                                padding: "10px 6px", textAlign: "center",
                                borderBottom: "1px solid #e2e8f0",
                                borderRight: vi === 5 ? "2px solid #e2e8f0" : "1px solid #eef2f6",
                                background: cellBg,
                                color: has ? (isCY ? valColorCY : valColorPY) : "#cbd5e0",
                                fontWeight: valWeight,
                                fontSize: "12px",
                              }}>
                                {display}
                              </td>
                            );
                          })}
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
                  &nbsp;·&nbsp; ಭಾಗ-4 / Part-4 Seed Cocoon Production
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

export default TscSeedCocoonReport;
