import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import { Icon, Select } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_REGISTRATION;

function ExternalUnitRegisterView() {
   // Translation
   const { t } = useTranslation();

  const DetailGrid = ({ items }) => {
    const visible = items.filter((it) => it && it.show !== false);
    return (
      <div className="sh-detail-grid">
        {visible.map((it, i) => (
          <div className="sh-detail-cell" key={`${it.label}-${i}`}>
            <div className="sh-detail-label">{it.label}</div>
            <div className="sh-detail-value">
              {it.value !== undefined &&
              it.value !== null &&
              it.value !== "" ? (
                it.value
              ) : (
                <span className="sh-detail-empty">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const { id } = useParams();
  // const [data] = useState(CasteDatas);
  const [ExternalUnitRegister, setExternalUnitRegister] = useState({});
  const [loading, setLoading] = useState(false);


  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `external-unit-registration/get-join/${id}`)
      .then((response) => {
        setExternalUnitRegister(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setExternalUnitRegister({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title="External Unit Registration View">
      <style>{externalUnitViewStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("External Unit Registration View")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/external-unit-registration-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/external-unit-registration-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-view-wrap">
        <Card className="sh-section-card">
          <Card.Header className="sh-section-header">
            <Icon name="briefcase" />
            <span>{t("External Unit Registration Details")}</span>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <h1 className="d-flex justify-content-center align-items-center">
                Loading...
              </h1>
            ) : (
              <Row className="g-gs">
                <Col lg="12">
                  <DetailGrid
                    items={[
                      { label: t("ID"), value: ExternalUnitRegister.externalUnitRegistrationId },
                      { label: t("External Unit"), value: ExternalUnitRegister.externalUnitTypeName },
                      { label: t("Name of the Unit"), value: ExternalUnitRegister.name },
                      { label: t("address"), value: ExternalUnitRegister.address },
                      { label: t("License/Registration Number"), value: ExternalUnitRegister.licenseNumber },
                      { label: t("External Units ID"), value: ExternalUnitRegister.externalUnitNumber },
                      { label: t("Name of the Owner/Organisation"), value: ExternalUnitRegister.organisationName },
                      { label: t("Race"), value: ExternalUnitRegister.raceMasterName },
                      { label: t("Capacity Of Production/Annum"), value: ExternalUnitRegister.capacity },
                      { label: t("Virtual Account Number"), value: ExternalUnitRegister.virtualAccountNumber },
                      { label: t("Branch Name"), value: ExternalUnitRegister.branchName },
                      { label: t("IFSC Code"), value: ExternalUnitRegister.ifscCode },
                      { label: t("Market"), value: ExternalUnitRegister.marketMasterName },
                      { label: t("Lot Number Nomenclature"), value: ExternalUnitRegister.lotNumberNomenclature },
                      { label: "Tsc", value: ExternalUnitRegister.tscName },
                      { label: t("district"), value: ExternalUnitRegister.districtName },
                      { label: t("taluk"), value: ExternalUnitRegister.talukName },
                      { label: t("Name in Kannada"), value: ExternalUnitRegister.nameInKannada },
                    ]}
                  />
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

const externalUnitViewStyles = `
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
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-view-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-view-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
    margin-bottom: 0;
  }
  .sh-view-wrap .card-body {
    padding: 20px !important;
  }
  .sh-section-header {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-bottom: none !important;
    padding: 14px 20px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    font-size: 15px !important;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
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
  .sh-detail-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: 1px solid #e6ecf4;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }
  .sh-detail-cell {
    display: grid;
    grid-template-columns: 42% 1fr;
    border-right: 1px solid #eef2f8;
    border-bottom: 1px solid #eef2f8;
    min-height: 40px;
  }
  .sh-detail-cell:nth-child(3n) {
    border-right: none;
  }
  .sh-detail-label {
    background-color: #f7faff;
    color: #4a5568;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.1px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    border-right: 1px solid #eef2f8;
    line-height: 1.35;
  }
  .sh-detail-value {
    padding: 8px 12px;
    color: #2b3a55;
    font-size: 13.5px;
    display: flex;
    align-items: center;
    word-break: break-word;
    line-height: 1.4;
    transition: background-color 0.15s ease;
  }
  .sh-detail-cell:hover .sh-detail-value {
    background-color: #fbfdff;
  }
  .sh-detail-empty {
    color: #b0bac9;
    font-style: italic;
  }
  @media (max-width: 991px) {
    .sh-detail-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .sh-detail-cell:nth-child(3n) {
      border-right: 1px solid #eef2f8;
    }
    .sh-detail-cell:nth-child(2n) {
      border-right: none;
    }
  }
  @media (max-width: 575px) {
    .sh-detail-grid {
      grid-template-columns: 1fr;
    }
    .sh-detail-cell {
      grid-template-columns: 45% 1fr;
      border-right: none !important;
    }
  }
`;

export default ExternalUnitRegisterView;
