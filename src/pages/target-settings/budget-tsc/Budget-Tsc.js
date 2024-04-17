import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import api from "../../../../src/services/auth/api";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;

function BudgetTsc() {
  const [data, setData] = useState({
    financialYearMasterId: "",
    hoaId: "",
    districtId: "",
    talukId: "",
    date: "",
    budgetAmount: "",
    institutionType: "",
    institutionId: "",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };
  // const _header = { "Content-Type": "application/json", accept: "*/*" };
  // const _header = { "Content-Type": "application/json", accept: "*/*",  'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`, "Access-Control-Allow-Origin": "*"};
  const _header = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  };

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
        .post(baseURL + `tsBudgetTsc/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
            setData({
              financialYearMasterId: "",
              hoaId: "",
              districtId: "",
              talukId: "",
              date: "",
              budgetAmount: "",
              tscMasterId: "",
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
      financialYearMasterId: "",
      hoaId: "",
      districtId: "",
      talukId: "",
      date: "",
      budgetAmount: "",
      institutionType: "",
      institutionId: "",
    });
  };

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

  // to get TSC
  const [tscListData, setTscListData] = useState([]);

  const getTscList = () => {
    const response = api
      .get(baseURL + `tscMaster/get-all`)
      .then((response) => {
        setTalukListData(response.data.content.tscMaster);
      })
      .catch((err) => {
        setTalukListData([]);
      });
  };

  useEffect(() => {
    getTscList();
  }, []);

  // to get Market
  const [marketListData, setMarketListData] = useState([]);

  const getList = () => {
    const response = api
      .get(baseURL + `marketMaster/get-all`)
      .then((response) => {
        setMarketListData(response.data.content.marketMaster);
      })
      .catch((err) => {
        setMarketListData([]);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const navigate = useNavigate();
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
  return (
    <Layout title="Budget To Tsc">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Budget To Tsc</Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/budget-tsc-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/budget-tsc-list"
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
        {/* <Form action="#"> */}
        <Form noValidate validated={validated} onSubmit={postData}>
          <Card>
            <Card.Header style={{ fontWeight: "bold" }}>
              Taluk Budget
            </Card.Header>
            <Card.Body>
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

                {/* <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Target Type<span className="text-danger">*</span>
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
                        <option value="1">Financial</option>
                        <option value="2">Physical</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Target Type is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col> */}

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Head Of Account<span className="text-danger">*</span>
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
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      District<span className="text-danger">*</span>
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
                          <option key={list.districtId} value={list.districtId}>
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
                      Taluk<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="talukId"
                        value={data.talukId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.talukId === undefined || data.talukId === "0"
                        }
                      >
                        <option value="">Select Taluk</option>
                        {talukListData.map((list) => (
                          <option key={list.talukId} value={list.talukId}>
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
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      Institution Type<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="institutionType"
                        value={data.institutionType}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.institutionType === undefined ||
                          data.institutionType === "0"
                        }
                      >
                        <option value="">Select Institution Type</option>
                        <option value="1">TSC</option>
                        <option value="2">Market</option>
                        <option value="3">Farm</option>
                        <option value="4">Grainage</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Institution Type is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      TSC<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="tscMasterId"
                        value={data.tscMasterId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.tscMasterId === undefined ||
                          data.tscMasterId === "0"
                        }
                      >
                        <option value="">Select Tsc</option>
                        {tscListData.map((list) => (
                          <option
                            key={list.tscMasterId}
                            value={list.tscMasterId}
                          >
                            {list.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        TSC is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group">
                    <Form.Label>
                      Market<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="marketMasterId"
                        value={data.marketMasterId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.marketMasterId === undefined ||
                          data.marketMasterId === "0"
                        }
                      >
                        <option value="">Select Market</option>
                        {marketListData.map((list) => (
                          <option
                            key={list.marketMasterId}
                            value={list.marketMasterId}
                          >
                            {list.marketMasterName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Market Name is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      TSC<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="tscMasterId"
                        value={data.tscMasterId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.tscMasterId === undefined ||
                          data.tscMasterId === "0"
                        }
                      >
                        <option value="">Select Tsc</option>
                        {tscListData.map((list) => (
                          <option
                            key={list.tscMasterId}
                            value={list.tscMasterId}
                          >
                            {list.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        TSC is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg="6">
                  <Form.Group className="form-group mt-n4">
                    <Form.Label>
                      TSC<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="form-control-wrap">
                      <Form.Select
                        name="tscMasterId"
                        value={data.tscMasterId}
                        onChange={handleInputs}
                        onBlur={() => handleInputs}
                        required
                        isInvalid={
                          data.tscMasterId === undefined ||
                          data.tscMasterId === "0"
                        }
                      >
                        <option value="">Select Tsc</option>
                        {tscListData.map((list) => (
                          <option
                            key={list.tscMasterId}
                            value={list.tscMasterId}
                          >
                            {list.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        TSC is required
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
                    <Form.Label>Date</Form.Label>
                    <div className="form-control-wrap">
                      <DatePicker
                        selected={data.date}
                        onChange={(date) => handleDateChange(date, "date")}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        required
                      />
                    </div>
                  </Form.Group>
                  <Form.Control.Feedback type="invalid">
                    Date is Required
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="gap-col">
            <ul className="d-flex align-items-center justify-content-center gap g-3">
              <li>
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
        </Form>
      </Block>
    </Layout>
  );
}

export default BudgetTsc;
