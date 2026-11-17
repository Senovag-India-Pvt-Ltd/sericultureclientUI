import { useCallback, useEffect, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Layout from "../../layout/default";
import { Icon } from "../../components";
import api from "../../services/auth/api";
import CopyButton from "./CopyButton";
import "./sevasindhu-source.css";
import "./sevasindhu-applications.css";

// Department screen "Seva Sindhu Applications": citizen applications received through Seva Sindhu and waiting
// for (or already taken up in) the normal service application workflow. Officers see the applications assigned
// to them; administrators see all and can route an application whose taluk has no officer mapping.
// Open = the existing Service Application page, pre-filled from the Seva Sindhu application.
const BASE = (process.env.REACT_APP_API_BASE_URL_DBT || "") + "sevasindhu-application/";
const MASTER = process.env.REACT_APP_API_BASE_URL_MASTER_DATA || "";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-");
const fmtTime = (d) => (d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "");
const fmt = (d) => (d ? `${fmtDate(d)}, ${fmtTime(d)}` : "-");
const size = (b) => (b == null ? "" : b < 1048576 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1048576).toFixed(2)} MB`);
const fileKind = (t = "") => (t.startsWith("image/") ? "image" : t.startsWith("video/") ? "video" : "pdf");
const fileIcon = (t = "") => ({ image: "img", video: "video", pdf: "file-pdf" })[fileKind(t)];
const initials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

const EMPTY = { ref: "", fruitsId: "", name: "", schemeId: "", financialYearId: "", districtId: "", talukId: "", fromDate: "", toDate: "", status: "" };

const QUICK = [
  { value: "", label: "All", icon: "layers" },
  { value: "SUBMITTED", label: "New", icon: "inbox" },
  { value: "IN_PROCESS", label: "In process", icon: "clock" },
  { value: "MAPPING_MISSING", label: "Officer not mapped", icon: "alert-circle" },
];

function statusOf(r) {
  if (r.status === "IN_PROCESS") return { cls: "is-progress", icon: "clock", text: r.statusLabel || "In process" };
  if (r.routingStatus === "MAPPING_MISSING") return { cls: "is-warn", icon: "alert-circle", text: "Officer not mapped" };
  return { cls: "is-new", icon: "inbox", text: "New · Submitted" };
}

function StatusPill({ row }) {
  const s = statusOf(row);
  return <span className={`ssa-status ${s.cls}`}><Icon name={s.icon} /> {s.text}</span>;
}

function Field({ icon, children }) {
  return (
    <div className="ssa-field">
      <Icon name={icon} className="ssa-field-ic" />
      {children}
    </div>
  );
}

function Info({ icon, label, value, wide }) {
  return (
    <div className={`ssa-info${wide ? " is-wide" : ""}`}>
      <span className="ssa-info-ic" aria-hidden="true"><Icon name={icon} /></span>
      <div>
        <dt>{label}</dt>
        <dd>{value || "-"}</dd>
      </div>
    </div>
  );
}

function SevaSindhuApplications() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(EMPTY);
  const [applied, setApplied] = useState(EMPTY);
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [years, setYears] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [detail, setDetail] = useState(null);
  const [detailBusy, setDetailBusy] = useState(false);
  const [officers, setOfficers] = useState([]);
  const [officerId, setOfficerId] = useState("");
  const [moreFilters, setMoreFilters] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    api.get(MASTER + "scSchemeDetails/get-all").then((r) => setSchemes(r.data?.content?.ScSchemeDetails || [])).catch(() => {});
    api.get(MASTER + "financialYearMaster/get-all").then((r) => setYears(r.data?.content?.financialYearMaster || [])).catch(() => {});
    api.get(MASTER + "district/get-all").then((r) => setDistricts(r.data?.content?.district || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setTaluks([]);
    if (filters.districtId) {
      api.get(MASTER + `taluk/get-by-district-id/${filters.districtId}`).then((r) => setTaluks(r.data?.content?.taluk || [])).catch(() => {});
    }
  }, [filters.districtId]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, size: pageSize };
      Object.entries(applied).forEach(([k, v]) => { if (v !== "" && v != null) params[k] = v; });
      const res = await api.get(BASE + "list", { params });
      setData(res.data);
    } catch (e) {
      const status = e?.response?.status;
      setError(
        e?.response?.data?.message ||
          (!e?.response ? "Could not reach the DBT service. Check that it is running, then try again."
            : status === 401 || status === 403 ? "Your session has expired or you do not have access. Please log in again."
            : `Could not load Seva Sindhu applications (error ${status}). Please try again.`)
      );
    } finally {
      setLoading(false);
    }
  }, [page, applied]);

  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value, ...(k === "districtId" ? { talukId: "" } : {}) }));
  const search = (e) => { e.preventDefault(); setPage(0); setApplied(filters); };
  const reset = () => { setFilters(EMPTY); setApplied(EMPTY); setPage(0); };
  const quick = (status) => { const next = { ...filters, status }; setFilters(next); setApplied(next); setPage(0); };

  const openDetail = async (row) => {
    setDetailBusy(true);
    setDetail({ id: row.id, loading: true });
    setOfficers([]);
    setOfficerId("");
    try {
      const res = await api.get(BASE + row.id);
      setDetail(res.data);
      if (res.data.admin && !res.data.serviceFormId) {
        api.get(BASE + `${row.id}/officers`).then((o) => setOfficers(o.data || [])).catch(() => {});
      }
    } catch (e) {
      setDetail(null);
      Swal.fire({ icon: "error", title: "Cannot open", text: e?.response?.data?.message || "Please try again." });
    } finally {
      setDetailBusy(false);
    }
  };

  const viewDocument = async (doc) => {
    try {
      const res = await api.get(BASE + `${detail.id}/documents/${doc.id}`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: doc.contentType }));
      window.open(url, "_blank", "noopener");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      Swal.fire({ icon: "error", title: "Document not available", text: "Please try again." });
    }
  };

  const assign = async () => {
    if (!officerId) return;
    try {
      const res = await api.post(BASE + `${detail.id}/assign`, { officerUserId: Number(officerId) });
      setDetail(res.data);
      Swal.fire({ icon: "success", title: "Officer assigned", text: `Assigned to ${res.data.assignedOfficer}.` });
      load();
    } catch (e) {
      Swal.fire({ icon: "error", title: "Not assigned", text: e?.response?.data?.message || "Please try again." });
    }
  };

  const openApplication = (d) => {
    if (d.serviceFormId) navigate(`/seriui/service-application-edit/${d.serviceFormId}`);
    else navigate(`/seriui/service-application?sevaSindhuApplicationId=${d.id}`);
  };

  const rows = data?.content || [];
  const total = data?.totalRecords || 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const activeCount = Object.entries(applied).filter(([k, v]) => k !== "status" && v !== "").length;
  const first = total === 0 ? 0 : page * pageSize + 1;
  const last = Math.min(total, (page + 1) * pageSize);

  return (
    <Layout title="Seva Sindhu Applications">
      <div className="ssa-page">
        <section className="ssa-hero">
          <div className="ssa-hero-main">
            <span className="ssa-hero-ic" aria-hidden="true"><Icon name="link" /></span>
            <div>
              <span className="ssa-eyebrow">Services · Seva Sindhu</span>
              <h2>Seva Sindhu Applications</h2>
              <p>Received from citizens through Seva Sindhu. Open one to continue it in Service Application.</p>
            </div>
          </div>
          <div className="ssa-hero-side">
            {data && (
              <div className="ssa-stat">
                <strong>{total}</strong>
                <span>{applied.status || activeCount ? "matching" : total === 1 ? "application" : "applications"}</span>
              </div>
            )}
            <div className="ssa-scope">
              <Icon name={data && !data.admin ? "user-check" : "users"} />
              {data && !data.admin ? "Assigned to you" : "All applications"}
            </div>
            <button type="button" className="ssa-btn ssa-btn-light" onClick={load} disabled={loading}>
              <Icon name="reload" className={loading ? "ssa-spin-ic" : ""} /> Refresh
            </button>
          </div>
        </section>

        <section className="ssa-card ssa-filters">
          <div className="ssa-quick" role="tablist" aria-label="Filter by status">
            {QUICK.map((q) => (
              <button
                key={q.value || "all"}
                type="button"
                role="tab"
                aria-selected={applied.status === q.value}
                className={`ssa-quick-btn${applied.status === q.value ? " is-active" : ""}`}
                onClick={() => quick(q.value)}
              >
                <Icon name={q.icon} /> {q.label}
              </button>
            ))}
          </div>

          <Form onSubmit={search}>
            <div className="ssa-grid ssa-grid-main">
              <Field icon="search">
                <Form.Control placeholder="Seva Sindhu / e-Reshme ref. / ARN" value={filters.ref} onChange={set("ref")} aria-label="Reference number" />
              </Field>
              <Field icon="user-check">
                <Form.Control placeholder="FRUITS ID" value={filters.fruitsId} onChange={set("fruitsId")} aria-label="FRUITS ID" />
              </Field>
              <Field icon="user-alt">
                <Form.Control placeholder="Farmer / reeler name" value={filters.name} onChange={set("name")} aria-label="Applicant name" />
              </Field>
              <div className="ssa-actions">
                <button type="button" className={`ssa-btn ssa-btn-ghost${moreFilters ? " is-on" : ""}`} onClick={() => setMoreFilters((v) => !v)} aria-expanded={moreFilters}>
                  <Icon name="filter-alt" /> Filters{activeCount > 0 && <span className="ssa-count">{activeCount}</span>}
                </button>
                <button type="submit" className="ssa-btn ssa-btn-primary"><Icon name="search" /> Search</button>
              </div>
            </div>

            {moreFilters && (
              <div className="ssa-more">
                <div className="ssa-grid ssa-grid-more">
                  <label className="ssa-lbl">
                    <span>Scheme</span>
                    <Form.Select value={filters.schemeId} onChange={set("schemeId")}>
                      <option value="">All schemes</option>
                      {schemes.map((s) => <option key={s.scSchemeDetailsId} value={s.scSchemeDetailsId}>{s.schemeName}</option>)}
                    </Form.Select>
                  </label>
                  <label className="ssa-lbl">
                    <span>Financial year</span>
                    <Form.Select value={filters.financialYearId} onChange={set("financialYearId")}>
                      <option value="">All years</option>
                      {years.map((y) => <option key={y.financialYearMasterId} value={y.financialYearMasterId}>{y.financialYear}</option>)}
                    </Form.Select>
                  </label>
                  <label className="ssa-lbl">
                    <span>District</span>
                    <Form.Select value={filters.districtId} onChange={set("districtId")}>
                      <option value="">All districts</option>
                      {districts.map((d) => <option key={d.districtId} value={d.districtId}>{d.districtName}</option>)}
                    </Form.Select>
                  </label>
                  <label className="ssa-lbl">
                    <span>Taluk</span>
                    <Form.Select value={filters.talukId} onChange={set("talukId")} disabled={!filters.districtId}>
                      <option value="">{filters.districtId ? "All taluks" : "Select a district first"}</option>
                      {taluks.map((t) => <option key={t.talukId} value={t.talukId}>{t.talukName}</option>)}
                    </Form.Select>
                  </label>
                  <label className="ssa-lbl">
                    <span>Submitted from</span>
                    <Form.Control type="date" value={filters.fromDate} onChange={set("fromDate")} />
                  </label>
                  <label className="ssa-lbl">
                    <span>Submitted to</span>
                    <Form.Control type="date" value={filters.toDate} onChange={set("toDate")} />
                  </label>
                </div>
                <div className="ssa-more-foot">
                  <button type="button" className="ssa-link" onClick={reset}><Icon name="cross" /> Clear all filters</button>
                  <button type="submit" className="ssa-btn ssa-btn-primary"><Icon name="check" /> Apply filters</button>
                </div>
              </div>
            )}
          </Form>
        </section>

        {error && (
          <div className="ssa-alert" role="alert">
            <Icon name="alert-circle" />
            <span>{error}</span>
            <button type="button" className="ssa-link" onClick={load}>Try again</button>
          </div>
        )}

        <section className="ssa-card ssa-results">
          <div className="ssa-results-hd">
            <h3><Icon name="file-docs" /> Applications</h3>
            {total > 0 && <span className="ssa-muted">Showing {first}–{last} of {total}</span>}
          </div>

          {loading && rows.length === 0 ? (
            <div className="ssa-skeletons" aria-label="Loading">
              {[0, 1, 2].map((i) => <div key={i} className="ssa-skel" />)}
            </div>
          ) : rows.length === 0 ? (
            <div className="ssa-empty">
              <span className="ssa-empty-ic" aria-hidden="true"><Icon name="inbox" /></span>
              <h4>No Seva Sindhu applications found</h4>
              <p>{activeCount || applied.status ? "Try changing or clearing the filters." : "New applications from Seva Sindhu will appear here."}</p>
              {(activeCount > 0 || applied.status) && <button type="button" className="ssa-btn ssa-btn-ghost" onClick={reset}>Clear filters</button>}
            </div>
          ) : (
            <div className={`ssa-table-wrap${loading ? " is-loading" : ""}`}>
              <table className="ssa-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Reference</th>
                    <th>Applicant</th>
                    <th>Scheme</th>
                    <th>Location</th>
                    <th>Assigned officer</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th aria-label="Action" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} onClick={() => openDetail(r)} className="ssa-row">
                      <td data-label="#" className="ssa-num">{r.serialNumber}</td>
                      <td data-label="Reference">
                        <div className="ssa-ref">
                          <strong>{r.edcsApplicationRefNo}</strong>
                          <span onClick={(e) => e.stopPropagation()}><CopyButton value={r.edcsApplicationRefNo} className="ssa-copy" withText={false} /></span>
                        </div>
                        <div className="ssa-sub ssa-mono">{r.referenceNo}{r.arn ? ` · ARN ${r.arn}` : ""}</div>
                      </td>
                      <td data-label="Applicant">
                        <div className="ssa-person">
                          <span className="ssa-avatar" aria-hidden="true">{initials(r.applicantName)}</span>
                          <div>
                            <strong>{r.applicantName || "-"}</strong>
                            <div className="ssa-sub">
                              <span className={`ssa-tag ${r.beneficiaryType === "Reeler" ? "is-reeler" : ""}`}>{r.beneficiaryType}</span> <span className="ssa-mono">{r.fruitsId}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Scheme">
                        <div className="ssa-scheme" title={r.subSchemeName || r.schemeName}>{r.subSchemeName || r.schemeName}</div>
                        <div className="ssa-sub">FY {r.financialYear}</div>
                      </td>
                      <td data-label="Location">
                        <div className="ssa-loc"><Icon name="map-pin" /> <span>{r.talukName || "-"}<div className="ssa-sub">{r.districtName}</div></span></div>
                      </td>
                      <td data-label="Officer">
                        {r.assignedOfficer ? (
                          <div className="ssa-officer"><Icon name="user-check" /> {r.assignedOfficer}</div>
                        ) : (
                          <span className="ssa-unassigned"><Icon name="alert-circle" /> Not assigned</span>
                        )}
                      </td>
                      <td data-label="Submitted" className="ssa-nowrap">
                        {fmtDate(r.submittedAt)}
                        <div className="ssa-sub">{fmtTime(r.submittedAt)}</div>
                      </td>
                      <td data-label="Status"><StatusPill row={r} /></td>
                      <td className="ssa-act">
                        <button
                          type="button"
                          className={`ssa-btn ssa-btn-sm ${r.serviceFormId ? "ssa-btn-ghost" : "ssa-btn-primary"}`}
                          onClick={(e) => { e.stopPropagation(); openDetail(r); }}
                        >
                          <Icon name={r.serviceFormId ? "eye" : "arrow-right"} /> {r.serviceFormId ? "View" : "Open"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {total > pageSize && (
            <div className="ssa-pager">
              <span className="ssa-muted">Page {page + 1} of {pages}</span>
              <div>
                <button type="button" className="ssa-pg" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous page"><Icon name="chevron-left" /></button>
                <button type="button" className="ssa-pg" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)} aria-label="Next page"><Icon name="chevron-right" /></button>
              </div>
            </div>
          )}
        </section>
      </div>

      <Modal show={!!detail} onHide={() => setDetail(null)} size="lg" centered dialogClassName="ssa-modal" contentClassName="ssa-modal-content">
        <div className="ssa-mhd">
          <div className="ssa-mhd-main">
            <span className="ssa-hero-ic" aria-hidden="true"><Icon name="link" /></span>
            <div>
              <span className="ssa-eyebrow">Application received through Seva Sindhu</span>
              <h3>{detail?.beneficiary?.name || detail?.referenceNo || "Seva Sindhu application"}</h3>
              {detail && !detail.loading && (
                <div className="ssa-mhd-refs">
                  <span><Icon name="link" /> {detail.edcsApplicationRefNo} <CopyButton value={detail.edcsApplicationRefNo} className="ssa-copy is-light" withText={false} /></span>
                  <span><Icon name="file-docs" /> {detail.referenceNo} <CopyButton value={detail.referenceNo} className="ssa-copy is-light" withText={false} /></span>
                </div>
              )}
            </div>
          </div>
          <button type="button" className="ssa-close" onClick={() => setDetail(null)} aria-label="Close"><Icon name="cross" /></button>
        </div>

        <Modal.Body className="ssa-mbody">
          {detailBusy || detail?.loading ? (
            <div className="ssa-center"><Spinner size="sm" /> Loading application...</div>
          ) : detail ? (
            <>
              <dl className="ssa-infos">
                <Info icon="user-alt" label={`Applicant (${detail.beneficiary?.type || detail.beneficiaryType || "-"})`} value={detail.beneficiary?.name} />
                <Info icon="user-check" label="FRUITS ID" value={detail.fruitsId} />
                <Info icon="mobile" label="Registered mobile" value={detail.beneficiary?.mobile} />
                <Info icon="calendar" label="Submitted" value={fmt(detail.submittedAt)} />
                <Info icon="building" label="Scheme" value={detail.schemeName} wide />
                <Info icon="layers" label="Sub-scheme / component" value={`${detail.subSchemeName || ""}${detail.componentName ? ` · ${detail.componentName}` : ""}`} wide />
                <Info icon="map-pin" label="Location" value={[detail.beneficiary?.village, detail.beneficiary?.taluk, detail.beneficiary?.district].filter(Boolean).join(", ")} wide />
                <Info icon="users" label="Assigned officer" value={detail.assignedOfficer || "Not assigned (no TSC Geo Mapping for the taluk)"} />
                {detail.arn && <Info icon="check-circle" label="Normal application (ARN)" value={detail.arn} />}
              </dl>

              <div className="ssa-section">
                <h4><Icon name="files" /> Documents received through Seva Sindhu <span className="ssa-count">{(detail.documents || []).length}</span></h4>
                {(detail.documents || []).length === 0 ? (
                  <p className="ssa-muted mb-0">No documents were attached.</p>
                ) : (
                  <div className="ssc-docs-grid">
                    {detail.documents.map((d) => (
                      <button key={d.id} type="button" className="ssc-doc" onClick={() => viewDocument(d)} title={`View ${d.fileName}`}>
                        <span className={`ssc-doc-ic is-${fileKind(d.contentType)}`} aria-hidden="true"><Icon name={fileIcon(d.contentType)} /></span>
                        <span className="ssc-doc-main">
                          <strong>{d.documentTypeName || d.fileName}</strong>
                          <small>{d.documentTypeName ? `${d.fileName} · ` : ""}{size(d.size)}</small>
                        </span>
                        <span className="ssc-doc-view"><Icon name="eye" /> View</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {detail.admin && !detail.serviceFormId && (
                <div className={`ssa-section ssa-assign${detail.routingStatus === "MAPPING_MISSING" ? " is-warn" : ""}`}>
                  <h4><Icon name="users" /> {detail.assignedOfficerUserId ? "Reassign officer" : "Assign officer"}</h4>
                  <div className="ssa-assign-row">
                    <Form.Select value={officerId} onChange={(e) => setOfficerId(e.target.value)} aria-label="Officer">
                      <option value="">Select an officer of the applicant's taluk</option>
                      {officers.map((o) => <option key={o.userMasterId} value={o.userMasterId}>{o.name}</option>)}
                    </Form.Select>
                    <button type="button" className="ssa-btn ssa-btn-primary" onClick={assign} disabled={!officerId}><Icon name="check" /> Assign</button>
                  </div>
                  {detail.routingStatus === "MAPPING_MISSING" && (
                    <p className="ssa-muted mb-0 mt-2">Tip: add the taluk in TSC Geo Mapping so future applications are routed automatically.</p>
                  )}
                </div>
              )}
            </>
          ) : null}
        </Modal.Body>

        <div className="ssa-mfoot">
          <button type="button" className="ssa-btn ssa-btn-ghost" onClick={() => setDetail(null)}>Close</button>
          {detail && !detail.loading && (detail.serviceFormId || detail.canCreateApplication) && (
            <button type="button" className="ssa-btn ssa-btn-primary" onClick={() => openApplication(detail)}>
              {detail.serviceFormId ? "Open application" : "Continue in Service Application"} <Icon name="arrow-right" />
            </button>
          )}
        </div>
      </Modal>
    </Layout>
  );
}

export default SevaSindhuApplications;
