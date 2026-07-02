import { Row, Col, Card, Form, Spinner } from "react-bootstrap";
import Block from "../../../components/Block/Block";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLDBT    = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const accents = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4", "#EF4444", "#0EA5E9"];

// ─── Donut chart (pure SVG, no dependency) ─────────────────────────────────────
function Donut({ segments, size = 168, stroke = 20, total, label,
                 textColor = "#111827", subColor = "#6B7280", trackColor = "#EEF2F7" }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const sum = segments.reduce((a, s) => a + s.value, 0) || 1;
  let off = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
          {segments.map((s, i) => {
            const len = (s.value / sum) * C;
            const c = (
              <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={s.color} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} />
            );
            off += len;
            return c;
          })}
        </g>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: textColor, fontWeight: 800, fontSize: "1.75rem", lineHeight: 1 }}>{(total || 0).toLocaleString()}</span>
        <span style={{ color: subColor, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{label}</span>
      </div>
    </div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({ district, component, fruitsId, onDistrictChange, onComponentChange,
  onFruitsIdChange, onApply, onClear, districts, componentNames }) {

  const active = district || component || (fruitsId && fruitsId.trim());
  const lbl = { fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <Card className="mb-3 sak-card sak-filter" style={{ overflow: "hidden" }}>
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
      <Card.Body style={{ padding: "20px", background: "transparent" }}>
        <Row className="g-3 align-items-end">
          <Col lg="3" md="6" xs="12">
            <Form.Group className="form-group">
              <Form.Label className="form-label mb-1" style={{ ...lbl, color: "#6B7280" }}>District</Form.Label>
              <Form.Select value={district || ""}
                onChange={(e) => onDistrictChange(e.target.value ? Number(e.target.value) : null)}>
                <option value="">All Districts</option>
                {districts.map((d) => <option key={d.districtId} value={d.districtId}>{d.districtName}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg="3" md="6" xs="12">
            <Form.Group className="form-group">
              <Form.Label className="form-label mb-1" style={{ ...lbl, color: "#6B7280" }}>Component Type</Form.Label>
              <Form.Select value={component || ""}
                onChange={(e) => onComponentChange(e.target.value ? Number(e.target.value) : null)}>
                <option value="">All Components</option>
                {Object.entries(componentNames).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg="3" md="6" xs="12">
            <Form.Group className="form-group">
              <Form.Label className="form-label mb-1" style={{ ...lbl, color: "#6B7280" }}>Fruits ID</Form.Label>
              <Form.Control type="text" value={fruitsId || ""}
                onChange={(e) => onFruitsIdChange(e.target.value || null)}
                onKeyDown={(e) => e.key === "Enter" && onApply()}
                placeholder="Enter Fruits ID" maxLength={16} />
            </Form.Group>
          </Col>
          <Col lg="3" md="6" xs="12">
            <div className="d-flex gap-2">
              <button type="button" className="sak-btn sak-btn-primary flex-fill" onClick={onApply}>
                <Icon name="search" style={{ fontSize: 14 }} /> Apply
              </button>
              <button type="button" className="sak-btn sak-btn-secondary flex-fill" onClick={onClear}>
                <Icon name="reload" style={{ fontSize: 14 }} /> Clear
              </button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

// ─── SLA Card ─────────────────────────────────────────────────────────────────
const STAT_STYLES = {
  WITHIN_SLA:  { color: "#10B981", hoverBg: "#ECFDF5", borderColor: "#A7F3D0", icon: "check-circle",   barColor: "#10B981" },
  OUTSIDE_SLA: { color: "#F59E0B", hoverBg: "#FFFBEB", borderColor: "#FDE68A", icon: "alert-triangle", barColor: "#F59E0B" },
  PENDING:     { color: "#EF4444", hoverBg: "#FEF2F2", borderColor: "#FECACA", icon: "clock",          barColor: "#EF4444" },
};

function SlaCard({ title, total, withinSla, outsideSla, pendingCount, accent = "#4f46e5", onDrillDown, onViewStatus }) {
  const stats = [
    { label: "Within SLA",  count: withinSla,    type: "WITHIN_SLA" },
    { label: "Outside SLA", count: outsideSla,   type: "OUTSIDE_SLA" },
    { label: "Pending",     count: pendingCount, type: "PENDING" },
  ];

  const safeTotal = total || 0;
  const pct = (n) => (safeTotal > 0 ? ((n ?? 0) / safeTotal) * 100 : 0);

  return (
    <div className="sak-card sak-scheme h-100">
      {/* slim accent strip */}
      <div className="sak-scheme-accent" style={{ background: accent }} />

      <div className="sak-scheme-head">
        <div className="d-flex align-items-start justify-content-between gap-2">
          <p className="sak-scheme-title" title={title}>{title}</p>
          {onDrillDown && (
            <button className="sak-scheme-btn" style={{ color: accent }} onClick={onDrillDown}>
              Sub-Schemes ›
            </button>
          )}
        </div>

        <div className="d-flex align-items-baseline gap-2 mt-2">
          <span className="sak-scheme-total">{(total ?? 0).toLocaleString()}</span>
          <span className="sak-scheme-applbl">applications</span>
        </div>

        {safeTotal > 0 && (
          <div className="sak-scheme-bar">
            <div style={{ width: `${pct(withinSla)}%`,    background: STAT_STYLES.WITHIN_SLA.barColor }} />
            <div style={{ width: `${pct(outsideSla)}%`,   background: STAT_STYLES.OUTSIDE_SLA.barColor }} />
            <div style={{ width: `${pct(pendingCount)}%`, background: STAT_STYLES.PENDING.barColor }} />
          </div>
        )}
      </div>

      {/* ── 3 stat cells (bottom-anchored so cards align) ── */}
      <div className="sak-scheme-stats">
        {stats.map(({ label, count, type }) => {
          const s = STAT_STYLES[type];
          return (
            <div key={type} className="sak-scheme-cell"
              onClick={() => onViewStatus(type)}
              onMouseEnter={(e) => { e.currentTarget.style.background = s.hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}>
              <Icon name={s.icon} style={{ fontSize: "0.85rem", color: s.color, display: "block" }} />
              <div className="sak-scheme-cell-num" style={{ color: s.color }}>{(count ?? 0).toLocaleString()}</div>
              <div className="sak-scheme-cell-lbl">{label}</div>
              <span className="sak-scheme-view" style={{ color: s.color, background: s.hoverBg, border: `1px solid ${s.borderColor}` }}>
                View List
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function SakalaDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [level,             setLevel]             = useState(0);
  const [selectedScheme,    setSelectedScheme]    = useState(null);
  const [selectedSubScheme, setSelectedSubScheme] = useState(null);
  const [selectedStatus,    setSelectedStatus]    = useState(null);

  const [loading,          setLoading]          = useState(false);
  const [totalPending,     setTotalPending]     = useState(0);
  const [slaSummary,       setSlaSummary]       = useState({ within: 0, outside: 0, pending: 0, total: 0 });
  const [schemeWiseSla,    setSchemeWiseSla]    = useState([]);
  const [subSchemeWiseSla, setSubSchemeWiseSla] = useState([]);

  const [filterDistrict,  setFilterDistrict]  = useState(null);
  const [filterComponent, setFilterComponent] = useState(null);
  const [filterFruitsId,  setFilterFruitsId]  = useState("");

  const [schemeNames,    setSchemeNames]    = useState({});
  const [subSchemeNames, setSubSchemeNames] = useState({});
  const [componentNames, setComponentNames] = useState({});
  const [districts,      setDistricts]      = useState([]);

  const load = (fn) => { setLoading(true); return fn().finally(() => setLoading(false)); };

  // ── Master data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    api.get(baseURLMaster + `scSchemeDetails/get-all`)
      .then((r) => {
        const m = {};
        (r.data.content.ScSchemeDetails || []).forEach((s) => { m[s.scSchemeDetailsId] = s.schemeName; });
        setSchemeNames(m);
      }).catch(() => {});

    api.get(baseURLMaster + `scComponent/get-all`, { params: { isActive: true } })
      .then((r) => {
        const m = {};
        (r.data.content?.scComponent || []).forEach((c) => { if (c.scComponentId) m[c.scComponentId] = c.scComponentName; });
        setComponentNames(m);
      }).catch(() => {});

    api.get(baseURLMaster + `district/get-all`)
      .then((r) => setDistricts(r.data.content?.district || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedScheme) return;
    api.get(baseURLDBT + `master/cost/get-by-scheme-id/${selectedScheme.schemeId}`)
      .then((r) => {
        const m = {};
        (r.data.content.unitCost || []).forEach((s) => { m[s.subSchemeId] = s.subSchemeName; });
        setSubSchemeNames(m);
      }).catch(() => {});
  }, [selectedScheme]);

  // ── Level 0 total ────────────────────────────────────────────────────────────
  const fetchTotal = useCallback(() => {
    load(() => api.get(baseURLDBT + `service/sakala/pending-count`)
      .then((r) => setTotalPending(r.data?.totalPending ?? 0)).catch(() => {}));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchTotal(); }, [fetchTotal]);

  // Aggregate the SLA split (Within / Outside / Pending) for the overview cards
  // from the scheme-wise endpoint, so Level 0 shows real numbers, not just labels.
  useEffect(() => {
    api.get(baseURLDBT + `service/sakala/scheme-wise-sla`)
      .then((r) => {
        const rows = r.data || [];
        const sum = rows.reduce((a, x) => ({
          within:  a.within  + (x.withinSla    || 0),
          outside: a.outside + (x.outsideSla   || 0),
          pending: a.pending + (x.pendingCount || 0),
          total:   a.total   + (x.totalCount   || 0),
        }), { within: 0, outside: 0, pending: 0, total: 0 });
        setSlaSummary(sum);
      })
      .catch(() => {});
  }, []);

  // ── Fetchers ─────────────────────────────────────────────────────────────────
  const buildFilterParams = (dId, cId, fId) => ({
    ...(dId != null       && { districtId:  dId }),
    ...(cId != null       && { componentId: cId }),
    ...(fId && fId.trim() && { fruitsId: fId.trim() }),
  });

  const fetchSchemeWiseSla = (dId, cId, fId) =>
    load(() => api.get(baseURLDBT + `service/sakala/scheme-wise-sla`, { params: buildFilterParams(dId, cId, fId) })
      .then((r) => setSchemeWiseSla(r.data || [])).catch(() => setSchemeWiseSla([])));

  const fetchSubSchemeWiseSla = (sid, dId, cId, fId) =>
    load(() => api.get(baseURLDBT + `service/sakala/subscheme-wise-sla`, {
        params: { schemeId: sid, ...buildFilterParams(dId, cId, fId) },
      })
      .then((r) => setSubSchemeWiseSla(r.data || [])).catch(() => setSubSchemeWiseSla([])));

  // ── Filter apply / clear ─────────────────────────────────────────────────────
  const applyFilters = () => {
    if (level === 1) fetchSchemeWiseSla(filterDistrict, filterComponent, filterFruitsId);
    else if (level === 2 && selectedScheme) fetchSubSchemeWiseSla(selectedScheme.schemeId, filterDistrict, filterComponent, filterFruitsId);
  };

  const clearFilters = () => {
    setFilterDistrict(null);
    setFilterComponent(null);
    setFilterFruitsId("");
    if (level === 1) fetchSchemeWiseSla(null, null, null);
    else if (level === 2 && selectedScheme) fetchSubSchemeWiseSla(selectedScheme.schemeId, null, null, null);
  };

  // ── Navigation ────────────────────────────────────────────────────────────────
  const goSchemes = () => { setLevel(1); fetchSchemeWiseSla(filterDistrict, filterComponent, filterFruitsId); };

  const goSubSchemes = (scheme) => {
    setSelectedScheme(scheme);
    setSelectedSubScheme(null);
    setLevel(2);
    fetchSubSchemeWiseSla(scheme.schemeId, filterDistrict, filterComponent, filterFruitsId);
  };

  const goToList = (params) => navigate("/seriui/pendency-application-list", { state: params });

  const goApplicationListFromScheme = (scheme, status) =>
    goToList({ schemeId: scheme.schemeId, statusType: status, schemeName: scheme.schemeName });

  const goApplicationListFromSubScheme = (subScheme, status) =>
    goToList({
      schemeId:      selectedScheme.schemeId,
      subSchemeId:   subScheme.subSchemeId,
      statusType:    status,
      schemeName:    selectedScheme.schemeName,
      subSchemeName: subScheme.subSchemeName,
      slaDays:       subScheme.slaDays,
    });

  const navigateTo = (li) => {
    setLevel(li);
    if (li <= 0) { setSelectedScheme(null); setSelectedSubScheme(null); setSelectedStatus(null); }
    if (li === 1) { setSelectedSubScheme(null); setSelectedStatus(null); fetchSchemeWiseSla(filterDistrict, filterComponent, filterFruitsId); }
    if (li === 2 && selectedScheme) { setSelectedStatus(null); fetchSubSchemeWiseSla(selectedScheme.schemeId, filterDistrict, filterComponent, filterFruitsId); }
  };

  const activeFilterCount = [filterDistrict, filterComponent, filterFruitsId && filterFruitsId.trim()].filter(Boolean).length;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Layout title="Application Pendency Dashboard">
      <style>{`
        /* Clean enterprise surface — light background scoped to this page only
           (React removes this <style> on navigate-away, so other pages keep the leaf). */
        body { background-image: none !important; background: #F8FAFC !important; }

        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .sak-anim { animation: fadeSlideUp 0.28s ease both; }
        .sak-del-1 { animation-delay: 0.05s; } .sak-del-2 { animation-delay: 0.10s; }
        .sak-del-3 { animation-delay: 0.15s; } .sak-del-4 { animation-delay: 0.20s; }
        .sak-del-5 { animation-delay: 0.25s; }

        .sak-dash { max-width: 100%; }
        .sak-dash * { min-width: 0; }

        /* Cards — clean white, soft modern depth */
        .sak-card { background: #FFFFFF !important; border: 1px solid #EEF1F6 !important; border-radius: 18px;
          box-shadow: 0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.05) !important;
          transition: transform 0.25s cubic-bezier(.2,.8,.2,1), box-shadow 0.25s ease; }

        /* Header */
        .sak-headcard { border: 1px solid #E5E7EB; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 3px rgba(16,24,40,0.06); }
        .sak-headcard .sak-h-row { display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 14px; padding: clamp(14px, 1.6vw, 22px) clamp(16px, 1.8vw, 26px); background: #FFFFFF; }
        .sak-h-icon { width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
          background: linear-gradient(135deg,#2563EB,#3B82F6); display: inline-flex; align-items: center;
          justify-content: center; box-shadow: 0 6px 16px rgba(37,99,235,0.30); }
        .sak-h-title { margin: 0; font-weight: 700; color: #111827; line-height: 1.2; font-size: clamp(1.1rem, 1.6vw, 1.35rem); }
        .sak-h-desc { font-size: clamp(0.74rem, 1vw, 0.84rem); color: #6B7280; margin: 3px 0 0; }
        .sak-h-crumb { font-size: clamp(0.68rem, 1vw, 0.76rem); color: #9CA3AF; margin-top: 5px; }
        .sak-h-crumb a { color: #2563EB; text-decoration: none; font-weight: 600; }

        /* Panel/section titles */
        .sak-panel-title { font-weight: 700; color: #111827; font-size: clamp(0.95rem, 1.3vw, 1.05rem); margin: 0; }
        .sak-panel-sub { font-size: 0.78rem; color: #6B7280; margin: 2px 0 0; }

        /* KPI cards */
        .sak-kpi { overflow: hidden; }
        .sak-kpi:hover { transform: translateY(-5px); box-shadow: 0 18px 40px rgba(16,24,40,0.12) !important; }
        .sak-kpi-lbl { font-size: 0.78rem; color: #6B7280; font-weight: 600; letter-spacing: 0.01em; }
        .sak-kpi-num { font-weight: 800; color: #0B1220; line-height: 1.02; margin-top: 6px; letter-spacing: -0.02em; font-size: clamp(2rem, 3.2vw, 2.4rem); }
        .sak-kpi-icon { width: 50px; height: 50px; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; }
        .sak-bar-track { height: 6px; border-radius: 99px; background: #EEF2F7; overflow: hidden; }
        .sak-bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(.2,.8,.2,1); }

        /* Donut card legend */
        .sak-legend-num { color: #111827; font-weight: 800; line-height: 1; font-size: clamp(0.95rem, 1.4vw, 1.1rem); }
        .sak-legend-lbl { color: #6B7280; font-size: clamp(0.6rem, 0.85vw, 0.68rem); font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2px; }

        /* Buttons */
        .sak-btn { border-radius: 10px; font-weight: 600; font-size: 0.85rem; padding: 9px 18px; border: 1px solid transparent;
          display: inline-flex; align-items: center; justify-content: center; gap: 7px; cursor: pointer; transition: all 0.2s ease; }
        .sak-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .sak-btn-primary { background: linear-gradient(135deg,#2563EB,#3B82F6); color: #fff; box-shadow: 0 6px 16px rgba(37,99,235,0.26); }
        .sak-btn-primary:hover:not(:disabled) { background: linear-gradient(135deg,#1D4ED8,#2563EB); box-shadow: 0 10px 24px rgba(37,99,235,0.34); transform: translateY(-1px); }
        .sak-btn-secondary { background: #F3F4F6; color: #374151; border-color: #E5E7EB; }
        .sak-btn-secondary:hover:not(:disabled) { background: #E5E7EB; }

        /* Filter inputs — consistent height + focus ring */
        .sak-filter .form-select, .sak-filter .form-control { border-radius: 9px; border: 1px solid #E5E7EB; min-height: 42px; font-size: 0.88rem; color: #111827; }
        .sak-filter .form-select:focus, .sak-filter .form-control:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }

        /* Loading / empty */
        .sak-empty { text-align: center; padding: clamp(36px, 6vw, 64px) 20px; }
        .sak-empty-icon { width: 64px; height: 64px; border-radius: 18px; background: #EFF6FF;
          display: inline-flex; align-items: center; justify-content: center; margin-bottom: 14px; }

        /* Scheme / sub-scheme cards (drill-down) */
        .sak-scheme { display: flex; flex-direction: column; overflow: hidden; }
        .sak-scheme:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(16,24,40,0.10) !important; }
        .sak-scheme-accent { height: 4px; width: 100%; }
        .sak-scheme-head { padding: clamp(14px,1.6vw,18px); }
        .sak-scheme-title { color: #111827; font-weight: 700; margin: 0; flex: 1; line-height: 1.4;
          font-size: clamp(0.85rem,1.05vw,0.95rem);
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.5em; }
        .sak-scheme-btn { background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 8px;
          font-size: 0.7rem; font-weight: 700; padding: 5px 11px; cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: background 0.15s; }
        .sak-scheme-btn:hover { background: #E5E7EB; }
        .sak-scheme-total { font-weight: 800; line-height: 1; color: #111827; font-size: clamp(1.7rem,2.6vw,2.15rem); }
        .sak-scheme-applbl { color: #9CA3AF; font-size: 0.76rem; font-weight: 500; }
        .sak-scheme-bar { margin-top: 12px; display: flex; height: 6px; border-radius: 99px; overflow: hidden; background: #EEF2F7; }
        .sak-scheme-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; margin-top: auto; border-top: 1px solid #F1F3F7; }
        .sak-scheme-cell { padding: 14px 6px; text-align: center; cursor: pointer; transition: background 0.15s; }
        .sak-scheme-cell + .sak-scheme-cell { border-left: 1px solid #F1F3F7; }
        .sak-scheme-cell-num { font-weight: 800; line-height: 1; margin: 4px 0; font-size: clamp(1.2rem,1.9vw,1.5rem); }
        .sak-scheme-cell-lbl { font-size: 0.6rem; color: #6B7280; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; }
        .sak-scheme-view { font-size: 0.6rem; font-weight: 700; border-radius: 99px; padding: 3px 10px; display: inline-block; }
      `}</style>

      {/* Block.Head provides the top clearance below the fixed header/menu */}
      <Block.Head>
        {/* ── Premium page header (readable surface, not white-on-leaf) ── */}
        <Card className="sak-headcard">
          <div className="sak-h-row">
            <div className="d-flex align-items-center gap-3" style={{ minWidth: 0 }}>
              <span className="sak-h-icon">
                <Icon name="bar-chart-2" style={{ color: "#fff", fontSize: 22 }} />
              </span>
              <div style={{ minWidth: 0 }}>
                <h4 className="sak-h-title">{t("Application Pendency Dashboard")}</h4>
                <div className="sak-h-crumb">
                  <a href="/seriui/">Home</a>
                  <span style={{ margin: "0 6px", color: "#D1D5DB" }}>›</span>
                  <span style={{ fontWeight: 600, color: "#6B7280" }}>
                    {level === 0 ? "Application Pendency Dashboard" : (level === 1 ? "Schemes" : (selectedScheme?.schemeName || "Sub-Schemes"))}
                  </span>
                </div>
              </div>
            </div>
            {level > 0 && (
              <button type="button" className="sak-btn sak-btn-primary" onClick={() => navigateTo(level - 1)}>
                <Icon name="arrow-long-left" />
                <span>{level === 2 ? "Back to Schemes" : "Back to Dashboard"}</span>
              </button>
            )}
          </div>
        </Card>
      </Block.Head>

      <Block className="mt-n4 sak-dash">

        {/* Filter Bar */}
        {level > 0 && (
          <FilterBar
            district={filterDistrict} component={filterComponent} fruitsId={filterFruitsId}
            onDistrictChange={setFilterDistrict} onComponentChange={setFilterComponent}
            onFruitsIdChange={setFilterFruitsId} onApply={applyFilters} onClear={clearFilters}
            districts={districts} componentNames={componentNames}
          />
        )}

        {/* Spinner */}
        {loading && (
          <Card className="sak-card">
            <div className="sak-empty">
              <Spinner animation="border" className="text-primary" style={{ width: 40, height: 40 }} />
              <p className="text-muted mt-3 mb-0 small">Loading dashboard…</p>
            </div>
          </Card>
        )}

        {/* ── LEVEL 0 — Overview ──────────────────────────────────────────────── */}
        {!loading && level === 0 && (() => {
          const sum     = slaSummary;
          const hasSplit = sum.total > 0;
          const headline = totalPending || sum.total || 0;
          const base    = sum.total || headline || 1;
          const pct     = (n) => Math.round(((n || 0) / base) * 100);
          const tiles   = [
            { type: "WITHIN_SLA",  label: "Within SLA",  count: sum.within  },
            { type: "OUTSIDE_SLA", label: "Outside SLA", count: sum.outside },
            { type: "PENDING",     label: "Pending",     count: sum.pending },
          ];

          return (
            <div className="sak-anim">
              {/* ── KPI cards ── */}
              <Row className="g-3">
                {[
                  { key: "TOTAL",       label: "Total Applications", count: headline,    color: "#2563EB", grad: "linear-gradient(135deg,#2563EB,#60A5FA)", icon: "building",                    showPct: false },
                  { key: "WITHIN_SLA",  label: "Within SLA",         count: sum.within,  color: STAT_STYLES.WITHIN_SLA.color,  grad: "linear-gradient(135deg,#059669,#34D399)", icon: STAT_STYLES.WITHIN_SLA.icon,   showPct: true },
                  { key: "OUTSIDE_SLA", label: "Outside SLA",        count: sum.outside, color: STAT_STYLES.OUTSIDE_SLA.color, grad: "linear-gradient(135deg,#D97706,#FBBF24)", icon: STAT_STYLES.OUTSIDE_SLA.icon,  showPct: true },
                  { key: "PENDING",     label: "Pending",            count: sum.pending, color: STAT_STYLES.PENDING.color,     grad: "linear-gradient(135deg,#DC2626,#F87171)", icon: STAT_STYLES.PENDING.icon,      showPct: true },
                ].map((k, idx) => (
                  <Col xs="12" sm="6" xl="3" key={k.key} className={`sak-anim sak-del-${idx + 1}`}>
                    <Card className="sak-card sak-kpi h-100">
                      <Card.Body style={{ padding: "clamp(18px,1.7vw,24px)" }}>
                        <div className="d-flex align-items-start justify-content-between gap-2">
                          <div>
                            <div className="sak-kpi-lbl">{k.label}</div>
                            <div className="sak-kpi-num">{(k.count || 0).toLocaleString()}</div>
                          </div>
                          <span className="sak-kpi-icon" style={{ background: k.grad, boxShadow: `0 8px 20px ${k.color}40` }}>
                            <Icon name={k.icon} style={{ fontSize: 22 }} />
                          </span>
                        </div>
                        {hasSplit && k.showPct && (
                          <div className="d-flex align-items-center gap-2 mt-3">
                            <div className="sak-bar-track flex-fill"><div className="sak-bar-fill" style={{ width: `${pct(k.count)}%`, background: k.grad }} /></div>
                            <span style={{ fontSize: "0.74rem", fontWeight: 700, color: k.color }}>{pct(k.count)}%</span>
                          </div>
                        )}
                        {k.key === "TOTAL" && (
                          <div className="mt-3" style={{ fontSize: "0.74rem", color: "#9CA3AF" }}>Across all schemes &amp; statuses</div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* ── SLA distribution + breakdown CTA ── */}
              <Row className="g-3 mt-1">
                {hasSplit && (
                  <Col xs="12" lg="7" className="sak-anim sak-del-4">
                    <Card className="sak-card h-100">
                      <Card.Body style={{ padding: "clamp(18px,1.8vw,24px)" }}>
                        <div className="mb-3">
                          <h6 className="sak-panel-title">SLA Distribution</h6>
                          <p className="sak-panel-sub">Breakdown of all applications by SLA status</p>
                        </div>
                        <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-4 flex-wrap">
                          <Donut
                            segments={[
                              { value: sum.within,  color: STAT_STYLES.WITHIN_SLA.barColor },
                              { value: sum.outside, color: STAT_STYLES.OUTSIDE_SLA.barColor },
                              { value: sum.pending, color: STAT_STYLES.PENDING.barColor },
                            ]}
                            total={base}
                            label="Total"
                          />
                          <div className="d-flex flex-column gap-3">
                            {tiles.map((tt) => {
                              const s = STAT_STYLES[tt.type];
                              return (
                                <div key={tt.type} className="d-flex align-items-center gap-2">
                                  <span style={{ width: 12, height: 12, borderRadius: "4px", background: s.barColor, flexShrink: 0 }} />
                                  <div>
                                    <div className="sak-legend-num">
                                      {(tt.count || 0).toLocaleString()}
                                      <span style={{ color: "#9CA3AF", fontSize: "0.72rem", fontWeight: 600 }}> · {pct(tt.count)}%</span>
                                    </div>
                                    <div className="sak-legend-lbl">{tt.label}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )}

                <Col xs="12" lg={hasSplit ? "5" : "12"} className="sak-anim sak-del-5">
                  <Card className="sak-card h-100">
                    <Card.Body className="d-flex flex-column justify-content-center" style={{ padding: "clamp(18px,1.8vw,28px)" }}>
                      <span className="sak-kpi-icon mb-3" style={{ width: 52, height: 52, background: "#EFF6FF", color: "#2563EB" }}>
                        <Icon name="bar-chart-2" style={{ fontSize: 24 }} />
                      </span>
                      <h6 className="sak-panel-title">Scheme-wise Breakdown</h6>
                      <p className="sak-panel-sub mb-3">Drill into each scheme to view SLA status and open the application lists.</p>
                      <button type="button" className="sak-btn sak-btn-primary" style={{ alignSelf: "flex-start" }} onClick={goSchemes}>
                        <Icon name="bar-chart-2" /> View Scheme-wise Breakdown
                      </button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          );
        })()}

        {/* ── LEVEL 1 — Scheme SLA cards ─────────────────────────────────────── */}
        {!loading && level === 1 && (
          <div className="sak-anim">
            {schemeWiseSla.length === 0 ? (
              <Card className="sak-card">
                <div className="sak-empty">
                  <span className="sak-empty-icon" style={{ fontSize: 28 }}>📭</span>
                  <h6 className="fw-bold text-secondary mb-1">No applications found</h6>
                  <p className="text-muted mb-0 small">Try adjusting or clearing the filters above.</p>
                </div>
              </Card>
            ) : (
              <Row className="g-3">
                {schemeWiseSla.map((item, i) => {
                  const schemeName = schemeNames[item.schemeId] || `Scheme ${item.schemeId}`;
                  const scheme = { schemeId: item.schemeId, schemeName };
                  return (
                    <Col lg="4" md="6" key={item.schemeId} className={`sak-anim sak-del-${Math.min(i + 1, 5)}`}>
                      <SlaCard
                        title={schemeName}
                        total={item.totalCount}
                        withinSla={item.withinSla}
                        outsideSla={item.outsideSla}
                        pendingCount={item.pendingCount}
                        accent={accents[i % accents.length]}
                        onDrillDown={() => goSubSchemes(scheme)}
                        onViewStatus={(status) => goApplicationListFromScheme(scheme, status)}
                      />
                    </Col>
                  );
                })}
              </Row>
            )}
          </div>
        )}

        {/* ── LEVEL 2 — Sub-scheme SLA cards ─────────────────────────────────── */}
        {!loading && level === 2 && (
          <div className="sak-anim">
            {/* Section header */}
            <div style={{
              borderLeft: "4px solid #4f46e5", background: "#fff",
              borderRadius: "0 10px 10px 0", padding: "11px 16px",
              marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            }}>
              <span style={{ width: 24, height: 24, borderRadius: "7px", background: "#eef2ff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="layers" style={{ fontSize: 12, color: "#4f46e5" }} />
              </span>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2a3a" }}>Sub-Schemes</span>
              {selectedScheme?.schemeName && (
                <span className="badge bg-light border text-secondary fw-semibold" style={{ fontSize: "0.72rem" }}>
                  {selectedScheme.schemeName}
                </span>
              )}
              {activeFilterCount > 0 && (
                <span className="badge bg-primary" style={{ fontSize: "0.63rem" }}>
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                </span>
              )}
              <span className="text-muted small">Click a count to view the application list</span>
            </div>

            {subSchemeWiseSla.length === 0 ? (
              <Card className="sak-card">
                <div className="sak-empty">
                  <span className="sak-empty-icon" style={{ fontSize: 28 }}>📭</span>
                  <h6 className="fw-bold text-secondary mb-1">No sub-scheme data found</h6>
                  <p className="text-muted mb-0 small">Try adjusting or clearing the filters above.</p>
                </div>
              </Card>
            ) : (
              <Row className="g-3">
                {subSchemeWiseSla.map((item, i) => {
                  const subSchemeName = subSchemeNames[item.subSchemeId] || `Sub-Scheme ${item.subSchemeId}`;
                  const subScheme = { subSchemeId: item.subSchemeId, subSchemeName, slaDays: item.slaDays };
                  return (
                    <Col lg="4" md="6" key={item.subSchemeId} className={`sak-anim sak-del-${Math.min(i + 1, 5)}`}>
                      <SlaCard
                        title={subSchemeName}
                        total={item.totalCount}
                        withinSla={item.withinSla}
                        outsideSla={item.outsideSla}
                        pendingCount={item.pendingCount}
                        accent={accents[(i + 2) % accents.length]}
                        onDrillDown={null}
                        onViewStatus={(status) => goApplicationListFromSubScheme(subScheme, status)}
                      />
                    </Col>
                  );
                })}
              </Row>
            )}
          </div>
        )}

      </Block>
    </Layout>
  );
}

export default SakalaDashboard;
