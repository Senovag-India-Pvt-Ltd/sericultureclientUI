import { useEffect, useState } from "react";
import { Card, Table, Button, Badge } from "react-bootstrap";
import { Icon } from "../../components";
import api from "../../services/auth/api";

// Farmer Registration edit page: for a farmer registered through Seva Sindhu, shows where the details came from and
// the audit trail (original FRUITS values, then every change with who and when). Renders nothing for other farmers.
const BASE = (process.env.REACT_APP_API_BASE_URL_REGISTRATION || "") + "farmer-change-history/";
const fmt = (d) => (d ? new Date(d).toLocaleString("en-IN") : "-");

function SevaSindhuFarmerHistory({ farmerId, registrationSource }) {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(false);
  const isSevaSindhu = registrationSource === "SEVA_SINDHU";

  useEffect(() => {
    setRows(null);
    if (!isSevaSindhu || !farmerId || !open) return;
    api.get(BASE + farmerId).then((r) => setRows(r.data?.content || [])).catch(() => setRows([]));
  }, [farmerId, isSevaSindhu, open]);

  if (!isSevaSindhu) return null;

  return (
    <Card className="mb-3" style={{ border: "1px solid #b9dcc7", borderRadius: "14px", background: "#f3faf6" }}>
      <Card.Body style={{ padding: "12px 18px" }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span>
            <Badge bg="success" className="me-2">Registered through Seva Sindhu</Badge>
            <span className="small text-muted">
              Details were imported from FRUITS. You can correct them here; every change is recorded and the original values are kept.
            </span>
          </span>
          <Button size="sm" variant="outline-success" onClick={() => setOpen((o) => !o)}>
            <Icon name="history" /> {open ? "Hide change history" : "Change history"}
          </Button>
        </div>
        {open && (
          <div className="mt-3 table-responsive">
            {rows === null ? (
              <p className="small text-muted mb-0">Loading...</p>
            ) : rows.length === 0 ? (
              <p className="small text-muted mb-0">No history recorded yet.</p>
            ) : (
              <Table size="sm" className="mb-0 bg-white">
                <thead>
                  <tr><th>When</th><th>Type</th><th>Detail</th><th>Old value</th><th>New value</th><th>By</th></tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td className="small text-nowrap">{fmt(r.changedDate)}</td>
                      <td>{r.changeType === "FRUITS_IMPORT" ? <Badge bg="secondary">From FRUITS</Badge> : <Badge bg="primary">Edited</Badge>}</td>
                      <td className="small">{r.fieldName}</td>
                      <td className="small text-muted">{r.oldValue ?? "-"}</td>
                      <td className="small"><strong>{r.newValue ?? "-"}</strong></td>
                      <td className="small">{r.changedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default SevaSindhuFarmerHistory;
