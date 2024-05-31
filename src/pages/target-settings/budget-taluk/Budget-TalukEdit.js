import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function BudgetTalukEdit() {
  // Fetching id from URL params
  const { id, types } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const [type, setType] = useState({
    budgetType: types,
  });

  let name, value;

  // Function to handle input changes
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleTypeInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setType({ ...type, [name]: value });
  };

  const [balanceAmount, setBalanceAmount] = useState(0);
  if (type.budgetType === "allocate") {
    if (data.financialYearMasterId && data.scHeadAccountId && data.districtId) {
      api
        .post(baseURLTargetSetting + `tsBudgetTaluk/get-available-balance`, {
          financialYearMasterId: data.financialYearMasterId,
          scHeadAccountId: data.scHeadAccountId,
          districtId: data.districtId,
        })
        .then((response) => {
          if (!response.data.content) {
            saveError(response.data.errorMessages[0]);
          } else {
            setBalanceAmount(response.data.content.remainingBalance);
          }
        })
        .catch((err) => {
          // setFinancialYearListData([]);
        });
    }
  }

  if (type.budgetType === "release") {
    if (
      data.financialYearMasterId &&
      data.scHeadAccountId &&
      data.districtId &&
      data.talukId
    ) {
      api
        .post(
          baseURLTargetSetting + `tsReleaseBudgetTaluk/get-available-balance`,
          {
            financialYearMasterId: data.financialYearMasterId,
            scHeadAccountId: data.scHeadAccountId,
            districtId: data.districtId,
            talukId: data.talukId,
          }
        )
        .then((response) => {
          if (!response.data.content) {
            saveError(response.data.errorMessages[0]);
          } else {
            setBalanceAmount(response.data.content.remainingBalance);
          }
        })
        .catch((err) => {
          // setFinancialYearListData([]);
        });
    }
  }

  const saveSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Saved successfully",
      // text: "You clicked the button!",
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

  // Function to submit form data
  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      if (type.budgetType === "allocate") {
        api
          .post(baseURLTargetSetting + `tsBudgetTaluk/edit`, data)
          .then((response) => {
            if (response.data.content.error) {
              updateError(response.data.content.error_description);
            } else {
              updateSuccess();
              clear();
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
      }
      if (type.budgetType === "release") {
        api
          .post(baseURLTargetSetting + `tsReleaseBudgetTaluk/edit`, data)
          .then((response) => {
            if (response.data.content.error) {
              updateError(response.data.content.error_description);
            } else {
              updateSuccess();
              clear();
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
      }

      setValidated(true);
    }
  };

  // Function to clear form data
  const clear = () => {
    setData({
      financialYearMasterId: "",
      scHeadAccountId: "",
      districtId: "",
      talukId: "",
      date: "",
      budgetAmount: "",
    });
    setType({
      budgetType: "allocate",
    });
    setValidated(false);
    setBalanceAmount(0);
  };
  const isDataDateSet = !!data.date;

  const getIdList = () => {
    setLoading(true);
    if (type.budgetType === "allocate") {
      api
        .get(baseURLTargetSetting + `tsBudgetTaluk/get/${id}`)
        .then((response) => {
          setData(response.data.content);
          setLoading(false);
        })
        .catch((err) => {
          let message = "An error occurred while fetching data.";

          if (err.response && err.response.data) {
            if (
              Array.isArray(err.response.data.errorMessages) &&
              err.response.data.errorMessages.length > 0
            ) {
              message = err.response.data.errorMessages[0].message[0].message;
            }
          }

          // Display error message
          editError(message);
          setData({});
          setLoading(false);
        });
    }
    if (type.budgetType === "release") {
      api
        .get(baseURLTargetSetting + `tsReleaseBudgetTaluk/get/${id}`)
        .then((response) => {
          setData(response.data.content);
          setLoading(false);
        })
        .catch((err) => {
          let message = "An error occurred while fetching data.";

          if (err.response && err.response.data) {
            if (
              Array.isArray(err.response.data.errorMessages) &&
              err.response.data.errorMessages.length > 0
            ) {
              message = err.response.data.errorMessages[0].message[0].message;
            }
          }

          // Display error message
          editError(message);
          setData({});
          setLoading(false);
        });
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    getIdList();
  }, [id]);

  // to get Financial Year
  const [financialYearListData, setFinancialYearListData] = useState([]);

  const getFinancialYearList = () => {
    const response = api
      .get(baseURL + `financialYearMaster/get-all`)
      .then((response) => {
        setFinancialYearListData(response.data.content.financialYearMaster);
      })
      .catch((err) => {
        setFinancialYearListData([]);
      });
  };

  useEffect(() => {
    getFinancialYearList();
  }, []);

  // to get Head Of Account
  const [headOfAccountListData, setHeadOfAccountListData] = useState([]);

  const getHeadOfAccountList = () => {
    const response = api
      .get(baseURL + `scHeadAccount/get-all`)
      .then((response) => {
        setHeadOfAccountListData(response.data.content.scHeadAccount);
      })
      .catch((err) => {
        setHeadOfAccountListData([]);
      });
  };

  useEffect(() => {
    getHeadOfAccountList();
  }, []);

  // to get District
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    const response = api
      .get(baseURL + `district/get-all`)
      .then((response) => {
        setDistrictListData(response.data.content.district);
      })
      .catch((err) => {
        setDistrictListData([]);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);

  // to get Taluk
  const [talukListData, setTalukListData] = useState([]);

  const getTalukList = () => {
    const response = api
      .get(baseURL + `taluk/get-all`)
      .then((response) => {
        setTalukListData(response.data.content.taluk);
      })
      .catch((err) => {
        setTalukListData([]);
      });
  };

  useEffect(() => {
    getTalukList();
  }, []);

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  // Function to handle success alert
  const updateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Updated successfully",
    });
  };

  // Function to handle error alert
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
    });
  };
  const styles = {
    ctstyle: {
      backgroundColor: "rgb(248, 248, 249, 1)",
      color: "rgb(0, 0, 0)",
      width: "50%",
    },
    top: {
      backgroundColor: "rgb(15, 108, 190, 1)",
      color: "rgb(255, 255, 255)",
      width: "50%",
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    bottom: {
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
    },
    sweetsize: {
      width: "100px",
      height: "100px",
    },
  };

  return (
    <Layout title="Edit Taluk Budget">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Taluk Budget</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/budget-taluk-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/budget-taluk-list"
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
        <Row>
          <Col lg="8">
            <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="g-3 ">
                <Block>
                  <Card>
                    <Card.Header style={{ fontWeight: "bold" }}>
                      Taluk Budget
                    </Card.Header>
                    <Card.Body>
                      {loading ? (
                        <h1 className="d-flex justify-content-center align-items-center">
                          Loading...
                        </h1>
                      ) : (
                        <Row className="g-gs">
                          <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                Financial Year
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="financialYearMasterId"
                                  value={data.financialYearMasterId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs}
                                  required
                                  isInvalid={
                                    data.financialYearMasterId === undefined ||
                                    data.financialYearMasterId === "0"
                                  }
                                >
                                  <option value="">
                                    Select Financial Year
                                  </option>
                                  {financialYearListData.map((list) => (
                                    <option
                                      key={list.financialYearMasterId}
                                      value={list.financialYearMasterId}
                                    >
                                      {list.financialYear}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Financial Year is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg={6} className="mt-5">
                            <Row>
                              <Col lg="3">
                                <Form.Group
                                  as={Row}
                                  className="form-group"
                                  controlId="with"
                                >
                                  <Col sm={1}>
                                    <Form.Check
                                      type="radio"
                                      name="budgetType"
                                      value="allocate"
                                      checked={type.budgetType === "allocate"}
                                      onChange={handleTypeInputs}
                                      disabled
                                    />
                                  </Col>
                                  <Form.Label
                                    column
                                    sm={9}
                                    className="mt-n2"
                                    id="with"
                                  >
                                    Allocate
                                  </Form.Label>
                                </Form.Group>
                              </Col>
                              <Col lg="3" className="ms-n4">
                                <Form.Group
                                  as={Row}
                                  className="form-group"
                                  controlId="without"
                                >
                                  <Col sm={1}>
                                    <Form.Check
                                      type="radio"
                                      name="budgetType"
                                      value="release"
                                      checked={type.budgetType === "release"}
                                      onChange={handleTypeInputs}
                                      disabled
                                    />
                                  </Col>
                                  <Form.Label
                                    column
                                    sm={9}
                                    className="mt-n2"
                                    id="without"
                                  >
                                    Release
                                  </Form.Label>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                Head Of Account
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="scHeadAccountId"
                                  value={data.scHeadAccountId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs}
                                  required
                                  isInvalid={
                                    data.scHeadAccountId === undefined ||
                                    data.scHeadAccountId === "0"
                                  }
                                >
                                  <option value="">
                                    Select Head Of Account
                                  </option>
                                  {headOfAccountListData.map((list) => (
                                    <option
                                      key={list.scHeadAccountId}
                                      value={list.scHeadAccountId}
                                    >
                                      {list.scHeadAccountName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Head Of Account is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                Select District
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="districtId"
                                  value={data.districtId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs}
                                  required
                                  isInvalid={
                                    data.districtId === undefined ||
                                    data.districtId === "0"
                                  }
                                >
                                  <option value="">Select District</option>
                                  {districtListData.map((list) => (
                                    <option
                                      key={list.districtId}
                                      value={list.districtId}
                                    >
                                      {list.districtName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  District is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="6">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>
                                Select Taluk
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Select
                                  name="talukId"
                                  value={data.talukId}
                                  onChange={handleInputs}
                                  onBlur={() => handleInputs}
                                  required
                                  isInvalid={
                                    data.talukId === undefined ||
                                    data.talukId === "0"
                                  }
                                >
                                  <option value="">Select Taluk</option>
                                  {talukListData.map((list) => (
                                    <option
                                      key={list.talukId}
                                      value={list.talukId}
                                    >
                                      {list.talukName}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  Taluk is required
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="6">
                            <Form.Group className="form-group mt-n4 ">
                              <Form.Label htmlFor="title">
                                Budget Amount
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <div className="form-control-wrap">
                                <Form.Control
                                  id="budgetAmount"
                                  name="budgetAmount"
                                  value={data.budgetAmount}
                                  onChange={handleInputs}
                                  type="text"
                                  placeholder="Enter Budget Amount"
                                  required
                                />
                                <Form.Control.Feedback type="invalid">
                                  Budget Amount is required.
                                </Form.Control.Feedback>
                              </div>
                            </Form.Group>
                          </Col>

                          <Col lg="4">
                            <Form.Group className="form-group mt-n4">
                              <Form.Label>Date</Form.Label>
                              <div className="form-control-wrap">
                                {isDataDateSet && (
                                  <DatePicker
                                    selected={new Date(data.date)}
                                    onChange={(date) =>
                                      handleDateChange(date, "date")
                                    }
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    required
                                  />
                                )}
                              </div>
                            </Form.Group>
                            <Form.Control.Feedback type="invalid">
                              Date is Required
                            </Form.Control.Feedback>
                          </Col>
                        </Row>
                      )}
                    </Card.Body>
                  </Card>
                </Block>

                <div className="gap-col">
                  <ul className="d-flex align-items-center justify-content-center gap g-3">
                    <li>
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
          </Col>
          <Col lg="4">
            <Card>
              <Card.Header style={{ fontWeight: "bold" }}>
                Available Budget Balance
              </Card.Header>
              <Card.Body>
                <table className="table small table-bordered">
                  <tbody>
                    <tr>
                      <td style={styles.ctstyle}> Balance Amount:</td>
                      <td>{balanceAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Block>
    </Layout>
  );
}

export default BudgetTalukEdit;
