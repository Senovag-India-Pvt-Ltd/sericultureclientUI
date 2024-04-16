import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Icon } from "../../../components";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function PhysicalTargetSettingsDistrictEdit() {
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
        .post(baseURL + `tsPhysicalTargetSettingDistrict/edit`, data)
        .then((response) => {
          if (response.data.content.error) {
            updateError(response.data.content.error_description);
          } else {
            updateSuccess();
            setData({
              financialYearMasterId: "",
              hoaId: "",
              date: "",
              budgetAmount: "",
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

  // Function to clear form data
  const clear = () => {
    setData({
      financialYearMasterId: "",
      hoaId: "",
      date: "",
      budgetAmount: "",
    });
  };

  const isDataDateSet = !!data.date;

  const getIdList = () => {
    setLoading(true);
    const response = api
      .get(baseURL + `tsPhysicalTargetSettingDistrict/get/${id}`)
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
        // editError(message);
        setData({});
        setLoading(false);
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    getIdList();
  }, [id]);

  // to get Financial Year
  const [financialYearListData, setFinancialYearListData] = useState([]);

  const getFinancialYearList = () => {
    const response = api
      .get(baseURL + `physicaltargetsettingdistrict/get-all`)
      .then((response) => {
        setFinancialYearListData(
          response.data.content.physicaltargetsettingdistrict
        );
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

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

  return (
    <Layout title="Edit Physical Target Setting District">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Edit Physical Target Setting District
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/physicaltargetsettingdistrict-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/physicaltargetsettingdistrict-list"
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
          <Row className="g-3 ">
            <Card>
              <Card.Header style={{ fontWeight: "bold" }}>
                Physical Target Setting District
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
                            <option value="">Select Financial Year</option>
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

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Head Of Account<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="hoaId"
                            value={data.hoaId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.hoaId === undefined || data.hoaId === "0"
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
                      <Form.Group className="form-group mt-n4 ">
                        <Form.Label htmlFor="title">
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

                    <Col lg="4">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Date<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          {isDataDateSet && (
                            <DatePicker
                              selected={data.date}
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
      </Block>
    </Layout>
  );
}

export default PhysicalTargetSettingsDistrictEdit;
