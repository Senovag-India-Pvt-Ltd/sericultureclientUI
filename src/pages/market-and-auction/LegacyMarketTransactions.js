import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import api from "../../services/auth/api";

// XC-004: pre-project (legacy) cocoon market transactions - import the old system's Excel / CSV export (re-importing a
// newer export synchronises without duplicates) and trace transactions across the legacy and the new system.
// Backend: market-auction /v1/legacy-market/*

const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const swalClass = {
  popup: "lmt-swal-popup",
  title: "lmt-swal-title",
  htmlContainer: "lmt-swal-text",
  confirmButton: "lmt-swal-confirm",
  cancelButton: "lmt-swal-cancel",
};
const swal = (opts) => Swal.fire({ buttonsStyling: false, customClass: swalClass, ...opts });

const styles = `
  .lmt { --lmt-primary:#1e67a8; --lmt-primary-2:#3b8dd6; --lmt-ink:#1f2d3d; --lmt-muted:#6b7a8c; --lmt-line:#e3eaf3;
         --lmt-soft:#f4f8fd; --lmt-legacy:#b26a00; --lmt-legacy-bg:#fff4e5; --lmt-new:#18794e; --lmt-new-bg:#e7f7ee;
         --lmt-bad:#c43257; --lmt-bad-bg:#fdecf0; }

  /* hero */
  .lmt-hero { position:relative; overflow:hidden; display:flex; flex-wrap:wrap; align-items:center; gap:18px;
              padding:20px 24px; border-radius:16px; margin-bottom:14px;
              background:linear-gradient(120deg,#174f86 0%,#1e67a8 45%,#3b8dd6 100%);
              box-shadow:0 8px 24px rgba(23,79,134,.28); }
  .lmt-hero:after { content:""; position:absolute; right:-60px; top:-80px; width:260px; height:260px; border-radius:50%;
                    background:radial-gradient(circle,rgba(255,255,255,.18),rgba(255,255,255,0) 70%); }
  .lmt-hero-icon { width:56px; height:56px; border-radius:14px; display:flex; align-items:center; justify-content:center;
                   background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.28); color:#fff; font-size:1.7rem; flex-shrink:0; }
  .lmt-hero-text { flex:1 1 320px; min-width:0; }
  .lmt-hero h2 { color:#fff !important; margin:0; font-size:1.4rem; font-weight:800; letter-spacing:.01em; }
  .lmt-hero p { color:#dceafa; margin:4px 0 0; font-size:.88rem; }
  .lmt-hero-chips { display:flex; flex-wrap:wrap; gap:10px; position:relative; z-index:1; }
  .lmt-chip { background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.25); border-radius:12px; padding:8px 14px; min-width:110px; }
  .lmt-chip b { display:block; color:#fff; font-size:1.15rem; line-height:1.2; }
  .lmt-chip span { color:#cfe2f7; font-size:.7rem; text-transform:uppercase; letter-spacing:.05em; }

  /* shell */
  .lmt-card { background:#fff; border-radius:16px; box-shadow:0 4px 20px rgba(16,42,77,.10); overflow:hidden; }
  .lmt-tabs { display:flex; gap:6px; padding:14px 18px 0; border-bottom:1px solid var(--lmt-line); background:#fbfdff; flex-wrap:wrap; }
  .lmt-tab { border:none; background:transparent; padding:10px 16px 12px; font-weight:700; color:var(--lmt-muted); font-size:.92rem;
             border-bottom:3px solid transparent; display:flex; align-items:center; gap:8px; cursor:pointer; transition:color .15s,border-color .15s; }
  .lmt-tab:hover { color:var(--lmt-primary); }
  .lmt-tab.active { color:var(--lmt-primary); border-bottom-color:var(--lmt-primary); }
  .lmt-tab .icon { font-size:1.1rem; }
  .lmt-body { padding:20px 22px 24px; }

  /* section titles */
  .lmt-section { display:flex; align-items:center; gap:10px; margin:0 0 12px; }
  .lmt-section h6 { margin:0; font-weight:800; color:var(--lmt-ink); font-size:.95rem; }
  .lmt-section .lmt-section-sub { color:var(--lmt-muted); font-size:.8rem; }
  .lmt-section .ms-auto { margin-left:auto; }

  /* form */
  .lmt .form-label { font-size:.78rem; font-weight:700; color:#4a5568; text-transform:uppercase; letter-spacing:.03em; margin-bottom:6px; }
  .lmt-field { position:relative; }
  .lmt-field > .icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#8a9aae; font-size:1.05rem; pointer-events:none; }
  .lmt-field .form-control, .lmt-field .form-select { padding-left:36px; }
  .lmt .form-control, .lmt .form-select { border-radius:10px; border-color:#d5dfeb; min-height:42px; font-size:.9rem; }
  .lmt .form-control:focus, .lmt .form-select:focus { border-color:var(--lmt-primary-2); box-shadow:0 0 0 3px rgba(59,141,214,.15); }
  .lmt-search-panel { background:var(--lmt-soft); border:1px solid var(--lmt-line); border-radius:14px; padding:16px; }
  .lmt-hint { font-size:.78rem; color:var(--lmt-muted); display:flex; align-items:center; gap:6px; margin-top:10px; }
  .lmt-btn { border-radius:10px !important; font-weight:700 !important; min-height:42px; display:inline-flex !important; align-items:center; justify-content:center; gap:6px; }
  .lmt-btn-primary { background:linear-gradient(90deg,#1e67a8,#3b8dd6) !important; border:none !important; color:#fff !important; box-shadow:0 4px 12px rgba(30,103,168,.25); }
  .lmt-btn-primary:hover { filter:brightness(1.06); }
  .lmt-btn-primary:disabled { opacity:.7; }
  .lmt-btn-light { background:#fff !important; border:1px solid #d5dfeb !important; color:#4a5568 !important; }
  .lmt-btn-light:hover { background:#f3f6fa !important; }

  /* stats */
  .lmt-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; }
  .lmt-stat { display:flex; align-items:center; gap:12px; background:#fff; border:1px solid var(--lmt-line); border-radius:12px; padding:12px 14px; }
  .lmt-stat-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;
                   background:#eaf2fb; color:var(--lmt-primary); }
  .lmt-stat b { display:block; font-size:1.2rem; color:var(--lmt-ink); line-height:1.15; }
  .lmt-stat span { font-size:.7rem; color:var(--lmt-muted); text-transform:uppercase; letter-spacing:.04em; font-weight:600; }
  .lmt-stat.ok .lmt-stat-icon { background:var(--lmt-new-bg); color:var(--lmt-new); }
  .lmt-stat.warn .lmt-stat-icon { background:var(--lmt-legacy-bg); color:var(--lmt-legacy); }
  .lmt-stat.bad .lmt-stat-icon { background:var(--lmt-bad-bg); color:var(--lmt-bad); }
  .lmt-stat.bad b { color:var(--lmt-bad); }
  .lmt-stat.grey .lmt-stat-icon { background:#f0f2f5; color:#6b7a8c; }

  /* distribution bar */
  .lmt-bar { display:flex; height:8px; border-radius:99px; overflow:hidden; background:#eef2f7; margin-top:12px; }
  .lmt-bar i { display:block; height:100%; }
  .lmt-legend { display:flex; flex-wrap:wrap; gap:14px; margin-top:8px; font-size:.75rem; color:var(--lmt-muted); }
  .lmt-legend span { display:inline-flex; align-items:center; gap:6px; }
  .lmt-legend i { width:10px; height:10px; border-radius:3px; display:inline-block; }

  /* filter pills */
  .lmt-pills { display:inline-flex; background:#eef3f9; border-radius:10px; padding:3px; gap:2px; }
  .lmt-pill { border:none; background:transparent; padding:6px 12px; border-radius:8px; font-size:.8rem; font-weight:700; color:var(--lmt-muted); cursor:pointer; }
  .lmt-pill.active { background:#fff; color:var(--lmt-primary); box-shadow:0 1px 4px rgba(16,42,77,.12); }

  /* tables */
  .lmt-table-wrap { border:1px solid var(--lmt-line); border-radius:12px; overflow:auto; max-height:520px; }
  .lmt-table { margin:0 !important; }
  .lmt-table thead th { position:sticky; top:0; z-index:1; background:#f4f8fd !important; font-size:.72rem; text-transform:uppercase;
                        letter-spacing:.04em; color:#5a6b80; white-space:nowrap; border-bottom:1px solid var(--lmt-line) !important; padding:10px 12px !important; }
  .lmt-table td { font-size:.85rem; vertical-align:middle; padding:10px 12px !important; border-color:#eef2f7 !important; color:var(--lmt-ink); }
  .lmt-table tbody tr:nth-child(even) td { background:#fbfcfe; }
  .lmt-table tbody tr:hover td { background:#f0f6fd; }
  .lmt-table .num { text-align:right; font-variant-numeric:tabular-nums; white-space:nowrap; }
  .lmt-sub { display:block; font-size:.74rem; color:var(--lmt-muted); }
  .lmt-ref { font-family:SFMono-Regular,Consolas,monospace; font-size:.8rem; color:#34495e; }

  /* badges */
  .lmt-badge { display:inline-flex; align-items:center; gap:6px; border-radius:999px; padding:3px 10px; font-size:.72rem; font-weight:700; white-space:nowrap; }
  .lmt-badge:before { content:""; width:7px; height:7px; border-radius:50%; background:currentColor; }
  .lmt-badge.LEGACY { background:var(--lmt-legacy-bg); color:var(--lmt-legacy); }
  .lmt-badge.NEW_SYSTEM { background:var(--lmt-new-bg); color:var(--lmt-new); }
  .lmt-badge.COMPLETED { background:var(--lmt-new-bg); color:var(--lmt-new); }
  .lmt-badge.FAILED { background:var(--lmt-bad-bg); color:var(--lmt-bad); }
  .lmt-count { display:inline-block; min-width:26px; text-align:center; border-radius:99px; padding:1px 8px; font-weight:700; font-size:.78rem; }
  .lmt-count.ok { background:var(--lmt-new-bg); color:var(--lmt-new); }
  .lmt-count.bad { background:var(--lmt-bad-bg); color:var(--lmt-bad); }
  .lmt-count.zero { color:#a0aec0; }

  /* empty state */
  .lmt-empty { text-align:center; padding:36px 16px; color:var(--lmt-muted); }
  .lmt-empty-icon { width:68px; height:68px; margin:0 auto 12px; border-radius:50%; display:flex; align-items:center; justify-content:center;
                    background:#eaf2fb; color:var(--lmt-primary); font-size:1.9rem; }
  .lmt-empty h6 { color:var(--lmt-ink); font-weight:800; margin-bottom:4px; }
  .lmt-empty p { font-size:.85rem; margin:0 auto; max-width:460px; }

  /* import steps */
  .lmt-steps { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:14px; }
  .lmt-step { position:relative; border:1px solid var(--lmt-line); border-radius:14px; padding:16px; background:#fff; display:flex; flex-direction:column; gap:10px; }
  .lmt-step-no { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,#1e67a8,#3b8dd6); color:#fff; font-weight:800;
                 display:flex; align-items:center; justify-content:center; font-size:.85rem; }
  .lmt-step-head { display:flex; align-items:center; gap:10px; }
  .lmt-step-head h6 { margin:0; font-weight:800; color:var(--lmt-ink); font-size:.92rem; }
  .lmt-step p { margin:0; font-size:.8rem; color:var(--lmt-muted); }
  .lmt-step.done .lmt-step-no { background:var(--lmt-new); }
  .lmt-drop { border:2px dashed #c4d4e8; border-radius:12px; background:var(--lmt-soft); padding:18px 12px; text-align:center; cursor:pointer;
              transition:border-color .15s, background .15s; }
  .lmt-drop:hover, .lmt-drop.over { border-color:var(--lmt-primary-2); background:#eaf3fd; }
  .lmt-drop .icon { font-size:1.8rem; color:var(--lmt-primary); }
  .lmt-drop b { display:block; color:var(--lmt-ink); font-size:.85rem; margin-top:4px; }
  .lmt-drop span { font-size:.75rem; color:var(--lmt-muted); }
  .lmt-file { display:flex; align-items:center; gap:10px; border:1px solid #cfe3d6; background:#f2fbf5; border-radius:12px; padding:10px 12px; }
  .lmt-file .icon { font-size:1.5rem; color:var(--lmt-new); }
  .lmt-file-name { flex:1; min-width:0; }
  .lmt-file-name b { display:block; font-size:.85rem; color:var(--lmt-ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .lmt-file-name span { font-size:.74rem; color:var(--lmt-muted); }
  .lmt-x { border:none; background:transparent; color:#8a9aae; font-size:1.2rem; padding:2px; cursor:pointer; }
  .lmt-x:hover { color:var(--lmt-bad); }
  .lmt-rules { border-radius:12px; background:#f6f9fd; border:1px solid var(--lmt-line); border-left:4px solid var(--lmt-primary-2); padding:12px 16px; margin-top:16px; }
  .lmt-rules ul { margin:6px 0 0; padding-left:18px; }
  .lmt-rules li { font-size:.8rem; color:#4a5568; margin:2px 0; }
  .lmt-rules b.t { font-size:.82rem; color:var(--lmt-ink); display:flex; align-items:center; gap:6px; }
  .lmt-result { margin-top:18px; border:1px solid var(--lmt-line); border-radius:14px; padding:16px; background:linear-gradient(180deg,#fbfdff,#fff); }

  /* modal */
  .lmt-modal .modal-content { border:none; border-radius:16px; overflow:hidden; box-shadow:0 16px 48px rgba(16,42,77,.25); }
  .lmt-modal .modal-header { background:linear-gradient(90deg,#174f86,#3b8dd6); color:#fff; border:none; padding:14px 20px; }
  .lmt-modal .modal-title { color:#fff; font-size:1rem; font-weight:800; display:flex; align-items:center; gap:8px; }
  .lmt-modal .btn-close { filter:invert(1) grayscale(1) brightness(2); opacity:.85; }
  .lmt-modal .modal-body { padding:16px 20px; max-height:60vh; overflow-y:auto; }
  .lmt-modal .modal-footer { border-top:1px solid var(--lmt-line); padding:10px 20px; }

  /* popups (rendered in <body>, so not under .lmt) */
  .lmt-swal-popup { border-radius:16px !important; padding:22px 20px 20px !important; box-shadow:0 16px 48px rgba(16,42,77,.25) !important; }
  .lmt-swal-title { font-size:1.15rem !important; font-weight:800 !important; color:#1f2d3d !important; }
  .lmt-swal-text { font-size:.9rem !important; color:#4a5568 !important; }
  .lmt-swal-confirm { background:linear-gradient(90deg,#1e67a8,#3b8dd6); color:#fff; border:none; border-radius:10px; padding:9px 26px;
                      font-weight:700; margin:0 6px; box-shadow:0 4px 12px rgba(30,103,168,.25); }
  .lmt-swal-cancel { background:#fff; color:#4a5568; border:1px solid #d5dfeb; border-radius:10px; padding:9px 22px; font-weight:700; margin:0 6px; }

  @media (max-width:576px) {
    .lmt-hero { padding:16px; }
    .lmt-hero h2 { font-size:1.15rem; }
    .lmt-body { padding:16px 14px 20px; }
    .lmt-chip { min-width:0; flex:1 1 30%; }
  }
`;

