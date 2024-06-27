import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable, { createTheme } from "react-data-table-component";
// import axios from "axios";

import {
  Icon,
  CustomDropdownToggle,
  CustomDropdownMenu,
} from "../../components";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function ReadyForPayment() {
  // const [showModal, setShowModal] = useState(false);
  // const [showModal1, setShowModal1] = useState(false);
  // const [showModal2, setShowModal2] = useState(false);

  // const handleShowModal = () => setShowModal(true);
  // const handleCloseModal = () => setShowModal(false);

  // const handleShowModal1 = () => setShowModal1(true);
  // const handleCloseModal1 = () => setShowModal1(false);

  // const handleShowModal2 = () => setShowModal2(true);
  // const handleCloseModal2 = () => setShowModal2(false);

  const [page, setPage] = useState(0);
  const countPerPage = 1000;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const [weighmentCompletedList, setWeighmentCompletedList] = useState([]);

  // Show Bank Details not exist
  const [showBankError, setShowBankError] = useState(false);

  // Show AddToButton
  const [showAddToButton, setShowAddToButton] = useState(false);

  const [payment, setPayment] = useState({
    marketId: localStorage.getItem("marketId"),
    // godownId: localStorage.getItem("godownId"),
    // paymentDate: new Date(),
  });

  const [totalAmount, setTotalAmount] = useState(0);

  const handleChangeInputs = (e) => {
    // debugger;
    let { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setPayment({ ...payment, [type]: date });
  };

  const handleAddToBank = (marketId, date, lot) => {
    // alert("Added To Bank");
    // debugger;
    api
      .post(baseURLMarket + `auction/fp/addSelectedLotlistToReadyForPayment`, {
        marketId: marketId,
        paymentDate: date,
        allottedLotList: [lot],
      })
      .then((response) => {
        console.log("Response status:", response.status); // Log response status
        console.log("Response data:", response.data); // Log response data
        // const res = response.data.content.body.content;
        // console.log("resres", res);
        // debugger;
        postData();
      })
      .catch((err) => {
        console.error("Error:", err);
        // setData({});
        // saveError();
      });
  };

  useEffect(() => {
    postData();
  }, []);

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
  //   if (payment.marketId) {
  //     getGodownList(payment.marketId);
  //   }
  // }, [payment.marketId]);
  const [paymentMode, setPaymentMode] = useState("");

  const postData = (e) => {
    console.log("postData", payment.paymentDate);
    // const date = new Date(payment.paymentDate);
    // const formattedDate =
    //   date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    // console.log(formattedDate);

    api
      .post(
        baseURLMarket + `auction/fp/getWeighMentCompletedList`,
        // { ...payment, paymentDate: formattedDate },
        { ...payment },
        _params
      )
      .then((response) => {
        // debugger;
        setPaymentMode(
          response.data.content.farmerReadyForPaymentResponse.paymentMode
        );
        console.log(response);
        if (response.data.content) {
          setTotalAmount(
            response.data.content.farmerReadyForPaymentResponse
              .totalAmountToFarmer
          );
        } else {
          setWeighmentCompletedList([]);
        }
        if (
          response.data.content.farmerReadyForPaymentResponse
            .farmerPaymentInfoResponseList
        ) {
          setWeighmentCompletedList(
            response.data.content.farmerReadyForPaymentResponse
              .farmerPaymentInfoResponseList
          );
          // if (!res.ifscCode) {
          //   setShowBankError(true);
          //   setShowAddToButton(false);
          // }
        } else {
          setWeighmentCompletedList([]);
        }
        // setSourceData(response.data.content);
        // setAllotedLotList(response.data.content.allotedLotList);
        // setBigBinList(response.data.content.allotedBigBinList);
        // setSmallBinList(response.data.content.allotedSmallBinList);
        // saveSuccess();
      })
      .catch((err) => {
        // setData({});
        // saveError();
      });
  };

  createTheme(
    "solarized",
    {
      text: {
        primary: "#004b8e",
        secondary: "#2aa198",
      },
      background: {
        default: "#fff",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#d3d3d3",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.02)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "light"
  );

  const customStyles = {
    rows: {
      style: {
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1e67a8",
        color: "#fff",
        fontSize: "14px",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  const convertDateFormat = (dateString) => {
    const parts = dateString.split("-");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
  };

  const PaymentDataColumns = [
    {
      name: "action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          {((row.ifscCode && row.reelerCurrentBalance > 0) ||
            (row.ifscCode && paymentMode === "cash")) && (
            <Button
              variant="primary"
              size="sm"
              // onClick={() => handleView(row.id)}
              onClick={() =>
                handleAddToBank(
                  localStorage.getItem("marketId"),
                  // payment.godownId,
                  row.lotTransactionDate,
                  row.allottedLotId
                )
              }
            >
              Add to Bank
            </Button>
          )}

          {!row.ifscCode && row.reelerCurrentBalance > 0 && (
            <span style={{ fontWeight: "bold" }}>No Bank Details</span>
          )}
          {row.reelerCurrentBalance < 0 && (
            <span style={{ fontWeight: "bold" }}>
              Minus {Math.round(row.reelerCurrentBalance)}
            </span>
          )}

          {/* {showBankError?( <span style={{fontWeight:"bold"}}>No Bank Details</span>):""} */}
        </div>
      ),
      sortable: false,
      hide: "md",
    },
    {
      name: "SLNo",
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Lot No",
      selector: (row) => row.allottedLotId,
      cell: (row) => <span>{row.allottedLotId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Transaction Date",
      selector: (row) => convertDateFormat(row.lotTransactionDate),
      cell: (row) => <span>{convertDateFormat(row.lotTransactionDate)}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Farmer",
      selector: (row) => row.farmerFirstName,
      cell: (row) => <span>{row.farmerFirstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Phone",
      selector: (row) => row.farmerMobileNumber,
      cell: (row) => <span>{row.farmerMobileNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Reeler",
      selector: (row) => row.reelerLicense,
      cell: (row) => <span>{row.reelerLicense}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Bank",
      selector: (row) => row.bankName,
      cell: (row) => <span>{row.bankName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "IFSC",
      selector: (row) => row.ifscCode,
      cell: (row) => <span>{row.ifscCode}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Account Number",
      selector: (row) => row.accountNumber,
      cell: (row) => <span>{row.accountNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Amount",
      selector: (row) => row.lotSoldOutAmount,
      cell: (row) => <span>{row.lotSoldOutAmount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "MF",
      selector: (row) => row.farmerMarketFee,
      cell: (row) => <span>{row.farmerMarketFee}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  return (
    <Layout title="Ready for Payment" show="true">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Ready for Payment</Block.Title>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/stake-holder-registration"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/stake-holder-registration"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Create</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      {/* <Card>
        <Card.Body>
          <Row className="g-gs">
            <Col lg="12">
              <Form.Group as={Row} className="form-group">
                <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                  Godown
                </Form.Label>
                <Col sm={3}>
                  <Form.Select
                    name="godownId"
                    value={payment.godownId}
                    onChange={handleChangeInputs}
                  >
                    <option value="0">Select Godown</option>
                    {godownListData.map((list) => (
                      <option key={list.godownId} value={list.godownId}>
                        {list.godownName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col sm={2}>
                  <Button type="button" variant="primary" onClick={postData}>
                    Get Details
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card> */}

      {/* <Block className="mt-4">
        <Card>
          <Card.Header className="text-center">Ready For Payment</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="12">
                <table className="table table-striped table-bordered" style={{backgroundColor:"white"}}>
                  <thead>
                    <tr>
                      <th>Actions</th>
                      <th>SL No</th>
                      <th>Lot Nbr</th>
                      <th>Transaction_Date</th>
                      <th>Farmer</th>
                      <th>TSC</th>
                      <th>Phone</th>
                      <th>Reeler</th>
                      <th>Bank</th>
                      <th>IFSC Len</th>
                      <th>IFSC</th>
                      <th>Account No</th>
                      <th>Amount</th>
                      <th>MF</th>
                      <th>Update Farmer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weighmentCompletedList.map((listItem) => (
                      <tr>
                        <td>
                          <button
                            className="btn btn-info"
                            onClick={handleAddToBank}
                          >
                            Add To Bank
                          </button>
                        </td>
                        <td>{listItem.serialNumber}</td>
                        <td>111</td>
                        <td>16/052001</td>
                        <td>Basappa</td>
                        <td>Kolar</td>
                        <td>99999999</td>
                        <td>KKR13145</td>
                        <td>Karnataka Bank</td>
                        <td>0-Ok</td>
                        <td>KARB0001</td>
                        <td>100000123</td>
                        <td>4000</td>
                        <td>112</td>
                        <td>
                          <button className="btn btn-info">Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block> */}

      <Block className="mt-4">
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={PaymentDataColumns}
            data={weighmentCompletedList}
            highlightOnHover
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={countPerPage}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            onChangePage={(page) => setPage(page - 1)}
            progressPending={loading}
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>
      </Block>

      <Card className="mt-3">
        <Card.Body>
          <Row className="g-gs">
            <Col lg="12">
              <Form.Group as={Row} className="form-group">
                {/* <Form.Label column sm={1} style={{ fontWeight: "bold" }}>
                  Lot ID
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    id="allotedLotId"
                    name="allottedLotId"
                    // value={highestBid.allottedLotId}
                    onChange={handleLotIdInputs}
                    type="text"
                    placeholder="Enter Lot ID"
                  />
                </Col> */}
                {/* <Form.Group as={Row} className="form-group mt-3" id="date"> */}
                <Form.Label column sm={4} style={{ fontWeight: "bold" }}>
                  Total Amount Payable to Bank/Farmer:{" "}
                  <span style={{ color: "green" }}>{totalAmount}</span>
                </Form.Label>

                {/* <Col sm={3}>
                  <div className="form-control-wrap">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={payment.paymentDate}
                      onChange={(date) => handleDateChange(date, "paymentDate")}
                    />
                  </div>
                </Col> */}
                {/* </Form.Group> */}
                {/* <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                  Godown
                </Form.Label>
                <Col sm={3}>
                  <Form.Select
                    name="godownId"
                    value={payment.godownId}
                    onChange={handleChangeInputs}
                  >
                    <option value="0">Select Godown</option>
                    {godownListData.map((list) => (
                      <option key={list.godownId} value={list.godownId}>
                        {list.godownName}
                      </option>
                    ))}
                  </Form.Select>
                </Col> */}
                {/* <Col sm={2}>
                  <Button type="button" variant="primary" onClick={postData}>
                    Get Details
                  </Button>
                </Col> */}
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* <Form action="#">
            <Row className="g-3">
              <Col lg="6">

                <Form.Group className="form-group">
                  <Form.Label htmlFor="actions">Actions</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="actions"
                      type="text"
                      placeholder="Actions"
                      value="actions1"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="slno">SL No</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="slno"
                      type="text"
                      placeholder="SL No"
                      value="1"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="lotno">Lot Nbr</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="lotno"
                      type="text"
                      placeholder="Lot Nbr"
                      value="411"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="tradate">Transaction_Date</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="tradate"
                      type="text"
                      placeholder="Transaction_Date"
                      value="16/05/2001"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="cmt">Comment</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      placeholder="Enter Comment"
                      id="cmt"
                      rows="3"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="12">
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      {/* <Form.Label>With Land</Form.Label> */}
      {/* <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          label="Pre Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col> */}

      {/* <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      {/* <Form.Label>With Land</Form.Label> */}
      {/* <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          label="Post Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form> */}
    </Layout>
  );
}

export default ReadyForPayment;
