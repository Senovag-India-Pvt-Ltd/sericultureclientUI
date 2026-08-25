import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function NewTraderLicenseEdit() {
  // Translation
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  // let name, value;
  // const handleInputs = (e) => {
  //   name = e.target.name;
  //   value = e.target.value;
  //   setData({ ...data, [name]: value });
  // };
  const handleInputs = (e) => {
    const { name, value } = e.target;

    if (name === "ifscCode" && (value.length < 11 || value.length > 11)) {
        e.target.classList.add("is-invalid");
        e.target.classList.remove("is-valid");
    } else if (name === "ifscCode" && value.length === 11) {
        e.target.classList.remove("is-invalid");
        e.target.classList.add("is-valid");
    }

    if (name === "branchName") {
        setData({ ...data, [name]: value.toUpperCase() });
    } else if (name === "ifscCode") {
        setData({ ...data, [name]: value.toUpperCase() });
    } else {
        setData({ ...data, [name]: value });
    }
};

  const handleDateChange = (newDate) => {
    setData({ ...data, applicationDate: newDate });
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
        .post(baseURL2 + `trader-license/edit`, data)
        .then((response) => {
          updateSuccess();
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
          setData({
            arnNumber: "",
            traderTypeMasterId: "",
            firstName: "",
            middleName: "",
            lastName: "",
            fatherName: "",
            districtId: "",
            stateId: "",
            address: "",
            premisesDescription: "",
            applicationDate: "2023-11-09T12:59:58.303+00:00",
            applicationNumber: "",
            traderLicenseNumber: "",
            representativeDetails: "",
            licenseFee: "",
            licenseChallanNumber: "",
            godownDetails: "",
            silkExchangeMahajar: "",
            licenseNumberSequence: "",
            silkType: "", 
            marketMasterId: "",
            mobileNumber:"",
            branchName: "",
            virtualAccountNumber: "",
            ifscCode: "", 
            gstNumber: "",
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
              updateError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      arnNumber: "",
      traderTypeMasterId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      fatherName: "",
      districtId: "",
      stateId: "",
      address: "",
      premisesDescription: "",
      applicationDate: "2023-11-09T12:59:58.303+00:00",
      applicationNumber: "",
      traderLicenseNumber: "",
      representativeDetails: "",
      licenseFee: "",
      licenseChallanNumber: "",
      godownDetails: "",
      silkExchangeMahajar: "",
      licenseNumberSequence: "",
      silkType: "", 
      marketMasterId: "",
      mobileNumber:"",
      branchName: "",
      virtualAccountNumber: "",
      ifscCode: "", 
      gstNumber:"",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `trader-license/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  // to get traderType Unit
  const [traderTypeListData, setTraderTypeListData] = useState([]);

  const getTraderTypeList = () => {
    const response = api
      .get(baseURL + `traderTypeMaster/get-all`)
      .then((response) => {
        setTraderTypeListData(response.data.content.traderTypeMaster);
      })
      .catch((err) => {
        setTraderTypeListData([]);
      });
  };

  useEffect(() => {
    getTraderTypeList();
  }, []);

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `state/get-all`)
      .then((response) => {
        setStateListData(response.data.content.state);
      })
      .catch((err) => {
        setStateListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
    const response = api
      .get(baseURL + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    getMarketList();
  }, []);

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = (_id) => {
    const response = api
      .get(baseURL + `district/get-by-state-id/${_id}`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.stateId) {
      getDistrictList(data.stateId);
    }
  }, [data.stateId]);

  const navigate = useNavigate();

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    })
  };
  const updateError = (message) => {
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
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("/seriui/issue-new-trader-license-list"));
  };

  return (
    <Layout title="New Trader License Edit">
      <style>{traderFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("New Trader License Edit")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/issue-new-trader-license-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/issue-new-trader-license-list"
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
                <Icon name="user" />
                <span>{t("Trader Details")}</span>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <Row className="g-gs">
                    <Col lg="6">
                      
                      <Form.Group className="form-group">
                        <Form.Label>
                        {t("Trader Type")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="traderTypeMasterId"
                            value={data.traderTypeMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.traderTypeMasterId === undefined ||
                              data.traderTypeMasterId === "0"
                            }
                          >
                            <option value="">{t("Select Trader Type")}</option>
                            {traderTypeListData.map((list) => (
                              <option
                                key={list.traderTypeMasterId}
                                value={list.traderTypeMasterId}
                              >
                                {i18n.language === "kn"
                                  ? list.traderTypeNameInKannada
                                  : list.traderTypeMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          {t("Trader Type is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="sordfl">
                          {t("Application Date")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.applicationDate ? new Date(data.applicationDate) : null}
                            onChange={(date) =>
                              handleDateChange(date, "applicationDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            // maxDate={new Date()}
                            className="form-control"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="firstName">
                        {t("Name of the Applicant")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="firstName"
                            name="firstName"
                            value={data.firstName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Name of the Applicant")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Name of the Applicant is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="fatherName">
                        {t("Father's Name")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="fatherName"
                            name="fatherName"
                            value={data.fatherName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Father's Name")}
                          />
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                      <Form.Label htmlFor="fatherName">
                      {t("mobile_number")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="mobileNumber"
                          name="mobileNumber"
                          value={data.mobileNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("enter_mobile_number")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                            Mobile Number is required
                          </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                    </Col>
 

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>{t("state")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="stateId"
                            value={data.stateId}
                            onChange={handleInputs}
                          >
                            <option value="0">{t("select_state")}</option>
                            {stateListData.map((list) => (
                              <option key={list.stateId} value={list.stateId}>
                                {i18n.language === "kn"
                                  ? list.stateNameInKannada
                                  : list.stateName}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>{t("district")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="districtId"
                            value={data.districtId}
                            onChange={handleInputs}
                          >
                            <option value="">{t("select_district")}</option>
                            {districtListData.length
                              ? districtListData.map((list) => (
                                  <option
                                    key={list.districtId}
                                    value={list.districtId}
                                  >
                                    {i18n.language === "kn"
                                      ? list.districtNameInKannada
                                      : list.districtName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="address">{t("address")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="address"
                            name="address"
                            value={data.address}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_address")}
                          />
                        </div>
                      </Form.Group>
                      </Col>

                      {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                      {t("Market")}<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="marketMasterId"
                            value={data.marketMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.marketMasterId === undefined ||
                              data.marketMasterId === "0"
                            }
                          >
                            <option value="">{t("Select Market")}</option>
                            {marketListData.map((list) => (
                              <option
                                key={list.marketMasterId}
                                value={list.marketMasterId}
                              >
                                {i18n.language === "kn"
                                  ? list.marketNameInKannada
                                  : list.marketMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          {t("Market is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col> */}

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="premisesDescription">
                        {t("Premises Description")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="premisesDescription"
                            name="premisesDescription"
                            value={data.premisesDescription}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Premises Description")}
                          />
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>{t("Silk Type")}</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="silkType"
                            value={data.silkType}
                            onChange={handleInputs}
                          >
                            <option value="">{t("Select Silk Type")}</option>
                            <option value="Raw Silk">{t("Raw Silk")}</option>
                            <option value="Twisted">{t("Twisted")}</option>
                            <option value="Dupion">{t("Dupion")}</option>
                          </Form.Select>
                        </div>
                      </Form.Group>
                  </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="applicationNumber">
                        {t("Application Number")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="applicationNumber"
                            name="applicationNumber"
                            value={data.applicationNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Application Number")}
                          />
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="traderLicenseNumber">
                        {t("Trader License Number")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="traderLicenseNumber"
                            name="traderLicenseNumber"
                            value={data.traderLicenseNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Trader License Number")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          {t("Trader License Number is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="representativeDetails">
                        {t("Representative Details")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="representativeDetails"
                            name="representativeDetails"
                            value={data.representativeDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Representative Details")}
                          />
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="licenseFee">
                        {t("License Fee")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="licenseFee"
                            name="licenseFee"
                            value={data.licenseFee}
                            onChange={handleInputs}
                            type="number"
                            placeholder={t("Enter License Fee")}
                          />
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="licenseChallanNumber">
                        {t("License Challan Number")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="licenseChallanNumber"
                            name="licenseChallanNumber"
                            value={data.licenseChallanNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Challan Number")}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("License Challan Number is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="godownDetails">
                        {t("Godown Details")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="godownDetails"
                            name="godownDetails"
                            value={data.godownDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Godown Details")}
                          />
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="silkExchangeMahajar">
                        {t("Corresponding Silk Exchange Mahajar")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="silkExchangeMahajar"
                            name="silkExchangeMahajar"
                            value={data.silkExchangeMahajar}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Corresponding Silk Exchange Mahajar")}
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="gstNumber">
                              {t("GST Number")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="gstNumber"
                                name="gstNumber"
                                value={data.gstNumber}
                                onChange={handleInputs}
                                type="text"
                                placeholder={t("Enter GST Number")}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>

             <Block className="mt-3">
                        <Card>
                          <Card.Header className="sh-section-header">
                            <Icon name="wallet" />
                            <span>{t("Virtual Bank Account Details")}</span>
                          </Card.Header>
                          <Card.Body>
                          <Row className="g-gs">
                          <Col lg="6">
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="virtualAccountNumber">
                          {t("Virtual Account Number")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="virtualAccountNumber"
                            name="virtualAccountNumber"
                            value={data.virtualAccountNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Virtual Account Number")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                           {t("Virtual Account Number is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
      
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="branchNamevb">
                        {t("branch_name")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="branchNamevb"
                            name="branchName"
                            value={data.branchName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("enter_branch_name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Branch Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
      
                    <Col lg="6">
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="ifscCodevb">
                        {t("ifsc_code")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="ifscCodevb"
                            name="ifscCode"
                            value={data.ifscCode}
                            onChange={handleInputs}
                            type="text"
                            maxLength="11"
                            placeholder={t("enter_ifsc_code")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            IFSC Code is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
      
                      <Form.Group className="form-group mt-3">
                        <Form.Label>
                          {t("Market")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="marketMasterId"
                            // value={data.marketMasterId}
                            value={data.marketMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.marketMasterId === undefined ||
                              data.marketMasterId === "0"
                            }
                          >
                            <option value="">{t("Select Market")}</option>
                            {marketListData.length
                              ? marketListData.map((list) => (
                                  <option
                                    key={list.marketMasterId}
                                    value={list.marketMasterId}
                                  >
                                    {i18n.language === "kn"
                                      ? list.marketNameInKannada
                                      : list.marketMasterName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("Market is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                          </Row>
                          </Card.Body>
                        </Card>
                        </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary" className="shadow-sm px-4 py-2">
                    <Icon name="check" className="me-1" />
                    {t("update")}
                  </Button>
                </li>
                <li>
                <Button type="button" variant="secondary" className="sh-cancel-btn shadow-sm px-4 py-2" onClick={clear}>
                  <Icon name="cross" className="me-1" />
                  {t( "Clear")}
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

const traderFormStyles = `
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
    margin-bottom: 18px;
  }
  .sh-form-wrap .card-header {
    border-bottom: none !important;
  }
  .sh-form-wrap .card-body {
    padding: 20px !important;
  }
  .sh-form-wrap .form-label {
    font-size: 13px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 10px !important;
    border: 1.5px solid #d8e0ec !important;
    background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important;
    font-size: 13.5px;
    color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-form-wrap .form-control::placeholder {
    color: #a7b0c0;
    font-weight: 400;
  }
  .sh-form-wrap .form-control:hover:not(:disabled):not([readonly]),
  .sh-form-wrap .form-select:hover:not(:disabled) {
    border-color: #a9c4e0 !important;
    background-color: #ffffff !important;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #2b7ac0 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important;
    outline: none;
  }
  .sh-form-wrap .form-control[readonly],
  .sh-form-wrap .form-control:read-only,
  .sh-form-wrap .form-select:disabled {
    background-color: #f1f5fa !important;
    border-color: #e4e9f2 !important;
    color: #8a96a8 !important;
    cursor: not-allowed;
  }
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-form-wrap .text-danger {
    font-weight: 700;
    margin-left: 3px;
  }
  .sh-form-wrap .btn-primary {
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.3px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .btn-primary:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    transition: background-color 0.15s ease, color 0.15s ease,
      transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-cancel-btn:hover:not(:disabled),
  .sh-cancel-btn:focus:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(227, 73, 106, 0.32);
  }
  .sh-form-wrap table {
    border-radius: 8px;
    overflow: hidden;
  }
  .sh-form-wrap table thead th {
    background-color: #eef4fc !important;
    color: #2b3a55 !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.2px;
    border-bottom: 2px solid #d6e3f3 !important;
  }
  .sh-form-wrap table tbody tr:hover {
    background-color: #f7faff !important;
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
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
`;

export default NewTraderLicenseEdit;
