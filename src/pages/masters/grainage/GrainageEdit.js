  import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
//import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function GrainageEdit() {
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
    const datas = {
      grainageMasterId: id,
      grainageMasterName: data.grainageMasterName,
      grainageMasterNameInKannada: data.grainageMasterNameInKannada,
      grainageType: data.grainageType,
      grainageNameRepresentation: data.grainageNameRepresentation,
      userMasterId:data.userMasterId
    };
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURL + `grainageMaster/edit`, datas)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
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
              updateError(err.response.data.validationErrors);
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

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `grainageMaster/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  // to get User
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
  // const editError = (message) => {
  //   Swal.fire({
  //     icon: "error",
  //     title: message,
  //     text: "Something went wrong!",
  //   }).then(() => navigate("#"));
  // };

  return (
    <Layout title={t("Edit Grainage")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit Grainage")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/grainage-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t('Go to List')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/grainage-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t('Go to List')}</span>
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
                    {t("Loading...")}
                  </h1>
                ) : (
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="Grainage">
                          {t("Grainage")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="grainage"
                            name="grainageMasterName"
                            value={data.grainageMasterName}
                            onChange={handleInputs}
                            type="text"
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
                )}
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                  {t("Update")}
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                  {t("Cancel")}
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

export default GrainageEdit;
