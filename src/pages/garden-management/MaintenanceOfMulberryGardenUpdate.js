import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import { useTranslation } from "react-i18next"; // Add this line

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceOfMulberryGardenUpdate() {
  const { t } = useTranslation(); // Add this line
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
  const isDataPruningSet = !!data.pruningDate;

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
        .post(baseURL2 + `Mulberry-garden/update-pruning-date`, data)
        .then((response) => {
          //   const trScheduleId = response.data.content.trScheduleId;
          //   if (trScheduleId) {
          //     handlePPtUpload(trScheduleId);
          //   }
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              plotNumber: "",
              variety: "",
              areaUnderEachVariety: "",
              pruningDate: "",
              fertilizerApplicationDate: "",
              fymApplicationDate: "",
              irrigationDate: "",
              brushingDate: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          updateError();
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      plotNumber: "",
      variety: "",
      areaUnderEachVariety: "",
      pruningDate: "",
      fertilizerApplicationDate: "",
      fymApplicationDate: "",
      irrigationDate: "",
      brushingDate: "",
    });
  };


  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `Mulberry-garden/get-info-by-id/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  const navigate = useNavigate();

  const updateSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: t("Updated successfully"),
      text: message,
    });
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
      title: t("Attempt was not successful"),
      html: errorMessage,
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: t("Something went wrong!"),
    }).then(() => navigate("#"));
  };
  return (
  <Layout title={t("Update Pruning Date")}>
  <style>{updateMulberryGardenPruningStyles}</style>
  <Block.Head>
    <div className="sh-page-header">
      <Block.HeadBetween>
        <Block.HeadContent>
          <Block.Title tag="h2" className="sh-page-title">
          {t("Pruning Date")}
          </Block.Title>
        </Block.HeadContent>
        <Block.HeadContent>
          <ul className="d-flex">
            <li>
              <Link
                to="/seriui/maintenance-of-mulberry-garden-list"
                className="btn btn-primary btn-md d-md-none sh-cta-btn"
              >
                <Icon name="arrow-long-left" />
                <span>{t("Go To List")}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/seriui/maintenance-of-mulberry-garden-list"
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
          {/* <Row className="g-3 "> */}
            <Card className="sh-section-card">
            <Card.Header className="sh-section-header">
               <Icon name="calendar" />
               <span>{t("Update Pruning Date")}</span>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    {t("Loading...")}
                  </h1>
                ) : (
                    <Row className="g-gs">
                    <Form.Label column sm={2}>
                        {t("Pruning Date")}
                        <span className="text-danger">*</span>
                        </Form.Label>
                        <Col sm={2}>
                        <div className="form-control-wrap">
                            {isDataPruningSet && (
                            <DatePicker
                                selected={new Date(data.pruningDate)}
                                onChange={(date) =>
                                handleDateChange(date, "pruningDate")
                                }
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                            />
                            )}
                        </div>
                        </Col>
                        </Row>
                        )}
                        <div className="gap-col sh-actions-bar">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                    <li>
                    {/* <Button type="button" variant="primary" onClick={postData}> */}
                    <Button type="submit" variant="primary" className="sh-save-btn">
                        <Icon name="save" />
                        <span>{t("Update")}</span>
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
              </Card.Body>
            </Card>
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}

const updateMulberryGardenPruningStyles = `
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
  .sh-section-card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .sh-section-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    padding: 14px 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    font-size: 15px !important;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
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
  .sh-form-wrap .card-body {
    padding: 20px !important;
  }
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #33475b;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1px solid #d9e2ec;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6;
    box-shadow: 0 0 0 3px rgba(59, 141, 214, 0.15);
  }
  .sh-actions-bar {
    margin-top: 8px;
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 22px;
    border-radius: 8px;
    font-weight: 600;
  }
`;

export default MaintenanceOfMulberryGardenUpdate;