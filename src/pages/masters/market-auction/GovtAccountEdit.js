import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function GovtAccountEdit() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [data, setData] = useState({
    govtAccountNumber: "",
    bankName: "",
    branch: "",
    ifscCode: "",
  });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setLoading(true);
    api
      .get(baseURL + `govtAccount/get/${id}`)
      .then((response) => {
        const content = response.data?.content;
        if (content && typeof content === "object") {
          setData(content);
        }
      })
      .catch((err) => {
        const msg =
          err.response?.data?.errorMessages?.[0]?.message ||
          err.message ||
          t("Failed to load record.");
        Swal.fire({ icon: "error", title: t("Error"), text: msg });
      })
      .finally(() => setLoading(false));
  }, [id, t]);

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }
    event.preventDefault();
    api
      .post(baseURL + `govtAccount/edit`, { govtAccountId: id, ...data })
      .then((response) => {
        if (response.data?.content?.error) {
          Swal.fire({ icon: "error", title: t("Error"), text: response.data.content.error_description });
        } else {
          Swal.fire({ icon: "success", title: t("Updated successfully") }).then(() =>
            navigate("/seriui/govt-account-list")
          );
        }
      })
      .catch((err) => {
        const msg =
          err.response?.data?.errorMessages?.[0]?.message ||
          err.message ||
          t("Update attempt was not successful");
        Swal.fire({ icon: "error", title: t("Error"), text: msg });
      });
    setValidated(true);
  };

  const clear = () => {
    setData({ govtAccountNumber: "", bankName: "", branch: "", ifscCode: "" });
    setValidated(false);
  };

  return (
    <Layout title={t("Edit Govt Account")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit Govt Account")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/seriui/govt-account-list" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link to="/seriui/govt-account-list" className="btn btn-primary d-none d-md-inline-flex">
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3">
            <Card>
              <Card.Body>
                {loading ? (
                  <h5 className="d-flex justify-content-center align-items-center py-4">
                    {t("Loading...")}
                  </h5>
                ) : (
                  <Row className="g-gs">

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("Govt Account Number")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            name="govtAccountNumber"
                            type="text"
                            value={data.govtAccountNumber || ""}
                            onChange={handleInputs}
                            placeholder={t("Enter Govt Account Number")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Govt Account Number is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("Bank Name")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            name="bankName"
                            type="text"
                            value={data.bankName || ""}
                            onChange={handleInputs}
                            placeholder={t("Enter Bank Name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Bank Name is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("Branch")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            name="branch"
                            type="text"
                            value={data.branch || ""}
                            onChange={handleInputs}
                            placeholder={t("Enter Branch Name")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("Branch is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("IFSC")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            name="ifscCode"
                            type="text"
                            value={data.ifscCode || ""}
                            onChange={handleInputs}
                            placeholder={t("Enter IFSC Code")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("IFSC is required")}
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

export default GovtAccountEdit;
