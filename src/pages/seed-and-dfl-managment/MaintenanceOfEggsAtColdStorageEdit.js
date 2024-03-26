import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceOfEggsAtColdStorageEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  const isDataStorageDate = !!data.storageDate;

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const isDataReleaseSet = !!data.releaseDate;
  const isDataColdSet = !!data.coldDate;


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
        .post(baseURL2 + `MaintenanceOfEggsAtColdStorage/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
                lotNumber: "",
                noOfDFLs: "",
                grainageDetails: "",
                scheduleDetails: "",
                dateOfDeposit: "",
                dateOfRetrieval: "",
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
        lotNumber: "",
        noOfDFLs: "",
        grainageDetails: "",
        scheduleDetails: "",
        dateOfDeposit: "",
        dateOfRetrieval: "",
    });
  };


  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `MaintenanceOfPiercedCocoons/get-info-by-id/${id}`)
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
    <Layout title="Edit Maintenance Of Eggs At Cold Storage">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Maintenance Of Eggs At Cold Storage</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/maintenance-of-cold-storage-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/maintenance-of-cold-storage-list"
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
              Edit Maintenance Of Eggs At Cold Storage
            </Card.Header>
            <Card.Body>
              {loading ? (
                <h1 className="d-flex justify-content-center align-items-center">
                  Loading...
                </h1>
              ) : (
                <Row className="g-gs">
                <Col lg="6" >
                  <Form.Group className="form-group mt-n4 ">
                    <Form.Label htmlFor="plotNumber">
                      Lot Number<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="lotNumber"
                        name="lotNumber"
                        value={data.lotNumber}
                        onChange={handleInputs}
                        maxLength="12"
                        type="text"
                        placeholder="Enter Lot Number"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Lot Number is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      Number Of DFLs 
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfDFLsReceived"
                        name="numberOfDFLsReceived"
                        value={data.numberOfDFLsReceived}
                        onChange={handleInputs}
                        maxLength="4"
                        type="text"
                        placeholder="Enter Number Of DFLs received"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Number Of DFLs is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      Grainage Details
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="grainageDetails"
                        name="grainageDetails"
                        value={data.grainageDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Grainage Details"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Grainage Details is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Date of Cold storage
                              </Form.Label>
                              <div className="Date of Cold Storage">
                              { isDataColdSet && (
                                <DatePicker
                                  selected={new Date(data.dateOfColdStorage)}
                                  onChange={(date) =>
                                    handleDateChange(date, "dateOfColdStorage")
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
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Date of release
                              </Form.Label>
                              <div className="form-control-wrap">
                              {isDataReleaseSet && (
                                <DatePicker
                                  selected={new Date(data.releaseDate)}
                                  onChange={(date) =>
                                    handleDateChange(date, "releaseDate")
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
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Incubation Details
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                   id="incubationDetails"
                                  name="incubationDetails"
                                  value={data.incubationDetails}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Incubation Details"
                                />
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

export default MaintenanceOfEggsAtColdStorageEdit;
