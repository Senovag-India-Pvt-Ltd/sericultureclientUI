import { Card, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;
const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function DistrictWiseCluster() {
  // Translation
  const { t } = useTranslation();
  const [data, setData] = useState({
    districtId: "",
    clusterId: "",
  });

  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const getErrorMessage = (err) => {
    const responseData = err.response && err.response.data;
    if (responseData) {
      if (
        responseData.validationErrors &&
        Object.keys(responseData.validationErrors).length > 0
      ) {
        return responseData.validationErrors;
      }
      if (
        typeof responseData.message === "string" &&
        responseData.message.trim()
      ) {
        return responseData.message;
      }
      if (
        typeof responseData.error_description === "string" &&
        responseData.error_description.trim()
      ) {
        return responseData.error_description;
      }
      if (
        Array.isArray(responseData.errorMessages) &&
        responseData.errorMessages[0] &&
        Array.isArray(responseData.errorMessages[0].message) &&
        responseData.errorMessages[0].message[0]
      ) {
        return responseData.errorMessages[0].message[0].message;
      }
      if (typeof responseData.error === "string" && responseData.error.trim()) {
        return responseData.error;
      }
    }
    if (err.response && err.response.status) {
      return `Request failed with status ${err.response.status}`;
    }
    return "Something went wrong. Please try again.";
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
        .post(baseURL + `districtWiseCluster/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            setSubmitting(false);
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              districtId: "",
              clusterId: "",
            });
            setValidated(false);
            setSubmitting(false);
          }
        })
        .catch((err) => {
          setSubmitting(false);
          saveError(getErrorMessage(err));
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      districtId: "",
      clusterId: "",
    });
  };

  // to get District
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    api
      .get(baseURLMasterData + `district/get-all`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);

  // to get Cluster
  const [clusterListData, setClusterListData] = useState([]);

  const getClusterList = () => {
    api
      .get(baseURL + `cluster/get-all`)
      .then((response) => {
        setClusterListData(response.data.content.cluster);
      })
      .catch((err) => {
        setClusterListData([]);
      });
  };

  useEffect(() => {
    getClusterList();
  }, []);

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
    <Layout title="District Wise Cluster">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("District Wise Cluster")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/district-wise-cluster-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/district-wise-cluster-list"
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
                  {t("District Wise Cluster Details")}
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-4">
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("district")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="districtId"
                            value={data.districtId}
                            onChange={handleInputs}
                            required
                            isInvalid={
                              data.districtId === undefined ||
                              data.districtId === "0"
                            }
                          >
                            <option value="">{t("select_district")}</option>
                            {districtListData &&
                              districtListData.map((list) => (
                                <option
                                  key={list.districtId}
                                  value={list.districtId}
                                >
                                  {list.districtName}
                                </option>
                              ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("district_is_required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("Cluster")}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="clusterId"
                            value={data.clusterId}
                            onChange={handleInputs}
                            required
                            isInvalid={
                              data.clusterId === undefined ||
                              data.clusterId === "0"
                            }
                          >
                            <option value="">{t("Select Cluster")}</option>
                            {clusterListData &&
                              clusterListData.map((list) => (
                                <option
                                  key={list.clusterId}
                                  value={list.clusterId}
                                >
                                  {list.name}
                                </option>
                              ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("Cluster is required")}
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

export default DistrictWiseCluster;
