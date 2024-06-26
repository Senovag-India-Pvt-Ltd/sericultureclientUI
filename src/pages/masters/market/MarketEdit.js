import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function MarketEdit() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleCheckBox = (e) => {
    setData((prev) => ({
      ...prev,
      weighmentTripletGeneration: e.target.checked,
    }));
  };

  const handleCheckBoxBidAmount = (e) => {
    setData((prev) => ({
      ...prev,
      bidAmountFlag: e.target.checked,
    }));
  };

  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      // event.stopPropagation();
      api
        .post(baseURL + `marketMaster/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              marketMasterName: "",
              marketMasterAddress: "",
              boxWeight: "",
              lotWeight: "",
              stateId: "",
              districtId: "",
              talukId: "",
              issueBidSlipStartTime: "",
              issueBidSlipEndTime: "",
              auction1StartTime: "",
              auction2StartTime: "",
              auction3StartTime: "",
              auction1EndTime: "",
              auction2EndTime: "",
              auction3EndTime: "",
              auctionAcceptance1StartTime: "",
              auctionAcceptance2StartTime: "",
              auctionAcceptance3StartTime: "",
              auctionAcceptance1EndTime: "",
              auctionAcceptance2EndTime: "",
              auctionAcceptance3EndTime: "",
              serialNumberPrefix: "",
              marketTypeMasterId: "",
              reelerMinimumBalance: "",
              marketNameInKannada: "",
              marketLatitude: "",
              marketLongitude: "",
              radius: "",
              clientId: "",
              snorkelRequestPath: "",
              snorkelResponsePath: "",
              clientCode: "",
              weighmentTripletGeneration: "",
              bidAmountFlag: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      marketMasterName: "",
      marketMasterAddress: "",
      boxWeight: "",
      lotWeight: "",
      stateId: "",
      districtId: "",
      talukId: "",
      issueBidSlipStartTime: "",
      issueBidSlipEndTime: "",
      auction1StartTime: "",
      auction2StartTime: "",
      auction3StartTime: "",
      auction1EndTime: "",
      auction2EndTime: "",
      auction3EndTime: "",
      auctionAcceptance1StartTime: "",
      auctionAcceptance2StartTime: "",
      auctionAcceptance3StartTime: "",
      auctionAcceptance1EndTime: "",
      auctionAcceptance2EndTime: "",
      auctionAcceptance3EndTime: "",
      serialNumberPrefix: "",
      marketTypeMasterId: "",
      reelerMinimumBalance: "",
      marketNameInKannada: "",
      marketLatitude: "",
      marketLongitude: "",
      radius: "",
      clientId: "",
      snorkelRequestPath: "",
      snorkelResponsePath: "",
      clientCode: "",
      weighmentTripletGeneration: "",
      bidAmountFlag: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `marketMaster/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

  // to get State
  const [stateListData, setStateListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `state/get-all`)
      .then((response) => {
        if (response.data.content.state) {
          setStateListData(response.data.content.state);
        }
      })
      .catch((err) => {
        setStateListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = (_id) => {
    const response = api
      .get(baseURL + `district/get-by-state-id/${_id}`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.stateId) {
      getDistrictList(data.stateId);
    }
  }, [data.stateId]);

  // to get taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = (_id) => {
    const response = api
      .get(baseURL + `taluk/get-by-district-id/${_id}`)
      .then((response) => {
        if (response.data.content.taluk) {
          setTalukListData(response.data.content.taluk);
        }
      })
      .catch((err) => {
        setTalukListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    if (data.districtId) {
      getTalukList(data.districtId);
    }
  }, [data.districtId]);

  // to get Market Type
  const [marketTypeListData, setMarketTypeListData] = useState([]);

  const getMarketTypeList = () => {
    const response = api
      .get(baseURL + `marketTypeMaster/get-all`)
      .then((response) => {
        setMarketTypeListData(response.data.content.marketTypeMaster);
      })
      .catch((err) => {
        setMarketTypeListData([]);
      });
  };

  useEffect(() => {
    getMarketTypeList();
  }, []);

  const navigate = useNavigate();
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
  };
  const updateError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("#"));
  };

  return (
    <Layout title="Edit Market Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Market Details</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/market-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/market-list"
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
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="name">
                        Market<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="name"
                          name="marketMasterName"
                          value={data.marketMasterName}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Market"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Market Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="name">
                        Market Name in Kannada
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="name"
                          name="marketNameInKannada"
                          value={data.marketNameInKannada}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Market Name in Kannada "
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Market Name in Kannada is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="name">
                        Serial Number Prefix
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="name"
                          name="serialNumberPrefix"
                          value={data.serialNumberPrefix}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Serial Number Prefix"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Serial Number Prefix is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="weight">
                        Tare Weight(In Kg)
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="weight"
                          name="boxWeight"
                          value={data.boxWeight}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Tare Weight"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Tare Weight(In Kg) is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="weight">
                        Lot Weight(In Kg)<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="weight"
                          name="lotWeight"
                          value={data.lotWeight}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Lot Weight"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Lot Weight(In Kg) is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    {/* <Form.Group className="form-group">
                      <Form.Label htmlFor="reelcom">
                        Reeler Commission
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="reelcom"
                          name="lotWeight"
                          value={data.lotWeight}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Reeler Commission"
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="farcom">
                        Farmer Commission
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="farcom"
                          name="lotWeight"
                          value={data.lotWeight}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Farmer Commission"
                        />
                      </div>
                    </Form.Group> */}

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="weight">
                        Reeler Minimum Balance
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="reelerMinimumBalance"
                          name="reelerMinimumBalance"
                          value={data.reelerMinimumBalance}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Reeler Minimum Balance"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Reeler Minimum Balance is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    {/* <Form.Group className="form-group">
                      <Form.Label htmlFor="reelcom">
                        Reeler Commission
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="reelcom"
                          name="lotWeight"
                          value={data.lotWeight}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Reeler Commission"
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group mt-3">
                      <Form.Label htmlFor="farcom">
                        Farmer Commission
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="farcom"
                          name="lotWeight"
                          value={data.lotWeight}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Farmer Commission"
                        />
                      </div>
                    </Form.Group> */}

                    <Row>
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidstart">
                            Issue Bidding Slip Start Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            {/* <TimePicker
                              name="issueBidSlipStartTime"
                              value={data.issueBidSlipStartTime}
                              onChange={handleTimeChange}
                              placeholder="hh:mm"
                            /> */}
                            <Form.Control
                              id="bidstart"
                              name="issueBidSlipStartTime"
                              value={data.issueBidSlipStartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter Issue Bidding Slip Start Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Issue Bidding Slip Start Time is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidend">
                            Issue Bidding Slip End Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="issueBidSlipEndTime"
                              value={data.issueBidSlipEndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid End Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Issue Bidding Slip End Time is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidstart">
                            1st Round Bid Start Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="auction1StartTime"
                              value={data.auction1StartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid Start Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              1st Round Bid Start Time is required
                            </Form.Control.Feedback>
                            {/* <TimePicker
                              name="auction1StartTime"
                              value={data.auction1StartTime}
                              placeholder="hh:mm"
                            /> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidend">
                            1st Round Bid End Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidend"
                              name="auction1EndTime"
                              value={data.auction1EndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid End Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              1st Round Bid End Time is required
                            </Form.Control.Feedback>
                            {/* <TimePicker
                              name="auction1EndTime"
                              value={data.auction1EndTime}
                              placeholder="hh:mm"
                            /> */}
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidstart">
                            1st Round Bid Acceptance Start Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="auctionAcceptance1StartTime"
                              value={data.auctionAcceptance1StartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid Start Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              1st Round Bid Acceptance Start Time is required
                            </Form.Control.Feedback>
                            {/* <TimePicker
                              name="auction1StartTime"
                              value={data.auction1StartTime}
                              placeholder="hh:mm"
                            /> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidend">
                            1st Round Bid Acceptance End Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidend"
                              name="auctionAcceptance1EndTime"
                              value={data.auctionAcceptance1EndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid End Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              1st Round Bid Acceptance End Time is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="secbidstart">
                            2nd Round Bid Start Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="secbidstart"
                              name="auction2StartTime"
                              value={data.auction2StartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 2st Round Bid Start Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              2nd Round Bid Start Time is required
                            </Form.Control.Feedback>
                            {/* <TimePicker
                              name="auction2StartTime"
                              value={data.auction2StartTime}
                              placeholder="hh:mm"
                            /> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="secbidend">
                            2nd Round Bid End Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="secbidend"
                              name="auction2EndTime"
                              value={data.auction2EndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 2st Round Bid End Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              2nd Round Bid End Time is required
                            </Form.Control.Feedback>
                            {/* <TimePicker
                              name="auction2EndTime"
                              value={data.auction2EndTime}
                              placeholder="hh:mm"
                            /> */}
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidstart">
                            2nd Round Bid Acceptance Start Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="auctionAcceptance2StartTime"
                              value={data.auctionAcceptance2StartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid Start Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              2nd Round Bid Acceptance Start Time is required
                            </Form.Control.Feedback>
                            {/* <TimePicker
                              name="auction1StartTime"
                              value={data.auction1StartTime}
                              placeholder="hh:mm"
                            /> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidend">
                            2nd Round Bid Acceptance End Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidend"
                              name="auctionAcceptance2EndTime"
                              value={data.auctionAcceptance2EndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid End Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              2nd Round Bid Acceptance End Time is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="secbidstart">
                            3rd Round Bid Start Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="secbidstart"
                              name="auction3StartTime"
                              value={data.auction3StartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 3rd Round Bid Start Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              3rd Round Bid Start Time is required
                            </Form.Control.Feedback>
                            {/* <TimePicker
                              name="auction3StartTime"
                              value={data.auction3StartTime}
                              placeholder="hh:mm"
                            /> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="secbidend">
                            3rd Round Bid End Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="secbidend"
                              name="auction3EndTime"
                              value={data.auction3EndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 3rd Round Bid End Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              3rd Round Bid End Time is required
                            </Form.Control.Feedback>
                            {/* <TimePicker
                              name="auction3EndTime"
                              value={data.auction3EndTime}
                              placeholder="hh:mm"
                            /> */}
                          </div>
                        </Form.Group>
                      </Col>

                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidstart">
                            3rd Round Bid Acceptance Start Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidstart"
                              name="auctionAcceptance3StartTime"
                              value={data.auctionAcceptance3StartTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid Start Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              3rd Round Bid Acceptance Start Time is required
                            </Form.Control.Feedback>
                            {/* <TimePicker
                              name="auction1StartTime"
                              value={data.auction1StartTime}
                              placeholder="hh:mm"
                            /> */}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="bidend">
                            3rd Round Bid Acceptance End Time
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="bidend"
                              name="auctionAcceptance3EndTime"
                              value={data.auctionAcceptance3EndTime}
                              onChange={handleInputs}
                              type="text"
                              placeholder="Enter 1st Round Bid End Time"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              3rd Round Bid Acceptance End Time is required
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="name">
                        Snorkel Request Path
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="name"
                          name="snorkelRequestPath"
                          value={data.snorkelRequestPath}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Market"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Snorkel Request Path is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="name">
                        Snorkel Response Path
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="name"
                          name="snorkelResponsePath"
                          value={data.snorkelResponsePath}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Market"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Snorkel Response Path is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="name">
                        Client Code<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="name"
                          name="clientCode"
                          value={data.clientCode}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Market"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Market Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="weight">
                        Client ID<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="clientId"
                          name="clientId"
                          value={data.clientId}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Client Id"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Client Id is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label>
                        Market Type<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="marketTypeMasterId"
                          value={data.marketTypeMasterId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.marketTypeMasterId === undefined ||
                            data.marketTypeMasterId === "0"
                          }
                        >
                          <option value="">Select Market Type</option>
                          {marketTypeListData.map((list) => (
                            <option
                              key={list.marketTypeMasterId}
                              value={list.marketTypeMasterId}
                            >
                              {list.marketTypeMasterName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Market Type Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label>
                        State<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="stateId"
                          value={data.stateId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.stateId === undefined || data.stateId === "0"
                          }
                        >
                          <option value="">Select State</option>
                          {stateListData.map((list) => (
                            <option key={list.stateId} value={list.stateId}>
                              {list.stateName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          State Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label>
                        District<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="districtId"
                          value={data.districtId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.districtId === undefined ||
                            data.districtId === "0"
                          }
                        >
                          <option value="">Select District</option>
                          {districtListData && districtListData.length
                            ? districtListData.map((list) => (
                                <option
                                  key={list.districtId}
                                  value={list.districtId}
                                >
                                  {list.districtName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          District Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label>
                        Taluk<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="talukId"
                          value={data.talukId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.talukId === undefined || data.talukId === "0"
                          }
                        >
                          <option value="">Select Taluk</option>
                          {talukListData && talukListData.length
                            ? talukListData.map((list) => (
                                <option key={list.talukId} value={list.talukId}>
                                  {list.talukName}
                                </option>
                              ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Taluk Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="chakbandi">
                        Market Coordinates
                      </Form.Label>
                      <Row>
                        <Col lg="6">
                          <Form.Control
                            id="marketLongitude"
                            name="marketLongitude"
                            value={data.marketLongitude}
                            onChange={handleInputs}
                            placeholder="Enter Longitude"
                          />
                        </Col>

                        <Col lg="6">
                          <Form.Control
                            id="marketLatitude"
                            name="marketLatitude"
                            value={data.marketLatitude}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Latitude"
                          />
                        </Col>
                      </Row>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="address">
                        Radius<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="radius"
                          name="radius"
                          value={data.radius}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Radius"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Radius is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label htmlFor="address">
                        Market Address<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          as="textarea"
                          id="address"
                          name="marketMasterAddress"
                          value={data.marketMasterAddress}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Market Address"
                          rows="6"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Market Address is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          id="weighmentTripletGeneration"
                          checked={data.weighmentTripletGeneration}
                          onChange={handleCheckBox}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                      <Form.Label column sm={11} className="mt-n2">
                        Triplet Generation After Weighment
                      </Form.Label>
                    </Form.Group>

                    <Form.Group as={Row} className="form-group">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          id="bidAmountFlag"
                          checked={data.bidAmountFlag}
                          onChange={handleCheckBoxBidAmount}
                          // Optional: disable the checkbox in view mode
                          // defaultChecked
                        />
                      </Col>
                      <Form.Label column sm={11} className="mt-n2">
                        Bid Amount Flag
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="gap-col">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  {/* <Button type="button" variant="primary" onClick={postData}> */}
                  <Button type="submit" variant="primary">
                    Update
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

export default MarketEdit;
