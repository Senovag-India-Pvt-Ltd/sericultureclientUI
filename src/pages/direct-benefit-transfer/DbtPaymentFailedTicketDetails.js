import { Card, Button, Row, Col, Spinner, Badge } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import api from "../../services/auth/api";

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function DbtPaymentFailedTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

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
    if (!status) return <Badge bg="secondary">N/A</Badge>;
    const s = String(status).toUpperCase();
    if (s.includes("SUCCESS")) return <Badge bg="success">{status}</Badge>;
    if (s.includes("FAIL") || s.includes("REJECT")) return <Badge bg="danger">{status}</Badge>;
    if (s.includes("PENDING") || s.includes("PROGRESS") || s.includes("PUSHED") || s.includes("READY"))
      return (
        <Badge bg="warning" text="dark">
          {status}
        </Badge>
      );
    return <Badge bg="info">{status}</Badge>;
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleString("en-GB");
    } catch (e) {
      return value;
    }
  };

  const loadTicket = () => {
    setLoading(true);
    api
      .get(baseURLDBT + `payment-failed-tickets/${id}`)
      .then((res) => {
        setTicket(res?.data?.content || null);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.status === 403) {
          setForbidden(true);
        } else {
          Swal.fire({ icon: "error", title: "Error", text: extractError(err) });
        }
      });
  };

  useEffect(() => {
    loadTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const refreshStatus = () => {
    api
      .get(baseURLDBT + `payment-failed-tickets/${id}/refresh-status`)
      .then((res) => {
        const updated = res?.data?.content;
        setTicket((prev) => ({ ...prev, ...updated }));
        Swal.fire({
          icon: "success",
          title: "Status refreshed",
          html: `Payment Status: <b>${updated?.paymentStatus || "N/A"}</b><br/>${
            updated?.canClose ? "Payment successful — ticket can now be closed." : ""
          }`,
          timer: 2500,
        });
      })
      .catch((err) => Swal.fire({ icon: "error", title: "Error", text: extractError(err) }));
  };

  const closeTicket = () => {
    Swal.fire({
      title: "Close this ticket?",
      text: `Ticket ${ticket?.ticketArn || id} will be closed.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, close it",
      confirmButtonColor: "#1e67a8",
    }).then((result) => {
      if (!result.isConfirmed) return;
      api
        .put(baseURLDBT + `payment-failed-tickets/${id}/close`)
        .then(() => {
          Swal.fire({ icon: "success", title: "Ticket closed", timer: 2000 });
          loadTicket();
        })
        .catch((err) =>
          Swal.fire({ icon: "error", title: "Cannot close ticket", text: extractError(err) })
        );
    });
  };

  const Field = ({ label, value }) => (
    <Col md="4" className="mb-3">
      <div className="text-muted small">{label}</div>
      <div className="fw-medium">{value || value === 0 ? value : "-"}</div>
    </Col>
  );

  const Section = ({ title, icon, children }) => (
    <Card className="mb-3">
      <Card.Header className="d-flex align-items-center">
        <Icon name={icon} className="me-2 text-primary" />
        <span className="fw-bold">{title}</span>
      </Card.Header>
      <Card.Body>
        <Row>{children}</Row>
      </Card.Body>
    </Card>
  );

  if (forbidden) {
    return (
      <Layout title="Ticket Details">
        <Block className="mt-3">
          <Card>
            <Card.Body className="text-center py-5">
              <Icon name="shield-off" style={{ fontSize: "48px" }} className="text-danger mb-3" />
              <h4>Access Denied</h4>
              <p className="text-muted">You are not authorized to view this ticket.</p>
              <Link to="/seriui/dbt-payment-failed-tickets" className="btn btn-primary">
                Back to List
              </Link>
            </Card.Body>
          </Card>
        </Block>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout title="Ticket Details">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout title="Ticket Details">
        <Block className="mt-3">
          <Card>
            <Card.Body className="text-center py-5">
              <p className="text-muted mb-3">Ticket not found.</p>
              <Link to="/seriui/dbt-payment-failed-tickets" className="btn btn-primary">
                Back to List
              </Link>
            </Card.Body>
          </Card>
        </Block>
      </Layout>
    );
  }

  const canClose = ticket.canClose && ticket.ticketStatus !== "Closed";

  return (
    <Layout title="Ticket Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Ticket {ticket.ticketArn || ticket.ticketNumber}{" "}
              {ticket.ticketStatus === "Closed" ? (
                <Badge bg="secondary">Closed</Badge>
              ) : (
                <Badge bg="primary">Open</Badge>
              )}
            </Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/dbt-payment-failed-tickets">Payment Failed Tickets</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Details
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                <Icon name="arrow-left" className="me-1" />
                Back
              </Button>
              <Button variant="outline-primary" onClick={refreshStatus}>
                <Icon name="reload" className="me-1" />
                Refresh Status
              </Button>
              <Button variant="danger" onClick={closeTicket} disabled={!canClose}>
                <Icon name="cross-circle" className="me-1" />
                Close Ticket
              </Button>
            </div>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      {!canClose && ticket.ticketStatus !== "Closed" && (
        <Block>
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <Icon name="alert-circle" className="me-2" />
            This ticket cannot be closed until the DBT payment is successful. Use “Refresh Status” to
            fetch the latest payment state.
          </div>
        </Block>
      )}

      <Block>
        <Section title="Beneficiary Details" icon="user">
          <Field label="Farmer / Beneficiary Name" value={ticket.farmerName} />
          <Field label="Beneficiary Type" value={ticket.beneficiaryType} />
          <Field label="Farmer ID" value={ticket.farmerId} />
          <Field label="Beneficiary ID" value={ticket.beneficiaryId} />
          <Field label="Mobile Number" value={ticket.mobileNumber} />
        </Section>

        <Section title="Application Details" icon="reports">
          <Field label="Application Number" value={ticket.applicationNumber} />
          <Field label="Application ID" value={ticket.scApplicationFormId} />
          <Field label="District" value={ticket.districtName} />
          <Field label="Taluk" value={ticket.talukName} />
          <Field label="Hobli" value={ticket.hobliName} />
          <Field label="Village" value={ticket.villageName} />
        </Section>

        <Section title="Scheme Details" icon="grid-alt">
          <Field label="Scheme" value={ticket.schemeName} />
          <Field label="Sub Scheme" value={ticket.subSchemeName} />
        </Section>

        <Section title="Bank Details" icon="building">
          <Field label="Bank Name" value={ticket.bankName} />
          <Field label="Account Number" value={ticket.accountNumberMasked} />
          <Field label="IFSC" value={ticket.ifscCode} />
        </Section>

        <Section title="Payment Details" icon="coins">
          <Col md="4" className="mb-3">
            <div className="text-muted small">Current Payment Status</div>
            <div>{statusBadge(ticket.paymentStatus)}</div>
          </Col>
          <Field label="Failure Type" value={ticket.failureType} />
          <Col md="4" className="mb-3">
            <div className="text-muted small">Can Close?</div>
            <div>
              {ticket.canClose ? (
                <Badge bg="success">Payment Successful</Badge>
              ) : (
                <Badge bg="danger">Blocked — Payment Failed</Badge>
              )}
            </div>
          </Col>
        </Section>

        <Section title="Acknowledgement Details" icon="task">
          <Col md="4" className="mb-3">
            <div className="text-muted small">Current Acknowledgement Status</div>
            <div>{statusBadge(ticket.acknowledgementStatus)}</div>
          </Col>
        </Section>

        <Section title="Failure Reason" icon="alert-circle">
          <Field label="DBT Failure Reason" value={ticket.dbtFailureReason} />
          <Field label="Acknowledgement Failure Reason" value={ticket.acknowledgementFailureReason} />
        </Section>

        <Section title="Ticket Timeline / Status History" icon="clock">
          <Field label="Ticket ARN" value={ticket.ticketArn} />
          <Field label="Ticket Status" value={ticket.ticketStatus} />
          <Field label="Created By" value={ticket.createdBy || "SYSTEM"} />
          <Field label="Created Date" value={formatDateTime(ticket.createdDate)} />
          <Field label="Last Modified" value={formatDateTime(ticket.modifiedDate)} />
          <Field label="Assigned User" value={ticket.assignedUser} />
        </Section>
      </Block>
    </Layout>
  );
}

export default DbtPaymentFailedTicketDetails;
