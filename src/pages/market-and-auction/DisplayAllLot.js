import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import classNames from "classnames";
// import { SerialPort } from "serialport";
import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function DisplayAllLot() {
  const { marketId } = useParams();
  const styles = {
    top: {
      backgroundColor: "rgb(248 248 249)",
      color: "#000",
      //   width: "50%",
      fontWeight: "bold",
      fontSize: "45px",
      textAlign: "center",
    },
    bottom: {
      backgroundColor: "#d0cdcd",
      color: "#b50606",
      fontWeight: "bold",
      fontSize: "80px",
      textAlign: "center",
    },
    large: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "#b50606",
      fontWeight: "bold",
      fontSize: "150px",
      textAlign: "center",
    },
    small: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      fontWeight: "bold",
      fontSize: "43px",
      textAlign: "center",
    },
    xsmall: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "#b50606",
      fontWeight: "bold",
      fontSize: "30px",
      textAlign: "center",
    },
    xxsmall: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    xxsmallcolor: {
      backgroundColor: "rgb(0, 128, 0, 1)",
      color: "rgb(255, 255, 255)",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    smallwhiteback: {
      backgroundColor: "#fff",
      color: "#b50606",
      fontWeight: "bold",
      fontSize: "30px",
      textAlign: "left",
    },
  };

  // Get Lot By MarketId
  const [lots, setLots] = useState([]);
  const [lotsLength, setLotsLength] = useState(0);

  function getClassName() {
    return classNames({
      "table-slide": lotsLength > 9,
      "table-slide-100": lotsLength > 100,
      "table-slide-150": lotsLength > 150,
      "table-slide-200": lotsLength > 200,
    });
  }

  function getClassNameHide() {
    return classNames({
      hide: lotsLength <= 9,
      "table-slide": lotsLength > 9,
      "table-slide-100": lotsLength > 100,
      "table-slide-150": lotsLength > 150,
      "table-slide-200": lotsLength > 200,
    });
  }

  function setScreen() {
    return classNames({
      "ml-74": lotsLength === 0,
      "ml-65": lotsLength === 1,
      "ml-57": lotsLength === 2,
      "ml-48": lotsLength === 3,
      "ml-39": lotsLength === 4,
      "ml-30": lotsLength === 5,
      "ml-22": lotsLength === 6,
      "ml-13": lotsLength === 7,
      "ml-5": lotsLength === 8,
    });
  }

  function setTimeScreen() {
    return classNames({
      "t-55": lotsLength === 0,
      "t-45": lotsLength === 1,
      "t-35": lotsLength === 2,
      "t-25": lotsLength === 3,
      "t-10": lotsLength === 4,
      "t-0": lotsLength === 5,
      "t-n12": lotsLength === 6,
      "t-n27": lotsLength === 7,
      "t-n40": lotsLength >= 8,
      "t-n45": lotsLength >= 9,
    });
  }

  // const getList = () => {
  //   api
  //     .post(
  //       baseURLMarket +
  //         `auction/report/getAllHighestBidsByMarketIdAndOptionalGodownId`,
  //       { marketId: localStorage.getItem("marketId") }
  //     )
  //     .then((response) => {
  //       console.log(response);
  //       setLots(response.data.content);
  //       setLotsLength(response.data.content.length);
  //     })
  //     .catch((err) => {});
  // };

  // Date Formate
  const dateFormatter = (date) => {
    if (date) {
      return (
        new Date(date).getFullYear() +
        "-" +
        (new Date(date).getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        new Date(date).getDate().toString().padStart(2, "0")
      );
    } else {
      return "";
    }
  };

  const getList = () => {
    console.log(marketId);
    const today = dateFormatter(new Date());
    api
      .post(baseURLMarket + `auction/report/getLotAndAmount`, {
        marketId: marketId,
        auctionDate: today,
      })
      .then((response) => {
        console.log(response);
        setLots(response.data.content);
        setLotsLength(response.data.content.length);
      })
      .catch((err) => {});
  };

  // console.log(lotsLength);

  useEffect(() => {
    const interval = setInterval(getList, 1000);
    return () => clearInterval(interval);
  }, []);

  // to get market data from api

  const [data, setData] = useState({});
  const getIdList = () => {
    // setLoading(true);
    api
      .get(baseURL + `marketMaster/get/${localStorage.getItem("marketId")}`)
      .then((response) => {
        setData(response.data.content);
        // setLoading(false);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
      });
  };

  useEffect(() => {
    getIdList();
  }, []);

  console.log("hello", data);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",

      // text: "You clicked the button!",
    }).then(() => {
      navigate("/seriui/caste-list");
    });
  };
  const saveError = () => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: "Something went wrong!",
    });
  };
  return (
    // <Layout title="e-Weighment">
    <div style={{ backgroundColor: "white", height: "100vh", width: "100vw" }}>
      {/* <Block> */}
      <Form action="#">
        <Row
          // className="g-3"
          style={{ transform: "rotate(90deg)", maxHeight: "1300px" }}
        >
          <Col lg="8">
            {/* <Card>
                <Card.Body> */}
            <Row className="g-3 d-flex justify-content-center">
              <Col lg="8" style={{ padding: "0px 0px 0px 0px" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "33%",
                    zIndex: 1000,
                    color: "red",
                    fontSize: "6rem",
                    fontWeight: "bold",
                  }}
                  className={setTimeScreen()}
                >
                  {/* <div>{lots&& lots.length>0&&lots.map(lot=>lot.currentTime)}</div> */}
                  {/* <div>{console.log("hello", lots)}</div> */}
                  <div className="d-flex flex-column lh-1 justify-content-center align-items-center">
                    <span>
                      {lots && lots.length > 0 && lots[0].currentTime}
                    </span>
                    <span
                      className="mb-4"
                      style={{ fontSize: "2rem", color: "#b1b117" }}
                    >
                      ಕರ್ನಾಟಕ ಸರ್ಕಾರ ರೇಷ್ಮೆ ಇಲಾಖೆ{" "}
                      <span style={{ color: "red" }}>
                        {" "}
                        {data.marketNameInKannada}
                      </span>
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
            {/* <Row className="g-3 d-flex justify-content-center">
              <Col lg="12" style={{ padding: "0px 0px 0px 0px" }}>
                <div
                  style={{
                    position: "absolute",
                    // left: "33%",
                    zIndex: 1000,
                    // color: "red",
                    fontSize: "6rem",
                    fontWeight: "bold",
                  }}
                  className={setTimeScreen()}
                >
                  <div>
                    <table className="table small table-bordered border border-dark border-5 border-bottom-0 weightmenttable marginbottom0">
                      <thead>
                        <tr>
                          <th style={{...styles.top,padding:'0rem 5.6rem 0rem 5.6rem'}}>ಲಾಟ್ ನಂ</th>
                          <th style={{...styles.top,padding:'0rem 5.6rem 0rem 5.8rem'}}>ಬಿಡ್ ಮೊತ್ತ</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </Col>
            </Row> */}
            <Row className="g-3 d-flex justify-content-center">
              <Col lg="8" style={{ padding: "0px 0px 0px 0px" }}>
                <div className={`table ${setScreen()}`}>
                  <table
                    className="table small table-bordered border border-dark border-5 border-bottom-0 weightmenttable marginbottom0"
                    style={{ marginTop: "-4rem" }}
                  >
                    <thead style={{ position: "sticky", top: 0, zIndex: 1000 }}>
                      <tr>
                        <th style={styles.top}>ಲಾಟ್ ನಂ</th>
                        <th style={styles.top}>ಬಿಡ್ ಮೊತ್ತ</th>
                      </tr>
                    </thead>
                  </table>
                  <div className={getClassName()}>
                    <table className="table small table-bordered border border-dark border-5 border-bottom-0 weightmenttable marginbottom0">
                      <tbody>
                        {lots &&
                          lots.length > 0 &&
                          lots.map((lot) => (
                            <>
                              <tr>
                                <td style={{ ...styles.bottom, width: "50%" }}>
                                  {lot.allottedLotId}
                                </td>

                                <td
                                  style={{
                                    ...styles.bottom,
                                    width: "50%",
                                    color: "green",
                                  }}
                                >
                                  {" "}
                                  &#8377; {lot.highestBid}
                                </td>
                              </tr>
                            </>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={getClassNameHide()}>
                    <table className="table small table-bordered border border-dark border-5 border-top-0 weightmenttable marginbottom0">
                      {/* <thead>
                        <tr>
                          <th style={styles.top}>ಲಾಟ್ ನಂ</th>
                          <th style={styles.top}>ಬಿಡ್ ಮೊತ್ತ</th>
                        </tr>
                      </thead> */}
                      <tbody>
                        {lots.map((lot) => (
                          <>
                            <tr>
                              <td style={{ ...styles.bottom, width: "50%" }}>
                                {lot.allottedLotId}
                              </td>

                              <td
                                style={{
                                  ...styles.bottom,
                                  width: "50%",
                                  color: "green",
                                }}
                              >
                                {" "}
                                &#8377; {lot.highestBid}
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
            </Row>
            {/* </Card.Body>
              </Card> */}
          </Col>
        </Row>
      </Form>
      {/* </Block> */}
    </div>
    // </Layout>
  );
}

export default DisplayAllLot;
