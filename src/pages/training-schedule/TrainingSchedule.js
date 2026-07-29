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
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_TRAINING;

function TrainingSchedule() {
  const { t } = useTranslation();
  const [trainerUserList, setTrainerUserList] = useState([]);
  const [trainerUser, setTrainerUser] = useState({
    trScheduleId: "",
    userMasterId: "",
    trainerName: "",
    trInstitutionMasterId: "",
  });

  const [validated, setValidated] = useState(false);
  const [validatedTrainerUser, setValidatedTrainerUser] = useState(false);
  const [validatedTrainerUserEdit, setValidatedTrainerUserEdit] =
    useState(false);

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
        trInstitutionMasterId: "",
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
        trInstitutionMasterId: "",
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
    trStartDate: null,
    trDateOfCompletion: null,
    districtId: "",
    talukId: "",
    place: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "trDuration" && value.length > 2) {
      e.target.classList.remove("is-valid");
      e.target.classList.add("is-invalid");
    } else if (name === "trDuration" && value.length <= 2) {
      e.target.classList.add("is-valid");
      e.target.classList.remove("is-invalid");
    }

    if (name === "trPeriod" && value.length > 2) {
      e.target.classList.remove("is-valid");
      e.target.classList.add("is-invalid");
    } else if (name === "trPeriod" && value.length <= 2) {
      e.target.classList.add("is-valid");
      e.target.classList.remove("is-invalid");
    }

    if (name === "trNoOfParticipant" && value.length > 3) {
      e.target.classList.remove("is-valid");
      e.target.classList.add("is-invalid");
    } else if (name === "trNoOfParticipant" && value.length <= 3) {
      e.target.classList.add("is-valid");
      e.target.classList.remove("is-invalid");
    }
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const formattedFromDate =
      new Date(data.trStartDate).getFullYear() +
      "-" +
      (new Date(data.trStartDate).getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      new Date(data.trStartDate).getDate().toString().padStart(2, "0");

    const formattedToDate =
      new Date(data.trDateOfCompletion).getFullYear() +
      "-" +
      (new Date(data.trDateOfCompletion).getMonth() + 1)
        .toString()
        .padStart(2, "0") +
      "-" +
      new Date(data.trDateOfCompletion).getDate().toString().padStart(2, "0");

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      if (data.trDuration.length > 2) {
        return;
      }
      if (data.trPeriod.length > 2) {
        return;
      }
      if (data.trNoOfParticipant.length > 3) {
        return;
      }
      api
        .post(baseURL2 + `trSchedule/add`, {
          ...data,
          trStartDate: formattedFromDate,
          trDateOfCompletion: formattedToDate,
        })
        .then((response) => {
          if (response.data.content.trScheduleId && ppt ) {
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
                  .post(
                    baseURL2 + `trainingScheduleUser/add`,
                    updatedTrainerUser
                  )
                  .then((response) => {
                    if (response.data.content.error) {
                      const trainerUserError =
                        response.data.content.error_description;
                      saveError(trainerUserError);
                    }
                    //  else {
                    //   saveSuccess();
                    // }
                  })
                  .catch((err) => {
                    setTrainerUser({});
                    if (
                      Object.keys(err.response.data.validationErrors).length > 0
                    ) {
                      saveError(err.response.data.validationErrors);
                    }
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
              trStartDate: null,
              trDateOfCompletion: null,
              districtId: "",
              talukId: "",
              place: "",
            });
            setPPt("");
            setTrainerUser({
              trScheduleId: "",
              userMasterId: "",
              trainerName: "",
              trInstitutionMasterId: "",
            });
            setTrainerUserList([]);
            document.getElementById("trUploadPath").value = "";
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
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
      trStartDate: null,
      trDateOfCompletion: null,
      districtId: "",
      talukId: "",
      place: "",
    });
    setPPt("");
    setTrainerUser({
      trScheduleId: "",
      userMasterId: "",
      trainerName: "",
      trInstitutionMasterId: "",
    });
    setTrainerUserList([]);
    document.getElementById("trUploadPath").value = "";
  };

  const trainerUserClear = () => {
    setTrainerUser({
      trScheduleId: "",
      userMasterId: "",
      trainerName: "",
      trInstitutionMasterId: "",
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

  // TrainerUser
  const handleTrainerInstitutionOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setTrainerUser({
      ...trainerUser,
      trInstitutionMasterId: chooseId,
      trInstitutionMasterName: chooseName,
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

  // to get District
    const [districtListData, setDistrictListData] = useState([]);
  
    const getDistrictList = () => {
      const response = api
        .get(baseURL + `district/get-all`)
        .then((response) => {
          setDistrictListData(response.data.content.district);
        })
        .catch((err) => {
          setDistrictListData([]);
        });
    };
  
    useEffect(() => {
      getDistrictList();
    }, []);

    // to get taluk
      const [talukListData, setTalukListData] = useState([]);
    
      const getTalukList = (_id) => {
        const response = api
          .get(baseURL + `taluk/get-by-district-id/${_id}`)
          .then((response) => {
            if (response.data.content.taluk) {
              setTalukListData(response.data.content.taluk);
            }
          })
          .catch((err) => {
            setTalukListData([]);
            // alert(err.response.data.errorMessages[0].message[0].message);
          });
      };
    
      // useEffect(() => {
      //   if (searchData.districtId) {
      //     getTalukList(searchData.districtId);
      //   }
      // }, [searchData.districtId]);
      useEffect(() => {
        const districtId =
          data.districtId
        if (districtId) {
          getTalukList(districtId);
        }
      }, [data.districtId]);

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

  return (
    <Layout title="Schedule Training">
      <style>{trainingScheduleStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Schedule Training")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/training-schedule-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/training-schedule-list"
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
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          {/* <Row className="g-1 "> */}
          <Card>
            <Card.Header className="sh-section-header">
              <Icon name="calendar" />
              <span>{t("Schedule Training")}</span>
            </Card.Header>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">
                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      {t("Training Group")}<span className="text-danger">*</span>
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
                        <option value="">{t("Select Group")}</option>
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
                        {t("Training Group is required")}
                      </Form.Control.Feedback>
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
                    <Form.Label>
                      {t("Training Mode")}<span className="text-danger">*</span>
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
                        <option value="">{t("Select Training Mode")}</option>
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
                        {t("Training Mode is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="trDuration">
                      {t("Training Duration Per Day (In Hours)")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="trDuration"
                        name="trDuration"
                        value={data.trDuration}
                        onChange={handleInputs}
                        type="text"
                        maxLength="2"
                        placeholder={t("Enter Training Duration")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Training Duration Should Be Less Than 24 Hours")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="trPeriod">
                      {t("Training Period (In Days)")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="trPeriod"
                        name="trPeriod"
                        value={data.trPeriod}
                        onChange={handleInputs}
                        type="text"
                        maxLength="2"
                        placeholder={t("Enter Training Period")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Training Period Must Be Limited To 2 Digits or Less")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="trNoOfParticipant">
                      {t("Training No Of Participant")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="trNoOfParticipant"
                        name="trNoOfParticipant"
                        value={data.trNoOfParticipant}
                        onChange={handleInputs}
                        type="text"
                        maxLength="3"
                        placeholder={t("Enter No Of Participant")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t("Participant Number Must Be Limited To Three Digits or Less")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                 <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("District")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="districtId"
                          value={data.districtId}
                          onChange={handleInputs}
                          // onBlur={() => handleInputs}
                          // required
                          // isInvalid={
                          //   data.districtId === undefined ||
                          //   data.districtId === "0"
                          // }
                        >
                          <option value="">{t("Select District")}</option>
                          {districtListData && districtListData.length
                          ?districtListData.map((list) => (
                            <option
                              key={list.districtId}
                              value={list.districtId}
                            >
                              {list.districtName}
                            </option>
                          ))
                          :""}
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                          {t("District is required")}
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        {t("Taluk")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="talukId"
                          value={data.talukId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
                          // isInvalid={
                          //   data.talukId === undefined ||
                          //   data.talukId === "0"
                          // }
                        >
                          <option value="">{t("Select Taluk")}</option>
                          {talukListData && talukListData.length
                          ?talukListData.map((list) => (
                            <option
                              key={list.talukId}
                              value={list.talukId}
                            >
                              {list.talukName}
                            </option>
                          ))
                          : ""}
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                          {t("Taluk is required")}
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                   <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="trNoOfParticipant">
                      {t("Training Place")}
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="place"
                        name="place"
                        value={data.place}
                        onChange={handleInputs}
                        type="text"
                        // maxLength="3"
                        placeholder={t("Enter Training Place")}
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                        {t("Participant Number Must Be Limited To Three Digits or Less")}
                      </Form.Control.Feedback> */}
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="trUploadPath">
                      {t("Upload Pdf/PPt/Video (Max: 5MB)")}
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

                <Form.Label column sm={2}>
                  {t("Training Period Start Date")}<span className="text-danger">*</span>
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
                    <DatePicker
                      selected={data.trStartDate}
                      onChange={(date) => handleDateChange(date, "trStartDate")}
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
                </Col>

                <Form.Label column sm={2}>
                  {t("Expected Date of Completion")}<span className="text-danger">*</span>
                </Form.Label>
                <Col sm={2}>
                  <div className="form-control-wrap">
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
                      minDate={new Date(data.trStartDate)}
                      required
                    />
                  </div>
                </Col>

                
              </Row>
            </Card.Body>
          </Card>

          <Block className="mt-3">
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="user-list" />
                <span>{t("Add Trainer")}</span>
              </Card.Header>
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
                              className="d-md-none sh-save-btn"
                              size="md"
                              variant="primary"
                              onClick={handleShowModal}
                            >
                              <Icon name="plus" />
                              <span>{t("Add")}</span>
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="d-none d-md-inline-flex sh-save-btn"
                              variant="primary"
                              onClick={handleShowModal}
                            >
                              <Icon name="plus" />
                              <span>{t("Add")}</span>
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
                                <th>{t("Action")}</th>
                                <th>{t("User Name")}</th>
                                <th>{t("Training Institution")}</th>
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
                                        className="d-inline-flex align-items-center gap-1 shadow-sm"
                                      >
                                        <Icon name="edit" />
                                        {t("Edit")}
                                      </Button>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(i)}
                                        className="ms-2 d-inline-flex align-items-center gap-1 shadow-sm"
                                      >
                                        <Icon name="trash" />
                                        {t("Delete")}
                                      </Button>
                                    </div>
                                  </td>
                                  <td>{item.username}</td>
                                  <td>{item.trInstitutionMasterName}</td>
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

      <Modal show={showModal} onHide={handleCloseModal} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="plus" />
            <span>{t("Add Trainer")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedTrainerUser}
            onSubmit={handleAdd}
          >
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group mt-2">
                  <Form.Label>
                    {t("User")}<span className="text-danger">*</span>
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
                      <option value="">{t("Select Trainer")}</option>
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
                      {t("User is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-2">
                  <Form.Label>
                    {t("Training Institution")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="trInstitutionMasterId"
                      // value={vbAccount.marketMasterId}
                      value={`${trainerUser.trInstitutionMasterId}_${trainerUser.trInstitutionMasterName}`}
                      onChange={handleTrainerInstitutionOption}
                      onBlur={() => handleTrainerInstitutionOption}
                      required
                      isInvalid={
                        trainerUser.trInstitutionMasterId === undefined ||
                        trainerUser.trInstitutionMasterId === "0"
                      }
                    >
                      <option value="">{t("Select Training Institution")}</option>
                      {trInstituteListData.length
                        ? trInstituteListData.map((list) => (
                            <option
                              key={list.trInstitutionMasterId}
                              value={`${list.trInstitutionMasterId}_${list.trInstitutionMasterName}`}
                            >
                              {list.trInstitutionMasterName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Training Institution is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              {/* <Col lg = "6">
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
                    
                  </div>
                </Form.Group>
              </Col> */}

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success">
                      {t("Add")}
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
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={trainerUserClear}
                    >
                      {t("Clear")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="edit" />
            <span>{t("Edit Trainer")}</span>
          </Modal.Title>
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
                <Form.Group className="form-group mt-2">
                  <Form.Label>
                    {t("User")}<span className="text-danger">*</span>
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
                      <option value="">{t("Select Trainer")}</option>
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
                      {t("User is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-2">
                  <Form.Label>
                    {t("Training Institution")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="trInstitutionMasterId"
                      // value={vbAccount.marketMasterId}
                      value={`${trainerUser.trInstitutionMasterId}_${trainerUser.trInstitutionMasterName}`}
                      onChange={handleTrainerInstitutionOption}
                      onBlur={() => handleTrainerInstitutionOption}
                      required
                      isInvalid={
                        trainerUser.trInstitutionMasterId === undefined ||
                        trainerUser.trInstitutionMasterId === "0"
                      }
                    >
                      <option value="">{t("Select Training Institution")}</option>
                      {trInstituteListData.length
                        ? trInstituteListData.map((list) => (
                            <option
                              key={list.trInstitutionMasterId}
                              value={`${list.trInstitutionMasterId}_${list.trInstitutionMasterName}`}
                            >
                              {list.trInstitutionMasterName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Training Institution is required")}
                    </Form.Control.Feedback>
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
                      {t("Update")}
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
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={trainerUserClear}
                    >
                      {t("Clear")}
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
const trainingScheduleStyles = `
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
  .sh-section-header .icon,
  .sh-modal-content .modal-header svg,
  .sh-modal-content .modal-header .icon {
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
  .sh-modal .modal-content {
    border: none;
    border-radius: 12px;
    overflow: hidden;
  }
  .sh-modal-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    color: #ffffff !important;
  }
  .sh-modal-header .modal-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: #ffffff !important;
  }
  .sh-modal-header .btn-close {
    filter: invert(1) brightness(2);
  }
`;

export default TrainingSchedule;
