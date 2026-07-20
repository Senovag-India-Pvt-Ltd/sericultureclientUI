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

function Cluster() {
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
        .post(baseURL + `cluster/add`, data)
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
    <Layout title="Cluster">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Cluster")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/cluster-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/cluster-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-4">
            <Col xs="12">
              <Card className="shadow-sm border-0 rounded-3 overflow-hidden">
                <Card.Header
                  className="bg-primary text-white py-3"
                  style={{ fontWeight: 600, fontSize: "1.05rem" }}
                >
                  {t("Cluster Details")}
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-4">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="name">
                          {t("Cluster Name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleInputs}
                            placeholder={t("Enter Cluster Name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Cluster Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="nameInKannada">
                          {t("Cluster Name in Kannada")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="nameInKannada"
                            type="text"
                            name="nameInKannada"
                            value={data.nameInKannada}
                            onChange={handleInputs}
                            placeholder={t("Enter Cluster Name in Kannada")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Cluster Name in Kannada is required")}
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
                    className="px-4"
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
                      t("save")
                    )}
                  </Button>
                </li>
                <li>
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-4"
                    onClick={clear}
                    disabled={submitting}
                  >
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

export default Cluster;
