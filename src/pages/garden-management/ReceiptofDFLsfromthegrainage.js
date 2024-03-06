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
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;
const baseURLReport = process.env.REACT_APP_API_BASE_URL_REPORT;


function ReceiptofDFLsfromthegrainage() {
  const [data, setData] = useState({
    raceOfDfls: "",
    laidOnDate: "",
    grainage: "",
    lotNumber: "",
    numberOfDFLsReceived: "",
    dflsRecDate: "",
    invoiceDetails: "",
    generationDetails: "",
    viewReceipt: "",
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
        .post(baseURL2 + `Receipt/add-info`, data)
        .then((response) => {
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
              raceOfDfls: "",
              laidOnDate: "",
              grainage: "",
              lotNumber: "",
              numberOfDFLsReceived: "",
              dflsRecDate: "",
              invoiceDetails: "",
              generationDetails: "",
              viewReceipt: "",
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
      raceOfDfls: "",
      laidOnDate: "",
      grainage: "",
      lotNumber: "",
      numberOfDFLsReceived: "",
      dflsRecDate: "",
      invoiceDetails: "",
      generationDetails: "",
      viewReceipt: "",
    });
  };

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // to get Race
  const [raceListData, setRaceListData] = useState([]);

  const getRaceList = () => {
    const response = api
      .get(baseURL + `raceMaster/get-all`)
      .then((response) => {
        setRaceListData(response.data.content.raceMaster);
      })
      .catch((err) => {
        setRaceListData([]);
      });
  };

  useEffect(() => {
    getRaceList();
  }, []);

  // to get Grainage
  const [grainageListData, setGrainageListData] = useState([]);

  const getGrainageList = () => {
    const response = api
      .get(baseURL + `grainageMaster/get-all`)
      .then((response) => {
        setGrainageListData(response.data.content.grainageMaster);
      })
      .catch((err) => {
        setGrainageListData([]);
      });
  };

  useEffect(() => {
    getGrainageList();
  }, []);

  // to get Grainage
  const [generationListData, setGenerationListData] = useState([]);

  const getGenerationList = () => {
    const response = api
      .get(baseURL + `generationNumberMaster/get-all`)
      .then((response) => {
        setGenerationListData(response.data.content.generationNumberMaster);
      })
      .catch((err) => {
        setGenerationListData([]);
      });
  };

  useEffect(() => {
    getGenerationList();
  }, []);

  const postDataReceipt = (event) => {
    const { marketId, godownId, allottedLotId, auctionDate } = data;
    const newDate = new Date(auctionDate);
    const formattedDate =
      newDate.getFullYear() +
      "-" +
      (newDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      newDate.getDate().toString().padStart(2, "0");

    const form = event.currentTarget;
    // if (form.checkValidity() === false) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   setValidated(true);
    // } else {
    //   event.preventDefault();
    // event.stopPropagation();
    api
      .post(baseURLReport +
        `gettripletpdf-kannada`,
        {
          marketId: marketId,
          godownId: godownId,
          allottedLotId: allottedLotId,
          auctionDate: formattedDate,
        },
        {
          responseType: "blob", //Force to receive data in a Blob Format
        }
      )
      .then((response) => {
        //console.log("hello world", response.data);
        //Create a Blob from the PDF Stream
        const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        window.open(fileURL);
      })
      .catch((error) => {
        // console.log("error", error);
      });
  };

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
    <Layout title="Receipt of DFLs from the grainage">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Receipt of DFLs from the grainage
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/receipt-of-dfls-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/receipt-of-dfls-list"
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
              Receipt Of DFLs From The Grainage
            </Card.Header>
            <Card.Body>
              {/* <h3>Farmers Details</h3> */}
              <Row className="g-gs">
                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Race<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="raceOfDfls"
                          value={data.raceOfDfls}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                        >
                          <option value="">Select Race</option>
                          {raceListData.map((list) => (
                            <option
                              key={list.raceMasterId}
                              value={list.raceMasterId}
                            >
                              {list.raceMasterName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Race is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Grainage<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="grainage"
                          value={data.grainage}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                        >
                          <option value="">Select Grainage</option>
                          {grainageListData.map((list) => (
                            <option
                              key={list.grainageMasterId}
                              value={list.grainageMasterId}
                            >
                              {list.grainageMasterName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Grainage is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
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
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="numberOfDFLsReceived">
                      Number Of DFLs received
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="numberOfDFLsReceived"
                        name="numberOfDFLsReceived"
                        value={data.numberOfDFLsReceived}
                        onChange={handleInputs}
                        maxLength="4"
                        type="text"
                        placeholder="Enter Number Of DFLs received"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Number Of DFLs is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="invoiceDetails">
                      Invoice No<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="invoiceDetails"
                        name="invoiceDetails"
                        value={data.invoiceDetails}
                        onChange={handleInputs}
                        type="text"
                        placeholder="Enter Invoice No"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Invoice Details is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Generation Details<span className="text-danger">*</span>
                    </Form.Label>
                    <Col>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="generationDetails"
                          value={data.generationDetails}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                        >
                          <option value="">Select Generation Details</option>
                          {generationListData.map((list) => (
                            <option
                              key={list.generationNumberId}
                              value={list.generationNumberId}
                            >
                              {list.generationNumber}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Generation Details is required
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Form.Group>
                </Col>

                <Col lg="2">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      Laid On Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.laidOnDate}
                        onChange={(date) =>
                          handleDateChange(date, "laidOnDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="2">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      DFLs received Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.dflsRecDate}
                        onChange={(date) =>
                          handleDateChange(date, "dflsRecDate")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        required
                      />
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
export default ReceiptofDFLsfromthegrainage;
