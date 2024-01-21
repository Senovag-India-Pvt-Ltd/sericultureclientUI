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

// const baseURL = process.env.REACT_APP_API_BASE_URL_REGISTRATION;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function TrainerPage() {
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
          .post(baseURL2 + `trSchedule/add`, data)
          .then((response) => {
            if (response.data.content.error) {
              const trainerError = response.data.content.error_description;
                saveTrainerError(trainerError);
            }else{
  
              if (trDetailsList.length > 0) {
                const trScheduleId = response.data.content.trScheduleId;
                trDetailsList.forEach((list) => {
                  const updatedTr = {
                    ...list,
                    trScheduleId: trScheduleId,
                  };
                  api
                    .post(baseURL2 + `trTrainee/add`, updatedTr)
                    .then((response) => {
                      if (response.data.content.error) {
                        const trainingError = response.data.content.error_description;
                          saveTrainerError(trainingError);
                        }else{
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
        title: "Saved successfully",
        // text: "You clicked the button!",
      }).then(() => navigate("/trainer-page-list"));
    };
    const saveError = () => {
      Swal.fire({
        icon: "error",
        title: "Save attempt was not successful",
        text: "Something went wrong!",
      });
    };
  
    const saveTrainerError = (message) => {
      Swal.fire({
        icon: "error",
        title: "Save attempt was not successful",
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
      <Layout title="Trainer Page">
        <Block.Head>
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2">Trainer Page</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/trainer-page-list"
                    className="btn btn-primary btn-md d-md-none"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go to List</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/trainer-page-list"
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
  
            <Block className="mt-n4">
              
            <Form noValidate validated={validated} onSubmit={postData}>
                <Card>
                  <Card.Header>Training Details</Card.Header>
                  <Card.Body>
                    <Row className="g-gs">
                      <Col lg="6">
                      <Form.Group className="form-group">
                      <Form.Label htmlFor="trName">Trainer Name<span className="text-danger">*</span></Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="trName"
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
                                <Form.Control.Feedback type="invalid">
                                  Training Institution is required
                                </Form.Control.Feedback>
                              </div>
                          </Form.Group> 
                          </Col>

                          <Col lg="6">
                          <Form.Group
                            className="form-group mt-n4"
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
                          <Form.Group
                            className="form-group mt-n4"
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
                            className="form-group mt-n4"
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
                          <Form.Group
                            className="form-group mt-n4"
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
                 <Form.Group className="form-group mt-n4">
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
                    <Form.Group className="form-group mt-n4">
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
                    <Form.Group className="form-group mt-n4">
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

                    <Form.Group className="form-group mt-2">
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
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>Training Period Start Date</Form.Label>
                        <Row>
                          <Col lg="6">
                          <div className="form-control-wrap">
                          {/* <DatePicker
                            selected={data.dob}
                            onChange={(date) => handleDateChange(date, "dob")}
                          /> */}
                          <DatePicker
                            selected={data.trStartDate}
                            onChange={(date) => handleDateChange(date, "trStartDate")}
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
                            selected={data.trDateOfCompletion}
                            onChange={(date) => handleDateChange(date, "trDateOfCompletion")}
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
  
              <Block className= "mt-3">
                <Card>
                  <Card.Header>Trainer Details</Card.Header>
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
                                    <th>Action</th>
                                    <th>Trainee Name</th>
                                    <th>Designation</th>
                                    <th>Office</th>
                                    <th>Mobile Number</th>
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
                    <Button type="submit" variant="primary">
                      Save
                    </Button>
                  </li>
                  <li>
                    <Link
                      to="/trainer-page-list"
                      className="btn btn-secondary border-0"
                    >
                      Cancel
                    </Link>
                  </li>
                </ul>
              </div> 
          </Form>
        </Block>
  
        <Modal show={showModal} onHide={handleCloseModal} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Add Trainer Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <Form action="#"> */}
            <Form noValidate validated={validatedTrDetails} onSubmit={handleAdd}>
              <Row className="g-5 px-5">
                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="trTraineeName">
                      Trainee/Official Name<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="trTraineeName"
                        name="trTraineeName"
                        value={trDetails.trTraineeName}
                        onChange={handleTrainerInputs}
                        type="text"
                        placeholder="Enter Trainee/Official Name"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Trainee/Official Name is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  </Col>

                  <Col lg="6"> 
                  <Form.Group className="form-group">
                    <Form.Label>
                      Designation<span className="text-danger">*</span>
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
                        <option value="">Select Designation</option>
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
                      Designation is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>
  
                <Col lg="6">
                <Form.Group className="form-group mt-n5">
                    <Form.Label>
                      Office<span className="text-danger">*</span>
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
                        <option value="">Select Office</option>
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
                        Office is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>
                
                <Col lg="6">
                  <Form.Group className="form-group mt-n5">
                        <Form.Label>Gender</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="gender"
                            value={data.gender}
                            onChange={handleTrainerInputs}
                          >
                            <option value="">Select Gender</option>
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                            <option value="3">Third Gender</option>
                          </Form.Select>
                        </div>
                      </Form.Group>
                    </Col>
                            
                    <Col lg="6">
                      <Form.Group className="form-group mt-n5">
                        <Form.Label htmlFor="mobileNumber">
                          Mobile Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mobileNumber"
                            name="mobileNumber"
                            value={data.mobileNumber}
                            onChange={handleTrainerInputs}
                            type="text"
                            placeholder="Enter Mobile Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Mobile Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group mt-n5">
                        <Form.Label htmlFor="place">
                          Place<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="place"
                            name="place"
                            value={trDetails.place}
                            onChange={handleTrainerInputs}
                            type="text"
                            placeholder="Enter Place"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Place is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    
                    <Col lg="6">
                      <Form.Group className="form-group mt-n5">
                      <Form.Label>State</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="stateId"
                          // value={`${farmerLand.stateId}_${farmerLand.stateName}`}
                          value={trDetails.stateId}
                          onChange={handleStateOption}
                        >
                          <option value="0">Select State</option>
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
                      <Form.Label>District</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="districtId"
                          value={`${trDetails.districtId}_${trDetails.districtName}`}
                          onChange={handleDistrictOption}
                        >
                          <option value="">Select District</option>
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
                      <Form.Label>Taluk</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="talukId"
                          value={`${trDetails.talukId}_${trDetails.talukName}`}
                          onChange={handleTalukOption}
                        >
                          <option value="">Select Taluk</option>
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
                      <Form.Label>Hobli</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hobliId"
                          value={`${trDetails.hobliId}_${trDetails.hobliName}`}
                          onChange={handleHobliOption}
                        >
                          <option value="">Select Hobli</option>
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
                      <Form.Label htmlFor="Village">Village</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="villageId"
                          value={`${trDetails.villageId}_${trDetails.villageName}`}
                          onChange={handleVillageOption}
                        >
                          <option value="">Select Village</option>
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
                        <Form.Label htmlFor="place">
                          Pre Test Score
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="preTestScore"
                            name="preTestScore"
                            value={trDetails.preTestScore}
                            onChange={handleTrainerInputs}
                            type="text"
                            placeholder="Enter Pre Test Score"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n5">
                        <Form.Label htmlFor="place">
                          Post Test Score
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="postTestScore"
                            name="postTestScore"
                            value={trDetails.postTestScore}
                            onChange={handleTrainerInputs}
                            type="text"
                            placeholder="Enter Post Test Score"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n5">
                        <Form.Label htmlFor="place">
                          Percentage Improved
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="percentageImproved"
                            name="percentageImproved"
                            value={trDetails.percentageImproved}
                            onChange={handleTrainerInputs}
                            type="text"
                            placeholder="Enter Improved Percentage"
                          />
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
                      <Button variant="secondary" onClick={handleCloseModal}>
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
            <Modal.Title>Edit Trainer Details</Modal.Title>
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
                    Trainee/Official Name<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="trTraineeName"
                        name="trTraineeName"
                        value={trDetails.trTraineeName}
                        onChange={handleTrainerInputs}
                        type="text"
                        placeholder="Enter Trainee Name"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Trainee Name is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  </Col>

                  <Col lg="6"> 
                  <Form.Group className="form-group">
                    <Form.Label>
                      Designation<span className="text-danger">*</span>
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
                        <option value="">Select Designation</option>
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
                      Designation is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>
  
                <Col lg="6">
                <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Office<span className="text-danger">*</span>
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
                        <option value="">Select Office</option>
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
                        Office is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>
                
                <Col lg="6">
                  <Form.Group className="form-group  mt-n4">
                        <Form.Label>Gender</Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="gender"
                            value={data.gender}
                            onChange={handleTrainerInputs}
                          >
                            <option value="">Select Gender</option>
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                            <option value="3">Third Gender</option>
                          </Form.Select>
                        </div>
                      </Form.Group>
                    </Col>
                            
                    <Col lg="6">
                      <Form.Group className="form-group  mt-n4">
                        <Form.Label htmlFor="mobileNumber">
                          Mobile Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="mobileNumber"
                            name="mobileNumber"
                            value={data.mobileNumber}
                            onChange={handleTrainerInputs}
                            type="text"
                            placeholder="Enter Mobile Number"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Mobile Number is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      </Col>

                      <Col lg="6">
                      <Form.Group className="form-group  mt-n4">
                        <Form.Label htmlFor="place">
                          Place<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="place"
                            name="place"
                            value={trDetails.place}
                            onChange={handleTrainerInputs}
                            type="text"
                            placeholder="Enter Place"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Place is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    
                    <Col lg="6">
                      <Form.Group className="form-group  mt-n4">
                      <Form.Label>State</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="stateId"
                          // value={`${farmerLand.stateId}_${farmerLand.stateName}`}
                          value={trDetails.stateId}
                          onChange={handleStateOption}
                        >
                          <option value="0">Select State</option>
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
                      <Form.Label>District</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="districtId"
                          value={`${trDetails.districtId}_${trDetails.districtName}`}
                          onChange={handleDistrictOption}
                        >
                          <option value="">Select District</option>
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
                      <Form.Label>Taluk</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="talukId"
                          value={`${trDetails.talukId}_${trDetails.talukName}`}
                          onChange={handleTalukOption}
                        >
                          <option value="">Select Taluk</option>
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
                      <Form.Label>Hobli</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="hobliId"
                          value={`${trDetails.hobliId}_${trDetails.hobliName}`}
                          onChange={handleHobliOption}
                        >
                          <option value="">Select Hobli</option>
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
                      <Form.Label htmlFor="Village">Village</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="villageId"
                          value={`${trDetails.villageId}_${trDetails.villageName}`}
                          onChange={handleVillageOption}
                        >
                          <option value="">Select Village</option>
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
                        <Form.Label htmlFor="place">
                          Pre Test Score
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="preTestScore"
                            name="preTestScore"
                            value={trDetails.preTestScore}
                            onChange={handleTrainerInputs}
                            type="text"
                            placeholder="Enter Pre Test Score"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n5">
                        <Form.Label htmlFor="place">
                          Post Test Score
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="postTestScore"
                            name="postTestScore"
                            value={trDetails.postTestScore}
                            onChange={handleTrainerInputs}
                            type="text"
                            placeholder="Enter Post Test Score"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n5">
                        <Form.Label htmlFor="place">
                          Percentage Improved
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="percentageImproved"
                            name="percentageImproved"
                            value={trDetails.percentageImproved}
                            onChange={handleTrainerInputs}
                            type="text"
                            placeholder="Enter Improved Percentage"
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
                      <Button variant="secondary" onClick={handleCloseModal2}>
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
  
  export default TrainerPage;
  