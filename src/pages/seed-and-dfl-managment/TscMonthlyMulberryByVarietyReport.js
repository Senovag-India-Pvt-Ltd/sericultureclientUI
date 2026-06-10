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

if (!document.getElementById("tscmvar-styles")) {
  const s = document.createElement("style");
  s.id = "tscmvar-styles";
  s.innerHTML = `
    .tscmvar-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tscmvar-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tscmvar-swal .swal2-icon { margin:20px auto 4px !important; }
    .tscmvar-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tscmvar-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tscmvar-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tscmvar-wrap { animation: tscmvar-in .35s ease; }
    .tscmvar-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tscmvar-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tscmvar-scroll::-webkit-scrollbar { height:9px; }
    .tscmvar-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tscmvar-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
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

const yearOptions = (() => {
  const cur = new Date().getFullYear();
  const arr = [];
  for (let y = cur + 1; y >= cur - 5; y--) arr.push({ value: y, label: String(y) });
  return arr;
})();

const VARIETY_SUBS = [
  { kn: "S-13",  en: "S-13",   suffix: "s13" },
  { kn: "S-34",  en: "S-34",   suffix: "s34" },
  { kn: "S-36",  en: "S-36",   suffix: "s36" },
  { kn: "S-54",  en: "S-54",   suffix: "s54" },
  { kn: "V-1",   en: "V-1",    suffix: "v1"  },
  { kn: "ಇತರೆ",  en: "Others", suffix: "oth" },
  { kn: "ಒಟ್ಟು", en: "Total",  suffix: "total", total: true },
];

function TscMonthlyMulberryByVarietyReport() {
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

  const reset = () => { setHasReport(false); setDataRows([]); };

  const validate = () => {
    if (!filter.districtId) return "Please select a District.";
    if (!filter.talukId)    return "Please select a Taluk.";
    if (!filter.year)       return "Please select a Year.";
    if (!filter.month)      return "Please select a Month.";
    return null;
  };

  const showWarn = (msg) =>
    Swal.fire({
      icon: "warning", title: "Required Fields",
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #fcd34d;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⚠️</div><div><p style="color:#92400e;font-size:14px;font-weight:700;margin:0 0 5px">Missing Selection</p><p style="color:#78350f;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Got it", confirmButtonColor: "#d97706",
      background: "#fff", customClass: { popup: "tscmvar-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "tscmvar-swal" },
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/mulberry-by-variety", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the TSC Monthly Mulberry by Variety (Sheet 3b) report.");
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/mulberry-by-variety/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/mulberry-by-variety/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `tsc_monthly_mulberry_by_variety_${filter.talukId}_${filter.year}_${filter.month}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr("Excel Failed", "Could not generate the Excel report.");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const districtName = districtList.find((d) => String(d.districtId) === String(filter.districtId))?.districtName || "—";
  const talukName    = talukList.find((tk) => String(tk.talukId) === String(filter.talukId))?.talukName || "—";
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn      = MONTH_KN[Number(filter.month)] || "";
  const fyEndLabel   = `31-03-${filter.year}`;

  const kpis = useMemo(() => {
    let fyEndArea = 0, annualTarget = 0;
    let moTotal = 0, meTotal = 0;
    const moByVar = { s13: 0, s34: 0, s36: 0, s54: 0, v1: 0, oth: 0 };
    const meByVar = { s13: 0, s34: 0, s36: 0, s54: 0, v1: 0, oth: 0 };
    dataRows.forEach((r) => {
      fyEndArea    += numOrZero(r.fy_end_area);
      annualTarget += numOrZero(r.annual_target);
      moTotal      += numOrZero(r.mo_total);
      meTotal      += numOrZero(r.me_total);
      Object.keys(moByVar).forEach((k) => {
        moByVar[k] += numOrZero(r[`mo_${k}`]);
        meByVar[k] += numOrZero(r[`me_${k}`]);
      });
    });
    const pickTop = (obj) => {
      let best = "—", bestVal = -1;
      Object.entries(obj).forEach(([k, v]) => {
        if (v > bestVal) { bestVal = v; best = k; }
      });
      return { name: best.toUpperCase(), value: bestVal > 0 ? bestVal : 0 };
    };
    const topMo = pickTop(moByVar);
    const topMe = pickTop(meByVar);
    const pctVsTarget = annualTarget > 0 ? (meTotal * 100) / annualTarget : 0;
    return { fyEndArea, annualTarget, moTotal, meTotal, topMo, topMe, pctVsTarget };
  }, [dataRows]);

  return (
    <Layout title={t("TSC Monthly Mulberry by Variety — Sheet 3b")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ಹೊಸ ಹಿಪ್ಪುನೇರಳೆ ನಾಟಿ — ತಳಿವಾರು ಪ್ರಗತಿ")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
                color: "#14532d", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #86efac", verticalAlign: "middle",
              }}>Sheet-3b · By Variety</span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Filter Card ──────────────────────────────────────────────── */}
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg,#0f766e 0%,#14b8a6 50%,#5b57ac 100%)",
            padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>🌾</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ಹೊಸ ಹಿಪ್ಪುನೇರಳೆ ನಾಟಿ ತಳಿವಾರು — TSC-wise New Plantation by Variety
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>SHEET 3b</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>
                FY-end Area · Annual Target · Month / ME Achievement split by S-13 / S-34 / S-36 / S-54 / V-1 / Others (ha)
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
                  <label style={lbl}>District <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={districtList.map((d) => ({ value: String(d.districtId), label: d.districtName }))}
                    placeholder="— Search District —"
                    isSearchable isClearable menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed" styles={reactSelectStyles}
                    value={
                      districtList
                        .map((d) => ({ value: String(d.districtId), label: d.districtName }))
                        .find((o) => o.value === String(filter.districtId)) || null
                    }
                    onChange={(opt) => { setFilter((p) => ({ ...p, districtId: opt?.value || "", talukId: "" })); reset(); }}
                    noOptionsMessage={() => "No districts"}
                  />
                </Col>
                <Col md={3}>
                  <label style={lbl}>Taluk <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={talukList.map((tk) => ({ value: String(tk.talukId), label: tk.talukName }))}
                    placeholder={filter.districtId ? "— Search Taluk —" : "Select District first"}
                    isSearchable isClearable isDisabled={!filter.districtId} menuPlacement="auto"
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed" styles={reactSelectStyles}
                    value={
                      talukList
                        .map((tk) => ({ value: String(tk.talukId), label: tk.talukName }))
                        .find((o) => o.value === String(filter.talukId)) || null
                    }
                    onChange={(opt) => { setFilter((p) => ({ ...p, talukId: opt?.value || "" })); reset(); }}
                    noOptionsMessage={() => "No taluks"}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>Year <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="year" value={filter.year}
                               onChange={(e) => { setFilter((p) => ({ ...p, year: e.target.value })); reset(); }}
                               style={sel}>
                    {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>Month <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="month" value={filter.month}
                               onChange={(e) => { setFilter((p) => ({ ...p, month: e.target.value })); reset(); }}
                               style={sel}>
                    {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                    </button>
                  </div>
                </Col>
              </Row>
              {hasReport && (
                <Row className="mt-2">
                  <Col md={12}>
                    <div className="d-flex gap-2 flex-wrap">
                      <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                        {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> Generating PDF…</> : <>📄 PDF</>}
                      </button>
                      <button type="button" disabled={isDownloadingExcel} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#16a34a)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel)}>
                        {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> Exporting…</> : <>📊 Excel</>}
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
          <div className="tscmvar-wrap mt-4">
            {/* KPI pills */}
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "190px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>District / Taluk</span>
                <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{districtName} · {talukName}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>FY-end Existing Area</span>
                <span className="tscmvar-num" style={{ fontSize: "16px", color: "#155e75", fontWeight: 800, marginTop: "2px" }}>{fmt(kpis.fyEndArea)} ha</span>
                <span style={{ fontSize: "10.5px", color: "#0e7490", marginTop: "2px" }}>{fyEndLabel}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Annual Target</span>
                <span className="tscmvar-num" style={{ fontSize: "16px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{fmt(kpis.annualTarget)} ha</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#bbf7d0,#dcfce7)", border: "1.5px solid #86efac", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "190px" }}>
                <span style={{ fontSize: "11px", color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>Month Achievement</span>
                <span className="tscmvar-num" style={{ fontSize: "14px", color: "#14532d", fontWeight: 800, marginTop: "2px" }}>{fmt(kpis.moTotal)} ha</span>
                <span className="tscmvar-num" style={{ fontSize: "11px", color: "#15803d", fontWeight: 700, marginTop: "2px" }}>Top: {kpis.topMo.name} · {fmt(kpis.topMo.value)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "190px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ME Achievement</span>
                <span className="tscmvar-num" style={{ fontSize: "14px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{fmt(kpis.meTotal)} ha</span>
                <span className="tscmvar-num" style={{ fontSize: "11px", color: "#6d28d9", fontWeight: 700, marginTop: "2px" }}>Top: {kpis.topMe.name} · {fmt(kpis.topMe.value)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>% of Annual Target</span>
                <span className="tscmvar-num" style={{ fontSize: "16px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{kpis.pctVsTarget.toFixed(2)}%</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{
                background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)",
                color: "#fff", padding: "16px 22px",
                fontWeight: 800, fontSize: "15px", letterSpacing: ".02em",
                textAlign: "center",
              }}>
                Sheet-3b · ಹೊಸ ಹಿಪ್ಪುನೇರಳೆ ನಾಟಿ ತಳಿವಾರು — {talukName} — {monthKn} {filter.year}
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>
                  TSC-wise New Mulberry Plantation by Variety (in hectares) · {monthLabel} {filter.year}
                </div>
              </div>

              <div className="tscmvar-scroll" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1700px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#1e293b,#36506b)",
                        color: "#fff", padding: "10px 6px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        whiteSpace: "nowrap", width: "55px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12px" }}>ಕ್ರ.ಸಂ.</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Sl.</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#334155,#475569)",
                        color: "#fff", padding: "10px 14px", textAlign: "left",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "200px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ತಾಂತ್ರಿಕ ಸೇವಾ ಕೇಂದ್ರ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>TSC</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#0e7490,#06b6d4)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "110px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "11.5px" }}>{fyEndLabel}</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>FY-end Area</div>
                      </th>
                      <th rowSpan={2} style={{
                        background: "linear-gradient(135deg,#a16207,#ca8a04)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                        minWidth: "100px", verticalAlign: "middle",
                      }}>
                        <div style={{ fontSize: "11.5px" }}>ವಾರ್ಷಿಕ ಗುರಿ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Annual Target</div>
                      </th>
                      <th colSpan={7} style={{
                        background: "linear-gradient(135deg,#0f766e,#14b8a6)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಮಾಸ ಸಾಧನೆ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>Month Achievement</div>
                      </th>
                      <th colSpan={7} style={{
                        background: "linear-gradient(135deg,#15803d,#22c55e)",
                        color: "#fff", padding: "10px 8px", textAlign: "center",
                        border: "1px solid rgba(255,255,255,.18)", fontWeight: 800,
                      }}>
                        <div style={{ fontSize: "12.5px" }}>ಅಂತ್ಯ ಸಾಧನೆ</div>
                        <div style={{ fontSize: "9.5px", fontWeight: 600, opacity: .85, marginTop: "2px" }}>ME Achievement</div>
                      </th>
                    </tr>
                    <tr>
                      {VARIETY_SUBS.map((v, i) => (
                        <th key={`mo-${i}`} style={{
                          background: "linear-gradient(180deg,#5eead4,#2dd4bf)",
                          color: "#0f766e",
                          padding: "8px 4px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)",
                          fontWeight: v.total ? 800 : 700, minWidth: "70px",
                        }}>
                          <div style={{ fontSize: "10.5px" }}>{v.kn}</div>
                          <div style={{ fontSize: "9px", opacity: .8, marginTop: "1px" }}>{v.en}</div>
                        </th>
                      ))}
                      {VARIETY_SUBS.map((v, i) => (
                        <th key={`me-${i}`} style={{
                          background: "linear-gradient(180deg,#86efac,#4ade80)",
                          color: "#14532d",
                          padding: "8px 4px", textAlign: "center",
                          border: "1px solid rgba(255,255,255,.18)",
                          fontWeight: v.total ? 800 : 700, minWidth: "70px",
                        }}>
                          <div style={{ fontSize: "10.5px" }}>{v.kn}</div>
                          <div style={{ fontSize: "9px", opacity: .8, marginTop: "1px" }}>{v.en}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr>
                        <td colSpan={18} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>
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
                      const numCell = (val, palette, isTotal, extraStyle = {}) => {
                        const has = String(val ?? "").trim() !== "" && numOrZero(val) !== 0;
                        return (
                          <td className="tscmvar-num" style={{
                            ...cellBase, ...extraStyle,
                            background: has ? (isTotal ? palette.totalBg : palette.bg) : "transparent",
                            color: has ? palette.text : "#cbd5e0",
                            fontWeight: isTotal ? 800 : 600,
                          }}>
                            {has ? fmt(val) : "—"}
                          </td>
                        );
                      };

                      const cyan   = { bg: "#ecfeff",  totalBg: "linear-gradient(135deg,#cffafe,#a5f3fc)", text: "#155e75" };
                      const yellow = { bg: "#fef9c3",  totalBg: "linear-gradient(135deg,#fef3c7,#fde68a)", text: "#854d0e" };
                      const teal   = { bg: "#f0fdfa",  totalBg: "linear-gradient(135deg,#ccfbf1,#99f6e4)", text: "#115e59" };
                      const green  = { bg: "#f0fdf4",  totalBg: "linear-gradient(135deg,#dcfce7,#bbf7d0)", text: "#166534" };

                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="tscmvar-tr" style={{ background: rowBg }}>
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
                          {numCell(row.fy_end_area,    cyan,   true)}
                          {numCell(row.annual_target, yellow, true,  { borderRight: "2px solid #e2e8f0" })}
                          {VARIETY_SUBS.map((v, vi) => {
                            const key = `mo_${v.suffix}`;
                            const isLast = vi === VARIETY_SUBS.length - 1;
                            return (
                              <React.Fragment key={`mo-${vi}`}>
                                {numCell(row[key], teal, !!v.total, isLast ? { borderRight: "2px solid #e2e8f0" } : {})}
                              </React.Fragment>
                            );
                          })}
                          {VARIETY_SUBS.map((v, vi) => {
                            const key = `me_${v.suffix}`;
                            return (
                              <React.Fragment key={`me-${vi}`}>
                                {numCell(row[key], green, !!v.total)}
                              </React.Fragment>
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
                  &nbsp;·&nbsp; Sheet-3b — Mulberry by Variety (ha)
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

export default TscMonthlyMulberryByVarietyReport;
