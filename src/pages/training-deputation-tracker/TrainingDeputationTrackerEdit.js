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

    if (name === "mobileNumber" && (value.length < 10 || value.length > 10)) {
      e.target.classList.add("is-invalid");
    } else {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
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
      if (data.mobileNumber.length !== 10) {
        return;
    }

      api
        .post(baseURL2 + `trainingDeputationTracker/edit`, data)
        .then((response) => {
          const trainingDeputationId = response.data.content.trainingDeputationId;
          if (trainingDeputationId) {
            handleUpload(trainingDeputationId);
          }
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              officialName: "",
              designationId: "",
              officialAddress: "",
              mobileNumber: "",
              deputedInstitute: "",
              fileUploadPath: "",
              deputedFromDate: null,
              deputedToDate: null,
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
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
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
      deputedFromDate: null,
      deputedToDate: null,
      trProgramMasterId: "",
      trCourseMasterId: "",
      deputedAttended: "",
      deputedRemarks: "",
    });
    setSelectedUploadFile("")
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `trainingDeputationTracker/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
        if (response.data.content.fileUploadPath) {
          getUploadFile(response.data.content.fileUploadPath);
        }
      })
      .catch((err) => {
        setData({});
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

  // // to get Deputed Institute
  // const [deputedInstituteListData, setDeputedInstituteListData] = useState([]);

  // const getDeputedInstituteList = () => {
  //   const response = api
  //     .get(baseURL + `deputedInstituteMaster/get-all`)
  //     .then((response) => {
  //       setDeputedInstituteListData(
  //         response.data.content.deputedInstituteMaster
  //       );
  //     })
  //     .catch((err) => {
  //       setDeputedInstituteListData([]);
  //     });
  // };

  // useEffect(() => {
  //   getDeputedInstituteList();
  // }, []);

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

  // Display Image
  const [fileUpload, setFileUpload] = useState("");
 
  const handleUploadChange = (e) => {
    const file = e.target.files[0];
    setFileUpload(file);
    setData((prev) => ({ ...prev, fileUploadPath: file.name }));
  };

  // Upload Image to S3 Bucket
  const handleUpload = async (deputationTrackerid) => {
    const parameters = `trainingDeputationId=${deputationTrackerid}`;
    try {
      const formData = new FormData();
      formData.append("multipartFile", fileUpload);

      const response = await api.post(
        baseURL2 + `trainingDeputationTracker/upload-path?${parameters}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File upload response:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  // To get Photo from S3 Bucket
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);

  const getUploadFile = async (file) => {
    const parameters = `fileName=${file}`;
    try {
      const response = await api.get(
        baseURL2 + `api/s3/download?${parameters}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setSelectedUploadFile(url);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
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
      title: "Save attempt was not successful",
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
    <Layout title="Edit Training Deputation Tracker Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Training Deputation Tracker Details</Block.Title>
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

      <Block className="mt-n4">
        <Form noValidate validated={validated} onSubmit={postData}>
            <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              Edit Training Deputation Tracker Details
            </Card.Header>
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

                    {/* <Col lg="6">
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
                    </Col> */}

                    <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="official Name">
                        Deputed to Institute Name and Details
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="deputedInstitute"
                          name="deputedInstitute"
                          value={data.deputedInstitute}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Deputed Institute Details"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
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
                      <Form.Group className="form-group mt-n4">
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
                      <Form.Group className="form-group mt-n4">
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
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="trDuration">
                        Mobile Number<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="mobileNumber"
                          name="mobileNumber"
                          value={data.mobileNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Mobile Number"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Mobile Number Should Contain Only 10 digits
                      </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
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
                      <Form.Group className="form-group mt-n4">
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

                    <Col lg="2">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl">
                          Training Period Start Date<span className="text-danger">*</span>
                          </Form.Label>
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
                                  className="form-control"
                                  minDate={new Date()}
                                  required
                                />
                              )}
                            </div>
                            </Form.Group>
                        </Col>

                        <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Date Of Completion<span className="text-danger">*</span>
                              </Form.Label>
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
                                  className="form-control"
                                  minDate={new Date()}
                                  required
                                />
                              )}
                            </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="fileUploadPath">
                        Upload Pdf/PPt/Video(Max:2mb)
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="fileUploadPath"
                            name="fileUploadPath"
                            // value={data.fileUploadPath}
                            onChange={handleUploadChange}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3 d-flex justify-content-center">
                        {fileUpload ? (
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={URL.createObjectURL(fileUpload)}
                          />
                        ) : (
                          selectedUploadFile && (
                            <img
                              style={{ height: "100px", width: "100px" }}
                              src={selectedUploadFile}
                              alt="Selected File"
                            />
                          )
                        )}
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
                    Clear
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

export default TrainingDeputationTrackerEdit;
