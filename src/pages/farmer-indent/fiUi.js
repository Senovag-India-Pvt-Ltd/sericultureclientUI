// Shared look & feel for the Farmer Indent screens.
import { Card, Form, Spinner, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import { useFiStore, cropRecords, fiActions } from "./fiData";

export const FI_BASE = "/seriui/farmer-indent";

// Steps that already exist in our software open the existing screen
// (farmer passed as router state; the screen pre-fills FRUITS ID and searches).
export const EXISTING = {
  assignDfls: "/seriui/Sale-Disposal-of-DFLs-eggs",
  assignedDflsList: "/seriui/Sale-Disposal-of-DFLs-eggs-list",
  cropInspection: "/seriui/crop-inspection-add",
  cropInspectionEdit: "/seriui/crop-inspection-edit",
  fitness: "/seriui/fitness-certificate-add",
  fitnessEdit: "/seriui/fitness-certificate-edit",
  harvest: "/seriui/crop-details-seed-market",
  farmerRegistration: "/seriui/stake-holder-registration",
};
export function useOpenExisting() {
  const navigate = useNavigate();
  return (key, farmer, extra = {}) => navigate(EXISTING[key], { state: { fruitsId: farmer?.fruitsId, from: "farmer-indent", ...extra } });
}

const css = `
  .fi-page { --fi-primary:#1e67a8; --fi-primary-dark:#0d4f8a; --fi-soft:#eef5fc; --fi-border:#dbe6f3; --fi-text:#1f2d3d; --fi-muted:#6b7a8c; }
  .fi-header { padding:18px 22px; border-radius:16px; color:#fff; margin-bottom:14px;
    background: radial-gradient(circle at 90% -40%, rgba(255,255,255,.22) 0, transparent 45%), linear-gradient(100deg,#0d4f8a 0%,#1e67a8 55%,#3b8dd6 100%);
    box-shadow:0 10px 24px rgba(30,103,168,.25); display:flex; gap:16px; align-items:center; justify-content:space-between; flex-wrap:wrap; }
  .fi-header h2 { color:#fff !important; margin:0; font-weight:700; font-size:1.45rem; letter-spacing:.2px; }
  .fi-header p { margin:4px 0 0; color:rgba(255,255,255,.85); font-size:.875rem; }
  .fi-header .fi-chip-light { background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.3); color:#fff; border-radius:999px; padding:4px 12px; font-size:.78rem; font-weight:600; display:inline-flex; align-items:center; gap:6px; }
  .fi-btn-white { background:#fff !important; color:var(--fi-primary) !important; border:none !important; font-weight:700; border-radius:10px !important; box-shadow:0 4px 12px rgba(12,40,68,.22); }
  .fi-btn-white:hover { background:#eef6ff !important; transform:translateY(-1px); }
  .fi-btn { border-radius:10px !important; font-weight:600 !important; display:inline-flex !important; align-items:center; gap:6px; white-space:nowrap; }
  .fi-btn-primary { background:linear-gradient(90deg,#1e67a8,#2b7ac0) !important; border:none !important; color:#fff !important; }
  .fi-btn-primary:hover { filter:brightness(1.07); }
  .fi-btn-soft { background:var(--fi-soft) !important; color:var(--fi-primary) !important; border:1px solid var(--fi-border) !important; }
  .fi-btn-soft:hover { background:#e2eefa !important; }
  .fi-btn-danger-soft { background:#fff1f3 !important; color:#c43257 !important; border:1px solid #f7c6d2 !important; }
  .fi-btn-sm { padding:4px 10px !important; font-size:.78rem !important; }

  .fi-stepper { display:flex; gap:6px; overflow-x:auto; padding:6px; margin-bottom:16px; background:#fff; border-radius:14px; border:1px solid var(--fi-border); scrollbar-width:thin; }
  .fi-step { flex:1 0 auto; display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:10px; color:var(--fi-muted); text-decoration:none !important; font-size:.8rem; font-weight:600; white-space:nowrap; transition:background .15s; }
  .fi-step:hover { background:var(--fi-soft); color:var(--fi-primary); }
  .fi-step .fi-step-no { width:24px; height:24px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; background:#edf1f6; font-size:.72rem; }
  .fi-step .fi-step-count { background:#edf1f6; border-radius:999px; padding:1px 8px; font-size:.7rem; }
  .fi-step.active { background:linear-gradient(90deg,#1e67a8,#2b7ac0); color:#fff; box-shadow:0 4px 12px rgba(30,103,168,.3); }
  .fi-step.active .fi-step-no, .fi-step.active .fi-step-count { background:rgba(255,255,255,.22); color:#fff; }
  .fi-step-arrow { color:#c3cfdd; align-self:center; font-size:.9rem; }

  .fi-card { border:none !important; border-radius:16px !important; box-shadow:0 2px 14px rgba(16,42,70,.07) !important; overflow:hidden; margin-bottom:16px; }
  .fi-card .card-header { background:#fff; border-bottom:1px solid #edf1f6; padding:14px 20px; font-weight:700; color:var(--fi-text); display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
  .fi-card .card-body { padding:18px 20px; }

  .fi-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:14px; margin-bottom:16px; }
  .fi-stat { background:#fff; border-radius:16px; padding:16px 18px; box-shadow:0 2px 14px rgba(16,42,70,.07); display:flex; gap:14px; align-items:center; border:1px solid transparent; transition:transform .15s, border-color .15s, box-shadow .15s; text-align:left; width:100%; }
  button.fi-stat { cursor:pointer; }
  button.fi-stat:hover { transform:translateY(-2px); border-color:var(--fi-border); box-shadow:0 8px 20px rgba(16,42,70,.1); }
  button.fi-stat.selected { border-color:var(--fi-primary); box-shadow:0 0 0 3px rgba(30,103,168,.15); }
  .fi-stat-icon { width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0; }
  .fi-stat-label { color:var(--fi-muted); font-size:.78rem; font-weight:600; text-transform:uppercase; letter-spacing:.3px; }
  .fi-stat-value { color:var(--fi-text); font-size:1.5rem; font-weight:800; line-height:1.2; }
  .fi-stat-sub { color:var(--fi-muted); font-size:.75rem; }

  .fi-pill { display:inline-flex; align-items:center; gap:5px; border-radius:999px; padding:3px 10px; font-size:.74rem; font-weight:700; white-space:nowrap; }
  .fi-pill::before { content:""; width:6px; height:6px; border-radius:50%; background:currentColor; opacity:.8; }
  .fi-tabs { display:flex; gap:6px; flex-wrap:wrap; }
  .fi-tab { border:1px solid var(--fi-border); background:#fff; color:var(--fi-muted); border-radius:999px; padding:6px 14px; font-size:.8rem; font-weight:700; display:inline-flex; align-items:center; gap:6px; cursor:pointer; transition:all .15s; }
  .fi-tab:hover { color:var(--fi-primary); border-color:#b7cde6; }
  .fi-tab.active { background:var(--fi-primary); border-color:var(--fi-primary); color:#fff; }
  .fi-tab .fi-tab-count { background:rgba(0,0,0,.06); border-radius:999px; padding:0 7px; font-size:.7rem; }
  .fi-tab.active .fi-tab-count { background:rgba(255,255,255,.25); }

  .fi-filters { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:12px; align-items:end; }
  .fi-label { font-weight:600; color:#4a5568; font-size:.8rem; margin-bottom:4px; }
  .fi-page .form-control, .fi-page .form-select, .fi-modal .form-control, .fi-modal .form-select { border-radius:10px; border-color:#d0dff0; font-size:.875rem; }
  .fi-page .form-control:focus, .fi-page .form-select:focus, .fi-modal .form-control:focus, .fi-modal .form-select:focus { border-color:#6aa3d8; box-shadow:0 0 0 3px rgba(30,103,168,.12); }
  .fi-search { position:relative; }
  .fi-search .icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#8a9bb0; }
  .fi-search .form-control { padding-left:34px; }
  .fi-readonly { background:#f3f7fc !important; color:#4a5568 !important; }

  .fi-farmer-cell { display:flex; align-items:center; gap:10px; padding:6px 0; }
  .fi-avatar { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:.8rem; color:#fff; flex-shrink:0; }
  .fi-farmer-name { font-weight:700; color:var(--fi-text); line-height:1.2; }
  .fi-farmer-sub { color:var(--fi-muted); font-size:.74rem; }
  .fi-mono { font-family:SFMono-Regular,Consolas,monospace; font-size:.78rem; color:#46566a; }

  .fi-progress { height:8px; background:#edf1f6; border-radius:999px; overflow:hidden; min-width:110px; }
  .fi-progress > span { display:block; height:100%; border-radius:999px; }

  .fi-empty { text-align:center; padding:36px 10px; color:var(--fi-muted); }
  .fi-empty .icon { font-size:2.2rem; color:#b7c6d8; display:block; margin-bottom:8px; }

  .fi-modal .modal-content { border:none; border-radius:18px; overflow:hidden; box-shadow:0 20px 50px rgba(10,30,60,.25); padding:0 !important; }
  .fi-modal .modal-header { border-radius:0 !important; margin:0 !important; }
  .fi-modal .modal-header { background:linear-gradient(100deg,#0d4f8a,#1e67a8 60%,#3b8dd6); color:#fff; border:none; padding:16px 22px; }
  .fi-modal .modal-title { color:#fff; font-weight:700; font-size:1.1rem; }
  .fi-modal .modal-header .btn-close { filter:invert(1) grayscale(1) brightness(2); opacity:.9; }
  .fi-modal .modal-body { padding:20px 22px; background:#fbfdff; }
  .fi-modal .modal-footer { border-top:1px solid #edf1f6; padding:12px 22px; }
  .fi-section-title { font-size:.78rem; font-weight:800; text-transform:uppercase; letter-spacing:.5px; color:var(--fi-primary); margin:6px 0 10px; display:flex; align-items:center; gap:8px; }
  .fi-section-title::after { content:""; flex:1; height:1px; background:var(--fi-border); }
  .fi-infobox { background:var(--fi-soft); border:1px solid var(--fi-border); border-radius:12px; padding:12px 14px; display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:10px; margin-bottom:14px; }
  .fi-infobox div small { display:block; color:var(--fi-muted); font-size:.7rem; font-weight:600; text-transform:uppercase; }
  .fi-infobox div b { color:var(--fi-text); font-size:.86rem; }
  .fi-calc { background:#f0fdf4; border:1px dashed #86efac; border-radius:12px; padding:10px 14px; display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:8px; }
  .fi-calc small { display:block; color:#15803d; font-size:.7rem; font-weight:700; text-transform:uppercase; }
  .fi-calc b { color:#14532d; }

  .fi-timeline { position:relative; padding-left:26px; }
  .fi-timeline::before { content:""; position:absolute; left:9px; top:4px; bottom:4px; width:2px; background:#e3ebf5; }
  .fi-tl-item { position:relative; margin-bottom:16px; }
  .fi-tl-dot { position:absolute; left:-26px; top:2px; width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:.7rem; box-shadow:0 0 0 3px #fff; }
  .fi-tl-title { font-weight:700; color:var(--fi-text); font-size:.9rem; }
  .fi-tl-sub { color:var(--fi-muted); font-size:.78rem; }

  .fi-swal { border-radius:16px !important; }
  .fi-swal-confirm { background:linear-gradient(90deg,#1e67a8,#2b7ac0) !important; border-radius:10px !important; font-weight:600 !important; }
  .fi-swal-danger { background:linear-gradient(90deg,#c43257,#e3496a) !important; border-radius:10px !important; font-weight:600 !important; }
  .fi-swal-cancel { background:#fff !important; color:#4a5568 !important; border:1px solid #d0dff0 !important; border-radius:10px !important; font-weight:600 !important; }
  .fi-swal .swal2-select, .fi-swal .swal2-textarea { border-radius:10px; font-size:.9rem; border-color:#d0dff0; }

  .fi-demo-note { font-size:.75rem; color:#8a6d1d; background:#fff8e1; border:1px solid #f5dc8f; border-radius:10px; padding:6px 12px; display:inline-flex; gap:6px; align-items:center; }

  @media (max-width: 575px) {
    .fi-header { padding:14px 16px; }
    .fi-header h2 { font-size:1.2rem; }
    .fi-stat-value { font-size:1.25rem; }
  }
`;

// ─── Flow stepper ─────────────────────────────────────────────────────────
export const FLOW = [
  { path: "farmer-list", label: "Farmers", icon: "users" },
  { path: "indents", label: "Indents", icon: "file-docs" },
  { path: "assigned-dfls", label: "Assigned DFLs", icon: "package" },
  { path: "stage-wise-crop", label: "Stage-wise Crop", icon: "layers" },
  { path: "crop-inspection", label: "Crop Inspection", icon: "clipboard" },
  { path: "fitness-certificate", label: "Fitness Certificate", icon: "shield-check" },
  { path: "harvest", label: "Harvest", icon: "coins" },
  { path: "dashboard", label: "Dashboard", icon: "bar-chart" },
];

function FlowStepper() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const s = useFiStore();
  const recs = cropRecords(s).filter((r) => !r.discarded);
  const open = recs.filter((r) => !r.harvest && !r.failed && !r.closed);
  const counts = {
    "farmer-list": s.farmers.length,
    indents: s.indents.filter((i) => !i.cancelled && i.status !== "assigned").length,
    "assigned-dfls": open.length,
    "stage-wise-crop": open.length,
    "crop-inspection": open.filter((r) => !r.lastInspection && r.day >= 0).length,
    "fitness-certificate": open.filter((r) => !r.fc && ["moult4", "spinning", "market"].includes(r.stage.key)).length,
    harvest: open.filter((r) => r.fc?.fit).length,
  };
  return (
    <nav className="fi-stepper" aria-label={t("Farmer Indent steps")}>
      {FLOW.map((st, i) => (
        <span key={st.path} className="d-contents" style={{ display: "contents" }}>
          {i > 0 && <span className="fi-step-arrow">›</span>}
          <Link to={`${FI_BASE}/${st.path}`} className={`fi-step ${pathname.endsWith(st.path) ? "active" : ""}`}>
            <span className="fi-step-no">{i + 1}</span>
            <span>{t(st.label)}</span>
            {counts[st.path] !== undefined && <span className="fi-step-count" title={t("Pending")}>{counts[st.path]}</span>}
          </Link>
        </span>
      ))}
    </nav>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────
export function FiPage({ title, subtitle, actions, children }) {
  const { t } = useTranslation();
  const s = useFiStore();
  return (
    <Layout title={title}>
      <style>{css}</style>
      <div className="fi-page">
        <Block.Head>
          <div className="fi-header">
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <span className="fi-chip-light"><Icon name="building" /> {t("Grainage")}: {s.grainage?.name || "–"}</span>
                <span className="fi-chip-light"><Icon name="calendar" /> {new Date().toLocaleDateString("en-GB")}</span>
              </div>
              <h2>{title}</h2>
              {subtitle && <p>{subtitle}</p>}
            </div>
            <div className="d-flex gap-2 flex-wrap">{s.status === "ready" && actions}</div>
          </div>
        </Block.Head>
        {s.status === "ready" && <FlowStepper />}
        {s.status === "ready" ? children : s.status === "error" ? (
          <Card className="fi-card"><Card.Body className="text-center py-5">
            <Icon name="alert-circle" className="text-danger" style={{ fontSize: "2rem" }} />
            <div className="fw-bold mt-2">{s.error}</div>
            <div className="text-muted small mb-3">{t("Farmer Indent screens are for grainage users.")}</div>
            <Button className="fi-btn fi-btn-soft" onClick={() => fiActions.reload()}><Icon name="reload" /> {t("Try again")}</Button>
          </Card.Body></Card>
        ) : (
          <div className="text-center py-5 text-muted"><Spinner animation="border" size="sm" className="me-2" />{t("Loading farmer indent data…")}</div>
        )}
      </div>
    </Layout>
  );
}

export function FiCard({ title, right, children, bodyClass = "" }) {
  return (
    <Card className="fi-card">
      {(title || right) && <Card.Header><span>{title}</span>{right}</Card.Header>}
      <Card.Body className={bodyClass}>{children}</Card.Body>
    </Card>
  );
}

export function StatCard({ icon, label, value, sub, color = "#1e67a8", onClick, selected }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag type={onClick ? "button" : undefined} className={`fi-stat ${selected ? "selected" : ""}`} onClick={onClick}>
      <span className="fi-stat-icon" style={{ background: `${color}1a`, color }}><Icon name={icon} /></span>
      <span>
        <span className="fi-stat-label d-block">{label}</span>
        <span className="fi-stat-value d-block">{value}</span>
        {sub && <span className="fi-stat-sub d-block">{sub}</span>}
      </span>
    </Tag>
  );
}

const PILL_COLORS = {
  green: ["#e7f8ee", "#15803d"], blue: ["#e8f1fb", "#1e67a8"], amber: ["#fff5e0", "#b45309"],
  red: ["#fdecef", "#c43257"], grey: ["#eef1f5", "#556477"], violet: ["#f1ecfe", "#6d28d9"], teal: ["#e3f7f5", "#0f766e"],
};
export function Pill({ color = "grey", children, style }) {
  const [bg, fg] = PILL_COLORS[color] || PILL_COLORS.grey;
  return <span className="fi-pill" style={{ background: bg, color: fg, ...style }}>{children}</span>;
}
export const INDENT_STATUS_COLOR = { captured: "grey", assessment: "violet", production: "amber", ready: "teal", assigned: "green" };
// crop_status master values (Crop Inspection) + older labels
export const CROP_STATUS_COLOR = { "Diseased Free": "green", Diseased: "red", Good: "green", Average: "amber", Poor: "red", Failed: "red" };

export function StagePill({ stage }) {
  return <span className="fi-pill" style={{ background: `${stage.color}1f`, color: stage.color }}>{stage.label}</span>;
}

const AVATAR_COLORS = ["#1e67a8", "#0f766e", "#6d28d9", "#b45309", "#c43257", "#15803d", "#0369a1"];
export function FarmerCell({ farmer, sub }) {
  if (!farmer) return "–";
  const initials = farmer.name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const hash = [...String(farmer.id)].reduce((n, c) => n + c.charCodeAt(0), 0);
  return (
    <div className="fi-farmer-cell">
      <span className="fi-avatar" style={{ background: AVATAR_COLORS[hash % AVATAR_COLORS.length] }}>{initials}</span>
      <div>
        <div className="fi-farmer-name">{farmer.name}</div>
        <div className="fi-farmer-sub">{sub || [farmer.farmerNumber, farmer.mobile].filter(Boolean).join(" · ") || farmer.fruitsId}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon = "inbox", text }) {
  return <div className="fi-empty"><Icon name={icon} /> {text}</div>;
}

export function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="fi-search">
      <Icon name="search" />
      <Form.Control value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

// react-data-table-component styles
export const tableStyles = {
  table: { style: { minWidth: "100%" } },
  headRow: { style: { background: "#f3f7fc", borderBottom: "1px solid #dbe6f3", minHeight: "44px" } },
  headCells: { style: { color: "#44566c", fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.3px" } },
  rows: { style: { fontSize: "0.84rem", color: "#1f2d3d", minHeight: "58px" }, highlightOnHoverStyle: { background: "#f5f9fe", outline: "none" } },
  pagination: { style: { borderTop: "1px solid #edf1f6" } },
};

// ─── Themed SweetAlert (same look as modals) ─────────────────────────────
export const fiSwal = Swal.mixin({
  customClass: { popup: "fi-swal", confirmButton: "fi-swal-confirm", cancelButton: "fi-swal-cancel", denyButton: "fi-swal-danger" },
  buttonsStyling: true,
});
export const fiToast = (title, icon = "success") =>
  Swal.fire({ toast: true, position: "top-end", timer: 2200, showConfirmButton: false, icon, title, customClass: { popup: "fi-swal" } });

// Ask for a reason (select + remarks) – used for cancel / discard
export async function askReason(title, reasons, confirmText) {
  const opts = reasons.map((r) => `<option value="${r}">${r}</option>`).join("");
  const res = await fiSwal.fire({
    title,
    html: `<select id="fi-r" class="swal2-select" style="width:85%;display:flex;margin:10px auto"><option value="">-- Select reason --</option>${opts}</select>
           <textarea id="fi-m" class="swal2-textarea" placeholder="Remarks (optional)" style="width:85%;margin:8px auto;display:flex"></textarea>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    customClass: { popup: "fi-swal", confirmButton: "fi-swal-danger", cancelButton: "fi-swal-cancel" },
    focusConfirm: false,
    preConfirm: () => {
      const reason = document.getElementById("fi-r").value;
      if (!reason) { Swal.showValidationMessage("Please select a reason"); return false; }
      return { reason, remarks: document.getElementById("fi-m").value };
    },
  });
  return res.isConfirmed ? res.value : null;
}

// Simple CSV export of what the table shows
export function exportCsv(filename, columns, rows) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [columns.map((c) => esc(c.label)).join(","), ...rows.map((r) => columns.map((c) => esc(c.value(r))).join(","))];
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
