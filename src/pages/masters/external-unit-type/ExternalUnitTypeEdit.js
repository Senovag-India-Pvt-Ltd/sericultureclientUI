import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ExternalUnitTypeEdit() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

const handleInputs = (e) => {
  const { name, value, type, checked } = e.target;

  if (name === "paymentViaBank") {
    setData({
      ...data,
      paymentViaBank: checked,
      paymentViaK2: false, // only one allowed
    });
  } else if (name === "paymentViaK2") {
    setData({
      ...data,
      paymentViaK2: checked,
      paymentViaBank: false,
    });
  } else {
    setData({
      ...data,
      [name]: value,
    });
  }
};
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (!data.paymentViaBank && !data.paymentViaK2) {
  updateError("Please select one payment method");
  return;
}
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURL + `externalUnitType/edit`, {...data,externalUnitTypeId:id})
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              externalUnitTypeName: "",
              externalUnitTypeNameInKannada: "",
                paymentViaBank: false,
                paymentViaK2: false,
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
      externalUnitTypeName: "",
      externalUnitTypeNameInKannada: "",
      paymentViaBank: false,
      paymentViaK2: false,
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `externalUnitType/get/${id}`)
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

  const navigate = useNavigate();

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Updated successfully"),
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
      title: t("Save attempt was not successful"),
      html: errorMessage,
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: t("Something went wrong!"),
    }).then(() => navigate("/seriui/external-unit-type-list"));
  };

  return (
    <Layout title={t("Edit External Unit Type")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit External Unit Type")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/external-unit-type-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go to List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/external-unit-type-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
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
                        <Form.Label htmlFor="externalUnitType">
                          {t("External Unit Type")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="externalUnitType"
                            name="externalUnitTypeName"
                            value={data.externalUnitTypeName}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter External Unit Type")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("External Unit Type is required")}.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="externalUnitType">
                          {t("External Unit Type Name in Kannada")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="externalUnitType"
                            name="externalUnitTypeNameInKannada"
                            value={data.externalUnitTypeNameInKannada}
                            onChange={handleInputs}
                            type="text"
                            placeholder={t("Enter External Unit Type Name in Kannada")}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {t("External Unit Type Name in Kannada is required")}.
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                                                       <Col lg="6">
  <Form.Group className="form-group">
    <Form.Check
      type="checkbox"
      label={t("Payment via Bank")}
      name="paymentViaBank"
      checked={data.paymentViaBank}
      onChange={handleInputs}
    />
  </Form.Group>
</Col>

<Col lg="6">
  <Form.Group className="form-group">
    <Form.Check
      type="checkbox"
      label={t("Payment via K2")}
      name="paymentViaK2"
      checked={data.paymentViaK2}
      onChange={handleInputs}
    />
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

export default ExternalUnitTypeEdit;