import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import React from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DbtStatusCheck() {

   // Translation
   const { t } = useTranslation();

  const [data, setData] = useState({
    deptCode: "",
    schemeId: "",
    componentTypeId: "",
    componentId: "",
    subComponentId: "",
    dbtScheme: "",
    username: "",
    password: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (e) => {
    api
      .post(baseURL + `dbtStatusCheck/add`, data, {
        headers: _header,
      })
      .then((response) => {
        if (response.data.content.error) {
            saveError(response.data.content.error_description);
        }else{
            saveSuccess();
        }
      })
      .catch((err) => {
        setData({});
        saveError();
      });
  };
  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/dbtStatusCheck-list"));
  };

  const saveError = (t="Something went wrong!") => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: t,
    });
  };

  return (
    <Layout title="Dbt Status Check">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Dbt Status Check")}</Block.Title>
            
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

      <Block className="mt-n4">
        <Form action="#">
          <Row className="g-3 ">
            {/* <Card>
              <Card.Body>
                <Row className="g-gs">
                 

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="fid">FRUITS ID / AADHAAR NUMBER</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="fid"
                          type="text"
                          placeholder="FRUITS ID / AADHAAR NUMBER"
                        />
                      </div>
                    </Form.Group>

                  </Col>

                  <Col lg="6">


                  </Col>
                </Row>
              </Card.Body>
            </Card> */}

            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
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
              </Card.Body>
            </Card>

            {/* <Card>
              <Card.Body>
               
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="title">Roles Name</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="roleName"
                          type="text"
                          value={data.roleName}
                          onChange={handleInputs}
                          placeholder="Enter Roles name"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card> */}

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="button" variant="primary" onClick={postData}>
                  {t("save")}
                  </Button>
                </li>
                <li>
                  <Link
                    to="/seriui/dbtStatusCheck-list"
                    className="btn btn-secondary border-0"
                  >
                    {t("cancel")}
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default DbtStatusCheck;
