import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {
  Icon,
  CustomDropdownToggle,
  CustomDropdownMenu,
} from "../../components";
import axios from "axios";

import DataTable, { createTheme } from "react-data-table-component";
import Swal from "sweetalert2/src/sweetalert2.js";
// import DatePicker from "react-datepicker";
import api from "../../services/auth/api";
import { useTranslation } from "react-i18next";

const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;
const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

const bankStatementStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title { margin-bottom: 4px; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
  .sh-empty { padding: 36px 12px; text-align: center; color: #8a96a8; font-size: 14px; }
  .sh-empty svg { width: 40px; height: 40px; opacity: 0.5; }
  .sh-form-wrap { background: #eef2f8; border-radius: 14px; padding: 18px; }
  .sh-form-wrap .card { border: none; border-radius: 12px !important; box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1); overflow: hidden; }
  .sh-form-wrap .form-label { font-weight: 600; color: #2b3a55; font-size: 13.5px; }
  .sh-form-wrap .form-control, .sh-form-wrap .form-select {
    border-radius: 8px; border: 1px solid #dbe4f0; padding: 9px 12px; font-size: 13.5px;
  }
  .sh-form-wrap .form-control:focus, .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6; box-shadow: 0 0 0 0.2rem rgba(59, 141, 214, 0.15);
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border: none !important;
    font-weight: 600; padding: 8px 22px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-modal-content { border-radius: 12px !important; border: 1px solid #e3ebf6 !important; overflow: hidden; }
  .sh-modal-content .modal-header { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%); border-bottom: none; padding: 16px 22px; }
  .sh-modal-content .modal-header .btn-close { filter: brightness(0) invert(1); opacity: 0.85; }
  .sh-modal-content .modal-title { color: #ffffff; font-weight: 700; }
  .sh-modal-content .modal-body { padding: 22px 24px; }
  .sh-modal-content table thead th {
    background-color: #eef4fc !important; color: #2b3a55 !important; font-weight: 700; font-size: 13px;
    letter-spacing: 0.2px; border-bottom: 2px solid #d6e3f3 !important;
  }
  .sh-modal-content .btn-primary {
    background: linear-gradient(135deg, #1e67a8 0%, #2b7ac0 100%); border: none; border-radius: 8px; font-weight: 600;
  }
  .sh-modal-content .btn-secondary {
    background: #ffffff; color: #e3496a; border: 1.5px solid #e3496a; border-radius: 8px; font-weight: 600;
  }
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

function BankStatement() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  const [page, setPage] = useState(0);
  const countPerPage = 5;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const [data, setData] = useState({
    paymentDate: "",
    fileName: "",
    godownId: localStorage.getItem("godownId"),
  });

  const [fileNameError, setFileNameError] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const parameters = `marketId=${localStorage.getItem(
    "marketId"
  )}&auctionDate=${data.paymentDate}&fileName=${data.fileName}`;

  // const handleDateChange = (date, type) => {
  //   setData({ ...data, [type]: date });
  // };

  const handleRemove = (marketId, godown, date, lot) => {
    // alert("Added To Bank");

    api
      .post(
        baseURLMarket + `auction/fp/removeSelectedLotlistfromReadyForPayment`,
        {
          marketId: marketId,
          godownId: godown,
          paymentDate: date,
          allottedLotList: [lot],
        }
      )
      .then((response) => {
        if (response.data.errorCode === 0) {
          getBankStatement();
        }

        // const res = response.data.content.body.content;
        // console.log(res);
      })
      .catch((err) => {
        Swal.fire({
          icon: "warning",
          title: err.response.data.errorMessages[0].message[0].message,
          customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
        });

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
    table: { style: { borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(30, 103, 168, 0.06)" } },
    headRow: { style: { minHeight: "50px", background: "linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%)", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" } },
    rows: {
      style: {
        minHeight: "45px", // override the row height
        fontSize: "13.5px",
        color: "#2b2d42",
        borderBottom: "1px solid #eef1f6 !important",
      },
      highlightOnHoverStyle: { backgroundColor: "#f4f8fd", cursor: "pointer", outline: "none" },
    },
    headCells: {
      style: {
        backgroundColor: "transparent",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.3px",
        paddingLeft: "12px", // override the cell padding for head cells
        paddingRight: "12px",
      },
    },
    cells: {
      style: {
        paddingLeft: "12px", // override the cell padding for data cells
        paddingRight: "12px",
      },
    },
    pagination: { style: { borderTop: "1px solid #eef1f6", fontSize: "13px", color: "#5a6577" } },
  };

  const convertDateFormat = (dateString) => {
    const parts = dateString.split("-");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
  };

  const PaymentDataColumns = [
    {
      name: t("Action"),
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
          {/* <Button variant="primary" size="sm" onClick={() => handleView(row.id)}> */}
          <Button
            variant="primary"
            size="sm"
            // onClick={() => handleView(row.id)}
            onClick={() =>
              handleRemove(
                localStorage.getItem("marketId"),
                data.godownId,
                row.lotTransactionDate,
                row.allottedLotId
              )
            }
          >
            {t("Remove")}
          </Button>

          {/* {showBankError?( <span style={{fontWeight:"bold"}}>No Bank Details</span>):""} */}
        </div>
      ),
      sortable: false,
      hide: "md",
    },
    {
      name: t("SLNo"),
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Lot No"),
      selector: (row) => row.allottedLotId,
      cell: (row) => <span>{row.allottedLotId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Transaction Date"),
      selector: (row) => convertDateFormat(row.lotTransactionDate),
      cell: (row) => <span>{convertDateFormat(row.lotTransactionDate)}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Farmer"),
      selector: (row) => row.farmerFirstName,
      cell: (row) => <span>{row.farmerFirstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Phone"),
      selector: (row) => row.farmerMobileNumber,
      cell: (row) => <span>{row.farmerMobileNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Reeler"),
      selector: (row) => row.reelerLicense,
      cell: (row) => <span>{row.reelerLicense}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Bank"),
      selector: (row) => row.bankName,
      cell: (row) => <span>{row.bankName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("IFSC"),
      selector: (row) => row.ifscCode,
      cell: (row) => <span>{row.ifscCode}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Account Number"),
      selector: (row) => row.accountNumber,
      cell: (row) => <span>{row.accountNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Amount"),
      selector: (row) => row.lotSoldOutAmount,
      cell: (row) => <span>{row.lotSoldOutAmount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("MF"),
      selector: (row) => row.farmerMarketFee,
      cell: (row) => <span>{row.farmerMarketFee}</span>,
      sortable: true,
      hide: "md",
    },
  ];

  // to get Auction Date List
  const [auctionDateList, setAuctionDateList] = useState([]);

  const getAuctionDateList = () => {
    api
      .post(baseURLMarket + `auction/fp/getAuctionDateListForBankStatement`, {
        marketId: localStorage.getItem("marketId"),
        godownId: 0,
      })
      .then((response) => {
        console.log(response);
        if (response.data.content) {
          setAuctionDateList(response.data.content);
        }
      })
      .catch((err) => {
        setAuctionDateList([]);
      });
  };

  useEffect(() => {
    getAuctionDateList();
  }, []);

  const [paymentMode, setPaymentMode] = useState("");

  const [bankStatementList, setBankStatementList] = useState([]);

  const getBankStatement = (e) => {
    const date = new Date(data.paymentDate);
    const formattedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0");

    console.log(formattedDate);

    api
      .post(baseURLMarket + `auction/fp/generateBankStatementForAuctionDate`, {
        marketId: localStorage.getItem("marketId"),
        godownId: data.godownId,
        paymentDate: formattedDate,
      })
      .then((response) => {
        // console.log(response);

        if (response.data.content) {
          setBankStatementList(
            response.data.content.farmerPaymentInfoResponseList
          );
          setPaymentMode(response.data.content.paymentMode);
        }
      })
      .catch((err) => {
        setBankStatementList([]);
      });
  };

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (isFormSubmitted && name === "fileName") {
      setFileNameError(value.trim() === "" ? "File name cannot be empty" : "");
    }
  };

  const handleButtonClick = (actionFunction) => {
    if (!data.fileName.trim()) {
      setFileNameError("File Name is required");
      setIsFormSubmitted(true); // Still set isFormSubmitted to true for invalid fields
      return;
    }

    setIsFormSubmitted(true);

    if (fileNameError === "") {
      actionFunction();
    } else {
      console.error("Validation error:", fileNameError);
    }
  };

  // Generate CSV file
  const generateCsv = (e) => {
    if (fileNameError === "") {
      const { paymentDate, fileName } = data;
      const parameters = `marketId=${localStorage.getItem(
        "marketId"
      )}&auctionDate=${paymentDate}&fileName=${fileName}`;
      api
        .get(baseURLMarket + `auction/fp/generateCSVFile?${parameters}`, {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/csv" });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = `${fileName}.csv`;
          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          window.URL.revokeObjectURL(link.href);
        })
        .catch((err) => {
          Swal.fire({
            icon: "warning",
            title: t("No record found!!!"),
            customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
          });
        });
    } else {
      console.error("Validation error:", fileNameError);
    }
  };

  const requestJobToProcessPayment = (e) => {
    if (fileNameError === "") {
      const { paymentDate, fileName } = data;
      if (paymentDate === "") {
        return Swal.fire({
          icon: "warning",
          title: t("Date Not Selected"),
          customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
        });
      }
      api
        .post(baseURLMarket + `auction/fp/requestJobToProcessPayment`, {
          marketId: localStorage.getItem("marketId"),
          godownId: data.godownId,
          paymentDate: paymentDate,
          fileName: fileName,
        })
        .then((response) => {
          console.log(response);
          if (response.data.errorCode === 0) {
            Swal.fire({
              icon: "success",
              title: t("Request has been sent to Bank"),
              customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
            });
          }
          if (response.data.errorCode === -1) {
            Swal.fire({
              icon: "warning",
              title: response.data.errorMessages[0],
              customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
            });
          }

          // if (response.data.content) {
          //   setBankStatementList(
          //     response.data.content.farmerPaymentInfoResponseList
          //   );
          // }
        })
        .catch((err) => {
          // setBankStatementList([]);
        });
    } else {
      console.error("Validation error:", fileNameError);
    }
  };


  const markCashPaymentLotListToSuccess = (e) => {
    if (fileNameError === "") {
      const { paymentDate, fileName } = data;
      if (paymentDate === "") {
        return Swal.fire({
          icon: "warning",
          title: t("Date Not Selected"),
          customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
        });
      }
      const allotedlotList = bankStatementList.map(bankStatement=>bankStatement.allottedLotId);
      // console.log(allotedlotList);
      api
        .post(baseURLMarket + `auction/fp/markCashPaymentLotListToSuccess`, {
          marketId: localStorage.getItem("marketId"),
          godownId: data.godownId,
          paymentDate: paymentDate,
          allottedLotList: allotedlotList,
        })
        .then((response) => {
          console.log(response);
          // TODO Show message "Please Generate Bank Statement Before Proceeding Later It Won't be possible"
          
          // if (response.data.errorCode === 0) {
          //   Swal.fire({
          //     icon: "success",
          //     title: "Request has been sent to Bank",
          //   });
          // }
          // if (response.data.errorCode === -1) {
          //   Swal.fire({
          //     icon: "warning",
          //     title: response.data.errorMessages[0],
          //   });
          // }

          // if (response.data.content) {
          //   setBankStatementList(
          //     response.data.content.farmerPaymentInfoResponseList
          //   );
          // }
        })
        .catch((err) => {
          // setBankStatementList([]);
        });
    } else {
      console.error("Validation error:", fileNameError);
    }
  };

  // Generate CSV after process for payment  file
  const checkBankGeneratedStatement = (e) => {
    if (fileNameError === "") {
      const { fileName } = data;
      const parameters = `marketId=${localStorage.getItem(
        "marketId"
      )}&fileName=${fileName}`;
      api
        .get(baseURLMarket + `auction/filedownloader/download?${parameters}`, {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/csv" });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = `${fileName}.csv`;
          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          window.URL.revokeObjectURL(link.href);
        })
        .catch((err) => {
          Swal.fire({
            icon: "warning",
            title: t("Either file name is incorrect or Wait for few minutes!!!"),
            customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
          });
        });
    } else {
      console.error("Validation error:", fileNameError);
    }
  };

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
  };

  // const reports = (e) => {
  //   axios
  //     .post(
  //       `https://api.senovagseri.com/reports/gettripletpdf`,
  //       {
  //         marketId: 24,
  //         godownId: 26,
  //         allottedLotId: 5,
  //         auctionDate: "2023-12-26",
  //       },
  //       { headers: _header }
  //     )
  //     .then((response) => {
  //       console.log(response);
  //       // if (response.data.content) {
  //       //   setBankStatementList(
  //       //     response.data.content.farmerPaymentInfoResponseList
  //       //   );
  //       // }
  //     })
  //     .catch((err) => {
  //       // setBankStatementList([]);
  //     });
  // };

  return (
    <Layout title={t("Bank Statement")} show="true">
      <style>{bankStatementStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("Bank Statement")}</Block.Title>
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
        </div>
      </Block.Head>

      <div className="mt-n4 sh-form-wrap">
      <Card>
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
                <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                  {t("Date")}
                </Form.Label>
                <Col sm={3} style={{ marginLeft: "-200px" }}>
                  <div className="form-control-wrap">
                    {/* <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={data.paymentDate}
                      onChange={(date) => handleDateChange(date, "paymentDate")}
                    /> */}

                    <Form.Select
                      name="paymentDate"
                      value={data.paymentDate}
                      onChange={handleInputs}
                    >
                      <option value="0">{t("Select Date")}</option>
                      {auctionDateList.map((list) => (
                        <option key={list} value={list}>
                          {list}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
                {/* <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                  Godown
                </Form.Label>
                <Col sm={3} style={{ marginLeft: "-150px" }}>
                  <Form.Select
                    name="godownId"
                    value={data.godownId}
                    onChange={handleInputs}
                  >
                    <option value="0">Select Godown</option>
                    {godownListData.map((list) => (
                      <option key={list.godownId} value={list.godownId}>
                        {list.godownName}
                      </option>
                    ))}
                  </Form.Select>
                </Col> */}
                {/* </Form.Group> */}
                {/* <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                  Godown
                </Form.Label> */}
                {/* <Col sm={3}>
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
                <Col sm={2}>
                  <Button
                    type="button"
                    variant="primary"
                    className="sh-save-btn"
                    onClick={getBankStatement}
                  >
                    {t("Get Details")}
                  </Button>
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      </div>

      <Block className="mt-4 sh-form-wrap">
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive"
            columns={PaymentDataColumns}
            data={bankStatementList}
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
            progressComponent={<div className="py-4">{t("Loading...")}</div>}
            theme="solarized"
            customStyles={customStyles}
            noDataComponent={
              <div className="sh-empty">
                <Icon name="inbox" />
                <p className="mt-2 mb-0">{t("No records found")}</p>
              </div>
            }
          />
        </Card>
      </Block>

      <Card className="mt-3">
        <Card.Body>
          <Row className="g-gs">
            <Col lg="12">
              <Form.Group as={Row} className="form-group">
                {/* <Form.Label column sm={2} style={{ fontWeight: "bold" }}>
                  Date
                </Form.Label> */}
                <Col sm={3}>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fileName"
                      name="fileName"
                      value={data.fileName}
                      onChange={handleInputs}
                      type="text"
                      placeholder={t("Enter File Name")}
                      isInvalid={isFormSubmitted && !!fileNameError}
                    />
                    <Form.Control.Feedback type="invalid">
                      {fileNameError}
                    </Form.Control.Feedback>
                  </div>
                </Col>
                <Col sm={2}>
                  <Button
                    type="button"
                    variant="primary"
                    className="sh-save-btn"
                    onClick={() => handleButtonClick(generateCsv)}
                  >
                    {t("Generate CSV File")}
                  </Button>
                </Col>
                {paymentMode === "cash" ? (
                  <>
                    <Col sm={2}>
                      <Button
                        type="button"
                        variant="primary"
                        className="sh-save-btn"
                        onClick={() =>
                          handleButtonClick(markCashPaymentLotListToSuccess)
                        }
                      >
                        {t("Mark Payment Completed")}
                      </Button>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col sm={2}>
                      <Button
                        type="button"
                        variant="primary"
                        className="sh-save-btn"
                        onClick={() =>
                          handleButtonClick(requestJobToProcessPayment)
                        }
                      >
                        {t("Process For Payment")}
                      </Button>
                    </Col>

                    <Col sm={2}>
                      <Button
                        type="button"
                        variant="primary"
                        className="sh-save-btn"
                        onClick={() =>
                          handleButtonClick(checkBankGeneratedStatement)
                        }
                      >
                        {t("Check Bank Generated File")}
                      </Button>
                    </Col>
                  </>
                )}

                {/* <Col sm={2}>
                  <Button type="button" variant="primary" onClick={reports}>
                    report
                  </Button>
                </Col> */}
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>{t("Approve/Reject")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="6">
                {/* 
              <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="fid"
                    >
                      <Form.Label column sm={4}>
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control type="text" placeholder="FRUITS ID / AADHAAR NUMBER" value="Hello" />
                      </Col>
                      
                    </Form.Group> */}

                <Form.Group className="form-group">
                  <Form.Label htmlFor="actions">{t("Actions")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="actions"
                      type="text"
                      placeholder={t("Actions")}
                      value="actions1"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="slno">{t("SL No")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="slno"
                      type="text"
                      placeholder={t("SL No")}
                      value="1"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="lotno">{t("Lot Nbr")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="lotno"
                      type="text"
                      placeholder={t("Lot Nbr")}
                      value="411"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="tradate">
                    {t("Transaction_Date")}
                  </Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="tradate"
                      type="text"
                      placeholder={t("Transaction_Date")}
                      value="16/05/2001"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg="6">
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="cmt">{t("Comment")}</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      placeholder={t("Enter Comment")}
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
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          label={t("Pre Inspection")}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          label={t("Post Inspection")}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  <div className="gap-col">
                    <Button variant="success" onClick={handleCloseModal}>
                      {t("Approve")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal}>
                      {t("Reject")}
                    </Button>
                  </div>
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal}>
                      {t("Cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal1} onHide={handleCloseModal1} size="lg" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>{t("View Model")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="6">
                {/* 
              <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="fid"
                    >
                      <Form.Label column sm={4}>
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control type="text" placeholder="FRUITS ID / AADHAAR NUMBER" value="Hello" />
                      </Col>
                      
                    </Form.Group> */}

                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="fid">Farmer ID</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fid"
                      type="text"
                      placeholder="Farmer ID"
                      value="fid1"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="fyear">Financial Year</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fyear"
                      type="text"
                      placeholder="Financial Year"
                      value="2023-2024"
                    />
                  </div>
                </Form.Group> */}
              </Col>
              <Col lg="6">
                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="fname">Farmer Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fname"
                      type="text"
                      placeholder="Farmer Name"
                      value="Basappa"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="mbl">Mobile</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mbl"
                      type="text"
                      placeholder="Mobile"
                      value="8596742302"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="12">
                {/* <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="cmt">Comment</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      placeholder="Enter Comment"
                      id="cmt"
                      rows="3"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="12">
                {/* <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          defaultChecked
                          label="Pre Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          defaultChecked
                          label="Post Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row> */}
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  {/* <div className="gap-col">
                    <Button variant="success" onClick={handleCloseModal1}>
                      Approve
                    </Button>
                  </div> */}
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal1}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal1}>
                      {t("Close")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal2} onHide={handleCloseModal2} size="lg" contentClassName="sh-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>{t("Modify Model")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form action="#">
            <Row className="g-3">
              <Col lg="6">
                {/* 
              <Form.Group
                      as={Row}
                      className="form-group mt-3"
                      controlId="fid"
                    >
                      <Form.Label column sm={4}>
                        FRUITS ID / AADHAAR NUMBER
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control type="text" placeholder="FRUITS ID / AADHAAR NUMBER" value="Hello" />
                      </Col>
                      
                    </Form.Group> */}

                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="fid">Farmer ID</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fid"
                      type="text"
                      placeholder="Farmer ID"
                      value="fid1"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="fyear">Financial Year</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fyear"
                      type="text"
                      placeholder="Financial Year"
                      value="2023-2024"
                    />
                  </div>
                </Form.Group> */}
              </Col>
              <Col lg="6">
                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="fname">Farmer Name</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="fname"
                      type="text"
                      placeholder="Farmer Name"
                      value="Basappa"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="mbl">Mobile</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      id="mbl"
                      type="text"
                      placeholder="Mobile"
                      value="8596742302"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="12">
                {/* <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="cmt">Comment</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Control
                      as="textarea"
                      placeholder="Enter Comment"
                      id="cmt"
                      rows="3"
                    />
                  </div>
                </Form.Group> */}
              </Col>

              <Col lg="12">
                {/* <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          defaultChecked
                          label="Pre Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-3">
                      <div className="form-control-wrap">
                        <Form.Check
                          type="checkbox"
                          id="flexCheckChecked"
                          defaultChecked
                          label="Post Inspection"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row> */}
              </Col>

              <Col lg="12">
                <div className="d-flex justify-content-center gap g-2 mt-3">
                  <div className="gap-col">
                    <Button variant="success" onClick={handleCloseModal2}>
                      {t("Save")}
                    </Button>
                  </div>
                  {/* <div className="gap-col">
                    <Button variant="danger" onClick={handleCloseModal2}>
                      Reject
                    </Button>
                  </div> */}
                  <div className="gap-col">
                    <Button variant="secondary" onClick={handleCloseModal2}>
                      {t("Cancel")}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default BankStatement;
