import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
//import axios from "axios";
import { Icon } from "../../../components";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScSchemeDetailsEdit() {
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

  const isDataFromSet = !!data.schemeStartDate;
  const isDataToSet = !!data.schemeEndDate;
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
        .post(baseURL + `scSchemeDetails/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
                schemeName: "",
                schemeNameInKannada: "",
                schemeStartDate:null,
                schemeEndDate:null,
                dbtCode: "",
                hectare: "",
                spacing: "",
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
              updateError(err.response.data.validationErrors);
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
        hectare: "",
        spacing: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `scSchemeDetails/get/${id}`)
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

  // console.log(getIdList());

  useEffect(() => {
    getIdList();
  }, [id]);

  const handleCheckBox = (e) => {
    const { name, checked } = e.target; // Get the name and checked state from the event
    setData((prev) => ({
      ...prev,
      [name]: checked, // Dynamically update the correct field based on the checkbox name
    }));
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
    <Layout title="Edit Scheme Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Scheme Details</Block.Title>
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
                {loading ? (
                  <h1 className="d-flex justify-content-center align-items-center">
                    Loading...
                  </h1>
                ) : (
                  <>
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
                      DBT Code
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="dbtCode"
                          name="dbtCode"
                          type="text"
                          value={data.dbtCode}
                          onChange={handleInputs}
                          placeholder="Enter DBT Code"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        DBT Code is required
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
                              {isDataFromSet && (
                                <DatePicker
                                  selected={new Date(data.schemeStartDate)}
                                  onChange={(date) =>
                                    handleDateChange(date, "schemeStartDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  // minDate={new Date()}
                                  required
                                />
                              )}
                            </div>
                            </Form.Group>
                        </Col>

                        <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="sordfl">
                                Scheme End Date<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                              {isDataToSet && (
                                <DatePicker
                                  selected={new Date(data.schemeEndDate)}
                                  onChange={(date) =>
                                    handleDateChange(date, "schemeEndDate")
                                  }
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  // minDate={new Date(data.schemeStartDate)}
                                  required
                                />
                              )}
                            </div>
                      </Form.Group>
                    </Col>
                    </Row>

                    <Row>
                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="hectare"
                          checked={data.hectare}
                          id="weighmentTripletGeneration"
                          onChange={handleCheckBox}
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                        Hectare
                      </Form.Label>
                    </Form.Group>
                  </Col>

                  <Col lg="2">
                    <Form.Group as={Row} className="form-group mt-4">
                      <Col sm={1}>
                        <Form.Check
                          type="checkbox"
                          name="spacing"
                          checked={data.spacing}
                          onChange={handleCheckBox}
                        />
                      </Col>
                      <Form.Label column sm={8} className="mt-n2">
                        Spacing
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
                </>
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

export default ScSchemeDetailsEdit;
