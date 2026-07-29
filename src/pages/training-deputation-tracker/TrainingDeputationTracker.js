import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon, Select } from "../../components";
import DatePicker from "react-datepicker";
// import axios from "axios";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_TRAINING;

function TrainingDeputationTracker() {
  const [data, setData] = useState({
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

  const [validated, setValidated] = useState(false);
  const { t } = useTranslation();

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "mobileNumber" && (value.length < 10 || value.length > 10)) {
      // console.log("hellohello");
      e.target.classList.add("is-invalid");
      e.target.classList.remove("is-valid");
    } else if (name === "mobileNumber" && value.length === 10) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
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
      if (data.mobileNumber.length !== 10) {
        return;
    }

      api
        .post(baseURL2 + `trainingDeputationTracker/add`, data)
        .then((response) => {
          if (response.data.content.trainingDeputationId) {
            const deputationId = response.data.content.trainingDeputationId;
            handleUpload(deputationId);
          }
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
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
            setFileUpload("")
            document.getElementById("fileUploadPath").value = "";
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        // const validationErrors = err.response?.data?.validationErrors; 
        // if (validationErrors && Object.keys(validationErrors).length > 0) {
        //   saveError(validationErrors);
        // }
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
      deputedInstitute: "",
      fileUploadPath: "",
      deputedFromDate: null,
      deputedToDate: null,
      trProgramMasterId: "",
      trCourseMasterId: "",
      deputedAttended: "",
      deputedRemarks: "",
    });
    setFileUpload("")
    document.getElementById("fileUploadPath").value = "";
  };

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

  // // to get Deputed
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

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

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
      // text: "You clicked the button!",
    }).then(() => {
      navigate("#");
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
      title: t("Save attempt was not successful"),
      html: errorMessage,
    });
  };

  return (
    <Layout title={t("Training Deputation Tracker")}>
      <style>{trainingDeputationTrackerStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Training Deputation Tracker")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/training-deputation-tracker-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/training-deputation-tracker-list"
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
            <Card>
            <Card.Header className="sh-section-header">
              <Icon name="activity-round" />
              <span>{t("Training Deputation Tracker")}</span>
            </Card.Header>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-n3">
                      <Form.Label htmlFor="official Name">
                        {t("Name Of the Official")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="officialName"
                          name="officialName"
                          value={data.officialName}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Name Of the Official")}
                          required
                        />
                      </div>
                    </Form.Group>
                    <Form.Control.Feedback type="invalid">
                      {t("Name Of the Official is required")}
                    </Form.Control.Feedback>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n3">
                      <Form.Label>
                        {t("Designation")}<span className="text-danger">*</span>
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
                          <option value="">{t("Select Designation")}</option>
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
                          {t("Designation is required")}
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
                          <option value="">{t("Select Deputed Institute")}</option>
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
                          {t("Deputed Institute is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="official Name">
                        {t("Deputed to Institute Name and Details")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="deputedInstitute"
                          name="deputedInstitute"
                          value={data.deputedInstitute}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Deputed Institute Details")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Training Program")}<span className="text-danger">*</span>
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
                          <option value="">{t("Select Program")}</option>
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
                          {t("Training Program is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Training Course")}<span className="text-danger">*</span>
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
                          <option value="">{t("Select Course")}</option>
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
                          {t("Training Course is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="trDuration">
                        {t("Official Address")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="officialAddress"
                          name="officialAddress"
                          value={data.officialAddress}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Official Address")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="trDuration">
                        {t("Mobile Number")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="mobileNumber"
                          name="mobileNumber"
                          value={data.mobileNumber}
                          onChange={handleInputs}
                          maxLength="10"
                          type="text"
                          placeholder={t("Enter Mobile Number")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Mobile Number Should Contain Only 10 digits")}
                      </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>{t("Training Attended")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="deputedAttended"
                          value={data.deputedAttended}
                          onChange={handleInputs}
                        >
                          <option value="">{t("Select")}</option>
                          <option value="1">{t("Yes")}</option>
                          <option value="2">{t("No")}</option>
                          {/* <option value="3">Third Gender</option> */}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="trNoOfParticipant">
                        {t("Remarks")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="deputedRemarks"
                          name="deputedRemarks"
                          value={data.deputedRemarks}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Remarks")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                    <Col lg="2">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl">
                          {t("Training Period Start Date")}<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                        <DatePicker
                          selected={data.deputedFromDate}
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
                          </div>
                          </Form.Group>
                          <Form.Control.Feedback type="invalid">
                        {t("Start Date is Required")}
                      </Form.Control.Feedback>
                        </Col>

                        <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                {t("Date Of Completion")}<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                            <DatePicker
                              selected={data.deputedToDate}
                              onChange={(date) =>
                                handleDateChange(date, "deputedToDate")
                              }
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              minDate={new Date(data.deputedFromDate)}
                              required
                            />
                          </div>
                          </Form.Group>
                          <Form.Control.Feedback type="invalid">
                          {t("Completion Date is Required")}
                        </Form.Control.Feedback>
                        </Col>

                  <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="fileUploadPath">
                      {t("Upload Pdf/PPt/Video(Max:5MB)")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        type="file"
                        id="fileUploadPath"
                        name="fileUploadPath"
                        // value={data.photoPath}
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
                      ""
                    )}
                  </Form.Group>
                </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary" className="sh-save-btn">
                    <Icon name="save" />
                    <span>{t("Save")}</span>
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                    <Icon name="cross" />
                    <span>{t("Clear")}</span>
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
const trainingDeputationTrackerStyles = `
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
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-form-wrap .text-danger {
    font-weight: 700;
    margin-left: 3px;
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important;
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
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    font-weight: 600;
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
`;

export default TrainingDeputationTracker;
