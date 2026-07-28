import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;
// const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;


function TestingOfMoth() {
  const [data, setData] = useState({
    lotNumber: "",
    pebrineFreeStatusOfPupaAndMoth: "",
    sourceDetails: "",
    stage: "",
    numberOfBeds: "",
    numberOfDiseasedBeds: "",
    examinationDate: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  // const handleDateChange = (newDate) => {
  //   setData({ ...data, applicationDate: newDate });
  // };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURLSeedDfl + `Testing/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
                lotNumber: "",
                pebrineFreeStatusOfPupaAndMoth: "",
                sourceDetails: "",
                stage: "",
                numberOfBeds: "",
                numberOfDiseasedBeds: "",
                examinationDate: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
        lotNumber: "",
        pebrineFreeStatusOfPupaAndMoth: "",
        sourceDetails: "",
        stage: "",
        numberOfBeds: "",
        numberOfDiseasedBeds: "",
        examinationDate: "",
    });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    const response = api
      .get(baseURLSeedDfl + `EggPreparation/get-all-lot-number-list`)
      .then((response) => {
        setLotListData(response.data);
      })
      .catch((err) => {
        setLotListData([]);
      });
  };

  useEffect(() => {
    getLotList();
  }, []);

  
  const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: message,
    });
  };
  const saveError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  const { t } = useTranslation();

  return (
    <Layout title={t("Testing Of Moth/Pupa")}>
      <style>{testingOfMothFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Testing Of Moth/Pupa")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/testing-of-moth-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/testing-of-moth-list"
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
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          {/* <Row className="g-3 "> */}
          <Card className="sh-section-card">
            <Card.Header className="sh-section-header">
              <Icon name="search" />
              <span>{t("Testing Of Moth/Pupa")}</span>
            </Card.Header>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">
                <Col lg="4" >
                  <Form.Group className="form-group ">
                    <Form.Label htmlFor="plotNumber">
                      {t("Lot Number")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="lotNumber"
                        name="lotNumber"
                        value={data.lotNumber}
                        onChange={handleInputs}
                        // maxLength="12"
                        type="text"
                        placeholder={t("Enter Lot Number")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Lot Number is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                {/* <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label>
                    Lot Number<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                        >
                          <option value="">Select Lot Number</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option
                              key={list.id}
                              value={list.lotNumber}
                            >
                              {list.lotNumber}
                            </option>
                          ))):""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Lot Number is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col> */}


                {/* <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      Pebrine Free Status Of Pupa & Moth
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="pebrinePupaMoth"
                        name="pebrineFreeStatusOfPupaAndMoth"
                        value={data.pebrineFreeStatusOfPupaAndMoth}
                        onChange={handleInputs}
                        // maxLength="4"
                        type="text"
                        placeholder="Enter Pebrine Free Status Of Pupa & Moth"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Pebrine Free Status Of Pupa & Moth is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}

                <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label>
                              {t("Pebrine Free Status Of Pupa & Moth")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="pebrineFreeStatusOfPupaAndMoth"
                                  value={data.pebrineFreeStatusOfPupaAndMoth}
                                  onChange={handleInputs}
                                  required
                                  isInvalid={
                                    data.pebrineFreeStatusOfPupaAndMoth === undefined ||
                                    data.pebrineFreeStatusOfPupaAndMoth === "0"
                                  }
                                >
                                  <option value="">
                                    {t("Select Pebrine Free Status Of Pupa & Moth")}
                                  </option>
                                  <option value="Diseased">{t("Diseased")}</option>
                                  <option value="Disease-Free">{t("Disease-Free")}</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                {t("Pebrine Free Status Of Pupa & Moth is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="invoiceDetails">
                      {t("Source Details")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="sourceDetails"
                        name="sourceDetails"
                        value={data.sourceDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Source Details")}
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                      Source Details is required
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label>
                      {t("Examination Stage")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="stage"
                        value={data.stage}
                        onChange={handleInputs}
                        required
                      >
                        <option value="">{t("Select Examination Stage")}</option>
                        <option value="COCOON">{t("Cocoon Test")}</option>
                        <option value="MOTH">{t("Moth Test")}</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {t("Examination Stage is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="numberOfBeds">
                      {t("Number of Beds")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfBeds"
                        name="numberOfBeds"
                        value={data.numberOfBeds}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        placeholder={t("Enter Number of Beds")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="numberOfDiseasedBeds">
                      {t("Number of Diseased Beds")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfDiseasedBeds"
                        name="numberOfDiseasedBeds"
                        value={data.numberOfDiseasedBeds}
                        onChange={handleInputs}
                        type="number"
                        min="0"
                        placeholder={t("Enter Number of Diseased Beds")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="examinationDate">
                      {t("Examination Date")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="examinationDate"
                        name="examinationDate"
                        value={data.examinationDate ? String(data.examinationDate).slice(0, 10) : ""}
                        onChange={handleInputs}
                        type="date"
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
                {/* <Button type="button" variant="primary" onClick={postData}> */}
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
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}

const testingOfMothFormStyles = `
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
    margin-bottom: 20px;
  }
  .sh-section-card .card-body {
    padding: 20px !important;
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
  .sh-actions-bar {
    margin-top: 6px;
  }
  .sh-save-btn,
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 8px;
    font-weight: 600;
    padding: 8px 22px;
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-save-btn:hover {
    box-shadow: 0 6px 16px rgba(30, 103, 168, 0.35);
    transform: translateY(-1px);
  }
`;

export default TestingOfMoth;
