import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import React from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function SchemeDocument() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [data, setData] = useState({
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
  });

  const [selectedDocIds, setSelectedDocIds] = useState([]);
  const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState([]);
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get(baseURL + `scSubSchemeDetails/get-all`)
      .then((res) => {
        if (res.data.content.scSubSchemeDetails)
          setScSubSchemeDetailsListData(res.data.content.scSubSchemeDetails);
      })
      .catch(() => setScSubSchemeDetailsListData([]));
  }, []);

  useEffect(() => {
    api
      .get(baseURL + `scSchemeDetails/get-all`)
      .then((res) => setScSchemeDetailsListData(res.data.content.ScSchemeDetails || []))
      .catch(() => setScSchemeDetailsListData([]));
  }, []);

  useEffect(() => {
    api
      .get(baseURL + `documentMaster/get-all`)
      .then((res) => {
        const docs = res.data.content.documentMaster || [];
        setDocumentList(docs);
        setSelectedDocIds(docs.map((d) => d.documentMasterId));
      })
      .catch(() => setDocumentList([]));
  }, []);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (documentMasterId) => {
    setSelectedDocIds((prev) =>
      prev.includes(documentMasterId)
        ? prev.filter((id) => id !== documentMasterId)
        : [...prev, documentMasterId]
    );
  };

  const isAllChecked = documentList.length > 0 && selectedDocIds.length === documentList.length;

  const handleCheckAll = () => {
    setSelectedDocIds(isAllChecked ? [] : documentList.map((d) => d.documentMasterId));
  };

  const postData = async () => {
    if (!data.scSchemeDetailsId || !data.scSubSchemeDetailsId) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select Scheme and Sub Scheme." });
      return;
    }
    if (selectedDocIds.length === 0) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select at least one Document." });
      return;
    }
    setSaving(true);
    try {
      for (const documentId of selectedDocIds) {
        await api.post(
          baseURL + `schemeDocumentMaster/add`,
          {
            scSchemeDetailsId: data.scSchemeDetailsId,
            scSubSchemeDetailsId: data.scSubSchemeDetailsId,
            documentId,
          },
          { headers: { "Content-Type": "application/json", accept: "*/*" } }
        );
      }
      Swal.fire({ icon: "success", title: "Saved successfully" }).then(() =>
        navigate("/seriui/scheme-document-list")
      );
    } catch {
      Swal.fire({ icon: "error", title: "Save attempt was not successful", text: "Something went wrong!" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Scheme Document">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Add Scheme Document")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">{t("Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/scheme-document-list">{t("Scheme Document List")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Add New")}
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

      <Block className="mt-3">
        <Card style={{ borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "none", overflow: "hidden" }}>
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)",
              padding: "16px 24px",
            }}
          >
            <span style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
              ➕ {t("Add Scheme Document Mapping")}
            </span>
          </Card.Header>

          <Card.Body style={{ padding: "28px 24px" }}>
            <Row className="g-4">
              {/* Scheme */}
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label style={{ fontWeight: 600, color: "#444", fontSize: "0.875rem" }}>
                    {t("Scheme")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="scSchemeDetailsId"
                    value={data.scSchemeDetailsId}
                    onChange={handleInputs}
                    style={{ borderRadius: "8px", borderColor: "#d0dff0", padding: "9px 12px", fontSize: "0.875rem" }}
                  >
                    <option value="">{t("Select Scheme")}</option>
                    {scSchemeDetailsListData.map((item) => (
                      <option key={item.scSchemeDetailsId} value={item.scSchemeDetailsId}>
                        {item.schemeName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Sub Scheme */}
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label style={{ fontWeight: 600, color: "#444", fontSize: "0.875rem" }}>
                    {t("Sub Scheme")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="scSubSchemeDetailsId"
                    value={data.scSubSchemeDetailsId}
                    onChange={handleInputs}
                    style={{ borderRadius: "8px", borderColor: "#d0dff0", padding: "9px 12px", fontSize: "0.875rem" }}
                  >
                    <option value="">{t("Select Sub Scheme")}</option>
                    {scSubSchemeDetailsListData.map((item) => (
                      <option key={item.scSubSchemeDetailsId} value={item.scSubSchemeDetailsId}>
                        {item.subSchemeName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Documents */}
              <Col lg="12">
                <div
                  style={{
                    border: "1px solid #d0dff0",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  {/* Documents header */}
                  <div
                    style={{
                      background: "#f0f6ff",
                      padding: "12px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #d0dff0",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#1e67a8", fontSize: "0.875rem" }}>
                      📄 {t("Select Documents")} <span className="text-danger">*</span>
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {selectedDocIds.length > 0 && (
                        <span
                          style={{
                            background: "#1e67a8",
                            color: "white",
                            borderRadius: "20px",
                            padding: "2px 12px",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                          }}
                        >
                          {selectedDocIds.length} selected
                        </span>
                      )}
                      <Form.Check
                        type="checkbox"
                        id="check-all-docs"
                        label={
                          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#555" }}>
                            {isAllChecked ? t("Uncheck All") : t("Check All")}
                          </span>
                        }
                        checked={isAllChecked}
                        onChange={handleCheckAll}
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div style={{ padding: "16px 18px", maxHeight: "280px", overflowY: "auto" }}>
                    {documentList.length === 0 ? (
                      <p className="text-muted mb-0 text-center" style={{ padding: "20px 0" }}>
                        No documents available.
                      </p>
                    ) : (
                      <Row className="g-2">
                        {documentList.map((item) => (
                          <Col lg="4" md="6" key={item.documentMasterId}>
                            <div
                              onClick={() => handleCheckbox(item.documentMasterId)}
                              style={{
                                border: selectedDocIds.includes(item.documentMasterId)
                                  ? "1.5px solid #1e67a8"
                                  : "1.5px solid #e0e6ef",
                                borderRadius: "8px",
                                padding: "9px 12px",
                                cursor: "pointer",
                                background: selectedDocIds.includes(item.documentMasterId) ? "#e8f0fe" : "#fafbff",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                transition: "all 0.15s",
                                userSelect: "none",
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "4px",
                                  border: selectedDocIds.includes(item.documentMasterId)
                                    ? "2px solid #1e67a8"
                                    : "2px solid #bbb",
                                  background: selectedDocIds.includes(item.documentMasterId) ? "#1e67a8" : "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                {selectedDocIds.includes(item.documentMasterId) && (
                                  <span style={{ color: "white", fontSize: "10px", lineHeight: 1 }}>✓</span>
                                )}
                              </div>
                              <span
                                style={{
                                  fontSize: "0.8rem",
                                  color: selectedDocIds.includes(item.documentMasterId) ? "#1e67a8" : "#444",
                                  fontWeight: selectedDocIds.includes(item.documentMasterId) ? 600 : 400,
                                  lineHeight: 1.3,
                                }}
                              >
                                {item.documentMasterName}
                              </span>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>

          <Card.Footer
            style={{
              background: "#fafbff",
              borderTop: "1px solid #eef0f5",
              padding: "14px 24px",
              display: "flex",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <Button
              type="button"
              onClick={postData}
              disabled={saving}
              style={{
                background: "linear-gradient(135deg, #1e67a8, #0d4f8a)",
                border: "none",
                borderRadius: "8px",
                padding: "9px 32px",
                fontWeight: 700,
                fontSize: "0.9rem",
                minWidth: "120px",
              }}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {t("Saving...")}
                </>
              ) : (
                t("Save")
              )}
            </Button>
            <Link
              to="/seriui/scheme-document-list"
              className="btn"
              style={{
                background: "#f1f3f5",
                border: "none",
                borderRadius: "8px",
                padding: "9px 28px",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "#555",
              }}
            >
              {t("Cancel")}
            </Link>
          </Card.Footer>
        </Card>
      </Block>
    </Layout>
  );
}

export default SchemeDocument;
