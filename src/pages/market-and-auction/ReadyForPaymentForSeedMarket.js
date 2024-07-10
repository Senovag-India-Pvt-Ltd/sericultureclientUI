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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function ReadyForPaymentForSeedMarket() {

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
        title: 'This Lot is not distributed'
      });
      return;
    }
    api
      .post(baseURLMarket + `auction/fp/addSeedMarketSelectedLotlistToReadyForPayment`, {
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
      name: "Action",
      cell: (row) => (
        //   Button style
        <div className="text-start w-100">
        {paymentMode === "cash" && (
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              handleAddToBank(
                localStorage.getItem("marketId"),
                row.auctionDate,
                row.allottedLotId
              )
            }
          >
              Add to Payment
            </Button>
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
      selector: (row) => convertDateFormat(row.auctionDate),
      cell: (row) => <span>{convertDateFormat(row.auctionDate)}</span>,
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
      name: "Buyer Type",
      selector: (row) => row.buyerType,
      cell: (row) => <span>{row.buyerType}</span>,
      sortable: true,
      hide: "md",
    },
    {
        name: "Buyer Name",
        selector: (row) => row.buyerName,
        cell: (row) => <span>{row.buyerName}</span>,
        sortable: true,
        hide: "md",
      },
    {
      name: "Lot Weight",
      selector: (row) => row.lotWeight,
      cell: (row) => <span>{row.lotWeight}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      cell: (row) => <span>{row.amount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "Sold Amount",
      selector: (row) => row.soldAmount,
      cell: (row) => <span>{row.soldAmount}</span>,
      sortable: true,
      hide: "md",
    },
    {
      name: "MF",
      selector: (row) => row.marketFee,
      cell: (row) => <span>{row.marketFee}</span>,
      sortable: true,
      hide: "md",
    },
    
  ];

  return (
    <Layout title="Ready for Payment For Seed Market" show="true">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Ready for Payment For Seed Market</Block.Title>
          </Block.HeadContent>
         
        </Block.HeadBetween>
      </Block.Head>
      <Block className="mt-n4">
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
