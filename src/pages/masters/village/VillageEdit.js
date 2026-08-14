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

function VillageEdit() {
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
      // debugger
      api
        .post(baseURL + `village/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              stateId: "",
              districtId: "",
              talukId: "",
              hobliId: "",
              villageName: "",
              lgVillage: "",
              villageCode: "",
              villageNameInKannada: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
          // setData({});
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      stateId: "",
      districtId: "",
      talukId: "",
      hobliId: "",
      villageName: "",
      lgVillage: "",
      villageCode: "",
      villageNameInKannada: "",
    });
  };
  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `village/get/${id}`)
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

  // to get hobli
  const [hobliListData, setHobliListData] = useState([]);

  const getHobliList = (_id) => {
    const response = api
      .get(baseURL + `hobli/get-by-taluk-id/${_id}`)
      .then((response) => {
        if (response.data.content.hobli) {
          setHobliListData(response.data.content.hobli);
        }
      })
      .catch((err) => {
        setHobliListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.talukId) {
      getHobliList(data.talukId);
    }
  }, [data.talukId]);

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
    <Layout title="Village">
      <style>{villageEditStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Village")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/village-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/village-list"
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
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="edit" />
                <span>{t("Village Details")}</span>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    {t("Loading...")}
                  </h1>
                ) : (
                  <Row className="g-gs">
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
                            <option value="">{t("Select State")}</option>
                            {stateListData.map((list) => (
                              <option key={list.stateId} value={list.stateId}>
                                {list.stateName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("State Name is required")}
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
                            <option value="">{t("Select District")}</option>
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
                            {t("District Name is required")}
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
                            <option value="">{t("Select Taluk")}</option>
                            {talukListData && talukListData.length
                              ? talukListData.map((list) => (
                                  <option
                                    key={list.talukId}
                                    value={list.talukId}
                                  >
                                    {list.talukName}
                                  </option>
                                ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("Taluk Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("Hobli")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="hobliId"
                            value={data.hobliId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.hobliId === undefined || data.hobliId === "0"
                            }
                          >
                            <option value="">{t("Select Hobli")}</option>
                            {hobliListData && hobliListData.length
                              ? hobliListData.map((list) => (
                                  <option
                                    key={list.hobliId}
                                    value={list.hobliId}
                                  >
                                    {list.hobliName}
                                  </option>
                                ))
                              : null}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("Hobli Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="Village">
                          {t("Village")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="Village"
                            name="villageName"
                            value={data.villageName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Village")}
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Village Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="Village">
                          {t("Village Name in Kannada")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="Village"
                            name="villageNameInKannada"
                            value={data.villageNameInKannada}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter Village Name in Kannada")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Village Name Name in Kannada is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Village">
                        {t("Lg Village")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lgVillage"
                          name="lgVillage"
                          value={data.lgVillage}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Lg Village")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Lg Village is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="Village">
                        {t("Village Code")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="villageCode"
                          name="villageCode"
                          value={data.villageCode}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Village Code")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        {t("Village Code is required")}
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
                  <Button type="submit" variant="primary" className="sh-save-btn">
                    <Icon name="save" />
                    <span>{t("update")}</span>
                  </Button>
                </li>
                <li>
                  {/* <Link
                    to="/seriui/village-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
                  </Link> */}
                  <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                    <Icon name="cross" />
                    <span>{t("cancel")}</span>
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

const villageEditStyles = `
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
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a;
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

export default VillageEdit;
