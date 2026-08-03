import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
// import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function FlexTime() {
  // Translation
           const { t } = useTranslation();
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: 0,
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  // const postData = (e) => {
  //   api
  //     .post(baseURL + `farmer-type/add`, data)
  //     .then((response) => {
  //       saveSuccess();
  //     })
  //     .catch((err) => {
  //       setData({});
  //       saveError();
  //     });
  // };

  const handleChangeInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
    if (name === "godownId") {
      getIssueBiddingFlex(value);
      getAuctionFlex(value);
      getAuctionAcceptFlex(value);
    }
  };

  // to get Godown
  const [godownListData, setGodownListData] = useState([]);
  const getGodownList = (_id) => {
    api
      .get(baseURL + `godown/get-by-market-master-id/${_id}`)
      .then((response) => {
        setGodownListData(response.data.content.godown);
        // setTotalRows(response.data.content.totalItems);
        if (response.data.content.error) {
          setGodownListData([]);
        }
      })
      .catch((err) => {
        setGodownListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.marketId) {
      getGodownList(data.marketId);
    }
  }, [data.marketId]);

  const [biddingSlipStatus, setBiddingSlipStatus] = useState(false);
  const [auctionStatus, setAuctionStatus] = useState(false);
  const [auctionAcceptStatus, setAuctionAcceptStatus] = useState(false);

  // get Flex Time
  const getIssueBiddingFlex = (godown = 0) => {
    const { marketId } = data;
    api
      .post(baseURLMasterData + `auction/misc/getFlexTime`, {
        marketId: marketId,
        godownId: godown,
        activityType: "ISSUEBIDSLIP",
      })
      .then((response) => {
        if (response.data.content === null || !response.data.content.start) {
          setBiddingSlipStatus(false);
        }

        if (response.data.content.start) {
          setBiddingSlipStatus(true);
        }
      })
      .catch((err) => {});
  };

  const getAuctionFlex = (godown = 0) => {
    const { marketId } = data;
    api
      .post(baseURLMasterData + `auction/misc/getFlexTime`, {
        marketId: marketId,
        godownId: godown,
        activityType: "AUCTION",
      })
      .then((response) => {
        if (response.data.content === null || !response.data.content.start) {
          setAuctionStatus(false);
        }

        if (response.data.content.start) {
          setAuctionStatus(true);
        }
      })
      .catch((err) => {});
  };

  const getAuctionAcceptFlex = (godown = 0) => {
    const { marketId } = data;
    api
      .post(baseURLMasterData + `auction/misc/getFlexTime`, {
        marketId: marketId,
        godownId: godown,
        activityType: "AUCTIONACCEPT",
      })
      .then((response) => {
        if (response.data.content === null || !response.data.content.start) {
          setAuctionAcceptStatus(false);
        }

        if (response.data.content.start) {
          setAuctionAcceptStatus(true);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    // if (data.marketId) {
    getIssueBiddingFlex();
    getAuctionFlex();
    getAuctionAcceptFlex();
    // }
  }, []);

  // Bidding Slip Start
  const biddingSlipStart = (e) => {
    const { marketId, godownId } = data;
    const sendData = {
      marketId: marketId,
      godownId: godownId,
      activityType: "ISSUEBIDSLIP",
      start: true,
    };

    api
      .post(baseURLMasterData + `auction/misc/flipFlexTime`, sendData)
      .then((response) => {
        setBiddingSlipStatus(true);
        // saveSuccess();
      })
      .catch((err) => {
        // setData({});
        // saveError();
      });
  };

  // Bidding Slip Stop
  const biddingSlipStop = (e) => {
    const { marketId, godownId } = data;
    const sendData = {
      marketId: marketId,
      godownId: godownId,
      activityType: "ISSUEBIDSLIP",
      start: false,
    };
    api
      .post(baseURLMasterData + `auction/misc/flipFlexTime`, sendData)
      .then((response) => {
        setBiddingSlipStatus(false);
        // saveSuccess();
      })
      .catch((err) => {
        // setData({});
        // saveError();
      });
  };

  // Auction Start
  const auctionStart = (e) => {
    const { marketId, godownId } = data;
    const sendData = {
      marketId: marketId,
      godownId: godownId,
      activityType: "AUCTION",
      start: true,
    };
    api
      .post(baseURLMasterData + `auction/misc/flipFlexTime`, sendData)
      .then((response) => {
        setAuctionStatus(true);
        // saveSuccess();
      })
      .catch((err) => {
        // setData({});
        // saveError();
      });
  };

  //Auction Stop
  const auctionStop = (e) => {
    const { marketId, godownId } = data;
    const sendData = {
      marketId: marketId,
      godownId: godownId,
      activityType: "AUCTION",
      start: false,
    };
    api
      .post(baseURLMasterData + `auction/misc/flipFlexTime`, sendData)
      .then((response) => {
        // saveSuccess();
        setAuctionStatus(false);
      })
      .catch((err) => {
        // setData({});
        // saveError();
      });
  };

  // Auction Accept Start
  const auctionAcceptStart = (e) => {
    const { marketId, godownId } = data;
    const sendData = {
      marketId: marketId,
      godownId: godownId,
      activityType: "AUCTIONACCEPT",
      start: true,
    };
    api
      .post(baseURLMasterData + `auction/misc/flipFlexTime`, sendData)
      .then((response) => {
        setAuctionAcceptStatus(true);
        // saveSuccess();
      })
      .catch((err) => {
        // setData({});
        // saveError();
      });
  };

  //Auction Accept Stop
  const auctionAcceptStop = (e) => {
    const { marketId, godownId } = data;
    const sendData = {
      marketId: marketId,
      godownId: godownId,
      activityType: "AUCTIONACCEPT",
      start: false,
    };
    api
      .post(baseURLMasterData + `auction/misc/flipFlexTime`, sendData)
      .then((response) => {
        setAuctionAcceptStatus(false);
        // saveSuccess();
      })
      .catch((err) => {
        // setData({});
        // saveError();
      });
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("/seriui/farmer-type-list"));
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };
  return (
    <Layout title={t("Flex Time")}>
      <style>{flexTimeStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Flex Time")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              {/* <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/farmer-type-list"
                    className="btn btn-primary btn-md d-md-none"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go To List</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/farmer-type-list"
                    className="btn btn-primary d-none d-md-inline-flex"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go To List</span>
                  </Link>
                </li>
              </ul> */}
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-4 sh-form-wrap">
        <Form action="#">
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      {/* <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        Market
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Select
                          name="marketId"
                          value={data.marketId}
                          onChange={handleChangeInputs}
                        >
                          <option value="0">Select Market</option>
                          {marketListData.map((list) => (
                            <option
                              key={list.marketMasterId}
                              value={list.marketMasterId}
                            >
                              {list.marketMasterName}
                            </option>
                          ))}
                        </Form.Select>
                      </Col> */}
                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        {t("Godown")}
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Select
                          name="godownId"
                          value={data.godownId}
                          onChange={handleChangeInputs}
                        >
                          <option value="0">{t("Select Godown")}</option>
                          {godownListData.map((list) => (
                            <option key={list.godownId} value={list.godownId}>
                              {list.godownName}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      {/* <Col sm={2}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={postData}
                        >
                          Get Details
                        </Button>
                      </Col> */}
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        {t("Issue Bidding Slip")}
                      </Form.Label>
                      <Col sm={3}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={biddingSlipStart}
                        >
                          {t("Start")}
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={biddingSlipStop}
                          className="ms-2"
                        >
                          {t("Stop")}
                        </Button>
                      </Col>
                      {biddingSlipStatus ? (
                        <Col sm={3}>
                          <span className="fw-bold" style={{ color: "green" }}>
                            {t("Issue Bidding Slip Flex Time Started")}
                          </span>
                        </Col>
                      ) : (
                        ""
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="g-gs mt-1">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        {t("Auction")}
                      </Form.Label>
                      <Col sm={3}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={auctionStart}
                        >
                          {t("Start")}
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={auctionStop}
                          className="ms-2"
                        >
                          {t("Stop")}
                        </Button>
                      </Col>
                      {auctionStatus ? (
                        <Col sm={3}>
                          <span className="fw-bold" style={{ color: "green" }}>
                            {t("Auction Flex Time Started")}
                          </span>
                        </Col>
                      ) : (
                        ""
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="g-gs mt-1">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        {t("Auction Accept")}
                      </Form.Label>
                      <Col sm={3}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={auctionAcceptStart}
                        >
                          {t("Start")}
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={auctionAcceptStop}
                          className="ms-2"
                        >
                          {t("Stop")}
                        </Button>
                      </Col>
                      {auctionAcceptStatus ? (
                        <Col sm={3}>
                          <span className="fw-bold" style={{ color: "green" }}>
                            {t("Auction Acceptance Flex Time Started")}
                          </span>
                        </Col>
                      ) : (
                        ""
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="button" variant="primary" onClick={postData}>
                    Save
                  </Button>
                </li>
                <li>
                  <Link
                    to="/seriui/farmer-type-list"
                    className="btn btn-secondary border-0"
                  >
                    Cancel
                  </Link>
                </li>
              </ul>
            </div> */}
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

const flexTimeStyles = `
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
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #2b3a55;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1px solid #dbe4f0;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6;
    box-shadow: 0 0 0 0.2rem rgba(59, 141, 214, 0.15);
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    background: #ffffff !important;
    color: #c43257 !important;
    border: 1px solid #e3496a !important;
    font-weight: 600;
    padding: 8px 22px;
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

export default FlexTime;
