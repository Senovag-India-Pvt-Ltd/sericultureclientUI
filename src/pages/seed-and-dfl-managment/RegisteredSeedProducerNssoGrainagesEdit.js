import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import api from "../../services/auth/api";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURL2 = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function RegisteredSeedProducerNssoGrainagesEdit() {
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
        .post(baseURL2 + `TestingOfMuth/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              lotNumber: "",
              pebrine: "",
              sourceDetails: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          // const message = err.response.data.errorMessages[0].message[0].message;
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      lotNumber: "",
      pebrine: "",
      sourceDetails: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL2 + `TestingOfMoth/get-info-by-id/${id}`)
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

  const navigate = useNavigate();

  const updateSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
      text: message,
    });
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
      title: "Attempt was not successful",
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
    <Layout title="Edit Registered Seed Producer (RSP) NSSO Grainages">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Edit Registered Seed Producer (RSP) NSSO Grainages
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/registered-seed-producer-nsso-grainages-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/registered-seed-producer-nsso-grainages-list"
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
              Registered Seed Producer (RSP) NSSO Grainages{" "}
            </Card.Header>
            <Card.Body>
              <Row className="g-gs">
                <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="sordfl">
                      Name of the Grainage and Address
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        type="text"
                        value={data.farmerName}
                        onChange={handleInputs}
                        placeholder="Enter Name of the Grainage and Address
"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Name of the Grainage and Address is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="sordfl">
                      Lot number/Year
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        type="text"
                        value={data.farmerName}
                        onChange={handleInputs}
                        placeholder="Enter Lot number/Year
"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Lot number/Year is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="sordfl">
                      Number of Cocoons (CB, Hybrid)
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        type="text"
                        value={data.farmerName}
                        onChange={handleInputs}
                        placeholder="Enter Number of Cocoons"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Number of Cocoons is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label htmlFor="sordfl">
                      Date of moth emergence
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.dateOfPlanting}
                        onChange={(date) =>
                          handleDateChange(date, "dateOfPlanting")
                        }
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="sordfl">
                      Egg sheet serial number
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        type="text"
                        value={data.farmerName}
                        onChange={handleInputs}
                        placeholder="Enter Egg sheet serial number
"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Egg sheet serial number is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="sordfl">
                      Number of pairs
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        type="text"
                        value={data.farmerName}
                        onChange={handleInputs}
                        placeholder="Enter Number of pairs"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Number of pairs is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="sordfl">
                      Number of Rejection
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        type="text"
                        value={data.farmerName}
                        onChange={handleInputs}
                        placeholder="Enter Number of Rejection"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Number of Rejection is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="sordfl">
                      DFLs obtained
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        type="text"
                        value={data.farmerName}
                        onChange={handleInputs}
                        placeholder="Enter DFLs obtained"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        DFLs obtained is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="sordfl">
                      Egg Recovery %<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        type="text"
                        value={data.farmerName}
                        onChange={handleInputs}
                        placeholder="Enter Egg Recovery %"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Egg Recovery % is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="sordfl">
                      Examination details (Date, etc)
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        type="text"
                        value={data.farmerName}
                        onChange={handleInputs}
                        placeholder="Enter Examination details (Date, etc)"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Examination details (Date, etc) is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="sordfl">
                      Test results
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        type="text"
                        value={data.farmerName}
                        onChange={handleInputs}
                        placeholder="Enter Test results"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Test results is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="sordfl">
                      Certification (Yes/No)
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        type="text"
                        value={data.farmerName}
                        onChange={handleInputs}
                        placeholder="Enter Certification (Yes/No)"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Certification (Yes/No) is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="4">
                  <Form.Group className="form-group mt-n3">
                    <Form.Label htmlFor="sordfl">
                      Additional remarks
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Control
                        id="farmerName"
                        name="farmerName"
                        type="text"
                        value={data.farmerName}
                        onChange={handleInputs}
                        placeholder="Enter Additional remarks"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Additional remarks is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                {/* <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label>
                          Race<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="mulberryVarietyId"
                            value={data.mulberryVarietyId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            // multiple
                            required
                            isInvalid={
                              data.mulberryVarietyId === undefined ||
                              data.mulberryVarietyId === "0"
                            }
                          >
                            <option value="">Select Race</option>
                            {varietyListData.map((list) => (
                              <option
                                key={list.mulberryVarietyId}
                                value={list.mulberryVarietyId}
                              >
                                {list.mulberryVarietyName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Race is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="sordfl">
                          Number of DFLs disposed
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="area"
                            name="area"
                            value={data.area}
                            onChange={handleInputs}
                            type="text"
                            maxLength="4"
                            placeholder="Enter Number of DFLs disposed"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Number of DFLs disposed is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col> */}

                {/* <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Nursery sale details
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="nurserySaleDetails"
                                  name="nurserySaleDetails"
                                  type="text"
                                  value={data.nurserySaleDetails}
                                  onChange={handleInputs}
                                  placeholder="Enter Nursery sale details"
                                />
                              </div>
                            </Form.Group>
                          </Col> */}

                {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Name and address of the farm / farmer / CRC
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="quantity"
                            name="quantity"
                            value={data.quantity}
                            onChange={handleInputs}
                            type="text"
                            maxLength="5"
                            placeholder=" Enter Name and address of the farm / farmer / CRC"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Name and address of the farm / farmer / CRC is
                            required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Date of disposal<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.dateOfPlanting}
                            onChange={(date) =>
                              handleDateChange(date, "dateOfPlanting")
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

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Rate per 100 DFLs Price (in Rupees)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="rate"
                            name="rate"
                            value={data.rate}
                            onChange={handleInputs}
                            type="text"
                            maxLength="3"
                            placeholder="Enter Rate per 100 DFLs Price"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Rate per 100 DFLs Price is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col> */}

                {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Sapling age in Month/Year
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="saplingAge"
                            name="saplingAge"
                            value={data.saplingAge}
                            onChange={handleInputs}
                            type="text"
                            placeholder="Enter Sapling age in Month/Year"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Sapling age in Month/Year is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col> */}

                {/* <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Generate Recipt
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="generateRecipt"
                                  name="generateRecipt"
                                  type="text"
                                  value={data.generateRecipt}
                                  onChange={handleInputs}
                                  placeholder="Generate Recipt"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Receipt number
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="receiptNumber"
                                  name="receiptNumber"
                                  type="text"
                                  value={data.receiptNumber}
                                  onChange={handleInputs}
                                  placeholder="Enter Receipt number"
                                />
                              </div>
                            </Form.Group>
                          </Col> */}

                {/* <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Remittance details
                          <span className="text-danger">*</span>
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="remittanceDetails"
                            name="remittanceDetails"
                            type="text"
                            value={data.remittanceDetails}
                            onChange={handleInputs}
                            placeholder="Enter Remittance details"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Remittance details is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="2">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="sordfl">
                          Date of planting<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.dateOfPlanting}
                            onChange={(date) =>
                              handleDateChange(date, "dateOfPlanting")
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
                          Sale Date<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <DatePicker
                            selected={data.date}
                            onChange={(date) => handleDateChange(date, "date")}
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

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label htmlFor="challanUploadKey">
                          Upload Challan
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            type="file"
                            id="challanUploadKey"
                            name="challanUploadKey"
                            // value={data.photoPath}
                            onChange={handleChallanChange}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="form-group mt-3 d-flex justify-content-center">
                        {challan ? (
                          <img
                            style={{ height: "100px", width: "100px" }}
                            src={URL.createObjectURL(challan)}
                          />
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col> */}
              </Row>
            </Card.Body>
          </Card>

          <div className="gap-col mt-1">
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

export default RegisteredSeedProducerNssoGrainagesEdit;
