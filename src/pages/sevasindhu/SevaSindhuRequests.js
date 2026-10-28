import { useCallback, useEffect, useState } from "react";
import { Card, Table, Button, Badge, Alert, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import api from "../../services/auth/api";

// Department screen: every application request received from Seva Sindhu, how far the citizen got, and the
// acknowledgement push to Seva Sindhu (URL 2) with Push again (Token_Based_Integration_V3.pdf, Step 3:
// "EDCS will display the transaction status as Failed until the Department successfully calls the API again").
const BASE = (process.env.REACT_APP_API_BASE_URL_DBT || "") + "sevasindhu-admin/requests";

const REQ_BADGE = {
  RECEIVED: ["secondary", "Received"],
  FARMER_REGISTERED: ["info", "Farmer verified"],
  SUBMITTING: ["warning", "Submitting"],
  SUBMITTED: ["success", "Submitted"],
};
const ACK_BADGE = {
  NOT_DUE: ["light", "Not due"],
  PENDING: ["warning", "Pending"],
  SENT: ["success", "Sent"],
  FAILED: ["danger", "Failed"],
};
const fmt = (d) => (d ? new Date(d).toLocaleString("en-IN") : "-");

function SevaSindhuRequests() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pushing, setPushing] = useState(null);
  const size = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(BASE, { params: { page, size } });
      setData(res.data);
    } catch (e) {
      setError("Could not load Seva Sindhu requests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const pushAgain = async (row) => {
    setPushing(row.id);
    try {
      const res = await api.post(`${BASE}/${row.id}/push-again`);
      await Swal.fire({
        icon: res.data.sent ? "success" : "warning",
        title: res.data.sent ? "Sent to Seva Sindhu" : "Not sent",
        text: res.data.message,
      });
      load();
    } catch (e) {
      Swal.fire({ icon: "error", title: "Push failed", text: "Please try again." });
    } finally {
      setPushing(null);
    }
  };

  const viewAck = async (row) => {
    try {
      const res = await api.get(`${BASE}/${row.id}/acknowledgement`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      window.open(url, "_blank", "noopener");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      Swal.fire({ icon: "error", title: "Acknowledgement not available", text: "Please try again." });
    }
  };

  const rows = data?.content || [];
  const total = data?.totalRecords || 0;
  const pages = Math.max(1, Math.ceil(total / size));

  return (
    <Layout title="Seva Sindhu Requests">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Seva Sindhu Requests</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <Button variant="primary" onClick={load} disabled={loading}><Icon name="reload" /> Refresh</Button>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      {data && !data.pushConfigured && (
        <Alert variant="warning" className="mt-3">
          <Icon name="alert-circle" /> Sending acknowledgements to Seva Sindhu is not configured on this server
          (SEVASINDHU_DEPT_UPDATE_USERNAME / SEVASINDHU_DEPT_UPDATE_PASSWORD). Submitted applications stay <strong>Pending</strong> until it is.
        </Alert>
      )}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      <Card className="mt-3">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle" size="sm">
              <thead>
                <tr>
                  <th>Seva Sindhu ref.</th>
                  <th>Service</th>
                  <th>Received</th>
                  <th>Progress</th>
                  <th>FRUITS ID</th>
                  <th>ARN</th>
                  <th>Acknowledgement to Seva Sindhu</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && rows.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-4"><Spinner size="sm" /> Loading...</td></tr>
                )}
                {!loading && rows.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-4 text-muted">No requests from Seva Sindhu yet.</td></tr>
                )}
                {rows.map((r) => {
                  const [rv, rl] = REQ_BADGE[r.requestStatus] || ["secondary", r.requestStatus];
                  const [av, al] = ACK_BADGE[r.ackStatus] || ["secondary", r.ackStatus];
                  return (
                    <tr key={r.id}>
                      <td><strong>{r.edcsApplicationRefNo}</strong>{r.assistedMode ? <div className="small text-muted">assisted</div> : null}</td>
                      <td>{r.serviceId || "-"}</td>
                      <td className="small">{fmt(r.receivedAt)}</td>
                      <td><Badge bg={rv}>{rl}</Badge></td>
                      <td>{r.fruitsId || "-"}</td>
                      <td>{r.arn || "-"}</td>
                      <td>
                        <Badge bg={av} text={av === "light" || av === "warning" ? "dark" : undefined}>{al}</Badge>
                        {r.ackAttempts > 0 && <span className="small text-muted ms-1">{r.ackAttempts} attempt(s)</span>}
                        {r.ackStatus === "SENT" && <div className="small text-muted">{fmt(r.ackSentAt)} · ID {r.departmentApplicationUpdateId}</div>}
                        {r.ackStatus !== "SENT" && r.ackLastError && <div className="small text-danger" style={{ maxWidth: 320 }}>{r.ackLastError}</div>}
                        {r.ackStatus === "PENDING" && r.ackNextAttemptAt && <div className="small text-muted">next try {fmt(r.ackNextAttemptAt)}</div>}
                      </td>
                      <td className="text-nowrap">
                        {r.arn && (
                          <Button size="sm" variant="outline-primary" className="me-1" onClick={() => viewAck(r)}>
                            <Icon name="file-docs" /> Ack
                          </Button>
                        )}
                        {r.arn && r.ackStatus !== "SENT" && (
                          <Button size="sm" variant="primary" onClick={() => pushAgain(r)} disabled={pushing === r.id}>
                            {pushing === r.id ? <Spinner size="sm" /> : <Icon name="send" />} Push again
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        {total > size && (
          <Card.Footer className="d-flex justify-content-between align-items-center">
            <span className="small text-muted">{total} request(s)</span>
            <span>
              <Button size="sm" variant="outline-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>{" "}
              <span className="small mx-2">Page {page + 1} of {pages}</span>
              <Button size="sm" variant="outline-secondary" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Next</Button>
            </span>
          </Card.Footer>
        )}
      </Card>
    </Layout>
  );
}

export default SevaSindhuRequests;
