import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { Icon } from "../../components";
import React, { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

const acceptFarmerAuctionStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title { margin-bottom: 4px; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
  .sh-form-wrap { background: #eef2f8; border-radius: 14px; padding: 18px; }
  .sh-form-wrap .card { border: none; border-radius: 12px !important; box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1); overflow: hidden; }
  .sh-form-wrap .form-control { border-radius: 8px; border: 1px solid #dbe4f0; }
  .sh-form-wrap .form-control:focus { border-color: #3b8dd6; box-shadow: 0 0 0 0.2rem rgba(59, 141, 214, 0.15); }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border: none !important;
    font-weight: 600; padding: 8px 22px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-plain-table thead th { border: none !important; }
  .sh-plain-table tbody tr:hover { background-color: #f7faff; }
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

function AcceptFarmerAuction() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [data, setData] = useState({
    allotedLotId: "",
    amount: "",
    farmerFirstName: "",
    farmerMiddleName: "",
    farmerLastName: "",
    farmerFruitsId: "",
    reelerName: "",
    reelerFruitsId: "",
    reelingLicenseNumber: "",
    reelerAuctionId: "",
  });

  const [validated, setValidated] = useState(false);

  const { id } = useParams();
  // const [data] = useState(EducationDatas);

  // let name, value;
  // const handleInputs = (e) => {
  //   // debugger;
  //   name = e.target.name;
  //   value = e.target.value;
  //   setData({ ...data, [name]: value });
  // };

  const acceptSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Accepted successfully",
      text: "Auction Accepted Successfully",
      customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
    });
  };

  const acceptError = (message = "Something went wrong!") => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Accept attempt was not successful",
      html: errorMessage,
      customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
    });
  };

  const [farmerAuction, setFarmerAuction] = useState({});
  const [loading, setLoading] = useState(false);
  const [highestBid, setHighestBid] = useState({
    marketId: localStorage.getItem("marketId"),
    allottedLotId: "",
    godownId: localStorage.getItem("godownId"),
  });
  const [showAccept, setShowAccept] = useState(false);

  // console.log(highestBid);
  console.log(showAccept);

  const [isActive, setIsActive] = useState(false);
  const display = (event) => {
    event.preventDefault();
    // debugger;
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURL1 + `auction/reeler/getHighestBidPerLotDetails`, {
          allottedLotId: highestBid.allottedLotId,
          marketId: highestBid.marketId,
          godownId: highestBid.godownId,
        })

        .then((response) => {
          if (response.data.errorCode === 0) {
            setFarmerAuction(response.data.content);
            setIsActive(true);
            // console.log("hello",response.data.content.status.length);
            // debugger;
            if (response.data.content.status) {
              setShowAccept(false);
            } else {
              setShowAccept(true);
            }
            setLoading(false);
          } else if (response.data.errorCode === -1) {
            acceptError(response.data.errorMessages[0]);
            setIsActive(false);
          }
        })
        .catch((err) => {
          // setFarmerAuction({});
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            acceptError(err.response.data.validationErrors);
          }
          setLoading(false);
        })
        .finally(() => {
          setValidated(true);
        });
    }
  };

  const handleLotIdInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setHighestBid({ ...highestBid, [name]: value });
  };

  const [res, setRes] = useState({});

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [acceptData, setAcceptData] = useState({
    reelerAuctionId: "",
  });

  // const postData = (e) => {

  //   axios
  //     .post(baseURL1 + `auction/reeler/acceptReelerBidForGivenLot`, acceptData, {
  //       headers: _header,
  //     })
  //     .then((response) => {
  //       setData(response.data.content);
  //       acceptSuccess();
  //     })
  //     .catch((err) => {
  //       setAcceptData({});
  //       acceptError();
  //     });
  // };

  const postData = (e) => {
    // Check if reelerAuctionId is not empty or undefined
    if (farmerAuction && farmerAuction.reelerAuctionId) {
      setAcceptData({
        ...acceptData,
        reelerAuctionId: farmerAuction.reelerAuctionId,
      });
      api
        .post(baseURL1 + `auction/reeler/acceptReelerBidForGivenLot`, {
          ...highestBid,
          bidAcceptedBy: localStorage.getItem("username"),
        })
        .then((response) => {
          // setData(response.data.content);
          if (response.data.errorCode === 0) {
            // debugger
            acceptSuccess();
            setShowAccept(false);
          } else if (response.data.errorCode === -1) {
            acceptError(response.data.errorMessages[0].message);
          }
        })
        .catch((err) => {
          // setAcceptData({});
          acceptError();
        });
    } else {
      // Handle the case where reelerAuctionId is empty or undefined
      console.error("reelerAuctionId is empty or undefined");
    }
  };

  // to get Bid Rejection
  const [bidRejectionListData, setBidRejectionListData] = useState([]);

  const getBidRejectionList = () => {
    const response = api
      .get(baseURL + `reason-bid-reject-master/get-all`)
      .then((response) => {
        setBidRejectionListData(response.data.content.reasonBidRejectMaster);
      })
      .catch((err) => {
        setBidRejectionListData([]);
      });
  };

  useEffect(() => {
    getBidRejectionList();
  }, []);

  // to get Market
  //  const [marketListData, setMarketListData] = useState([]);

  //  const getMarketList = () => {
  //     const response = api
  //      .get(baseURL + `marketMaster/get-all`)
  //      .then((response) => {
  //        setMarketListData(response.data.content.marketMaster);
  //      })
  //      .catch((err) => {
  //        setMarketListData([]);
  //      });
  //  };

  //  useEffect(() => {
  //    getMarketList();
  //  }, []);

  // to get Godown
  // const [godownListData, setGodownListData] = useState([]);
  // const getGodownList = (_id) => {
  //   api
  //     .get(baseURL + `godown/get-by-market-master-id/${_id}`)
  //     .then((response) => {
  //       setGodownListData(response.data.content.godown);
  //       // setTotalRows(response.data.content.totalItems);
  //       if (response.data.content.error) {
  //         setGodownListData([]);
  //       }
  //     })
  //     .catch((err) => {
  //       setGodownListData([]);
  //       // alert(err.response.data.errorMessages[0].message[0].message);
  //     });
  // };

  // useEffect(() => {
  //   if (highestBid.marketId) {
  //     getGodownList(highestBid.marketId);
  //   }
  // }, [highestBid.marketId]);

  return (
    <Layout title={t("Accept Farmer Auction")} show="true">
      <style>{acceptFarmerAuctionStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("Accept Farmer Auction")}</Block.Title>
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
        </div>
      </Block.Head>

      <Block className="mt-n5 sh-form-wrap">
        {/* <Form action="#"> */}
        <Row className="g-3 ">
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="8">
                  <Form noValidate validated={validated} onSubmit={display}>
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        {t("Lot ID")}<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={4}>
                        <Form.Control
                          id="allotedLotId"
                          name="allottedLotId"
                          value={highestBid.allottedLotId}
                          onChange={handleLotIdInputs}
                          type="number"
                          placeholder={t("Enter Lot ID")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Lot ID is required.")}
                        </Form.Control.Feedback>
                      </Col>
                      {/* <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        Godown<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Select
                          name="godownId"
                          value={highestBid.godownId}
                          onChange={handleLotIdInputs}
                          onBlur={handleLotIdInputs}
                          required
                          isInvalid={!highestBid.godownId}
                        >
                          <option value="">Select Godown</option>
                          {godownListData.map((list) => (
                            <option key={list.godownId} value={list.godownId}>
                              {list.godownName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Godown is required
                        </Form.Control.Feedback>
                      </Col> */}
                      <Col sm={2}>
                        {/* <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        > */}
                        <Button type="submit" variant="primary" className="sh-save-btn">
                          <Icon name="search" />
                          {t("Get Details")}
                        </Button>
                      </Col>
                    </Form.Group>
                  </Form>
                </Col>
                {/* added New End */}
              </Row>
            </Card.Body>
          </Card>

          <div className={isActive ? "" : "d-none"}>
            <Row className="g-gs pt-2">
              <Col lg="12">
                <table
                  className="table table-striped table-bordered sh-plain-table"
                  style={{ backgroundColor: "white" }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)",
                          color: "#fff",
                        }}
                        colSpan="2"
                      >
                        {t("Farmer Details")}
                      </th>
                      <th
                        style={{
                          background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)",
                          color: "#fff",
                        }}
                        colSpan="2"
                      >
                        {t("Reeler Details")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span style={{ fontWeight: "bold" }}>
                          {t("Farmer Number")}:
                        </span>
                        <span className="ms-1">
                          {farmerAuction.farmerNumber
                            ? farmerAuction.farmerNumber
                            : "---"}
                        </span>
                      </td>
                      <td style={{ backgroundColor: "#fff" }}>
                        <span style={{ fontWeight: "bold" }}>{t("Farmer Name")}:</span>
                        <span className="ms-1">
                          {farmerAuction.farmerFirstName
                            ? farmerAuction.farmerFirstName
                            : "---"}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: "bold" }}>
                          {t("Reeler Fruits Id")}:
                        </span>
                        <span className="ms-1">
                          {farmerAuction.reelerFruitsId
                            ? farmerAuction.reelerFruitsId
                            : "---"}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: "bold" }}>{t("Reeler Name")}:</span>
                        <span className="ms-1">
                          {farmerAuction.reelerName
                            ? farmerAuction.reelerName
                            : "---"}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ backgroundColor: "#f7f7f7" }}>
                        <span style={{ fontWeight: "bold" }}>
                          {t("Farmer Middle Name")}:
                        </span>
                        <span className="ms-1">
                          {farmerAuction.farmerMiddleName
                            ? farmerAuction.farmerMiddleName
                            : "---"}
                        </span>
                      </td>
                      <td style={{ backgroundColor: "#f7f7f7" }}>
                        <span style={{ fontWeight: "bold" }}>{t("Amount")}:</span>
                        <span className="ms-1">
                          {farmerAuction.amount ? farmerAuction.amount : "---"}
                        </span>
                      </td>

                      <td style={{ backgroundColor: "#f7f7f7" }}>
                        {" "}
                        <span style={{ fontWeight: "bold" }}>
                          {t("Reeler License Number")}:
                        </span>
                        <span
                          style={{ color: "green", fontWeight: "bold" }}
                          className="ms-1"
                        >
                          {farmerAuction.reelingLicenseNumber
                            ? farmerAuction.reelingLicenseNumber
                            : "---"}
                        </span>
                      </td>
                      <td style={{ backgroundColor: "#f7f7f7" }}>
                        {" "}
                        <span style={{ fontWeight: "bold" }}>
                          {t("Reeler Auction Id")}:
                        </span>
                        <span
                          style={{ color: "green", fontWeight: "bold" }}
                          className="ms-1"
                        >
                          {farmerAuction.reelerAuctionId
                            ? farmerAuction.reelerAuctionId
                            : "---"}
                        </span>
                      </td>
                    </tr>

                    <tr className="text-center">
                      <td colSpan="4">
                        {" "}
                        {/* Adjust the colSpan according to your table structure */}
                        <div className="gap-col">
                          <ul className="d-flex align-items-center justify-content-center gap g-3">
                            <li>
                              <div className={showAccept ? "" : "d-none"}>
                                <Button
                                  type="button"
                                  variant="primary"
                                  className="sh-save-btn"
                                  onClick={postData}
                                  // disabled={disable}
                                >
                                  {t("Accept")}
                                </Button>
                              </div>
                              <div className={showAccept ? "d-none" : ""}>
                                <span style={{ fontWeight: "bold" }}>
                                  {t("Already accepted by")}{" "}
                                </span>
                                <span
                                  style={{ fontWeight: "bold", color: "green" }}
                                >
                                  {farmerAuction.bidAcceptedBy}
                                </span>
                                <span style={{ fontWeight: "bold" }}>
                                  {" "}
                                  {t("on behalf of Farmer")}{" "}
                                </span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </div>
        </Row>
        {/* </Form> */}
      </Block>
    </Layout>
  );
}

export default AcceptFarmerAuction;
