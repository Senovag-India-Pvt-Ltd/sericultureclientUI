import { Card, Button, Row, Col, Spinner, Badge } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import api from "../../services/auth/api";

const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

const CANNOT_CLOSE_MSG =
  "This ticket cannot be closed because the DBT payment is still in Failure status. " +
  "The ticket can only be closed after the payment is successful.";

const SwalStyled = Swal.mixin({ customClass: { popup: "dpft-swal" } });

const dpftStyles = `
.dpft-hero{background:linear-gradient(120deg,#0d3b66 0%,#1a63a6 52%,#2f9bd8 100%);border-radius:18px;padding:22px 26px;color:#fff;box-shadow:0 12px 30px rgba(13,59,102,.22);position:relative;overflow:hidden;}
.dpft-hero:after{content:"";position:absolute;right:-50px;top:-50px;width:190px;height:190px;background:rgba(255,255,255,.08);border-radius:50%;}
.dpft-hero-row{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;position:relative;z-index:1;}
.dpft-hero-eyebrow{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;opacity:.85;display:flex;align-items:center;}
.dpft-hero-title{font-size:23px;font-weight:800;margin:5px 0 6px;color:#fff;}
.dpft-hero-crumb .breadcrumb-item,.dpft-hero-crumb a{color:rgba(255,255,255,.85)!important;font-size:13px;text-decoration:none;}
.dpft-hero-crumb .breadcrumb-item.active{color:#fff!important;}
.dpft-pill{font-size:12px;font-weight:700;padding:3px 13px;border-radius:30px;display:inline-flex;align-items:center;}
.dpft-pill-open{background:#e7f0ff;color:#1257c9;}
.dpft-pill-closed{background:rgba(255,255,255,.22);color:#fff;border:1px solid rgba(255,255,255,.45);}
.dpft-section{border:none!important;border-radius:16px!important;box-shadow:0 4px 20px rgba(20,40,80,.06)!important;overflow:hidden;margin-bottom:18px;}
.dpft-section>.card-header{background:#fff!important;border-bottom:1px solid #eef2f7!important;padding:15px 20px;font-weight:700;color:#1f2d3d;display:flex;align-items:center;}
.dpft-section>.card-body{padding:18px 22px 6px;}
.dpft-chip{width:32px;height:32px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;color:#fff;margin-right:12px;background:linear-gradient(135deg,#0d3b66,#2f9bd8);flex:0 0 32px;}
.dpft-flabel{font-size:11.5px;letter-spacing:.04em;text-transform:uppercase;color:#93a0b3;font-weight:600;margin-bottom:2px;}
.dpft-fvalue{font-size:14.5px;font-weight:600;color:#1f2d3d;word-break:break-word;}
.dpft-alert{border:none;border-radius:14px;background:#fff6e9;color:#8a5a12;box-shadow:0 4px 16px rgba(242,153,74,.14);border-left:5px solid #f2994a;padding:14px 18px;}
.dpft-swal.swal2-popup{border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.22);}
.dpft-hero .btn-light{font-weight:600;}
.dpft-failbox{background:linear-gradient(135deg,#fff0f0,#ffe3e3);border:1px solid #ffc9c9;border-left:6px solid #e03131;border-radius:16px;padding:18px 22px;box-shadow:0 6px 20px rgba(224,49,49,.10);}
.dpft-failbox-label{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#c92a2a;display:flex;align-items:center;margin-bottom:6px;}
.dpft-failbox-text{font-size:23px;font-weight:800;color:#b02020;line-height:1.35;word-break:break-word;}
.dpft-contact{display:flex;align-items:center;gap:14px;background:#f6faff;border:1px solid #e4eef8;border-radius:14px;padding:14px 16px;height:100%;}
.dpft-contact-av{width:46px;height:46px;flex:0 0 46px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:17px;background:linear-gradient(135deg,#0d3b66,#2f9bd8);}
.dpft-contact-name{font-weight:700;color:#1f2d3d;font-size:15px;}
.dpft-contact-role{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#93a0b3;font-weight:700;}
.dpft-callbtn{display:inline-flex;align-items:center;gap:6px;margin-top:5px;font-weight:800;color:#0b7a3b;text-decoration:none;font-size:15px;}
.dpft-callbtn:hover{color:#095e2e;text-decoration:underline;}
.dpft-nomobile{font-size:13px;color:#adb5bd;font-style:italic;margin-top:4px;}
`;

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
                   <div style="font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#c92a2a;margin-bottom:5px;display:flex;align-items:center;gap:6px">⚠️ Reason / Remarks</div>
                   <div style="font-weight:800;color:#b02020;font-size:15.5px;line-height:1.4">${remarks}</div>
                 </div>`
              : ""
          }
        </div>`,
      confirmButtonColor: "#e03131",
      confirmButtonText: "OK",
    });
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
          SwalStyled.fire({ icon: "error", title: "Error", text: extractError(err) });
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
        SwalStyled.fire({
          icon: "success",
          title: "Status refreshed",
          html: `Payment Status: <b>${updated?.paymentStatus || "N/A"}</b><br/>${
            updated?.canClose ? "Payment successful — ticket can now be closed." : ""
          }`,
          timer: 2500,
        });
      })
      .catch((err) => SwalStyled.fire({ icon: "error", title: "Error", text: extractError(err) }));
  };

  const closeTicket = () => {
    SwalStyled.fire({
      title: "Close this ticket?",
      text: `Ticket ${ticket?.ticketArn || id} will be validated and closed.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Validate & Close",
      confirmButtonColor: "#0d3b66",
    }).then((result) => {
      if (!result.isConfirmed) return;
      SwalStyled.fire({ title: "Validating latest DBT payment status...", allowOutsideClick: false });
      Swal.showLoading();
      // Re-check the latest DBT payment status before closing.
      api
        .get(baseURLDBT + `payment-failed-tickets/${id}/refresh-status`)
        .then((res) => {
          const latest = res?.data?.content;
          setTicket((prev) => ({ ...prev, ...latest }));
          if (!latest?.canClose) {
            // Still Failure → keep the ticket Open, show the mandated message + remark.
            cannotCloseSwal(latest?.remarks);
            return;
          }
          api
            .put(baseURLDBT + `payment-failed-tickets/${id}/close`)
            .then(() => {
              SwalStyled.fire({ icon: "success", title: "Ticket closed", timer: 2000 });
              loadTicket();
            })
            .catch((err) => {
              const msg = extractError(err);
              cannotCloseSwal(latest?.remarks, /success/i.test(msg) ? CANNOT_CLOSE_MSG : msg);
            });
        })
        .catch((err) => SwalStyled.fire({ icon: "error", title: "Error", text: extractError(err) }));
    });
  };

  const Field = ({ label, value }) => (
    <Col md="4" className="mb-3">
      <div className="dpft-flabel">{label}</div>
      <div className="dpft-fvalue">{value || value === 0 ? value : "-"}</div>
    </Col>
  );

  const Section = ({ title, icon, children }) => (
    <Card className="dpft-section">
      <Card.Header>
        <span className="dpft-chip">
          <Icon name={icon} />
        </span>
        <span>{title}</span>
      </Card.Header>
      <Card.Body>
        <Row>{children}</Row>
      </Card.Body>
    </Card>
  );

  const ContactCard = ({ role, name, username, mobile }) => {
    const display = name || username;
    const initial = (display || "?").trim().charAt(0).toUpperCase();
    return (
      <Col md="6" className="mb-3">
        <div className="dpft-contact">
          <div className="dpft-contact-av">{initial}</div>
          <div className="flex-grow-1">
            <div className="dpft-contact-role">{role}</div>
            <div className="dpft-contact-name">{display || "-"}</div>
            {username && name ? <div className="text-muted small">@{username}</div> : null}
            {mobile ? (
              <a className="dpft-callbtn" href={`tel:${mobile}`}>
                <Icon name="call" /> {mobile}
              </a>
            ) : (
              <div className="dpft-nomobile">No mobile number on record</div>
            )}
          </div>
        </div>
      </Col>
    );
  };

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
      <style>{dpftStyles}</style>

      <Block className="mt-2 pt-5">
        <div className="dpft-hero">
          <div className="dpft-hero-row">
            <div>
              <div className="dpft-hero-eyebrow">
                <Icon name="file-text" className="me-1" /> Payment Failed Ticket
              </div>
              <div className="dpft-hero-title">
                Ticket {ticket.ticketArn || ticket.ticketNumber}{" "}
                {ticket.ticketStatus === "Closed" ? (
                  <span className="dpft-pill dpft-pill-closed">Closed</span>
                ) : (
                  <span className="dpft-pill dpft-pill-open">Open</span>
                )}
              </div>
              <nav>
                <ol className="breadcrumb breadcrumb-arrow mb-0 dpft-hero-crumb">
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
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button variant="light" onClick={() => navigate(-1)}>
                <Icon name="arrow-left" className="me-1" />
                Back
              </Button>
              <Button variant="light" onClick={refreshStatus}>
                <Icon name="reload" className="me-1" />
                Refresh Status
              </Button>
              <Button variant="danger" onClick={closeTicket} disabled={!canClose}>
                <Icon name="cross-circle" className="me-1" />
                Close Ticket
              </Button>
            </div>
          </div>
        </div>
      </Block>

      {!canClose && ticket.ticketStatus !== "Closed" && (
        <Block className="mt-3">
          <div className="dpft-alert d-flex align-items-center" role="alert">
            <Icon name="alert-circle" className="me-2" style={{ fontSize: "18px" }} />
            <span>
              {CANNOT_CLOSE_MSG} Use “Refresh Status” to fetch the latest payment state.
            </span>
          </div>
        </Block>
      )}

      {(ticket.remarks || ticket.dbtFailureReason || ticket.acknowledgementFailureReason) && (
        <Block className="mt-3">
          <div className="dpft-failbox">
            <div className="dpft-failbox-label">
              <Icon name="alert-circle" className="me-1" /> Failure Reason / Remarks
            </div>
            <div className="dpft-failbox-text">
              {ticket.remarks || ticket.dbtFailureReason || ticket.acknowledgementFailureReason}
            </div>
          </div>
        </Block>
      )}

      <Block>
        <Section title="Follow-up Contacts — call until payment succeeds" icon="headphone">
          <ContactCard
            role="Application Created By"
            name={ticket.applicationCreatedByName}
            username={ticket.applicationCreatedBy}
            mobile={ticket.applicationCreatedByMobile}
          />
          <ContactCard
            role="Application Modified By"
            name={ticket.applicationModifiedByName}
            username={ticket.applicationModifiedBy}
            mobile={ticket.applicationModifiedByMobile}
          />
        </Section>

        <Section title="Beneficiary Details" icon="user">
          <Field label="Farmer / Beneficiary Name" value={ticket.farmerName} />
          <Field label="Beneficiary Type" value={ticket.beneficiaryType} />
          <Field label="Farmer ID" value={ticket.farmerId} />
          <Field label="Beneficiary ID" value={ticket.beneficiaryId} />
          <Field label="FRUITS ID" value={ticket.fruitsId} />
          <Col md="4" className="mb-3">
            <div className="dpft-flabel">Farmer / Beneficiary Mobile Number</div>
            {ticket.mobileNumber ? (
              <a className="dpft-fvalue dpft-callbtn" href={`tel:${ticket.mobileNumber}`}>
                <Icon name="call" /> {ticket.mobileNumber}
              </a>
            ) : (
              <div className="dpft-fvalue">-</div>
            )}
          </Col>
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
          <Field label="Remarks" value={ticket.remarks} />
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
