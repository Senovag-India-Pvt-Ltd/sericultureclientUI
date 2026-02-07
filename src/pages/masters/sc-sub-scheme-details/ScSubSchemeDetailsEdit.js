import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScSubSchemeDetailsEdit() {
  // Translation
  const { t } = useTranslation();

  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const startOfYear = new Date(new Date().getFullYear(), 0, 1);

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const isDataFromSet = !!data.subSchemeStartDate;
  const isDataToSet = !!data.subSchemeEndDate;
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
  const form = event.currentTarget;
  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    return;
  }

  event.preventDefault();

  const payload = {
  ...data,
  sanctionEnable: data.sanctionEnable ? 0 : 1,
};



  api
    .post(baseURL + `scSubSchemeDetails/edit`, payload)
    .then((response) => {
      if (response.data.content?.error) {
        updateError(response.data.content.error_description);
      } else {
        updateSuccess();
        setValidated(false);
      }
    })
    .catch((err) => {
      if (err.response?.data?.validationErrors) {
        updateError(err.response.data.validationErrors);
      }
    });
};


  // ✅ FIX 1 — Safe Date Parsing Helper (Prevents “Invalid time value”)
  const safeDate = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
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
        // withLand: "",
        beneficiaryType: "",
        // allowMultipleSanction: "",
        schemeForReeling: "",
        calculationBasedOn: "",
        workOrderForScheme: "",
        sanctionOrderForScheme: "",
        unitForScheme: "",
        acknowledgementForScheme: "",
        admGovtOrder: "",
    schemeCircularNo: "",
    deptDelegationNo: "",
    allotReleaseNo: "",
    admGovtDate: "",
    schemeCircularDate: "",
    deptDelegationDate: "",
    allotReleaseDate: "",
    sanctionEnable: false,
    withLand: false,
