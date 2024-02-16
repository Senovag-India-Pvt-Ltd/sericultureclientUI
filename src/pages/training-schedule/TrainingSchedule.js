import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_TRAINING;

function TrainingSchedule() {

  const [trainerUserList, setTrainerUserList] = useState([]);
  const [trainerUser, setTrainerUser] = useState({
    trScheduleId: "",
    userMasterId: "",
    trainerName: "",
  });

  const [validated, setValidated] = useState(false);
  const [validatedTrainerUser, setValidatedTrainerUser] = useState(false);
  const [validatedTrainerUserEdit, setValidatedTrainerUserEdit] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAdd = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedTrainerUser(true);
    } else {
      e.preventDefault();
      setTrainerUserList((prev) => [...prev, trainerUser]);
      setTrainerUser({
        trScheduleId: "",
        userMasterId: "",
        trainerName: "",
      });
      setShowModal(false);
      setValidatedTrainerUser(false);
    }
  };

  const handleDelete = (i) => {
    setTrainerUserList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const [trUserId, setTrainerUserId] = useState();
  const handleGet = (i) => {
    setTrainerUser(trainerUserList[i]);
    setShowModal2(true);
    setTrainerUserId(i);
  };

  const handleUpdate = (e, i, changes) => {
    setTrainerUserList((prev) =>
      prev.map((item, ix) => {
        if (ix === i) {
          return { ...item, ...changes };
        }
        return item;
      })
    );
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedTrainerUserEdit(true);
    } else {
      e.preventDefault();
      setShowModal2(false);
      setValidatedTrainerUserEdit(false);
      setTrainerUser({
        trScheduleId: "",
        userMasterId: "",
        trainerName: "",
      });
    }
  };

  const handleTrUserInputs = (e) => {
    const { name, value } = e.target;
    setTrainerUser({ ...trainerUser, [name]: value });
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const [data, setData] = useState({
    userMasterId: "",
    trStakeholderType: "",
    trName: "",
    trInstitutionMasterId: "",
    trGroupMasterId: "",
    trProgramMasterId: "",
    trCourseMasterId: "",
    trModeMasterId: "",
    trDuration: "",
    trPeriod: "",
    trNoOfParticipant: "",
    trUploadPath: "",
    trStartDate: "",
    trDateOfCompletion: "",
  });

  

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
        .post(baseURL2 + `trSchedule/add`, data)
        .then((response) => {
          if (response.data.content.trScheduleId) {
            const trUploadId = response.data.content.trScheduleId;
            handlePPtUpload(trUploadId);
          }
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            if (trainerUserList.length > 0) {
              const trScheduleId = response.data.content.trScheduleId;
              trainerUserList.forEach((list) => {
                console.log(list);
                const updatedTrainerUser = {
                  ...list,
                  trScheduleId: trScheduleId,
                };
                api
                  .post(baseURL2 + `trainingScheduleUser/add`, updatedTrainerUser)
                  .then((response) => {
                    if (response.data.content.error) {
                      const trainerUserError = response.data.content.error_description;
                      saveError(trainerUserError);
                    } else {
                      saveSuccess();
                    }
                  })
                  .catch((err) => {
                    setTrainerUser({});
                    saveError(err.response.data.validationErrors);
                  });
              });
            } 
            saveSuccess();
            setData({
              userMasterId: "",
              trStakeholderType: "",
              trName: "",
              trInstitutionMasterId: "",
              trGroupMasterId: "",
              trProgramMasterId: "",
              trCourseMasterId: "",
              trModeMasterId: "",
              trDuration: "",
              trPeriod: "",
              trNoOfParticipant: "",
              trUploadPath: "",
              trStartDate: "",
              trDateOfCompletion: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          saveError(err.response.data.validationErrors);
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      userMasterId: "",
      trStakeholderType: "",
      trName: "",
      trInstitutionMasterId: "",
      trGroupMasterId: "",
      trProgramMasterId: "",
      trCourseMasterId: "",
      trModeMasterId: "",
      trDuration: "",
      trPeriod: "",
      trNoOfParticipant: "",
      trUploadPath: "",
      trStartDate: "",
      trDateOfCompletion: "",
    });
    setPPt("");
  };

  const trainerUserClear = () => {
    setTrainerUser({
      trScheduleId: "",
        userMasterId: "",
        trainerName: "",
    });
  };


  // Handle Options
  // TrainerUser
  const handleTrainerUserOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setTrainerUser({
      ...trainerUser,
      userMasterId: chooseId,
      username: chooseName,
    });
  };

  // to get User
  const [trUserListData, setTrUserListData] = useState([]);

  const getTrUserList = () => {
    const response = api
      .get(baseURL + `userMaster/get-all`)
      .then((response) => {
        setTrUserListData(response.data.content.userMaster);
      })
      .catch((err) => {
        setTrUserListData([]);
      });
  };

  useEffect(() => {
    getTrUserList();
  }, []);

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

  // Display Image
  const [ppt, setPPt] = useState("");
  // const [photoFile,setPhotoFile] = useState("")

  const handlePPtChange = (e) => {
    const file = e.target.files[0];
    setPPt(file);
    setData((prev) => ({ ...prev, trUploadPath: file.name }));
    // setPhotoFile(file);
  };

  // Upload Image to S3 Bucket
  const handlePPtUpload = async (trScheduleid) => {
    const parameters = `trScheduleId=${trScheduleid}`;
    try {
      const formData = new FormData();
      formData.append("multipartFile", ppt);

      const response = await api.post(
        baseURL2 + `trSchedule/upload-path?${parameters}`,
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
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("#");
    });
  };
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      html: Object.values(message).join("<br>"),
    });
  };

  return (
    <Layout title="Training Schedule">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Training Schedule</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/training-schedule-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/training-schedule-list"
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
                  {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        User<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="userMasterId"
                          value={data.userMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.userMasterId === undefined ||
                            data.userMasterId === "0"
                          }
                        >
                          <option value="">Select User</option>
                          {trUserListData.map((list) => (
                            <option
                              key={list.userMasterId}
                              value={list.userMasterId}
                            >
                              {list.username}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          User is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>Training Institution</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="trInstitutionMasterId"
                          value={data.trInstitutionMasterId}
                          onChange={handleInputs}
                          // onBlur={() => handleInputs}
                          // required
                          // isInvalid={data.trInstitutionMasterId === undefined || data.trInstitutionMasterId === "0"}
                        >
                          <option value="">Select Institution</option>
                          {trInstituteListData.map((list) => (
                            <option
                              key={list.trInstitutionMasterId}
                              value={list.trInstitutionMasterId}
                            >
                              {list.trInstitutionMasterName}
                            </option>
                          ))}
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                            Training Institution is required
                          </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
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
                          isInvalid={
                            data.trGroupMasterId === undefined ||
                            data.trGroupMasterId === "0"
                          }
                        >
                          <option value="">Select Group</option>
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
                    <Form.Group className="form-group">
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
                    <Form.Group className="form-group">
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
                    <Form.Group className="form-group">
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
                          isInvalid={
                            data.trModeMasterId === undefined ||
                            data.trModeMasterId === "0"
                          }
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
                        Training Duration(In Hours)
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
                        Training Period(In Days)
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
                  </Col>

                

                  {/* <Col lg="6">
                    <Form.Group className="form-group"> */}
                      <Form.Label column sm={2}>
                        Training Period Start Date
                        <span className="text-danger">*</span>
                      </Form.Label>
                      {/* <Row> */}
                        <Col sm={2}>
                          <div className="form-control-wrap">
                            {/* <DatePicker
                            selected={data.dob}
                            onChange={(date) => handleDateChange(date, "dob")}
                          /> */}
                            <DatePicker
                              selected={data.trStartDate}
                              onChange={(date) =>
                                handleDateChange(date, "trStartDate")
                              }
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                            />
                          </div>
                        </Col>
                      {/* </Row> */}
                      {/* </Form.Group> */}

                      {/* <Row> */}
                        {/* <Col lg="6"> */}
                          {/* <Form.Group className="form-group"> */}
                          <Form.Label column sm={2}>
                            Expected Date of Completion
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Col sm={2}>
                          <div className="form-control-wrap">
                            {/* <DatePicker
                            selected={data.dob}
                            onChange={(date) => handleDateChange(date, "dob")}
                          /> */}
                            <DatePicker
                              selected={data.trDateOfCompletion}
                              onChange={(date) =>
                                handleDateChange(date, "trDateOfCompletion")
                              }
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                            />
                          </div>
                        </Col>

                        <Col lg= "4">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="trUploadPath">
                        Upload PPT/Video
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          type="file"
                          id="trUploadPath"
                          name="trUploadPath"
                          // value={data.photoPath}
                          onChange={handlePPtChange}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group mt-3 d-flex justify-content-center">
                      {ppt ? (
                        <img
                          style={{ height: "100px", width: "100px" }}
                          src={URL.createObjectURL(ppt)}
                        />
                      ) : (
                        ""
                      )}
                    </Form.Group>
                  </Col>
                      </Row>
                    {/* </Form.Group>
                  </Col>
                </Row> */}
              </Card.Body>
            </Card>

            <Block className="mt-3">
              <Card>
                <Card.Header>Add Trainer</Card.Header>
                <Card.Body>
                  {/* <h3>Virtual Bank account</h3> */}
                  <Row className="g-gs mb-1">
                    <Col lg="6">
                      <Form.Group className="form-group mt-1">
                        <div className="form-control-wrap"></div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-5">
                        <div className="form-control-wrap">
                          <ul className="">
                            <li>
                              <Button
                                className="d-md-none"
                                size="md"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span>Add</span>
                              </Button>
                            </li>
                            <li>
                              <Button
                                className="d-none d-md-inline-flex"
                                variant="primary"
                                onClick={handleShowModal}
                              >
                                <Icon name="plus" />
                                <span>Add</span>
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {trainerUserList.length > 0 ? (
                    <Row className="g-gs">
                      <Block>
                        <Card>
                          <div
                            className="table-responsive"
                            // style={{ paddingBottom: "30px" }}
                          >
                            <table className="table small">
                              <thead>
                                <tr style={{ backgroundColor: "#f1f2f7" }}>
                                  {/* <th></th> */}
                                  <th>Action</th>
                                  <th>User Name</th>
                                  <th>Trainer Name</th>
                                </tr>
                              </thead>
                              <tbody>
                                {trainerUserList.map((item, i) => (
                                  <tr>
                                    <td>
                                      <div>
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => handleGet(i)}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() => handleDelete(i)}
                                          className="ms-2"
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </td>
                                    <td>{item.trainerName}</td>
                                    <td>{item.username}</td>
                                    {/* <td>{item.ifscCode}</td>
                                    <td>{item.marketMasterName}</td> */}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Card>
                      </Block>
                    </Row>
                  ) : (
                    ""
                  )}
                </Card.Body>
              </Card>
            </Block>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Save
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add Trainer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form noValidate validated={validatedTrainerUser} onSubmit={handleAdd}>
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    User<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="userMasterId"
                      // value={vbAccount.marketMasterId}
                      value={`${trainerUser.userMasterId}_${trainerUser.username}`}
                      onChange={handleTrainerUserOption}
                      onBlur={() => handleTrainerUserOption}
                      required
                      isInvalid={
                        trainerUser.userMasterId === undefined ||
                        trainerUser.userMasterId === "0"
                      }
                    >
                      <option value="">Select Trainer</option>
                      {trUserListData.length
                        ? trUserListData.map((list) => (
                            <option
                              key={list.userMasterId}
                              value={`${list.userMasterId}_${list.username}`}
                            >
                              {list.username}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      User is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg = "6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="trainerName">
                    Trainer Name<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="trainerName"
                      name="trainerName"
                      value={trainerUser.trainerName}
                      onChange={handleTrUserInputs}
                      type="text"
                      placeholder="Enter Trainer Name"
                      // required
                    />
                    {/* <Form.Control.Feedback type="invalid">
                      Virtual Account Number is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success">
                      Add
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal1}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    {/* <Button variant="secondary" onClick={handleCloseModal}>
                      Cancel
                    </Button> */}
                    <Button type="button" variant="secondary" onClick={trainerUserClear}>
                    Cancel
                  </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Trainer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedTrainerUserEdit}
            onSubmit={(e) => handleUpdate(e, trUserId, trainerUser)}
          >
            <Row className="g-5 px-5">
            <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label>
                    User<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="userMasterId"
                      // value={vbAccount.marketMasterId}
                      value={`${trainerUser.userMasterId}_${trainerUser.username}`}
                      onChange={handleTrainerUserOption}
                      onBlur={() => handleTrainerUserOption}
                      required
                      isInvalid={
                        trainerUser.userMasterId === undefined ||
                        trainerUser.userMasterId === "0"
                      }
                    >
                      <option value="">Select Trainer</option>
                      {trUserListData.length
                        ? trUserListData.map((list) => (
                            <option
                              key={list.userMasterId}
                              value={`${list.userMasterId}_${list.username}`}
                            >
                              {list.username}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      User is required
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg = "6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="trainerName">
                    Trainer Name<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="trainerName"
                      name="trainerName"
                      value={trainerUser.trainerName}
                      onChange={handleTrUserInputs}
                      type="text"
                      placeholder="Enter Trainer Name"
                      // required
                    />
                    {/* <Form.Control.Feedback type="invalid">
                      Virtual Account Number is required
                    </Form.Control.Feedback> */}
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button
                      variant="success"
                      onClick={() => handleUpdate(vbId, vbAccount)}
                    > */}
                    <Button type="submit" variant="success">
                      Update
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal1}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    {/* <Button variant="secondary" onClick={handleCloseModal2}>
                      Cancel
                    </Button> */}
                    <Button type="button" variant="secondary" onClick={trainerUserClear}>
                    Cancel
                  </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}
export default TrainingSchedule;
