import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function ScUnitCostEdit() {
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
        .post(baseURL + `scUnitCost/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              scHeadAccountId: "",
              scCategoryId: "",
              scSubSchemeDetailsId: "",
              centralShare:"",
              stateShare:"",
              benificiaryShare:"",

            });
            setValidated(false);
          }
        })
        .catch((err) => {
          if (Object.keys(err.response.data.validationErrors).length > 0) {
            updateError(err.response.data.validationErrors);
          }
        });
      setValidated(true);
    }
  };

  const clear = () => {
    setData({
      scHeadAccountId: "",
      scCategoryId: "",
      scSubSchemeDetailsId: "",
      centralShare:"",
      stateShare:"",
      benificiaryShare:"",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `scUnitCost/get/${id}`)
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

  useEffect(() => {
    getIdList();
  }, [id]);

  // to get Head Account
  const [scHeadAccountListData, setScHeadAccountListData] = useState([]);

  const getScHeadAccountList = () => {
    const response = api
      .get(baseURL + `scHeadAccount/get-all`)
      .then((response) => {
        setScHeadAccountListData(response.data.content.scHeadAccount);
      })
      .catch((err) => {
        setScHeadAccountListData([]);
      });
  };

  useEffect(() => {
    getScHeadAccountList();
  }, []);

  // to get Category
  const [scCategoryListData, setScCategoryListData] = useState([]);

  const getScCategoryList = () => {
    const response = api
      .get(baseURL + `scCategory/get-all`)
      .then((response) => {
        setScCategoryListData(response.data.content.scCategory);
      })
      .catch((err) => {
        setScCategoryListData([]);
      });
  };

  useEffect(() => {
    getScCategoryList();
  }, []);


  // to get Sub Scheme Details
  const [scSubSchemeDetailsListData, setScSubSchemeDetailsData] = useState([]);

  const getScSubSchemeDetailsList = () => {
    const response = api
      .get(baseURL + `scSubSchemeDetails/get-all`)
      .then((response) => {
        setScSubSchemeDetailsData(response.data.content.scSubSchemeDetails);
      })
      .catch((err) => {
        setScSubSchemeDetailsData([]);
      });
  };

  useEffect(() => {
    getScSubSchemeDetailsList();
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
    <Layout title="Unit Cost">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Unit Cost</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/sc-unit-cost-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/sc-unit-cost-list"
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
        {/* <Form Action="#"> */}
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
                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          Head Account<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scHeadAccountId"
                            value={data.scHeadAccountId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scHeadAccountId === undefined || data.scHeadAccountId === "0"
                            }
                          >
                            <option value="">Select Head Account</option>
                            {scHeadAccountListData.map((list) => (
                              <option key={list.scHeadAccountId} value={list.scHeadAccountId}>
                                {list.scHeadAccountName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Head Account name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          Category<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scCategoryId"
                            value={data.scCategoryId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scCategoryId === undefined || data.scCategoryId === "0"
                            }
                          >
                            <option value="">Select Category</option>
                            {scCategoryListData.map((list) => (
                              <option key={list.scCategoryId} value={list.scCategoryId}>
                                {list.categoryName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Category Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>


                    <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label>
                          Sub Scheme Details<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scSubSchemeDetailsId"
                            value={data.scSubSchemeDetailsId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scSubSchemeDetailsId === undefined || data.scSubSchemeDetailsId === "0"
                            }
                          >
                            <option value="">Select Sub Scheme Details</option>
                            {scSubSchemeDetailsListData.map((list) => (
                              <option key={list.scSubSchemeDetailsId} value={list.scSubSchemeDetailsId}>
                                {list.subSchemeName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Sub Scheme Details Name is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                         Central Share
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="centralShare"
                          value={data.centralShare}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter  Central Share"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                           Central Share is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        State Share
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="stateShare"
                          value={data.stateShare}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter  State Share"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        State Share is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                         Benificiary Share
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="benificiaryShare"
                          value={data.benificiaryShare}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter  Beneficiary Share"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Beneficiary Share is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                         Unit Cost 
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="title"
                          name="unitCost"
                          value={data.unitCost}
                          onChange={handleInputs}
                          type="text"
                          placeholder="Enter Unit Cost"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Unit Cost is required.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
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
                  {/* <Link
                    to="/seriui/district-list"
                    className="btn btn-secondary border-0"
                  >
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

export default ScUnitCostEdit;
