import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect, useRef, useMemo } from "react";
import Swal from "sweetalert2";
import React from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function SericultureTable() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-populate from URL params (e.g. when navigating from list "Edit")
  const [schemeId, setSchemeId]       = useState(searchParams.get("schemeId")    || "");
  const [subSchemeId, setSubSchemeId] = useState(searchParams.get("subSchemeId") || "");
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
  // Sourced from the master-data module's own ScSubSchemeDetails path —
  // not the DBT unit-cost endpoint, whose subSchemeId does not map to
  // scSubSchemeDetailsId and silently broke saves.
  const [subSchemeListData, setSubSchemeListData] = useState([]);
  useEffect(() => {
    if (schemeId) {
      api
        .get(baseURL + `scSubSchemeDetails/get-by-sc-scheme-details-id/${schemeId}`)
        .then((r) => setSubSchemeListData(r.data.content.scSubSchemeDetails || []))
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
  }, [schemeId]);

  // ── Approval Stages — master list, always loaded from get-all on mount ────
  // sericultureTableId is attached per-stage once a scheme+subScheme is picked
  const [approvalStages, setApprovalStages] = useState([]);

  useEffect(() => {
    api
      .get(baseURL + `scApprovalStage/get-all`)
      .then((r) => {
        const stages = r.data.content.scApprovalStage || [];
        setApprovalStages(stages.map((s) => ({ ...s, sericultureTableId: null })));
      })
      .catch(() => setApprovalStages([]));
  }, []);

  // ── Groups ───────────────────────────────────────────────────────────────
  // Each group = { id, daysCount, stageIds: [scApprovalStageId, ...] }.
  // A stage can only belong to one group at a time.
  const [groups, setGroups] = useState([]);
  const groupIdRef = useRef(0);
  const nextGroupId = () => ++groupIdRef.current;

  // Stages picked for the NEXT group, not yet committed via "Add Group"
  const [pendingStageIds, setPendingStageIds] = useState([]);
  const [pendingDaysCount, setPendingDaysCount] = useState("");

  const groupedIdSet = useMemo(
    () => new Set(groups.flatMap((g) => g.stageIds)),
    [groups]
  );

  // When scheme + subScheme are both selected, pre-load already-saved stages into groups
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
              return { ...stage, sericultureTableId: match?.sericultureTableId || null };
            })
          );

          // Bucket already-saved + checked stages by their persisted groupNo —
          // the real, user-defined group identity — so two groups that happen
          // to share the same Days Count are never merged back together.
          // Legacy rows saved before groupNo existed (groupNo == null) fall
          // back to bucketing by daysCount, same as before.
          let maxGroupNo = 0;
          saved.forEach((i) => {
            if (i.groupNo != null) maxGroupNo = Math.max(maxGroupNo, i.groupNo);
          });

          const byGroup = {};
          saved
            .filter((i) => i.checked && i.daysCount != null)
            .forEach((i) => {
              const key = i.groupNo != null ? `g${i.groupNo}` : `d${i.daysCount}`;
              if (!byGroup[key]) byGroup[key] = { groupNo: i.groupNo, daysCount: i.daysCount, stageIds: [] };
              byGroup[key].stageIds.push(i.scApprovalStageId);
            });

          const initialGroups = Object.values(byGroup).map((g) => {
            if (g.groupNo == null) {
              maxGroupNo += 1;
              g.groupNo = maxGroupNo;
            }
            return { id: g.groupNo, daysCount: g.daysCount, stageIds: g.stageIds };
          });

          groupIdRef.current = maxGroupNo;
          setGroups(initialGroups);
          setPendingStageIds([]);
          setPendingDaysCount("");
        })
        .catch(() => {
          setApprovalStages((prev) => prev.map((s) => ({ ...s, sericultureTableId: null })));
          setGroups([]);
        });
    } else {
      setApprovalStages((prev) => prev.map((s) => ({ ...s, sericultureTableId: null })));
      setGroups([]);
      setPendingStageIds([]);
      setPendingDaysCount("");
    }
  }, [schemeId, subSchemeId]);

  // ── Pending-selection helpers (stages not yet locked into a group) ────────
  const availableStages = approvalStages.filter((s) => !groupedIdSet.has(s.scApprovalStageId));
  const isAllPendingChecked =
    availableStages.length > 0 &&
    availableStages.every((s) => pendingStageIds.includes(s.scApprovalStageId));

  const handleCheckAll = () =>
    setPendingStageIds(isAllPendingChecked ? [] : availableStages.map((s) => s.scApprovalStageId));

  const togglePending = (stageId) =>
    setPendingStageIds((prev) =>
      prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId]
    );

  // ── Group actions ───────────────────────────────────────────────────────
  const addGroup = () => {
    if (pendingStageIds.length === 0) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Select at least one Approval Stage for this group." });
      return;
    }
    if (!pendingDaysCount || Number(pendingDaysCount) <= 0) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Enter a valid Days Count for this group." });
      return;
    }
    setGroups((prev) => [
      ...prev,
      { id: nextGroupId(), daysCount: Number(pendingDaysCount), stageIds: [...pendingStageIds] },
    ]);
    setPendingStageIds([]);
    setPendingDaysCount("");
  };

  const removeGroup = (groupId) =>
    setGroups((prev) => prev.filter((g) => g.id !== groupId));

  const removeStageFromGroup = (groupId, stageId) =>
    setGroups((prev) =>
      prev
        .map((g) => (g.id === groupId ? { ...g, stageIds: g.stageIds.filter((id) => id !== stageId) } : g))
        .filter((g) => g.stageIds.length > 0)
    );

  const stageName = (stageId) => {
    const stage = approvalStages.find((s) => s.scApprovalStageId === stageId);
    if (!stage) return `Stage ${stageId}`;
    return i18n.language === "kn"
      ? stage.stageNameInKannada || stage.stageName
      : stage.stageName;
  };

  // ── Save — each group's stages get that group's own daysCount ────────────
  const postData = async () => {
    if (!schemeId || !subSchemeId) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select Scheme and Sub Scheme." });
      return;
    }
    const totalGroupedStages = groups.reduce((acc, g) => acc + g.stageIds.length, 0);
    if (totalGroupedStages === 0) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please add at least one Approval Stage group." });
      return;
    }

    setSaving(true);
    try {
      const stageDaysMap = {};
      const stageGroupNoMap = {};
      groups.forEach((g) =>
        g.stageIds.forEach((sid) => {
          stageDaysMap[sid] = g.daysCount;
          stageGroupNoMap[sid] = g.id;
        })
      );

      const promises = approvalStages.map((stage) => {
        const days = stageDaysMap[stage.scApprovalStageId];
        if (days != null) {
          const groupNo = stageGroupNoMap[stage.scApprovalStageId];
          if (stage.sericultureTableId) {
            return api.post(baseURL + `sericultureTable/edit`, {
              sericultureTableId: stage.sericultureTableId,
              schemeId:    Number(schemeId),
              subSchemeId: Number(subSchemeId),
              stepId:      stage.scApprovalStageId,
              daysCount:   Number(days),
              groupNo,
            });
          }
          return api.post(baseURL + `sericultureTable/add`, {
            schemeId:    Number(schemeId),
            subSchemeId: Number(subSchemeId),
            stepId:      stage.scApprovalStageId,
            daysCount:   Number(days),
            groupNo,
          });
        }
        if (stage.sericultureTableId) {
          // Was saved before but no longer part of any group — remove it
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
      <style>{sericultureTableStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Sericulture Table")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link to="/seriui/sericulture-table-list" className="btn btn-primary btn-md d-md-none sh-cta-btn">
                    <Icon name="arrow-long-left" /><span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/seriui/sericulture-table-list" className="btn btn-primary d-none d-md-inline-flex sh-cta-btn">
                    <Icon name="arrow-long-left" /><span>{t("Go To List")}</span>
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
            <span>{t("Add Sericulture Table Mapping")}</span>
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
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label style={{ fontWeight: 600, color: "#444", fontSize: "0.875rem" }}>
                    {t("Sub Scheme")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={subSchemeId}
                    onChange={(e) => setSubSchemeId(e.target.value)}
                    disabled={!schemeId}C
                    style={{ borderRadius: "8px", borderColor: "#d0dff0", padding: "9px 12px", fontSize: "0.875rem" }}
                  >
                    <option value="">{t("Select Sub Scheme")}</option>
                    {subSchemeListData.map((list) => (
                      <option key={list.scSubSchemeDetailsId} value={list.scSubSchemeDetailsId}>
                        {list.subSchemeName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Available Approval Stages — pick a batch, then assign it a Days Count below */}
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
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#1e67a8", fontSize: "0.875rem" }}>
                      📋 {t("Select Approval Stages for the next group")}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {pendingStageIds.length > 0 && (
                        <span
                          style={{
                            background: "#1e67a8", color: "white", borderRadius: "20px",
                            padding: "2px 12px", fontSize: "0.78rem", fontWeight: 600,
                          }}
                        >
                          {pendingStageIds.length} selected
                        </span>
                      )}
                      <Form.Check
                        type="checkbox"
                        id="check-all-stages"
                        label={
                          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#555" }}>
                            {isAllPendingChecked ? t("Uncheck All") : t("Check All")}
                          </span>
                        }
                        checked={isAllPendingChecked}
                        onChange={handleCheckAll}
                        disabled={availableStages.length === 0}
                      />
                    </div>
                  </div>

                  {/* Checkbox cards — only stages not already locked into a group */}
                  <div style={{ padding: "16px 18px", maxHeight: "280px", overflowY: "auto" }}>
                    {availableStages.length === 0 ? (
                      <p className="text-muted mb-0 text-center" style={{ padding: "20px 0" }}>
                        {approvalStages.length === 0
                          ? t("No approval stages available.")
                          : t("All approval stages are already assigned to a group below.")}
                      </p>
                    ) : (
                      <Row className="g-2">
                        {availableStages.map((stage) => {
                          const checked = pendingStageIds.includes(stage.scApprovalStageId);
                          return (
                            <Col lg="4" md="6" key={stage.scApprovalStageId}>
                              <div
                                onClick={() => togglePending(stage.scApprovalStageId)}
                                style={{
                                  border: checked ? "1.5px solid #1e67a8" : "1.5px solid #e0e6ef",
                                  borderRadius: "8px",
                                  padding: "9px 12px",
                                  cursor: "pointer",
                                  background: checked ? "#e8f0fe" : "#fafbff",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  transition: "all 0.15s",
                                  userSelect: "none",
                                }}
                              >
                                <div
                                  style={{
                                    width: "16px", height: "16px", borderRadius: "4px",
                                    border: checked ? "2px solid #1e67a8" : "2px solid #bbb",
                                    background: checked ? "#1e67a8" : "white",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  {checked && <span style={{ color: "white", fontSize: "10px", lineHeight: 1 }}>✓</span>}
                                </div>
                                <span
                                  style={{
                                    fontSize: "0.8rem",
                                    color: checked ? "#1e67a8" : "#444",
                                    fontWeight: checked ? 600 : 400,
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {i18n.language === "kn"
                                    ? stage.stageNameInKannada || stage.stageName
                                    : stage.stageName}
                                </span>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    )}
                  </div>

                  {/* Days Count for this batch + Add Group */}
                  <div
                    style={{
                      background: "#fafbff", borderTop: "1px solid #eef0f5",
                      padding: "12px 18px", display: "flex", alignItems: "flex-end",
                      gap: "12px", flexWrap: "wrap",
                    }}
                  >
                    <div style={{ minWidth: "200px" }}>
                      <Form.Label style={{ fontWeight: 600, color: "#444", fontSize: "0.82rem", marginBottom: "4px" }}>
                        {t("Days Count for this group")}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={pendingDaysCount}
                        onChange={(e) => setPendingDaysCount(e.target.value)}
                        placeholder={t("Enter Days Count")}
                        min={1}
                        style={{ borderRadius: "8px", borderColor: "#d0dff0", padding: "8px 12px", fontSize: "0.875rem" }}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addGroup}
                      disabled={!schemeId || !subSchemeId}
                      style={{
                        background: "linear-gradient(135deg, #1e67a8, #0d4f8a)",
                        border: "none", borderRadius: "8px", padding: "8px 22px",
                        fontWeight: 700, fontSize: "0.85rem",
                      }}
                    >
                      + {t("Add Group")}
                    </Button>
                  </div>
                </div>
              </Col>

              {/* Configured Groups summary */}
              <Col lg="12">
                <div style={{ border: "1px solid #d0dff0", borderRadius: "10px", overflow: "hidden" }}>
                  <div
                    style={{
                      background: "#f0f6ff", padding: "12px 18px",
                      borderBottom: "1px solid #d0dff0",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#1e67a8", fontSize: "0.875rem" }}>
                      🗂 {t("Configured Groups")} ({groups.length})
                    </span>
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    {groups.length === 0 ? (
                      <p className="text-muted mb-0 text-center" style={{ padding: "10px 0" }}>
                        {t("No groups added yet. Select stages above, set a Days Count, and click \"Add Group\".")}
                      </p>
                    ) : (
                      groups.map((group, gi) => (
                        <div
                          key={group.id}
                          style={{
                            border: "1px solid #c3e6c3",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            marginBottom: gi < groups.length - 1 ? "10px" : 0,
                            background: "#f3faf3",
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between flex-wrap" style={{ gap: "8px", marginBottom: "8px" }}>
                            <span style={{ fontWeight: 700, color: "#2e7d32", fontSize: "0.85rem" }}>
                              {t("Group")} {gi + 1} — ⏱ {group.daysCount} {t("day(s)")} — {group.stageIds.length} {t("stage(s)")}
                            </span>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => removeGroup(group.id)}
                              style={{ fontSize: "0.72rem", padding: "2px 10px", borderRadius: "6px" }}
                            >
                              {t("Remove Group")}
                            </Button>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {group.stageIds.map((sid) => (
                              <span
                                key={sid}
                                style={{
                                  border: "1.5px solid #2e7d32", borderRadius: "8px",
                                  padding: "4px 8px 4px 12px", background: "#e6f4e6",
                                  display: "inline-flex", alignItems: "center", gap: "8px",
                                  fontSize: "0.78rem", color: "#2e7d32", fontWeight: 600,
                                }}
                              >
                                {stageName(sid)}
                                <span
                                  onClick={() => removeStageFromGroup(group.id, sid)}
                                  style={{ cursor: "pointer", color: "#888", fontWeight: 700 }}
                                  title="Remove from group"
                                >
                                  ×
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
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
                <><span className="spinner-border spinner-border-sm me-2" />{t("Saving...")}</>
              ) : t("Save")}
            </Button>
            <Link
              to="/seriui/sericulture-table-list"
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

const sericultureTableStyles = `
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

export default SericultureTable;
