import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function SchemeDocumentEdit() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    documentId: "",
  });
  const [loading, setLoading] = useState(false);

  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState([]);

  const getSubSchemeList = () => {
    api
      .get(baseURL + `scSubSchemeDetails/get-all`)
      .then((response) => {
        if (response.data.content.scSubSchemeDetails) {
          setScSubSchemeDetailsListData(response.data.content.scSubSchemeDetails);
        }
      })
      .catch((err) => {
        setScSubSchemeDetailsListData([]);
      });
  };

  useEffect(() => {
    getSubSchemeList();
  }, []);

  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);

  const getSchemeList = () => {
    api
      .get(baseURL + `scSchemeDetails/get-all`)
      .then((response) => {
        setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
      })
      .catch((err) => {
        setScSchemeDetailsListData([]);
      });
  };

  useEffect(() => {
    getSchemeList();
  }, []);

  const [documentList, setDocumentList] = useState([]);

  const getDocumentList = () => {
    api
      .get(baseURL + `documentMaster/get-all`)
      .then((response) => {
        if (response.data.content.documentMaster) {
          setDocumentList(response.data.content.documentMaster);
        }
      })
      .catch((err) => {
        setDocumentList([]);
      });
  };

  useEffect(() => {
    getDocumentList();
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get(baseURL + `schemeDocumentMaster/get/${id}`)
      .then((response) => {
        setData(response.data.content || {});
        setLoading(false);
      })
      .catch((err) => {
        const message = err?.response?.data?.errorMessages?.[0]?.message?.[0]?.message || "Error loading data";
        setData({});
        setLoading(false);
        Swal.fire({ icon: "error", title: message, text: "Something went wrong!" })
          .then(() => navigate("/seriui/scheme-document-list"));
      });
  }, [id]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = () => {
    if (!data.scSchemeDetailsId || !data.scSubSchemeDetailsId || !data.documentId) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please fill all required fields." });
      return;
    }
    const payload = {
      schemeDocumentId: id,
      scSchemeDetailsId: data.scSchemeDetailsId,
      scSubSchemeDetailsId: data.scSubSchemeDetailsId,
      documentId: data.documentId,
    };
    api
      .post(baseURL + `schemeDocumentMaster/edit`, payload, { headers: _header })
      .then(() => {
        Swal.fire({ icon: "success", title: "Saved successfully" })
          .then(() => navigate("/seriui/scheme-document-list"));
      })
      .catch(() => {
        Swal.fire({ icon: "error", title: "Save attempt was not successful", text: "Something went wrong!" });
      });
  };

  return (
    <Layout title="Edit Scheme Document" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit Scheme Document")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">{t("Home")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Edit Scheme Document")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/seriui/scheme-document-list" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link to="/seriui/scheme-document-list" className="btn btn-primary d-none d-md-inline-flex">
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Form action="#">
          <Row className="g-3">
            <Card>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">Loading...</h1>
                ) : (
                  <Row className="g-gs">
                    <Col lg="6">
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="scSchemeDetailsId">
                          {t("Scheme")} <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scSchemeDetailsId"
                            value={data.scSchemeDetailsId}
                            onChange={handleInputs}
                          >
                            <option value="">{t("Select Scheme")}</option>
                            {scSchemeDetailsListData.map((item) => (
                              <option key={item.scSchemeDetailsId} value={item.scSchemeDetailsId}>
                                {item.schemeName}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="scSubSchemeDetailsId">
                          {t("Sub Scheme")} <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scSubSchemeDetailsId"
                            value={data.scSubSchemeDetailsId}
                            onChange={handleInputs}
                          >
                            <option value="">{t("Select Sub Scheme")}</option>
                            {scSubSchemeDetailsListData.map((item) => (
                              <option key={item.scSubSchemeDetailsId} value={item.scSubSchemeDetailsId}>
                                {item.subSchemeName}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-3">
                        <Form.Label htmlFor="documentId">
                          {t("Document")} <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="documentId"
                            value={data.documentId}
                            onChange={handleInputs}
                          >
                            <option value="">{t("Select Document")}</option>
                            {documentList.map((item) => (
                              <option key={item.documentMasterId} value={item.documentMasterId}>
                                {item.documentMasterName}
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
                  <Button type="button" variant="primary" onClick={postData}>
                    {t("update")}
                  </Button>
                </li>
                <li>
                  <Link to="/seriui/scheme-document-list" className="btn btn-secondary border-0">
                    {t("cancel")}
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

export default SchemeDocumentEdit;
