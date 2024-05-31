import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function UserHierarchyMapping() {
  const [data, setData] = useState({
    actualDesignationId: "",
    actualUserId: "",
    actualDistrictId: "",
    actualFirstName: "",
    reportUserMasterId: "",
    reportDesignationId: "",
    reportDistrictId: "",
    reportFirstName: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
    if(name === "actualUserId"){
      getUsersList(value);
    }
    if(name === "reportUserMasterId"){
      getUserMastersList(value);
    }
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
      const sendPost = {
        reporteeUserMasterId: data.actualUserId,
        reportToUserMasterId: data.reportUserMasterId,
    };
      api
        .post(baseURL + `userHierarchyMapping/add`, sendPost)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              actualDesignationId: "",
              actualUserId: "",
              actualDistrictId: "",
              actualFirstName: "",
              reportUserMasterId: "",
              reportDesignationId: "",
              reportDistrictId: "",
              reportFirstName: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
            if (
                err.response &&
                err.response &&
                err.response.data &&
                err.response.data.validationErrors
              ) {
                if (Object.keys(err.response.data.validationErrors).length > 0) {
                  saveError(err.response.data.validationErrors);
                }
              }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
    actualDesignationId: "",
    actualUserId: "",
    actualDistrictId: "",
    actualFirstName: "",
    reportUserMasterId: "",
    reportDesignationId: "",
    reportDistrictId: "",
    reportFirstName: "",
    });
  };


  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = (_id) => {
    const response = api
      .get(baseURL + `district/get-all`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);


  // to get designation
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

  // to get hobli
  const [userListData, setUserListData] = useState([]);

  const getUserList = (designationId, districtId) => {
    const response = api
      .post(baseURL + `userMaster/get-by-designationId-and-districtId`,{
        designationId:designationId,
        districtId:districtId
      })
      .then((response) => {
        if (response.data.content.userMaster) {
          setUserListData(response.data.content.userMaster);
        }else{
          setUserListData([]);
          setData(prev=>({...prev,actualFirstName:""}))
        }
      })
      .catch((err) => {
        setUserListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  

    // to get hobli
  const [userMasterListData, setUserMasterListData] = useState([]);

  const getUserMasterList = (designationId, districtId) => {
    const response = api
      .post(baseURL + `userMaster/get-by-designationId-and-districtId`,{
        designationId:designationId,
        districtId:districtId
      })
      .then((response) => {
        if (response.data.content.userMaster) {
          setUserMasterListData(response.data.content.userMaster);
        }else{
          setUserMasterListData([]);
          setData(prev=>({...prev,reportFirstName:""}))
        }
      })
      .catch((err) => {
        setUserMasterListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.actualDesignationId && data.actualDistrictId) {
        getUserList(data.actualDesignationId, data.actualDistrictId);
      }
    }, [data.actualDesignationId, data.actualDistrictId]);

  useEffect(() => {
    if (data.reportDesignationId && data.reportDistrictId) {
        getUserMasterList(data.reportDesignationId, data.reportDistrictId);
      }
    }, [data.reportDesignationId, data.reportDistrictId]);

   
  
    const getUsersList = (_id) => {
       api
        .get(baseURL + `userMaster/get-join/${_id}`)
        .then((response) => {
          if (response.data) {
            setData(prev=>({...prev,
              actualFirstName:response.data.content.firstName
            }));
            setValidated(false);
          }
        })
        .catch((err) => {
          setValidated(false);
        });
    };

    const getUserMastersList = (_id) => {
      api
       .get(baseURL + `userMaster/get-join/${_id}`)
       .then((response) => {
         if (response.data) {
          setData(prev=>({...prev,
            reportFirstName:response.data.content.firstName
          }));
           setValidated(false);
         }
       })
       .catch((err) => {
        setValidated(false);
       });
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
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };
  return (
    <Layout title="User Hierarchy Mapping">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">User Hierarchy Mapping</Block.Title>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/user-hierarchy-mapping-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/user-hierarchy-mapping-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          {/* <Row className="g-3 "> */}
            <Card>
            <Card.Header>Actual User</Card.Header>
              <Card.Body>
                <Row className="g-gs">
                <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Designation<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="actualDesignationId"
                          value={data.actualDesignationId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.actualDesignationId === undefined ||
                            data.actualDesignationId === "0"
                          }
                        >
                          <option value="">Select Designation</option>
                          {designationListData && designationListData.length
                            ? designationListData.map((list) => (
                                <option
                                  key={list.designationId}
                                  value={list.designationId}
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
                        District<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="actualDistrictId"
                          value={data.actualDistrictId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            !data.actualDistrictId === undefined ||
                            data.actualDistrictId === "0"
                          }
                        >
                          <option value="">Select District</option>
                          {districtListData && districtListData.length
                            ? districtListData.map((list) => (
                                <option
                                  key={list.districtId}
                                  value={list.districtId}
                                >
                                  {list.districtName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          District Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        User<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="actualUserId"
                          value={data.actualUserId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.actualUserId === undefined || data.actualUserId === "0"
                          }
                        >
                          <option value="">Select User</option>
                          {userListData && userListData.length
                            ? userListData.map((list) => (
                                <option key={list.userMasterId} value={list.userMasterId}>
                                  {list.username}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          User Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                 
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="emailID">
                         First Name<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="actualFirstName"
                          name="actualFirstName"
                          value={data.actualFirstName}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter First Name"
                          readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                        First Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {/* </Block> */}

        {/* <Block> */}
            <Card >
            <Card.Header>Reported User</Card.Header>
              <Card.Body>
                <Row className="g-gs">
                <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Designation<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="reportDesignationId"
                          value={data.reportDesignationId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.reportDesignationId === undefined ||
                            data.reportDesignationId === "0"
                          }
                        >
                          <option value="">Select Designation</option>
                          {designationListData && designationListData.length
                            ? designationListData.map((list) => (
                                <option
                                  key={list.designationId}
                                  value={list.designationId}
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
                        District<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="reportDistrictId"
                          value={data.reportDistrictId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            !data.reportDistrictId === undefined ||
                            data.reportDistrictId === "0"
                          }
                        >
                          <option value="">Select District</option>
                          {districtListData && districtListData.length
                            ? districtListData.map((list) => (
                                <option
                                  key={list.districtId}
                                  value={list.districtId}
                                >
                                  {list.districtName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          District Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        User<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="reportUserMasterId"
                          value={data.reportUserMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.reportUserMasterId === undefined || data.reportUserMasterId === "0"
                          }
                        >
                          <option value="">Select User</option>
                          {userMasterListData && userMasterListData.length
                            ? userMasterListData.map((list) => (
                                <option key={list.userMasterId} value={list.userMasterId}>
                                  {list.username}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          User Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                 
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="emailID">
                         First Name<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="reportFirstName"
                          name="reportFirstName"
                          value={data.reportFirstName}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter First Name"
                          readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                        First Name is required
                        </Form.Control.Feedback>
                      </div>
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
                  {/* <Link
                    to="/seriui/village-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
                  </Link> */}
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
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

export default UserHierarchyMapping;
