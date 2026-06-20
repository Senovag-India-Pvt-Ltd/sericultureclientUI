import React, { useEffect, useMemo, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
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

if (!document.getElementById("fp2cd-styles")) {
  const s = document.createElement("style");
  s.id = "fp2cd-styles";
  s.innerHTML = `
    .fp2cd-swal { border-radius:22px !important; padding:8px !important; box-shadow:0 30px 90px rgba(0,0,0,.22) !important; }
    .fp2cd-swal .swal2-title { font-size:21px !important; font-weight:800 !important; color:#1a202c !important; }
    .fp2cd-swal .swal2-icon { margin:20px auto 4px !important; }
    .fp2cd-swal .swal2-confirm { border-radius:11px !important; padding:12px 30px !important; font-weight:700 !important; }
    @keyframes fp2cd-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
    .fp2cd-wrap { animation: fp2cd-in .35s ease; }
    .fp2cd-tr:hover td { filter:brightness(.97); transition:filter .12s; }
    .fp2cd-num { font-feature-settings:"tnum"; font-variant-numeric: tabular-nums; }
    .fp2cd-scroll::-webkit-scrollbar { height:10px; }
    .fp2cd-scroll::-webkit-scrollbar-track { background:#f1f5f9; border-radius:6px; }
    .fp2cd-scroll::-webkit-scrollbar-thumb { background:linear-gradient(135deg,#0f766e,#5b57ac); border-radius:6px; }
    .fp2cd-table th { letter-spacing:.02em; }
    .fp2cd-stripe { background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(148,163,184,.18) 4px, rgba(148,163,184,.18) 7px); }
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

// 21-column header config (matches backend FARM_P2CD_HEADERS_XLS).
// group: "id" (slate) | "race" (teal) | "egg" (blue) | "cocoon" (violet) | "yield" (emerald) | "supply" (amber) | "note" (slate-mute)
// w: relative width hint (px)
const COLS = [
  { key: "sl_no",         kn: "ಕ್ರ.ಸಂ",      en: "Sl",           group: "id",     w: 56,  align: "center" },
  { key: "farm",          kn: "ಸ.ರೇ.ಕೃ. ಕ್ಷೇತ್ರ",  en: "Farm",         group: "id",     w: 130, align: "left", main: true },
  { key: "crop_no",       kn: "ಬೆಳೆ ಸಂ",     en: "Crop No",      group: "id",     w: 76,  align: "center" },
  { key: "race",          kn: "ತಳಿ",         en: "Race",         group: "race",   w: 110, align: "left", main: true },
  { key: "dfl_source",    kn: "ಮೊಟ್ಟೆ ಮೂಲ", en: "DFL Source",   group: "race",   w: 130, align: "left" },
  { key: "lot_number",    kn: "ತಂಡ",         en: "Lot",          group: "race",   w: 90,  align: "center" },
  { key: "dfl_count",     kn: "ಮೊಟ್ಟೆ",      en: "DFL Count",    group: "egg",    w: 96,  align: "right",  main: true },
  { key: "brushing_date", kn: "ಚಾಕಿ ದಿ",     en: "Brush Date",   group: "egg",    w: 110, align: "center", isDate: true },
  { key: "chawki_pct",    kn: "ಶೇ.ಚಾಕಿ",     en: "Chawki %",     group: "egg",    w: 84,  align: "right" },
  { key: "ripe_date",     kn: "ಹಣ್ಣಾ ದಿ",   en: "Ripe Date",    group: "egg",    w: 110, align: "center", isDate: true },
  { key: "cocoon_kg",     kn: "ಗೂಡು ಕೆ.ಜಿ",  en: "Cocoon kg",    group: "cocoon", w: 96,  align: "right",  main: true },
  { key: "cocoon_qty",    kn: "ಗೂಡು ಸಂ",     en: "Cocoon Qty",   group: "cocoon", w: 96,  align: "right" },
  { key: "avg_yield_kg",  kn: "ಸ.ಇ ಕೆ.ಜಿ",   en: "Yield kg",     group: "yield",  w: 84,  align: "right" },
  { key: "avg_yield_qty", kn: "ಸ.ಇ ಸಂ",     en: "Yield Qty",    group: "yield",  w: 84,  align: "right" },
  { key: "cocoons_per_kg",kn: "ಕೆ.ಜಿ/ಗೂಡು", en: "Coc/kg",       group: "yield",  w: 84,  align: "right" },
  { key: "sowing",        kn: "ಬಿತ್ತನೆ",     en: "Sowing",       group: "supply", w: 78,  align: "right" },
  { key: "reeling",       kn: "ರೀಲಿಂಗ್",     en: "Reeling",      group: "supply", w: 78,  align: "right" },
  { key: "bico_market",   kn: "ಬಿಕೋ",       en: "Bico/Mkt",     group: "supply", w: 90,  align: "right" },
  { key: "supply_date",   kn: "ಸರಬ ದಿ",      en: "Supply Date",  group: "supply", w: 110, align: "center", isDate: true },
  { key: "supply_rate",   kn: "ಸರಬ ದರ",      en: "Rate",         group: "supply", w: 84,  align: "right" },
  { key: "notes",         kn: "ಷರಾ",        en: "Notes",        group: "note",   w: 110, align: "left" },
];

const GROUP_BG = {
  id:     { hdr: "#475569", text: "#fff", body: "#ffffff" },
  race:   { hdr: "#0f766e", text: "#fff", body: "#f0fdfa" },
  egg:    { hdr: "#2563eb", text: "#fff", body: "#eff6ff" },
  cocoon: { hdr: "#5b21b6", text: "#fff", body: "#f5f3ff" },
  yield:  { hdr: "#15803d", text: "#fff", body: "#f0fdf4" },
  supply: { hdr: "#b45309", text: "#fff", body: "#fffbeb" },
  note:   { hdr: "#475569", text: "#fff", body: "#f8fafc" },
};

const GROUP_BANDS = [
  { g: "id",     label: "Identification",       icon: "🔢" },
  { g: "race",   label: "Race / Source",        icon: "🧬" },
  { g: "egg",    label: "DFL & Brushing",       icon: "🥚" },
  { g: "cocoon", label: "Cocoon Production",    icon: "🐛" },
  { g: "yield",  label: "Yield Indicators",     icon: "📈" },
  { g: "supply", label: "Sowing / Reeling / Supply", icon: "🚚" },
  { g: "note",   label: "Notes",                icon: "📝" },
];

function FarmP2CropDetailReport() {
  const { t } = useTranslation();

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
    api.get(baseURL + "farmMaster/get-all")
      .then((r) => setFarmList(r.data.content.farmMaster || []))
      .catch(() => setFarmList([]));

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
      background: "#fff", customClass: { popup: "fp2cd-swal" },
    });

  const showErr = (title, msg) =>
    Swal.fire({
      icon: "error", title,
      html: `<div style="padding:8px 2px 12px"><div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #feb2b2;border-radius:14px;padding:16px 20px;display:flex;align-items:flex-start;gap:13px;text-align:left"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#e53e3e,#fc5c7d);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🔌</div><div><p style="color:#742a2a;font-size:14px;font-weight:700;margin:0 0 5px">Failed</p><p style="color:#9b2c2c;font-size:13px;margin:0;line-height:1.65">${msg}</p></div></div></div>`,
      confirmButtonText: "Close", confirmButtonColor: "#e53e3e",
      background: "#fff", customClass: { popup: "fp2cd-swal" },
    });

  const params = () => {
    const m = Number(filter.month);
    const year = m >= 4 ? fyStartYear : fyStartYear + 1;
    return { farmId: filter.farmId, year, month: m };
  };

  const handleView = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { showWarn(err); return; }
    setIsLoading(true);
    setHasReport(false);
    setDataRows([]);
    try {
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-p2-crop-detail", { params: params() });
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
          showErr("Fetch Failed", backendMsg || err?.message || "Failed to load the P2 Farm Crop Detail report.");
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-p2-crop-detail/pdf", { params: params(), responseType: "blob" });
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
      const res = await api.get(baseURLSeedDFL + "grainage-progress-report/farm-p2-crop-detail/excel", { params: params(), responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      const m = Number(filter.month);
      const year = m >= 4 ? fyStartYear : fyStartYear + 1;
      a.download = `farm_p2_crop_detail_${filter.farmId}_${year}_${m}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showErr("Excel Failed", "Could not generate the Excel report.");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const selectedFarm = farmList.find((f) => String(f.farmId) === String(filter.farmId));
  const monthNum   = Number(filter.month);
  const monthKn    = MONTH_KN[monthNum] || "";
  const monthLabel = MONTHS.find((m) => String(m.value) === String(filter.month))?.label || "";
  const monthYear  = monthNum >= 4 ? fyStartYear : (fyStartYear ? fyStartYear + 1 : null);
  const farmDisplay = selectedFarm?.farmName || "—";

  // KPIs
  const stats = useMemo(() => {
    let lots = 0, dflTot = 0, cocKgTot = 0, cocQtyTot = 0;
    const races = new Set();
    let chawkiSum = 0, chawkiCnt = 0;
    let cpkSum = 0, cpkCnt = 0;
    dataRows.forEach((r) => {
      lots++;
      dflTot   += numOrZero(r.dfl_count);
      cocKgTot += numOrZero(r.cocoon_kg);
      cocQtyTot+= numOrZero(r.cocoon_qty);
      if (r.race) races.add(String(r.race).trim());
      const cp = numOrZero(r.chawki_pct);
      if (cp > 0) { chawkiSum += cp; chawkiCnt++; }
      const cpk = numOrZero(r.cocoons_per_kg);
      if (cpk > 0) { cpkSum += cpk; cpkCnt++; }
    });
    const avgYieldKg = dflTot > 0 ? (cocKgTot * 100.0 / dflTot) : 0;
    const avgChawki  = chawkiCnt > 0 ? chawkiSum / chawkiCnt : 0;
    const avgCpk     = cpkCnt    > 0 ? cpkSum / cpkCnt       : 0;
    return { lots, dflTot, cocKgTot, cocQtyTot, races: races.size, avgYieldKg, avgChawki, avgCpk };
  }, [dataRows]);

  return (
    <Layout title={t("P2 Farm Crop Detail Report")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              {t("ನಮೂನೆ-1 — P2 Farm Crop Detail")}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: "linear-gradient(135deg,#ddd6fe,#c4b5fd)",
                color: "#4c1d95", padding: "2px 10px", borderRadius: "20px",
                fontSize: "10.5px", fontWeight: 800, marginLeft: "8px",
                border: "1px solid #a78bfa", verticalAlign: "middle",
              }}>P2 Farm · Sheet-2 · Form-1</span>
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
            gap: "12px", position: "relative",
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", backdropFilter: "blur(6px)" }}>📒</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px", lineHeight: 1.2, letterSpacing: ".01em" }}>
                ನಮೂನೆ-1 — ಬೆಳೆ ತಂಡವಾರು ವಿವರ
                <span style={{ background: "rgba(255,255,255,.22)", padding: "2px 9px", borderRadius: "12px", marginLeft: "8px", fontSize: "10.5px", fontWeight: 800 }}>P2 Farm</span>
              </div>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "2px" }}>P2 Farm Crop Detail — Sheet 2 · Form-1 · 21 columns × N lots</div>
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
                  <label style={lbl}>Farm <span style={{ color: "#e53e3e" }}>*</span></label>
                  <Form.Select name="farmId" value={filter.farmId} onChange={handleChange} style={sel}>
                    <option value="">— Select Farm —</option>
                    {farmList.map((f) => (
                      <option key={f.farmId} value={f.farmId}>{f.farmName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
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
                    <button type="submit" disabled={isLoading} style={btn("linear-gradient(135deg,#0f766e,#14b8a6)", "0 4px 12px rgba(15,118,110,.32)", isLoading)}>
                      {isLoading ? <><span className="spinner-border spinner-border-sm" /> Loading…</> : <>📋 View</>}
                    </button>
                    <button type="button" disabled={isDownloadingPdf || !hasReport} onClick={handlePdf} style={btn("linear-gradient(135deg,#b91c1c,#dc2626)", "0 4px 12px rgba(185,28,28,.30)", isDownloadingPdf || !hasReport)}>
                      {isDownloadingPdf ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📄 PDF</>}
                    </button>
                    <button type="button" disabled={isDownloadingExcel || !hasReport} onClick={handleExcel} style={btn("linear-gradient(135deg,#15803d,#22c55e)", "0 4px 12px rgba(21,128,61,.30)", isDownloadingExcel || !hasReport)}>
                      {isDownloadingExcel ? <><span className="spinner-border spinner-border-sm" /> …</> : <>📊 Excel</>}
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* ── Report ──────────────────────────────────────────────── */}
        {hasReport && (
          <div className="fp2cd-wrap mt-3">
            {/* Title strip */}
            <div style={{
              borderRadius: "14px",
              background: "linear-gradient(135deg,#ffffff 0%,#f5f3ff 100%)",
              border: "1.5px solid #c4b5fd",
              padding: "13px 18px", display: "flex", alignItems: "center", gap: "12px",
              boxShadow: "0 4px 16px rgba(91,87,172,.10)", marginBottom: "14px",
            }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: "linear-gradient(135deg,#5b21b6,#0f766e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#fff" }}>📒</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#3a1f6e", letterSpacing: ".01em" }}>
                  ನಮೂನೆ-1 · {farmDisplay} · {monthKn} {monthYear || ""}
                </div>
                <div style={{ fontSize: "11.5px", color: "#5a6a7e", marginTop: "1px" }}>
                  Crop Detail · {monthLabel} {monthYear || ""} · {dataRows.length} lots {stats.races > 0 ? ` · ${stats.races} race${stats.races > 1 ? "s" : ""}` : ""}
                </div>
              </div>
            </div>

            {/* KPI tiles */}
            <Row className="g-2 mb-3">
              {[
                { label: "Total Lots",       v: fmt(stats.lots),       sub: "ತಂಡಗಳು",          bg: "linear-gradient(135deg,#bfdbfe,#93c5fd)", color: "#1e3a8a", icon: "🔢" },
                { label: "DFLs Brushed",     v: fmt(stats.dflTot),     sub: "ಚಾಕಿಯಾದ ಮೊಟ್ಟೆ", bg: "linear-gradient(135deg,#bbf7d0,#86efac)", color: "#14532d", icon: "🥚" },
                { label: "Cocoon kg",        v: fmt(stats.cocKgTot),   sub: "ಗೂಡು ಉತ್ಪಾದನೆ",  bg: "linear-gradient(135deg,#ddd6fe,#c4b5fd)", color: "#4c1d95", icon: "🐛" },
                { label: "Cocoon Qty",       v: fmt(stats.cocQtyTot),  sub: "ಸಂಖ್ಯೆ",           bg: "linear-gradient(135deg,#fbcfe8,#f9a8d4)", color: "#831843", icon: "Σ" },
                { label: "Avg Yield (kg/100 DFL)", v: fmt(Math.round(stats.avgYieldKg * 100) / 100), sub: "ಸರಾಸರಿ ಇಳುವರಿ", bg: "linear-gradient(135deg,#a7f3d0,#6ee7b7)", color: "#064e3b", icon: "📈" },
                { label: "Chawki %",         v: stats.avgChawki ? `${(Math.round(stats.avgChawki * 100) / 100).toFixed(2)}%` : "—", sub: "ಸರಾಸರಿ ಶೇ.", bg: "linear-gradient(135deg,#fde68a,#fcd34d)", color: "#78350f", icon: "🎯" },
              ].map((k, i) => (
                <Col key={i} sm={6} md={4} lg={2}>
                  <div style={{
                    background: k.bg, borderRadius: "13px", padding: "12px 14px",
                    border: "1.5px solid rgba(255,255,255,.55)",
                    boxShadow: "0 4px 14px rgba(0,0,0,.07)",
                    display: "flex", alignItems: "center", gap: "11px", height: "100%",
                  }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: "rgba(255,255,255,.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "19px", flexShrink: 0 }}>{k.icon}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "10.5px", fontWeight: 700, color: k.color, opacity: .85, textTransform: "uppercase", letterSpacing: ".06em" }}>{k.label}</div>
                      <div className="fp2cd-num" style={{ fontSize: "16px", fontWeight: 800, color: k.color, lineHeight: 1.15, marginTop: "1px" }}>{k.v || "—"}</div>
                      <div style={{ fontSize: "10px", color: k.color, opacity: .75, marginTop: "1px" }}>{k.sub}</div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* Group legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
              {GROUP_BANDS.map((b) => (
                <span key={b.g} style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  background: GROUP_BG[b.g].body, color: GROUP_BG[b.g].hdr,
                  border: `1.5px solid ${GROUP_BG[b.g].hdr}33`,
                  borderRadius: "20px", padding: "3px 12px", fontSize: "11px", fontWeight: 700,
                }}>
                  <span style={{ fontSize: "13px" }}>{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>

            {/* Table */}
            <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 6px 24px rgba(15,118,110,.10)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#0f766e,#5b57ac)", padding: "10px 16px", color: "#fff", display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, fontSize: "13px" }}>
                <span style={{ fontSize: "16px" }}>📊</span>
                Lot-wise Crop Detail (21 columns)
                <span style={{ marginLeft: "auto", background: "rgba(255,255,255,.22)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>
                  {dataRows.length} lots
                </span>
              </div>

              <div className="fp2cd-scroll" style={{ overflowX: "auto" }}>
                <table className="fp2cd-num fp2cd-table" style={{ borderCollapse: "separate", borderSpacing: 0, fontSize: "12px", minWidth: COLS.reduce((s, c) => s + c.w, 0) }}>
                  <thead>
                    {/* Group band row */}
                    <tr>
                      {(() => {
                        const out = [];
                        let i = 0;
                        while (i < COLS.length) {
                          const g = COLS[i].group;
                          let span = 1;
                          while (i + span < COLS.length && COLS[i + span].group === g) span++;
                          const meta = GROUP_BANDS.find((b) => b.g === g);
                          const bg = GROUP_BG[g];
                          out.push(
                            <th key={`g-${i}`} colSpan={span} style={{
                              background: bg.hdr, color: bg.text,
                              padding: "7px 6px", fontSize: "11px", fontWeight: 800,
                              letterSpacing: ".05em", textTransform: "uppercase",
                              borderBottom: "1px solid rgba(255,255,255,.25)",
                              borderRight: "1px solid rgba(255,255,255,.18)",
                              textAlign: "center",
                              position: "sticky", top: 0, zIndex: 3,
                            }}>
                              {meta ? <>{meta.icon} {meta.label}</> : g}
                            </th>
                          );
                          i += span;
                        }
                        return out;
                      })()}
                    </tr>
                    {/* Column headers */}
                    <tr>
                      {COLS.map((c, ci) => {
                        const bg = GROUP_BG[c.group];
                        return (
                          <th key={ci} style={{
                            background: `${bg.hdr}DD`, color: bg.text,
                            padding: "9px 8px",
                            fontSize: "10.5px", fontWeight: 700,
                            textAlign: c.align,
                            width: c.w, minWidth: c.w,
                            borderBottom: "2px solid rgba(0,0,0,.18)",
                            borderRight: "1px solid rgba(255,255,255,.18)",
                            position: "sticky", top: 26, zIndex: 2,
                            whiteSpace: "nowrap",
                          }}>
                            <div style={{ fontWeight: 800 }}>{c.kn}</div>
                            <div style={{ fontWeight: 600, opacity: .85, fontSize: "9.5px" }}>{c.en}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.length === 0 && (
                      <tr><td colSpan={COLS.length} style={{ padding: "26px", textAlign: "center", color: "#7a8aa0", fontSize: "13px" }}>ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ / No records found</td></tr>
                    )}
                    {dataRows.map((row, ri) => {
                      const altRow = ri % 2 === 1;
                      return (
                        <tr key={ri} className="fp2cd-tr">
                          {COLS.map((c, ci) => {
                            const bg = GROUP_BG[c.group];
                            const raw = row[c.key];
                            const txt = c.key === "chawki_pct"
                              ? (raw ? `${fmt(raw)}%` : "")
                              : c.isDate
                              ? (raw == null ? "" : String(raw))
                              : fmt(raw);
                            const empty = txt === "" || raw === null || raw === undefined;
                            const placeholder = c.placeholder && empty;
                            const tdStyle = {
                              padding: "8px 8px",
                              textAlign: c.align,
                              borderBottom: "1px solid #e2e8f0",
                              borderRight: ci < COLS.length - 1 ? "1px solid #f1f5f9" : "none",
                              background: placeholder ? undefined : (altRow ? bg.body : "#ffffff"),
                              fontWeight: c.main ? 700 : 500,
                              color: placeholder ? "#94a3b8"
                                    : (c.main && c.group === "race") ? "#0f3a37"
                                    : (c.main && c.group === "egg")  ? "#1e3a8a"
                                    : (c.main && c.group === "cocoon") ? "#4c1d95"
                                    : (c.main && c.group === "id")   ? "#1f2937"
                                    : "#374151",
                              fontVariantNumeric: "tabular-nums",
                              whiteSpace: "nowrap",
                            };
                            return (
                              <td
                                key={ci}
                                className={placeholder ? "fp2cd-stripe" : ""}
                                style={tdStyle}
                                title={placeholder ? "Not yet tracked in source data" : undefined}
                              >
                                {placeholder ? "—" : txt}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Footer note */}
            <div style={{ marginTop: "10px", padding: "10px 14px", background: "linear-gradient(135deg,#f5f3ff,#f0fdfa)", borderRadius: "10px", border: "1.5px dashed #c4b5fd", fontSize: "11.5px", color: "#3a1f6e", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>💡</span>
              <span>
                Spine: <em>rearing_of_dfls</em> filtered on <strong>brushing_date</strong> within {monthLabel} {monthYear || ""}.
                Cocoon weights / counts and supply date come from <em>supply_of_cocoons</em> (the farm cocoon dispatch) per lot.
                <em>Sowing / Reeling / Bico-Mkt</em> are the cocoon-disposal split from <em>rearing_of_dfls</em>.
                <strong>Supply Rate</strong> has no source column yet (data-entry gap) and shows 0.
              </span>
            </div>
          </div>
        )}
      </Block>
    </Layout>
  );
}

export default FarmP2CropDetailReport;
