import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
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
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function SericultureTableEdit() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [schemeId, setSchemeId] = useState("");
  const [subSchemeId, setSubSchemeId] = useState("");
  const [checkedStageId, setCheckedStageId] = useState(null);
  const [daysCount, setDaysCount] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Scheme list ───────────────────────────────────────────────────
  const [schemeListData, setSchemeListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `scSchemeDetails/get-all`)
      .then((r) => setSchemeListData(r.data.content.ScSchemeDetails || []))
      .catch(() => setSchemeListData([]));
  }, []);

  // ── Sub Scheme list (loads once schemeId is known from the record) ─
  const [subSchemeListData, setSubSchemeListData] = useState([]);
  useEffect(() => {
    if (schemeId) {
      api
        .get(baseURLDBT + `master/cost/get-by-scheme-id/${schemeId}`)
        .then((r) => setSubSchemeListData(r.data.content.unitCost || []))
        .catch(() => setSubSchemeListData([]));
    }
  }, [schemeId]);

  // ── All Approval Stages ───────────────────────────────────────────
  const [approvalStageList, setApprovalStageList] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `scApprovalStage/get-all`)
      .then((r) => setApprovalStageList(r.data.content.scApprovalStage || []))
      .catch(() => setApprovalStageList([]));
  }, []);

  // ── Load existing record ──────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    api
      .get(baseURL + `sericultureTable/get/${id}`)
      .then((r) => {
        const rec = r.data.content;
        setSchemeId(rec.schemeId ? String(rec.schemeId) : "");
        setSubSchemeId(rec.subSchemeId ? String(rec.subSchemeId) : "");
        setCheckedStageId(rec.stepId ? Number(rec.stepId) : null);
        setDaysCount(rec.daysCount != null ? String(rec.daysCount) : "");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        Swal.fire({ icon: "error", title: "Error loading data", text: "Something went wrong!" }).then(() =>
          navigate("/seriui/sericulture-table-list")
        );
      });
  }, [id]);

  // ── Checkbox handler (single-select for edit) ─────────────────────
  const handleCheckbox = (stageId) => {
    if (checkedStageId === stageId) {
      setCheckedStageId(null);
      setDaysCount("");
    } else {
      setCheckedStageId(stageId);
      setDaysCount("");
    }
  };

  // ── Save ──────────────────────────────────────────────────────────
  const postData = async () => {
    if (!schemeId || !subSchemeId) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select Scheme and Sub Scheme." });
      return;
    }
    if (!checkedStageId) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select an Approval Stage." });
      return;
    }
    if (!daysCount) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please enter Days Count." });
      return;
    }
    setSaving(true);
    try {
      await api.post(baseURL + `sericultureTable/edit`, {
        sericultureTableId: Number(id),
        schemeId: Number(schemeId),
        subSchemeId: Number(subSchemeId),
        stepId: Number(checkedStageId),
        daysCount: Number(daysCount),
      });
      Swal.fire({ icon: "success", title: "Updated successfully" }).then(() =>
        navigate("/seriui/sericulture-table-list")
      );
    } catch {
      Swal.fire({ icon: "error", title: "Save attempt was not successful", text: "Something went wrong!" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Edit Sericulture Table">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Edit Sericulture Table")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">{t("Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/sericulture-table-list">{t("Sericulture Table List")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Edit")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/seriui/sericulture-table-list" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link to="/seriui/sericulture-table-list" className="btn btn-primary d-none d-md-inline-flex">
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
              ✏️ {t("Edit Sericulture Table Mapping")}
            </span>
          </Card.Header>

          <Card.Body style={{ padding: "28px 24px" }}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                <span className="spinner-border text-primary" />
              </div>
            ) : (
              <Row className="g-4">

                {/* Scheme */}
                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label style={{ fontWeight: 600, color: "#444", fontSize: "0.875rem" }}>
                      {t("Scheme")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={schemeId}
                      disabled
                      style={{ borderRadius: "8px", borderColor: "#d0dff0", padding: "9px 12px", fontSize: "0.875rem", background: "#f5f7fa" }}
                    >
                      <option value="">{t("Select Scheme")}</option>
                      {schemeListData.map((list) => (
                        <option key={list.scSchemeDetailsId} value={String(list.scSchemeDetailsId)}>
                          {list.schemeName}
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
                      value={subSchemeId}
                      disabled
                      style={{ borderRadius: "8px", borderColor: "#d0dff0", padding: "9px 12px", fontSize: "0.875rem", background: "#f5f7fa" }}
                    >
                      <option value="">{t("Select Sub Scheme")}</option>
                      {subSchemeListData.map((list) => (
                        <option key={list.scSubSchemeDetailsId} value={String(list.subSchemeId)}>
                          {list.subSchemeName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Approval Stages */}
                <Col lg="12">
                  <div style={{ border: "1px solid #d0dff0", borderRadius: "10px", overflow: "hidden" }}>

                    {/* Header */}
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
                        📋 {t("Select Approval Stage")} <span className="text-danger">*</span>
                      </span>
                      {checkedStageId && (
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
                          1 selected
                        </span>
                      )}
                    </div>

                    {/* Stage Cards */}
                    <div style={{ padding: "16px 18px", maxHeight: "280px", overflowY: "auto" }}>
                      {approvalStageList.length === 0 ? (
                        <p className="text-muted mb-0 text-center" style={{ padding: "20px 0" }}>
                          No approval stages available.
                        </p>
                      ) : (
                        <Row className="g-2">
                          {approvalStageList.map((stage) => {
                            const checked = checkedStageId === stage.scApprovalStageId;
                            return (
                              <Col lg="4" md="6" key={stage.scApprovalStageId}>
                                <div
                                  onClick={() => handleCheckbox(stage.scApprovalStageId)}
                                  style={{
                                    border: checked ? "1.5px solid #1e67a8" : "1.5px solid #e0e6ef",
                                    borderRadius: "8px",
                                    padding: "9px 12px",
                                    cursor: "pointer",
                                    background: checked ? "#e8f0fe" : "#fafbff",
                                    transition: "all 0.15s",
                                    userSelect: "none",
                                  }}
                                >
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div
                                      style={{
                                        width: "16px",
                                        height: "16px",
                                        borderRadius: "4px",
                                        border: checked ? "2px solid #1e67a8" : "2px solid #bbb",
                                        background: checked ? "#1e67a8" : "white",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                      }}
                                    >
                                      {checked && (
                                        <span style={{ color: "white", fontSize: "10px", lineHeight: 1 }}>✓</span>
                                      )}
                                    </div>
                                    <span
                                      style={{
                                        fontSize: "0.8rem",
                                        color: checked ? "#1e67a8" : "#444",
                                        fontWeight: checked ? 600 : 400,
                                        lineHeight: 1.3,
                                      }}
                                    >
                                      {stage.stageName}
                                    </span>
                                  </div>

                                  {checked && (
                                    <Form.Control
                                      type="number"
                                      size="sm"
                                      value={daysCount}
                                      onChange={(e) => setDaysCount(e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder={t("Days Count")}
                                      min={0}
                                      style={{ borderRadius: "6px", fontSize: "0.8rem", marginTop: "8px" }}
                                    />
                                  )}
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      )}
                    </div>
                  </div>
                </Col>

              </Row>
            )}
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
              disabled={saving || loading}
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
                t("Update")
              )}
            </Button>
            <Link
              to="/seriui/sericulture-table-list"
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

export default SericultureTableEdit;
