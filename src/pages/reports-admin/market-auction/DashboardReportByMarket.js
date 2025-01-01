import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;

function DashboardReportByMarket() {
  const styles = {
    ctstyle: {
      fontWeight: "bold",
      // backgroundColor: "#dae992",
      backgroundColor: "none",
      color: "black",
    },
    red: {
      color: "red",
    },
    green: {
      color: "green",
    },
    boldFont: {
      fontWeight: "bold",
    },
    color: {
      backgroundColor: "#d1cfcf",
    },
    lh: {
      lineHeight: "0.6rem",
    },
  };
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: 0,
    reportFromDate: new Date(),
  });
  console.log("printBid", data);

  const [validated, setValidated] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date());
  const formattedDateTime = `${timestamp.getFullYear()}-${(
    timestamp.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${timestamp
    .getDate()
    .toString()
    .padStart(2, "0")} ${timestamp
    .getHours()
    .toString()
    .padStart(2, "0")}:${timestamp
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${timestamp.getSeconds().toString().padStart(2, "0")}`;
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (date) => {
    setData((prev) => ({ ...prev, reportFromDate: date }));
  };
  useEffect(() => {
    handleDateChange(new Date());
  }, []);
  // const _header = { "Content-Type": "application/json", accept: "*/*" };
  // const _header = { "Content-Type": "application/json", accept: "*/*",  'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`, "Access-Control-Allow-Origin": "*"};
  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

  // const postData = (e) => {
  //   axios
  //     .post(baseURL + `caste/add`, data, {
  //       headers: _header,
  //     })
  //     .then((response) => {
  //       saveSuccess();
  //     })
  //     .catch((err) => {
  //       setData({});
  //       saveError();
  //     });
  // };

  // const postData = (event) => {
  //   const { marketId, godownId, allottedLotId, auctionDate } = data;
  //   const newDate = new Date(auctionDate);
  //   const formattedDate =
  //     newDate.getFullYear() +
  //     "-" +
  //     (newDate.getMonth() + 1).toString().padStart(2, "0") +
  //     "-" +
  //     newDate.getDate().toString().padStart(2, "0");

  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     setValidated(true);
  //   } else {
  //     event.preventDefault();
  //     // event.stopPropagation();
  //     axios
  //       .post(
  //         `https://api.senovagseri.com/reports/marketreport/gettripletpdf`,
  //         {
  //           marketId: marketId,
  //           godownId: godownId,
  //           allottedLotId: allottedLotId,
  //           auctionDate: formattedDate,
  //         },
  //         {
  //           responseType: "blob", //Force to receive data in a Blob Format
  //         }
  //       )
  //       .then((response) => {
  //         //console.log("hello world", response.data);
  //         //Create a Blob from the PDF Stream
  //         const file = new Blob([response.data], { type: "application/pdf" });
  //         //Build a URL from the file
  //         const fileURL = URL.createObjectURL(file);
  //         //Open the URL on new Window
  //         window.open(fileURL);
  //       })
  //       .catch((error) => {
  //         // console.log("error", error);
  //       });
  //   }
  // };

  // Commented code
  // const generateDashboardReport = async () => {
  //   const { reportFromDate } = data;
  //   const formattedPendingDate =
  //     reportFromDate.getFullYear() +
  //     "-" +
  //     (reportFromDate.getMonth() + 1).toString().padStart(2, "0") +
  //     "-" +
  //     reportFromDate.getDate().toString().padStart(2, "0");

  //   try {
  //     const response = await api.post(
  //       baseURLReport + `get-dashboard-report`,
  //       {
  //         marketId: data.marketId,
  //         //   godownId: data.godownId,
  //         dashboardReportDate: formattedPendingDate,
  //         //   lotId: 0,
  //       },
  //       {
  //         responseType: "blob", //Force to receive data in a Blob Format
  //       }
  //     );

  //     const file = new Blob([response.data], { type: "application/pdf" });
  //     const fileURL = URL.createObjectURL(file);
  //     window.open(fileURL);
  //   } catch (error) {
  //     // console.log("error", error);
  //   }
  // };

  const [dashboardList, setDashboardList] = useState([]);
  const [status, setStatus] = useState({
    auctionStarted: "",
    acceptanceStarted: "",
    marketName: "",
  });

  //   const generateDashboardReport = async () => {
  //     const { reportFromDate } = data;
  //     const formattedPendingDate =
  //       reportFromDate.getFullYear() +
  //       "-" +
  //       (reportFromDate.getMonth() + 1).toString().padStart(2, "0") +
  //       "-" +
  //       reportFromDate.getDate().toString().padStart(2, "0");

  //     api
  //       .post(baseURLMarket + `auction/report/getDashboardReport`, {
  //         marketId: data.marketId,
  //         dashboardReportDate: formattedPendingDate,
  //       })
  //       .then((response) => {
  //         if (response.data.content && response.data.errorCode === 0) {
  //           // debugger
  //           setDashboardList(response.data.content.dashboardReportInfoList);
  //           setStatus({
  //             auctionStarted: response.data.content.auctionStarted,
  //             acceptanceStarted: response.data.content.acceptanceStarted,
  //             marketName: response.data.content.marketName,
  //           });
  //         } else {
  //           // saveSuccess(arnNumber);
  //         }
  //       })
  //       .catch((err) => {
  //         // setVbAccount({});
  //         if (err.response.data) {
  //           console.log(err.response.data);
  //           saveError(err.response.data.errorMessages[0].message[0].message);
  //           setDashboardList([]);
  //         }
  //         // if (
  //         //   Object.keys(err.response.data.validationErrors).length > 0
  //         // ) {
  //         //   saveError(err.response.data.validationErrors);
  //         // }
  //       });
  //   };

  //   useEffect(() => {
  //     generateDashboardReport(new Date());
  //   }, []);

  const [pendingData, setPendingData] = useState([]);

  const [listData, setListData] = useState([]);
  const getData = (e) => {
    api
      .post(baseURLMarket + `auction/report/getDashboardReportAllMarket`, {})
      .then((response) => {
        setListData(response.data?.content);
      })
      .catch((error) => {
        if (error.response.data && !error.response.data.content) {
          Swal.fire({
            icon: "error",
            // title: "Not Found",
            text: error.response.data.errorMessages[0].message[0].message,
          });
          setPendingData([]);
        }
        // console.log("error", error);
      });
  };

  const [reelerDetails, setReelerDetails] = useState([]);
  const [totalAmountOfAllMarket, setTotalAmountOfAllMarket] = useState(0);
  console.log('hellototao',totalAmountOfAllMarket);
  const getReelerDepositDetails = (e) => {
    const today =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      new Date().getDate().toString().padStart(2, "0");
    api
      .post(baseURLMarket + `auction/reeler/getReelerCreditDetailsAllMarket`, {
        transactionDate: today,
        // transactionDate: "2024-08-21",
      })
      .then((response) => {
        setReelerDetails(response.data.content);
        setTotalAmountOfAllMarket(
          response.data.content[0]?.totalOfAllMarketDepositedAmount
        );
      })
      .catch((error) => {
        if (error.response.data && !error.response.data.content) {
          Swal.fire({
            icon: "error",
            // title: "Not Found",
            text: error.response.data.errorMessages[0].message[0].message,
          });
          setPendingData([]);
        }
        // console.log("error", error);
      });
  };

  useEffect(() => {
    const recall = () => {
      getData();
      getReelerDepositDetails();
    };
    const timeInterval = setInterval(recall, 30000);
    recall();

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    });
  };
  const saveError = (message = "Something went wrong!") => {
    Swal.fire({
      icon: "error",
      title: "Not Found",
      text: message,
    });
  };
  return (
    <Layout title="All Market Dashboard">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">All Market Dashboard</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
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
            </ul> */}
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n2">
        <Row className="d-flex justify-content-center">
          <Col sm={12} lg={8} style={styles.lh}>
            <Card className="mt-5">
              <Card.Header
                style={{ fontSize: "1.3rem", fontWeight: "bold" }}
                className="d-flex justify-content-center"
              >
                Govt of Karnataka, Department of Sericulture LIVE Market
                Transaction for {new Date().toLocaleDateString("en-GB")}
              </Card.Header>
              <Card.Body>
                <Row className="g-gs pt-2">
                  <Col lg="12">
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
                            // colSpan="2"
                          >
                            Sl No
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
                            Market
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            No of Lots
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Accepted Lots
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Weighed Lots
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Total Weight
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Total Value
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Max Bid
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Min Bid
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Avg Bid
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listData.map((list, i) => {
                          const dashboardList =
                            list.content.dashboardReportInfoList;
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{new Date().toLocaleDateString("en-GB")}</td>
                              <td>{list.content.marketName}</td>
                              <td>
                                {dashboardList.length > 0 &&
                                  dashboardList[0].totalLots}
                              </td>
                              <td>
                                {dashboardList.length > 0 &&
                                  dashboardList[0].accecptedLots}
                              </td>
                              <td>
                                {dashboardList.length > 0 &&
                                  dashboardList[0].weighedLots}
                              </td>
                              <td>
                                {dashboardList.length > 0 &&
                                  dashboardList[0].totalWeight}
                              </td>
                              <td>
                                {dashboardList.length > 0 &&
                                  dashboardList[0].totalSoldOutAmount}
                              </td>
                              <td>
                                {dashboardList.length > 0 &&
                                  dashboardList[0].accecptedLotsMaxBid}
                              </td>
                              <td>
                                {dashboardList.length > 0 &&
                                  dashboardList[0].accectedLotsMinBid}
                              </td>
                              <td>
                                {dashboardList.length > 0 &&
                                  dashboardList[0].averagRate}
                              </td>
                            </tr>
                          );
                        })}
                        {/* <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>ತೂಕ: {listDetails.totalWeight}</td>
                  <td></td>
                  <td></td>
                  <td>
                    ಮೊತ್ತ: {Math.round(listDetails.totallotSoldOutAmount)}
                  </td>
                  <td>
                    {" "}
                    ರೈತರ ಮೊತ್ತ: {Math.round(listDetails.totalFarmerAmount)}
                  </td>
                  <td>
                    ಮಾರುಕಟ್ಟೆ ಶುಲ್ಕ:{" "}
                    {Math.round(
                      listDetails.totalFarmerMarketFee +
                        listDetails.totalReelerMarketFee
                    )}
                  </td>
                  <td>
                    ಖರೀದಿದಾರರ ಮೊತ್ತ: {Math.round(listDetails.totalReelerAmount)}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr> */}
                        {/* {
                  <tr>
                    <td
                      style={{
                        fontWeight: "bold",
                        background: "rgb(251 255 248)",
                      }}
                      colSpan="18"
                    >
                      <div>
                        ಒಟ್ಟು ಲಾಟ್‌ಗಳು:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.totalLots}
                        </span>
                      </div>
                      <div>
                        ಒಟ್ಟು ವಹಿವಾಟಾಗಿರುವ ಲಾಟ್‌ಗಳು:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.paymentSuccessLots}
                        </span>
                      </div>
                      <div>
                        ವಹಿವಾಟಾಗದ ಲಾಟ್‌ಗಳು:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.notTransactedLots}
                        </span>
                      </div>
                      <div>
                        ಒಟ್ಟು ತೂಕ:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.totalWeight}
                        </span>
                      </div>
                      
                      <div>
                        ಒಟ್ಟು ಮೊತ್ತ:{" "}
                        <span style={{ color: "green" }}>
                          {Math.round(listDetails.totallotSoldOutAmount)}
                        </span>
                      </div>
                      <div>
                        ರೈತರ ಚೆಕ್ ಮೊತ್ತ:{" "}
                        <span style={{ color: "green" }}>
                          {Math.round(listDetails.totalFarmerAmount)}
                        </span>
                      </div>
                      <div>
                        ಮಾರುಕಟ್ಟೆ ಶುಲ್ಕ:{" "}
                        <span style={{ color: "green" }}>
                          {Math.round(
                            listDetails.totalReelerMarketFee +
                              listDetails.totalFarmerMarketFee
                          )}
                        </span>
                      </div>
                      <div>
                        ರೀಲರ್ ವ್ಯವಹಾರ ಮೊತ್ತ:{" "}
                        <span style={{ color: "green" }}>
                          {Math.round(listDetails.totalReelerAmount)}
                        </span>
                      </div>

                      <div>
                        ಗರಿಷ್ಠ ಮೊತ್ತ:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.maxAmount}
                        </span>
                      </div>
                      <div>
                        ಕನಿಷ್ಠ ಮೊತ್ತ:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.minAmount}
                        </span>
                      </div>
                      <div>
                        ಸರಾಸರಿ ಮೊತ್ತ:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.avgAmount}
                        </span>
                      </div>
                    </td>
                  </tr>
                } */}
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className="mt-5">
              <Card.Header
                style={{ fontSize: "1.3rem", fontWeight: "bold" }}
                className="d-flex justify-content-center"
              >
                Reeler Deposit for {new Date().toLocaleDateString("en-GB")}
              </Card.Header>
              <Card.Body>
                <Row className="g-gs pt-2">
                  <Col lg="12">
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
                            // colSpan="2"
                          >
                            Sl No
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Market
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Posting Date
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Deposit Count
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Deposited Amount
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Reelers Count
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {reelerDetails.map((list, i) => {
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{list.marketName}</td>
                              <td>
                                {new Date(list.postDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </td>
                              <td>{list.depositCount}</td>
                              <td>{list.totalDepositedAmount}</td>
                              <td>{list.totalReelersCount}</td>
                            </tr>
                          );
                        })}
                        {/* <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>ತೂಕ: {listDetails.totalWeight}</td>
                  <td></td>
                  <td></td>
                  <td>
                    ಮೊತ್ತ: {Math.round(listDetails.totallotSoldOutAmount)}
                  </td>
                  <td>
                    {" "}
                    ರೈತರ ಮೊತ್ತ: {Math.round(listDetails.totalFarmerAmount)}
                  </td>
                  <td>
                    ಮಾರುಕಟ್ಟೆ ಶುಲ್ಕ:{" "}
                    {Math.round(
                      listDetails.totalFarmerMarketFee +
                        listDetails.totalReelerMarketFee
                    )}
                  </td>
                  <td>
                    ಖರೀದಿದಾರರ ಮೊತ್ತ: {Math.round(listDetails.totalReelerAmount)}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr> */}
                        {/* {
                  <tr>
                    <td
                      style={{
                        fontWeight: "bold",
                        background: "rgb(251 255 248)",
                      }}
                      colSpan="18"
                    >
                      <div>
                        ಒಟ್ಟು ಲಾಟ್‌ಗಳು:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.totalLots}
                        </span>
                      </div>
                      <div>
                        ಒಟ್ಟು ವಹಿವಾಟಾಗಿರುವ ಲಾಟ್‌ಗಳು:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.paymentSuccessLots}
                        </span>
                      </div>
                      <div>
                        ವಹಿವಾಟಾಗದ ಲಾಟ್‌ಗಳು:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.notTransactedLots}
                        </span>
                      </div>
                      <div>
                        ಒಟ್ಟು ತೂಕ:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.totalWeight}
                        </span>
                      </div>
                      
                      <div>
                        ಒಟ್ಟು ಮೊತ್ತ:{" "}
                        <span style={{ color: "green" }}>
                          {Math.round(listDetails.totallotSoldOutAmount)}
                        </span>
                      </div>
                      <div>
                        ರೈತರ ಚೆಕ್ ಮೊತ್ತ:{" "}
                        <span style={{ color: "green" }}>
                          {Math.round(listDetails.totalFarmerAmount)}
                        </span>
                      </div>
                      <div>
                        ಮಾರುಕಟ್ಟೆ ಶುಲ್ಕ:{" "}
                        <span style={{ color: "green" }}>
                          {Math.round(
                            listDetails.totalReelerMarketFee +
                              listDetails.totalFarmerMarketFee
                          )}
                        </span>
                      </div>
                      <div>
                        ರೀಲರ್ ವ್ಯವಹಾರ ಮೊತ್ತ:{" "}
                        <span style={{ color: "green" }}>
                          {Math.round(listDetails.totalReelerAmount)}
                        </span>
                      </div>

                      <div>
                        ಗರಿಷ್ಠ ಮೊತ್ತ:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.maxAmount}
                        </span>
                      </div>
                      <div>
                        ಕನಿಷ್ಠ ಮೊತ್ತ:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.minAmount}
                        </span>
                      </div>
                      <div>
                        ಸರಾಸರಿ ಮೊತ್ತ:{" "}
                        <span style={{ color: "green" }}>
                          {listDetails.avgAmount}
                        </span>
                      </div>
                    </td>
                  </tr>
                } */}
                      </tbody>
                    </table>
                  </Col>
                  <Col lg="12" className="d-flex justify-content-center">
                    <div style={{ fontWeight: "bold",fontSize:"1.1rem" }}>
                      Total deposit by reelers at{" "}
                      {new Date().toLocaleDateString("en-GB")} is{" "}
                      <span style={{color:"green"}}>{totalAmountOfAllMarket?totalAmountOfAllMarket:0}</span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Block>
    </Layout>
  );
}

export default DashboardReportByMarket;
