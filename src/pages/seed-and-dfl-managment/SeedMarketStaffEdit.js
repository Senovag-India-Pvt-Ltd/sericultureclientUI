import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import Swal from "sweetalert2";
import { Icon } from "../../components";
import { useTranslation } from "react-i18next";
import api from "../../services/auth/api";

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

const MONTHS = [
  { v: 1, l: "January" }, { v: 2, l: "February" }, { v: 3, l: "March" },
  { v: 4, l: "April" }, { v: 5, l: "May" }, { v: 6, l: "June" },
  { v: 7, l: "July" }, { v: 8, l: "August" }, { v: 9, l: "September" },
  { v: 10, l: "October" }, { v: 11, l: "November" }, { v: 12, l: "December" },
];

function SeedMarketStaffEdit() {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  useEffect(() => {
    // There is no get-by-id endpoint; use the row passed from the list,
    // falling back to the cached copy so a page refresh still works.
    let row = location.state?.row;
    if (!row) {
      const cached = localStorage.getItem(`smsp_${id}`);
      if (cached) {
        try { row = JSON.parse(cached); } catch (e) { row = null; }
      }
    }
    setData(
      row || {
        seedMarketStaffPositionId: id,
        marketId: "", reportYear: "", reportMonth: "",
        designationCode: "", sanctioned: "", filled: "", vacant: "", deputed: "", outsourced: "",
      }
    );
  }, [id, location.state]);

  const handleInputs = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const update = () => {
    if (!data.marketId || !data.reportYear || !data.reportMonth || !data.designationCode) {
      Swal.fire(t("Market, Year, Month and Designation are required"));
      return;
    }
    api
      .post(baseURLSeedDfl + `seed-market-staff-position/save-info`, data)
      .then((res) => {
        if (res?.data?.error === 0) {
          localStorage.removeItem(`smsp_${id}`);
          Swal.fire({ icon: "success", title: t("Updated successfully") }).then(() =>
            navigate("/seriui/seed-market-staff-list")
          );
        } else {
          Swal.fire({ icon: "error", title: t("Attempt was not successful"), text: res?.data?.message || "" });
        }
      })
      .catch(() => Swal.fire({ icon: "error", title: t("Attempt was not successful"), text: t("Something went wrong!") }));
  };

  if (!data) return null;

  return (
    <Layout title={t("Edit Seed Market Staff Establishment")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit Seed Market Staff Establishment")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/seriui/seed-market-staff-list" className="btn btn-primary d-none d-md-inline-flex">
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Card.Header style={{ fontWeight: "bold" }}>{t("Edit Seed Market Staff Establishment")}</Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={2}>
                <Form.Label>{t("Market Id")} *</Form.Label>
                <Form.Control type="number" name="marketId" value={data.marketId || ""} onChange={handleInputs} />
              </Col>
              <Col md={2}>
                <Form.Label>{t("Year")} *</Form.Label>
                <Form.Control type="number" name="reportYear" value={data.reportYear || ""} onChange={handleInputs} />
              </Col>
              <Col md={2}>
                <Form.Label>{t("Month")} *</Form.Label>
                <Form.Select name="reportMonth" value={data.reportMonth || ""} onChange={handleInputs}>
                  <option value="">{t("Select")}</option>
                  {MONTHS.map((m) => (<option key={m.v} value={m.v}>{m.l}</option>))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>{t("Designation")} *</Form.Label>
                <Form.Control name="designationCode" value={data.designationCode || ""} onChange={handleInputs} placeholder="ರೇಸನಿ / RESANI" />
              </Col>
            </Row>
            <Row className="g-3 mt-1">
              <Col md={2}>
                <Form.Label>{t("Sanctioned")}</Form.Label>
                <Form.Control type="number" name="sanctioned" value={data.sanctioned ?? ""} onChange={handleInputs} />
              </Col>
              <Col md={2}>
                <Form.Label>{t("Filled")}</Form.Label>
                <Form.Control type="number" name="filled" value={data.filled ?? ""} onChange={handleInputs} />
              </Col>
              <Col md={2}>
                <Form.Label>{t("Vacant")}</Form.Label>
                <Form.Control type="number" name="vacant" value={data.vacant ?? ""} onChange={handleInputs} />
              </Col>
              <Col md={3}>
                <Form.Label>{t("Deputed")}</Form.Label>
                <Form.Control type="number" name="deputed" value={data.deputed ?? ""} onChange={handleInputs} />
              </Col>
              <Col md={3}>
                <Form.Label>{t("Outsourced")}</Form.Label>
                <Form.Control type="number" name="outsourced" value={data.outsourced ?? ""} onChange={handleInputs} />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="gap-col">
          <ul className="d-flex align-items-center justify-content-center gap g-3 mt-3">
            <li>
              <Button type="button" variant="primary" onClick={update}>{t("Update")}</Button>
            </li>
            <li>
              <Button type="button" variant="secondary" onClick={() => navigate("/seriui/seed-market-staff-list")}>{t("Cancel")}</Button>
            </li>
          </ul>
        </div>
      </Block>
    </Layout>
  );
}

export default SeedMarketStaffEdit;
