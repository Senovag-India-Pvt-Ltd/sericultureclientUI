import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon, Select } from "../../../components";
import DatePicker from "react-datepicker";
// import axios from "axios";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function NewTraderLicense() {
  // Translation
  const { t, i18n } = useTranslation();

  const [vbAccountList, setVbAccountList] = useState([]);
  const [vbAccount, setVbAccount] = useState({
    virtualAccountNumber: "",
    branchName: "",
    ifscCode: "",
    marketMasterId: "",
  });

  const [validatedVbAccount, setValidatedVbAccount] = useState(false);
  const [validatedVbAccountEdit, setValidatedVbAccountEdit] = useState(false);

  const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
  
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAdd = (e) => {
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        setValidatedVbAccount(true);
      } else {
        e.preventDefault();
        if (vbAccount.ifscCode.length < 11 || vbAccount.ifscCode.length > 11) {
          return;
        }
        setVbAccountList((prev) => [...prev, vbAccount]);
        setVbAccount({
          virtualAccountNumber: "",
          branchName: "",
          ifscCode: "",
          marketMasterId: "",
        });
        setShowModal(false);
        setValidatedVbAccount(false);
      }
    };

    const handleDelete = (i) => {
        setVbAccountList((prev) => {
          const newArray = prev.filter((item, place) => place !== i);
          return newArray;
        });
      };
    
      const [vbId, setVbId] = useState();
      const handleGet = (i) => {
        setVbAccount(vbAccountList[i]);
        setShowModal2(true);
        setVbId(i);
      };

      const handleUpdate = (e, i, changes) => {
        setVbAccountList((prev) =>
          prev.map((item, ix) => {
            if (ix === i) {
              return { ...item, ...changes };
            }
            return item;
          })
        );
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
          e.preventDefault();
          e.stopPropagation();
          setValidatedVbAccountEdit(true);
        } else {
          e.preventDefault();
          if (vbAccount.ifscCode.length < 11 || vbAccount.ifscCode.length > 11) {
            return;
          }
          setShowModal2(false);
          setValidatedVbAccountEdit(false);
          setVbAccount({
            virtualAccountNumber: "",
            branchName: "",
            ifscCode: "",
            marketMasterId: "",
          });
        }
      };

      const handleVbInputs = (e) => {
        const { name, value } = e.target;
        // setVbAccount({ ...vbAccount, [name]: value });
    
        if (name === "ifscCode" && (value.length < 11 || value.length > 11)) {
          e.target.classList.add("is-invalid");
          e.target.classList.remove("is-valid");
        } else if (name === "ifscCode" && value.length === 11) {
          e.target.classList.remove("is-invalid");
          e.target.classList.add("is-valid");
        }
        if(name === "branchName"){
          setVbAccount({ ...vbAccount, [name]: value.toUpperCase() });
        }
        else if(name === "ifscCode"){
          setVbAccount({ ...vbAccount, [name]: value.toUpperCase() });
        }
        else{
          setVbAccount({ ...vbAccount, [name]: value });
        } 
      
      };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const [data, setData] = useState({
    arnNumber: "",
    traderTypeMasterId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    fatherName: "",
    districtId: "",
    stateId: "",
    address: "",
    marketMasterId: "",
    mobileNumber:"",
    premisesDescription: "",
    applicationDate: "",
    applicationNumber: "",
    traderLicenseNumber: "",
    representativeDetails: "",
    licenseFee: "",
    licenseChallanNumber: "",
    godownDetails: "",
    silkExchangeMahajar: "",
    licenseNumberSequence: "",
    silkType: "",
    gstNumber: "",
    traderLicenseDetailsRequests: [],
  });

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
      const { applicationDate } = data;
      const formattedDate =
      applicationDate.getFullYear() +
        "-" +
        (applicationDate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        applicationDate.getDate().toString().padStart(2, "0");

    const updatedData = {
      ...data,
      traderLicenseDetailsRequests: vbAccountList,
      applicationDate: formattedDate,
    };
      api
        .post(baseURL2 + `trader-license/add`, updatedData)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            const arnNumber = response.data.content.arnNumber;
            saveSuccess(arnNumber);
            clear();
          }
          setValidated(false);
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
      arnNumber: "",
      traderTypeMasterId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      fatherName: "",
      districtId: "",
      stateId: "",
      address: "",
      marketMasterId: "",
      mobileNumber:"",
      premisesDescription: "",
      applicationDate: "",
      applicationNumber: "",
      traderLicenseNumber: "",
      representativeDetails: "",
      licenseFee: "",
      licenseChallanNumber: "",
      godownDetails: "",
      silkExchangeMahajar: "",
      licenseNumberSequence: "",
      silkType: "",
      gstNumber: "",
    });
    virtualAccountClear();
  };

  const virtualAccountClear = () => {
    setVbAccount({
      virtualAccountNumber: "",
      branchName: "",
      ifscCode: "",
      marketMasterId: "",
    });
    setVbAccountList([]);
  };


   // Handle Options
  // Market
  const handleMarketOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setVbAccount({
      ...vbAccount,
      marketMasterId: chooseId,
      marketMasterName: chooseName,
    });
  };

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
  const saveSuccess = (arnNumber) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: `Generated ARN Number is ${arnNumber}`,
      // text: "You clicked the button!",
    })
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
    <Layout title="New Trader License">
      <style>{traderFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("New Trader License")}
              </Block.Title>
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
                <span>{t("Enter Trader Details")}</span>
              </Card.Header>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    {/* <Form.Group className="form-group">
                      <Form.Label htmlFor="arnNumber">ARN Number</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="arnNumber"
                          name="arnNumber"
                          value={data.arnNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter ARN Number"
                        />
                      </div>
                    </Form.Group> */}

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
                            selected={data.applicationDate}
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
                      <Form.Label> {t("district")}</Form.Label>
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
                      <Form.Label htmlFor="licenseFee">{t("License Fee")}</Form.Label>
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
              </Card.Body>
            </Card>
            {/* </Block> */}

             <Block className="mt-3">
                          <Card>
                            <Card.Header className="sh-section-header">
                              <Icon name="wallet" />
                              <span>{t("Virtual Bank Account")}</span>
                            </Card.Header>
                            <Card.Body>
                              {/* <h3>Virtual Bank account</h3> */}
                              <Row className="g-gs mb-1">
                                <Col lg="6">
                                  <Form.Group className="form-group mt-1">
                                    <div className="form-control-wrap"></div>
                                  </Form.Group>
                                </Col>
            
                                <Col lg="6">
                                  <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-3">
                                    <div className="form-control-wrap">
                                      <ul className="">
                                        <li>
                                          <Button
                                            className="d-md-none"
                                            size="md"
                                            variant="primary"
                                            onClick={handleShowModal}
                                          >
                                            <Icon name="plus" />
                                            <span> {t("add")}</span>
                                          </Button>
                                        </li>
                                        <li>
                                          <Button
                                            className="d-none d-md-inline-flex"
                                            variant="primary"
                                            onClick={handleShowModal}
                                          >
                                            <Icon name="plus" />
                                            <span> {t("add")}</span>
                                          </Button>
                                        </li>
                                      </ul>
                                    </div>
                                  </Form.Group>
                                </Col>
                              </Row>
                              {vbAccountList.length > 0 ? (
                                <Row className="g-gs">
                                  <Block>
                                    <Card>
                                      <div
                                        className="table-responsive"
                                        // style={{ paddingBottom: "30px" }}
                                      >
                                        <table className="table small">
                                          <thead>
                                            <tr style={{ backgroundColor: "#f1f2f7" }}>
                                              {/* <th></th> */}
                                              <th>{t("Action")}</th>
                                              <th>{t("Virtual Account Number")}</th>
                                              <th>{t("branch_name")}</th>
                                              <th>{t("ifsc_code")}</th>
                                              <th>{t("Market")}</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {vbAccountList.map((item, i) => (
                                              <tr>
                                                <td>
                                                  <div>
                                                    <Button
                                                      variant="primary"
                                                      size="sm"
                                                      onClick={() => handleGet(i)}
                                                    >
                                                      {t("edit")}
                                                    </Button>
                                                    <Button
                                                      variant="danger"
                                                      size="sm"
                                                      onClick={() => handleDelete(i)}
                                                      className="ms-2"
                                                    >
                                                      {t("delete")}
                                                    </Button>
                                                  </div>
                                                </td>
                                                <td>{item.virtualAccountNumber}</td>
                                                <td>{item.branchName}</td>
                                                <td>{item.ifscCode}</td>
                                                <td>{item.marketMasterName}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </Card>
                                  </Block>
                                </Row>
                              ) : (
                                ""
                              )}
                            </Card.Body>
                          </Card>
                        </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary" className="shadow-sm px-4 py-2">
                    <Icon name="check" className="me-1" />
                    {t("save")}
                  </Button>
                </li>
                <li>
                <Button
                  type="button"
                  variant="secondary"
                  className="sh-cancel-btn shadow-sm px-4 py-2"
                  onClick={clear}
                >
                  <Icon name="cross" className="me-1" />
                  {t( "Clear")}
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered contentClassName="sh-modal-content">
              <Modal.Header closeButton>
                <Modal.Title>
                  <Icon name="wallet" className="me-1" />
                  {t("Add Virtual Bank Account Details")}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* <Form action="#"> */}
                <Form noValidate validated={validatedVbAccount} onSubmit={handleAdd}>
                  <Row className="g-5 px-5">
                    <Col lg="6">
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="virtualAccountNumber">
                        {t("Virtual Account Number")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="virtualAccountNumber"
                            name="virtualAccountNumber"
                            value={vbAccount.virtualAccountNumber}
                            onChange={handleVbInputs}
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
                            value={vbAccount.branchName}
                            onChange={handleVbInputs}
                            type="text"
                            placeholder={t("enter_branch_name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Branch Name is required")}
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
                            value={vbAccount.ifscCode}
                            onChange={handleVbInputs}
                            type="text"
                            maxLength="11"
                            placeholder={t("enter_ifsc_code")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("IFSC Code is required and equals to 11 digit")}
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
                            // value={vbAccount.marketMasterId}
                            value={`${vbAccount.marketMasterId}_${vbAccount.marketMasterName}`}
                            onChange={handleMarketOption}
                            onBlur={() => handleMarketOption}
                            required
                            isInvalid={
                              vbAccount.marketMasterId === undefined ||
                              vbAccount.marketMasterId === "0"
                            }
                          >
                            <option value="">{t("Select Market")}</option>
                            {marketListData.length
                              ? marketListData.map((list) => (
                                  <option
                                    key={list.marketMasterId}
                                    value={`${list.marketMasterId}_${list.marketMasterName}`}
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
      
                    <Col lg="12">
                      <div className="d-flex justify-content-center gap g-2 sh-modal-footer">
                        <div className="gap-col">
                          {/* <Button variant="success" onClick={handleAdd}> */}
                          <Button type="submit" variant="success">
                            <Icon name="plus" className="me-1" />
                            {t("add")}
                          </Button>
                        </div>
                        {/* <div className="gap-col">
                          <Button variant="danger" onClick={handleCloseModal1}>
                            Reject
                          </Button>
                        </div> */}
                        <div className="gap-col">
                          <Button variant="secondary" onClick={handleCloseModal}>
                            <Icon name="cross" className="me-1" />
                            {t("cancel")}
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
            </Modal>
      
            <Modal show={showModal2} onHide={handleCloseModal2} size="lg" centered contentClassName="sh-modal-content">
              <Modal.Header closeButton>
                <Modal.Title>
                  <Icon name="wallet" className="me-1" />
                  {t("Edit Virtual Bank Account")}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* <Form action="#"> */}
                <Form
                  noValidate
                  validated={validatedVbAccountEdit}
                  onSubmit={(e) => handleUpdate(e, vbId, vbAccount)}
                >
                  <Row className="g-5 px-5">
                    <Col lg="6">
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="virtualAccountNumber">
                          {t("Virtual Account Number")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="virtualAccountNumber"
                            name="virtualAccountNumber"
                            value={vbAccount.virtualAccountNumber}
                            onChange={handleVbInputs}
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
                            value={vbAccount.branchName}
                            onChange={handleVbInputs}
                            type="text"
                            placeholder={t("enter_branch_name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Branch Name is required")}
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
                            value={vbAccount.ifscCode}
                            onChange={handleVbInputs}
                            type="text"
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
                            // value={vbAccount.marketMasterId}
                            value={`${vbAccount.marketMasterId}_${vbAccount.marketMasterName}`}
                            onChange={handleMarketOption}
                            onBlur={() => handleMarketOption}
                            required
                            isInvalid={
                              vbAccount.marketMasterId === undefined ||
                              vbAccount.marketMasterId === "0"
                            }
                          >
                            <option value="">{t("Select Market")}</option>
                            {marketListData.length
                              ? marketListData.map((list) => (
                                  <option
                                    key={list.marketMasterId}
                                    value={`${list.marketMasterId}_${list.marketMasterName}`}
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
      
                    <Col lg="12">
                      <div className="d-flex justify-content-center gap g-2 sh-modal-footer">
                        <div className="gap-col">
                          {/* <Button
                            variant="success"
                            onClick={() => handleUpdate(vbId, vbAccount)}
                          > */}
                          <Button type="submit" variant="success">
                            <Icon name="check" className="me-1" />
                            {t("update")}
                          </Button>
                        </div>
                        {/* <div className="gap-col">
                          <Button variant="danger" onClick={handleCloseModal1}>
                            Reject
                          </Button>
                        </div> */}
                        <div className="gap-col">
                          <Button variant="secondary" onClick={handleCloseModal2}>
                            <Icon name="cross" className="me-1" />
                            {t("cancel")}
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
            </Modal>
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
  .sh-section-header .icon,
  .sh-modal-content .modal-header svg,
  .sh-modal-content .modal-header .icon {
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
  .modal-backdrop.show {
    background-color: #0c2844;
    opacity: 0.75;
  }
  .sh-modal-content {
    border-radius: 12px !important;
    border: 1px solid #e3ebf6 !important;
    overflow: hidden;
  }
  .sh-modal-content .modal-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-bottom: none;
    padding: 16px 22px;
  }
  .sh-modal-content .modal-header .btn-close {
    filter: brightness(0) invert(1);
    opacity: 0.85;
  }
  .sh-modal-content .modal-header .btn-close:hover {
    opacity: 1;
  }
  .sh-modal-content .modal-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.3px;
    color: #ffffff;
  }
  .sh-modal-content .modal-body {
    padding: 22px 24px;
  }
  .sh-modal-content .form-label {
    font-size: 13px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .sh-modal-content .form-control,
  .sh-modal-content .form-select {
    border-radius: 10px !important;
    border: 1.5px solid #d8e0ec !important;
    background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important;
    font-size: 13.5px;
    color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-modal-content .form-control::placeholder {
    color: #a7b0c0;
    font-weight: 400;
  }
  .sh-modal-content .form-control:hover:not(:disabled):not([readonly]),
  .sh-modal-content .form-select:hover:not(:disabled) {
    border-color: #a9c4e0 !important;
    background-color: #ffffff !important;
  }
  .sh-modal-content .form-control:focus,
  .sh-modal-content .form-select:focus {
    border-color: #2b7ac0 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important;
    outline: none;
  }
  .sh-modal-content .form-control[readonly],
  .sh-modal-content .form-control:read-only,
  .sh-modal-content .form-select:disabled {
    background-color: #f1f5fa !important;
    border-color: #e4e9f2 !important;
    color: #8a96a8 !important;
    cursor: not-allowed;
  }
  .sh-modal-content .form-control.is-invalid,
  .sh-modal-content .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-modal-content .text-danger {
    font-weight: 700;
    margin-left: 3px;
  }
  .sh-modal-content .btn-primary {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.2);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-modal-content .btn-primary:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 103, 168, 0.3);
  }
  .sh-modal-content .btn-success {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.2);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-modal-content .btn-success:not(:disabled):hover {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(30, 103, 168, 0.3);
  }
  .sh-modal-content .btn-secondary {
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-modal-content .btn-secondary:hover:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(227, 73, 106, 0.28);
  }
  .sh-modal-content table {
    border-radius: 8px;
    overflow: hidden;
  }
  .sh-modal-content table thead th {
    background-color: #eef4fc !important;
    color: #2b3a55 !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.2px;
    border-bottom: 2px solid #d6e3f3 !important;
  }
  .sh-modal-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 10px;
    padding-top: 18px;
    border-top: 1px solid #eef1f6;
  }
`;

export default NewTraderLicense;
