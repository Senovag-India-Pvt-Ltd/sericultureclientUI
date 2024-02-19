import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import { Link } from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Icon } from "../../components";
import api from "../../../src/services/auth/api";

import DataTable, { createTheme } from "react-data-table-component";

const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function MaintenanceandSaleofNurserytoFarmers() {
  const [data, setData] = useState({
    fruitsId: "",
    farmerName: "",
    mulberryVariety: "",
    area: "",
    dateOfPlanting: "",
    nurserySaleDetails: "",
    quantity: "",
    date: "",
    rate: "",
    saplingAge: "",
    generateRecipt: "",
    receiptNumber: "",
    remittanceDetails: "",
    challanUpload: "",
  });

  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "20%",
    },
  };

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
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
        .post(baseURL + `Maintenance-sale/add-info`, data)
        .then((response) => {
          // debugger;
          if (response.data.error) {
            saveError(response.data.message);
          } else {
            saveSuccess();
            setData({
              fruitsId: "",
              farmerName: "",
              mulberryVariety: "",
              area: "",
              dateOfPlanting: "",
              nurserySaleDetails: "",
              quantity: "",
              date: "",
              rate: "",
              saplingAge: "",
              generateRecipt: "",
              receiptNumber: "",
              remittanceDetails: "",
              challanUpload: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          saveError();
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      fruitsId: "",
      farmerName: "",
      mulberryVariety: "",
      area: "",
      dateOfPlanting: "",
      nurserySaleDetails: "",
      quantity: "",
      date: "",
      rate: "",
      saplingAge: "",
      generateRecipt: "",
      receiptNumber: "",
      remittanceDetails: "",
      challanUpload: "",
    });
  };


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
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link to="/seriui/maintenance-and-sale-of-nursery-list" className="btn btn-primary btn-md d-md-none">
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/maintenance-and-sale-of-nursery-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-0 ">
            <Card>
              <Card.Header style={{ fontWeight: "bold" }}>
                    Maintenance and Sale of Nursery to Farmers
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-gs">
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
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
                              placeholder=" Enter FRUITS-ID"
                            />
                          </div>
                        </Form.Group>
                      </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
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
                                  placeholder="Enter Farmer’s name"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
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
                                  placeholder="Enter Mulberry variety"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">Area</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="area"
                                  name="area"
                                  type="text"
                                  value={data.area}
                                  onChange={handleInputs}
                                  placeholder="Enter Area"
                                />
                              </div>
                            </Form.Group>
                          </Col>                

                          <Col lg="4">
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
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">Quantity</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="quantity"
                                  name="quantity"
                                  type="text"
                                  value={data.quantity}
                                  onChange={handleInputs}
                                  placeholder=" Enter Quantity"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          
                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">Rate</Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="rate"
                                  name="rate"
                                  type="text"
                                  value={data.rate}
                                  onChange={handleInputs}
                                  placeholder="Enter Rate"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Sapling age in Month/Year
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="saplingAge"
                                  name="saplingAge"
                                  type="text"
                                  value={data.saplingAge}
                                  onChange={handleInputs}
                                  placeholder="Enter Sapling age in Month/Year"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
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
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
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
                                  placeholder="Enter Remittance details"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
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

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
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
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Date of planting
                              </Form.Label>
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
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default MaintenanceandSaleofNurserytoFarmers;
