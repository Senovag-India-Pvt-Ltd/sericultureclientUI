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
  const { t, i18n } = useTranslation();
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
      <style>{schemeDocumentStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Add Scheme Document")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link to="/seriui/scheme-document-list" className="btn btn-primary btn-md d-md-none sh-cta-btn">
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/seriui/scheme-document-list" className="btn btn-primary d-none d-md-inline-flex sh-cta-btn">
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
        <Card className="sh-section-card">
          <Card.Header className="sh-section-header">
            <Icon name="plus" />
            <span>{t("Add Scheme Document Mapping")}</span>
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
                        {i18n.language === "kn"
                          ? item.schemeNameInKannada || item.schemeName
                          : item.schemeName}
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
                        {i18n.language === "kn"
                          ? item.subSchemeNameInKannada || item.subSchemeName
                          : item.subSchemeName}
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
                        {t("No documents available.")}
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
              className="sh-save-btn"
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
              className="btn sh-cancel-btn"
            >
              {t("Cancel")}
            </Link>
          </Card.Footer>
        </Card>
      </Block>
    </Layout>
  );
}

const schemeDocumentStyles = `
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
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
  .sh-form-wrap .card,
  .sh-section-card {
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
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    font-weight: 700;
    padding: 9px 32px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 120px;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    background: #ffffff !important;
    color: #c43257 !important;
    border: 1px solid #e3496a !important;
    font-weight: 600;
    padding: 9px 28px;
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

export default SchemeDocument;
