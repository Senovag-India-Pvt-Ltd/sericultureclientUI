import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import React from "react";
// import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function Grainage() {
  // Translation
  const { t } = useTranslation();

  const [data, setData] = useState({
    grainageMasterName: "",
    grainageMasterNameInKannada: "",
    grainageType: "",
    grainageNameRepresentation: "",
    userMasterId:"",
  });

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
      api
        .post(baseURL + `grainageMaster/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
                grainageMasterName: "",
                grainageMasterNameInKannada: "",
                grainageType: "",
                grainageNameRepresentation: "",
                userMasterId:"",
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
        grainageMasterName: "",
        grainageMasterNameInKannada: "",
        grainageType: "",
        grainageNameRepresentation: "",
        userMasterId:"",
    });
  };


  // to get User Master
  const [userListData, setUserListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `userMaster/get-all`)
      .then((response) => {
        setUserListData(response.data.content.userMaster);
      })
      .catch((err) => {
        setUserListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
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
    <Layout title={t("Grainage")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Grainage")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/grainage-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/grainage-list"
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
                      <Form.Label htmlFor="title">
                        {t("Grainage Name")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="grainageMasterName"
                          type="text"
                          value={data.grainageMasterName}
                          onChange={handleInputs}
                          placeholder={t("Enter Grainage name")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Grainage Name is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        {t("Grainage Name in Kannada")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="grainageMasterNameInKannada"
                          value={data.grainageMasterNameInKannada}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Grainage Name in Kannada")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Grainage Name in Kannada is required")}.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        {t("Grainage Type")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="grainageType"
                          value={data.grainageType}
                          onChange={handleInputs}
                        >
                          <option value="">{t("Select Grainage Type")}</option>
                          <option value="Mysore Seed Area GG">Mysore Seed Area GG</option>
                          <option value="Bivoltine Seed Area GG">Bivoltine Seed Area GG</option>
                          <option value="Commercial GG">Commercial GG</option>
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                        Grainage Type in Kannada is required.
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>


                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        {t("Grainage Name Representation")}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="grainageNameRepresentation"
                          value={data.grainageNameRepresentation}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Grainage Name Representation")}
                          // required
                        />
                        {/* <Form.Control.Feedback type="invalid">
                        Grainage Name Representation is required.
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>


                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("User")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="userMasterId"
                          value={data.userMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.userMasterId === undefined || data.userMasterId === "0"
                          }
                        >
                          <option value="">{t("Select User")}</option>
                          {userListData.map((list) => (
                            <option key={list.userMasterId} value={list.userMasterId}>
                              {list.username}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                         {t("User name is required")}
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
                  {t("save")}
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

export default Grainage;
