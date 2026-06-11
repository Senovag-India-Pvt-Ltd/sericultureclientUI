import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../services/auth/api";

const baseURLDBT    = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const STATUS_META = {
  WITHIN_SLA:  { label: "Within SLA",  badgeClass: "bg-success" },
  OUTSIDE_SLA: { label: "Outside SLA", badgeClass: "bg-warning text-dark" },
  PENDING:     { label: "Pending",      badgeClass: "bg-danger" },
};

// Table header style matching the app's DataTable customStyles
const TH = {
  backgroundColor: "#1e67a8", color: "#fff",
  fontSize: "13px", fontWeight: 600,
  padding: "10px 12px", whiteSpace: "nowrap",
};

// ── Filter Bar ─────────────────────────────────────────────────────────────────
function FilterBar({ district, component, fruitsId, onDistrictChange, onComponentChange,
  onFruitsIdChange, onApply, onClear, districts, components }) {

  const active = district || component || (fruitsId && fruitsId.trim());
  const lbl = { fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <Card className="mb-3">
      <Card.Body className="py-3">
        <div className="d-flex align-items-center gap-2 mb-3">
          <Icon name="filter" style={{ color: "#1e67a8", fontSize: 14 }} />
          <span className="fw-bold text-primary" style={{ fontSize: "0.85rem" }}>Filter Applications</span>
          {active && <span className="badge bg-primary ms-1" style={{ fontSize: "0.63rem" }}>Active</span>}
        </div>
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
                {components.map((c) => <option key={c.scComponentId} value={c.scComponentId}>{c.scComponentName}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md="3" xs="12">
            <Form.Group className="form-group">
              <Form.Label className="form-label text-muted mb-1" style={lbl}>Fruits ID</Form.Label>
              <Form.Control size="sm" type="text" value={fruitsId || ""}
                onChange={(e) => onFruitsIdChange(e.target.value || "")}
                onKeyDown={(e) => e.key === "Enter" && onApply()}
                placeholder="Enter Fruits ID" maxLength={16} />
            </Form.Group>
          </Col>
          <Col md="3" xs="12">
            <div className="d-flex gap-2">
              <Button size="sm" variant="primary" onClick={onApply} className="flex-fill">Apply</Button>
              <Button size="sm" variant="secondary" onClick={onClear} className="flex-fill">Clear</Button>
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
  const [filterFruitsId,  setFilterFruitsId]  = useState("");

  const [districts,  setDistricts]  = useState([]);
  const [components, setComponents] = useState([]);

  useEffect(() => {
    api.get(baseURLMaster + "district/get-all")
      .then((r) => setDistricts(r.data.content?.district || [])).catch(() => {});
    api.get(baseURLMaster + "scComponent/get-all", { params: { isActive: true } })
      .then((r) => setComponents(r.data.content?.scComponent || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!schemeId || !statusType) { setApiError("Missing parameters. Please go back and try again."); return; }
    fetchList(null, null, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchList = (dId, cId, fId) => {
    setApiError(null);
    setLoading(true);
    const params = { schemeId, statusType };
    if (subSchemeId != null) params.subSchemeId = subSchemeId;
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

  const applyFilters = () => fetchList(filterDistrict, filterComponent, filterFruitsId);
  const clearFilters = () => {
    setFilterDistrict(null);
    setFilterComponent(null);
    setFilterFruitsId("");
    fetchList(null, null, "");
  };

  const meta = STATUS_META[statusType] || { label: statusType || "Applications", badgeClass: "bg-primary" };

  const statusBadge = (status) => {
    if (!status) return <span className="text-muted">—</span>;
    const isPaid    = status === "PAYMENT SUCCESS IN DBT";
    const isPending = status.toUpperCase().includes("PENDING");
    const cls = isPaid ? "bg-success" : isPending ? "bg-danger" : "bg-primary";
    return (
      <span className={`badge ${cls}`} style={{ fontSize: "0.67rem", fontWeight: 600, whiteSpace: "normal", textAlign: "left" }}>
        {status}
      </span>
    );
  };

  const HEADERS = [
    "#", "Farmer Name", "Fruits ID", "ARN", "District",
    "Component Type", "Approval Stage", "Submission Date",
    "SLA Days", "SLA Due Date", "Days Elapsed", "Status",
  ];

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const pagedRows  = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstIdx   = (currentPage - 1) * PAGE_SIZE;

  return (
    <Layout title="Application Pendency">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Application Pendency</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item"><a href="/seriui/">Home</a></li>
                <li className="breadcrumb-item">
                  <span style={{ cursor: "pointer" }} className="text-primary"
                    onClick={() => navigate("/seriui/pendency-dashboard")}>
                    Pendency Dashboard
                  </span>
                </li>
                <li className="breadcrumb-item active">{meta.label}</li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Button variant="primary" size="sm"
                  className="d-md-none d-inline-flex align-items-center gap-1"
                  onClick={() => navigate(-1)}>
                  <Icon name="arrow-long-left" />
                  <span>Back</span>
                </Button>
              </li>
              <li>
                <Button variant="primary"
                  className="d-none d-md-inline-flex align-items-center gap-1"
                  onClick={() => navigate(-1)}>
                  <Icon name="arrow-long-left" />
                  <span>Back to Dashboard</span>
                </Button>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">

        {/* ── Context strip ────────────────────────────────────────────────────── */}
        <Card className="mb-3">
          <Card.Body className="py-2">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <span className={`badge ${meta.badgeClass}`}>{meta.label}</span>
              <span className="fw-bold">{schemeName}</span>
              {subSchemeName && <span className="text-muted small">/ {subSchemeName}</span>}
              {slaDays && (
                <span className="badge bg-light text-secondary border" style={{ fontSize: "0.72rem" }}>
                  SLA: {slaDays} days
                </span>
              )}
              <div className="ms-auto d-flex align-items-center gap-2">
                {!loading && (
                  <span className="text-muted small">
                    {rows.length} record{rows.length !== 1 ? "s" : ""} · {totalPages} page{totalPages !== 1 ? "s" : ""}
                  </span>
                )}
                <Button size="sm" variant="outline-secondary"
                  className="d-inline-flex align-items-center gap-1"
                  onClick={() => fetchList(filterDistrict, filterComponent, filterFruitsId)}>
                  <Icon name="reload" />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* ── Filter Bar ───────────────────────────────────────────────────────── */}
        <FilterBar
          district={filterDistrict}
          component={filterComponent}
          fruitsId={filterFruitsId}
          onDistrictChange={setFilterDistrict}
          onComponentChange={setFilterComponent}
          onFruitsIdChange={setFilterFruitsId}
          onApply={applyFilters}
          onClear={clearFilters}
          districts={districts}
          components={components}
        />

        {/* ── Error ────────────────────────────────────────────────────────────── */}
        {apiError && (
          <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
            <Icon name="alert-circle" />
            <span>{apiError}</span>
            <button type="button" className="btn btn-sm btn-link text-danger ms-auto p-0"
              onClick={() => fetchList(filterDistrict, filterComponent, filterFruitsId)}>
              Retry
            </button>
          </div>
        )}

        {/* ── Loading ──────────────────────────────────────────────────────────── */}
        {loading && (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="text-center">
              <Spinner animation="border" className="text-primary" style={{ width: 36, height: 36 }} />
              <p className="text-muted mt-3 mb-0 small">Loading applications…</p>
            </div>
          </div>
        )}

        {/* ── Empty state ──────────────────────────────────────────────────────── */}
        {!loading && !apiError && rows.length === 0 && (
          <div className="text-center py-5">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mb-3"
              style={{ width: 56, height: 56 }}>
              <Icon name="search" style={{ fontSize: 22, color: "#8a97a8" }} />
            </div>
            <p className="text-muted mb-0">No applications found for the selected filters.</p>
          </div>
        )}

        {/* ── Table ────────────────────────────────────────────────────────────── */}
        {!loading && rows.length > 0 && (
          <Card>
            <div className="table-responsive">
              <table className="table table-middle table-hover mb-0">
                <thead>
                  <tr>
                    {HEADERS.map((h) => <th key={h} style={TH}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.map((row, i) => {
                    const breached = Number(row.daysElapsed) > Number(row.slaDays);
                    return (
                      <tr key={row.appId || i}>

                        {/* # */}
                        <td className="text-muted small fw-semibold" style={{ width: 40 }}>
                          {firstIdx + i + 1}
                        </td>

                        {/* Farmer Name */}
                        <td style={{ minWidth: 150 }}>
                          {row.farmerName
                            ? <span className="fw-bold">{row.farmerName}</span>
                            : <span className="text-muted fst-italic small">Not available</span>}
                        </td>

                        {/* Fruits ID */}
                        <td className="font-monospace small text-secondary">
                          {row.fruitsId || <span className="text-muted">—</span>}
                        </td>

                        {/* ARN */}
                        <td>
                          <span className="fw-semibold text-primary small">
                            {row.arn || <span className="text-muted fw-normal">—</span>}
                          </span>
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
                            <span className="badge bg-light border fw-semibold"
                              style={{ color: "#1a56a0", fontSize: "0.69rem" }}>
                              {components.find((c) => c.scComponentId === row.componentId)?.scComponentName || `ID ${row.componentId}`}
                            </span>
                          ) : <span className="text-muted">—</span>}
                        </td>

                        {/* Approval Stage */}
                        <td>
                          {row.stageName ? (
                            <span className="badge bg-light border fw-semibold text-dark"
                              style={{ fontSize: "0.68rem", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", display: "inline-block" }}
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

                        {/* Days Elapsed */}
                        <td>
                          <span className={`badge ${breached ? "bg-danger" : "bg-success"} fw-bold`}>
                            {row.daysElapsed} d
                          </span>
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
            <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top bg-light flex-wrap gap-2">
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
