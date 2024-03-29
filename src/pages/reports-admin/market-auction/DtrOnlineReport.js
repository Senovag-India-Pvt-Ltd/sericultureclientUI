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

function DtrOnlineReport() {
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: localStorage.getItem("godownId"),
    reelerId: "",
    fromDate: "",
    toDate: "",
  });
  console.log("printBid", data);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleFromDateChange = (date) => {
    setData((prev) => ({ ...prev, fromDate: date }));
  };

  const handleToDateChange = (date) => {
    setData((prev) => ({ ...prev, toDate: date }));
  };

  useEffect(() => {
    handleFromDateChange(new Date());
    handleToDateChange(new Date());
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
  //         `https://api.senovagseri.com/reports/gettripletpdf`,
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
  const [listData, setListData] = useState([]);
  const [listDetails, setListDetails] = useState([]);

  const generateDtrReport = async () => {
    const { fromDate, toDate } = data;
    const formattedFromDate =
      fromDate.getFullYear() +
      "-" +
      (fromDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      fromDate.getDate().toString().padStart(2, "0");
    const formattedToDate =
      toDate.getFullYear() +
      "-" +
      (toDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      toDate.getDate().toString().padStart(2, "0");

    try {
      const response = await api.post(
        `https://api.senovagseri.com/reports-uat/marketreport/dtr-online-report`,
        {
          marketId: data.marketId,
          reelerId: data.reelerId,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
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

  const postData = (event) => {
    const { marketId, godownId, reelerId, fromDate, toDate } = data;
    const fDate = new Date(fromDate);
    const tDate = new Date(toDate);
    const formattedFromDate =
      fDate.getFullYear() +
      "-" +
      (fDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      fDate.getDate().toString().padStart(2, "0");

    const formattedToDate =
      tDate.getFullYear() +
      "-" +
      (tDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      tDate.getDate().toString().padStart(2, "0");

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURLMarket + `auction/report/getDTROnlineReport`, {
          marketId: marketId,
          // godownId: godownId,
          reelerId: reelerId,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
        })
        .then((response) => {
          //  console.log(response);
          if (response.data.content)
            setListData(response.data.content.dtrOnlineReportUnitDetailList);
          setListDetails(response.data.content);
        })
        .catch((error) => {
          // console.log("error", error);
        });
    }
  };

  // console.log(listData);

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
    <Layout title="DTR Online">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">DTR Online</Block.Title>
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
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        Reeler Number<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Control
                          id="reelerId"
                          name="reelerId"
                          value={data.reelerId}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Reeler Number"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Reeler Number is required.
                        </Form.Control.Feedback>
                      </Col>
                      <Form.Label column sm={1}>
                        From Date
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.fromDate}
                            onChange={handleFromDateChange}
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Form.Label column sm={1}>
                        To Date
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={2}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.toDate}
                            onChange={handleToDateChange}
                            className="form-control"
                          />
                        </div>
                      </Col>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="code">Code</Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="code"
                          name="code"
                          value={data.code}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Code"
                        />
                      </div>
                    </Form.Group>
                  </Col> */}
                </Row>
              </Card.Body>
            </Card>

            <Row className="d-flex justify-content-center mt-2">
              <Col sm={2}>
                {/* <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        > */}
                <Button type="submit" variant="primary">
                  Generate Report
                </Button>
              </Col>
            </Row>

            {/* <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </li>
                <li>
                  <Link to="/seriui/caste-list" className="btn btn-secondary border-0">
                    Cancel
                  </Link>
                </li>
              </ul>
            </div> */}

            {listData && listData.length ? (
              <div
              //  className={isActive ? "" : "d-none"}
              >
                <Row className="d-flex justify-content-end mt-2">
                  <Col sm={2}>
                    {/* <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        > */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      onClick={generateDtrReport}
                    >
                      Print
                    </Button>
                  </Col>
                </Row>
                <Row className="g-gs pt-2">
                  <Col lg="12">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            SL.No
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Lot No
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Farmer Details
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Wt
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Bid Amt
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Amt
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Farmer Amt
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            MF
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Reeler Amt
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Reeler
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Bank
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            IFSC
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Account No
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listData.map((list, i) => (
                          <tr key={i}>
                            <td>{list.serialNumber}</td>
                            <td>{list.allottedLotId}</td>
                            <td>{list.farmerFirstName}</td>
                            <td>{list.weight}</td>
                            <td>{list.bidAmount}</td>
                            <td>{list.lotSoldOutAmount}</td>
                            <td>{parseFloat(list.farmerAmount.toFixed(2))}</td>
                            <td>
                              {parseFloat(
                                (
                                  list.farmerMarketFee + list.reelerMarketFee
                                ).toFixed(2)
                              )}
                            </td>
                            <td>{parseFloat(list.reelerAmount.toFixed(2))}</td>
                            <td>{list.reelerName}</td>
                            <td>{list.bankName}</td>
                            <td>{list.ifscCode}</td>
                            <td>{list.accountNumber}</td>
                          </tr>
                        ))}
                        {
                          <tr>
                            <td
                              style={{
                                fontWeight: "bold",
                                background: "rgb(251 255 248)",
                              }}
                              colSpan="13"
                            >
                              <div>
                                Total Lots:{" "}
                                <span style={{ color: "green" }}>
                                  {listDetails.totalLots}
                                </span>
                              </div>
                              <div>
                                Farmers Cheque Amt:{" "}
                                <span style={{ color: "green" }}>
                                  {parseFloat(
                                    listDetails.totalFarmerAmount.toFixed(2)
                                  )}
                                </span>
                              </div>
                              <div>
                                MF Amount:{" "}
                                <span style={{ color: "green" }}>
                                  {parseFloat(
                                    (
                                      listDetails.totalReelerMarketFee +
                                      listDetails.totalFarmerMarketFee
                                    ).toFixed(2)
                                  )}
                                </span>
                              </div>
                              <div>
                                Reeler Transaction Amt:{" "}
                                <span style={{ color: "green" }}>
                                  {parseFloat(
                                    listDetails.totalReelerAmount.toFixed(2)
                                  )}
                                </span>
                              </div>
                            </td>
                          </tr>
                        }

                        {/* <tr className="text-center">
                        <td colSpan="4">
                          {" "}
                         
                          <div className="gap-col">
                            <ul className="d-flex align-items-center justify-content-center gap g-3">
                              <li>
                                <div className={showAccept ? "" : "d-none"}>
                                  <Button
                                    type="button"
                                    variant="primary"
                                    onClick={postData}
                                    disabled={disable}
                                  >
                                    Accept
                                  </Button>
                                </div>
                                <div className={showAccept ? "d-none" : ""}>
                                  <span style={{ fontWeight: "bold" }}>
                                    Already accepted by{" "}
                                  </span>
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      color: "green",
                                    }}
                                  >
                                    {farmerAuction.bidAcceptedBy}
                                  </span>
                                  <span style={{ fontWeight: "bold" }}>
                                    {" "}
                                    on behalf of Farmer{" "}
                                  </span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr> */}
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </div>
            ) : (
              ""
            )}
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default DtrOnlineReport;
