import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function ReleaseBudgetDistrictEdit() {
  // Fetching id from URL params
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  let name, value;

  // Function to handle input changes
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
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

  const [balanceAmount, setBalanceAmount] = useState(0);

  if (data.financialYearMasterId) {
    api
      .post(baseURLTargetSetting + `tsReleaseBudgetDistrict/get-available-balance`, {
        financialYearMasterId: data.financialYearMasterId,
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

 
  // Function to submit form data
  const postData = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      api
        .post(baseURLTargetSetting + `tsReleaseBudgetDistrict/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              financialYearMasterId: "",
              scHeadAccountId: "",
              date: "",
              budgetAmount: "",
              districtId: "",
            });
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

  // Function to clear form data
  const clear = () => {
    setData({
      financialYearMasterId: "",
      scHeadAccountId: "",
      date: "",
      budgetAmount: "",
      districtId: "",
    });
    setValidated(false);
  };

  // to get Financial Year
  const [financialyearListData, setFinancialyearListData] = useState([]);

  const getList = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-all`)
      .then((response) => {
        setFinancialyearListData(response.data.content.financialYearMaster);
      })
      .catch((err) => {
        setFinancialyearListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  // Head of Account

  const [headOfAccountListData, setHeadOfAccountListData] = useState([]);

  const getHeadOfAccountList = () => {
    api
      .get(baseURLMasterData + `scHeadAccount/get-all`)
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

  // District

  // to get district
  const [districtListData, setDistrictListData] = useState([]);

  const getDistrictList = () => {
    const response = api
      .get(baseURLMasterData + `district/get-all`)
      .then((response) => {
        if (response.data.content.district) {
          setDistrictListData(response.data.content.district);
        }
      })
      .catch((err) => {
        setDistrictListData([]);
        // alert(err.response.data.errorMessages[0].message[0].message);
      });
  };

  useEffect(() => {
    getDistrictList();
  }, []);

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const isData = !!data.date;

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURLTargetSetting + `tsReleaseBudgetDistrict/get/${id}`)
      .then((response) => {
        setData(response.data.content);
        setLoading(false);
      })
      .catch((err) => {
        let message = "An error occurred while fetching data.";

        // Check if err.response is defined and not null
        if (err.response && err.response.data) {
          // Check if err.response.data.errorMessages is an array and has length > 0
          if (
            Array.isArray(err.response.data.errorMessages) &&
            err.response.data.errorMessages.length > 0
          ) {
            // Access the first error message from the array
            message = err.response.data.errorMessages[0].message[0].message;
          }
        }

        // Display error message
        editError(message);
        setData({});
        setLoading(false);
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    getIdList();
  }, [id]);

  const navigate = useNavigate();

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

  // Function to handle edit error
  const editError = (message) => {
    Swal.fire({
      icon: "error",
      title: message,
      text: "Something went wrong!",
    }).then(() => navigate("#"));
  };

  return (
    <Layout title="Edit Released District Budget">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Released District Budget </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/releasebudgetdistrict-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/releasebudgetdistrict-list"
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
      <Row>
          <Col lg="8">
            <Form noValidate validated={validated} onSubmit={postData}>
              <Card>
                <Card.Header>Edit Released Budget District</Card.Header>
                <Card.Body>
                <Row className="g-gs">
                    {loading ? (
                      <h1 className="d-flex justify-content-center align-items-center">
                        Loading...
                      </h1>
                    ) : (
                      <>
                      <Col lg="6">
                        <Form.Group className="form-group mt-n3">
                          <Form.Label>
                            Financial Year<span className="text-danger">*</span>
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
                              <option value="">Select Year</option>
                              {financialyearListData.map((list) => (
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

                      <Col lg="6">
                        <Form.Group className="form-group mt-n3">
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
                                data.scHeadAccountId === undefined || data.scHeadAccountId === "0"
                              }
                            >
                              <option value="">Select Head Of Account</option>
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
                        <Form.Group className="form-group mt-n3">
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
                        <Form.Group className="form-group mt-n3">
                          <Form.Label htmlFor="budgetAmount">
                            Budget Amount<span className="text-danger">*</span>
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

                      <Col lg="2">
                        <Form.Group className="form-group mt-n4">
                          <Form.Label htmlFor="sordfl"> Date</Form.Label>
                          <div className="form-control-wrap">
                            {isData && (
                              <DatePicker
                                selected={new Date(data.date) || null}
                                onChange={(date) =>
                                  handleDateChange(date, "date")
                                }
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                // maxDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                required
                              />
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                      </>
                    )}

           <div className="gap-col">
                      <ul className="d-flex align-items-center justify-content-center gap g-3">
                        <li>
                          <Button type="submit" variant="primary">
                            Update
                          </Button>
                        </li>
                        <li>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={clear}
                          >
                            Cancel
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
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

export default ReleaseBudgetDistrictEdit;
