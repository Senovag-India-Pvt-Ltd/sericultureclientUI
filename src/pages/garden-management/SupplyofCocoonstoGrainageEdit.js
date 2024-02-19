import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable, { createTheme } from "react-data-table-component";
import { Link, useParams } from "react-router-dom";

import { Icon, Select } from "../../components";

import api from "../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_GARDEN_MANAGEMENT;

function SupplyofCocoonstoGrainage() {
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
        .post(baseURL + `supply-cocoons/update-info`, data)
        .then((response) => {
          if (response.data.error) {
            updateError(response.data.message);
          } else {
            updateSuccess();
            setData({
              lotNumber: "",
              raceOfCocoons: "",
              spunOnDate: "",
              numberOfCocoonsDispatched: "",
              generationDetails: "",
              dispatchDate: "",
              generateInvoice: "",
              viewReciept: "", 
              });
            setValidated(false);
          }
        })
        .catch((err) => {
          updateError(err.response.data.validationErrors);
        });
      setValidated(true);
    }
  };

  const isDataSpunSet = !!data.spunOnDate;
  const isDataDispatchSet = !!data.dispatchDate;

  const clear = () => {
    setData({
      lotNumber: "",
      raceOfCocoons: "",
      spunOnDate: "",
      numberOfCocoonsDispatched: "",
      generationDetails: "",
      dispatchDate: "",
      generateInvoice: "",
      viewReciept: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    // const chowki_id = chawkiList.chowki_id;
    const response = api
      .get(baseURL + `supply-cocoons/get-info-by-id/${id}`)
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  return (
    <Layout title="Edit Supply of Cocoons to Grainage ">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Supply of Cocoons to Grainage</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/Supply-of-Cocoons-to-Grainagee"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Create</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/Supply-of-Cocoons-to-Grainagee"
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
                <Card.Header style={{ fontWeight: "bold" }}>Edit Supply of Cocoons to Grainage </Card.Header>
                  <Card.Body>
                    <Row className="g-gs">
                      <Col lg="4">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl">
                            Lot Number
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="lotNumber"
                              name="lotNumber"
                              value={data.lotNumber}
                              onChange={handleInputs}
                              type="text"
                              placeholder="  Lot Number "
                              required
                            />
                          </div>
                        </Form.Group>
                      </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Race of Cocoons
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="raceOfCocoons"
                                  name="raceOfCocoons"
                                  value={data.raceOfCocoons}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Race of Cocoons"
                                />
                              </div>
                            </Form.Group>
                          </Col>



                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Number of Cocoons Dispatched
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="numberOfCocoonsDispatched"
                                  name="numberOfCocoonsDispatched"
                                  value={data.numberOfCocoonsDispatched}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Number of Cocoons Dispatched"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Generation details
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="generationDetails"
                                  name="generationDetails"
                                  value={data.generationDetails}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Generation details"
                                />
                              </div>
                            </Form.Group>
                          </Col>
                          

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Genarate Invoice
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="generateInvoice"
                                  name="generateInvoice"
                                  value={data.generateInvoice}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Genarate Invoice"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                View Reciept
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="viewReciept"
                                  name="viewReciept"
                                  value={data.viewReciept}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="View Reciept"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Spun on date
                              </Form.Label>
                              <div className="form-control-wrap">
                              {isDataSpunSet && (
                                <DatePicker
                                  selected={new Date(data.spunOnDate)}
                                  onChange={(date) =>
                                    handleDateChange(date, "spunOnDate")
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
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Dispatch Date
                              </Form.Label>
                              <div className="form-control-wrap">
                              {isDataDispatchSet && (
                                <DatePicker
                                  selected={new Date(data.dispatchDate)}
                                  onChange={(date) =>
                                    handleDateChange(date, "dispatchDate")
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

export default SupplyofCocoonstoGrainage;
