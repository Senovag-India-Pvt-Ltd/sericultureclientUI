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
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next"; // Add this line

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

const readyForPaymentForSeedMarketStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title { margin-bottom: 4px; color: #ffffff !important; font-weight: 700; letter-spacing: 0.2px; }
  .sh-form-wrap { background: #eef2f8; border-radius: 14px; padding: 18px; }
  .sh-form-wrap .card { border: none; border-radius: 12px !important; box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1); overflow: hidden; }
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

function ReadyForPaymentForSeedMarket() {
  const { t } = useTranslation(); // Add this line

  const [page, setPage] = useState(0);
  const countPerPage = 1000;
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const _params = { params: { pageNumber: page, size: countPerPage } };
  const [weighmentCompletedList, setWeighmentCompletedList] = useState([]);



  const [payment, setPayment] = useState({
    marketId: localStorage.getItem("marketId"),
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
    if(!date){
      Swal.fire({
        icon: 'warning',
        title: t("This Lot is not distributed"),
        customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
      });
      return;
    }
    api
      .post(baseURLMarket + `auction/fp/addSelectedLotlistToReadyForPaymentForSeedMarket`, {
        marketId: marketId,
        paymentDate: date,
        allottedLotList: [lot],
      })
      .then((response) => {
        console.log("Response status:", response.status); // Log response status
        console.log("Response data:", response.data); // Log response data
        
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

 
  const [paymentMode, setPaymentMode] = useState("");

  const postData = (e) => {
    console.log("postData", payment.paymentDate);
    

    api
      .post(
        baseURLMarket + `auction/fp/readyForPaymentForSeedMarketList`,
        // { ...payment, paymentDate: formattedDate },
        { ...payment },
        _params
      )
      .then((response) => {
        // debugger;
        setPaymentMode(
          response.data.content.farmerReadyForPaymentForSeedMarketResponse.paymentMode
        );
        console.log(response);
        if (response.data.content) {
          setTotalAmount(
            response.data.content.farmerReadyForPaymentForSeedMarketResponse
              .totalAmountToFarmer
          );
        } else {
          setWeighmentCompletedList([]);
        }
        if (
          response.data.content.farmerReadyForPaymentForSeedMarketResponse
            .farmerReadyPaymentInfoForSeedMarketResponseList
        ) {
          setWeighmentCompletedList(
            response.data.content.farmerReadyForPaymentForSeedMarketResponse
              .farmerReadyPaymentInfoForSeedMarketResponseList
          );
    
        } else {
          setWeighmentCompletedList([]);
        }
       
      })
      .catch((err) => {
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
      
      name: t("Action"), // Add translation function
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
        {paymentMode === "online" && (
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              handleAddToBank(
                localStorage.getItem("marketId"),
                row.auctionDate,
                row.lotGroupageId
              )
            }
          >
              {t("Add to Bank")}
            </Button>
          )}

         

          {/* {showBankError?( <span style={{fontWeight:"bold"}}>No Bank Details</span>):""} */}
        </div>
      ),
      sortable: false,
      hide: "md",
    },
    {
      name: t("SLNo"), // Add translation function
      selector: (row) => row.serialNumber,
      cell: (row) => <span>{row.serialNumber}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Lot No"), // Add translation function
      selector: (row) => row.allottedLotId,
      cell: (row) => <span>{row.allottedLotId}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Transaction Date"), // Add translation function
      selector: (row) => convertDateFormat(row.auctionDate),
      cell: (row) => <span>{convertDateFormat(row.auctionDate)}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Farmer"), // Add translation function
      selector: (row) => row.farmerFirstName,
      cell: (row) => <span>{row.farmerFirstName}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Phone"), // Add translation function
      selector: (row) => row.farmerMobileNumber,
      cell: (row) => <span>{row.farmerMobileNumber}</span>,
      sortable: true,
      hide: "md",
    },
   
    {
      name: t("Buyer Type"), // Add translation function
      selector: (row) => row.buyerType,
      cell: (row) => <span>{row.buyerType}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: t("Buyer Name"), // Add translation function
        selector: (row) => row.buyerName,
        cell: (row) => <span>{row.buyerName}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: t("Lot Weight"), // Add translation function
      selector: (row) => row.lotWeight,
      cell: (row) => <span>{row.lotWeight}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Amount"), // Add translation function
      selector: (row) => row.amount,
      cell: (row) => <span>{row.amount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("Sold Amount"), // Add translation function
      selector: (row) => row.soldAmount,
      cell: (row) => <span>{row.soldAmount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: t("MF"), // Add translation function
      selector: (row) => row.marketFee,
      cell: (row) => <span>{row.marketFee}</span>,
      sortable: true,
      hide: "md",
    },
    
  ];

  return (
    <Layout title={t("Ready for Payment For Seed Market")} show="true"> {/* Add translation function */}
      <style>{readyForPaymentForSeedMarketStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("Ready for Payment For Seed Market")}</Block.Title> {/* Add translation function */}
          </Block.HeadContent>

        </Block.HeadBetween>
        </div>
      </Block.Head>
      <Block className="mt-n4 sh-form-wrap">
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
            progressComponent={<div className="py-4">{t("Loading...")}</div>}
            noDataComponent={
              <div className="sh-empty">
                <Icon name="inbox" />
                <p className="mt-2 mb-0">{t("No records found")}</p>
              </div>
            }
            theme="solarized"
            customStyles={customStyles}
          />
        </Card>
      </Block>

      {/* <Card className="mt-3">
        <Card.Body>
          <Row className="g-gs">
            <Col lg="12">
              <Form.Group as={Row} className="form-group">
               
                <Form.Label column sm={4} style={{ fontWeight: "bold" }}>
                  Total Amount Payable to Bank/Farmer:{" "}
                  <span style={{ color: "green" }}>{totalAmount}</span>
                </Form.Label>

                
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card> */}
    </Layout>
  );
}

export default ReadyForPaymentForSeedMarket;
