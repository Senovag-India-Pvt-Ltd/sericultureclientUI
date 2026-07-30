import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import React from "react";
// import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScSchemeDetails() {
  // Translation
  const { t } = useTranslation();

  const [data, setData] = useState({
    schemeName: "",
    schemeNameInKannada: "",
    schemeStartDate:null,
    schemeEndDate:null,
    dbtCode: "",
    hectare: "",
    spacing: "",
    calculationBasedOn: "",
    workOrderForScheme: "",
    sanctionOrderForScheme: "",
    unitForScheme: "",
    acknowledgementForScheme: "",
    schemeCodeForSanctionOrder: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };


  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURL + `scSchemeDetails/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
                schemeName: "",
                schemeNameInKannada: "",
                schemeStartDate:null,
                schemeEndDate:null,
                dbtCode: "",
                hectare: "",
                spacing: "",
                calculationBasedOn: "",
                workOrderForScheme: "",
                sanctionOrderForScheme: "",
                unitForScheme: "",
                acknowledgementForScheme: "",
                schemeCodeForSanctionOrder: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
        schemeName: "",
        schemeNameInKannada: "",
        schemeStartDate:null,
        schemeEndDate:null,
        dbtCode: "",
        hectare: "",
        spacing: "",
        calculationBasedOn: "",
        workOrderForScheme: "",
        sanctionOrderForScheme: "",
        unitForScheme: "",
        acknowledgementForScheme: "",
        schemeCodeForSanctionOrder: "",
    });
  };

  // const handleCheckBox = (e) =>{
  //   const {name,value,checked} = e.target;
  //   setData((prev)=>({
  //     ...prev,
  //     [name]:value
  //   }))
  // }

  const handleCheckBox = (e) => {
    const { name, checked } = e.target; // Get the name and checked state from the event
    setData((prev) => ({
      ...prev,
      [name]: checked, // Dynamically update the correct field based on the checkbox name
    }));
  };
  

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
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
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Scheme Details">
      <style>{scSchemeDetailsStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Scheme Details")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/sc-scheme-details-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/sc-scheme-details-list"
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
          <Row className="g-3 ">
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="setting" />
                <span>{t("Scheme Details")}</span>
              </Card.Header>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        {t("Scheme Name")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="schemeName"
                          type="text"
                          value={data.schemeName}
                          onChange={handleInputs}
                          placeholder={t("Enter Scheme name")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Scheme Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        {t("Scheme Name in Kannada")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="schemeNameInKannada"
                          value={data.schemeNameInKannada}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Scheme Name in Kannada")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Scheme Name in Kannada is required.")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="title">
                      {t("Dbt Code")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dbtCode"
                          name="dbtCode"
                          type="text"
                          value={data.dbtCode}
                          onChange={handleInputs}
                          placeholder={t("Enter Dbt Code")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Dbt Code is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>


                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Calculation Based On
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="calculationBasedOn"
                          value={data.calculationBasedOn}
                          onChange={handleInputs}
                          // required
                          // isInvalid={
                          //   data.calculationBasedOn === undefined ||
                          //   data.calculationBasedOn === "0"
                          // }
                        >
                          <option value="">
                            Select Calculation Based On
                          </option>
                          <option value="PDMC">PDMC</option>
                          <option value="PMKSY">PMKSY</option>
                          <option value="Sericulture Development Programme">Sericulture Development Programme</option>
                          <option value="Silk Samagra State">Silk Samagra State</option>
                          <option value="Silk Samagra Central">Silk Samagra Central</option>
                          <option value="Bivoltine Bonus">Bivoltine Bonus</option>
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                        Test Results is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Scheme For Work Order
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="workOrderForScheme"
                          value={data.workOrderForScheme}
                          onChange={handleInputs}
                          // required
                          // isInvalid={
                          //   data.calculationBasedOn === undefined ||
                          //   data.calculationBasedOn === "0"
                          // }
                        >
                          <option value="">
                            Select Scheme For Work Order
                          </option>
                          <option value="PDMC">PDMC</option>
                          <option value="PMKSY">PMKSY</option>
                          <option value="Sericulture Development Programme">Sericulture Development Programme</option>
                          <option value="Silk Samagra State">Silk Samagra State</option>
                          <option value="Silk Samagra Central">Silk Samagra Central</option>
                          <option value="Bivoltine Bonus">Bivoltine Bonus</option>
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                        Test Results is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Scheme For Sanction Order 
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="sanctionOrderForScheme"
                          value={data.sanctionOrderForScheme}
                          onChange={handleInputs}
                          // required
                          // isInvalid={
                          //   data.calculationBasedOn === undefined ||
                          //   data.calculationBasedOn === "0"
                          // }
                        >
                          <option value="">
                            Select Scheme For Sanction Order
                          </option>
                          <option value="PDMC">PDMC</option>
                          <option value="PMKSY">PMKSY</option>
                          <option value="Sericulture Development Programme">Sericulture Development Programme</option>
                          <option value="Silk Samagra State">Silk Samagra State</option>
                          <option value="Silk Samagra Central">Silk Samagra Central</option>
                          <option value="Bivoltine Bonus">Bivoltine Bonus</option>
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                        Test Results is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Scheme For Acknowledgement
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="acknowledgementForScheme"
                          value={data.acknowledgementForScheme}
                          onChange={handleInputs}
                          // required
                          // isInvalid={
                          //   data.calculationBasedOn === undefined ||
                          //   data.calculationBasedOn === "0"
                          // }
                        >
                          <option value="">
                            Select Scheme For Acknowledgement
                          </option>
                          <option value="PDMC">PDMC</option>
                          <option value="PMKSY">PMKSY</option>
                          <option value="Sericulture Development Programme">Sericulture Development Programme</option>
                          <option value="Silk Samagra State">Silk Samagra State</option>
                          <option value="Silk Samagra Central">Silk Samagra Central</option>
                          <option value="Bivoltine Bonus">Bivoltine Bonus</option>
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                        Test Results is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Scheme For Unit
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="unitForScheme"
                          value={data.unitForScheme}
                          onChange={handleInputs}
                          // required
                          // isInvalid={
                          //   data.calculationBasedOn === undefined ||
                          //   data.calculationBasedOn === "0"
                          // }
                        >
                          <option value="">
                            Select Scheme For Unit
                          </option>
                          <option value="PDMC">PDMC</option>
                          <option value="PMKSY">PMKSY</option>
                          <option value="Sericulture Development Programme">Sericulture Development Programme</option>
                          <option value="Silk Samagra State">Silk Samagra State</option>
                          <option value="Silk Samagra Central">Silk Samagra Central</option>
                          <option value="Bivoltine Bonus">Bivoltine Bonus</option>
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                        Test Results is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>


                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="title">
                      {t("Scheme Code For Sanction Order")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="schemeCodeForSanctionOrder"
                          name="schemeCodeForSanctionOrder"
                          type="text"
                          value={data.schemeCodeForSanctionOrder}
                          onChange={handleInputs}
                          placeholder={t("Enter Scheme Code For Sanction Order")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Scheme Code For Sanction Order is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  

                  <Col lg="2">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl">
                          {t("Scheme Start Date")}<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                        <DatePicker
                          selected={data.schemeStartDate}
                          onChange={(date) =>
                            handleDateChange(date, "schemeStartDate")
                          }
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              // minDate={new Date()}
                              required
                            />
                          </div>
                          </Form.Group>
                          <Form.Control.Feedback type="invalid">
                          {t("Scheme Start Date is Required")}
                      </Form.Control.Feedback>
                        </Col>

                        

                        <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Scheme End Date")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                            <DatePicker
                              selected={data.schemeEndDate}
                              onChange={(date) =>
                                handleDateChange(date, "schemeEndDate")
                              }
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              // minDate={new Date(data.schemeEndDate)}
                              required
                            />
                          </div>
                          </Form.Group>
                          <Form.Control.Feedback type="invalid">
                          {t("Scheme End Date is Required")}
                        </Form.Control.Feedback>
                        </Col>                       
                </Row>

                {/* <Row>
                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="hectare"
                          checked={data.hectare}
                          id="weighmentTripletGeneration"
                          onChange={handleCheckBox}
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                        {t("Hectare")}
                      </Form.Label>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="spacing"
                          checked={data.spacing}
                          onChange={handleCheckBox}
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                        {t("spacing")}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row> */}
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary" className="sh-save-btn">
                    <Icon name="save" />
                    <span>{t("save")}</span>
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                    <Icon name="cross" />
                    <span>{t("cancel")}</span>
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

const scSchemeDetailsStyles = `
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
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important;
    color: #ffffff !important;
    padding: 14px 20px !important;
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
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #33475b;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1.5px solid #dbe4ee;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:hover,
  .sh-form-wrap .form-select:hover {
    border-color: #9fc0e0;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #1e67a8;
    box-shadow: 0 0 0 0.2rem rgba(30, 103, 168, 0.15);
  }
  .sh-form-wrap .form-control[readonly] {
    background-color: #f4f6f9;
  }
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a;
  }
  .sh-form-wrap .text-danger {
    color: #e3496a !important;
  }
  .sh-save-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-save-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(30, 103, 168, 0.32);
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-cancel-btn:hover:not(:disabled),
  .sh-cancel-btn:focus:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(227, 73, 106, 0.32);
  }
`;

export default ScSchemeDetails;
