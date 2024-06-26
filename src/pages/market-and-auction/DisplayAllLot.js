import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
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
  const styles = {
    top: {
      backgroundColor: "rgb(248 248 249)",
      color: "#000",
      //   width: "50%",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    bottom: {
      backgroundColor: "#fff",
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
      "table-slide": lotsLength > 10,
      "table-slide-100": lotsLength > 100,
      "table-slide-150": lotsLength > 150,
      "table-slide-200": lotsLength > 200,
    });
  }

  function getClassNameHide() {
    return classNames({
      hide: lotsLength < 10,
      "table-slide": lotsLength > 10,
      "table-slide-100": lotsLength > 100,
      "table-slide-150": lotsLength > 150,
      "table-slide-200": lotsLength > 200,
    });
  }

  const getList = () => {
    api
      .post(
        baseURLMarket +
          `auction/report/getAllHighestBidsByMarketIdAndOptionalGodownId`,
        { marketId: localStorage.getItem("marketId") }
      )
      .then((response) => {
        console.log(response);
        setLots(response.data.content);
        setLotsLength(response.data.content.length);
      })
      .catch((err) => {});
  };

  // console.log(lotsLength);

  useEffect(() => {
    const interval = setInterval(getList, 3000);
    return () => clearInterval(interval);
  }, []);

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
    <div>
      <Block>
        <Form action="#">
          <Row className="g-3">
            <Col lg="12">
              <Card>
                <Card.Body>
                  <Row className="g-3 d-flex justify-content-center">
                    <Col lg="8" style={{ padding: "0px 0px 0px 8px" }}>
                      <div className="table">
                        <div className={getClassName()}>
                          <table className="table small table-bordered border border-dark border-5 border-bottom-0 weightmenttable marginbottom0">
                            <thead>
                              <tr>
                                <th style={styles.top}>Lot No</th>
                                <th style={styles.top}>Bid Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lots.map((lot) => (
                                <>
                                  <tr>
                                    <td
                                      style={{ ...styles.bottom, width: "50%" }}
                                    >
                                      {lot.allottedLotId}
                                    </td>

                                    <td
                                      style={{ ...styles.bottom, width: "50%" }}
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
                            <thead>
                              <tr>
                                <th style={styles.top}>Lot No</th>
                                <th style={styles.top}>Bid Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lots.map((lot) => (
                                <>
                                  <tr>
                                    <td
                                      style={{ ...styles.bottom, width: "50%" }}
                                    >
                                      {lot.allottedLotId}
                                    </td>

                                    <td
                                      style={{ ...styles.bottom, width: "50%" }}
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
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Block>
    </div>
    // </Layout>
  );
}

export default DisplayAllLot;
