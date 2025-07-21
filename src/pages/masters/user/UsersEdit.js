import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function UsersEdit() {
    // Translation
    const { t } = useTranslation();
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
        .post(baseURL + `userMaster/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError();
          } else {
            updateSuccess();
            setData({
              firstName: "",
              middleName: "",
              lastName: "",
              password: "",
              emailID: "",
              stateId: "",
              districtId: "",
              talukId: "",
              roleId: "",
              marketMasterId: "",
              username: "",
              designationId: "",
              phoneNumber: "",
              workingInstitutionId: "",
              ddoCode: "",
              tscMasterId:"",
              khazaneRecipientId: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (err.response.data.errorMessages[0].message[0].message) {
            const message =
              err.response.data.errorMessages[0].message[0].message;
            updateError(message);
          }
          if (err.response.data.validationErrors) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              updateError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      firstName: "",
      middleName: "",
      lastName: "",
      password: "",
      emailID: "",
      stateId: "",
      districtId: "",
      talukId: "",
      roleId: "",
      marketMasterId: "",
      username: "",
      designationId: "",
      phoneNumber: "",
      workingInstitutionId: "",
      ddoCode: "",
      tscMasterId:"",
      khazaneRecipientId: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `userMaster/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  // to get working Institution
  const [workingInstitutionListData, setWorkingInstitutionListData] = useState(
    []
  );

  const getWorkingInstitutionList = () => {
    const response = api
      .get(baseURL + `workingInstitution/get-all`)
      .then((response) => {
        setWorkingInstitutionListData(response.data.content.workingInstitution);
      })
      .catch((err) => {
        setWorkingInstitutionListData([]);
      });
  };

  useEffect(() => {
    getWorkingInstitutionList();
  }, []);

  // to get role
  const [roleListData, setRoleListData] = useState([]);

  const getRoleList = () => {
    const response = api
      .get(baseURL + `role/get-all`)
      .then((response) => {
        setRoleListData(response.data.content.role);
      })
      .catch((err) => {
        setRoleListData([]);
      });
  };

  useEffect(() => {
    getRoleList();
  }, []);

  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getMarketList = () => {
    const response = api
      .get(baseURL + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    getMarketList();
  }, []);

   // to get tsc
   const [tscListData, setTscListData] = useState([]);

   const getTscList = () => {
     const response = api
       .get(baseURL + `tscMaster/get-all`)
       .then((response) => {
         setTscListData(response.data.content.tscMaster);
       })
       .catch((err) => {
         setTscListData([]);
       });
   };
 
   useEffect(() => {
     getTscList();
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

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `state/get-all`)
      .then((response) => {
        if (response.data.content.state) {
          setStateListData(response.data.content.state);
        }
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
    const response = api
      .get(baseURL + `district/get-by-state-id/${_id}`)
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
    if (data.stateId) {
      getDistrictList(data.stateId);
    }
  }, [data.stateId]);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    const response = api
      .get(baseURL + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        setTalukListData(response.data.content.taluk);
      })
      .catch((err) => {
        if (response.data.content.taluk) {
          setTalukListData(response.data.content.taluk);
        }
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      getTalukList(data.districtId);
    }
  }, [data.districtId]);

  const navigate = useNavigate();

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
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
    <Layout title="Edit User">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("User")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/users-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/users-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
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
                      <Form.Label htmlFor="username">
                      {t("User Name")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="username"
                          name="username"
                          value={data.username}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter User Name")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("User Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="firstName">
                      {t("First Name")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="firstName"
                          name="firstName"
                          value={data.firstName}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter First Name")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("First Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="middleName">
                      {t("Middle Name")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="middleName"
                          name="middleName"
                          value={data.middleName}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Middle Name")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Middle Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="lastName">
                      {t("Last Name")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lastName"
                          name="lastName"
                          value={data.lastName}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Last Name")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Last Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="emailID">
                      {t("Email")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="emailID"
                          name="emailID"
                          value={data.emailID}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Email")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Email Name is required")}
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
                        {t("Designation is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="emailID">
                      {t("Mobile Number")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="phoneNumber"
                          name="phoneNumber"
                          value={data.phoneNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Phone Number")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Mobile Number is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="password">
                      {t("Password")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="password"
                          name="password"
                          value={data.password}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter password"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Password Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                      {t("Role")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="roleId"
                          value={data.roleId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.roleId === undefined || data.roleId === "0"
                          }
                        >
                          <option value="">{t("Select Role")}</option>
                          {roleListData && roleListData.length
                            ? roleListData.map((list) => (
                                <option key={list.roleId} value={list.roleId}>
                                  {list.roleName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {t("Role Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                      {t("Market")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="marketMasterId"
                          value={data.marketMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.marketMasterId === undefined ||
                            data.marketMasterId === "0"
                          }
                        >
                          <option value="">{t("Select Market")}</option>
                          {marketListData && marketListData.length
                            ? marketListData.map((list) => (
                                <option
                                  key={list.marketMasterId}
                                  value={list.marketMasterId}
                                >
                                  {list.marketMasterName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {t("Market is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                      {t("Working Institution")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="workingInstitutionId"
                          value={data.workingInstitutionId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.workingInstitutionId === undefined ||
                            data.workingInstitutionId === "0"
                          }
                        >
                          <option value="">{t("Select Working Institution")}</option>
                          {workingInstitutionListData &&
                          workingInstitutionListData.length
                            ? workingInstitutionListData.map((list) => (
                                <option
                                  key={list.workingInstitutionId}
                                  value={list.workingInstitutionId}
                                >
                                  {list.workingInstitutionName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {t("Working Institution Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                      {t("tsc")}   <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="tscMasterId"
                          value={data.tscMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.tscMasterId === undefined || data.tscMasterId === "0"
                          }
                        >
                          <option value="">{t("select_tsc")}</option>
                          {tscListData.map((list) => (
                            <option key={list.tscMasterId} value={list.tscMasterId}>
                              {list.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {t("Tsc Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                      {t("state")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="stateId"
                          value={data.stateId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.stateId === undefined || data.stateId === "0"
                          }
                        >
                          <option value="">{t("select_state")}</option>
                          {stateListData.map((list) => (
                            <option key={list.stateId} value={list.stateId}>
                              {list.stateName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {t("state_is_required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                      {t("district")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="districtId"
                          value={data.districtId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.districtId === undefined ||
                            data.districtId === "0"
                          }
                        >
                          <option value="">{t("select_district")}</option>
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
                        {t("district_is_required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                      {t("taluk")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="talukId"
                          value={data.talukId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.talukId === undefined || data.talukId === "0"
                          }
                        >
                          <option value="">{t("select_taluk")}</option>
                          {talukListData && talukListData.length
                            ? talukListData.map((list) => (
                                <option key={list.talukId} value={list.talukId}>
                                  {list.talukName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        {t("taluk_is_required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="password">
                      {t("DDO Code")}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="ddoCode"
                          name="ddoCode"
                          value={data.ddoCode}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter DDO Code")}
                          // required
                        />
                       
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="password">{t("Khazane ID")}</Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="khazaneRecipientId"
                              name="khazaneRecipientId"
                              value={data.khazaneRecipientId}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter Khazane ID")}
                              // required
                            />
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
                  {t("update")}
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                  {t("cancel")}
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

export default UsersEdit;
