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

function SeedCuttingBankEdit() {
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

  const isDataPruningSet = !!data.dateOfPruning;

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
        .post(baseURL2 + `seed-cutting/update-info`, data)
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
              fruitsId: "",
              farmerName: "",
              quantityOfSeedCuttings: "",
              dateOfPruning: "",
              ratePerTonne: "",
              generateReceipt: "",
              receiptNumber: "",
              remittanceDetails: "",
              challanUpload: "",
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
      fruitsId: "",
      farmerName: "",
      quantityOfSeedCuttings: "",
      dateOfPruning: "",
      ratePerTonne: "",
      generateReceipt: "",
      receiptNumber: "",
      remittanceDetails: "",
      challanUpload: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `seed-cutting/get-info-by-id/${id}`)
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

  const [ppt, setPPt] = useState("");
  // const [photoFile,setPhotoFile] = useState("")

  const handlePPtChange = (e) => {
    const file = e.target.files[0];
    setPPt(file);
    setData((prev) => ({ ...prev, trUploadPath: file.name }));
    // setPhotoFile(file);
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
    <Layout title="Edit Seed Cutting Bank">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Seed Cutting Bank</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/seed-cutting-bank-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/seed-cutting-bank-list"
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
                          Fruits Id<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="fruitsId"
                            name="fruitsId"
                            value={data.fruitsId}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Fruits Id"
                            required
                          />
                        </div>
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        Fruits Id is required
                      </Form.Control.Feedback>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="plotNumber">
                          Farmer Name<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="farmerName"
                            name="farmerName"
                            value={data.farmerName}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Farmer Name"
                            required
                          />
                        </div>
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        Farmer Name is required
                      </Form.Control.Feedback>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="plotNumber">
                          Quantity Of Seed Cuttings
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="quantityOfSeedCuttings"
                            name="quantityOfSeedCuttings"
                            value={data.quantityOfSeedCuttings}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Quantity Of Seed Cuttings"
                            required
                          />
                        </div>
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        Quantity Of Seed Cuttings is required
                      </Form.Control.Feedback>
                    </Col>

                    <Form.Label column sm={2}>
                      Date Of Pruning
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Col sm={2}>
                      <div className="form-control-wrap">
                        {isDataPruningSet && (
                          <DatePicker
                            selected={new Date(data.dateOfPruning)}
                            onChange={(date) =>
                              handleDateChange(date, "dateOfPruning")
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
                        <Form.Label htmlFor="ratePerTonne">
                          Rate Per Tonne
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="ratePerTonne"
                            name="ratePerTonne"
                            value={data.ratePerTonne}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Rate Per Tonne"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="ratePerTonne">
                          Receipt Number
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="receiptNumber"
                            name="receiptNumber"
                            value={data.receiptNumber}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter  Receipt Number"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="ratePerTonne">
                          Remittance Details
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="remittanceDetails"
                            name="remittanceDetails"
                            value={data.remittanceDetails}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter  Remittance Details"
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="challanUpload">
                          Challan Upload
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="challanUpload"
                            name="challanUpload"
                            // value={data.photoPath}
                            onChange={handlePPtChange}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3 d-flex justify-content-center">
                        {ppt ? (
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={URL.createObjectURL(ppt)}
                          />
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                      <Button type="button" onClick={postDataReceipt}>
                        View Invoice
                      </Button>
                    </Col>
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

export default SeedCuttingBankEdit;