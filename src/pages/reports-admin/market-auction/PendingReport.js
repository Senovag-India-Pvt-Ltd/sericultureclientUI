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

function PendingReport() {
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: 0,
    reportFromDate: new Date(),
  });
  console.log("printBid", data);

  const [validated, setValidated] = useState(false);

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

  const generatePendingReport = async () => {
    const { reportFromDate } = data;
    const formattedPendingDate =
      reportFromDate.getFullYear() +
      "-" +
      (reportFromDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      reportFromDate.getDate().toString().padStart(2, "0");

    try {
      const response = await api.post(
        baseURLReport + `get-pending-report`,
        {
          marketId: data.marketId,
          godownId: data.godownId,
          reportFromDate: formattedPendingDate,
          lotId: 0,
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
      // event.stopPropagation();
      api
        .post(baseURLMarket + `auction/report/getPendingLotReport`, {
          marketId: marketId,
          godownId: godownId,
          reportFromDate: formattedDate,
        })
        .then((response) => {
          if (response.data.errorCode === 0) {
            if (response.data.content && response.data.content.length > 0) {
              setPendingData(response.data.content);
            } else {
              setPendingData([]);
              Swal.fire({
                icon: "warning",
                // title: "Not Found",
                text: "No Record Found",
              });
            }
          } else if (response.data.errorCode === -1) {
            saveError(response.data.errorMessages[0].message[0].message);
          }
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
    <Layout title="Pending Report">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Pending Report</Block.Title>
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
                  <Col lg="">
                    <Form.Group as={Row} className="form-group">
                      {/* <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        Lot ID<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Control
                          id="allotedLotId"
                          name="allottedLotId"
                          value={data.allottedLotId}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Lot ID"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Lot ID is required.
                        </Form.Control.Feedback>
                      </Col> */}
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
                        {/* <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        > */}
                        <Button type="submit" variant="primary">
                          Generate Report
                        </Button>
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

            {pendingData && pendingData.length ? (
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
                      onClick={generatePendingReport}
                    >
                      Print
                    </Button>
                  </Col>
                </Row>
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
                            SL No
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
                          {/* <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Bin No
                          </th> */}
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Shed
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Farmer ID
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Name
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Village
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Phone
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Accepted User
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Reeler ID
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Reeler Ph
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingData.map((list, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{list.allottedLotId}</td>
                            {/* <td>---</td> */}
                            <td>{list.shed ? list.shed : "---"}</td>
                            <td>{list.farmerNumber}</td>
                            <td>{list.farmerFirstName}</td>
                            <td>{list.farmerVillage}</td>
                            <td>{list.farmerMobileNumber}</td>
                            <td>{list.acceptedBy ? list.acceptedBy : "---"}</td>
                            <td>{list.reelerLicense}</td>
                            <td>{list.reelerMobileNumber}</td>
                            <td>{list.reelerCurrentBalance}</td>
                          </tr>
                        ))}
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

export default PendingReport;
