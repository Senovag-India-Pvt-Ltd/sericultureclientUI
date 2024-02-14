import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import React, { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { useParams } from "react-router-dom";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL1 = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function Gatepass() {
  const navigate = useNavigate();

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
    });
  };

  const acceptError = (message = "Something went wrong!") => {
    Swal.fire({
      icon: "error",
      title: "Gatepass not generated!",
      html: Object.values(message).join("<br>"),
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
                // alert("hello");
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
          acceptError(err.response.data.validationErrors)
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
    <Layout title="Gatepass">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Gatepass</Block.Title>
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
        {/* <Form action="#"> */}
        <Row className="g-3 ">
          <Card>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="8">
                  <Form noValidate validated={validated} onSubmit={display}>
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        Lot ID<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={4}>
                        <Form.Control
                          id="allotedLotId"
                          name="allottedLotId"
                          value={highestBid.allottedLotId}
                          onChange={handleLotIdInputs}
                          type="text"
                          placeholder="Enter Lot ID"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Lot ID is required.
                        </Form.Control.Feedback>
                      </Col>

                      <Col sm={2}>
                        {/* <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        > */}
                        <Button type="submit" variant="primary">
                          Generate Pass
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
