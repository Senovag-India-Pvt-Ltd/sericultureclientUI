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
  seedMarketStaffPositionId: null,
  marketId: localStorage.getItem("marketId") || "",
  reportYear: new Date().getFullYear(),
  reportMonth: new Date().getMonth() + 1,
  designationCode: "",
  sanctioned: "",
  filled: "",
  vacant: "",
  deputed: "",
  outsourced: "",
};

const MONTHS = [
  { v: 1, l: "January" }, { v: 2, l: "February" }, { v: 3, l: "March" },
  { v: 4, l: "April" }, { v: 5, l: "May" }, { v: 6, l: "June" },
  { v: 7, l: "July" }, { v: 8, l: "August" }, { v: 9, l: "September" },
  { v: 10, l: "October" }, { v: 11, l: "November" }, { v: 12, l: "December" },
];

function SeedMarketStaffEntry() {
  const { t } = useTranslation();
  const [data, setData] = useState(emptyForm);
  const [rows, setRows] = useState([]);

  const handleInputs = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const loadRows = () => {
    if (!data.marketId || !data.reportYear || !data.reportMonth) { setRows([]); return; }
    api.get(baseURLSeedDfl + `seed-market-staff-position/get-by-market`, {
      params: { marketId: data.marketId, reportYear: data.reportYear, reportMonth: data.reportMonth },
    })
      .then((res) => setRows(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRows([]));
  };

  useEffect(() => { loadRows(); /* eslint-disable-next-line */ }, [data.marketId, data.reportYear, data.reportMonth]);

  const save = () => {
    if (!data.marketId || !data.reportYear || !data.reportMonth || !data.designationCode) {
      Swal.fire(t("Market, Year, Month and Designation are required", { ns: "reports" }));
      return;
    }
    api.post(baseURLSeedDfl + `seed-market-staff-position/save-info`, data)
      .then((res) => {
        if (res?.data?.error === 0) {
          Swal.fire(t("Saved", { ns: "reports" }));
          setData({ ...emptyForm, marketId: data.marketId, reportYear: data.reportYear, reportMonth: data.reportMonth });
          loadRows();
        } else Swal.fire(res?.data?.message || t("Save failed", { ns: "reports" }));
      })
      .catch(() => Swal.fire(t("Save failed", { ns: "reports" })));
  };

  const edit = (r) => setData({
    seedMarketStaffPositionId: r.seedMarketStaffPositionId,
    marketId: r.marketId, reportYear: r.reportYear, reportMonth: r.reportMonth,
    designationCode: r.designationCode || "", sanctioned: r.sanctioned ?? "", filled: r.filled ?? "",
    vacant: r.vacant ?? "", deputed: r.deputed ?? "", outsourced: r.outsourced ?? "",
  });

  const remove = (id) => {
    Swal.fire({ title: t("Delete this entry?", { ns: "reports" }), showCancelButton: true, confirmButtonText: t("Delete", { ns: "reports" }) })
      .then((res) => {
        if (res.isConfirmed) {
          api.get(baseURLSeedDfl + `seed-market-staff-position/delete-info/${id}`)
            .then(() => loadRows()).catch(() => Swal.fire(t("Delete failed", { ns: "reports" })));
        }
      });
  };

  return (
    <Layout title={t("Seed Market Staff Establishment")}>
      <style>{seedMarketStaffEntryStyles}</style>
      <Block.Head><div className="sh-page-header"><Block.Title tag="h2" className="sh-page-title">ಕಾರ್ಯನಿರತ ಸಿಬ್ಬಂದಿ — Staff Establishment (Sheet 2 §D)</Block.Title></div></Block.Head>
      <Block className="mt-n4 sh-form-wrap">
        <Card className="shadow-sm border-0" style={{ borderRadius: "16px" }}>
          <Card.Body>
            <Row className="g-3">
              <Col md={2}><Form.Label>{t("Market ID", { ns: "reports" })} *</Form.Label>
                <Form.Control type="number" name="marketId" value={data.marketId} onChange={handleInputs} /></Col>
              <Col md={2}><Form.Label>{t("Year", { ns: "reports" })} *</Form.Label>
                <Form.Control type="number" name="reportYear" value={data.reportYear} onChange={handleInputs} /></Col>
              <Col md={2}><Form.Label>{t("Month")} *</Form.Label>
                <Form.Select name="reportMonth" value={data.reportMonth} onChange={handleInputs}>
                  {MONTHS.map((m) => (<option key={m.v} value={m.v}>{t(m.l, { ns: "reports" })}</option>))}
                </Form.Select></Col>
              <Col md={4}><Form.Label>ಹುದ್ದೆ / Designation *</Form.Label>
                <Form.Control name="designationCode" value={data.designationCode} onChange={handleInputs} placeholder="ರೇಸನಿ / RESANI" /></Col>
            </Row>
            <Row className="g-3 mt-1">
              <Col md={2}><Form.Label>ಮಂಜೂರಾದ / Sanctioned</Form.Label>
                <Form.Control type="number" name="sanctioned" value={data.sanctioned} onChange={handleInputs} /></Col>
              <Col md={2}><Form.Label>ಭರ್ತಿಯಾದ / Filled</Form.Label>
                <Form.Control type="number" name="filled" value={data.filled} onChange={handleInputs} /></Col>
              <Col md={2}><Form.Label>ಖಾಲಿ / Vacant</Form.Label>
                <Form.Control type="number" name="vacant" value={data.vacant} onChange={handleInputs} /></Col>
              <Col md={3}><Form.Label>ಅನ್ಯಕಾರ್ಯ / Deputed</Form.Label>
                <Form.Control type="number" name="deputed" value={data.deputed} onChange={handleInputs} /></Col>
              <Col md={3}><Form.Label>ಹೊರಗುತ್ತಿಗೆ / Outsourced</Form.Label>
                <Form.Control type="number" name="outsourced" value={data.outsourced} onChange={handleInputs} /></Col>
            </Row>
            <Row className="mt-3"><Col className="text-end">
              <Button variant="primary" onClick={save}>{data.seedMarketStaffPositionId ? t("Update", { ns: "reports" }) : t("Save", { ns: "reports" })}</Button>
            </Col></Row>
          </Card.Body>
        </Card>

        <Card className="mt-4 border-0" style={{ borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <Card.Body>
            {rows.length === 0 ? (<div className="text-center py-4 text-muted">{t("No entries for this market/month.", { ns: "reports" })}</div>) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead style={{ backgroundColor: "#1f5fa8", color: "white" }}>
                    <tr><th>Designation</th><th>Sanctioned</th><th>Filled</th><th>Vacant</th><th>Deputed</th><th>Outsourced</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.seedMarketStaffPositionId}>
                        <td>{r.designationCode}</td><td>{r.sanctioned}</td><td>{r.filled}</td>
                        <td>{r.vacant}</td><td>{r.deputed}</td><td>{r.outsourced}</td>
                        <td>
                          <Button size="sm" variant="outline-primary" className="me-2" onClick={() => edit(r)}><Icon name="edit" /></Button>
                          <Button size="sm" variant="outline-danger" onClick={() => remove(r.seedMarketStaffPositionId)}><Icon name="trash" /></Button>
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

const seedMarketStaffEntryStyles = `
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

export default SeedMarketStaffEntry;
