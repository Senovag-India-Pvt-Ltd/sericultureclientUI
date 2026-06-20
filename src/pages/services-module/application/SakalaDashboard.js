import { Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import Block from "../../../components/Block/Block";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLDBT    = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const STATUS_ITEMS = [
  { key: "WITHIN_SLA",  label: "Within SLA",  bs: "success", dotColor: "#197a48", icon: "check-circle" },
  { key: "OUTSIDE_SLA", label: "Outside SLA", bs: "warning",  dotColor: "#c47d0a", icon: "alert-triangle" },
  { key: "PENDING",     label: "Pending",      bs: "danger",  dotColor: "#c0392b", icon: "clock" },
];

const accents = ["#1e67a8", "#0d4f8a", "#155e7a", "#1a6e5c", "#3d5a99", "#4a4a8a", "#165888"];

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({ district, component, fruitsId, onDistrictChange, onComponentChange,
  onFruitsIdChange, onApply, onClear, districts, componentNames }) {

  const active = district || component || (fruitsId && fruitsId.trim());
  const lbl = { fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <Card className="mb-3" style={{ border: "none", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      <div style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", padding: "11px 18px" }}>
        <div className="d-flex align-items-center gap-2">
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="filter" style={{ color: "#fff", fontSize: 12 }} />
          </span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.84rem" }}>Filter Applications</span>
          {active && (
            <span style={{ background: "rgba(255,255,255,0.25)", color: "#fff", fontSize: "0.62rem", fontWeight: 700, borderRadius: "20px", padding: "1px 9px" }}>
              Active
            </span>
          )}
        </div>
      </div>
      <Card.Body className="py-3 px-3">
        <Row className="g-2 align-items-end">
          <Col md="3" xs="12">
            <Form.Group className="form-group">
              <Form.Label className="form-label text-muted mb-1" style={lbl}>District</Form.Label>
              <Form.Select size="sm" value={district || ""}
                onChange={(e) => onDistrictChange(e.target.value ? Number(e.target.value) : null)}>
                <option value="">All Districts</option>
                {districts.map((d) => <option key={d.districtId} value={d.districtId}>{d.districtName}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md="3" xs="12">
            <Form.Group className="form-group">
              <Form.Label className="form-label text-muted mb-1" style={lbl}>Component Type</Form.Label>
              <Form.Select size="sm" value={component || ""}
                onChange={(e) => onComponentChange(e.target.value ? Number(e.target.value) : null)}>
                <option value="">All Components</option>
                {Object.entries(componentNames).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md="3" xs="12">
            <Form.Group className="form-group">
              <Form.Label className="form-label text-muted mb-1" style={lbl}>Fruits ID</Form.Label>
              <Form.Control size="sm" type="text" value={fruitsId || ""}
                onChange={(e) => onFruitsIdChange(e.target.value || null)}
                onKeyDown={(e) => e.key === "Enter" && onApply()}
                placeholder="Enter Fruits ID" maxLength={16} />
            </Form.Group>
          </Col>
          <Col md="3" xs="12">
            <div className="d-flex gap-2">
              <Button size="sm" variant="primary" onClick={onApply} className="flex-fill d-flex align-items-center justify-content-center gap-1" style={{ borderRadius: "6px", fontWeight: 600 }}>
                <Icon name="search" style={{ fontSize: 12 }} /> Apply
              </Button>
              <Button size="sm" variant="outline-secondary" onClick={onClear} className="flex-fill d-flex align-items-center justify-content-center gap-1" style={{ borderRadius: "6px", fontWeight: 600 }}>
                <Icon name="cross" style={{ fontSize: 12 }} /> Clear
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

// ─── Inline Breadcrumb (drill-down navigation) ────────────────────────────────
function DrillBreadcrumb({ crumbs, onNavigate }) {
  return (
    <nav className="mb-3">
      <ol className="breadcrumb breadcrumb-arrow mb-0">
        {crumbs.map((c, i) => (
          <li key={i}
            className={`breadcrumb-item${i === crumbs.length - 1 ? " active fw-bold" : ""}`}
            style={{ cursor: i < crumbs.length - 1 ? "pointer" : "default", fontSize: "0.82rem" }}
            onClick={() => i < crumbs.length - 1 && onNavigate(i)}>
            {c}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ─── SLA Card ─────────────────────────────────────────────────────────────────
const STAT_STYLES = {
  WITHIN_SLA:  { color: "#197a48", hoverBg: "#f0faf5", borderColor: "#b7dfc9", icon: "check-circle", barColor: "#3ddc84" },
  OUTSIDE_SLA: { color: "#c47d0a", hoverBg: "#fffbf0", borderColor: "#f9d98a", icon: "alert-triangle", barColor: "#ffd166" },
  PENDING:     { color: "#c0392b", hoverBg: "#fef5f5", borderColor: "#f0b8b2", icon: "clock", barColor: "#ff6b6b" },
};

function SlaCard({ title, total, withinSla, outsideSla, pendingCount, accent = "#1e67a8", onDrillDown, onViewStatus }) {
  const stats = [
    { label: "Within SLA",  count: withinSla,    type: "WITHIN_SLA" },
    { label: "Outside SLA", count: outsideSla,   type: "OUTSIDE_SLA" },
    { label: "Pending",     count: pendingCount, type: "PENDING" },
  ];

  const safeTotal = total || 0;
  const pct = (n) => (safeTotal > 0 ? ((n ?? 0) / safeTotal) * 100 : 0);

  return (
    <div className="h-100" style={{
      borderRadius: "10px", overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.09)",
      transition: "transform 0.15s, box-shadow 0.15s",
      background: "#fff",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.14)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.09)"; }}>

      {/* ── Coloured header ── */}
      <div style={{ background: accent, padding: "16px 18px 14px" }}>
        <div className="d-flex align-items-start justify-content-between gap-2">
          <p style={{
            color: "rgba(255,255,255,0.95)", fontSize: "0.84rem", fontWeight: 600,
            margin: 0, lineHeight: 1.5, flex: 1,
          }} title={title}>
            {title}
          </p>
          {onDrillDown && (
            <button onClick={onDrillDown} style={{
              background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.38)",
              color: "#fff", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 600,
              padding: "3px 10px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}>
              Sub-Schemes ›
            </button>
          )}
        </div>

        <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ color: "#fff", fontSize: "2.1rem", fontWeight: 900, lineHeight: 1 }}>
            {(total ?? 0).toLocaleString()}
          </span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.73rem" }}>applications</span>
        </div>

        {safeTotal > 0 && (
          <div style={{ marginTop: 10, display: "flex", height: 5, borderRadius: 4, overflow: "hidden", background: "rgba(255,255,255,0.15)" }}>
            <div style={{ width: `${pct(withinSla)}%`, background: STAT_STYLES.WITHIN_SLA.barColor }} />
            <div style={{ width: `${pct(outsideSla)}%`, background: STAT_STYLES.OUTSIDE_SLA.barColor }} />
            <div style={{ width: `${pct(pendingCount)}%`, background: STAT_STYLES.PENDING.barColor }} />
          </div>
        )}
      </div>

      {/* ── 3 stat cells ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        {stats.map(({ label, count, type }, idx) => {
          const s = STAT_STYLES[type];
          return (
            <div key={type}
              onClick={() => onViewStatus(type)}
              style={{
                padding: "14px 8px", textAlign: "center", cursor: "pointer",
                borderRight: idx < 2 ? "1px solid #efefef" : "none",
                borderTop: "1px solid #efefef",
                transition: "background 0.13s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = s.hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}>
              <Icon name={s.icon} style={{ fontSize: "0.85rem", color: s.color, marginBottom: 2, display: "block" }} />
              <div style={{ fontSize: "1.55rem", fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4 }}>
                {(count ?? 0).toLocaleString()}
              </div>
              <div style={{ fontSize: "0.62rem", color: "#8a97a8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                {label}
              </div>
              <span style={{
                fontSize: "0.6rem", fontWeight: 700, color: s.color,
                background: s.hoverBg, border: `1px solid ${s.borderColor}`,
                borderRadius: "20px", padding: "2px 8px",
              }}>
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

  // ── Breadcrumbs ───────────────────────────────────────────────────────────────
  const crumbs = ["Dashboard"];
  if (level >= 1) crumbs.push("Schemes");
  if (level >= 2 && selectedScheme) crumbs.push(selectedScheme.schemeName || `Scheme ${selectedScheme.schemeId}`);

  const activeFilterCount = [filterDistrict, filterComponent, filterFruitsId && filterFruitsId.trim()].filter(Boolean).length;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Layout title="Application Pendency Dashboard">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sak-anim { animation: fadeSlideUp 0.25s ease both; }
        .sak-del-1 { animation-delay: 0.04s; }
        .sak-del-2 { animation-delay: 0.09s; }
        .sak-del-3 { animation-delay: 0.14s; }
        .sak-del-4 { animation-delay: 0.19s; }
        .sak-del-5 { animation-delay: 0.24s; }
      `}</style>

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Application Pendency Dashboard")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item"><a href="/seriui/">Home</a></li>
                <li className="breadcrumb-item active">Application Pendency Dashboard</li>
              </ol>
            </nav>
          </Block.HeadContent>
          {level > 0 && (
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Button variant="primary" size="sm"
                    className="d-md-none d-inline-flex align-items-center gap-1"
                    onClick={() => navigateTo(level - 1)}>
                    <Icon name="arrow-long-left" />
                    <span>Back</span>
                  </Button>
                </li>
                <li>
                  <Button variant="primary"
                    className="d-none d-md-inline-flex align-items-center gap-1"
                    onClick={() => navigateTo(level - 1)}>
                    <Icon name="arrow-long-left" />
                    <span>{level === 2 ? "Back to Schemes" : "Back to Dashboard"}</span>
                  </Button>
                </li>
              </ul>
            </Block.HeadContent>
          )}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* Drill-down breadcrumb */}
        {level > 0 && <DrillBreadcrumb crumbs={crumbs} onNavigate={navigateTo} />}

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
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="text-center">
              <Spinner animation="border" className="text-primary" style={{ width: 36, height: 36 }} />
              <p className="text-muted mt-3 mb-0 small">Loading…</p>
            </div>
          </div>
        )}

        {/* ── LEVEL 0 — Overview ──────────────────────────────────────────────── */}
        {!loading && level === 0 && (
          <div className="sak-anim">
            <Row className="g-gs justify-content-start">
              <Col xxl="4" lg="5" md="7" xs="12">
                <Card style={{
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  border: "none", borderRadius: "12px", overflow: "hidden",
                }}>

                  {/* Gradient header */}
                  <div style={{
                    background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)",
                    padding: "22px 24px 18px", position: "relative", overflow: "hidden",
                  }}>
                    <span style={{
                      position: "absolute", top: -34, right: -34, width: 120, height: 120,
                      borderRadius: "50%", background: "rgba(255,255,255,0.08)",
                    }} />
                    <span style={{
                      position: "absolute", bottom: -44, right: 24, width: 70, height: 70,
                      borderRadius: "50%", background: "rgba(255,255,255,0.06)",
                    }} />
                    <div className="d-flex align-items-center gap-2" style={{ position: "relative" }}>
                      <span style={{
                        width: 30, height: 30, borderRadius: "9px", background: "rgba(255,255,255,0.18)",
                        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Icon name="building" style={{ color: "#fff", fontSize: 15 }} />
                      </span>
                      <p style={{
                        color: "rgba(255,255,255,0.7)", fontSize: "0.68rem",
                        fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: "0.1em", margin: 0,
                      }}>
                        Department of Sericulture
                      </p>
                    </div>
                    <h5 style={{
                      color: "#fff", fontWeight: 700, margin: "10px 0 0",
                      fontSize: "1.05rem", lineHeight: 1.3, position: "relative",
                    }}>
                      Application Pendency Overview
                    </h5>
                  </div>

                  <Card.Body className="px-4 pt-4 pb-4">

                    {/* Total count */}
                    <div className="pb-3 mb-3 border-bottom">
                      <p className="text-muted mb-1 fw-semibold text-uppercase"
                        style={{ fontSize: "0.68rem", letterSpacing: "0.07em" }}>
                        Total Applications
                      </p>
                      <div className="fw-bold text-primary mb-1"
                        style={{ fontSize: "3.4rem", lineHeight: 1, fontFamily: "inherit" }}>
                        {totalPending.toLocaleString()}
                      </div>
                      <p className="text-muted mb-0" style={{ fontSize: "0.78rem" }}>
                        Across all schemes and statuses
                      </p>
                    </div>

                    {/* SLA Status legend */}
                    <div className="mb-4">
                      <div className="d-flex flex-wrap gap-3">
                        {STATUS_ITEMS.map((s) => (
                          <div key={s.key} className="d-flex align-items-center gap-1">
                            <span style={{
                              width: 18, height: 18, borderRadius: "50%",
                              background: `${s.dotColor}1a`, display: "inline-flex",
                              alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                              <Icon name={s.icon} style={{ fontSize: 10, color: s.dotColor }} />
                            </span>
                            <span style={{ fontSize: "0.68rem", color: "#6c757d", fontWeight: 600 }}>
                              {s.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA button */}
                    <Button
                      variant="primary"
                      className="w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{ padding: "10px 0", fontWeight: 700, fontSize: "0.88rem", borderRadius: "8px" }}
                      onClick={goSchemes}>
                      <Icon name="bar-chart-2" />
                      View Scheme-wise Breakdown
                    </Button>

                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* ── LEVEL 1 — Scheme SLA cards ─────────────────────────────────────── */}
        {!loading && level === 1 && (
          <div className="sak-anim">
            {schemeWiseSla.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted mb-0">No applications found for the selected filters.</p>
              </div>
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
              borderLeft: "4px solid #1e67a8", background: "#fff",
              borderRadius: "0 10px 10px 0", padding: "11px 16px",
              marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            }}>
              <span style={{ width: 24, height: 24, borderRadius: "7px", background: "#eaf2fb", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="layers" style={{ fontSize: 12, color: "#1e67a8" }} />
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
              <div className="text-center py-5">
                <p className="text-muted mb-0">No sub-scheme data found for the selected filters.</p>
              </div>
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