const emptyQuery = { fruitsId: "", mobile: "", lotNumber: "", marketId: "", legacyTxnId: "", fromDate: "", toDate: "" };

const inr = (v) =>
  v === null || v === undefined || v === ""
    ? "-"
    : Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const kg = (v) =>
  v === null || v === undefined || v === "" ? "-" : Number(v).toLocaleString("en-IN", { maximumFractionDigits: 3 });
const dmy = (iso) => {
  if (!iso) return "-";
  const [y, m, d] = String(iso).substring(0, 10).split("-");
  return d && m && y ? `${d}-${m}-${y}` : iso;
};
const fileSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const ACCEPTED = /\.(xlsx|xls|csv)$/i;

function Stat({ icon, value, label, tone = "" }) {
  return (
    <div className={`lmt-stat ${tone}`}>
      <div className="lmt-stat-icon"><Icon name={icon} /></div>
      <div><b>{value}</b><span>{label}</span></div>
    </div>
  );
}

function LegacyMarketTransactions() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("trace");
  const [markets, setMarkets] = useState([]);

  // trace
  const [query, setQuery] = useState(emptyQuery);
  const [trace, setTrace] = useState(null);
  const [tracing, setTracing] = useState(false);
  const [sourceFilter, setSourceFilter] = useState("ALL");

  // import
  const [sourceSystem, setSourceSystem] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [lastRun, setLastRun] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [errorsOf, setErrorsOf] = useState(null); // { run, rows }
  const [templateDone, setTemplateDone] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => {
    api.get(baseURLMaster + "marketMaster/get-all")
      .then((res) => setMarkets(res.data?.content?.marketMaster || []))
      .catch(() => setMarkets([]));
  }, []);

  const loadHistory = () => {
    setHistoryLoading(true);
    api.get(baseURLMarket + "legacy-market/imports")
      .then((res) => setHistory(res.data?.content || []))
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false));
  };
  useEffect(loadHistory, []);

  const totals = useMemo(() => ({
    runs: history.length,
    added: history.reduce((s, h) => s + (h.inserted || 0), 0),
    sources: new Set(history.map((h) => h.sourceSystem).filter(Boolean)).size,
  }), [history]);

  const setQ = (e) => setQuery((q) => ({ ...q, [e.target.name]: e.target.value }));

  const runTrace = (e) => {
    e.preventDefault();
    const params = {};
    Object.entries(query).forEach(([k, v]) => { if (String(v).trim()) params[k] = String(v).trim(); });
    if (!params.fruitsId && !params.mobile && !params.lotNumber && !params.legacyTxnId && !params.marketId) {
      swal({ icon: "info", title: t("What should we search for?"), text: t("Enter a FRUITS ID, mobile number, lot number, market or legacy transaction id.") });
      return;
    }
    if (params.fromDate && params.toDate && params.fromDate > params.toDate) {
      swal({ icon: "warning", title: t("Check the dates"), text: t("From date is after To date.") });
      return;
    }
    setTracing(true);
    api.get(baseURLMarket + "legacy-market/trace", { params })
      .then((res) => {
        if (res.data?.errorCode === -1) {
          swal({ icon: "warning", title: t("Cannot search"), text: res.data.errorMessages?.[0] });
          setTrace(null);
        } else {
          setTrace(res.data?.content || null);
          setSourceFilter("ALL");
        }
      })
      .catch(() => swal({ icon: "error", title: t("Search failed"), text: t("Something went wrong!") }))
      .finally(() => setTracing(false));
  };

  const clearTrace = () => { setQuery(emptyQuery); setTrace(null); setSourceFilter("ALL"); };

  const visibleRows = useMemo(() => {
    const rows = trace?.rows || [];
    return sourceFilter === "ALL" ? rows : rows.filter((r) => r.source === sourceFilter);
  }, [trace, sourceFilter]);

  const traceTotals = useMemo(() => ({
    kg: visibleRows.reduce((s, r) => s + (Number(r.weightKg) || 0), 0),
    amount: visibleRows.reduce((s, r) => s + (Number(r.amount) || 0), 0),
  }), [visibleRows]);

  const downloadTemplate = () => {
    api.get(baseURLMarket + "legacy-market/template", { responseType: "blob" })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "legacy-cocoon-market-template.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setTemplateDone(true);
      })
      .catch(() => swal({ icon: "error", title: t("Template could not be downloaded"), text: t("Something went wrong!") }));
  };

  const pickFile = (f) => {
    if (!f) return;
    if (!ACCEPTED.test(f.name)) {
      swal({ icon: "warning", title: t("Unsupported file"), text: t("Choose the export file (.xlsx or .csv)") });
      return;
    }
    setFile(f);
  };
  const clearFile = () => { setFile(null); if (fileInput.current) fileInput.current.value = ""; };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const runImport = async (e) => {
    e.preventDefault();
    if (!sourceSystem.trim()) {
      swal({ icon: "info", title: t("Enter the legacy system name"), text: t("For example OLD_EMARKET - use the same name every time you import from that system.") });
      return;
    }
    if (!file) {
      swal({ icon: "info", title: t("Choose the export file (.xlsx or .csv)") });
      return;
    }
    const fd = new FormData();
    fd.append("sourceSystem", sourceSystem.trim());
    fd.append("file", file);
    setImporting(true);
    try {
      const res = await api.post(baseURLMarket + "legacy-market/import", fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data?.errorCode === -1) {
        swal({ icon: "warning", title: t("Import not done"), text: res.data.errorMessages?.[0] });
        return;
      }
      const run = res.data?.content;
      setLastRun(run);
      clearFile();
      loadHistory();
      swal({ icon: run?.rejected ? "warning" : "success", title: t("Import finished"), text: run?.message });
    } catch (err) {
      const big = err?.response?.status === 413;
      swal({
        icon: "error",
        title: t("Import failed"),
        text: big ? t("The file is too large for the server. Split it into smaller files.") : t("Something went wrong!"),
      });
    } finally {
      setImporting(false);
    }
  };

  const showErrors = (run) => {
    api.get(baseURLMarket + `legacy-market/imports/${run.importId}/errors`)
      .then((res) => setErrorsOf({ run, rows: res.data?.content || [] }))
      .catch(() => setErrorsOf({ run, rows: [] }));
  };

  const count = (n, tone) => <span className={`lmt-count ${n ? tone : "zero"}`}>{n ?? 0}</span>;

  const runSummary = (run) => {
    const total = Math.max(1, run.totalRows || 0);
    const seg = [
      { v: run.inserted, c: "#18794e", l: t("Added") },
      { v: run.updated, c: "#3b8dd6", l: t("Updated") },
      { v: run.unchanged, c: "#a0aec0", l: t("Unchanged") },
      { v: run.rejected, c: "#c43257", l: t("Rejected") },
    ];
    return (
      <>
        <div className="lmt-stats">
          <Stat icon="file-text" value={run.totalRows} label={t("Rows in file")} />
          <Stat icon="check-circle" value={run.inserted} label={t("Added")} tone="ok" />
          <Stat icon="edit-alt" value={run.updated} label={t("Updated")} />
          <Stat icon="repeat" value={run.unchanged} label={t("Unchanged")} tone="grey" />
          <Stat icon="alert-circle" value={run.rejected} label={t("Rejected")} tone={run.rejected ? "bad" : "grey"} />
          <Stat icon="swap" value={run.alreadyInNewSystem} label={t("Also in e-Reshme")} tone="warn" />
        </div>
        <div className="lmt-bar">
          {seg.map((s) => (s.v ? <i key={s.l} style={{ width: `${(s.v / total) * 100}%`, background: s.c }} /> : null))}
        </div>
        <div className="lmt-legend">
          {seg.map((s) => <span key={s.l}><i style={{ background: s.c }} />{s.l}: {s.v || 0}</span>)}
        </div>
      </>
    );
  };

  return (
    <Layout title={t("Legacy Market Transactions")}>
      <style>{styles}</style>
      <div className="lmt">
        <Block.Head>
          <div className="lmt-hero">
            <div className="lmt-hero-icon"><Icon name="db" /></div>
            <div className="lmt-hero-text">
              <h2>{t("Legacy Market Transactions")}</h2>
              <p>{t("Trace cocoon market transactions across the old market system and e-Reshme, and import the old system's export.")}</p>
            </div>
            <div className="lmt-hero-chips">
              <div className="lmt-chip"><b>{totals.runs}</b><span>{t("Import runs")}</span></div>
              <div className="lmt-chip"><b>{totals.added.toLocaleString("en-IN")}</b><span>{t("Rows migrated")}</span></div>
              <div className="lmt-chip"><b>{totals.sources}</b><span>{t("Legacy systems")}</span></div>
            </div>
          </div>
        </Block.Head>

        <Block>
          <div className="lmt-card">
            <div className="lmt-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={tab === "trace"} className={`lmt-tab ${tab === "trace" ? "active" : ""}`} onClick={() => setTab("trace")}>
                <Icon name="search" /> {t("Trace transactions")}
              </button>
              <button type="button" role="tab" aria-selected={tab === "import"} className={`lmt-tab ${tab === "import" ? "active" : ""}`} onClick={() => setTab("import")}>
                <Icon name="upload-cloud" /> {t("Import legacy export")}
              </button>
            </div>

            <div className="lmt-body">
              {tab === "trace" && (
                <>
                  <Form onSubmit={runTrace} className="lmt-search-panel">
                    <Row className="g-3">
                      <Col lg={3} md={6}>
                        <Form.Label>{t("FRUITS ID")}</Form.Label>
                        <div className="lmt-field"><Icon name="user" /><Form.Control name="fruitsId" value={query.fruitsId} onChange={setQ} placeholder="FID..." /></div>
                      </Col>
                      <Col lg={3} md={6}>
                        <Form.Label>{t("Farmer mobile")}</Form.Label>
                        <div className="lmt-field"><Icon name="mobile" /><Form.Control name="mobile" value={query.mobile} onChange={setQ} maxLength={13} inputMode="numeric" placeholder="10-digit number" /></div>
                      </Col>
                      <Col lg={2} md={4}>
                        <Form.Label>{t("Lot number")}</Form.Label>
                        <div className="lmt-field"><Icon name="layers" /><Form.Control name="lotNumber" value={query.lotNumber} onChange={setQ} /></div>
                      </Col>
                      <Col lg={4} md={8}>
                        <Form.Label>{t("Market")}</Form.Label>
                        <div className="lmt-field">
                          <Icon name="map-pin" />
                          <Form.Select name="marketId" value={query.marketId} onChange={setQ}>
                            <option value="">{t("All markets")}</option>
                            {markets.map((m) => <option key={m.marketMasterId} value={m.marketMasterId}>{m.marketMasterName || m.marketName}</option>)}
                          </Form.Select>
                        </div>
                      </Col>
                      <Col lg={3} md={6}>
                        <Form.Label>{t("Legacy transaction id")}</Form.Label>
                        <div className="lmt-field"><Icon name="file-text" /><Form.Control name="legacyTxnId" value={query.legacyTxnId} onChange={setQ} placeholder="OLD-..." /></div>
                      </Col>
                      <Col lg={3} md={6}>
                        <Form.Label>{t("From date")}</Form.Label>
                        <Form.Control type="date" name="fromDate" value={query.fromDate} onChange={setQ} />
                      </Col>
                      <Col lg={3} md={6}>
                        <Form.Label>{t("To date")}</Form.Label>
                        <Form.Control type="date" name="toDate" value={query.toDate} onChange={setQ} />
                      </Col>
                      <Col lg={3} md={6} className="d-flex align-items-end gap-2">
                        <Button type="submit" disabled={tracing} className="lmt-btn lmt-btn-primary flex-fill">
                          {tracing ? <Spinner size="sm" /> : <Icon name="search" />} <span>{t("Search")}</span>
                        </Button>
                        <Button type="button" className="lmt-btn lmt-btn-light" onClick={clearTrace}>
                          <Icon name="reload" /> <span>{t("Clear")}</span>
                        </Button>
                      </Col>
                    </Row>
                    <div className="lmt-hint"><Icon name="info" /> {t("Enter at least one of FRUITS ID, mobile, lot number, market or legacy transaction id. Dates are optional.")}</div>
                  </Form>

                  {!trace && !tracing && (
                    <div className="lmt-empty">
                      <div className="lmt-empty-icon"><Icon name="search" /></div>
                      <h6>{t("Search a farmer, lot or market")}</h6>
                      <p>{t("Results show transactions from the old market system and e-Reshme together. A lot that exists in both is shown only once.")}</p>
                    </div>
                  )}

                  {tracing && (
                    <div className="lmt-empty"><Spinner /><p className="mt-2">{t("Searching both systems...")}</p></div>
                  )}

                  {trace && !tracing && (
                    <div className="mt-4">
                      <div className="lmt-stats mb-3">
                        <Stat icon="list" value={trace.total} label={t("Transactions")} />
                        <Stat icon="archive" value={trace.legacyCount} label={t("Legacy system")} tone="warn" />
                        <Stat icon="check-circle" value={trace.newSystemCount} label={t("e-Reshme")} tone="ok" />
                        <Stat icon="package" value={kg(traceTotals.kg)} label={t("Total kg")} />
                        <Stat icon="coins" value={`₹ ${inr(traceTotals.amount)}`} label={t("Total amount")} />
                      </div>

                      <div className="lmt-section">
                        <h6>{t("Transactions")}</h6>
                        <span className="lmt-section-sub">{visibleRows.length} {t("shown")}</span>
                        <div className="ms-auto lmt-pills">
                          {[["ALL", t("All")], ["LEGACY", t("Legacy")], ["NEW_SYSTEM", "e-Reshme"]].map(([k, l]) => (
                            <button key={k} type="button" className={`lmt-pill ${sourceFilter === k ? "active" : ""}`} onClick={() => setSourceFilter(k)}>{l}</button>
                          ))}
                        </div>
                      </div>

                      {visibleRows.length === 0 ? (
                        <div className="lmt-empty">
                          <div className="lmt-empty-icon"><Icon name="info" /></div>
                          <h6>{t("No transactions found.")}</h6>
                          <p>{t("Try a wider date range, another market, or check the FRUITS ID / mobile number.")}</p>
                        </div>
                      ) : (
                        <div className="lmt-table-wrap">
                          <Table hover size="sm" className="lmt-table">
                            <thead>
                              <tr>
                                <th>{t("Source")}</th><th>{t("Reference")}</th><th>{t("Date")}</th><th>{t("Market")}</th><th>{t("Lot")}</th>
                                <th>{t("Farmer")}</th><th>{t("Reeler")}</th><th>{t("Race")}</th>
                                <th className="num">{t("Kg")}</th><th className="num">{t("Rate (₹)")}</th><th className="num">{t("Amount (₹)")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {visibleRows.map((r, i) => (
                                <tr key={`${r.source}-${r.reference}-${i}`}>
                                  <td>
                                    <span className={`lmt-badge ${r.source}`}>{r.source === "LEGACY" ? t("Legacy") : "e-Reshme"}</span>
                                    {r.source === "LEGACY" && <span className="lmt-sub">{r.sourceSystem}</span>}
                                  </td>
                                  <td><span className="lmt-ref">{r.reference}</span></td>
                                  <td style={{ whiteSpace: "nowrap" }}>{dmy(r.auctionDate)}</td>
                                  <td>{r.marketName || "-"}</td>
                                  <td><b>{r.lotNumber}</b></td>
                                  <td>
                                    {r.farmerName || "-"}
                                    {(r.farmerFruitsId || r.farmerMobile) && <span className="lmt-sub">{[r.farmerFruitsId, r.farmerMobile].filter(Boolean).join(" · ")}</span>}
                                  </td>
                                  <td>
                                    {r.reelerName || "-"}
                                    {r.reelerLicenceNo && <span className="lmt-sub">{r.reelerLicenceNo}</span>}
                                  </td>
                                  <td>{r.race || "-"}</td>
                                  <td className="num">{kg(r.weightKg)}</td>
                                  <td className="num">{inr(r.ratePerKg)}</td>
                                  <td className="num"><b>{inr(r.amount)}</b></td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      )}
                      <div className="lmt-hint"><Icon name="info" /> {t("Legacy rows that are the same lot as an e-Reshme lot are shown only once (as e-Reshme). Up to 500 rows per source.")}</div>
                    </div>
                  )}
                </>
              )}

              {tab === "import" && (
                <>
                  <Form onSubmit={runImport}>
                    <div className="lmt-steps">
                      <div className={`lmt-step ${templateDone ? "done" : ""}`}>
                        <div className="lmt-step-head">
                          <div className="lmt-step-no">{templateDone ? <Icon name="check" /> : 1}</div>
                          <h6>{t("Get the template")}</h6>
                        </div>
                        <p>{t("Export the old system's transactions in this column format (CSV or Excel). Dates as dd-mm-yyyy.")}</p>
                        <Button type="button" className="lmt-btn lmt-btn-light mt-auto" onClick={downloadTemplate}>
                          <Icon name="download" /> <span>{t("Download template")}</span>
                        </Button>
                      </div>

                      <div className={`lmt-step ${sourceSystem.trim() ? "done" : ""}`}>
                        <div className="lmt-step-head">
                          <div className="lmt-step-no">{sourceSystem.trim() ? <Icon name="check" /> : 2}</div>
                          <h6>{t("Legacy system name")} <span className="text-danger">*</span></h6>
                        </div>
                        <p>{t("Use the same name every time you import from that system - it is how re-imports are matched.")}</p>
                        <div className="lmt-field mt-auto">
                          <Icon name="db" />
                          <Form.Control value={sourceSystem} onChange={(e) => setSourceSystem(e.target.value)} placeholder="e.g. OLD_EMARKET" maxLength={50} />
                        </div>
                      </div>

                      <div className={`lmt-step ${file ? "done" : ""}`}>
                        <div className="lmt-step-head">
                          <div className="lmt-step-no">{file ? <Icon name="check" /> : 3}</div>
                          <h6>{t("Export file (.xlsx or .csv)")} <span className="text-danger">*</span></h6>
                        </div>
                        <input ref={fileInput} type="file" accept=".xlsx,.xls,.csv" hidden onChange={(e) => pickFile(e.target.files?.[0])} />
                        {file ? (
                          <div className="lmt-file">
                            <Icon name="file-xls" />
                            <div className="lmt-file-name"><b title={file.name}>{file.name}</b><span>{fileSize(file.size)}</span></div>
                            <button type="button" className="lmt-x" onClick={clearFile} aria-label={t("Remove file")}><Icon name="cross-circle" /></button>
                          </div>
                        ) : (
                          <div
                            className={`lmt-drop ${dragOver ? "over" : ""}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => fileInput.current?.click()}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInput.current?.click(); }}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={onDrop}
                          >
                            <Icon name="upload-cloud" />
                            <b>{t("Drop the file here or click to browse")}</b>
                            <span>.xlsx · .xls · .csv</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                      <Button type="submit" disabled={importing} className="lmt-btn lmt-btn-primary px-4">
                        {importing ? <><Spinner size="sm" /> <span>{t("Importing...")}</span></> : <><Icon name="upload-cloud" /> <span>{t("Import")}</span></>}
                      </Button>
                    </div>
                  </Form>

                  <div className="lmt-rules">
                    <b className="t"><Icon name="info" /> {t("How re-imports stay free of duplicates")}</b>
                    <ul>
                      <li>{t("Each row is matched by legacy system name + legacy transaction id.")}</li>
                      <li>{t("New ids are added, changed rows are updated, identical rows are skipped.")}</li>
                      <li>{t("A lot that already exists in e-Reshme (same market, date and lot number) is linked and shown only once.")}</li>
                      <li>{t("Rows with errors (bad date, unknown market, wrong amount, repeated id) are rejected with the reason.")}</li>
                    </ul>
                  </div>

                  {lastRun && (
                    <div className="lmt-result">
                      <div className="lmt-section">
                        <h6><Icon name="check-circle" className="text-success" /> {t("Last import")}</h6>
                        <span className="lmt-section-sub">{lastRun.fileName} · {lastRun.sourceSystem}</span>
                        {lastRun.rejected > 0 && (
                          <Button size="sm" variant="outline-danger" className="ms-auto lmt-btn" style={{ minHeight: 32 }} onClick={() => showErrors(lastRun)}>
                            <Icon name="alert-circle" /> {t("View rejected rows")}
                          </Button>
                        )}
                      </div>
                      {runSummary(lastRun)}
                    </div>
                  )}

                  <div className="lmt-section mt-4">
                    <h6>{t("Import history")}</h6>
                    <span className="lmt-section-sub">{t("Latest 50 runs")}</span>
                    <Button size="sm" className="ms-auto lmt-btn lmt-btn-light" style={{ minHeight: 32 }} onClick={loadHistory} disabled={historyLoading}>
                      {historyLoading ? <Spinner size="sm" /> : <Icon name="reload" />} <span>{t("Refresh")}</span>
                    </Button>
                  </div>
                  {history.length === 0 ? (
                    <div className="lmt-empty">
                      <div className="lmt-empty-icon"><Icon name="upload-cloud" /></div>
                      <h6>{t("No imports yet.")}</h6>
                      <p>{t("Your first import will appear here with its added / updated / rejected counts.")}</p>
                    </div>
                  ) : (
                    <div className="lmt-table-wrap">
                      <Table size="sm" hover className="lmt-table">
                        <thead>
                          <tr>
                            <th>#</th><th>{t("Source")}</th><th>{t("File")}</th><th>{t("Status")}</th>
                            <th className="num">{t("Rows")}</th><th className="num">{t("Added")}</th><th className="num">{t("Updated")}</th>
                            <th className="num">{t("Unchanged")}</th><th className="num">{t("Rejected")}</th><th className="num">{t("In e-Reshme")}</th><th />
                          </tr>
                        </thead>
                        <tbody>
                          {history.map((h) => (
                            <tr key={h.importId}>
                              <td className="text-muted">{h.importId}</td>
                              <td><b>{h.sourceSystem}</b></td>
                              <td style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={h.fileName}>{h.fileName}</td>
                              <td><span className={`lmt-badge ${h.status || "COMPLETED"}`}>{h.status || "COMPLETED"}</span></td>
                              <td className="num">{h.totalRows}</td>
                              <td className="num">{count(h.inserted, "ok")}</td>
                              <td className="num">{h.updated}</td>
                              <td className="num">{h.unchanged}</td>
                              <td className="num">{count(h.rejected, "bad")}</td>
                              <td className="num">{h.alreadyInNewSystem}</td>
                              <td className="text-end">
                                {h.rejected > 0 && (
                                  <Button size="sm" variant="link" className="p-0 text-danger fw-bold" onClick={() => showErrors(h)}>{t("Errors")}</Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Block>
      </div>

      <Modal show={!!errorsOf} onHide={() => setErrorsOf(null)} size="lg" centered dialogClassName="lmt-modal" className="lmt-modal">
        <Modal.Header closeButton>
          <Modal.Title><Icon name="alert-circle" /> {t("Rejected rows")} - {errorsOf?.run?.fileName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorsOf && errorsOf.rows.length === 0 ? (
            <div className="lmt-empty">
              <div className="lmt-empty-icon"><Icon name="check-circle" /></div>
              <h6>{t("No rejected rows.")}</h6>
            </div>
          ) : (
            <>
              <p className="text-muted mb-2" style={{ fontSize: ".82rem" }}>
                {t("Fix these rows in the export and import the file again - rows already imported will not be duplicated.")}
              </p>
              <div className="lmt-table-wrap">
                <Table size="sm" className="lmt-table">
                  <thead><tr><th>{t("Row")}</th><th>{t("Legacy id")}</th><th>{t("Reason")}</th></tr></thead>
                  <tbody>
                    {(errorsOf?.rows || []).map((r, i) => (
                      <tr key={i}>
                        <td><span className="lmt-count bad">{r.row}</span></td>
                        <td><span className="lmt-ref">{r.legacyTxnId || "-"}</span></td>
                        <td>{r.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="lmt-btn lmt-btn-light" onClick={() => setErrorsOf(null)}>{t("Close")}</Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default LegacyMarketTransactions;
