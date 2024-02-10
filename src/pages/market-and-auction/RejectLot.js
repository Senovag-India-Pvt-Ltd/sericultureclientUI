import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function RejectLot() {
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
  };

  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: localStorage.getItem("godownId"),
    allottedLotId: "",
    auctionDate: new Date(),
    cancellationReason: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  // to get Lot Rejection
  const [lotRejectionListData, setLotRejectionListData] = useState([]);

  const getLotRejectionList = () => {
    api
      .get(baseURL + `reason-lot-reject-master/get-all`)
      .then((response) => {
        setLotRejectionListData(response.data.content.reasonLotRejectMaster);
      })
      .catch((err) => {
        setLotRejectionListData([]);
      });
  };

  useEffect(() => {
    getLotRejectionList();
  }, []);

  const navigate = useNavigate();

  const cancelSuccess = (id) => {
    Swal.fire({
      icon: "success",
      title: "Rejected successfully",
      text: `Lot-${id} has been Rejected!`,
    });
  };

  const searchError = (message = "Something went wrong!") => {
    Swal.fire({
      icon: "error",
      title: "Details not Found",
      text: message,
    });
  };

  const [lotDetails, setLotDetails] = useState({});
  const [isActive, setIsActive] = useState(false);
  const display = () => {
    const { marketId, godownId, allottedLotId, auctionDate } = data;

    const formattedDate =
      auctionDate.getFullYear() +
      "-" +
      (auctionDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      auctionDate.getDate().toString().padStart(2, "0");

    api
      .post(baseURLMarket + `auction/print/getPrintableDataForLot`, {
        marketId,
        godownId,
        allottedLotId,
        auctionDate: formattedDate,
      })
      .then((response) => {
        if (response.data.content) {
          setLotDetails(response.data.content);
          setIsActive(true);
        } else {
          searchError(response.data.errorMessages[0]);
          setIsActive(false);
        }
      })
      .catch((err) => {
        setLotRejectionListData([]);
      });
  };

  const rejectLot = () => {
    const {
      marketId,
      godownId,
      allottedLotId,
      cancellationReason,
      auctionDate,
    } = data;

    const formattedDate =
      auctionDate.getFullYear() +
      "-" +
      (auctionDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      auctionDate.getDate().toString().padStart(2, "0");

    api
      .post(baseURLMarket + `auction/cancelLot`, {
        marketId,
        godownId,
        allottedLotId,
        cancellationReason,
        auctionDate: formattedDate,
      })
      .then((response) => {
        if (response.data.errorCode === 0) {
          cancelSuccess(data.allottedLotId);
        } else {
          searchError(response.data.errorMessages[0]);
        }
      })
      .catch((err) => {
        // setLotRejectionListData([]);
      });
    setIsActive(true);
  };

  return (
    <Layout title="Reject Lot">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Reject Lot</Block.Title>
            {/* <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Reject Lot
                </li>
              </ol>
            </nav> */}
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="#" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        <Form action="#">
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="8">
                    <Form.Group as={Row} className="form-group" controlId="fid">
                      <Form.Label column sm={2}>
                        Lot Number
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="text"
                          name="allottedLotId"
                          value={data.allottedLotId}
                          onChange={handleInputs}
                          placeholder="Enter Lot Number"
                        />
                      </Col>
                      <Col sm={4}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        >
                          Search
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className={isActive ? "" : "d-none"}>
              <Card>
                <Card.Body>
                  <Row className="g-gs">
                    <Col lg="6">
                      {/* <Card>
                    <Card.Body> */}
                      <Row className="g-gs">
                        <Col lg="12">
                          <Form.Group
                            as={Row}
                            className="form-group mt-3"
                            controlId="source"
                          >
                            <Form.Label column sm={4}>
                              Reason of Rejection
                            </Form.Label>
                            <Col sm={8}>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="cancellationReason"
                                  value={data.cancellationReason}
                                  onChange={handleInputs}
                                >
                                  <option value="0">Select Reason</option>
                                  {lotRejectionListData.map((list) => (
                                    <option
                                      key={list.reasonLotRejectId}
                                      value={list.reasonLotRejectId}
                                    >
                                      {list.reasonLotRejectName}
                                    </option>
                                  ))}
                                </Form.Select>
                              </div>
                            </Col>
                          </Form.Group>
                        </Col>
                      </Row>
                      {/* </Card.Body>
                  </Card> */}
                    </Col>

                    <Col lg="6">
                      <Card>
                        <Card.Header>Lot Details</Card.Header>
                        <Card.Body>
                          <Row className="g-gs">
                            <Col lg="12">
                              <table className="table small table-bordered">
                                <tbody>
                                  <tr>
                                    <td style={styles.ctstyle}>
                                      {" "}
                                      Farmer Number:
                                    </td>
                                    <td>{lotDetails.farmerNumber}</td>
                                  </tr>
                                  <tr>
                                    <td style={styles.ctstyle}>
                                      {" "}
                                      Farmer First Name:
                                    </td>
                                    <td>{lotDetails.farmerFirstName}</td>
                                  </tr>
                                  <tr>
                                    <td style={styles.ctstyle}>
                                      {" "}
                                      Farmer Middle Name:
                                    </td>
                                    <td>{lotDetails.farmerMiddleName}</td>
                                  </tr>
                                  <tr>
                                    <td style={styles.ctstyle}> IFSC Code:</td>
                                    <td>{lotDetails.ifscCode}</td>
                                  </tr>
                                  <tr>
                                    <td style={styles.ctstyle}>
                                      {" "}
                                      Bank Account Number:
                                    </td>
                                    <td>{lotDetails.accountNumber}</td>
                                  </tr>
                                  <tr>
                                    <td style={styles.ctstyle}>
                                      {" "}
                                      Auction Date:
                                    </td>
                                    <td>{lotDetails.auctionDate}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <div className="gap-col mt-4">
                <ul className="d-flex align-items-center justify-content-center gap g-3">
                  <li>
                    <Button type="button" variant="danger" onClick={rejectLot}>
                      Reject Lot
                    </Button>
                  </li>
                  {/* <li>
                            <Link to="#" className="btn btn-secondary border-0">
                              Cancel
                            </Link>
                          </li> */}
                </ul>
              </div>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default RejectLot;
