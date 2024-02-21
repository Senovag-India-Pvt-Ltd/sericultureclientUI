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

function MaintenanceOfMulberryGardenEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
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

  const isDataPruningSet = !!data.pruningDate;
  

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
        .post(baseURL2 + `Mulberry-garden/update-info`, data)
        .then((response) => {
          //   const trScheduleId = response.data.content.trScheduleId;
          //   if (trScheduleId) {
          //     handlePPtUpload(trScheduleId);
          //   }
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              plotNumber: "",
              variety: "",
              varietyId: "",
              areaUnderEachVariety: "",
              pruningDate: "",
              fertilizerApplicationDate: "",
              fymApplicationDate: "",
              irrigationDate: "",
              brushingDate: "",
            });
            setValidated(false);
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
      plotNumber: "",
      variety: "",
      varietyId: "",
      areaUnderEachVariety: "",
      pruningDate: "",
      fertilizerApplicationDate: "",
      fymApplicationDate: "",
      irrigationDate: "",
      brushingDate: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `Mulberry-garden/get-info-by-id/${id}`)
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

  useEffect(() => {
    getVarietyList();
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
    <Layout title="Edit Maintenance of Mulberry Garden">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Edit Maintenance of Mulberry Garden
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/maintenance-of-mulberry-garden-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/maintenance-of-mulberry-garden-list"
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
          {/* <Row className="g-3 "> */}
            <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
                Edit Maintenance Of Mulberry Garden
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="plotNumber">
                          Plot Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="plotNumber"
                            name="plotNumber"
                            value={data.plotNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Plot Number"
                            required
                          />
                        </div>
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        Plot Number is required
                      </Form.Control.Feedback>
                    </Col>

                    <Col lg="4">
                    <Form.Group className="form-group">
                    <Form.Label>
                      Mulberry Variety<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="varietyId"
                        value={data.varietyId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs} 
                        // multiple
                        required
                        isInvalid={data.variety === undefined || data.variety === "0"} 
                      >
                        <option value="">Select Mulberry Variety</option>
                        {varietyListData.map((list) => (
                          <option
                            key={list.mulberryVarietyId}
                            value={list.mulberryVarietyId}
                          >
                            {list.mulberryVarietyName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Mulberry Variety is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="areaUnderEachVariety">
                          Area Under Each Variety
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="areaUnderEachVariety"
                            name="areaUnderEachVariety"
                            value={data.areaUnderEachVariety}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Area Under Each Variety"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Form.Label column sm={2}>
                      Pruning Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={2}>
                      <div className="form-control-wrap">
                        {isDataPruningSet && (
                          <DatePicker
                            selected={new Date(data.pruningDate)}
                            onChange={(date) =>
                              handleDateChange(date, "pruningDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                          />
                        )}
                      </div>
                    </Col>

                    {/* <Form.Label column sm={2}>
                      Fertilizer Application Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={2}>
                      <div className="form-control-wrap">
                        {isDataFertilizerSet && (
                          <DatePicker
                            selected={new Date(data.fertilizerApplicationDate)}
                            onChange={(date) =>
                              handleDateChange(
                                date,
                                "fertilizerApplicationDate"
                              )
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                          />
                        )}
                      </div>
                    </Col>
                    

                    <Form.Label column sm={2}>
                      Farm Yard Manure Application Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={2}>
                      <div className="form-control-wrap">
                        {isDataFymSet && (
                          <DatePicker
                            selected={new Date(data.fymApplicationDate)}
                            onChange={(date) =>
                              handleDateChange(date, "fymApplicationDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                          />
                        )}
                      </div>
                    </Col>

                    <Form.Label column sm={2}>
                      Irrigation Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={2}>
                      <div className="form-control-wrap">
                        {isDataIrrigationSet && (
                          <DatePicker
                            selected={new Date(data.irrigationDate)}
                            onChange={(date) =>
                              handleDateChange(date, "irrigationDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                          />
                        )}
                      </div>
                    </Col>
                    <Form.Label column sm={2}>
                      Brushing Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={2}>
                      <div className="form-control-wrap">
                        {isDataBrushingSet && (
                          <DatePicker
                            selected={new Date(data.brushingDate)}
                            onChange={(date) =>
                              handleDateChange(date, "brushingDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                          />
                        )}
                      </div>
                    </Col> */}
                  </Row>
                )}
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
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}

export default MaintenanceOfMulberryGardenEdit;
