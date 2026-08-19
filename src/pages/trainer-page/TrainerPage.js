import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
// import DatePicker from "../../../components/Form/DatePicker";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { Icon } from "../../components";
import api from "../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_TRAINING;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function TrainerPage() {
  const { t } = useTranslation();
  // Virtual Bank Account
  const [trDetailsList, setTrDetailsList] = useState([]);
  const [trDetails, setTrDetails] = useState({
    trTraineeName: "",
    designationId: "",
    trOfficeId: "",
    gender: "",
    mobileNumber: "",
    place: "",
    stateId: "",
    districtId: "",
    talukId: "",
    hobliId: "",
    villageId: "",
    preTestScore: "",
    postTestScore: "",
    percentageImproved: "",
  });

  const [validated, setValidated] = useState(false);
  const [validatedTrDetails, setValidatedTrDetails] = useState(false);
  const [validatedTrDetailsEdit, setValidatedTrDetailsEdit] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAdd = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidatedTrDetails(true);
    } else {
      e.preventDefault();
      setTrDetailsList((prev) => [...prev, trDetails]);
      setTrDetails({
        trTraineeName: "",
        designationId: "",
        trOfficeId: "",
        gender: "",
        mobileNumber: "",
        place: "",
        stateId: "",
        districtId: "",
        talukId: "",
        hobliId: "",
        villageId: "",
        preTestScore: "",
        postTestScore: "",
        percentageImproved: "",
      });
      setShowModal(false);
      setValidatedTrDetails(false);
    }
  };

  const handleDelete = (i) => {
    setTrDetailsList((prev) => {
      const newArray = prev.filter((item, place) => place !== i);
      return newArray;
    });
  };

  const [trainerId, setTrainerId] = useState();
  const handleGet = (i) => {
    setTrDetails(trDetails[i]);
    setShowModal2(true);
    setTrainerId(i);
  };

  const handleUpdate = (e, i, changes) => {
    setTrDetailsList((prev) =>
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
      setValidatedTrDetailsEdit(true);
    } else {
      e.preventDefault();
      setShowModal2(false);
      setValidatedTrDetailsEdit(false);
      setTrDetails({
        trTraineeName: "",
        designationId: "",
        trOfficeId: "",
        gender: "",
        mobileNumber: "",
        place: "",
        stateId: "",
        districtId: "",
        talukId: "",
        hobliId: "",
        villageId: "",
        preTestScore: "",
        postTestScore: "",
        percentageImproved: "",
      });
    }
  };

  const handleTrainerInputs = (e) => {
    const { name, value } = e.target;
    setTrDetails({ ...trDetails, [name]: value });
  };

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const [data, setData] = useState({
    trName: "",
    trInstitutionMasterId: "",
    trGroupMasterId: "",
    trProgramMasterId: "",
    trCourseMasterId: "",
    trModeMasterId: "",
    trStartDate: "",
    trDuration: "",
    trPeriod: "",
    trDateOfCompletion: "",
    trUploadPath: "",
    trNoOfParticipant: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

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
        .post(baseURL + `trSchedule/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            const trainerError = response.data.content.error_description;
            saveTrainerError(trainerError);
          } else {
            if (trDetailsList.length > 0) {
              const trScheduleId = response.data.content.trScheduleId;
              trDetailsList.forEach((list) => {
                const updatedTr = {
                  ...list,
                  trScheduleId: trScheduleId,
                };
                api
                  .post(baseURL + `trTrainee/add`, updatedTr)
                  .then((response) => {
                    if (response.data.content.error) {
                      const trainingError =
                        response.data.content.error_description;
                      saveTrainerError(trainingError);
                    } else {
                      saveSuccess();
                    }
                  })
                  .catch((err) => {
                    setTrDetails({});
                    saveError();
                  });
              });
            } else {
              saveSuccess();
            }
          }
        })
        .catch((err) => {
          setData({});
          saveError();
        });
      setValidated(true);
    }
  };

  // to get TrInstitutionMaster
  const [trInstituteListData, setTrInstituteListData] = useState([]);

  const getTrInstitutionMasterList = () => {
    const response = api
      .get(baseURL2 + `trInstitutionMaster/get-all`)
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
      .get(baseURL2 + `trGroupMaster/get-all`)
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
      .get(baseURL2 + `trProgramMaster/get-all`)
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
      .get(baseURL2 + `trCourseMaster/get-all`)
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
      .get(baseURL2 + `trModeMaster/get-all`)
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

  // to get Designation
  const [designationListData, setDesignationListData] = useState([]);

  const getDesignationList = () => {
    const response = api
      .get(baseURL2 + `designation/get-all`)
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

  // to get Designation
  const [officeListData, setOfficeListData] = useState([]);

  const getOfficeList = () => {
    const response = api
      .get(baseURL2 + `trOffice/get-all`)
      .then((response) => {
        setOfficeListData(response.data.content.trOffice);
      })
      .catch((err) => {
        setOfficeListData([]);
      });
  };

  useEffect(() => {
    getOfficeList();
  }, []);

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getList = () => {
    api
      .get(baseURL2 + `state/get-all`)
      .then((response) => {
        setStateListData(response.data.content.state);
      })
      .catch((err) => {
        setStateListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = (_id) => {
    api
      .get(baseURL2 + `district/get-by-state-id/${_id}`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (trDetails.stateId) {
      getDistrictList(trDetails.stateId);
    }
  }, [trDetails.stateId]);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    api
      .get(baseURL2 + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        setTalukListData(response.data.content.taluk);
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (trDetails.districtId) {
      getTalukList(trDetails.districtId);
    }
  }, [trDetails.districtId]);

  // to get hobli
  const [hobliListData, setHobliListData] = useState([]);

  const getHobliList = (_id) => {
    api
      .get(baseURL2 + `hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        setHobliListData(response.data.content.hobli);
      })
      .catch((err) => {
        setHobliListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (trDetails.talukId) {
      getHobliList(trDetails.talukId);
    }
  }, [trDetails.talukId]);

  // to get Village
  const [villageListData, setVillageListData] = useState([]);

  const getVillageList = (_id) => {
    api
      .get(baseURL2 + `village/get-by-hobli-id/${_id}`)
      .then((response) => {
        setVillageListData(response.data.content.village);
      })
      .catch((err) => {
        setVillageListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (trDetails.hobliId) {
      getVillageList(trDetails.hobliId);
    }
  }, [trDetails.hobliId]);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/trainer-page-list"));
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: t("Save attempt was not successful"),
      text: t("Something went wrong!"),
    });
  };

  const saveTrainerError = (message) => {
    Swal.fire({
      icon: "error",
      title: t("Save attempt was not successful"),
      text: message,
    });
  };

  // // const YourFormComponent = ({ data, handleDateChange }) => {
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

  // const handleDateChange = (date, type) => {
  //   setData({ ...data, [type]: date });
  // };

  // Handle Options
  // Office
  const handleOfficeOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setTrDetails({
      ...trDetails,
      trOfficeId: chooseId,
      trOfficeName: chooseName,
    });
  };

  // Designation
  const handleDesignationOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setTrDetails({
      ...trDetails,
      designationId: chooseId,
      name: chooseName,
    });
  };

  // State
  const handleStateOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setTrDetails({
      ...trDetails,
      stateId: chooseId,
      stateName: chooseName,
    });
  };

  // District
  const handleDistrictOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setTrDetails({
      ...trDetails,
      districtId: chooseId,
      districtName: chooseName,
    });
  };

  // Taluk
  const handleTalukOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setTrDetails({
      ...trDetails,
      talukId: chooseId,
      talukName: chooseName,
    });
  };

  // Hobli
  const handleHobliOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setTrDetails({
      ...trDetails,
      hobliId: chooseId,
      hobliName: chooseName,
    });
  };

  //   Village
  const handleVillageOption = (e) => {
    const value = e.target.value;
    const [chooseId, chooseName] = value.split("_");
    setTrDetails({
      ...trDetails,
      villageId: chooseId,
      villageName: chooseName,
    });
  };

  // Display Document
  const [document, setDocument] = useState("");

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
  };

  return (
    <Layout title={t("Trainer Page")}>
      <style>{trainerPageStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Trainer Page")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/trainer-page-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/trainer-page-list"
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

      {/* <Block className="mt-1"> */}
      {/* <Form action="#"> */}

      {/* <Card>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="12">
                      <Form.Group as={Row} className="form-group" controlId="fid">
                        <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                          FRUITS ID<span className="text-danger">*</span>
                        </Form.Label>
                        <Col sm={4}>
                          <Form.Control
                            type="fruitsId"
                            name="fruitsId"
                            value={data.fruitsId}
                            onChange={handleInputs}
                            placeholder="Enter FRUITS ID"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Fruits ID is required.
                          </Form.Control.Feedback>
                        </Col>
                        <Col sm={2}>
                          <Button
                            type="button"
                            variant="primary"
                            onClick={search}
                          >
                            Search
                          </Button>
                        </Col>
                        <Col sm={2}>
                          <Button
                            type="button"
                            variant="primary"
                            href="https://fruits.karnataka.gov.in/OnlineUserLogin.aspx"
                            target="_blank"
                            // onClick={search}
                          >
                            Generate FRUITS ID
                          </Button>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card> */}

      <Block className="mt-n4 sh-form-wrap">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Card>
            <Card.Header className="sh-section-header">
              <Icon name="book" />
              <span>{t("Training Details")}</span>
            </Card.Header>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="trName">
                      {t("Trainer Name")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="trName"
                        name="trName"
                        value={data.trName}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Trainer Name")}
                        required
                      />
                    </div>
                  </Form.Group>
                  <Form.Control.Feedback type="invalid">
                    {t("Trainer Name is required")}
                  </Form.Control.Feedback>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label>
                      {t("Training Institution")}<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="trInstitutionMasterId"
                        value={data.trInstitutionMasterId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.trInstitutionMasterId === undefined ||
                          data.trInstitutionMasterId === "0"
                        }
                      >
                        <option value="">{t("Select Institution")}</option>
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
                        {t("Training Institution is required")}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

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
                      {t("Training Duration")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="trDuration"
                        name="trDuration"
                        value={data.trDuration}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Training Duration")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="trPeriod">{t("Training Period")}</Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="trPeriod"
                        name="trPeriod"
                        value={data.trPeriod}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Training Period")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="trNoOfParticipant">
                      {t("Training No Of Participant")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="trNoOfParticipant"
                        name="trNoOfParticipant"
                        value={data.trNoOfParticipant}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Training No Of Participant")}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="form-group mt-2">
                    <Form.Label htmlFor="trUploadPath">
                      {t("Training Upload")}
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="trUploadPath"
                        name="trUploadPath"
                        value={data.trUploadPath}
                        onChange={handleInputs}
                        type="text"
                        placeholder={t("Enter Training Upload Path")}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>{t("Training Period Start Date")}</Form.Label>
                    <Row>
                      <Col lg="6">
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
                          />
                        </div>
                      </Col>
                    </Row>
                    {/* </Form.Group> */}

                    <Row>
                      <Col lg="6">
                        {/* <Form.Group className="form-group"> */}
                        <Form.Label>{t("Date of Completion")}</Form.Label>
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
                          />
                        </div>
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          {/* </Row>
            </Form>
            </Block> */}

          <Block className="mt-3">
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="user-list" />
                <span>{t("Trainer Details")}</span>
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
                    <Form.Group className="form-group d-flex align-items-center justify-content-end gap g-3">
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
                {trDetailsList && trDetailsList.length > 0 ? (
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
                                <th>{t("Trainee Name")}</th>
                                <th>{t("Designation")}</th>
                                <th>{t("Office")}</th>
                                <th>{t("Mobile Number")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {trDetailsList.map((item, i) => (
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
                                  <td>{item.trTraineeName}</td>
                                  <td>{item.name}</td>
                                  <td>{item.trOfficeName}</td>
                                  <td>{item.mobileNumber}</td>
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
                <Link
                  to="/seriui/trainer-page-list"
                  className="btn btn-secondary border-0 sh-cancel-btn"
                >
                  <Icon name="cross" />
                  <span>{t("Cancel")}</span>
                </Link>
              </li>
            </ul>
          </div>
        </Form>
      </Block>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="plus" />
            <span>{t("Add Trainer Details")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form noValidate validated={validatedTrDetails} onSubmit={handleAdd}>
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="trTraineeName">
                    {t("Trainee/Official Name")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="trTraineeName"
                      name="trTraineeName"
                      value={trDetails.trTraineeName}
                      onChange={handleTrainerInputs}
                      type="text"
                      placeholder={t("Enter Trainee/Official Name")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Trainee/Official Name is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("Designation")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="designationId"
                      // value={vbAccount.marketMasterId}
                      value={`${trDetails.designationId}_${trDetails.name}`}
                      onChange={handleDesignationOption}
                      onBlur={() => handleDesignationOption}
                      required
                      isInvalid={
                        trDetails.designationId === undefined ||
                        trDetails.designationId === "0"
                      }
                    >
                      <option value="">{t("Select Designation")}</option>
                      {designationListData.length
                        ? designationListData.map((list) => (
                            <option
                              key={list.designationId}
                              value={`${list.designationId}_${list.name}`}
                            >
                              {list.name}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Designation is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label>
                    {t("Office")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="trOfficeId"
                      // value={vbAccount.marketMasterId}
                      value={`${trDetails.trOfficeId}_${trDetails.trOfficeName}`}
                      onChange={handleOfficeOption}
                      onBlur={() => handleOfficeOption}
                      required
                      isInvalid={
                        trDetails.trOfficeId === undefined ||
                        trDetails.trOfficeId === "0"
                      }
                    >
                      <option value="">{t("Select Office")}</option>
                      {officeListData.length
                        ? officeListData.map((list) => (
                            <option
                              key={list.trOfficeId}
                              value={`${list.trOfficeId}_${list.trOfficeName}`}
                            >
                              {list.trOfficeName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Office is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label>{t("Gender")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="gender"
                      value={data.gender}
                      onChange={handleTrainerInputs}
                    >
                      <option value="">{t("Select Gender")}</option>
                      <option value="1">{t("Male")}</option>
                      <option value="2">{t("Female")}</option>
                      <option value="3">{t("Third Gender")}</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label htmlFor="mobileNumber">
                    {t("Mobile Number")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mobileNumber"
                      name="mobileNumber"
                      value={data.mobileNumber}
                      onChange={handleTrainerInputs}
                      type="text"
                      placeholder={t("Enter Mobile Number")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Mobile Number is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label htmlFor="place">
                    {t("Place")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="place"
                      name="place"
                      value={trDetails.place}
                      onChange={handleTrainerInputs}
                      type="text"
                      placeholder={t("Enter Place")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Place is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label>{t("State")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="stateId"
                      // value={`${farmerLand.stateId}_${farmerLand.stateName}`}
                      value={trDetails.stateId}
                      onChange={handleStateOption}
                    >
                      <option value="0">{t("Select State")}</option>
                      {stateListData.map((list) => (
                        <option key={list.stateId} value={list.stateId}>
                          {list.stateName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label>{t("District")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="districtId"
                      value={`${trDetails.districtId}_${trDetails.districtName}`}
                      onChange={handleDistrictOption}
                    >
                      <option value="">{t("Select District")}</option>
                      {districtListData && districtListData.length
                        ? districtListData.map((list) => (
                            <option
                              key={list.districtId}
                              value={`${list.districtId}_${list.districtName}`}
                            >
                              {list.districtName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label>{t("Taluk")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="talukId"
                      value={`${trDetails.talukId}_${trDetails.talukName}`}
                      onChange={handleTalukOption}
                    >
                      <option value="">{t("Select Taluk")}</option>
                      {talukListData && talukListData.length
                        ? talukListData.map((list) => (
                            <option
                              key={list.talukId}
                              value={`${list.talukId}_${list.talukName}`}
                            >
                              {list.talukName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5 ">
                  <Form.Label>{t("Hobli")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="hobliId"
                      value={`${trDetails.hobliId}_${trDetails.hobliName}`}
                      onChange={handleHobliOption}
                    >
                      <option value="">{t("Select Hobli")}</option>
                      {hobliListData && hobliListData.length
                        ? hobliListData.map((list) => (
                            <option
                              key={list.hobliId}
                              value={`${list.hobliId}_${list.hobliName}`}
                            >
                              {list.hobliName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label htmlFor="Village">{t("Village")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="villageId"
                      value={`${trDetails.villageId}_${trDetails.villageName}`}
                      onChange={handleVillageOption}
                    >
                      <option value="">{t("Select Village")}</option>
                      {villageListData && villageListData.length
                        ? villageListData.map((list) => (
                            <option
                              key={list.villageId}
                              value={`${list.villageId}_${list.villageName}`}
                            >
                              {list.villageName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label htmlFor="place">{t("Pre Test Score")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="preTestScore"
                      name="preTestScore"
                      value={trDetails.preTestScore}
                      onChange={handleTrainerInputs}
                      type="text"
                      placeholder={t("Enter Pre Test Score")}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label htmlFor="place">{t("Post Test Score")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="postTestScore"
                      name="postTestScore"
                      value={trDetails.postTestScore}
                      onChange={handleTrainerInputs}
                      type="text"
                      placeholder={t("Enter Post Test Score")}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label htmlFor="place">{t("Percentage Improved")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="percentageImproved"
                      name="percentageImproved"
                      value={trDetails.percentageImproved}
                      onChange={handleTrainerInputs}
                      type="text"
                      placeholder={t("Enter Improved Percentage")}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2">
                  <div className="gap-col">
                    {/* <Button variant="success" onClick={handleAdd}> */}
                    <Button type="submit" variant="success" className="sh-save-btn">
                      <Icon name="check" />
                      <span>{t("Add")}</span>
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                      <Button variant="danger" onClick={handleCloseModal1}>
                        Reject
                      </Button>
                    </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal} className="sh-cancel-btn">
                      <Icon name="cross" />
                      <span>{t("Cancel")}</span>
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="lg" className="sh-modal">
        <Modal.Header closeButton className="sh-modal-header">
          <Modal.Title>
            <Icon name="edit" />
            <span>{t("Edit Trainer Details")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form action="#"> */}
          <Form
            noValidate
            validated={validatedTrDetailsEdit}
            onSubmit={(e) => handleUpdate(e, trainerId, trDetails)}
          >
            <Row className="g-5 px-5">
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="trTraineeName">
                    {t("Trainee/Official Name")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="trTraineeName"
                      name="trTraineeName"
                      value={trDetails.trTraineeName}
                      onChange={handleTrainerInputs}
                      type="text"
                      placeholder={t("Enter Trainee/Official Name")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Trainee/Official Name is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label>
                    {t("Designation")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="designationId"
                      // value={vbAccount.marketMasterId}
                      value={`${trDetails.designationId}_${trDetails.name}`}
                      onChange={handleDesignationOption}
                      onBlur={() => handleDesignationOption}
                      required
                      isInvalid={
                        trDetails.designationId === undefined ||
                        trDetails.designationId === "0"
                      }
                    >
                      <option value="">{t("Select Designation")}</option>
                      {designationListData.length
                        ? designationListData.map((list) => (
                            <option
                              key={list.designationId}
                              value={`${list.designationId}_${list.name}`}
                            >
                              {list.name}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Designation is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>
                    {t("Office")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="trOfficeId"
                      // value={vbAccount.marketMasterId}
                      value={`${trDetails.trOfficeId}_${trDetails.trOfficeName}`}
                      onChange={handleOfficeOption}
                      onBlur={() => handleOfficeOption}
                      required
                      isInvalid={
                        trDetails.trOfficeId === undefined ||
                        trDetails.trOfficeId === "0"
                      }
                    >
                      <option value="">{t("Select Office")}</option>
                      {officeListData.length
                        ? officeListData.map((list) => (
                            <option
                              key={list.trOfficeId}
                              value={`${list.trOfficeId}_${list.trOfficeName}`}
                            >
                              {list.trOfficeName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {t("Office is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group  mt-n4">
                  <Form.Label>{t("Gender")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="gender"
                      value={data.gender}
                      onChange={handleTrainerInputs}
                    >
                      <option value="">{t("Select Gender")}</option>
                      <option value="1">{t("Male")}</option>
                      <option value="2">{t("Female")}</option>
                      <option value="3">{t("Third Gender")}</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group  mt-n4">
                  <Form.Label htmlFor="mobileNumber">
                    {t("Mobile Number")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mobileNumber"
                      name="mobileNumber"
                      value={data.mobileNumber}
                      onChange={handleTrainerInputs}
                      type="text"
                      placeholder={t("Enter Mobile Number")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Mobile Number is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group  mt-n4">
                  <Form.Label htmlFor="place">
                    {t("Place")}<span className="text-danger">*</span>
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="place"
                      name="place"
                      value={trDetails.place}
                      onChange={handleTrainerInputs}
                      type="text"
                      placeholder={t("Enter Place")}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {t("Place is required")}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group  mt-n4">
                  <Form.Label>{t("State")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="stateId"
                      // value={`${farmerLand.stateId}_${farmerLand.stateName}`}
                      value={trDetails.stateId}
                      onChange={handleStateOption}
                    >
                      <option value="0">{t("Select State")}</option>
                      {stateListData.map((list) => (
                        <option key={list.stateId} value={list.stateId}>
                          {list.stateName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>{t("District")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="districtId"
                      value={`${trDetails.districtId}_${trDetails.districtName}`}
                      onChange={handleDistrictOption}
                    >
                      <option value="">{t("Select District")}</option>
                      {districtListData && districtListData.length
                        ? districtListData.map((list) => (
                            <option
                              key={list.districtId}
                              value={`${list.districtId}_${list.districtName}`}
                            >
                              {list.districtName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label>{t("Taluk")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="talukId"
                      value={`${trDetails.talukId}_${trDetails.talukName}`}
                      onChange={handleTalukOption}
                    >
                      <option value="">{t("Select Taluk")}</option>
                      {talukListData && talukListData.length
                        ? talukListData.map((list) => (
                            <option
                              key={list.talukId}
                              value={`${list.talukId}_${list.talukName}`}
                            >
                              {list.talukName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4 ">
                  <Form.Label>{t("Hobli")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="hobliId"
                      value={`${trDetails.hobliId}_${trDetails.hobliName}`}
                      onChange={handleHobliOption}
                    >
                      <option value="">{t("Select Hobli")}</option>
                      {hobliListData && hobliListData.length
                        ? hobliListData.map((list) => (
                            <option
                              key={list.hobliId}
                              value={`${list.hobliId}_${list.hobliName}`}
                            >
                              {list.hobliName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n4">
                  <Form.Label htmlFor="Village">{t("Village")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="villageId"
                      value={`${trDetails.villageId}_${trDetails.villageName}`}
                      onChange={handleVillageOption}
                    >
                      <option value="">{t("Select Village")}</option>
                      {villageListData && villageListData.length
                        ? villageListData.map((list) => (
                            <option
                              key={list.villageId}
                              value={`${list.villageId}_${list.villageName}`}
                            >
                              {list.villageName}
                            </option>
                          ))
                        : ""}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label htmlFor="place">{t("Pre Test Score")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="preTestScore"
                      name="preTestScore"
                      value={trDetails.preTestScore}
                      onChange={handleTrainerInputs}
                      type="text"
                      placeholder={t("Enter Pre Test Score")}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label htmlFor="place">{t("Post Test Score")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="postTestScore"
                      name="postTestScore"
                      value={trDetails.postTestScore}
                      onChange={handleTrainerInputs}
                      type="text"
                      placeholder={t("Enter Post Test Score")}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-n5">
                  <Form.Label htmlFor="place">{t("Percentage Improved")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="percentageImproved"
                      name="percentageImproved"
                      value={trDetails.percentageImproved}
                      onChange={handleTrainerInputs}
                      type="text"
                      placeholder={t("Enter Improved Percentage")}
                    />
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
                    <Button type="submit" variant="success" className="sh-save-btn">
                      <Icon name="check" />
                      <span>{t("Update")}</span>
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                      <Button variant="danger" onClick={handleCloseModal1}>
                        Reject
                      </Button>
                    </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal2} className="sh-cancel-btn">
                      <Icon name="cross" />
                      <span>{t("Cancel")}</span>
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

const trainerPageStyles = `
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

export default TrainerPage;