allowMultipleSanction: false,
sanctionForReeling: false,
    });
  };

  // ✅ FIX 3 — Safe Date Conversion When Fetching Data
  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL + `scSubSchemeDetails/get/${id}`)
      .then((response) => {
        const content = response.data.content;

        const sanitizedData = {
  ...content,

sanctionEnable: content.sanctionEnable === 0 || content.sanctionEnable == null,
  withLand: !!content.withLand,
  allowMultipleSanction: !!content.allowMultipleSanction,
  sanctionForReeling: !!content.sanctionForReeling,

  subSchemeStartDate: safeDate(content.subSchemeStartDate),
  subSchemeEndDate: safeDate(content.subSchemeEndDate),
  admGovtDate: safeDate(content.admGovtDate),
  schemeCircularDate: safeDate(content.schemeCircularDate),
  deptDelegationDate: safeDate(content.deptDelegationDate),
  allotReleaseDate: safeDate(content.allotReleaseDate),
};


        setData(sanitizedData);
        setLoading(false);
      })
      .catch((err) => {
        const message =
          err.response?.data?.errorMessages?.[0]?.message?.[0]?.message ||
          "Error fetching data";
        setData({});
        editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);


  // //   to get data from api
  // const getIdList = () => {
  //   setLoading(true);
  //   const response = api
  //     .get(baseURL + `scSubSchemeDetails/get/${id}`)
  //     .then((response) => {
  //       setData(response.data.content);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       const message = err.response.data.errorMessages[0].message[0].message;
  //       setData({});
  //       editError(message);
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   getIdList();
  // }, [id]);

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

  const handleSanctionEnableCheckBox = (e) => {
  setData((prev) => ({
    ...prev,
    sanctionEnable: e.target.checked,
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

  const updateSuccess = () => {
  Swal.fire({
    icon: "success",
    title: "Updated successfully",
  }).then(() => {
    getIdList();   // ✅ re-fetch updated data
  });
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
    }).then(() => navigate("#"));
  };
  return (
    <Layout title="Edit Component Type">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit Component Type")}</Block.Title>
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
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
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
                        {t("Scheme Name is required")}
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
                          placeholder={t("Enter  Component Type")}
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
                            <option value="Reeling Shed-PSF">Reeling Shed-PSF</option>
                            <option value="Adopting Heat Recovery Unit-PSF">Adopting Heat Recovery Unit-PSF</option>
                            <option value="Adopting Boiler-PSF">Adopting Boiler-PSF</option>
                            <option value="Adopting Silent Generator">Adopting Silent Generator</option>
                            <option value="Adopting Solar power Generator">Adopting Solar power Generator</option>
                            <option value="Adopting Solar Water Heater">Adopting Solar Water Heater</option>
                            <option value="Incentive For Bivoltine Cocoons-30/kg-PSF">Incentive For Bivoltine Cocoons-30/kg-PSF</option>
                            <option value="North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP">North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP</option>
                            <option value="MSC Chawki incentive Unit cost for 100 DFLs Rs.1500">MSC Chawki incentive Unit cost for 100 DFLs Rs.1500</option>
                            <option value="Incentive For Bivoltine Chawki Rearing Cost">Incentive For Bivoltine Chawki Rearing Cost</option>
                             <option value="Registered Private Bivoltine Chawki Rearing Center Subsidy">Registered Private Bivoltine Chawki Rearing Center Subsidy</option>
                            <option value="Rearing Equipment SS">Rearing Equipment SS</option>
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
                            <option value="IMCB-PSF">IMCB-PSF</option>
                            <option value="ICB-PSF">ICB-PSF</option>
                            <option value="MERM-PSF">MERM-PSF</option>
                            <option value="Atomatic Reeling Machine">Atomatic Reeling Machine</option>
                            <option value="Reeling Shed-PSF">Reeling Shed-PSF</option>
                            <option value="Adopting Heat Recovery Unit-PSF">Adopting Heat Recovery Unit-PSF</option>
                            <option value="Adopting Boiler-PSF">Adopting Boiler-PSF</option>
                            <option value="Adopting Silent Generator">Adopting Silent Generator</option>
                            <option value="Adopting Solar power Generator">Adopting Solar power Generator</option>
                            <option value="Adopting Solar Water Heater">Adopting Solar Water Heater</option>
                            <option value="Incentive For Bivoltine Cocoons-30/kg-PSF">Incentive For Bivoltine Cocoons-30/kg-PSF</option>
                            <option value="North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP">North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP</option>
                            <option value="MSC Chawki incentive Unit cost for 100 DFLs Rs.1500">MSC Chawki incentive Unit cost for 100 DFLs Rs.1500</option>
                            <option value="Incentive For Bivoltine Chawki Rearing Cost">Incentive For Bivoltine Chawki Rearing Cost</option>
                             <option value="Registered Private Bivoltine Chawki Rearing Center Subsidy">Registered Private Bivoltine Chawki Rearing Center Subsidy</option>
                             <option value="Rearing Equipment SS">Rearing Equipment SS</option>
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
                            <option value="Reeling Shed-PSF">Reeling Shed-PSF</option>
                            <option value="Adopting Heat Recovery Unit-PSF">Adopting Heat Recovery Unit-PSF</option>
                            <option value="Adopting Boiler-PSF">Adopting Boiler-PSF</option>
                            <option value="Adopting Silent Generator">Adopting Silent Generator</option>
                            <option value="Adopting Solar power Generator">Adopting Solar power Generator</option>
                            <option value="Adopting Solar Water Heater">Adopting Solar Water Heater</option>
                            <option value="Incentive For Bivoltine Cocoons-30/kg-PSF">Incentive For Bivoltine Cocoons-30/kg-PSF</option>
                            <option value="North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP">North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP</option>
                            <option value="MSC Chawki incentive Unit cost for 100 DFLs Rs.1500">MSC Chawki incentive Unit cost for 100 DFLs Rs.1500</option>
                            <option value="Incentive For Bivoltine Chawki Rearing Cost">Incentive For Bivoltine Chawki Rearing Cost</option>
                             <option value="Registered Private Bivoltine Chawki Rearing Center Subsidy">Registered Private Bivoltine Chawki Rearing Center Subsidy</option>
                             <option value="Rearing Equipment SS">Rearing Equipment SS</option>
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
                            <option value="Reeling Shed-PSF">Reeling Shed-PSF</option>
                            <option value="Adopting Heat Recovery Unit-PSF">Adopting Heat Recovery Unit-PSF</option>
                            <option value="Adopting Boiler-PSF">Adopting Boiler-PSF</option>
                            <option value="Adopting Silent Generator">Adopting Silent Generator</option>
                            <option value="Adopting Solar power Generator">Adopting Solar power Generator</option>
                            <option value="Adopting Solar Water Heater">Adopting Solar Water Heater</option>
                            <option value="Incentive For Bivoltine Cocoons-30/kg-PSF">Incentive For Bivoltine Cocoons-30/kg-PSF</option>
                            <option value="North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP">North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP</option>
                            <option value="MSC Chawki incentive Unit cost for 100 DFLs Rs.1500">MSC Chawki incentive Unit cost for 100 DFLs Rs.1500</option>
                            <option value="Incentive For Bivoltine Chawki Rearing Cost">Incentive For Bivoltine Chawki Rearing Cost</option>
                             <option value="Registered Private Bivoltine Chawki Rearing Center Subsidy">Registered Private Bivoltine Chawki Rearing Center Subsidy</option>
                             <option value="Rearing Equipment SS">Rearing Equipment SS</option>
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
                            <option value="Reeling Shed-PSF">Reeling Shed-PSF</option>
                            <option value="Adopting Heat Recovery Unit-PSF">Adopting Heat Recovery Unit-PSF</option>
                            <option value="Adopting Boiler-PSF">Adopting Boiler-PSF</option>
                            <option value="Adopting Silent Generator">Adopting Silent Generator</option>
                            <option value="Adopting Solar power Generator">Adopting Solar power Generator</option>
                            <option value="Adopting Solar Water Heater">Adopting Solar Water Heater</option>
                            <option value="Incentive For Bivoltine Cocoons-30/kg-PSF">Incentive For Bivoltine Cocoons-30/kg-PSF</option>
                            <option value="North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP">North Karnataka Cocoon Transportation Incentive-10/kg-PSF/SDP</option>
                            <option value="MSC Chawki incentive Unit cost for 100 DFLs Rs.1500">MSC Chawki incentive Unit cost for 100 DFLs Rs.1500</option>
                            <option value="Incentive For Bivoltine Chawki Rearing Cost">Incentive For Bivoltine Chawki Rearing Cost</option>
                             <option value="Registered Private Bivoltine Chawki Rearing Center Subsidy">Registered Private Bivoltine Chawki Rearing Center Subsidy</option>
                             <option value="Rearing Equipment SS">Rearing Equipment SS</option>
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
                          {t("Component Type Start Date")}<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                              {isDataFromSet && (
                                <DatePicker
                                  // selected={new Date(data.subSchemeStartDate)}
                                  selected={data.subSchemeStartDate ? new Date(data.subSchemeStartDate) : null}

                                  onChange={(date) =>
                                    handleDateChange(date, "subSchemeStartDate")
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
                              )}
                            </div>
                            <Form.Control.Feedback type="invalid">
                            {t("Sub Scheme Start Date is Required")}
                      </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                              {t("Component Type End Date")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                              {isDataToSet && (
                                <DatePicker
                                  selected={new Date(data.subSchemeEndDate)}
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
                              )}
                            </div>
                            <Form.Control.Feedback type="invalid">
                          {t("Sub Scheme End Date is Required")}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                      {/* 🔹 Administrative & Circular Details Section (8 fields in 2 rows, spaced labels) */}
                    <Row className="mt-3">
                      <h6 className="fw-bold mb-3"> </h6>
                    
                      {/* 🔸 Row 1: Four Text Inputs */}
                      <Col lg="6" className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label className="mb-2">{t("Administrative Government Order No")}</Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              type="text"
                              name="admGovtOrder"
                              value={data.admGovtOrder}
                              onChange={handleInputs}
                              placeholder={t("Enter Administrative Government Order No")}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    
                      <Col lg="6" className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label className="mb-2">{t("Scheme Circular No")}</Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              type="text"
                              name="schemeCircularNo"
                              value={data.schemeCircularNo}
                              onChange={handleInputs}
                              placeholder={t("Enter Scheme Circular No")}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    
                      <Col lg="6" className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label className="mb-2">{t("Department Delegation No")}</Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              type="text"
                              name="deptDelegationNo"
                              value={data.deptDelegationNo}
                              onChange={handleInputs}
                              placeholder={t("Enter Department Delegation No")}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    
                      <Col lg="6" className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label className="mb-2">{t("Allotment Release No")}</Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              type="text"
                              name="allotReleaseNo"
                              value={data.allotReleaseNo}
                              onChange={handleInputs}
                              placeholder={t("Enter Allotment Release No")}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    
                      {/* 🔸 Row 2: Four Date Pickers */}
                      {/* ✅ FIX 4 — Safe DatePicker usage */}
                    <Col lg="3" className="mb-3">
                      <Form.Group>
                        <Form.Label className="mb-2">
                          {t("Administrative Govt Date")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={safeDate(data.admGovtDate)}
                            onChange={(date) => handleDateChange(date, "admGovtDate")}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            placeholderText={t("Select Date")}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    
                      <Col lg="3" className="mb-3">
                      <Form.Group>
                        <Form.Label className="mb-2">
                          {t("Scheme Circular Date")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={safeDate(data.schemeCircularDate)}
                            onChange={(date) =>
                              handleDateChange(date, "schemeCircularDate")
                            }
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            placeholderText={t("Select Date")}
                          />
                        </div>
                      </Form.Group>
                    </Col>


                    <Col lg="3" className="mb-3">
                      <Form.Group>
                        <Form.Label className="mb-2">
                          {t("Department Delegation Date")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={safeDate(data.deptDelegationDate)}
                            onChange={(date) =>
                              handleDateChange(date, "deptDelegationDate")
                            }
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            placeholderText={t("Select Date")}
                          />
                        </div>
                      </Form.Group>
                    </Col>


                    <Col lg="3" className="mb-3">
                      <Form.Group>
                        <Form.Label className="mb-2">
                          {t("Allotment Release Date")}
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={safeDate(data.allotReleaseDate)}
                            onChange={(date) =>
                              handleDateChange(date, "allotReleaseDate")
                            }
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            placeholderText={t("Select Date")}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    </Row>
                    
                      
                    
                      {/* <Col lg="3" className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label className="mb-2">{t("Allotment Release Date")}</Form.Label>
                          <div className="form-control-wrap">
                            <DatePicker
                              selected={data.allotReleaseDate}
                              onChange={(date) => handleDateChange(date, "allotReleaseDate")}
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              placeholderText={t("Select Date")}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row> */}
                    
                    {/* 🔹 Checkboxes Section Starts Here */}
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

                        <Col sm={3} className="d-flex align-items-center">
  <Form.Check
    type="checkbox"
    id="sanctionEnable"
    checked={!!data.sanctionEnable}
    onChange={(e) =>
      setData((prev) => ({
        ...prev,
        sanctionEnable: e.target.checked,
      }))
    }
    className="me-2"
  />
  <Form.Label htmlFor="sanctionEnable" className="mb-0">
    {t("Enable Sanction")}
  </Form.Label>
</Col>

                      </Row>

                  </Row>
                )}
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                  {t("update")}
                  </Button>
                </li>
                <li>
                  {/* <Link
                    to="/seriui/district-list"
                    className="btn btn-secondary border-0"
                  >
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

export default ScSubSchemeDetailsEdit;
