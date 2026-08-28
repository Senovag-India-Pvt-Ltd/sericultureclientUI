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

if (!document.getElementById("tsccrc-styles")) {
  const s = document.createElement("style");
  s.id = "tsccrc-styles";
  s.innerHTML = `
    .tsccrc-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .tsccrc-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .tsccrc-swal .swal2-icon { margin:20px auto 4px !important; }
    .tsccrc-swal .swal2-html-container { margin:0 !important; padding:0 !important; }
    .tsccrc-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes tsccrc-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .tsccrc-wrap { animation: tsccrc-in .35s ease; }
    .tsccrc-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .tsccrc-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .tsccrc-scroll::-webkit-scrollbar { height:9px; }
    .tsccrc-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .tsccrc-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
  `;
  document.head.appendChild(s);
}

const sel = { borderRadius: "8px", border: "1.5px solid #d0d9e8", padding: "7px 11px", fontSize: "13px", background: "#f8fafd", color: "#333", width: "100%" };
const lbl = { fontSize: "11px", fontWeight: 700, color: "#5a6a7e", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
const btn = (bg, shadow, disabled) => ({
  background: disabled ? "#c8d6e5" : bg, border: "none", borderRadius: "9px", padding: "8px 18px",
  fontWeight: 700, fontSize: "13px", color: "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: disabled ? "none" : shadow,
  display: "flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap",
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
    background: state.isSelected ? "linear-gradient(135deg,#0f766e,#14b8a6)" : state.isFocused ? "#ecfdf5" : "#fff",
    color: state.isSelected ? "#fff" : "#0f172a", cursor: "pointer",
  }),
};

const numOrZero = (v) => { const n = parseFloat(String(v ?? "").replace(/[^\d.\-]/g, "")); return isNaN(n) ? 0 : n; };
const fmtInt = (v) => { const s = String(v ?? "").trim(); if (!s) return ""; const n = parseFloat(s); if (isNaN(n)) return s; return Math.round(n).toLocaleString(); };

const yearOptions = (() => {
  const cur = new Date().getFullYear(); const arr = [];
  for (let y = cur + 1; y >= cur - 5; y--) arr.push({ value: y, label: String(y) });
  return arr;
})();

