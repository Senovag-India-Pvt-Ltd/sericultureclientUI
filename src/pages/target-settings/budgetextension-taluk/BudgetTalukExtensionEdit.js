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

function BudgetTalukExtensionEdit() {
  // Fetching id from URL params
  const { id,types} = useParams();
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
  if (data.financialYearMasterId && data.scHeadAccountId) {
    api
      .post(baseURLTargetSetting + `tsBudgetTalukExt/get-available-balance`, {
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
        baseURLTargetSetting + `tsBudgetReleaseTalukExt/get-available-balance`,
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
        .post(baseURLTargetSetting + `tsBudgetTalukExt/edit`, data)
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
        .post(baseURLTargetSetting + `tsBudgetReleaseTalukExt/edit`, data)
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

   // to get Taluk
   const [talukListData, setTalukListData] = useState([]);

   const getTalukList = () => {
     const response = api
       .get(baseURLMasterData + `taluk/get-all`)
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
       .get(baseURLMasterData + `scSchemeDetails/get-all`)
       .then((response) => {
         setSchemeListData(response.data.content.ScSchemeDetails);
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
       .get(baseURLMasterData + `scSubSchemeDetails/get-all`)
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
       .get(baseURLMasterData + `scCategory/get-all`)
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

  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };

  const isData = !!data.date;

  const getIdList = () => {
    setLoading(true);
    if (type.budgetType === "allocate") {
      api
        .get(baseURLTargetSetting + `tsBudgetTalukExt/get/${id}`)
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
        .get(baseURLTargetSetting + `tsReleaseBudgetTalukExt/get/${id}`)
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

  // Navigation hook
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
    <Layout title="Edit Taluk Budget mapping ">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
              Edit Taluk Budget mapping 
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
        <Row>
          <Col lg="8">
            <Form noValidate validated={validated} onSubmit={postData}>
              <Row className="g-3 ">
                <Block>
                  <Card>
                    <Card.Header>
                      Edit Taluk Budget mapping
                    </Card.Header>
                    <Card.Body>
                      {loading ? (
                        <h1 className="d-flex justify-content-center align-items-center">
                          Loading...
                        </h1>
                      ) : (
                        <Row className="g-gs">
                          <Col lg="6">
                            <Form.Group className="form-group mt-n3">
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
                            <Form.Group className="form-group mt-n3">
                              <Form.Label htmlFor="budgetAmount">
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
                                    maxDate={new Date()}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    required
                                  />
                                )}
                              </div>
                            </Form.Group>
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

export default BudgetTalukExtensionEdit;
