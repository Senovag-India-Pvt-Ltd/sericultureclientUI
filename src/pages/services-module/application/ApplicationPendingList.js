import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, Form, Spinner } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";

const baseURLDBT    = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const STATUS_META = {
  WITHIN_SLA:  { label: "Within SLA",  icon: "check-circle",   softBg: "#ECFDF5", softColor: "#059669" },
  OUTSIDE_SLA: { label: "Outside SLA", icon: "alert-triangle", softBg: "#FFFBEB", softColor: "#D97706" },
  PENDING:     { label: "Pending",     icon: "clock",          softBg: "#FEF2F2", softColor: "#DC2626" },
};

// Deterministic avatar colour + initials from a farmer name
const AVATAR_COLORS = ["#2563EB", "#7C3AED", "#0891B2", "#059669", "#D97706", "#DB2777", "#4F46E5", "#0D9488"];
const avatarColor = (name) => {
  const s = String(name || "?");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
};
const initials = (name) => {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
};

// ── Filter Bar ─────────────────────────────────────────────────────────────────
function FilterBar({ district, component, subScheme, fruitsId, onDistrictChange, onComponentChange,
  onSubSchemeChange, onFruitsIdChange, onApply, onClear, districts, components, subSchemes }) {

  const active = district || component || subScheme || (fruitsId && fruitsId.trim());

  return (
    <Card className="apl-card apl-filter mb-3" style={{ overflow: "hidden" }}>
      <div className="d-flex align-items-center gap-3" style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <span style={{ width: 40, height: 40, borderRadius: "11px", background: "#EFF6FF", color: "#2563EB", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="filter" style={{ fontSize: 16 }} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#111827", fontWeight: 700, fontSize: "0.98rem" }}>Filters</div>
          <div style={{ color: "#6B7280", fontSize: "0.76rem" }}>Refine dashboard results</div>
        </div>
        {active && (
          <span style={{ background: "#EFF6FF", color: "#2563EB", fontSize: "0.66rem", fontWeight: 700, borderRadius: "20px", padding: "3px 11px", border: "1px solid #BFDBFE" }}>
            Active
          </span>
        )}
      </div>
      <Card.Body style={{ padding: "20px" }}>
        <Row className="g-3 align-items-end">
          <Col lg="3" md="6" xs="12">
            <Form.Group className="form-group">
              <Form.Label className="form-label mb-1 apl-flabel">District</Form.Label>
              <Form.Select value={district || ""}
                onChange={(e) => onDistrictChange(e.target.value ? Number(e.target.value) : null)}>
                <option value="">All Districts</option>
                {districts.map((d) => <option key={d.districtId} value={d.districtId}>{d.districtName}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg="3" md="6" xs="12">
            <Form.Group className="form-group">
              <Form.Label className="form-label mb-1 apl-flabel">Sub Scheme</Form.Label>
              <Form.Select value={subScheme || ""}
                onChange={(e) => onSubSchemeChange(e.target.value ? Number(e.target.value) : null)}>
                <option value="">All Sub Schemes</option>
                {subSchemes.map((s) => <option key={s.scSubSchemeDetailsId} value={s.scSubSchemeDetailsId}>{s.subSchemeName}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg="3" md="6" xs="12">
            <Form.Group className="form-group">
              <Form.Label className="form-label mb-1 apl-flabel">Component Type</Form.Label>
              <Form.Select value={component || ""}
                onChange={(e) => onComponentChange(e.target.value ? Number(e.target.value) : null)}>
                <option value="">All Components</option>
                {components.map((c) => <option key={c.scComponentId} value={c.scComponentId}>{c.scComponentName}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg="3" md="6" xs="12">
            <Form.Group className="form-group">
              <Form.Label className="form-label mb-1 apl-flabel">Fruits ID</Form.Label>
              <Form.Control type="text" value={fruitsId || ""}
                onChange={(e) => onFruitsIdChange(e.target.value || "")}
                onKeyDown={(e) => e.key === "Enter" && onApply()}
                placeholder="Enter Fruits ID" maxLength={16} />
            </Form.Group>
          </Col>
          <Col xs="12">
            <div className="d-flex gap-2 justify-content-end flex-wrap">
              <button type="button" className="apl-btn apl-btn-primary" onClick={onApply}>
                <Icon name="search" style={{ fontSize: 14 }} /> Apply
              </button>
              <button type="button" className="apl-btn apl-btn-secondary" onClick={onClear}>
                <Icon name="reload" style={{ fontSize: 14 }} /> Clear
              </button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ApplicationPendingList() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    schemeId,
    subSchemeId,
    statusType,
    schemeName    = "Scheme",
    subSchemeName = null,
    slaDays       = null,
  } = location.state || {};

  const [loading,  setLoading]  = useState(false);
  const [rows,     setRows]     = useState([]);
  const [apiError, setApiError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 50;

  const [filterDistrict,  setFilterDistrict]  = useState(null);
  const [filterComponent, setFilterComponent] = useState(null);
  const [filterSubScheme, setFilterSubScheme] = useState(subSchemeId ?? null);
  const [filterFruitsId,  setFilterFruitsId]  = useState("");

  const [districts,  setDistricts]  = useState([]);
  const [components, setComponents] = useState([]);
  const [subSchemes, setSubSchemes] = useState([]);

  useEffect(() => {
    api.get(baseURLMaster + "district/get-all")
      .then((r) => setDistricts(r.data.content?.district || [])).catch(() => {});
    api.get(baseURLMaster + "scComponent/get-all", { params: { isActive: true } })
      .then((r) => setComponents(r.data.content?.scComponent || [])).catch(() => {});
    if (schemeId) {
      api.get(baseURLMaster + `scSubSchemeDetails/get-by-sc-scheme-details-id/${schemeId}`)
        .then((r) => setSubSchemes(r.data.content?.scSubSchemeDetails || [])).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!schemeId || !statusType) { setApiError("Missing parameters. Please go back and try again."); return; }
    fetchList(null, null, filterSubScheme, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchList = (dId, cId, sId, fId) => {
    setApiError(null);
    setLoading(true);
    const params = { schemeId, statusType };
    if (sId != null)        params.subSchemeId = sId;
    if (dId != null)         params.districtId  = dId;
    if (cId != null)         params.componentId = cId;
    if (fId && fId.trim())  params.fruitsId    = fId.trim();

    api.get(baseURLDBT + "service/sakala/application-list", { params })
      .then((r) => { setRows(Array.isArray(r.data) ? r.data : []); setCurrentPage(1); })
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.response?.statusText || err?.message || "Unknown error";
        console.error("[application-list]", err?.response?.status, msg, err);
        setApiError(`Failed to load: ${msg} (HTTP ${err?.response?.status || "?"})`);
        setRows([]);
      })
      .finally(() => setLoading(false));
  };

  const applyFilters = () => fetchList(filterDistrict, filterComponent, filterSubScheme, filterFruitsId);
  const clearFilters = () => {
    setFilterDistrict(null);
    setFilterComponent(null);
    setFilterSubScheme(null);
    setFilterFruitsId("");
    fetchList(null, null, null, "");
  };

  const meta = STATUS_META[statusType] || { label: statusType || "Applications", icon: "alert-circle", softBg: "#EFF6FF", softColor: "#2563EB" };

  const statusBadge = (status) => {
    if (!status) return <span className="text-muted">—</span>;
    const isPaid    = status === "PAYMENT SUCCESS IN DBT";
    const isPending = status.toUpperCase().includes("PENDING");
    const s = isPaid
      ? { bg: "#ECFDF5", c: "#059669", icon: "check-circle" }
      : isPending
      ? { bg: "#FEF2F2", c: "#DC2626", icon: "clock" }
      : { bg: "#EFF6FF", c: "#2563EB", icon: "alert-circle" };
    return (
      <span className="apl-badge" style={{ background: s.bg, color: s.c, whiteSpace: "normal", textAlign: "left" }}>
        <Icon name={s.icon} style={{ fontSize: 10 }} />
        {status}
      </span>
    );
  };

  const HEADERS = [
    "#", "Scheme Name", "Sub Scheme Name", "Farmer Name", "Fruits ID", "ARN", "District",
    "Component Type", "Approval Stage", "Submission Date",
    "SLA Days", "SLA Due Date", "Days Elapsed", "Status",
  ];

  // Sub-scheme can vary per row when "All Sub Schemes" filter is active;
  // resolve from row.subSchemeId against the fetched master list, falling
  // back to the page-level subSchemeName when a single sub-scheme is fixed.
  const subSchemeNameFor = (row) => {
    if (row.subSchemeId != null) {
      const match = subSchemes.find((s) => s.scSubSchemeDetailsId === row.subSchemeId);
      if (match) return match.subSchemeName;
    }
    return subSchemeName;
  };

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const pagedRows  = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstIdx   = (currentPage - 1) * PAGE_SIZE;

  return (
    <Layout title="Application Pendency">
      <style>{`
        /* Clean enterprise surface — scoped to this page (removed on navigate-away) */
        body { background-image: none !important; background: #F8FAFC !important; }
        @keyframes aplFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .apl-anim { animation: aplFade 0.28s ease both; }
        .apl-dash { max-width: 100%; }
        .apl-dash * { min-width: 0; }

        .apl-card { background:#FFFFFF !important; border:1px solid #EEF1F6 !important; border-radius:18px;
          box-shadow:0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.05) !important; }

        /* Header */
        .apl-headcard { border:1px solid #EEF1F6; border-radius:18px; overflow:hidden; box-shadow:0 1px 3px rgba(16,24,40,0.06); }
        .apl-h-row { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;
          padding: clamp(14px,1.6vw,22px) clamp(16px,1.8vw,26px); background:#FFFFFF; }
        .apl-h-icon { width:46px; height:46px; border-radius:12px; flex-shrink:0; background: linear-gradient(135deg,#2563EB,#3B82F6);
          display:inline-flex; align-items:center; justify-content:center; box-shadow:0 6px 16px rgba(37,99,235,0.30); }
        .apl-h-title { margin:0; font-weight:700; color:#111827; line-height:1.2; font-size: clamp(1.1rem,1.6vw,1.35rem); }
        .apl-h-crumb { font-size: clamp(0.68rem,1vw,0.76rem); color:#9CA3AF; margin-top:5px; }
        .apl-h-crumb a, .apl-h-crumb .apl-link { color:#2563EB; text-decoration:none; font-weight:600; cursor:pointer; }

        /* Buttons */
        .apl-btn { border-radius:10px; font-weight:600; font-size:0.85rem; padding:9px 18px; border:1px solid transparent;
          display:inline-flex; align-items:center; justify-content:center; gap:7px; cursor:pointer; transition: all 0.2s ease; }
        .apl-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .apl-btn-primary { background: linear-gradient(135deg,#2563EB,#3B82F6); color:#fff; box-shadow:0 6px 16px rgba(37,99,235,0.26); }
        .apl-btn-primary:hover:not(:disabled) { background: linear-gradient(135deg,#1D4ED8,#2563EB); box-shadow:0 10px 24px rgba(37,99,235,0.34); transform: translateY(-1px); }
        .apl-btn-secondary { background:#F3F4F6; color:#374151; border-color:#E5E7EB; }
        .apl-btn-secondary:hover:not(:disabled) { background:#E5E7EB; }
        .apl-btn-ghost { background:rgba(255,255,255,0.18); color:#fff; border:1px solid rgba(255,255,255,0.4); }
        .apl-btn-ghost:hover:not(:disabled) { background:rgba(255,255,255,0.28); }

        /* Filters */
        .apl-filter .form-select, .apl-filter .form-control { border-radius:9px; border:1px solid #E5E7EB; min-height:42px; font-size:0.88rem; color:#111827; }
        .apl-filter .form-select:focus, .apl-filter .form-control:focus { border-color:#2563EB; box-shadow:0 0 0 3px rgba(37,99,235,0.12); }
        .apl-flabel { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#6B7280; }

        /* Table — dense / data-rich */
        .apl-tbl-wrap { overflow-x:auto; }
        .apl-tbl { width:100%; border-collapse:separate; border-spacing:0; font-size:0.78rem; }
        .apl-tbl thead th { position:sticky; top:0; z-index:2; background:#F1F5FB; color:#64748B;
          font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.03em;
          padding:9px 11px; white-space:nowrap; border-bottom:1px solid #E2E8F0; text-align:left; }
        .apl-tbl tbody td { padding:7px 11px; border-bottom:1px solid #F1F3F7; color:#374151; vertical-align:middle; }
        .apl-tbl tbody tr { transition: background 0.12s ease; }
        .apl-tbl tbody tr:nth-child(even) { background:#FBFCFE; }
        .apl-tbl tbody tr:hover { background:#EEF5FF; }

        /* Soft badges */
        .apl-badge { display:inline-flex; align-items:center; gap:4px; font-size:0.66rem; font-weight:700;
          border-radius:99px; padding:2px 8px; white-space:nowrap; line-height:1.3; }
        .apl-chip { display:inline-block; font-size:0.68rem; font-weight:600; border-radius:7px; padding:2px 8px;
          background:#F1F5F9; border:1px solid #E2E8F0; color:#475569; }
        .apl-chip-1 { max-width:170px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; vertical-align:middle; }

        /* Avatar + row number + ARN */
        .apl-avatar { width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;
          font-size:0.64rem; font-weight:700; color:#fff; flex-shrink:0; box-shadow:0 2px 5px rgba(16,24,40,0.14); }
        .apl-num { width:24px; height:24px; border-radius:7px; background:#F1F5F9; color:#64748B; font-weight:700; font-size:0.7rem;
          display:inline-flex; align-items:center; justify-content:center; }
        .apl-arn { font-weight:700; color:#2563EB; font-size:0.78rem; letter-spacing:0.01em; }
        .apl-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size:0.76rem; color:#4B5563; }

        /* Inline SLA gauge */
        .apl-gauge { height:4px; width:64px; border-radius:99px; background:#EEF2F7; overflow:hidden; margin-top:4px; }
        .apl-gauge > div { height:100%; border-radius:99px; transition: width 0.5s cubic-bezier(.2,.8,.2,1); }

        /* Pagination */
        .apl-pager { display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;
          padding:14px 18px; border-top:1px solid #EEF1F6; background:#FBFCFE; }
        .apl-pager .page-link { border:1px solid #E5E7EB; color:#374151; border-radius:8px; margin:0 2px; font-size:0.8rem; min-width:34px; text-align:center; }
        .apl-pager .page-item.active .page-link { background:#2563EB; border-color:#2563EB; color:#fff; }
        .apl-pager .page-item.disabled .page-link { color:#C0C7D0; }

        /* Empty / loading */
        .apl-empty { text-align:center; padding: clamp(40px,6vw,70px) 20px; }
        .apl-empty-icon { width:64px; height:64px; border-radius:18px; background:#EFF6FF;
          display:inline-flex; align-items:center; justify-content:center; margin-bottom:14px; }
      `}</style>

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <Block.Head>
        <Card className="apl-headcard">
          <div className="apl-h-row">
            <div className="d-flex align-items-center gap-3" style={{ minWidth: 0 }}>
              <span className="apl-h-icon"><Icon name="list" style={{ color: "#fff", fontSize: 22 }} /></span>
              <div style={{ minWidth: 0 }}>
                <h4 className="apl-h-title">Application Pendency</h4>
                <div className="apl-h-crumb">
                  <a href="/seriui/">Home</a>
                  <span style={{ margin: "0 6px", color: "#D1D5DB" }}>›</span>
                  <span className="apl-link" onClick={() => navigate("/seriui/pendency-dashboard")}>Pendency Dashboard</span>
                  <span style={{ margin: "0 6px", color: "#D1D5DB" }}>›</span>
                  <span style={{ fontWeight: 600, color: "#6B7280" }}>{meta.label}</span>
                </div>
              </div>
            </div>
            <button type="button" className="apl-btn apl-btn-primary" onClick={() => navigate(-1)}>
              <Icon name="arrow-long-left" /> <span>Back to Dashboard</span>
            </button>
          </div>
        </Card>
      </Block.Head>

      <Block className="mt-n4 apl-dash">

        {/* ── Context strip ────────────────────────────────────────────────────── */}
        <Card className="apl-card mb-3">
          <div className="d-flex align-items-center flex-wrap gap-3" style={{ padding: "16px 20px" }}>
            <span className="apl-badge" style={{ background: meta.softBg, color: meta.softColor, fontSize: "0.78rem", padding: "6px 14px" }}>
              <Icon name={meta.icon} style={{ fontSize: 14 }} /> {meta.label}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: "#111827", fontSize: "0.95rem", lineHeight: 1.3 }}>
                {schemeName}{subSchemeName ? <span style={{ color: "#6B7280", fontWeight: 500 }}> · {subSchemeName}</span> : null}
              </div>
              {!loading && (
                <div style={{ fontSize: "0.78rem", color: "#6B7280", marginTop: 2 }}>
                  {rows.length} record{rows.length !== 1 ? "s" : ""} · {totalPages} page{totalPages !== 1 ? "s" : ""}
                  {slaDays ? ` · SLA ${slaDays} days` : ""}
                </div>
              )}
            </div>
            <button type="button" className="apl-btn apl-btn-secondary ms-auto"
              onClick={() => fetchList(filterDistrict, filterComponent, filterSubScheme, filterFruitsId)}>
              <Icon name="reload" style={{ fontSize: 14 }} /> Refresh
            </button>
          </div>
        </Card>

        {/* ── Filter Bar ───────────────────────────────────────────────────────── */}
        <FilterBar
          district={filterDistrict}
          component={filterComponent}
          subScheme={filterSubScheme}
          fruitsId={filterFruitsId}
          onDistrictChange={setFilterDistrict}
          onComponentChange={setFilterComponent}
          onSubSchemeChange={setFilterSubScheme}
          onFruitsIdChange={setFilterFruitsId}
          onApply={applyFilters}
          onClear={clearFilters}
          districts={districts}
          components={components}
          subSchemes={subSchemes}
        />

        {/* ── Error ────────────────────────────────────────────────────────────── */}
        {apiError && (
          <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
            <Icon name="alert-circle" />
            <span>{apiError}</span>
            <button type="button" className="btn btn-sm btn-link text-danger ms-auto p-0"
              onClick={() => fetchList(filterDistrict, filterComponent, filterSubScheme, filterFruitsId)}>
              Retry
            </button>
          </div>
        )}

        {/* ── Loading ──────────────────────────────────────────────────────────── */}
        {loading && (
          <Card className="apl-card">
            <div className="apl-empty">
              <Spinner animation="border" className="text-primary" style={{ width: 40, height: 40 }} />
              <p className="text-muted mt-3 mb-0 small">Loading applications…</p>
            </div>
          </Card>
        )}

        {/* ── Empty state ──────────────────────────────────────────────────────── */}
        {!loading && !apiError && rows.length === 0 && (
          <Card className="apl-card">
            <div className="apl-empty">
              <span className="apl-empty-icon" style={{ fontSize: 28 }}>📭</span>
              <h6 className="fw-bold text-secondary mb-1">No applications found</h6>
              <p className="text-muted mb-0 small">Try adjusting or clearing the filters above.</p>
            </div>
          </Card>
        )}

        {/* ── Table ────────────────────────────────────────────────────────────── */}
        {!loading && rows.length > 0 && (
          <Card className="apl-card" style={{ overflow: "hidden" }}>
            <div className="apl-tbl-wrap">
              <table className="apl-tbl">
                <thead>
                  <tr>
                    {HEADERS.map((h) => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.map((row, i) => {
                    const breached = Number(row.daysElapsed) > Number(row.slaDays);
                    return (
                      <tr key={row.appId || i}>

                        {/* # */}
                        <td style={{ width: 48 }}>
                          <span className="apl-num">{firstIdx + i + 1}</span>
                        </td>

                        {/* Scheme Name */}
                        <td className="small">{schemeName || <span className="text-muted">—</span>}</td>

                        {/* Sub Scheme Name */}
                        <td className="small">{subSchemeNameFor(row) || <span className="text-muted">—</span>}</td>

                        {/* Farmer Name */}
                        <td style={{ minWidth: 180 }}>
                          {row.farmerName ? (
                            <div className="d-flex align-items-center gap-2">
                              <span className="apl-avatar" style={{ background: avatarColor(row.farmerName) }}>{initials(row.farmerName)}</span>
                              <span style={{ fontWeight: 700, color: "#111827" }}>{row.farmerName}</span>
                            </div>
                          ) : <span className="text-muted fst-italic small">Not available</span>}
                        </td>

                        {/* Fruits ID */}
                        <td>
                          {row.fruitsId ? <span className="apl-mono">{row.fruitsId}</span> : <span className="text-muted">—</span>}
                        </td>

                        {/* ARN */}
                        <td>
                          {row.arn ? <span className="apl-arn">{row.arn}</span> : <span className="text-muted">—</span>}
                        </td>

                        {/* District */}
                        <td className="small">
                          {row.districtId
                            ? (districts.find((d) => d.districtId === row.districtId)?.districtName || `District ${row.districtId}`)
                            : <span className="text-muted">—</span>}
                        </td>

                        {/* Component Type */}
                        <td>
                          {row.componentId ? (
                            <span className="apl-chip apl-chip-1"
                              title={components.find((c) => c.scComponentId === row.componentId)?.scComponentName || `ID ${row.componentId}`}>
                              {components.find((c) => c.scComponentId === row.componentId)?.scComponentName || `ID ${row.componentId}`}
                            </span>
                          ) : <span className="text-muted">—</span>}
                        </td>

                        {/* Approval Stage */}
                        <td>
                          {row.stageName ? (
                            <span className="apl-chip"
                              style={{ maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                              title={row.stageName}>
                              {row.stageName}
                            </span>
                          ) : (
                            <span className="text-muted fst-italic small">Not Started</span>
                          )}
                        </td>

                        {/* Submission Date */}
                        <td className="text-muted small">{row.submissionDate || "—"}</td>

                        {/* SLA Days */}
                        <td className="text-center text-muted small">{row.slaDays} d</td>

                        {/* SLA Due Date */}
                        <td className="text-muted small">{row.dueDate || "—"}</td>

                        {/* Days Elapsed + inline SLA usage gauge */}
                        <td style={{ minWidth: 96 }}>
                          {(() => {
                            const used = Number(row.slaDays) > 0 ? Math.min(100, (Number(row.daysElapsed) / Number(row.slaDays)) * 100) : 0;
                            const gc = breached ? "#DC2626" : used >= 75 ? "#D97706" : "#059669";
                            return (
                              <>
                                <span className="apl-badge" style={breached ? { background: "#FEF2F2", color: "#DC2626" } : { background: "#ECFDF5", color: "#059669" }}>
                                  <Icon name={breached ? "alert-triangle" : "check-circle"} style={{ fontSize: 10 }} />
                                  {row.daysElapsed} d
                                </span>
                                <div className="apl-gauge"><div style={{ width: `${used}%`, background: gc }} /></div>
                              </>
                            );
                          })()}
                        </td>

                        {/* Status */}
                        <td>{statusBadge(row.applicationStatus)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* ── Pagination footer ── */}
            <div className="apl-pager">
              <span className="text-muted small">
                Showing <strong>{firstIdx + 1}</strong>–<strong>{Math.min(firstIdx + PAGE_SIZE, rows.length)}</strong> of <strong>{rows.length}</strong> records
              </span>

              {totalPages > 1 && (
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    {/* First */}
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(1)} title="First">«</button>
                    </li>
                    {/* Prev */}
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage((p) => p - 1)} title="Previous">‹</button>
                    </li>

                    {/* Page numbers */}
                    {(() => {
                      const start = Math.max(1, currentPage - 2);
                      const end   = Math.min(totalPages, currentPage + 2);
                      const nums  = [];
                      if (start > 1) nums.push(<li key="el" className="page-item disabled"><span className="page-link">…</span></li>);
                      for (let p = start; p <= end; p++) {
                        nums.push(
                          <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(p)}>{p}</button>
                          </li>
                        );
                      }
                      if (end < totalPages) nums.push(<li key="er" className="page-item disabled"><span className="page-link">…</span></li>);
                      return nums;
                    })()}

                    {/* Next */}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage((p) => p + 1)} title="Next">›</button>
                    </li>
                    {/* Last */}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(totalPages)} title="Last">»</button>
                    </li>
                  </ul>
                </nav>
              )}

              <span className="text-muted small">Page {currentPage} of {totalPages}</span>
            </div>
          </Card>
        )}

      </Block>
    </Layout>
  );
}
