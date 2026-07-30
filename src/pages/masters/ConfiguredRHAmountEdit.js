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
                maxAmount: "",
                minAmount: "",
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
    maxAmount: "",
    minAmount: "",
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
      <style>{configuredRHAmountEditStyles}</style>
      <Block.Head>
        <div className="sh-page-header">
          <Block.HeadBetween>
            <Block.HeadContent>
              <Block.Title tag="h2" className="sh-page-title">Edit Configured RH Amount</Block.Title>
            </Block.HeadContent>
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <Link
                    to="/seriui/configure-rh-amount-list"
                    className="btn btn-primary btn-md d-md-none sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go To List</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/seriui/configure-rh-amount-list"
                    className="btn btn-primary d-none d-md-inline-flex sh-cta-btn"
                  >
                    <Icon name="arrow-long-left" />
                    <span>Go To List</span>
                  </Link>
                </li>
              </ul>
            </Block.HeadContent>
          </Block.HeadBetween>
        </div>
      </Block.Head>

      <Block className="mt-n4 sh-form-wrap">
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Row className="g-3 ">
            <Card>
              <Card.Header className="sh-section-header">
                <Icon name="edit" />
                <span>Edit Configured RH Amount Details</span>
              </Card.Header>
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

                    <Col lg="6">
                        <Form.Group className="form-group mt-n3">
                          <Form.Label htmlFor="title">
                            Max Sqft
                            {/* <span className="text-danger">*</span> */}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="maxAmount"
                              name="maxAmount"
                              type="number"
                              value={data.maxAmount}
                              onChange={handleInputs}
                              placeholder="Enter Max Sqft"
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                            Max Sqft is required
                            </Form.Control.Feedback> */}
                          </div>
                        </Form.Group>
                      </Col>
    
                      <Col lg="6">
                        <Form.Group className="form-group mt-n3">
                          <Form.Label htmlFor="title">
                            Min Sqft
                            {/* <span className="text-danger">*</span> */}
                          </Form.Label>
                          <div className="form-control-wrap">
                            <Form.Control
                              id="minAmount"
                              name="minAmount"
                              type="number"
                              value={data.minAmount}
                              onChange={handleInputs}
                              placeholder="Enter Min Sqft"
                              // required
                            />
                            {/* <Form.Control.Feedback type="invalid">
                            Min Sqft is required
                            </Form.Control.Feedback> */}
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
                    <Button type="submit" variant="primary" className="sh-save-btn">
                    <Icon name="save" />
                    <span>Save</span>
                    </Button>
                </li>
                <li>
                    <Button type="button" variant="secondary" onClick={clear} className="sh-cancel-btn">
                    <Icon name="cross" />
                    <span>Cancel</span>
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

const configuredRHAmountEditStyles = `
  .sh-page-header {
    padding: 20px 24px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border-radius: 12px;
    border: none;
    box-shadow: 0 6px 18px rgba(30, 103, 168, 0.22);
    margin-bottom: 22px;
  }
  .sh-page-title {
    margin-bottom: 4px;
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: 0.2px;
  }
  .sh-cta-btn {
    background: #ffffff;
    color: #1e67a8 !important;
    border: none;
    box-shadow: 0 4px 12px rgba(12, 40, 68, 0.25);
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 8px;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .sh-cta-btn:hover {
    background: #eef6ff;
    color: #1e67a8 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(12, 40, 68, 0.32);
  }
  .sh-form-wrap {
    background: #eef2f8;
    border-radius: 14px;
    padding: 18px;
  }
  .sh-form-wrap .card {
    border: none;
    border-radius: 12px !important;
    box-shadow: 0 4px 14px rgba(30, 103, 168, 0.1);
    overflow: hidden;
  }
  .sh-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700 !important;
    font-size: 1rem !important;
    letter-spacing: 0.3px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%) !important;
    border-left: none !important;
    color: #ffffff !important;
    padding: 14px 20px !important;
  }
  .sh-section-header svg,
  .sh-section-header .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
    font-size: 15px;
  }
  .sh-form-wrap .form-label {
    font-weight: 600;
    color: #33475b;
    font-size: 13.5px;
  }
  .sh-form-wrap .form-control,
  .sh-form-wrap .form-select {
    border-radius: 8px;
    border: 1.5px solid #dbe4ee;
    padding: 9px 12px;
    font-size: 13.5px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-form-wrap .form-control:hover,
  .sh-form-wrap .form-select:hover {
    border-color: #9fc0e0;
  }
  .sh-form-wrap .form-control:focus,
  .sh-form-wrap .form-select:focus {
    border-color: #1e67a8;
    box-shadow: 0 0 0 0.2rem rgba(30, 103, 168, 0.15);
  }
  .sh-form-wrap .form-control[readonly] {
    background-color: #f4f6f9;
  }
  .sh-form-wrap .form-control.is-invalid,
  .sh-form-wrap .form-select.is-invalid {
    border-color: #e3496a;
  }
  .sh-form-wrap .text-danger {
    color: #e3496a !important;
  }
  .sh-save-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(90deg, #1e67a8 0%, #2b7ac0 60%, #3b8dd6 100%);
    border: none;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(30, 103, 168, 0.25);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-save-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(30, 103, 168, 0.32);
  }
  .sh-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    color: #e3496a;
    border: 1.5px solid #e3496a;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sh-cancel-btn:hover:not(:disabled),
  .sh-cancel-btn:focus:not(:disabled) {
    background: linear-gradient(135deg, #e3496a 0%, #c43257 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(227, 73, 106, 0.32);
  }
`;

export default ConfiguredRHAmountEdit;
