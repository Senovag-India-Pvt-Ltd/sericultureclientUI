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

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;

function MaintenanceofScreeningBatchRecords() {
  
  const [validated, setValidated] = useState(false);

  const [data, setData] = useState({
    cocoonsProducedAtEachGeneration: "",
    lotNumber: "",
    lineNameId: "",
    incubationDate: "",
    blackBoxingDate: "",
    brushedOnDate: "",
    spunOnDate: "",
    screeningBatchNo: "",
    cocoonsProducedAtEachScreening: "",
    screeningBatchResults: "",
    chawkiPercentage: "",
    selectedBedAsPerTheMeanPerformance: "",
    cropFailureDetails: "",
  });

  const clear = () => {
    setData({
      cocoonsProducedAtEachGeneration: "",
      lotNumber: "",
      lineNameId: "",
      incubationDate: "",
      blackBoxingDate: "",
      brushedOnDate: "",
      spunOnDate: "",
      screeningBatchNo: "",
      cocoonsProducedAtEachScreening: "",
      screeningBatchResults: "",
      chawkiPercentage: "",
      selectedBedAsPerTheMeanPerformance: "",
      cropFailureDetails: "",
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

      // if (data.fruitsId.length < 16 || data.fruitsId.length > 16) {
      //   return;
      // }
      api
        .post(baseURLSeedDfl + `MaintenanceOfScreen/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess(response.data.message);
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

  // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    api
      .get(
        baseURLSeedDfl +
          `ReceiptOfDflsFromP4GrainageLinesController/get-all-lot-number-list`
      )
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
    <Layout title="Maintenance of screening batch records">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Maintenance of screening batch records
            </Block.Title>
            {/* <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Maintenance of screening batch records
                </li>
              </ol>
            </nav> */}
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Maintenance-of-Screening-Batch-Records-List"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Maintenance-of-Screening-Batch-Records-List"
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
                      <Card.Header>
                        Maintenance of screening batch records{" "}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="cocoonsProducedAtEachGeneration">
                                Total number of cocoons produced
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="cocoonsProducedAtEachGeneration"
                                  name="cocoonsProducedAtEachGeneration"
                                  value={data.cocoonsProducedAtEachGeneration}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Total number of cocoons produced"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Total number of cocoons produced is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>Lot Number</Form.Label>
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
                                    {lotListData && lotListData.length
                                      ? lotListData.map((list) => (
                                          <option
                                            key={list.id}
                                            value={list.lotNumber}
                                          >
                                            {list.lotNumber}
                                          </option>
                                        ))
                                      : ""}
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    Lot Number is required
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Form.Group>
                          </Col>
                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n3">
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

                          {/* <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="sordfl">
                                Line Name
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="sordfl"
                                  type="text"
                                  placeholder="Line Name"
                                />
                              </div>
                            </Form.Group>
                          </Col> */}

                          
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
                                  type="number"
                                  placeholder="Enter Screening Batch Number"
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
                                Total Number of Cocoons Produced
                                Screening
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="cocoonsProducedAtEachScreening"
                                  name="cocoonsProducedAtEachScreening"
                                  value={data.cocoonsProducedAtEachScreening}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder="Enter Total Number of Cocoons Produced
                                  Screening"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Total Number of Cocoons Produced
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
                                  type="number"
                                  placeholder="Enter Chawki Percentage"
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
                                  type="number"
                                  placeholder="Enter Selected Bed as per the Mean Performance"
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
                                  placeholder="Enter Crop Failure Details"
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
                                <DatePicker
                                  selected={data.incubationDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "incubationDate")
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
                                <DatePicker
                                  selected={data.blackBoxingDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "blackBoxingDate")
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
                                <DatePicker
                                  selected={data.brushedOnDate}
                                  onChange={(date) =>
                                    handleDateChange(date, "brushedOnDate")
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
                {/* <Col lg="12">
                  <Card>
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <div className="table-responsive">
                            <table className="table small table-bordered">
                              <thead>
                                <tr>
                                  <th style={styles.ctstyle}>
                                    Total number of cocoons produced at each
                                    generation
                                  </th>
                                  <th style={styles.ctstyle}>
                                    Lot number/Year
                                  </th>
                                  <th style={styles.ctstyle}>
                                    Line details/Year (Silk Worm Race)
                                  </th>
                                  <th style={styles.ctstyle}>Line Name</th>
                                  <th style={styles.ctstyle}>
                                    Incubation Date
                                  </th>
                                  <th style={styles.ctstyle}>
                                    Black Boxing Date
                                  </th>
                                  <th style={styles.ctstyle}>
                                    Brushed on date
                                  </th>
                                  <th style={styles.ctstyle}>Spun on date</th>
                                  <th style={styles.ctstyle}>
                                    Worm Test details and result
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    Total number of cocoons produced at each
                                    generation data
                                  </td>
                                  <td>Lot number/Year data</td>
                                  <td>
                                    Line details/Year (Silk Worm Race) data
                                  </td>
                                  <td>Line Name data</td>
                                  <td>Incubation Date data</td>
                                  <td>Black Boxing Date data</td>
                                  <td>Brushed on date data</td>
                                  <td>Spun on date data</td>
                                  <td>Worm Test details and result data</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col> */}
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default MaintenanceofScreeningBatchRecords;
