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
      <style>{dbtStatusCheckStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Dbt Status Check")}</Block.Title>

            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/dbtStatusCheck-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/dbtStatusCheck-list"
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
              <Card.Header className="sh-section-header">
                <Icon name="setting" />
                <span>{t("Dbt Status Check Details")}</span>
              </Card.Header>
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
                      <Form.Label htmlFor="username">{t("User Name")}</Form.Label>
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
                      <Form.Label htmlFor="password">{t("Password")}</Form.Label>
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
                  <Button type="button" variant="primary" onClick={postData} className="sh-save-btn">
                  <Icon name="save" />
                  <span>{t("save")}</span>
                  </Button>
                </li>
                <li>
                  <Link
                    to="/seriui/dbtStatusCheck-list"
                    className="btn btn-secondary border-0 sh-cancel-btn"
                  >
                    <Icon name="cross" />
                    <span>{t("cancel")}</span>
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

const dbtStatusCheckStyles = `
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
  .sh-section-header .icon {
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
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #33475b;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1.5px solid #dbe4ee;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:hover,
  .sh-form-wrap .form-select:hover {
    border-color: #9fc0e0;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #1e67a8;
    box-shadow: 0 0 0 0.2rem rgba(30, 103, 168, 0.15);
  }
  .sh-form-wrap .form-control[readonly] {
    background-color: #f4f6f9;
  }
  .sh-form-wrap .text-danger {
    color: #e3496a !important;
  }
  .sh-save-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-save-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(30, 103, 168, 0.32);
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
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-cancel-btn:hover:not(:disabled),
  .sh-cancel-btn:focus:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(227, 73, 106, 0.32);
  }
`;

export default DbtStatusCheck;
