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
// import { SerialPort } from "serialport";
import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

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
      {/* <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">e-Weighment</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  e-Weighment
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/caste-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/caste-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head> */}

      <Block>
        <Form action="#">
          <Row className="g-3">
            <Col lg="12">
              <Card>
                <Card.Body>
                  <Row className="g-3 ">
                    <Col lg="8" style={{ padding: "0px 0px 0px 8px" }}>
                      <table className="table small table-bordered weightmenttable marginbottom0">
                        <thead>
                          <tr>
                            <th style={styles.top}>Lot No</th>
                            <th style={styles.top}>Bid Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {/* <td style={styles.bottom}>{noOfBox}</td> */}
                            <td style={{ ...styles.bottom, width: "50%" }}>
                              1
                            </td>

                            <td style={{ ...styles.bottom, width: "50%" }}>
                              {" "}
                              &#8377; 200
                            </td>

                            {/* <td style={styles.bottom}>2</td> */}
                          </tr>
                          <tr>
                            {/* <td style={styles.bottom}>{noOfBox}</td> */}
                            <td style={{ ...styles.bottom, width: "50%" }}>
                              2
                            </td>

                            <td style={{ ...styles.bottom, width: "50%" }}>
                              {" "}
                              &#8377; 300
                            </td>

                            {/* <td style={styles.bottom}>2</td> */}
                          </tr>
                          <tr>
                            {/* <td style={styles.bottom}>{noOfBox}</td> */}
                            <td style={{ ...styles.bottom, width: "50%" }}>
                              3
                            </td>

                            <td style={{ ...styles.bottom, width: "50%" }}>
                              {" "}
                              &#8377; 400
                            </td>

                            {/* <td style={styles.bottom}>2</td> */}
                          </tr>
                          <tr>
                            {/* <td style={styles.bottom}>{noOfBox}</td> */}
                            <td style={{ ...styles.bottom, width: "50%" }}>
                              4
                            </td>

                            <td style={{ ...styles.bottom, width: "50%" }}>
                              {" "}
                              &#8377; 500
                            </td>

                            {/* <td style={styles.bottom}>2</td> */}
                          </tr>
                          <tr>
                            {/* <td style={styles.bottom}>{noOfBox}</td> */}
                            <td style={{ ...styles.bottom, width: "50%" }}>
                              5
                            </td>

                            <td style={{ ...styles.bottom, width: "50%" }}>
                              {" "}
                              &#8377; 600
                            </td>

                            {/* <td style={styles.bottom}>2</td> */}
                          </tr>
                          <tr>
                            {/* <td style={styles.bottom}>{noOfBox}</td> */}
                            <td style={{ ...styles.bottom, width: "50%" }}>
                              6
                            </td>

                            <td style={{ ...styles.bottom, width: "50%" }}>
                              {" "}
                              &#8377; 700
                            </td>

                            {/* <td style={styles.bottom}>2</td> */}
                          </tr>
                          <tr>
                            {/* <td style={styles.bottom}>{noOfBox}</td> */}
                            <td style={{ ...styles.bottom, width: "50%" }}>
                              7
                            </td>

                            <td style={{ ...styles.bottom, width: "50%" }}>
                              {" "}
                              &#8377; 800
                            </td>

                            {/* <td style={styles.bottom}>2</td> */}
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="button" variant="primary" onClick={postData}>
                    Generate
                  </Button>
                </li>
              </ul>
            </div> */}
          </Row>
        </Form>
      </Block>
    </div>
    // </Layout>
  );
}

export default DisplayAllLot;
