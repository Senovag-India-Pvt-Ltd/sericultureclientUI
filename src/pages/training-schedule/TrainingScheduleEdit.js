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
const baseURL2 = process.env.REACT_APP_API_BASE_URL_TRAINING;

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
        .post(baseURL2 + `trSchedule/edit`, data)
        .then((response) => {
          const trScheduleId = response.data.content.trScheduleId;
          if (trScheduleId) {
            handlePPtUpload(trScheduleId);
          }
          if(response.data.content.error){
            updateError(response.data.content.error_description);
            }else{
              updateSuccess();
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
            trUploadPath:"",
            trStartDate:"",
            trDateOfCompletion:"",
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

    const clear = () =>{
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
        trUploadPath:"",
        trStartDate:"",
        trDateOfCompletion:"",

      })
    }
  
    //   to get data from api
    const getIdList = () => {
      setLoading(true);
      const response = api
        .get(baseURL2 + `trSchedule/get/${id}`)
        .then((response) => {
          setData(response.data.content);
          setLoading(false);
          if (response.data.content.trUploadPath) {
            getPPtFile(response.data.content.trUploadPath);
          }
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

    // to get TrInstitutionMaster
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


  // Display Image
 const [ppt, setPPt] = useState("");
 // const [photoFile,setPhotoFile] = useState("")

 const handlePPtChange = (e) => {
   const file = e.target.files[0];
   setPPt(file);
   setData(prev=>({...prev,trUploadPath:file.name}))
   // setPhotoFile(file);
 };

 // Upload Image to S3 Bucket
 const handlePPtUpload = async (trScheduleid)=>{
   const parameters = `trScheduleId=${trScheduleid}`
   try{
     const formData = new FormData();
     formData.append("multipartFile",ppt);

     const response = await api.post(baseURL2 +`trSchedule/tr-upload-path?${parameters}`,formData,{
       headers: {
         'Content-Type': 'multipart/form-data', 
       },
     });
     console.log('File upload response:', response.data);

   }catch(error){
     console.error('Error uploading file:', error);
   }
 }

// To get Photo from S3 Bucket
const [selectedPPtFile, setPPtFile] = useState(null);

const getPPtFile = async (file) => {
  const parameters = `fileName=${file}`;
  try {
    const response = await api.get(
      baseURL + `api/s3/download?${parameters}`,
      {
        responseType: "arraybuffer",
      }
    );
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    setPPtFile(url);
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
      }).then(() => navigate("#"));
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
      }).then(() => navigate("#"));
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
                            isInvalid={data.userMasterId === undefined || data.userMasterId === "0"}
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

                    <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="photoPath">
                          Upload PPt/Video
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="trUploadPath"
                            name="trUploadPath"
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
                          selectedPPtFile && (
                            <img
                              style={{ height: "100px", width: "100px" }}
                              src={selectedPPtFile}
                              alt="Selected File"
                            />
                          )
                        )}
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
  
  export default TrainingScheduleEdit;