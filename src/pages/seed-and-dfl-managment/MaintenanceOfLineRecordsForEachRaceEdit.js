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

const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;
  const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
  const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION_FRUITS;

function MaintenanceOfLineRecordsForEachRaceEdit() {
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

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      
      if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
        return;
      }
      api
        .post(baseURLSeedDfl + `LineRecord/update-info`, data)
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
                noOfDfls: ""
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
        noOfDfls: "" 
    });
  }

  
  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    // const chowki_id = chawkiList.chowki_id;
    const response = api
      .get(baseURLSeedDfl + `LineRecord/get-info-by-id/${id}`)
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
    <Layout title="Edit Maintenance of Line records for each race">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Maintenance of Line records for each race</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Maintenance-of-Line-Records-for-Each-Race-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Maintenance-of-Line-Records-for-Each-Race-List"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
              <Card>
                <Card.Header>Maintenance of Line records for each race</Card.Header>
                  <Card.Body>
                      <Row className="g-gs">
                      <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Farmer’s name<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerName"
                            name="farmerName"
                            value={data.farmerName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Farmer’s name"
                            required
                          />
                           <Form.Control.Feedback type="invalid">
                          Farmer Name is required
                        </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
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
                    </Col>

                    <Col lg="4">
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

                          

                <Col lg="4">
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
                        {/* <Form.Control.Feedback type="invalid">
                        Lot Number is required
                      </Form.Control.Feedback> */}
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                {/* <Col lg="4">
                            <Form.Group className="form-group  mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Lot Number<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="lotNumber"
                                  value={data.lotNumber}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Lot Number"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                Lot Number is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col> */}

                        <Col lg="4">
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
                          </Col>

                      <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Market<span className="text-danger">*</span>
                        </Form.Label>
                        <Col>
                          <div className="form-control-wrap">
                            <Form.Select
                              name="marketMasterId"
                              value={data.marketMasterId}
                              onChange={handleInputs}
                              onBlur={() => handleInputs}
                              required
                            >
                              <option value="">Select Market</option>
                              {marketListData && marketListData.length?(marketListData.map((list) => (
                                <option
                                  key={list.marketMasterId}
                                  value={list.marketMasterId}
                                >
                                  {list.marketMasterName}
                                </option>
                              ))):""}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Market is required
                            </Form.Control.Feedback>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>


                    <Col lg="4">
                            <Form.Group className="form-group  mt-n4">
                              <Form.Label htmlFor="sordfl">
                              Number Of DFLs<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="noOfDfls"
                                  value={data.noOfDfls}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter  Number Of DFLs"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                Number Of DFLs is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>


                    

                          <Col lg="4">
                            <Form.Group className="form-group  mt-n4">
                              <Form.Label htmlFor="sordfl">
                                No. of cocoons selected<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="noOfCocoonsSelected"
                                  value={data.noOfCocoonsSelected}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Enter No. of cocoons selected"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                No. of cocoons is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                              Single Cocoon Weight in Grams<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="averageWeight"
                                  value={data.averageWeight}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Enter Single Cocoon Weight in Grams"
                                  required
                                  />
                                  <Form.Control.Feedback type="invalid">
                                  Single Cocoon Weight in Grams is required
                                  </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                Date of selection of Cocoon<span className="text-danger">*</span>
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


              <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Update
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
                  </Button>
                </li>
              </ul>
            </div>

        </Form>
      </Block>
    </Layout>
  );
}

export default MaintenanceOfLineRecordsForEachRaceEdit;