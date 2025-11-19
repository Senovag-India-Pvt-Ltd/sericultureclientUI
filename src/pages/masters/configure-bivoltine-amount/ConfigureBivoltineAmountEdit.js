import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function ConfigureBivoltineAmountEdit() {
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
        .post(baseURLDBT + `configureBivoltineAmount/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError();
          } else {
            updateSuccess();
            setData({
              componentId: "",
              categoryId: "",
              amountPerKg: "",
              maxNoOfCocoonsPerKg: "",
              minAverageYield: "",
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
    componentId: "",
    categoryId: "",
    amountPerKg: "",
    maxNoOfCocoonsPerKg: "",
    minAverageYield: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLDBT + `configureBivoltineAmount/get/${id}`)
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

  // to get Component details
  const [componentListData, setComponentDetailsListData] = useState([]);

  const getComponentList = () => {
    api
      .get(baseURL + `scComponent/get-all`)
      .then((response) => {
        setComponentDetailsListData(response.data.content.scComponent);
      })
      .catch((err) => {
        setComponentDetailsListData([]);
      });
  };

  useEffect(() => {
    getComponentList();
  }, []);

  // to get Category details
  const [categoryListData, setCategoryListData] = useState([]);

  const getCategoryList = () => {
    api
      .get(baseURL + `scCategory/get-all`)
      .then((response) => {
        setCategoryListData(response.data.content.scCategory);
      })
      .catch((err) => {
        setCategoryListData([]);
      });
  };

  useEffect(() => {
    getCategoryList();
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
      title: message,
      text: "Something went wrong!",
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
    <Layout title="Edit Configured Bonus Amount">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Configured Bonus Amount</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/configure-bivoltine-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/configure-bivoltine-list"
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
                      <Form.Group className="form-group mt-n3">
                      <Form.Label htmlFor="spacing">
                          Component<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                          <Form.Select
                          name="componentId"
                          value={data.componentId}
                          onChange={handleInputs}
                          required
                          isInvalid={
                              data.componentId === undefined ||
                              data.componentId === "0"
                          }
                          >
                          <option value="">Select Component</option>
                          {componentListData && componentListData.length > 0
                              ? componentListData.map((list) => (
                                  <option
                                  key={list.scComponentId}
                                  value={list.scComponentId}
                                  >
                                  {list.scComponentName}
                                  </option>
                              ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                          Component is required
                      </Form.Control.Feedback>
                      </div>
                      </Form.Group>
                  </Col>
  
                  <Col lg="6">
                      <Form.Group className="form-group mt-n3">
                      <Form.Label htmlFor="hectare">
                          Category<span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                          <Form.Select
                          name="categoryId"
                          value={data.categoryId}
                          onChange={handleInputs}
                          required
                          isInvalid={
                              data.categoryId === undefined ||
                              data.categoryId === "0"
                          }
                          >
                          <option value="">Select Hectare</option>
                          {categoryListData && categoryListData.length > 0
                              ? categoryListData.map((list) => (
                                  <option
                                  key={list.scCategoryId}
                                  value={list.scCategoryId}
                                  >
                                  {list.categoryName}
                                  </option>
                              ))
                              : ""}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                      Category is required
                      </Form.Control.Feedback>
                      </div>
                      </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        Min Average Yield
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="minAverageYield"
                          name="minAverageYield"
                          type="text"
                          value={data.minAverageYield}
                          onChange={handleInputs}
                          placeholder="Enter Min Average Yield"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Min Average Yield is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="title">
                        Max No Of Cocoons Per Kg
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Control
                          id="maxNoOfCocoonsPerKg"
                          name="maxNoOfCocoonsPerKg"
                          type="text"
                          value={data.maxNoOfCocoonsPerKg}
                          onChange={handleInputs}
                          placeholder="Enter Max No Of Cocoons Per Kg"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                        Max No Of Cocoons Per Kg is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
  
                  <Col lg="6">
                      <Form.Group className="form-group">
                        <Form.Label htmlFor="title">
                          Amount Per Kg
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Control
                            id="amountPerKg"
                            name="amountPerKg"
                            type="text"
                            value={data.amountPerKg}
                            onChange={handleInputs}
                            placeholder="Enter Amount"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                          Amount is required
                          </Form.Control.Feedback>
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

export default ConfigureBivoltineAmountEdit;
