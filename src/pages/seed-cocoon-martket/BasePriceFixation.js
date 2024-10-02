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

function BasePriceFixation() {
  const navigate = useNavigate();

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
    marketDate: new Date(),
    price: "",
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const acceptSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Accepted successfully",
      text: "Auction Accepted Successfully",
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
    const formattedDate =
      data.marketDate.getDate() +
      "/" +
      (data.marketDate.getMonth() + 1) +
      "/" +
      data.marketDate.getFullYear();
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
      setIsActive(true);
      setHardCodeDataList([
        { date: formattedDate, price: data.price },
        ...hardCodeDataList,
      ]);
      Swal.fire({
        icon: "success",
        title: "Price Added successfully",
        // text: "Auction Accepted Successfully",
      });
    }
  };

  const handleLotIdInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const [res, setRes] = useState({});

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const [acceptData, setAcceptData] = useState({
    reelerAuctionId: "",
  });

  const [hardCodeDataList, setHardCodeDataList] = useState([
    {
      date: "01/01/2023",
      price: "230",
    },
    {
      date: "01/02/2023",
      price: "430",
    },
    {
      date: "01/01/2024",
      price: "530",
    },
  ]);

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
    <Layout title="Base Price Fixation" show="true">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Base Price Fixation</Block.Title>
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
                        Price<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <Form.Control
                          id="price"
                          name="price"
                          value={data.price}
                          onChange={handleLotIdInputs}
                          type="number"
                          placeholder="Enter Price"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Price is required.
                        </Form.Control.Feedback>
                      </Col>
                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        Market Date<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={4} className="ms-n5">
                        <DatePicker
                          selected={data.marketDate}
                          onChange={(date) =>
                            handleDateChange(date, "marketDate")
                          }
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          maxDate={new Date()}
                          //   minDate={new Date()}
                        />
                      </Col>
                      <Col sm={2} className="ms-n5">
                        {/* <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        > */}
                        <Button type="submit" variant="primary">
                          Submit
                        </Button>
                      </Col>
                    </Form.Group>
                  </Form>
                </Col>
                {/* added New End */}
              </Row>
            </Card.Body>
          </Card>

          <div
            className={isActive ? "d-flex justify-content-center" : "d-none"}
          >
            <Row className="g-gs pt-2" style={{ width: "80%" }}>
              <Col lg="6" style={{ width: "100%" }}>
                <table
                  className="table table-striped table-bordered"
                  style={{ backgroundColor: "white" }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "#0f6cbe",
                          color: "#fff",
                        }}
                        // colSpan="1"
                      >
                        S.No
                      </th>
                      <th
                        style={{
                          backgroundColor: "#0f6cbe",
                          color: "#fff",
                        }}
                        // colSpan="2"
                      >
                        Date
                      </th>
                      <th
                        style={{
                          backgroundColor: "#0f6cbe",
                          color: "#fff",
                        }}
                        // colSpan="2"
                      >
                        Price/Kg
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hardCodeDataList.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.date}</td>
                        <td>{item.price}</td>
                      </tr>
                    ))}
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

export default BasePriceFixation;
