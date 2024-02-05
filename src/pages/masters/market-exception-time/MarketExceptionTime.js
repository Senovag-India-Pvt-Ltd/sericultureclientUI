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

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLMarket = process.env.REACT_APP_API_BASE_URL_MARKET_AUCTION;

function MarketExceptionTime() {
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
      title: "Saved successfully",
      // text: "You clicked the button!",
    });
  };
  const saveError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
    });
  };
  return (
    <Layout title="Market Exception Time">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Market Exception Time</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/market-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/market-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-n5">
        <Form >
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
                            Issue Bidding Slip Start Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="issueBidSlipStartTime"
                              value={data.issueBidSlipStartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter Issue Bidding Slip Start Time"
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
                            Issue Bidding Slip End Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="issueBidSlipEndTime"
                              value={data.issueBidSlipEndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid End Time"
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
                            1st Round Bid Start Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="auction1StartTime"
                              value={data.auction1StartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid Start Time"
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
                            1st Round Bid End Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidend"
                              name="auction1EndTime"
                              value={data.auction1EndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid End Time"
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
                            1st Round Bid Acceptance Start Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="auction1AcceptStartTime"
                              value={data.auction1AcceptStartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid Start Time"
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
                            1st Round Bid Acceptance End Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidend"
                              name="auction1AcceptEndTime"
                              value={data.auction1AcceptEndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid End Time"
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
                            2nd Round Bid Start Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="secbidstart"
                              name="auction2StartTime"
                              value={data.auction2StartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 2st Round Bid Start Time"
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
                            2nd Round Bid End Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="secbidend"
                              name="auction2EndTime"
                              value={data.auction2EndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 2st Round Bid End Time"
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
                            2nd Round Bid Acceptance Start Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="auction2AcceptStartTime"
                              value={data.auction2AcceptStartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid Start Time"
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
                            2nd Round Bid Acceptance End Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidend"
                              name="auction2AcceptEndTime"
                              value={data.auction2AcceptEndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid End Time"
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
                            3rd Round Bid Start Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="secbidstart"
                              name="auction3StartTime"
                              value={data.auction3StartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 3rd Round Bid Start Time"
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
                            3rd Round Bid End Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="secbidend"
                              name="auction3EndTime"
                              value={data.auction3EndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 3rd Round Bid End Time"
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
                            3rd Round Bid Acceptance Start Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="auction3AcceptStartTime"
                              value={data.auction3AcceptStartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid Start Time"
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
                            3rd Round Bid Acceptance End Time
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidend"
                              name="auction3AcceptEndTime"
                              value={data.auction3AcceptEndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid End Time"
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
                  <Button type="button" variant="primary" onClick={postData}>
                  {/* <Button type="submit" variant="primary"> */}
                    Save
                  </Button>
                </li>
                <li>
                  <Button type="button" variant="secondary" onClick={clear}>
                    Cancel
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

export default MarketExceptionTime;
