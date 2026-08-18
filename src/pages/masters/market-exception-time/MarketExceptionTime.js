import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../../components";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
// import TimePicker from 'react-time-picker';
import api from "../../../../src/services/auth/api";
import TimePicker from "../../../components/Form/TimePicker";
import { useTranslation } from "react-i18next";


const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function MarketExceptionTime() {
  // Translation
           const { t } = useTranslation();
  const [data, setData] = useState({
    marketId: localStorage.getItem("marketId"),
    godownId: localStorage.getItem("godownId"),
    issueBidSlipStartTime: "",
    issueBidSlipEndTime: "",
    auction1StartTime: "",
    auction2StartTime: "",
    auction3StartTime: "",
    auction1EndTime: "",
    auction2EndTime: "",
    auction3EndTime: "",
    auction1AcceptStartTime: "",
    auction2AcceptStartTime: "",
    auction3AcceptStartTime: "",
    auction1AcceptEndTime: "",
    auction2AcceptEndTime: "",
    auction3AcceptEndTime: "",
  });

  const handleTimeChange = (selectedTime) => {
    // setData({
    //   ...data,
    //   issueBidSlipStartTime: selectedTime,
    // });
    console.log(selectedTime);
    setData((prev) => ({ ...prev, issueBidSlipStartTime: selectedTime }));
  };

  // const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  const _header = { "Content-Type": "application/json", accept: "*/*" };

  // to get exception time
  const getExceptionTime = () => {
    api
      .post(baseURLMarket + `auction/misc/getExceptionalTime`, data)
      .then((response) => {
        if (response.data.content) {
          setData((prev) => ({ ...prev, ...response.data.content }));
        }
      })
      .catch((err) => {
        // setStateListData([]);
      });
  };

  useEffect(() => {
    getExceptionTime();
  }, []);

  const postData = (event) => {
    // const form = event.currentTarget;
    // if (form.checkValidity() === false) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   setValidated(true);
    // } else {
    //   event.preventDefault();
    //   // event.stopPropagation();
    api
      .post(baseURLMarket + `auction/misc/updateExceptionalTime`, data)
      .then((response) => {
        if (response.data.errorCode === 0) {
          saveSuccess();
        } else if (response.data.errorCode === -1) {
          saveError(response.data.errorMessages[0].message[0].message);
        }
        //   if (response.data.content.error) {
        //     saveError(response.data.content.error_description);
        //   } else {
        //     saveSuccess();
        //     setData({
        //       issueBidSlipStartTime: "",
        //       issueBidSlipEndTime: "",
        //       auction1StartTime: "",
        //       auction2StartTime: "",
        //       auction3StartTime: "",
        //       auction1EndTime: "",
        //       auction2EndTime: "",
        //       auction3EndTime: "",
        //       auctionAcceptance1StartTime: "",
        //       auctionAcceptance2StartTime: "",
        //       auctionAcceptance3StartTime: "",
        //       auctionAcceptance1EndTime: "",
        //       auctionAcceptance2EndTime: "",
        //       auctionAcceptance3EndTime: "",
        //     });
        //     setValidated(false);
        //   }
      })
      .catch((err) => {
        saveError();
      });
    //   setValidated(true);
    // }
  };

  const clear = () => {
    setData({
      issueBidSlipStartTime: "",
      issueBidSlipEndTime: "",
      auction1StartTime: "",
      auction2StartTime: "",
      auction3StartTime: "",
      auction1EndTime: "",
      auction2EndTime: "",
      auction3EndTime: "",
      auction1AcceptStartTime: "",
      auction2AcceptStartTime: "",
      auction3AcceptStartTime: "",
      auction1AcceptEndTime: "",
      auction2AcceptEndTime: "",
      auction3AcceptEndTime: "",
    });
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: t("Saved successfully"),
      // text: "You clicked the button!",
    });
  };
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: t("Save attempt was not successful"),
      text: message,
    });
  };
  return (
    <Layout title={t("Market Exception Time")}>
      <style>{marketExceptionTimeStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">{t("Market Exception Time")}</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/market-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/market-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>{t("Go To List")}</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        <Form>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="12">
                    <Row>
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidstart">
                            {t("Issue Bidding Slip Start Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="issueBidSlipStartTime"
                              value={data.issueBidSlipStartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter Issue Bidding Slip Start Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              Issue Bidding Slip Start Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidend">
                            {t("Issue Bidding Slip End Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="issueBidSlipEndTime"
                              value={data.issueBidSlipEndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter Issue Bidding Slip End Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              Issue Bidding Slip End Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidstart">
                            {t("1st Round Bid Start Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="auction1StartTime"
                              value={data.auction1StartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter 1st Round Bid Start Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              1st Round Bid Start Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidend">
                            {t("1st Round Bid End Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidend"
                              name="auction1EndTime"
                              value={data.auction1EndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter 1st Round Bid End Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              1st Round Bid End Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidstart">
                            {t("1st Round Bid Acceptance Start Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="auction1AcceptStartTime"
                              value={data.auction1AcceptStartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter 1st Round Bid Acceptance Start Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              1st Round Bid Acceptance Start Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidend">
                            {t("1st Round Bid Acceptance End Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidend"
                              name="auction1AcceptEndTime"
                              value={data.auction1AcceptEndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter 1st Round Bid Acceptance End Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              1st Round Bid Acceptance End Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="secbidstart">
                            {t("2nd Round Bid Start Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="secbidstart"
                              name="auction2StartTime"
                              value={data.auction2StartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter 2nd Round Bid Start Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              2nd Round Bid Start Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="secbidend">
                            {t("2nd Round Bid End Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="secbidend"
                              name="auction2EndTime"
                              value={data.auction2EndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter 2nd Round Bid End Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              2nd Round Bid End Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidstart">
                            {t("2nd Round Bid Acceptance Start Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="auction2AcceptStartTime"
                              value={data.auction2AcceptStartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter 2nd Round Bid Acceptance Start Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              2nd Round Bid Acceptance Start Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidend">
                            {t("2nd Round Bid Acceptance End Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidend"
                              name="auction2AcceptEndTime"
                              value={data.auction2AcceptEndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter 2nd Round Bid Acceptance End Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              2nd Round Bid Acceptance End Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="secbidstart">
                            {t("3rd Round Bid Start Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="secbidstart"
                              name="auction3StartTime"
                              value={data.auction3StartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter 3rd Round Bid Start Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              3rd Round Bid Start Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="secbidend">
                            {t("3rd Round Bid End Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="secbidend"
                              name="auction3EndTime"
                              value={data.auction3EndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter 3rd Round Bid End Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              3rd Round Bid End Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidstart">
                            {t("3rd Round Bid Acceptance Start Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="auction3AcceptStartTime"
                              value={data.auction3AcceptStartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter 3rd Round Bid Acceptance Start Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              3rd Round Bid Acceptance Start Time is required
                            </Form.Control.Feedback> */}
                            {/* <TimePicker
                              name="auction1StartTime"
                              value={data.auction1StartTime}
                              placeholder="hh:mm"
                            /> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidend">
                            {t("3rd Round Bid Acceptance End Time")}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidend"
                              name="auction3AcceptEndTime"
                              value={data.auction3AcceptEndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder={t("Enter 3rd Round Bid Acceptance End Time")}
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                              3rd Round Bid Acceptance End Time is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <Button type="button" variant="primary" onClick={postData} className="sh-save-btn">
                    {/* <Button type="submit" variant="primary"> */}
                    <Icon name="save" />
                    {t("save")}
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                  <Icon name="cross" />
                  {t("cancel")}
                  </Button>
                </li>
              </ul>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

const marketExceptionTimeStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-form-wrap .card-header {
    border-bottom: none !important;
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important;
    color: #ffffff !important;
    padding: 14px 20px !important;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #2b3a55;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1px solid #dbe4f0;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #3b8dd6;
    box-shadow: 0 0 0 0.2rem rgba(59, 141, 214, 0.15);
  }
  .sh-save-btn {
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border: none !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
  }
  .sh-cancel-btn {
    background: #ffffff !important;
    color: #c43257 !important;
    border: 1px solid #e3496a !important;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
  }
  .sh-cancel-btn:hover {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%) !important;
    color: #ffffff !important;
    border-color: transparent !important;
  }
`;

export default MarketExceptionTime;
