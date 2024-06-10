import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function MarketView() {
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
    <Layout title="Market View">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Market View</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/market-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/market-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Card.Header>Market Details</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}>ID:</td>
                      <td>{MarketMaster.marketMasterId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Market:</td>
                      <td>{MarketMaster.marketMasterName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Market Name in Kannada:</td>
                      <td>{MarketMaster.marketNameInKannada}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Market Type:</td>
                      <td>{MarketMaster.marketTypeMasterName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Client ID:</td>
                      <td>{MarketMaster.clientId}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Tare Weight:</td>
                      <td>{MarketMaster.boxWeight}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Lot Weight</td>
                      <td>{MarketMaster.lotWeight}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        Issue Bidding Slip Start Time
                      </td>
                      <td>{MarketMaster.issueBidSlipStartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        Issue Bidding Slip End Time
                      </td>
                      <td>{MarketMaster.issueBidSlipEndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> 1st Round Bid Start Time</td>
                      <td>{MarketMaster.auction1StartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> 2nd Round Bid Start Time</td>
                      <td>{MarketMaster.auction2StartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> 3rd Round Bid Start Time</td>
                      <td>{MarketMaster.auction3StartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> 1st Round Bid End Time</td>
                      <td>{MarketMaster.auction1EndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> 2nd Round Bid End Time</td>
                      <td>{MarketMaster.auction2EndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> 3rd Round Bid End Time</td>
                      <td>{MarketMaster.auction3EndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        1st Round auction Acceptance Start Time
                      </td>
                      <td>{MarketMaster.auctionAcceptance1StartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        2nd Round auction Acceptance Start Time
                      </td>
                      <td>{MarketMaster.auctionAcceptance2StartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        3rd Round auction Acceptance Start Time
                      </td>
                      <td>{MarketMaster.auctionAcceptance3StartTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        1st Round auction Acceptance End Time
                      </td>
                      <td>{MarketMaster.auctionAcceptance1EndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        2nd Round auction Acceptance End Time{" "}
                      </td>
                      <td>{MarketMaster.auctionAcceptance2EndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>
                        {" "}
                        3rd Round auction Acceptance End Time
                      </td>
                      <td>{MarketMaster.auctionAcceptance3EndTime}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}>Reeler Minimum Balance</td>
                      <td>{MarketMaster.reelerMinimumBalance}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Address</td>
                      <td>{MarketMaster.marketMasterAddress}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> State:</td>
                      <td>{MarketMaster.stateName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> District:</td>
                      <td>{MarketMaster.districtName}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Taluk:</td>
                      <td>{MarketMaster.talukName}</td>
                    </tr>

                    <tr>
                      <td style={styles.ctstyle}> Division:</td>
                      <td>{MarketMaster.name}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Snorkel Request Path:</td>
                      <td>{MarketMaster.snorkelRequestPath}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Snorkel Response Path:</td>
                      <td>{MarketMaster.snorkelResponsePath}</td>
                    </tr>
                    <tr>
                      <td style={styles.ctstyle}> Client Code:</td>
                      <td>{MarketMaster.clientCode}</td>
                    </tr>

                    <tr>
                      <td style={styles.ctstyle}>Payment Mode:</td>
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

export default MarketView;
