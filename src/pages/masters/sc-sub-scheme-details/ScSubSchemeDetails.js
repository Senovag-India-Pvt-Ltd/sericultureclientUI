import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";
import ScSchemeDetails from "../sc-scheme-details/ScSchemeDetails";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScSubSchemeDetails() {
  const [data, setData] = useState({
    scSchemeDetailsId: "",
    subSchemeName: "",
    subSchemeNameInKannada: "",
    subSchemeType:"",
    subSchemeStartDate:"",
    subSchemeEndDate:"",

  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    // debugger;
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
      // event.stopPropagation();
      api
        .post(baseURL + `scSubSchemeDetails/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
                scSchemeDetailsId: "",
                subSchemeName: "",
                subSchemeNameInKannada: "",
                subSchemeType:"",
                subSchemeStartDate:"",
                subSchemeEndDate:"",
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
        scSchemeDetailsId: "",
        subSchemeName: "",
        subSchemeNameInKannada: "",
        subSchemeType:"",
        subSchemeStartDate:"",
        subSchemeEndDate:"",
    });
  };

  // to get Scheme Details
  const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `scSchemeDetails/get-all`)
      .then((response) => {
        setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
      })
      .catch((err) => {
        setScSchemeDetailsListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const navigate = useNavigate();
  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
    }).then(() => {
      navigate("#");
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
      title: "Save attempt was not successful",
      html: errorMessage,
    });
  };

  return (
    <Layout title="Sub Scheme Details">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Sub Scheme Details</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-sub-scheme-details-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-sub-scheme-details-list"
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
        <Form noValidate validated={validated} onSubmit={postData}>
          {/* <Form action="#"> */}
          <Row className="g-3 ">
            <Card>
              <Card.Body>
                {/* <h3>Farmers Details</h3> */}
                <Row className="g-gs">
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Scheme Details<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="scSchemeDetailsId"
                          value={data.scSchemeDetailsId}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          required
                          isInvalid={
                            data.scSchemeDetailsId === undefined || data.scSchemeDetailsId === "0"
                          }
                        >
                          <option value="">Select Scheme Details</option>
                          {scSchemeDetailsListData.map((list) => (
                            <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                              {list.schemeName}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Scheme name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="subSchemeName">
                        Sub Scheme Name<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="subSchemeName"
                          type="text"
                          name="subSchemeName"
                          value={data.subSchemeName}
                          onChange={handleInputs}
                          placeholder="Enter Sub Scheme Name"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Sub Scheme Name is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label htmlFor="subSchemeNameInKannada">
                        Sub Scheme Name In Kannada<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="subSchemeNameInKannada"
                          type="text"
                          name="subSchemeNameInKannada"
                          value={data.subSchemeNameInKannada}
                          onChange={handleInputs}
                          placeholder="Enter Sub Scheme Name"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Sub Scheme Name In Kannada is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="subSchemeType">
                        Sub Scheme Type
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="subSchemeType"
                          type="text"
                          name="subSchemeType"
                          value={data.subSchemeType}
                          onChange={handleInputs}
                          placeholder="Enter Sub Scheme Type"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Sub Scheme Type is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col> */}

                  <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                      Sub Scheme Type<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="subSchemeType"
                          value={data.subSchemeType}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
                          isInvalid={
                            data.subSchemeType === undefined || data.subSchemeType === "0"
                          }
                        >
                          <option value="">Select Sub Scheme Type</option>
                          {/* {scSchemeDetailsListData.map((list) => (
                            <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                              {list.schemeName}
                            </option>
                          ))} */}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Sub Scheme Type is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  
                  <Col lg="2">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="subSchemeStartDate">
                          Sub Scheme Start Date<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="form-control-wrap">
                        <DatePicker
                          selected={data.subSchemeStartDate}
                          onChange={(date) =>
                            handleDateChange(date, "subSchemeStartDate")
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
                          Sub Scheme Start Date is Required
                      </Form.Control.Feedback>
                        </Col>

                        <Col lg="2">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label htmlFor="subSchemeEndDate">
                                Sub Scheme End Date<span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                            <DatePicker
                              selected={data.subSchemeEndDate}
                              onChange={(date) =>
                                handleDateChange(date, "subSchemeEndDate")
                              }
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              minDate={new Date(data.subSchemeStartDate)}
                              required
                            />
                          </div>
                          </Form.Group>
                          <Form.Control.Feedback type="invalid">
                          Sub Scheme End Date is Required
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
                  {/* <Link to="/seriui/district-list" className="btn btn-secondary border-0">
                    Cancel
                  </Link> */}
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

export default ScSubSchemeDetails;
