import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/default";
import Block from "../../../components/Block/Block";
import { Icon } from "../../../components";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
// import axios from "axios";
import api from "../../../../src/services/auth/api";

const baseURLMasterData = process.env.REACT_APP_API_BASE_URL_MASTER_DATA;
const baseURLDBT = process.env.REACT_APP_API_BASE_URL_DBT;
const baseURLTargetSetting = process.env.REACT_APP_API_BASE_URL_TARGET_SETTING;

function BudgetDistrictExtension() {
  const [data, setData] = useState({
    financialYearMasterId: "",
    scHeadAccountId: "",
    districtId: "",
    tsBudgetDistrictId: "",
    date: "",
    budgetAmount: "",
    scSchemeDetailsId: "",
    scSubSchemeDetailsId: "",
    scCategoryId: "",
    institutionType: "",
    institutionId: "",
    districtImplementingOfficerId: "",
    scComponentId: "",
    scComponentTypeId: "",
    userDisbure: "",
  });

  const [type, setType] = useState({
    budgetType: "allocate",
  });

  const [designation, setDesignation] = useState({
    designationId: "",
  });

  const handleDesignationInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setDesignation({ ...data, [name]: value });
  };

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

  const [balanceAmount, setBalanceAmount] = useState(0);
  if (type.budgetType === "allocate") {
  if (data.financialYearMasterId && data.scHeadAccountId && data.districtId) {
    api
      .post(baseURLTargetSetting + `tsBudgetDistrictExt/get-available-balance`, {
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
  if (data.financialYearMasterId && data.scHeadAccountId && data.districtId) {
    api
      .post(baseURLTargetSetting + `tsBudgetReleaseDistrictExt/get-available-balance`, {
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


  const handleDateChange = (date, type) => {
    setData({ ...data, [type]: date });
  };
  
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
        .post(baseURLTargetSetting + `tsBudgetDistrictExt/add`, data)
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
          .post(baseURLTargetSetting + `tsBudgetReleaseDistrictExt/add`, data)
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

  // Get Default Financial Year

  const getFinancialDefaultDetails = () => {
    api
      .get(baseURLMasterData + `financialYearMaster/get-is-default`)
      .then((response) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: response.data.content.financialYearMasterId,
        }));
      })
      .catch((err) => {
        setData((prev) => ({
          ...prev,
          financialYearMasterId: "",
        }));
      });
  };

  useEffect(() => {
    getFinancialDefaultDetails();
  }, []);

  const clear = () => {
    setData({
      financialYearMasterId: "",
      scHeadAccountId: "",
      districtId: "",
      tsBudgetDistrictId: "",
      date: "",
      budgetAmount: "",
      scSchemeDetailsId: "",
      scSubSchemeDetailsId: "",
      scCategoryId: "",
      institutionType: "",
      institutionId: "",
      districtImplementingOfficerId: "",
    scComponentId: "",
    scComponentTypeId: "",
    userDisbure: "",
    });
    setType({
      budgetType: "allocate",
    });
    setValidated(false);
    setBalanceAmount(0);
  };

   // to get designation
   const [designationListData, setDesignationListData] = useState([]);

   const getDesignationList = () => {
     const response = api
       .get(baseURLMasterData + `designation/get-all`)
       .then((response) => {
         if (response.data.content.designation) {
           setDesignationListData(response.data.content.designation);
         }
       })
       .catch((err) => {
         setDesignationListData([]);
         // alert(err.response.data.errorMessages[0].message[0].message);
       });
   };
 
   useEffect(() => {
    getDesignationList();
   }, []);

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

  // to get Implementing Officer
  const [implementingOfficerListData, setImplementingOfficerListData] = useState([]);

  const getImplementingOfficerList = (designationId, districtId) => {
    api
      .post(baseURLMasterData + `userMaster/get-by-designationId-and-districtId`, {
        designationId: designationId,
        districtId: districtId,
      })
      .then((response) => {
        setImplementingOfficerListData(response.data.content.userMaster);
      })
      .catch((err) => {
        setImplementingOfficerListData([]);
      });
  };

  useEffect(() => {
    if (designation.designationId && data.districtId) {
      // getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
      getImplementingOfficerList(
        designation.designationId,
        data.districtId
      );
    }
  }, [designation.designationId, data.districtId]);

    // to get sc-scheme-details
    const [scSchemeDetailsListData, setScSchemeDetailsListData] = useState([]);

    const getList = () => {
      api
        .get(baseURLMasterData + `scSchemeDetails/get-all`)
        .then((response) => {
          setScSchemeDetailsListData(response.data.content.ScSchemeDetails);
        })
        .catch((err) => {
          setScSchemeDetailsListData([]);
        });
    };
  
    useEffect(() => {
      getList();
    }, []);
  
    // to get Financial Year
    const [financialyearListData, setFinancialyearListData] = useState([]);
  
    const getFinancialList = () => {
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
      getFinancialList();
    }, []);
  
    // to get sc-sub-scheme-details by sc-scheme-details
    const [scSubSchemeDetailsListData, setScSubSchemeDetailsListData] = useState(
      []
    );
    const getSubSchemeList = (_id) => {
      api
        .get(baseURLDBT + `master/cost/get-by-scheme-id/${_id}`)
        .then((response) => {
          if (response.data.content.unitCost) {
            setScSubSchemeDetailsListData(response.data.content.unitCost);
          } else {
            setScSubSchemeDetailsListData([]);
          }
        })
        .catch((err) => {
          setScSubSchemeDetailsListData([]);
          // alert(err.response.data.errorMessages[0].message[0].message);
        });
    };
  
    useEffect(() => {
      if (data.scSchemeDetailsId) {
        getSubSchemeList(data.scSchemeDetailsId);
        getSchemeQuotaList(data.scSchemeDetailsId);
      }
    }, [data.scSchemeDetailsId]);
  

  
    // to get head of account by sc-scheme-details
    const [scHeadAccountListData, setScHeadAccountListData] = useState([]);
    
    const getHeadAccountList = () => {
      api
        .get(baseURLMasterData + `scHeadAccount/get-all`)
        .then((response) => {
          if (response.data.content.scHeadAccount) {
            setScHeadAccountListData(response.data.content.scHeadAccount);
          }
        })
        .catch((err) => {
          setScHeadAccountListData([]);
          // alert(err.response.data.errorMessages[0].message[0].message);
        });
    };
  
    useEffect(() => {
      getHeadAccountList();
    }, []);
  
    // to get category by head of account id
    const [scCategoryListData, setScCategoryListData] = useState([]);
    
    const getCategoryList = () => {
      api
        .get(baseURLMasterData + `scCategory/get-all`)
        .then((response) => {
          if (response.data.content.scCategory) {
            setScCategoryListData(response.data.content.scCategory);
          }
        })
        .catch((err) => {
          setScCategoryListData([]);
          // alert(err.response.data.errorMessages[0].message[0].message);
        });
    };
  
    useEffect(() => {
      getCategoryList();
    }, []);
  
    
  
    // to get scheme-Quota-details
    const [schemeQuotaDetailsListData, setSchemeQuotaDetailsListData] = useState(
      []
    );
  
    const getSchemeQuotaList = (_id) => {
      api
        .get(baseURLMasterData + `schemeQuota/get-by-sc-scheme-details-id/${_id}`)
        .then((response) => {
          if (response.data.content.schemeQuota) {
            setSchemeQuotaDetailsListData(response.data.content.schemeQuota);
          } else {
            setSchemeQuotaDetailsListData([]);
          }
        })
        .catch((err) => {
          setSchemeQuotaDetailsListData([]);
        });
    };
  
    // to get component
    const [scComponentListData, setScComponentListData] = useState([]);
  
  
    const getComponentList = (schemeId, subSchemeId) => {
      api
        .post(baseURLDBT + `master/cost/get-by-schemeId-and-subSchemeId`, {
          schemeId: schemeId,
          subSchemeId: subSchemeId,
        })
        .then((response) => {
          setScComponentListData(response.data.content.unitCost);
        })
        .catch((err) => {
          setScComponentListData([]);
        });
    };
  
    const getHeadAccountbyschemeIdAndSubSchemeIdList = (
      schemeId,
      subSchemeId
    ) => {
      api
        .post(baseURLDBT + `master/cost/get-hoa-by-schemeId-and-subSchemeId`, {
          schemeId: schemeId,
          subSchemeId: subSchemeId,
        })
        .then((response) => {
          if (response.data.content.unitCost) {
            setScHeadAccountListData(response.data.content.unitCost);
          }
        })
        .catch((err) => {
          setScHeadAccountListData([]);
          // alert(err.response.data.errorMessages[0].message[0].message);
        });
    };
  
    useEffect(() => {
      if (data.scSchemeDetailsId && data.scSubSchemeDetailsId) {
        getComponentList(data.scSchemeDetailsId, data.scSubSchemeDetailsId);
        getHeadAccountbyschemeIdAndSubSchemeIdList(
          data.scSchemeDetailsId,
          data.scSubSchemeDetailsId
        );
      }
    }, [data.scSchemeDetailsId, data.scSubSchemeDetailsId]);


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
    <Layout title="Budget To District Mapping">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">
            Budget To District Mapping
            </Block.Title>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/budgetdistrictextension-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/budgetdistrictextension-list"
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
                    <Card.Header>
                      Budget To District Mapping
                    </Card.Header>
                    <Card.Body>
                      {/* <h3>Farmers Details</h3> */}
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
                              Designation
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="designationId"
                                value={designation.designationId}
                                onChange={handleDesignationInputs}
                                onBlur={() => handleDesignationInputs}
                                required
                                isInvalid={
                                  designation.designationId === undefined ||
                                  designation.designationId === "0"
                                }
                              >
                                <option value="">Select Designation</option>
                                {designationListData && designationListData.map((list) => (
                                  <option
                                    key={list.designationId}
                                    value={list.designationId}
                                  >
                                    {list.name}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                               Designation is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label>
                              District Implementing Officer
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="districtImplementingOfficerId"
                                value={data.districtImplementingOfficerId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                required
                                isInvalid={
                                  data.districtImplementingOfficerId === undefined ||
                                  data.districtImplementingOfficerId === "0"
                                }
                              >
                                <option value="">Select Implementing Officer</option>
                                {implementingOfficerListData &&implementingOfficerListData.map((list) => (
                                  <option
                                    key={list.userMasterId}
                                    value={list.userMasterId}
                                  >
                                    {list.username}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                              District Implementing Officer is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n4">
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
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Scheme
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSchemeDetailsId"
                                value={data.scSchemeDetailsId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSchemeDetailsId === undefined ||
                                  data.scSchemeDetailsId === "0"
                                }
                              >
                                <option value="">Select Scheme Names</option>
                                {scSchemeDetailsListData.map((list) => (
                                  <option
                                    key={list.scSchemeDetailsId}
                                    value={list.scSchemeDetailsId}
                                  >
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
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              Scheme Type
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scComponentTypeId"
                                value={data.scComponentTypeId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scComponentTypeId === undefined ||
                                  data.scComponentTypeId === "0"
                                }
                              >
                                <option value="">Select Scheme Quota </option>
                                {schemeQuotaDetailsListData.map((list) => (
                                  <option
                                    key={list.schemeQuotaId}
                                    value={list.schemeQuotaId}
                                  >
                                    {list.schemeQuotaName}
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
                          <Form.Group className="form-group mt-n3">
                            <Form.Label>
                              Component Type
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scSubSchemeDetailsId"
                                value={data.scSubSchemeDetailsId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required
                                isInvalid={
                                  data.scSubSchemeDetailsId === undefined ||
                                  data.scSubSchemeDetailsId === "0"
                                }
                              >
                                <option value="">Select Component Type</option>
                                {scSubSchemeDetailsListData &&
                                  scSubSchemeDetailsListData.map((list, i) => (
                                    <option key={i} value={list.subSchemeId}>
                                      {list.subSchemeName}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Component Type is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Component
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scComponentId"
                                value={data.scComponentId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                // required
                                isInvalid={
                                  data.scComponentId === undefined ||
                                  data.scComponentId === "0"
                                }
                              >
                                <option value="">Select Component</option>
                                {scComponentListData.map((list) => (
                                  <option
                                    key={list.scComponentId}
                                    value={list.scComponentId}
                                  >
                                    {list.scComponentName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Component is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Sub Component
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scCategoryId"
                                value={data.scCategoryId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                // required
                                isInvalid={
                                  data.scCategoryId === undefined ||
                                  data.scCategoryId === "0"
                                }
                              >
                                <option value="">Select Sub Component</option>
                                {scCategoryListData.map((list) => (
                                  <option
                                    key={list.scCategoryId}
                                    value={list.scCategoryId}
                                  >
                                    {list.codeNumber}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Category is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group mt-n3">
                            <Form.Label htmlFor="sordfl">
                              Head of Account
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Select
                                name="scHeadAccountId"
                                value={data.scHeadAccountId}
                                onChange={handleInputs}
                                onBlur={() => handleInputs}
                                // multiple
                                required 
                                isInvalid={
                                  data.scHeadAccountId === undefined ||
                                  data.scHeadAccountId === "0"
                                }
                              >
                                <option value="">Select Head of Account</option>
                                {scHeadAccountListData.map((list) => (
                                  <option
                                    key={list.headOfAccountId}
                                    value={list.headOfAccountId}
                                  >
                                    {list.scHeadAccountName}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                Head of Account is required
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                    <Form.Group className="form-group mt-n4">
                      <Form.Label>
                        Use/Disperse
                      </Form.Label>
                      <div className="form-control-wrap">
                        <Form.Select
                          name="userDisbure"
                          value={data.userDisbure}
                          onChange={handleInputs}
                          onBlur={() => handleInputs}
                          // required
                          isInvalid={
                            data.userDisbure === undefined || data.userDisbure === "0"
                          }
                        >
                          <option value="0">Select Use/Disperse</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                          
                        </Form.Select>
                        {/* <Form.Control.Feedback type="invalid">
                        Scheme Quota Type is required
                        </Form.Control.Feedback> */}
                      </div>
                    </Form.Group>
                  </Col>

                        <Col lg="2">
                          <Form.Group className="form-group mt-n4">
                            <Form.Label htmlFor="sordfl"> Date</Form.Label>
                            <div className="form-control-wrap">
                              <DatePicker
                                selected={data.date}
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
                            </div>
                          </Form.Group>
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

export default BudgetDistrictExtension;
