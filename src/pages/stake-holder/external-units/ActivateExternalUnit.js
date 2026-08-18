import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Icon, Select } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function ActivateExternalUnit() {
  const [data, setData] = useState({
    externalUnitTypeId: "",
    externalUnitRegistrationId: "",
    username: "",
    password: "",
    phoneNumber: "",
  });

  const [validated, setValidated] = useState(false);
  const { t } = useTranslation();

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });

    if (name === "phoneNumber" && (value.length < 10 || value.length > 10)) {
      e.target.classList.add("is-invalid");
    } else {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    }
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const clear = () => {
    setData({
      externalUnitTypeId: "",
      externalUnitRegistrationId: "",
      username: "",
      password: "",
      phoneNumber: "",
    });
  };

  const postData = (event) => {
    const { externalUnitRegistrationId, username, password, phoneNumber } =
      data;
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURL + `userMaster/save-external-user`, {
          externalUnitRegistrationId,
          username,
          password,
          phoneNumber,
        })
        .then((response) => {
          console.log(response);
          saveSuccess();
        })
        .catch((err) => {
          setData({});
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    const response = api
      .get(baseURL + `raceMaster/get-all`)
      .then((response) => {
        setRaceListData(response.data.content.raceMaster);
      })
      .catch((err) => {
        setRaceListData([]);
      });
  };

  useEffect(() => {
    getRaceList();
  }, []);

  // to get external Unit
  const [externalUnitTypeListData, setExternalUnitTypeListData] = useState([]);

  const getExternalUnitTypeList = () => {
    const response = api
      .get(baseURL + `externalUnitType/get-all`)
      .then((response) => {
        setExternalUnitTypeListData(response.data.content.externalUnitType);
      })
      .catch((err) => {
        setExternalUnitTypeListData([]);
      });
  };

  useEffect(() => {
    getExternalUnitTypeList();
  }, []);

  // to get Name of Unit
  const [externalUnitListData, setExternalUnitListData] = useState([]);

  const getExternalUnitList = (_id) => {
    api
      .post(
        baseURL2 + `external-unit-registration/get-by-external-unit-type-id`,
        {
          externalUnitTypeId: _id,
        }
      )
      .then((response) => {
        if (
          response.data.content.externalUnitRegistration &&
          response.data.content.externalUnitRegistration.length > 0
        ) {
          setExternalUnitListData(
            response.data.content.externalUnitRegistration
          );
        }
      })
      .catch((err) => {
        setExternalUnitListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.externalUnitTypeId) {
      getExternalUnitList(data.externalUnitTypeId);
    }
  }, [data.externalUnitTypeId]);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
      // text: "You clicked the button!",
    }).then(() => {
      navigate("/seriui/external-unit-registration-list");
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
      title: t("Save attempt was not successful"),
      html: errorMessage,
    });
  };

  return (
    <Layout title={t("Activate External Units")}>
      <style>{activateExternalUnitStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Activate External Units")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/external-unit-registration-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/external-unit-registration-list"
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
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("External Unit Type")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="externalUnitTypeId"
                          value={data.externalUnitTypeId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.externalUnitTypeId === undefined ||
                            data.externalUnitTypeId === "0"
                          }
                        >
                          <option value="">{t("Select External Unit Type")}</option>
                          {externalUnitTypeListData.map((list) => (
                            <option
                              key={list.externalUnitTypeId}
                              value={list.externalUnitTypeId}
                            >
                              {list.externalUnitTypeName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("External Unit Type is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="username">{t("User Name")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="username"
                          name="username"
                          value={data.username}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Username")}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="name">{t("Mobile Number")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="phoneNumber"
                          name="phoneNumber"
                          value={data.phoneNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder={t("Enter Mobile number")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Mobile Number is required or Number is greater than and less than 10 Digit")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    {/* <Form.Group className="form-group">
                      <Form.Label htmlFor="externalUnitNumber">
                        External Units ID
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="externalUnitNumber"
                          name="externalUnitNumber"
                          value={data.externalUnitNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter External Units ID"
                        />
                      </div>
                    </Form.Group> */}

                    {/* <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="lotNumber">
                        Lot Number Nomenclature
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="lotNumber"
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Lot Number Nomenclature"
                        />
                      </div>
                    </Form.Group> */}
                  </Col>

                  <Col lg="6">
                    {/* <Form.Group className="form-group">
                      <Form.Label>Select Race</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="raceMasterId"
                          value={data.raceMasterId}
                          onChange={handleInputs}
                        >
                          <option value="0">Select Race</option>
                          {raceListData.map((list) => (
                            <option
                              key={list.raceMasterId}
                              value={list.raceMasterId}
                            >
                              {list.raceMasterName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group> */}
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("External Unit")}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="externalUnitRegistrationId"
                          value={data.externalUnitRegistrationId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.externalUnitRegistrationId === undefined ||
                            data.externalUnitRegistrationId === "0"
                          }
                        >
                          <option value="">{t("Select External Unit")}</option>
                          {externalUnitListData.map((list) => (
                            <option
                              key={list.externalUnitRegistrationId}
                              value={list.externalUnitRegistrationId}
                            >
                              {list.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("External Unit Type is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="password">{t("Password")}</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="password"
                          name="password"
                          value={data.password}
                          onChange={handleInputs}
                          type="password"
                          placeholder={t("Enter Password")}
                        />
                      </div>
                    </Form.Group>

                    {/* <Form.Group className="form-group">
                      <Form.Label htmlFor="licenseNumber">
                        License Number
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="licenseNumber"
                          name="licenseNumber"
                          value={data.licenseNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter License Number"
                        />
                      </div>
                    </Form.Group> */}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    {t("Save")}
                  </Button>
                </li>
                <li>
                  {/* <Link
                    to="/seriui/external-unit-registration-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
                  </Link> */}
                  <Button variant="secondary" onClick={clear}>
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

const activateExternalUnitStyles = `
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
  .sh-form-wrap .card-header {
    border-bottom: none !important;
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
    color: #2b3a55;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1px solid #dbe4f0;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6;
    box-shadow: 0 0 0 0.2rem rgba(59, 141, 214, 0.15);
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    background: #ffffff !important;
    color: #c43257 !important;
    border: 1px solid #e3496a !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
  }
  .sh-cancel-btn:hover {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%) !important;
    color: #ffffff !important;
    border-color: transparent !important;
  }
`;

export default ActivateExternalUnit;
