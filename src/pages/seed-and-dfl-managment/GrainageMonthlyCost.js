import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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

const EMPTY = {
  grainageMasterId: "",
  financialYearMasterId: "",
  monthNo: "",
  staffCost: "",
  otherCost: "",
  income: "",
  dcbIncome: "",
  mysoreRaceCocoonValue: "",
  chemicalEggSheetCost: "",
  electricityCost: "",
  fuelCost: "",
  mysoreRaceEggsValue: "",
};

function GrainageMonthlyCost() {
  const [data, setData] = useState({ ...EMPTY });
  const [validated, setValidated] = useState(false);
  const [grainageList, setGrainageList] = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(baseURL + "grainageMaster/get-all")
      .then((r) => setGrainageList(r.data.content.grainageMaster || []))
      .catch(() => setGrainageList([]));

    api.get(baseURL + "financialYearMaster/get-all")
      .then((r) => setFinancialYearList(r.data.content.financialYearMaster || []))
      .catch(() => setFinancialYearList([]));

    api.get(baseURL + "financialYearMaster/get-is-default")
      .then((r) => {
        const fy = r.data.content;
        if (fy) setData((p) => ({ ...p, financialYearMasterId: fy.financialYearMasterId }));
      })
      .catch(() => {});
  }, []);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const saveSuccess = () => {
    Swal.fire({ icon: "success", title: t("Saved successfully") });
  };

  const saveError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
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
        grainageMasterId: data.grainageMasterId,
        financialYearMasterId: data.financialYearMasterId,
        monthNo: data.monthNo,
        staffCost: data.staffCost === "" ? 0 : data.staffCost,
        otherCost: data.otherCost === "" ? 0 : data.otherCost,
        income: data.income === "" ? 0 : data.income,
        dcbIncome: data.dcbIncome === "" ? 0 : data.dcbIncome,
        mysoreRaceCocoonValue: data.mysoreRaceCocoonValue === "" ? 0 : data.mysoreRaceCocoonValue,
        chemicalEggSheetCost: data.chemicalEggSheetCost === "" ? 0 : data.chemicalEggSheetCost,
        electricityCost: data.electricityCost === "" ? 0 : data.electricityCost,
        fuelCost: data.fuelCost === "" ? 0 : data.fuelCost,
        mysoreRaceEggsValue: data.mysoreRaceEggsValue === "" ? 0 : data.mysoreRaceEggsValue,
      };
      api
        .post(baseURLSeedDfl + `grainage-monthly-cost/save-info`, payload)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({ ...EMPTY });
            setValidated(false);
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

  const clear = () => setData({ ...EMPTY });

  return (
    <Layout title={t("Grainage Monthly Cost")}>
      <style>{grainageMonthlyCostFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Grainage Monthly Cost")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/grainage-monthly-cost-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Card className="sh-section-card">
            <Card.Header className="sh-section-header">
              <Icon name="coins" />
              <span>{t("Grainage Monthly Cost")}</span>
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

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="dcbIncome">{t("DCB Income")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="dcbIncome"
                        name="dcbIncome"
                        value={data.dcbIncome}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter DCB Income")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="mysoreRaceCocoonValue">{t("Mysore Race Cocoon Value")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="mysoreRaceCocoonValue"
                        name="mysoreRaceCocoonValue"
                        value={data.mysoreRaceCocoonValue}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Mysore Race Cocoon Value")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="chemicalEggSheetCost">{t("Chemical + Egg Sheet Cost")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="chemicalEggSheetCost"
                        name="chemicalEggSheetCost"
                        value={data.chemicalEggSheetCost}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Chemical + Egg Sheet Cost")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="electricityCost">{t("Electricity Cost")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="electricityCost"
                        name="electricityCost"
                        value={data.electricityCost}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Electricity Cost")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="fuelCost">{t("Fuel Cost")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="fuelCost"
                        name="fuelCost"
                        value={data.fuelCost}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Fuel Cost")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="mysoreRaceEggsValue">{t("Mysore Race Eggs Value")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="mysoreRaceEggsValue"
                        name="mysoreRaceEggsValue"
                        value={data.mysoreRaceEggsValue}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        step="any"
                        placeholder={t("Enter Mysore Race Eggs Value")}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="gap-col sh-actions-bar">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
                <Button type="submit" variant="primary" className="sh-save-btn">
                  <Icon name="save" />
                  <span>{t("Save")}</span>
                </Button>
              </li>
              <li>
                <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                  <Icon name="cross" />
                  <span>{t("Cancel")}</span>
                </Button>
              </li>
            </ul>
          </div>
        </Form>
      </Block>
    </Layout>
  );
}

const grainageMonthlyCostFormStyles = `
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
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-section-card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .sh-section-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    padding: 14px 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    font-size: 15px !important;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-form-wrap .card-body {
    padding: 20px !important;
  }
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #33475b;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1px solid #d9e2ec;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6;
    box-shadow: 0 0 0 3px rgba(59, 141, 214, 0.15);
  }
  .sh-actions-bar {
    margin-top: 8px;
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
  }
`;

export default GrainageMonthlyCost;
