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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function FlexTime() {
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
        if(response.data.content === null || !response.data.content.start){
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
        if(response.data.content === null || !response.data.content.start){
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
        if(response.data.content === null || !response.data.content.start){
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
    }).then(() => navigate("/farmer-type-list"));
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };
  return (
    <Layout title="Flex Time">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Flex Time</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/farmer-type-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/farmer-type-list"
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

      <Block className="mt-4">
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
                        Godown
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Select
                          name="godownId"
                          value={data.godownId}
                          onChange={handleChangeInputs}
                        >
                          <option value="0">Select Godown</option>
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
                        Issue Bidding Slip
                      </Form.Label>
                      <Col sm={3}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={biddingSlipStart}
                        >
                          Start
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={biddingSlipStop}
                          className="ms-2"
                        >
                          Stop
                        </Button>
                      </Col>
                      {biddingSlipStatus ? (
                        <Col sm={3}>
                          <span className="fw-bold" style={{ color: "green" }}>
                            Issue Bidding Slip Flex Time Started
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
                        Auction
                      </Form.Label>
                      <Col sm={3}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={auctionStart}
                        >
                          Start
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={auctionStop}
                          className="ms-2"
                        >
                          Stop
                        </Button>
                      </Col>
                      {auctionStatus ? (
                        <Col sm={3}>
                          <span className="fw-bold" style={{ color: "green" }}>
                            Auction Flex Time Started
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
                        Auction Accept
                      </Form.Label>
                      <Col sm={3}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={auctionAcceptStart}
                        >
                          Start
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={auctionAcceptStop}
                          className="ms-2"
                        >
                          Stop
                        </Button>
                      </Col>
                      {auctionAcceptStatus ? (
                        <Col sm={3}>
                          <span className="fw-bold" style={{ color: "green" }}>
                            Auction Acceptance Flex Time Started
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
                    to="/farmer-type-list"
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

export default FlexTime;
