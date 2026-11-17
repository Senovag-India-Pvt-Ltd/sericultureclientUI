import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function TscGeoMapping() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    districtId: "",
    talukId: "",
    hobliId: "",
    villageId: "",
    tscMasterId: "",
    officerUserId: "",
  });

  const [validated, setValidated] = useState(false);

  // Changing a parent geography dropdown clears the dependent ones (and their
  // stale option lists) so a mapping can never be saved against a Hobli/Village
  // that doesn't belong to the newly chosen District/Taluk.
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
        .post(baseURL + `sc-tsc-geo-mapping/add`, {
          ...data,
          hobliId: data.hobliId || null,
          villageId: data.villageId || null,
          officerUserId: data.officerUserId || null,
        })
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            clear();
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data &&
            err.response.data.validationErrors &&
            Object.keys(err.response.data.validationErrors).length > 0
          ) {
            saveError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      districtId: "",
      talukId: "",
      hobliId: "",
      villageId: "",
      tscMasterId: "",
      officerUserId: "",
    });
    setTalukListData([]);
    setHobliListData([]);
    setVillageListData([]);
    setValidated(false);
  };

  // to get District
  const [districtListData, setDistrictListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `district/get-all`)
      .then((response) => setDistrictListData(response.data.content.district))
      .catch(() => setDistrictListData([]));
  }, []);

  // to get Taluk (by selected district)
  const [talukListData, setTalukListData] = useState([]);
  useEffect(() => {
    if (!data.districtId) return;
    api
      .get(baseURL + `taluk/get-by-district-id/${data.districtId}`)
      .then((response) => setTalukListData(response.data.content?.taluk || []))
      .catch(() => setTalukListData([]));
  }, [data.districtId]);

  // to get Hobli (by selected taluk)
  const [hobliListData, setHobliListData] = useState([]);
  useEffect(() => {
    if (!data.talukId) return;
    api
      .get(baseURL + `hobli/get-by-taluk-id/${data.talukId}`)
      .then((response) => setHobliListData(response.data.content?.hobli || []))
      .catch(() => setHobliListData([]));
  }, [data.talukId]);

  // to get Village (by selected hobli)
  const [villageListData, setVillageListData] = useState([]);
  useEffect(() => {
    if (!data.hobliId) return;
    api
      .get(baseURL + `village/get-by-hobli-id/${data.hobliId}`)
      .then((response) => setVillageListData(response.data.content?.village || []))
      .catch(() => setVillageListData([]));
  }, [data.hobliId]);

  // to get TSC
  const [tscListData, setTscListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `tscMaster/get-all`)
      .then((response) => setTscListData(response.data.content.tscMaster))
      .catch(() => setTscListData([]));
  }, []);

  // to get Officer (user)
  const [userListData, setUserListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `userMaster/get-all`)
      .then((response) => setUserListData(response.data.content.userMaster))
      .catch(() => setUserListData([]));
  }, []);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
    }).then(() => navigate("#"));
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
    <Layout title={t("TSC Geo Mapping")}>
      <style>{tscGeoMappingStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("TSC Geo Mapping")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link to="/seriui/tsc-geo-mapping-list" className="btn btn-primary btn-md d-md-none sh-cta-btn">
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/seriui/tsc-geo-mapping-list" className="btn btn-primary d-none d-md-inline-flex sh-cta-btn">
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
          <Row className="g-3">
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="map-pin" />
                <span>{t("TSC Geo Mapping Details")}</span>
              </Card.Header>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label>
                        {t("District")}<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="districtId"
                          value={data.districtId}
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
                          value={data.talukId}
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
                          value={data.hobliId}
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
                          value={data.villageId}
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
                          value={data.tscMasterId}
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
                          value={data.officerUserId}
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
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary" className="sh-save-btn">
                    <Icon name="save" />
                    {t("save")}
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                    <Icon name="cross" />
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

const tscGeoMappingStyles = `
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

export default TscGeoMapping;
