import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import React from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function SericultureTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-populate from URL params (e.g. when navigating from list "Edit")
  const [schemeId, setSchemeId]       = useState(searchParams.get("schemeId")    || "");
  const [subSchemeId, setSubSchemeId] = useState(searchParams.get("subSchemeId") || "");
  const [daysCount, setDaysCount]     = useState("");
  const [saving, setSaving]           = useState(false);

  // Skip the reset on initial mount so URL-param values are preserved
  const isFirstSchemeChange = useRef(true);

  // ── Scheme list ───────────────────────────────────────────────────
  const [schemeListData, setSchemeListData] = useState([]);
  useEffect(() => {
    api
      .get(baseURL + `scSchemeDetails/get-all`)
      .then((r) => setSchemeListData(r.data.content.ScSchemeDetails || []))
      .catch(() => setSchemeListData([]));
  }, []);

  // ── Sub Scheme list (loads whenever schemeId is known) ────────────
  const [subSchemeListData, setSubSchemeListData] = useState([]);
  useEffect(() => {
    if (schemeId) {
      api
        .get(baseURLDBT + `master/cost/get-by-scheme-id/${schemeId}`)
        .then((r) => setSubSchemeListData(r.data.content.unitCost || []))
        .catch(() => setSubSchemeListData([]));
    } else {
      setSubSchemeListData([]);
    }
    // Reset child state only when the user actually changes the scheme
    if (isFirstSchemeChange.current) {
      isFirstSchemeChange.current = false;
      return;
    }
    setSubSchemeId("");
    setDaysCount("");
    setApprovalStages((prev) => prev.map((s) => ({ ...s, checked: false, sericultureTableId: null })));
  }, [schemeId]);

  // ── Approval Stages — always loaded from get-all on mount ─────────
  // sericultureTableId is set when pre-checking existing saved stages
  const [approvalStages, setApprovalStages] = useState([]);

  useEffect(() => {
    api
      .get(baseURL + `scApprovalStage/get-all`)
      .then((r) => {
        const stages = r.data.content.scApprovalStage || [];
        setApprovalStages(stages.map((s) => ({ ...s, checked: false, sericultureTableId: null })));
      })
      .catch(() => setApprovalStages([]));
  }, []);

  // When scheme + subScheme are both selected, pre-check already-saved stages
  useEffect(() => {
    if (schemeId && subSchemeId) {
      api
        .get(baseURL + `sericultureTable/approval-stages-checkbox`, {
          params: { schemeId, subSchemeId },
        })
        .then((r) => {
          const saved = r.data.content || [];
          const savedMap = {};
          saved.forEach((item) => {
            savedMap[item.scApprovalStageId] = item;
          });
          setApprovalStages((prev) =>
            prev.map((stage) => {
              const match = savedMap[stage.scApprovalStageId];
              return match
                ? { ...stage, checked: !!match.checked, sericultureTableId: match.sericultureTableId || null }
                : { ...stage, checked: false, sericultureTableId: null };
            })
          );
          // Pre-fill daysCount if all existing checked stages share the same value
          const checkedSaved = saved.filter((i) => i.checked && i.daysCount != null);
          if (checkedSaved.length > 0 && checkedSaved.every((i) => i.daysCount === checkedSaved[0].daysCount)) {
            setDaysCount(String(checkedSaved[0].daysCount));
          } else {
            setDaysCount("");
          }
        })
        .catch(() => {
          setApprovalStages((prev) => prev.map((s) => ({ ...s, checked: false, sericultureTableId: null })));
          setDaysCount("");
        });
    } else {
      setApprovalStages((prev) => prev.map((s) => ({ ...s, checked: false, sericultureTableId: null })));
      setDaysCount("");
    }
  }, [schemeId, subSchemeId]);

  // ── Checkbox helpers ──────────────────────────────────────────────
  const selectedCount = approvalStages.filter((s) => s.checked).length;
  const isAllChecked  = approvalStages.length > 0 && selectedCount === approvalStages.length;

  const handleCheckAll = () =>
    setApprovalStages((prev) => prev.map((s) => ({ ...s, checked: !isAllChecked })));

  const handleCheckbox = (index) =>
    setApprovalStages((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
    );

  // ── Save — one shared daysCount applied to all selected stages ────
  const postData = async () => {
    if (!schemeId || !subSchemeId) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select Scheme and Sub Scheme." });
      return;
    }
    if (selectedCount === 0) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select at least one Approval Stage." });
      return;
    }
    if (!daysCount || Number(daysCount) <= 0) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please enter a valid Days Count." });
      return;
    }

    setSaving(true);
    try {
      const promises = approvalStages.map((stage) => {
        if (stage.checked) {
          if (stage.sericultureTableId) {
            return api.post(baseURL + `sericultureTable/edit`, {
              sericultureTableId: stage.sericultureTableId,
              schemeId:    Number(schemeId),
              subSchemeId: Number(subSchemeId),
              stepId:      stage.scApprovalStageId,
              daysCount:   Number(daysCount),
            });
          } else {
            return api.post(baseURL + `sericultureTable/add`, {
              schemeId:    Number(schemeId),
              subSchemeId: Number(subSchemeId),
              stepId:      stage.scApprovalStageId,
              daysCount:   Number(daysCount),
            });
          }
        } else if (!stage.checked && stage.sericultureTableId) {
          return api.delete(baseURL + `sericultureTable/delete/${stage.sericultureTableId}`);
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      Swal.fire({ icon: "success", title: "Saved successfully" }).then(() =>
        navigate("/seriui/sericulture-table-list")
      );
    } catch {
      Swal.fire({ icon: "error", title: "Save attempt was not successful", text: "Something went wrong!" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Sericulture Table">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Sericulture Table")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item"><Link to="/seriui/">{t("Home")}</Link></li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/sericulture-table-list">{t("Sericulture Table List")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">{t("Add New")}</li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/seriui/sericulture-table-list" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" /><span>{t("Go To List")}</span>
                </Link>
              </li>
              <li>
                <Link to="/seriui/sericulture-table-list" className="btn btn-primary d-none d-md-inline-flex">
                  <Icon name="arrow-long-left" /><span>{t("Go To List")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-3">
        <Card style={{ borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "none", overflow: "hidden" }}>
          <Card.Header style={{ background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)", padding: "16px 24px" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
              ➕ {t("Add Sericulture Table Mapping")}
            </span>
          </Card.Header>

          <Card.Body style={{ padding: "28px 24px" }}>
            <Row className="g-4">

              {/* Scheme */}
              <Col lg="4">
                <Form.Group className="form-group">
                  <Form.Label style={{ fontWeight: 600, color: "#444", fontSize: "0.875rem" }}>
                    {t("Scheme")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={schemeId}
                    onChange={(e) => setSchemeId(e.target.value)}
                    style={{ borderRadius: "8px", borderColor: "#d0dff0", padding: "9px 12px", fontSize: "0.875rem" }}
                  >
                    <option value="">{t("Select Scheme")}</option>
                    {schemeListData.map((list) => (
                      <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                        {list.schemeName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Sub Scheme */}
              <Col lg="4">
                <Form.Group className="form-group">
                  <Form.Label style={{ fontWeight: 600, color: "#444", fontSize: "0.875rem" }}>
                    {t("Sub Scheme")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={subSchemeId}
                    onChange={(e) => setSubSchemeId(e.target.value)}
                    disabled={!schemeId}
                    style={{ borderRadius: "8px", borderColor: "#d0dff0", padding: "9px 12px", fontSize: "0.875rem" }}
                  >
                    <option value="">{t("Select Sub Scheme")}</option>
                    {subSchemeListData.map((list) => (
                      <option key={list.scSubSchemeDetailsId} value={list.subSchemeId}>
                        {list.subSchemeName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Days Count — shared for all selected stages */}
              <Col lg="4">
                <Form.Group className="form-group">
                  <Form.Label style={{ fontWeight: 600, color: "#444", fontSize: "0.875rem" }}>
                    {t("Days Count")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={daysCount}
                    onChange={(e) => setDaysCount(e.target.value)}
                    placeholder={t("Enter Days Count")}
                    min={1}
                    style={{ borderRadius: "8px", borderColor: "#d0dff0", padding: "9px 12px", fontSize: "0.875rem" }}
                  />
                  {selectedCount > 0 && daysCount && (
                    <small style={{ color: "#1e67a8", fontWeight: 600, marginTop: "4px", display: "block" }}>
                      ✓ {daysCount} {t("days")} — {selectedCount} {t("stage(s)")}
                    </small>
                  )}
                </Form.Group>
              </Col>

              {/* Approval Stage Checkbox List — always visible */}
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
                      📋 {t("Select Approval Stages")} <span className="text-danger">*</span>
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {selectedCount > 0 && (
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
                          {selectedCount} selected
                        </span>
                      )}
                      <Form.Check
                        type="checkbox"
                        id="check-all-stages"
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

                  {/* Checkbox cards */}
                  <div style={{ padding: "16px 18px", maxHeight: "320px", overflowY: "auto" }}>
                    {approvalStages.length === 0 ? (
                      <p className="text-muted mb-0 text-center" style={{ padding: "20px 0" }}>
                        No approval stages available.
                      </p>
                    ) : (
                      <Row className="g-2">
                        {approvalStages.map((stage, index) => (
                          <Col lg="4" md="6" key={stage.scApprovalStageId}>
                            <div
                              onClick={() => handleCheckbox(index)}
                              style={{
                                border: stage.checked ? "1.5px solid #1e67a8" : "1.5px solid #e0e6ef",
                                borderRadius: "8px",
                                padding: "9px 12px",
                                cursor: "pointer",
                                background: stage.checked ? "#e8f0fe" : "#fafbff",
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
                                  border: stage.checked ? "2px solid #1e67a8" : "2px solid #bbb",
                                  background: stage.checked ? "#1e67a8" : "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                {stage.checked && (
                                  <span style={{ color: "white", fontSize: "10px", lineHeight: 1 }}>✓</span>
                                )}
                              </div>
                              <span
                                style={{
                                  fontSize: "0.8rem",
                                  color: stage.checked ? "#1e67a8" : "#444",
                                  fontWeight: stage.checked ? 600 : 400,
                                  lineHeight: 1.3,
                                }}
                              >
                                {stage.stageName}
                              </span>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </div>

                  {/* Summary strip */}
                  {selectedCount > 0 && daysCount && (
                    <div
                      style={{
                        background: "#e8f4e8",
                        borderTop: "1px solid #c3e6c3",
                        padding: "10px 18px",
                        fontSize: "0.82rem",
                        color: "#2e7d32",
                        fontWeight: 600,
                      }}
                    >
                      ✓ {selectedCount} stage(s) — Days Count : <strong>{daysCount}</strong>
                    </div>
                  )}
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
                <><span className="spinner-border spinner-border-sm me-2" />{t("Saving...")}</>
              ) : t("Save")}
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

export default SericultureTable;
