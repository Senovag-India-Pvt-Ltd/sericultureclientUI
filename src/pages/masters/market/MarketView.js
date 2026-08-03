import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function MarketView() {
   // Translation
           const { t } = useTranslation();
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const { id } = useParams();
  // const [data] = useState(LandCategoryDatas);
  const [MarketMaster, setMarketMaster] = useState({});
  const [loading, setLoading] = useState(false);

  // // grabs the id form the url and loads the corresponding data
  // useEffect(() => {
  //   let findUser = data.find((item) => item.id === id);
  //   setGodawn(findUser);
  // }, [id, data]);

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `marketMaster/get-join/${id}`)
      .then((response) => {
        setMarketMaster(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setMarketMaster({});
        setLoading(false);
      });
  };

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  return (
    <Layout title={t("Market View")}>
      <style>{marketViewStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Market View")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/market-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/market-list"
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

      <Block className="mt-n4 sh-form-wrap">
        <Card>
          <Card.Header className="sh-section-header">
            <Icon name="eye" />
            <span>{t("Market Details")}</span>
          </Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>{t("ID")}:</td>
                      <td>{MarketMaster.marketMasterId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Market")}:</td>
                      <td>{MarketMaster.marketMasterName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Market Name in Kannada")}:</td>
                      <td>{MarketMaster.marketNameInKannada}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Market Type")}:</td>
                      <td>{MarketMaster.marketTypeMasterName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Client ID")}:</td>
                      <td>{MarketMaster.clientId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Tare Weight")}:</td>
                      <td>{MarketMaster.boxWeight}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Lot Weight")}:</td>
                      <td>{MarketMaster.lotWeight}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        {t("Issue Bidding Slip Start Time")}
                      </td>
                      <td>{MarketMaster.issueBidSlipStartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        {t("Issue Bidding Slip End Time")}
                      </td>
                      <td>{MarketMaster.issueBidSlipEndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("1st Round Bid Start Time")}</td>
                      <td>{MarketMaster.auction1StartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("2nd Round Bid Start Time")}</td>
                      <td>{MarketMaster.auction2StartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("3rd Round Bid Start Time")}</td>
                      <td>{MarketMaster.auction3StartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("1st Round Bid End Time")}</td>
                      <td>{MarketMaster.auction1EndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("2nd Round Bid End Time")}</td>
                      <td>{MarketMaster.auction2EndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("3rd Round Bid End Time")}</td>
                      <td>{MarketMaster.auction3EndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        {t("1st Round auction Acceptance Start Time")}
                      </td>
                      <td>{MarketMaster.auctionAcceptance1StartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        {t("2nd Round auction Acceptance Start Time")}
                      </td>
                      <td>{MarketMaster.auctionAcceptance2StartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        {t("3rd Round auction Acceptance Start Time")}
                      </td>
                      <td>{MarketMaster.auctionAcceptance3StartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        {t("1st Round auction Acceptance End Time")}
                      </td>
                      <td>{MarketMaster.auctionAcceptance1EndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        {t("2nd Round auction Acceptance End Time")}{" "}
                      </td>
                      <td>{MarketMaster.auctionAcceptance2EndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        {t("3rd Round auction Acceptance End Time")}
                      </td>
                      <td>{MarketMaster.auctionAcceptance3EndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>{t("Reeler Minimum Balance")}</td>
                      <td>{MarketMaster.reelerMinimumBalance}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Address")}:</td>
                      <td>{MarketMaster.marketMasterAddress}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("State")}:</td>
                      <td>{MarketMaster.stateName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("District")}:</td>
                      <td>{MarketMaster.districtName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Taluk")}:</td>
                      <td>{MarketMaster.talukName}</td>
                    </tr>

                    <tr>
                      <td style={styles.ctstyle}> {t("Division")}:</td>
                      <td>{MarketMaster.name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Cocoon Age")}:</td>
                      <td>{MarketMaster.cocoonAge}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Snorkel Request Path")}:</td>
                      <td>{MarketMaster.snorkelRequestPath}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Snorkel Response Path")}:</td>
                      <td>{MarketMaster.snorkelResponsePath}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> {t("Client Code")}:</td>
                      <td>{MarketMaster.clientCode}</td>
                    </tr>

                    <tr>
                      <td style={styles.ctstyle}>{t("Payment Mode")}:</td>
                      <td>{MarketMaster.paymentMode}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

const marketViewStyles = `
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
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
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
  .sh-form-wrap table thead th {
    background-color: #eef4fc !important;
    color: #2b3a55 !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.2px;
    border-bottom: 2px solid #d6e3f3 !important;
  }
  .sh-form-wrap table tbody tr:hover {
    background-color: #f7faff !important;
  }
`;

export default MarketView;
