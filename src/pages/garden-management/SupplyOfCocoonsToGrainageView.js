import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import { Icon, Select } from "../../components";
import ReceiptOfDFLsEdit from "./ReceiptOfDFLsEdit";
import SeedCuttingBank from "./SeedCuttingBank";
import { useTranslation } from "react-i18next";

const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function SupplyOfCocoonsToGrainageView() {
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
  const [supplyOfCoocons, setSupplyOfCocoons] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  // let findUser = data.find((item) => item.id === id);
  // setCaste(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `supply-cocoons/get-info-by-id/${id}`)
      .then((response) => {
        setSupplyOfCocoons(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setSupplyOfCocoons({});
        setLoading(false);
      });
  };

  //console.log(Caste);

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title={t("Supply Of Cocoons To Grainage View")}>
      <style>{supplyOfCocoonsToGrainageViewStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">
                {t("Supply Of Cocoons To Grainage View")}
              </Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/supply-of-cocoons-to-grainage-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/supply-of-cocoons-to-grainage-list"
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
            <span>{t("Supply Of Cocoons To Grainage Details")}</span>
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
                      { label: t("ID"), value: supplyOfCoocons.id },
                      { label: t("Grainage"), value: supplyOfCoocons.grainageMasterName },
                      { label: t("Screening Batch No"), value: supplyOfCoocons.screeningBatchNo },
                      { label: t("Generation Number"), value: supplyOfCoocons.generationNumber },
                      { label: t("Spun on date(From)"), value: supplyOfCoocons.spunOnDate },
                      { label: t("Lot Number"), value: supplyOfCoocons.lotNumber },
                      { label: t("Cocoon Supplied in Kg"), value: supplyOfCoocons.cacoonsSuppliedInKg },
                      { label: t("Number Of Cocoons Dispatched"), value: supplyOfCoocons.numberOfCocoonsDispatched },
                      { label: t("Date Of Supply"), value: supplyOfCoocons.dateOfSupply },
                      { label: t("Dispatch Date"), value: supplyOfCoocons.dispatchDate },
                      { label: t("Invoice No"), value: supplyOfCoocons.invoiceNo },
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

const supplyOfCocoonsToGrainageViewStyles = `
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

export default SupplyOfCocoonsToGrainageView;
