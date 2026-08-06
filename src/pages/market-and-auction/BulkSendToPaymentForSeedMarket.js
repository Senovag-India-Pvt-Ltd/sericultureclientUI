import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useTranslation } from "react-i18next"; // Add this line



import {
  Icon,
  CustomDropdownToggle,
  CustomDropdownMenu,
} from "../../components";

import api from "../../services/auth/api";
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

const bulkSendToPaymentForSeedMarketStyles = `
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
  .sh-section-header {
    display: flex; align-items: center; gap: 10px; font-weight: 700 !important; font-size: 1rem !important;
    letter-spacing: 0.3px; background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important; color: #ffffff !important; padding: 14px 20px !important; border-bottom: none !important;
    justify-content: center;
  }
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
  .sh-swal-popup { border-radius: 14px !important; }
  .sh-swal-confirm { background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important; border-radius: 8px !important; font-weight: 600 !important; }
  .sh-swal-cancel { background: #ffffff !important; color: #c43257 !important; border: 1px solid #e3496a !important; border-radius: 8px !important; font-weight: 600 !important; }
`;

function BulkSendToPaymentForSeedMarket() {

   const { t } = useTranslation(); 
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
        title: t('This Lot is not distributed'),
        customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
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
                    title: t('Distribute the Lot'),
                    text: msg.message,
                    customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
                  });
                }
              });
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: t('An error occurred'),
            text: t('Please try again later.'),
            customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
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
      title: t("Bulk Send successfully Completed"),
      // text: "You clicked the button!",
      customClass: { popup: "sh-swal-popup", confirmButton: "sh-swal-confirm", cancelButton: "sh-swal-cancel" },
    });
    
  };

  
  return (
    <Layout title={t("Bulk Send To Bank")} show="true">
      <style>{bulkSendToPaymentForSeedMarketStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2" className="sh-page-title">{t("Bulk Send To Payment")}</Block.Title>
          </Block.HeadContent>

        </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Card>
          <Card.Header className="sh-section-header">{t("Bulk Send To Payment")}</Card.Header>
          <Card.Body>
            <Row className="g-gs">
              <Col lg="4">
                
                <Form.Group className="form-group">
                  <Form.Label>{t("Date")}</Form.Label>
                  <div className="form-control-wrap">
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
                        className="sh-save-btn"
                        onClick={onSubmitBulkDate}
                      >
                        {t("Update")}
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
