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
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function ReelerPendingReport() {
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
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

  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

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

  const postData = () => {
    const { marketId } = data;
    // event.stopPropagation();
    api
      .post(
        baseURLReport + `get-reeler-pending-report`,
        {
          marketId: marketId,
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
        }
      )
      .then((response) => {
        console.log(response.data.size);
        if (response.data.size > 800) {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        } else {
          Swal.fire({
            icon: "warning",
            title: "No Record Found",
          });
        }
        //console.log("hello world", response.data);
      })
      .catch((error) => {
        // console.log("error", error);
      });
  };

  const [pendingData, setPendingData] = useState([]);
  const [amountData, setAmountData] = useState({
    reelerDebit: "",
    reelerCredit: "",
    reelerDepositToday: "",
    marketName: "",
  });
  const [show, setShow] = useState(false);

  const getData = (event) => {
    const { marketId } = data;

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURLMarket + `auction/report/getReelerPendingReport`, {
          marketId: marketId,
        })
        .then((response) => {
          //   console.log(response);
          if (response.data.content) {
            setShow(true);
            const result = response.data.content;
            setAmountData((prev) => ({
              ...prev,
              reelerDebit: result.debitTotal,
              reelerCredit: result.balance,
              reelerDepositToday: result.creditTotal,
              marketName: result.marketName,
            }));
            setPendingData(response.data.content.reelerPendingInfoList);
          } else {
            saveError();
          }

          //   setMarketListData(response.data.content.marketMaster);
        })
        .catch((err) => {
          if (err.response.data) {
            saveError(err.response.data.errorMessages[0].message[0].message);
            setPendingData([]);
            setShow(false);
          }
        });
    }
  };

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
  const saveError = (message = "Something went wrong!") => {
    Swal.fire({
      icon: "warning",
      title: "Not Found",
      text: message,
    });
  };
  return (
    <Layout title="Reeler Pending Report">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Reeler Pending Report</Block.Title>
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
        <Form noValidate validated={validated} onSubmit={getData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="12">
                    <Form.Group as={Row} className="form-group">
                      {/* <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                        Reeler Number<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm={3}>
                        <Form.Control
                          id="reelerNumber"
                          name="reelerNumber"
                          value={data.reelerNumber}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Reeler Number"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Reeler Number is required.
                        </Form.Control.Feedback>
                      </Col> */}
                      <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                        Market<span className="text-danger">*</span>
                      </Form.Label>
                      {/* <div className="form-control-wrap"> */}
                      <Col sm={3}>
                        <Form.Select
                          name="marketId"
                          value={data.marketId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.marketId === undefined || data.marketId === "0"
                          }
                        >
                          <option value="">Select Market</option>
                          {marketListData.map((list) => (
                            <option
                              key={list.marketMasterId}
                              value={list.marketMasterId}
                            >
                              {list.marketMasterName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Market Name is required
                        </Form.Control.Feedback>
                      </Col>
                      {/* </div> */}

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

            {show ? (
              <Block className="mt-3">
                <Card>
                  <Card.Header
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ fontWeight: "bold" }}
                  >
                    <span style={{ fontSize: "x-large" }}>
                      Government Cocoon Market, {amountData.marketName}
                    </span>
                    <span>
                      Reeler Balance Report{" "}
                      {new Date().getDate().toString().padStart(2, "0") +
                        "-" +
                        (new Date().getMonth() + 1)
                          .toString()
                          .padStart(2, "0") +
                        "-" +
                        new Date().getFullYear()}
                    </span>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-gs">
                      <Col lg="12">
                        <div className="mt-n3 d-flex justify-content-between">
                          <Form.Group as={Row} className="form-group">
                            <Form.Label
                              column
                              sm={12}
                              style={{ fontWeight: "bold" }}
                            >
                              Reeler Debited Balance:{" "}
                              <span style={{ color: "green" }}>
                                {" "}
                                &#8377; {amountData.reelerDebit}
                              </span>
                            </Form.Label>
                          </Form.Group>
                          <Button
                            type="submit"
                            variant="danger"
                            size="sm"
                            onClick={postData}
                          >
                            Print
                          </Button>
                        </div>

                        <div className="mt-n3">
                          <Form.Group as={Row} className="form-group">
                            <Form.Label
                              column
                              sm={4}
                              style={{ fontWeight: "bold" }}
                            >
                              Reeler Credit Balance:{" "}
                              <span style={{ color: "green" }}>
                                {" "}
                                &#8377; {amountData.reelerCredit}
                              </span>
                            </Form.Label>
                          </Form.Group>
                        </div>
                        <div className="mt-n3">
                          <Form.Group as={Row} className="form-group">
                            <Form.Label
                              column
                              sm={4}
                              style={{ fontWeight: "bold" }}
                            >
                              Reeler Deposit Today:{" "}
                              <span style={{ color: "green" }}>
                                {" "}
                                &#8377; {amountData.reelerDepositToday}
                              </span>
                            </Form.Label>
                          </Form.Group>
                        </div>
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
                                SL No
                              </th>
                              <th
                                style={{
                                  backgroundColor: "#0f6cbe",
                                  color: "#fff",
                                }}
                                // colSpan="2"
                              >
                                Reeler Number
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
                                Counter
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
                                License Number
                              </th>
                              <th
                                style={{
                                  backgroundColor: "#0f6cbe",
                                  color: "#fff",
                                }}
                                // colSpan="2"
                              >
                                Current Balance
                              </th>
                              <th
                                style={{
                                  backgroundColor: "#0f6cbe",
                                  color: "#fff",
                                }}
                                // colSpan="2"
                              >
                                Online
                              </th>
                              <th
                                style={{
                                  backgroundColor: "#0f6cbe",
                                  color: "#fff",
                                }}
                                // colSpan="2"
                              >
                                Suspend
                              </th>
                              <th
                                style={{
                                  backgroundColor: "#0f6cbe",
                                  color: "#fff",
                                }}
                                // colSpan="2"
                              >
                                U Date_Time
                              </th>
                              {/* <th
                          style={{
                            backgroundColor: "#0f6cbe",
                            color: "#fff",
                          }}
                          // colSpan="2"
                        >
                          Balance
                        </th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {pendingData.map((list, i) => (
                              <tr key={i}>
                                <td>{list.serialNumber}</td>
                                <td>{list.reelerNumber}</td>
                                <td>{list.reelerName}</td>
                                <td>{list.counter}</td>
                                <td>{list.mobileNumber}</td>
                                <td>{list.reelingLicenseNumber}</td>
                                <td>{list.currentBalance}</td>
                                <td>{list.onlineTxn}</td>
                                <td>{list.suspend}</td>
                                <td>{list.lastTxnTime}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Block>
            ) : (
              ""
            )}

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
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default ReelerPendingReport;
