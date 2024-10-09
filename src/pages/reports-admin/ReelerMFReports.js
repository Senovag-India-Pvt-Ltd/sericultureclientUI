// import { Card, Form, Row, Col, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2/src/sweetalert2.js";
// import { useNavigate } from "react-router-dom";
// import Layout from "../../layout/default";
// import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
// import { Icon } from "../../../components";
// import { useState, useEffect } from "react";
// import axios from "axios";

// // import api from "../../../services/auth/api";
// import api from "../../../src/services/auth/api";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createTheme } from "react-data-table-component";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import React from "react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../src/services/auth/api";

const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURLFarmer = process.env.REACT_APP_API_BASE_URL_REGISTRATION;



function ReelerMFReports() {
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: localStorage.getItem("godownId"),
    // reportFromDate: new Date(),
    fromDate: "",
    toDate: "",
    reelerNumber: "",
  });
  console.log("printBid", data);

  const [validated, setValidated] = useState(false);
  const [realReelerId, setRealReelerId] = useState("");

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
  
  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };


  const [counterData, setCounterData] = useState([]);

  const postData = (event) => {
    const { marketId, godownId, reelerNumber, fromDate, toDate  } = data;
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
        .post(baseURLMarket + `auction/report/getReelerMFReport`, {
          marketId: marketId,
          godownId: godownId,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          reelerNumber:reelerNumber,
        })
        .then((response) => {
          if (response.data.errorCode === 0) {
            if (response.data.content && response.data.content.length) {
              setCounterData(response.data.content);
            }
          } else if (response.data.errorCode === -1) {
            saveError(response.data.errorMessages[0]);
          }
        })
        .catch((error) => {
          // console.log("error", error);
        });
    }
  };

 
  const exportCsv = (e) => {
    const { marketId,godownId ,fromDate, toDate, reelerNumber } = data;
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

    api
      .post(
        baseURLReport + `excel-report/reeler-mf-report`,
        {
            // startDate: data.startDate,
            godownId: godownId,
            fromDate: formattedFromDate,
            toDate: formattedToDate,
            marketId: marketId,
            reelerNumber: reelerNumber,

          },
          {
          responseType: 'blob',
          headers: {
            accept: "application/csv",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `unit_counter_report.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title: "No record found!!!",
        });
      });
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
    <Layout title="Reeler MF Report">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Reeler MF Report</Block.Title>
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
                      
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>Reeler Number</Form.Label>
                      <Col sm={2}>
                        <Form.Control
                          id="reelerNumber"
                          name="reelerNumber"
                          value={data.reelerNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Reeler Number"
                          // required
                        />
                        {/* <Form.Control.Feedback type="invalid">
                          Reeler Number is required.
                        </Form.Control.Feedback> */}
                      </Col>
                      <Form.Label column sm={1}>From Date<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={1}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.fromDate}
                            onChange={handleFromDateChange}
                            className="form-control"
                            maxDate={new Date()}
                          />
                        </div>
                      </Col>
                      <Form.Label column sm={1}>To Date<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={1}>
                        <div className="form-control-wrap">
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={data.toDate}
                            onChange={handleToDateChange}
                            className="form-control"
                            maxDate={new Date()}
                          />
                        </div>
                      </Col>
                      <Col sm={1}>
                        {/* <Button
                          type="button"
                          variant="primary"
                          onClick={display}
                        > */}
                        <Button type="submit" variant="primary">
                          Generate Report
                        </Button>
                      </Col>
                      <Col sm={1}>   
                        <Button type="button" variant="primary" onClick={exportCsv}>
                        Export
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

            {counterData && counterData.length ? (
              <div
              //  className={isActive ? "" : "d-none"}
              >
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
                           Serial Number
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
                            Date
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Reeler Id
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                          Reeler Name
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
                            Weight
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            Amount
                          </th>
                          <th
                            style={{
                              backgroundColor: "#0f6cbe",
                              color: "#fff",
                            }}
                            // colSpan="2"
                          >
                            MF Amt
                          </th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {counterData.map((list, i) => (
                          <tr key={i}>
                            <td>{list.serialNumber}</td>
                            <td>{list.allottedLotId}</td>
                            <td>{list.lotTransactionDate}</td>
                            <td>{list.reelerLicense}</td>
                            <td>{list.reelerName}</td>
                            <td>{list.bidAmount}</td>
                            <td>{list.weight}</td>
                            <td>{list.lotSoldOutAmount}</td>
                            <td>
                              {parseFloat(
                                (
                                  list.farmerMarketFee + list.reelerMarketFee
                                ).toFixed(2)
                              )}
                            </td>
                            {/* <td>---</td> */}
                          </tr>
                        ))}
                        {/* {
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
                        } */}

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

export default ReelerMFReports;
