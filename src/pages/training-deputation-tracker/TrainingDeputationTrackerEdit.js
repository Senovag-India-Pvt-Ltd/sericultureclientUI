import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../components";
import api from "../../../src/services/auth/api";
import TrainingDeputationTracker from "./TrainingDeputationTracker";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_TRAINING;

function TrainingDeputationTrackerEdit() {
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

  const isDataFromSet = !!data.deputedFromDate;
  const isDataToSet = !!data.deputedToDate;

  const _header = { "Content-Type": "application/json", accept: "*/*" };

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
        .post(baseURL2 + `trainingDeputationTracker/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              officialName: "",
              designationId: "",
              officialAddress: "",
              mobileNumber: "",
              deputedInstituteId: "",
              deputedFromDate: "",
              deputedToDate: "",
              trProgramMasterId: "",
              trCourseMasterId: "",
              deputedAttended: "",
              deputedRemarks: "",
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
      officialName: "",
      designationId: "",
      officialAddress: "",
      mobileNumber: "",
      deputedInstituteId: "",
      deputedFromDate: "",
      deputedToDate: "",
      trProgramMasterId: "",
      trCourseMasterId: "",
      deputedAttended: "",
      deputedRemarks: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `trainingDeputationTracker/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  // to get Designation
  const [designationListData, setDesignationListData] = useState([]);

  const getDesignationList = () => {
    const response = api
      .get(baseURL + `designation/get-all`)
      .then((response) => {
        setDesignationListData(response.data.content.designation);
      })
      .catch((err) => {
        setDesignationListData([]);
      });
  };

  useEffect(() => {
    getDesignationList();
  }, []);

  // to get Deputed Institute
  const [deputedInstituteListData, setDeputedInstituteListData] = useState([]);

  const getDeputedInstituteList = () => {
    const response = api
      .get(baseURL + `deputedInstituteMaster/get-all`)
      .then((response) => {
        setDeputedInstituteListData(
          response.data.content.deputedInstituteMaster
        );
      })
      .catch((err) => {
        setDeputedInstituteListData([]);
      });
  };

  useEffect(() => {
    getDeputedInstituteList();
  }, []);

  // to get TrProgram
  const [trProgramListData, setTrProgramListData] = useState([]);

  const getTrProgramList = () => {
    const response = api
      .get(baseURL + `trProgramMaster/get-all`)
      .then((response) => {
        setTrProgramListData(response.data.content.trProgramMaster);
      })
      .catch((err) => {
        setTrProgramListData([]);
      });
  };

  useEffect(() => {
    getTrProgramList();
  }, []);

  // to get Course
  const [trCourseListData, setTrCourseListData] = useState([]);

  const getTrCourseList = () => {
    const response = api
      .get(baseURL + `trCourseMaster/get-all`)
      .then((response) => {
        setTrCourseListData(response.data.content.trCourseMaster);
      })
      .catch((err) => {
        setTrCourseListData([]);
      });
  };

  useEffect(() => {
    getTrCourseList();
  }, []);

  const navigate = useNavigate();

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
  };
  const updateError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: message,
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
    <Layout title="Training Deputation Tracker Edit">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Training Deputation Tracker Edit</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/training-deputation-tracker-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/training-deputation-tracker-list"
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
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="official Name">
                          Name Of the Official
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="officialName"
                            name="officialName"
                            value={data.officialName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Name Of the Official"
                          />
                        </div>
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        Name Of the Official is required
                      </Form.Control.Feedback>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>
                          Designation<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="designationId"
                            value={data.designationId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.designationId === undefined ||
                              data.designationId === "0"
                            }
                          >
                            <option value="">Select Designation</option>
                            {designationListData.map((list) => (
                              <option
                                key={list.designationId}
                                value={list.designationId}
                              >
                                {list.name}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Designation is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>
                          Deputed to Institute Name and Details
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="deputedInstituteId"
                            value={data.deputedInstituteId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.deputedInstituteId === undefined ||
                              data.deputedInstituteId === "0"
                            }
                          >
                            <option value="">Select Deputed Institute</option>
                            {deputedInstituteListData.map((list) => (
                              <option
                                key={list.deputedInstituteId}
                                value={list.deputedInstituteId}
                              >
                                {list.deputedInstituteName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Deputed Institute is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>
                          Training Program<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="trProgramMasterId"
                            value={data.trProgramMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.trProgramMasterId === undefined ||
                              data.trProgramMasterId === "0"
                            }
                          >
                            <option value="">Select Program</option>
                            {trProgramListData.map((list) => (
                              <option
                                key={list.trProgramMasterId}
                                value={list.trProgramMasterId}
                              >
                                {list.trProgramMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Training Program is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>
                          Training Course<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="trCourseMasterId"
                            value={data.trCourseMasterId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.trCourseMasterId === undefined ||
                              data.trCourseMasterId === "0"
                            }
                          >
                            <option value="">Select Course</option>
                            {trCourseListData.map((list) => (
                              <option
                                key={list.trCourseMasterId}
                                value={list.trCourseMasterId}
                              >
                                {list.trCourseMasterName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Training Course is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="trDuration">
                          Official Address
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="officialAddress"
                            name="officialAddress"
                            value={data.officialAddress}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Official Address"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="trDuration">
                          Mobile Number
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mobileNumber"
                            name="mobileNumber"
                            value={data.mobileNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Mobile Number"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>Training Attended</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="deputedAttended"
                            value={data.deputedAttended}
                            onChange={handleInputs}
                          >
                            <option value="">Select</option>
                            <option value="1">Yes</option>
                            <option value="2">No</option>
                            {/* <option value="3">Third Gender</option> */}
                          </Form.Select>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="trNoOfParticipant">
                          Remarks
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="deputedRemarks"
                            name="deputedRemarks"
                            value={data.deputedRemarks}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Remarks "
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>Training Period Start Date</Form.Label>
                        <Row>
                          <Col lg="6">
                            <div className="form-control-wrap">
                              {isDataFromSet && (
                                <DatePicker
                                  selected={new Date(data.deputedFromDate)}
                                  onChange={(date) =>
                                    handleDateChange(date, "deputedFromDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                />
                              )}
                            </div>
                          </Col>
                        </Row>
                        {/* </Form.Group> */}

                        <Row>
                          <Col lg="6">
                            {/* <Form.Group className="form-group"> */}
                            <Form.Label>Date of Completion</Form.Label>
                            <div className="form-control-wrap">
                              {isDataToSet && (
                                <DatePicker
                                  selected={new Date(data.deputedToDate)}
                                  onChange={(date) =>
                                    handleDateChange(date, "deputedToDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                />
                              )}
                            </div>
                          </Col>
                        </Row>
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
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default TrainingDeputationTrackerEdit;
