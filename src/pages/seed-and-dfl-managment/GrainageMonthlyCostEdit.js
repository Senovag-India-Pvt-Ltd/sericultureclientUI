import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import Swal from "sweetalert2";
import api from "../../../src/services/auth/api";
import { Icon } from "../../components";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

const MONTHS = [
  { value: 1, label: "January" }, { value: 2, label: "February" },
  { value: 3, label: "March" }, { value: 4, label: "April" },
  { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" },
  { value: 9, label: "September" }, { value: 10, label: "October" },
  { value: 11, label: "November" }, { value: 12, label: "December" },
];

function GrainageMonthlyCostEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const row = location.state?.row || null;

  const [data, setData] = useState({
    grainageMonthlyCostId: row?.grainageMonthlyCostId ?? id,
    grainageMasterId: row?.grainageMasterId ?? "",
    financialYearMasterId: row?.financialYearMasterId ?? "",
    monthNo: row?.monthNo ?? "",
    staffCost: row?.staffCost ?? "",
    otherCost: row?.otherCost ?? "",
    income: row?.income ?? "",
  });
  const [validated, setValidated] = useState(false);
  const [grainageList, setGrainageList] = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);

  useEffect(() => {
    api.get(baseURL + "grainageMaster/get-all")
      .then((r) => setGrainageList(r.data.content.grainageMaster || []))
      .catch(() => setGrainageList([]));

    api.get(baseURL + "financialYearMaster/get-all")
      .then((r) => setFinancialYearList(r.data.content.financialYearMaster || []))
      .catch(() => setFinancialYearList([]));
  }, []);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const saveSuccess = () => Swal.fire({ icon: "success", title: t("Saved successfully") });

  const saveError = (message) => {
    let errorMessage;
    if (typeof message === "object") errorMessage = Object.values(message).join("<br>");
    else errorMessage = message;
    Swal.fire({ icon: "error", title: t("Attempt was not successful"), html: errorMessage });
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      const payload = {
        grainageMonthlyCostId: data.grainageMonthlyCostId,
        grainageMasterId: data.grainageMasterId,
        financialYearMasterId: data.financialYearMasterId,
        monthNo: data.monthNo,
        staffCost: data.staffCost === "" ? 0 : data.staffCost,
        otherCost: data.otherCost === "" ? 0 : data.otherCost,
        income: data.income === "" ? 0 : data.income,
      };
      api
        .post(baseURLSeedDfl + `grainage-monthly-cost/save-info`, payload)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            navigate("/seriui/grainage-monthly-cost-list");
          }
        })
        .catch((err) => {
          const v = err?.response?.data?.validationErrors;
          if (v && Object.keys(v).length > 0) saveError(v);
          else saveError("Something went wrong! Please try again!");
        });
      setValidated(true);
    }
  };

  if (!row) {
    return (
      <Layout title={t("Edit Grainage Monthly Cost")}>
        <Block className="mt-n4">
          <Card>
            <Card.Body>
              <p>{t("Please open Edit from the list.")}</p>
              <Link to="/seriui/grainage-monthly-cost-list" className="btn btn-primary">
                <Icon name="arrow-long-left" />
                <span>{t("Go to List")}</span>
              </Link>
            </Card.Body>
          </Card>
        </Block>
      </Layout>
    );
  }

  return (
    <Layout title={t("Edit Grainage Monthly Cost")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit Grainage Monthly Cost")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/grainage-monthly-cost-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              {t("Edit Grainage Monthly Cost")}
            </Card.Header>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="grainageMasterId">
                      {t("Grainage")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        id="grainageMasterId"
                        name="grainageMasterId"
                        value={data.grainageMasterId}
                        onChange={handleInputs}
                        required
                      >
                        <option value="">{t("Select Grainage")}</option>
                        {grainageList.map((g) => (
                          <option key={g.grainageMasterId} value={g.grainageMasterId}>
                            {g.grainageMasterName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Grainage is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="financialYearMasterId">
                      {t("Financial Year")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        id="financialYearMasterId"
                        name="financialYearMasterId"
                        value={data.financialYearMasterId}
                        onChange={handleInputs}
                        required
                      >
                        <option value="">{t("Select Financial Year")}</option>
                        {financialYearList.map((f) => (
                          <option key={f.financialYearMasterId} value={f.financialYearMasterId}>
                            {f.financialYear}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Financial Year is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="monthNo">
                      {t("Month")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        id="monthNo"
                        name="monthNo"
                        value={data.monthNo}
                        onChange={handleInputs}
                        required
                      >
                        <option value="">{t("Select Month")}</option>
                        {MONTHS.map((m) => (
                          <option key={m.value} value={m.value}>{t(m.label)}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Month is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="staffCost">{t("Staff Cost")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="staffCost"
                        name="staffCost"
                        value={data.staffCost}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Staff Cost")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="otherCost">{t("Other Cost")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="otherCost"
                        name="otherCost"
                        value={data.otherCost}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Other Cost")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="income">{t("Income")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="income"
                        name="income"
                        value={data.income}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Income")}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="gap-col">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                <Button type="submit" variant="primary">{t("Update")}</Button>
              </li>
              <li>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/seriui/grainage-monthly-cost-list")}
                >
                  {t("Cancel")}
                </Button>
              </li>
            </ul>
          </div>
        </Form>
      </Block>
    </Layout>
  );
}

export default GrainageMonthlyCostEdit;
