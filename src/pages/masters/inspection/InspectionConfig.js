import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function InspectionConfig() {
  const [data, setData] = useState({
    documentMasterId: [],
    inspectionType: "",
    isRequired: true,
    gpsRequired: false,
  });

  const [validated, setValidated] = useState(false);

  const { t } = useTranslation();

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleCheckBox = (e) => {
    // setFarmerAddress({ ...farmerAddress, defaultAddress: e.target.checked });
    setData((prev) => ({
      ...prev,
      gpsRequired: e.target.checked,
    }));
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
        .post(baseURLTargetSetting + `inspectionTypeDocument/add`, {
          isRequired: data.isRequired,
          documentMasterId: data.documentMasterId,
          inspectionType: data.inspectionType,
        })
        .then((response) => {
          if (response.data.content.error) {
            // saveError();
            saveRaceError(response.data.content.error_description);
          } else {
            saveSuccess();
            clear();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });

      api
        .post(baseURLTargetSetting + `inspectionTypeGps/add`, {
          isRequired: data.isRequired,
          inspectionType: data.inspectionType,
        })
        .then((response) => {
          if (response.data.content.error) {
            // saveError();
            saveRaceError(response.data.content.error_description);
          } else {
            saveSuccess();
            clear();
          }
        })
        .catch((err) => {
          if (
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
      documentMasterId: [],
      inspectionType: "",
      isRequired: true,
      gpsRequired: false,
    });
    setValidated(false);
  };

  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getList = () => {
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
    getList();
  }, []);

  // to get Document List
  const [documentListData, setDocumentListData] = useState([]);

  const getDocumentList = () => {
    const response = api
      .get(baseURL + `documentMaster/get-all`)
      .then((response) => {
        setDocumentListData(response.data.content.documentMaster);
      })
      .catch((err) => {
        setDocumentListData([]);
      });
  };

  useEffect(() => {
    getDocumentList();
  }, []);

  // to get Inspection
  // const [getByInspectionListData, setGetByInspectionListData] = useState([]);

  const getInspectionList = (_id) => {
    api
      .get(
        baseURLTargetSetting +
          `inspectionTypeDocument/get-by-inspection-type/${_id}`
      )
      .then((response) => {
        // setGetByInspectionListData(response.data.content.marketMaster);
        if (response.data.content.error) {
          if (response.data.content.docMasters === null)
            setData((prev) => ({ ...prev, documentMasterId: [] }));
        } else {
          setData((prev) => ({
            ...prev,
            documentMasterId: response.data.content.docMasters,
          }));
        }
      })
      .catch((err) => {
        // setGetByInspectionListData([]);
      });
  };

  useEffect(() => {
    if (data.inspectionType) {
      getInspectionList(data.inspectionType);
    }
  }, [data.inspectionType]);

  console.log(data);

  const handleCheckboxChange = (id) => {
    // console.log(id);
    // setData((prev) => ({ ...prev, documentList: [...prev.documentList, id] }));
    setData((prev) => {
      if (prev.documentMasterId.includes(id)) {
        return {
          ...prev,
          documentMasterId: prev.documentMasterId.filter((item) => item !== id),
        };
      } else {
        return {
          ...prev,
          documentMasterId: [...prev.documentMasterId, id],
        };
      }
    });
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: t("Save attempt was not successful"),
      text: t("Something went wrong!"),
    });
  };

  const saveRaceError = (message) => {
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
    <Layout title={t("Inspection Config")}>
      <style>{inspectionConfigStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Inspection Config")}
              </Block.Title>
            </Block.HeadContent>
            {/* <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/race-list"
                    className="btn btn-primary btn-md d-md-none"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go to List</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/race-list"
                    className="btn btn-primary d-none d-md-inline-flex"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go to List</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent> */}
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="setting" />
                <span>{t("Inspection Config")}</span>
              </Card.Header>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-n2">
                      <Form.Label>
                        {t("Inspection Type")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="inspectionType"
                          value={data.inspectionType}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.inspectionType === undefined ||
                            data.inspectionType === "0"
                          }
                        >
                          <option value="">{t("Select Inspection Type")}</option>
                          <option value="1">{t("Farmer")}</option>
                          <option value="2">{t("Reeler")}</option>
                          <option value="3">{t("Reeler License Renewal")}</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {t("Inspection Type is required")}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          id="gpsRequired"
                          checked={data.gpsRequired}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                      <Form.Label column sm={11} className="mt-n2 ms-n4">
                        {t("Is GPS Inspection Required?")}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Label>{t("Select Documents")}</Form.Label>
                    {documentListData.map((doc) => (
                      <div key={doc.documentMasterId}>
                        <Form.Group as={Row} className="form-group mt-1">
                          <Col sm={1}>
                            <Form.Check
                              type="checkbox"
                              id="required"
                              checked={data.documentMasterId.includes(
                                doc.documentMasterId
                              )}
                              onChange={() =>
                                handleCheckboxChange(doc.documentMasterId)
                              }
                            />
                          </Col>
                          <Form.Label column sm={11} className="mt-n2 ms-n4">
                            {doc.documentMasterName}
                          </Form.Label>
                        </Form.Group>
                      </div>
                    ))}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary" className="sh-save-btn">
                    <Icon name="save" />
                    <span>{t("Save")}</span>
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                    <Icon name="cross" />
                    <span>{t("Cancel")}</span>
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

const inspectionConfigStyles = `
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
    margin-bottom: 18px;
  }
  .sh-form-wrap .card-header {
    border-bottom: none !important;
  }
  .sh-form-wrap .card-body {
    padding: 20px !important;
  }
  .sh-form-wrap .form-label {
    font-size: 13px;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 10px !important;
    border: 1.5px solid #d8e0ec !important;
    background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important;
    font-size: 13.5px;
    color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-form-wrap .form-control::placeholder {
    color: #a7b0c0;
    font-weight: 400;
  }
  .sh-form-wrap .form-control:hover:not(:disabled):not([readonly]),
  .sh-form-wrap .form-select:hover:not(:disabled) {
    border-color: #a9c4e0 !important;
    background-color: #ffffff !important;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #2b7ac0 !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important;
    outline: none;
  }
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a !important;
    box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important;
  }
  .sh-form-wrap .form-check-input {
    border-radius: 5px;
    border: 1.5px solid #c9d4e3;
    cursor: pointer;
  }
  .sh-form-wrap .form-check-input:checked {
    background-color: #1e67a8;
    border-color: #1e67a8;
  }
  .sh-form-wrap .form-check-input:focus {
    box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14);
    border-color: #2b7ac0;
  }
  .sh-form-wrap .text-danger {
    font-weight: 700;
    margin-left: 3px;
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
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(30, 103, 168, 0.25);
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
    transition: background-color 0.15s ease, color 0.15s ease,
      transform 0.15s ease, box-shadow 0.15s ease;
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

export default InspectionConfig;
