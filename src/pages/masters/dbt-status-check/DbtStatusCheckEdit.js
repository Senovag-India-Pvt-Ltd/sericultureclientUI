import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DbtStatusCheckEdit() {
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
        .post(baseURL + `dbtStatusCheck/edit`, {...data,dbtStatusCheckId:id})
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              deptCode: "",
    schemeId: "",
    componentTypeId: "",
    componentId: "",
    subComponentId: "",
    dbtScheme: "",
    username: "",
    password: ""
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
              updateError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      deptCode: "",
    schemeId: "",
    componentTypeId: "",
    componentId: "",
    subComponentId: "",
    dbtScheme: "",
    username: "",
    password: ""
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `dbtStatusCheck/get/${id}`)
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

//   // to get State
//   const [stateListData, setStateListData] = useState([]);

//   const getList = () => {
//     const response = api
//       .get(baseURL + `state/get-all`)
//       .then((response) => {
//         setStateListData(response.data.content.state);
//       })
//       .catch((err) => {
//         setStateListData([]);
//       });
//   };

//   useEffect(() => {
//     getList();
//   }, []);

//   // to get Division
//   const [divisionListData, setDivisionListData] = useState([]);

//   const getDivisionList = () => {
//     const response = api
//       .get(baseURL + `divisionMaster/get-all`)
//       .then((response) => {
//         setDivisionListData(response.data.content.DivisionMaster);
//       })
//       .catch((err) => {
//         setDivisionListData([]);
//       });
//   };

//   useEffect(() => {
//     getDivisionList();
//   }, []);

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
    <Layout title="Edit Dbt Status Check">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit Dbt Status Check")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/dbtStatusCheck-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/dbtStatusCheck-list"
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
                      {loading ? (
                        <h1 className="d-flex justify-content-center align-items-center">
                          Loading...
                        </h1>
                      ) : (
                        <Row className="g-gs">
                                            <Col lg="6">
                                              <Form.Group className="form-group mt-3">
                                                <Form.Label htmlFor="deptCode">{t("Dept Code")}</Form.Label>
                                                <div className="form-control-wrap">
                                                  <Form.Control
                                                    id="deptCode"
                                                    name="deptCode"
                                                    type="text"
                                                    value={data.deptCode}
                                                    onChange={handleInputs}
                                                    placeholder={t("Enter Dept Code")}
                                                  />
                                                </div>
                                              </Form.Group>
                                            </Col>
                          
                          
                                            <Col lg="6">
                                              <Form.Group className="form-group mt-3">
                                                <Form.Label htmlFor="schemeId">{t("Scheme Id")}</Form.Label>
                                                <div className="form-control-wrap">
                                                  <Form.Control
                                                    id="schemeId"
                                                    name="schemeId"
                                                    type="text"
                                                    value={data.schemeId}
                                                    onChange={handleInputs}
                                                    placeholder={t("Enter Scheme Id")}
                                                  />
                                                </div>
                                              </Form.Group>
                                            </Col>
                          
                                            <Col lg="6">
                                                                                   <Form.Group className="form-group mt-3">
                                                                                     <Form.Label htmlFor="componentTypeId">{t("Component Type Id")}</Form.Label>
                                                                                     <div className="form-control-wrap">
                                                                                       <Form.Control
                                                                                         id="componentTypeId"
                                                                                         name="componentTypeId"
                                                                                         type="text"
                                                                                         value={data.componentTypeId}
                                                                                         onChange={handleInputs}
                                                                                         placeholder={t("Enter Component Type Id")}
                                                                                       />
                                                                                     </div>
                                                                                   </Form.Group>
                                                                                 </Col>
                                                               
                          
                                            <Col lg="6">
                                              <Form.Group className="form-group mt-3">
                                                <Form.Label htmlFor="componentId">{t("Component Id")}</Form.Label>
                                                <div className="form-control-wrap">
                                                  <Form.Control
                                                    id="componentId"
                                                    name="componentId"
                                                    type="text"
                                                    value={data.componentId}
                                                    onChange={handleInputs}
                                                    placeholder={t("Enter Component Id")}
                                                  />
                                                </div>
                                              </Form.Group>
                                            </Col>
                          
                          
                                            <Col lg="6">
                                              <Form.Group className="form-group mt-3">
                                                <Form.Label htmlFor="subComponentId">{t("Sub Component Id")}</Form.Label>
                                                <div className="form-control-wrap">
                                                  <Form.Control
                                                    id="subComponentId"
                                                    name="subComponentId"
                                                    type="text"
                                                    value={data.subComponentId}
                                                    onChange={handleInputs}
                                                    placeholder={t("Enter Sub Component Id")}
                                                  />
                                                </div>
                                              </Form.Group>
                                            </Col>
                          
                          
                          
                          
                          
                                            <Col lg="6">
                                                                                   <Form.Group className="form-group mt-3">
                                                                                     <Form.Label htmlFor="dbtScheme">{t("Dbt Scheme")}</Form.Label>
                                                                                     <div className="form-control-wrap">
                                                                                       <Form.Control
                                                                                         id="dbtScheme"
                                                                                         name="dbtScheme"
                                                                                         type="text"
                                                                                         value={data.dbtScheme}
                                                                                         onChange={handleInputs}
                                                                                         placeholder={t("Enter Dbt Scheme")}
                                                                                       />
                                                                                     </div>
                                                                                   </Form.Group>
                                                                                 </Col>
                                                               
                          
                                            <Col lg="6">
                                              <Form.Group className="form-group mt-3">
                                                <Form.Label htmlFor="username">{("User Name")}</Form.Label>
                                                <div className="form-control-wrap">
                                                  <Form.Control
                                                    id="username"
                                                    name="username"
                                                    type="text"
                                                    value={data.username}
                                                    onChange={handleInputs}
                                                    placeholder={t("Enter Username")}
                                                  />
                                                </div>
                                              </Form.Group>
                                            </Col>
                          
                          
                                            <Col lg="6">
                                              <Form.Group className="form-group mt-3">
                                                <Form.Label htmlFor="password">{("Password")}</Form.Label>
                                                <div className="form-control-wrap">
                                                  <Form.Control
                                                    id="password"
                                                    name="password"
                                                    type="text"
                                                    value={data.password}
                                                    onChange={handleInputs}
                                                    placeholder={t("Enter password")}
                                                  />
                                                </div>
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
                  {t("update")}
                  </Button>
                </li>
                <li>
                  {/* <Link
                    to="/seriui/dbtStatusCheck-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
                  </Link> */}
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

export default DbtStatusCheckEdit;
