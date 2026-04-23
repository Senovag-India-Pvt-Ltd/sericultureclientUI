import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon, Select } from "../../components";
import { useState, useEffect } from "react";
import api from "../../services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;

function ConfiguredRHAmountEdit() {
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
        .post(baseURLDBT + `configureRHAmount/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError();
          } else {
            updateSuccess();
            setData({
                schemeId: "",
                componentId: "",
                categoryId: "",
                amount: "",
                sqft: "",
                centralAmount: "",
            stateAmounts: "",
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
    schemeId: "",
    componentId: "",
    categoryId: "",
    amount: "",
    sqft: "",
    centralAmount: "",
            stateAmounts: "",
    });
  };

  //   to get data from api
  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLDBT + `configureRHAmount/get/${id}`)
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

  // to get spacing details
  const [schemeListData, setSchemeDetailsListData] = useState([]);

  const getSchemeList = () => {
    api
      .get(baseURL + `scSchemeDetails/get-all`)
      .then((response) => {
        setSchemeDetailsListData(response.data.content.ScSchemeDetails);
      })
      .catch((err) => {
        setSchemeDetailsListData([]);
      });
  };

  useEffect(() => {
    getSchemeList();
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
    <Layout title="Edit Configured RH Amount">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Configured RH Amount</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/configure-rh-amount-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/configure-rh-amount-list"
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
                        Scheme<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                        <Form.Select
                        name="schemeId"
                        value={data.schemeId}
                        onChange={handleInputs}
                        required
                        isInvalid={
                            data.schemeId === undefined ||
                            data.schemeId === "0"
                        }
                        >
                        <option value="">Select Component</option>
                        {schemeListData && schemeListData.length > 0
                            ? schemeListData.map((list) => (
                                <option
                                key={list.scSchemeDetailsId}
                                value={list.scSchemeDetailsId}
                                >
                                {list.schemeName}
                                </option>
                            ))
                            : ""}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                        Scheme is required
                    </Form.Control.Feedback>
                    </div>
                    </Form.Group>
                </Col>

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
                        <option value="">Select Category</option>
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
                    <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="title">
                        SQFT
                        <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                        <Form.Control
                            id="sqft"
                            name="sqft"
                            type="text"
                            value={data.sqft}
                            onChange={handleInputs}
                            placeholder="Enter SQFT"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                        SQFT is required
                        </Form.Control.Feedback>
                        </div>
                    </Form.Group>
                    </Col>

                <Col lg="6">
                    <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="title">
                        Amount
                        <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                        <Form.Control
                            id="amount"
                            name="amount"
                            type="text"
                            value={data.amount}
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

                    <Col lg="6">
                    <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="title">
                        Central Amount
                        <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                        <Form.Control
                            id="centralAmount"
                            name="centralAmount"
                            type="text"
                            value={data.centralAmount}
                            onChange={handleInputs}
                            placeholder="Enter Central Amount"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                        Central Amount is required
                        </Form.Control.Feedback>
                        </div>
                    </Form.Group>
                    </Col>

                    <Col lg="6">
                    <Form.Group className="form-group mt-n3">
                        <Form.Label htmlFor="title">
                        State Amount
                        <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                        <Form.Control
                            id="stateAmounts"
                            name="stateAmounts"
                            type="text"
                            value={data.stateAmounts}
                            onChange={handleInputs}
                            placeholder="Enter State Amount"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                        State Amount is required
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

export default ConfiguredRHAmountEdit;
