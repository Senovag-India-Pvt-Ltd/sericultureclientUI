import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import Swal from "sweetalert2/src/sweetalert2.js";

import {
  Icon,
  CustomDropdownToggle,
  CustomDropdownMenu,
} from "../../components";

import api from "../../services/auth/api";
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function BulkSendToPaymentForSeedMarket() {
  // const [selectedDate, setSelectedDate] = useState("");

  const [data, setData] = useState({
    paymentDate: "",
  });

  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleDateChange = (newDate) => {
    setData({ ...data, marketAuctionDate: newDate });
  };

  

  // to get Auction Date List
  const [auctionDateList, setAuctionDateList] = useState([]);

  const getAuctionDateList = () => {
    api
      .post(baseURLMarket + `auction/fp/getAuctionDateListForBulkSendForSeedMarket`, {
        marketId: localStorage.getItem("marketId"),
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

  // const onSubmitBulkDate = (e) => {
  //   const date = new Date(data.paymentDate);
  //   const formattedDate =
  //     date.getFullYear() +
  //     "-" +
  //     (date.getMonth() + 1).toString().padStart(2, "0") +
  //     "-" +
  //     date.getDate().toString().padStart(2, "0");
  //     if (data.paymentDate == null) {
  //       Swal.fire({
  //         icon: 'warning',
  //         title: 'This Lot is not distributed',
  //       });
  //       return;
  //     }

  //   api
  //     .post(baseURLMarket + `auction/fp/bulkSendToReadyForPaymentForSeedMarket`, {
  //       marketId: localStorage.getItem("marketId"),
  //       paymentDate: formattedDate,
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       saveSuccess();
  //       getAuctionDateList();

  //       // if (response.data.content) {
  //       //   setAuctionDateList(response.data.content);
  //       // }
  //     })
  //     .catch((err) => {
  //       // setAuctionDateList([]);
  //     });
  // };

  const onSubmitBulkDate = (e) => {
    const date = new Date(data.paymentDate);
    const formattedDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0");
  
    if (data.paymentDate == null) {
      Swal.fire({
        icon: 'warning',
        title: 'This Lot is not distributed',
      });
      return;
    }
  
    api
      .post(baseURLMarket + `auction/fp/bulkSendToReadyForPaymentForSeedMarket`, {
        marketId: localStorage.getItem("marketId"),
        paymentDate: formattedDate,
      })
      .then((response) => {
        console.log(response);
        saveSuccess();
        getAuctionDateList();
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.errorMessages) {
          const errorMessages = err.response.data.errorMessages;
          errorMessages.forEach((error) => {
            if (error.errorType === 'VALIDATION') {
              error.message.forEach((msg) => {
                if (msg.label === 'NON_LABEL_MESSAGE') {
                  Swal.fire({
                    icon: 'error',
                    title: 'Distribute the Lot',
                    text: msg.message,
                  });
                }
              });
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'An error occurred',
            text: 'Please try again later.',
          });
        }
      });
  };
  

  // const onSubmitBulkDate = (e) => {
  //   const date = new Date(data.paymentDate);
  //   const formattedDate =
  //     date.getFullYear() +
  //     "-" +
  //     (date.getMonth() + 1).toString().padStart(2, "0") +
  //     "-" +
  //     date.getDate().toString().padStart(2, "0");
  
  //   if (data.paymentDate == null) {
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'This Lot is not distributed',
  //     });
  //     return;
  //   }
  
  //   api
  //     .post(baseURLMarket + `auction/fp/bulkSendToReadyForPaymentForSeedMarket`, {
  //       marketId: localStorage.getItem("marketId"),
  //       paymentDate: formattedDate,
  //     })
  //     .then((response) => {
  //       if (response.data.content === null) {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Error',
  //           text: response.data.errorMessages[0].message[0].message,
  //         });
  //       } else {
  //         console.log(response);
  //         saveSuccess();
  //         getAuctionDateList();
  //       }
  //     })
  //     .catch((err) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Please Distribute The Lot',
  //         text: 'Lot is not Distributed.',
  //       });
  //     });
  // };
  

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Bulk Send successfully Completed",
      // text: "You clicked the button!",
    });
    
  };

  
  return (
    <Layout title="Bulk Send To Bank" show="true">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Bulk Send To Payment</Block.Title>
          </Block.HeadContent>
         
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n4">
        <Card>
          <Card.Header className="text-center">Bulk Send To Payment</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="4">
                
                <Form.Group className="form-group">
                  <Form.Label>Date</Form.Label>
                  <div className="form-control-wrap">
                    <Form.Select
                      name="paymentDate"
                      value={data.paymentDate}
                      onChange={handleInputs}
                    >
                      <option value="0">Select Date</option>
                      {auctionDateList.map((list) => (
                        <option key={list} value={list}>
                          {list}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="g-gs">
              <Col lg="4">
                
                <div className="gap-col mt-1">
                  <ul className="">
                    <li>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={onSubmitBulkDate}
                      >
                        Update
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default BulkSendToPaymentForSeedMarket;
