import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import React from "react";
// import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScSchemeDetails() {
  const [data, setData] = useState({
    schemeName: "",
    schemeNameInKannada: "",
    schemeStartDate:null,
    schemeEndDate:null,
    dbtCode: "",

  });

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


  const _header = { "Content-Type": "application/json", accept: "*/*" };

  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURL + `scSchemeDetails/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
                schemeName: "",
                schemeNameInKannada: "",
                schemeStartDate:null,
                schemeEndDate:null,
                dbtCode: "",
            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (
            err.response &&
            err.response &&
            err.response.data &&
            err.response.data.validationErrors
          ) {
            if (Object.keys(err.response.data.validationErrors).length > 0) {
              saveError(err.response.data.validationErrors);
            }
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
        schemeName: "",
        schemeNameInKannada: "",
        schemeStartDate:null,
        schemeEndDate:null,
        dbtCode: "",
    });
  };

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => navigate("#"));
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
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Scheme Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Scheme Details</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-scheme-details-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-scheme-details-list"
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
                      <Form.Label htmlFor="title">
                        Scheme Name
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="schemeName"
                          type="text"
                          value={data.schemeName}
                          onChange={handleInputs}
                          placeholder="Enter Scheme name"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Scheme Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        Scheme Name in Kannada
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="schemeNameInKannada"
                          value={data.schemeNameInKannada}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Scheme Name in Kannada"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Scheme Name in Kannada is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="title">
                      Dbt Code
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dbtCode"
                          name="dbtCode"
                          type="text"
                          value={data.dbtCode}
                          onChange={handleInputs}
                          placeholder="Enter Dbt Code"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Dbt Code is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl">
                          Scheme Start Date<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                        <DatePicker
                          selected={data.schemeStartDate}
                          onChange={(date) =>
                            handleDateChange(date, "schemeStartDate")
                          }
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              minDate={new Date()}
                              required
                            />
                          </div>
                          </Form.Group>
                          <Form.Control.Feedback type="invalid">
                          Scheme Start Date is Required
                      </Form.Control.Feedback>
                        </Col>

                        <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Scheme End Date<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                            <DatePicker
                              selected={data.schemeEndDate}
                              onChange={(date) =>
                                handleDateChange(date, "schemeEndDate")
                              }
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              minDate={new Date(data.schemeEndDate)}
                              required
                            />
                          </div>
                          </Form.Group>
                          <Form.Control.Feedback type="invalid">
                          Scheme End Date is Required
                        </Form.Control.Feedback>
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

export default ScSchemeDetails;
