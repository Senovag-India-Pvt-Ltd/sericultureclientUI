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

function MaintenanceofScreeningBatchRecordsEdit() {
  const { id } = useParams();
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

  const isIncubationDate = !!data.incubationDate;
  const isBlackBoxingDate = !!data.blackBoxingDate;
  const isSpunOnDate = !!data.spunOnDate;
  const isBrushedOnDate = !!data.brushedOnDate;

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
        .post(baseURLSeedDfl + `MaintenanceOfScreen/update-info`, data)
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
    // getIdList();
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLSeedDfl + `MaintenanceOfScreen/get-info-by-id/${id}`)
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

  // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    const response = api
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

  // to get Mulberry Variety
  const [varietyListData, setVarietyListData] = useState([]);

  const getVarietyList = () => {
    const response = api
      .get(baseURL + `mulberry-variety/get-all`)
      .then((response) => {
        setVarietyListData(response.data.content.mulberryVariety);
      })
      .catch((err) => {
        setVarietyListData([]);
      });
  };

  // to get Soil Type
  const [soilTypeListData, setSoilTypeListData] = useState([]);

  const getSoilTypeList = () => {
    const response = api
      .get(baseURL + `soilType/get-all`)
      .then((response) => {
        setSoilTypeListData(response.data.content.soilType);
      })
      .catch((err) => {
        setSoilTypeListData([]);
      });
  };

  useEffect(() => {
    getVarietyList();
    getSoilTypeList();
  }, []);

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
    <Layout title="Edit Maintenance of Mulberry Garden in the Farms">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Edit Maintenance of Mulberry Garden in the Farms
            </Block.Title>
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

      <Block className="mt-4">
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
                          {/* <Col lg="4">
                            <Form.Group className="form-group  mt-n3">
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
                                Total Number of Cocoons Produced at
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
                                  placeholder="Enter Total Number of Cocoons Produced at
                                  Screening"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Total Number of Cocoons Produced at
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
                          </Col> */}
                          <Col lg="4">
                            <Form.Group className="form-group mt-n3">
                              <Form.Label>
                              Selected Bed as per the Mean Performance
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="selectedBedAsPerTheMeanPerformance"
                                  value={data.selectedBedAsPerTheMeanPerformance}
                                  onChange={handleInputs}
                                  required
                                  isInvalid={
                                    data.selectedBedAsPerTheMeanPerformance === undefined ||
                                    data.selectedBedAsPerTheMeanPerformance === "0"
                                  }
                                >
                                  <option value="">
                                    Select Selected Bed as per the Mean Performance
                                  </option>
                                  <option value="Bed 1">Bed 1</option>
                                  <option value="Bed 2">Bed 2</option>
                                  <option value="Bed 3">Bed 3</option>
                                  <option value="Bed 4">Bed 4</option>
                                  <option value="Bed 5">Bed 5</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                Selected Bed as per the Mean Performance is required
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
                                    // maxDate={new Date()}
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
                                    // maxDate={new Date()}
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
                                    // maxDate={new Date()}
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
                                    // maxDate={new Date()}
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

export default MaintenanceofScreeningBatchRecordsEdit;
