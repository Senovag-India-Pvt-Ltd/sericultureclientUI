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
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

const gatepassStyles = `
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
  .sh-form-wrap .form-label { font-size: 13px; font-weight: 600; color: #4a5568; margin-bottom: 6px; letter-spacing: 0.2px; }
  .sh-form-wrap .form-control, .sh-form-wrap .form-select {
    border-radius: 10px !important; border: 1.5px solid #d8e0ec !important; background-color: #fbfcfe !important;
    padding: 0.62rem 0.9rem !important; font-size: 13.5px; color: #2b3a55;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .sh-form-wrap .form-control:focus, .sh-form-wrap .form-select:focus {
    border-color: #2b7ac0 !important; background-color: #ffffff !important; box-shadow: 0 0 0 3px rgba(30, 103, 168, 0.14) !important; outline: none;
  }
  .sh-form-wrap .form-control.is-invalid { border-color: #e3496a !important; box-shadow: 0 0 0 3px rgba(227, 73, 106, 0.12) !important; }
  .sh-form-wrap .btn-primary { border-radius: 8px; font-weight: 600; letter-spacing: 0.3px; transition: transform 0.15s ease, box-shadow 0.15s ease; }
  .sh-form-wrap .btn-primary:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(30, 103, 168, 0.25); }
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

function Gatepass() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      title: "Gatepass not generated!",
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
    auctionDate: new Date(),
  });
  const [showAccept, setShowAccept] = useState(false);

  // console.log(highestBid);
  console.log(showAccept);

  const [isActive, setIsActive] = useState(false);
  const display = (event) => {
    const formattedDate =
      highestBid.auctionDate.getFullYear() +
      "-" +
      (highestBid.auctionDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      highestBid.auctionDate.getDate().toString().padStart(2, "0");
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
        .post(baseURL1 + `auction/print/getPrintableDataForLot`, {
          allottedLotId: highestBid.allottedLotId,
          marketId: highestBid.marketId,
          godownId: highestBid.godownId,
          auctionDate: formattedDate,
        })

        .then((response) => {
          if (response.data.errorCode === 0) {
            console.log(response.data.content);
            // setIsActive(true);
            // console.log("hello",response.data.content.status.length);
            // debugger;
            if (response.data.content) {
              if (response.data.content.reelerCurrentBalance < 0) {
                acceptError("Reeler does not have sufficient balance");
              } else {
                generateGatePassSlip(highestBid.allottedLotId);
              }
            }
            setLoading(false);
          } else if (response.data.errorCode === -1) {
            acceptError(response.data.errorMessages[0]);
            setIsActive(false);
          }
        })
        .catch((err) => {
          // setFarmerAuction({});
          acceptError(err.response.data.validationErrors);
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

  //   const postData = (e) => {
  //     // Check if reelerAuctionId is not empty or undefined
  //     if (farmerAuction && farmerAuction.reelerAuctionId) {
  //       setAcceptData({
  //         ...acceptData,
  //         reelerAuctionId: farmerAuction.reelerAuctionId,
  //       });
  //       api
  //         .post(baseURL1 + `auction/reeler/acceptReelerBidForGivenLot`, {
  //           ...highestBid,
  //           bidAcceptedBy: localStorage.getItem("username"),
  //         })
  //         .then((response) => {
  //           // setData(response.data.content);
  //           if (response.data.errorCode === 0) {
  //             // debugger
  //             acceptSuccess();
  //             setShowAccept(false);
  //           } else if (response.data.errorCode === -1) {
  //             acceptError(response.data.errorMessages[0].message);
  //           }
  //         })
  //         .catch((err) => {
  //           debugger;
  //           // setAcceptData({});
  //           acceptError();
  //         });
  //     } else {
  //       // Handle the case where reelerAuctionId is empty or undefined
  //       console.error("reelerAuctionId is empty or undefined");
  //     }
  //   };

  const generateGatePassSlip = async (allotedLotId) => {
    const newDate = new Date();
    const formattedDate =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      newDate.getDate().toString().padStart(2, "0");

    try {
      const response = await api.post(
        baseURLReport + `gatepass`,
        {
          marketId: highestBid.marketId,
          godownId: highestBid.godownId,
          allottedLotId: allotedLotId,
          auctionDate: formattedDate,
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      // console.log("error", error);
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

  return (
    <Layout title={t("Gatepass")} show="true">
      <style>{gatepassStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("Gatepass")}</Block.Title>
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
                          type="text"
                          placeholder={t("Enter Lot ID")}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {t("Lot ID is required.")}
                        </Form.Control.Feedback>
                      </Col>

                      <Col sm={2}>
                        {/* <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        > */}
                        <Button type="submit" variant="primary">
                          {t("Generate Pass")}
                        </Button>
                      </Col>
                    </Form.Group>
                  </Form>
                </Col>
                {/* added New End */}
              </Row>
            </Card.Body>
          </Card>
        </Row>
        {/* </Form> */}
      </Block>
    </Layout>
  );
}

export default Gatepass;
