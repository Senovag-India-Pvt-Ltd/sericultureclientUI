import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScSubSchemeDetails() {
  // Translation
  const { t } = useTranslation();

  const [data, setData] = useState({
    scSchemeDetailsId: "",
    subSchemeName: "",
    subSchemeNameInKannada: "",
    subSchemeType:"",
    subSchemeStartDate:"",
    subSchemeEndDate:"",
    dbtCode: "",
    withLand: "",
    beneficiaryType: "",
    allowMultipleSanction: "",
    schemeForReeling: "",
    calculationBasedOn: "",
    workOrderForScheme: "",
    sanctionOrderForScheme: "",
    unitForScheme: "",
    acknowledgementForScheme: "",
  });

  const startOfYear = new Date(new Date().getFullYear(), 0, 1);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
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
      // event.stopPropagation();
      api
        .post(baseURL + `scSubSchemeDetails/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
                scSchemeDetailsId: "",
                subSchemeName: "",
                subSchemeNameInKannada: "",
                subSchemeType:"",
                subSchemeStartDate:"",
                subSchemeEndDate:"",
                dbtCode: "",
                withLand: "",
                beneficiaryType: "",
                allowMultipleSanction: "",
                schemeForReeling: "",
                calculationBasedOn: "",
                workOrderForScheme: "",
                sanctionOrderForScheme: "",
                unitForScheme: "",
                acknowledgementForScheme: "",
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
        scSchemeDetailsId: "",
        subSchemeName: "",
        subSchemeNameInKannada: "",
        subSchemeType:"",
        subSchemeStartDate:"",
        subSchemeEndDate:"",
        dbtCode: "",
        withLand: "",
        beneficiaryType: "",
        allowMultipleSanction: "",
        schemeForReeling: "",
        calculationBasedOn: "",
        workOrderForScheme: "",
        sanctionOrderForScheme: "",
        unitForScheme: "",
        acknowledgementForScheme: "",
    });
  };

  const handleCheckBox = (e) => {
    // setFarmerAddress({ ...farmerAddress, defaultAddress: e.target.checked });
    setData((prev) => ({
      ...prev,
      withLand: e.target.checked,
    }));
  };

   const handleMultipleSanctionCheckBox = (e) => {
    // setFarmerAddress({ ...farmerAddress, defaultAddress: e.target.checked });
    setData((prev) => ({
      ...prev,
      allowMultipleSanction: e.target.checked,
    }));
  };

  const handleSanctionForReelingCheckBox = (e) => {
    // setFarmerAddress({ ...farmerAddress, defaultAddress: e.target.checked });
    setData((prev) => ({
      ...prev,
      sanctionForReeling: e.target.checked,
    }));
  };

  // to get Scheme Details
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `scSchemeDetails/get-all`)
      .then((response) => {
        setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
      })
      .catch((err) => {
        setScSchemeDetailsListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("#");
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
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Component Type">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Component Type")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-sub-scheme-details-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-sub-scheme-details-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        <Form noValidate validated={validated} onSubmit={postData}>
          {/* <Form action="#"> */}
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">

                
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Scheme Details")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="scSchemeDetailsId"
                          value={data.scSchemeDetailsId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.scSchemeDetailsId === undefined || data.scSchemeDetailsId === "0"
                          }
                        >
                          <option value="">{t("Select Scheme Details")}</option>
                          {scSchemeDetailsListData.map((list) => (
                            <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                              {list.schemeName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Scheme name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="subSchemeName">
                      {t("Component Type")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="subSchemeName"
                          type="text"
                          name="subSchemeName"
                          value={data.subSchemeName}
                          onChange={handleInputs}
                          placeholder={t("Enter Component Type")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Component Type is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="subSchemeNameInKannada">
                      {t("Component Type In Kannada")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="subSchemeNameInKannada"
                          type="text"
                          name="subSchemeNameInKannada"
                          value={data.subSchemeNameInKannada}
                          onChange={handleInputs}
                          placeholder={t("Enter Component Type")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Component Type In Kannada is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="subSchemeType">
                        Sub Scheme Type
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="subSchemeType"
                          type="text"
                          name="subSchemeType"
                          value={data.subSchemeType}
                          onChange={handleInputs}
                          placeholder="Enter Sub Scheme Type"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Sub Scheme Type is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                      {t("Scheme Type")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="subSchemeType"
                          value={data.subSchemeType}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
                          isInvalid={
                            data.subSchemeType === undefined || data.subSchemeType === "0"
                          }
                        >
                          <option value="0">{t("Select Scheme Type")}</option>
                          <option value="1">Subsidy</option>
                          <option value="2">Incentives</option>
                          <option value="3">Bonus</option>
                          <option value="4">Seed Cocoon</option>
                         
                        </Form.Select>
                      </div>
                      {/* <Form.Control.Feedback type="invalid">
                        Sub Scheme Type is required
                        </Form.Control.Feedback> */}
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
                            <option value="Silk Incentive-PSF">Silk Incentive-PSF</option>
                            <option value="IMCB-PSF">IMCB-PSF</option>
                            <option value="ICB-PSF">ICB-PSF</option>
                            <option value="MERM-PSF">MERM-PSF</option>
                            <option value="Atomatic Reeling Machine">Atomatic Reeling Machine</option>
                            <option value="Adopting Boiler">Adopting Boiler</option>
                            <option value="Reeling Shed-PSF">Reeling Shed-PSF</option>
                            <option value="Adopting Heat Recovery Unit-PSF">Adopting Heat Recovery Unit-PSF</option>
                            <option value="Adopting Boiler-PSF">Adopting Boiler-PSF</option>
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
                            <option value="Silk Incentive-PSF">Silk Incentive-PSF</option>
                            <option value="IMCB">IMCB-PSF</option>
                            <option value="ICB">ICB-PSF</option>
                            <option value="MERM">MERM-PSF</option>
                            <option value="Atomatic Reeling Machine">Atomatic Reeling Machine</option>
                            <option value="Adopting Boiler">Adopting Boiler</option>
                            <option value="Reeling Shed-PSF">Reeling Shed-PSF</option>
                            <option value="Adopting Heat Recovery Unit-PSF">Adopting Heat Recovery Unit-PSF</option>
                            <option value="Adopting Boiler-PSF">Adopting Boiler-PSF</option>
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
                            <option value="Silk Incentive-PSF">Silk Incentive-PSF</option>
                            <option value="IMCB-PSF">IMCB-PSF</option>
                            <option value="ICB-PSF">ICB-PSF</option>
                            <option value="MERM-PSF">MERM-PSF</option>
                            <option value="Atomatic Reeling Machine">Atomatic Reeling Machine</option>
                            <option value="Adopting Boiler">Adopting Boiler</option>
                            <option value="Reeling Shed-PSF">Reeling Shed-PSF</option>
                            <option value="Adopting Heat Recovery Unit-PSF">Adopting Heat Recovery Unit-PSF</option>
                            <option value="Adopting Boiler-PSF">Adopting Boiler-PSF</option>
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
                            <option value="Silk Incentive-PSF">Silk Incentive-PSF</option>
                            <option value="IMCB-PSF">IMCB-PSF</option>
                            <option value="ICB-PSF">ICB-PSF</option>
                            <option value="MERM-PSF">MERM-PSF</option>
                            <option value="Atomatic Reeling Machine">Atomatic Reeling Machine</option>
                            <option value="Adopting Boiler">Adopting Boiler</option>
                            <option value="Reeling Shed-PSF">Reeling Shed-PSF</option>
                            <option value="Adopting Heat Recovery Unit-PSF">Adopting Heat Recovery Unit-PSF</option>
                            <option value="Adopting Boiler-PSF">Adopting Boiler-PSF</option>

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
                          Scheme For Unit Cost
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
                              Select Scheme For Unit Cost
                            </option>
                            <option value="PDMC">PDMC</option>
                            <option value="PMKSY">PMKSY</option>
                            <option value="Sericulture Development Programme">Sericulture Development Programme</option>
                            <option value="Silk Samagra State">Silk Samagra State</option>
                            <option value="Silk Samagra Central">Silk Samagra Central</option>
                            <option value="Bivoltine Bonus">Bivoltine Bonus</option>
                            <option value="Silk Incentive-PSF">Silk Incentive-PSF</option>
                            <option value="IMCB-PSF">IMCB-PSF</option>
                            <option value="ICB-PSF">ICB-PSF</option>
                            <option value="MERM-PSF">MERM-PSF</option>
                            <option value="Atomatic Reeling Machine">Atomatic Reeling Machine</option>
                            <option value="Adopting Boiler">Adopting Boiler</option>
                            <option value="Reeling Shed-PSF">Reeling Shed-PSF</option>
                            <option value="Adopting Heat Recovery Unit-PSF">Adopting Heat Recovery Unit-PSF</option>
                            <option value="Adopting Boiler-PSF">Adopting Boiler-PSF</option>
                          </Form.Select>
                          {/* <Form.Control.Feedback type="invalid">
                          Test Results is required
                          </Form.Control.Feedback> */}
                        </div>
                      </Form.Group>
                    </Col>
                  
                  <Col lg="2">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="subSchemeStartDate">
                          {t("Sub Scheme Start Date")}<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                        <DatePicker
                          selected={data.subSchemeStartDate}
                          onChange={(date) =>
                            handleDateChange(date, "subSchemeStartDate")
                          }
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              // minDate={new Date()}
                              minDate={startOfYear}
                              required
                            />
                          </div>
                          <Form.Control.Feedback type="invalid">
                          {t("Sub Scheme Start Date is Required")}
                      </Form.Control.Feedback>
                          </Form.Group>
                          
                        </Col>

                        <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="subSchemeEndDate">
                                {t("Sub Scheme End Date")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                            <DatePicker
                              selected={data.subSchemeEndDate}
                              onChange={(date) =>
                                handleDateChange(date, "subSchemeEndDate")
                              }
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              minDate={startOfYear}
                              required
                            />
                          </div>
                          <Form.Control.Feedback type="invalid">
                          {t("Sub Scheme End Date is Required")}
                        </Form.Control.Feedback>
                          </Form.Group>
                          
                        </Col>



                       <Row className="form-group mt-4">
                        {/* With Land */}
                        <Col sm={2} className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            id="withLand"
                            checked={data.withLand}
                            onChange={handleCheckBox}
                            className="me-2"
                          />
                          <Form.Label htmlFor="withLand" className="mb-0">
                            {t("With Land")}
                          </Form.Label>
                        </Col>

                        {/* Allow Multiple Sanction Order */}
                        <Col sm={2} className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            id="allowMultipleSanction"
                            checked={data.allowMultipleSanction}
                            onChange={handleMultipleSanctionCheckBox}
                            className="me-2"
                          />
                          <Form.Label htmlFor="allowMultipleSanction" className="mb-0">
                            {t("Allow Multiple Sanction Order")}
                          </Form.Label>
                        </Col>

                        {/* Sanction for Reeling */}
                        <Col sm={2} className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            id="sanctionForReeling"
                            checked={data.sanctionForReeling}
                            onChange={handleSanctionForReelingCheckBox}
                            className="me-2"
                          />
                          <Form.Label htmlFor="sanctionForReeling" className="mb-0">
                            {t("Sanction for Reeling")}
                          </Form.Label>
                        </Col>
                      </Row>

                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                  {t("save")}
                  </Button>
                </li>
                <li>
                  {/* <Link to="/seriui/district-list" className="btn btn-secondary border-0">
                    Cancel
                  </Link> */}
                  <Button type="button" variant="secondary" onClick={clear}>
                  {t("cancel")}
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

export default ScSubSchemeDetails;
