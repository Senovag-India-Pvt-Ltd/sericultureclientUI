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
import Quill from "../../components/Form/editors/Quill";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
// const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function HelpDesk() {

  const [data, setData] = useState({
    hdModuleId: "",
    hdFeatureId: "",
    hdCategoryId: "",
    hdSubCategoryId: "",
    usersAffectedId: "",

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
      .post(baseURL + `trSchedule/add`, data)
      .then((response) => {
        if(response.data.content.trScheduleId){
          const trUploadId = response.data.content.trScheduleId;
          handlePPtUpload(trUploadId);
        }
        if(response.data.content.error){
            saveError(response.data.content.error_description);
            }else{
              saveSuccess();
              setData({
                hdModuleId: "",
                hdFeatureId: "",
                hdCategoryId: "",
                hdSubCategoryId: "",
                usersAffectedId: "",
              });
              setValidated(false);
            }
      })
      .catch((err) => {
        saveError();
      });
      setValidated(true);
    }
  };

  const clear = () =>{
    setData({
        hdModuleId: "",
        hdFeatureId: "",
        hdCategoryId: "",
        hdSubCategoryId: "",
        usersAffectedId: "",
    })
  }

  const [loading, setLoading] = useState(false);

  
  // to get Module
  const [moduleListData, setModuleListData] = useState([]);

  const getModuleList = () => {
    const response = api
      .get(baseURL + `moduleMaster/get-all`)
      .then((response) => {
        setModuleListData(response.data.content.moduleMaster);
      })
      .catch((err) => {
        setModuleListData([]);
      });
  };

  useEffect(() => {
    getModuleList();
  }, []);

  // to get Feature
  const [featureListData, setFeatureListData] = useState([]);

  const getFeatureList = (_id) => {
    const response = api
      .get(baseURL + `hdFeatureMaster/get-by-module-id/${_id}`)
      .then((response) => {
        setFeatureListData(response.data.content.hdFeatureMaster);
        setLoading(false);
        if (response.data.content.error) {
          setFeatureListData([]);
        }
      })
      .catch((err) => {
        setFeatureListData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (data.hdModuleId) {
    getFeatureList(data.hdModuleId);
    }
  }, [data.hdModuleId]);


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
   setData(prev=>({...prev,trUploadPath:file.name}))
   // setPhotoFile(file);
 };

 // Upload Image to S3 Bucket
 const handlePPtUpload = async (trScheduleid)=>{
   const parameters = `trScheduleId=${trScheduleid}`
   try{
     const formData = new FormData();
     formData.append("multipartFile",ppt);

     const response = await api.post(baseURL +`trSchedule/tr-upload-path?${parameters}`,formData,{
       headers: {
         'Content-Type': 'multipart/form-data', 
       },
     });
     console.log('File upload response:', response.data);

   }catch(error){
     console.error('Error uploading file:', error);
   }
 }


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
      text: message,
    });
  };

  return (
    <Layout title="Help Desk">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Help Desk</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/help-desk-list" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/help-desk-list"
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
                  <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                      <Form.Label>
                        Module<span className="text-danger">*</span>
                      </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="hdModuleId"
                            value={data.hdModuleId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs} 
                            required
                            isInvalid={data.hdModuleId === undefined || data.hdModuleId === "0"}
                          >
                            <option value="">Select Module</option>
                            {moduleListData.map((list) => (
                              <option
                                key={list.hdModuleId}
                                value={list.hdModuleId}
                              >
                                {list.hdModuleName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Module Name is required
                          </Form.Control.Feedback>
                        </div>
                    </Form.Group> 
                    </Col>

                    <Col lg="4">
                    <Form.Group className="form-group mt-n3">
                            <Form.Label>
                             Feature<span className="text-danger">*</span>
                            </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="hdFeatureId"
                                  value={data.hdFeatureId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs} 
                                  required
                                  isInvalid={data.hdFeatureId === undefined || data.hdFeatureId === "0"}
                                >
                                  <option value="">Select Feature</option>
                                  {featureListData.map((list) => (
                                    <option
                                      key={list.hdFeatureId}
                                      value={list.hdFeatureId}
                                    >
                                      {list.hdFeatureName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Feature Name is required
                                </Form.Control.Feedback>
                              </div>
                          </Form.Group> 
                          </Col>

                          <Col lg="4">
                          <Form.Group
                            className="form-group mt-n3"
                          >
                            <Form.Label>
                              Category<span className="text-danger">*</span>
                            </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="hdCategoryId"
                                  value={data.hdCategoryId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs} 
                                  required
                                  isInvalid={data.hdCategoryId === undefined || data.hdCategoryId === "0"}
                                >
                                  <option value="">Select Category</option>
                                  {trGroupListData.map((list) => (
                                    <option
                                      key={list.hdCategoryId}
                                      value={list.hdCategoryId}
                                    >
                                      {list.hdCategoryName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                 Category Name is required
                                </Form.Control.Feedback>
                              </div>
                          </Form.Group>
                        </Col>          

                        <Col lg="4">
                          <Form.Group
                            className="form-group mt-n4"
                          >
                            <Form.Label>
                              Sub Category<span className="text-danger">*</span>
                            </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="hdSubCategoryId"
                                  value={data.hdSubCategoryId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs} 
                                  required
                                  isInvalid={data.hdSubCategoryId === undefined || data.hdSubCategoryId === "0"}
                                >
                                  <option value="">Select Sub Category</option>
                                  {trProgramListData.map((list) => (
                                    <option
                                      key={list.hdSubCategoryId}
                                      value={list.hdSubCategoryId}
                                    >
                                      {list.hdSubCategoryName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Sub Category Name is required
                                </Form.Control.Feedback>
                              </div>
                          </Form.Group> 
                        </Col>  

                        <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="trDuration">
                            Users Affected
                            </Form.Label>
                            <div className="form-control-wrap">
                            <Form.Control
                                id="usersAffectedId"
                                name="usersAffectedId"
                                value={data.usersAffectedId}
                                onChange={handleInputs}
                                type="text"
                                placeholder="Enter Users Affected"
                            />
                            </div>
                            </Form.Group>
                        </Col>

                    <Col lg ="12">
                        <Form.Group className="form-group mt-n4">
                      {/* <Form.Label htmlFor="address">
                        Query<span className="text-danger">*</span>
                      </Form.Label> */}
                      <Card.Header>Query</Card.Header>
                      <div className="form-control-wrap">
                        <Form.Control
                          as="textarea"
                          id="query"
                          name="query"
                          value={data.query}
                          onChange={handleInputs}
                          type="text"
                          placeholder=""
                          rows="1"

                        />
                        {/* <Form.Control.Feedback type="invalid">
                          Market Address is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                    </Col>

                    <Col lg ="12">
                        <Form.Group className="form-group mt-n4">
                      {/* <Form.Label htmlFor="address">
                        Query<span className="text-danger">*</span>
                      </Form.Label> */}
                      <Card.Header>Query Details</Card.Header>
                      <div className="form-control-wrap">
                        {/* <Form.Control
                          as="textarea"
                          id="queryDetails"
                          name="queryDetails"
                          value={data.queryDetails}
                          onChange={handleInputs}
                          type="text"
                          placeholder=""
                          rows=""

                        /> */}
                        <Quill placeholderValue="Enter the query"/>
                        {/* <Form.Control.Feedback type="invalid">
                          Market Address is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                    </Col>

                    <div className="gap-col">
                        <ul className="d-flex align-items-start justify-content-start gap g-3">
                            <li>
                            {/* <Button type="button" variant="primary" onClick={postData}> */}
                            <Button type="submit" variant="primary">
                                Attach Files
                            </Button>
                            </li>
                            <li>
                            <Button type="button" variant="secondary" onClick={clear}>
                                Create New Ticket
                            </Button>
                            </li>
                        </ul>
                    </div>
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
export default HelpDesk