import { Card, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";
import { Icon } from "../../../components";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ArmCalculationView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(baseURL + `armCalculation/get/${id}`)
      .then((r) => setData(r.data.content))
      .catch(() => setData(null));
  }, [id]);

  const fmt = (v) => v != null ? `₹ ${parseFloat(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—";
  const totalAmount = data?.quantity && data?.unitRate
    ? parseFloat(data.quantity) * parseFloat(data.unitRate)
    : null;

  const labelStyle = { fontWeight: 600, fontSize: "12px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" };
  const valueStyle = { fontSize: "14px", color: "#1a202c", fontWeight: 500 };

  const Field = ({ label, value }) => (
    <Col md={4} style={{ marginBottom: "16px" }}>
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>{value || "—"}</div>
    </Col>
  );

  return (
    <Layout title={t("View ARM Calculation")}>
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("ARM Calculation Details")}</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <div className="d-flex gap-2">
              <Button onClick={() => navigate(`/seriui/arm-calculation-edit/${id}`)} style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", border: "none", borderRadius: "8px", fontWeight: 700 }}>
                <Icon name="edit" /> {t("Edit")}
              </Button>
              <Link to="/seriui/arm-calculation-list" className="btn btn-outline-secondary" style={{ borderRadius: "8px", fontWeight: 700 }}>
                <Icon name="arrow-left" /> {t("Back")}
              </Link>
            </div>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card style={{ borderRadius: "14px", border: "none", boxShadow: "0 4px 24px rgba(30,103,168,0.10)" }}>
          <div style={{ background: "linear-gradient(135deg,#1e67a8,#2d9cdb)", padding: "14px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>⚙️</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{t("ARM Calculation")}</div>
          </div>
          <Card.Body style={{ padding: "28px" }}>
            {!data ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>{t("Loading...")}</div>
            ) : (
              <>
                {/* Reference IDs */}
                <div style={{ marginBottom: "24px", padding: "16px", background: "#f0f5fb", borderRadius: "10px", border: "1px solid #d0e4f7" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e67a8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                    {t("References")}
                  </div>
                  <Row>
                    <Field label={t("SC Category ID")} value={data.scCategoryId} />
                    <Field label={t("Component Type ID")} value={data.componentTypeId} />
                    <Field label={t("Component ID")} value={data.componentId} />
                    <Field label={t("ARM Ends")} value={data.armEnds} />
                  </Row>
                </div>

                {/* Equipment Details */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e67a8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px", borderBottom: "2px solid #e8f0fa", paddingBottom: "6px" }}>
                    {t("Equipment Details")}
                  </div>
                  <Row>
                    <Col md={12} style={{ marginBottom: "16px" }}>
                      <div style={labelStyle}>{t("Name of the Equipment")}</div>
                      <div style={{ ...valueStyle, fontSize: "15px", fontWeight: 600, color: "#004b8e" }}>{data.equipmentName}</div>
                    </Col>
                  </Row>
                </div>

                {/* Amounts */}
                <div style={{ background: "#fffbeb", borderRadius: "10px", padding: "20px", border: "1px solid #fde68a", marginBottom: "20px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>
                    {t("Amount Details")}
                  </div>
                  <Row>
                    <Col md={3} style={{ marginBottom: "12px" }}>
                      <div style={{ ...labelStyle, color: "#92400e" }}>{t("Quantity (No's)")}</div>
                      <div style={{ ...valueStyle, fontSize: "16px", fontWeight: 700 }}>{data.quantity ?? "—"}</div>
                    </Col>
                    <Col md={3} style={{ marginBottom: "12px" }}>
                      <div style={{ ...labelStyle, color: "#92400e" }}>{t("Unit Rate")}</div>
                      <div style={{ ...valueStyle, fontSize: "16px", fontWeight: 700 }}>{fmt(data.unitRate)}</div>
                    </Col>
                    <Col md={3} style={{ marginBottom: "12px" }}>
                      <div style={{ ...labelStyle, color: "#92400e" }}>{t("Total Amount")}</div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#1e67a8" }}>{totalAmount != null ? fmt(totalAmount) : fmt(data.totalAmount)}</div>
                    </Col>
                    <Col md={3} style={{ marginBottom: "12px" }}>
                      <div style={{ ...labelStyle, color: "#92400e" }}>{t("Unit Cost")}</div>
                      <div style={{ ...valueStyle, fontSize: "16px", fontWeight: 700 }}>{fmt(data.unitCost)}</div>
                    </Col>
                  </Row>
                </div>

                {/* Share Percentages */}
                <Row>
                  <Col md={3}>
                    <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "16px", border: "1px solid #86efac", textAlign: "center" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#166534", textTransform: "uppercase", marginBottom: "6px" }}>{t("Central Share")}</div>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "#15803d" }}>{data.centralPercentage != null ? `${data.centralPercentage}%` : "—"}</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div style={{ background: "#eff6ff", borderRadius: "10px", padding: "16px", border: "1px solid #93c5fd", textAlign: "center" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#1e40af", textTransform: "uppercase", marginBottom: "6px" }}>{t("State Share")}</div>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "#1d4ed8" }}>{data.statePercentage != null ? `${data.statePercentage}%` : "—"}</div>
                    </div>
                  </Col>
                </Row>

                {/* Payment Stage Percentages */}
                <Row className="mt-3">
                  <Col md={4}>
                    <div style={{ background: "#fdf4ff", borderRadius: "10px", padding: "16px", border: "1px solid #e9d5ff", textAlign: "center" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#7e22ce", textTransform: "uppercase", marginBottom: "6px" }}>{t("Advance Payment")}</div>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "#9333ea" }}>{data.advancePercentage != null ? `${data.advancePercentage}%` : "—"}</div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div style={{ background: "#fff7ed", borderRadius: "10px", padding: "16px", border: "1px solid #fed7aa", textAlign: "center" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#9a3412", textTransform: "uppercase", marginBottom: "6px" }}>{t("First Payment")}</div>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "#c2410c" }}>{data.firstPayment != null ? `${data.firstPayment}%` : "—"}</div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div style={{ background: "#f0fdfa", borderRadius: "10px", padding: "16px", border: "1px solid #99f6e4", textAlign: "center" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#115e59", textTransform: "uppercase", marginBottom: "6px" }}>{t("Final Payment")}</div>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "#0f766e" }}>{data.finalPayment != null ? `${data.finalPayment}%` : "—"}</div>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default ArmCalculationView;
