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

const baseURLMaster = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function RearingofDFLsforthe8Lines() {
  const [data, setData] = useState({
    disinfectantMasterId: "",
    cropDetail: "",
    cropNumber: "",
    lotNumber: "",
    numberOfDFLs: "",
    laidOnDate: "",
    coldStorageDetails: "",
    releasedOnDate: "",
    chawkiPercentage: "",
    wormWeightInGrams: "",
    spunOnDate: "",
    wormTestDatesAndResults: "",
    cropFailureDetails: "",
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
        .post(baseURLSeedDfl + `8linesController/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
              disinfectantMasterId: "",
              cropDetail: "",
              cropNumber: "",
              lotNumber: "",
              numberOfDFLs: "",
              laidOnDate: "",
              coldStorageDetails: "",
              releasedOnDate: "",
              chawkiPercentage: "",
              wormWeightInGrams: "",
              spunOnDate: "",
              wormTestDatesAndResults: "",
              cropFailureDetails: "",
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
      disinfectantMasterId: "",
      cropDetail: "",
      cropNumber: "",
      lotNumber: "",
      numberOfDFLs: "",
      laidOnDate: "",
      coldStorageDetails: "",
      releasedOnDate: "",
      chawkiPercentage: "",
      wormWeightInGrams: "",
      spunOnDate: "",
      wormTestDatesAndResults: "",
      cropFailureDetails: "",
    });
  };

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

   // to get Disinfectant
   const [disinfectantListData, setDisinfectantListData] = useState([]);

   const getDisinfectantList = () => {
     const response = api
       .get(baseURLMaster + `disinfectantMaster/get-all`)
       .then((response) => {
        setDisinfectantListData(response.data.content.disinfectantMaster);
       })
       .catch((err) => {
        setDisinfectantListData([]);
       });
   };
 
   useEffect(() => {
    getDisinfectantList();
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

  return (
    <Layout title=" Rearing of DFLs for the 8 lines">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2"> Rearing of DFLs for the 8 lines</Block.Title>
            
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Rearing-of-DFLs-for-the-8-Lines-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Rearing-of-DFLs-for-the-8-Lines-List"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
            Rearing of DFLs for the 8 lines
                </Card.Header>
                    <Card.Body>
                        <Row className="g-gs">
                  <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Disinfectant Usage Details
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="disinfectantMasterId"
                          value={data.disinfectantMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
                        >
                          <option value="">Select Disinfectant Usage Details</option>
                          {disinfectantListData && disinfectantListData.length?(disinfectantListData.map((list) => (
                            <option key={list.disinfectantMasterId} value={list.disinfectantMasterId}>
                              {list.disinfectantMasterName}
                            </option>
                          ))): ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Disinfectant Usage Details is required
                      </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Crop Detail<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="cropDetail"
                                  value={data.cropDetail}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Crop Detail"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                Crop Detail is required
                                  </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Crop number<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="cropNumber"
                                  value={data.cropNumber}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Enter Crop number"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                Crop number is required
                                  </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

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
                </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Number of DFLs<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="numberOfDFLs"
                                  value={data.numberOfDFLs}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Enter Number of DFLs"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                Number of DFLs is required
                                  </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                              Cold Storage Details<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="coldStorageDetails"
                                  value={data.coldStorageDetails}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Cold Storage Details"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                Cold Storage Details is required
                                  </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Chawki percentage<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="chawkiPercentage"
                                  value={data.chawkiPercentage}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Enter Chawki percentage "
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                 Chawki percentage  is required
                                  </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Worm weight (In grms)<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="wormWeightInGrams"
                                  value={data.wormWeightInGrams}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Enter Worm weight (In grms)"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                Worm weight (In grms) is required
                                  </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Worm Tests Dates And results<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="lineYear"
                                  name="wormTestDatesAndResults"
                                  value={data.wormTestDatesAndResults}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Worm Tests Dates And results"
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                 Worm Tests Dates And results is required
                            </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Cocoon assessment details<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="cocoonAssessmentDetails"
                                  value={data.cocoonAssessmentDetails}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Cocoon assessment details"
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                 Cocoon assessment details is required
                            </Form.Control.Feedback> 
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Crop failure details<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="cropFailureDetails"
                                  value={data.cropFailureDetails}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Crop failure details"
                                  required
                                />
                                 <Form.Control.Feedback type="invalid">
                                 Crop failure details is required
                            </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          
                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Laid on (L/O) date<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.laidOnDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "laidOnDate")
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
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4 ">
                              <Form.Label> Released on <span className="text-danger">*</span></Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.releasedOnDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "releasedOnDate")
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
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Spun on date<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.spunOnDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "spunOnDate")
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
                    Save
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

export default RearingofDFLsforthe8Lines;
