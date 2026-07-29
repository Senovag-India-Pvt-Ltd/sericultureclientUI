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
import { useTranslation } from "react-i18next";

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
    spunOnToDate: "",
  });

  const { t } = useTranslation();

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
      spunOnToDate: "",
    });
    setValidated(false);
  };

  // let name, value;
  // const handleInputs = (e) => {
  //   name = e.target.name;
  //   value = e.target.value;
  //   setData({ ...data, [name]: value });
  // };
  const handleInputs = (e) => {
    const { name, options, type } = e.target;
  
    if (type === "select-multiple") {
      // Ensure `options` exists for a multi-select element
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
  
      // Update the state with a comma-separated string of selected values
      setData({ ...data, [name]: selectedValues.join(",") });
    } else {
      // For other input types, handle normally
      const value = e.target.value;
      setData({ ...data, [name]: value });
    }
  };
  
  

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };
  
  const formatDate = (date) => {
    if (!date) return ""; // Handle null or undefined dates
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0")
    );
  };

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
      const formattedReleaseDate = formatDate(data.incubationDate);
      const formattedBoxingDate = formatDate(data.blackBoxingDate);
      const formattedDateOfDisposal = formatDate(data.brushedOnDate);
      const formattedExpectedDateOfHatching = formatDate(data.spunOnDate);
      const formattedSpunOnToDate = formatDate(data.spunOnToDate);
      const payload = {
        ...data,
        incubationDate: formattedReleaseDate,
        blackBoxingDate: formattedBoxingDate,
        brushedOnDate: formattedDateOfDisposal,
        spunOnDate: formattedExpectedDateOfHatching,
        spunOnToDate: formattedSpunOnToDate,
      };
      api
        .post(baseURLSeedDfl + `MaintenanceOfScreen/add-info`, payload)
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
    <Layout title={t("Maintenance of screening batch records")}>
      <style>{screeningBatchFormStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Maintenance of screening batch records")}
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
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/Maintenance-of-Screening-Batch-Records-List"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <div>
              <Row className="g-gs">
                <Col lg="12">
                  <Block>
                    <Card>
                      <Card.Header className="sh-section-header">
                        <Icon name="layers" />
                        <span>{t("Maintenance of screening batch records")}</span>
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="cocoonsProducedAtEachGeneration">
                                {t("Total number of cocoons produced")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="cocoonsProducedAtEachGeneration"
                                  name="cocoonsProducedAtEachGeneration"
                                  value={data.cocoonsProducedAtEachGeneration}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Total number of cocoons produced")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Total number of cocoons produced is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>{t("Lot Number")}</Form.Label>
                              <Col>
                                <div className="form-control-wrap">
                                  <Form.Select
                                    name="lotNumber"
                                    value={data.lotNumber}
                                    onChange={handleInputs}
                                    onBlur={() => handleInputs}
                                    // required
                                  >
                                    <option value="">{t("Select Lot Number")}</option>
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
                                    {t("Lot Number is required")}
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
                                {t("Line Name")}
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
                                  <option value="">{t("Select Line Name")}</option>
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
                                  {t("Line Name is required")}
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
                                {t("Screening Batch Number")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="screeningBatchNo"
                                  name="screeningBatchNo"
                                  value={data.screeningBatchNo}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Enter Screening Batch Number")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Screening Batch Number is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="cocoonsProducedAtEachScreening">
                                {t("Total Number of Cocoons Produced at Screening")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="cocoonsProducedAtEachScreening"
                                  name="cocoonsProducedAtEachScreening"
                                  value={data.cocoonsProducedAtEachScreening}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Enter Total Number of Cocoons Produced at Screening")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Total Number of Cocoons Produced Screening is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="screeningBatchResults">
                                {t("Screening Batch Results")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="screeningBatchResults"
                                  name="screeningBatchResults"
                                  value={data.screeningBatchResults}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Screening Batch Results")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Screening Batch Results is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="chawkiPercentage">
                                {t("Chawki Percentage")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="chawkiPercentage"
                                  name="chawkiPercentage"
                                  value={data.chawkiPercentage}
                                  onChange={handleInputs}
                                  type="number"
                                  placeholder={t("Enter Chawki Percentage")}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t("Chawki Percentage is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          {/* <Col lg="4">
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
                                  placeholder="Enter Selected Bed as per the Mean Performance"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Selected Bed as per the Mean Performance is
                                  required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col> */}

                         

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="cropFailureDetails">
                                {t("Crop Failure Details")}
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="cropFailureDetails"
                                  name="cropFailureDetails"
                                  value={data.cropFailureDetails}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder={t("Enter Crop Failure Details")}
                                  // required
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                  Crop Failure Details is required
                                </Form.Control.Feedback> */}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                                {t("Selected Bed as per the Mean Performance")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="selectedBedAsPerTheMeanPerformance"
                                  value={data.selectedBedAsPerTheMeanPerformance.split(",")}
                                  onChange={handleInputs}
                                  required
                                  multiple
                                  // isInvalid={
                                  //   !data.selectedBedAsPerTheMeanPerformance ||
                                  //   data.selectedBedAsPerTheMeanPerformance === "0"
                                  // }
                                >
                                  <option value="Bed 1">{t("Bed 1")}</option>
                                  <option value="Bed 2">{t("Bed 2")}</option>
                                  <option value="Bed 3">{t("Bed 3")}</option>
                                  <option value="Bed 4">{t("Bed 4")}</option>
                                  <option value="Bed 5">{t("Bed 5")}</option>
                                  <option value="Bed 6">{t("Bed 6")}</option>
                                  <option value="Bed 7">{t("Bed 7")}</option>
                                  <option value="Bed 8">{t("Bed 8")}</option>
                                  <option value="Bed 9">{t("Bed 9")}</option>
                                  <option value="Bed 10">{t("Bed 10")}</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  {t("Selected Bed as per the Mean Performance is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="incubation">
                                {t("Incubation Date")}
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
                                  {t("Incubation Date is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="blackBox">
                                {t("Black Boxing Date")}
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
                                  {t("Black Boxing Date is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="brushedOnDate">
                                {t("Brushed on date")}
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
                                  {t("Brushed on date is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="sordfl">
                                {t("Spun on date(From)")}
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
                                  {t("Spun on date(From) is required")}
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                           <Col lg="2">
                              <Form.Group className="form-group mt-n4">
                                <Form.Label htmlFor="sordfl">
                                  {t(" Spun On Date(To)")}
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <DatePicker
                                    selected={data.spunOnToDate}
                                    onChange={(date) =>
                                      handleDateChange(date, "spunOnToDate")
                                    }
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                  />
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
                        <Button type="submit" variant="primary" className="shadow-sm px-4 py-2">
                          <Icon name="check" className="me-1" />
                          {t("Save")}
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
                          {t("Cancel")}
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
                                  <th style={styles.ctstyle}>Spun on date(From)</th>
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
                                  <td>Spun on date(From) data</td>
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

const screeningBatchFormStyles = `
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
`;

export default MaintenanceofScreeningBatchRecords;