function TscMonthlyCrcBrushingReport() {
  const { t, i18n } = useTranslation();

  const today = new Date();
  const [filter, setFilter] = useState({ districtId: "", talukId: "", year: today.getFullYear(), month: today.getMonth() + 1 });
  const [districtList, setDistrictList] = useState([]);
  const [talukList,    setTalukList]    = useState([]);
  const [search, setSearch] = useState("");
  const [dataRows, setDataRows] = useState([]);
  const [hasReport, setHasReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  useEffect(() => {
    api.get(baseURL + "district/get-all").then((r) => setDistrictList(r.data.content.district || [])).catch(() => setDistrictList([]));
  }, []);
  useEffect(() => {
    if (!filter.districtId) { setTalukList([]); return; }
    api.get(baseURL + `taluk/get-by-district-id/${filter.districtId}`).then((r) => setTalukList(r.data.content.taluk || [])).catch(() => setTalukList([]));
  }, [filter.districtId]);

  const reset = () => { setHasReport(false); setDataRows([]); setSearch(""); };
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
      confirmButtonText: t("Got it", { ns: "reports" }), confirmButtonColor: "#d97706", background: "#fff", customClass: { popup: "tsccrc-swal" },
    });
  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">${t("Failed", { ns: "reports" })}</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: t("Close"), confirmButtonColor: "#e53e3e", background: "#fff", customClass: { popup: "tsccrc-swal" },
    });

  const params = () => ({ talukId: filter.talukId, year: Number(filter.year), month: Number(filter.month) });

  const handleView = async (e) => {
    e.preventDefault(); const err = validate(); if (err) { showWarn(err); return; }
    setIsLoading(true); setHasReport(false); setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/crc-brushing", { params: params() });
      setDataRows(Array.isArray(res.data) ? res.data : []); setHasReport(true);
    } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 204) {
          showErr(t("No Data Found", { ns: "reports" }), t("No data found for the selected filters.", { ns: "reports" }));
        } else {
          const data = err?.response?.data;
          const backendMsg = typeof data === "string"
            ? data
            : (data?.message || data?.error || data?.errorMessage || data?.error_description);
          showErr(t("Fetch Failed", { ns: "reports" }), backendMsg || err?.message || t("Failed to load the TSC Monthly CRC Brushing (Sheet 8) report.", { ns: "reports" }));
        }
      }
    finally { setIsLoading(false); }
  };
  const handlePdf = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingPdf(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/crc-brushing/pdf", { params: params(), responseType: "blob" });
      window.open(URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })));
    } catch { showErr(t("PDF Failed", { ns: "reports" }), t("Could not generate the PDF report.", { ns: "reports" })); } finally { setIsDownloadingPdf(false); }
  };
  const handleExcel = async () => {
    const err = validate(); if (err) { showWarn(err); return; }
    setIsDownloadingExcel(true);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/tsc-monthly/crc-brushing/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url;
      a.download = `tsc_monthly_crc_brushing_${filter.talukId}_${filter.year}_${filter.month}.xlsx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { showErr(t("Excel Failed", { ns: "reports" }), t("Could not generate the Excel report.", { ns: "reports" })); } finally { setIsDownloadingExcel(false); }
  };

  const selectedDistrict = districtList.find((d) => String(d.districtId) === String(filter.districtId));
  const districtName = i18n.language === "kn"
    ? (selectedDistrict?.districtNameInKannada || selectedDistrict?.districtName || "—")
    : (selectedDistrict?.districtName || "—");
  const selectedTaluk = talukList.find((tk) => String(tk.talukId) === String(filter.talukId));
  const talukName = i18n.language === "kn"
    ? (selectedTaluk?.talukNameInKannada || selectedTaluk?.talukName || "—")
    : (selectedTaluk?.talukName || "—");
  const monthLabel   = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthKn      = MONTH_KN[Number(filter.month)] || "";
  const fyLabel      = (() => {
    const m = Number(filter.month), y = Number(filter.year);
    const fyStart = m >= 4 ? y : y - 1;
    return `${fyStart}-${String((fyStart + 1) % 100).padStart(2, "0")}`;
  })();

  const isTotalRow = (r) => String(r?.crc_name ?? "").trim() === "ಒಟ್ಟು";

  const filteredRows = useMemo(() => {
    if (!search.trim()) return dataRows;
    const q = search.trim().toLowerCase();
    // keep the totals row always visible
    return dataRows.filter((r) =>
      isTotalRow(r) || String(r.crc_name ?? "").toLowerCase().includes(q)
    );
  }, [dataRows, search]);

  const kpis = useMemo(() => {
    let moMix = 0, moBiv = 0, meMix = 0, meBiv = 0, benMe = 0;
    const crcs = new Set();
    dataRows.forEach((r) => {
      if (isTotalRow(r)) return;
      moMix += numOrZero(r.mo_tm); moBiv += numOrZero(r.mo_tb);
      meMix += numOrZero(r.me_tm); meBiv += numOrZero(r.me_tb);
      benMe += numOrZero(r.me_bm) + numOrZero(r.me_bb);
      if (r.crc_name) crcs.add(r.crc_name);
    });
    return { moMix, moBiv, meMix, meBiv, benMe, crcs: crcs.size };
  }, [dataRows]);

  return (
    <Layout title={t("TSC Monthly CRC Brushing — Sheet 8", { ns: "reports" })}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              ಸರ್ಕಾರಿ + ಖಾಸಗಿ ಚಾಕಿ ಸಾಕಾಣಿಕೆ ಕೇಂದ್ರಗಳ ವರದಿ — ಮಾಸಿಕ
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#14532d", padding: "2px 10px", borderRadius: "20px", fontSize: "10.5px", fontWeight: 800, marginLeft: "8px", border: "1px solid #86efac", verticalAlign: "middle" }}>
                Sheet-8 · Combined CRC
              </span>
            </Block.Title>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card className="mt-1" style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 20px rgba(13,78,72,.10)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 50%,#7c3aed 100%)", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🏬</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>
                ಚಾಕಿ ಸಾಕಾಣಿಕೆ ಕೇಂದ್ರಗಳ ವರದಿ — Combined CRC Brushing (Govt + Private)
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>SHEET 8</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>
                CRC × Race × Source · DFLs brushed · Month / ME — for the selected Taluk
              </div>
            </div>
            {hasReport && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{monthLabel} · {monthKn} {filter.year}</span>
                <span style={{ background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "4px 12px", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{filteredRows.length} / {dataRows.length} rows</span>
              </div>
            )}
          </div>

          <Card.Body style={{ padding: "16px 20px 18px", background: "linear-gradient(180deg,#ffffff,#f8fffe)" }}>
            <Form onSubmit={handleView}>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <label style={lbl}>{t("District")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={districtList.map((d) => ({ value: String(d.districtId), label: i18n.language === "kn" ? (d.districtNameInKannada || d.districtName) : d.districtName }))}
                    placeholder={t("— Search District —", { ns: "reports" })}
                    isSearchable isClearable menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed" styles={reactSelectStyles}
                    value={districtList.map((d) => ({ value: String(d.districtId), label: i18n.language === "kn" ? (d.districtNameInKannada || d.districtName) : d.districtName })).find((o) => o.value === String(filter.districtId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, districtId: opt?.value || "", talukId: "" })); reset(); }}
                    noOptionsMessage={() => t("No districts", { ns: "reports" })}
                  />
                </Col>
                <Col md={3}>
                  <label style={lbl}>{t("Taluk")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <ReactSelect
                    options={talukList.map((tk) => ({ value: String(tk.talukId), label: i18n.language === "kn" ? (tk.talukNameInKannada || tk.talukName) : tk.talukName }))}
                    placeholder={filter.districtId ? t("— Search Taluk —", { ns: "reports" }) : t("Select District first", { ns: "reports" })}
                    isSearchable isClearable isDisabled={!filter.districtId} menuPlacement="auto" menuPortalTarget={typeof document !== "undefined" ? document.body : null} menuPosition="fixed" styles={reactSelectStyles}
                    value={talukList.map((tk) => ({ value: String(tk.talukId), label: i18n.language === "kn" ? (tk.talukNameInKannada || tk.talukName) : tk.talukName })).find((o) => o.value === String(filter.talukId)) || null}
                    onChange={(opt) => { setFilter((p) => ({ ...p, talukId: opt?.value || "" })); reset(); }}
                    noOptionsMessage={() => t("No taluks", { ns: "reports" })}
                  />
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Year", { ns: "reports" })} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select value={filter.year} onChange={(e) => { setFilter((p) => ({ ...p, year: e.target.value })); reset(); }} style={sel}>
                    {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <label style={lbl}>{t("Month")} <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select value={filter.month} onChange={(e) => { setFilter((p) => ({ ...p, month: e.target.value })); reset(); }} style={sel}>
                    {MONTHS.map((m) => <option key={m.value} value={m.value}>{t(m.label, { ns: "reports" })}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                    {isLoading ? <><span className="spinner-border spinner-border-sm" /> {t("Loading…", { ns: "reports" })}</> : <>📋 {t("View", { ns: "reports" })}</>}
                  </button>
                </Col>
              </Row>
              {hasReport && (
                <Row className="g-2 mt-2 align-items-end">
                  <Col md={6}>
                    <label style={lbl}>{t("Quick Search (CRC, Race, Source)", { ns: "reports" })}</label>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Type to filter…", { ns: "reports" })} style={{ ...sel, padding: "8px 12px" }} />
                  </Col>
                  <Col md={6}>
                    <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                      <button type="button" disabled={isDownloadingPdf} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf)}>
                        {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> {t("Generating PDF…", { ns: "reports" })}</> : <>📄 {t("PDF", { ns: "reports" })}</>}
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

        {hasReport && (
          <div className="tsccrc-wrap mt-4">
            <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
              <div style={{ background: "linear-gradient(135deg,#ccfbf1,#ecfdf5)", border: "1.5px solid #5eead4", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>District / Taluk</span>
                <span style={{ fontSize: "13px", color: "#1a202c", fontWeight: 700, marginTop: "2px" }}>{districtName} · {talukName}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#dbeafe,#eff6ff)", border: "1.5px solid #93c5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಅಂತ್ಯಕ್ಕೆ · ದ್ವಿತಳಿ (DFLs)</span>
                <span className="tsccrc-num" style={{ fontSize: "16px", color: "#1e3a8a", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.meBiv)}</span>
                <span className="tsccrc-num" style={{ fontSize: "11px", color: "#1e40af", marginTop: "2px" }}>ಮಾಹೆ: {fmtInt(kpis.moBiv)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fef3c7,#fef9ec)", border: "1.5px solid #fcd34d", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "200px" }}>
                <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಅಂತ್ಯಕ್ಕೆ · ಮಿಶ್ರ (DFLs)</span>
                <span className="tsccrc-num" style={{ fontSize: "16px", color: "#78350f", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.meMix)}</span>
                <span className="tsccrc-num" style={{ fontSize: "11px", color: "#a16207", marginTop: "2px" }}>ಮಾಹೆ: {fmtInt(kpis.moMix)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#cffafe,#ecfeff)", border: "1.5px solid #67e8f9", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "180px" }}>
                <span style={{ fontSize: "11px", color: "#0e7490", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಅಂತ್ಯಕ್ಕೆ · ಫಲಾನುಭವಿಗಳು</span>
                <span className="tsccrc-num" style={{ fontSize: "16px", color: "#155e75", fontWeight: 800, marginTop: "2px" }}>{fmtInt(kpis.benMe)}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#ede9fe,#f5f3ff)", border: "1.5px solid #c4b5fd", borderRadius: "12px", padding: "10px 18px", display: "flex", flexDirection: "column", minWidth: "140px" }}>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em" }}>ಚಾಕಿ ಕೇಂದ್ರಗಳು</span>
                <span className="tsccrc-num" style={{ fontSize: "16px", color: "#4c1d95", fontWeight: 800, marginTop: "2px" }}>{kpis.crcs}</span>
              </div>
            </div>

            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 28px rgba(13,78,72,.12)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#134e4a,#0f766e 50%,#5b57ac)", color: "#fff", padding: "16px 22px", fontWeight: 800, fontSize: "14.5px", textAlign: "center", lineHeight: 1.5 }}>
                {fyLabel} ನೇ ಸಾಲಿನ {monthKn} – {filter.year} ರ ಮಾಹೆಯ {talukName} ತಾಲ್ಲೂಕಿನ ಖಾಸಗಿ ಮತ್ತು ಸರ್ಕಾರಿ ಚಾಕಿ ಸಾಕಾಣಿಕಾ ಕೇಂದ್ರಗಳ ಮಿಶ್ರ ಮತ್ತು ದ್ವಿತಳಿ ರೇಷ್ಮೆ ಮೊಟ್ಟೆ ಚಾಕಿ ವರದಿ
                <div style={{ fontSize: "12px", fontWeight: 600, opacity: .9, marginTop: "4px" }}>CRC Brushing Report (Private + Government) · {districtName} · {monthLabel} {filter.year}</div>
              </div>

              <div className="tsccrc-scroll" style={{ overflowX: "auto", maxHeight: "72vh", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", minWidth: "2100px" }}>
                  {(() => {
                    const sticky0 = { position: "sticky", top: 0, zIndex: 3 };
                    const hcell = (bg) => ({ background: bg, color: "#fff", padding: "7px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.2)", fontWeight: 800, ...sticky0 });
                    const moBg = "linear-gradient(135deg,#0f766e,#14b8a6)";
                    const meBg = "linear-gradient(135deg,#1d4ed8,#3b82f6)";
                    const benBg = "linear-gradient(135deg,#7c3aed,#a855f7)";
                    const idBg = "linear-gradient(135deg,#334155,#475569)";
                    // source sub-band + leaf labels (shared by Mo and ME blocks)
                    const SRC = [
                      { kn: "ರಾಜ್ಯ ಸರ್ಕಾರಿ", leaves: ["ಮಿಶ್ರ", "ದ್ವಿತಳಿ(ಪಿ1)"] },
                      { kn: "ಖಾಸಗಿ",         leaves: ["ಮಿಶ್ರ", "ದ್ವಿತಳಿ"] },
                      { kn: "ಕೇಂದ್ರ ರೇಷ್ಮೆ ಮಂಡಳಿ", leaves: ["ಮಿಶ್ರ", "ದ್ವಿತಳಿ(ಹೈಬ್ರಿಡ್)"] },
                      { kn: "ಒಟ್ಟು",        leaves: ["ಮಿಶ್ರ", "ದ್ವಿತಳಿ"] },
                    ];
                    return (
                      <thead>
                        {/* Row 1 — top group bands */}
                        <tr>
                          <th rowSpan={3} style={{ ...hcell(idBg), minWidth: 46 }}>ಕ್ರ.<br />ಸಂ.</th>
                          <th rowSpan={3} style={{ ...hcell(idBg), minWidth: 230, textAlign: "left" }}>ಚಾಕಿ ಸಾಕಾಣಿಕೆ ಕೇಂದ್ರದ ಹೆಸರು / ವಿಲಾಸ ಮತ್ತು ಮಾಲೀಕರ ಹೆಸರು</th>
                          <th rowSpan={3} style={{ ...hcell(idBg), minWidth: 130 }}>ನೋಂದಣಿ ಸಂಖ್ಯೆ ಮತ್ತು ಹಿಪ್ಪುನೇರಳೆ ವಿಸ್ತೀರ್ಣ (ಹೆ.)</th>
                          <th colSpan={8} style={hcell(moBg)}>ಮಾಹೆಯಲ್ಲಿ ಚಾಕಿ ಮಾಡಿದ ಮೊಟ್ಟೆಗಳು</th>
                          <th colSpan={2} rowSpan={2} style={hcell(benBg)}>ಮಾಹೆಯಲ್ಲಿ ಚಾಕಿ ವಿತರಣೆಯಾದ ಫಲಾನುಭವಿಗಳ ಸಂಖ್ಯೆ</th>
                          <th colSpan={8} style={hcell(meBg)}>ಮಾಹೆಯ ಅಂತ್ಯಕ್ಕೆ ಚಾಕಿ ಮಾಡಿದ ಮೊಟ್ಟೆಗಳು</th>
                          <th colSpan={2} rowSpan={2} style={hcell(benBg)}>ಮಾಹೆಯ ಅಂತ್ಯಕ್ಕೆ ಚಾಕಿ ವಿತರಣೆಯಾದ ಫಲಾನುಭವಿಗಳ ಸಂಖ್ಯೆ</th>
                        </tr>
                        {/* Row 2 — source sub-bands */}
                        <tr>
                          {SRC.map((s, i) => <th key={`mo-${i}`} colSpan={2} style={hcell(moBg)}>{s.kn}</th>)}
                          {SRC.map((s, i) => <th key={`me-${i}`} colSpan={2} style={hcell(meBg)}>{s.kn}</th>)}
                        </tr>
                        {/* Row 3 — leaf labels */}
                        <tr>
                          {SRC.map((s, i) => s.leaves.map((lf, j) => <th key={`mol-${i}-${j}`} style={{ ...hcell(moBg), minWidth: 70 }}>{lf}</th>))}
                          {["ಮಿಶ್ರ", "ದ್ವಿತಳಿ"].map((lf, j) => <th key={`mob-${j}`} style={{ ...hcell(benBg), minWidth: 70 }}>{lf}</th>)}
                          {SRC.map((s, i) => s.leaves.map((lf, j) => <th key={`mel-${i}-${j}`} style={{ ...hcell(meBg), minWidth: 70 }}>{lf}</th>))}
                          {["ಮಿಶ್ರ", "ದ್ವಿತಳಿ"].map((lf, j) => <th key={`meb-${j}`} style={{ ...hcell(benBg), minWidth: 70 }}>{lf}</th>)}
                        </tr>
                      </thead>
                    );
                  })()}
                  <tbody>
                    {filteredRows.length === 0 && (
                      <tr><td colSpan={23} style={{ padding: "40px 20px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}>{dataRows.length === 0 ? <>ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / {t("No records found.", { ns: "reports" })}</> : t('No matches for "{{search}}".', { ns: "reports", search })}</td></tr>
                    )}
                    {filteredRows.map((row, ri) => {
                      const tot = isTotalRow(row);
                      const NUMK = ["mo_sm","mo_sb","mo_pm","mo_pb","mo_cm","mo_cb","mo_tm","mo_tb","mo_bm","mo_bb",
                                    "me_sm","me_sb","me_pm","me_pb","me_cm","me_cb","me_tm","me_tb","me_bm","me_bb"];
                      const rowBg = tot ? "linear-gradient(135deg,#fff7ed,#ffedd5)" : (ri % 2 === 1 ? "#f8fafc" : "#ffffff");
                      const cb = { padding: "8px 8px", borderBottom: "1px solid #e2e8f0", borderRight: "1px solid #eef2f6", fontSize: "11.5px", verticalAlign: "middle" };
                      // highlight total columns (mo_tm/mo_tb=idx6,7 ; me_tm/me_tb=idx16,17)
                      const isTotCol = (k) => k === "mo_tm" || k === "mo_tb" || k === "me_tm" || k === "me_tb";
                      return (
                        <tr key={`${row.sl_no}-${ri}`} className="tsccrc-tr" style={{ background: rowBg, fontWeight: tot ? 800 : 400 }}>
                          <td style={{ ...cb, textAlign: "center", color: "#475569", fontWeight: 700 }}>
                            {tot ? "" : (
                              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", color: "#1e293b", fontWeight: 800, fontSize: "10.5px" }}>{row.sl_no}</span>
                            )}
                          </td>
                          <td style={{ ...cb, textAlign: "left", paddingLeft: "12px", color: tot ? "#9a3412" : "#0f172a", fontWeight: 800 }}>
                            {tot ? "ಒಟ್ಟು" : <>👤 {row.crc_name || "—"}</>}
                          </td>
                          <td className="tsccrc-num" style={{ ...cb, textAlign: "right", paddingRight: "12px", color: "#155e75", fontWeight: 700 }}>
                            {!tot && row.reg_area && String(row.reg_area).trim() !== "" ? row.reg_area : <span style={{ color: "#cbd5e0" }}>—</span>}
                          </td>
                          {NUMK.map((k) => {
                            const v = numOrZero(row[k]);
                            return (
                              <td key={k} className="tsccrc-num" style={{
                                ...cb, textAlign: "right", paddingRight: "12px",
                                background: isTotCol(k) ? (tot ? "transparent" : "#f0fdfa") : "transparent",
                                color: v > 0 ? (isTotCol(k) ? "#115e59" : "#1e293b") : "#cbd5e0",
                                fontWeight: isTotCol(k) || tot ? 800 : 600,
                              }}>
                                {fmtInt(row[k])}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "linear-gradient(135deg,#ecfdf5,#eef2ff)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", borderTop: "1.5px solid #c7d2fe" }}>
                <span style={{ fontSize: "12px", color: "#4338ca", fontWeight: 600 }}>
                  {districtName} · {talukName} — {monthLabel} {monthKn} {filter.year} &nbsp;·&nbsp; Sheet-8 · CRC Brushing (DFLs)
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

export default TscMonthlyCrcBrushingReport;
