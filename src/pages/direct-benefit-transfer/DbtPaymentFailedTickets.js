import { Card, Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import DataTable, { createTheme } from "react-data-table-component";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import api from "../../services/auth/api";

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const CANNOT_CLOSE_MSG =
  "This ticket cannot be closed yet. It will become eligible to close automatically once the " +
  "DBT payment status changes to 'Payment Success in DBT'.";

// Builds a precise message naming the application's exact current status, so the user knows
// whether it's still failing or just hasn't reached the final "Payment Success in DBT" step yet.
const buildCannotCloseMessage = (latest) => {
  const current = latest?.paymentStatus || latest?.acknowledgementStatus || "Unknown";
  return (
    `This ticket cannot be closed yet. The application's current status is <b>${current}</b>. ` +
    `It will become eligible to close automatically once the DBT payment status changes to ` +
    `<b>Payment Success in DBT</b>.`
  );
};

// Consistently-styled popups so overlays match the beautified page.
const SwalStyled = Swal.mixin({ customClass: { popup: "dpft-swal" } });

const dpftStyles = `
.dpft-hero{background:linear-gradient(120deg,#0d3b66 0%,#1a63a6 52%,#2f9bd8 100%);border-radius:18px;padding:22px 26px;color:#fff;box-shadow:0 12px 30px rgba(13,59,102,.22);position:relative;overflow:hidden;}
.dpft-hero:after{content:"";position:absolute;right:-50px;top:-50px;width:190px;height:190px;background:rgba(255,255,255,.08);border-radius:50%;}
.dpft-hero-row{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;position:relative;z-index:1;}
.dpft-hero-eyebrow{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;opacity:.85;display:flex;align-items:center;}
.dpft-hero-title{font-size:24px;font-weight:800;margin:5px 0 6px;color:#fff;}
.dpft-hero-crumb .breadcrumb-item,.dpft-hero-crumb a{color:rgba(255,255,255,.85)!important;font-size:13px;text-decoration:none;}
.dpft-hero-crumb .breadcrumb-item.active{color:#fff!important;}
.dpft-hero-fy{background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);color:#fff;padding:8px 16px;border-radius:30px;font-weight:600;font-size:13px;white-space:nowrap;display:inline-flex;align-items:center;}
.dpft-kpi{border:none!important;border-radius:16px!important;box-shadow:0 4px 18px rgba(20,40,80,.07)!important;transition:transform .18s ease,box-shadow .18s ease;}
.dpft-kpi:hover{transform:translateY(-4px);box-shadow:0 16px 32px rgba(20,40,80,.14)!important;}
.dpft-kpi-clickable{cursor:pointer;}
.dpft-kpi-clickable:hover{transform:translateY(-4px);}
.dpft-kpi-active{box-shadow:0 0 0 3px rgba(13,59,102,.32),0 12px 26px rgba(20,40,80,.16)!important;}
.dpft-kpi-icon{width:52px;height:52px;flex:0 0 52px;border-radius:14px;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 6px 14px rgba(0,0,0,.14);}
.dpft-kpi-val{font-size:26px;font-weight:800;line-height:1;color:#1f2d3d;}
.dpft-kpi-lbl{font-size:12.5px;color:#7b899c;font-weight:600;margin-top:3px;}
.dpft-card{border:none!important;border-radius:16px!important;box-shadow:0 4px 20px rgba(20,40,80,.06)!important;overflow:hidden;}
.dpft-card>.card-header{background:#fff!important;border-bottom:1px solid #eef2f7!important;padding:15px 20px;font-weight:700;color:#1f2d3d;display:flex;align-items:center;}
.dpft-chip{width:30px;height:30px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;color:#fff;margin-right:10px;background:linear-gradient(135deg,#0d3b66,#2f9bd8);}
.dpft-card .form-label{color:#5b6b7f;}
.dpft-card .form-control,.dpft-card .form-select{border-radius:10px;border-color:#e2e8f2;padding:9px 12px;}
.dpft-card .form-control:focus,.dpft-card .form-select:focus{border-color:#2f80ed;box-shadow:0 0 0 3px rgba(47,128,237,.12);}
.dpft-swal.swal2-popup{border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.22);}
`;

// Open tickets need attention first, so the page opens on "Open" by default rather than
// showing already-resolved Closed tickets mixed in. "All" / "Closed" are one click away.
// financialYearId starts blank and is filled in once the real default financial year loads
// (see the effect that fetches financialYearMaster/get-is-default).
const defaultFilters = () => ({
  applicationNumber: "",
  mobileNumber: "",
  fruitsId: "",
  schemeId: "",
  subSchemeId: "",
  failureType: "",
  ticketStatus: "Open",
  financialYearId: "",
  fromDate: "",
  toDate: "",
});

function DbtPaymentFailedTickets() {
  const navigate = useNavigate();

  const [accessChecked, setAccessChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  const [dashboard, setDashboard] = useState({
    totalTickets: 0,
    openTickets: 0,
    closedTickets: 0,
    paymentFailed: 0,
    acknowledgementFailed: 0,
    todaysTickets: 0,
  });

  const [filters, setFilters] = useState(defaultFilters());
  const [listData, setListData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0); // 0-based for the backend
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("modifiedDate");
  const [sortDir, setSortDir] = useState("desc");
  const [loading, setLoading] = useState(false);

  const [schemeList, setSchemeList] = useState([]);
  const [subSchemeList, setSubSchemeList] = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [defaultFinancialYearId, setDefaultFinancialYearId] = useState("");

  createTheme(
    "seriTheme",
    {
      text: { primary: "#1f2d3d", secondary: "#5b6b7f" },
      background: { default: "#fff" },
      context: { background: "#cb4b16", text: "#FFFFFF" },
      divider: { default: "#eaeef3" },
      highlightOnHover: { default: "#f3f7fb", text: "#1f2d3d" },
    },
    "light"
  );

  const customStyles = {
    table: { style: { borderRadius: "10px", overflow: "hidden" } },
    rows: { style: { minHeight: "48px", fontSize: "13px" } },
    headCells: {
      style: {
        backgroundColor: "#0d3b66",
        color: "#fff",
        fontSize: "12px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.3px",
        paddingLeft: "10px",
        paddingRight: "10px",
      },
    },
    cells: { style: { paddingLeft: "10px", paddingRight: "10px" } },
    pagination: { style: { borderTop: "1px solid #eaeef3" } },
  };

  // ---- helpers -------------------------------------------------------

  const extractError = (err) => {
    try {
      return err.response.data.errorMessages[0].message[0].message;
    } catch (e) {
      /* ignore */
    }
    try {
      return err.response.data.extra.message;
    } catch (e) {
      /* ignore */
    }
    return "Something went wrong. Please try again.";
  };

  const statusBadge = (status) => {
    if (!status) return <span className="badge bg-secondary">N/A</span>;
    const s = String(status).toUpperCase();
    if (s.includes("SUCCESS")) return <span className="badge bg-success">{status}</span>;
    if (s.includes("FAIL") || s.includes("REJECT"))
      return <span className="badge bg-danger">{status}</span>;
    if (s.includes("PENDING") || s.includes("PROGRESS") || s.includes("PUSHED") || s.includes("READY"))
      return <span className="badge bg-warning text-dark">{status}</span>;
    return <span className="badge bg-info">{status}</span>;
  };

  const ticketStatusBadge = (status) => {
    if (status === "Closed")
      return (
        <span className="badge rounded-pill bg-secondary">
          <Icon name="check-circle" className="me-1" />
          Closed
        </span>
      );
    return (
      <span className="badge rounded-pill bg-primary">
        <Icon name="clock" className="me-1" />
        Open
      </span>
    );
  };

  const failureTypeBadge = (type) => {
    if (type === "ACKNOWLEDGEMENT_FAILED")
      return <span className="badge bg-warning text-dark">Acknowledgement</span>;
    if (type === "PAYMENT_FAILED") return <span className="badge bg-danger">Payment</span>;
    return <span className="badge bg-secondary">-</span>;
  };

  const formatDate = (value) => {
    if (!value) return "";
    try {
      return new Date(value).toLocaleDateString("en-GB");
    } catch (e) {
      return value;
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return value;
    }
  };

  // ---- data loaders --------------------------------------------------

  // activeFilters is passed explicitly (rather than relying on the `filters` closure) so the
  // very first load can use the just-resolved default financial year without a race condition.
  const checkAccess = (activeFilters) => {
    api
      .get(baseURLDBT + `payment-failed-tickets/access-check`)
      .then((res) => {
        const isAllowed = res?.data?.content?.allowed === true;
        setAllowed(isAllowed);
        setAccessChecked(true);
        if (isAllowed) {
          getDashboard(activeFilters.financialYearId);
          getList(0, perPage, sortBy, sortDir, activeFilters);
        }
      })
      .catch(() => {
        setAllowed(false);
        setAccessChecked(true);
      });
  };

  const getDashboard = (financialYearId) => {
    api
      .get(baseURLDBT + `payment-failed-tickets/dashboard-counts`, {
        params: { financialYearId: financialYearId || null },
      })
      .then((res) => {
        if (res?.data?.content) setDashboard(res.data.content);
      })
      .catch(() => {
        /* keep zeros */
      });
  };

  const getList = (
    pageNumber = page,
    size = perPage,
    sortField = sortBy,
    sortDirection = sortDir,
    activeFilters = filters
  ) => {
    setLoading(true);
    const body = {
      applicationNumber: activeFilters.applicationNumber || null,
      mobileNumber: activeFilters.mobileNumber || null,
      fruitsId: activeFilters.fruitsId || null,
      schemeId: activeFilters.schemeId || null,
      subSchemeId: activeFilters.subSchemeId || null,
      failureType: activeFilters.failureType || null,
      ticketStatus: activeFilters.ticketStatus || null,
      financialYearId: activeFilters.financialYearId || null,
      fromDate: activeFilters.fromDate || null,
      toDate: activeFilters.toDate || null,
      pageNumber,
      size,
      sortBy: sortField,
      sortDir: sortDirection,
    };
    api
      .post(baseURLDBT + `payment-failed-tickets/filter`, body)
      .then((res) => {
        const content = res?.data?.content || {};
        setListData(content.paymentFailedTickets || []);
        setTotalRows(content.totalItems || 0);
        setLoading(false);
      })
      .catch(() => {
        setListData([]);
        setTotalRows(0);
        setLoading(false);
      });
  };

  const getSchemeList = () => {
    api
      .get(baseURLMasterData + `scSchemeDetails/get-all`)
      .then((res) => setSchemeList(res?.data?.content?.ScSchemeDetails || []))
      .catch(() => setSchemeList([]));
  };

  const getSubSchemeList = () => {
    api
      .get(baseURLMasterData + `scSubSchemeDetails/get-all`)
      .then((res) => setSubSchemeList(res?.data?.content?.scSubSchemeDetails || []))
      .catch(() => setSubSchemeList([]));
  };

  const getFinancialYearList = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-all`)
      .then((res) => setFinancialYearList(res?.data?.content?.financialYearMaster || []))
      .catch(() => setFinancialYearList([]));
  };

  useEffect(() => {
    getSchemeList();
    getSubSchemeList();
    getFinancialYearList();

    // Resolve the real default financial year FIRST, then load the page scoped to it — so the
    // page opens on "this year's" tickets based on sc_application_form, not all-time data.
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((res) => {
        const id = res?.data?.content?.financialYearMasterId || "";
        setDefaultFinancialYearId(id);
        const initial = { ...defaultFilters(), financialYearId: id };
        setFilters(initial);
        checkAccess(initial);
      })
      .catch(() => {
        checkAccess(defaultFilters());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- handlers ------------------------------------------------------

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const search = () => {
    setPage(0);
    getList(0, perPage, sortBy, sortDir, filters);
    getDashboard(filters.financialYearId);
  };

  // Resets back to the real default financial year (not "All Years") so the page returns to
  // the same "current year, needs attention" view it opened on.
  const reset = () => {
    const cleared = { ...defaultFilters(), financialYearId: defaultFinancialYearId };
    setFilters(cleared);
    setPage(0);
    getList(0, perPage, sortBy, sortDir, cleared);
    getDashboard(cleared.financialYearId);
  };

  const handlePageChange = (newPage) => {
    const zeroBased = newPage - 1;
    setPage(zeroBased);
    getList(zeroBased, perPage, sortBy, sortDir, filters);
  };

  const handlePerRowsChange = (newPerPage, newPage) => {
    setPerPage(newPerPage);
    const zeroBased = newPage - 1;
    setPage(zeroBased);
    getList(zeroBased, newPerPage, sortBy, sortDir, filters);
  };

  const handleSort = (column, direction) => {
    const field = column?.sortField || "dbtPaymentFailedTicketId";
    setSortBy(field);
    setSortDir(direction);
    getList(page, perPage, field, direction, filters);
  };

  const viewTicket = (row) => {
    navigate(`/seriui/dbt-payment-failed-tickets/${row.dbtPaymentFailedTicketId}`);
  };

  const refreshStatus = (row) => {
    api
      .get(baseURLDBT + `payment-failed-tickets/${row.dbtPaymentFailedTicketId}/refresh-status`)
      .then((res) => {
        const updated = res?.data?.content;
        SwalStyled.fire({
          icon: "success",
          title: "Status refreshed",
          html: `Payment Status: <b>${updated?.paymentStatus || "N/A"}</b><br/>${
            updated?.canClose ? "Payment successful — ticket can now be closed." : ""
          }`,
          timer: 2500,
        });
        getList(page, perPage, sortBy, sortDir, filters);
        getDashboard(filters.financialYearId);
      })
      .catch((err) => {
        SwalStyled.fire({ icon: "error", title: "Error", text: extractError(err) });
      });
  };

  // Beautiful "cannot close" popup that highlights the failure remark in bold.
  const cannotCloseSwal = (remarks, message = CANNOT_CLOSE_MSG) => {
    SwalStyled.fire({
      icon: "error",
      title: "Cannot close ticket",
      html: `
        <div style="text-align:left;color:#5b6b7f;font-size:13.5px;line-height:1.65;margin-top:2px">
          ${message}
          ${
            remarks
              ? `<div style="margin-top:15px;background:linear-gradient(135deg,#fff0f0,#ffe3e3);border:1px solid #ffc9c9;border-left:5px solid #e03131;border-radius:13px;padding:13px 15px">
                   <div style="font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#c92a2a;margin-bottom:5px">⚠️ Reason / Remarks</div>
                   <div style="font-weight:800;color:#b02020;font-size:15.5px;line-height:1.4">${remarks}</div>
                 </div>`
              : ""
          }
        </div>`,
      confirmButtonColor: "#e03131",
      confirmButtonText: "OK",
    });
  };

  // Validate the LATEST DBT payment status before closing. If the payment is
  // still in Failure status the ticket stays Open and the user sees the
  // mandated message — the UI is never marked as "Ticket Closed".
  const closeTicket = (row) => {
    SwalStyled.fire({
      title: "Close this ticket?",
      text: `Ticket ${row.ticketArn || row.dbtPaymentFailedTicketId} will be validated and closed.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Validate & Close",
      confirmButtonColor: "#0d3b66",
    }).then((result) => {
      if (!result.isConfirmed) return;
      SwalStyled.fire({ title: "Validating latest DBT payment status...", allowOutsideClick: false });
      Swal.showLoading();
      api
        .get(baseURLDBT + `payment-failed-tickets/${row.dbtPaymentFailedTicketId}/refresh-status`)
        .then((res) => {
          const latest = res?.data?.content;
          if (!latest?.canClose) {
            // Not yet at "Payment Success in DBT" → keep Open, show the exact current status,
            // reflect latest status in the list/dashboard.
            getList(page, perPage, sortBy, sortDir, filters);
            getDashboard(filters.financialYearId);
            cannotCloseSwal(latest?.remarks, buildCannotCloseMessage(latest));
            return;
          }
          api
            .put(baseURLDBT + `payment-failed-tickets/${row.dbtPaymentFailedTicketId}/close`)
            .then(() => {
              SwalStyled.fire({ icon: "success", title: "Ticket closed", timer: 2000 });
              getList(page, perPage, sortBy, sortDir, filters);
              getDashboard(filters.financialYearId);
            })
            .catch((err) => {
              const msg = extractError(err);
              cannotCloseSwal(latest?.remarks, /success/i.test(msg) ? buildCannotCloseMessage(latest) : msg);
            });
        })
        .catch((err) => {
          SwalStyled.fire({ icon: "error", title: "Error", text: extractError(err) });
        });
    });
  };

  // ---- table columns -------------------------------------------------

  const columns = [
    {
      name: "Ticket ARN",
      selector: (row) => row.ticketArn,
      sortable: true,
      sortField: "ticketArn",
      cell: (row) => (
        <span className="fw-semibold text-primary" role="button" onClick={() => viewTicket(row)}>
          {row.ticketArn || row.ticketNumber || "-"}
        </span>
      ),
      width: "160px",
    },
    {
      name: "Application No",
      selector: (row) => row.applicationNumber,
      sortable: true,
      sortField: "arn",
      cell: (row) => <span>{row.applicationNumber || "-"}</span>,
      width: "150px",
    },
    {
      name: "FRUITS ID",
      selector: (row) => row.fruitsId,
      cell: (row) => <span>{row.fruitsId || "-"}</span>,
      width: "130px",
    },
    {
      name: "Farmer / Reeler",
      selector: (row) => row.farmerName,
      sortable: true,
      sortField: "farmerName",
      cell: (row) => (
        <div>
          <div className="fw-medium">{row.farmerName || "-"}</div>
          <div className="text-muted small d-flex align-items-center gap-1">
            {row.beneficiaryType ? (
              <span className="badge bg-light text-dark border">{row.beneficiaryType}</span>
            ) : null}
            {row.mobileNumber ? <span>{row.mobileNumber}</span> : null}
          </div>
        </div>
      ),
      minWidth: "180px",
    },
    {
      name: "Scheme",
      selector: (row) => row.schemeName,
      cell: (row) => (
        <div>
          <div>{row.schemeName || "-"}</div>
          {row.subSchemeName ? <div className="text-muted small">{row.subSchemeName}</div> : null}
        </div>
      ),
      minWidth: "170px",
    },
    {
      name: "Type",
      selector: (row) => row.failureType,
      cell: (row) => failureTypeBadge(row.failureType),
      width: "140px",
    },
    {
      name: "Payment Status",
      selector: (row) => row.paymentStatus,
      cell: (row) => statusBadge(row.paymentStatus),
      minWidth: "150px",
    },
    {
      name: "Acknowledgement",
      selector: (row) => row.acknowledgementStatus,
      cell: (row) => statusBadge(row.acknowledgementStatus),
      minWidth: "150px",
    },
    {
      name: "Ticket Status",
      selector: (row) => row.ticketStatus,
      sortable: true,
      sortField: "ticketStatus",
      cell: (row) => ticketStatusBadge(row.ticketStatus),
      width: "130px",
    },
    {
      name: "Created By",
      selector: (row) => row.applicationCreatedByName || row.applicationCreatedBy,
      cell: (row) => (
        <div>
          <div className="fw-medium">
            {row.applicationCreatedByName || row.applicationCreatedBy || "-"}
          </div>
          {row.applicationCreatedByMobile ? (
            <a
              className="text-decoration-none small"
              href={`tel:${row.applicationCreatedByMobile}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name="call" className="me-1" style={{ fontSize: "11px" }} />
              {row.applicationCreatedByMobile}
            </a>
          ) : (
            <span className="text-muted small">No mobile on record</span>
          )}
        </div>
      ),
      minWidth: "170px",
    },
    {
      name: "Created",
      selector: (row) => row.createdDate,
      sortable: true,
      sortField: "createdDate",
      cell: (row) => <span>{formatDate(row.createdDate)}</span>,
      width: "110px",
    },
    {
      name: "Last Updated",
      selector: (row) => row.modifiedDate,
      sortable: true,
      sortField: "modifiedDate",
      cell: (row) => (
        <span className="text-nowrap" style={{ fontSize: "12px" }}>
          {formatDateTime(row.modifiedDate || row.createdDate)}
        </span>
      ),
      minWidth: "150px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-1">
          <Button size="sm" variant="outline-primary" title="View" onClick={() => viewTicket(row)}>
            <Icon name="eye" />
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            title="Refresh payment status"
            onClick={() => refreshStatus(row)}
          >
            <Icon name="reload" />
          </Button>
          {row.ticketStatus !== "Closed" && (
            <Button
              size="sm"
              variant="outline-danger"
              title="Close ticket"
              onClick={() => closeTicket(row)}
            >
              <Icon name="cross-circle" />
            </Button>
          )}
        </div>
      ),
      width: "140px",
      ignoreRowClick: true,
    },
  ];

  // ---- dashboard cards ----------------------------------------------

  // Total / Open / Closed double as one-click quick filters for ticketStatus — the fastest way
  // to jump between "needs attention" (Open) and "already resolved" (Closed) without opening
  // the full filter panel.
  const cards = [
    { label: "Total Tickets", value: dashboard.totalTickets, icon: "reports", grad: "linear-gradient(135deg,#0d3b66,#1d6fb8)", accent: "#0d3b66", filterValue: "" },
    { label: "Open Tickets", value: dashboard.openTickets, icon: "clock", grad: "linear-gradient(135deg,#2f80ed,#56ccf2)", accent: "#2f80ed", filterValue: "Open" },
    { label: "Closed Tickets", value: dashboard.closedTickets, icon: "check-circle", grad: "linear-gradient(135deg,#5b6b7f,#93a3b8)", accent: "#6b7a90", filterValue: "Closed" },
    { label: "Payment Failed", value: dashboard.paymentFailed, icon: "cross-circle", grad: "linear-gradient(135deg,#e2445c,#ff7a90)", accent: "#e2445c" },
    { label: "Ack Failed", value: dashboard.acknowledgementFailed, icon: "alert-circle", grad: "linear-gradient(135deg,#f2994a,#f9c66b)", accent: "#f2994a" },
    { label: "Today's Tickets", value: dashboard.todaysTickets, icon: "bell", grad: "linear-gradient(135deg,#1e9e6a,#4bd6a0)", accent: "#1e9e6a" },
  ];

  const applyQuickFilter = (ticketStatus) => {
    const next = { ...filters, ticketStatus };
    setFilters(next);
    setPage(0);
    getList(0, perPage, sortBy, sortDir, next);
  };

  // ---- render --------------------------------------------------------

  if (accessChecked && !allowed) {
    return (
      <Layout title="DBT Payment Failed Tickets">
        <Block className="mt-3">
          <Card>
            <Card.Body className="text-center py-5">
              <Icon name="shield-off" style={{ fontSize: "48px" }} className="text-danger mb-3" />
              <h4>Access Denied</h4>
              <p className="text-muted">
                You are not authorized to view DBT Payment Failed Tickets. Please contact the
                administrator if you believe this is an error.
              </p>
              <Link to="/seriui/" className="btn btn-primary">
                Back to Home
              </Link>
            </Card.Body>
          </Card>
        </Block>
      </Layout>
    );
  }

  return (
    <Layout title="DBT Payment Failed Tickets">
      <style>{dpftStyles}</style>

      <Block className="mt-2 pt-5">
        <div className="dpft-hero">
          <div className="dpft-hero-row">
            <div>
              <div className="dpft-hero-eyebrow">
                <Icon name="shield-check" className="me-1" /> Failed Payment Monitoring
              </div>
              <div className="dpft-hero-title">DBT Payment Failed Tickets</div>
              <nav>
                <ol className="breadcrumb breadcrumb-arrow mb-0 dpft-hero-crumb">
                  <li className="breadcrumb-item">
                    <Link to="/seriui/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Failed Payment Monitoring
                  </li>
                </ol>
              </nav>
            </div>
            <span className="dpft-hero-fy">
              <Icon name="calendar" className="me-1" />
              {filters.financialYearId
                ? `FY ${
                    financialYearList.find(
                      (fy) => String(fy.financialYearMasterId) === String(filters.financialYearId)
                    )?.financialYear || ""
                  }`
                : "All Financial Years"}
            </span>
          </div>
        </div>
      </Block>

      {/* Dashboard cards — Total / Open / Closed are clickable quick filters */}
      <Block className="mt-3">
        <Row className="g-3">
          {cards.map((c) => {
            const isQuickFilter = c.filterValue !== undefined;
            const isActive = isQuickFilter && filters.ticketStatus === c.filterValue;
            return (
              <Col sm="6" md="4" xl="2" key={c.label}>
                <Card
                  className={`dpft-kpi h-100${isQuickFilter ? " dpft-kpi-clickable" : ""}${isActive ? " dpft-kpi-active" : ""}`}
                  onClick={isQuickFilter ? () => applyQuickFilter(c.filterValue) : undefined}
                  title={isQuickFilter ? `Show ${c.label.toLowerCase()}` : undefined}
                >
                  <Card.Body className="d-flex align-items-center">
                    <div className="dpft-kpi-icon me-3" style={{ background: c.grad }}>
                      <Icon name={c.icon} style={{ fontSize: "22px" }} />
                    </div>
                    <div>
                      <div className="dpft-kpi-val">{c.value}</div>
                      <div className="dpft-kpi-lbl">{c.label}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Block>

      {/* Filter section */}
      <Block className="mt-3">
        <Card className="dpft-card">
          <Card.Header>
            <span className="dpft-chip">
              <Icon name="filter" />
            </span>
            <span>Filters</span>
            <span className="text-muted small fw-normal ms-2">
              — showing Open tickets by default; use Ticket Status below (or the cards above) to view Closed or All
            </span>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col sm="6" lg="3">
                <Form.Label className="small fw-semibold">Financial Year</Form.Label>
                <Form.Select
                  name="financialYearId"
                  value={filters.financialYearId}
                  onChange={handleFilterChange}
                >
                  <option value="">All Years</option>
                  {financialYearList.map((fy) => (
                    <option key={fy.financialYearMasterId} value={fy.financialYearMasterId}>
                      {fy.financialYear}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col sm="6" lg="3">
                <Form.Label className="small fw-semibold">Scheme</Form.Label>
                <Form.Select name="schemeId" value={filters.schemeId} onChange={handleFilterChange}>
                  <option value="">All</option>
                  {schemeList.map((s) => (
                    <option key={s.scSchemeDetailsId} value={s.scSchemeDetailsId}>
                      {s.schemeName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col sm="6" lg="3">
                <Form.Label className="small fw-semibold">Sub Scheme</Form.Label>
                <Form.Select name="subSchemeId" value={filters.subSchemeId} onChange={handleFilterChange}>
                  <option value="">All</option>
                  {subSchemeList.map((s) => (
                    <option key={s.scSubSchemeDetailsId} value={s.scSubSchemeDetailsId}>
                      {s.subSchemeName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col sm="6" lg="3">
                <Form.Label className="small fw-semibold">Failure Type</Form.Label>
                <Form.Select name="failureType" value={filters.failureType} onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="PAYMENT_FAILED">Payment Failed</option>
                  <option value="ACKNOWLEDGEMENT_FAILED">Acknowledgement Failed</option>
                </Form.Select>
              </Col>
              <Col sm="6" lg="3">
                <Form.Label className="small fw-semibold">Ticket Status</Form.Label>
                <Form.Select name="ticketStatus" value={filters.ticketStatus} onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </Form.Select>
              </Col>
              <Col sm="6" lg="3">
                <Form.Label className="small fw-semibold">FRUITS ID</Form.Label>
                <Form.Control
                  name="fruitsId"
                  value={filters.fruitsId}
                  onChange={handleFilterChange}
                  placeholder="FRUITS ID"
                />
              </Col>
              <Col sm="6" lg="3">
                <Form.Label className="small fw-semibold">ARN Number</Form.Label>
                <Form.Control
                  name="applicationNumber"
                  value={filters.applicationNumber}
                  onChange={handleFilterChange}
                  placeholder="Application / ARN No"
                />
              </Col>
              <Col sm="6" lg="3">
                <Form.Label className="small fw-semibold">Mobile Number</Form.Label>
                <Form.Control
                  name="mobileNumber"
                  value={filters.mobileNumber}
                  onChange={handleFilterChange}
                  placeholder="Mobile"
                />
              </Col>
              <Col sm="6" lg="3">
                <Form.Label className="small fw-semibold">From Date</Form.Label>
                <Form.Control
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col sm="6" lg="3">
                <Form.Label className="small fw-semibold">To Date</Form.Label>
                <Form.Control
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col lg="6" className="d-flex align-items-end gap-2">
                <Button variant="primary" onClick={search} disabled={loading}>
                  <Icon name="search" className="me-1" />
                  Search
                </Button>
                <Button variant="outline-secondary" onClick={reset} disabled={loading}>
                  <Icon name="reload" className="me-1" />
                  Reset
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>

      {/* Data table */}
      <Block className="mt-3">
        <Card className="dpft-card">
          <Card.Header className="justify-content-between">
            <span className="d-flex align-items-center">
              <span className="dpft-chip">
                <Icon name="list" />
              </span>
              Tickets
            </span>
            <span className="text-muted small fw-normal">{totalRows} record(s)</span>
          </Card.Header>
          <DataTable
            columns={columns}
            data={listData}
            progressPending={loading}
            progressComponent={
              <div className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <div className="text-muted mt-2">Loading tickets...</div>
              </div>
            }
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            sortServer
            onSort={handleSort}
            highlightOnHover
            pointerOnHover
            responsive
            theme="seriTheme"
            customStyles={customStyles}
            noDataComponent={
              <div className="text-center py-5">
                <Icon name="inbox" style={{ fontSize: "44px" }} className="text-muted mb-2" />
                <p className="text-muted mb-0">No payment-failed tickets found for the selected filters.</p>
              </div>
            }
          />
        </Card>
      </Block>
    </Layout>
  );
}

export default DbtPaymentFailedTickets;
