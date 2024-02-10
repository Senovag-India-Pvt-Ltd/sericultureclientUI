import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import api from "../../../src/services/auth/api";

import { Link, useParams } from "react-router-dom";

const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceandSaleofNurserytoFarmersEdit() {
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
        .post(baseURL + `Maintenance-sale/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError();
          } else {
            updateSuccess();
          }
        })
        .catch((err) => {
          setData({});
          updateError();
        });
      setValidated(true);
    }
  };

  // const [chawkiList ,setChawkiList]= useState({
  //   chawki_id: "",
  // })

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    // const chowki_id = chawkiList.chowki_id;
    const response = api
      .get(baseURL + `Maintenance-sale/get-info-by-id/${id}`)
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  return (
    <Layout title="Maintenance and Sale of Nursery to Farmers ">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Maintenance and Sale of Nursery to Farmers
            </Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                {/* <li className="breadcrumb-item">
                  <Link to="#">Renew License to Reeler List</Link>
                </li> */}
                <li className="breadcrumb-item active" aria-current="page">
                  Maintenance and Sale of Nursery to Farmers
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Maintenance-and-Sale-of-Nursery-to-Farmers"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Maintenance-and-Sale-of-Nursery-to-Farmers"
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

      <Block className="mt-4">
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <div>
              <Row className="g-gs">
                <Col lg="12">
                  <Block>
                    <Card>
                      <Card.Header>
                        Maintenance and Sale of Nursery to Farmers{" "}
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-gs">
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                FRUITS-ID
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="fruitsId"
                                  name="fruitsId"
                                  type="text"
                                  value={data.fruitsId}
                                  onChange={handleInputs}
                                  placeholder=" FRUITS-ID"
                                  required
                                />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Farmer’s name
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="farmerName"
                                  name="farmerName"
                                  type="text"
                                  value={data.farmerName}
                                  onChange={handleInputs}
                                  placeholder="Farmer’s name"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Mulberry variety
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="mulberryVariety"
                                  name="mulberryVariety"
                                  type="text"
                                  value={data.mulberryVariety}
                                  onChange={handleInputs}
                                  placeholder="Mulberry variety"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">Area</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="area"
                                  name="area"
                                  type="text"
                                  value={data.area}
                                  onChange={handleInputs}
                                  placeholder="Area"
                                />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Date of planting
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
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
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
                                  placeholder="Nursery sale details"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">quantity</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="quantity"
                                  name="quantity"
                                  type="text"
                                  value={data.quantity}
                                  onChange={handleInputs}
                                  placeholder=" quantity"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">date</Form.Label>
                              <div className="form-control-wrap">
                                <DatePicker
                                  selected={data.date}
                                  onChange={(date) =>
                                    handleDateChange(date, "date")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">rate</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="rate"
                                  name="rate"
                                  type="text"
                                  value={data.rate}
                                  onChange={handleInputs}
                                  placeholder="rate"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                sapling age in Month/Year
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="saplingAge"
                                  name="saplingAge"
                                  type="text"
                                  value={data.saplingAge}
                                  onChange={handleInputs}
                                  placeholder="sapling age in Month/Year"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
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
                            <Form.Group className="form-group">
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
                                  placeholder="Receipt number"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Remittance details
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="remittanceDetails"
                                  name="remittanceDetails"
                                  type="text"
                                  value={data.remittanceDetails}
                                  onChange={handleInputs}
                                  placeholder="Remittance details"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="sordfl">
                                Challan Upload
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="challanUpload"
                                  name="challanUpload"
                                  type="text"
                                  value={data.challanUpload}
                                  onChange={handleInputs}
                                  placeholder="Challan Upload"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="12" className="text-center">
                            <Button type="submit" variant="primary">
                              Update
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Block>
                </Col>
                <Col lg="12">
                  <Card>
                    <Card.Body>
                      {/* <h3>Farmers Details</h3> */}
                      <Row className="g-gs">
                        <Col lg="12"></Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default MaintenanceandSaleofNurserytoFarmersEdit;
