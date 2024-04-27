import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
// import axios from "axios";
import api from "../../../../src/services/auth/api";
import DatePicker from "react-datepicker";
import { date } from "react-i18next/icu.macro";

const baseURL = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function BudgetTalukExtension() {
  const [data, setData] = useState({
      financialYearMasterId: "",
      tsBudgetTalukId: "",
      scHeadAccountId: "",
      districtId: "",
      talukId: "",
      date: "",
      budgetAmount: "",
      scSchemeDetailsId: "",
      scSubSchemeDetailsId: "",
      scCategoryId: "",
      institutionType: "",
      institutionId: "",
  });

  const [type, setType] = useState({
    budgetType: "allocate",
  });

  const [validated, setValidated] = useState(false);

  let name, value;
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
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
        baseURLTargetSetting + `tsReleaseBudgetTalukExt/get-available-balance`,
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
      if (type.budgetType === "allocate") {
      api
        .post(baseURL + `tsBudgetTalukExt/add`, data)
        .then((response) => {
          if (response.data.content.error) {
            saveError(response.data.content.error_description);
          } else {
            saveSuccess();
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
              saveError(err.response.data.validationErrors);
            }
          }
        });
      }
      if (type.budgetType === "release") {
        api
          .post(baseURLTargetSetting + `tsBudgetTalukExt/add`, data)
          .then((response) => {
            if (response.data.content.error) {
              saveError(response.data.content.error_description);
            } else {
              saveSuccess();
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
                saveError(err.response.data.validationErrors);
              }
            }
          });
      }

      setValidated(true);
    }
  };


  const clear = () => {
    setData({
      financialYearMasterId: "",
      tsBudgetTalukId: "",
      scHeadAccountId: "",
      districtId: "",
      talukId: "",
      date: "",
      budgetAmount: "",
      scSchemeDetailsId: "",
      scSubSchemeDetailsId: "",
      scCategoryId: "",
      institutionType: "",
      institutionId: "",
    });
    setType({
      budgetType: "allocate",
    });
    setValidated(false);
    setBalanceAmount(0);
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

   // to get get Scheme
   const [schemeListData, setSchemeListData] = useState([]);

   const getSchemeList = () => {
     const response = api
       .get(baseURL + `scSchemeDetails/get-all`)
       .then((response) => {
         setSchemeListData(response.data.content.scSchemeDetails);
       })
       .catch((err) => {
        setSchemeListData([]);
       });
   };
 
   useEffect(() => {
     getSchemeList();
   }, []);

   // to get Sub Scheme
   const [subSchemeListData, setSubSchemeListData] = useState([]);

   const getSubSchemeList = () => {
     const response = api
       .get(baseURL + `scSubSchemeDetails/get-all`)
       .then((response) => {
         setSubSchemeListData(response.data.content.scSubSchemeDetails);
       })
       .catch((err) => {
        setSubSchemeListData([]);
       });
   };
 
   useEffect(() => {
     getSubSchemeList();
   }, []);

   // to get Category
   const [categoryListData, setCategoryListData] = useState([]);

   const getCategoryList = () => {
     const response = api
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
    <Layout title="Taluk  Budget mapping scheme and programs">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Taluk Budget mapping 
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/budgettalukextension-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/budgettalukextension-list"
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
        <Row>
          <Col lg="8">
            <Form noValidate validated={validated} onSubmit={postData}>
              <Card>
                <Card.Header style={{ fontWeight: "bold" }}>
                  Taluk Budget mapping 
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
                          Select District<span className="text-danger">*</span>
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
                          Select Taluk<span className="text-danger">*</span>
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

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Select Scheme
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scSchemeDetailsId"
                            value={data.scSchemeDetailsId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scSchemeDetailsId === undefined ||
                              data.scSchemeDetailsId === "0"
                            }
                          >
                            <option value="">Select Scheme</option>
                            {schemeListData && schemeListData.map((list) => (
                              <option key={list.scSchemeDetailsId} value={list.scSchemeDetailsId}>
                                {list.schemeName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Scheme is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Select Sub Scheme
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scSubSchemeDetailsId"
                            value={data.scSubSchemeDetailsId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scSubSchemeDetailsId === undefined ||
                              data.scSubSchemeDetailsId === "0"
                            }
                          >
                            <option value="">Select Sub Scheme</option>
                            {subSchemeListData && subSchemeListData.map((list) => (
                              <option
                                key={list.scSubSchemeDetailsId}
                                value={list.scSubSchemeDetailsId}
                              >
                                {list.subSchemeName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Sub Scheme is required
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg="6">
                      <Form.Group className="form-group mt-n4">
                        <Form.Label>
                          Select Category
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="form-control-wrap">
                          <Form.Select
                            name="scCategoryId"
                            value={data.scCategoryId}
                            onChange={handleInputs}
                            onBlur={() => handleInputs}
                            required
                            isInvalid={
                              data.scCategoryId === undefined ||
                              data.scCategoryId === "0"
                            }
                          >
                            <option value="">Select Category</option>
                            {categoryListData && categoryListData.map((list) => (
                              <option key={list.scCategoryId} value={list.scCategoryId}>
                                {list.categoryName}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Category is required
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
              {/* </Row> */}
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

export default BudgetTalukExtension;
