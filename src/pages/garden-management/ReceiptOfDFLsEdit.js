import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

// const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function ReceiptOfDFLsEdit() {
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const isDataLaidSet = !!data.laidOnDate;

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
        .post(baseURL2 + `Receipt/update-info`, data)
        .then((response) => {
          //   const trScheduleId = response.data.content.trScheduleId;
          //   if (trScheduleId) {
          //     handlePPtUpload(trScheduleId);
          //   }
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              lineNumber: "",
              lineOfDFLs: "",
              laidOnDate: "",
              lotNumber: "",
              numberOfDFLsReceived: "",
              invoiceDetails: "",
              wormTestDetails: "",
              generationDetails: "",
              viewReceipt: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          updateError();
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      lineNumber: "",
      lineOfDFLs: "",
      laidOnDate: "",
      lotNumber: "",
      numberOfDFLsReceived: "",
      invoiceDetails: "",
      wormTestDetails: "",
      generationDetails: "",
      viewReceipt: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `Receipt/get-info-by-id/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        // const message = err.response.data.errorMessages[0].message[0].message;
        setData({});
        // editError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIdList();
  }, [id]);

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
      .post(
        `https://api.senovagseri.com/reports-uat/marketreport/gettripletpdf-kannada`,
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

  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
  };
  const updateError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Save attempt was not successful",
      text: message,
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
    <Layout title="Edit Receipt Of DFLs">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Receipt Of DFLs</Block.Title>
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

      <Block className="mt-n5">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <Row className="g-gs">
                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="plotNumber">
                          Line Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="lineNumber"
                            name="lineNumber"
                            value={data.lineNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter  Line Number"
                            required
                          />
                        </div>
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        Line Number is required
                      </Form.Control.Feedback>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="plotNumber">
                          Line Of DFLs<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="lineOfDFLs"
                            name="lineOfDFLs"
                            value={data.lineOfDFLs}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Line Of DFLs"
                            required
                          />
                        </div>
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        Line Of DFLs is required
                      </Form.Control.Feedback>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="plotNumber">
                          Lot Number<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="lotNumber"
                            name="lotNumber"
                            value={data.lotNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Lot Number"
                            required
                          />
                        </div>
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        Lot Number is required
                      </Form.Control.Feedback>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="numberOfDFLsReceived">
                          Number Of DFLs received
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="numberOfDFLsReceived"
                            name="numberOfDFLsReceived"
                            value={data.numberOfDFLsReceived}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Number Of DFLs received"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Form.Label column sm={2}>
                      Laid On Date
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={2}>
                      <div className="form-control-wrap">
                        {isDataLaidSet && (
                          <DatePicker
                            selected={new Date(data.laidOnDate)}
                            onChange={(date) =>
                              handleDateChange(date, "laidOnDate")
                            }
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                          />
                        )}
                      </div>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="invoiceDetails">
                          Invoice No
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="invoiceDetails"
                            name="invoiceDetails"
                            value={data.invoiceDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Invoice No"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="invoiceDetails">
                          Worm Test Details and result
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="wormTestDetails"
                            name="wormTestDetails"
                            value={data.wormTestDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Worm Test Details"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="invoiceDetails">
                          Generation Details
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="generationDetails"
                            name="generationDetails"
                            value={data.generationDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Generation Details"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                      <Button type="button" onClick={postDataReceipt}>
                        View Invoice
                      </Button>
                    </Col>

                    {/* <Col lg="4">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="viewReceipt">Worm Test Details and result</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                id="viewReceipt"
                                name="viewReceipt"
                                value={data.viewReceipt}
                                onChange={handleInputs}
                                type="text"
                                placeholder="View Receipt"
                              />
                            </div>
                          </Form.Group>
                          <Button type="button" onClick={postDataReceipt}>Generate Receipt</Button>
                        </Col> */}
                  </Row>
                )}
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

export default ReceiptOfDFLsEdit;
