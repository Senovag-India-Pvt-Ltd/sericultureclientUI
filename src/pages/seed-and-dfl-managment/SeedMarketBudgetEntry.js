import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import Swal from "sweetalert2";
import { Icon } from "../../components";
import { useTranslation } from "react-i18next";
import api from "../../services/auth/api";

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

const emptyForm = {
  seedMarketBudgetRemittanceId: null,
  marketId: localStorage.getItem("marketId") || "",
  reportYear: new Date().getFullYear(),
  reportMonth: new Date().getMonth() + 1,
  headCode: "",
  releasedMonth: "",
  releasedCum: "",
  spentMonth: "",
  spentCum: "",
};

const MONTHS = [
  { v: 1, l: "January" }, { v: 2, l: "February" }, { v: 3, l: "March" },
  { v: 4, l: "April" }, { v: 5, l: "May" }, { v: 6, l: "June" },
  { v: 7, l: "July" }, { v: 8, l: "August" }, { v: 9, l: "September" },
  { v: 10, l: "October" }, { v: 11, l: "November" }, { v: 12, l: "December" },
];

function SeedMarketBudgetEntry() {
  const { t } = useTranslation();
  const [data, setData] = useState(emptyForm);
  const [rows, setRows] = useState([]);

  const handleInputs = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const loadRows = () => {
    if (!data.marketId || !data.reportYear || !data.reportMonth) { setRows([]); return; }
    api.get(baseURLSeedDfl + `seed-market-budget-remittance/get-by-market`, {
      params: { marketId: data.marketId, reportYear: data.reportYear, reportMonth: data.reportMonth },
    })
      .then((res) => setRows(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRows([]));
  };

  useEffect(() => { loadRows(); /* eslint-disable-next-line */ }, [data.marketId, data.reportYear, data.reportMonth]);

  const save = () => {
    if (!data.marketId || !data.reportYear || !data.reportMonth || !data.headCode) {
      Swal.fire("Market, Year, Month and Head Code are required");
      return;
    }
    api.post(baseURLSeedDfl + `seed-market-budget-remittance/save-info`, data)
      .then((res) => {
        if (res?.data?.error === 0) {
          Swal.fire("Saved");
          setData({ ...emptyForm, marketId: data.marketId, reportYear: data.reportYear, reportMonth: data.reportMonth });
          loadRows();
        } else Swal.fire(res?.data?.message || "Save failed");
      })
      .catch(() => Swal.fire("Save failed"));
  };

  const edit = (r) => setData({
    seedMarketBudgetRemittanceId: r.seedMarketBudgetRemittanceId,
    marketId: r.marketId, reportYear: r.reportYear, reportMonth: r.reportMonth,
    headCode: r.headCode || "", releasedMonth: r.releasedMonth ?? "", releasedCum: r.releasedCum ?? "",
    spentMonth: r.spentMonth ?? "", spentCum: r.spentCum ?? "",
  });

  const remove = (id) => {
    Swal.fire({ title: "Delete this entry?", showCancelButton: true, confirmButtonText: "Delete" })
      .then((res) => {
        if (res.isConfirmed) {
          api.get(baseURLSeedDfl + `seed-market-budget-remittance/delete-info/${id}`)
            .then(() => loadRows()).catch(() => Swal.fire("Delete failed"));
        }
      });
  };

  return (
    <Layout title={t("Seed Market Budget Remittance")}>
      <style>{seedMarketBudgetEntryStyles}</style>
      <Block.Head><div className="sh-page-header"><Block.Title tag="h2" className="sh-page-title">ಯೋಜನೆ ಬಿಡುಗಡೆ/ವೆಚ್ಚ — Budget Remittance (Sheet 2 §C)</Block.Title></div></Block.Head>
      <Block className="mt-n4 sh-form-wrap">
        <Card className="shadow-sm border-0" style={{ borderRadius: "16px" }}>
          <Card.Body>
            <Row className="g-3">
              <Col md={2}><Form.Label>Market Id *</Form.Label>
                <Form.Control type="number" name="marketId" value={data.marketId} onChange={handleInputs} /></Col>
              <Col md={2}><Form.Label>Year *</Form.Label>
                <Form.Control type="number" name="reportYear" value={data.reportYear} onChange={handleInputs} /></Col>
              <Col md={2}><Form.Label>Month *</Form.Label>
                <Form.Select name="reportMonth" value={data.reportMonth} onChange={handleInputs}>
                  {MONTHS.map((m) => (<option key={m.v} value={m.v}>{m.l}</option>))}
                </Form.Select></Col>
              <Col md={3}><Form.Label>ಲೆಕ್ಕ ಶೀರ್ಷಿಕೆ / Head Code *</Form.Label>
                <Form.Control name="headCode" value={data.headCode} onChange={handleInputs} placeholder="2851-00-107-1-51-(059)" /></Col>
            </Row>
            <Row className="g-3 mt-1">
              <Col md={3}><Form.Label>ಬಿಡುಗಡೆ ಮಾಹೆ / Released (Month)</Form.Label>
                <Form.Control type="number" name="releasedMonth" value={data.releasedMonth} onChange={handleInputs} /></Col>
              <Col md={3}><Form.Label>ಬಿಡುಗಡೆ ಅಂತ್ಯ / Released (Cum)</Form.Label>
                <Form.Control type="number" name="releasedCum" value={data.releasedCum} onChange={handleInputs} /></Col>
              <Col md={3}><Form.Label>ವೆಚ್ಚ ಮಾಹೆ / Spent (Month)</Form.Label>
                <Form.Control type="number" name="spentMonth" value={data.spentMonth} onChange={handleInputs} /></Col>
              <Col md={3}><Form.Label>ವೆಚ್ಚ ಅಂತ್ಯ / Spent (Cum)</Form.Label>
                <Form.Control type="number" name="spentCum" value={data.spentCum} onChange={handleInputs} /></Col>
            </Row>
            <Row className="mt-3"><Col className="text-end">
              <Button variant="primary" onClick={save}>{data.seedMarketBudgetRemittanceId ? "Update" : "Save"}</Button>
            </Col></Row>
          </Card.Body>
        </Card>

        <Card className="mt-4 border-0" style={{ borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <Card.Body>
            {rows.length === 0 ? (<div className="text-center py-4 text-muted">No entries for this market/month.</div>) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead style={{ backgroundColor: "#1f5fa8", color: "white" }}>
                    <tr><th>Head Code</th><th>Rel Mo</th><th>Rel Cum</th><th>Spent Mo</th><th>Spent Cum</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.seedMarketBudgetRemittanceId}>
                        <td>{r.headCode}</td><td>{r.releasedMonth}</td><td>{r.releasedCum}</td>
                        <td>{r.spentMonth}</td><td>{r.spentCum}</td>
                        <td>
                          <Button size="sm" variant="outline-primary" className="me-2" onClick={() => edit(r)}><Icon name="edit" /></Button>
                          <Button size="sm" variant="outline-danger" onClick={() => remove(r.seedMarketBudgetRemittanceId)}><Icon name="trash" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

const seedMarketBudgetEntryStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
`;

export default SeedMarketBudgetEntry;
