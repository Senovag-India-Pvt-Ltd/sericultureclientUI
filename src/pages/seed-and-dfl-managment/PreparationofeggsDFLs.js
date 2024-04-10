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

const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function PreparationofeggsDFLs() {
  const [data, setData] = useState({
    grainageNameAndAddress: "",
    lotNumberYear: "",
    numberOfCocoonsCB: "",
    dateOfMothEmergence: "",
    laidOnDate: "",
    eggSheetSerialNumber: "",
    numberOfPairs: "",
    numberOfRejection: "",
    dflsObtained: "",
    eggRecoveryPercentage: "",
    examinationDetails: "",
    testResults: "",
    certification: "",
    additionalRemarks: "",
    parentLotNumber: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
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
      api
        .post(baseURL2 + `EggPreparation/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              grainageNameAndAddress: "",
              lotNumberYear: "",
              numberOfCocoonsCB: "",
              dateOfMothEmergence: "",
              laidOnDate: "",
              eggSheetSerialNumber: "",
              numberOfPairs: "",
              numberOfRejection: "",
              dflsObtained: "",
              eggRecoveryPercentage: "",
              examinationDetails: "",
              testResults: "",
              certification: "",
              additionalRemarks: "",
              parentLotNumber: "",
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
      grainageNameAndAddress: "",
      lotNumberYear: "",
      numberOfCocoonsCB: "",
      dateOfMothEmergence: "",
      laidOnDate: "",
      eggSheetSerialNumber: "",
      numberOfPairs: "",
      numberOfRejection: "",
      dflsObtained: "",
      eggRecoveryPercentage: "",
      examinationDetails: "",
      testResults: "",
      certification: "",
      additionalRemarks: "",
      parentLotNumber: "",
    });
  };

  

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };


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
    <Layout title="Preparation of eggs (DFLs)">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2"> Preparation of eggs (DFLs) </Block.Title>
           
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Preparation-of-eggs-DFLs-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Preparation-of-eggs-DFLs-List"
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
              Preparation Of Eggs
            </Card.Header>
            <Card.Body>
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Name of the Grainage and Address
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                   id="grainageNameAndAddress"
                                  name="grainageNameAndAddress"
                                  value={data.grainageNameAndAddress}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Name of the Grainage and Address"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Lot number/Year
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="plotNumber"
                                  name="lotNumberYear"
                                  value={data.lotNumberYear}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter  Lot number/Year"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Number of Cocoons (CB, Hybrid)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfCocoonsCB"
                                  name="numberOfCocoonsCB"
                                  value={data.numberOfCocoonsCB}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Number of Cocoons (CB, Hybrid)"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Date of moth emergence
                              </Form.Label>
                              <div className="Date of moth emergence">
                                <DatePicker
                                  selected={data.dateOfMothEmergence}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfMothEmergence")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  maxDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Laid On Date
                              </Form.Label>
                              <div className="Laid On Date">
                                <DatePicker
                                  selected={data.laidOnDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "laidOnDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  maxDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Egg sheet serial number
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="eggSheetSerialNumber"
                                  name="eggSheetSerialNumber"
                                  value={data.eggSheetSerialNumber}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Egg sheet serial number"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Number of pairs
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfPairs"
                                  name="numberOfPairs"
                                  value={data.numberOfPairs}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Number of pairs"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group ">
                              <Form.Label> Number of Rejection</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                   id="numberOfRejection"
                                  name="numberOfRejection"
                                  value={data.numberOfRejection}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Number of Rejection"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                DFLs obtained
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="dflsObtained"
                                  name="dflsObtained"
                                  value={data.dflsObtained}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter DFLs obtained"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Egg Recovery %
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                 id="eggRecoveryPercentage"
                                name="eggRecoveryPercentage"
                                value={data.eggRecoveryPercentage}
                                onChange={handleInputs}
                                type="text"
                                placeholder="Enter Egg Recovery %"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Examination details (Date, etc)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="examinationDetails"
                                  name="examinationDetails"
                                  value={data.examinationDetails}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter  Examination details (Date, etc)"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Test results
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="testResults"
                                  value={data.testResults}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Test results"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Certification (Yes/No)
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="certification"
                                  name="certification"
                                  value={data.plotNumber}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Certification (Yes/No)"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Additional remarks
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="additionalRemarks"
                                  value={data.additionalRemarks}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter additional Remarks"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                               Parent Lot Number
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  name="parentLotNumber"
                                  value={data.parentLotNumber}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Parent Lot Number"
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
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}

export default PreparationofeggsDFLs;
