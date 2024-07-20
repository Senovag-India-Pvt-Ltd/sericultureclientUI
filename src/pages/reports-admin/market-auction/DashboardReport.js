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

function DashboardReport() {
  const styles = {
    ctstyle: {
      fontWeight: "bold",
      backgroundColor: "#a9a9d6",
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
    color:{
      backgroundColor:"#d1cfcf"
    }
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

  const generateDashboardReport = async () => {
    const { reportFromDate } = data;
    const formattedPendingDate =
      reportFromDate.getFullYear() +
      "-" +
      (reportFromDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      reportFromDate.getDate().toString().padStart(2, "0");

    api
      .post(baseURLMarket + `auction/report/getDashboardReport`, {
        marketId: data.marketId,
        dashboardReportDate: formattedPendingDate,
      })
      .then((response) => {
        if (response.data.errorCode === 0) {
          setDashboardList(response.data.content.dashboardReportInfoList);
          setStatus({
            auctionStarted: response.data.content.auctionStarted,
            acceptanceStarted: response.data.content.acceptanceStarted,
            marketName: response.data.content.marketName,
          });
        } else {
          // saveSuccess(arnNumber);
        }
      })
      .catch((err) => {
        // setVbAccount({});
        if (err.response.data) {
          console.log(err.response.data);
          saveError(err.response.data.errorMessages[0].message[0].message);
          setDashboardList([]);
        }
        // if (
        //   Object.keys(err.response.data.validationErrors).length > 0
        // ) {
        //   saveError(err.response.data.validationErrors);
        // }
      });
  };

  useEffect(() => {
    generateDashboardReport(new Date());
  }, []);

  const [pendingData, setPendingData] = useState([]);

  const postData = (event) => {
    const { marketId, godownId, reportFromDate } = data;
    const newDate = reportFromDate;
    const formattedDate =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      newDate.getDate().toString().padStart(2, "0");

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      generateDashboardReport();
      // event.stopPropagation();
      //   api
      //     .post(baseURLMarket + `auction/report/getPendingLotReport`, {
      //       marketId: marketId,
      //       godownId: godownId,
      //       reportFromDate: formattedDate,
      //     })
      //     .then((response) => {
      //       if (response.data.errorCode === 0) {
      //         if (response.data.content && response.data.content.length > 0) {
      //           setPendingData(response.data.content);
      //         } else {
      //           setPendingData([]);
      //           Swal.fire({
      //             icon: "warning",
      //             // title: "Not Found",
      //             text: "No Record Found",
      //           });
      //         }
      //       } else if (response.data.errorCode === -1) {
      //         saveError(response.data.errorMessages[0].message[0].message);
      //       }
      //     })
      //     .catch((error) => {
      //       if (error.response.data && !error.response.data.content) {
      //         Swal.fire({
      //           icon: "error",
      //           // title: "Not Found",
      //           text: error.response.data.errorMessages[0].message[0].message,
      //         });
      //         setPendingData([]);
      //       }
      //       // console.log("error", error);
      //     });
    }
  };

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
    <Layout title="Dashboard Report">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Dashboard Report</Block.Title>
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

      <Block className="mt-n5">
        {/* <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                <Row className="g-gs">
                  <Col lg="">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={1}>
                        Date
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.reportFromDate}
                            onChange={handleDateChange}
                            className="form-control"
                            maxDate={new Date()}
                          />
                        </div>
                      </Col>
                      <Col sm={2}>
                        <Button type="submit" variant="primary">
                          Generate Report
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
        </Form> */}
        <Row className="d-flex justify-content-center">
          <Col sm={12} lg={6}>
            {dashboardList && dashboardList.length ? (
              <Card className="mt-2">
                <Card.Header style={{fontSize:"1.3rem"}}>
                  Dashboard - {status.marketName} : {formattedDateTime}
                </Card.Header>
                <Card.Body style={styles.color} >
                  <Row className="g-gs d-flex justify-content-center">
                    <Col lg="12">
                      <div className="d-flex mt-n2">
                        <h4 className="text-centre" style={{fontSize:"1.3rem"}}>Bidding Status: </h4>
                        <h4 
                        // style={{ fontWeight: "bold" }}
                        style={{fontSize:"1.3rem"}}
                        >
                          {" "}
                          {status.auctionStarted ? (
                            <span style={styles.green}> Start </span>
                          ) : (
                            <span style={styles.red}> Stop </span>
                          )}
                        </h4>
                      </div>
                      <div className="d-flex">
                        <h4 className="text-centre" style={{fontSize:"1.3rem"}}>Acceptance Status:</h4>
                        <h4 
                        // style={styles.boldFont}
                        style={{fontSize:"1.3rem"}}
                        >
                          {" "}
                          {status.acceptanceStarted ? (
                            <span style={styles.green}> Start </span>
                          ) : (
                            <span style={styles.red}> Stop </span>
                          )}
                        </h4>
                      </div>
                      <table className="table small table-bordered border border-dark">
                        {/* <tr>
                        <th>Heading 1</th>
                      </tr>
                      <tr>
                        <th>Heading 1</th>
                      </tr>
                      <tr>
                        <th>Heading 1</th>
                      </tr> */}
                        <tbody>
                          {/* <td style={styles.ctstyle}> Bidding Status:</td> */}
                          {/* <h2 className="text-centre">
                          Bidding Status:
                          {status.auctionStarted ? "Start" : "Stop"}
                        </h2>
                        <h2 className="text-centre">
                          Acceptance Status:
                          {status.acceptanceStarted ? "Start" : "Stop"}
                        </h2> */}

                          <tr>
                            <td style={styles.ctstyle}> Total Lots:</td>
                            {/* <td>CSR-70</td>
                          <td>CB-48</td> */}
                            {dashboardList.map((dashboard) => (
                              <>
                                <td style={styles.ctstyle}>
                                  {dashboard.raceName}-{dashboard.totalLots}
                                </td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Total Lots Bid:</td>
                            {/* <td>118</td>
                          <td></td> */}
                            {dashboardList.map((dashboard) => (
                              <>
                                <td style={styles.ctstyle}>{dashboard.totalLotsBid}</td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Total Lots Not Bid:</td>
                            {/* <td>0</td>
                          <td></td> */}
                            {dashboardList.map((dashboard) => (
                              <>
                                <td style={styles.ctstyle}>{dashboard.totalLotsNotBid}</td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Total Bids:</td>
                            {/* <td>1897</td>
                          <td>36</td> */}
                            {dashboardList.map((dashboard) => (
                              <>
                                <td style={styles.ctstyle}>{dashboard.totalBids}</td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>Total Reelers:</td>
                            {/* <td>107(Active)</td>
                          <td>253(Paid)</td> */}
                            {dashboardList.map((dashboard) => (
                              <>
                                <td style={styles.ctstyle}>{dashboard.totalReelers}</td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>
                              {" "}
                              Current Auction-Max Bid:
                            </td>
                            {/* <td>540</td>
                          <td></td> */}
                            {dashboardList.map((dashboard) => (
                              <>
                                <td style={styles.ctstyle}>{dashboard.currentAuctionMaxBid}</td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Accepted Lots:</td>
                            {/* <td>105</td>
                          <td>12:32:47</td> */}
                            {dashboardList.map((dashboard) => (
                              <>
                                <td style={styles.ctstyle}>{dashboard.accecptedLots}</td>
                              </>
                            ))}
                          </tr>
                          {/* <tr>
                          <td style={styles.ctstyle}> Online Lots:</td>
                         
                          {dashboardList.map((dashboard) => (
                            <>
                              <td>{dashboard.accecptedLotsMaxBid}</td>
                            </>
                          ))}
                        </tr> */}
                          <tr>
                            <td style={styles.ctstyle}>
                              {" "}
                              Accepted Lots-Max Bid:
                            </td>
                            {/* <td>557.000</td>
                          <td></td> */}
                            {dashboardList.map((dashboard) => (
                              <>
                                <td style={styles.ctstyle}>{dashboard.accecptedLotsMaxBid}</td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>
                              {" "}
                              Accepted Lots-Min Bid:
                            </td>
                            {/* <td>290.000</td>
                          <td></td> */}
                            {dashboardList.map((dashboard) => (
                              <>
                                <td style={styles.ctstyle}>{dashboard.accectedLotsMinBid}</td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Average Rate:</td>
                            {/* <td>0</td>
                          <td></td> */}
                            {dashboardList.map((dashboard) => (
                              <>
                                <td style={styles.ctstyle}>{dashboard.averagRate}</td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}> Weighed Lots:</td>
                            {/* <td>0</td>
                          <td></td> */}
                            {dashboardList.map((dashboard) => (
                              <>
                                <td style={styles.ctstyle}>{dashboard.weighedLots}</td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            <td style={styles.ctstyle}>
                              {" "}
                              Total Soldout Amount:
                            </td>
                            {/* <td>0</td>
                          <td></td> */}
                            {dashboardList.map((dashboard) => (
                              <>
                                <td style={styles.ctstyle}>{dashboard.totalSoldOutAmount}</td>
                              </>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Block>
    </Layout>
  );
}

export default DashboardReport;
