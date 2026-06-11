import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useEffect, useState } from "react";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function SericultureTableList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAndGroup = () => {
    setLoading(true);
    api
      .get(baseURL + `sericultureTable/get-all`)
      .then((response) => {
        const records = response.data.content.sericultureTable || [];

        // Group records by schemeId + subSchemeId
        const map = {};
        records.forEach((rec) => {
          const key = `${rec.schemeId}_${rec.subSchemeId}`;
          if (!map[key]) {
            map[key] = {
              key,
              schemeId:     rec.schemeId,
              subSchemeId:  rec.subSchemeId,
              schemeName:   rec.schemeName    || `Scheme ${rec.schemeId}`,
              subSchemeName: rec.subSchemeName || `Sub Scheme ${rec.subSchemeId}`,
              stages: [],
            };
          }
          map[key].stages.push({
            sericultureTableId: rec.sericultureTableId,
            stageName:          rec.approvalStageName || `Stage ${rec.stepId}`,
            daysCount:          rec.daysCount,
          });
        });

        setGroups(Object.values(map));
        setLoading(false);
      })
      .catch(() => {
        setGroups([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAndGroup();
  }, []);

  // Delete all records in a group
  const deleteGroup = (group) => {
    Swal.fire({
      title: "Are you sure?",
      text: `This will delete all ${group.stages.length} approval stage record(s) for ${group.schemeName} / ${group.subSchemeName}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all!",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            group.stages.map((s) =>
              api.delete(baseURL + `sericultureTable/delete/${s.sericultureTableId}`)
            )
          );
          Swal.fire("Deleted!", "All records in this group have been deleted.", "success");
          fetchAndGroup();
        } catch {
          Swal.fire({ icon: "error", title: "Delete failed", text: "Something went wrong!" });
        }
      }
    });
  };

  // All stages in a group share the same daysCount?
  const getGroupDays = (stages) => {
    if (stages.length === 0) return null;
    const allSame = stages.every((s) => s.daysCount === stages[0].daysCount);
    return allSame ? stages[0].daysCount : null;
  };

  return (
    <Layout title="Sericulture Table List">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Sericulture Table List")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/seriui/sericulture-table" className="btn btn-primary btn-md d-md-none">
                  <Icon name="plus" /><span>{t("Create")}</span>
                </Link>
              </li>
              <li>
                <Link to="/seriui/sericulture-table" className="btn btn-primary d-none d-md-inline-flex">
                  <Icon name="plus" /><span>{t("Create")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-3">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
            <span className="spinner-border text-primary" />
          </div>
        ) : groups.length === 0 ? (
          <Card style={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <Card.Body className="text-center py-5 text-muted">
              No records found. <Link to="/seriui/sericulture-table">Create one</Link>.
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-3">
            {groups.map((group) => {
              const commonDays = getGroupDays(group.stages);
              return (
                <Col lg="12" key={group.key}>
                  <Card
                    style={{
                      borderRadius: "12px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      border: "none",
                      overflow: "hidden",
                    }}
                  >
                    {/* Card Header */}
                    <Card.Header
                      style={{
                        background: "linear-gradient(135deg, #1e67a8 0%, #0d4f8a 100%)",
                        padding: "14px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                        <span style={{ color: "white", fontWeight: 700, fontSize: "0.92rem" }}>
                          📋 {group.schemeName}
                        </span>
                        <span style={{ color: "#cce4ff", fontSize: "0.82rem" }}>
                          Sub Scheme: <strong style={{ color: "white" }}>{group.subSchemeName}</strong>
                        </span>
                        {commonDays != null && (
                          <span
                            style={{
                              background: "#fff3cd",
                              color: "#856404",
                              borderRadius: "20px",
                              padding: "2px 12px",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                            }}
                          >
                            ⏱ Days Count : {commonDays}
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          color: "white",
                          borderRadius: "20px",
                          padding: "2px 12px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        {group.stages.length} stage(s)
                      </span>
                    </Card.Header>

                    {/* Stage Badges — stage name only; daysCount shown once in header */}
                    <Card.Body style={{ padding: "16px 20px" }}>
                      <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontSize: "0.8rem", color: "#555", fontWeight: 600 }}>
                          {t("Approval Stages")} :
                        </span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {group.stages.map((stage) => (
                          <div
                            key={stage.sericultureTableId}
                            style={{
                              border: "1.5px solid #1e67a8",
                              borderRadius: "8px",
                              padding: "6px 14px",
                              background: "#e8f0fe",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ fontSize: "0.82rem", color: "#1e67a8", fontWeight: 600 }}>
                              {stage.stageName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card.Body>

                    {/* Actions */}
                    <Card.Footer
                      style={{
                        background: "#f8f9ff",
                        borderTop: "1px solid #eef0f5",
                        padding: "10px 20px",
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <Button
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/seriui/sericulture-table?schemeId=${group.schemeId}&subSchemeId=${group.subSchemeId}`
                          )
                        }
                        style={{
                          background: "linear-gradient(135deg, #1e67a8, #0d4f8a)",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: 600,
                          fontSize: "0.82rem",
                          padding: "5px 18px",
                        }}
                      >
                        {t("Edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteGroup(group)}
                        style={{
                          borderRadius: "6px",
                          fontWeight: 600,
                          fontSize: "0.82rem",
                          padding: "5px 18px",
                        }}
                      >
                        {t("Delete")}
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Block>
    </Layout>
  );
}

export default SericultureTableList;
