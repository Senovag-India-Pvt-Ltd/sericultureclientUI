import { Card, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function MegaCluster() {
  // Translation
  const { t } = useTranslation();
  const [data, setData] = useState({
    name: "",
    nameInKannada: "",
  });

  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      setSubmitting(true);
      api
        .post(baseURL + `megaCluster/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            setSubmitting(false);
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              name: "",
              nameInKannada: "",
            });
            setValidated(false);
            setSubmitting(false);
          }
        })
        .catch((err) => {
          setSubmitting(false);
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
      name: "",
      nameInKannada: "",
    });
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
    }).then(() => {
      navigate("#");
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
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Mega Cluster">
      <style>{megaClusterStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Mega Cluster")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/mega-cluster-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/mega-cluster-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-4">
            <Col xs="12">
              <Card className="shadow-sm border-0 rounded-3 overflow-hidden">
                <Card.Header className="sh-section-header">
                  <Icon name="target" />
                  <span>{t("Mega Cluster Details")}</span>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-4">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="name">
                          {t("Mega Cluster Name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleInputs}
                            placeholder={t("Enter Mega Cluster Name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Mega Cluster Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="nameInKannada">
                          {t("Mega Cluster Name in Kannada")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="nameInKannada"
                            type="text"
                            name="nameInKannada"
                            value={data.nameInKannada}
                            onChange={handleInputs}
                            placeholder={t("Enter Mega Cluster Name in Kannada")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Mega Cluster Name in Kannada is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-4 sh-save-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        {t("Saving...")}
                      </>
                    ) : (
                      <>
                        <Icon name="save" />
                        <span>{t("save")}</span>
                      </>
                    )}
                  </Button>
                </li>
                <li>
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-4 sh-cancel-btn"
                    onClick={clear}
                    disabled={submitting}
                  >
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

const megaClusterStyles = `
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

export default MegaCluster;
