import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function PreparationofeggsDFLsEdit() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const isDateOfMothEmergence = !!data.dateOfMothEmergence;
  const isLaidOnDate = !!data.laidOnDate;

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
        .post(baseURLSeedDfl + `EggPreparation/update-info`, data)
        .then((response) => {
          //   const trScheduleId = response.data.content.trScheduleId;
          //   if (trScheduleId) {
          //     handlePPtUpload(trScheduleId);
          //   }
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            clear();
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          updateError();
        });
      setValidated(true);
    }
  };

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
    getIdList();
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `EggPreparation/get-info-by-id/${id}`)
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
  }, [id]);

  // to get Line Name
  const [lineNameListData, setLineNameListData] = useState([]);

  const getLineYearList = () => {
    api
      .get(baseURL + `lineNameMaster/get-all`)
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

  const navigate = useNavigate();

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    });
  };
  const updateError = (message) => {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Save attempt was not successful",
    //     text: message,
    //   });
    // };
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

  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("#"));
  };
  return (
    <Layout title="Edit Preparation of Eggs (DFLs)">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Preparation of Eggs (DFLs)</Block.Title>
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

      {/* <Block className="mt-4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <div>
              <Row className="g-gs">
                <Col lg="12">
                  <Block>
                    <Card>
                      <Card.Header>
                        {" "}
                        Maintenance of screening batch records{" "}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="cocoonsProducedAtEachGeneration">
                                Total number of cocoons produced at each
                                generation
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="cocoonsProducedAtEachGeneration"
                                  name="cocoonsProducedAtEachGeneration"
                                  value={data.cocoonsProducedAtEachGeneration}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Total number of cocoons produced at each generation"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Total number of cocoons produced at each
                                  generation is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="lotNumber">
                                Lot number
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="lotNumber"
                                  name="lotNumber"
                                  value={data.lotNumber}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Lot number/Year"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Lot number/Year is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                                Line Name
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="lineNameId"
                                  value={data.lineNameId}
                                  onChange={handleInputs}
                                  required
                                  isInvalid={
                                    data.lineNameId === undefined ||
                                    data.lineNameId === "0"
                                  }
                                >
                                  <option value="">Select Line Name</option>
                                  {lineNameListData.map((list) => (
                                    <option
                                      key={list.lineNameId}
                                      value={list.lineNameId}
                                    >
                                      {list.lineName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Line Name is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="sordfl">
                                Worm Test details and result
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  type="text"
                                  placeholder="Worm Test details  and result"
                                />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="screeningBatchNo">
                                Screening Batch Number
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="screeningBatchNo"
                                  name="screeningBatchNo"
                                  value={data.screeningBatchNo}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Screening Batch Number"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Screening Batch Number is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="cocoonsProducedAtEachScreening">
                                Total Number of Cocoons Produced at each
                                Screening
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="cocoonsProducedAtEachScreening"
                                  name="cocoonsProducedAtEachScreening"
                                  value={data.cocoonsProducedAtEachScreening}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Screening Batch Number"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Total Number of Cocoons Produced at each
                                  Screening is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="screeningBatchResults">
                                Screening Batch Results
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="screeningBatchResults"
                                  name="screeningBatchResults"
                                  value={data.screeningBatchResults}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Screening Batch Results"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Screening Batch Results is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="chawkiPercentage">
                                Chawki Percentage
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="chawkiPercentage"
                                  name="chawkiPercentage"
                                  value={data.chawkiPercentage}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Chawki Percentage"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Chawki Percentage is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="selectedBedAsPerTheMeanPerformance">
                                Selected Bed as per the Mean Performance
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="selectedBedAsPerTheMeanPerformance"
                                  name="selectedBedAsPerTheMeanPerformance"
                                  value={
                                    data.selectedBedAsPerTheMeanPerformance
                                  }
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Selected Bed as per the Mean Performance"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Selected Bed as per the Mean Performance is
                                  required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="cropFailureDetails">
                                Crop Failure Details
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="cropFailureDetails"
                                  name="cropFailureDetails"
                                  value={data.cropFailureDetails}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Crop Failure Details"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Crop Failure Details is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="incubation">
                                Incubation Date
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                {isIncubationDate && (
                                  <DatePicker
                                    selected={
                                      new Date(data.incubationDate) || null
                                    }
                                    onChange={(date) =>
                                      handleDateChange(date, "incubationDate")
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
                                )}
                                <Form.Control.Feedback type="invalid">
                                  Incubation Date is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="blackBox">
                                Black Boxing Date
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                {isBlackBoxingDate && (
                                  <DatePicker
                                    selected={
                                      new Date(data.blackBoxingDate) || null
                                    }
                                    onChange={(date) =>
                                      handleDateChange(date, "blackBoxingDate")
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
                                )}
                                <Form.Control.Feedback type="invalid">
                                  Black Boxing Date is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="brushedOnDate">
                                Brushed on date
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                {isBrushedOnDate && (
                                  <DatePicker
                                    selected={
                                      new Date(data.brushedOnDate) || null
                                    }
                                    onChange={(date) =>
                                      handleDateChange(date, "brushedOnDate")
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
                                )}
                                <Form.Control.Feedback type="invalid">
                                  Brushed on date is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="sordfl">
                                Spun on date
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                {isSpunOnDate && (
                                  <DatePicker
                                    selected={new Date(data.spunOnDate) || null}
                                    onChange={(date) =>
                                      handleDateChange(date, "spunOnDate")
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
                                )}
                                <Form.Control.Feedback type="invalid">
                                  Spun on date is required
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
                        <Button type="submit" variant="primary">
                          Update
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
      </Block> */}
      <Block className="mt-n4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <div>
              <Row className="g-gs">
                <Col lg="12">
                  <Block>
                    <Card>
                      <Card.Header>
                        {" "}
                        Edit Preparation of Eggs (DFLs){" "}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
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
                                {isDateOfMothEmergence && (
                                  <DatePicker
                                    selected={
                                      new Date(data.dateOfMothEmergence) || null
                                    }
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
                                    minDate={new Date()}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    required
                                  />
                                )}

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
                                {isLaidOnDate && (
                                  <DatePicker
                                    selected={new Date(data.laidOnDate) || null}
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
                                )}

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
                          Update
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

export default PreparationofeggsDFLsEdit;
