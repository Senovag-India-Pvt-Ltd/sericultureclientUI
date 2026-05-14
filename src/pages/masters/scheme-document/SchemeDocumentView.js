import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function SchemeDocumentView() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(baseURL + `schemeDocumentMaster/get-all`)
      .then((response) => {
        const all = response.data.content.schemeDocumentMaster || [];
        const found = all.find((r) => String(r.schemeDocumentId) === String(id));
        setRecord(found || null);
        setLoading(false);
      })
      .catch(() => {
        setRecord(null);
        setLoading(false);
      });
  }, [id]);

  const fields = record
    ? [
        { label: "Scheme", value: record.schemeName, icon: "📁", color: "#e8f0fe", textColor: "#1e67a8" },
        { label: "Sub Scheme", value: record.subSchemeName, icon: "📂", color: "#fef3e2", textColor: "#d97706" },
        { label: "Document", value: record.documentMasterName, icon: "📄", color: "#e6f4ea", textColor: "#2e7d32" },
      ]
    : [];

  return (
    <Layout title="Scheme Document View" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Scheme Document View")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">{t("Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/scheme-document-list">{t("Scheme Document List")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("View")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex gap-2">
              <li>
                <Button
                  size="sm"
                  onClick={() => navigate(`/seriui/scheme-document-edit/${id}`)}
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "7px 18px",
                    fontWeight: 600,
                  }}
                >
                  <Icon name="edit" /> {t("Edit")}
                </Button>
              </li>
              <li>
                <Link
                  to="/seriui/scheme-document-list"
                  className="btn d-none d-md-inline-flex"
                  style={{
                    background: "linear-gradient(135deg, #1e67a8, #0d4f8a)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "7px 18px",
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  <Icon name="arrow-long-left" /> {t("Go To List")}
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
              📋 {t("Scheme Document Details")}
            </span>
          </Card.Header>

          <Card.Body style={{ padding: "28px 24px" }}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "160px" }}>
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : !record ? (
              <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "160px", color: "#aaa" }}>
                <span style={{ fontSize: "2.5rem" }}>📭</span>
                <p className="mt-2 mb-0">{t("Record not found.")}</p>
              </div>
            ) : (
              <Row className="g-4">
                {fields.map((field) => (
                  <Col lg="6" md="6" sm="12" key={field.label}>
                    <div
                      style={{
                        background: field.color,
                        border: `1px solid ${field.color}`,
                        borderRadius: "10px",
                        padding: "18px 20px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "14px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      }}
                    >
                      <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{field.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: field.textColor,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: "5px",
                          }}
                        >
                          {t(field.label)}
                        </div>
                        <div style={{ fontSize: "0.95rem", color: "#1a1a2e", fontWeight: 600 }}>
                          {field.value ?? <span style={{ color: "#bbb", fontStyle: "italic" }}>—</span>}
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Card.Body>

        </Card>
      </Block>
    </Layout>
  );
}

export default SchemeDocumentView;
