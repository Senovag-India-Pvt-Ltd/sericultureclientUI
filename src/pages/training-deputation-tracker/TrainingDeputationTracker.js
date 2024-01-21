import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon, Select } from "../../components";
import DatePicker from "react-datepicker";
// import axios from "axios";
import Swal from "sweetalert2";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
// const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function TrainingDeputationTracker() {

  const [data, setData] = useState({
    officialName: "",
    designationId: "",
    officialAddress: "",
    mobileNumber: "",
    deputedInstituteId: "",
    deputedFromDate: "",
    deputedToDate: "",
    trProgramMasterId: "",
    trCourseMasterId: "",
    deputedAttended:"",
    deputedRemarks:"",

  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  
  
  // const handleDateChange = (newDate) => {
  //   setData({ ...data, applicationDate: newDate });
  // };

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
      .post(baseURL + `trainingDeputationTracker/add`, data)
      .then((response) => {
        if(response.data.content.error){
            saveError(response.data.content.error_description);
            }else{
              saveSuccess();
            }
      })
      .catch((err) => {
        setData({});
        saveError();
      });
      setValidated(true);
    }
  };

  // const postData = (e) => {
  //   console.log("Data to be sent:", data);
  //   axios
  //     .post(baseURL2 + `trader-license/add`, data, {
  //       headers: _header,
  //     })
  //     .then((response) => {
  //       console.log("Response from server:", response.data);
  //       saveSuccess();
  //     })
  //     .catch((err) => {
  //       console.error("Error from server:", err);
  //       console.log("Detailed error response:", err.response); // Log the detailed error response
  //       setData({}); // You might want to handle the error and state appropriately
  //       saveError();
  //     });
  // };
  

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

  // to get TrGroup
  const [deputedInstituteListData, setDeputedInstituteListData] = useState([]);

  const getDeputedInstituteList = () => {
    const response = api
      .get(baseURL + `deputedInstituteMaster/get-all`)
      .then((response) => {
        setDeputedInstituteListData(response.data.content.deputedInstituteMaster);
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

 
  
//  // const YourFormComponent = ({ data, handleDateChange }) => {
//   const handleRenewedDateChange = (date) => {
//     // Calculate expiration date by adding 3 years to the renewed date
//     const expirationDate = new Date(date);
//     expirationDate.setFullYear(expirationDate.getFullYear() + 3);

//     setData({
//       ...data,
//       receiptDate: date,
//       licenseExpiryDate: expirationDate,
//     });
//   };

const handleDateChange = (date, type) => {
  setData({ ...data, [type]: date });
};

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("/training-deputation-tracker-list");
    });
  };
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };

  return (
    <Layout title="Training Deputation Tracker">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Training Deputation Tracker</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/training-deputation-tracker-list" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/training-deputation-tracker-list"
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
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="official Name">Name Of the Official<span className="text-danger">*</span></Form.Label>
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
                    <Form.Group className="form-group">
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
                                  isInvalid={data.designationId === undefined || data.designationId === "0"}
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
                          <Form.Group
                            className="form-group"
                          >
                            <Form.Label>
                              Deputed to Institute Name and Details<span className="text-danger">*</span>
                            </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="deputedInstituteId"
                                  value={data.deputedInstituteId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs} 
                                  required
                                  isInvalid={data.deputedInstituteId === undefined || data.deputedInstituteId === "0"}
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
                          <Form.Group className="form-group">
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
                 <Form.Group className="form-group">
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
                <Form.Group className="form-group">
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
                    <Form.Group className="form-group">
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

                  <Col lg='6'>          
                      <Form.Group className="form-group">
                        <Form.Label>Training Deputation Start Date</Form.Label>
                        <Row>
                          <Col lg="6">
                          <div className="form-control-wrap">
                          {/* <DatePicker
                            selected={data.dob}
                            onChange={(date) => handleDateChange(date, "dob")}
                          /> */}
                          <DatePicker
                            selected={data.deputedFromDate}
                            onChange={(date) => handleDateChange(date, "deputedFromDate")}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                        </Col>
                        </Row>
                      {/* </Form.Group> */}

                      <Row>
                      <Col lg="6">
                      {/* <Form.Group className="form-group"> */}
                        <Form.Label>Date of Completion</Form.Label>
                        <div className="form-control-wrap">
                          {/* <DatePicker
                            selected={data.dob}
                            onChange={(date) => handleDateChange(date, "dob")}
                          /> */}
                          <DatePicker
                            selected={data.deputedToDate}
                            onChange={(date) => handleDateChange(date, "deputedToDate")}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                      </Col>
                      </Row>
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
                  <Link to="/training-deputation-tracker-list" className="btn btn-secondary border-0">
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
export default TrainingDeputationTracker