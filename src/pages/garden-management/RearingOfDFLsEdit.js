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

function RearingOfDFLsEdit() {
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

  const isDataLaidSet = !!data.laidOnDate;
  const isDataReleasedSet = !!data.releasedOnDate;
  const isDataSpunSet = !!data.spunOnDate;

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
        .post(baseURL2 + `Rearing-of-dfls/update-info`, data)
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
              disinfectantMasterId: "",
              cropNumber: "",
              lotNumberId: "",
              coldStorageDetails: "",
              releasedOnDate: "",
              brushingDate: "",
              chawkiPercentage: "",
              wormWeight: "",
              spunOnDate: "",
              wormTestDetails: "",
              cocoonAssessmentDetails: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      disinfectantMasterId: "",
      cropNumber: "",
      lotNumberId: "",
      coldStorageDetails: "",
      releasedOnDate: "",
      brushingDate: "",
      chawkiPercentage: "",
      wormWeight: "",
      spunOnDate: "",
      wormTestDetails: "",
      cocoonAssessmentDetails: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `Rearing-of-dfls/get-info-by-id/${id}`)
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

  // to get Lot Number
  const [lotNumberListData, setLotNumberListData] = useState([]);

  const getLotNumberList = () => {
    const response = api
      .get(baseURL2 + `lot-number-master/get-info`)
      .then((response) => {
        setLotNumberListData(response.data);
      })
      .catch((err) => {
        setLotNumberListData([]);
      });
  };

  useEffect(() => {
    getLotNumberList();
  }, []);

  // to get DisInfactant Variety
  const [disinfactantListData, setDisinfactantListData] = useState([]);

  const getDisinfactantList = () => {
    const response = api
      .get(baseURL + `disinfectantMaster/get-all`)
      .then((response) => {
        setDisinfactantListData(response.data.content.disinfectantMaster);
      })
      .catch((err) => {
        setDisinfactantListData([]);
      });
  };

  useEffect(() => {
    getDisinfactantList();
  }, []);

  const navigate = useNavigate();

  const updateSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      text: message,
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
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("#"));
  };

  return (
    <Layout title="Edit Rearing of DFLs">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Rearing of DFLs</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/rearing-of-dfls-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/rearing-of-dfls-list"
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
              Edit Rearing Of DFLs
            </Card.Header>
            <Card.Body>
              {loading ? (
                <h1 className="d-flex justify-content-center align-items-center">
                  Loading...
                </h1>
              ) : (
                <Row className="g-gs">
                <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Disinfactant Usage Details<span className="text-danger">*</span>
                      </Form.Label>
                      <Col>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="disinfectantMasterId"
                            value={data.disinfectantMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                          >
                            <option value="">Select Disinfactant Usage</option>
                            {disinfactantListData.map((list) => (
                              <option
                                key={list.disinfectantMasterId}
                                value={list.disinfectantMasterId}
                              >
                                {list.disinfectantMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          Disinfactant Usage Details is required
                      </Form.Control.Feedback>
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>


                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="plotNumber">
                        Crop Number<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="cropNumber"
                          name="cropNumber"
                          value={data.cropNumber}
                          onChange={handleInputs}
                          type="text"
                          maxLength="12"
                          placeholder="Enter Crop Number"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Crop Number is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  

                  <Col lg="4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="coldStorageDetails">
                      Cold Storage Status
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="coldStorageDetails"
                        name="coldStorageDetails"
                        value={data.coldStorageDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter  Cold Storage Status"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      Chawki Percentage<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="chawkiPercentage"
                        name="chawkiPercentage"
                        value={data.chawkiPercentage}
                        onChange={handleInputs}
                        type="text"
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
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      Worm Weight(In Grams)<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="wormWeight"
                        name="wormWeight"
                        value={data.wormWeight}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter  Cold Storage Details"
                        required
                      />
                       <Form.Control.Feedback type="invalid">
                       Worm Weight(In Grams) is required
                        </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      Worm Test Status<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="wormTestDetails"
                        name="wormTestDetails"
                        value={data.wormTestDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Worm Test Details"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Worm Test Status is required
                        </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="plotNumber">
                      Cocoon Assessment(in Kgs/Grams)<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="cocoonAssessmentDetails"
                        name="cocoonAssessmentDetails"
                        value={data.cocoonAssessmentDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Cocoon Assessment(in Kgs/Grams)"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Cocoon Assessment(in Kgs/Grams) is required
                        </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="2">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="sordfl">
                    Released On Date
                    <span className="text-danger">*</span>
                  </Form.Label>
                    <div className="form-control-wrap">
                      {isDataReleasedSet && (
                        <DatePicker
                          selected={new Date(data.releasedOnDate)}
                          onChange={(date) =>
                            handleDateChange(date, "releasedOnDate")
                          }
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          required
                        />
                      )}
                    </div>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="sordfl">
                    Brushing Date
                    <span className="text-danger">*</span>
                  </Form.Label>
                    <div className="form-control-wrap">
                      {isDataLaidSet && (
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
                          required
                        />
                      )}
                    </div>
                    </Form.Group>
                  </Col>


                  <Col lg="2">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="sordfl">
                    Spun Date
                    <span className="text-danger">*</span>
                  </Form.Label>
                    <div className="form-control-wrap">
                      {isDataSpunSet && (
                        <DatePicker
                          selected={new Date(data.spunOnDate)}
                          onChange={(date) =>
                            handleDateChange(date, "spunOnDate")
                          }
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          required
                        />
                      )}
                    </div>
                    </Form.Group>
                  </Col>
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

export default RearingOfDFLsEdit;
