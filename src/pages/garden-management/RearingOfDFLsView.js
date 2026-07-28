import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import { useTranslation } from "react-i18next";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function RearingOfDFLsView() {
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
  const [rearingOfDFLs, setRearingOfDFLs] = useState({});
  const [loading, setLoading] = useState(false);

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `Rearing-of-dfls/get-info-by-id/${id}`)
      .then((response) => {
        setRearingOfDFLs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setRearingOfDFLs({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title={t("View Rearing of DFLs Details")}>
      <style>{rearingOfDFLsViewStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("View Rearing of DFLs Details")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/rearing-of-dfls-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/rearing-of-dfls-list"
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
            <Icon name="package" />
            <span>{t("Rearing of DFLs Details")}</span>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <h1 className="d-flex justify-content-center align-items-center">
                {t("Loading...")}
              </h1>
            ) : (
              <Row className="g-gs">
                <Col lg="12">
                  <DetailGrid
                    items={[
                      { label: t("ID"), value: rearingOfDFLs.id },
                      { label: t("Disinfectant Usage Details"), value: rearingOfDFLs.disinfectantMasterName },
                      { label: t("Crop Number"), value: rearingOfDFLs.cropNumber },
                      { label: t("Lot Number"), value: rearingOfDFLs.lotNumber },
                      { label: t("Source"), value: rearingOfDFLs.source },
                      { label: t("Number Of DFLs"), value: rearingOfDFLs.numberOfDfls },
                      { label: t("Cold Storage Details"), value: rearingOfDFLs.coldStorageDetails },
                      { label: t("Released On Date"), value: rearingOfDFLs.releasedOnDate },
                      { label: t("Brushing Date"), value: rearingOfDFLs.brushingDate },
                      { label: t("Chawki Percentage"), value: rearingOfDFLs.chawkiPercentage },
                      { label: t("Worm Weight"), value: rearingOfDFLs.wormWeight },
                      { label: t("Spun on date(From)"), value: rearingOfDFLs.spunOnDate },
                      { label: t("Worm Test Details"), value: rearingOfDFLs.wormTestDetails },
                      { label: t("Cocoon Assessment Details"), value: rearingOfDFLs.cocoonAssessmentDetails },
                      { label: t("Average Loose Eggs per DFL"), value: rearingOfDFLs.averageLooseEggsPerDfl },
                      { label: t("Worms Selected After 3rd Moult"), value: rearingOfDFLs.wormsSelectedAfter3rdMoult },
                      { label: t("Worms Selected for Testing After 3rd Moult"), value: rearingOfDFLs.wormsSelectedForTestingAfter3rdMoult },
                      { label: t("Low Yield"), value: rearingOfDFLs.lowYield },
                      { label: t("Failed Eggs"), value: rearingOfDFLs.failedEggs },
                      { label: t("Actual Brushed DFLs"), value: rearingOfDFLs.actualBrushedDfls },
                      { label: t("Average Chawki per DFL"), value: rearingOfDFLs.averageChawkiPerDfl },
                      { label: t("Leaf Quantity Used"), value: rearingOfDFLs.leafQuantityUsed },
                      { label: t("ERR After 3rd Moult"), value: rearingOfDFLs.errAfter3rdMoult },
                      { label: t("Seed Cocoons"), value: rearingOfDFLs.seedCocoons },
                      { label: t("Reeling Cocoons"), value: rearingOfDFLs.reelingCocoons },
                      { label: t("Reeling Cocoons Weight (kg)"), value: rearingOfDFLs.reelingCocoonsWeight },
                      { label: t("Reeling Cocoons Value (₹)"), value: rearingOfDFLs.reelingCocoonsValue },
                      { label: t("Microscope Exam - Stage 1"), value: rearingOfDFLs.wormTestStage1 },
                      { label: t("Microscope Exam - Stage 2"), value: rearingOfDFLs.wormTestStage2 },
                      { label: t("Microscope Exam - Stage 3"), value: rearingOfDFLs.wormTestStage3 },
                      { label: t("Microscope Exam - Stage 4"), value: rearingOfDFLs.wormTestStage4 },
                      { label: t("Microscope Exam - Stage 5"), value: rearingOfDFLs.wormTestStage5 },
                      { label: t("Cocoon Shell Weight"), value: rearingOfDFLs.cocoonShellWeight },
                      { label: t("Denier"), value: rearingOfDFLs.denier },
                      { label: t("Mortality %"), value: rearingOfDFLs.mortalityPercent },
                      { label: t("Worms in 4th Stage"), value: rearingOfDFLs.worms4thStage },
                      { label: t("BiCo / Market Cocoons"), value: rearingOfDFLs.bicoMarketCocoons },
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

const rearingOfDFLsViewStyles = `
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

export default RearingOfDFLsView;
