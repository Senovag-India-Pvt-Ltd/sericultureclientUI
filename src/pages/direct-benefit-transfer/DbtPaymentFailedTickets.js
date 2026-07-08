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

const EMPTY_FILTERS = {
  applicationNumber: "",
  farmerName: "",
  mobileNumber: "",
  districtId: "",
  talukId: "",
  schemeId: "",
  subSchemeId: "",
  paymentStatus: "",
  acknowledgementStatus: "",
  ticketStatus: "",
  failureType: "",
  fromDate: "",
  toDate: "",
};

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

  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });
  const [listData, setListData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0); // 0-based for the backend
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("dbtPaymentFailedTicketId");
  const [sortDir, setSortDir] = useState("desc");
  const [loading, setLoading] = useState(false);

  const [districtList, setDistrictList] = useState([]);
  const [talukList, setTalukList] = useState([]);
  const [schemeList, setSchemeList] = useState([]);
  const [subSchemeList, setSubSchemeList] = useState([]);

  createTheme(
    "solarized",
    {
      text: { primary: "#004b8e", secondary: "#2aa198" },
      background: { default: "#fff" },
      context: { background: "#cb4b16", text: "#FFFFFF" },
      divider: { default: "#d3d3d3" },
    },
    "light"
  );

  const customStyles = {
    rows: { style: { minHeight: "44px" } },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    cells: { style: { paddingLeft: "8px", paddingRight: "8px", fontSize: "13px" } },
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
    if (status === "Closed") return <span className="badge bg-secondary">Closed</span>;
    return <span className="badge bg-primary">Open</span>;
  };

  const formatDate = (value) => {
    if (!value) return "";
    try {
      return new Date(value).toLocaleDateString("en-GB");
    } catch (e) {
      return value;
    }
  };

  // ---- data loaders --------------------------------------------------

  const checkAccess = () => {
    api
      .get(baseURLDBT + `payment-failed-tickets/access-check`)
      .then((res) => {
        const isAllowed = res?.data?.content?.allowed === true;
        setAllowed(isAllowed);
        setAccessChecked(true);
        if (isAllowed) {
          getDashboard();
          getList(0, perPage, sortBy, sortDir, filters);
        }
      })
      .catch(() => {
        setAllowed(false);
        setAccessChecked(true);
      });
  };

  const getDashboard = () => {
    api
      .get(baseURLDBT + `payment-failed-tickets/dashboard-counts`)
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
      ...activeFilters,
      districtId: activeFilters.districtId || null,
      talukId: activeFilters.talukId || null,
      schemeId: activeFilters.schemeId || null,
      subSchemeId: activeFilters.subSchemeId || null,
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

  const getDistrictList = () => {
    api
      .get(baseURLMasterData + `district/get-all`)
      .then((res) => setDistrictList(res?.data?.content?.district || []))
      .catch(() => setDistrictList([]));
  };

  const getTalukList = (districtId) => {
    if (!districtId) {
      setTalukList([]);
      return;
    }
    api
      .get(baseURLMasterData + `taluk/get-by-district-id/${districtId}`)
      .then((res) => setTalukList(res?.data?.content?.taluk || []))
      .catch(() => setTalukList([]));
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

  useEffect(() => {
    checkAccess();
    getDistrictList();
    getSchemeList();
    getSubSchemeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- handlers ------------------------------------------------------

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const next = { ...filters, [name]: value };
    setFilters(next);
    if (name === "districtId") {
      next.talukId = "";
      setFilters(next);
      getTalukList(value);
    }
  };

  const search = () => {
    setPage(0);
    getList(0, perPage, sortBy, sortDir, filters);
  };

  const reset = () => {
    const cleared = { ...EMPTY_FILTERS };
    setFilters(cleared);
    setTalukList([]);
    setPage(0);
    getList(0, perPage, sortBy, sortDir, cleared);
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
        Swal.fire({
          icon: "success",
          title: "Status refreshed",
          html: `Payment Status: <b>${updated?.paymentStatus || "N/A"}</b><br/>${
            updated?.canClose ? "Payment successful — ticket can now be closed." : ""
          }`,
          timer: 2500,
        });
        getList(page, perPage, sortBy, sortDir, filters);
        getDashboard();
      })
      .catch((err) => {
        Swal.fire({ icon: "error", title: "Error", text: extractError(err) });
      });
  };

  const closeTicket = (row) => {
    Swal.fire({
      title: "Close this ticket?",
      text: `Ticket ${row.ticketArn || row.dbtPaymentFailedTicketId} will be closed.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, close it",
      confirmButtonColor: "#1e67a8",
    }).then((result) => {
      if (!result.isConfirmed) return;
      api
        .put(baseURLDBT + `payment-failed-tickets/${row.dbtPaymentFailedTicketId}/close`)
        .then(() => {
          Swal.fire({ icon: "success", title: "Ticket closed", timer: 2000 });
          getList(page, perPage, sortBy, sortDir, filters);
          getDashboard();
        })
        .catch((err) => {
          Swal.fire({ icon: "error", title: "Cannot close ticket", text: extractError(err) });
        });
    });
  };

  // ---- table columns -------------------------------------------------

  const columns = [
    {
      name: "Ticket",
      selector: (row) => row.ticketArn,
      sortable: true,
      sortField: "ticketArn",
      cell: (row) => <span>{row.ticketArn || row.ticketNumber || "-"}</span>,
      width: "150px",
    },
    {
      name: "Application No",
      selector: (row) => row.applicationNumber,
      sortable: true,
      sortField: "arn",
      cell: (row) => <span>{row.applicationNumber || "-"}</span>,
    },
    {
      name: "Farmer",
      selector: (row) => row.farmerName,
      sortable: true,
      sortField: "farmerName",
      cell: (row) => <span>{row.farmerName || "-"}</span>,
    },
    {
      name: "Scheme",
      selector: (row) => row.schemeName,
      cell: (row) => <span>{row.schemeName || "-"}</span>,
    },
    {
      name: "Sub Scheme",
      selector: (row) => row.subSchemeName,
      cell: (row) => <span>{row.subSchemeName || "-"}</span>,
    },
    {
      name: "District",
      selector: (row) => row.districtName,
      sortable: true,
      sortField: "districtName",
      cell: (row) => <span>{row.districtName || "-"}</span>,
    },
    {
      name: "Payment",
      selector: (row) => row.paymentStatus,
      cell: (row) => statusBadge(row.paymentStatus),
    },
    {
      name: "Acknowledgement",
      selector: (row) => row.acknowledgementStatus,
      cell: (row) => statusBadge(row.acknowledgementStatus),
    },
    {
      name: "Failure Reason",
      selector: (row) => row.dbtFailureReason || row.acknowledgementFailureReason,
      cell: (row) => (
        <span title={row.dbtFailureReason || row.acknowledgementFailureReason || ""}>
          {row.dbtFailureReason || row.acknowledgementFailureReason || "-"}
        </span>
      ),
      wrap: true,
    },
    {
      name: "Ticket Status",
      selector: (row) => row.ticketStatus,
      sortable: true,
      sortField: "ticketStatus",
      cell: (row) => ticketStatusBadge(row.ticketStatus),
    },
    {
      name: "Created",
      selector: (row) => row.createdDate,
      sortable: true,
      sortField: "createdDate",
      cell: (row) => <span>{formatDate(row.createdDate)}</span>,
    },
    {
      name: "Assigned",
      selector: (row) => row.createdBy,
      cell: (row) => <span>{row.assignedUser || row.createdBy || "SYSTEM"}</span>,
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
      width: "150px",
      ignoreRowClick: true,
    },
  ];

  // ---- dashboard cards ----------------------------------------------

  const cards = [
    { label: "Total Tickets", value: dashboard.totalTickets, icon: "reports", bg: "primary" },
    { label: "Open Tickets", value: dashboard.openTickets, icon: "clock", bg: "info" },
    { label: "Closed Tickets", value: dashboard.closedTickets, icon: "task", bg: "secondary" },
    { label: "Payment Failed", value: dashboard.paymentFailed, icon: "cross-circle", bg: "danger" },
    { label: "Ack Failed", value: dashboard.acknowledgementFailed, icon: "alert-circle", bg: "warning" },
    { label: "Today's Tickets", value: dashboard.todaysTickets, icon: "bell", bg: "success" },
  ];

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
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">DBT Payment Failed Tickets</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Failed Payment Monitoring
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      {/* Dashboard cards */}
      <Block>
        <Row className="g-3">
          {cards.map((c) => (
            <Col sm="6" md="4" xl="2" key={c.label}>
              <Card className="h-100">
                <Card.Body className="d-flex align-items-center">
                  <div
                    className={`d-flex align-items-center justify-content-center rounded bg-${c.bg} text-white me-3`}
                    style={{ width: "44px", height: "44px", flex: "0 0 44px" }}
                  >
                    <Icon name={c.icon} />
                  </div>
                  <div>
                    <div className="fs-4 fw-bold lh-1">{c.value}</div>
                    <div className="text-muted small">{c.label}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Block>

      {/* Filter section */}
      <Block className="mt-3">
        <Card>
          <Card.Body>
            <Row className="g-3">
              <Col md="3">
                <Form.Label>Application Number</Form.Label>
                <Form.Control
                  name="applicationNumber"
                  value={filters.applicationNumber}
                  onChange={handleFilterChange}
                  placeholder="Application No"
                />
              </Col>
              <Col md="3">
                <Form.Label>Farmer Name</Form.Label>
                <Form.Control
                  name="farmerName"
                  value={filters.farmerName}
                  onChange={handleFilterChange}
                  placeholder="Farmer name"
                />
              </Col>
              <Col md="3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  name="mobileNumber"
                  value={filters.mobileNumber}
                  onChange={handleFilterChange}
                  placeholder="Mobile"
                />
              </Col>
              <Col md="3">
                <Form.Label>District</Form.Label>
                <Form.Select name="districtId" value={filters.districtId} onChange={handleFilterChange}>
                  <option value="">All</option>
                  {districtList.map((d) => (
                    <option key={d.districtId} value={d.districtId}>
                      {d.districtName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md="3">
                <Form.Label>Taluk</Form.Label>
                <Form.Select name="talukId" value={filters.talukId} onChange={handleFilterChange}>
                  <option value="">All</option>
                  {talukList.map((t) => (
                    <option key={t.talukId} value={t.talukId}>
                      {t.talukName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md="3">
                <Form.Label>Scheme</Form.Label>
                <Form.Select name="schemeId" value={filters.schemeId} onChange={handleFilterChange}>
                  <option value="">All</option>
                  {schemeList.map((s) => (
                    <option key={s.scSchemeDetailsId} value={s.scSchemeDetailsId}>
                      {s.schemeName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md="3">
                <Form.Label>Sub Scheme</Form.Label>
                <Form.Select name="subSchemeId" value={filters.subSchemeId} onChange={handleFilterChange}>
                  <option value="">All</option>
                  {subSchemeList.map((s) => (
                    <option key={s.scSubSchemeDetailsId} value={s.scSubSchemeDetailsId}>
                      {s.subSchemeName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md="3">
                <Form.Label>Failure Type</Form.Label>
                <Form.Select name="failureType" value={filters.failureType} onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="PAYMENT_FAILED">Payment Failed</option>
                  <option value="ACKNOWLEDGEMENT_FAILED">Acknowledgement Failed</option>
                </Form.Select>
              </Col>
              <Col md="3">
                <Form.Label>Ticket Status</Form.Label>
                <Form.Select name="ticketStatus" value={filters.ticketStatus} onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </Form.Select>
              </Col>
              <Col md="3">
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col md="3">
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col md="3" className="d-flex align-items-end gap-2">
                <Button variant="primary" onClick={search}>
                  <Icon name="search" className="me-1" />
                  Search
                </Button>
                <Button variant="outline-secondary" onClick={reset}>
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
        <Card>
          <DataTable
            columns={columns}
            data={listData}
            progressPending={loading}
            progressComponent={
              <div className="py-4">
                <Spinner animation="border" variant="primary" /> <span className="ms-2">Loading...</span>
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
            responsive
            theme="solarized"
            customStyles={customStyles}
            noDataComponent={
              <div className="text-center py-5">
                <Icon name="inbox" style={{ fontSize: "40px" }} className="text-muted mb-2" />
                <p className="text-muted mb-0">No payment-failed tickets found.</p>
              </div>
            }
          />
        </Card>
      </Block>
    </Layout>
  );
}

export default DbtPaymentFailedTickets;
