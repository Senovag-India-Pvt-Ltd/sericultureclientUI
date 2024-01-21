import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link,useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Icon,
  Select,
} from "../../components";
import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
// const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function TrainingScheduleEdit() {
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

      const isDataStartSet = !!data.trStartDate;
      const isDataCompletionSet = !!data.trDateOfCompletion;

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
        .post(baseURL + `trSchedule/edit`, data)
        .then((response) => {
          updateSuccess();
        })
        .catch((err) => {
          const message = err.response.data.errorMessages[0].message[0].message;
          updateError(message);
          setData({});
        });
        setValidated(true);
      }
    };
  
    //   to get data from api
    const getIdList = () => {
      setLoading(true);
      const response = api
        .get(baseURL + `trSchedule/get/${id}`)
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

    // to get TrInstitutionMaster
  const [trInstituteListData, setTrInstituteListData] = useState([]);

  const getTrInstitutionMasterList = () => {
    const response = api
      .get(baseURL + `trInstitutionMaster/get-all`)
      .then((response) => {
        setTrInstituteListData(response.data.content.trInstitutionMaster);
      })
      .catch((err) => {
        setTrInstituteListData([]);
      });
  };

  useEffect(() => {
    getTrInstitutionMasterList();
  }, []);

  // to get TrGroup
  const [trGroupListData, setTrGroupListData] = useState([]);

  const getTrGroupList = () => {
    const response = api
      .get(baseURL + `trGroupMaster/get-all`)
      .then((response) => {
        setTrGroupListData(response.data.content.trGroupMaster);
      })
      .catch((err) => {
        setTrGroupListData([]);
      });
  };

  useEffect(() => {
    getTrGroupList();
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

  // to get TrMode
  const [trModeListData, setTrModeListData] = useState([]);

  const getTrModeList = () => {
    const response = api
      .get(baseURL + `trModeMaster/get-all`)
      .then((response) => {
        setTrModeListData(response.data.content.trModeMaster);
      })
      .catch((err) => {
        setTrModeListData([]);
      });
  };

  useEffect(() => {
    getTrModeList();
  }, []);

  
    const navigate = useNavigate();
  
    const updateSuccess = () => {
      Swal.fire({
        icon: "success",
        title: "Updated successfully",
        // text: "You clicked the button!",
      }).then(() => navigate("/issue-new-trader-license-list"));
    };
    const updateError = (message) => {
      Swal.fire({
        icon: "error",
        title: message,
        text: "Something went wrong!",
      });
    };
    const editError = (message) => {
      Swal.fire({
        icon: "error",
        title: message,
        text: "Something went wrong!",
      }).then(() => navigate("/issue-new-trader-license-list"));
    };
  
    return (
      <Layout title="Training Schedule Edit">
        <Block.Head>
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2">Training Schedule Edit</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/training-schedule-list"
                    className="btn btn-primary btn-md d-md-none"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go to List</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/training-schedule-list"
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
                      <Form.Group className="form-group">
                      <Form.Label htmlFor="trainerName">Trainer Name<span className="text-danger">*</span></Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="trainerName"
                          name="trName"
                          value={data.trName}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Trainer Name"
                          required
                        />
                      </div>
                    </Form.Group>
                    <Form.Control.Feedback type="invalid">
                    Trainer Name is required
                </Form.Control.Feedback>
             </Col>

                    <Col lg="6">
                    <Form.Group className="form-group">
                            <Form.Label>
                              Training Institution<span className="text-danger">*</span>
                            </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="trInstitutionMasterId"
                                  value={data.trInstitutionMasterId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs} 
                                  required
                                  isInvalid={data.trInstitutionMasterId === undefined || data.trInstitutionMasterId === "0"}
                                >
                                  <option value="">Select Training Institution Type</option>
                                  {trInstituteListData.map((list) => (
                                    <option
                                      key={list.trInstitutionMasterId}
                                      value={list.trInstitutionMasterId}
                                    >
                                      {list.trInstitutionMasterName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Training Institution is required
                                </Form.Control.Feedback>
                              </div>
                          </Form.Group> 
                          </Col>

                          <Col lg="6">
                          <Form.Group
                            className="form-group"
                          >
                            <Form.Label>
                              Training Group<span className="text-danger">*</span>
                            </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="trGroupMasterId"
                                  value={data.trGroupMasterId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs} 
                                  required
                                  isInvalid={data.trGroupMasterId === undefined || data.trGroupMasterId === "0"}
                                >
                                  <option value="">Select Training Group Type</option>
                                  {trGroupListData.map((list) => (
                                    <option
                                      key={list.trGroupMasterId}
                                      value={list.trGroupMasterId}
                                    >
                                      {list.trGroupMasterName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                Training Group is required
                                </Form.Control.Feedback>
                              </div>
                          </Form.Group>
                        </Col>          

                        <Col lg="6">
                          <Form.Group
                            className="form-group"
                          >
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
                                  isInvalid={data.trProgramMasterId === undefined || data.trProgramMasterId === "0"}
                                >
                                  <option value="">Select Training Program</option>
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
                          <Form.Group
                            className="form-group"
                          >
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
                                  isInvalid={data.trCourseMasterId === undefined || data.trCourseMasterId === "0"}
                                >
                                  <option value="">Select Training Course</option>
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
                          <Form.Group
                            className="form-group"
                          >
                            <Form.Label>
                              Training Mode<span className="text-danger">*</span>
                            </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="trModeMasterId"
                                  value={data.trModeMasterId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs} 
                                  required
                                  isInvalid={data.trModeMasterId === undefined || data.trModeMasterId === "0"}
                                >
                                  <option value="">Select Training Mode</option>
                                  {trModeListData.map((list) => (
                                    <option
                                      key={list.trModeMasterId}
                                      value={list.trModeMasterId}
                                    >
                                      {list.trModeMasterName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Training Mode is required
                                </Form.Control.Feedback>
                              </div>
                          </Form.Group> 
                        </Col>
                
                <Col lg="6">
                 <Form.Group className="form-group">
                    <Form.Label htmlFor="trDuration">
                    Training Duration
                    </Form.Label>
                    <div className="form-control-wrap">
                    <Form.Control
                        id="trDuration"
                        name="trDuration"
                        value={data.trDuration}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Training Duration"
                    />
                    </div>
                </Form.Group>
                </Col>

                <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="trPeriod">
                      Training Period
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="trPeriod"
                          name="trPeriod"
                          value={data.trPeriod}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Training Period"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="trNoOfParticipant">
                      Training No Of Participant
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="trNoOfParticipant"
                          name="trNoOfParticipant"
                          value={data.trNoOfParticipant}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Training No Of Participant "
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-4">
                      <Form.Label htmlFor="trUploadPath">
                      Training Upload
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="trUploadPath"
                          name="trUploadPath"
                          value={data.trUploadPath}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Training Upload Path"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg='6'>          
                      <Form.Group className="form-group">
                        <Form.Label>Training Period Start Date</Form.Label>
                        <Row>
                          <Col lg="6">
                          <div className="form-control-wrap">
                          {isDataStartSet && (
                          <DatePicker
                           selected={new Date(data.trStartDate)}
                              onChange={(date) => handleDateChange(date, "trStartDate")}
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
                        {isDataCompletionSet && (
                          <DatePicker
                            selected={new Date(data.trDateOfCompletion)}
                            onChange={(date) => handleDateChange(date, "trDateOfCompletion")}
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
                    <Link
                      to="/training-schedule-list"
                      className="btn btn-secondary border-0"
                    >
                      Cancel
                    </Link>
                  </li>
                </ul>
              </div>
            </Row>
          </Form>
        </Block>
      </Layout>
    );
  }
  
  export default TrainingScheduleEdit;