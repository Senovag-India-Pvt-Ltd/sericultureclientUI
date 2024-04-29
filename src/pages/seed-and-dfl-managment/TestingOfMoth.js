import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLSeedDfl = process.env.REACT_APP_API_BASE_URL_SEED_DFL;
// const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;


function TestingOfMoth() {
  const [data, setData] = useState({
    lotNumber: "",
    pebrineFreeStatusOfPupaAndMoth: "",
    sourceDetails: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  // const handleDateChange = (newDate) => {
  //   setData({ ...data, applicationDate: newDate });
  // };

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
        .post(baseURLSeedDfl + `Testing/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
                lotNumber: "",
                pebrineFreeStatusOfPupaAndMoth: "",
                sourceDetails: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            saveError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
        lotNumber: "",
        pebrineFreeStatusOfPupaAndMoth: "",
        sourceDetails: "",
    });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // to get Lot
  const [lotListData, setLotListData] = useState([]);

  const getLotList = () => {
    const response = api
      .get(baseURLSeedDfl + `EggPreparation/get-all-lot-number-list`)
      .then((response) => {
        setLotListData(response.data);
      })
      .catch((err) => {
        setLotListData([]);
      });
  };

  useEffect(() => {
    getLotList();
  }, []);

  
  const navigate = useNavigate();
  const saveSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      text: message,
    });
  };
  const saveError = (message) => {
    let errorMessage;
    if (typeof message === "object") {
      errorMessage = Object.values(message).join("<br>");
    } else {
      errorMessage = message;
    }
    Swal.fire({
      icon: "error",
      title: "Attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Testing Of Moth/Pupa">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
            Testing Of Moth/Pupa
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/testing-of-moth-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/testing-of-moth-list"
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

      <Block className="mt-n4">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          {/* <Row className="g-3 "> */}
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              Testing Of Moth/Pupa
            </Card.Header>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">
                {/* <Col lg="4" >
                  <Form.Group className="form-group ">
                    <Form.Label htmlFor="plotNumber">
                      Lot Number<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="lotNumber"
                        name="lotNumber"
                        value={data.lotNumber}
                        onChange={handleInputs}
                        maxLength="12"
                        type="text"
                        placeholder="Enter Lot Number"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Lot Number is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label>
                    Lot Number<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="lotNumber"
                          value={data.lotNumber}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                        >
                          <option value="">Select Lot Number</option>
                          {lotListData && lotListData.length?(lotListData.map((list) => (
                            <option
                              key={list.id}
                              value={list.lotNumber}
                            >
                              {list.lotNumber}
                            </option>
                          ))):""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Lot Number is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>


                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      Pebrine Free Status Of Pupa & Moth
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="pebrinePupaMoth"
                        name="pebrineFreeStatusOfPupaAndMoth"
                        value={data.pebrineFreeStatusOfPupaAndMoth}
                        onChange={handleInputs}
                        // maxLength="4"
                        type="text"
                        placeholder="Enter Pebrine Free Status Of Pupa & Moth"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Pebrine Free Status Of Pupa & Moth is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="invoiceDetails">
                      Source Details<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="sourceDetails"
                        name="sourceDetails"
                        value={data.sourceDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Source Details"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                      Source Details is required
                      </Form.Control.Feedback>
                    </div>
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
          {/* </Row> */}
        </Form>
      </Block>
    </Layout>
  );
}
export default TestingOfMoth;
