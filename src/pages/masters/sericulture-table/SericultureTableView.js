import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function SericultureTableView() {
  const { t } = useTranslation();
  const { id } = useParams();

  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);

  const [schemeListData, setSchemeListData] = useState([]);
  const [subSchemeListData, setSubSchemeListData] = useState([]);
  const [approvalStageList, setApprovalStageList] = useState([]);

  // Load scheme list
  useEffect(() => {
    api
      .get(baseURL + `scSchemeDetails/get-all`)
      .then((r) => setSchemeListData(r.data.content.ScSchemeDetails || []))
      .catch(() => setSchemeListData([]));
  }, []);

  // Load approval stages
  useEffect(() => {
    api
      .get(baseURL + `scApprovalStage/get-all`)
      .then((r) => setApprovalStageList(r.data.content.scApprovalStage || []))
      .catch(() => setApprovalStageList([]));
  }, []);

  // Load record
  useEffect(() => {
    setLoading(true);
    api
      .get(baseURL + `sericultureTable/get/${id}`)
      .then((r) => {
        setRecord(r.data.content || {});
        setLoading(false);
      })
      .catch(() => {
        setRecord({});
        setLoading(false);
      });
  }, [id]);

  // Load sub schemes once schemeId is known from the record
  useEffect(() => {
    if (record.schemeId) {
      api
        .get(baseURLDBT + `master/cost/get-by-scheme-id/${record.schemeId}`)
        .then((r) => setSubSchemeListData(r.data.content.unitCost || []))
        .catch(() => setSubSchemeListData([]));
    }
  }, [record.schemeId]);

  const getSchemeName = (sid) => {
    const s = schemeListData.find((x) => String(x.scSchemeDetailsId) === String(sid));
    return s ? s.schemeName : sid ?? "—";
  };

  const getSubSchemeName = (sid) => {
    const s = subSchemeListData.find((x) => String(x.subSchemeId) === String(sid));
    return s ? s.subSchemeName : sid ?? "—";
  };

  const getStageName = (stepId) => {
    const s = approvalStageList.find((x) => String(x.scApprovalStageId) === String(stepId));
    return s ? s.stageName : stepId ?? "—";
  };

  const fieldStyle = {
    label: {
      background: "#f0f6ff",
      color: "#1e67a8",
      fontWeight: 600,
      fontSize: "0.85rem",
      padding: "10px 16px",
      width: "35%",
      borderRight: "1px solid #d0dff0",
    },
    value: {
      padding: "10px 16px",
      fontSize: "0.85rem",
      color: "#333",
    },
  };

  return (
    <Layout title="Sericulture Table View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Sericulture Table View")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">{t("Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/seriui/sericulture-table-list">{t("Sericulture Table List")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("View")}
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
              📋 {t("Sericulture Table Details")}
            </span>
          </Card.Header>

          <Card.Body style={{ padding: "28px 24px" }}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                <span className="spinner-border text-primary" />
              </div>
            ) : (
              <Row className="g-3">
                <Col lg="12">
                  <table
                    className="table mb-0"
                    style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #d0dff0" }}
                  >
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #d0dff0" }}>
                        <td style={fieldStyle.label}>{t("Sericulture Table ID")}</td>
                        <td style={fieldStyle.value}>{record.sericultureTableId ?? "—"}</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #d0dff0" }}>
                        <td style={fieldStyle.label}>{t("Scheme")}</td>
                        <td style={fieldStyle.value}>{getSchemeName(record.schemeId)}</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #d0dff0" }}>
                        <td style={fieldStyle.label}>{t("Sub Scheme")}</td>
                        <td style={fieldStyle.value}>{getSubSchemeName(record.subSchemeId)}</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #d0dff0" }}>
                        <td style={fieldStyle.label}>{t("Approval Stage")}</td>
                        <td style={fieldStyle.value}>{getStageName(record.stepId)}</td>
                      </tr>
                      <tr>
                        <td style={fieldStyle.label}>{t("Days Count")}</td>
                        <td style={fieldStyle.value}>{record.daysCount ?? "—"}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default SericultureTableView;
