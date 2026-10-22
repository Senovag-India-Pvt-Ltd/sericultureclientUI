import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function TscGeoMappingEdit() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "districtId") {
        next.talukId = "";
        next.hobliId = "";
        next.villageId = "";
      }
      if (name === "talukId") {
        next.hobliId = "";
        next.villageId = "";
      }
      if (name === "hobliId") {
        next.villageId = "";
      }
      return next;
    });
    if (name === "districtId") {
      setTalukListData([]);
      setHobliListData([]);
      setVillageListData([]);
    }
    if (name === "talukId") {
      setHobliListData([]);
      setVillageListData([]);
    }
    if (name === "hobliId") {
      setVillageListData([]);
    }
  };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURL + `sc-tsc-geo-mapping/edit`, {
          scTscGeoMappingId: id,
          districtId: data.districtId,
          talukId: data.talukId,
          hobliId: data.hobliId || null,
          villageId: data.villageId || null,
          tscMasterId: data.tscMasterId,
          officerUserId: data.officerUserId || null,
        })
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors &&
            Object.keys(err.response.data.validationErrors).length > 0
          ) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const getIdList = () => {
    setLoading(true);
    api
      .get(baseURL + `sc-tsc-geo-mapping/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch(() => {
        setData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [districtListData, setDistrictListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `district/get-all`)
      .then((response) => setDistrictListData(response.data.content.district))
      .catch(() => setDistrictListData([]));
  }, []);

  const [talukListData, setTalukListData] = useState([]);
  useEffect(() => {
    if (!data.districtId) return;
    api
      .get(baseURL + `taluk/get-by-district-id/${data.districtId}`)
      .then((response) => setTalukListData(response.data.content?.taluk || []))
      .catch(() => setTalukListData([]));
  }, [data.districtId]);

  const [hobliListData, setHobliListData] = useState([]);
  useEffect(() => {
    if (!data.talukId) return;
    api
      .get(baseURL + `hobli/get-by-taluk-id/${data.talukId}`)
      .then((response) => setHobliListData(response.data.content?.hobli || []))
      .catch(() => setHobliListData([]));
  }, [data.talukId]);

  const [villageListData, setVillageListData] = useState([]);
  useEffect(() => {
    if (!data.hobliId) return;
    api
      .get(baseURL + `village/get-by-hobli-id/${data.hobliId}`)
      .then((response) => setVillageListData(response.data.content?.village || []))
      .catch(() => setVillageListData([]));
  }, [data.hobliId]);

  const [tscListData, setTscListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `tscMaster/get-all`)
      .then((response) => setTscListData(response.data.content.tscMaster))
      .catch(() => setTscListData([]));
  }, []);

  const [userListData, setUserListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `userMaster/get-all`)
      .then((response) => setUserListData(response.data.content.userMaster))
      .catch(() => setUserListData([]));
  }, []);

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Updated successfully"),
    }).then(() => navigate("/seriui/tsc-geo-mapping-list"));
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

  return (
    <Layout title={t("Edit TSC Geo Mapping")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit TSC Geo Mapping")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/seriui/tsc-geo-mapping-list" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link to="/seriui/tsc-geo-mapping-list" className="btn btn-primary d-none d-md-inline-flex">
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3">
            <Card>
              <Card.Header>
                <Icon name="edit" />
                <span>{t("TSC Geo Mapping Details")}</span>
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
                          {t("District")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="districtId"
                            value={data.districtId || ""}
                            onChange={handleInputs}
                            required
                          >
                            <option value="">{t("Select District")}</option>
                            {districtListData.map((list) => (
                              <option key={list.districtId} value={list.districtId}>
                                {list.districtName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("District is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("Taluk")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="talukId"
                            value={data.talukId || ""}
                            onChange={handleInputs}
                            required
                            disabled={!data.districtId}
                          >
                            <option value="">{t("Select Taluk")}</option>
                            {talukListData.map((list) => (
                              <option key={list.talukId} value={list.talukId}>
                                {list.talukName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("Taluk is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("Hobli")}{" "}
                          <span style={{ fontWeight: 400, color: "#8896ab" }}>({t("optional — leave blank for a taluk-wide mapping")})</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="hobliId"
                            value={data.hobliId || ""}
                            onChange={handleInputs}
                            disabled={!data.talukId}
                          >
                            <option value="">{t("Select Hobli")}</option>
                            {hobliListData.map((list) => (
                              <option key={list.hobliId} value={list.hobliId}>
                                {list.hobliName}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("Village")}{" "}
                          <span style={{ fontWeight: 400, color: "#8896ab" }}>({t("optional — leave blank for a hobli-wide mapping")})</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="villageId"
                            value={data.villageId || ""}
                            onChange={handleInputs}
                            disabled={!data.hobliId}
                          >
                            <option value="">{t("Select Village")}</option>
                            {villageListData.map((list) => (
                              <option key={list.villageId} value={list.villageId}>
                                {list.villageName}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("TSC")}<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="tscMasterId"
                            value={data.tscMasterId || ""}
                            onChange={handleInputs}
                            required
                          >
                            <option value="">{t("Select TSC")}</option>
                            {tscListData.map((list) => (
                              <option key={list.tscMasterId} value={list.tscMasterId}>
                                {list.name}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {t("TSC is required")}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          {t("Officer")}{" "}
                          <span style={{ fontWeight: 400, color: "#8896ab" }}>({t("optional")})</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="officerUserId"
                            value={data.officerUserId || ""}
                            onChange={handleInputs}
                          >
                            <option value="">{t("Select Officer")}</option>
                            {userListData.map((list) => (
                              <option key={list.userMasterId} value={list.userMasterId}>
                                {list.username}
                              </option>
                            ))}
                          </Form.Select>
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
                    <Icon name="save" />
                    {t("Update")}
                  </Button>
                </li>
                <li>
                  <Link to="/seriui/tsc-geo-mapping-list" className="btn btn-secondary">
                    <Icon name="cross" />
                    {t("Cancel")}
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default TscGeoMappingEdit;
