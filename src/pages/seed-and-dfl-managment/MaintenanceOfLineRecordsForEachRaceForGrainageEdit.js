import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable, { createTheme } from "react-data-table-component";

import { Link, useParams } from "react-router-dom";

import axios from "axios";

import { Icon, Select } from "../../components";

import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";


const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;
  const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
  const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;

function MaintenanceOfLineRecordsForEachRaceForGrainageEdit() {
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

    // if (name === "fruitsId" && (value.length < 16 || value.length > 16)) {
    //   e.target.classList.add("is-invalid");
    //   e.target.classList.remove("is-valid");
    // } else if (name === "fruitsId" && value.length === 16) {
    //   e.target.classList.remove("is-invalid");
    //   e.target.classList.add("is-valid");
    // } 
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  // const formatDate = (date) => {
  //   if (!date) return ""; // Handle null or undefined dates
  //   return (
  //     date.getFullYear() +
  //     "-" +
  //     (date.getMonth() + 1).toString().padStart(2, "0") +
  //     "-" +
  //     date.getDate().toString().padStart(2, "0")
  //   );
  // };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      
      api
        .post(baseURLSeedDfl + `LineRecordForGrainage/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
                lineNameId: "",
                raceId: "",
                fruitsId: "",
                farmerName: "",
                lotNumber: "",
                dateOfSelectionCocoon: "",
                pupaTestDetails: "",
                marketMasterId: "",
                noOfCocoonsSelected: "",
                averageWeight: "",
                numberOfDfls: "",
                numberOfDflsMale: "",
                lotNumberMale: "",
                farmerNameMale: "",
                marketMasterIdMale: "",
                noOfCocoonsSelectedMale: "",
                averageWeightMale: "",
              });
              setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () =>{
    setData({
        lineNameId: "",
        raceId: "",
        fruitsId: "",
        farmerName: "",
        lotNumber: "",
        dateOfSelectionCocoon: "",
        pupaTestDetails: "",
        marketMasterId: "",
        noOfCocoonsSelected: "",
        averageWeight: "",
        numberOfDfls: "",
        numberOfDflsMale: "",
        lotNumberMale: "",
        farmerNameMale: "",
        marketMasterIdMale: "",
        noOfCocoonsSelectedMale: "",
        averageWeightMale: "",
    });
  }

  
  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    // const chowki_id = chawkiList.chowki_id;
    const response = api
      .get(baseURLSeedDfl + `LineRecordForGrainage/get-info-by-id/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, []);

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

   // to get Lot
   const [lotListData, setLotListData] = useState([]);

   const getLotList = () => {
     const response = api
       .get(baseURLSeedDfl + `ReceiptOfDflsFromP4GrainageLinesController/get-all-lot-number-list`)
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

   // to get Generation Number
 const [generationListData, setGenerationListData] = useState([]);

 const getGenerationList = () => {
   const response = api
     .get(baseURL2 + `generationNumberMaster/get-all`)
     .then((response) => {
       setGenerationListData(response.data.content.generationNumberMaster);
     })
     .catch((err) => {
      setGenerationListData([]);
     });
 };

 useEffect(() => {
   getGenerationList();
 }, []);

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    const response = api
      .get(baseURL2 + `raceMaster/get-all`)
      .then((response) => {
        setRaceListData(response.data.content.raceMaster);
      })
      .catch((err) => {
        setRaceListData([]);
      });
  };

  useEffect(() => {
    getRaceList();
  }, []);

  // to get Line Year
 const [lineYearListData, setLineYearListData] = useState([]);

 const getLineYearList = () => {
   const response = api
     .get(baseURL2 + `lineNameMaster/get-all`)
     .then((response) => {
       setLineYearListData(response.data.content.lineNameMaster);
     })
     .catch((err) => {
      setLineYearListData([]);
     });
 };

 useEffect(() => {
   getLineYearList();
 }, []);

  // to get User
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
    const response = api
      .get(baseURL2 + `marketMaster/get-all`)
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




  const isDataSelectionSet = !!data.dateOfSelectionCocoon;

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
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
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title={t("Edit Maintenance of Line records for each race")}>
      <style>{lineRecordsForGrainageEditStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Edit Maintenance of Line records for each race")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/Maintenance-of-Line-Records-for-Each-Race-For-Grainage-List"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/Maintenance-of-Line-Records-for-Each-Race-For-Grainage-List"
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
        <Row className="g-1 ">
            <Block className="mt-3">
              <Card className="sh-section-card">
                <Card.Header className="sh-section-header">
                  <Icon name="layers" />
                  <span>{t("Maintenance of Line records for each race")}</span>
                </Card.Header>
                  <Card.Body>
                      <Row className="g-gs">
                      <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Farmer’s name")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerName"
                            name="farmerName"
                            value={data.farmerName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Farmer’s name")}
                            required
                          />
                           <Form.Control.Feedback type="invalid">
                          {t("Farmer Name is required")}
                        </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Line Name")}<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="lineNameId"
                              value={data.lineNameId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">{t("Select Line Name")}</option>
                              {lineYearListData && lineYearListData.length?(lineYearListData.map((list) => (
                                <option
                                  key={list.lineNameId}
                                  value={list.lineNameId}
                                >
                                  {list.lineName}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {t("Line Name is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Race")}<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="raceId"
                              value={data.raceId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">{t("Select Race")}</option>
                              {raceListData.map((list) => (
                                <option
                                  key={list.raceMasterId}
                                  value={list.raceMasterId}
                                >
                                  {list.raceMasterName}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              {t("Race is required")}
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Generation Number<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="generationNumberId"
                              value={data.generationNumberId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">Select Generation Number</option>
                              {generationListData && generationListData.length?(generationListData.map((list) => (
                                <option
                                  key={list.generationNumberId}
                                  value={list.generationNumberId}
                                >
                                  {list.generationNumber}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Generation Number is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col> */}

                          

                {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Lot Number
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          // onBlur={() => handleInputs}
                          // required
                        >
                          <option value="">Select Lot Number</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option key={list.id} value={list.lotNumber}>
                              {list.lotNumber}
                            </option>
                          ))): ""}
                        </Form.Select>
                        
                      </div>
                    </Col>
                  </Form.Group>
                </Col> */}

                        <Col lg="4">
                            <Form.Group className="form-group  mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Lot Number")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="lotNumber"
                                  value={data.lotNumber}
                                  onChange={handleInputs}
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

                        <Col lg="4">
                            <Form.Group className="form-group  mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Pupa Test Details")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="pupaTestDetails"
                                  value={data.pupaTestDetails}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Enter Pupa Test Details")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                Pupa Test Details is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                      <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Market")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="marketMasterId"
                              value={data.marketMasterId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              // required
                            >
                              <option value="">{t("Select Market")}</option>
                              {marketListData && marketListData.length?(marketListData.map((list) => (
                                <option
                                  key={list.marketMasterId}
                                  value={list.marketMasterId}
                                >
                                  {list.marketMasterName}
                                </option>
                              ))):""}
                            </Form.Select>
                            {/* <Form.Control.Feedback type="invalid">
                              {t("Market is required")}
                            </Form.Control.Feedback> */}
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>


                    <Col lg="4">
                            <Form.Group className="form-group  mt-n4">
                              <Form.Label htmlFor="sordfl">
                              {t("Number Of DFLs")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="numberOfDfls"
                                  value={data.numberOfDfls}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Enter Number Of DFLs")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                {t("Number Of DFLs is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>


                    

                          <Col lg="4">
                            <Form.Group className="form-group  mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("No. of cocoons selected")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="noOfCocoonsSelected"
                                  value={data.noOfCocoonsSelected}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Enter No. of cocoons selected")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                {t("No. of cocoons is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                              {t("Single Cocoon Weight in Grams")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="averageWeight"
                                  value={data.averageWeight}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Enter Single Cocoon Weight in Grams")}
                                  required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                  {t("Single Cocoon Weight in Grams is required")}
                                  </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                {t("Date of selection of Cocoon")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                              {isDataSelectionSet && (
                                <DatePicker
                                  selected={new Date(data.dateOfSelectionCocoon)}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfSelectionCocoon")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // maxDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                                )}
                              </div>
                            </Form.Group>
                          </Col>
                    </Row>
                </Card.Body>
              </Card>
              </Block>

              <Block className="mt-3">
              <Card className="sh-section-card">
                <Card.Header className="sh-section-header">
                  <Icon name="layers" />
                  <span>{t("Maintenance of Line records for each Male race")}</span>
                </Card.Header>
                <Card.Body>
                        <Row className="g-gs">

                        <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          {t("Farmer’s name")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerName"
                            name="farmerNameMale"
                            value={data.farmerNameMale}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Farmer’s name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Farmer Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                        {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Line Name<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="lineNameId"
                              value={data.lineNameId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">Select Line Name</option>
                              {lineYearListData && lineYearListData.length?(lineYearListData.map((list) => (
                                <option
                                  key={list.lineNameId}
                                  value={list.lineNameId}
                                >
                                  {list.lineName}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Line Name is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col> */}

                    {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Race<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="raceId"
                              value={data.raceId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">Select Race</option>
                              {raceListData.map((list) => (
                                <option
                                  key={list.raceMasterId}
                                  value={list.raceMasterId}
                                >
                                  {list.raceMasterName}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Race is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col> */}

                    {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Generation Number<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="generationNumberId"
                              value={data.generationNumberId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">Select Generation Number</option>
                              {generationListData && generationListData.length?(generationListData.map((list) => (
                                <option
                                  key={list.generationNumberId}
                                  value={list.generationNumberId}
                                >
                                  {list.generationNumber}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Generation Number is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col> */}

                          
                  {/* <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Lot Number
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
                        >
                          <option value="">Select Lot Number</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option key={list.id} value={list.lotNumber}>
                              {list.lotNumber}
                            </option>
                          ))): ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Lot Number is required
                      </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>  */}

                <Col lg="4">
                            <Form.Group className="form-group  mt-n4">
                              <Form.Label htmlFor="sordfl">
                              {t("Lot Number")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="lotNumberMale"
                                  value={data.lotNumberMale}
                                  onChange={handleInputs}
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
                            <Form.Group className="form-group  mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Pupa Test Details<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="pupaTestDetails"
                                  value={data.pupaTestDetails}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Pupa Test Details"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                Pupa Test Details is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col> */}

                      <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          {t("Market")}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="marketMasterIdMale"
                              value={data.marketMasterIdMale}
                              onChange={handleInputs}
                              // onBlur={() => handleInputs}
                              // required
                            >
                              <option value="">{t("Select Market")}</option>
                              {marketListData && marketListData.length?(marketListData.map((list) => (
                                <option
                                  key={list.marketMasterId}
                                  value={list.marketMasterId}
                                >
                                  {list.marketMasterName}
                                </option>
                              ))):""}
                            </Form.Select>
                            {/* <Form.Control.Feedback type="invalid">
                              {t("Market is required")}
                            </Form.Control.Feedback> */}
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                            <Form.Group className="form-group  mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Number Of DFLs")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="numberOfDflsMale"
                                  value={data.numberOfDflsMale}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Enter Number Of DFLs")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                {t("Number Of DFLs is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>


                          <Col lg="4">
                            <Form.Group className="form-group  mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("No. of cocoons selected")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="noOfCocoonsSelectedMale"
                                  value={data.noOfCocoonsSelectedMale}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Enter No. of cocoons selected")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                {t("No. of cocoons is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                              {t("Single Cocoon Weight in Grams")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="averageWeightMale"
                                  value={data.averageWeightMale}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Enter Single Cocoon Weight in Grams")}
                                  required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                  {t("Single Cocoon Weight in Grams is required")}
                                  </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          
                        </Row>
                      </Card.Body>
                    </Card>
                </Block>


              <div className="gap-col sh-actions-bar">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary" className="sh-save-btn">
                    <Icon name="save" />
                    <span>{t("Update")}</span>
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
</Row>
        </Form>
      </Block>
    </Layout>
  );
}

const lineRecordsForGrainageEditStyles = `
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

export default MaintenanceOfLineRecordsForEachRaceForGrainageEdit;