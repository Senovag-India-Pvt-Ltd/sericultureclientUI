import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import axios from "axios";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function PreparationofeggsDFLs() {

  const [validated, setValidated] = useState(false);

  const [data, setData] = useState({
    numberOfCocoonsCB: "",
    dateOfMothEmergence: "",
    laidOnDate: "",
    eggSheetSerialNumber: "",
    numberOfPairs: "",
    numberOfRejection: "",
    dflsObtained: "",
    eggRecoveryPercentage: "",
    testResults: "",
    certification: "",
    additionalRemarks: "",
  });

  const clear = () => {
    setData({
      numberOfCocoonsCB: "",
      dateOfMothEmergence: "",
      laidOnDate: "",
      eggSheetSerialNumber: "",
      numberOfPairs: "",
      numberOfRejection: "",
      dflsObtained: "",
      eggRecoveryPercentage: "",
      testResults: "",
      certification: "",
      additionalRemarks: "",
    });
    setValidated(false);
  };

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
        .post(baseURLSeedDfl + `EggPreparation/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess2(response.data.message, response.data.lotNumber);
            clear();
          }
        })
        .catch((err) => {
          if (
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

  // to get Line Name
  const [lineNameListData, setLineNameListData] = useState([]);

  const getLineYearList = () => {
    api
      .get(baseURLMasterData + `lineNameMaster/get-all`)
      .then((response) => {
        setLineNameListData(response.data.content.lineNameMaster);
      })
      .catch((err) => {
        setLineNameListData([]);
      });
  };

  useEffect(() => {
    getLineYearList();
  }, []);

  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: message,
    });
  };

  const saveSuccess2 = (message, lotNo) => {
    Swal.fire({
      icon: "success",
      title: message,
      text: `Generated Lot Number is ${lotNo}`,
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
    <Layout title="Preparation of Eggs (DFLs)">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Preparation of Eggs (DFLs)</Block.Title>
            
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

      <Block className="mt-n5">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <div>
              <Row className="g-gs">
                <Col lg="12">
                  <Block>
                    <Card>
                      <Card.Header> Preparation of Eggs (DFLs) </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="numberOfCocoonsCB">
                                Number of Cocoons (CB, Hybrid)
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfCocoonsCB"
                                  name="numberOfCocoonsCB"
                                  value={data.numberOfCocoonsCB}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Number of Cocoons (CB, Hybrid)"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Number of Cocoons (CB, Hybrid) is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="dateOfMothEmergence">
                                Date of moth emergence
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.dateOfMothEmergence}
                                  onChange={(date) =>
                                    handleDateChange(
                                      date,
                                      "dateOfMothEmergence"
                                    )
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  // minDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Date of moth emergence is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="laidOnDate">
                                Laid On Date
                                <span className="text-danger">*</span>
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
                                <Form.Control.Feedback type="invalid">
                                  Laid On Date is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="eggSheetSerialNumber">
                                Egg sheet serial number
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="eggSheetSerialNumber"
                                  name="eggSheetSerialNumber"
                                  value={data.eggSheetSerialNumber}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Egg sheet serial number"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Egg sheet serial number is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="numberOfPairs">
                                Number of pairs
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfPairs"
                                  name="numberOfPairs"
                                  value={data.numberOfPairs}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Number of pairs"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Number of pairs is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="numberOfRejection">
                                Number of Rejection
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfRejection"
                                  name="numberOfRejection"
                                  value={data.numberOfRejection}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Number of Rejection"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Number of Rejection is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="dflsObtained">
                                DFLs obtained
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="dflsObtained"
                                  name="dflsObtained"
                                  value={data.dflsObtained}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="DFLs obtained"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  DFLs obtained is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="eggRecoveryPercentage">
                                Egg Recovery %
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="eggRecoveryPercentage"
                                  name="eggRecoveryPercentage"
                                  value={data.eggRecoveryPercentage}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Egg Recovery %"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Egg Recovery % is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="testResults">
                                Test results
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="testResults"
                                  name="testResults"
                                  value={data.testResults}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Test results"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Test results is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                                Certification (Yes/No)
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="certification"
                                  value={data.certification}
                                  onChange={handleInputs}
                                  required
                                  isInvalid={
                                    data.certification === undefined ||
                                    data.certification === "0"
                                  }
                                >
                                  <option value="">
                                    Select Certification{" "}
                                  </option>
                                  <option value="1">Yes</option>
                                  <option value="2">No</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Certification is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="additionalRemarks">
                                Additional remarks
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="additionalRemarks"
                                  name="additionalRemarks"
                                  value={data.additionalRemarks}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Additional remarks"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Additional remarks is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Block>
                  <div className="gap-col mt-2">
                    <ul className="d-flex align-items-center justify-content-center gap g-3">
                      <li>
                        {/* <Button type="button" variant="primary" onClick={postData}> */}
                        <Button type="submit" variant="primary">
                          Save
                        </Button>
                      </li>
                      <li>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={clear}
                        >
                          Cancel
                        </Button>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default PreparationofeggsDFLs;
