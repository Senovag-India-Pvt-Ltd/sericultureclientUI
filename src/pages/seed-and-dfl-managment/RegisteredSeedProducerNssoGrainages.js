import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import axios from "axios";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;


function RegisteredSeedProducerNssoGrainages() {
  const [data, setData] = useState({
    numberOfCocoonsCB: "",
    sourceMasterId: "",
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

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "20%",
    },
  };

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURLSeedDfl + `EggPreparationRsso/add-info`, data)
        .then((response) => {
          
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.lotNumber);
            setData({
              numberOfCocoonsCB: "",
              sourceMasterId: "",
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
            // setChallan("");
            // document.getElementById("challanUploadKey").value = "";
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
      numberOfCocoonsCB: "",
      sourceMasterId: "",
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
    // setChallan("");
    // document.getElementById("challanUploadKey").value = "";
  };

  

  // to get Source 
  const [sourceListData, setSourceListData] = useState([]);

  const getSourceList = () => {
    const response = api
      .get(baseURL + `sourceMaster/get-all`)
      .then((response) => {
        setSourceListData(response.data.content.sourceMaster);
      })
      .catch((err) => {
        setSourceListData([]);
      });
  };

  useEffect(() => {
    getSourceList();
  }, []);

  

  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: `Lot Number ${message}`,
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  return (
    <Layout title="Registered Seed Producer (RSP) NSSO Grainages">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Registered Seed Producer (RSP) NSSO Grainages
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/registered-seed-producer-nsso-grainages-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/registered-seed-producer-nsso-grainages-list"
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
                  Registered Seed Producer (RSP) NSSO Grainages{" "}
                </Card.Header>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Number of Cocoons (CB, Hybrid)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfCocoonsCB"
                            name="numberOfCocoonsCB"
                            type="number"
                            value={data.numberOfCocoonsCB}
                            onChange={handleInputs}
                            placeholder="Enter Number of Cocoons CB"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Number of Cocoons CB is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Source<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="sourceMasterId"
                            value={data.sourceMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            // multiple
                            required
                            isInvalid={
                              data.sourceMasterId === undefined ||
                              data.sourceMasterId === "0"
                            }
                          >
                            <option value="">Select Source</option>
                            {sourceListData.map((list) => (
                              <option
                                key={list.sourceMasterId}
                                value={list.sourceMasterId}
                              >
                                {list.sourceMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Source is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Date of moth emergence
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
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

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
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
                            maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Egg sheet serial number
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="eggSheetSerialNumber"
                            name="eggSheetSerialNumber"
                            type="number"
                            value={data.eggSheetSerialNumber}
                            onChange={handleInputs}
                            placeholder="Enter Egg sheet serial number"                        required
                          />
                          <Form.Control.Feedback type="invalid">
                            Egg sheet serial number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Number of pairs
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfPairs"
                            name="numberOfPairs"
                            type="number"
                            value={data.numberOfPairs}
                            onChange={handleInputs}
                            placeholder="Enter Number of pairs"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Number of pairs is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Number of Rejection
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfRejection"
                            name="numberOfRejection"
                            type="number"
                            value={data.numberOfRejection}
                            onChange={handleInputs}
                            placeholder="Enter Number of Rejection"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Number of Rejection is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          DFLs obtained
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="dflsObtained"
                            name="dflsObtained"
                            type="number"
                            value={data.dflsObtained}
                            onChange={handleInputs}
                            placeholder="Enter DFLs obtained"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            DFLs obtained is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Egg Recovery %<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="eggRecoveryPercentage"
                            name="eggRecoveryPercentage"
                            type="number"
                            value={data.eggRecoveryPercentage}
                            onChange={handleInputs}
                            placeholder="Enter Egg Recovery %"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Egg Recovery % is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>


                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Test results
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="testResults"
                            name="testResults"
                            type="text"
                            value={data.testResults}
                            onChange={handleInputs}
                            placeholder="Enter Test results"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Test results is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Certification (Yes/No)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="certification"
                            name="certification"
                            type="text"
                            value={data.certification}
                            onChange={handleInputs}
                            placeholder="Enter Certification (Yes/No)"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Certification (Yes/No) is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Additional remarks
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="additionalRemarks"
                            name="additionalRemarks"
                            type="text"
                            value={data.additionalRemarks}
                            onChange={handleInputs}
                            placeholder="Enter Additional remarks"
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

export default RegisteredSeedProducerNssoGrainages;
